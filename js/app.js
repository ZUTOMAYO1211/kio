/* ============================================================
   KIO — 앱 셸
   스케일링 · 테마 · 화면 전환 · 무동작 타임아웃 · 관리자 진입
   ============================================================ */
(function (global) {
  'use strict';

  var Store = global.KIO_STORE;
  var UI = global.KIO_UI;
  var L = global.KIO_I18N, tr = L.html;
  var CUST = global.KIO_CUSTOMER;
  var ADMIN = global.KIO_ADMIN;
  var $ = UI.$, $$ = UI.$$;

  var REF_W = 1080, REF_H = 1920;

  var stage, stageWrap, device;
  var current = 'idle';

  /* ---- 색 ------------------------------------------------- */
  function hex2rgb(h) {
    var s = String(h).replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    var n = parseInt(s, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgba(h, a) {
    var c = hex2rgb(h);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }
  /* WCAG 상대 휘도. 어두운 대기 화면 위에서 액센트 CTA 가 배경에
     묻히는지 판단하는 데 쓴다. */
  function luminance(hex) {
    var c = hex2rgb(hex);
    var f = function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function mix(a, b, t) {
    var x = hex2rgb(a), y = hex2rgb(b);
    var f = function (p, q) { return Math.round(p + (q - p) * t); };
    return 'rgb(' + f(x.r, y.r) + ',' + f(x.g, y.g) + ',' + f(x.b, y.b) + ')';
  }

  function theme() {
    var id = Store.config.store.theme, t = null;
    global.KIO_THEMES.forEach(function (x) { if (x.id === id) t = x; });
    return t || global.KIO_THEMES[0];
  }

  /* =========================================================
     1. 스케일링
     기준 1080 × 1920 캔버스를 뷰포트에 맞춰 균일 축소한다.
     가로 화면에서는 9:16 프레임, 세로 휴대폰에서는 꽉 채운다.
     ========================================================= */
  function fit() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var framed = (vw / vh) > (REF_W / REF_H) * 1.06;
    var pad    = framed ? Math.round(Math.min(24, Math.max(8, vh * 0.015))) : 0;
    var margin = framed ? Math.round(vh * 0.045) : 0;

    var availW = Math.max(120, vw - pad * 2 - margin);
    var availH = Math.max(120, vh - pad * 2 - margin);

    var k = Math.min(availW / REF_W, availH / REF_H);
    var stageH = framed ? REF_H : Math.max(REF_H, Math.floor(availH / k));
    var outR = framed ? Math.round(40 * k) : 0;

    stage.style.height = stageH + 'px';
    stage.style.transform = 'scale(' + k + ')';

    stageWrap.style.width  = Math.round(REF_W * k) + 'px';
    stageWrap.style.height = Math.round(stageH * k) + 'px';
    stageWrap.style.setProperty('--screen-r', outR + 'px');

    device.style.setProperty('--frame-pad', pad + 'px');
    device.style.setProperty('--frame-r', (outR + pad) + 'px');
    device.setAttribute('data-framed', String(framed));

    document.body.setAttribute('data-orient', vh < 480 && vw > vh ? 'short' : 'tall');
  }

  /* =========================================================
     2. 테마
     ========================================================= */
  function applyTheme() {
    var t = theme();
    stage.style.setProperty('--accent', t.accent);
    stage.style.setProperty('--accent-deep', t.deep);
    stage.style.setProperty('--on-accent', t.on);
    stage.style.setProperty('--accent-tint', rgba(t.accent, 0.10));
    stage.style.setProperty('--accent-tint-2', rgba(t.accent, 0.20));

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.deep);
  }

  /* =========================================================
     3. 홈

     요청 사양대로 큰 사진 한 장을 중간 위에 놓는다.
     사진은 매장이 지정한 시작 화면 이미지가 1순위,
     없으면 대표 메뉴 사진, 그것도 없으면 첫 메뉴,
     메뉴가 아예 없으면 테마 색 면으로 물러난다.
     ========================================================= */
  function renderIdle() {
    var s = Store.config.store;

    /* 인라인 onerror 로 부모를 비우면 자기 자신이 분리되어 parentNode 가
       null 이 된다. 핸들러를 JS 로 잡아 폴백을 보장한다. */
    var shot = $('#homeShot');
    shot.innerHTML = '';
    if (s.heroImage) {
      var img = new Image();
      img.alt = '';
      img.onerror = function () { shot.innerHTML = ''; paintShot(shot); };
      img.src = s.heroImage;
      shot.appendChild(img);
      shot.className = 'home__shot';
    } else {
      paintShot(shot);
    }

    var mark = $('#homeMark');
    var initial = Store.glyphFor(s.name);
    if (s.logo) {
      mark.innerHTML = '';
      var li = new Image();
      li.alt = '';
      li.onerror = function () { mark.textContent = initial; };
      li.src = s.logo;
      mark.appendChild(li);
    } else {
      mark.textContent = initial;
    }

    /* 액센트가 밝아 흰 바닥과 대비가 3:1 아래면 잉크 버튼으로.
       액센트는 로고 마크에 남아 브랜드는 유지된다. */
    $('[data-screen="idle"]').classList.toggle('home--inkcta', luminance(theme().accent) > 0.42);

    $('#homeName').textContent = s.name;
    $('#homeTag').textContent = s.tagline;
    $('#homeTitle').innerHTML = UI.nl2br(L.text(s.headline));

    var lede = $('#homeLede');
    lede.textContent = L.text(s.lede);
    lede.style.display = s.lede ? '' : 'none';

    $('#otypeStore').textContent = s.name;
  }

  function paintShot(shot) {
    var menus = Store.config.menus;
    if (!menus.length) { shot.appendChild(themeField()); return; }

    var pick = null;
    menus.forEach(function (m) { if (!pick && m.feature && !m.soldOut) pick = m; });
    if (!pick) menus.forEach(function (m) { if (!pick && !m.soldOut) pick = m; });
    if (!pick) pick = menus[0];

    var photo = pick.image || global.KIO_MENU_IMAGES[pick.name] || '';
    photo = global.KIO_HERO_IMAGES[photo] || photo;
    shot.innerHTML = UI.thumb(pick.name, photo, { glyph: 190 });
    var image = shot.querySelector('img');
    if (image) { image.loading = 'eager'; image.fetchPriority = 'high'; }
  }

  function themeField() {
    var t = theme();
    var el = document.createElement('div');
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.background =
      'radial-gradient(70% 50% at 76% 14%, rgba(255,255,255,.20) 0%, transparent 64%),' +
      'linear-gradient(152deg, ' + mix(t.accent, '#FFFFFF', 0.34) + ' 0%, ' +
      t.accent + ' 56%, ' + mix(t.deep, '#101418', 0.22) + ' 100%)';
    return el;
  }

  /* =========================================================
     4. 화면 전환
     ========================================================= */
  var BACK = {
    ordertype: 'idle',
    menu: function () { return Store.config.settings.orderTypeEnabled ? 'ordertype' : 'idle'; },
    item: 'menu',
    cart: 'menu',
    pay: 'cart',
    pin: 'idle'
  };

  function go(name, dir) {
    if (name === current) return;
    var from = $('[data-screen="' + current + '"]');
    var to = $('[data-screen="' + name + '"]');
    if (!to) return;

    if (from) {
      from.classList.remove('is-active');
      from.classList.add('is-leaving');
      (function (el) { setTimeout(function () { el.classList.remove('is-leaving'); }, 260); })(from);
    }

    to.setAttribute('data-dir', dir === 'back' ? 'back' : 'fwd');
    to.classList.remove('is-leaving', 'is-active');
    void to.offsetWidth;
    to.classList.add('is-active');

    current = name;
    onEnter(name);
    resetIdle();
  }

  function onEnter(name) {
    UI.closeSheet(true);
    if (name === 'idle')  renderIdle();
    if (name === 'menu')  CUST.renderMenu();
    if (name === 'cart')  CUST.renderCart();
    if (name === 'pay')   CUST.renderPay();
    if (name === 'admin') ADMIN.open();
    if (name === 'pin')   resetPin();

    if (name !== 'item') CUST.dropDraft();
    if (name !== 'pay')  CUST.clearPayTimers();
    if (name !== 'done') CUST.clearDoneTimer();
  }

  function back() {
    var b = BACK[current];
    if (!b) return;
    go(typeof b === 'function' ? b() : b, 'back');
  }

  function goIdle() {
    CUST.clearPayTimers();
    CUST.clearDoneTimer();
    CUST.dropDraft();
    UI.closeSheet(true);
    UI.closeDialog(true);
    Store.resetSession();
    CUST.resetCategory();
    go('idle', 'back');
  }

  function startOrder() {
    Store.resetSession();
    CUST.resetCategory();
    if (Store.config.settings.orderTypeEnabled) {
      go('ordertype');
    } else {
      Store.session.orderType = 'dinein';
      CUST.renderMenu();
      go('menu');
    }
  }

  /* =========================================================
     5. 차별점 ② — 큰 글씨 모드
     ========================================================= */
  function applyLargeText() {
    var on = !!Store.prefs.largeText;
    stage.classList.toggle('is-large', on);
    $$('[data-act="toggle-big"], #homeBig').forEach(function (b) {
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-on', on);
    });
  }

  function toggleLargeText() {
    Store.setPrefs({ largeText: !Store.prefs.largeText });
    applyLargeText();
    /* 열 수가 바뀌므로 페이지 단위를 다시 계산한다 */
    if (current === 'menu') CUST.renderMenu();
    UI.toast(Store.prefs.largeText ? tr('큰 글씨 모드를 켰습니다') : tr('큰 글씨 모드를 껐습니다'));
  }

  /* =========================================================
     6. 차별점 ③ — 무동작 타임아웃 안내
     갑자기 초기화되지 않는다. 먼저 묻고, 계속할 수 있게 한다.
     ========================================================= */
  var idleTimer = null, ringTimer = null, idleLocked = false;
  var WATCHED = ['ordertype', 'menu', 'item', 'cart', 'pay'];

  function clearIdleTimers() {
    clearTimeout(idleTimer); idleTimer = null;
    clearInterval(ringTimer); ringTimer = null;
  }

  function resetIdle() {
    clearIdleTimers();
    if (idleLocked) return;
    if (WATCHED.indexOf(current) < 0) return;
    idleTimer = setTimeout(warnIdle, Store.config.settings.idleSeconds * 1000);
  }

  function lockIdle(on) {
    idleLocked = !!on;
    if (on) clearIdleTimers(); else resetIdle();
  }

  function warnIdle() {
    if (WATCHED.indexOf(current) < 0) return;
    var total = Store.config.settings.warnSeconds;
    var left = total;
    var C = 2 * Math.PI * 84;

    UI.dialog({
      dismissible: false,
      html:
        '<div class="ring">' +
        '<svg viewBox="0 0 188 188">' +
        '<circle class="ring__track" cx="94" cy="94" r="84"></circle>' +
        '<circle class="ring__bar" id="idleRing" cx="94" cy="94" r="84" ' +
        'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="0"></circle>' +
        '</svg><span class="ring__num num" id="idleNum">' + left + '</span></div>' +
        tr('<h2 class="dialog__title">아직 계신가요?</h2>') +
        '<p class="dialog__body"><span class="num" id="idleNum2">' + left + tr('</span>초 후 처음 화면으로 돌아갑니다.<br>') +
        tr('담아 두신 메뉴는 그대로 두고 계속하실 수 있어요.</p>'),
      actions: [
        { label: tr('처음으로'), kind: 'quiet', value: 'reset' },
        { label: tr('계속하기'), kind: 'primary', value: 'stay' }
      ],
      onMount: function () {
        /* 남은 시간은 벽시계로 계산한다. 탭이 뒤로 가 타이머가 눌리면
           카운트를 세는 방식은 화면에 멈춘 숫자를 남긴 채 안 끝난다. */
        var deadline = Date.now() + total * 1000;
        ringTimer = setInterval(function () {
          left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
          var n1 = $('#idleNum'), n2 = $('#idleNum2'), bar = $('#idleRing');
          if (n1) n1.textContent = String(left);
          if (n2) n2.textContent = String(left);
          if (bar) bar.setAttribute('stroke-dashoffset', String(C * (1 - left / total)));
          if (left <= 0) {
            clearInterval(ringTimer); ringTimer = null;
            UI.closeDialog();
            goIdle();
          }
        }, 250);
      }
    }).then(function (v) {
      clearInterval(ringTimer); ringTimer = null;
      if (v === 'reset') goIdle(); else resetIdle();
    });
  }

  /* =========================================================
     7. 관리자 진입 — 로고 5회 연속 탭 (3초 이내)
     ========================================================= */
  var taps = [];

  function onBrandTap() {
    var now = Date.now();
    taps.push(now);
    taps = taps.filter(function (t) { return now - t <= 3000; });
    if (taps.length >= 5) { taps = []; go('pin'); return; }
    if (taps.length >= 3) UI.toast((5 - taps.length) + '번 더 누르면 편집 모드', 'ok', 1100);
  }

  var pinBuf = '';
  function resetPin() { pinBuf = ''; paintPin(); }
  function paintPin() {
    $$('#pinDots .pin__dot').forEach(function (d, i) {
      d.classList.toggle('is-on', i < pinBuf.length);
    });
  }
  function onPinKey(key) {
    if (key === 'cancel') { go('idle', 'back'); return; }
    if (key === 'back') { pinBuf = pinBuf.slice(0, -1); paintPin(); return; }
    if (pinBuf.length >= 4) return;

    pinBuf += key;
    paintPin();

    if (pinBuf.length === 4) {
      var ok = pinBuf === Store.config.settings.pin;
      setTimeout(function () {
        if (ok) { pinBuf = ''; paintPin(); go('admin'); }
        else {
          var box = $('#pinInner');
          box.classList.add('is-bad');
          setTimeout(function () { box.classList.remove('is-bad'); }, 480);
          pinBuf = ''; paintPin();
          UI.toast('PIN이 맞지 않습니다', 'warn');
        }
      }, 160);
    }
  }

  /* =========================================================
     8. 전역 이벤트
     ========================================================= */
  function bindGlobal() {
    ['pointerdown', 'keydown', 'wheel'].forEach(function (t) {
      stage.addEventListener(t, resetIdle, { passive: true });
    });

    /* 썸네일 이미지가 깨지면 숨겨서 뒤에 깔린 생성 아트를 드러낸다.
       error 는 버블링하지 않으므로 캡처 단계에서 받는다. */
    stage.addEventListener('error', function (e) {
      var t = e.target;
      if (t && t.tagName === 'IMG' && t.closest('.thumb')) t.style.display = 'none';
    }, true);

    /* overflow:clip 을 모르는 브라우저 대비 — 무엇이 스크롤을 유발하든
       프레임 자체는 절대 움직이지 않게 붙잡아 둔다. */
    [stageWrap, stage].forEach(function (el) {
      el.addEventListener('scroll', function () {
        if (el.scrollTop || el.scrollLeft) { el.scrollTop = 0; el.scrollLeft = 0; }
      }, { passive: true });
    });

    $('#brandTap').addEventListener('click', onBrandTap);
    $('#startBtn').addEventListener('click', startOrder);
    $('#homeBig').addEventListener('click', toggleLargeText);
    $('#pinPad').addEventListener('click', function (e) {
      var t = e.target.closest('[data-key]');
      if (t) onPinKey(t.getAttribute('data-key'));
    });

    $('#screens').addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-nav="back"]'))) { back(); return; }
      if (!(t = e.target.closest('[data-act]'))) return;

      var act = t.getAttribute('data-act');

      if (act === 'toggle-big') { toggleLargeText(); return; }

      if (act === 'go-idle') {
        if (Store.cart.count() > 0) {
          UI.confirm(tr('주문을 취소할까요?'), tr('담아 두신 메뉴가 모두 사라집니다.'), tr('처음으로'), 'danger')
            .then(function (ok) { if (ok) goIdle(); });
        } else goIdle();
        return;
      }
      if (act === 'go-cart') {
        if (Store.cart.count() === 0) { UI.toast(tr('먼저 메뉴를 담아 주세요'), 'warn'); return; }
        go('cart'); return;
      }
      if (act === 'go-menu') { go('menu', 'back'); return; }
      if (act === 'go-pay') {
        if (Store.cart.count() === 0) { UI.toast(tr('담은 메뉴가 없습니다'), 'warn'); return; }
        /* 주문 방식을 여기서 한 번 더 묻는다. 메뉴 화면에는 뒤로 가기가 없다 */
        CUST.confirmOrderType().then(function (ok) { if (ok) go('pay'); });
        return;
      }
      if (act === 'cart-clear') {
        UI.confirm(tr('전체 취소할까요?'), tr('담은 메뉴를 모두 비웁니다.'), tr('전체 취소'), 'danger')
          .then(function (ok) {
            if (!ok) return;
            Store.cart.clear();
            CUST.renderCart();
            UI.toast(tr('주문 내역을 비웠습니다'));
          });
        return;
      }
      if (act === 'done-home') { goIdle(); return; }
      if (act === 'admin-exit') {
        Store.commit('config');
        CUST.resetCategory();
        goIdle();
        UI.toast('편집 내용을 저장했습니다');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('#sheetLayer').innerHTML) { UI.closeSheet(); return; }
      if ($('#modalLayer').innerHTML) { UI.closeDialog(); return; }
      back();
    });

    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);

    Store.subscribe(function (what) {
      if (what === 'cart') {
        CUST.renderPayBar();
        if (current === 'cart') CUST.renderCart();
      }
      if (what === 'config' || what === 'config-quiet') {
        applyTheme();
        renderIdle();
        Store.cart.prune();
      }
      if (what === 'prefs') {
        applyLargeText();
        L.apply();
        renderIdle();
        $('#payBar').__built = false;
        CUST.renderPayBar();
      }
    });
  }

  /* =========================================================
     9. 부팅
     ========================================================= */
  function boot() {
    stage = $('#stage');
    stageWrap = $('#stageWrap');
    device = $('#device');

    Store.init();
    L.init();
    UI.mountLayers();

    fit();
    applyTheme();
    applyLargeText();
    renderIdle();

    CUST.bind();
    ADMIN.bind();
    bindGlobal();
    CUST.renderPayBar();

    $('[data-screen="idle"]').classList.add('is-active');
    current = 'idle';

    /* 웹폰트가 늦게 오면 레이아웃이 미세하게 달라진다 → 한 번 더 맞춘다 */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(function () {});
    }
    setTimeout(fit, 400);
  }

  global.KIO_APP = {
    go: go, back: back, goIdle: goIdle,
    resetIdle: resetIdle, lockIdle: lockIdle,
    fit: fit,
    get current() { return current; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window);
