// Temporary global switch for every GSAP / JS-driven animation trigger in the
// app (scroll reveals, count-ups, page/tab transitions, modal open/close,
// chart draw-in, etc). Set back to `true` to restore all of them — nothing
// else needs to change, since each call site is gated off this flag rather
// than having its animation code removed.
export const ANIMATIONS_ENABLED = true;
