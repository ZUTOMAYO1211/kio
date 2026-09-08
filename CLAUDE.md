# KIO 프로젝트 컨텍스트

이 저장소를 처음 여는 AI 에이전트를 위한 안내서다.
Claude Code 는 `CLAUDE.md` 를 자동으로 컨텍스트에 넣는다.

**이 문서는 사실만 담는다.** 코드가 지금 어떻게 생겼고, 어디가 미끄러운지.
"이렇게 해라 / 하지 마라" 는 여기 없다. 지금까지의 판단과 그 근거는
[`DECISIONS.md`](DECISIONS.md) 에 따로 있고, 그건 규칙이 아니라 기록이다.

작업 전에 **"함정" 절만은 읽어라.** 실제로 터졌고 원인이 비직관적인 것들이다.

---

## 1. 무엇인가

실제 매장 키오스크의 주문 UX 를 웹으로 재현한 개인 제작 시뮬레이터.
빌드 도구 없이 HTML / CSS / Vanilla JS 로만 만들었고 데이터는 브라우저
`localStorage` 에만 남는다. 서버 · DB · 로그인 없음. 결제는 전부 모의다.

- 배포: <https://zutomayo1211.github.io/kio/>
- 저장소: <https://github.com/ZUTOMAYO1211/kio> (public, GitHub Pages, `main` / root)
- 외부 의존성은 웹폰트 하나뿐이다 (Pretendard, jsDelivr CDN)

원본 기획은 `PLAN.md` 에 있다. 만든 배경과 지금까지의 설계 판단은 `DECISIONS.md`.

### 제품이 무엇을 하기로 되어 있나

기획이 정한 네 가지 개선점이 이 프로젝트의 핵심 기능이다. 코드 곳곳이 여기에
묶여 있으니, 건드릴 때는 제품의 목적이 바뀐다는 걸 알고 하면 된다.

| 기능 | 구현 위치 |
|---|---|
| 품절 메뉴를 목록에서 빼지 않고 회색 처리 + 배지로 남김 | `css/customer.css` 의 `.tile.is-out`, `.tile__out` |
| 큰 글씨 모드 (글씨 · 터치 영역 · 그리드 열 수가 함께 변함) | `.is-large` 가 `--ts`, `--touch*` 등을 올린다 |
| 무동작 타임아웃을 먼저 안내하고 "계속하기" 를 줌 | `js/app.js` 의 `warnIdle()`, 감시 대상은 `WATCHED` |
| 장바구니 상시 노출 (비어 있어도 사라지지 않음) | `js/customer.js` 의 `renderPayBar()` |

---

## 2. 화면 좌표계 (가장 먼저 이해할 것)

**CSS 의 `px` 는 기기 픽셀이 아니라 "키오스크 픽셀" 이다.**

모든 치수는 1080 × 1920 캔버스 기준으로 쓴다. `js/app.js` 의 `fit()` 이 뷰포트에
맞춰 스테이지 전체를 `transform: scale()` 한다.

| 환경 | 동작 |
|---|---|
| 휴대폰 (세로) | 화면을 꽉 채운다. 기획이 정한 메인 테스트 환경 |
| PC (가로) | 화면 중앙에 세로 9:16 프레임 + 기기 베젤 |

`(vw / vh) > (1080 / 1920) * 1.06` 이면 프레임 모드, 아니면 꽉 채움 모드다.
꽉 채움 모드에서는 스테이지 높이가 1920 을 넘을 수 있다. 그래서 화면들은
고정 높이가 아니라 flex 로 늘어나게 되어 있다.

터치 영역 토큰 `--touch` 는 390pt 폭 휴대폰에서 약 61 CSS px 로 환산된다
(기획서의 60px 하한 근거). 정확한 값은 `css/tokens.css` 에서 확인해라.

---

## 3. 파일 구조

