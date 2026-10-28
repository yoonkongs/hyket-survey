window.SIM = {
 "config": {
  "store_name": "HYKet",
  "cash_name": "HYKet캐시",
  "pay_name": "HYKet페이 머니",
  "app_version": "2.1",
  "followup_when": "1주",
  "time_text_1st": "21분",
  "time_text_2nd": "11분",
  "consent_blanks": {
   "pi_name": "정윤성, 이나영, Jasmine",
   "pi_contact": "yoons716@naver.com",
   "irb_status": "not_yet",
   "email_retention": "6 month"
  },
  "supabase_url": "https://walspbuoouvqylfrzjqq.supabase.co/rest/v1/",
  "supabase_anon_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbHNwYnVvb3V2cXlsZnJ6anFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzYwODMsImV4cCI6MjEwODc1MjA4M30.HAkPC9_N_1xmCEOApe2fJGiJXL7p1x4aVQQMEOPItzY",
  "shopping_items": [
   "water",
   "bodywash",
   "nuts",
   "cereal",
   "tumbler",
   "powerstrip"
  ],
  "search_results_shown": 4,
  "cart_size": 24,
  "trial_order": "scattered",
  "attention_range": [
   26,
   32
  ],
  "attention_cash": 100,
  "general_months": 3,
  "benefit_text": {
   "heading": "혜택을 하나 고르세요",
   "discount": "카드 즉시 할인 −{discount}",
   "discount_pay": "지금 {pay} 결제",
   "cash": "{cash_name} {cash} 적립",
   "cash_note": "({store_name}에서 현금처럼 쓰는 적립금)",
   "cash_pay": "{pay} 결제 · 다음 장보기부터 바로 사용",
   "cash_pay_extra": "{pay} 결제"
  },
  "general_text": {
   "heading": "결제 방식을 고르세요",
   "lump": "일시불",
   "lump_pay": "{pay} 한 번에 결제",
   "installment": "할부 {months}개월",
   "installment_pay": "월 {monthly}씩 {months}번 결제 (총 {pay})"
  },
  "shopping_budget": 30000,
  "discount": 1000,
  "cash_levels": [
   800,
   1000,
   1200,
   1500,
   2000
  ],
  "extra_questions": [
   {
    "question_id": "P1",
    "order_amount": 20000,
    "discount_amount": 1000,
    "cash_amount": 3000,
    "cash_condition": ""
   },
   {
    "question_id": "P2",
    "order_amount": 20000,
    "discount_amount": 500,
    "cash_amount": 1000,
    "cash_condition": ""
   },
   {
    "question_id": "P3",
    "order_amount": 50000,
    "discount_amount": 3000,
    "cash_amount": 3000,
    "cash_condition": ""
   },
   {
    "question_id": "P4",
    "order_amount": 20000,
    "discount_amount": 1000,
    "cash_amount": 1500,
    "cash_condition": "유효기간 1개월"
   },
   {
    "question_id": "P5",
    "order_amount": 20000,
    "discount_amount": 1000,
    "cash_amount": 1200,
    "cash_condition": "다음 달 1일 지급"
   },
   {
    "question_id": "P6",
    "order_amount": 20000,
    "discount_amount": 2000,
    "cash_amount": 4000,
    "cash_condition": "3만 원 이상 구매 시 사용"
   },
   {
    "question_id": "P7",
    "order_amount": 20000,
    "discount_amount": 1000,
    "cash_amount": 1000,
    "cash_condition": "멤버십 회원 추가 적립 없음"
   }
  ],
  "show_restart_button": true,
  "reset_key": "return_survey"
 },
 "survey": {
  "consent": {
   "intro": "안녕하세요. 한양대학교 대학원 비즈니스인포매틱스학과 석사과정인(정윤성, 이나영, Jasmine)입니다. 이 연구는 사람들이 온라인에서 장을 보고 결제하는 방식을 알아보기 위한 연구입니다.",
   "rows": [
    [
     "진행 방식",
     "오늘 1차 설문(약 {{time_1st}})에 참여하시고, {{followup_when}} 뒤 이메일로 받는 2차 설문(약 {{time_2nd}})에 한 번 더 참여합니다."
    ],
    [
     "가상 결제",
     "<b>결제는 모두 가상입니다.</b> 실제 돈은 나가지 않고, 실제 주문도 이루어지지 않습니다."
    ],
    [
     "감사 선물",
     "2차 설문까지 모두 마치신 분 중 추첨을 통해 10명께 커피 기프티콘을 드립니다. 당첨은 응답 내용과 관계없습니다."
    ],
    [
     "자발적 참여",
     "언제든 중단할 수 있고, 중단해도 불이익이 없습니다. 참여 후에도 자료 삭제를 요청할 수 있습니다."
    ],
    [
     "자료 처리",
     "응답은 연구 목적으로만 사용하며, 분석 단계에서는 이름·이메일 등 식별 정보를 지운 뒤 다룹니다. 식별 정보를 지운 응답 자료는 외부 AI 분석 도구(대형 언어 모델 API)로 처리될 수 있습니다."
    ],
    [
     "이메일",
     "2차 설문 안내와 선물 발송에만 사용하며, 응답 자료와 분리해 보관하고 연구 종료 후 {{email_retention}} 안에 삭제합니다."
    ],
    [
     "문의",
     "연구책임자 {{pi_name}} · {{pi_contact}} · 연구윤리 심의 {{irb_status}}"
    ]
   ],
   "checks": [
    [
     "age_19_plus",
     "만 19세 이상입니다."
    ],
    [
     "agree_participation",
     "위 내용을 읽고 연구 참여에 동의합니다."
    ],
    [
     "agree_email",
     "2차 설문 안내와 선물 발송을 위한 이메일 수집·이용에 동의합니다."
    ]
   ]
  },
  "demographics": [
   {
    "id": "age",
    "no": "Q1",
    "group": "2-A. 나에 대해",
    "label": "나이를 숫자로 적어 주세요.",
    "type": "number",
    "min": 19,
    "max": 99,
    "prefix": "만",
    "suffix": "세"
   },
   {
    "id": "sex",
    "no": "Q2",
    "label": "성별을 골라 주세요.",
    "type": "choice",
    "options": [
     {
      "c": "sex_1",
      "t": "남성"
     },
     {
      "c": "sex_2",
      "t": "여성"
     },
     {
      "c": "sex_3",
      "t": "응답하지 않음"
     }
    ]
   },
   {
    "id": "education",
    "no": "Q3",
    "label": "최종 학력을 골라 주세요.",
    "type": "choice",
    "options": [
     {
      "c": "edu_1",
      "t": "고등학교 졸업 이하"
     },
     {
      "c": "edu_2",
      "t": "대학 재학"
     },
     {
      "c": "edu_3",
      "t": "대학 졸업"
     },
     {
      "c": "edu_4",
      "t": "대학원 재학 이상"
     }
    ]
   },
   {
    "id": "religion",
    "no": "Q4",
    "label": "종교가 있으신가요?",
    "type": "choice",
    "options": [
     {
      "c": "rel_1",
      "t": "있음"
     },
     {
      "c": "rel_2",
      "t": "없음"
     },
     {
      "c": "rel_3",
      "t": "응답하지 않음"
     }
    ]
   },
   {
    "id": "monthly_income",
    "no": "Q5",
    "label": "본인의 한 달 평균 소득(세전)은 어느 정도인가요?",
    "help": "용돈, 아르바이트 수입, 장학금 등 본인이 한 달에 쓸 수 있는 돈을 모두 포함해 주세요.",
    "type": "choice",
    "options": [
     {
      "c": "inc_1",
      "t": "50만 원 미만"
     },
     {
      "c": "inc_2",
      "t": "50만~100만 원 미만"
     },
     {
      "c": "inc_3",
      "t": "100만~200만 원 미만"
     },
     {
      "c": "inc_4",
      "t": "200만~300만 원 미만"
     },
     {
      "c": "inc_5",
      "t": "300만~500만 원 미만"
     },
     {
      "c": "inc_6",
      "t": "500만 원 이상"
     },
     {
      "c": "inc_7",
      "t": "응답하지 않음"
     }
    ]
   },
   {
    "id": "email",
    "no": "Q6",
    "label": "2차 설문 안내와 선물 발송을 받을 이메일을 적어 주세요.",
    "type": "email"
   },
   {
    "id": "main_market",
    "no": "Q7",
    "group": "2-B. 온라인 쇼핑",
    "label": "가장 자주 이용하는 온라인 마켓은 어디인가요?",
    "type": "choice_other",
    "options": [
     {
      "c": "market_1",
      "t": "쿠팡"
     },
     {
      "c": "market_2",
      "t": "네이버 쇼핑"
     },
     {
      "c": "market_3",
      "t": "11번가"
     },
     {
      "c": "market_4",
      "t": "G마켓·옥션"
     },
     {
      "c": "market_5",
      "t": "컬리"
     },
     {
      "c": "market_6",
      "t": "SSG·이마트몰"
     },
     {
      "c": "market_7",
      "t": "아마존"
     },
     {
      "c": "market_8",
      "t": "기타",
      "other": true
     }
    ]
   },
   {
    "id": "purchase_freq",
    "no": "Q8",
    "label": "온라인 마켓(모든 쇼핑몰 포함)에서 얼마나 자주 구매하시나요?",
    "type": "choice",
    "options": [
     {
      "c": "freq_1",
      "t": "월 1회 미만"
     },
     {
      "c": "freq_2",
      "t": "월 1~3회"
     },
     {
      "c": "freq_3",
      "t": "주 1회 정도"
     },
     {
      "c": "freq_4",
      "t": "주 2~3회"
     },
     {
      "c": "freq_5",
      "t": "거의 매일"
     }
    ]
   },
   {
    "id": "monthly_spend",
    "no": "Q9",
    "label": "온라인 마켓에서 한 달에 평균 얼마를 쓰시나요?",
    "type": "choice",
    "options": [
     {
      "c": "spend_1",
      "t": "5만 원 미만"
     },
     {
      "c": "spend_2",
      "t": "5만~10만 원 미만"
     },
     {
      "c": "spend_3",
      "t": "10만~20만 원 미만"
     },
     {
      "c": "spend_4",
      "t": "20만~40만 원 미만"
     },
     {
      "c": "spend_5",
      "t": "40만 원 이상"
     }
    ]
   },
   {
    "id": "memberships",
    "no": "Q10",
    "label": "가입한 유료 멤버십을 모두 골라 주세요.",
    "type": "multi",
    "options": [
     {
      "c": "mem_1",
      "t": "쿠팡 와우"
     },
     {
      "c": "mem_2",
      "t": "네이버플러스 멤버십"
     },
     {
      "c": "mem_3",
      "t": "컬리멤버스"
     },
     {
      "c": "mem_4",
      "t": "신세계 유니버스 클럽"
     },
     {
      "c": "mem_5",
      "t": "아마존 프라임"
     },
     {
      "c": "mem_6",
      "t": "기타",
      "other": true
     },
     {
      "c": "mem_7",
      "t": "없음",
      "exclusive": true
     }
    ]
   },
   {
    "id": "payment_method",
    "no": "Q11",
    "label": "온라인에서 결제할 때 주로 쓰는 결제 수단은 무엇인가요?",
    "type": "choice_other",
    "options": [
     {
      "c": "pay_1",
      "t": "신용카드"
     },
     {
      "c": "pay_2",
      "t": "체크카드"
     },
     {
      "c": "pay_3",
      "t": "간편결제(네이버페이·카카오페이 등)"
     },
     {
      "c": "pay_4",
      "t": "계좌이체·무통장입금"
     },
     {
      "c": "pay_5",
      "t": "기타",
      "other": true
     }
    ]
   },
   {
    "id": "store_cash_use",
    "no": "Q12",
    "label": "쇼핑몰 안에서만 쓸 수 있는 포인트나 적립금을 써 본 적이 있나요?",
    "help": "예: 네이버페이 포인트, SSG머니처럼 결제할 때 쌓이고 그 쇼핑몰에서 현금처럼 쓰는 돈",
    "type": "choice",
    "options": [
     {
      "c": "cash_1",
      "t": "자주 쌓고 자주 쓴다"
     },
     {
      "c": "cash_2",
      "t": "가끔 쓴다"
     },
     {
      "c": "cash_3",
      "t": "쌓인 적은 있지만 거의 안 쓴다"
     },
     {
      "c": "cash_4",
      "t": "써 본 적 없다 / 잘 모르겠다"
     }
    ]
   }
  ],
  "note": {
   "no": "Q13",
   "question": "평소 하시는 생활용품 장보기를 가족이나 지인에게 대신 부탁한다고 상상해 보세요. 그분께 남길 쪽지를 써 주세요.",
   "help": "무엇을 고려해서 골라 달라고 하시겠어요? 꼭 원하는 것과 절대 싫은 것까지 자유롭게 적어 주세요. (예: 가격, 브랜드, 리뷰, 배송, 용량, 결제 방법 등)",
   "hint": "2~5문장 · 최소 50자",
   "min_chars": 50
  },
  "payment_style": {
   "group_q14": "4-A. 최근 결제 경험",
   "q14": "Q14. 최근 온라인에서 결제하다가 할인, 적립, 쿠폰, 할부 같은 혜택 때문에 잠깐이라도 고민한 적이 있다면 짧게 적어 주세요.",
   "q14_help": "어떤 상황이었는지, 무엇을 골랐는지, 왜 그랬는지 적어 주시면 됩니다. 떠오르지 않으면 “없음”이라고 적어 주세요.",
   "q14_hint": "1~3문장",
   "group_q15": "4-B. 나는 결제할 때 이런 편이다",
   "q15": "Q15. 나는 결제할 때 이런 편이다",
   "q15_help": "각 문장이 나와 얼마나 비슷한지 골라 주세요. 정답은 없습니다.",
   "scale": [
    "전혀 아니다",
    "아니다",
    "보통이다",
    "그렇다",
    "매우 그렇다"
   ],
   "items": [
    "나중에 받을 더 큰 혜택보다, 지금 바로 받는 작은 혜택이 더 끌린다.",
    "다음에 쓸 수 있는 혜택은 결국 잊어버리는 경우가 많다.",
    "내가 가진 포인트나 적립금이 얼마인지 대체로 알고 있다.",
    "포인트를 모아 두었다가 한 번에 쓰는 것이 뿌듯하다.",
    "포인트나 적립금의 유효기간이 지나 사라진 적이 자주 있다.",
    "결제 버튼을 누르는 순간 돈이 나간다는 느낌이 크게 든다.",
    "결제 금액이 조금이라도 줄어들면 기분이 확실히 좋아진다.",
    "결제 전에 쓸 수 있는 쿠폰이나 할인이 없는지 꼭 찾아본다.",
    "할인 코드가 없으면 결제를 미룬 적이 있다.",
    "혜택이 여러 개면 무엇이 이득인지 계산해 보고 고른다.",
    "혜택 고르는 게 복잡하면 그냥 처음 선택된 대로 결제한다.",
    "큰 금액은 할부로 나누어 내는 편이다.",
    "무이자 할부가 있으면 조금 더 비싼 물건을 사기도 한다.",
    "배송이 빠르면 조금 비싸도 그 상품을 산다.",
    "리뷰를 꼼꼼히 읽고 나서 산다.",
    "이 문항에는 ‘그렇다’를 골라 주세요."
   ],
   "check_item_no": 16,
   "check_answer": 4
  },
  "preference": {
   "question": "Q16. 온라인에서 생활용품을 살 때 아래 6가지를 얼마나 중요하게 보시나요? 합이 100이 되도록 점수를 나눠 주세요.",
   "help": "예를 들어 가격만 보신다면 가격에 100점, 모두 비슷하게 보신다면 고르게 나누시면 됩니다. 오른쪽 예시처럼 “두 상품이 이만큼 다르면 얼마나 신경 쓰이는지”를 떠올려 주세요.",
   "items": [
    [
     "price",
     "가격",
     "같은 상품이 9,900원 vs 14,900원"
    ],
    [
     "rating",
     "별점",
     "별점 4.8 vs 별점 4.1"
    ],
    [
     "review_count",
     "리뷰 수",
     "리뷰 5만 개 vs 리뷰 300개"
    ],
    [
     "fast_delivery",
     "빠른 배송",
     "내일 도착 vs 4~5일 뒤 도착"
    ],
    [
     "unit_price",
     "단위당 가격",
     "100ml당 41원 vs 100ml당 50원 (큰 용량이 더 쌀 때)"
    ],
    [
     "payment_benefit",
     "결제 혜택",
     "카드 할인·적립·쿠폰 같은 결제 혜택이 있음 vs 없음"
    ]
   ]
  },
  "captcha": {
   "targets": [
    [
     "토끼",
     [
      "🐰",
      "🐇"
     ]
    ],
    [
     "고양이",
     [
      "🐱",
      "🐈"
     ]
    ],
    [
     "자동차",
     [
      "🚗",
      "🚙"
     ]
    ],
    [
     "사과",
     [
      "🍎",
      "🍏"
     ]
    ],
    [
     "강아지",
     [
      "🐶",
      "🐕"
     ]
    ]
   ],
   "distractors": [
    "🐻",
    "🐼",
    "🦊",
    "🐸",
    "🐵",
    "🚲",
    "🚌",
    "🍌",
    "🍇",
    "🌳",
    "🌻",
    "⚽",
    "🏠",
    "🐟",
    "🐦",
    "🍓"
   ]
  }
 },
 "products": [
  {
   "product_id": "PRD001",
   "category": "생활용품",
   "item_key": "water",
   "item_name": "생수",
   "aliases": [
    "생수",
    "물",
    "워터"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "무라벨 생수, 2L, 12개",
   "list_price": 14980,
   "price": 11900,
   "unit_price": "(100ml당 50원)",
   "rating": 4.7,
   "review_count": 1972,
   "delivery": "내일 도착 보장",
   "default_rank": 5,
   "set_code": "A1",
   "role": "search"
  },
  {
   "product_id": "PRD002",
   "category": "생활용품",
   "item_key": "water",
   "item_name": "생수",
   "aliases": [
    "생수",
    "물",
    "워터"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "그린 무라벨, 2L, 18개",
   "list_price": 17900,
   "price": 15900,
   "unit_price": "(100ml당 44원)",
   "rating": 4.4,
   "review_count": 2026,
   "delivery": "내일 도착 보장",
   "default_rank": 3,
   "set_code": "A1",
   "role": "search"
  },
  {
   "product_id": "PRD003",
   "category": "생활용품",
   "item_key": "water",
   "item_name": "생수",
   "aliases": [
    "생수",
    "물",
    "워터"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "천연암반수, 2L, 24개",
   "list_price": 25290,
   "price": 19900,
   "unit_price": "(100ml당 41원)",
   "rating": 4.8,
   "review_count": 28442,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "A1",
   "role": "search"
  },
  {
   "product_id": "PRD004",
   "category": "생활용품",
   "item_key": "water",
   "item_name": "생수",
   "aliases": [
    "생수",
    "물",
    "워터"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "무라벨 생수, 500ml, 40개",
   "list_price": 17980,
   "price": 12900,
   "unit_price": "(100ml당 64원)",
   "rating": 4.5,
   "review_count": 9573,
   "delivery": "내일 도착 보장",
   "default_rank": 1,
   "set_code": "A1",
   "role": "search"
  },
  {
   "product_id": "PRD005",
   "category": "생활용품",
   "item_key": "water",
   "item_name": "생수",
   "aliases": [
    "생수",
    "물",
    "워터"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "해양심층수, 1L, 24개",
   "list_price": 29900,
   "price": 24900,
   "unit_price": "(100ml당 104원)",
   "rating": 4.6,
   "review_count": 15070,
   "delivery": "내일 도착 보장",
   "default_rank": 2,
   "set_code": "A1",
   "role": "search"
  },
  {
   "product_id": "PRD006",
   "category": "생활용품",
   "item_key": "bodywash",
   "item_name": "바디워시",
   "aliases": [
    "바디워시",
    "바디",
    "샤워"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "약산성 바디워시, 900ml, 2개",
   "list_price": 19800,
   "price": 13900,
   "unit_price": "(100ml당 772원)",
   "rating": 4.9,
   "review_count": 1391,
   "delivery": "내일 도착 보장",
   "default_rank": 2,
   "set_code": "A2",
   "role": "search"
  },
  {
   "product_id": "PRD007",
   "category": "생활용품",
   "item_key": "bodywash",
   "item_name": "바디워시",
   "aliases": [
    "바디워시",
    "바디",
    "샤워"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "코튼향 바디워시, 1L, 3개",
   "list_price": 27900,
   "price": 21900,
   "unit_price": "(100ml당 730원)",
   "rating": 4.4,
   "review_count": 20163,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "A2",
   "role": "search"
  },
  {
   "product_id": "PRD008",
   "category": "생활용품",
   "item_key": "bodywash",
   "item_name": "바디워시",
   "aliases": [
    "바디워시",
    "바디",
    "샤워"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "보습 바디워시, 1.2L",
   "list_price": 12900,
   "price": 9900,
   "unit_price": "(100ml당 825원)",
   "rating": 4.7,
   "review_count": 6161,
   "delivery": "모레 도착 예정",
   "default_rank": 3,
   "set_code": "A2",
   "role": "search"
  },
  {
   "product_id": "PRD009",
   "category": "생활용품",
   "item_key": "bodywash",
   "item_name": "바디워시",
   "aliases": [
    "바디워시",
    "바디",
    "샤워"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "아로마 바디워시, 750ml, 4개",
   "list_price": 31600,
   "price": 26900,
   "unit_price": "(100ml당 897원)",
   "rating": 4.9,
   "review_count": 28631,
   "delivery": "모레 도착 예정",
   "default_rank": 5,
   "set_code": "A2",
   "role": "search"
  },
  {
   "product_id": "PRD010",
   "category": "생활용품",
   "item_key": "bodywash",
   "item_name": "바디워시",
   "aliases": [
    "바디워시",
    "바디",
    "샤워"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "쿨링 바디워시, 500ml, 3개",
   "list_price": 18900,
   "price": 15900,
   "unit_price": "(100ml당 1,060원)",
   "rating": 4.7,
   "review_count": 2774,
   "delivery": "내일 도착 보장",
   "default_rank": 1,
   "set_code": "A2",
   "role": "search"
  },
  {
   "product_id": "PRD011",
   "category": "먹거리",
   "item_key": "nuts",
   "item_name": "견과류",
   "aliases": [
    "견과",
    "견과류",
    "넛츠",
    "아몬드",
    "하루견과"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "하루한줌 믹스넛, 25g, 30봉",
   "list_price": 24900,
   "price": 18900,
   "unit_price": "(10g당 252원)",
   "rating": 4.7,
   "review_count": 542,
   "delivery": "내일 도착 보장",
   "default_rank": 5,
   "set_code": "B1",
   "role": "search"
  },
  {
   "product_id": "PRD012",
   "category": "먹거리",
   "item_key": "nuts",
   "item_name": "견과류",
   "aliases": [
    "견과",
    "견과류",
    "넛츠",
    "아몬드",
    "하루견과"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "구운 아몬드, 1kg",
   "list_price": 19900,
   "price": 15900,
   "unit_price": "(10g당 159원)",
   "rating": 4.4,
   "review_count": 837,
   "delivery": "내일 도착 보장",
   "default_rank": 1,
   "set_code": "B1",
   "role": "search"
  },
  {
   "product_id": "PRD013",
   "category": "먹거리",
   "item_key": "nuts",
   "item_name": "견과류",
   "aliases": [
    "견과",
    "견과류",
    "넛츠",
    "아몬드",
    "하루견과"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "데일리넛 6종, 20g, 50봉",
   "list_price": 32900,
   "price": 26900,
   "unit_price": "(10g당 269원)",
   "rating": 4.5,
   "review_count": 1074,
   "delivery": "모레 도착 예정",
   "default_rank": 2,
   "set_code": "B1",
   "role": "search"
  },
  {
   "product_id": "PRD014",
   "category": "먹거리",
   "item_key": "nuts",
   "item_name": "견과류",
   "aliases": [
    "견과",
    "견과류",
    "넛츠",
    "아몬드",
    "하루견과"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "무염 캐슈넛, 500g, 2봉",
   "list_price": 25900,
   "price": 21900,
   "unit_price": "(10g당 219원)",
   "rating": 4.7,
   "review_count": 5771,
   "delivery": "내일 도착 보장",
   "default_rank": 3,
   "set_code": "B1",
   "role": "search"
  },
  {
   "product_id": "PRD015",
   "category": "먹거리",
   "item_key": "nuts",
   "item_name": "견과류",
   "aliases": [
    "견과",
    "견과류",
    "넛츠",
    "아몬드",
    "하루견과"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "호두 반태, 1kg",
   "list_price": 14900,
   "price": 12900,
   "unit_price": "(10g당 129원)",
   "rating": 4.6,
   "review_count": 26203,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "B1",
   "role": "search"
  },
  {
   "product_id": "PRD016",
   "category": "먹거리",
   "item_key": "cereal",
   "item_name": "시리얼",
   "aliases": [
    "시리얼",
    "씨리얼",
    "그래놀라",
    "콘푸레이크"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "콘후레이크, 600g, 3개",
   "list_price": 18900,
   "price": 15900,
   "unit_price": "(100g당 883원)",
   "rating": 4.6,
   "review_count": 2393,
   "delivery": "내일 도착 보장",
   "default_rank": 5,
   "set_code": "B2",
   "role": "search"
  },
  {
   "product_id": "PRD017",
   "category": "먹거리",
   "item_key": "cereal",
   "item_name": "시리얼",
   "aliases": [
    "시리얼",
    "씨리얼",
    "그래놀라",
    "콘푸레이크"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "오트 그래놀라, 1kg, 2개",
   "list_price": 25900,
   "price": 21900,
   "unit_price": "(100g당 1,095원)",
   "rating": 4.5,
   "review_count": 19897,
   "delivery": "내일 도착 보장",
   "default_rank": 3,
   "set_code": "B2",
   "role": "search"
  },
  {
   "product_id": "PRD018",
   "category": "먹거리",
   "item_key": "cereal",
   "item_name": "시리얼",
   "aliases": [
    "시리얼",
    "씨리얼",
    "그래놀라",
    "콘푸레이크"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "초코 시리얼, 570g, 2개",
   "list_price": 13900,
   "price": 11900,
   "unit_price": "(100g당 1,044원)",
   "rating": 4.6,
   "review_count": 8442,
   "delivery": "내일 도착 보장",
   "default_rank": 2,
   "set_code": "B2",
   "role": "search"
  },
  {
   "product_id": "PRD019",
   "category": "먹거리",
   "item_key": "cereal",
   "item_name": "시리얼",
   "aliases": [
    "시리얼",
    "씨리얼",
    "그래놀라",
    "콘푸레이크"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "통곡물 시리얼, 500g, 4개",
   "list_price": 22900,
   "price": 18900,
   "unit_price": "(100g당 945원)",
   "rating": 4.7,
   "review_count": 1682,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "B2",
   "role": "search"
  },
  {
   "product_id": "PRD020",
   "category": "먹거리",
   "item_key": "cereal",
   "item_name": "시리얼",
   "aliases": [
    "시리얼",
    "씨리얼",
    "그래놀라",
    "콘푸레이크"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "단백질 시리얼, 400g, 3개",
   "list_price": 29800,
   "price": 24900,
   "unit_price": "(100g당 2,075원)",
   "rating": 4.7,
   "review_count": 9793,
   "delivery": "내일 도착 보장",
   "default_rank": 1,
   "set_code": "B2",
   "role": "search"
  },
  {
   "product_id": "PRD021",
   "category": "잡화",
   "item_key": "tumbler",
   "item_name": "텀블러",
   "aliases": [
    "텀블러",
    "보온병",
    "보냉"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "스테인리스 보온 텀블러, 500ml",
   "list_price": 19900,
   "price": 15900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 2386,
   "delivery": "내일 도착 보장",
   "default_rank": 3,
   "set_code": "C1",
   "role": "search"
  },
  {
   "product_id": "PRD022",
   "category": "잡화",
   "item_key": "tumbler",
   "item_name": "텀블러",
   "aliases": [
    "텀블러",
    "보온병",
    "보냉"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "빨대형 대용량 텀블러, 900ml",
   "list_price": 24900,
   "price": 19900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 2020,
   "delivery": "내일 도착 보장",
   "default_rank": 1,
   "set_code": "C1",
   "role": "search"
  },
  {
   "product_id": "PRD023",
   "category": "잡화",
   "item_key": "tumbler",
   "item_name": "텀블러",
   "aliases": [
    "텀블러",
    "보온병",
    "보냉"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "슬림 진공 텀블러, 350ml",
   "list_price": 14900,
   "price": 11900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 26669,
   "delivery": "내일 도착 보장",
   "default_rank": 5,
   "set_code": "C1",
   "role": "search"
  },
  {
   "product_id": "PRD024",
   "category": "잡화",
   "item_key": "tumbler",
   "item_name": "텀블러",
   "aliases": [
    "텀블러",
    "보온병",
    "보냉"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "손잡이 보냉 텀블러, 1.2L",
   "list_price": 29900,
   "price": 24900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 2244,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "C1",
   "role": "search"
  },
  {
   "product_id": "PRD025",
   "category": "잡화",
   "item_key": "tumbler",
   "item_name": "텀블러",
   "aliases": [
    "텀블러",
    "보온병",
    "보냉"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "세라믹 코팅 텀블러, 600ml",
   "list_price": 26900,
   "price": 21900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 24195,
   "delivery": "모레 도착 예정",
   "default_rank": 2,
   "set_code": "C1",
   "role": "search"
  },
  {
   "product_id": "PRD026",
   "category": "잡화",
   "item_key": "powerstrip",
   "item_name": "멀티탭",
   "aliases": [
    "멀티탭",
    "콘센트",
    "멀티"
   ],
   "searchable": true,
   "brand": "[브랜드 A]",
   "name": "개별 스위치 멀티탭, 4구 1.5m",
   "list_price": 14900,
   "price": 11900,
   "unit_price": "",
   "rating": 4.8,
   "review_count": 1401,
   "delivery": "내일 도착 보장",
   "default_rank": 3,
   "set_code": "C2",
   "role": "search"
  },
  {
   "product_id": "PRD027",
   "category": "잡화",
   "item_key": "powerstrip",
   "item_name": "멀티탭",
   "aliases": [
    "멀티탭",
    "콘센트",
    "멀티"
   ],
   "searchable": true,
   "brand": "[브랜드 B]",
   "name": "USB 겸용 멀티탭, 6구 2m",
   "list_price": 23900,
   "price": 19900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 993,
   "delivery": "내일 도착 보장",
   "default_rank": 4,
   "set_code": "C2",
   "role": "search"
  },
  {
   "product_id": "PRD028",
   "category": "잡화",
   "item_key": "powerstrip",
   "item_name": "멀티탭",
   "aliases": [
    "멀티탭",
    "콘센트",
    "멀티"
   ],
   "searchable": true,
   "brand": "[브랜드 C]",
   "name": "과부하차단 멀티탭, 5구 3m",
   "list_price": 18900,
   "price": 15900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 1022,
   "delivery": "내일 도착 보장",
   "default_rank": 2,
   "set_code": "C2",
   "role": "search"
  },
  {
   "product_id": "PRD029",
   "category": "잡화",
   "item_key": "powerstrip",
   "item_name": "멀티탭",
   "aliases": [
    "멀티탭",
    "콘센트",
    "멀티"
   ],
   "searchable": true,
   "brand": "[브랜드 D]",
   "name": "고용량 멀티탭, 8구 5m",
   "list_price": 31900,
   "price": 26900,
   "unit_price": "",
   "rating": 4.6,
   "review_count": 813,
   "delivery": "모레 도착 예정",
   "default_rank": 5,
   "set_code": "C2",
   "role": "search"
  },
  {
   "product_id": "PRD030",
   "category": "잡화",
   "item_key": "powerstrip",
   "item_name": "멀티탭",
   "aliases": [
    "멀티탭",
    "콘센트",
    "멀티"
   ],
   "searchable": true,
   "brand": "[브랜드 E]",
   "name": "슬림 멀티탭, 3구 1m",
   "list_price": 12900,
   "price": 9900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 28058,
   "delivery": "모레 도착 예정",
   "default_rank": 1,
   "set_code": "C2",
   "role": "search"
  },
  {
   "product_id": "PRD031",
   "category": "생활용품",
   "item_key": "detergent",
   "item_name": "세탁세제",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 F]",
   "name": "고농축 세탁세제, 3L, 2개",
   "list_price": 21900,
   "price": 16900,
   "unit_price": "(100ml당 282원)",
   "rating": 4.8,
   "review_count": 712,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A1",
   "role": "cart"
  },
  {
   "product_id": "PRD032",
   "category": "생활용품",
   "item_key": "shampoo",
   "item_name": "샴푸",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 G]",
   "name": "두피케어 샴푸, 750ml, 2개",
   "list_price": 23900,
   "price": 18900,
   "unit_price": "(100ml당 1,260원)",
   "rating": 4.5,
   "review_count": 23991,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A1",
   "role": "cart"
  },
  {
   "product_id": "PRD033",
   "category": "생활용품",
   "item_key": "tissue",
   "item_name": "화장지",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 H]",
   "name": "3겹 화장지, 30m, 30롤",
   "list_price": 22900,
   "price": 17900,
   "unit_price": "",
   "rating": 4.9,
   "review_count": 13657,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A1",
   "role": "cart"
  },
  {
   "product_id": "PRD034",
   "category": "생활용품",
   "item_key": "toothpaste",
   "item_name": "치약",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 I]",
   "name": "잇몸케어 치약, 120g, 5개",
   "list_price": 16900,
   "price": 12900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 13517,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A1",
   "role": "cart"
  },
  {
   "product_id": "PRD035",
   "category": "생활용품",
   "item_key": "softener",
   "item_name": "섬유유연제",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 J]",
   "name": "섬유유연제, 2.5L, 2개",
   "list_price": 19900,
   "price": 14900,
   "unit_price": "(100ml당 298원)",
   "rating": 4.6,
   "review_count": 2901,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "A2",
   "role": "cart"
  },
  {
   "product_id": "PRD036",
   "category": "생활용품",
   "item_key": "toothbrush",
   "item_name": "칫솔",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 K]",
   "name": "미세모 칫솔, 8입",
   "list_price": 12900,
   "price": 9900,
   "unit_price": "",
   "rating": 4.8,
   "review_count": 669,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A2",
   "role": "cart"
  },
  {
   "product_id": "PRD037",
   "category": "생활용품",
   "item_key": "dishrefill",
   "item_name": "주방세제 리필",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 F]",
   "name": "주방세제 리필, 1.2L, 3개",
   "list_price": 15900,
   "price": 12900,
   "unit_price": "(100ml당 358원)",
   "rating": 4.4,
   "review_count": 5895,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A2",
   "role": "cart"
  },
  {
   "product_id": "PRD038",
   "category": "생활용품",
   "item_key": "soap",
   "item_name": "비누",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 G]",
   "name": "향균 비누, 100g, 10개",
   "list_price": 14900,
   "price": 11900,
   "unit_price": "",
   "rating": 4.6,
   "review_count": 8662,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "A2",
   "role": "cart"
  },
  {
   "product_id": "PRD039",
   "category": "먹거리",
   "item_key": "ramen",
   "item_name": "라면",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 H]",
   "name": "매운 라면, 120g, 20개",
   "list_price": 16900,
   "price": 13900,
   "unit_price": "",
   "rating": 4.6,
   "review_count": 2551,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "B1",
   "role": "cart"
  },
  {
   "product_id": "PRD040",
   "category": "먹거리",
   "item_key": "coffee",
   "item_name": "커피믹스",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 I]",
   "name": "커피믹스, 12g, 180개",
   "list_price": 26900,
   "price": 21900,
   "unit_price": "",
   "rating": 4.9,
   "review_count": 20161,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "B1",
   "role": "cart"
  },
  {
   "product_id": "PRD041",
   "category": "먹거리",
   "item_key": "rice",
   "item_name": "즉석밥",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 J]",
   "name": "즉석밥, 210g, 24개",
   "list_price": 21900,
   "price": 17900,
   "unit_price": "",
   "rating": 4.9,
   "review_count": 381,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "B1",
   "role": "cart"
  },
  {
   "product_id": "PRD042",
   "category": "먹거리",
   "item_key": "seaweed",
   "item_name": "김",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 K]",
   "name": "도시락김, 4g, 30봉",
   "list_price": 14900,
   "price": 11900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 28632,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "B1",
   "role": "cart"
  },
  {
   "product_id": "PRD043",
   "category": "먹거리",
   "item_key": "tuna",
   "item_name": "참치캔",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 F]",
   "name": "살코기 참치, 150g, 10개",
   "list_price": 22900,
   "price": 18900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 27381,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "B2",
   "role": "cart"
  },
  {
   "product_id": "PRD044",
   "category": "먹거리",
   "item_key": "soymilk",
   "item_name": "두유",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 G]",
   "name": "고단백 두유, 190ml, 24팩",
   "list_price": 19900,
   "price": 15900,
   "unit_price": "",
   "rating": 4.8,
   "review_count": 2725,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "B2",
   "role": "cart"
  },
  {
   "product_id": "PRD045",
   "category": "먹거리",
   "item_key": "dumpling",
   "item_name": "냉동만두",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 H]",
   "name": "고기 만두, 1kg, 2봉",
   "list_price": 18900,
   "price": 14900,
   "unit_price": "",
   "rating": 4.6,
   "review_count": 2744,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "B2",
   "role": "cart"
  },
  {
   "product_id": "PRD046",
   "category": "먹거리",
   "item_key": "cupramen",
   "item_name": "컵라면",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 I]",
   "name": "컵라면 멀티팩, 6개입, 4팩",
   "list_price": 15900,
   "price": 12900,
   "unit_price": "",
   "rating": 4.8,
   "review_count": 2168,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "B2",
   "role": "cart"
  },
  {
   "product_id": "PRD047",
   "category": "잡화",
   "item_key": "battery",
   "item_name": "보조배터리",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 J]",
   "name": "고속충전 보조배터리, 10000mAh",
   "list_price": 22900,
   "price": 16900,
   "unit_price": "",
   "rating": 4.4,
   "review_count": 21828,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C1",
   "role": "cart"
  },
  {
   "product_id": "PRD048",
   "category": "잡화",
   "item_key": "mouse",
   "item_name": "무선 마우스",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 K]",
   "name": "저소음 무선 마우스",
   "list_price": 24900,
   "price": 19900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 7853,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C1",
   "role": "cart"
  },
  {
   "product_id": "PRD049",
   "category": "잡화",
   "item_key": "earphone",
   "item_name": "이어폰",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 F]",
   "name": "블루투스 이어폰",
   "list_price": 39900,
   "price": 27900,
   "unit_price": "",
   "rating": 4.5,
   "review_count": 1726,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "C1",
   "role": "cart"
  },
  {
   "product_id": "PRD050",
   "category": "잡화",
   "item_key": "umbrella",
   "item_name": "우산",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 G]",
   "name": "3단 자동 우산",
   "list_price": 16900,
   "price": 12900,
   "unit_price": "",
   "rating": 4.4,
   "review_count": 429,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C1",
   "role": "cart"
  },
  {
   "product_id": "PRD051",
   "category": "잡화",
   "item_key": "towel",
   "item_name": "수건 세트",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 H]",
   "name": "항균 수건 세트, 10매",
   "list_price": 25900,
   "price": 19900,
   "unit_price": "",
   "rating": 4.9,
   "review_count": 4654,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C2",
   "role": "cart"
  },
  {
   "product_id": "PRD052",
   "category": "잡화",
   "item_key": "mousepad",
   "item_name": "마우스패드",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 I]",
   "name": "대형 마우스패드",
   "list_price": 13900,
   "price": 9900,
   "unit_price": "",
   "rating": 4.8,
   "review_count": 2551,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C2",
   "role": "cart"
  },
  {
   "product_id": "PRD053",
   "category": "잡화",
   "item_key": "mug",
   "item_name": "머그컵",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 J]",
   "name": "세라믹 머그컵, 2개",
   "list_price": 15900,
   "price": 12900,
   "unit_price": "",
   "rating": 4.6,
   "review_count": 1847,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": "C2",
   "role": "cart"
  },
  {
   "product_id": "PRD054",
   "category": "잡화",
   "item_key": "flashlight",
   "item_name": "손전등",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 K]",
   "name": "LED 손전등",
   "list_price": 14900,
   "price": 11900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 12389,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": "C2",
   "role": "cart"
  },
  {
   "product_id": "PRD055",
   "category": "생활용품",
   "item_key": "wipes",
   "item_name": "물티슈",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 F]",
   "name": "순한 물티슈, 100매, 10팩",
   "list_price": 21900,
   "price": 15900,
   "unit_price": "",
   "rating": 4.7,
   "review_count": 2470,
   "delivery": "모레 도착 예정",
   "default_rank": 0,
   "set_code": null,
   "role": "general"
  },
  {
   "product_id": "PRD056",
   "category": "생활용품",
   "item_key": "dishsoap",
   "item_name": "주방세제",
   "aliases": [],
   "searchable": false,
   "brand": "[브랜드 G]",
   "name": "주방세제, 1.2L, 3개",
   "list_price": 17900,
   "price": 14900,
   "unit_price": "(100ml당 414원)",
   "rating": 4.7,
   "review_count": 1469,
   "delivery": "내일 도착 보장",
   "default_rank": 0,
   "set_code": null,
   "role": "attention"
  }
 ],
 "config_hash": "0f72972a86ded923"
};
