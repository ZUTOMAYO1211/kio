/* ============================================================
   KIO — 프리셋 & 테마
   프리셋은 "편집 가능한 초기 데이터"일 뿐이다. 불러온 뒤
   이름·사진·설명·가격·카테고리를 전부 수정할 수 있다.
   모든 프리셋은 동일한 스키마를 쓴다 → 모드 전환 = 데이터 교체
   ============================================================ */
(function (global) {
  'use strict';

  /* -- 테마 (매장 설정에서 선택) ---------------------------- */
  var THEMES = [
    { id: 'red',    name: '시그널 레드', accent: '#E23A2B', deep: '#B62A1D', on: '#FFFFFF' },
    { id: 'amber',  name: '앰버',        accent: '#DF8500', deep: '#AF6700', on: '#FFFFFF' },
    { id: 'green',  name: '그린',        accent: '#12805C', deep: '#0B6046', on: '#FFFFFF' },
    { id: 'blue',   name: '블루',        accent: '#1F5FD0', deep: '#17469B', on: '#FFFFFF' },
    { id: 'teal',   name: '틸',          accent: '#0E7C8A', deep: '#0A5C66', on: '#FFFFFF' },
    { id: 'violet', name: '바이올렛',    accent: '#6B3FC4', deep: '#522F99', on: '#FFFFFF' },
    { id: 'crimson',name: '크림슨',      accent: '#C31E4B', deep: '#98163A', on: '#FFFFFF' },
    { id: 'ink',    name: '차콜',        accent: '#2E353D', deep: '#1A1F24', on: '#FFFFFF' }
  ];

  /* -- 썸네일 자동 생성용 웜 듀오톤 팔레트 ------------------ */
  var ART = [
    { a: '#E0B583', base: '#C79157', b: '#96683A' },
    { a: '#9FB0BD', base: '#7C8E9C', b: '#556775' },
    { a: '#B7C49A', base: '#93A377', b: '#6B7A53' },
    { a: '#DDA98F', base: '#C08668', b: '#8E5B42' },
    { a: '#C2A3B5', base: '#9E7C92', b: '#74566B' },
    { a: '#E3D2AC', base: '#C9B489', b: '#9A8760' },
    { a: '#DC9C8A', base: '#C0725E', b: '#8E4B3A' },
    { a: '#A9BFA6', base: '#849D81', b: '#5E755C' },
    { a: '#ADB8C4', base: '#8A97A6', b: '#626F7E' },
    { a: '#E8C68A', base: '#D0A45E', b: '#9E7938' }
  ];

  /* -- 옵션 그룹 묶음 ---------------------------------------- */
  var OG = {
    cafeSize: {
      id: 'og_size', name: '사이즈', type: 'single', required: true,
      options: [
        { id: 'o1', name: '레귤러', price: 0 },
        { id: 'o2', name: '라지', price: 700 }
      ]
    },
    cafeTemp: {
      id: 'og_temp', name: '온도', type: 'single', required: true,
      options: [
        { id: 'o1', name: 'HOT', price: 0 },
        { id: 'o2', name: 'ICE', price: 500 }
      ]
    },
    cafeExtra: {
      id: 'og_extra', name: '추가 옵션', type: 'multi', required: false,
      options: [
        { id: 'o1', name: '샷 추가', price: 500 },
        { id: 'o2', name: '연하게', price: 0 },
        { id: 'o3', name: '휘핑크림', price: 500 },
        { id: 'o4', name: '바닐라 시럽', price: 300 }
      ]
    },
    cafeMilk: {
      id: 'og_milk', name: '우유 변경', type: 'single', required: false,
      options: [
        { id: 'o1', name: '일반 우유', price: 0 },
        { id: 'o2', name: '오트 우유', price: 800 },
        { id: 'o3', name: '두유', price: 500 }
      ]
    },

    ffSet: {
      id: 'og_set', name: '세트 선택', type: 'single', required: true,
      options: [
        { id: 'o1', name: '단품', price: 0 },
        { id: 'o2', name: '세트 (감자튀김 + 음료)', price: 2500 },
        { id: 'o3', name: '라지 세트', price: 3800 }
      ]
    },
    ffDrink: {
      id: 'og_drink', name: '음료 선택', type: 'single', required: false,
      options: [
        { id: 'o1', name: '콜라', price: 0 },
        { id: 'o2', name: '제로 콜라', price: 0 },
        { id: 'o3', name: '아메리카노', price: 500 }
      ]
    },
    ffAdd: {
      id: 'og_add', name: '추가 / 제외', type: 'multi', required: false,
      options: [
        { id: 'o1', name: '패티 추가', price: 2200 },
        { id: 'o2', name: '치즈 추가', price: 700 },
        { id: 'o3', name: '양파 빼기', price: 0 },
        { id: 'o4', name: '피클 빼기', price: 0 }
      ]
    },

    bsSpicy: {
      id: 'og_spicy', name: '맵기', type: 'single', required: true,
      options: [
        { id: 'o1', name: '순한맛', price: 0 },
        { id: 'o2', name: '보통', price: 0 },
        { id: 'o3', name: '매운맛', price: 0 }
      ]
    },
    bsSari: {
      id: 'og_sari', name: '사리 추가', type: 'multi', required: false,
      options: [
        { id: 'o1', name: '라면 사리', price: 1000 },
        { id: 'o2', name: '치즈 사리', price: 1000 },
        { id: 'o3', name: '만두 사리', price: 1500 },
        { id: 'o4', name: '공기밥', price: 1000 }
      ]
    },

    cvHeat: {
      id: 'og_heat', name: '데우기', type: 'single', required: true,
      options: [
        { id: 'o1', name: '그대로 주세요', price: 0 },
        { id: 'o2', name: '데워 주세요', price: 0 }
      ]
    },
    cvBag: {
      id: 'og_bag', name: '봉투', type: 'single', required: false,
      options: [
        { id: 'o1', name: '필요 없어요', price: 0 },
        { id: 'o2', name: '종량제 봉투 (20L)', price: 300 }
      ]
    }
  };

  function og() {
    return Array.prototype.slice.call(arguments).map(function (g) {
      return JSON.parse(JSON.stringify(g));
    });
  }

  /* -- 프리셋 ------------------------------------------------ */
  var PRESETS = [
    /* ---------------------------------------------------- 카페 */
    {
      id: 'cafe',
      label: '카페',
      blurb: '커피 · 티 · 디저트 / 12개 메뉴',
      art: { a: '#3FA37E', base: '#12805C', b: '#0B6046' },
      build: function () {
        return {
          store: {
            name: '온단 로스터스',
            tagline: 'Slow Coffee, Warm Hours',
            headline: '천천히 고르세요.\n기다려 드릴게요.',
            lede: '오늘 볶은 원두로 한 잔씩 내립니다. 품절 메뉴도 숨기지 않고 보여 드려요.',
            logo: '', heroImage: '', theme: 'green', currency: 'KRW'
          },
          settings: { pin: '0000', idleSeconds: 75, warnSeconds: 15, orderTypeEnabled: true },
          categories: [
            { id: 'c1', name: '커피', order: 0, visible: true },
            { id: 'c2', name: '논커피 · 티', order: 1, visible: true },
            { id: 'c3', name: '디저트', order: 2, visible: true }
          ],
          optionGroups: og(OG.cafeSize, OG.cafeTemp, OG.cafeMilk, OG.cafeExtra),
          menus: [
            { id: 'm1',  categoryId: 'c1', name: '오늘의 드립', desc: '매일 바뀌는 싱글 오리진 한 잔. 오늘은 에티오피아 구지.', kcal: 10, price: 5500, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_size'] },
            { id: 'm2',  categoryId: 'c1', name: '아메리카노', desc: '깊고 진한 기본 블렌드', kcal: 15, price: 4000, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size', 'og_temp', 'og_extra'] },
            { id: 'm3',  categoryId: 'c1', name: '카페 라떼', desc: '부드러운 우유와 에스프레소', kcal: 190, price: 4800, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size', 'og_temp', 'og_milk', 'og_extra'] },
            { id: 'm4',  categoryId: 'c1', name: '바닐라 라떼', desc: '바닐라 빈 시럽을 더한 라떼', kcal: 250, price: 5300, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size', 'og_temp', 'og_milk'] },
            { id: 'm5',  categoryId: 'c1', name: '플랫 화이트', desc: '진한 리스트레토 두 샷', kcal: 170, price: 5200, image: '', soldOut: true,  feature: false, optionGroupIds: ['og_size', 'og_milk'] },
            { id: 'm6',  categoryId: 'c2', name: '흑임자 라떼', desc: '고소하게 볶은 흑임자를 갈아 넣었습니다', kcal: 320, price: 5800, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_size', 'og_temp', 'og_milk'] },
            { id: 'm7',  categoryId: 'c2', name: '자몽 에이드', desc: '생자몽 과육이 들어간 상큼한 에이드', kcal: 210, price: 5500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size'] },
            { id: 'm8',  categoryId: 'c2', name: '얼그레이 티', desc: '베르가못 향이 진한 홍차', kcal: 5, price: 4500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size', 'og_temp'] },
            { id: 'm9',  categoryId: 'c2', name: '제주 말차 라떼', desc: '제주산 말차를 곱게 체 쳐서', kcal: 280, price: 5900, image: '', soldOut: false, feature: false, optionGroupIds: ['og_size', 'og_temp', 'og_milk'] },
            { id: 'm10', categoryId: 'c3', name: '바스크 치즈케이크', desc: '겉은 진하게 태우고 속은 촉촉하게', kcal: 430, price: 7500, image: '', soldOut: false, feature: true,  optionGroupIds: [] },
            { id: 'm11', categoryId: 'c3', name: '버터 크루아상', desc: '매일 아침 구워 냅니다', kcal: 340, price: 4200, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm12', categoryId: 'c3', name: '레몬 파운드', desc: '레몬 제스트를 넣은 묵직한 파운드', kcal: 390, price: 4800, image: '', soldOut: true,  feature: false, optionGroupIds: [] }
          ]
        };
      }
    },

    /* ---------------------------------------------- 패스트푸드 */
    {
      id: 'fastfood',
      label: '패스트푸드',
      blurb: '버거 · 사이드 · 음료 / 11개 메뉴',
      art: { a: '#EE6E5F', base: '#E23A2B', b: '#B62A1D' },
      build: function () {
        return {
          store: {
            name: '더블패티 버거',
            tagline: 'Hot Off The Grill',
            headline: '갓 구운 패티,\n지금 나갑니다.',
            lede: '세트 구성과 추가 옵션을 한 화면에서 고르실 수 있어요.',
            logo: '', heroImage: '', theme: 'red', currency: 'KRW'
          },
          settings: { pin: '0000', idleSeconds: 75, warnSeconds: 15, orderTypeEnabled: true },
          categories: [
            { id: 'c1', name: '버거', order: 0, visible: true },
            { id: 'c2', name: '사이드', order: 1, visible: true },
            { id: 'c3', name: '음료', order: 2, visible: true }
          ],
          optionGroups: og(OG.ffSet, OG.ffDrink, OG.ffAdd),
          menus: [
            { id: 'm1',  categoryId: 'c1', name: '더블패티 클래식', desc: '100% 순쇠고기 패티 두 장, 체다 치즈, 특제 소스', kcal: 860, price: 8900, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_set', 'og_drink', 'og_add'] },
            { id: 'm2',  categoryId: 'c1', name: '치즈버거', desc: '녹진한 체다 치즈 한 장', kcal: 520, price: 5900, image: '', soldOut: false, feature: false, optionGroupIds: ['og_set', 'og_drink', 'og_add'] },
            { id: 'm3',  categoryId: 'c1', name: '불고기버거', desc: '달큰한 불고기 소스', kcal: 560, price: 6400, image: '', soldOut: false, feature: false, optionGroupIds: ['og_set', 'og_drink', 'og_add'] },
            { id: 'm4',  categoryId: 'c1', name: '스파이시 치킨', desc: '통닭다리살에 매콤한 시즈닝', kcal: 610, price: 7200, image: '', soldOut: false, feature: false, optionGroupIds: ['og_set', 'og_drink', 'og_add'] },
            { id: 'm5',  categoryId: 'c1', name: '새우버거', desc: '통새우살을 뭉쳐 튀겼습니다', kcal: 490, price: 6800, image: '', soldOut: true,  feature: false, optionGroupIds: ['og_set', 'og_drink'] },
            { id: 'm6',  categoryId: 'c2', name: '감자튀김', desc: '겉은 바삭, 속은 포슬포슬', kcal: 320, price: 2800, image: '', soldOut: false, feature: true,  optionGroupIds: [] },
            { id: 'm7',  categoryId: 'c2', name: '치즈스틱 3조각', desc: '쭉 늘어나는 모짜렐라', kcal: 340, price: 3900, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm8',  categoryId: 'c2', name: '어니언링', desc: '두툼하게 썬 양파링', kcal: 290, price: 3400, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm9',  categoryId: 'c3', name: '콜라', desc: '', kcal: 140, price: 2000, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm10', categoryId: 'c3', name: '제로 콜라', desc: '', kcal: 0, price: 2000, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm11', categoryId: 'c3', name: '아메리카노', desc: '', kcal: 15, price: 2500, image: '', soldOut: false, feature: false, optionGroupIds: [] }
          ]
        };
      }
    },

    /* -------------------------------------------- 분식 · 식당 */
    {
      id: 'bunsik',
      label: '분식 · 식당',
      blurb: '분식 · 밥 · 면 / 11개 메뉴',
      art: { a: '#F0AC4E', base: '#DF8500', b: '#AF6700' },
      build: function () {
        return {
          store: {
            name: '골목 분식',
            tagline: '1994년부터 그 자리',
            headline: '오늘도 그 맛,\n그대로입니다.',
            lede: '맵기와 사리는 원하시는 대로 골라 담으세요.',
            logo: '', heroImage: '', theme: 'amber', currency: 'KRW'
          },
          settings: { pin: '0000', idleSeconds: 75, warnSeconds: 15, orderTypeEnabled: true },
          categories: [
            { id: 'c1', name: '분식', order: 0, visible: true },
            { id: 'c2', name: '밥 · 면', order: 1, visible: true },
            { id: 'c3', name: '사이드', order: 2, visible: true }
          ],
          optionGroups: og(OG.bsSpicy, OG.bsSari),
          menus: [
            { id: 'm1',  categoryId: 'c1', name: '옛날 떡볶이', desc: '30년째 같은 고추장 배합. 밀떡으로 나갑니다.', kcal: 520, price: 5000, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_spicy', 'og_sari'] },
            { id: 'm2',  categoryId: 'c1', name: '로제 떡볶이', desc: '크림과 고추장을 반반', kcal: 680, price: 6500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_spicy', 'og_sari'] },
            { id: 'm3',  categoryId: 'c1', name: '모둠 튀김', desc: '오징어 · 김말이 · 고구마 · 만두', kcal: 610, price: 5500, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm4',  categoryId: 'c1', name: '순대 한 접시', desc: '찰순대에 간을 곁들여', kcal: 450, price: 6000, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm5',  categoryId: 'c1', name: '치즈 김말이', desc: '', kcal: 380, price: 4500, image: '', soldOut: true,  feature: false, optionGroupIds: [] },
            { id: 'm6',  categoryId: 'c2', name: '김치볶음밥', desc: '묵은지를 들기름에 볶아 냅니다', kcal: 690, price: 7500, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_spicy'] },
            { id: 'm7',  categoryId: 'c2', name: '잔치국수', desc: '멸치 육수를 하루 우려서', kcal: 480, price: 6000, image: '', soldOut: false, feature: false, optionGroupIds: ['og_sari'] },
            { id: 'm8',  categoryId: 'c2', name: '비빔국수', desc: '새콤달콤 매콤하게', kcal: 540, price: 6500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_spicy', 'og_sari'] },
            { id: 'm9',  categoryId: 'c2', name: '라면', desc: '계란 하나 풀어서', kcal: 500, price: 4000, image: '', soldOut: false, feature: false, optionGroupIds: ['og_sari'] },
            { id: 'm10', categoryId: 'c3', name: '김밥 한 줄', desc: '', kcal: 320, price: 3500, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm11', categoryId: 'c3', name: '계란말이', desc: '', kcal: 290, price: 5000, image: '', soldOut: false, feature: false, optionGroupIds: [] }
          ]
        };
      }
    },

    /* -------------------------------------- 편의점 · 간식 */
    {
      id: 'convenience',
      label: '편의점 · 간식',
      blurb: '음료 · 스낵 · 간편식 / 12개 메뉴',
      art: { a: '#5A8CE4', base: '#1F5FD0', b: '#17469B' },
      build: function () {
        return {
          store: {
            name: '스물네시 스토어',
            tagline: 'Open 24 Hours',
            headline: '필요한 건\n여기 다 있어요.',
            lede: '데우기 여부와 봉투는 담으면서 바로 고르실 수 있습니다.',
            logo: '', heroImage: '', theme: 'blue', currency: 'KRW'
          },
          settings: { pin: '0000', idleSeconds: 90, warnSeconds: 15, orderTypeEnabled: false },
          categories: [
            { id: 'c1', name: '간편식', order: 0, visible: true },
            { id: 'c2', name: '음료', order: 1, visible: true },
            { id: 'c3', name: '스낵', order: 2, visible: true },
            { id: 'c4', name: '생활용품', order: 3, visible: true }
          ],
          optionGroups: og(OG.cvHeat, OG.cvBag),
          menus: [
            { id: 'm1',  categoryId: 'c1', name: '불고기 도시락', desc: '밥 · 불고기 · 반찬 세 가지', kcal: 620, price: 4900, image: '', soldOut: false, feature: true,  optionGroupIds: ['og_heat', 'og_bag'] },
            { id: 'm2',  categoryId: 'c1', name: '참치마요 삼각김밥', desc: '', kcal: 200, price: 1500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_heat'] },
            { id: 'm3',  categoryId: 'c1', name: '치즈 핫도그', desc: '', kcal: 290, price: 2500, image: '', soldOut: false, feature: false, optionGroupIds: ['og_heat'] },
            { id: 'm4',  categoryId: 'c1', name: '컵라면', desc: '뜨거운 물은 옆에 있습니다', kcal: 340, price: 1800, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm5',  categoryId: 'c2', name: '아이스 아메리카노', desc: '', kcal: 10, price: 1800, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm6',  categoryId: 'c2', name: '생수 500ml', desc: '', kcal: 0, price: 900, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm7',  categoryId: 'c2', name: '이온음료', desc: '', kcal: 120, price: 1900, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm8',  categoryId: 'c2', name: '딸기 우유', desc: '', kcal: 180, price: 1700, image: '', soldOut: true,  feature: false, optionGroupIds: [] },
            { id: 'm9',  categoryId: 'c3', name: '감자칩 오리지널', desc: '', kcal: 350, price: 1700, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm10', categoryId: 'c3', name: '초코 쿠키', desc: '', kcal: 240, price: 2200, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm11', categoryId: 'c4', name: '종량제 봉투 20L', desc: '', kcal: 0, price: 500, image: '', soldOut: false, feature: false, optionGroupIds: [] },
            { id: 'm12', categoryId: 'c4', name: '우산', desc: '갑자기 비가 올 때', kcal: 0, price: 5000, image: '', soldOut: false, feature: false, optionGroupIds: [] }
          ]
        };
      }
    },

    /* ------------------------------------------- 빈 템플릿 */
    {
      id: 'blank',
      label: '빈 템플릿',
      blurb: '처음부터 직접 구성 / 0개 메뉴',
      art: { a: '#6C757F', base: '#2E353D', b: '#1A1F24' },
      build: function () {
        return {
          store: {
            name: '새 매장',
            tagline: 'Self Order Kiosk',
            headline: '주문을\n시작해 볼까요?',
            lede: '로고를 다섯 번 눌러 편집 모드로 들어가면 메뉴를 추가할 수 있습니다.',
            logo: '', heroImage: '', theme: 'ink', currency: 'KRW'
          },
          settings: { pin: '0000', idleSeconds: 90, warnSeconds: 15, orderTypeEnabled: false },
          categories: [
            { id: 'c1', name: '기본', order: 0, visible: true }
          ],
          optionGroups: [],
          menus: []
        };
      }
    }
  ];

  global.KIO_PRESETS = PRESETS;
  global.KIO_THEMES = THEMES;
  global.KIO_ART = ART;

})(window);
