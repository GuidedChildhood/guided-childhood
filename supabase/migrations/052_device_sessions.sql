-- Guided Childhood — Migration 052
-- Device time sessions. A child spends earned stars as real minutes on an
-- agreed device (phone, tablet, TV, console). Starting a session records
-- the spend against the star bank straight away and sets a countdown that
-- both the child and the parent can watch; when the time is up the child's
-- app sounds the alarm and stops. Stopping early trims the spend back to
-- the minutes actually used, so nothing is wasted.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.device_sessions (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  device     text        not null check (device in ('phone', 'tablet', 'tv', 'console')),
  minutes    int         not null check (minutes between 1 and 600),
  stars      int         not null check (stars between 0 and 2000),
  spend_id   uuid        references public.star_spends(id) on delete set null,
  status     text        not null default 'active' check (status in ('active', 'ended')),
  started_at timestamptz not null default now(),
  ends_at    timestamptz not null,
  ended_at   timestamptz
);

create index if not exists idx_device_sessions_child on public.device_sessions (child_id, status, ends_at desc);

alter table public.device_sessions enable row level security;

drop policy if exists "device_sessions_own" on public.device_sessions;

create policy "device_sessions_own" on public.device_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
