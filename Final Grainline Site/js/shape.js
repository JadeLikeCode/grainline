/* Home — "From shape to object".
   Each beat pins for ~3 screens of scroll. Scroll drives three steps:
     01 Shape     the source shape draws itself
     02 Top view  it morphs into the chair's traced top view; back and legs draw in
     03 Object    the overhead render fades up under the lines, then the lines fade out
   Beats with data-trace="shard" are fully drawn. The circle and line beats are FPO:
   their steps, progress and counter run, and the stage waits for its trace. */
(() => {
  const beats = [...document.querySelectorAll("[data-beat]")];
  if (!beats.length) return;

  const ease = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const seg = (p, a, b) => ease((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const NS = "http://www.w3.org/2000/svg";

  /* ---------- traced geometry ----------
     Coordinates are measured on the 2560×1440 overhead render; the stage shows
     the 1200×1200 window at (678, 100), saved as assets/renders/shard-top-square.jpg. */
  const OX = 678, OY = 100, N = 480;
  const P = (x, y) => [x - OX, y - OY];
  const line = (a, b, n = 30) => Array.from({ length: n }, (_, i) => { const t = (i + 1) / n; return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; });
  const cubic = (p0, p1, p2, p3, n = 40) => Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / n, u = 1 - t;
    return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  });
  const quad = (p0, p1, p2, n = 12) => Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / n, u = 1 - t;
    return [0, 1].map(k => u * u * p0[k] + 2 * u * t * p1[k] + t * t * p2[k]);
  });
  function resample(pts, n) {
    const d = [0];
    for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = d[d.length - 1], out = []; let j = 0;
    for (let i = 0; i < n; i++) {
      const s = L * i / (n - 1);
      while (j < d.length - 2 && d[j + 1] < s) j++;
      const t = (s - d[j]) / Math.max(d[j + 1] - d[j], 1e-9);
      out.push([lerp(pts[j][0], pts[j + 1][0], t), lerp(pts[j][1], pts[j + 1][1], t)]);
    }
    return out;
  }
  const toD = pts => "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";

  const TRACES = {
    shard() {
      const A = P(955, 401), B = P(1597, 401), C = P(1412, 1010), D = P(1148, 1010), apex = P(1280, 1078);
      return {
        shape: resample([A, ...line(A, B), ...line(B, apex), ...line(apex, A)], N),
        seat: resample([A, ...line(A, B), ...line(B, C), ...cubic(C, P(1385, 1088), P(1175, 1088), D), ...line(D, A)], N),
        back: [P(944, 360), ...line(P(944, 360), P(943, 292), 8), ...cubic(P(943, 292), P(995, 148), P(1561, 148), P(1613, 292), 60),
               ...line(P(1613, 292), P(1611, 360), 8), ...quad(P(1611, 360), P(1608, 397), P(1594, 401)),
               ...line(P(1594, 401), P(958, 401), 40), ...quad(P(958, 401), P(946, 397), P(944, 360))],
        legs: [[[1048, 592], [982, 700], 25], [[1512, 598], [1580, 700], 25], [[1284, 1040], [1284, 1188], 34]]
      };
    }
  };

  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* Build the line drawing inside a stage. Returns the parts to animate. */
  function buildTrace(stage, key, id) {
    const g = TRACES[key]();
    const svg = el("svg", { viewBox: "0 0 1200 1200", fill: "none", "aria-hidden": "true" }, stage);
    const defs = el("defs", {}, svg);
    const mask = el("mask", { id: "m-" + id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 1200, height: 1200 }, defs);
    el("rect", { width: 1200, height: 1200, fill: "#fff" }, mask);
    const inner = el("g", { stroke: "#000", "stroke-linecap": "round" }, mask);
    el("path", { d: toD(g.seat), fill: "#000" }, mask);
    el("path", { d: toD(g.back), fill: "#000" }, mask);

    const ghost = el("polygon", { points: g.shape.map(p => p.join(",")).join(" "), stroke: "#161412", "stroke-opacity": 0, "stroke-width": 1.5, "stroke-dasharray": "6 8" }, svg);
    const legs = el("g", { stroke: "#161412", "stroke-linecap": "round", mask: `url(#m-${id})`, opacity: 0 }, svg);
    for (const [a, b, r] of g.legs) {
      const [x1, y1] = P(...a), [x2, y2] = P(...b);
      el("line", { x1, y1, x2, y2, "stroke-width": 2 * r + 2 }, legs);
      el("line", { x1, y1, x2, y2, "stroke-width": 2 * r - 2 }, inner);
    }
    const back = el("path", { d: toD(g.back), stroke: "#161412", "stroke-width": 2, "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 }, svg);
    const shape = el("path", { d: toD(g.shape), stroke: "#161412", "stroke-width": 2, "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 }, svg);
    return { svg, ghost, legs, back, shape, g };
  }

  /* Reduced motion: shape, top view and object side by side. */
  function buildStatic(beat, key, photo) {
    const holder = beat.querySelector(".beat__static");
    if (!holder) return;
    if (!key) { holder.remove(); return; }
    const g = TRACES[key]();
    const fig = () => { const f = document.createElement("figure"); holder.appendChild(f); return f; };
    const s1 = el("svg", { viewBox: "0 0 1200 1200", fill: "none" }, fig());
    el("path", { d: toD(g.shape), stroke: "#161412", "stroke-width": 3 }, s1);
    const s2 = el("svg", { viewBox: "0 0 1200 1200", fill: "none" }, fig());
    el("path", { d: toD(g.seat), stroke: "#161412", "stroke-width": 3 }, s2);
    el("path", { d: toD(g.back), stroke: "#161412", "stroke-width": 3 }, s2);
    const img = document.createElement("img"); img.src = photo; img.alt = ""; fig().appendChild(img);
  }

  const state = beats.map((beat, i) => {
    const stage = beat.querySelector(".stage");
    const key = stage.dataset.trace;
    const photo = stage.querySelector("img");
    const trace = key ? buildTrace(stage, key, i) : null;
    buildStatic(beat, key, photo && photo.getAttribute("src"));
    return {
      beat, stage, photo, trace,
      steps: [...beat.querySelectorAll(".steps li")],
      bar: beat.querySelector(".progress i"),
      counter: beat.querySelector(".counter"),
      cta: beat.querySelector(".link"),
      last: -1
    };
  });

  function render(s, p) {
    const step = p < 0.26 ? 0 : p < 0.58 ? 1 : 2;
    s.steps.forEach((li, k) => li.classList.toggle("is-on", k === step));
    if (s.counter) s.counter.textContent = `0${step + 1} / 03`;
    if (s.bar) s.bar.style.width = (p * 100).toFixed(1) + "%";
    if (!s.trace) return;

    const t = s.trace;
    const draw = seg(p, 0.02, 0.20), morph = seg(p, 0.26, 0.46), parts = seg(p, 0.30, 0.50),
          photo = seg(p, 0.58, 0.76), out = seg(p, 0.76, 0.88), ghost = seg(p, 0.26, 0.36);
    const pts = morph > 0 ? t.g.shape.map((a, i) => [lerp(a[0], t.g.seat[i][0], morph), lerp(a[1], t.g.seat[i][1], morph)]) : t.g.shape;
    t.shape.setAttribute("d", toD(pts));
    t.shape.style.strokeDashoffset = morph > 0 ? 0 : 1 - draw;
    t.back.style.strokeDashoffset = 1 - parts;
    t.legs.setAttribute("opacity", parts);
    t.ghost.setAttribute("stroke-opacity", (0.18 * ghost * (1 - photo)).toFixed(3));
    if (s.photo) s.photo.style.opacity = photo;
    t.svg.style.opacity = 1 - out;
  }

  function tick() {
    for (const s of state) {
      const r = s.beat.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) continue;
      const total = s.beat.offsetHeight - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (Math.abs(p - s.last) > 1e-4) { render(s, p); s.last = p; }
    }
    requestAnimationFrame(tick);
  }
  state.forEach(s => render(s, 0));
  requestAnimationFrame(tick);
})();
