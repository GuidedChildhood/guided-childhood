# Image ledger: The 30 Day Screen Reset Journal

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the faces key, the day page tips, the Bloop sticker |
| `friends/nova.png` | `public/digi-squad/friends/nova.png` | the cover, the faces key, the day page tips, the Nova sticker |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the cover, the tips, the line page, the last page (the free gift), listing slots 1 and 6 |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | kept with the pack per the house setup; not on a page today |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

The five faces are inline SVG in `print.html`, drawn from the same paths as
`Face` in `components/daily/ConcernCheckIn.tsx`, so they match the app.
Every other icon, tick box and dot is hand drawn inline in house tokens.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, Teo, Olga, Alma, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs screen-reset-journal
