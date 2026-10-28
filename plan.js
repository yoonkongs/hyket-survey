/* One participant's plan: which missions, in which order, with which amounts, and the exact wording
 * of the benefit cards. Pure functions (no DOM): the browser (app.js) and the tests (pipeline/tests,
 * run with node) use this same file. Everything is seeded by the participant id.
 *
 * 32 missions (design PDF p.47): 6 sets (A1..C2) x [1 shopping + 4 cart] = 30 benefit checkouts,
 * + 1 general checkout (일시불/할부) + 1 attention check (할인 1,000원 vs 적립 100원).
 * Each set holds every 적립 level once; the 6 shopping missions cover each level once plus one more.
 * The order is scattered; the attention check lands inside config.attention_range. */
(function (root) {
  "use strict";

  // seeded random numbers, so a participant's plan can be re-created from their id
  function seededRng(seedText) {
    var h = 1779033703 ^ seedText.length;
    for (var i = 0; i < seedText.length; i++) {
      h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      var t = (h ^= h >>> 16) >>> 0;
      return t / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function won(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; }
  function tpl(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  function josa(word, a, b) {
    var ch = String(word).trim().slice(-1);
    if (ch >= "가" && ch <= "힣") return (ch.charCodeAt(0) - 0xac00) % 28 ? a : b;
    return b;
  }

  // ---------- wording shared by screen and (later) prompt ----------
  // bump when the assignment algorithm changes (saved in participants.plan_version): "2" = 32 missions, sets A1..C2 (M2/M3)
  var PLAN_VERSION = "2";
  var CART_MISSION = "장바구니에 담아 둔 상품을 결제합니다";
  function missionText(itemName) {
    return itemName + josa(itemName, "을", "를") + " 검색해서 마음에 드는 상품 1개를 골라 바로 결제해 주세요.";
  }
  function budgetText(C) { return "이번 장보기 예산 " + won(C.shopping_budget); }

  // the two benefit cards in on-screen order (side "left" = 할인 first). Texts come from config.benefit_text.
  function benefitOptions(C, price, discount, cash, side, condition, isExtra) {
    var T = C.benefit_text;
    var d = { type: "discount", amount: discount, title: tpl(T.discount, { discount: won(discount) }), note: null,
      condition: null, pay_amount: price - discount, pay_text: tpl(T.discount_pay, { pay: won(price - discount) }) };
    var c = { type: "cash", amount: cash, title: tpl(T.cash, { cash_name: C.cash_name, cash: won(cash) }),
      note: tpl(T.cash_note, { store_name: C.store_name }), condition: condition || null, pay_amount: price,
      pay_text: tpl(isExtra ? T.cash_pay_extra : T.cash_pay, { pay: won(price) }) };
    return side === "left" ? [d, c] : [c, d];
  }
  // 일시불 / 할부, no benefit (side "left" = 일시불 first)
  function generalOptions(C, price, side) {
    var T = C.general_text, months = C.general_months;
    var lump = { type: "lump", amount: 0, title: T.lump, note: null, condition: null, pay_amount: price,
      pay_text: tpl(T.lump_pay, { pay: won(price) }) };
    var inst = { type: "installment", amount: 0, title: tpl(T.installment, { months: months }), note: null,
      condition: null, pay_amount: price,
      pay_text: tpl(T.installment_pay, { monthly: won(price / months), months: months, pay: won(price) }) };
    return side === "left" ? [lump, inst] : [inst, lump];
  }
  function commas(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  // the words and numbers of one product exactly as the participant reads them (icons / photos are not text)
  function productText(p) {
    var rate = p.list_price > p.price ? Math.round((1 - p.price / p.list_price) * 100) : 0;
    return { title: p.brand + " " + p.name, list: rate ? won(p.list_price) : "", rate: rate ? rate + "%" : "",
      price: won(p.price), unit: p.unit_price || "", delivery_badge: "빠른배송", delivery: p.delivery,
      rating: p.rating.toFixed(1) + " (" + commas(p.review_count) + ")" };
  }
  function productView(p) {
    return { product_id: p.product_id, brand: p.brand, name: p.name, list_price: p.list_price, price: p.price,
      unit_price: p.unit_price, rating: p.rating, review_count: p.review_count, delivery: p.delivery,
      default_rank: p.default_rank, text: productText(p) };
  }
  // the heading and the two cards of a checkout screen (kind: shopping / cart / attention / general / extra)
  function cardsFor(C, kind, price, discount, cash, side, condition, isExtra) {
    if (kind === "general") return { heading: C.general_text.heading, options: generalOptions(C, price, side) };
    return { heading: C.benefit_text.heading, options: benefitOptions(C, price, discount, cash, side, condition, isExtra) };
  }
  // the checkout screen of a shopping / cart entry x for the product view `view` (shopping: the one the participant picked)
  function checkoutSpec(C, x, view) {
    var base = x.screen, c = cardsFor(C, base.kind, view.price, x.discount, x.cash_amount, x.discount_side, "", false);
    return { kind: base.kind, tag: base.tag, budget: base.budget, order: null, product: view,
      heading: c.heading, options: c.options };
  }

  // ---------- ordering ----------
  // 적립 for the shopping missions: every level once, in random order, then one more level drawn at random
  function shoppingCash(n, levels, rnd) {
    var out = shuffle(levels, rnd);
    while (out.length < n) out.push(levels[Math.floor(rnd() * levels.length)]);
    return out.slice(0, n);
  }
  // rules for the scattered order: no two shopping missions in a row, no set 3 times in a row
  function orderOk(seq) {
    for (var i = 1; i < seq.length; i++) {
      if (seq[i].type === "shopping" && seq[i - 1].type === "shopping") return false;
      if (i >= 2 && seq[i].set_no && seq[i].set_no === seq[i - 1].set_no && seq[i].set_no === seq[i - 2].set_no) return false;
    }
    return true;
  }
  function orderMissions(missions, attention, rnd, C) {
    var n = missions.length + 1, lo = C.attention_range[0], hi = Math.min(C.attention_range[1], n), seq;
    for (var tries = 0; tries < 1000; tries++) {
      seq = shuffle(missions, rnd);
      seq.splice(lo - 1 + Math.floor(rnd() * (hi - lo + 1)), 0, attention);   // attention check at place lo..hi (1-based)
      if (orderOk(seq)) return seq;
    }
    return seq;
  }

  // ---------- the plan ----------
  function makePlan(pid, C, products) {
    var rnd = seededRng(pid), levels = C.cash_levels, k = C.search_results_shown;
    var byId = {};
    products.forEach(function (p) { byId[p.product_id] = p; });
    var search = products.filter(function (p) { return p.role === "search" && p.searchable; });
    var setCodes = [];
    search.forEach(function (p) { if (setCodes.indexOf(p.set_code) < 0) setCodes.push(p.set_code); });
    setCodes.sort();

    // 6 sets, each: 1 shopping (its 적립 level) + 4 cart products with the 4 remaining levels in random order
    var shopCash = shuffle(shoppingCash(setCodes.length, levels, rnd), rnd);
    var missions = [];
    setCodes.forEach(function (sc, si) {
      var pool = search.filter(function (p) { return p.set_code === sc; });
      var carts = products.filter(function (p) { return p.role === "cart" && p.set_code === sc; });
      var rest = shuffle(levels.filter(function (l) { return l !== shopCash[si]; }), rnd);
      missions.push({ type: "shopping", set_code: sc, set_no: si + 1, item_key: pool[0].item_key, cash_amount: shopCash[si] });
      carts.forEach(function (p, j) {
        missions.push({ type: "cart", set_code: sc, set_no: si + 1, product_id: p.product_id, cash_amount: rest[j] });
      });
    });
    var general = products.filter(function (p) { return p.role === "general"; })[0];
    var attention = products.filter(function (p) { return p.role === "attention"; })[0];
    missions.push({ type: "general", product_id: general.product_id, cash_amount: 0 });
    var seq = orderMissions(missions, { type: "attention", product_id: attention.product_id, cash_amount: C.attention_cash }, rnd, C);

    // 할인 card first in half of the shopping and half of the cart missions (general / attention: coin flip)
    var sides = {};
    ["shopping", "cart"].forEach(function (type) {
      var n = seq.filter(function (m) { return m.type === type; }).length, list = [];
      for (var i = 0; i < n; i++) list.push(i % 2 ? "left" : "right");
      sides[type] = shuffle(list, rnd);
    });

    var shopping = [], cart = [], trials = [], phaseCount = {}, budget = budgetText(C);
    seq.forEach(function (m, i) {
      var orderNo = i + 1, tag = "미션 " + orderNo + " / " + seq.length;
      var side = sides[m.type] ? sides[m.type].pop() : (rnd() < 0.5 ? "left" : "right");
      if (m.type === "shopping") {
        var pool = search.filter(function (p) { return p.item_key === m.item_key; })
          .sort(function (a, b) { return a.default_rank - b.default_rank; }).slice(0, k);
        var shown = shuffle(pool, rnd);   // result order differs per participant; default_rank is saved with it
        var e = { trial_no: shopping.length + 1, order_no: orderNo, set_no: m.set_no, set_code: m.set_code,
          item_key: m.item_key, item_name: pool[0].item_name, aliases: pool[0].aliases, category: pool[0].category,
          product_ids: shown.map(function (p) { return p.product_id; }),
          default_ranks: shown.map(function (p) { return p.default_rank; }),
          cash_amount: m.cash_amount, discount: C.discount, discount_side: side,
          card_first: side === "left" ? "discount" : "cash" };
        e.screen = { kind: "shopping", tag: tag + " · 쇼핑", mission: missionText(e.item_name), budget: budget,
          search: { item_key: m.item_key, results: shown.map(function (p, j) {
            return { position: j + 1, product_id: p.product_id, default_rank: p.default_rank, product: productView(p) }; }) },
          card_order: side === "left" ? ["discount", "cash"] : ["cash", "discount"],
          discount: C.discount, cash: m.cash_amount,
          note: "the checkout screen after the pick = checkoutSpec(entry, picked product); saved in checkouts.screen_json" };
        shopping.push(e);
        trials.push({ type: "shopping", idx: shopping.length - 1 });
      } else {
        var p = byId[m.product_id], isGeneral = m.type === "general";
        phaseCount[m.type] = (phaseCount[m.type] || 0) + 1;
        var discount = isGeneral ? 0 : C.discount;
        var cards = cardsFor(C, m.type, p.price, discount, m.cash_amount, side, "", false), opts = cards.options;
        // general / attention look like any cart checkout: same tag and same mission wording
        cart.push({ kind: m.type, position: cart.length + 1, phase_no: phaseCount[m.type], order_no: orderNo,
          set_no: m.set_no || null, set_code: m.set_code || null, product_id: p.product_id, category: p.category,
          cash_amount: m.cash_amount, discount: discount, discount_side: side, card_first: opts[0].type,
          screen: { kind: m.type, tag: tag + " · 장바구니", mission: CART_MISSION, budget: budget, order: null,
            product: productView(p), heading: cards.heading, options: opts } });
        trials.push({ type: m.type, idx: cart.length - 1 });
      }
    });

    var extras = shuffle(C.extra_questions, rnd).map(function (q, i) {
      var side = rnd() < 0.5 ? "left" : "right", k = i + 1;
      var cards = cardsFor(C, "extra", q.order_amount, q.discount_amount, q.cash_amount, side, q.cash_condition, true);
      return { trial_no: k, order_no: seq.length + k, question_id: q.question_id, discount_side: side,
        discount: q.discount_amount, cash_amount: q.cash_amount, price: q.order_amount, condition: q.cash_condition || "",
        card_first: side === "left" ? "discount" : "cash",
        screen: { kind: "extra", question_id: q.question_id, tag: "추가 결제 " + k + " / " + C.extra_questions.length, mission: null, budget: null,
          order: "추가 결제 상황 " + k + " · 주문 금액 " + won(q.order_amount), product: null,
          heading: cards.heading, options: cards.options } };
    });
    return { shopping: shopping, cart: cart, extras: extras, trials: trials };
  }

  var api = { version: PLAN_VERSION, seededRng: seededRng, shuffle: shuffle, won: won, tpl: tpl, josa: josa, missionText: missionText,
    budgetText: budgetText, benefitOptions: benefitOptions, generalOptions: generalOptions,
    productView: productView, productText: productText, cardsFor: cardsFor, checkoutSpec: checkoutSpec, makePlan: makePlan };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.SIMPLAN = api;
})(typeof window !== "undefined" ? window : this);
