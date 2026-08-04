/* Goa Business Directory — interactions
   - Mobile nav toggle
   - Listing gallery (thumbnail select + prev/next)
   - Fullscreen 16:9 lightbox with next/back + keyboard nav
*/
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
  }

  /* ---------- Gallery + Lightbox ---------- */
  var gallery = document.getElementById("gallery");
  if (!gallery) return;

  var slides = Array.prototype.slice.call(gallery.querySelectorAll(".gslide"));
  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".gthumb"));
  var stage = document.getElementById("gstage");
  var lb = document.getElementById("lightbox");
  var lbStage = document.getElementById("lbStage");
  var lbCount = document.getElementById("lbCount");
  var idx = 0;
  var lbOpen = false;

  function render() {
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === idx); });
    thumbs.forEach(function (t, n) { t.classList.toggle("is-active", n === idx); });
    if (lbOpen && lbStage) {
      lbStage.innerHTML = slides[idx].innerHTML;
      lbStage.className = "lb-stage " + (slides[idx].getAttribute("data-cls") || "");
      if (lbCount) lbCount.textContent = (idx + 1) + " / " + slides.length;
    }
  }

  function go(n) {
    idx = (n + slides.length) % slides.length;
    render();
  }

  var prevBtn = gallery.querySelector(".gnav.prev");
  var nextBtn = gallery.querySelector(".gnav.next");
  if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });

  thumbs.forEach(function (t) {
    t.addEventListener("click", function () { go(parseInt(t.getAttribute("data-i"), 10) || 0); });
  });

  function openLb() {
    if (!lb) return;
    lbOpen = true;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    render();
  }
  function closeLb() {
    if (!lb) return;
    lbOpen = false;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (stage) {
    stage.addEventListener("click", openLb);
    stage.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); }
    });
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
