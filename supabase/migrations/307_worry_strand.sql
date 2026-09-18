-- Guided Childhood, Migration 307
--
-- THE STRAND: one record per worry of what has been tried, and what the
-- rating did afterwards.
--
-- Justin, 18 September 2026, approving the shape: "a record per worry of what
-- has been tried and what the reading did afterwards, an ordered bank of
-- approaches drawn from the research already in expert_knowledge, and the
-- existing twice a week cap kept so it never turns into nagging."
--
-- ── WHAT WAS ALREADY THERE, AND WHY IT WAS NOT ENOUGH ───────────────────────
--
-- digi_outcomes has held one row per delivered suggestion since 147, and 154
-- gave it concern_id so a verdict could be counted back to the worry it was
-- about. Read live on 18 September 2026: 6 rows, 0 with a concern_id, 0
-- answered. The column was never written. The one writer, the followups cron,
-- copies moment_id across and drops concern_id, so the per worry thread has
-- been a column with no value in it for a month.
--
-- Two things are still missing even once it is written.
--
-- 1. WHICH APPROACH. A suggestion is free text DiGi wrote that day, so two
--    suggestions can be the same idea in different words and nothing can tell.
--    approach is the key of the research finding the suggestion came from, so
--    the bank can be walked in order and nothing gets offered twice.
--
-- 2. WHAT THE RATING DID. The parent's verdict is the honest half and it is
--    still only one half: "it worked" and a worry still sitting at two stars
--    are both true at once, and the band is the thing the product actually
--    reports on. band_at_suggestion is the band when the suggestion was made,
--    band_after is the band when the verdict landed. Bands, never raw scores,
--    the rule review.md section 4a holds everywhere else.
--
-- Bands are 1 to 5, ceil(score / 2), the same arithmetic as everywhere else.
-- Null means we did not know, which is different from zero and must stay so.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

alter table public.digi_followups
  add column if not exists approach text;

alter table public.digi_followups
  add column if not exists band_at_suggestion smallint;

alter table public.digi_outcomes
  add column if not exists approach text;

alter table public.digi_outcomes
  add column if not exists band_at_suggestion smallint;

alter table public.digi_outcomes
  add column if not exists band_after smallint;

comment on column public.digi_followups.approach is
  'Key of the research finding this suggestion came from, as ek:<expert_knowledge id>. Null when the suggestion came from somewhere else.';

comment on column public.digi_followups.band_at_suggestion is
  'The worry band, 1 to 5, at the moment the suggestion was made. Null when no worry was named or it had never been scored.';

comment on column public.digi_outcomes.approach is
  'Copied from the follow up when the card is delivered, so a verdict is attached to an approach and not only to the words of one suggestion.';

comment on column public.digi_outcomes.band_at_suggestion is
  'The worry band when the suggestion was made, copied from the follow up.';

comment on column public.digi_outcomes.band_after is
  'The worry band when the parent answered. Written beside the verdict, so what the rating did can be read next to what the parent said.';

-- What has already been tried for one worry, which is the read on every chat
-- turn that names a live concern.
create index if not exists digi_outcomes_strand_idx
  on public.digi_outcomes (user_id, concern_id, created_at desc)
  where concern_id is not null;
