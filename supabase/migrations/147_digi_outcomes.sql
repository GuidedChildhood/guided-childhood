-- Guided Childhood — Migration 147
--
-- Did it actually work.
--
-- Justin: "when we offer advice we gather and catch up in a few days to see if
-- our solution worked, and if yes we weight it for future solutions, and if no
-- we offer the next best alternative and again catch up and learn from feedback
-- until DiGi is super intelligent in his field."
--
-- THE HOLE THIS FILLS, and it is embarrassing once seen. DiGi already promises
-- to come back: schedule_followup writes digi_followups, the 07:15 cron turns
-- it into a card, and the card is even labelled "Checking back, as promised".
-- Then the parent can only DISMISS it. The question is asked and the answer is
-- dropped on the floor. We kept the promise and threw away the only thing the
-- promise was for.
--
-- So digi_wisdom, the table that is supposed to hold what works, is built from
-- proxies instead: concerns that changed status, scripts ticked as worked,
-- reflections. And its evidence_count, which getProvenSolutions weights on, is
-- THE MODEL'S OWN ESTIMATE parsed out of its JSON, not a counted fact. That is
-- already written down as a known soft spot. Stacking more weighting on an
-- estimate makes it louder, not truer.
--
-- WHY A SITUATION SHAPE RATHER THAN JUST TEXT. Justin's example is "early
-- morning, age 8, will not come off the TV". That is not a topic, it is a
-- combination, and a free text label cannot be counted across families. So the
-- situation is stored as fields: age band, topic, the time of day, and the
-- trigger in a few words. Four columns is what turns one family's morning into
-- a pattern with a count behind it.
--
-- WHAT THIS TABLE IS NOT. It is not a rating of DiGi. A parent saying something
-- did not work is not a complaint, it is the single most useful row in here,
-- because it is the one that earns them a different suggestion. The wording in
-- the product has to carry that or the answers will skew kind and the whole
-- table becomes flattery.
--
-- PRIVACY. Rows are per family and RLS'd to the owner, same as everything else.
-- Anything that reads ACROSS families for wisdom reads the shape and the
-- verdict, never parent_note, which is a parent's own words about their own
-- child. The de-identification rule that governs rebuildWisdom governs this.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- ── The follow up carries what it is following up ON ──────────────────────
--
-- Without these two, an answered card is a verdict with nothing attached to it.
-- "It worked" is worthless if we cannot say what "it" was.

alter table public.digi_followups
  add column if not exists suggestion text;

comment on column public.digi_followups.suggestion is
  'What DiGi actually suggested trying, in its own words at the time. The thing the verdict is about.';

alter table public.digi_followups
  add column if not exists situation jsonb;

comment on column public.digi_followups.situation is
  'The shape of the moment: {topic, time_band, trigger}. Stored so a family morning can become a counted pattern.';

-- 'answered' joins the existing statuses. A delivered card that was replied to
-- is a different thing from one still sitting there, and the difference is
-- exactly what "we never heard back" reporting needs.
alter table public.digi_followups
  drop constraint if exists digi_followups_status_check;

alter table public.digi_followups
  add constraint digi_followups_status_check
  check (status in ('pending', 'delivered', 'answered', 'cancelled'));

-- ── The ledger ────────────────────────────────────────────────────────────

create table if not exists public.digi_outcomes (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        references public.children(id) on delete set null,
  -- The follow up this came from, when it came from one. Nullable because a
  -- verdict can also arrive in conversation ("we tried that, it did not work"),
  -- and that is the same evidence arriving by a different door.
  followup_id   uuid        references public.digi_followups(id) on delete set null,

  -- ── The situation, as a shape ──
  -- age_band is copied rather than joined, on purpose: the child ages, and the
  -- fact that this worked for an eight year old does not stop being true when
  -- they turn nine.
  age_band      text,
  topic         text,
  -- morning, after_school, evening, bedtime, weekend, any. Kept as text rather
  -- than an enum so a band can be added without a migration on a hot table.
  time_band     text,
  -- The trigger in a few words, as the parent framed it. "goes straight to the
  -- TV before breakfast". Short on purpose: long enough to recognise, short
  -- enough that two families describing the same morning land near each other.
  trigger       text,

  -- ── What was suggested, and how it went ──
  suggestion    text        not null,
  verdict       text        check (verdict in ('worked', 'partly', 'no')),
  parent_note   text,

  -- When the verdict is 'no', the next suggestion should not be the first one
  -- again. This points at the outcome row that replaced it, so a chain of
  -- attempts is readable end to end rather than as three unrelated rows.
  superseded_by uuid        references public.digi_outcomes(id) on delete set null,

  created_at    timestamptz not null default now(),
  answered_at   timestamptz
);

-- The parent's own view of their own history.
create index if not exists idx_digi_outcomes_user
  on public.digi_outcomes (user_id, created_at desc);

-- The cross family read: find every verdict for a situation shape. Partial on
-- verdict is not null because an unanswered row has nothing to teach and there
-- will be many of them.
create index if not exists idx_digi_outcomes_situation
  on public.digi_outcomes (topic, age_band, time_band)
  where verdict is not null;

alter table public.digi_outcomes enable row level security;

create policy "Users manage own digi outcomes" on public.digi_outcomes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

comment on table public.digi_outcomes is
  'One row per suggestion DiGi made and followed up on, with the parent verdict. The counted evidence base that digi_wisdom.evidence_count only ever estimated.';

-- ── The prompt card needs somewhere to put the answer ─────────────────────
--
-- digi_prompts.status already has 'acted', which is close but not the same
-- thing: acted says the parent did something, not what happened when they did.

alter table public.digi_prompts
  add column if not exists response text;

comment on column public.digi_prompts.response is
  'What the parent wrote back on a card that asked them something. Today only follow up cards ask.';

-- The card has to know which outcome it is answering, or a verdict arrives with
-- nothing to attach it to. Set only on follow up cards; null on every other kind.
alter table public.digi_prompts
  add column if not exists outcome_id uuid references public.digi_outcomes(id) on delete set null;

comment on column public.digi_prompts.outcome_id is
  'The digi_outcomes row this card is asking about. Only follow up cards carry one.';
