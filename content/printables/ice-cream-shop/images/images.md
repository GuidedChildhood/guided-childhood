# Imagery ledger — Sofia's Ice Cream Shop

No Higgsfield jobs this build: the Higgsfield CDN was blocked in the
session, so the product uses the existing squad art plus original vector
illustration only.

## Sources
- `Sofia.jpeg` — copied from `public/digi-squad/Sofia.jpeg`, the canonical
  Sofia reference art (1024x1024, 300dpi). Used on the cover, guide, menu
  and bonus pages, cropped to a circle in CSS.
- All other artwork (ice cream cart, cones, scoops with faces, flake,
  cherry, sauce, sprinkles, lolly, sundae, family tub, and the full play
  coin set) is hand drawn inline SVG living in `print.html` and
  `phone.html`, drawn to the house tokens: ink outlines, butter and cream
  fills, tint blue silvers, flat sticker style.
- `preview-page-N.png` — one preview per print page, regenerated on every
  build for the visual check.
- `qa-ink-menu.png`, `qa-ink-coins.png` — ink friendly mode spot checks.

## Rebuild
Run the Playwright build script (playwright-core, bundled Chromium):
`node build-ice-cream-shop.mjs` from the session scratchpad, script copied
alongside this ledger's notes. It renders product/ PDFs (A4, US Letter at
0.94 scale, ink friendly), the two phone/ PNGs and all previews from
`print.html` and `phone.html`.

## Wanted when Higgsfield is back
- A flat sticker Sofia in apron behind the cart for the cover, anchored to
  `digi-squad/Sofia.jpeg`, warm butter background, ink outlines.
- Lifestyle mockup base plates for photo slots 1 and 2.