```
index.html          모든 화면의 뼈대. 화면은 전부 DOM 에 있고 클래스로 전환한다
CLAUDE.md           이 파일 (사실)
DECISIONS.md        지금까지의 판단과 근거 (기록)
README.md           사람용 문서
PLAN.md             원본 기획서

css/tokens.css      토큰. 색 · 타입 스케일 · 여백 · 반경 · 모션 · z 레이어
css/base.css        리셋, 데스크/기기/스테이지, 화면 전환, 스크롤 영역
css/components.css  버튼 · 배지 · 스테퍼 · 선택행 · 폼 · 시트 · 다이얼로그 · 토스트 · 썸네일
css/customer.css    손님 화면
css/admin.css       관리자 편집 모드

js/presets.js       프리셋 · 테마 · 썸네일 팔레트 · 기본 사진 매핑. 순수 데이터
js/store.js         상태 · localStorage · 스키마 정규화 · 장바구니 · 주문 · 이미지 리사이즈
js/i18n.js          한국어 · 영어 · 일본어 · 중국어 고객 화면 번역
js/ui.js            아이콘 · 썸네일 · 스플릿플랩 · 시트 · 다이얼로그 · 토스트
js/customer.js      손님 화면 렌더링과 이벤트
js/admin.js         편집 모드 렌더링과 이벤트
js/app.js           스케일링 · 테마 · 라우팅 · 타임아웃 · 관리자 진입 · 부팅

assets/images/     GPT 생성 메뉴 사진 46개 · 기존 홈 사진 · 원본 · 프롬프트 · 좌표
assets/images/home-v2/  업종별 새 홈 사진 4개 (561×701) · 생성 원본과 좌표
assets/flags/      한국 · 미국 · 일본 · 중국 SVG 국기
scripts/crop-images.py  원본 시트를 JPEG로 자르는 재현 스크립트 (Pillow 필요)

.claude/serve.js    로컬 정적 서버 (127.0.0.1 전용)
.claude/audit.js    마크업/CSS 클래스 불일치 검사 (10절)
.claude/launch.json Claude Code 프리뷰 설정
```

로드 순서가 곧 의존 순서다: `presets → store → ui → i18n → customer → admin → app`.
`app.js` 가 마지막에 `boot()` 한다. 모듈 시스템은 없고 전부 IIFE 로 `window` 에 붙인다.

---

## 4. 화면 (라우트)

전환은 `KIO_APP.go(name, dir)`. `dir` 이 `'back'` 이면 역방향 애니메이션.
화면은 `<section class="screen ..." data-screen="...">` 로 전부 DOM 에 있고
`.is-active` 하나만 보인다.

| `data-screen` | 클래스 | 하는 일 |
|---|---|---|
| `idle` | `.home` | 홈. 큰 사진 한 장 + 주문 시작하기 + 큰 글씨 모드. 로고 연속 탭이 관리자 진입구 |
| `ordertype` | `.otype` | 매장 식사 / 포장. `settings.orderTypeEnabled` 가 false 면 건너뛴다 |
| `menu` | `.shop` | 주력 화면. 상단 카테고리 탭 + 페이지 그리드 + 하단 결제 바 |
| `item` | `.item` | 상품 상세. 사진 · 가격 · 열량 · 옵션 그룹 · 수량 · 합계 |
| `cart` | `.cart` | 주문 내역. 수량 조절 · 삭제 · 합계 · 전체 취소 / 더 담기 / 결제 |
| `pay` | `.pay` | 결제 수단 선택 후 모의 진행 |
| `done` | `.done` | 주문번호 · 영수증 요약 · 자동 복귀 카운트다운 |
| `pin` | `.pin` | 관리자 PIN 4자리 |
| `admin` | `.admin` | 편집 모드 (5절) |

> **홈 화면의 라우트 id 는 `idle` 인데 클래스는 `home` 이다.**
> 이름이 안 맞는 건 역사적 이유다. `data-screen="idle"` 을 바꾸면 라우팅이 깨진다.

> **`cart` 에서 결제를 누르면 곧장 `pay` 로 가지 않는다.**
> `js/customer.js` 의 `confirmOrderType()` 이 주문 방식을 다시 묻고, 확인해야 넘어간다.
> 메뉴 화면에는 뒤로 가기가 없어서 주문 유형을 되돌릴 지점이 여기뿐이다.
> `settings.orderTypeEnabled` 가 false 면 묻지 않고 통과한다.

