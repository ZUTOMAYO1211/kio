# KIO 프로젝트 컨텍스트

이 파일은 **AI 에이전트가 이 저장소를 처음 열었을 때 읽는 안내서**다.
Claude Code 는 `CLAUDE.md` 를 자동으로 컨텍스트에 넣는다. 다른 AI 도구를 쓴다면
이 파일을 직접 붙여 넣으면 된다.

작업을 시작하기 전에 **"함정" 절은 반드시 읽어라.** 이 프로젝트에서 실제로 터졌던
버그와 그 원인이 들어 있고, 대부분 다시 밟기 쉬운 것들이다.

---

## 1. 한 줄 요약

실제 매장 키오스크의 주문 UX 를 웹으로 재현하고, 쓰면서 불편했던 지점을 개선한
**개인 제작 시뮬레이터**. 빌드 도구 없이 HTML / CSS / Vanilla JS 로만 만들었고
데이터는 전부 브라우저 `localStorage` 에 남는다.

- 배포: <https://zutomayo1211.github.io/kio/>
- 저장소: <https://github.com/ZUTOMAYO1211/kio> (public, GitHub Pages, `main` / root)
- 수익화 없음. 포트폴리오 / 학습용.

---

## 2. 왜 만들었나

원본 기획은 `PLAN.md` 에 있다. 요지는 이렇다.

매장 키오스크를 쓰다 보면 반복해서 겪는 불편이 있다. 품절이라 메뉴가 사라져서
있었는지 없었는지 헤매고, 글씨가 작아 읽기 힘들고, 잠깐 고민하는 사이 화면이
초기화되고, 지금까지 뭘 담았는지 확인하려면 화면을 옮겨야 한다.

그래서 **그 네 가지를 고친 키오스크**를 만드는 것이 이 프로젝트의 목적이다.
단순히 키오스크를 흉내 내는 게 아니라, 개선안을 실제로 만져 볼 수 있는 형태로
증명하는 것이 핵심이다. 아래 4절의 "차별점"이 이 프로젝트의 존재 이유다.

여기에 더해, 한 업종에만 맞춘 하드코딩이 아니라 **누구나 자기 매장을 구성해 볼 수
있게** 관리자 편집 모드를 붙였다. 프리셋은 완제품이 아니라 편집 가능한 초기
데이터일 뿐이다.

---

## 3. 절대 바꾸면 안 되는 제약

기획서에서 온 제약이다. 이걸 어기는 제안은 하지 마라.

| 제약 | 이유 |
|---|---|
| **빌드 도구 · 프레임워크 없음** | npm, 번들러, React 전부 없다. `index.html` 을 열면 그대로 돈다 |
| **서버 없음** | 모든 상태는 `localStorage`. 백엔드 · DB · 로그인 없음 |
| **진입점은 `index.html`, 정적 호스팅** | GitHub Pages 에 그대로 올라간다. 빌드 단계가 생기면 배포가 깨진다 |
| **결제는 전부 모의** | 실제 결제 연동 없고, 카드 정보를 절대 입력받지 않는다 |
| **기준 캔버스 1080 × 1920** | 아래 5절 참고. 이 좌표계를 벗어나면 스케일링이 깨진다 |

의존성은 **웹폰트 하나뿐**이다. Pretendard (jsDelivr CDN). 그 외 외부 자산 0개.

---

## 4. 이 프로젝트의 존재 이유 (차별점 4가지)

기능을 추가하거나 리디자인할 때 **이 넷을 훼손하면 안 된다.**

1. **품절 메뉴 명시**
   품절이어도 목록에서 빼지 않는다. 사진을 회색 처리하고 그 위에 `품절` 배지를
   얹어, 그 메뉴가 있었다는 사실 자체를 남긴다. 메뉴가 사라져서 헤매는 상황을 막는다.
   → `css/customer.css` 의 `.tile.is-out`, `.tile__out`

2. **큰 글씨 모드**
   토글 하나로 글씨와 터치 영역이 함께 커진다. 설정은 기기에 기억된다.
   그리드 열 수도 4열에서 3열로 바뀌고 페이지당 개수가 다시 계산된다.
   → `.is-large` 클래스가 `--ts`, `--touch*`, `--rail-w` 등을 통째로 올린다

