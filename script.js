/* ============================================================
   TOMO 7 — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- sticky header state ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- menu tabs ---------- */
  const tabs = Array.from(document.querySelectorAll(".menu-tab"));
  const panels = Array.from(document.querySelectorAll(".menu-panel"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("active", p.id === target));
      // keep active pill in view within the scroller
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  });

  /* ---------- menu tabs: horizontal-scroll affordances ---------- */
  const tabsWrap = document.getElementById("menuTabsWrap");
  const tabsScroller = document.getElementById("menuTabs");
  const tabPrev = document.getElementById("tabPrev");
  const tabNext = document.getElementById("tabNext");

  if (tabsWrap && tabsScroller) {
    let cued = true; // right-arrow nudge until the user scrolls once

    const updateCues = () => {
      const max = tabsScroller.scrollWidth - tabsScroller.clientWidth;
      const x = tabsScroller.scrollLeft;
      const moreRight = x < max - 4;
      tabsWrap.classList.toggle("more-left", x > 4);
      tabsWrap.classList.toggle("more-right", moreRight);
      if (cued && moreRight) tabNext.classList.add("cue");
    };

    const stopCue = () => {
      if (!cued) return;
      cued = false;
      tabNext.classList.remove("cue");
    };

    const step = () => Math.max(160, tabsScroller.clientWidth * 0.7);
    tabNext.addEventListener("click", () => {
      stopCue();
      tabsScroller.scrollBy({ left: step(), behavior: "smooth" });
    });
    tabPrev.addEventListener("click", () => {
      tabsScroller.scrollBy({ left: -step(), behavior: "smooth" });
    });

    tabsScroller.addEventListener("scroll", () => { stopCue(); updateCues(); }, { passive: true });
    window.addEventListener("resize", updateCues);
    // recompute once fonts/layout settle
    updateCues();
    window.addEventListener("load", updateCues);
    setTimeout(updateCues, 400);
  }

  /* ---------- active nav link on scroll ---------- */
  const sections = ["about", "menu", "hours", "order"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const setActiveNav = () => {
    const y = window.scrollY + header.offsetHeight + 40;
    let current = "";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop) current = sec.id;
    });
    // #visit lives inside #hours; keep hours highlighted there
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href").slice(1);
      a.classList.toggle("active", href === current);
    });
  };
  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });

  /* ---------- hours: highlight today + open/closed status ---------- */
  // schedule in minutes from midnight, per JS getDay() (0 = Sun … 6 = Sat)
  const schedule = {
    0: [[690, 1320]],               // Sun 11:30–22:00
    1: [[690, 900], [890, 1320]],   // Mon 11:30–15:00, 16:50–22:00
    2: [[690, 900], [890, 1320]],   // Tue
    3: [[690, 900], [890, 1320]],   // Wed
    4: [[690, 900], [890, 1320]],   // Thu
    5: [[690, 1320]],               // Fri 11:30–22:00
    6: [[690, 1320]],               // Sat 11:30–22:00
  };

  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();

  // highlight today's row
  const todayRow = document.querySelector('.hours-list li[data-day="' + day + '"]');
  if (todayRow) todayRow.classList.add("today");

  // open now?
  const isOpen = (schedule[day] || []).some(([o, c]) => mins >= o && mins < c);
  const badge = document.getElementById("openBadge");
  const txt = badge.querySelector(".status-txt");

  if (isOpen) {
    badge.classList.add("is-open");
    // find today's closing time
    const block = schedule[day].find(([o, c]) => mins >= o && mins < c);
    const close = block[1];
    const ch = Math.floor(close / 60);
    const label = ch > 12 ? (ch - 12) + " PM" : ch + (ch === 12 ? " PM" : " AM");
    txt.textContent = "Open now · until " + label;
  } else {
    badge.classList.add("is-closed");
    // find next opening today, else tomorrow
    let next = null;
    (schedule[day] || []).forEach(([o]) => { if (o > mins && next === null) next = o; });
    if (next !== null) {
      const oh = Math.floor(next / 60);
      const om = next % 60;
      const h12 = oh > 12 ? oh - 12 : oh;
      const label = h12 + ":" + String(om).padStart(2, "0") + (oh >= 12 ? " PM" : " AM");
      txt.textContent = "Closed now · opens at " + label;
    } else {
      txt.textContent = "Closed now · opens tomorrow 11:30 AM";
    }
  }

  /* ---------- footer year ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
