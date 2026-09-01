-- The kind of day a completed day was (connect, lesson, digi, passport).
--
-- The rotation itself is derived, never stored: lib/pathway/day-focus.ts
-- computes today's focus from the count of completed days before today, so
-- two devices agree with nothing written on read. This column is the RECORD,
-- stamped when the day completes, so reporting can ask what kinds of days a
-- family actually finishes without re-deriving history.

set lock_timeout = '3s';

alter table public.daily_sessions
  add column if not exists focus text;
