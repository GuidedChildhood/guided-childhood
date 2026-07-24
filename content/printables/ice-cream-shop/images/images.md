# Imagery ledger — Pebble's Ice Cream Shop

Pebble the Planet Friend now fronts the shop in place of the retired
Sofia. Her age (four to seven) matches the shopkeeper who says "I am six".

## Sources
- Pebble hero: the Planet Friend cutout on the CDN, the same art the app
  uses, referenced by URL in `print.html` and `phone.html`:
  `d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260723_135533_4b42a90b.png`.
  Cropped to a circle in CSS. The local machine that runs the build reaches
  the CDN, so no file lives in this folder.
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

## Nice to have later
- A flat sticker Pebble in an apron behind the cart for the cover, from the
  Planet Friend art, warm butter background, ink outlines.
- Lifestyle mockup base plates for photo slots 1 and 2.