뒤로 가기는 `js/app.js` 의 `BACK` 맵이 정한다. 화면 이력 스택이 아니라 고정 매핑이다.

---

## 5. 관리자 편집 모드

**진입**: 홈 화면의 매장 로고를 짧은 시간 안에 연속으로 여러 번 탭 → PIN 화면.
정확한 횟수와 시간 창, 초기 PIN 은 `js/app.js` 의 `onBrandTap()` 과
`js/store.js` 의 `normalize()` 에 있다.

상단 탭 구성은 `js/admin.js` 의 `SECTIONS` 배열이 정의한다. 현재:
매장 설정 · 카테고리 · 메뉴 · 옵션 그룹 · 데이터 · 주문 로그.

동작 특성 두 가지가 코드를 읽을 때 헷갈릴 수 있다.

- **자동 저장이다.** 타이핑은 디바운스 후 커밋한다.
- **타이핑 중에는 패널을 다시 그리지 않는다.** 포커스와 커서를 지키려는 것이다.
  구조가 바뀌는 조작(추가 · 삭제 · 순서 · 토글)만 `commitNow()` 로 즉시 재렌더한다.
  그래서 커밋 이벤트가 `'config'` 와 `'config-quiet'` 두 갈래다.

이미지는 업로드 시 캔버스로 축소해 base64 로 넣는다. URL 입력도 된다.
기본 사진은 `assets/images/`의 정적 JPEG다. `KIO_MENU_IMAGES`는 사진이 비어 있는
기존 저장 메뉴를 이름으로 보완하며, `KIO_HERO_IMAGES`는 기본 대표 사진의 홈용
구성을 선택한다. 직접 지정한 사진이 우선이고, 미등록 메뉴는 듀오톤으로 표시한다.

축소 크기와 JPEG 품질은 `js/store.js` 의 `imageFromFile()` 에 있다.

---

## 6. 데이터 스키마

`js/store.js` 의 `normalize()` 가 **어떤 경로로 들어온 데이터든 이 모양으로 강제**한다.

> 필드를 추가하면 `normalize()` 에도 넣어야 한다. 넣지 않으면 저장 후 사라진다.
> 이 프로젝트에서 가장 조용히 실패하는 지점이다.

```js
config = {
  store: {
    name, tagline, headline, lede,   // headline 은 \n 을 <br> 로 렌더
    logo, heroImage,                 // '' 또는 base64 또는 외부 URL
    theme,                           // KIO_THEMES 에 존재하는 id 여야 한다
    currency                         // KRW | USD | JPY | EUR
  },
  settings: {
    pin,                             // 숫자 4자리가 아니면 기본값으로 대체
    idleSeconds, warnSeconds,        // 범위 밖 값은 clamp 된다
    orderTypeEnabled                 // false 면 주문유형 화면을 건너뛴다
  },
  categories:   [ { id, name, order, visible } ],
  optionGroups: [ { id, name, type:'single'|'multi', required, options:[{id,name,price}] } ],
  menus:        [ { id, categoryId, name, desc, price, kcal, image,
                    soldOut, feature, optionGroupIds:[] } ]
}
```

- `kcal: 0` 이면 손님 화면에 표시하지 않는다.
- 메뉴의 `optionGroupIds` 는 존재하지 않는 그룹 id 를 자동으로 걸러낸다.
- 카테고리를 지우면 그 안의 메뉴도 함께 지워진다.

### localStorage

```
kio.config.v1   매장 구성
kio.orders.v1   주문 로그 (상한 있음)
kio.prefs.v1    { largeText, language }
kio.meta.v1     { seq, day }  주문번호 일일 시퀀스
```

사파리 프라이빗 모드나 용량 초과에서도 죽지 않게 전부 try/catch 로 감쌌고,
실패하면 메모리 폴백 + 토스트로 알린다.

---

## 7. 전역 API

정확한 메서드 목록은 각 파일 끝의 `global.KIO_* = { ... }` 에서 확인해라.
아래는 어디에 무엇이 있는지의 지도다.

