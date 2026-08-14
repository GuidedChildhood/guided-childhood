-- Stamp first_checkin_at for families who were already checking in before the
-- column had anything writing to it.
--
-- Justin, 13 August 2026: "I cannot see the check in is done properly."
--
-- ── WHY IT COULD NEVER LOOK DONE ────────────────────────────────────────────
--
-- profiles.first_checkin_at only started being written today, by
-- markFirstCheckIn, called from /api/daily/concern-check and
-- /api/wellbeing/checkin. Anybody who had been checking in BEFORE that was
-- left holding a null, because nothing backfilled the history that already
-- existed. Justin's own account has 27 scored concern_events going back weeks
-- and a null stamp.
--
-- That one null decides four things, and every one of them reads wrong:
--
--   1  getTodayLoop treats a null as never checked in, and a never checked in
--      family is NEVER done: `done: neverCheckedIn ? false : ...`. So the
--      check in node on Today could not go green no matter how many check ins
--      were completed. That is exactly what Justin was looking at.
--   2  The same flag labels the step "Where things are now", the baseline
--      framing, for a family who has been running for weeks.
--   3  It puts the meet DiGi rung on the road as though it were day one.
--   4  lib/access.ts gates the two door subscription block on it, so the ask
--      was being held back from an account that had long since earned it.
--
-- ── WHAT THIS SETS IT TO ────────────────────────────────────────────────────
--
-- The earliest scored concern_event, because that IS the first check in. Not
-- now(), which would claim they started today and make every later reading
-- look like it came from a family with no history, and not the account
-- creation date, which is when they signed up rather than when they first
-- answered anything.
--
-- Only ever fills a NULL. An existing stamp is a real record and is never
-- touched, so this is safe to run twice and safe to run late.

update profiles p
set first_checkin_at = e.first_scored
from (
  select user_id, min(created_at) as first_scored
  from concern_events
  where score is not null
  group by user_id
) e
where e.user_id = p.id
  and p.first_checkin_at is null;
