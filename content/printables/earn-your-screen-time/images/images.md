# Image ledger: Earn Your Screen Time

Checked and rebuilt 5 November 2026, when the pack was made Etsy ready. No
image in this pack is generated or redrawn. Every character is an approved
file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the ages 5 to 7 chart, the Pebble sticker |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the ages 8 to 11 chart, the Bloop sticker |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | DiGi Junior on the ending well cards |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (icons, stars, faces) lives in `print.html` and
`phone.html` in house tokens.

Replaced 5 November 2026: `bloop-hero.png` (a cutout that was not the
approved file). Pebble now leads the ages 5 to 7 chart, the Pebble page's age.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs earn-your-screen-time
