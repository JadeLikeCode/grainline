/* Home hero — the three chairs turn through the same four views together.
   Auto-advances every 2.2s; the view names jump straight to a view. */
(() => {
  const lineup = document.querySelector("[data-lineup]");
  if (!lineup) return;

  const chairs = [...lineup.querySelectorAll(".lineup__img")];
  const buttons = [...lineup.querySelectorAll(".views button")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let view = 0, timer = null;

  function show(i) {
    view = i;
    chairs.forEach(c => c.querySelectorAll("img").forEach((img, k) => img.classList.toggle("is-on", k === i)));
    buttons.forEach((b, k) => b.classList.toggle("is-on", k === i));
  }

  function play() {
    if (reduce) return;
    clearInterval(timer);
    timer = setInterval(() => show((view + 1) % buttons.length), 2200);
  }

  buttons.forEach((b, i) => b.addEventListener("click", () => { show(i); play(); }));

  // Only turn while the lineup is on screen.
  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : clearInterval(timer))).observe(lineup);
  show(0);
})();
