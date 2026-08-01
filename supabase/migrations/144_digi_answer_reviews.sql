-- Guided Childhood — Migration 144
--
-- DiGi's answers get reviewed, and the fixes go in a queue for a human.
--
-- Justin: "build 1 to 5." This is number five.
--
-- Everything DiGi learns today improves WHAT IT KNOWS. The wisdom loop turns
-- resolved concerns into patterns. The research updater adds findings. The
-- management review tells Justin what worked. Not one of them improves HOW IT
-- ANSWERS. The prompt that decides the shape, the tone and the judgement of every
-- single reply is changed only when a human notices something and edits a file.
--
-- So once a month an agent reads DiGi's own worst work: the eval cases it scored
-- lowest on, the replies the safety verifier flagged, and the reflections parents
-- wrote back. Then it proposes changes.
--
-- WHAT IT MAY NOT DO, and this is the whole design:
--
--   It proposes. It never applies. A system that rewrites its own instructions
--   is a system where nobody can say what it was told to do last Tuesday, and
--   for a product that answers questions about children that is not a risk worth
--   taking for any amount of convenience. Suggestions land in this table, Justin
--   reads them, and a change to the prompt is still a commit with his name on it.
--
--   The same gate the research bank already has, for the same reason.
--
-- WHY THE INPUTS ARE WHAT THEY ARE:
--
--   Eval scores are the only measure of answer quality that is comparable over
--   time, because the fourteen cases never change. Safety flags are the failures
--   that matter most. Parent reflections are the only signal that comes from the
--   person actually being helped. Between them they cover "did it break a rule",
--   "did it do the job", and "did it land".
--
-- Nothing per family reaches the model here either. Reflections are read for
-- their content, so they are the one place a parent's own words are involved:
-- they are truncated, stripped of any identifier, and never joined to a user id.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.digi_answer_reviews (
  id          uuid        primary key default gen_random_uuid(),
  -- The month reviewed, stored as its first day so a re-run replaces rather
  -- than stacks.
  period      date        not null,
  summary     text        not null,
  -- Each suggestion: what it saw, what to change, and where. Structured so the
  -- board can list them and so a change can be traced back to its reason.
  suggestions jsonb       not null default '[]'::jsonb,
  -- The numbers behind the words, kept for the same reason the management
  -- review keeps them: a finding you cannot check later is an opinion.
  metrics     jsonb       not null default '{}'::jsonb,
  model       text,
  created_at  timestamptz not null default now(),
  unique (period)
);

create index if not exists idx_digi_answer_reviews_period
  on public.digi_answer_reviews (period desc);

alter table public.digi_answer_reviews enable row level security;

-- Founder only, and deliberately no parent facing policy. This is a critique of
-- the product read across every family, and the board fetches it server side
-- after the founder email check.
drop policy if exists "Service role manages answer reviews" on public.digi_answer_reviews;
create policy "Service role manages answer reviews"
  on public.digi_answer_reviews for all
  using (auth.role() = 'service_role');

comment on table public.digi_answer_reviews is
  'Monthly agent critique of how DiGi ANSWERS, distinct from every other loop, which improve what it knows. Proposals only: nothing here changes the prompt without a human commit.';