3. **무동작 타임아웃 안내**
   갑자기 초기화되지 않는다. 카운트다운 링과 함께 "계속하기 / 처음으로"를 먼저
   묻는다. 계속하면 담아 둔 장바구니가 그대로 남는다.
   → `js/app.js` 의 `warnIdle()`. 감시 대상은 `WATCHED` 배열

4. **장바구니 상시 노출**
   하단 고정 바가 비어 있을 때도 사라지지 않고, 담긴 수량과 금액을 계속 보여 준다.
   금액이 바뀌면 바뀐 자릿수만 넘어간다 (스플릿플랩).
   → `js/customer.js` 의 `renderPayBar()`, `js/ui.js` 의 `flap()`

---

## 5. 화면 좌표계 (가장 먼저 이해해야 할 것)

**CSS 의 `px` 는 기기 픽셀이 아니라 "키오스크 픽셀"이다.**

모든 치수는 1080 × 1920 캔버스 기준으로 작성한다. `js/app.js` 의 `fit()` 이
뷰포트에 맞춰 스테이지 전체를 `transform: scale()` 한다.

| 환경 | 동작 |
|---|---|
| 휴대폰 (세로) | 화면을 꽉 채운다. **메인 테스트 환경** |
| PC (가로) | 화면 중앙에 세로 9:16 키오스크 프레임 + 기기 베젤 |

계산은 `(vw / vh) > (1080 / 1920) * 1.06` 이면 프레임 모드, 아니면 꽉 채움 모드다.
꽉 채움 모드에서는 스테이지 높이가 1920 보다 커질 수 있으므로
**모든 화면은 `min-height` 가 아니라 flex 로 늘어나야 한다.**

### 터치 영역 환산

`--touch: 168px` (키오스크 px) ≈ **61 CSS px** (390pt 폭 휴대폰 기준).
기획서의 60px 하한을 실제 테스트 기기에서 넘긴다. 큰 글씨 모드에서는 196px.

새 인터랙티브 요소를 만들 때 `--touch` 보다 작게 잡지 마라.

---

## 6. 파일 구조

```
index.html          모든 화면의 뼈대. 화면은 전부 DOM 에 있고 클래스로 전환한다
CLAUDE.md           이 파일
README.md           사람용 문서 (실행 · 배포 · 디자인 방향)
PLAN.md             원본 기획서. 범위와 보류 항목의 근거

css/tokens.css      디자인 토큰. 색 · 타입 스케일 · 여백 · 반경 · 모션 · z 레이어
css/base.css        리셋, 데스크/기기/스테이지, 화면 전환, 스크롤 영역
css/components.css  버튼 · 배지 · 스테퍼 · 선택행 · 폼 · 시트 · 다이얼로그 · 토스트 · 썸네일
css/customer.css    손님 화면 7종
css/admin.css       관리자 편집 모드

js/presets.js       프리셋 5종 · 테마 8종 · 썸네일 팔레트. 순수 데이터
js/store.js         상태 · localStorage · 스키마 정규화 · 장바구니 · 주문 · 이미지 리사이즈
js/ui.js            아이콘 · 썸네일 · 스플릿플랩 · 시트 · 다이얼로그 · 토스트
js/customer.js      손님 화면 렌더링과 이벤트
js/admin.js         편집 모드 렌더링과 이벤트
js/app.js           스케일링 · 테마 · 라우팅 · 타임아웃 · 관리자 진입 · 부팅

.claude/serve.js    로컬 정적 서버 (README 가 이걸 안내한다)
.claude/launch.json Claude Code 프리뷰 설정
```

로드 순서가 곧 의존 순서다: `presets → store → ui → customer → admin → app`.
`app.js` 가 마지막에 `boot()` 한다.

---

## 7. 화면 (라우트)

전환은 `KIO_APP.go(name, dir)`. `dir` 이 `'back'` 이면 역방향 애니메이션.
화면은 `<section class="screen ..." data-screen="...">` 로 전부 DOM 에 있고
`.is-active` 클래스로 하나만 보인다.

