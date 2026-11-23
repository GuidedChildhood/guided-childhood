-- Scripts that reach a parent at the moment (Justin, 18 November 2026).
-- Plan: plans/2026-11-18-scripts-system.md.
--
-- Two small tables.
--
-- script_pins: "My scripts", up to five a parent keeps to hand. Shown first on
-- the scripts page and on Home. The five is enforced in the route, not here,
-- so a parent who somehow has six loses nothing.
--
-- script_nudges: every script reminder sent to a parent, so the cap holds
-- (at most two a week, never two in a day; Justin chose two a week) and so the
-- next morning "did it work" has something to answer. kind is where it came
-- from: timer_end (the parent's screen timer ran out) or weekly (the words for
-- this week, from the worry they raised). worked is the one tap answer.
--
-- Both are the parent's own rows. Pins are read and written by the parent's
-- session; nudges are written by the server (service role) and read and
-- answered by the parent.

create table if not exists public.script_pins (
  user_id uuid not null references auth.users(id) on delete cascade,
  script_sort_order integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, script_sort_order)
);

alter table public.script_pins enable row level security;

create policy "Parents manage their own pinned scripts" on public.script_pins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, delete on public.script_pins to authenticated;
grant all on public.script_pins to service_role;
revoke all on public.script_pins from anon;

create table if not exists public.script_nudges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  script_sort_order integer not null,
  kind text not null check (kind in ('timer_end', 'weekly')),
  sent_at timestamptz not null default now(),
  worked text check (worked in ('worked', 'sort_of', 'not_this_time')),
  answered_at timestamptz
);

create index if not exists script_nudges_user_sent on public.script_nudges (user_id, sent_at desc);

alter table public.script_nudges enable row level security;

create policy "Parents read their own script nudges" on public.script_nudges
  for select using (auth.uid() = user_id);

create policy "Parents answer their own script nudges" on public.script_nudges
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, update on public.script_nudges to authenticated;
grant all on public.script_nudges to service_role;
revoke all on public.script_nudges from anon;
