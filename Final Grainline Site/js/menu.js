/* Collection takeover menu.
   Desktop: opens when you hover "Collection", closes when the pointer leaves
   the nav and the panel. Touch / keyboard: "Collection" toggles it.
   Close ×, Esc and the dimmed area always close it. */
(() => {
  const menu = document.querySelector("[data-menu]");
  const trigger = document.querySelector("[data-menu-open]");
  if (!menu || !trigger) return;
  const nav = trigger.closest(".nav");
  const panel = menu.querySelector(".menu__panel");
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let closeTimer = null;

  function open() {
    clearTimeout(closeTimer);
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    trigger.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }
  function close() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    trigger.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  const isOpen = () => menu.classList.contains("is-open");

  // With a mouse, hover already opened it, so a click keeps it open; on touch it toggles.
  trigger.addEventListener("click", e => { e.preventDefault(); canHover ? open() : (isOpen() ? close() : open()); });
  menu.querySelectorAll("[data-menu-close]").forEach(el => el.addEventListener("click", close));
  addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) { close(); trigger.focus(); } });

  if (canHover) {
    trigger.addEventListener("mouseenter", open);
    const leave = () => { clearTimeout(closeTimer); closeTimer = setTimeout(close, 180); };
    const stay = () => clearTimeout(closeTimer);
    for (const el of [nav, panel]) { el.addEventListener("mouseleave", () => isOpen() && leave()); el.addEventListener("mouseenter", () => isOpen() && stay()); }
    // hovering other nav links closes it
    nav.querySelectorAll("a:not([data-menu-open])").forEach(a => a.addEventListener("mouseenter", () => isOpen() && close()));
  }
})();
