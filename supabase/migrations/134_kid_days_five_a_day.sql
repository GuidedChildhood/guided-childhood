-- Guided Childhood — Migration 134
--
-- Five things a day, on the child's own app, and the streak that comes from
-- doing all five.
--
-- Justin: "make it 5 steps per day ... once the system knows they sent a job, a
-- big celebration animation and 1 streak achieved ... clear 5 streaks equals
-- stickers of older friends ... this is to encourage offline tasks and can earn
-- extra minutes for weekend."
--
-- Why this needs a table at all, rather than deriving the day on each read:
--
--   1. The five must be CHOSEN ONCE. Two of them rotate from a pool so the day
--      is not identical, and if they were picked fresh on every render a child
--      could refresh a half finished day into a different one. The pick is
--      deterministic (seeded by child and date, lib/kid/five-a-day.ts), so this
--      row is really a record of what was shown, which is the thing that has to
--      survive a pool change or a lesson being completed mid day.
--
--   2. A streak has to be PROVABLE. "All five done" is a claim about a day that
--      has passed, and nothing else in the product records the shape of a
--      child's day. Without this row, five streaks earning a squad friend would
--      rest on a number recomputed from data that has since moved.
--
-- streak_awarded exists separately from completed_at on purpose. A day can be
-- complete and its reward not yet granted, and the two must not be inferred from
-- each other, or a retry of the reward job double counts.

create table if not exists public.kid_days (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  child_id       uuid        not null references public.children(id) on delete cascade,
  -- The day in Europe/London, like every other date in the app.
  day            date        not null,
  -- The five step keys chosen, in the order they are shown.
  steps          jsonb       not null default '[]'::jsonb,
  -- The step keys finished. A subset of steps, never anything else.
  done           jsonb       not null default '[]'::jsonb,
  -- When the fifth landed. Null while the day is still open.
  completed_at   timestamptz,
  -- Whether this completed day has already been counted towards a reward.
  streak_awarded boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- One day per child, enforced here rather than by remembering to check.
  unique (child_id, day)
);

create index if not exists idx_kid_days_child on public.kid_days (child_id, day desc);
-- The streak read walks completed days backwards from today, so it wants the
-- completed ones ordered without touching the rest.
create index if not exists idx_kid_days_complete on public.kid_days (child_id, day desc) where completed_at is not null;

alter table public.kid_days enable row level security;

drop policy if exists "Parents read own kid days" on public.kid_days;
create policy "Parents read own kid days"
  on public.kid_days for select
  using (auth.uid() = user_id);

-- Written only through /api/kid/day, which authenticates with the child's link
-- token and uses the service role. There is deliberately no insert or update
-- policy for anyone else: a child marking their own steps done is the whole
-- point, and the link token is how the child app proves who it is, exactly like
-- ticking a quest.
drop policy if exists "Service role manages kid days" on public.kid_days;
create policy "Service role manages kid days"
  on public.kid_days for all
  using (auth.role() = 'service_role');

comment on table public.kid_days is
  'One row per child per day: which five steps were shown, which are done, and whether the completed day has been counted towards a reward. The pick is deterministic, so this is the record of what a child was actually shown, which is what a streak has to be proved against.';
