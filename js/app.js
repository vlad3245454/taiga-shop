(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var page = document.body.getAttribute("data-page") || "home";
  var DESC = "Таёжные лакомства из дикоросов в Благовещенске: варенье из шишек, сбитни, сиропы, конфитюры, цукаты, шоколад, мармелад, лесной чай и кофе. Самовывоз из Универмага Платоновых.";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return n.toLocaleString("ru-RU") + " " + (C.currency || "₽"); }
  function toast(msg) {
    var t = $(".toast") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "toast", role: "status" }));
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- Корзина ---------- */
  var Cart = {
    get: function () { try { return JSON.parse(localStorage.getItem(C.storageKey)) || {}; } catch (e) { return {}; } },
    save: function (c) { try { localStorage.setItem(C.storageKey, JSON.stringify(c)); } catch (e) {} Cart.badge(); },
    add: function (id) { var c = Cart.get(); c[id] = (c[id] || 0) + 1; Cart.save(c); },
    set: function (id, q) { var c = Cart.get(); if (q <= 0) delete c[id]; else c[id] = Math.min(q, 99); Cart.save(c); },
    clear: function () { Cart.save({}); },
    count: function () { var c = Cart.get(); return Object.keys(c).reduce(function (s, k) { return s + c[k]; }, 0); },
    badge: function () { $$(".cart-count").forEach(function (el) { el.textContent = Cart.count(); }); }
  };

  /* ---------- Логотип ---------- */
  function logoHTML(cls) {
    var letter = esc((C.shopName.replace(/[\[\]«»"\s]/g, "")[0] || "М").toUpperCase());
    return '<img class="logo-img ' + (cls || "") + '" src="' + esc(C.logoPath) + '" alt="Логотип: ' + esc(C.shopName) + '" width="48" height="48">' +
      '<span class="logo-fallback" hidden aria-hidden="true">' + letter + '</span>';
  }
  function bindLogoFallback(root) {
    $$("img.logo-img", root).forEach(function (img) {
      function fail() { img.hidden = true; var f = img.nextElementSibling; if (f) f.hidden = false; }
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }

  /* ---------- Шапка и подвал ---------- */
  var NAV = [["index.html", "Главная", "home"], ["catalog.html", "Каталог", "catalog"], ["about.html", "О нас", "about"],
    ["gallery.html", "Галерея", "gallery"], ["faq.html", "Вопросы", "faq"], ["contacts.html", "Контакты", "contacts"]];

  function renderChrome() {
    var h = $("#site-header");
    if (h) {
      h.outerHTML = '<header class="header"><div class="container header__row">' +
        '<a class="brand" href="index.html" aria-label="' + esc(C.shopName) + ' — на главную">' + logoHTML() + '<span data-shopname>' + esc(C.shopName) + '</span></a>' +
        '<nav class="nav" id="nav" aria-label="Основное меню">' + NAV.map(function (n) {
          return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
        }).join("") + '</nav>' +
        '<div class="header__actions"><a class="cart-link" href="order.html" aria-label="Заказ">🧺 <span>Заказ</span> <span class="cart-count">0</span></a>' +
        '<button class="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="nav">☰</button></div></div></header>';
      var b = $(".burger"), nav = $("#nav");
      b.addEventListener("click", function () { var o = nav.classList.toggle("open"); b.setAttribute("aria-expanded", o); b.textContent = o ? "✕" : "☰"; });
      bindLogoFallback($(".header"));
    }
    var f = $("#site-footer");
    if (f) {
      var maxLink = C.maxUrl ? '<a href="' + esc(C.maxUrl) + '" target="_blank" rel="noopener">Написать в Max</a>' : "Max: скоро";
      f.outerHTML = '<footer class="footer"><div class="container"><div class="footer__grid">' +
        '<div><a class="brand" href="index.html">' + logoHTML() + '<span>' + esc(C.shopName) + '</span></a>' +
        '<p>' + esc(C.tagline) + '</p></div>' +
        '<div><h3>Разделы</h3><nav class="footer__nav" aria-label="Разделы сайта">' + NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("") + '</nav></div>' +
        '<div><h3>Мы в городе</h3><p>' + esc(C.place) + '<br>г. ' + esc(C.city) + ', ' + esc(C.address) + '<br>' + esc(C.hours) + '</p>' +
        '<p><a href="tel:' + esc(C.phoneHref) + '">' + esc(C.phone) + '</a><br>' + maxLink + '</p></div>' +
        '</div><div class="footer__copy">© ' + new Date().getFullYear() + ' ' + esc(C.shopName) + '. Оплата и получение заказа — в магазине.</div></div></footer>';
      bindLogoFallback($(".footer"));
    }
  }

  /* ---------- Подстановка настроек в текст ---------- */
  function applyConfig() {
    $$("[data-cfg]").forEach(function (el) { var v = C[el.getAttribute("data-cfg")]; if (v != null) el.textContent = v; });
    $$("[data-cfg-tel]").forEach(function (el) { el.href = "tel:" + C.phoneHref; el.textContent = C.phone; });
    $$("[data-cfg-max]").forEach(function (el) {
      if (C.maxUrl) { el.href = C.maxUrl; el.target = "_blank"; el.rel = "noopener"; }
      else { el.removeAttribute("href"); el.addEventListener("click", function (e) { e.preventDefault(); toast("Ссылка на Max скоро появится. Пока звоните: " + C.phone); }); }
    });
    $$("[data-logo]").forEach(function (el) { el.innerHTML = logoHTML(); bindLogoFallback(el); });
  }

  /* ---------- SEO, favicon, schema.org ---------- */
  function applySeo() {
    var base = (C.siteUrl || "").replace(/\/$/, "");
    var titles = { home: "Продукты Сибири и Алтая в Благовещенске", catalog: "Каталог — варенье из шишек, сбитни, чай, шоколад", order: "Оформление заказа", about: "О нас", gallery: "Галерея", faq: "Вопросы и ответы", contacts: "Контакты и адрес в Благовещенске" };
    var t = (titles[page] || "") + " — " + C.shopName;
    document.title = t;
    function meta(sel, attr, val) { var m = $(sel); if (!m) { m = document.createElement("meta"); m.setAttribute(attr[0], attr[1]); document.head.appendChild(m); } m.setAttribute("content", val); }
    meta('meta[name="description"]', ["name", "description"], DESC);
    meta('meta[property="og:title"]', ["property", "og:title"], t);
    meta('meta[property="og:description"]', ["property", "og:description"], DESC);
    var url = base ? base + "/" + (location.pathname.split("/").pop() || "") : "";
    if (url) meta('meta[property="og:url"]', ["property", "og:url"], url);
    // favicon: логотип, если файл есть; иначе запасной SVG
    var probe = new Image();
    probe.onload = function () { setIcon(C.logoPath); };
    probe.src = C.logoPath;
    function setIcon(href) { var l = $('link[rel="icon"]'); if (l) { l.href = href; l.removeAttribute("type"); } }
    // LocalBusiness
    var ld = {
      "@context": "https://schema.org", "@type": "LocalBusiness", name: C.shopName, description: DESC,
      telephone: "+7" + C.phoneHref.replace(/^\+?7/, ""), url: base || undefined,
      address: { "@type": "PostalAddress", streetAddress: C.address, addressLocality: C.city, addressRegion: "Амурская область", addressCountry: "RU" },
      openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: C.hoursSchema.days, opens: C.hoursSchema.opens, closes: C.hoursSchema.closes }],
      priceRange: "₽"
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  /* ---------- Товары ---------- */
  var DATA = null;
  function loadProducts() {
    if (DATA) return Promise.resolve(DATA);
    return fetch("products.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; });
  }
  function catName(id) { var c = DATA.categories.filter(function (x) { return x.id === id; })[0]; return c ? c.name : ""; }
  function byId(id) { var k = String(id).split("|")[0]; return DATA.products.filter(function (p) { return String(p.id) === k; })[0]; }
  function priceHTML(p) { return p.price ? money(p.price) : '<span class="card__ask">Цена — в магазине</span>'; }
  function tagHTML(p) { return p.badge === "hit" ? '<span class="tag tag--hit">Хит</span>' : p.badge === "new" ? '<span class="tag tag--new">Новинка</span>' : ""; }
  function weightsHTML(p) { return '<div class="weights" role="group" aria-label="Фасовка">' + p.weights.map(function (w, i) { return '<button type="button" class="wchip" aria-pressed="' + (i === 0) + '" data-w="' + esc(w) + '">' + esc(w) + "</button>"; }).join("") + "</div>"; }

  function cardHTML(p) {
    return '<article class="card">' + tagHTML(p) + '<img class="card__img" loading="lazy" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" data-open="' + p.id + '" width="560" height="560">' +
      '<div class="card__body"><span class="card__cat">' + esc(catName(p.category)) + '</span>' +
      '<h3 class="card__title" data-open="' + p.id + '" role="button" tabindex="0">' + esc(p.name) + '</h3>' +
      weightsHTML(p) +
      '<div class="card__foot"><div class="card__price">' + priceHTML(p) + '</div>' +
      '<button class="btn" data-add="' + p.id + '">В заказ</button></div></div></article>';
  }
  function fail(el) { if (el) el.innerHTML = '<p class="empty">Не удалось загрузить каталог. Откройте сайт через веб-сервер (не двойным кликом по файлу) или позвоните: ' + esc(C.phone) + '.</p>'; }

  /* Модальное окно */
  var lastFocus = null;
  function ensureModal() {
    var m = $("#modal");
    if (m) return m;
    m = document.createElement("div"); m.id = "modal"; m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "Карточка товара");
    m.innerHTML = '<div class="modal__box"><button class="modal__close" aria-label="Закрыть">×</button><img class="modal__img" alt=""><div class="modal__body"></div></div>';
    document.body.appendChild(m);
    m.addEventListener("click", function (e) { if (e.target === m || e.target.classList.contains("modal__close")) closeModal(); });
    return m;
  }
  function openModal(id) {
    var p = byId(id); if (!p) return;
    var m = ensureModal(); lastFocus = document.activeElement;
    var img = $(".modal__img", m); img.src = p.image; img.alt = p.name;
    $(".modal__body", m).innerHTML = tagHTML(p) + '<h2>' + esc(p.name) + '</h2><p>' + esc(p.description) + '</p>' + weightsHTML(p) +
      '<dl><div><dt>Состав</dt><dd>' + esc(p.composition) + '</dd></div><div><dt>Срок годности</dt><dd>' + esc(p.shelfLife) + '</dd></div></dl>' +
      '<p class="card__price">' + priceHTML(p) + '</p><button class="btn btn--block" data-add="' + p.id + '">В заказ</button>';
    m.classList.add("open"); document.body.style.overflow = "hidden";
    $(".modal__close", m).focus();
  }
  function closeModal() { var m = $("#modal"); if (m) { m.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); } }

  document.addEventListener("click", function (e) {
    var wc = e.target.closest(".wchip");
    if (wc) { $$(".wchip", wc.parentNode).forEach(function (b) { b.setAttribute("aria-pressed", b === wc); }); return; }
    var a = e.target.closest("[data-add]");
    if (a) {
      var root = a.closest(".card, .modal__body"), sel = root && $('.wchip[aria-pressed="true"]', root);
      Cart.add(a.getAttribute("data-add") + (sel ? "|" + sel.getAttribute("data-w") : "")); toast("Добавлено в заказ"); return;
    }
    var o = e.target.closest("[data-open]");
    if (o && DATA) openModal(o.getAttribute("data-open"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeLb(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][data-open]')) { e.preventDefault(); openModal(e.target.getAttribute("data-open")); }
  });

  /* ---------- Страницы ---------- */
  function initHome() {
    var box = $("#popular"), cats = $("#cats-box"); if (!box) return;
    loadProducts().then(function (d) {
      var hits = [];
      d.categories.forEach(function (c) { var h = d.products.filter(function (p) { return p.category === c.id && p.badge === "hit"; })[0]; if (h) hits.push(h); });
      box.innerHTML = hits.slice(0, 8).map(cardHTML).join("");
      if (cats) cats.innerHTML = d.categories.map(function (c) {
        var p = d.products.filter(function (x) { return x.category === c.id; })[0];
        return '<a class="cat" href="catalog.html#' + c.id + '"><img loading="lazy" src="' + esc(p.image) + '" alt="" width="200" height="200"><span>' + esc(c.name) + "</span></a>";
      }).join("");
    }).catch(function () { fail(box); });
  }

  function initCatalog() {
    var box = $("#products"), search = $("#search"), chips = $("#chips"); if (!box) return;
    var state = { cat: "all", q: "" };
    var hash = location.hash.replace("#", ""); if (hash) state.cat = hash;
    loadProducts().then(function (d) {
      chips.innerHTML = '<button class="chip" data-cat="all" aria-pressed="false">Все</button>' +
        d.categories.map(function (c) { return '<button class="chip" data-cat="' + c.id + '" aria-pressed="false">' + esc(c.name) + "</button>"; }).join("");
      function draw() {
        $$(".chip", chips).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cat") === state.cat); });
        var q = state.q.trim().toLowerCase();
        var stems = q ? q.split(/\s+/).map(function (w) { return w.length > 3 ? w.slice(0, -1) : w; }) : [];
        var list = d.products.filter(function (p) {
          var n = p.name.toLowerCase();
          return (state.cat === "all" || p.category === state.cat) && stems.every(function (s) { return n.indexOf(s) > -1; });
        });
        box.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty">Ничего не найдено. Попробуйте изменить запрос или категорию.</p>';
        $("#count").textContent = "Найдено: " + list.length;
      }
      chips.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (!b) return; state.cat = b.getAttribute("data-cat"); draw(); });
      search.addEventListener("input", function () { state.q = search.value; draw(); });
      draw();
    }).catch(function () { fail(box); });
  }

  function orderText(items, form) {
    var lines = ["Заказ с сайта «" + C.shopName + "»", ""];
        items.forEach(function (it, i) { lines.push((i + 1) + ". " + it.p.name + (it.w ? ", " + it.w : "") + " — " + it.q + " шт."); });
    lines.push("", "Цену и оплату уточним в магазине (" + C.address + ", " + C.city + ").", "");
    lines.push("Имя: " + (form.name || "—"), "Телефон: " + (form.phone || "—"), "Время самовывоза: " + (form.time || "—"));
    if (form.comment) lines.push("Комментарий: " + form.comment);
    return lines.join("\n");
  }

  function initOrder() {
    var list = $("#cart-list"); if (!list) return;
    var form = $("#order-form"), status = $("#order-status");
    var items = [];
    function say(msg, ok) { status.className = "status show " + (ok ? "ok" : "err"); status.textContent = msg; }
    function draw() {
      var cart = Cart.get(); items = [];
      Object.keys(cart).forEach(function (id) { var p = byId(id); if (p) items.push({ p: p, q: cart[id], key: id, w: id.split("|")[1] || "" }); });
      if (!items.length) {
        list.innerHTML = '<p class="empty">В заказе пока пусто.</p><p class="center"><a class="btn btn--green" href="catalog.html">Перейти в каталог</a></p>';
        form.hidden = true; $("#cart-total").hidden = true; return;
      }
      form.hidden = false; $("#cart-total").hidden = false;
      list.innerHTML = items.map(function (it) {
        return '<div class="cart-item"><img src="' + esc(it.p.image) + '" alt="' + esc(it.p.name) + '" loading="lazy">' +
          '<div><div class="cart-item__name">' + esc(it.p.name) + '</div><div>' + esc(it.w) + '</div>' +
          '<div class="qty"><button data-q="-1" data-id="' + esc(it.key) + '" aria-label="Меньше">−</button><span>' + it.q + '</span><button data-q="1" data-id="' + esc(it.key) + '" aria-label="Больше">+</button></div></div>' +
          '<div><button class="remove" data-rm="' + esc(it.key) + '">Убрать</button></div></div>';
      }).join("");
    }
    list.addEventListener("click", function (e) {
      var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
      if (q) { var id = q.getAttribute("data-id"); Cart.set(id, (Cart.get()[id] || 0) + Number(q.getAttribute("data-q"))); draw(); }
      if (r) { Cart.set(r.getAttribute("data-rm"), 0); draw(); }
    });
    function values() { var f = new FormData(form); return { name: (f.get("name") || "").trim(), phone: (f.get("phone") || "").trim(), time: (f.get("time") || "").trim(), comment: (f.get("comment") || "").trim(), hp: f.get("website") }; }
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var v = values(); if (v.hp) return;
      if (!C.orderEndpoint) { say("Отправка с сайта пока не подключена. Нажмите «Отправить заказ в Max» или позвоните: " + C.phone, false); return; }
      var btn = $("button[type=submit]", form); btn.disabled = true;
      fetch(C.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: v.name, phone: v.phone, pickup_time: v.time, comment: v.comment, order: orderText(items, v) }) })
        .then(function (r) { if (!r.ok) throw 0; Cart.clear(); form.reset(); draw(); say("Спасибо! Заявка отправлена. Мы свяжемся с вами для подтверждения. Заберите заказ в универмаге.", true); })
        .catch(function () { say("Не получилось отправить. Попробуйте «Отправить заказ в Max» или позвоните: " + C.phone, false); })
        .then(function () { btn.disabled = false; });
    });
    $("#send-max").addEventListener("click", function () {
      if (!form.reportValidity()) return;
      var text = orderText(items, values());
      var done = function () {
        if (C.maxUrl) { say("Текст заказа скопирован. Вставьте его в чат Max и отправьте.", true); window.open(C.maxUrl, "_blank", "noopener"); }
        else say("Текст заказа скопирован, но ссылка на Max ещё не настроена. Позвоните: " + C.phone, false);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      else { fallbackCopy(text); done(); }
    });
    function fallbackCopy(t) { var a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); } catch (e) {} a.remove(); }
    loadProducts().then(draw).catch(function () { fail(list); });
  }

  /* Галерея + lightbox */
  var lbIdx = 0, lbImgs = [];
  function closeLb() { var l = $(".lightbox"); if (l) { l.classList.remove("open"); document.body.style.overflow = ""; } }
  function showLb(i) { lbIdx = (i + lbImgs.length) % lbImgs.length; var l = $(".lightbox"); $("img", l).src = lbImgs[lbIdx].src; $("img", l).alt = lbImgs[lbIdx].alt; }
  function initGallery() {
    var g = $("#gallery"); if (!g) return;
    lbImgs = $$("img", g);
    var l = document.createElement("div"); l.className = "lightbox"; l.setAttribute("role", "dialog"); l.setAttribute("aria-modal", "true"); l.setAttribute("aria-label", "Просмотр фото");
    l.innerHTML = '<button class="lb-close" aria-label="Закрыть">×</button><button class="lb-prev" aria-label="Назад">‹</button><img alt=""><button class="lb-next" aria-label="Вперёд">›</button>';
    document.body.appendChild(l);
    g.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; showLb($$("button", g).indexOf(b)); l.classList.add("open"); document.body.style.overflow = "hidden"; });
    l.addEventListener("click", function (e) {
      if (e.target.classList.contains("lb-prev")) showLb(lbIdx - 1);
      else if (e.target.classList.contains("lb-next")) showLb(lbIdx + 1);
      else if (e.target !== $("img", l)) closeLb();
    });
    document.addEventListener("keydown", function (e) { if (!l.classList.contains("open")) return; if (e.key === "ArrowLeft") showLb(lbIdx - 1); if (e.key === "ArrowRight") showLb(lbIdx + 1); });
  }

  /* Форма обратной связи */
  function initFeedback() {
    var f = $("#feedback-form"); if (!f) return;
    var st = $("#feedback-status");
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var d = new FormData(f); if (d.get("website")) return;
      function say(m, ok) { st.className = "status show " + (ok ? "ok" : "err"); st.textContent = m; }
      if (!C.feedbackEndpoint) { say("Форма пока не подключена. Позвоните нам: " + C.phone, false); return; }
      fetch(C.feedbackEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: d.get("name"), phone: d.get("phone"), message: d.get("message") }) })
        .then(function (r) { if (!r.ok) throw 0; f.reset(); say("Спасибо! Сообщение отправлено.", true); })
        .catch(function () { say("Не получилось отправить. Позвоните нам: " + C.phone, false); });
    });
  }

  /* ---------- Старт ---------- */
  renderChrome(); applyConfig(); applySeo(); Cart.badge();
  initHome(); initCatalog(); initOrder(); initGallery(); initFeedback();
})();
