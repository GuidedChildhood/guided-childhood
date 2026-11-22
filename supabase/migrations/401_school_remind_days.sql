-- Guided Childhood, migration 401
-- Early reminders for homework and deadlines (19 November 2026).
--
-- Days before the due date to send an early reminder, chosen by the parent on
-- the school card: 7 (a week before) and/or 3 (three days before). The night
-- before is always sent and is not stored here. NULL means the automatic plan
-- in lib/school/lead-up.ts; an empty array means the parent turned both off.
-- No new table, so no new grants: school_actions keeps its existing policies.

alter table public.school_actions
  add column if not exists remind_days smallint[];
