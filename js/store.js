/* ============================================================
   KIO — 상태 · localStorage · 장바구니 · 주문
   서버 없음. 모든 데이터는 브라우저에만 남는다.
   ============================================================ */
(function (global) {
  'use strict';

  var K_CONFIG = 'kio.config.v1';
  var K_ORDERS = 'kio.orders.v1';
  var K_PREFS  = 'kio.prefs.v1';
  var K_META   = 'kio.meta.v1';

  var MAX_ORDERS = 60;

  /* ---------------------------------------------------------
     저장소 래퍼 — 사파리 프라이빗 모드/용량초과에서도 죽지 않게
     --------------------------------------------------------- */
  var mem = {};
  var storageOK = (function () {
    try {
      var t = '__kio__';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    } catch (e) { return false; }
  })();

  function readRaw(key) {
    if (!storageOK) return mem[key] || null;
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeRaw(key, val) {
    if (!storageOK) { mem[key] = val; return { ok: true, fallback: true }; }
    try {
      localStorage.setItem(key, val);
      return { ok: true };
    } catch (e) {
      mem[key] = val;
      return { ok: false, error: e, quota: isQuota(e) };
    }
  }
  function isQuota(e) {
    return e && (e.code === 22 || e.code === 1014 ||
      e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED');
  }
  function readJSON(key, fallback) {
    var raw = readRaw(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  /* ---------------------------------------------------------
     유틸
     --------------------------------------------------------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function uid(prefix) {
    return (prefix || 'x') + '_' +
      Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  var CURRENCY = {
    KRW: { symbol: '₩', decimals: 0, suffix: '' },
    USD: { symbol: '$', decimals: 2, suffix: '' },
    JPY: { symbol: '¥', decimals: 0, suffix: '' },
    EUR: { symbol: '€', decimals: 2, suffix: '' }
  };

  function money(n, code) {
    var c = CURRENCY[code] || CURRENCY.KRW;
    var v = Number(n) || 0;
    var s = c.decimals
      ? v.toFixed(c.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return c.symbol + s + c.suffix;
  }

  /* 이름에서 결정적으로 팔레트를 뽑는다 → 같은 메뉴는 늘 같은 색 */
  function hash(str) {
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }
  function artFor(seed) {
    var list = global.KIO_ART;
    return list[hash(String(seed || '?')) % list.length];
  }
  function glyphFor(name) {
    var s = String(name || '').trim();
    return s ? s.charAt(0) : '·';
  }

  /* ---------------------------------------------------------
     스키마 정규화 — 어떤 경로로 들어온 데이터든 같은 모양으로
     --------------------------------------------------------- */
  function normalize(cfg) {
    var c = cfg && typeof cfg === 'object' ? cfg : {};
    var store = c.store || {};
    var settings = c.settings || {};

    var out = {
      store: {
        name:      String(store.name || '새 매장'),
        tagline:   String(store.tagline || 'Self Order Kiosk'),
        headline:  String(store.headline || '주문을\n시작해 볼까요?'),
        lede:      String(store.lede || ''),
        logo:      String(store.logo || ''),
        heroImage: String(store.heroImage || ''),
        theme:     String(store.theme || 'sienna'),
        currency:  CURRENCY[store.currency] ? store.currency : 'KRW'
      },
      settings: {
        pin:              /^\d{4}$/.test(settings.pin) ? settings.pin : '0000',
        idleSeconds:      clampNum(settings.idleSeconds, 20, 600, 75),
        warnSeconds:      clampNum(settings.warnSeconds, 5, 60, 15),
        orderTypeEnabled: settings.orderTypeEnabled !== false
      },
      categories: [],
      optionGroups: [],
      menus: []
    };

    (Array.isArray(c.categories) ? c.categories : []).forEach(function (cat, i) {
      if (!cat) return;
      out.categories.push({
        id: String(cat.id || uid('c')),
        name: String(cat.name || '카테고리'),
        order: typeof cat.order === 'number' ? cat.order : i,
        visible: cat.visible !== false
      });
    });
    out.categories.sort(function (a, b) { return a.order - b.order; });
    out.categories.forEach(function (cat, i) { cat.order = i; });

    (Array.isArray(c.optionGroups) ? c.optionGroups : []).forEach(function (g) {
      if (!g) return;
      out.optionGroups.push({
        id: String(g.id || uid('og')),
        name: String(g.name || '옵션'),
        type: g.type === 'multi' ? 'multi' : 'single',
        required: !!g.required,
        options: (Array.isArray(g.options) ? g.options : []).map(function (o, i) {
          return {
            id: String((o && o.id) || ('o' + (i + 1))),
            name: String((o && o.name) || '옵션'),
            price: Math.max(0, Math.round(Number(o && o.price) || 0))
          };
        })
      });
    });

    var catIds = out.categories.map(function (x) { return x.id; });
    var groupIds = out.optionGroups.map(function (x) { return x.id; });

    (Array.isArray(c.menus) ? c.menus : []).forEach(function (m) {
      if (!m) return;
      var cid = String(m.categoryId || '');
      out.menus.push({
        id: String(m.id || uid('m')),
        categoryId: catIds.indexOf(cid) >= 0 ? cid : (catIds[0] || ''),
        name: String(m.name || '새 메뉴'),
        desc: String(m.desc || ''),
        price: Math.max(0, Math.round(Number(m.price) || 0)),
        kcal: Math.max(0, Math.round(Number(m.kcal) || 0)),   /* 0 = 표시 안 함 */
        image: String(m.image || ''),
        soldOut: !!m.soldOut,
        feature: !!m.feature,
        optionGroupIds: (Array.isArray(m.optionGroupIds) ? m.optionGroupIds : [])
          .map(String).filter(function (id) { return groupIds.indexOf(id) >= 0; })
      });
    });

    return out;
  }

  function clampNum(v, lo, hi, dflt) {
    var n = Number(v);
    if (!isFinite(n)) return dflt;
    return Math.min(hi, Math.max(lo, Math.round(n)));
  }

  /* ---------------------------------------------------------
     Store
     --------------------------------------------------------- */
  var listeners = [];
  var config = null;
  var orders = [];
  var prefs = { largeText: false };
  var meta = { seq: 0, day: '' };

  /* 세션 = 이번 주문 한 건의 휘발성 상태 */
  var session = { orderType: null, items: [], method: null, lastOrder: null };

  function emit(what) {
    listeners.forEach(function (fn) {
      try { fn(what); } catch (e) { /* 리스너 하나가 죽어도 나머지는 산다 */ }
    });
  }

  function persistConfig() {
    var r = writeRaw(K_CONFIG, JSON.stringify(config));
    if (!r.ok) {
      emit('storage-error');
      if (global.KIO_UI && global.KIO_UI.toast) {
        global.KIO_UI.toast(
          r.quota ? '저장 공간이 가득 찼습니다. 이미지 크기를 줄여 보세요.'
                  : '저장에 실패했습니다.',
          'warn'
        );
      }
    }
    return r.ok;
  }

  var Store = {

    /* -- 초기화 ------------------------------------------- */
    init: function () {
      prefs = readJSON(K_PREFS, { largeText: false }) || { largeText: false };
      prefs.largeText = !!prefs.largeText;

      orders = readJSON(K_ORDERS, []);
      if (!Array.isArray(orders)) orders = [];

      meta = readJSON(K_META, { seq: 0, day: '' }) || { seq: 0, day: '' };

      var saved = readJSON(K_CONFIG, null);
      if (saved) {
        config = normalize(saved);
      } else {
        config = normalize(global.KIO_PRESETS[0].build());
        persistConfig();
      }
      return this;
    },

    /* -- 접근자 ------------------------------------------- */
    get config() { return config; },
    get orders() { return orders; },
    get prefs() { return prefs; },
    get session() { return session; },

    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        var i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    },

    /* -- 저장 --------------------------------------------- */
    commit: function (what) {
      config = normalize(config);
      persistConfig();
      emit(what || 'config');
    },

    setPrefs: function (patch) {
      Object.keys(patch).forEach(function (k) { prefs[k] = patch[k]; });
      writeRaw(K_PREFS, JSON.stringify(prefs));
      emit('prefs');
    },

    /* -- 프리셋 ------------------------------------------- */
    loadPreset: function (id) {
      var p = null;
      global.KIO_PRESETS.forEach(function (x) { if (x.id === id) p = x; });
      if (!p) return false;
      var keepPin = config && config.settings ? config.settings.pin : '0000';
      config = normalize(p.build());
      config.settings.pin = keepPin;   /* 관리자 PIN은 프리셋에 휩쓸리지 않는다 */
      persistConfig();
      Store.cart.clear();
      emit('config');
      return true;
    },

    factoryReset: function () {
      config = normalize(global.KIO_PRESETS[0].build());
      orders = [];
      meta = { seq: 0, day: '' };
      session = { orderType: null, items: [], method: null, lastOrder: null };
      persistConfig();
      writeRaw(K_ORDERS, JSON.stringify(orders));
      writeRaw(K_META, JSON.stringify(meta));
      emit('config');
    },

    /* -- 조회 --------------------------------------------- */
    visibleCategories: function () {
      return config.categories.filter(function (c) { return c.visible; });
    },
    menusOf: function (categoryId) {
      return config.menus.filter(function (m) { return m.categoryId === categoryId; });
    },
    getMenu: function (id) {
      var f = null;
      config.menus.forEach(function (m) { if (m.id === id) f = m; });
      return f;
    },
    getCategory: function (id) {
      var f = null;
      config.categories.forEach(function (c) { if (c.id === id) f = c; });
      return f;
    },
    getGroup: function (id) {
      var f = null;
      config.optionGroups.forEach(function (g) { if (g.id === id) f = g; });
      return f;
    },
    groupsOf: function (menu) {
      if (!menu) return [];
      return menu.optionGroupIds
        .map(Store.getGroup)
        .filter(Boolean);
    },

    /* -- 표시 유틸 ---------------------------------------- */
    money: function (n) { return money(n, config.store.currency); },
    artFor: artFor,
    glyphFor: glyphFor,
    uid: uid,
    clone: clone,

    /* -- 장바구니 ----------------------------------------- */
    cart: {
      items: function () { return session.items; },

      /* selections: { groupId: [optionId, ...] } */
      add: function (menuId, qty, selections) {
        var menu = Store.getMenu(menuId);
        if (!menu || menu.soldOut) return null;

        var sel = selections || {};
        var key = menuId + '|' + JSON.stringify(
          Object.keys(sel).sort().map(function (g) {
            return g + ':' + (sel[g] || []).slice().sort().join(',');
          })
        );

        var existing = null;
        session.items.forEach(function (it) { if (it.key === key) existing = it; });

        if (existing) {
          existing.qty = Math.min(99, existing.qty + (qty || 1));
        } else {
          session.items.push({
            uid: uid('ci'),
            key: key,
            menuId: menuId,
            qty: Math.min(99, Math.max(1, qty || 1)),
            selections: clone(sel)
          });
        }
        emit('cart');
        return existing || session.items[session.items.length - 1];
      },

      setQty: function (itemUid, qty) {
        var q = Math.max(0, Math.min(99, Math.round(qty)));
        for (var i = 0; i < session.items.length; i++) {
          if (session.items[i].uid === itemUid) {
            if (q === 0) session.items.splice(i, 1);
            else session.items[i].qty = q;
            break;
          }
        }
        emit('cart');
      },

      remove: function (itemUid) {
        session.items = session.items.filter(function (it) { return it.uid !== itemUid; });
        emit('cart');
      },

      clear: function () {
        session.items = [];
        emit('cart');
      },

      /* 한 줄의 옵션 추가금 합계 */
      optionSum: function (item) {
        var menu = Store.getMenu(item.menuId);
        if (!menu) return 0;
        var sum = 0;
        Store.groupsOf(menu).forEach(function (g) {
          var picked = item.selections[g.id] || [];
          g.options.forEach(function (o) {
            if (picked.indexOf(o.id) >= 0) sum += o.price;
          });
        });
        return sum;
      },

      unitPrice: function (item) {
        var menu = Store.getMenu(item.menuId);
        if (!menu) return 0;
        return menu.price + Store.cart.optionSum(item);
      },

      linePrice: function (item) {
        return Store.cart.unitPrice(item) * item.qty;
      },

      /* 사람이 읽을 옵션 요약 */
      optionLabels: function (item) {
        var menu = Store.getMenu(item.menuId);
        if (!menu) return [];
        var out = [];
        Store.groupsOf(menu).forEach(function (g) {
          var picked = item.selections[g.id] || [];
          g.options.forEach(function (o) {
            if (picked.indexOf(o.id) >= 0) out.push(o.name);
          });
        });
        return out;
      },

      count: function () {
        return session.items.reduce(function (n, it) { return n + it.qty; }, 0);
      },

      total: function () {
        return session.items.reduce(function (n, it) {
          return n + Store.cart.linePrice(it);
        }, 0);
      },

      /* 장바구니에 담긴 메뉴가 편집으로 사라졌을 때 정리 */
      prune: function () {
        var before = session.items.length;
        session.items = session.items.filter(function (it) {
          var m = Store.getMenu(it.menuId);
          return m && !m.soldOut;
        });
        if (session.items.length !== before) emit('cart');
      }
    },

    /* -- 주문 --------------------------------------------- */
    nextOrderNo: function () {
      var today = new Date().toISOString().slice(0, 10);
      if (meta.day !== today) { meta.day = today; meta.seq = 0; }
      meta.seq = (meta.seq % 999) + 1;
      writeRaw(K_META, JSON.stringify(meta));
      return ('00' + meta.seq).slice(-3);
    },

    placeOrder: function (method) {
      var no = Store.nextOrderNo();
      var order = {
        no: no,
        at: Date.now(),
        orderType: session.orderType,
        method: method,
        currency: config.store.currency,
        storeName: config.store.name,
        total: Store.cart.total(),
        lines: session.items.map(function (it) {
          var m = Store.getMenu(it.menuId);
          return {
            name: m ? m.name : '(삭제된 메뉴)',
            qty: it.qty,
            options: Store.cart.optionLabels(it),
            price: Store.cart.linePrice(it)
          };
        })
      };
      orders.unshift(order);
      if (orders.length > MAX_ORDERS) orders.length = MAX_ORDERS;
      writeRaw(K_ORDERS, JSON.stringify(orders));
      session.lastOrder = order;
      session.method = method;
      emit('orders');
      return order;
    },

    clearOrders: function () {
      orders = [];
      writeRaw(K_ORDERS, JSON.stringify(orders));
      emit('orders');
    },

    resetSession: function () {
      session.orderType = null;
      session.items = [];
      session.method = null;
      emit('cart');
    },

    /* -- 저장 용량 ---------------------------------------- */
    usage: function () {
      var bytes = 0;
      [K_CONFIG, K_ORDERS, K_PREFS, K_META].forEach(function (k) {
        var v = readRaw(k);
        if (v) bytes += v.length * 2;   /* UTF-16 근사 */
      });
      var limit = 5 * 1024 * 1024;
      return { bytes: bytes, limit: limit, ratio: Math.min(1, bytes / limit), ok: storageOK };
    },

    /* -- 이미지: 리사이즈 후 base64 ----------------------- */
    imageFromFile: function (file, maxPx, cb) {
      if (!file) { cb(null, '파일이 없습니다.'); return; }
      if (!/^image\//.test(file.type)) { cb(null, '이미지 파일만 넣을 수 있습니다.'); return; }

      var reader = new FileReader();
      reader.onerror = function () { cb(null, '파일을 읽지 못했습니다.'); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { cb(null, '이미지를 열지 못했습니다.'); };
        img.onload = function () {
          var max = maxPx || 720;
          var w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) { cb(null, '이미지 크기를 알 수 없습니다.'); return; }

          var k = Math.min(1, max / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * k));
          var ch = Math.max(1, Math.round(h * k));

          var canvas = document.createElement('canvas');
          canvas.width = cw; canvas.height = ch;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);

          var out;
          try {
            out = canvas.toDataURL('image/jpeg', 0.72);
          } catch (e) {
            cb(null, '이미지를 변환하지 못했습니다.');
            return;
          }
          cb(out, null);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  global.KIO_STORE = Store;

})(window);