```
KIO_PRESETS / KIO_THEMES / KIO_ART   js/presets.js   순수 데이터
KIO_STORE                            js/store.js     상태 · 장바구니 · 주문 · 저장
KIO_UI                               js/ui.js        DOM 헬퍼 · 아이콘 · 오버레이
KIO_CUSTOMER                         js/customer.js  손님 화면 렌더러
KIO_ADMIN                            js/admin.js     편집 모드 렌더러
KIO_APP                              js/app.js       라우팅 · 스케일 · 타임아웃
```

`KIO_STORE.subscribe(fn)` 이 상태 변화를 방송한다.
이벤트: `'cart'`, `'config'`, `'config-quiet'`, `'orders'`, `'prefs'`, `'storage-error'`.
`'config-quiet'` 는 관리자 타이핑 중 커밋이라 관리자 패널을 다시 그리면 무한 루프가 된다.

---

## 8. 함정

전부 이 저장소에서 실제로 발생했다. 원인이 비직관적이라 다시 밟기 쉽다.

1. **마크업과 CSS 를 따로 고치면 조용히 깨진다.**
   관리자 화면을 좌측 레일에서 상단 탭으로 옮길 때 CSS 만 새로 쓰고 마크업을
   두는 바람에 `.admin__body` 가 스타일 없는 블록이 되어 플렉스 문맥이 끊겼고,
   패널의 `flex: 1 1 auto` 가 무력화되어 스크롤이 아예 안 됐다.
   구조를 바꾼 뒤에는 `node .claude/audit.js` 로 확인하면 잡힌다.

2. **화면에 `position: relative` 를 다시 선언하면 높이가 무너진다.**
   `.screen` 은 이미 `position: absolute` 다. 하위 셀렉터가 같은 특정도로 덮으면
   높이가 콘텐츠만큼 줄어든다.

3. **`.thumb` 은 자체 높이가 없다.**
   비율이나 크기를 가진 래퍼 안에 넣을 때 크기를 명시하지 않으면 0 이 된다.
   (`position:absolute; inset:0` 또는 `width/height:100%`)
   이것 때문에 타일 이미지가 전부 빈 적이 두 번 있다.

4. **JS 가 그려 넣는 컨테이너에는 `.mount` 가 필요하다.**
   없으면 화면 높이를 이어받지 못해 하단 바가 바닥에 고정되지 않는다.

5. **인라인 `on*` 속성은 실행되지 않을 수 있다.**
   환경에 따라 무시된다. 특히 `onerror` 안에서 부모의 `innerHTML` 을 비우면
   자기 자신이 분리되어 `this.parentNode` 가 null 이 된다. 홈 배경이 통째로
   사라졌던 원인이다. 이미지 오류 폴백은 JS 핸들러로 붙여 뒀다.

6. **`<button>` 안의 `<span>` 은 인라인이다.**
   블록처럼 쓰려면 `display: block` 이 필요하다. 없으면 이름과 설명이 한 줄에 붙는다.

7. **크기 없는 인라인 SVG 는 컨테이너를 잡아먹는다.**
   버튼 안에 아이콘을 직접 넣을 때 크기 규칙이 없으면 레이아웃이 터진다.

8. **틱을 세는 카운트다운은 백그라운드에서 멈춘다.**
   탭이 뒤로 가면 타이머가 눌려 숫자가 멈춘 채 끝나지 않는다. 지금은 `Date.now()`
   와 목표 시각을 비교하는 방식으로 되어 있다.

9. **테마 값은 `KIO_THEMES` 에 존재하는 id 여야 한다.**
   없는 id 를 넣으면 폴백으로 우연히 동작해 눈치채기 어렵다.

10. **스테이지가 스크롤 컨테이너가 되면 키오스크 전체가 밀려난다.**
    변환 전 레이아웃 박스가 래퍼를 넘치므로 `overflow: hidden` 이면 진짜 스크롤
    컨테이너가 되고, 관리자 입력창에 포커스가 가는 순간 화면이 통째로 이동한다.
    지금은 `overflow: clip` + 스크롤 가드로 막혀 있다. 이 부분을 바꾸면 그 증상이
    재발하는지 확인이 필요하다.

