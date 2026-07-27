-- Guided Childhood — Migration 066
-- The Sunday wellbeing check in. Once a week DiGi asks the parent how they are,
-- what went well, what was hardest, and what they want next week to feel like,
-- then hands back a short agreed plan grounded in the evidence. It reuses the
-- monthly wellbeing_checkins table (parent mood plus the concern ledger already
-- wired to it) and adds the weekly cadence and the agreed plan, so the plan can
-- sit on Home all week and the Friday round up can report back on it.

alter table public.wellbeing_checkins add column if not exists week_start date;
alter table public.wellbeing_checkins add column if not exists went_well jsonb not null default '[]'::jsonb;
alter table public.wellbeing_checkins add column if not exists focus text;
alter table public.wellbeing_checkins add column if not exists plan jsonb not null default '[]'::jsonb;
alter table public.wellbeing_checkins add column if not exists plan_agreed boolean not null default false;

-- One weekly check in per parent per week, so the Sunday save upserts onto the
-- same row. Postgres treats null as distinct in a unique index, so the monthly
-- check ins written before this migration (null week_start) never collide and
-- the history is untouched. A plain unique index (not partial) so the upsert on
-- (user_id, week_start) matches a real constraint.
create unique index if not exists wellbeing_checkins_week_unique
  on public.wellbeing_checkins (user_id, week_start);
