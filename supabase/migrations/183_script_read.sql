-- Guided Childhood — Migration 183
-- Reading a script through counts on the pathway.
--
-- Justin, 10 August 2026, twice: "it doesn't update if I read it", and then
-- "once read through needs to update pathway."
--
-- ── What this changes, and the argument it settles ───────────────────────────
--
-- Migration 157 split opening a script from finishing one, for a good reason: a
-- parent who scrolled through ten scripts came back to ten ticks and a passport
-- that disagreed with every one of them. Opening has counted for nothing since,
-- and the only way to move the pathway was to tap "we used this" or "not needed".
--
-- Justin has asked twice for reading to count. He is right that the rule as
-- built is invisible: a parent reads a whole script, goes back, and nothing has
-- moved, with nothing on screen having said it would not.
--
-- So there are THREE states now, not two, and the middle one is the new one:
--
--   opened  the page was rendered. Still worth nothing. A glance is a glance.
--   read    they reached the END of the script. Counts on the pathway.
--   used    they had the conversation. Counts, and retires the script.
--
-- Read is not the same as opened and that distinction is the whole migration.
-- It is written by reaching the last block of the reader, not by arriving, so
-- browsing ten scripts still counts for nothing and 157's reasoning survives
-- intact. What changes is that finishing one is now a thing the product can see.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

alter table public.script_completions
  drop constraint if exists script_completions_status_check;

alter table public.script_completions
  add constraint script_completions_status_check
  check (status in ('opened', 'read', 'used', 'not_needed'));

comment on column public.script_completions.status is
  'opened = the page was rendered and counts for nothing. read = they reached the end of the script, counts on the pathway. used = they had the conversation, counts and retires it. not_needed = set aside until not_needed_until.';
