-- Guided Childhood — Migration 035
-- The Duolingo tactic: when a parent has gone quiet, one fun DiGi voiced
-- nudge a day, never more, tracked so nobody gets pinged twice for the
-- same quiet spell.

alter table public.profiles add column if not exists last_reengage_push_at timestamptz;