| `data-screen` | 클래스 | 역할 |
|---|---|---|
| `idle` | `.home` | **홈.** 큰 사진 한 장을 중간 위에, 그 아래 주문 시작하기 + 큰 글씨 모드. 로고 5회 탭이 관리자 진입구 |
| `ordertype` | `.otype` | 매장 식사 / 포장 선택. `settings.orderTypeEnabled` 가 false 면 건너뛴다 |
| `menu` | `.shop` | **주력 화면.** 상단 카테고리 탭 + 4열 3행 페이지 그리드 + 하단 결제 바 |
| `item` | `.item` | 상품 상세. 사진 · 가격 · 열량 · 옵션 그룹 · 수량. 하단에 합계와 담기 |
| `cart` | `.cart` | 주문 내역. 수량 조절 · 삭제 · 합계 · 전체 취소 / 더 담기 / 결제하기 |
| `pay` | `.pay` | 결제 수단 선택 후 모의 진행. 카드는 리더기 삽화 애니메이션 |
| `done` | `.done` | 주문번호 · 영수증 요약 · 12초 후 자동 복귀 |
| `pin` | `.pin` | 관리자 PIN 4자리. 초기값 `0000` |
| `admin` | `.admin` | 편집 모드 (아래 8절) |

> **주의**: 홈 화면의 라우트 id 는 역사적 이유로 `idle` 이지만 클래스는 `home` 이다.
> `data-screen="idle"` 을 바꾸면 라우팅이 깨진다.

### 뒤로 가기 매핑 (`js/app.js` 의 `BACK`)

```
ordertype -> idle
menu      -> ordertype (주문유형 켜져 있을 때) / idle
item      -> menu
cart      -> menu
pay       -> cart
pin       -> idle
```

기획서는 "되돌리기 버튼"을 보류로 뒀지만, 없으면 잘못 누른 손님이 갇힌다.
보류 사유였던 화면 이력 스택은 만들지 않고 **고정 선형 매핑**만 뒀다.

---

## 8. 관리자 편집 모드

**진입**: 홈 화면의 매장 로고를 **3초 안에 5번** 탭 → PIN 화면 → `0000`.
3번째 탭부터 "N번 더 누르면 편집 모드" 토스트가 뜬다.

상단 탭 6개 (`js/admin.js` 의 `SECTIONS`):

| 탭 | 하는 일 |
|---|---|
| **매장 설정** | 매장명 · 태그라인 · 홈 문구 · 보조 설명 · 로고 · 시작 화면 이미지 · 테마 색상 · 통화 · 주문유형 화면 on/off · 큰 글씨 기본값 · 무동작 타임아웃 · 관리자 PIN |
| **카테고리** | 추가 / 이름 변경 / 순서 이동 / 표시 여부 토글 / 삭제 (안의 메뉴도 함께) |
| **메뉴** | 카테고리별로 묶어 표시. 추가 · 편집 시트 · 순서 이동. 편집 항목은 이름 · 설명 · 가격 · 열량 · 카테고리 · 사진 · 품절 · 대표 · 옵션 그룹 연결 |
| **옵션 그룹** | 단일 / 중복 선택, 필수 여부, 옵션별 추가금. 여러 메뉴가 공유한다 |
| **데이터** | 프리셋 5종 불러오기, 저장 용량 미터, 전체 초기화 |
| **주문 로그** | 완료된 모의 주문 최근 60건. 전체 삭제 |

**자동 저장**이다. 타이핑은 320ms 디바운스 후 커밋한다.
타이핑 중에는 패널을 다시 그리지 않는다 (포커스와 커서를 지키려고).
구조가 바뀌는 조작(추가 · 삭제 · 순서 · 토글)만 `commitNow()` 로 즉시 커밋 + 재렌더.

**이미지**: 업로드하면 캔버스로 최대 720px 로 줄이고 JPEG 0.72 로 base64 변환한다.
URL 입력도 가능. 900KB 를 넘으면 경고 토스트.

---

## 9. 데이터 스키마

