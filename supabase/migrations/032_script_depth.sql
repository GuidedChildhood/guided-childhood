-- Guided Childhood — Migration 032
-- Longer scripts. Three new fields on the scripts table:
--   if_they_push_back  what to say when the child argues or resists
--   check_back         how to follow up later in the week
--   for_your_child     a short note written for the child, sent from the
--                      parent's own Messages app, never from us
-- All three are generated once by DiGi on first view and stored here,
-- because scripts live in the database, never hardcoded in the app.

alter table public.scripts add column if not exists if_they_push_back text;

alter table public.scripts add column if not exists check_back text;

alter table public.scripts add column if not exists for_your_child text;
