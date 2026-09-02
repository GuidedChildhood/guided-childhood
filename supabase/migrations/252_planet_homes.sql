-- Planet Friends, slice 1, the proper take.
--
-- Migration 251 created planter_gardens and planter_events for a garden toy
-- that should never have been a garden: the brief said "Planter Friends" and
-- Justin, 2 September 2026: "it's not Planter Friends, it's Planet Friends
-- ... the cast we have as Planet Friends, already designed, and planets not
-- gardens ... give it a full rebuild." 251 is applied in production and both
-- of its tables are empty (checked 2 September 2026, 0 rows), so they are
-- dropped here and the planet tables take their place under their right
-- names. Design: plans/planet-friends-architecture.md.
--
-- One JSON document per child is the whole save: the child's home planet,
-- the Planet Friends on it, their starlight, their rests, and the planet's
-- growth. The rules are pure functions in lib/planet/logic.ts that the server
-- runs against its own clock, so the document is what the server last
-- decided, never what a device claimed. The ask column carries the one door
-- every locked state has (Ask my grown up). Both tables cascade from children
-- and auth.users, so an erased family takes its planets with it.

drop table if exists public.planter_events;
drop table if exists public.planter_gardens;

create table if not exists public.planet_homes (
  child_id uuid primary key references public.children(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  state jsonb not null,
  version integer not null default 1,
  ask jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists planet_homes_user_idx
  on public.planet_homes (user_id);

alter table public.planet_homes enable row level security;

drop policy if exists "Own planet homes" on public.planet_homes;
create policy "Own planet homes" on public.planet_homes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Append only. What happened and when, on the server's clock: a Friend went
-- to its pod, sunshine was caught, a rest closed, the night landed, an ask
-- was sent and answered. The state above is derived; this is the record.
create table if not exists public.planet_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists planet_events_child_idx
  on public.planet_events (child_id, created_at desc);

alter table public.planet_events enable row level security;

drop policy if exists "Own planet events" on public.planet_events;
create policy "Own planet events" on public.planet_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
