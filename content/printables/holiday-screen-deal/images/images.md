# Image ledger: The Holiday Screen Deal

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the setup page, the deal, the daily core, the look back, the Bloop sticker, both phone screens, listing slot 1 |
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the Pebble sticker on the last page |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | copied with the house set, not shown on a page |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (the daily core icons, stars, the face to draw, the
family jobs house) lives in `print.html` and `phone.html` in house tokens.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs holiday-screen-deal
