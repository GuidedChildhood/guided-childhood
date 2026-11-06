# Image ledger: The Star Swap Shop

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, the ages 4 to 7 chart, habit cards 5 to 8, the certificate, the Pebble sticker, listing slot 1 |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the ages 8 to 10 chart, habit cards 1 to 4, the certificate, the Bloop sticker |
| `friends/orbit.png` | `public/digi-squad/friends/orbit.png` | habit cards 9 and 10 (checking first, telling a grown up) |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | the shop menu |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | habit cards 11 and 12, the last page, listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

The awning, star jar, tickets, price tags and icons are hand drawn HTML and
inline SVG in house tokens, in `print.html` and `phone.html`.

## Rebuild

    node content/printables/build-pack.mjs star-swap-shop
