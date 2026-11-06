# Image ledger: Where Phones Sleep

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, the poster, the basket label, spot labels 1 and 7, the Pebble sticker |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the poster, the stand up sign, tonight's screen plan, spot labels 2 and 8, the Bloop sticker, listing slot 1, the phone plan |
| `friends/orbit.png` | `public/digi-squad/friends/orbit.png` | the cover, the poster, spot labels 3 and 9 |
| `friends/nova.png` | `public/digi-squad/friends/nova.png` | spot labels 4 and 10 |
| `friends/cosmo.png` | `public/digi-squad/friends/cosmo.png` | spot labels 5 and 11 |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the cover, the poster, the charging line, the basket label, the rules, spot labels 6 and 12, the last page, the phone charging line |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

The charging shelf, the sleeping devices, the night sky, the basket, the
clocks, the stars and the cable flags are hand drawn HTML and inline SVG in
house tokens, in `print.html` and `phone.html`.

## Rebuild

    node content/printables/build-pack.mjs where-phones-sleep
