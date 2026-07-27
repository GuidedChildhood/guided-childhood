-- Guided Childhood — Migration 098
-- Lead email log. The account email_log is keyed by user_id, so it cannot
-- sequence a drip to a lead who has no account yet. This mirrors it for the
-- pre sign up teasers: one row per (email, email_key), the unique constraint
-- stopping any double send exactly like the account log does. Service role
-- only, written from the daily email cron. Best effort: a failed send deletes
-- its row so the next run retries.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.lead_email_log (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  email_key  text        not null,
  sent_at    timestamptz not null default now(),
  unique (email, email_key)
);

create index if not exists idx_lead_email_log_email on public.lead_email_log (email);

alter table public.lead_email_log enable row level security;
