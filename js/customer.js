/* ============================================================
   KIO — 고객 흐름
   메뉴(레일 + 그리드) · 상품 상세 · 주문 내역 · 결제 · 완료
   ============================================================ */
(function (global) {
  'use strict';

  var Store = global.KIO_STORE;
  var UI = global.KIO_UI;
  var $ = UI.$, $$ = UI.$$, esc = UI.esc, icon = UI.icon, thumb = UI.thumb;

  var activeCatId = null;
  var draft = null;          /* 상품 상세에서 편집 중인 선택 */
  var payTimers = [];
  var doneTimer = null;

  function app() { return global.KIO_APP; }

  function empty(ic, title, desc) {
    return '<div class="empty">' +
      '<span class="empty__icon">' + icon(ic) + '</span>' +
      '<p class="empty__title">' + esc(title) + '</p>' +
      (desc ? '<p class="empty__desc">' + esc(desc) + '</p>' : '') + '</div>';
  }

  /* =========================================================
     메뉴 — 좌측 카테고리 레일 + 균일 그리드
     ========================================================= */
  function renderMenu() {
    var cfg = Store.config;
    var cats = Store.visibleCategories();

    var s = cfg.store;
    $('#shopMark').innerHTML = s.logo
      ? '<img src="' + esc(s.logo) + '" alt="">'
      : esc(Store.glyphFor(s.name));
    $('#shopStore').textContent = s.name;
    $('#shopMode').textContent = Store.session.orderType === 'takeout' ? '포장' : '매장 식사';

    if (!cats.length) {
      $('#rail').innerHTML = '';
      $('#shopH').textContent = '메뉴';
      $('#shopCount').textContent = '';
      $('#shopMain').innerHTML = '<div class="shop__empty">' +
        empty('empty', '보여 드릴 카테고리가 없습니다',
              '편집 모드 › 카테고리에서 추가하거나 표시를 켜 주세요.') + '</div>';
      renderPayBar();
      return;
    }

    if (!activeCatId || !cats.some(function (c) { return c.id === activeCatId; })) {
      activeCatId = cats[0].id;
    }

    /* -- 레일 ------------------------------------------------ */
    $('#rail').innerHTML = cats.map(function (c) {
      var n = Store.menusOf(c.id).length;
      return '<button class="rail__item' + (c.id === activeCatId ? ' is-on' : '') + '" ' +
        'data-cat="' + esc(c.id) + '" type="button" ' +
        'aria-current="' + (c.id === activeCatId ? 'true' : 'false') + '">' +
        '<span class="rail__ic">' + icon(UI.catIcon(c.name)) + '</span>' +
        '<span class="rail__nm">' + esc(c.name) + '</span>' +
        '<span class="rail__n num">' + n + '</span>' +
        '</button>';
    }).join('');

    var on = $('#rail .rail__item.is-on');
    if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });

    /* -- 그리드 ---------------------------------------------- */
    var cat = Store.getCategory(activeCatId);
    var list = Store.menusOf(activeCatId);
    var outCount = list.filter(function (m) { return m.soldOut; }).length;

    $('#shopH').textContent = cat ? cat.name : '';
    $('#shopCount').textContent = list.length
      ? list.length + '개' + (outCount ? ' · 품절 ' + outCount : '')
      : '';

    $('#shopMain').innerHTML = list.length
      ? '<div class="shop__grid">' + list.map(card).join('') + '</div>'
      : '<div class="shop__empty">' +
        empty('empty', '이 카테고리에 메뉴가 없습니다',
              '편집 모드 › 메뉴에서 추가할 수 있습니다.') + '</div>';
    $('#shopMain').scrollTop = 0;

    renderPayBar();
  }

  function card(m, i) {
    /* 차별점 ① — 품절이어도 자리를 지킨다 */
    var out = m.soldOut
      ? '<span class="pcard__out"><span class="badge badge--soldout">품절</span></span>' : '';

    return '<button class="pcard' + (m.soldOut ? ' is-out' : '') + '" ' +
      'data-menu="' + esc(m.id) + '" style="--i:' + Math.min(i, 14) + '" type="button"' +
      (m.soldOut ? ' aria-disabled="true"' : '') + '>' +
      (m.feature && !m.soldOut
        ? '<span class="pcard__flag"><span class="badge badge--accent">대표</span></span>' : '') +
      thumb(m.name, m.image, { className: 'pcard__thumb', glyph: 104, overlay: out }) +
      '<span class="pcard__body">' +
      '<span class="pcard__nm">' + esc(m.name) + '</span>' +
      '<span class="pcard__meta">' +
      '<span class="pcard__price num">' + esc(Store.money(m.price)) + '</span>' +
      (m.kcal ? '<span class="pcard__kcal num">' + m.kcal + ' Kcal</span>' : '') +
      '</span></span></button>';
  }

  /* ---------------------------------------------------------
     차별점 ④ — 장바구니 상시 노출
     비어 있어도 사라지지 않는다. 합계는 자리수 롤로 갱신된다.
     --------------------------------------------------------- */
  function renderPayBar() {
    var bar = $('#payBar');
    if (!bar) return;
    var n = Store.cart.count();
    var total = Store.cart.total();

    if (!bar.__built) {
      bar.innerHTML =
        '<button class="paybar__home" data-act="go-idle" type="button">' +
        icon('home') + '<span>처음으로</span></button>' +
        '<div class="paybar__status">' +
        '<span class="paybar__qty num" id="payQty">0</span>' +
        '<span class="paybar__read">' +
        '<span class="paybar__lab">담은 메뉴</span>' +
        '<span class="paybar__sum num flap" id="paySum"></span>' +
        '<span class="paybar__hint" id="payHintEmpty">메뉴를 골라 주세요</span>' +
        '</span></div>' +
        '<button class="paybar__cta" data-act="go-cart" type="button">' +
        '주문 확인' + icon('arrowR') + '</button>';
      bar.__built = true;
    }

    bar.classList.toggle('is-empty', n === 0);
    $('#payQty').textContent = String(n);
    $('#paySum').style.display = n === 0 ? 'none' : '';
    $('#payHintEmpty').style.display = n === 0 ? '' : 'none';
    if (n > 0) UI.flap($('#paySum'), Store.money(total));
  }

  /* =========================================================
     상품 상세 — 전체 화면
     ========================================================= */
  function openItem(menuId) {
    var m = Store.getMenu(menuId);
    if (!m || m.soldOut) return;

    var groups = Store.groupsOf(m);
    draft = { menuId: menuId, qty: 1, sel: {} };

    /* 필수 단일 선택은 첫 옵션을 기본값으로 — 빈 채로 막히지 않게 */
    groups.forEach(function (g) {
      draft.sel[g.id] = (g.type === 'single' && g.required && g.options.length)
        ? [g.options[0].id] : [];
    });

    renderItem();
    app().go('item');
  }

  function renderItem() {
    if (!draft) return;
    var m = Store.getMenu(draft.menuId);
    if (!m) { app().go('menu', 'back'); return; }
    var groups = Store.groupsOf(m);

    var body = groups.map(function (g) {
      var rule = g.type === 'single'
        ? (g.required ? '<span class="badge badge--accent">1개 필수</span>'
                      : '<span class="badge">1개 선택</span>')
        : '<span class="badge">여러 개 선택</span>';

      var rows = g.options.map(function (o) {
        var mark = g.type === 'multi' ? 'choice__mark choice__mark--box' : 'choice__mark';
        return '<button class="choice" data-opt="' + esc(o.id) + '" type="button" aria-pressed="false">' +
          '<span class="' + mark + '">' + icon('check') + '</span>' +
          '<span class="choice__label">' + esc(o.name) + '</span>' +
          '<span class="choice__price num">' +
          (o.price > 0 ? '+' + esc(Store.money(o.price)) : '무료') +
          '</span></button>';
      }).join('');

      return '<section class="ogroup" data-group="' + esc(g.id) + '">' +
        '<div class="ogroup__head"><h3 class="ogroup__nm">' + esc(g.name) + '</h3>' + rule + '</div>' +
        '<div class="ogroup__list">' + rows + '</div></section>';
    }).join('');

    $('#itemMount').innerHTML =
      '<header class="item__bar">' +
      '<button class="icon-btn icon-btn--sm" data-nav="back" type="button" aria-label="뒤로">' +
      icon('arrowL') + '</button>' +
      '<span class="item__bartitle">메뉴 선택</span>' +
      '<button class="icon-btn icon-btn--sm" data-act="toggle-big" type="button" aria-label="큰 글씨 모드">' +
      icon('text') + '</button>' +
      '</header>' +

      '<div class="scroller item__scroll">' +
      '<div class="item__hero">' +
      thumb(m.name, m.image, { className: 'item__shot', glyph: 150 }) +
      '<div class="item__facts">' +
      '<h2 class="item__nm">' + esc(m.name) + '</h2>' +
      (m.desc ? '<p class="item__ds">' + esc(m.desc) + '</p>' : '') +
      '<div class="item__figures">' +
      '<span class="item__price num">' + esc(Store.money(m.price)) + '</span>' +
      (m.kcal ? '<span class="item__kcal num">' + m.kcal + ' Kcal</span>' : '') +
      '</div></div></div>' +

      body +

      '<div class="item__qty">' +
      '<span class="item__qtylab">수량</span>' +
      '<span class="stepper">' +
      '<button class="stepper__btn" data-qty-d="-1" type="button" aria-label="수량 줄이기">' + icon('minus') + '</button>' +
      '<span class="stepper__val num" id="itemQty">1</span>' +
      '<button class="stepper__btn" data-qty-d="1" type="button" aria-label="수량 늘리기">' + icon('plus') + '</button>' +
      '</span></div>' +
      '</div>' +

      '<footer class="item__foot">' +
      '<span class="item__sum">' +
      '<span class="item__sumlab">합계</span>' +
      '<span class="item__sumval num flap" id="itemSum"></span>' +
      '</span>' +
      '<button class="btn btn--quiet btn--lg" data-nav="back" type="button">취소</button>' +
      '<button class="btn btn--primary btn--lg" data-item-add type="button">담기</button>' +
      '</footer>';

    syncItem();
  }

  function itemTotal() {
    var m = Store.getMenu(draft.menuId);
    if (!m) return 0;
    var sum = m.price;
    Store.groupsOf(m).forEach(function (g) {
      g.options.forEach(function (o) {
        if ((draft.sel[g.id] || []).indexOf(o.id) >= 0) sum += o.price;
      });
    });
    return sum * draft.qty;
  }

  function syncItem() {
    var root = $('#itemMount');
    if (!root || !draft) return;
    $('#itemQty').textContent = String(draft.qty);
    $('[data-qty-d="-1"]', root).disabled = draft.qty <= 1;
    $('[data-qty-d="1"]', root).disabled = draft.qty >= 99;
    UI.flap($('#itemSum'), Store.money(itemTotal()));

    $$('.ogroup', root).forEach(function (sec) {
      var gid = sec.getAttribute('data-group');
      $$('.choice', sec).forEach(function (btn) {
        var on = (draft.sel[gid] || []).indexOf(btn.getAttribute('data-opt')) >= 0;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
      });
    });
  }

  /* =========================================================
     주문 내역
     ========================================================= */
  function renderCart() {
    var items = Store.cart.items();
    var n = Store.cart.count();
    $('#cartCount').textContent = n ? n + '개' : '';

    if (!items.length) {
      $('#cartScroll').innerHTML = empty('cart', '담은 메뉴가 없습니다',
        '메뉴로 돌아가 원하는 메뉴를 골라 주세요.');
      $('#cartFoot').innerHTML =
        '<button class="btn btn--primary btn--lg btn--block" data-act="go-menu" type="button">' +
        '메뉴 보러 가기' + icon('arrowR') + '</button>';
      return;
    }

    $('#cartScroll').innerHTML =
      '<div class="cart__list">' + items.map(line).join('') + '</div>' +
      '<div class="plate cart__sum">' +
      '<div class="srow"><span class="srow__k">주문 방식</span>' +
      '<span class="srow__v">' +
      (Store.session.orderType === 'takeout' ? '포장' : '매장 식사') + '</span></div>' +
      '<div class="srow"><span class="srow__k">총 수량</span>' +
      '<span class="srow__v num">' + n + '개</span></div>' +
      '<div class="srow srow--total"><span class="srow__k">결제 금액</span>' +
      '<span class="srow__v num">' + esc(Store.money(Store.cart.total())) + '</span></div>' +
      '</div>';

    $('#cartFoot').innerHTML =
      '<button class="btn btn--quiet btn--lg" data-act="cart-clear" type="button">전체 취소</button>' +
      '<button class="btn btn--quiet btn--lg" data-act="go-menu" type="button">메뉴 더 담기</button>' +
      '<button class="btn btn--primary btn--lg" data-act="go-pay" type="button">' +
      '결제하기 · ' + esc(Store.money(Store.cart.total())) + '</button>';
  }

  function line(it, i) {
    var m = Store.getMenu(it.menuId);
    if (!m) return '';
    var opts = Store.cart.optionLabels(it);

    return '<div class="line" style="--i:' + Math.min(i, 14) + '">' +
      thumb(m.name, m.image, { className: 'line__thumb', glyph: 66 }) +
      '<div class="line__body">' +
      '<div class="line__top">' +
      '<h3 class="line__nm">' + esc(m.name) + '</h3>' +
      '<button class="line__del" data-del="' + esc(it.uid) + '" type="button" aria-label="삭제">' +
      icon('trash') + '</button></div>' +
      (opts.length ? '<p class="line__opts">' + esc(opts.join(' · ')) + '</p>' : '') +
      '<div class="line__foot">' +
      '<span class="stepper stepper--sm">' +
      '<button class="stepper__btn" data-qty="' + esc(it.uid) + '" data-d="-1" type="button" aria-label="수량 줄이기">' +
      icon('minus') + '</button>' +
      '<span class="stepper__val num">' + it.qty + '</span>' +
      '<button class="stepper__btn" data-qty="' + esc(it.uid) + '" data-d="1" type="button" aria-label="수량 늘리기">' +
      icon('plus') + '</button></span>' +
      '<span class="line__price num">' + esc(Store.money(Store.cart.linePrice(it))) + '</span>' +
      '</div></div></div>';
  }

  /* =========================================================
     결제 (모의 — 실제 연동 없음)
     ========================================================= */
  var METHODS = [
    { id: 'card', name: '신용 · 체크카드', desc: '카드를 리더기에 넣어 주세요', ic: 'card' },
    { id: 'easy', name: '간편결제',        desc: '휴대폰 QR을 리더기에 대 주세요', ic: 'phone' },
    { id: 'cash', name: '현금',            desc: '직원에게 말씀해 주세요', ic: 'cash' }
  ];

  function renderPay() {
    clearPayTimers();

    $('#payMount').innerHTML =
      '<header class="item__bar">' +
      '<button class="icon-btn icon-btn--sm" data-nav="back" type="button" aria-label="뒤로">' +
      icon('arrowL') + '</button>' +
      '<span class="item__bartitle">결제</span>' +
      '<button class="icon-btn icon-btn--sm" data-act="toggle-big" type="button" aria-label="큰 글씨 모드">' +
      icon('text') + '</button>' +
      '</header>' +

      '<div class="pay__head">' +
      '<h2 class="pay__ask">어떻게 결제하시겠어요?</h2>' +
      '<div class="pay__amt">' +
      '<span class="pay__amtlab">결제 금액</span>' +
      '<span class="pay__amtval num">' + esc(Store.money(Store.cart.total())) + '</span>' +
      '</div></div>' +

      '<div class="pay__list">' +
      METHODS.map(function (p, i) {
        return '<button class="method" data-method="' + p.id + '" style="--i:' + i + '" type="button">' +
          '<span class="method__ic">' + icon(p.ic) + '</span>' +
          '<span class="method__t">' +
          '<span class="method__nm">' + esc(p.name) + '</span>' +
          '<span class="method__ds">' + esc(p.desc) + '</span>' +
          '</span><span class="method__go">' + icon('arrowR') + '</span></button>';
      }).join('') +
      '</div>' +

      '<p class="pay__note">이 화면은 시뮬레이터입니다.<br>실제로 결제되지 않으며 카드 정보를 입력받지 않습니다.</p>';
  }

  function runPayment(methodId) {
    var m = null;
    METHODS.forEach(function (x) { if (x.id === methodId) m = x; });
    if (!m) return;

    clearPayTimers();
    app().lockIdle(true);

    var steps = methodId === 'cash'
      ? [{ at: 0, pct: 12, st: '직원을 호출했습니다', hint: '카운터에서 현금을 받은 뒤 확인해 드립니다.' },
         { at: 1400, pct: 62, st: '금액 확인 중', hint: '잠시만 기다려 주세요.' },
         { at: 2600, pct: 100, st: '결제 완료', hint: '' }]
      : [{ at: 0, pct: 10, st: methodId === 'card' ? '카드를 넣어 주세요' : 'QR을 대 주세요', hint: '리더기에서 손을 떼지 마세요.' },
         { at: 1500, pct: 55, st: '승인 요청 중', hint: '통신 중입니다. 잠시만 기다려 주세요.' },
         { at: 2900, pct: 100, st: '승인 완료', hint: '' }];

    $('#payMount').innerHTML =
      '<div class="paying">' +
      (methodId === 'card'
        ? '<div class="reader"><div class="reader__card"></div>' +
          '<div class="reader__unit"><div class="reader__mouth"></div><div class="reader__led"></div></div></div>'
        : '<div class="paid" style="background:var(--accent-tint);color:var(--accent)">' + icon(m.ic) + '</div>') +
      '<p class="paying__st" id="payStatus">' + esc(steps[0].st) + '</p>' +
      '<p class="paying__hint" id="payHint">' + esc(steps[0].hint) + '</p>' +
      '<div class="paying__bar"><div class="paying__fill" id="payFill"></div></div>' +
      '</div>';

    steps.forEach(function (s) {
      payTimers.push(setTimeout(function () {
        var f = $('#payFill'), t = $('#payStatus'), h = $('#payHint');
        if (f) f.style.width = s.pct + '%';
        if (t) t.textContent = s.st;
        if (h) h.textContent = s.hint;
      }, s.at));
    });

    payTimers.push(setTimeout(function () {
      var order = Store.placeOrder(methodId);
      renderDone(order);
      app().go('done');
      app().lockIdle(false);
    }, steps[steps.length - 1].at + 700));
  }

  function clearPayTimers() { payTimers.forEach(clearTimeout); payTimers = []; }

  /* =========================================================
     주문 완료
     ========================================================= */
  function renderDone(order) {
    clearDoneTimer();
    if (!order) return;

    var method = { card: '신용 · 체크카드', easy: '간편결제', cash: '현금' }[order.method] || '기타';
    var d = new Date(order.at);
    var stamp = d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());

    $('#doneMount').innerHTML =
      '<div class="done__inner">' +
      '<div class="ticket">' +
      '<p class="ticket__lab">Order No.</p>' +
      '<p class="ticket__no num">' + esc(order.no) + '</p>' +
      '<p class="ticket__msg">번호가 불리면 카운터에서 받아 가세요.<br>' +
      (order.orderType === 'takeout' ? '포장' : '매장 식사') + ' · ' + esc(method) + '</p>' +
      '</div>' +

      '<div class="plate receipt">' +
      '<div class="receipt__head">' +
      '<span class="receipt__store">' + esc(order.storeName) + '</span>' +
      '<span class="receipt__when num">' + esc(stamp) + '</span></div>' +
      '<div class="receipt__lines">' +
      order.lines.map(function (l) {
        return '<div class="rl">' +
          '<span class="rl__q num">' + l.qty + '</span>' +
          '<span class="rl__n">' + esc(l.name) +
          (l.options.length ? '<span class="rl__o">' + esc(l.options.join(' · ')) + '</span>' : '') +
          '</span><span class="rl__p num">' + esc(Store.money(l.price)) + '</span></div>';
      }).join('') +
      '</div>' +
      '<div class="receipt__total">' +
      '<span class="receipt__totallab">합계</span>' +
      '<span class="receipt__totalval num">' + esc(Store.money(order.total)) + '</span>' +
      '</div></div>' +

      '<div class="done__foot">' +
      '<button class="btn btn--primary btn--lg btn--block" data-act="done-home" type="button">' +
      '처음 화면으로' + icon('home') + '</button>' +
      '<p class="done__count"><span class="done__countn num" id="doneCount">12</span> 초 후 자동으로 돌아갑니다</p>' +
      '</div></div>';

    /* 벽시계 기준 — 탭이 눌려도 남은 시간이 어긋나지 않는다 */
    var deadline = Date.now() + 12000;
    doneTimer = setInterval(function () {
      var left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      var el = $('#doneCount');
      if (el) el.textContent = String(left);
      if (left <= 0) { clearDoneTimer(); app().goIdle(); }
    }, 250);
  }

  function clearDoneTimer() { if (doneTimer) { clearInterval(doneTimer); doneTimer = null; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* =========================================================
     이벤트
     ========================================================= */
  function bind() {
    $('#screens').addEventListener('click', function (e) {
      var t;

      if ((t = e.target.closest('.rail__item[data-cat]'))) {
        activeCatId = t.getAttribute('data-cat');
        renderMenu();
        return;
      }

      if ((t = e.target.closest('.pcard[data-menu]'))) {
        var id = t.getAttribute('data-menu');
        var menu = Store.getMenu(id);
        if (!menu || menu.soldOut) return;
        if (Store.groupsOf(menu).length === 0) {
          Store.cart.add(id, 1, {});
          UI.toast(menu.name + '을(를) 담았습니다');
        } else {
          openItem(id);
        }
        return;
      }

      if ((t = e.target.closest('[data-qty-d]'))) {
        if (!draft) return;
        draft.qty = Math.max(1, Math.min(99, draft.qty + Number(t.getAttribute('data-qty-d'))));
        syncItem();
        return;
      }

      if ((t = e.target.closest('.ogroup .choice[data-opt]'))) {
        if (!draft) return;
        var gid = t.closest('.ogroup').getAttribute('data-group');
        var oid = t.getAttribute('data-opt');
        var g = Store.getGroup(gid);
        if (!g) return;
        var cur = draft.sel[gid] || [];
        if (g.type === 'single') {
          draft.sel[gid] = (cur.indexOf(oid) >= 0 && !g.required) ? [] : [oid];
        } else {
          draft.sel[gid] = cur.indexOf(oid) >= 0
            ? cur.filter(function (x) { return x !== oid; })
            : cur.concat([oid]);
        }
        syncItem();
        return;
      }

      if ((t = e.target.closest('[data-item-add]'))) {
        if (!draft) return;
        var mm = Store.getMenu(draft.menuId);
        Store.cart.add(draft.menuId, draft.qty, draft.sel);
        UI.toast((mm ? mm.name + ' ' : '') + draft.qty + '개를 담았습니다');
        draft = null;
        app().go('menu', 'back');
        return;
      }

      if ((t = e.target.closest('[data-qty]'))) {
        var uid = t.getAttribute('data-qty');
        var d = Number(t.getAttribute('data-d'));
        var it = null;
        Store.cart.items().forEach(function (x) { if (x.uid === uid) it = x; });
        if (it) Store.cart.setQty(uid, it.qty + d);
        renderCart();
        return;
      }
      if ((t = e.target.closest('[data-del]'))) {
        Store.cart.remove(t.getAttribute('data-del'));
        renderCart();
        return;
      }

      if ((t = e.target.closest('.method[data-method]'))) {
        runPayment(t.getAttribute('data-method'));
        return;
      }

      if ((t = e.target.closest('[data-otype]'))) {
        Store.session.orderType = t.getAttribute('data-otype');
        renderMenu();
        app().go('menu');
      }
    });
  }

  global.KIO_CUSTOMER = {
    bind: bind,
    renderMenu: renderMenu,
    renderPayBar: renderPayBar,
    renderCart: renderCart,
    renderPay: renderPay,
    renderDone: renderDone,
    renderItem: renderItem,
    clearPayTimers: clearPayTimers,
    clearDoneTimer: clearDoneTimer,
    hasDraft: function () { return !!draft; },
    dropDraft: function () { draft = null; },
    resetCategory: function () { activeCatId = null; }
  };

})(window);
