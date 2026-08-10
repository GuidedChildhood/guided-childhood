-- Guided Childhood — Migration 182
-- School time or home life, stored on the reminder.
--
-- Justin, 10 August 2026, from Teo's phone: a Show and tell weekly routine
-- firing red at 13:38 on Monday 10 August, mid summer holidays. "we need to
-- know if it's school time reminders or home life reminders."
--
-- runs_in_holidays false is a school time reminder: its weekly routine holds
-- back during the school holidays (lib/learning/holidays decides when those
-- are, per the family's region). True is a home life reminder, a club that
-- runs all year, and keeps going. Dated one offs are never held either way,
-- because a date typed in the holidays was typed on purpose.
--
-- The default is false on purpose: this table is the school diary, so the
-- truthful backfill for every existing routine is school time, which fixes
-- the August Show and tell without anybody editing anything.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements only.

alter table public.school_actions
  add column if not exists runs_in_holidays boolean not null default false;
