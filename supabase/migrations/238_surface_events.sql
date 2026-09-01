-- ────────────────────────────────────────────────────────────────────────────
-- 238 · surface_events: the habit loop's memory of what was actually seen
--
-- Justin, 1 September 2026: "this all needs to hook in to gather data to
-- learn." The product already keeps rich per surface ledgers (completions,
-- statuses, quiz passes), but nothing records that a thing was merely SHOWN
-- or opened and walked past, so the recommenders rank on what families did
-- and are blind to what they declined. This is that missing stream: one thin
-- uniform table of (surface, item, event, day), per child, written by the
-- surfaces themselves.
--
-- The first consumer ships with it: the top five scripts shelf records a
-- 'shown' per pick per day, and the recommender demotes a script shown for
-- three separate days and never opened, so the shelf turns toward fresh
-- choices instead of repeating an ignored one. More readers follow as data
-- accrues; the table is the contract.
--
-- Deliberately NOT third party analytics: our tables, our rules, and only
-- events that feed a decision the product makes for this family.
-- ────────────────────────────────────────────────────────────────────────────

set lock_timeout = '3s';

create table if not exists public.surface_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid references public.children(id) on delete cascade,
  -- Which shelf: 'script' | 'moment' | 'lesson' | 'digi' | 'path'. Text, not
  -- an enum, because surfaces are added more often than migrations should be.
  surface text not null,
  -- Which thing on it: a script sort_order, a lesson id, a rung key.
  item text not null,
  -- What happened to it: 'shown' | 'opened' | 'read' | 'completed'.
  event text not null,
  -- The London day, so shown once a day means once a DAY and two devices
  -- agree, matching every other daily fact on the platform.
  day date not null,
  created_at timestamptz not null default now()
);

-- One 'shown' per (family, child, surface, item, day): the shelf renders on
-- every visit and an impression is a fact about the day, not about the visit
-- count. coalesce folds the no child household case into the same key.
create unique index if not exists idx_surface_events_daily
  on public.surface_events (user_id, coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid), surface, item, event, day);

-- The recommender reads a family's recent events newest first.
create index if not exists idx_surface_events_user_day
  on public.surface_events (user_id, day desc);

alter table public.surface_events enable row level security;

drop policy if exists "Own surface events" on public.surface_events;
create policy "Own surface events"
  on public.surface_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.surface_events is
  'What each surface actually put in front of a family and what became of it: shown, opened, read, completed, per child per London day. The habit loop''s learning stream; the recommenders read it so what a family declines shapes what is offered next.';
