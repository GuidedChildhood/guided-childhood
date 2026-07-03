-- Guided Childhood — Migration 022
-- Email system support. email_log makes every lifecycle send idempotent:
-- one row per user per email key, so the daily cron can never double
-- send. Weekly digests use a dated key (digest-2026-28). email_opt_out
-- on profiles is the one switch the unsubscribe link flips.

create table if not exists public.email_log (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  email_key  text        not null,
  sent_at    timestamptz not null default now(),
  unique(user_id, email_key)
);

create index if not exists idx_email_log_user
  on public.email_log(user_id);

alter table public.email_log enable row level security;

-- Written only by the service role (cron and server routes). Users can
-- see their own send history, nothing else.
create policy "Users can view their own email log"
  on public.email_log
  for select
  using (auth.uid() = user_id);

alter table public.profiles
  add column if not exists email_opt_out boolean not null default false;
