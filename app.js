/* Experiment survey + simulated online mall. Plain JS, no build step.
 *
 * Flow: 01 동의 -> 02 나에 대해 -> 03 장보기 쪽지 -> 04 결제 성향 -> 05 취향 점수 ->
 *       06 장보기 (shopping missions, with a picture check after every 2) ->
 *       장바구니 결제 (cart) -> 추가 결제 상황 (extra) -> 끝.
 *
 * Answers are INSERTed into Supabase tables (db/schema.sql) through its REST API.
 * Inserts are queued in localStorage and retried, so a flaky connection loses nothing.
 * Randomisation is seeded by the participant id, and everything shown is saved. */
(function () {
  "use strict";

  var SIM = window.SIM;
  var C = SIM.config, S = SIM.survey;
  var PRODUCTS = {};
  SIM.products.forEach(function (p) { PRODUCTS[p.product_id] = p; });
  var STORE = C.store_name, CASH = C.cash_name;
  var app = document.getElementById("app");
  // no Supabase URL: save to the server that sent the page (build.py --serve, opened by localhost,
  // the laptop's IP or a tunnel); GitHub Pages has no such server, so answers can't be saved there
  var isPages = /\.github\.io$/.test(location.hostname);
  var DB_URL = C.supabase_url ? C.supabase_url.replace(/\/+$/, "").replace(/\/rest\/v1$/, "") : (isPages ? null : "");   // also accepts the address copied with /rest/v1/
  var ICONS = { water: "💧", bodywash: "🧴", nuts: "🥜", cereal: "🥣", tumbler: "🥤", powerstrip: "🔌",
    detergent: "🧺", tissue: "🧻", ramen: "🍜", coffee: "☕", battery: "🔋" };
  var COLORS = ["#4f7cff", "#3aa66b", "#e2873a", "#9b6bd6", "#2fa3b5", "#d65b5b", "#c9a227", "#5b6b8c"];

  // ---------- small helpers ----------
  function won(n) { return Number(n).toLocaleString("ko-KR") + "원"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nowIso() { return new Date().toISOString(); }
  function ms() { return Math.round(performance.now()); }
  function $(sel) { return app.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(app.querySelectorAll(sel)); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function josa(word, a, b) {
    var ch = String(word).trim().slice(-1);
    if (ch >= "가" && ch <= "힣") return (ch.charCodeAt(0) - 0xac00) % 28 ? a : b;
    return b;
  }
  // {{time_1st}} {{time_2nd}} and the consent blanks come from config.json; an empty one stays visible as a reminder
  function fill(s) {
    var blanks = C.consent_blanks || {};
    return String(s).replace(/\{\{(\w+)\}\}/g, function (m, k) {
      var v = k === "time_1st" ? C.time_text_1st : (k === "time_2nd" ? C.time_text_2nd : (k === "followup_when" ? C.followup_when : blanks[k]));
      return v || "［입력 필요］";
    });
  }
  function norm(s) { return String(s).toLowerCase().replace(/\s+/g, ""); }
  function stars(r) { var f = Math.round(r); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "p-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function shortId(pid) { return pid.replace(/-/g, "").slice(0, 6).toUpperCase(); }
  // spec = the screen spec this page was drawn from (kept in window.SIM_SPEC so the test can compare screen and spec)
  function render(html, spec) { app.innerHTML = '<div id="screen">' + html + "</div>"; window.SIM_SPEC = spec || null; window.scrollTo(0, 0); }
  function screenEl() { return document.getElementById("screen"); }

  // seeding, shuffling, the plan and the benefit-card wording live in plan.js (also run by the tests)
  var PLAN = window.SIMPLAN, seededRng = PLAN.seededRng, shuffle = PLAN.shuffle;

  // ---------- saving to the database ----------
  var QKEY = "sim_queue";
  var queue = store(QKEY) || [];
  var flushing = false, flushTimer = null;
  var SAVE = { sent: 0, stuck: false, last: "" };   // what the saving did; shown on the end screen and in the ?debug=1 panel
  if (new URLSearchParams(location.search).get("debug")) {
    // team check (?debug=1): a small black box at the bottom that says whether answers reach the database
    var dbox = document.createElement("div");
    dbox.style.cssText = "position:fixed;left:0;bottom:0;z-index:99999;background:#111;color:#7CFC7C;font:12px/1.4 monospace;padding:6px 8px;max-width:100%;white-space:pre-wrap";
    document.body.appendChild(dbox);
    setInterval(function () {
      dbox.textContent = "저장 진단 · 주소: " + (DB_URL === null ? "(비어 있음: 저장 안 함)" : DB_URL || "(이 사이트 자신)") +
        "\n보냄 " + SAVE.sent + " · 대기 " + queue.length + " · 따로 둔 실패 " + (store("sim_failed") || []).length + (SAVE.stuck ? " · 막힘" : "") +
        "\n마지막: " + (SAVE.last || "(아직 없음)");
    }, 500);
  }

  function save(table, rows) {
    queue.push({ table: table, rows: Array.isArray(rows) ? rows : [rows] });
    store(QKEY, queue);
    scheduleFlush(300);
  }
  function scheduleFlush(delay) {
    if (!flushTimer) flushTimer = setTimeout(function () { flushTimer = null; flush(); }, delay);
  }
  function flush() {
    if (flushing || !queue.length || DB_URL === null) return;
    flushing = true;
    // send every queued row for the oldest item's table in one request; participants rows always go
    // first, because every other table points to them (e.g. a leftover row from before a restart)
    var table = queue.some(function (q) { return q.table === "participants"; }) ? "participants" : queue[0].table, batch = queue.filter(function (q) { return q.table === table; }).slice(0, 50);
    var item = { table: table, rows: [].concat.apply([], batch.map(function (q) { return q.rows; })) };
    // a plain insert: "resolution=ignore-duplicates" (ON CONFLICT DO NOTHING) makes Supabase ask for a SELECT permission,
    // which anon must not have (it would expose answers), and every insert came back 401 "violates row-level security".
    // A row sent twice (the participants row on every page load) now comes back 409, which counts as saved below.
    var headers = { "Content-Type": "application/json", "Prefer": "return=minimal" };
    if (C.supabase_anon_key) {
      headers.apikey = C.supabase_anon_key;
      headers.Authorization = "Bearer " + C.supabase_anon_key;
    }
    fetch(DB_URL + "/rest/v1/" + item.table, {
      method: "POST", headers: headers, body: JSON.stringify(item.rows), keepalive: true
    }).then(function (r) {
      flushing = false;
      if (r.ok || r.status === 409) {
        SAVE.sent += 1; SAVE.stuck = false; SAVE.last = "OK " + item.table;
        queue = queue.filter(function (q) { return batch.indexOf(q) < 0; });
        store(QKEY, queue);
        if (queue.length) scheduleFlush(50);
        return;
      }
      return r.text().then(function (t) {
        SAVE.last = item.table + " -> " + r.status + " " + String(t).slice(0, 160);
        console.error("insert into " + item.table + " failed", r.status, t);
        if (r.status === 401 || r.status === 403 || r.status === 404 || r.status === 408 || r.status === 429 || r.status >= 500) {
          // not a problem of this row (key, permission, address, server busy): keep it and try again later, never throw it away
          SAVE.stuck = true;
          scheduleFlush(15000);
          return;
        }
        // a rejected row (bad data) would block the queue forever: set it aside and move on
        var failed = store("sim_failed") || [];
        failed.push({ item: item, status: r.status });
        store("sim_failed", failed);
        queue = queue.filter(function (q) { return batch.indexOf(q) < 0; });
        store(QKEY, queue);
        if (queue.length) scheduleFlush(50);
      });
    }).catch(function (e) {
      flushing = false;
      SAVE.stuck = true; SAVE.last = "network: " + (e && e.message ? e.message : e);
      scheduleFlush(4000); // offline: keep the queue and try again
    });
  }
  window.addEventListener("online", function () { scheduleFlush(100); });
  setInterval(function () { if (queue.length) flush(); }, 10000);

  // ---------- participant state ----------
  var SKEY = "sim_state";
  var st = store(SKEY);
  function persist() { store(SKEY, st); }

  function logEvent(event, phase, trial, payload) {
    if (!st || !st.pid) return;
    st.seq += 1;
    persist();
    save("events", { participant_id: st.pid, seq: st.seq, event: event, phase: phase || null,
      trial_no: trial == null ? null : trial, payload: payload || null, client_time: nowIso() });
  }
  document.addEventListener("visibilitychange", function () {
    logEvent("visibility", null, null, { state: document.visibilityState });
    if (document.visibilityState === "hidden") flush();
  });

  function makePlan(pid) { return PLAN.makePlan(pid, C, SIM.products); }

  // ---------- step list ----------
  function steps() {
    // one picture check, right after 취향 점수 (after_mission 0 in captcha_responses)
    var list = ["consent", "demographics", "payment_style", "preference", "captcha:1:0", "shop_intro"];
    st.plan.trials.forEach(function (t) { list.push((t.type === "shopping" ? "shop:" : "cart:") + t.idx); });
    list.push("extra_intro");
    st.plan.extras.forEach(function (e, i) { list.push("extra:" + i); });
    list.push("end");
    return list;
  }

  function next() {
    st.step += 1;
    persist();
    run();
  }

  function run() {
    var s = steps()[st.step] || "end";
    var parts = s.split(":");
    switch (parts[0]) {
      case "consent": return screenConsent();
      case "demographics": return screenDemographics();
      case "payment_style": return screenPaymentStyle();
      case "preference": return screenPreference();
      case "shop_intro": return screenShopIntro();
      case "shop": return shopHome(st.plan.shopping[+parts[1]]);
      case "captcha": return screenCaptcha(+parts[1], +parts[2]);
      case "cart": return cartList(+parts[1]);
      case "extra_intro": return screenExtraIntro();
      case "extra": return extraCheckout(st.plan.extras[+parts[1]]);
      default: return screenEnd();
    }
  }

  // ---------- survey layout ----------
  var SURVEY_STEPS = ["동의", "나에 대해", "결제 성향", "취향 점수", "장보기 시작"];

  function surveyPage(stepNo, minutes, title, body) {
    var nav = SURVEY_STEPS.map(function (name, i) {
      var cls = i + 1 === stepNo ? "on" : (i + 1 < stepNo ? "done" : "");
      return '<span class="' + cls + '">0' + (i + 1) + " " + name + "</span>";
    }).join('<i>›</i>');
    return '<header class="s-head"><div class="s-head-in"><div class="logo">' + logo() + '</div>' +
      '<span class="s-title">연구 참여 설문</span><span class="s-note">예상 소요 약 ' + esc(C.time_text_1st) + ' · 결제는 모두 가상입니다</span></div></header>' +
      '<nav class="s-steps"><div>' + nav + '</div></nav>' +
      '<main class="s-main"><section class="s-card"><div class="s-kicker">' + stepNo + '단계 · 약 ' + minutes + '분</div>' +
      '<h1>' + title + '</h1>' + body + '</section></main>';
  }
  function logo() {
    var m = STORE.match(/^([A-Za-z0-9]+)(.*)$/);
    // one colour per letter (same for everyone), a warm-to-cool row in the style of big Korean malls
    return '<span class="lg">' + STORE.split("").map(function (ch, i) {
      return '<i class="c' + (i % 5) + '">' + esc(ch) + '</i>';
    }).join("") + '</span>';
  }
  function bindNext(btn, isValid, label, waitLabel) {
    function update() {
      var ok = isValid();
      btn.disabled = !ok;
      btn.textContent = ok ? label : waitLabel;
    }
    update();
    return update;
  }

  // ---------- 01 consent ----------
  function screenConsent() {
    var c = S.consent;
    render(surveyPage(1, 1, "연구 참여 안내",
      '<p class="lead">' + esc(c.intro) + '</p>' +
      '<table class="info">' + c.rows.map(function (r) {
        return '<tr><th>' + esc(r[0]) + '</th><td>' + fill(r[1]) + '</td></tr>';
      }).join("") + '</table>' +
      '<fieldset class="agree"><legend>동의 <small>(모두 체크해야 다음으로 넘어갑니다)</small></legend>' +
      '<label class="all"><input type="checkbox" id="all"> <b>전체 동의</b></label>' +
      c.checks.map(function (k) {
        return '<label><input type="checkbox" class="chk" data-k="' + k[0] + '"> ' + esc(k[1]) + '</label>';
      }).join("") + '</fieldset>' +
      '<div class="actions"><button class="btn primary" id="go"></button></div>'));
    var chks = $all(".chk"), all = $("#all");
    var upd = bindNext($("#go"), function () { return chks.every(function (x) { return x.checked; }); },
      "동의하고 시작하기", "모든 항목에 동의해 주세요");
    all.onchange = function () { chks.forEach(function (x) { x.checked = all.checked; }); upd(); };
    chks.forEach(function (x) { x.onchange = function () { all.checked = chks.every(function (y) { return y.checked; }); upd(); }; });
    $("#go").onclick = function () {
      var t = nowIso();
      var row = { participant_id: st.pid, consented_at: t };
      chks.forEach(function (x) { row[x.getAttribute("data-k")] = x.checked; });
      save("consents", row);
      logEvent("consent", "survey");
      next();
    };
  }

  // ---------- 02 demographics ----------
  function screenDemographics() {
    var qs = S.demographics;
    render(surveyPage(2, 2, "인구통계와 온라인 쇼핑 정보",
      qs.map(function (q) {
        var input;
        if (q.type === "number") {
          input = '<div class="num">' + (q.prefix ? esc(q.prefix) + ' ' : '') + '<input type="number" inputmode="numeric" id="f_' + q.id +
            '" min="' + q.min + '" max="' + q.max + '"> ' + esc(q.suffix || "") + '</div>';
        } else if (q.type === "email") {
          input = '<input type="email" class="text" id="f_' + q.id + '" placeholder="example@email.com" autocomplete="email">';
        } else {
          var kind = q.type === "multi" ? "checkbox" : "radio";
          input = '<div class="chips">' + q.options.map(function (o) {
            return '<label class="chip"><input type="' + kind + '" name="' + q.id + '" value="' + o.c + '"' +
              (o.exclusive ? ' data-ex="1"' : '') + (o.other ? ' data-other="1"' : '') + '><span>' + esc(o.t) + '</span></label>';
          }).join("") + '</div>';
          if (q.options.some(function (o) { return o.other; })) {
            input += '<input type="text" class="text other" id="o_' + q.id + '" maxlength="40" placeholder="직접 입력" style="display:none">';
          }
        }
        return (q.group ? '<h2 class="q-group">' + esc(q.group) + '</h2>' : '') +
          '<div class="q"><div class="q-label">' + q.no + '. ' + esc(q.label) + '</div>' +
          (q.help ? '<p class="help">' + esc(q.help) + '</p>' : '') + input + '</div>';
      }).join("") +
      '<div class="actions"><button class="btn ghost" id="prev">이전</button><button class="btn primary" id="go"></button></div>'));
    function checked(q) {
      return $all('input[name="' + q.id + '"]:checked').map(function (x) {
        return q.options.filter(function (o) { return o.c === x.value; })[0];
      });
    }
    function otherText(q) { var el = $("#o_" + q.id); return el ? el.value.trim() : ""; }
    function value(q) {
      if (q.type === "number" || q.type === "email") return $("#f_" + q.id).value.trim();
      var c = checked(q);
      return q.type === "multi" ? c : (c[0] || null);
    }
    function valid(q) {
      var v = value(q);
      if (q.type === "number") return v !== "" && +v >= q.min && +v <= q.max;
      if (q.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      var picked = q.type === "multi" ? v : (v ? [v] : []);
      if (!picked.length) return false;
      // "기타" needs its text
      return picked.every(function (o) { return !o.other || otherText(q) !== ""; });
    }
    // a "없음" choice stands alone; the "기타" text box only shows while "기타" is picked
    function sync(e) {
      qs.forEach(function (q) {
        if (q.type !== "multi" && q.type !== "choice_other" && q.type !== "choice") return;
        if (q.type === "multi" && e && e.target && e.target.name === q.id && e.target.checked) {
          var ex = !!e.target.getAttribute("data-ex");
          $all('input[name="' + q.id + '"]').forEach(function (x) {
            if (x !== e.target && (ex || x.getAttribute("data-ex"))) x.checked = false;
          });
        }
        var box = $("#o_" + q.id);
        if (box) box.style.display = checked(q).some(function (o) { return o.other; }) ? "" : "none";
      });
    }
    var upd = bindNext($("#go"), function () { return qs.every(valid); }, "다음", "모든 문항에 답해 주세요");
    screenEl().addEventListener("input", upd);
    screenEl().addEventListener("change", function (e) { sync(e); upd(); });
    $("#prev").onclick = function () { st.step -= 1; persist(); run(); };
    $("#go").onclick = function () {
      var row = { participant_id: st.pid, submitted_at: nowIso() }, codes = {};
      qs.forEach(function (q) {
        if (q.id === "email") return;
        var v = value(q);
        if (q.type === "number") { row[q.id] = +v; return; }
        var hasOther = (q.type === "multi" ? v : [v]).some(function (o) { return o.other; });
        if (q.type === "multi") {
          row[q.id] = v.map(function (o) { return o.t; });
          codes[q.id] = v.map(function (o) { return o.c; });
        } else {
          row[q.id] = v.t;
          codes[q.id] = v.c;
        }
        if (q.type === "multi" || q.type === "choice_other") row[q.id + "_other"] = hasOther ? otherText(q) : null;
      });
      row.answer_codes = codes;
      save("demographics", row);
      save("contacts", { participant_id: st.pid, email: value({ id: "email", type: "email" }), created_at: nowIso() });
      logEvent("demographics_done", "survey");
      next();
    };
  }

  // ---------- 03 payment style (장보기 쪽지, Q14, Q15) ----------
  function screenPaymentStyle() {
    var p = S.payment_style, n = S.note;
    // Q15: the 16 statements in a different order for every participant (seeded by id); item_no stays the original number
    var order = shuffle(p.items.map(function (it, i) { return i; }), seededRng(st.pid + ":q15"));
    render(surveyPage(3, 6, "결제 성향",
      '<h2 class="q-group">3. 장보기 부탁 쪽지</h2>' +
      '<div class="q"><div class="q-label">' + n.no + '. ' + esc(n.question) + '</div><p class="help">' + esc(n.help) + '</p>' +
      '<textarea id="note" rows="5"></textarea><div class="count" id="cnt">0자 · ' + esc(n.hint) + '</div></div>' +
      '<h2 class="q-group">' + esc(p.group_q14) + '</h2>' +
      '<div class="q"><div class="q-label">' + esc(p.q14) + '</div><p class="help">' + esc(p.q14_help) + '</p>' +
      '<textarea id="q14" rows="4"></textarea><div class="count">' + esc(p.q14_hint) + '</div></div>' +
      '<h2 class="q-group">' + esc(p.group_q15) + '</h2>' +
      '<div class="q"><div class="q-label">' + esc(p.q15) + '</div><p class="help">' + esc(p.q15_help) +
      ' <span class="badge" id="answered">0 / ' + p.items.length + ' 응답</span></p>' +
      '<table class="likert"><thead><tr><th>문장</th>' + p.scale.map(function (s) { return '<th>' + esc(s) + '</th>'; }).join("") +
      '</tr></thead><tbody>' + order.map(function (i, pos) {
        return '<tr><td><span class="no">' + (pos + 1) + '</span>' + esc(p.items[i]) + '</td>' + p.scale.map(function (s, v) {
          return '<td><label data-l="' + esc(s) + '"><input type="radio" name="l' + (i + 1) + '" value="' + (v + 1) + '" aria-label="' + esc(s) + '"></label></td>';
        }).join("") + '</tr>';
      }).join("") + '</tbody></table></div>' +
      '<div class="actions"><button class="btn ghost" id="prev">이전</button><button class="btn primary" id="go"></button></div>'));
    function answers() {
      return p.items.map(function (it, i) { var r = app.querySelector('input[name="l' + (i + 1) + '"]:checked'); return r ? +r.value : 0; });
    }
    var upd = bindNext($("#go"), function () {
      var a = answers();
      $("#answered").textContent = a.filter(Boolean).length + " / " + p.items.length + " 응답";
      $("#cnt").textContent = $("#note").value.trim().length + "자 · " + n.hint;
      return $("#note").value.trim().length >= n.min_chars && $("#q14").value.trim().length > 0 && a.every(Boolean);
    }, "다음", "모든 문항에 답해 주세요 (쪽지는 " + n.min_chars + "자 이상)");
    screenEl().addEventListener("input", upd);
    screenEl().addEventListener("change", upd);
    $("#prev").onclick = function () { st.step -= 1; persist(); run(); };
    $("#go").onclick = function () {
      var a = answers();
      save("shopping_notes", { participant_id: st.pid, note_text: $("#note").value.trim(), submitted_at: nowIso() });
      save("payment_styles", { participant_id: st.pid, q14_text: $("#q14").value.trim(),
        attention_pass: a[p.check_item_no - 1] === p.check_answer, submitted_at: nowIso() });
      save("payment_style_items", p.items.map(function (it, i) {
        return { participant_id: st.pid, item_no: i + 1, display_order: order.indexOf(i) + 1, item_text: it,
          response: a[i], is_check_item: i + 1 === p.check_item_no };
      }));
      logEvent("payment_style_done", "survey");
      next();
    };
  }

  // ---------- 04 preference score (Q16) ----------
  function screenPreference() {
    var p = S.preference;
    var vals = {};
    p.items.forEach(function (it) { vals[it[0]] = 0; });
    render(surveyPage(4, 2, "적합도(취향) 점수",
      '<div class="q"><div class="q-label">' + esc(p.question) + '</div><p class="help">' + esc(p.help) + '</p>' +
      '<table class="points"><thead><tr><th>항목</th><th>이런 차이를 떠올려 보세요</th><th>점수</th></tr></thead><tbody>' +
      p.items.map(function (it) {
        return '<tr><th>' + esc(it[1]) + '</th><td class="ex">' + esc(it[2]) + '</td><td class="stepper">' +
          '<button type="button" data-k="' + it[0] + '" data-d="-5">−</button>' +
          '<input type="number" inputmode="numeric" min="0" max="100" step="1" value="0" data-k="' + it[0] + '">' +
          '<button type="button" data-k="' + it[0] + '" data-d="5">+</button><span>점</span></td></tr>';
      }).join("") +
      '<tr class="sum"><th>합계</th><td id="left"></td><td><b id="total">0</b> / 100</td></tr></tbody></table></div>' +
      '<div class="actions"><button class="btn ghost" id="prev">이전</button><button class="btn primary" id="go"></button></div>'));
    function total() { return Object.keys(vals).reduce(function (s, k) { return s + vals[k]; }, 0); }
    var upd = bindNext($("#go"), function () {
      var t = total();
      $("#total").textContent = t;
      $("#left").textContent = t < 100 ? (100 - t) + "점 남았어요" : (t > 100 ? (t - 100) + "점 넘었어요" : "딱 맞아요");
      return t === 100;
    }, "다음", "합계를 100으로 맞춰 주세요");
    $all(".stepper button").forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-k");
        vals[k] = Math.max(0, Math.min(100, vals[k] + +b.getAttribute("data-d")));
        app.querySelector('input[data-k="' + k + '"]').value = vals[k];
        upd();
      };
    });
    $all(".stepper input").forEach(function (inp) {
      inp.oninput = function () {
        vals[inp.getAttribute("data-k")] = Math.max(0, Math.min(100, Math.round(+inp.value || 0)));
        upd();
      };
    });
    $("#prev").onclick = function () { st.step -= 1; persist(); run(); };
    $("#go").onclick = function () {
      var row = { participant_id: st.pid, submitted_at: nowIso() };
      Object.keys(vals).forEach(function (k) { row[k] = vals[k]; });
      save("preference_scores", row);
      logEvent("preference_done", "survey");
      next();
    };
  }

  function screenShopIntro() {
    render(surveyPage(5, 15, "장보기 시작",
      '<p class="lead">이제 ' + esc(STORE) + '에서 장을 봅니다. <b>평소 내 계정으로 온라인 장을 본다고 생각하며</b> 골라 주세요.</p>' +
      '<table class="info">' +
      '<tr><th>장보기 ' + st.plan.trials.length + '번</th><td>아래 두 가지가 <b>섞여서</b> 나옵니다. 화면 위 주황색 띠에 이번에 할 일이 적혀 있어요.</td></tr>' +
      '<tr><th>· 쇼핑 미션 ' + st.plan.shopping.length + '번</th><td>사야 할 품목을 검색창에 직접 입력해 검색하고, 마음에 드는 상품 1개를 골라 바로 결제합니다.</td></tr>' +
      '<tr><th>· 장바구니 결제 ' + st.plan.cart.length + '번</th><td>장바구니에 담겨 있는 상품을 하나씩 결제합니다.</td></tr>' +
      '<tr><th>미션 순서</th><td>사람마다 순서가 다르고, 쇼핑 미션은 장바구니 결제 사이사이에 나옵니다.</td></tr>' +
      '<tr><th>이번 장보기 예산</th><td><b>' + won(C.shopping_budget) + '</b> (한 번 결제할 때마다의 예산이에요)</td></tr>' +
      '<tr><th>추가 결제 ' + st.plan.extras.length + '번</th><td>상품 없이 결제 화면만 보고 혜택을 고릅니다.</td></tr>' +
      '<tr><th>가상 결제</th><td>실제 돈은 나가지 않고, 실제로 배송되지 않습니다. 정답은 없으니 평소처럼 골라 주세요.</td></tr></table>' +
      (DB_URL === null ? '<p class="warn">연구진 확인용: supabase_url이 비어 있어 응답이 저장되지 않습니다.</p>' : '') +
      '<div class="actions"><button class="btn primary" id="go">장보기 시작하기</button></div>'));
    $("#go").onclick = function () {
      if (!st.planSaved) {
        // the whole mixed order, saved before the first checkout so it is known even if someone stops halfway
        // cart_items = the 24 benefit checkouts of the cart (not the general / attention checkouts)
        save("cart_items", st.plan.cart.filter(function (c) { return c.kind === "cart"; }).map(function (c) {
          return { participant_id: st.pid, position: c.phase_no, product_id: c.product_id, discount_amount: c.discount, cash_amount: c.cash_amount };
        }));
        save("trial_sequence", st.plan.trials.map(function (t) {
          var x = t.type === "shopping" ? st.plan.shopping[t.idx] : st.plan.cart[t.idx];
          return { participant_id: st.pid, order_no: x.order_no, set_no: x.set_no, set_code: x.set_code,
            trial_type: t.type, trial_no: t.type === "shopping" ? x.trial_no : x.phase_no, category: x.category,
            item_key: x.item_key || null, product_id: x.product_id || null, discount_amount: x.discount,
            cash_amount: x.cash_amount, discount_side: x.discount_side, card_first: x.card_first,
            screen_json: x.screen };
        }).concat(st.plan.extras.map(function (e) {
          return { participant_id: st.pid, order_no: e.order_no, set_no: null, set_code: null, trial_type: "extra",
            trial_no: e.trial_no, category: null, item_key: null, product_id: null, discount_amount: e.discount,
            cash_amount: e.cash_amount, discount_side: e.discount_side, card_first: e.card_first, screen_json: e.screen };
        })));
        st.planSaved = true;
      }
      logEvent("shop_intro_done", "shopping"); st.shopStart = Date.now(); next();
    };
  }

  // ---------- store layout ----------
  function storeHeader(query) {
    return '<div class="topline"><div class="w"><span>즐겨찾기</span><span class="r">참가자 P-' + esc(shortId(st.pid)) +
      '<i></i>고객센터</span></div></div>' +
      '<header class="store-head"><div class="w"><div class="cat">☰<small>카테고리</small></div>' +
      '<div class="logo big">' + logo() + '</div>' +
      '<form class="search" id="search" autocomplete="off"><span class="all">전체 ▾</span>' +
      '<input id="q" type="search" placeholder="찾고 싶은 상품을 검색해보세요!" value="' + esc(query || "") + '" aria-label="검색어">' +
      '<button type="submit" aria-label="검색"><svg viewBox="0 0 24 24" width="22" height="22"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></form>' +
      '<div class="icons"><span>👤<small>마이마켓</small></span><span class="cart-ic">🛒<em>0</em><small>장바구니</small></span></div></div>' +
      '<div class="w menu"><span class="dot">빠른배송</span><span>신선식품</span><span>다시 구매</span><span>오늘의 특가</span><span>이달의 신상</span><span>반품마켓</span></div></header>';
  }
  function banner(tag, text, right) {
    return '<div class="banner"><div class="w"><span class="tag">⚑ ' + tag + '</span><span class="msg">' + text +
      '</span><span class="right">' + (right || "가상 결제 · 실제로 돈이 나가지 않아요") + '</span></div></div>';
  }
  function slimHeader() {
    return '<header class="slim"><div class="w"><div class="logo">' + logo() + '</div></div></header>';
  }
  function thumb(p, size) {
    var color = COLORS[(parseInt(p.product_id.replace(/\D/g, ""), 10) || 0) % COLORS.length];
    return '<div class="thumb ' + (size || "") + '" style="--c:' + color + '"><span>' + (ICONS[p.item_key] || "📦") + '</span></div>';
  }
  // Texts that come from the screen spec carry data-s="<path inside the spec>". test_screen_spec.py checks that each
  // one equals the spec value and that nothing else readable is on the screen (apart from its list of layout items).
  function sp(path, text) { return '<span data-s="' + path + '">' + esc(text) + '</span>'; }
  // v = a product view from the spec, pre = path of its text object inside the spec, e.g. "product.text."
  function priceBlock(v, pre) {
    var t = v.text;
    return (t.list ? '<div class="list">' + sp(pre + "list", t.list) + '</div>' : '') +
      '<div class="price">' + (t.rate ? '<em data-s="' + pre + 'rate">' + esc(t.rate) + '</em> ' : '') +
      '<span data-s="' + pre + 'price"><b>' + esc(t.price.slice(0, -1)) + '</b>원</span>' +
      (t.unit ? ' <small data-s="' + pre + 'unit">' + esc(t.unit) + '</small>' : '') + '</div>';
  }
  function deliveryLine(v, pre) {
    return '<div class="ship"><span class="fast" data-s="' + pre + 'delivery_badge">' + esc(v.text.delivery_badge) + '</span> <span class="' +
      (/내일/.test(v.delivery) ? "g" : "") + '" data-s="' + pre + 'delivery">' + esc(v.text.delivery) + '</span></div>';
  }

  // ---------- 06 shopping mission ----------
  // every word of a mission screen comes from m.screen (the spec made in plan.js and saved in trial_sequence.screen_json)
  function budgetNote(spec) { return '<span class="budget-pill">💰 ' + sp("budget", spec.budget) + '</span>'; }
  // msgHtml: replaces the mission sentence (checkout screens show a fixed sentence there)
  function bannerFor(spec, msgHtml) {
    return banner(sp("tag", spec.tag), msgHtml || sp("mission", spec.mission), spec.budget ? budgetNote(spec) : null);
  }
  function shopBanner(m) { return bannerFor(m.screen); }

  function shopHome(m) {
    var ctx = { m: m, t0: ms(), searches: 0 };
    logEvent("mission_start", "shopping", m.trial_no, { item: m.item_key, cash_amount: m.cash_amount });
    render(storeHeader("") + shopBanner(m) +
      '<main class="w home"><aside class="cats">' + ["패션의류/잡화", "뷰티", "출산/유아동", "식품", "주방용품", "생활용품", "홈인테리어", "가전디지털", "스포츠/레저", "도서/음반", "반려동물용품", "헬스/건강식품"]
        .map(function (c) { return "<span>" + c + "</span>"; }).join("") + '</aside>' +
      '<section><div class="hero"><b>빠른배송</b><p>오늘 밤 12시까지 주문하면<br><strong>내일 도착</strong></p><small>생필품 무료배송</small></div></section></main>', m.screen);
    bindSearch(ctx);
    setTimeout(function () { $("#q").focus(); }, 50);
  }

  function bindSearch(ctx) {
    $("#search").onsubmit = function (e) {
      e.preventDefault();
      var q = $("#q").value, nq = norm(q), m = ctx.m;
      ctx.searches += 1;
      var hit = nq.length > 0 && m.aliases.some(function (a) {
        var na = norm(a);
        return nq.indexOf(na) >= 0 || (nq.length >= 2 && na.indexOf(nq) >= 0);
      });
      logEvent("search", "shopping", m.trial_no, { query: q, matched: hit, n: ctx.searches, ms: ms() - ctx.t0 });
      if (!hit) return shopNoResult(ctx, q);
      ctx.query = q;
      shopResults(ctx);
    };
  }

  function shopNoResult(ctx, q) {
    render(storeHeader(q) + shopBanner(ctx.m) +
      '<main class="w"><div class="empty">‘' + esc(q) + '’에 대한 검색결과가 없습니다.<br><small>미션에 나온 품목을 검색해 주세요.</small></div></main>', ctx.m.screen);
    bindSearch(ctx);
  }

  function shopResults(ctx) {
    var m = ctx.m, results = m.screen.search.results;
    var list = results.map(function (r) { return PRODUCTS[r.product_id]; });
    render(storeHeader(ctx.query) + shopBanner(m) +
      '<main class="w results"><aside class="filters">' +
      [["배송", ["빠른배송", "무료배송"]], ["가격", ["1만 원 이하", "1~2만 원", "2만 원 이상"]], ["브랜드", list.map(function (p) { return p.brand; })]]
        .map(function (g) { return '<h4>' + g[0] + '</h4>' + g[1].map(function (o) { return '<label><input type="checkbox" disabled> ' + esc(o) + '</label>'; }).join(""); }).join("") +
      '</aside><section><h2>‘' + esc(ctx.query) + '’에 대한 검색결과</h2>' +
      '<div class="sort"><b>✓ 추천순</b><span>낮은가격순</span><span>높은가격순</span><span>판매량순</span><span>최신순</span></div>' +
      '<div class="grid">' + results.map(function (r, i) {
        var v = r.product, pre = "search.results." + i + ".product.text.";
        return '<a href="#" class="card" data-i="' + i + '"><span class="rank">' + (i + 1) + '</span>' + thumb(PRODUCTS[v.product_id]) +
          '<div class="nm">' + sp(pre + "title", v.text.title) + '</div>' + priceBlock(v, pre) + deliveryLine(v, pre) +
          '<div class="rate"><span class="stars">' + stars(v.rating) + '</span> ' + sp(pre + "rating", v.text.rating) + '</div></a>';
      }).join("") + '</div></section></main>', m.screen);
    if (!ctx.impressionsSaved) {
      ctx.impressionsSaved = true;
      save("search_impressions", list.map(function (p, i) {
        return { participant_id: st.pid, trial_no: m.trial_no, position: i + 1, product_id: p.product_id, default_rank: p.default_rank };
      }));
    }
    ctx.resultsAt = ms();
    logEvent("results_shown", "shopping", m.trial_no, { query: ctx.query, products: m.product_ids });
    bindSearch(ctx);
    $all(".card").forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        var i = +a.getAttribute("data-i");
        logEvent("product_click", "shopping", m.trial_no, { product_id: list[i].product_id, position: i + 1, ms: ms() - ctx.resultsAt });
        shopDetail(ctx, list[i], i + 1);
      };
    });
  }

  function shopDetail(ctx, p, position) {
    var m = ctx.m, v = m.screen.search.results[position - 1].product, pre = "product.text.";
    var spec = {};   // the mission spec plus the product that was opened
    Object.keys(m.screen).forEach(function (k) { spec[k] = m.screen[k]; });
    spec.product = v;
    render(storeHeader(ctx.query) + bannerFor(spec) +
      '<main class="w detail"><div class="crumb">홈 › ' + esc(p.category) + ' › ' + esc(p.item_name) + '</div>' +
      '<div class="pd">' + thumb(p, "lg") + '<div class="info">' +
      '<h1>' + sp(pre + "title", v.text.title) + '</h1><div class="rate"><span class="stars">' + stars(v.rating) + '</span> ' +
      sp(pre + "rating", v.text.rating) + '</div>' + priceBlock(v, pre) + deliveryLine(v, pre) +
      '<div class="qty">수량 <span>−</span><b>1</b><span>+</span></div>' +
      '<button class="btn primary buy" id="buy">바로구매 ›</button><p class="help">이 단계에서는 장바구니를 사용하지 않고 바로 결제합니다.</p>' +
      '<button class="btn ghost" id="back">← 검색결과로 돌아가기</button></div></div></main>', spec);
    bindSearch(ctx);
    $("#back").onclick = function () { logEvent("back_to_results", "shopping", m.trial_no, { product_id: p.product_id }); shopResults(ctx); };
    $("#buy").onclick = function () {
      logEvent("buy_now", "shopping", m.trial_no, { product_id: p.product_id });
      checkout({
        phase: "shopping", trial_no: m.trial_no, product: p, position: position,
        price: v.price, discount: m.discount, cash: m.cash_amount, condition: "", side: m.discount_side,
        order_no: m.order_no, set_no: m.set_no, budget: C.shopping_budget,
        spec: PLAN.checkoutSpec(C, m, v), steps: ["상품선택", "주문/결제", "주문완료"],
        back: function () { shopDetail(ctx, p, position); },
        done: function (choice) {
          // advance now, so a reload after paying never shows the same mission again
          st.bought = (st.bought || []).concat([p.product_id]);
          st.step += 1;
          persist();
          shopDone(m, choice);
        }
      });
    };
  }

  function shopDone(m) {
    var all = st.plan.shopping;
    render(slimHeader() + '<main class="w narrow"><div class="done-card"><div class="steps-mini">01 상품선택 › 02 주문/결제 › <b>03 주문완료</b></div>' +
      '<div class="check">✓</div><h1>가상 결제가 완료되었어요</h1><p class="help">실제로 돈이 나가거나 배송되지 않습니다.</p>' +
      '<div class="prog"><b>미션</b> ' + m.order_no + ' / ' + st.plan.trials.length + ' 완료 · 쇼핑 미션 ' + m.trial_no + ' / ' + all.length + '</div><div class="pills">' +
      all.map(function (x) { return '<span class="' + (x.trial_no <= m.trial_no ? "on" : "") + '">' + esc(x.item_name) + '</span>'; }).join("") +
      '</div><button class="btn primary" id="go">' + (m.order_no < st.plan.trials.length ? "다음 미션으로" : "다음으로") + '</button></div></main>');
    $("#go").onclick = function () { logEvent("mission_end", "shopping", m.trial_no); run(); };
  }

  // ---------- picture check ----------
  function screenCaptcha(no, after) {
    var rnd = seededRng(st.pid + ":captcha:" + no + ":" + (st.captchaTry || 0));
    var target = S.captcha.targets[Math.floor(rnd() * S.captcha.targets.length)];
    var nTarget = 2 + Math.floor(rnd() * 3);
    var tiles = [];
    for (var i = 0; i < nTarget; i++) tiles.push({ e: target[1][i % target[1].length], t: true });
    shuffle(S.captcha.distractors, rnd).slice(0, 9 - nTarget).forEach(function (d) { tiles.push({ e: d, t: false }); });
    tiles = shuffle(tiles, rnd);
    var t0 = st.captchaT0 || Date.now();
    st.captchaT0 = t0;
    persist();
    render(slimHeader() + '<main class="w narrow"><div class="captcha"><div class="cap-head"><small>사진 인증</small>' +
      '<b>‘' + esc(target[0]) + '’</b> 사진을 모두 골라 주세요<p>자동 입력 방지를 위한 확인입니다. 맞는 사진을 모두 누른 뒤 확인을 눌러 주세요.</p></div>' +
      (st.captchaTry ? '<div class="cap-err">다시 시도해 주세요. 새 사진이 나왔어요.</div>' : '') +
      '<div class="cap-grid">' + tiles.map(function (t, i) { return '<button type="button" data-i="' + i + '">' + t.e + '</button>'; }).join("") +
      '</div><div class="cap-foot"><button class="btn primary" id="ok">확인</button></div></div></main>');
    var sel = {};
    $all(".cap-grid button").forEach(function (b) {
      b.onclick = function () { var i = b.getAttribute("data-i"); sel[i] = !sel[i]; b.classList.toggle("on", sel[i]); };
    });
    $("#ok").onclick = function () {
      var correct = tiles.every(function (t, i) { return !!sel[i] === t.t; });
      var attempts = (st.captchaTry || 0) + 1;
      logEvent("captcha_submit", "captcha", no, { target: target[0], correct: correct, attempt: attempts });
      if (!correct && attempts < 3) { st.captchaTry = attempts; persist(); return screenCaptcha(no, after); }
      save("captcha_responses", { participant_id: st.pid, captcha_no: no, after_mission: after, target: target[0],
        attempts: attempts, first_correct: attempts === 1 && correct,
        tiles: tiles.map(function (t) { return t.e; }),
        selected: tiles.map(function (t, i) { return !!sel[i]; }), rt_ms: Date.now() - t0 });
      st.captchaTry = 0; st.captchaT0 = null;
      next();
    };
  }

  // ---------- checkout (shared by shopping, cart, general, attention and extra) ----------
  // o: {phase, trial_no, product (record or null), position, price, discount, cash, condition, side, spec, steps, back, done}
  // o.spec is the checkout screen spec (plan.js): tag, budget, product texts / order text, heading and the two cards in
  // on-screen order. Everything the participant reads comes from it, and exactly this object is saved in checkouts.screen_json.
  function checkout(o) {
    var shownAt = nowIso(), t0 = ms(), first = null, changes = 0, choice = null;
    var spec = o.spec, opts = spec.options, p = o.product, general = spec.kind === "general";
    var balance = st.cashBalance || 0;
    var ask = general ? "결제 방식을 선택해 주세요" : "결제 혜택을 선택해 주세요";
    function optOf(type) { return opts.filter(function (x) { return x.type === type; })[0]; }
    var cards = opts.map(function (x, i) {
      var pre = "options." + i + ".";
      return '<button type="button" class="ben" data-c="' + x.type + '"><span class="radio"></span><div>' +
        '<div class="big">' + sp(pre + "title", x.title) + '</div>' +
        (x.note ? '<div class="note">' + sp(pre + "note", x.note) + '</div>' : '') +
        (x.condition ? '<div class="cond">' + sp(pre + "condition", x.condition) + '</div>' : '') +
        '<div class="pay">' + sp(pre + "pay_text", x.pay_text) + '</div></div></button>';
    }).join("");
    var item = spec.product
      ? '<div class="box"><h3>배송 1건 중 1</h3><div class="row"><div><div class="g">' + sp("product.text.delivery", spec.product.text.delivery) + '</div>' +
        sp("product.text.title", spec.product.text.title) + '</div><span class="muted">수량 1개 / 무료배송</span></div></div>'
      : '<div class="box"><h3>주문 상품</h3><div class="row"><div>' + sp("order", spec.order) + '</div><span class="muted">가상 상품</span></div></div>';
    render(slimHeader() + bannerFor(spec, "주문 내용을 확인하고 결제해 주세요.") +
      '<main class="w co"><div class="co-head"><h1>주문/결제</h1><div class="steps-mini">' +
      o.steps.map(function (s, i) { return (i === 1 ? "<b>" : "") + "0" + (i + 1) + " " + s + (i === 1 ? "</b>" : ""); }).join(" › ") + '</div></div>' +
      '<div class="co-grid"><div class="co-left">' +
      '<div class="box"><h3>받는 사람 정보</h3><dl><dt>이름</dt><dd>참가자 P-' + esc(shortId(st.pid)) + ' (가상)</dd><dt>배송주소</dt><dd>실험용 가상 주소 · 실제 배송되지 않습니다</dd></dl></div>' +
      item +
      '<div class="box benefit"><h3>' + sp("heading", spec.heading) + '</h3><div class="bens">' + cards + '</div>' +
      '</div><div class="box"><h3>결제수단</h3><div class="methods">' +
      [C.pay_name, "신용/체크카드", "계좌이체", "휴대폰", "무통장입금(가상계좌)"].map(function (m, i) {
        // chosen once at the first checkout, then filled in automatically
        return '<label><input type="radio" name="pm" value="' + esc(m) + '"' + (st.payMethod === m ? " checked" : "") +
          (st.payMethod ? " disabled" : "") + '> ' + esc(m) + '</label>';
      }).join("") +
      (st.payMethod ? '<p class="help pm-note">처음 고르신 결제수단으로 자동 선택되었어요.</p>' : '<p class="help pm-note">처음 한 번만 고르면 다음 결제부터는 자동으로 선택됩니다.</p>') +
      '</div></div>' +
      (o.back ? '<button class="btn ghost" id="back">← 이전 화면으로</button>' : '') +
      '</div><aside class="co-sum">' +
      (o.budget ? '<div class="budget">💰 이번 장보기 예산<b>' + won(o.budget) + '</b></div>' : '') + '<h3>최종 결제 금액</h3>' +
      '<div class="ln"><span>총 상품 가격</span><span>' + won(o.price) + '</span></div>' +
      (general ? '' : '<div class="ln"><span>즉시 할인</span><span class="red" id="sd">0원</span></div>' +
        '<div class="ln"><span>' + esc(CASH) + ' 사용</span><span></span></div>') +
      '<div class="ln"><span>배송비</span><span>0원</span></div>' +
      '<div class="tot"><span>총 결제 금액</span><b id="tot">' + won(o.price) + '</b></div>' +
      '<p class="agree-s">위 주문 내용을 확인하였으며, 가상 결제 진행에 동의합니다.</p>' +
      '<button class="btn primary block" id="pay" disabled>' + ask + '</button></aside></div></main>', spec);

    logEvent("checkout_shown", o.phase, o.trial_no, { product_id: p ? p.product_id : null, cash_amount: o.cash,
      discount_side: o.side, card_order: opts.map(function (x) { return x.type; }) });
    $all(".ben").forEach(function (b) {
      b.onclick = function () {
        var c = b.getAttribute("data-c");
        if (c === choice) return;
        if (choice) changes += 1;
        if (first === null) first = ms() - t0;
        choice = c;
        $all(".ben").forEach(function (x) { x.classList.toggle("on", x === b); });
        if ($("#sd")) $("#sd").textContent = c === "discount" ? "−" + won(o.discount) : "0원";
        $("#tot").textContent = won(optOf(c).pay_amount);
        updatePay();
        logEvent("benefit_click", o.phase, o.trial_no, { choice: c, ms: ms() - t0 });
      };
    });
    function method() { return (app.querySelector('input[name="pm"]:checked') || {}).value || null; }
    function updatePay() {
      var btn = $("#pay");
      btn.disabled = !(choice && method());
      btn.textContent = !choice ? ask : (!method() ? "결제수단을 선택해 주세요" : won(optOf(choice).pay_amount) + " 결제하기");
    }
    $all('input[name="pm"]').forEach(function (r) {
      r.onchange = function () { updatePay(); logEvent("pay_method", o.phase, o.trial_no, { method: r.value }); };
    });
    if (o.back) $("#back").onclick = function () { logEvent("checkout_back", o.phase, o.trial_no); o.back(); };
    $("#pay").onclick = function () {
      if (!choice || !method()) return;
      var auto = !!st.payMethod;
      st.payMethod = method();
      st.checkoutSeq = (st.checkoutSeq || 0) + 1;
      if (choice === "cash" && o.phase !== "extra") st.cashBalance = balance + o.cash;
      persist();
      save("checkouts", {
        checkout_id: st.pid + ":" + o.phase + ":" + o.trial_no, participant_id: st.pid, phase: o.phase,
        trial_no: o.trial_no, sequence_no: st.checkoutSeq, order_no: o.order_no || null, set_no: o.set_no || null,
        budget: o.budget || null, product_id: p ? p.product_id : null,
        question_id: o.question_id || null, product_position: o.position || null, price: o.price,
        discount_amount: o.discount, cash_amount: o.cash, cash_condition: o.condition || null,
        discount_side: o.side, choice: choice, pay_amount: optOf(choice).pay_amount,
        pay_method: st.payMethod, pay_method_auto: auto,
        first_choice_ms: first, decision_ms: ms() - t0, n_changes: changes,
        screen_json: spec,   // the checkout screen exactly as shown (same object the screen was drawn from)
        shown_at: shownAt, decided_at: nowIso()
      });
      logEvent("pay", o.phase, o.trial_no, { choice: choice, pay_method: st.payMethod });
      o.done(choice);
    };
  }

  // ---------- 장바구니 결제 (cart / general / attention look the same: one product, already in the cart) ----------
  function cartList(idx) {
    var cur = st.plan.cart[idx], p = PRODUCTS[cur.product_id], spec = cur.screen, t = spec.product.text;
    render(slimHeader() + bannerFor(spec) +
      '<main class="w cart"><div class="co-head"><h1>장바구니(1)</h1><div class="steps-mini"><b>01 장바구니</b> › 02 주문/결제 › 03 주문완료</div></div>' +
      '<div class="co-grid"><div class="co-left"><div class="box"><h3>빠른배송 상품 <small>무료배송</small></h3>' +
      '<div class="ci"><input type="checkbox" disabled checked>' + thumb(p, "sm") + '<div class="nm">' + sp("product.text.title", t.title) +
      '<div class="g">' + sp("product.text.delivery", t.delivery) + ' · 수량 1</div></div><b>' + sp("product.text.price", t.price) + '</b></div></div></div>' +
      '<aside class="co-sum"><h3>주문 예상 금액</h3><p class="muted small">선택한 상품: ' + esc(t.title) + '</p>' +
      '<div class="ln"><span>총 상품 가격</span><span>' + won(p.price) + '</span></div><div class="ln"><span>총 배송비</span><span>+0원</span></div>' +
      '<div class="tot"><span></span><b>' + won(p.price) + '</b></div><button class="btn primary block" id="buy">구매하기 (1)</button></aside></div></main>', spec);
    logEvent("cart_shown", cur.kind, cur.phase_no, { product_id: p.product_id });
    $("#buy").onclick = function () {
      checkout({
        phase: cur.kind, trial_no: cur.phase_no, product: p, price: p.price, discount: cur.discount,
        cash: cur.cash_amount, condition: "", side: cur.discount_side,
        order_no: cur.order_no, set_no: cur.set_no, budget: C.shopping_budget,
        spec: spec, steps: ["장바구니", "주문/결제", "주문완료"],
        back: function () { cartList(idx); },
        done: function () { st.step += 1; persist(); cartDone(idx); }
      });
    };
  }

  function cartDone(idx) {
    var n = st.plan.cart.length, cur = st.plan.cart[idx], last = cur.order_no === st.plan.trials.length;
    var dots = "";
    for (var i = 0; i < n; i++) dots += '<span class="' + (i <= idx ? "on" : "") + '">' + (i + 1) + '</span>';
    render(slimHeader() + '<main class="w narrow"><div class="done-card"><div class="steps-mini">01 장바구니 › 02 주문/결제 › <b>03 주문완료</b></div>' +
      '<div class="check">✓</div><h1>가상 결제가 완료되었어요</h1><p class="help">실제로 돈이 나가거나 배송되지 않습니다.' +
      '</p>' +
      '<div class="prog"><b>미션</b> ' + cur.order_no + ' / ' + st.plan.trials.length + ' 완료 · 장바구니 결제 ' + (idx + 1) + ' / ' + n + '</div><div class="pills nums">' + dots + '</div>' +
      '<button class="btn primary" id="go">' + (last ? "다음으로" : "다음 미션으로") + '</button></div></main>');
    $("#go").onclick = function () { run(); };
  }

  // ---------- 추가 결제 상황 ----------
  function screenExtraIntro() {
    render(slimHeader() + '<main class="w narrow"><div class="done-card"><div class="check">✓</div><h1>장보기를 모두 마쳤어요</h1>' +
      '<p>마지막으로, 상품 없이 <b>결제 화면만</b> ' + st.plan.extras.length + '번 보여 드립니다.</p>' +
      '<p class="help">화면마다 조건이 조금씩 다릅니다. 평소 나라면 어떤 혜택을 고를지 골라 주세요.</p>' +
      '<button class="btn primary" id="go">계속하기</button></div></main>');
    $("#go").onclick = function () { logEvent("extra_intro_done", "extra"); next(); };
  }

  function extraCheckout(e) {
    checkout({
      phase: "extra", trial_no: e.trial_no, product: null, question_id: e.question_id,
      price: e.price, discount: e.discount, cash: e.cash_amount, condition: e.condition,
      side: e.discount_side, order_no: e.order_no, spec: e.screen, steps: ["주문확인", "주문/결제", "주문완료"],
      done: function () { next(); }
    });
  }

  // ---------- end ----------
  function screenEnd() {
    if (!st.finished) {
      st.finished = true;
      persist();
      save("completions", { participant_id: st.pid, completed_at: nowIso(),
        duration_ms: st.startedMs ? Date.now() - st.startedMs : null });
      logEvent("session_end");
    }
    flush();
    render(slimHeader() + '<main class="w narrow"><div class="done-card"><div class="check">✓</div><h1>1차 설문이 모두 끝났습니다</h1>' +
      '<p>참여해 주셔서 감사합니다. ' + esc(C.followup_when) + ' 뒤 입력하신 이메일로 2차 설문(약 ' + esc(C.time_text_2nd) + ')을 보내 드립니다.</p>' +
      '<p>2차 설문을 마치시면 간단한 결과 점수를 알려 드립니다.</p>' +
      '<p>일정 기간 뒤 당첨되신 분께는 기프티콘도 함께 보내드립니다.</p>' +
      '<p class="help" id="sync"></p>' +
      // for team test runs; set show_restart_button to false before real participants get the link
      (C.show_restart_button ? '<button class="btn ghost" id="restart" disabled>처음부터 다시 하기</button>' : '') +
      '</div></main>');
    (function waitSync() {
      var el = document.getElementById("sync");
      if (!el) return;
      var contact = (C.consent_blanks && C.consent_blanks.pi_contact) || "연구진";
      el.textContent = queue.length
        ? (SAVE.stuck ? "응답이 아직 저장되지 않았습니다. 창을 닫지 말고 잠시 기다려 주세요. 계속 이 문구가 보이면 연구진(" + contact + ")에게 알려 주세요."
                      : "응답을 저장하는 중입니다… 창을 닫지 말아 주세요.")
        : (store("sim_failed") || []).length ? "일부 응답이 저장되지 않았습니다. 이 화면을 캡처해 연구진(" + contact + ")에게 알려 주세요."
        : "응답이 모두 저장되었습니다. 이 창을 닫으셔도 됩니다.";
      if ($("#restart")) $("#restart").disabled = queue.length > 0;
      if (queue.length) setTimeout(waitSync, 1000);
    })();
    if ($("#restart")) $("#restart").onclick = function () { location.href = location.pathname + "?reset=1"; };
  }

  // ---------- start ----------
  function start() {
    var params = new URLSearchParams(location.search);
    // ?reset=1 starts a new participant. A real-participant build (show_restart_button false) ignores it unless
    // the link also has &key=<config.reset_key> (a guard against accidents, not security: config.json is public)
    var resetIgnored = false;
    if (params.get("reset") === "1") {
      if (C.show_restart_button || (C.reset_key && params.get("key") === C.reset_key)) {
        try { localStorage.removeItem(SKEY); } catch (e) { /* ignore */ }
        st = null;
      } else {
        resetIgnored = true;
      }
      history.replaceState(null, "", location.pathname);
    }
    if (!st || !st.pid) {
      var pid = newId();
      // ?mode=pilot marks a pilot participant (kept out of the main analysis); decided once, when the participant starts
      st = { pid: pid, external_id: params.get("pid") || null, is_pilot: params.get("mode") === "pilot", is_synthetic: params.get("mode") === "synthetic",
        started_at: nowIso(), startedMs: Date.now(), step: 0, seq: 0, plan: makePlan(pid), cashBalance: 0, bought: [] };
      persist();
    }
    // the participants row goes first. It is sent again on every page load (duplicates are ignored),
    // so a browser that was mid-survey when the database was cleared or swapped still gets saved
    save("participants", { participant_id: st.pid, external_id: st.external_id, store_name: STORE,
      app_version: C.app_version, user_agent: navigator.userAgent,
      screen: screen.width + "x" + screen.height, is_pilot: !!st.is_pilot, is_synthetic: !!st.is_synthetic,
      config_hash: SIM.config_hash, plan_version: PLAN.version, started_at: st.started_at });
    // rows the server refused earlier (e.g. because that participants row was missing): try once more
    var failed = store("sim_failed") || [];
    if (failed.length) {
      failed.forEach(function (f) { queue.push(f.item); });
      store("sim_failed", []);
      store(QKEY, queue);
    }
    if (resetIgnored) logEvent("reset_ignored", null, null, { step: st.step });
    logEvent("page_load", null, null, { step: st.step, viewport: innerWidth + "x" + innerHeight });
    run();
    flush();
  }

  start();
})();
