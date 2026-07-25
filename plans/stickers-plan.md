# Sticker book build plan

The one genuinely new feature in the Passport lane. A child collects stickers
as they earn stars, finish printables and grow through the stages, and sees the
collection fill up. Everything it rides on already exists (the Planet Friend
art, the all time star total in `lib/quests/bank.ts`, the `printable_completions`
loop), so this is a contained feature, not an architecture change.

## Data

Migration 101 `earned_stickers`: one row per sticker a child has earned, keyed
by a stable `sticker_key`, unique per child, RLS on `user_id` exactly like
`printable_completions`. Once earned a sticker is permanent, so a broken streak
never takes a sticker back.

## Catalog (`lib/stickers/catalog.ts`)

- Five Planet Friends, one per stage reached (Pebble to Cosmo), using the same
  art the child meets in the app.
- Star milestones: first star, ten, twenty five, fifty, one hundred.
- Printable milestones: first sheet, five sheets.
- A seven day streak sticker.

## Earning (`lib/stickers/book.ts`)

Reconcile on read: compute what the child has earned from the real numbers
(all time stars from the bank, confirmed printables, stage from age band, the
daily streak), persist any newly earned row, and return the full book with
earned, locked and progress. Every read is idempotent and fails soft before
the migration lands, the way the printable loop does.

## Surfaces

1. The parent Passport (`/dashboard/tracker`), by the Meet the Friends intro.
   First, this session.
2. The kid path (`/k/[token]/path`), the child's own view. Fast follow, reuses
   the same lib with the admin client.

## Later

- A little celebration the first time a sticker unlocks.
- The physical fridge chart total: a parent action to log a week of offline
  stars in one go, feeding the same bank the stickers read.
