// Construction: as the pinned section scrolls, each part travels from its
// exploded position to where it sits in the finished chair, then the
// assembled render fades in to settle the shadows.
(() => {
  const section = document.querySelector("[data-construction]");
  if (!section) return;
  // Pieces are positioned in % of the 16:9 render frame (the tile crops it to 4:3).
  const tile = section.querySelector(".construction__frame") || section.querySelector(".construction__tile");
  // Part names in the copy column turn ink as their pieces land.
  const names = [...section.querySelectorAll(".parts [data-pieces]")].map(el => ({ el, idx: el.dataset.pieces.split(",").map(Number) }));
  const exploded = tile.querySelector(".exploded");
  const assembled = tile.querySelector(".assembled");
  // Totem ends on its own parts (the studio render hides the back leg)
  const partsFinal = section.hasAttribute("data-parts-final");
  const pieces = [...tile.querySelectorAll(".piece")].map(el => ({ el, dx: +el.dataset.dx, dy: +el.dataset.dy, sx: +el.dataset.sx || 1, sy: +el.dataset.sy || 1, out: !!el.dataset.out, m: el.dataset.m ? el.dataset.m.split(",").map(Number) : null }));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { names.forEach(nm => nm.el.classList.add("is-set")); return; }

  const clamp = x => Math.min(1, Math.max(0, x));
  const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const n = pieces.length;
  let last = -1;

  function tick() {
    const r = section.getBoundingClientRect();
    const travel = r.height - (innerHeight - 76);
    const p = clamp((76 - r.top) / travel);
    if (Math.abs(p - last) > 0.0005) {
      last = p;
      const w = tile.clientWidth, h = tile.clientHeight;
      exploded.style.opacity = (1 - clamp(p / 0.06)).toFixed(3);
      pieces.forEach((q, i) => {
        const start = 0.04 + i * (0.14 / Math.max(1, n - 1));
        const t = ease((p - start) / 0.36);
        q.t = t;
        // a part hidden in the finished chair dissolves as it arrives
        if (q.out) q.el.style.opacity = (1 - ease((p - 0.24) / 0.16)).toFixed(3);
        if (q.m) {
          // rotate + scale + move (used where a part also has to turn to its place)
          const [a, b, tx, ty] = q.m, A = 1 + (a - 1) * t, B = b * t;
          q.el.style.transform = `matrix(${A.toFixed(5)}, ${B.toFixed(5)}, ${(-B).toFixed(5)}, ${A.toFixed(5)}, ${(tx / 100 * w * t).toFixed(2)}, ${(ty / 100 * h * t).toFixed(2)})`;
          return;
        }
        q.el.style.transform = `translate(${(q.dx / 100 * w * t).toFixed(2)}px, ${(q.dy / 100 * h * t).toFixed(2)}px) scale(${(1 + (q.sx - 1) * t).toFixed(4)}, ${(1 + (q.sy - 1) * t).toFixed(4)})`;
      });
      names.forEach(nm => nm.el.classList.toggle("is-set", nm.idx.every(i => pieces[i] && pieces[i].t > 0.97)));
      if (!partsFinal) assembled.style.opacity = ease((p - 0.5) / 0.1).toFixed(3);
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", () => { last = -1; });
  requestAnimationFrame(tick);
})();
