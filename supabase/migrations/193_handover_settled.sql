-- Guided Childhood — Migration 193
--
-- WHEN THE FAMILY SAID NO, SO WE CAN STOP ASKING AND ASK AGAIN ONCE.
--
-- Justin, 14 August 2026: "if a parent selects that they want to co view and
-- use printable star charts instead of share device we don't want to keep
-- telling them to share or set up child device. But later in we just need to
-- make them aware when they get a phone that we can share child's app."
--
-- Two requirements in one sentence, and the product could satisfy neither.
--
-- WHY IT COULD NOT STOP ASKING. Three columns already record something close
-- to this answer and none of them is read by more than a handful of surfaces:
--
--   children.no_phone        (migration 105) read in exactly ONE file
--   children.use_mode        (migration 059) read for display in three
--   profiles.handover_choice (migration 103) read in exactly one page
--
-- Meanwhile fourteen separate surfaces ask the parent to set up the child's
-- device: a setup step, a welcome card, a coverage card on Home, a push from
-- the settings nudge cron, a day fourteen email, the agreement banner, the
-- passport TO DO line, the stage readiness block, two cards in the jobs
-- manager and the quests banner. Not one of them consults no_phone or
-- handover_choice. A parent who tapped "has no phone" silenced ONE card and
-- kept every other nag, including a push notification to their own phone.
--
-- WHY IT COULD NOT ASK AGAIN EITHER, which is the half that needed a column.
-- Nothing recorded WHEN the family decided. no_phone is a bare boolean and
-- handover_choice is a bare text. Justin's "later in" has to be measured from
-- something, and there was nothing to measure from. Without a timestamp the
-- only available re-offer is "always" or "never", and the whole point is that
-- it is neither.
--
-- SO: one timestamp per child, set at the moment the parent says no.
--
-- It is deliberately NOT a fourth way of saying no. lib/handover/settled.ts
-- reads the three existing flags and this is only the clock beside them,
-- because a fourth flag disagreeing with the other three is exactly how this
-- got into its current state.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.children
  add column if not exists no_phone_at timestamptz;

-- Backfill for the families who already tapped it. Their real answer date is
-- lost, so this uses created_at rather than now(): dating the decision to the
-- day the child was added is wrong by at most the account's own age, whereas
-- now() would restart every one of their clocks today and mean nobody who has
-- already decided gets re-offered until a full interval has passed all over
-- again. Erring early costs one gentle card. Erring late costs a family with a
-- newly phoned teenager never being told their child's app exists.
update public.children
  set no_phone_at = created_at
  where no_phone = true and no_phone_at is null;

-- The re-offer reads (no_phone, no_phone_at) together for the whole family in
-- one go on Home, so it is worth the index on a table this hot.
create index if not exists idx_children_no_phone_at
  on public.children (parent_id, no_phone_at)
  where no_phone = true;
