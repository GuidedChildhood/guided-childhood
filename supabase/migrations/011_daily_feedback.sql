-- 011_daily_feedback.sql
-- Add moment feedback to daily sessions so the next day's card can be personalised

ALTER TABLE public.daily_sessions
  ADD COLUMN IF NOT EXISTS moment_feedback jsonb NOT NULL DEFAULT '[]';
