# Grainline

**Made to be seen. Built to be used.**

Grainline is a concept furniture studio and its debut collection: three chairs in solid walnut and oak, each drawn from a single geometric shape.

| Chair | Shape | Idea |
|---|---|---|
| Totem | Circle | The circle, held upright. |
| Shard | Triangle | Geometry as ritual. |
| Float | Line | An open frame, a grounded seat, and just enough structure. |

This repository is the working website — a study in minimalism, designed in Figma and built by hand.

**Live site:** _add your GitHub Pages link here_

---

## The idea

Most furniture sites are catalogues: a grid of product cards. Grainline is built around one question — *why does each chair look the way it does?* — and answers it through interaction rather than copy.

### From shape to object
On the home page, each chair has a pinned, scroll-driven sequence in three steps:

1. **Shape** — the source shape draws itself.
2. **Top view** — it morphs into the chair seen from above, traced from the studio render; the back and legs draw in.
3. **Object** — the photograph fades up under the lines and the lines fall away.

Scroll down and it builds; scroll up and it unbuilds. The lines are live SVG traced to align 1:1 with the overhead render, so the drawing becomes the photo with no jump.
*(The Triangle → Shard beat is complete; Circle → Totem and Line → Float are placeholders.)*

### One photographic system
Every chair was rendered from the same four angles — three-quarter, side, back and top — on the same flat background as the page. That consistency is what makes the interactions possible:

- **The collection turns together** — the home hero shows all three chairs rotating through the same views in sync.
- **Scroll turns the chair** — each product page pins a full-screen viewer and scroll moves it through the four views.
- **Same angle, side by side** — every product page ends with the collection compared at one angle.

### Construction
Each product page shows an exploded render that settles into the finished chair as you scroll, followed by the parts list and a dimensioned technical drawing.

---

## Design system

- **Grid:** 12 columns, 40px margins, 20px gutters; responsive down to phone.
- **Type:** Hanken Grotesk (ExtraLight for display, Light for text, Regular for emphasis). DM Mono for drawing dimensions.
- **Colour:** white page, cream tiles (`#F8F6F3`) matched to the renders, ink `#161412`, muted `#8A837B`, hairlines `#DDD8D1`.
- **Motion:** every animation is tied to scroll position, not timers (except the home lineup). With *reduce motion* turned on, sequences are shown as still images side by side.

---

## Structure

```
index.html          home
totem.html          product — Totem
shard.html          product — Shard
float.html          product — Float
css/style.css       type, grid, layout, responsive + reduced-motion rules
js/lineup.js        home hero: the three chairs turning in sync
js/shape.js         home: scroll-driven shape → top view → object
js/viewer.js        product hero: scroll turns the chair
js/construction.js  product: parts assemble as you scroll
js/menu.js          Collection menu overlay
assets/renders/     studio renders (four views + exploded, per chair)
assets/lifestyle/   in-situ photography
assets/drawings/    technical drawings (SVG)
assets/parts/       exploded parts, cut out for the assembly
assets/logo.svg     wordmark
```

Plain HTML, CSS and JavaScript — no framework or build step. Open `index.html` in a browser to run it locally.

---

Design and development by Jade Bayonet, 2026.
