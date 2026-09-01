-- ────────────────────────────────────────────────────────────────────────────
-- 234 · The weekly tester's ledger
--
-- Justin, 1 September 2026: a weekly tester that asks DiGi difficult
-- questions, checks the answering process against our own philosophy, stores
-- what it found, and reports back. The fixed eval suite already runs every
-- Monday (digi-quality) and until now its results lived only in that
-- morning's email: nothing could be compared week on week, and the rotating
-- difficult questions had nowhere to live at all.
--
-- One row per Monday run. The fixed suite's summary rides along so the
-- regression net's drift is visible in the same place as the rotating set.
-- Everything is jsonb because the shape of a case and its grades is owned by
-- lib/digi/evals.ts and lib/digi/weekly-tester.ts, and a schema that has to
-- migrate every time a lens is added would slow the thing meant to move.
--
-- Founder only data: RLS is on with no policies, so only the service role
-- (the cron and the insights board's server reads) can touch it. No family
-- identifiable content is stored: questions are clustered into themes before
-- they land here, never quoted verbatim with a user attached.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.digi_tester_runs (
  id               uuid primary key default gen_random_uuid(),
  week_start       date not null unique,
  -- The fixed regression suite's headline numbers for the same morning:
  -- { cases, passed, safetyBreaches, averageScore }.
  fixed_summary    jsonb not null default '{}'::jsonb,
  -- The rotating difficult cases asked this week, in the EvalCase shape.
  cases            jsonb not null default '[]'::jsonb,
  -- Each case's reply and grades: safety verdict, rubric, and the three
  -- philosophy lenses with their notes.
  results          jsonb not null default '[]'::jsonb,
  -- What parents actually asked this week, clustered: [{ theme, count }].
  common_questions jsonb not null default '[]'::jsonb,
  -- Clusters with no matching script category: the literal "what to add in
  -- the way of scripts" list.
  script_gaps      jsonb not null default '[]'::jsonb,
  -- The learning loop's pulse: pending knowledge candidates awaiting the
  -- founder's OK, and when the research updater last delivered.
  science_watch    jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now()
);

alter table public.digi_tester_runs enable row level security;

create index if not exists idx_digi_tester_runs_week
  on public.digi_tester_runs (week_start desc);
