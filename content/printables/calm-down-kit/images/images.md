# Image ledger: The Calm Down Corner Kit

Checked and rebuilt 5 November 2026, when the pack was made Etsy ready. No
image in this pack is generated or redrawn. Every character is an approved
file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, the sign, the feelings and after pages, the sticker |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | DiGi Junior on the star breathing poster and the phone screen |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (icons, stars, faces) lives in `print.html` and
`phone.html` in house tokens.

Removed 5 November 2026: `sofia.jpeg` (retired character) and `Pebble.png`
(an uncut render on a cream background, not the approved cutout).

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs calm-down-kit
