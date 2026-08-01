-- Guided Childhood — Migration 140
--
-- The Monday management review: what the platform learned last week, reviewed
-- by an agent, written down where Justin will see it.
--
-- Justin: "so that we are saving data gathering on my management board and
-- weekly meetings where an agent reviews it for findings."
--
-- What already existed and why it was not this:
--
--   /dashboard/insights is the founder board, and /api/cron/digi-insights runs
--   an agent daily. But it reviews the QUESTIONS parents asked. That tells him
--   what people are worried about, and nothing at all about what actually
--   helped. A product whose entire claim is that it learns from what works had
--   no report on what worked.
--
--   rebuildWisdom reads the three places a success is recorded and turns them
--   into guidance for DiGi. That is the machine learning from outcomes. Nobody
--   was reading it back to the person who has to decide what to build next.
--
-- So this is the outcome side of the same data: concerns families marked
-- resolved, scripts they said worked, sticker and streak behaviour, and the
-- topics coming up most often, reviewed once a week and kept.
--
-- Kept rather than emailed and forgotten, because the value is the TREND. One
-- week's findings are an anecdote; twelve weeks of them is the thing that tells
-- you whether the product is getting better at its job.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.management_findings (
  id            uuid        primary key default gen_random_uuid(),
  -- The Monday of the week reviewed, so a re-run replaces rather than stacks.
  week_start    date        not null,
  -- The agent's short written read on the week. The bit worth reading.
  summary       text        not null,
  -- Its findings, each with what it saw and what it suggests. Structured so the
  -- board can list them without parsing prose.
  findings      jsonb       not null default '[]'::jsonb,
  -- The raw counts the review was built from, kept alongside the words. Without
  -- these a finding cannot be checked later, and an unfalsifiable finding is an
  -- opinion with a date on it.
  metrics       jsonb       not null default '{}'::jsonb,
  model         text,
  created_at    timestamptz not null default now(),
  unique (week_start)
);

create index if not exists idx_management_findings_week
  on public.management_findings (week_start desc);

alter table public.management_findings enable row level security;

-- Founder only, and there is deliberately no parent facing policy at all. This
-- is aggregate across every family, so the safe default is that nobody reads it
-- through the client. The board fetches it server side after checking the
-- founder email, the same gate /dashboard/insights already uses.
drop policy if exists "Service role manages management findings" on public.management_findings;
create policy "Service role manages management findings"
  on public.management_findings for all
  using (auth.role() = 'service_role');

comment on table public.management_findings is
  'Weekly agent review of platform OUTCOMES: what families resolved, which scripts worked, which topics recur. Distinct from digi_insights, which reviews the questions parents asked rather than what helped. Founder only, aggregate, never per family.';
