-- Guided Childhood — Migration 135
--
-- One row per school reminder per day, so the hour before alert fires once.
--
-- Justin: a school alert with a time should "give a alert PWA and dashboard
-- about an hour before time set if time".
--
-- The day granularity reminders already existed and needed no guard: the
-- evening cron runs once at 18:00 and the morning one once at 06:45, so each
-- can only fire once by virtue of when it runs. An hour before is different.
-- It has to run often enough to be accurate to the hour, which means the same
-- reminder falls inside its window on more than one tick, and a child's phone
-- buzzing four times about Cubs is worse than not being told at all.
--
-- Keyed on the date rather than the row because a weekly routine IS one row
-- that comes round every week. Cubs every Tuesday must alert this Tuesday and
-- again next Tuesday, and exactly once each time, which a flag on the action
-- itself cannot express.
--
-- No RLS policy on purpose. Only the cron writes here, with the service key,
-- which bypasses RLS. Nothing in the app has any reason to read it, and a
-- table with no policy is closed to every client by default.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.school_alert_sent (
  id         uuid        primary key default gen_random_uuid(),
  action_id  uuid        not null references public.school_actions(id) on delete cascade,
  -- The London date the alert was for, not the timestamp it was sent.
  on_date    date        not null,
  created_at timestamptz not null default now(),
  -- The whole safety of the thing, the same way holiday_allowance and
  -- sticker_credits do it: enforced here rather than by remembering to check.
  unique (action_id, on_date)
);

create index if not exists idx_school_alert_sent_date
  on public.school_alert_sent (on_date);

alter table public.school_alert_sent enable row level security;
