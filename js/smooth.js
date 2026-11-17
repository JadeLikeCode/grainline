// Smooth scroll for in-page links (nav, Enquire, etc.).
// Eases in and out; longer distances take a little longer, capped so it never drags.
// Any wheel, touch or key input hands control straight back to the visitor.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector(".nav");
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let raf = 0;

  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  ["wheel", "touchstart", "keydown"].forEach(ev => addEventListener(ev, stop, { passive: true }));

  function scrollToY(y) {
    stop();
    const start = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    const end = Math.max(0, Math.min(max, y)), dist = end - start;
    if (Math.abs(dist) < 2) return;
    if (reduce) { scrollTo(0, end); return; }
    const dur = Math.min(1400, Math.max(650, 450 + Math.abs(dist) * 0.18));
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      scrollTo(0, start + dist * ease(t));
      raf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  }

  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target.closest("a[href*='#']");
    if (!a) return;
    const url = new URL(a.href, location.href);
    const here = p => p.replace(/index\.html$/, "");
    if (url.origin !== location.origin || here(url.pathname) !== here(location.pathname)) return;
    const id = decodeURIComponent(url.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target && id) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight - 8 : 0;
    const y = target ? target.getBoundingClientRect().top + scrollY - offset : 0;
    scrollToY(y);
    history.pushState(null, "", id ? "#" + id : location.pathname);
  });
})();
