# Routine Picture Cards (spin off of The Planet Day Flip Chart)

A small product cut from a bigger pack and sold on its own on Etsy at £1.99,
so the shop shows up in more searches and a family has an easy first purchase
(Justin, 11 November 2026).

- Parent: `../planet-day-flip-chart` (The Planet Day Flip Chart). The pages are copied out of the
  parent's three product PDFs by `node content/printables/cut-pack.mjs routine-picture-cards`,
  never redrawn. Change a page in the parent, rebuild the parent, then rerun
  that command.
- Last page: a thank you page from `../pack-finish.js` with no Passport
  sticker (the sticker belongs to the whole pack), naming the parent pack and
  the free gift at guidedchildhood.com/etsy-bonus.
- Previews: `images/preview/`, made from the A4 PDF by `../pdf-previews.mjs`.
- Photos: `node content/printables/build-pack.mjs routine-picture-cards listing`.
- Not in the app on its own: its pages are in the app as part of the parent
  (see `scripts/check-etsy-in-app.mjs`).
