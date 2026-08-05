/* Goa Business Directory — interactions
   - Live theme switcher (5 versions, persisted)
   - Search typeahead (categories + locations, after 3 chars)
   - Mobile nav toggle
   - Listing gallery + fullscreen 16:9 lightbox
*/
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ============================================================
     THEME SWITCHER
     ============================================================ */
  var THEMES = [
    { id: "v1", name: "Ocean Blue",  sub: "Cool & professional", grad: "linear-gradient(135deg,#2563eb,#06b6d4)" },
    { id: "v2", name: "Emerald",     sub: "Fresh & natural",     grad: "linear-gradient(135deg,#059669,#34d399)" },
    { id: "v3", name: "Sunset Rose", sub: "Warm & bold",         grad: "linear-gradient(135deg,#e11d48,#f97316)" },
    { id: "v4", name: "Goan Teal",   sub: "Coastal & calm",      grad: "linear-gradient(135deg,#0d9488,#0891b2)" },
    { id: "v5", name: "Goa Guru",    sub: "blog.goa.guru style", grad: "linear-gradient(135deg,#4f46e5,#7c3aed,#db2777)" },
    { id: "v6", name: "Amber Gold",  sub: "Warm & vibrant",       grad: "linear-gradient(135deg,#f6b800,#ffd24a)" }
  ];
  var STORE = "goa-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "v1";
  }
  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem(STORE, id); } catch (e) {}
    markActive();
  }
  var panel, fab;
  function markActive() {
    if (!panel) return;
    var cur = currentTheme();
    Array.prototype.forEach.call(panel.querySelectorAll(".swatch"), function (s) {
      s.classList.toggle("active", s.getAttribute("data-id") === cur);
    });
  }
  function buildSwitcher() {
    fab = document.createElement("button");
    fab.className = "theme-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Change theme");
    fab.innerHTML = '<svg class="ic ic-lg"><use href="assets/sprite.svg#i-palette"/></svg>';

    panel = document.createElement("div");
    panel.className = "theme-panel";
    var html = '<h5>Choose a theme</h5><div class="swatches">';
    THEMES.forEach(function (t, i) {
      html += '<button class="swatch" type="button" data-id="' + t.id + '">' +
                '<span class="dot" style="background:' + t.grad + '"></span>' +
                '<span>' + t.name + '<small>' + t.sub + '</small></span>' +
              '</button>';
    });
    html += "</div>";
    panel.innerHTML = html;

    document.body.appendChild(panel);
    document.body.appendChild(fab);

    fab.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    panel.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".swatch") : null;
      if (btn) applyTheme(btn.getAttribute("data-id"));
    });
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
        panel.classList.remove("open");
      }
    });
    markActive();
  }
  /* Theme switcher disabled — site locked to the Goa Guru theme.
     buildSwitcher(); */

  /* ============================================================
     SEARCH TYPEAHEAD (show suggestions after 3+ characters)
     ============================================================ */
  var CATEGORIES = [
    "Accommodation", "Hotels", "Resorts", "Guest Houses", "Lodging",
    "Food & Dining", "Restaurants", "Cafés", "Bakeries", "Bars & Pubs",
    "Spa & Salon", "Beauty Parlour", "Hair Salon", "Massage & Spa",
    "Home & Interior", "Interior Decorators", "Furniture", "Home Decor",
    "Marketing Agency", "Digital Marketing", "SEO Services", "Web Design",
    "Automobiles", "Car Showroom", "Two Wheelers", "Car Accessories",
    "Electronics", "Mobile Shops", "Electricians", "Photography",
    "Fashion", "Clothing Stores", "Footwear", "Jewellery",
    "General Services", "Taxi Services", "Pest Control", "Packers & Movers",
    "Education", "Pre-schools", "Coaching Classes", "Music Classes",
    "Fitness", "Gym", "Yoga", "Swimming Pool",
    "Hardware", "Building Materials",
    "Healthcare", "Hospitals", "Clinics", "Dentists", "Pharmacy",
    "Real Estate", "Property Dealers", "Builders",
    "Travel & Tourism", "Tour Operators", "Car Rentals",
    "Event Management", "Wedding Planners", "Flowers & Florist"
  ];
  var LOCATIONS = [
    "Vasco da Gama", "Margao", "Panaji", "Mapusa", "Ponda", "Candolim",
    "Calangute", "Baga", "Anjuna", "Colva", "Dabolim", "Porvorim",
    "Bicholim", "Curchorem", "Sanquelim", "Valpoi", "Pernem", "Quepem",
    "Canacona", "Sanguem", "Mormugao", "Dona Paula", "Miramar", "Benaulim",
    "Arambol", "Morjim", "Siolim", "Assagao", "Verna", "Cortalim",
    "Zuarinagar", "Old Goa", "Betalbatim", "Cavelossim", "Varca",
    "Majorda", "Nuvem", "Saligao", "Nerul", "Reis Magos"
  ];

  function setupTypeahead(input, data, icon) {
    if (!input) return;
    var field = input.closest(".field") || input.parentNode;
    var box = document.createElement("div");
    box.className = "ac";
    field.appendChild(box);
    var active = -1;
    var items = [];

    function hide() { box.classList.remove("show"); active = -1; }
    function render(matches) {
      if (!matches.length) { box.innerHTML = '<div class="empty">No matches — press Search</div>'; box.classList.add("show"); items = []; return; }
      box.innerHTML = matches.map(function (m) {
        return '<button type="button"><svg class="ic"><use href="assets/sprite.svg#' + icon + '"/></svg>' + m + "</button>";
      }).join("");
      items = Array.prototype.slice.call(box.querySelectorAll("button"));
      items.forEach(function (b) {
        b.addEventListener("mousedown", function (e) { e.preventDefault(); input.value = b.textContent.trim(); hide(); });
      });
      active = -1;
      box.classList.add("show");
    }
    function search() {
      var v = input.value.trim().toLowerCase();
      if (v.length < 3) { hide(); return; }
      var matches = data.filter(function (d) { return d.toLowerCase().indexOf(v) !== -1; }).slice(0, 8);
      render(matches);
    }
    function setActive(n) {
      if (!items.length) return;
      active = (n + items.length) % items.length;
      items.forEach(function (b, i) { b.classList.toggle("active", i === active); });
    }

    input.addEventListener("input", search);
    input.addEventListener("focus", function () { if (input.value.trim().length >= 3) search(); });
    input.addEventListener("blur", function () { setTimeout(hide, 150); });
    input.addEventListener("keydown", function (e) {
      if (!box.classList.contains("show")) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter" && active >= 0 && items[active]) { e.preventDefault(); input.value = items[active].textContent.trim(); hide(); }
      else if (e.key === "Escape") { hide(); }
    });
  }
  setupTypeahead(document.getElementById("q"), CATEGORIES, "i-search");
  setupTypeahead(document.getElementById("loc"), LOCATIONS, "i-map-pin");

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var menuBtn = document.querySelector(".menu-btn");
  var navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    var overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    var closeBtn = document.createElement("button");
    closeBtn.className = "nav-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.innerHTML = '<svg class="ic ic-lg"><use href="assets/sprite.svg#i-x"/></svg>';
    navLinks.insertBefore(closeBtn, navLinks.firstChild);

    function openMenu() { navLinks.classList.add("show"); overlay.classList.add("show"); document.body.style.overflow = "hidden"; }
    function closeMenu() { navLinks.classList.remove("show"); overlay.classList.remove("show"); document.body.style.overflow = ""; }

    menuBtn.addEventListener("click", function () {
      if (navLinks.classList.contains("show")) closeMenu(); else openMenu();
    });
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    Array.prototype.forEach.call(navLinks.querySelectorAll("a"), function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ============================================================
     CHIP REVEAL ANIMATION (desktop, on scroll into view)
     ============================================================ */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(".chips, .tag-cloud, #categories .cat-grid, #areas .cat-grid, #featured .cards")
  );
  if (revealEls.length) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal-seq");
      Array.prototype.forEach.call(el.children, function (child, i) {
        child.style.transitionDelay = Math.min(i * 45, 450) + "ms";
      });
    });
    var revealAll = function () { revealEls.forEach(function (el) { el.classList.add("in"); }); };
    var revealInView = function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < (window.innerHeight || 800) * 0.9) el.classList.add("in");
      });
    };
    // Paint hidden state, then reveal what's in view (nice on-scroll feel).
    requestAnimationFrame(function () { requestAnimationFrame(revealInView); });
    window.addEventListener("scroll", revealInView, { passive: true });
    // Safety net: nothing stays hidden regardless of scroll/observer support.
    setTimeout(revealAll, 900);
  }

  /* ============================================================
     SCROLL-TO-TOP BUTTON
     ============================================================ */
  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Scroll back to top");
  toTop.innerHTML = '<svg class="ic ic-lg"><use href="assets/sprite.svg#i-chevron-down"/></svg>';
  document.body.appendChild(toTop);
  function toggleTop() { toTop.classList.toggle("show", window.pageYOffset > 400); }
  window.addEventListener("scroll", toggleTop, { passive: true });
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  toggleTop();

  /* ============================================================
     GALLERY + LIGHTBOX
     ============================================================ */
  var gallery = document.getElementById("gallery");
  if (!gallery) return;

  var slides = Array.prototype.slice.call(gallery.querySelectorAll(".gslide"));
  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".gthumb"));
  var stage = document.getElementById("gstage");
  var lb = document.getElementById("lightbox");
  var lbStage = document.getElementById("lbStage");
  var lbCount = document.getElementById("lbCount");
  var idx = 0, lbOpen = false;

  function render() {
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === idx); });
    thumbs.forEach(function (t, n) { t.classList.toggle("is-active", n === idx); });
    if (lbOpen && lbStage) {
      lbStage.innerHTML = slides[idx].innerHTML;
      lbStage.className = "lb-stage " + (slides[idx].getAttribute("data-cls") || "");
      if (lbCount) lbCount.textContent = (idx + 1) + " / " + slides.length;
    }
  }
  function go(n) { idx = (n + slides.length) % slides.length; render(); }

  var prevBtn = gallery.querySelector(".gnav.prev");
  var nextBtn = gallery.querySelector(".gnav.next");
  if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });
  thumbs.forEach(function (t) {
    t.addEventListener("click", function () { go(parseInt(t.getAttribute("data-i"), 10) || 0); });
  });

  function openLb() { if (!lb) return; lbOpen = true; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; render(); }
  function closeLb() { if (!lb) return; lbOpen = false; lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

  if (stage) {
    stage.addEventListener("click", openLb);
    stage.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); } });
  }
  var expandBtn = gallery.querySelector(".gexpand");
  if (expandBtn) expandBtn.addEventListener("click", function (e) { e.stopPropagation(); openLb(); });

  if (lb) {
    var lbClose = lb.querySelector(".lb-close");
    var lbPrev = lb.querySelector(".lb-nav.prev");
    var lbNext = lb.querySelector(".lb-nav.next");
    if (lbClose) lbClose.addEventListener("click", closeLb);
    if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
    if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  }
  document.addEventListener("keydown", function (e) {
    if (!lbOpen) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") go(idx - 1);
    else if (e.key === "ArrowRight") go(idx + 1);
  });

  render();
})();
