-- Guided Childhood — Migration 168
--
-- Remembering when a parent was last here, so the app can tell them what has
-- happened since.
--
-- Justin, 8 August 2026: "quick note that this does not come boring for parents
-- each day and it work is they log in time to time and how we keep them coming
-- back to feel they are getting real use, feedback, enjoyment, seeing their
-- child progress."
--
-- The honest problem with the home page today is that it is a to do list. Three
-- tasks, and it resets every day whether or not anybody came. A parent who opens
-- it on Tuesday having last looked on Friday is shown the same three jobs they
-- were shown on Friday, with no acknowledgement that four days went by or that
-- their child did anything in them. The app asks and never reports back.
--
-- Meanwhile the child HAS been doing things: ticking jobs, finishing days,
-- handing in printables, bringing Planet Friends home. All of it is already in
-- the database and none of it is ever shown as news.
--
-- So: two timestamps, which is all it takes to turn a checklist into a
-- newspaper.
--
--   home_last_at       every time they load home. The heartbeat.
--   home_catchup_from  the point the "while you were away" summary counts from.
--
-- Rolling one and not the other is the whole trick. A refresh, or coming back
-- ten minutes later, must not wipe the card they were reading, so
-- home_catchup_from only moves when a genuine gap has passed and the previous
-- visit is over. Everything between that mark and now is news.
--
-- Both nullable, and null means "no summary yet", which is right for an account
-- that has never loaded home: there is nothing to have missed.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.profiles
  add column if not exists home_last_at timestamptz;

alter table public.profiles
  add column if not exists home_catchup_from timestamptz;

comment on column public.profiles.home_last_at is
  'Last time this parent loaded the home page. Updated on every load.';

comment on column public.profiles.home_catchup_from is
  'The point the while you were away summary counts from. Only rolls forward when a real gap has passed, so a refresh does not wipe the card mid read.';
