-- Guided Childhood — Migration 058
-- Device time trust that grows with age. Each child carries a trust level for
-- starting their own screen time:
--   ask     the child's start becomes a request the parent approves first
--   watch   the child starts freely, the parent gets the push and countdown
--   trusted the child starts freely, a lighter touch, no per session ping
-- Younger children lean to ask, older ones earn watch then trusted. Default is
-- watch, today's behaviour, so nothing changes until a parent sets it.
--
-- device_requests holds the ask-first queue: a pending ask the parent sees on
-- the screen time card and approves in one tap, which starts the timer.

alter table public.children add column if not exists device_trust text not null default 'watch'
  check (device_trust in ('ask', 'watch', 'trusted'));

create table if not exists public.device_requests (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid not null references public.children(id) on delete cascade,
  device     text not null check (device in ('phone', 'tablet', 'tv', 'console')),
  minutes    int not null check (minutes between 1 and 600),
  status     text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now()
);
create index if not exists idx_device_requests_user on public.device_requests (user_id, status, created_at desc);
alter table public.device_requests enable row level security;
create policy "Users manage own device requests" on public.device_requests for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
