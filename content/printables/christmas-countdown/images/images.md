# Image ledger: The Christmas Screen Free Countdown

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, the cards, the planner, the stickers, the favourite days page, the Passport sticker |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the same, and the Bloop page Passport sticker |
| `friends/orbit.png` | `public/digi-squad/friends/orbit.png` | the cover, the cards, the planner, the stickers, the favourite days page |
| `friends/nova.png` | `public/digi-squad/friends/nova.png` | the same |
| `friends/cosmo.png` | `public/digi-squad/friends/cosmo.png` | the same |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | DiGi on top of the cover and the poster tree, the last page, listing slots 1 and 6 |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | DiGi Junior on the six spare stickers |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (the tree, the pot, the sparkles, the sticker rings and
date badges) lives in `print.html` in house tokens. The friends sit on their
Passport stage colours from `../pack-finish.js`, so a day sticker matches the
Passport page it is named for.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, Teo, Olga, Alma, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs christmas-countdown
