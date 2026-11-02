-- 384: DiGi learns from its own failed tests, with Justin's tap in between.
--
-- Justin, 2 November 2026: "Can we auto update the flags in future so
-- constantly improving itself?" He chose "draft weekly, I tap approve".
--
-- Two tables.
--
-- digi_rule_proposals: every Monday each failed test case is turned into one
-- short proposed rule (or a note that the test itself looks out of date). It
-- waits as pending until Justin approves or declines it from the link in the
-- Monday email. Approved rules are read by the live DiGi route and by the
-- evals (lib/digi/learned-rules.ts), so a rule is live the moment he taps and
-- the next Monday measures it. Retired rules stay as history: nothing here is
-- ever deleted, so anyone can say what DiGi was told and when.
--
-- digi_regression_cases: a rotating test case DiGi fails is kept and re-run
-- every Monday from then on, so a failure fixed once stays fixed.
--
-- Service role only: the cron writes, the signed decide route updates, the
-- live route reads. No parent or child data is stored, only test questions.
-- Additive and idempotent. Supabase editor rules: flat statements, no DO
-- blocks, no semicolons inside string literals.

create table if not exists public.digi_rule_proposals (
  id           uuid        primary key default gen_random_uuid(),
  week_start   date        not null,
  case_id      text        not null,
  case_prompt  text        not null,
  -- What went wrong, in one line, from the verifier and the rubric.
  failure      text        not null,
  -- The first part of the reply that failed, so the proposal can be judged.
  reply_excerpt text,
  -- 'rule' adds a line to DiGi. 'test' says the test case looks wrong, which
  -- is a code change for a session, never something DiGi applies to itself.
  kind         text        not null default 'rule' check (kind in ('rule', 'test')),
  rule         text        not null,
  status       text        not null default 'pending' check (status in ('pending', 'approved', 'declined', 'retired')),
  decided_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists idx_digi_rule_proposals_status
  on public.digi_rule_proposals (status, created_at desc);

alter table public.digi_rule_proposals enable row level security;

create table if not exists public.digi_regression_cases (
  id           uuid        primary key default gen_random_uuid(),
  case_id      text        not null unique,
  -- The EvalCase shape: { id, category, ageBand, prompt, expects }.
  test_case    jsonb       not null,
  first_failed date        not null,
  active       boolean     not null default true,
  created_at   timestamptz not null default now()
);

alter table public.digi_regression_cases enable row level security;

-- Who may reach them (scripts/check-migration-grants.mjs): the service role
-- only. No policy for anyone else, so the Data API returns nothing to a
-- signed in parent.
grant select, insert, update, delete on public.digi_rule_proposals to service_role;
grant select, insert, update, delete on public.digi_regression_cases to service_role;
