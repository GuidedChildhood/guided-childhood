-- Guided Childhood — Migration 002
-- Adds category column to scripts table for the expanded script library.
-- Run in Supabase SQL Editor after 001_initial.sql.

alter table public.scripts
  add column if not exists category text;

-- Index for category filtering
create index if not exists idx_scripts_category
  on public.scripts(category, is_free, sort_order);

-- Update existing 17 scripts with sensible categories
update public.scripts set category = 'first-device'   where sort_order in (1, 2, 3);
update public.scripts set category = 'first-device'   where sort_order in (4, 5, 6);
update public.scripts set category = 'social-media'   where sort_order in (7, 8, 9);
update public.scripts set category = 'social-media'   where sort_order in (10, 11, 12);
update public.scripts set category = 'gaming'         where sort_order in (13, 14, 15);
update public.scripts set category = 'first-device'   where sort_order in (16, 17);
