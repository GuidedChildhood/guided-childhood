-- The whole road walked, not just the one tick.
--
-- Justin, 11 September 2026: "one tick keeps the streak, the pathway earns the
-- celebration."
--
-- daily_sessions.completed_at has meant "the lead rung landed" since the
-- rotation, and roughly a dozen readers depend on that: the streak, the focus
-- cycle, the close screen's count of days. None of them change here.
--
-- This column is the second, stricter fact: every rung on today's road went
-- green. Only the celebration and the tick by the child's name read it, so a
-- ten minute day still keeps the flame and only a finished day is called
-- finished.
--
-- Nullable on purpose. A row with completed_at and no all_done_at is exactly
-- the common case: the day counted, the road was not finished.

set lock_timeout = '3s';

alter table public.daily_sessions
  add column if not exists all_done_at timestamptz;

comment on column public.daily_sessions.all_done_at is
  'When every rung on that day''s road went green. completed_at is the one tick that keeps the streak; this is the whole pathway, which is what earns the celebration and the tick by the child''s name.';
