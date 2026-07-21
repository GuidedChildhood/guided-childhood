# Imagery ledger — The Calm Down Corner Kit

Higgsfield CDN was blocked in this session, so no generation jobs were run.
All imagery is existing reference art plus hand drawn inline SVG in the
house style. Nothing off model shipped.

## Assets used
- `sofia.jpeg` — copied from `public/digi-squad/Sofia.jpeg` (Sofia, Safety
  Guardian, the character lane owner for calm down kits). Used on the cover,
  the sign, the feelings cards page and the after page.
- `DiGi-star.svg` — copied from `public/digi-squad/DiGi-star.svg`. DiGi
  Junior leads the star breathing poster, the phone star screen and the
  bonus page.
- Inline SVG, hand drawn in `print.html` and `phone.html`:
  - 8 feeling faces (round faces, minimal features, house colour fills,
    ink outlines): happy, sad, angry, worried, frustrated, tired, excited,
    calm. In the ink friendly PDF the fills drop to white so the faces
    become colour in outlines.
  - The finger tracing star (thick ink outline with a dashed cream trace
    path, green start dot, in and out arrows).
  - 12 small icons for the calm choice cards plus the circle it row on the
    after page.

## Previews
`preview-page-1.png` to `preview-page-9.png` — one render per print page,
regenerated on every build for the visual check.

## Rebuild
Run `node build-calm-down-kit.mjs` from the session scratchpad (playwright
core plus local Chromium). The script prints the three PDFs from
`print.html`, screenshots the two phone screens from `phone.html`, and
refreshes the preview PNGs.

## When Higgsfield is back
Generate the listing mockup set (corner hero, flat lay, cards on a string)
anchored to the Sofia reference art, warm butter and cream background, ink
outlines, flat sticker friendly shapes, 2x print resolution. Record job IDs
here.
