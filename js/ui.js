/* ============================================================
   KIO — UI 프리미티브
   아이콘 · 썸네일 · 스플릿플랩 숫자 · 시트 · 다이얼로그 · 토스트
   ============================================================ */
(function (global) {
  'use strict';

  var Store = global.KIO_STORE;

  /* ---------------------------------------------------------
     DOM
     --------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }

  /* ---------------------------------------------------------
     아이콘 — 균일한 선 굵기의 라인 아이콘만 쓴다
     --------------------------------------------------------- */
  var P = {
    arrowR:  '<path d="M5 12h13M13 6l6 6-6 6"/>',
    arrowL:  '<path d="M19 12H6M11 18l-6-6 6-6"/>',
    plus:    '<path d="M12 5v14M5 12h14"/>',
    minus:   '<path d="M5 12h14"/>',
    check:   '<path d="m4 12.5 5 5L20 6.5"/>',
    x:       '<path d="M18 6 6 18M6 6l12 12"/>',
    trash:   '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12.2a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8L18 7"/><path d="M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2"/>',
    up:      '<path d="m6 14 6-6 6 6"/>',
    down:    '<path d="m6 10 6 6 6-6"/>',
    home:    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5"/>',
    cart:    '<path d="M3 4h2.2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17.5" cy="20" r="1.2"/>',
    card:    '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/>',
    phone:   '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    cash:    '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    store:   '<path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"/><path d="M3 6.5 4.5 3h15L21 6.5a2.6 2.6 0 0 1-4.5 2 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 6.5Z"/>',
    grid:    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
    list:    '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    sliders: '<path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2"/><circle cx="10" cy="16" r="2"/>',
    data:    '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    receipt: '<path d="M6 3h12v18l-2.4-1.6L13.2 21 12 19.6 10.8 21 8.4 19.4 6 21Z"/><path d="M9.5 8h5M9.5 12h5"/>',
    image:   '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-4.5 4.5 4 3-2.5L20 18"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-.8 4.6"/><path d="M20.5 5.5V11H15"/>',
    text:    '<path d="M2.5 15.5 5.6 8l3.1 7.5m-5.3-2.4h4.4"/><path d="M12.5 18.5 17 7l4.5 11.5m-7.6-3.6h6.2"/>',
    warn:    '<path d="M12 3.5 21.5 20h-19Z"/><path d="M12 10v4.2M12 17.2h.01"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    empty:   '<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5Z"/><path d="M4 8.5 12 13l8-4.5M12 13v7"/>',
    eye:     '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:  '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.4 7.5A17 17 0 0 0 2.5 12S6 18 12 18a9.3 9.3 0 0 0 3.4-.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',

    /* 카테고리용 */
    star:    '<path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.8Z"/>',
    burger:  '<path d="M3.5 8.6C3.5 6 7.3 4 12 4s8.5 2 8.5 4.6"/><path d="M3.5 11.5h17M4 14.8h16"/><path d="M3.5 17.4h17c0 1.4-1.2 2.6-2.6 2.6H6.1a2.6 2.6 0 0 1-2.6-2.6Z"/>',
    coffee:  '<path d="M4 8h13v6.5A4.5 4.5 0 0 1 12.5 19h-4A4.5 4.5 0 0 1 4 14.5Z"/><path d="M17 9.5h1.6a2.4 2.4 0 0 1 0 4.8H17"/><path d="M8 2.5v2.6M12 2.5v2.6"/>',
    drink:   '<path d="M5.5 7h13l-1.4 12.6a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9Z"/><path d="M4.5 7h15M14 3l-2 4"/>',
    fries:   '<path d="M6 10h12l-1 9.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8Z"/><path d="M6 13.5h12"/><path d="M9 10 8.2 4.4M12 10V4M15 10l.8-5.6"/>',
    dessert: '<path d="M5 12h14l-1 8.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-1.8Z"/><path d="M4 12a8 8 0 0 1 16 0"/><path d="M12 4V2.5"/><circle cx="12" cy="3" r="1.3"/>',
    chicken: '<path d="M13 4.5a5.5 5.5 0 0 1 5 8.2c-1 2-3.3 2.6-4.5 3.6-1 .9-1.2 3-3.2 3.6a3.4 3.4 0 0 1-4.3-4.3c.6-2 2.7-2.2 3.6-3.2 1-1.2 1.6-3.5 3.4-4.5"/><path d="m8.6 15.4-2.8 3"/>',
    bowl:    '<path d="M3 11h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z"/><path d="M12 11V7m0 0a2 2 0 1 1 2-2"/><path d="M2 22h20"/>',
    snack:   '<path d="M4.5 6.5h15l-1.2 13a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8Z"/><path d="M8.5 6.5V4a3.5 3.5 0 0 1 7 0v2.5"/><path d="M9 12h6"/>',
    tag:     '<path d="M3.5 11.4V4.5a1 1 0 0 1 1-1h6.9a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7Z"/><circle cx="7.8" cy="7.8" r="1.4"/>'
  };

  function icon(name, size) {
    var d = P[name] || P.info;
    var s = size ? ' width="' + size + '" height="' + size + '"' : '';
    return '<svg viewBox="0 0 24 24"' + s + ' fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      d + '</svg>';
  }

  /* 카테고리 이름에서 아이콘을 짐작한다. 관리자가 고르게 만들면
     일이 늘어나고, 아이콘이 없으면 레일이 훨씬 덜 읽힌다.       */
  var CAT_HINTS = [
    [/추천|인기|베스트|신메뉴|시즌/i,                      'star'],
    [/논커피|넌커피|non-?coffee/i,                        'drink'],
    [/커피|coffee|에스프레소|라떼|드립/i,                  'coffee'],
    [/음료|드링크|에이드|주스|스무디|주류|맥주|차|티\b|beverage/i, 'drink'],
    [/디저트|케이크|베이커리|빵|쿠키|dessert/i,            'dessert'],
    [/버거|burger/i,                                      'burger'],
    [/사이드|튀김|감자|프라이|side/i,                      'fries'],
    [/치킨|닭|chicken/i,                                  'chicken'],
    [/분식|떡볶이|면|국수|밥|식사|정식|간편식|도시락|델리|즉석/i, 'bowl'],
    [/스낵|간식|과자|snack/i,                             'snack'],
    [/생활|잡화|용품|비식품|기타/i,                        'grid'],
    [/세트|콤보|combo/i,                                  'store']
  ];

  function catIcon(name) {
    var s = String(name || '');
    for (var i = 0; i < CAT_HINTS.length; i++) {
      if (CAT_HINTS[i][0].test(s)) return CAT_HINTS[i][1];
    }
    return 'tag';
  }

  /* ---------------------------------------------------------
     썸네일 — 사진이 없으면 이름에서 결정적으로 플레이트를 만든다.
     끊긴 링크보다 의도된 자리표시가 낫다.
     --------------------------------------------------------- */
  function thumb(name, image, opts) {
    var o = opts || {};
    var cls = 'thumb' + (o.className ? ' ' + o.className : '');
    var over = o.overlay || '';
    /* 깨진 이미지는 app.js 의 캡처 단계 error 리스너가 숨긴다.
       뒤에 항상 생성 아트가 깔려 있어 그대로 대체된다. */
    var img = image ? '<img src="' + esc(image) + '" alt="" loading="lazy">' : '';
    return '<span class="' + cls + '">' + img + art(name, o) + over + '</span>';
  }

  function art(name, o) {
    var a = Store.artFor(name);
    var style = '--art-base:' + a.base + ';--art-a:' + a.a + ';--art-b:' + a.b +
      (o && o.glyph ? ';--glyph-size:' + o.glyph + 'px' : '');
    return '<span class="thumb__art" style="' + style + '">' +
      '<span class="thumb__glyph">' + esc(Store.glyphFor(name)) + '</span></span>';
  }

  /* ---------------------------------------------------------
     스플릿플랩 숫자
     금액이 바뀌면 바뀐 자릿수만 넘어간다. 이 화면에서 모션을
     쓰는 유일한 자리다.
     --------------------------------------------------------- */
  function flap(el, text) {
    if (!el) return;
    var next = String(text);
    var prev = el.__flap;

    if (prev === next) return;

    var chars = next.split('');
    if (!prev || prev.length !== chars.length) {
      el.innerHTML = chars.map(cell).join('');
      el.__flap = next;
      return;
    }

    var prevChars = prev.split('');
    var cells = el.children;
    chars.forEach(function (c, i) {
      if (prevChars[i] === c || !cells[i]) return;
      roll(cells[i], prevChars[i], c);
    });
    el.__flap = next;
  }

  function cell(c) {
    return '<span class="flap__d"><span class="flap__t"><b>' + esc(c) + '</b></span></span>';
  }

  function roll(cellEl, from, to) {
    var track = cellEl.firstElementChild;
    if (!track) return;
    track.classList.remove('is-rolling');
    track.innerHTML = '<b>' + esc(from) + '</b><b>' + esc(to) + '</b>';
    /* 두 글자를 얹은 다음 프레임에서 밀어 올려야 트랜지션이 산다 */
    void track.offsetWidth;
    track.classList.add('is-rolling');

    var settle = function () {
      track.removeEventListener('transitionend', settle);
      track.classList.remove('is-rolling');
      track.innerHTML = '<b>' + esc(to) + '</b>';
    };
    track.addEventListener('transitionend', settle);
    setTimeout(settle, 700);   /* 트랜지션이 안 오는 경우 대비 */
  }

  /* ---------------------------------------------------------
     오버레이
     --------------------------------------------------------- */
  var sheetLayer, modalLayer, toastStack;

  function mountLayers() {
    sheetLayer = $('#sheetLayer');
    modalLayer = $('#modalLayer');
    toastStack = $('#toastStack');
  }

  function fadeOut(layer, done) {
    layer.classList.add('is-closing');
    var t = setTimeout(finish, 380);
    function finish() {
      clearTimeout(t);
      layer.classList.remove('is-closing');
      layer.innerHTML = '';
      if (done) done();
    }
  }

  var currentSheet = null;

  function openSheet(innerHTML, opts) {
    var o = opts || {};
    closeSheet(true);

    sheetLayer.innerHTML =
      '<div class="scrim" data-sheet-scrim></div>' +
      '<div class="sheet" role="dialog" aria-modal="true"' +
      (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + '>' +
      '<span class="sheet__grip"></span>' +
      '<div class="sheet__core">' + innerHTML + '</div>' +
      '</div>';

    $('[data-sheet-scrim]', sheetLayer).addEventListener('click', function () {
      if (o.onDismiss) o.onDismiss();
      closeSheet();
    });

    currentSheet = {
      root: $('.sheet', sheetLayer),
      core: $('.sheet__core', sheetLayer),
      close: closeSheet
    };
    if (o.onMount) o.onMount(currentSheet);
    return currentSheet;
  }

  function closeSheet(immediate) {
    if (!sheetLayer || !sheetLayer.innerHTML) { currentSheet = null; return; }
    currentSheet = null;
    if (immediate) { sheetLayer.innerHTML = ''; return; }
    fadeOut(sheetLayer);
  }

  var currentDialog = null;

  function dialog(opts) {
    var o = opts || {};
    return new Promise(function (resolve) {
      closeDialog(true);

      var actions = (o.actions || [{ label: '확인', kind: 'primary', value: true }])
        .map(function (a) {
          return '<button class="btn btn--' + (a.kind || 'quiet') + ' btn--lg" ' +
            'data-dlg-val="' + esc(String(a.value)) + '" type="button">' + esc(a.label) + '</button>';
        }).join('');

      modalLayer.innerHTML =
        '<div class="scrim" data-dlg-scrim></div>' +
        '<div class="dialog-wrap"><div class="dialog" role="alertdialog" aria-modal="true">' +
        '<div class="dialog__core">' +
        (o.html || '') +
        (o.title ? '<h2 class="dialog__title">' + esc(o.title) + '</h2>' : '') +
        (o.body ? '<p class="dialog__body">' + nl2br(o.body) + '</p>' : '') +
        '<div class="dialog__actions">' + actions + '</div>' +
        '</div></div></div>';

      var done = false;
      function settle(v) {
        if (done) return;
        done = true;
        currentDialog = null;
        fadeOut(modalLayer, function () { resolve(v); });
      }

      $$('[data-dlg-val]', modalLayer).forEach(function (b) {
        b.addEventListener('click', function () {
          var raw = b.getAttribute('data-dlg-val');
          settle(raw === 'true' ? true : raw === 'false' ? false : raw);
        });
      });

      if (o.dismissible !== false) {
        $('[data-dlg-scrim]', modalLayer).addEventListener('click', function () { settle(null); });
      }

      currentDialog = {
        root: $('.dialog', modalLayer),
        core: $('.dialog__core', modalLayer),
        settle: settle
      };
      if (o.onMount) o.onMount(currentDialog);
    });
  }

  function closeDialog(immediate) {
    if (!modalLayer || !modalLayer.innerHTML) { currentDialog = null; return; }
    if (currentDialog && currentDialog.settle) { currentDialog.settle(null); return; }
    currentDialog = null;
    if (immediate) { modalLayer.innerHTML = ''; return; }
    fadeOut(modalLayer);
  }

  function confirm2(title, body, okLabel, kind) {
    return dialog({
      title: title,
      body: body,
      actions: [
        { label: '취소', kind: 'quiet', value: false },
        { label: okLabel || '확인', kind: kind || 'primary', value: true }
      ]
    }).then(function (v) { return v === true; });
  }

  function alert2(title, body, okLabel) {
    return dialog({
      title: title, body: body,
      actions: [{ label: okLabel || '확인', kind: 'primary', value: true }]
    });
  }

  function toast(msg, kind, ms) {
    if (!toastStack) return;
    var k = kind || 'ok';
    var el = document.createElement('div');
    el.className = 'toast toast--' + k;
    el.innerHTML = icon(k === 'warn' ? 'warn' : 'check') + '<span>' + esc(msg) + '</span>';
    toastStack.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
    }, ms || 2000);
  }

  global.KIO_UI = {
    $: $, $$: $$, esc: esc, nl2br: nl2br,
    icon: icon, catIcon: catIcon, thumb: thumb, art: art,
    flap: flap,
    mountLayers: mountLayers,
    openSheet: openSheet, closeSheet: closeSheet,
    dialog: dialog, closeDialog: closeDialog,
    confirm: confirm2, alert: alert2,
    toast: toast,
    get sheet() { return currentSheet; }
  };

})(window);
