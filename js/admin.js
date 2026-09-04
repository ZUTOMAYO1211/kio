/* ============================================================
   KIO — 관리자 편집 모드
   매장 설정 · 카테고리 · 메뉴 · 옵션 그룹 · 데이터 · 주문 로그
   ============================================================ */
(function (global) {
  'use strict';

  var Store = global.KIO_STORE;
  var UI = global.KIO_UI;
  var $ = UI.$, $$ = UI.$$, esc = UI.esc, icon = UI.icon, thumb = UI.thumb;

  var SECTIONS = [
    { id: 'store',   name: '매장 설정',   ic: 'store' },
    { id: 'cats',    name: '카테고리',    ic: 'grid' },
    { id: 'menus',   name: '메뉴',        ic: 'list' },
    { id: 'groups',  name: '옵션 그룹',   ic: 'sliders' },
    { id: 'data',    name: '데이터',      ic: 'data' },
    { id: 'orders',  name: '주문 로그',   ic: 'receipt' }
  ];

  var section = 'store';
  var commitTimer = null;

  /* 타이핑 중에는 다시 그리지 않는다 — 포커스와 커서를 지키기 위해 */
  function commitSoon() {
    clearTimeout(commitTimer);
    commitTimer = setTimeout(function () {
      Store.commit('config-quiet');
    }, 320);
  }
  function commitNow(rerender) {
    clearTimeout(commitTimer);
    Store.commit('config-quiet');
    if (rerender !== false) render();
  }

  /* =========================================================
     셸
     ========================================================= */
  function render() {
    $('#adminStoreName').textContent = Store.config.store.name;

    $('#adminNav').innerHTML = SECTIONS.map(function (s) {
      return '<button class="anav' + (s.id === section ? ' is-on' : '') + '" ' +
        'data-asec="' + s.id + '" type="button" ' +
        'aria-current="' + (s.id === section ? 'true' : 'false') + '">' +
        icon(s.ic) + '<span>' + esc(s.name) + '</span></button>';
    }).join('');

    var body =
      section === 'store'  ? viewStore()  :
      section === 'cats'   ? viewCats()   :
      section === 'menus'  ? viewMenus()  :
      section === 'groups' ? viewGroups() :
      section === 'data'   ? viewData()   :
                             viewOrders();

    var panel = $('#adminPanel');
    panel.innerHTML = body;
    panel.scrollTop = 0;
  }

  function sec(title, desc, inner, i) {
    return '<section class="asec" style="--i:' + (i || 0) + '">' +
      '<div class="asec__head">' +
      '<h2 class="asec__title">' + esc(title) + '</h2>' +
      (desc ? '<p class="asec__desc">' + esc(desc) + '</p>' : '') +
      '</div>' + inner + '</section>';
  }

  function field(label, inner, hint) {
    return '<div class="field">' +
      '<label class="field__label">' + esc(label) + '</label>' + inner +
      (hint ? '<p class="field__hint">' + esc(hint) + '</p>' : '') +
      '</div>';
  }

  function switchRow(title, desc, on, act) {
    return '<button class="switch" data-switch="' + act + '" type="button" role="switch" ' +
      'aria-checked="' + (!!on) + '">' +
      '<span class="switch__text"><span class="switch__title">' + esc(title) + '</span>' +
      (desc ? '<span class="switch__desc">' + esc(desc) + '</span>' : '') + '</span>' +
      '<span class="switch__track"><span class="switch__thumb"></span></span>' +
      '</button>';
  }

  /* =========================================================
     1) 매장 설정
     ========================================================= */
  function viewStore() {
    var s = Store.config.store;
    var st = Store.config.settings;

    var identity =
      '<div class="agrid">' +
      field('매장명', '<input class="input" data-store="name" value="' + esc(s.name) + '" maxlength="40">') +
      field('영문 태그라인', '<input class="input" data-store="tagline" value="' + esc(s.tagline) + '" maxlength="40">',
        '대기 화면 로고 아래에 작게 들어갑니다.') +
      field('대기 화면 문구',
        '<textarea class="textarea" data-store="headline" maxlength="60">' + esc(s.headline) + '</textarea>',
        '줄바꿈이 그대로 반영됩니다.') +
      field('보조 설명',
        '<textarea class="textarea" data-store="lede" maxlength="120" style="min-height:150px">' + esc(s.lede) + '</textarea>') +
      '</div>';

    var images =
      '<div class="agrid">' +
      field('로고',
        '<div class="imgpick">' +
        '<div class="imgpick__preview">' + thumb(s.name, s.logo, { glyph: 76 }) + '</div>' +
        '<div class="imgpick__ctrls">' +
        '<div class="imgpick__row">' +
        '<button class="btn btn--quiet btn--sm" data-img="store.logo" data-mode="file" type="button">' + icon('image') + ' 업로드</button>' +
        '<button class="btn btn--quiet btn--sm" data-img="store.logo" data-mode="url" type="button">URL</button>' +
        '</div>' +
        (s.logo ? '<button class="btn btn--danger btn--sm" data-img="store.logo" data-mode="clear" type="button">사진 지우기</button>' : '') +
        '</div></div>',
        '정사각형 이미지를 권장합니다. 720px로 줄여서 저장합니다.') +

      field('시작 화면 이미지',
        '<div class="imgpick">' +
        '<div class="imgpick__preview imgpick__preview--wide">' + thumb(s.name + '-hero', s.heroImage, { glyph: 76 }) + '</div>' +
        '<div class="imgpick__ctrls">' +
        '<div class="imgpick__row">' +
        '<button class="btn btn--quiet btn--sm" data-img="store.heroImage" data-mode="file" type="button">' + icon('image') + ' 업로드</button>' +
        '<button class="btn btn--quiet btn--sm" data-img="store.heroImage" data-mode="url" type="button">URL</button>' +
        '</div>' +
        (s.heroImage ? '<button class="btn btn--danger btn--sm" data-img="store.heroImage" data-mode="clear" type="button">사진 지우기</button>' : '') +
        '</div></div>',
        '비워 두면 테마 색으로 만든 그라데이션이 들어갑니다.') +
      '</div>';

    var theme =
      '<div class="agrid">' +
      field('테마 색상',
        '<div class="swatches">' +
        global.KIO_THEMES.map(function (t) {
          return '<button class="swatch' + (t.id === s.theme ? ' is-on' : '') + '" ' +
            'style="--sw:' + t.accent + '" data-theme="' + t.id + '" type="button" ' +
            'aria-label="' + esc(t.name) + '"></button>';
        }).join('') +
        '</div>') +
      field('통화',
        '<select class="select" data-store="currency">' +
        [['KRW', '원 (₩)'], ['USD', '달러 ($)'], ['JPY', '엔 (¥)'], ['EUR', '유로 (€)']].map(function (c) {
          return '<option value="' + c[0] + '"' + (s.currency === c[0] ? ' selected' : '') + '>' + c[1] + '</option>';
        }).join('') + '</select>') +
      '</div>';

    var behaviour =
      '<div class="agrid">' +
      switchRow('주문 유형 선택 화면', '매장 식사 / 포장을 묻습니다. 끄면 바로 메뉴로 넘어갑니다.',
        st.orderTypeEnabled, 'orderType') +
      switchRow('큰 글씨 모드 기본값', '켜 두면 처음부터 큰 글씨로 시작합니다.',
        Store.prefs.largeText, 'largeText') +
      field('무동작 타임아웃 (초)',
        '<input class="input input--num" type="number" min="20" max="600" step="5" ' +
        'data-setting="idleSeconds" value="' + st.idleSeconds + '">',
        '이 시간 동안 아무 동작이 없으면 안내 모달을 띄웁니다. 대기·완료 화면에서는 동작하지 않습니다.') +
      field('안내 후 대기 시간 (초)',
        '<input class="input input--num" type="number" min="5" max="60" step="1" ' +
        'data-setting="warnSeconds" value="' + st.warnSeconds + '">',
        '모달이 뜬 뒤 이 시간이 지나면 처음 화면으로 돌아갑니다.') +
      field('관리자 PIN (4자리)',
        '<input class="input input--num" inputmode="numeric" pattern="[0-9]*" maxlength="4" ' +
        'data-setting="pin" value="' + esc(st.pin) + '">',
        '숫자 4자리만 저장됩니다. 잊어버리면 데이터 › 전체 초기화로만 풀 수 있습니다.') +
      '</div>';

    return sec('매장 정보', '대기 화면과 영수증에 쓰이는 값입니다.', identity, 0) +
           sec('이미지', '로컬 저장소에 base64로 담기므로 너무 큰 파일은 피해 주세요.', images, 1) +
           sec('테마 · 통화', '', theme, 2) +
           sec('동작', '키오스크가 손님을 대하는 방식입니다.', behaviour, 3);
  }

  /* =========================================================
     2) 카테고리
     ========================================================= */
  function viewCats() {
    var cats = Store.config.categories;

    var rows = cats.length ? cats.map(function (c, i) {
      var count = Store.menusOf(c.id).length;
      return '<div class="arow' + (c.visible ? '' : ' is-hidden') + '" style="--i:' + i + '">' +
        '<div class="arow__move">' +
        '<button class="arow__movebtn" data-cmove="' + esc(c.id) + '" data-d="-1" type="button" ' +
        (i === 0 ? 'disabled ' : '') + 'aria-label="위로">' + icon('up') + '</button>' +
        '<button class="arow__movebtn" data-cmove="' + esc(c.id) + '" data-d="1" type="button" ' +
        (i === cats.length - 1 ? 'disabled ' : '') + 'aria-label="아래로">' + icon('down') + '</button>' +
        '</div>' +
        '<div class="arow__body">' +
        '<input class="input" data-cat-name="' + esc(c.id) + '" value="' + esc(c.name) + '" maxlength="20">' +
        '<div class="arow__meta"><span class="num">메뉴 ' + count + '개</span>' +
        (c.visible ? '' : '<span class="badge">숨김</span>') + '</div>' +
        '</div>' +
        '<div class="arow__tools">' +
        '<button class="icon-btn icon-btn--sm" data-cvis="' + esc(c.id) + '" type="button" ' +
        'aria-label="표시 여부">' + icon(c.visible ? 'eye' : 'eyeOff') + '</button>' +
        '<button class="icon-btn icon-btn--sm" data-cdel="' + esc(c.id) + '" type="button" ' +
        'aria-label="삭제">' + icon('trash') + '</button>' +
        '</div></div>';
    }).join('') : emptyBox('카테고리가 없습니다', '아래 버튼으로 첫 카테고리를 추가하세요.');

    return sec('카테고리 관리',
      '순서를 바꾸면 메뉴 화면의 탭 순서가 그대로 바뀝니다. 숨긴 카테고리는 손님에게 보이지 않습니다.',
      rows + '<button class="add-btn" data-cadd type="button">' + icon('plus') + ' 카테고리 추가</button>', 0);
  }

  /* =========================================================
     3) 메뉴
     ========================================================= */
  function viewMenus() {
    var cats = Store.config.categories;
    if (!cats.length) {
      return sec('메뉴 관리', '', emptyBox('먼저 카테고리를 만들어 주세요',
        '메뉴는 반드시 카테고리에 속합니다.'), 0);
    }

    return cats.map(function (c, ci) {
      var list = Store.menusOf(c.id);
      var rows = list.length ? list.map(function (m, i) {
        return '<div class="arow" style="--i:' + i + '">' +
          '<div class="arow__move">' +
          '<button class="arow__movebtn" data-mmove="' + esc(m.id) + '" data-d="-1" type="button" ' +
          (i === 0 ? 'disabled ' : '') + 'aria-label="위로">' + icon('up') + '</button>' +
          '<button class="arow__movebtn" data-mmove="' + esc(m.id) + '" data-d="1" type="button" ' +
          (i === list.length - 1 ? 'disabled ' : '') + 'aria-label="아래로">' + icon('down') + '</button>' +
          '</div>' +
          '<div class="arow__thumb">' + thumb(m.name, m.image, { glyph: 54 }) + '</div>' +
          '<div class="arow__body">' +
          '<p class="arow__name">' + esc(m.name) + '</p>' +
          '<div class="arow__meta">' +
          '<span class="num">' + esc(Store.money(m.price)) + '</span>' +
          (m.kcal ? '<span class="num">' + m.kcal + ' Kcal</span>' : '') +
          (m.feature ? '<span class="badge badge--accent">대표</span>' : '') +
          (m.soldOut ? '<span class="badge badge--danger">품절</span>' : '') +
          (m.optionGroupIds.length ? '<span class="badge">옵션 ' + m.optionGroupIds.length + '</span>' : '') +
          '</div></div>' +
          '<div class="arow__tools">' +
          '<button class="btn btn--quiet btn--xs" data-medit="' + esc(m.id) + '" type="button">편집</button>' +
          '</div></div>';
      }).join('') : emptyBox('이 카테고리에 메뉴가 없습니다', '');

      return sec(c.name, '', rows +
        '<button class="add-btn" data-madd="' + esc(c.id) + '" type="button">' +
        icon('plus') + ' ' + esc(c.name) + '에 메뉴 추가</button>', ci);
    }).join('');
  }

  /* -- 메뉴 편집 시트 --------------------------------------- */
  function openMenuEditor(menuId, categoryId) {
    var isNew = !menuId;
    var src = isNew
      ? { id: Store.uid('m'), categoryId: categoryId, name: '', desc: '', price: 0,
          kcal: 0, image: '', soldOut: false, feature: false, optionGroupIds: [] }
      : Store.clone(Store.getMenu(menuId));
    if (!src) return;

    var draft = Store.clone(src);

    function html() {
      var cats = Store.config.categories;
      var groups = Store.config.optionGroups;

      return '<div class="esheet__head">' +
        '<h2 class="esheet__title">' + (isNew ? '메뉴 추가' : '메뉴 편집') + '</h2>' +
        '<button class="icon-btn icon-btn--sm icon-btn--bare" data-sheet-close type="button" aria-label="닫기">' +
        icon('x') + '</button></div>' +

        '<div class="scroller esheet__scroll"><div class="agrid">' +
        field('메뉴 이름', '<input class="input" data-d="name" value="' + esc(draft.name) + '" maxlength="30" placeholder="예: 아메리카노">') +
        field('설명', '<textarea class="textarea" data-d="desc" maxlength="80" placeholder="한 줄 설명 (선택)" style="min-height:150px">' + esc(draft.desc) + '</textarea>') +
        field('가격', '<input class="input input--num" type="number" min="0" step="100" data-d="price" value="' + draft.price + '">') +
        field('열량 (Kcal)', '<input class="input input--num" type="number" min="0" step="10" data-d="kcal" value="' + draft.kcal + '">',
          '0으로 두면 손님 화면에 표시하지 않습니다.') +
        field('카테고리',
          '<select class="select" data-d="categoryId">' +
          cats.map(function (c) {
            return '<option value="' + esc(c.id) + '"' + (draft.categoryId === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>';
          }).join('') + '</select>') +

        field('사진',
          '<div class="imgpick">' +
          '<div class="imgpick__preview" data-preview>' + thumb(draft.name || '?', draft.image, { glyph: 76 }) + '</div>' +
          '<div class="imgpick__ctrls">' +
          '<div class="imgpick__row">' +
          '<button class="btn btn--quiet btn--sm" data-dimg="file" type="button">' + icon('image') + ' 업로드</button>' +
          '<button class="btn btn--quiet btn--sm" data-dimg="url" type="button">URL</button>' +
          '</div>' +
          '<button class="btn btn--danger btn--sm" data-dimg="clear" type="button"' +
          (draft.image ? '' : ' disabled') + '>사진 지우기</button>' +
          '</div></div>') +

        switchRow('품절', '숨기지 않고 회색 처리 + 품절 배지로 보여 줍니다.', draft.soldOut, 'd:soldOut') +
        switchRow('대표 메뉴', '메뉴 카드에 \'대표\' 배지를 붙입니다.', draft.feature, 'd:feature') +

        field('옵션 그룹',
          groups.length
            ? '<div class="chips">' + groups.map(function (g) {
                var on = draft.optionGroupIds.indexOf(g.id) >= 0;
                return '<button class="chip' + (on ? ' is-on' : '') + '" data-dg="' + esc(g.id) + '" type="button">' +
                  icon('check') + esc(g.name) +
                  '<em>' + (g.type === 'single' ? '단일' : '다중') + '</em></button>';
              }).join('') + '</div>'
            : '<p class="field__hint">아직 만들어 둔 옵션 그룹이 없습니다. 옵션 그룹 탭에서 먼저 만들어 주세요.</p>') +
        '</div></div>' +

        '<div class="esheet__foot">' +
        (isNew ? '' :
          '<button class="btn btn--danger btn--lg" data-dremove type="button" aria-label="삭제">' + icon('trash') + '</button>') +
        '<button class="btn btn--quiet btn--lg" data-sheet-close type="button">취소</button>' +
        '<button class="btn btn--primary btn--lg" data-dsave type="button">저장</button>' +
        '</div>';
    }

    var sheet = UI.openSheet(html(), { label: '메뉴 편집' });
    wireDraft(sheet, draft, {
      onImage: function () {
        $('[data-preview]', sheet.core).innerHTML = thumb(draft.name || '?', draft.image, { glyph: 76 });
        var clr = $('[data-dimg="clear"]', sheet.core);
        if (clr) clr.disabled = !draft.image;
      },
      onSave: function () {
        if (!draft.name.trim()) { UI.toast('메뉴 이름을 입력해 주세요', 'warn'); return false; }
        var menus = Store.config.menus;
        var idx = -1;
        menus.forEach(function (m, i) { if (m.id === draft.id) idx = i; });
        if (idx >= 0) menus[idx] = draft; else menus.push(draft);
        commitNow();
        UI.toast(isNew ? '메뉴를 추가했습니다' : '저장했습니다');
        return true;
      },
      onRemove: function () {
        return UI.confirm('이 메뉴를 삭제할까요?', '"' + draft.name + '" 이(가) 목록에서 사라집니다.', '삭제', 'danger')
          .then(function (ok) {
            if (!ok) return false;
            Store.config.menus = Store.config.menus.filter(function (m) { return m.id !== draft.id; });
            commitNow();
            UI.toast('삭제했습니다');
            return true;
          });
      },
      chipKey: 'optionGroupIds'
    });
  }

  /* =========================================================
     4) 옵션 그룹
     ========================================================= */
  function viewGroups() {
    var groups = Store.config.optionGroups;

    var rows = groups.length ? groups.map(function (g, i) {
      var used = Store.config.menus.filter(function (m) {
        return m.optionGroupIds.indexOf(g.id) >= 0;
      }).length;
      return '<div class="arow" style="--i:' + i + '">' +
        '<div class="arow__body">' +
        '<p class="arow__name">' + esc(g.name) + '</p>' +
        '<div class="arow__meta">' +
        '<span class="badge">' + (g.type === 'single' ? '단일 선택' : '중복 선택') + '</span>' +
        (g.required ? '<span class="badge badge--accent">필수</span>' : '') +
        '<span class="num">옵션 ' + g.options.length + '개</span>' +
        '<span class="num">사용 ' + used + '개 메뉴</span>' +
        '</div></div>' +
        '<div class="arow__tools">' +
        '<button class="btn btn--quiet btn--xs" data-gedit="' + esc(g.id) + '" type="button">편집</button>' +
        '</div></div>';
    }).join('') : emptyBox('옵션 그룹이 없습니다',
      '사이즈 · 온도 · 추가 토핑처럼 여러 메뉴가 공유하는 선택지를 만들어 두면 메뉴마다 연결할 수 있습니다.');

    return sec('옵션 그룹 관리',
      '한 번 만들면 여러 메뉴에 연결해 쓸 수 있습니다. 옵션별 추가금은 주문 화면에서 실시간으로 반영됩니다.',
      rows + '<button class="add-btn" data-gadd type="button">' + icon('plus') + ' 옵션 그룹 추가</button>', 0);
  }

  function openGroupEditor(groupId) {
    var isNew = !groupId;
    var draft = isNew
      ? { id: Store.uid('og'), name: '', type: 'single', required: false,
          options: [{ id: 'o1', name: '', price: 0 }] }
      : Store.clone(Store.getGroup(groupId));
    if (!draft) return;

    function optRows() {
      return draft.options.map(function (o, i) {
        return '<div class="optrow" data-oi="' + i + '">' +
          '<input class="input optrow__name" data-o="name" data-i="' + i + '" ' +
          'value="' + esc(o.name) + '" maxlength="24" placeholder="옵션 이름">' +
          '<input class="input input--num optrow__price" data-o="price" data-i="' + i + '" ' +
          'type="number" min="0" step="100" value="' + o.price + '">' +
          '<button class="optrow__del" data-odel="' + i + '" type="button" aria-label="옵션 삭제">' +
          icon('x') + '</button></div>';
      }).join('');
    }

    function html() {
      return '<div class="esheet__head">' +
        '<h2 class="esheet__title">' + (isNew ? '옵션 그룹 추가' : '옵션 그룹 편집') + '</h2>' +
        '<button class="icon-btn icon-btn--sm icon-btn--bare" data-sheet-close type="button" aria-label="닫기">' +
        icon('x') + '</button></div>' +

        '<div class="scroller esheet__scroll"><div class="agrid">' +
        field('그룹 이름', '<input class="input" data-d="name" value="' + esc(draft.name) + '" maxlength="20" placeholder="예: 사이즈">') +
        field('선택 방식',
          '<div class="seg">' +
          '<button class="seg__item' + (draft.type === 'single' ? ' is-on' : '') + '" data-dtype="single" type="button">단일 선택</button>' +
          '<button class="seg__item' + (draft.type === 'multi' ? ' is-on' : '') + '" data-dtype="multi" type="button">중복 선택</button>' +
          '</div>',
          draft.type === 'single' ? '하나만 고를 수 있습니다.' : '여러 개를 동시에 고를 수 있습니다.') +
        (draft.type === 'single'
          ? switchRow('필수 선택', '켜면 첫 옵션이 기본으로 선택되고, 해제할 수 없습니다.', draft.required, 'd:required')
          : '') +
        field('옵션 · 추가금',
          '<div data-opts>' + optRows() + '</div>' +
          '<button class="add-btn" data-oadd type="button">' + icon('plus') + ' 옵션 추가</button>',
          '추가금이 0이면 손님 화면에 "무료"로 표시됩니다.') +
        '</div></div>' +

        '<div class="esheet__foot">' +
        (isNew ? '' :
          '<button class="btn btn--danger btn--lg" data-dremove type="button" aria-label="삭제">' + icon('trash') + '</button>') +
        '<button class="btn btn--quiet btn--lg" data-sheet-close type="button">취소</button>' +
        '<button class="btn btn--primary btn--lg" data-dsave type="button">저장</button>' +
        '</div>';
    }

    var sheet = UI.openSheet(html(), { label: '옵션 그룹 편집' });

    function repaint() {
      sheet.core.innerHTML = html();
    }

    sheet.core.addEventListener('input', function (e) {
      var t = e.target;
      if (t.matches('[data-d="name"]')) { draft.name = t.value; return; }
      if (t.matches('[data-o]')) {
        var i = Number(t.getAttribute('data-i'));
        var k = t.getAttribute('data-o');
        if (!draft.options[i]) return;
        draft.options[i][k] = k === 'price'
          ? Math.max(0, Math.round(Number(t.value) || 0))
          : t.value;
      }
    });

    sheet.core.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-sheet-close]'))) { UI.closeSheet(); return; }

      if ((t = e.target.closest('[data-dtype]'))) {
        draft.type = t.getAttribute('data-dtype');
        if (draft.type === 'multi') draft.required = false;
        repaint(); return;
      }
      if ((t = e.target.closest('[data-switch="d:required"]'))) {
        draft.required = !draft.required; repaint(); return;
      }
      if ((t = e.target.closest('[data-oadd]'))) {
        draft.options.push({ id: 'o' + (draft.options.length + 1) + Math.random().toString(36).slice(2, 5), name: '', price: 0 });
        repaint(); return;
      }
      if ((t = e.target.closest('[data-odel]'))) {
        if (draft.options.length <= 1) { UI.toast('옵션은 최소 1개가 필요합니다', 'warn'); return; }
        draft.options.splice(Number(t.getAttribute('data-odel')), 1);
        repaint(); return;
      }

      if ((t = e.target.closest('[data-dsave]'))) {
        if (!draft.name.trim()) { UI.toast('그룹 이름을 입력해 주세요', 'warn'); return; }
        var named = draft.options.filter(function (o) { return o.name.trim(); });
        if (!named.length) { UI.toast('옵션 이름을 하나 이상 입력해 주세요', 'warn'); return; }
        draft.options = named;

        var groups = Store.config.optionGroups;
        var idx = -1;
        groups.forEach(function (g, i) { if (g.id === draft.id) idx = i; });
        if (idx >= 0) groups[idx] = draft; else groups.push(draft);
        commitNow();
        UI.closeSheet();
        UI.toast(isNew ? '옵션 그룹을 추가했습니다' : '저장했습니다');
        return;
      }

      if ((t = e.target.closest('[data-dremove]'))) {
        var used = Store.config.menus.filter(function (m) {
          return m.optionGroupIds.indexOf(draft.id) >= 0;
        }).length;
        UI.confirm('이 옵션 그룹을 삭제할까요?',
          used ? used + '개 메뉴에서 연결이 함께 해제됩니다.' : '되돌릴 수 없습니다.',
          '삭제', 'danger').then(function (ok) {
          if (!ok) return;
          Store.config.optionGroups = Store.config.optionGroups.filter(function (g) { return g.id !== draft.id; });
          Store.config.menus.forEach(function (m) {
            m.optionGroupIds = m.optionGroupIds.filter(function (id) { return id !== draft.id; });
          });
          commitNow();
          UI.closeSheet();
          UI.toast('삭제했습니다');
        });
      }
    });
  }

  /* =========================================================
     5) 데이터
     ========================================================= */
  function viewData() {
    var u = Store.usage();
    var pct = Math.round(u.ratio * 100);
    var lvl = pct > 85 ? ' meter--danger' : pct > 60 ? ' meter--warn' : '';

    var presets =
      '<div class="presets">' +
      global.KIO_PRESETS.map(function (p) {
        return '<button class="preset" data-preset="' + p.id + '" type="button">' +
          '<span class="preset__chip" style="--art-base:' + p.art.base +
          ';--art-a:' + p.art.a + ';--art-b:' + p.art.b + '"></span>' +
          '<span class="preset__name">' + esc(p.label) + '</span>' +
          '<span class="preset__meta">' + esc(p.blurb) + '</span>' +
          '</button>';
      }).join('') + '</div>';

    var storage =
      '<div class="agrid">' +
      '<div class="field">' +
      '<label class="field__label">저장 용량</label>' +
      '<div class="meter' + lvl + '"><div class="meter__fill" style="width:' + Math.max(2, pct) + '%"></div></div>' +
      '<p class="field__hint num">' + fmtBytes(u.bytes) + ' / 약 5 MB · ' + pct + '%' +
      (u.ok ? '' : ' · 이 브라우저에서는 저장이 되지 않아 새로고침하면 사라집니다') + '</p>' +
      '</div>' +
      '<button class="btn btn--danger btn--lg btn--block" data-reset type="button">' +
      icon('refresh') + ' 전체 초기화</button>' +
      '</div>';

    return sec('프리셋 불러오기',
      '프리셋은 편집 가능한 초기 데이터일 뿐입니다. 불러온 뒤 이름·사진·가격을 전부 바꿀 수 있습니다. 지금 만든 구성은 사라집니다.',
      presets, 0) +
      sec('저장소',
        '이미지를 많이 올리면 용량이 빠르게 찹니다. 가득 차면 저장이 실패합니다.',
        storage, 1);
  }

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  }

  /* =========================================================
     6) 주문 로그
     ========================================================= */
  function viewOrders() {
    var orders = Store.orders;
    if (!orders.length) {
      return sec('주문 로그', '',
        emptyBox('아직 완료된 주문이 없습니다', '손님 화면에서 모의 결제를 끝내면 여기에 쌓입니다.'), 0);
    }

    var rows = orders.map(function (o, i) {
      var d = new Date(o.at);
      var stamp = (d.getMonth() + 1) + '/' + d.getDate() + ' ' +
        ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      var method = { card: '카드', easy: '간편결제', cash: '현금' }[o.method] || '—';

      return '<div class="olog" style="--i:' + Math.min(i, 12) + '">' +
        '<div class="olog__top">' +
        '<span class="olog__no">' + esc(o.no) + '</span>' +
        '<span class="olog__when num">' + stamp + '</span>' +
        '</div>' +
        '<p class="olog__items">' +
        esc(o.lines.map(function (l) { return l.name + ' ×' + l.qty; }).join(', ')) +
        '</p>' +
        '<div class="olog__foot">' +
        '<span class="badge">' + (o.orderType === 'takeout' ? '포장' : '매장 식사') + ' · ' + method + '</span>' +
        '<span class="olog__total num">' + esc(Store.money(o.total)) + '</span>' +
        '</div></div>';
    }).join('');

    return sec('주문 로그', '최근 ' + orders.length + '건. 최대 60건까지 보관합니다.',
      rows + '<button class="add-btn add-btn--danger" data-oclear type="button">' +
      icon('trash') + ' 로그 전체 삭제</button>', 0);
  }

  function emptyBox(title, desc) {
    return '<div class="empty" style="padding:var(--s-10) var(--s-4)">' +
      '<span class="empty__icon">' + icon('empty') + '</span>' +
      '<p class="empty__title">' + esc(title) + '</p>' +
      (desc ? '<p class="empty__desc">' + esc(desc) + '</p>' : '') + '</div>';
  }

  /* =========================================================
     드래프트 시트 공통 배선 (메뉴 편집기)
     ========================================================= */
  function wireDraft(sheet, draft, hooks) {
    sheet.core.addEventListener('input', function (e) {
      var t = e.target;
      var k = t.getAttribute('data-d');
      if (!k) return;
      draft[k] = (k === 'price' || k === 'kcal')
        ? Math.max(0, Math.round(Number(t.value) || 0))
        : t.value;
    });

    sheet.core.addEventListener('change', function (e) {
      var t = e.target;
      var k = t.getAttribute('data-d');
      if (k === 'categoryId') draft.categoryId = t.value;
    });

    sheet.core.addEventListener('click', function (e) {
      var t;

      if ((t = e.target.closest('[data-sheet-close]'))) { UI.closeSheet(); return; }

      if ((t = e.target.closest('[data-switch^="d:"]'))) {
        var key = t.getAttribute('data-switch').slice(2);
        draft[key] = !draft[key];
        t.setAttribute('aria-checked', String(!!draft[key]));
        return;
      }

      if ((t = e.target.closest('[data-dg]'))) {
        var gid = t.getAttribute('data-dg');
        var arr = draft[hooks.chipKey];
        var at = arr.indexOf(gid);
        if (at >= 0) arr.splice(at, 1); else arr.push(gid);
        t.classList.toggle('is-on', at < 0);
        return;
      }

      if ((t = e.target.closest('[data-dimg]'))) {
        var mode = t.getAttribute('data-dimg');
        if (mode === 'clear') {
          draft.image = '';
          hooks.onImage();
        } else if (mode === 'file') {
          pickFile(function (dataUrl) { draft.image = dataUrl; hooks.onImage(); });
        } else {
          promptURL(draft.image).then(function (url) {
            if (url == null) return;
            draft.image = url;
            hooks.onImage();
          });
        }
        return;
      }

      if ((t = e.target.closest('[data-dsave]'))) {
        if (hooks.onSave() !== false) UI.closeSheet();
        return;
      }

      if ((t = e.target.closest('[data-dremove]'))) {
        hooks.onRemove().then(function (done) { if (done) UI.closeSheet(); });
      }
    });
  }

  /* =========================================================
     이미지 입력
     ========================================================= */
  var pickCb = null;

  function pickFile(cb) {
    var input = $('#filePicker');
    pickCb = cb;
    input.value = '';
    input.click();
  }

  function onFilePicked(e) {
    var file = e.target.files && e.target.files[0];
    if (!file || !pickCb) return;
    var cb = pickCb;
    pickCb = null;

    UI.toast('이미지를 줄이는 중…');
    Store.imageFromFile(file, 720, function (dataUrl, err) {
      if (err) { UI.toast(err, 'warn'); return; }
      var kb = Math.round(dataUrl.length * 0.75 / 1024);
      if (kb > 900) {
        UI.toast('이미지가 큽니다 (' + kb + 'KB). 저장 용량을 확인하세요.', 'warn', 3200);
      }
      cb(dataUrl);
    });
  }

  function promptURL(current) {
    return UI.dialog({
      html:
        '<h2 class="dialog__title">이미지 URL</h2>' +
        '<p class="dialog__body">외부 이미지 주소를 붙여 넣으세요. 주소가 끊기면 자동으로<br>기본 그래픽이 대신 표시됩니다.</p>' +
        '<div class="field" style="margin-top:var(--s-6);text-align:left">' +
        '<input class="input" id="__url" placeholder="https://…" value="' + esc(current || '') + '">' +
        '</div>',
      actions: [
        { label: '취소', kind: 'quiet', value: false },
        { label: '적용', kind: 'primary', value: true }
      ],
      onMount: function (d) {
        var el = d.core.querySelector('#__url');
        setTimeout(function () { el.focus(); el.select(); }, 60);
        promptURL._el = el;
      }
    }).then(function (v) {
      var el = promptURL._el;
      promptURL._el = null;
      return v === true && el ? el.value.trim() : null;
    });
  }

  /* =========================================================
     이벤트 바인딩
     ========================================================= */
  function bind() {
    var panel = $('#adminPanel');
    var nav = $('#adminNav');
    $('#filePicker').addEventListener('change', onFilePicked);

    nav.addEventListener('click', function (e) {
      var t = e.target.closest('[data-asec]');
      if (!t) return;
      section = t.getAttribute('data-asec');
      render();
    });

    /* -- 타이핑: 다시 그리지 않고 모델만 갱신 --------------- */
    panel.addEventListener('input', function (e) {
      var t = e.target, k;

      if ((k = t.getAttribute('data-store'))) {
        Store.config.store[k] = t.value;
        if (k === 'name') $('#adminStoreName').textContent = t.value;
        commitSoon(); return;
      }
      if ((k = t.getAttribute('data-setting'))) {
        if (k === 'pin') {
          t.value = t.value.replace(/\D/g, '').slice(0, 4);
          if (t.value.length === 4) { Store.config.settings.pin = t.value; commitSoon(); }
          return;
        }
        Store.config.settings[k] = Number(t.value) || Store.config.settings[k];
        commitSoon(); return;
      }
      if ((k = t.getAttribute('data-cat-name'))) {
        var cat = Store.getCategory(k);
        if (cat) { cat.name = t.value; commitSoon(); }
      }
    });

    panel.addEventListener('change', function (e) {
      var t = e.target, k;
      if ((k = t.getAttribute('data-store')) === 'currency') {
        Store.config.store.currency = t.value;
        commitNow();
      }
    });

    /* -- 클릭 ------------------------------------------------ */
    panel.addEventListener('click', function (e) {
      var t;

      /* 테마 */
      if ((t = e.target.closest('[data-theme]'))) {
        Store.config.store.theme = t.getAttribute('data-theme');
        commitNow();
        return;
      }

      /* 스위치 */
      if ((t = e.target.closest('[data-switch]'))) {
        var sw = t.getAttribute('data-switch');
        if (sw === 'orderType') {
          Store.config.settings.orderTypeEnabled = !Store.config.settings.orderTypeEnabled;
          commitNow();
        } else if (sw === 'largeText') {
          Store.setPrefs({ largeText: !Store.prefs.largeText });
          render();
        }
        return;
      }

      /* 이미지 */
      if ((t = e.target.closest('[data-img]'))) {
        var path = t.getAttribute('data-img').split('.');
        var mode = t.getAttribute('data-mode');
        var apply = function (val) {
          Store.config[path[0]][path[1]] = val;
          commitNow();
        };
        if (mode === 'clear') apply('');
        else if (mode === 'file') pickFile(apply);
        else promptURL(Store.config[path[0]][path[1]]).then(function (u) { if (u != null) apply(u); });
        return;
      }

      /* 카테고리 */
      if ((t = e.target.closest('[data-cadd]'))) {
        Store.config.categories.push({
          id: Store.uid('c'), name: '새 카테고리',
          order: Store.config.categories.length, visible: true
        });
        commitNow();
        UI.toast('카테고리를 추가했습니다');
        return;
      }
      if ((t = e.target.closest('[data-cvis]'))) {
        var c = Store.getCategory(t.getAttribute('data-cvis'));
        if (c) { c.visible = !c.visible; commitNow(); }
        return;
      }
      if ((t = e.target.closest('[data-cmove]'))) {
        move(Store.config.categories, t.getAttribute('data-cmove'), Number(t.getAttribute('data-d')));
        Store.config.categories.forEach(function (x, i) { x.order = i; });
        commitNow();
        return;
      }
      if ((t = e.target.closest('[data-cdel]'))) {
        var cid = t.getAttribute('data-cdel');
        var cc = Store.getCategory(cid);
        var n = Store.menusOf(cid).length;
        if (Store.config.categories.length <= 1) {
          UI.toast('카테고리는 최소 1개가 필요합니다', 'warn');
          return;
        }
        UI.confirm('카테고리를 삭제할까요?',
          '"' + (cc ? cc.name : '') + '"' + (n ? ' 안의 메뉴 ' + n + '개도 함께 삭제됩니다.' : ' 을(를) 삭제합니다.'),
          '삭제', 'danger').then(function (ok) {
          if (!ok) return;
          Store.config.menus = Store.config.menus.filter(function (m) { return m.categoryId !== cid; });
          Store.config.categories = Store.config.categories.filter(function (x) { return x.id !== cid; });
          commitNow();
          UI.toast('삭제했습니다');
        });
        return;
      }

      /* 메뉴 */
      if ((t = e.target.closest('[data-madd]'))) { openMenuEditor(null, t.getAttribute('data-madd')); return; }
      if ((t = e.target.closest('[data-medit]'))) { openMenuEditor(t.getAttribute('data-medit')); return; }
      if ((t = e.target.closest('[data-mmove]'))) {
        moveWithin(Store.config.menus, t.getAttribute('data-mmove'), Number(t.getAttribute('data-d')));
        commitNow();
        return;
      }

      /* 옵션 그룹 */
      if ((t = e.target.closest('[data-gadd]')))  { openGroupEditor(null); return; }
      if ((t = e.target.closest('[data-gedit]'))) { openGroupEditor(t.getAttribute('data-gedit')); return; }

      /* 데이터 */
      if ((t = e.target.closest('[data-preset]'))) {
        var pid = t.getAttribute('data-preset');
        var p = null;
        global.KIO_PRESETS.forEach(function (x) { if (x.id === pid) p = x; });
        UI.confirm('"' + (p ? p.label : '') + '" 프리셋을 불러올까요?',
          '지금 만든 매장 구성은 모두 사라지고 프리셋 데이터로 바뀝니다.\n관리자 PIN은 그대로 유지됩니다.',
          '불러오기', 'primary').then(function (ok) {
          if (!ok) return;
          Store.loadPreset(pid);
          global.KIO_CUSTOMER.resetCategory();
          render();
          UI.toast('프리셋을 불러왔습니다');
        });
        return;
      }
      if ((t = e.target.closest('[data-reset]'))) {
        UI.confirm('전체 초기화할까요?',
          '매장 구성 · 주문 로그 · 관리자 PIN이 모두 지워지고 기본 카페 프리셋으로 돌아갑니다.',
          '초기화', 'danger').then(function (ok) {
          if (!ok) return;
          Store.factoryReset();
          global.KIO_CUSTOMER.resetCategory();
          render();
          UI.toast('초기화했습니다');
        });
        return;
      }

      /* 주문 로그 */
      if ((t = e.target.closest('[data-oclear]'))) {
        UI.confirm('주문 로그를 모두 지울까요?', '기록만 삭제되고 매장 구성은 그대로입니다.', '삭제', 'danger')
          .then(function (ok) {
            if (!ok) return;
            Store.clearOrders();
            render();
            UI.toast('로그를 삭제했습니다');
          });
      }
    });
  }

  /* 배열 안에서 id를 한 칸 옮긴다 */
  function move(arr, id, d) {
    var i = -1;
    arr.forEach(function (x, k) { if (x.id === id) i = k; });
    var j = i + d;
    if (i < 0 || j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }

  /* 같은 카테고리 안에서만 옮긴다 (전체 배열의 인덱스는 유지) */
  function moveWithin(all, id, d) {
    var item = null;
    all.forEach(function (m) { if (m.id === id) item = m; });
    if (!item) return;

    var idxs = [];
    all.forEach(function (m, i) { if (m.categoryId === item.categoryId) idxs.push(i); });
    var pos = idxs.indexOf(all.indexOf(item));
    var target = pos + d;
    if (target < 0 || target >= idxs.length) return;

    var a = idxs[pos], b = idxs[target];
    var tmp = all[a]; all[a] = all[b]; all[b] = tmp;
  }

  global.KIO_ADMIN = {
    bind: bind,
    render: render,
    open: function () { section = 'store'; render(); }
  };

})(window);