`js/store.js` 의 `normalize()` 가 **어떤 경로로 들어온 데이터든 이 모양으로 강제**한다.
새 필드를 추가하려면 반드시 `normalize()` 에도 넣어라. 넣지 않으면 저장 후 사라진다.

```js
config = {
  store: {
    name, tagline, headline, lede,   // headline 은 \n 을 <br> 로 렌더
    logo, heroImage,                 // '' 또는 base64 또는 외부 URL
    theme,                           // KIO_THEMES 의 id 여야 한다
    currency                         // KRW | USD | JPY | EUR
  },
  settings: {
    pin,                             // 숫자 4자리, 아니면 '0000'
    idleSeconds,                     // 20..600, 기본 75
    warnSeconds,                     // 5..60, 기본 15
    orderTypeEnabled                 // false 면 주문유형 화면을 건너뛴다
  },
  categories:   [ { id, name, order, visible } ],
  optionGroups: [ { id, name, type:'single'|'multi', required, options:[{id,name,price}] } ],
  menus:        [ { id, categoryId, name, desc, price, kcal, image,
                    soldOut, feature, optionGroupIds:[] } ]
}
```

- `kcal: 0` 이면 손님 화면에 표시하지 않는다.
- `feature: true` 는 타일에 `대표` 배지를 붙인다 (크기는 바꾸지 않는다).
- 메뉴의 `optionGroupIds` 는 존재하지 않는 그룹 id 를 자동으로 걸러낸다.

### localStorage 키

```
kio.config.v1   매장 구성
kio.orders.v1   주문 로그 (최대 60건)
kio.prefs.v1    { largeText }
kio.meta.v1     { seq, day }  주문번호 일일 시퀀스
```

사파리 프라이빗 모드나 용량 초과에서도 죽지 않게 전부 try/catch 로 감쌌고,
실패하면 메모리 폴백 + 토스트로 알린다.

---

## 10. 전역 API

전부 IIFE 로 `window` 에 붙인다. 모듈 시스템 없음.

```js
KIO_PRESETS   // 프리셋 5종 배열 (cafe, fastfood, bunsik, convenience, blank)
KIO_THEMES    // 테마 8종 (red, amber, green, blue, teal, violet, crimson, ink)
KIO_ART       // 썸네일 자동 생성용 듀오톤 팔레트 10종

KIO_STORE     // init subscribe commit setPrefs loadPreset factoryReset
              // visibleCategories menusOf getMenu getCategory getGroup groupsOf
              // money artFor glyphFor uid clone usage imageFromFile
              // nextOrderNo placeOrder clearOrders resetSession
              // .cart: items add setQty remove clear optionSum unitPrice
              //        linePrice optionLabels count total prune
              // .config .orders .prefs .session (getter)

KIO_UI        // $ $$ esc nl2br icon catIcon thumb art flap
              // mountLayers openSheet closeSheet dialog closeDialog
              // confirm alert toast

KIO_CUSTOMER  // bind renderMenu renderPage renderPayBar renderCart
              // renderPay renderDone renderItem clearPayTimers clearDoneTimer
              // hasDraft dropDraft resetCategory

KIO_ADMIN     // bind render open

KIO_APP       // go back goIdle resetIdle lockIdle fit  + current (getter)
```

`KIO_STORE.subscribe(fn)` 이 상태 변화를 방송한다.
이벤트: `'cart'`, `'config'`, `'config-quiet'`, `'orders'`, `'prefs'`, `'storage-error'`.
`'config-quiet'` 는 관리자 타이핑 중 커밋이라 관리자 패널을 다시 그리면 안 된다.

---

## 11. 디자인 시스템

### 방향

**밝은 한국 리테일 키오스크.** 레퍼런스는 맥도날드 대기화면, 매머드커피,
배스킨라빈스. 화이트에 가까운 바닥, 테두리 없는 옅은 톤 타일, 상단 텍스트 탭,
페이지 넘김 그리드, 하단의 넓은 액센트 버튼 하나.

