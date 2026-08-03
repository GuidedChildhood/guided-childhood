-- Guided Childhood — Migration 153
--
-- A worry is resolved when it stayed resolved, not when somebody ticked it.
--
-- FIRST, THE THING THAT SURPRISED ME, because the next person will read the
-- passport row and assume the same wrong thing I did.
--
-- The row says "Moments to resolve". It links to /dashboard/moments. Its help
-- says "Open a moment, use the words it gives you, and mark it resolved when it
-- is done". And its number comes from a completely different table:
--
--   openMoments   = concerns where status in ('open','improving')
--   solvedMoments = concerns where status = 'resolved'
--
-- So a parent can open and complete every moment card in the library and that
-- number will not move, and a concern raised at onboarding can turn it green
-- without anybody going near a moment. One row wearing two features. Not fixed
-- here, because which of the two it should count is a product decision, but
-- worth knowing before anyone else spends an afternoon on it.
--
-- WHAT THIS MIGRATION IS FOR. Whichever of the two the row ends up counting,
-- both are self reported ticks today with nothing checking they held. Justin:
-- "if watching tv first thing in morning, struggling to eat breakfast, we need
-- to confirm that they have improved". A tick cannot confirm that. A verdict a
-- week later can.
--
-- WHY NO NEW TABLE. digi_outcomes already asks the only question that matters,
-- and migration 147 wrote down why: "when we offer advice we gather and catch
-- up in a few days to see if our solution worked". Resolving a concern is the
-- same claim, so it earns the same catch up. This adds columns to each end of a
-- loop that is already live rather than building a second one beside it, which
-- would eventually disagree with the first.
--
-- The chain needs no changes: lib/digi/tools.ts schedules, cron/followups turns
-- a due follow up into a card and opens the ledger row, api/digi/outcome
-- records the verdict, DigiPrompts shows it. All it needed was somewhere to
-- write what the verdict was about.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- ── What the follow up is checking ────────────────────────────────────────
--
-- Both, because they answer different questions. concern_id is what the
-- passport counts, so a verdict can gate the stamp honestly. moment_id is which
-- card the parent actually used, which is what getProvenSolutions needs to rank
-- one solution above another across families.

alter table public.digi_followups
  add column if not exists concern_id uuid references public.concerns(id) on delete cascade;

alter table public.digi_followups
  add column if not exists moment_id uuid references public.daily_moments(id) on delete set null;

comment on column public.digi_followups.concern_id is
  'The worry this follow up is checking held. Null for an ordinary DiGi suggestion.';

comment on column public.digi_followups.moment_id is
  'The moment card the parent used, when they used one. Which solution was tried, as opposed to what it was about.';

alter table public.digi_outcomes
  add column if not exists concern_id uuid references public.concerns(id) on delete set null;

alter table public.digi_outcomes
  add column if not exists moment_id uuid references public.daily_moments(id) on delete set null;

comment on column public.digi_outcomes.concern_id is
  'Carried through from the follow up by the cron. This is what lets the passport count worries that STAYED fixed rather than worries somebody ticked.';

comment on column public.digi_outcomes.moment_id is
  'Carried through from the follow up. Which moment card was tried, so a solution can be ranked on real verdicts rather than on an estimate.';

create index if not exists digi_outcomes_concern_idx
  on public.digi_outcomes (user_id, concern_id, verdict);

create index if not exists digi_outcomes_moment_idx
  on public.digi_outcomes (user_id, moment_id, verdict);

create index if not exists digi_followups_concern_idx
  on public.digi_followups (user_id, concern_id);

-- ── The child's side ──────────────────────────────────────────────────────
--
-- Justin: "we need to drive and see that the child has a progress... for example
-- if watching tv first thing in morning, struggling to eat breakfast, we need to
-- confirm that they have improved".
--
-- A parent's memory a week later is not that confirmation. A daily tick the
-- child makes is. family_quests and quest_ticks already do exactly that job,
-- child visible in the PWA, parent approved, paying stars, so a worry worth
-- working on becomes a quest rather than a new kind of thing.
--
-- NEVER AUTOMATIC. Non-negotiable 1: never a flat instruction, and a worry
-- silently becoming a daily chore a child never agreed to is exactly that. The
-- parent taps. This column records that they did, not that we decided.
alter table public.family_quests
  add column if not exists from_moment_id uuid references public.daily_moments(id) on delete set null;

alter table public.family_quests
  add column if not exists from_concern_id uuid references public.concerns(id) on delete set null;

comment on column public.family_quests.from_moment_id is
  'The moment card this quest came from, when a parent chose to turn one into a daily habit. Never set automatically.';

comment on column public.family_quests.from_concern_id is
  'The worry this quest is working on, so the concern can read whether the habit is actually holding.';

create index if not exists family_quests_from_concern_idx
  on public.family_quests (user_id, from_concern_id);
