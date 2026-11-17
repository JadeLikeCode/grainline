/* Product hero — scroll turns the chair.
   The viewer pins for ~1.6 screens; scroll progress picks the view
   (three-quarter → side → back → top). The view names scroll to their view. */
(() => {
  const viewer = document.querySelector("[data-viewer]");
  if (!viewer) return;

  const imgs = [...viewer.querySelectorAll(".viewer__tile img")];
  const buttons = [...viewer.querySelectorAll(".views button")];
  const n = imgs.length;
  let current = -1;

  function progress() {
    const r = viewer.getBoundingClientRect();
    const total = viewer.offsetHeight - innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  function show(i) {
    if (i === current) return;
    current = i;
    imgs.forEach((img, k) => img.classList.toggle("is-on", k === i));
    buttons.forEach((b, k) => b.classList.toggle("is-on", k === i));
  }

  buttons.forEach((b, i) => b.addEventListener("click", () => {
    const total = viewer.offsetHeight - innerHeight;
    const top = viewer.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + total * ((i + 0.5) / n), behavior: "smooth" });
  }));

  function tick() {
    show(Math.min(n - 1, Math.floor(progress() * n)));
    requestAnimationFrame(tick);
  }
  show(0);
  requestAnimationFrame(tick);
})();