taste-skill 의 다이얼 기준: `VARIANCE 3 / MOTION 3 / DENSITY 5`.
전 연령대가 서서 쓰는 공공 단말이라 **예측 가능성이 개성보다 앞선다.**
비대칭 레이아웃과 화려한 모션은 이 프로젝트에서 틀린 답이다.

### 모서리 규칙 (Shape lock). 어기지 마라

```
타일 · 카드        --r-card   (20)
주요 액션 버튼      --r-pill   (알약)
보조 · 유틸 버튼    --r-btn    (16)
입력                --r-input  (14)
칩 · 배지           --r-chip   (10)
```

예외는 결제 리더기 **삽화**뿐이다 (실물 카드의 모서리라 13px / 7px).
새 컴포넌트가 자기만의 반경을 발명하면 안 된다.

### 색

- 바닥 `--ground`, 타일 `--card`, 잉크 `--ink`. 순수 흑백은 쓰지 않는다.
- **액센트는 매장이 고른다.** 하드코딩 금지. 항상 `var(--accent)` / `var(--accent-deep)`.
- 액센트 하나만 쓴다. 두 번째 강조색을 도입하지 마라.
- `js/app.js` 의 `applyTheme()` 이 스테이지에 CSS 변수를 주입한다.

### 타이포

**Pretendard 한 종류.** 가격도 본문과 같은 얼굴이다 (레퍼런스가 전부 그렇다).
숫자는 `.num` 클래스로 `tabular-nums` 를 걸어 자릿수를 맞춘다.
한글은 어절 중간에서 끊기므로 긴 문장에는 `word-break: keep-all` 을 넣어라.

### 모션

**딱 한 곳.** 합계 금액의 자리수 롤 (`KIO_UI.flap`). 금액이 바뀌면 바뀐 자릿수만 넘어간다.
그 외에는 누름 피드백과 화면 전환뿐이다. 결제 진행 중 리더기 애니메이션 2개는
"기계가 일하는 중"을 알리는 상태 표현이라 예외로 둔다.
전부 `prefers-reduced-motion` 에서 멈춘다 (`base.css` 전역 규칙).

---

## 12. 함정 (실제로 터졌던 버그)

**작업 전에 읽어라.** 전부 이 저장소에서 실제로 발생했고 원인이 비직관적이다.

1. **마크업과 CSS 를 따로 고치지 마라.**
   관리자 화면을 좌측 레일에서 상단 탭으로 옮길 때 CSS 만 새로 쓰고 마크업을
   두는 바람에 `.admin__body` 가 스타일 없는 블록이 되어 플렉스 문맥이 끊겼고,
   패널의 `flex: 1 1 auto` 가 무력화되어 **스크롤이 아예 안 됐다.**
   → 리팩터 후에는 "마크업에 쓰였는데 CSS 에 없는 클래스"를 전수 조사해라.

2. **화면에 `position: relative` 를 다시 선언하지 마라.**
   `.screen` 은 이미 `position: absolute` 다. 하위 셀렉터가 같은 특정도로
   `relative` 를 덮으면 높이가 콘텐츠만큼 무너진다.

3. **`.thumb` 은 자체 높이가 없다.**
   비율이나 크기를 가진 래퍼 안에 넣을 때는 반드시 크기를 명시해라.
   (`position:absolute; inset:0` 또는 `width/height: 100%`)
   이 실수로 타일 이미지가 전부 비었던 적이 두 번 있다.

4. **JS 가 그려 넣는 컨테이너에는 `.mount` 를 붙여라.**
   안 붙이면 화면 높이를 이어받지 못해 하단 바가 바닥에 고정되지 않는다.

5. **인라인 `on*` 속성은 실행되지 않는다고 가정해라.**
   환경에 따라 무시된다. 이미지 오류 폴백은 JS 핸들러로 붙여라.
   특히 `onerror` 안에서 부모의 `innerHTML` 을 비우면 자기 자신이 분리되어
   `this.parentNode` 가 null 이 된다. 실제로 홈 배경이 통째로 비었던 원인이다.

6. **`<button>` 안의 `<span>` 은 인라인이다.**
   블록처럼 쓰려면 `display: block` 을 명시해라. 안 그러면 이름과 설명이 한 줄에 붙는다.

