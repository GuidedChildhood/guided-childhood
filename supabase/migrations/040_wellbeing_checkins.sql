-- Guided Childhood — Migration 040
-- The monthly wellbeing check in. Once a month the parent tells us how the
-- family has been: how they themselves are doing, what has got better since
-- last time, and anything new that has come up. This is the mission made
-- real, the parent's own wellbeing tracked over time, not just the child's,
-- and it reuses the same concern language as the starter quiz so it always
-- catches up with the family. One row per check in; the latest is the current
-- picture, the history is the trend.

create table if not exists public.wellbeing_checkins (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  -- How the parent is doing this month, 1 (a real struggle) to 5 (good).
  parent_mood  smallint,
  -- Concerns that have improved since last time, and anything new, as the
  -- same slugs the starter quiz uses.
  fixed        jsonb not null default '[]'::jsonb,
  new_concerns jsonb not null default '[]'::jsonb,
  note         text,
  created_at   timestamptz not null default now()
);

alter table public.wellbeing_checkins enable row level security;

-- A parent reads and writes only their own check ins.
drop policy if exists "own wellbeing checkins" on public.wellbeing_checkins;
create policy "own wellbeing checkins" on public.wellbeing_checkins
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists wellbeing_checkins_user_idx
  on public.wellbeing_checkins (user_id, created_at desc);
