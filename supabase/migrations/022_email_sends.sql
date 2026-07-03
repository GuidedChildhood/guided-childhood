-- Guided Childhood — Migration 022
-- Records every email the app has sent per user so the drip sequence and
-- the weekly digest can never double send. email_key is the drip step
-- (day0, day2, day4, day7) or the digest week (digest-2026-07-06).
-- Written only by the service role from API routes; users can read their
-- own rows but never write them.

create table if not exists public.email_sends (
  id        uuid        primary key default uuid_generate_v4(),
  user_id   uuid        not null references auth.users(id) on delete cascade,
  email_key text        not null,
  sent_at   timestamptz not null default now(),
  unique(user_id, email_key)
);

create index if not exists idx_email_sends_user
  on public.email_sends(user_id, sent_at desc);

alter table public.email_sends enable row level security;

create policy "Users can read their own email log"
  on public.email_sends
  for select
  using (auth.uid() = user_id);
