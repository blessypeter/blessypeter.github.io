// Small helpers for my site: menu, scroll reveal, timeline progress, active nav link.
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Timeline progress: the glowing line fills as you scroll down the strand
  var timeline = document.querySelector(".timeline");
  function updateProgress() {
    if (!timeline) return;
    var r = timeline.getBoundingClientRect();
    var mid = window.innerHeight * 0.6;
    var p = (mid - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    timeline.style.setProperty("--progress", reduceMotion ? 1 : p.toFixed(3));
  }

  // Highlight the nav link for the section on screen
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function updateActive() {
    var y = window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= y) current = i;
    });
    navLinks.forEach(function (a, i) {
      if (i === current) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      updateActive();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
