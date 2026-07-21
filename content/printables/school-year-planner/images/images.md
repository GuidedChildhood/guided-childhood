# Imagery ledger — My School Year Planner 2026 to 2027

The Higgsfield CDN was blocked in this build session, so no generation jobs
were run. The product uses:

- `DiGi-star.svg` — copied from `public/digi-squad/DiGi-star.svg`, the
  canonical golden star DiGi (never the robot Digi.png). Used on the cover,
  every section opener bubble, the monthly DiGi notes, the screen balance
  corner and the bonus page.
- Hand drawn inline SVG icons in house tokens (ink outlines, terracotta,
  coral, green, tint blue, tint sage, pastel pink): seasonal month icons
  (leaf, pumpkin, umbrella, snowflake, mitten, heart, daffodil, rainbow,
  flower, sun, ice lolly, beach ball), star outlines for the reading log,
  and the book icon.

## Rebuild
Generator (computes the real calendar grids, writes print.html):
`gen-planner.mjs` in this folder. Build (PDFs, phone PNGs, previews):
`build-planner.mjs` in this folder, modelled on the earn-your-screen-time build,
playwright-core with the chromium executable candidates listed in that file.
`preview-page-N.png` files here are the visual check set, one per page.

## Follow up Higgsfield slots (log job IDs here when run)
- Desk lifestyle hero for photo slot 1
- Flat lay backdrop for photo slot 2