7. **크기 없는 인라인 SVG 는 컨테이너를 잡아먹는다.**
   버튼 안에 아이콘을 직접 넣을 때는 `.btn > svg` 같은 규칙으로 크기를 정해라.

8. **카운트다운은 벽시계로 계산해라.**
   `left--` 방식은 탭이 백그라운드로 가 타이머가 눌리면 멈춘 숫자를 남긴 채 끝나지 않는다.
   `Date.now()` 와 목표 시각을 비교하고 250ms 로 폴링해라.

9. **테마 기본값은 `KIO_THEMES` 에 존재하는 id 여야 한다.**
   존재하지 않는 id 를 넣으면 폴백으로 우연히 동작해 눈치채기 어렵다.

10. **스테이지는 스크롤되면 안 된다.**
    변환 전 레이아웃 박스가 래퍼를 넘치므로 `overflow: hidden` 이면 진짜 스크롤
    컨테이너가 되고, 관리자 입력창에 포커스가 가면 **키오스크 전체가 밀려난다.**
    `overflow: clip` + 스크롤 가드로 막아 뒀다. 건드리지 마라.

### 테스트 환경 함정

브라우저 패널이 숨겨져 있으면 `document.hidden === true` 가 되어
**`setTimeout` / `setInterval` 이 심하게 스로틀된다.** 250ms 대기가 실제로 1초가
된다. 5탭 진입(3초 창)이나 카운트다운을 검증할 때 이것 때문에 "버그처럼" 보인다.
합성 `WheelEvent` 는 실제 스크롤을 일으키지 않는다 (신뢰되지 않은 이벤트).
스크롤 검증은 `scrollTop` 을 직접 넣어 `scrollHeight > clientHeight` 를 확인해라.

---

## 13. 디자인 이력: 어떤 스킬을 왜 썼나

디자인은 세 번 바뀌었다. **왜 바뀌었는지가 중요하다.** 같은 실수를 반복하지 마라.

| 차수 | 스킬 | 결과 |
|---|---|---|
| 1차 | `soft-skill` | Editorial Luxury × 비대칭 벤토. 크림 배경, Instrument Serif, 테라코타. **폐기** |
| 2차 | `frontend-design` | 사이니지 방향. 좌측 레일 + 균일 그리드 + 어두운 결제 바 |
| 3차 | `taste-skill` | 현재. 밝은 리테일. 상단 탭 + 페이지 그리드 + 밝은 결제 바 |

**1차가 실패한 이유**: 스킬 선택보다 **읽기를 잘못했다.** soft-skill 의 매크로 여백과
비대칭 레이아웃 지침을, 정보 밀도가 생명인 키오스크에 그대로 적용했다.
공교롭게도 frontend-design 스킬이 "AI 가 기본값으로 몰리는 세 가지 룩" 중 첫 번째로
**크림 + 하이컨트라스트 세리프 + 테라코타**를 지목하는데, 1차 결과물이 정확히 그것이었다.

**2차에서 3차로 간 이유**: 사용자가 실제 키오스크 사진(매머드커피, 배스킨라빈스)을
가져왔고, 그것들은 좌측 레일이 아니라 상단 탭에 훨씬 밝고 가벼웠다.
레퍼런스가 있으면 레퍼런스가 브리프다.

**교훈**: 이 프로젝트에 디자인 스킬을 쓸 때는 스킬의 기본 다이얼을 그대로 받지 말고,
**"전 연령대가 서서 쓰는 공공 단말"** 이라는 성격에서 다이얼을 다시 뽑아라.
taste-skill 기준으로는 accessibility-critical 에 해당해 `VARIANCE 3 / MOTION 3` 이 된다.

---

## 14. 설치된 스킬

이 머신의 `~/.claude/skills/` 에 있는 것들이다. 굵은 것이 이 프로젝트와 관련이 있다.