### 테스트 환경 함정

- 브라우저 패널이 숨겨져 있으면 `document.hidden === true` 가 되어 `setTimeout` /
  `setInterval` 이 심하게 스로틀된다. 250ms 대기가 실제로 1초가 된다.
  짧은 시간 창을 쓰는 기능(연속 탭 감지, 카운트다운)을 검증할 때 멀쩡한 코드가
  버그처럼 보인다. 실제로 세 번 오진했다.
- 합성 `WheelEvent` 는 실제 스크롤을 일으키지 않는다 (신뢰되지 않은 이벤트).
  스크롤 검증은 `scrollTop` 을 직접 넣고 `scrollHeight > clientHeight` 를 봐라.
- 화면 전환과 리스트 등장에 애니메이션이 있어서, 렌더 직후 값을 읽으면 중간
  상태가 잡힌다. 스플릿플랩은 구르는 동안 한 칸에 두 글자를 담고 있어
  `textContent` 가 `₩45,7200` 처럼 보인다. 버그가 아니다.

---

## 9. 실행

```bash
node .claude/serve.js
```

`http://localhost:4173`. `file://` 로 열면 브라우저에 따라 저장이 막힌다.

---

## 10. 검증

빌드도 테스트 러너도 없다. 확인 수단은 이것뿐이다.

```bash
for f in js/*.js; do node --check "$f"; done   # 문법
node .claude/audit.js                          # 마크업/CSS 클래스 불일치
node .claude/check-i18n.js                     # 기본 프리셋 번역 누락 · 원본 보존
```

브라우저에서는 전 흐름을 실제로 돌려 봐야 한다.
홈 → 주문유형 → 메뉴 → 상품 → 주문내역 → 결제 → 완료, 그리고 관리자 CRUD.
`localStorage.clear()` 후 새 탭 클린 부팅과 콘솔 경고 0개도 함께 본다.

---

## 11. 배포

`main` 에 푸시하면 GitHub Pages 가 자동으로 다시 빌드한다 (1~2분).

```bash
gh api repos/ZUTOMAYO1211/kio/pages/builds/latest --jq '{status,commit}'
```

**브라우저가 이전 `index.html` 을 캐시한다.** 배포 직후 확인할 때는
`?v=<커밋해시>` 를 붙이거나 강력 새로고침해야 한다. 이걸 모르면 "배포가 안 됐다"
고 잘못 판단하기 쉽다. 실제로 한 번 그랬다.

커밋 메시지는 한국어 본문으로, 무엇보다 **왜 바꿨는지**를 남긴다.
기존 커밋들을 참고해라.

## 12. 고객 언어 선택

홈의 4개 언어 버튼은 `prefs.language` (`ko`, `en`, `ja`, `zh`)를 저장한다.
언어는 새로고침과 주문 종료 후에도 유지되며, 미지원 값은 한국어로 표시한다.
`KIO_I18N.text()`는 기본 메뉴·옵션·설명과 홈 문구를 표시할 때만 번역한다.
구성 데이터와 주문 로그 원문, 관리자 화면은 그대로 유지한다.
`KIO_I18N.html()`은 개발자가 작성한 고정 UI 문자열 전용이며 사용자 입력에는 쓰지 않는다.
새로 작성한 메뉴명·설명은 사전에 없는 경우 원문으로 표시된다.
홈의 주문 시작과 큰 글씨 버튼은 `home__actions`의 2열 그리드다.

홈의 사진 영역은 고정 비율 대신 flex로 남는 세로 높이를 채운다. `home__shot`의
썸네일은 absolute로 영역을 채우며, 직접 지정한 홈 `<img>`도 `object-fit: cover`를 쓴다.
홈 전용 기본 사진은 `KIO_HERO_IMAGES`에서 선택하고 우선 로딩한다.
언어 버튼은 SVG 국기와 해당 언어의 이름을 함께 표시한다.
