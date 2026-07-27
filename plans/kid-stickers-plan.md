# Kid sticker surface and first unlock celebration

The child's own half of the sticker book. The parent already sees the
collection on the Passport; this is where the child sees it, and gets a little
moment the first time a sticker unlocks.

## The celebration, made reliable

Reconcile on read persists a newly earned sticker whoever opens first, so the
child could miss the moment if the parent viewed the Passport first. A
`celebrated` flag (migration 109) fixes this: a sticker is celebrated once,
on the child's path, whenever they next open it, regardless of read order.

## Pieces

- Migration 109: `earned_stickers.celebrated boolean default false`.
- The kid path reads the sticker book (admin client, same as the star bank it
  already reads) and the set of earned but not yet celebrated stickers.
- `components/kid/KidStickers.tsx`: the collection in the kid theme, earned
  bright and locked as a mystery, plus a celebration overlay that pops the new
  sticker with a GSAP bounce and the star sound, then marks it seen.
- `app/api/kid/stickers/seen`: token scoped, marks the celebrated keys, the
  same auth shape as the other kid routes.

All reads fail soft before the migration lands, the way the rest of the app
does.

## Not in scope now

- The bulk log a week fridge total (separate, later).