**디자인 · 프론트엔드**
`frontend-design`(2차 사용) · **`taste-skill`**(3차, 현재 방향) · `taste-skill-v1` ·
`soft-skill`(1차, 폐기) · `gpt-tasteskill` · `minimalist-skill` · `brutalist-skill` ·
`redesign-skill` · `stitch-skill` · `image-to-code-skill` · `theme-factory` ·
`brand-guidelines` · `brandkit`

**이미지 생성** (아직 미사용, 15절 참고)
`imagegen-frontend-web` · `imagegen-frontend-mobile`

**그 외** (이 프로젝트와 무관)
`algorithmic-art` · `canvas-design` · `doc-coauthoring` · `internal-comms` ·
`mcp-builder` · `output-skill` · `skill-creator` · `slack-gif-creator` ·
`web-artifacts-builder` · `webapp-testing` · `remotion-*` (11종)

> 디자인 스킬을 새로 적용할 때는 **13절의 교훈을 먼저 읽어라.**
> 스킬의 기본 다이얼은 랜딩 페이지 기준이고, 이 프로젝트는 랜딩 페이지가 아니다.
> taste-skill 자체도 "multi-step product UI 에는 쓰지 말라"고 명시한다.
> 시각 언어 · 타이포 · 색 · anti-slop 규칙만 가져오고, 랜딩 전용 규칙
> (히어로 스택, eyebrow 카운트, 로고월)은 홈 화면에만 적용해라.

---

## 15. 알려진 미완 항목

**실제 메뉴 사진이 없다.** 지금 모든 상품 이미지와 홈의 큰 사진은 메뉴 이름에서
결정적으로 생성한 듀오톤 플레이트다 (`KIO_UI.thumb` → `KIO_STORE.artFor`).
깨진 링크보다는 낫고 어떤 매장 구성에도 자동으로 맞지만, 레퍼런스 수준의
완성도에는 못 미친다. 특히 홈 화면은 그 사진이 주인공이라 티가 난다.

해결 방향은 두 가지다.
1. 프리셋 5종의 홈 사진 5장을 생성해 저장소에 넣는다 (저장소 1~2MB 증가)
2. 관리자에서 매장이 직접 올린다 (이미 동작한다)

관리자가 언제든 교체할 수 있으므로 1번은 "좋은 기본값"의 성격이다.

---

## 16. 범위 밖 · 보류

`PLAN.md` 가 정한 것이다. 요청받지 않았다면 만들지 마라.

**범위 밖**: 실제 결제 연동 · 서버 · DB · 로그인 · POS 연동 · 다중 매장 관리

**보류** (필요해지면 꺼내 쓴다)
- 설정 Export / Import (JSON 백업)
- 영화관 모드 (좌석 · 회차 선택. 데이터 구조가 완전히 다르다)
- 다국어 지원
- 사운드 피드백

---

## 17. 작업 방법

### 실행

```bash
node .claude/serve.js
```

`http://localhost:4173`. `file://` 로 열면 브라우저에 따라 저장이 막힌다.

### 검증

빌드도 테스트 러너도 없다. 대신 이렇게 확인해라.

```bash
for f in js/*.js; do node --check "$f"; done          # 문법
node /tmp/orphan.js                                    # 고아 클래스 (12절 1번)
```

브라우저에서는 **전 흐름을 실제로 돌려라**. 홈 → 주문유형 → 메뉴 → 상품 →
주문내역 → 결제 → 완료, 그리고 관리자 CRUD. 콘솔 경고 0개를 확인해라.
`localStorage.clear()` 후 새 탭에서 클린 부팅도 한 번 봐라.

### 배포

`main` 에 푸시하면 GitHub Pages 가 자동으로 다시 빌드한다 (1~2분).

```bash
gh api repos/ZUTOMAYO1211/kio/pages/builds/latest --jq '{status,commit}'
```

**브라우저가 이전 `index.html` 을 캐시한다.** 배포 직후 확인할 때는
`?v=<커밋해시>` 를 붙이거나 강력 새로고침해라. 이걸 모르면 "배포가 안 됐다"고
잘못 판단하기 쉽다.

### 커밋

한국어 본문으로 쓴다. 무엇을 바꿨는지보다 **왜 바꿨는지**를 남긴다.
기존 커밋들을 참고해라.
