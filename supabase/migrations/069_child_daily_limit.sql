-- Guided Childhood — Migration 069
-- A per child daily screen time limit the parent can set. Null means use the
-- age based recommendation (the healthy guide) as the limit. When set, the
-- child's app shows used against this number and never offers more than it, so
-- earned stars can bank up but a day's screen never runs past the agreed cap.

set lock_timeout = '3s';

alter table public.children add column if not exists daily_limit_minutes int;
