// Reveal: one quiet motion system for the whole site.
// Text and images rise 14px and fade in as they enter the viewport, in reading order,
// 70ms apart. Display type rises line by line from behind a mask. The hidden starting
// state lives in CSS under html.rv (set in <head>), so nothing flashes before this runs.
(() => {
  const root = document.documentElement;
  window.__rv = true;
  if (!root.classList.contains("rv")) return;

  // Split display type into masked lines.
  document.querySelectorAll(".display, .viewer__name").forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(l => `<span class="line"><span>${l.trim()}</span></span>`).join("");
    el.classList.add("is-split");
  });

  const SEL = [
    ".display", ".viewer__name", ".viewer__meta", ".viewer__tile .views",
    ".hero__meta > *", ".lineup__chair", ".lineup__bar",
    ".intro__label", ".intro__text", ".studio__label", ".studio__text", ".values li", ".closing .link",
    ".statement-row .statement", ".statement-row .body",
    ".person__img", ".person__text > *",
    ".construction__label", ".parts > div",
    ".bleed", ".drawing__label", ".drawing__tile", ".specs",
    ".compare__label", ".compare__item",
    ".footer > :not(.footer__rule)"
  ].join(",");
  const els = [...document.querySelectorAll(SEL)];

  let first = true;
  const io = new IntersectionObserver(entries => {
    const batch = entries.filter(e => e.isIntersecting).map(e => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    const base = first ? 120 : 0;   // on load, let the nav settle first
    first = false;
    batch.forEach((el, i) => {
      el.style.setProperty("--rv-delay", `${base + Math.min(i, 8) * 70}ms`);
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  els.forEach(el => io.observe(el));
})();
