-- Guided Childhood — Migration 033
-- Daily star goal. Alongside the weekly prize, a family can set a daily
-- star target. Hit it and the day is complete: the child sees it on
-- their quest page, the parent sees it on the quest board.

alter table public.star_goals add column if not exists daily_stars int;
