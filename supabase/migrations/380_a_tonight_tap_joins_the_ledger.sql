-- 380: a Tonight tap joins the concerns ledger.
--
-- Review board, 13 October 2026 (tonight-tap-closes-loop). The Tonight rung's
-- one tap was stored only in tonight_confirmations (migration 255), so the
-- ledger never knew a parent had put tonight's step on. What is working reads
-- concern_events.linked_type to say what a worry moved alongside, and it could
-- name the scripts, DiGi, the moments and Right now, but never the one action
-- the road asks for on a connect day.
--
-- Two values join the two check constraints migration 164 wrote inline:
--
--   event 'tried'          the parent put a step on for this worry. Not a
--                          check in: it carries no score and no answer, so
--                          every reader that filters on a score (all but two)
--                          never sees it, and the two that read every row
--                          (What is working, the monthly email) look only at
--                          linked_type and at scored or resolved rows.
--   linked_type 'tonight'  what the step was, so the page can say
--                          "alongside tonight's step".
--
-- Additive and idempotent. The code writes the row through lib/concerns/events,
-- which swallows its own errors, so before this lands the tap still saves and
-- only the ledger row is lost.

alter table public.concern_events drop constraint if exists concern_events_event_check;
alter table public.concern_events add constraint concern_events_event_check
  check (event in ('flagged', 'checked', 'resolved', 'recurred', 'reopened', 'tried'));

alter table public.concern_events drop constraint if exists concern_events_linked_type_check;
alter table public.concern_events add constraint concern_events_linked_type_check
  check (linked_type in ('script', 'lesson', 'digi', 'moment', 'rightnow', 'tonight'));
