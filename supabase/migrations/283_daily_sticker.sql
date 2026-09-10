-- Guided Childhood — Migration 283
--
-- The daily sticker: one sticker for a day where everything got done.
--
-- Justin, 10 September 2026: "daily sticker go with your idea." The idea is the
-- one written down in plans/2026-09-10-passport-daily-sticker-audit.md §17,
-- agreed before any of it was built, and this is the storage half of it.
--
-- ── WHY A COLUMN AND NOT A TABLE ────────────────────────────────────────────
--
-- A sticker is a fact about a DAY, and the day already has a row with a unique
-- (child_id, day) index on it since migration 134. Putting the award anywhere
-- else means inventing a second key for the same thing and then keeping the two
-- in step for ever. Here, the index that already exists IS the idempotency
-- guarantee: a day cannot be paid twice because a day cannot exist twice.
--
-- It sits beside streak_awarded on purpose, and it is deliberately NOT the same
-- column. Migration 134 separated "this day is complete" from "this day's reward
-- has been granted" because inferring either from the other double counts on a
-- retry. The same reasoning applies again: a day can be complete, have paid its
-- streak, and still be waiting on its sticker.
--
-- ── WHY A TIMESTAMP AND NOT A BOOLEAN ───────────────────────────────────────
--
-- streak_awarded is a boolean and that is fine for a counter. A sticker is a
-- thing a child owns and will eventually see arranged by when they got it, so
-- the day it landed is part of the object rather than metadata about it. Null
-- means not yet, which reads the same as false and carries more.
--
-- ── NO BACKFILL ─────────────────────────────────────────────────────────────
--
-- Justin, 10 September: "No live users so no need to backfill." Checked against
-- the live database before agreeing: one completed day in the whole thing.
--
-- That is a decision not to award stickers for days finished before this
-- shipped. It is NOT a reset: nothing existing is cleared, no streak is
-- disturbed, and any day already complete keeps every other reward it earned.
-- Should a real family ever turn out to have earned days before this, awarding
-- them later is one update statement and this column is where it would go.

alter table public.kid_days
  add column if not exists sticker_awarded_at timestamptz;

comment on column public.kid_days.sticker_awarded_at is
  'When the daily sticker for this day was granted. Null while unearned or unpaid. The unique (child_id, day) index is what stops it paying twice.';

-- Reading a child's stickers means asking for their awarded days newest first,
-- which is the shape the book renders in. The existing index is (child_id, day)
-- and would work; this one lets the common read skip every unawarded day
-- instead of filtering them out afterwards.
create index if not exists idx_kid_days_sticker
  on public.kid_days (child_id, sticker_awarded_at desc)
  where sticker_awarded_at is not null;
