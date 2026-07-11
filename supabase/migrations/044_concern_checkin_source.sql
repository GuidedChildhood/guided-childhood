-- Guided Childhood — Migration 044
-- The monthly wellbeing check in asks a parent what is new and what has got
-- better, in the same concern language as the starter quiz. Until now those
-- answers were saved to wellbeing_checkins but never reached the concerns
-- ledger, so a worry a parent raised only in the monthly check in was invisible
-- to DiGi and the daily follow up. This widens the ledger's source check so a
-- concern can be sourced from a check in, exactly like a moment, a script, a
-- Right Now rescue or a DiGi chat.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons in literals.

alter table public.concerns drop constraint if exists concerns_source_check;

alter table public.concerns add constraint concerns_source_check
  check (source in ('moment', 'script', 'digi', 'rightnow', 'checkin'));
