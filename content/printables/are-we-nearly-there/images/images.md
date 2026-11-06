# Image ledger: Are We Nearly There

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, the deal card, the picture bingo, the map, the doodles, the tally, the Pebble sticker, listing slot 1 |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the hard bingo card, the number plates, the talking games, the Bloop sticker |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | DiGi Junior on the hard bingo free space and the star tally |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG lives in `print.html` in house tokens: the sixteen car
bingo pictures, the stars, the gold road on the cover, and the journey map
(road, home, flag, trees, hills, cloud). Their fills go white in the ink
friendly print so a child can colour them in.

Never use Sofia, Oliver, Zara, Teo, Olga, Alma, the green robot or the owl.
All retired.

## Rebuild

    node content/printables/build-pack.mjs are-we-nearly-there
