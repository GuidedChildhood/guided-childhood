# Image ledger — The Family Phone Agreement

Built 21 July 2026. The Higgsfield CDN was blocked in this session, so no
generation jobs were run. All imagery is local and license clean:

- `DiGi-star.svg` — the house DiGi star (golden clay star, the guide who
  speaks to parents), copied from `public/digi-squad/DiGi-star.svg`. Used on
  the cover, page headers, the agreement bubbles, wallet cards and the bonus
  page. Never the robot Digi.png.
- Hand drawn inline SVG icons inside `print.html` and `phone.html` (moon,
  clock, app tile, speech mark, meal plate, star), all drawn in house tokens
  (ink outlines, tint fills).
- `preview-page-1.png` to `preview-page-8.png` — page renders for QA.
- `preview-ink-page-4.png`, `preview-ink-page-6.png` — ink friendly QA.

## Rebuild
Playwright script (scratchpad): `build-fpa.mjs` — renders `print.html` to
the three PDFs in `product/`, screenshots `phone.html` sections to
`phone/*.png` (1080x1920), and writes the page previews here. `check-ink.mjs`
renders the ink class previews.

## When Higgsfield is back
Generate the listing photo imagery (kitchen table hero, flat lay) at 2x
print resolution, one test image first, anchored to the DiGi star reference,
and record job IDs here.
