-- Guided Childhood — Migration 223
-- Three tier star time, approved 26 August 2026 and planned in
-- plans/week-of-2026-08-26-star-tiers-plan.md, on the evidence in
-- content/packs/2026-08-26-star-system-evidence/rewards-evidence.md.
--
-- The tiers close the gap between the philosophy and the code:
--   CORE      a small unconditional daily baseline of recreation, parent set,
--             default 0 so no existing family changes behaviour until they
--             turn it on. Draws down before stars, because it dies at
--             midnight while stars live to Monday.
--   EARNED    the existing star economy, untouched.
--   PROTECTED windows no stars can buy. A child self start inside one turns
--             into an ask (the gentle brake pattern, never a flat block), the
--             parent stays the override, and a parent granted session inside a
--             window is tagged so the weekly review can name it gently.
--
-- Per child throughout: every setting lives on the child, so siblings with
-- different ages and different bedtimes each get their own row.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.child_time_settings (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null references auth.users(id) on delete cascade,
  child_id             uuid        not null references public.children(id) on delete cascade,
  -- Unconditional daily recreation minutes. 0 means the family has not turned
  -- core time on, which keeps the launch behaviour identical to today.
  core_minutes_daily   int         not null default 0 check (core_minutes_daily between 0 and 240),
  -- The bedtime window. Null start or end means use the age band default in
  -- lib/quests/time-tiers.ts, so a new child gets a sensible bedtime without
  -- the parent doing anything. Both set to the same value disables it.
  bedtime_start        time,
  bedtime_end          time,
  protect_mealtimes    boolean     not null default false,
  protect_school_hours boolean     not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create unique index if not exists idx_child_time_settings_child on public.child_time_settings (child_id);
create index if not exists idx_child_time_settings_user on public.child_time_settings (user_id);

alter table public.child_time_settings enable row level security;

drop policy if exists "child_time_settings_own" on public.child_time_settings;

create policy "child_time_settings_own" on public.child_time_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

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
