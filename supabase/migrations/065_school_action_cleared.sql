-- Guided Childhood — Migration 065
-- Clearing a weekly school routine for today, without deleting it. A PE kit
-- every Thursday is a standing reminder: once a parent has sorted this week's,
-- they clear it for today and it steps back until next Thursday, rather than
-- being removed for good (Remove still does that). cleared_on holds the last
-- date a recurring action was cleared, so the surfaces that show it today
-- (the bell, the child's banner) know to hold it back for the rest of the day.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside
-- strings, flat statements only.

alter table public.school_actions
  add column if not exists cleared_on date;
