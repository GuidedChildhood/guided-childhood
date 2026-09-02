-- Planter Friends, slice 1: the garden save and its ledger.
--
-- Design: plans/planter-friends-architecture.md (section 1.3, where the
-- state lives). Justin, 2 September 2026: "let's go ahead."
--
-- One JSON document per child is the whole save. The toy's rules (energy,
-- cooldowns, growth, the night) are pure functions in lib/planter/logic.ts
-- that the server runs against its own clock, so the document is what the
-- server last decided, never what a device claimed. Versioned so two tabs on
-- one child's phone cannot overwrite each other.
--
-- The ask column carries the one door every locked state has (Ask my grown
-- up): pending, then approved or declined by the parent from AskPopup. It
-- lives on the garden row rather than in its own table because there is at
-- most one at a time and the parent's feed already reads one row per child.
--
-- Both tables cascade from children and from auth.users, so an erased family
-- takes its gardens with it and the deletion promise stays true.

create table if not exists public.planter_gardens (
  child_id uuid primary key references public.children(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  state jsonb not null,
  version integer not null default 1,
  ask jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists planter_gardens_user_idx
  on public.planter_gardens (user_id);

alter table public.planter_gardens enable row level security;

drop policy if exists "Own gardens" on public.planter_gardens;
create policy "Own gardens" on public.planter_gardens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Append only. What happened and when, on the server's clock: a nap started,
-- a rest closed, sunshine caught, the night applied, an ask sent and
-- answered. The state above is derived; this is the record.
create table if not exists public.planter_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists planter_events_child_idx
  on public.planter_events (child_id, created_at desc);

alter table public.planter_events enable row level security;

drop policy if exists "Own planter events" on public.planter_events;
create policy "Own planter events" on public.planter_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
