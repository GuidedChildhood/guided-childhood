-- Guided Childhood — Migration 223
-- Three tier star time: core, earned, protected.
--
-- Approved by Justin, 26 August 2026. Plan: plans/week-of-2026-08-26-star-tiers-plan.md
-- Evidence base: content/packs/2026-08-26-star-system-evidence/rewards-evidence.md
--
-- Pillar 4 changes from "earned, not granted" to a small guaranteed baseline,
-- everything else earned, and some time no stars can buy. This migration is
-- the schema only. Enforcement in the timer paths and the child and parent UI
-- ship with the phase 1 build; nothing reads this table yet, so applying it
-- changes no behaviour for any family.
--
-- One row per child. Existing children are seeded so the parent facing
-- controls have a row to edit when the settings card ships:
--   core_minutes_daily 0   — unconditional daily recreation stays off until
--                            the parent turns it on, so no family sees a
--                            change they did not choose.
--   bedtime by age band    — 4 to 7: 19:00 to 07:00, 8 to 10: 20:00 to 07:00,
--                            11 to 13: 21:00 to 07:00, 13 to 15: 22:00 to
--                            07:00, 16+: null (no default window). Parent
--                            adjustable. Null means no bedtime window.
--   protect_mealtimes and protect_school_hours default off; the advisory
--   windows they switch on live in app code, not here.

create table if not exists public.child_time_settings (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  child_id             uuid not null references public.children(id) on delete cascade,
  core_minutes_daily   int not null default 0 check (core_minutes_daily between 0 and 240),
  bedtime_start        time,
  bedtime_end          time,
  protect_mealtimes    boolean not null default false,
  protect_school_hours boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (child_id)
);

alter table public.child_time_settings enable row level security;
create policy "child_time_settings_own" on public.child_time_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed a row for every existing child with the age band bedtime default.
-- Idempotent: a child who already has a row keeps it untouched.
insert into public.child_time_settings (user_id, child_id, bedtime_start, bedtime_end)
select
  c.parent_id,
  c.id,
  case c.age_band
    when '4-7'   then time '19:00'
    when '8-10'  then time '20:00'
    when '11-13' then time '21:00'
    when '13-15' then time '22:00'
    else null
  end,
  case c.age_band
    when '4-7'   then time '07:00'
    when '8-10'  then time '07:00'
    when '11-13' then time '07:00'
    when '13-15' then time '07:00'
    else null
  end
from public.children c
on conflict (child_id) do nothing;

create index if not exists idx_child_time_settings_user on public.child_time_settings (user_id);

-- ── The build columns, from the phase 1 build (PR 908) ──────────────────────
-- The reconciliation PR 907 landed the table and the seed above; the build
-- reads and writes these three columns as well. All idempotent, and already
-- applied to the live database on 26 August 2026.

-- Which part of a session the core baseline paid for, mirroring
-- holiday_minutes from migration 128. Zero on every existing row, which is
-- also the honest answer: nothing before this could have drawn from core.
alter table public.device_sessions add column if not exists core_minutes int not null default 0;

-- A parent granted session that ran inside a protected window. The parent is
-- always the override, this only lets the weekly review name it gently.
alter table public.device_sessions add column if not exists in_protected_window boolean not null default false;

-- The Dr Becky layer, phase 2 of the same plan: a family job carries no stars
-- because contribution is belonging, not payment. The flag lands now so the
-- claim is spent in one migration, the UI and bank exclusion follow in the
-- phase 2 build.
alter table public.family_quests add column if not exists is_family_job boolean not null default false;
