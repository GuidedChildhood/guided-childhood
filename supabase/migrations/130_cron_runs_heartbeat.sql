-- Every scheduled job says it ran.
--
-- Twenty three crons are declared in vercel.json and, until now, not one of
-- them left any record of having run. That gap is not theoretical: the weekly
-- digest was gated to Mondays while its key was the ISO week, so from 13 July
-- it skipped every parent, every week, in silence. Nothing errored. Nothing
-- alerted. It was found by hand seventeen days later.
--
-- The email log could not have caught it either. A send that fails deletes its
-- own log row on the way out, so "everything failed" and "nobody was due" leave
-- an identical, empty table. Absence of rows has never been evidence of health.
--
-- So each run writes here: what ran, when, whether it finished, how much work
-- it did and what broke. A job that is down stops writing, and overdue is then
-- something you can query rather than something you have to notice.

create table if not exists cron_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,                                  -- '/api/email/digest'
  started_at timestamptz not null default now(),
  finished_at timestamptz,                            -- null while running, or if killed mid run
  ok boolean,                                         -- null while running
  processed integer,                                  -- rows/parents/children actually handled
  detail jsonb,                                       -- the route's own reply, verbatim
  error text,                                         -- message when ok is false
  duration_ms integer
);

-- The board's two questions, and nothing else: "how is this job doing" and
-- "what has just happened across everything".
create index if not exists cron_runs_job_started_idx on cron_runs (job, started_at desc);
create index if not exists cron_runs_started_idx on cron_runs (started_at desc);

comment on table cron_runs is
  'Heartbeat for every scheduled job. A missing row is the alert: see /dashboard/admin/health.';
comment on column cron_runs.finished_at is
  'Null with ok null means the run never reported back: timed out or the container died.';
comment on column cron_runs.processed is
  'Zero is meaningful. It separates "ran and had nothing to do" from "did not run".';

-- Founder only surface, read with the service key. No family ever reads this,
-- so RLS on with no policy is the correct posture: service role bypasses it,
-- everyone else sees nothing.
alter table cron_runs enable row level security;

-- Ninety days is enough to see a weekly job fail three times running and still
-- keeps the table small enough to scan without an archive story.
create or replace function prune_cron_runs() returns void
language sql
security definer
set search_path = public
as $$
  delete from cron_runs where started_at < now() - interval '90 days';
$$;

-- The board's read, as one query.
--
-- Doing this from the client meant fetching recent rows and picking the newest
-- per job in JavaScript, which is wrong the moment the jobs run at different
-- rates. Device time sync runs every minute and writes 1,440 rows a day, so any
-- capped read is entirely that one job within a day and a half, and the weekly,
-- monthly and quarterly jobs fall off the end. They would then be reported as
-- never having run, forever, which is precisely the false silence this table
-- was added to end.
--
-- distinct on has no such cap: it is the last run of every job by definition.
create or replace function cron_job_status()
returns table (
  job text,
  started_at timestamptz,
  ok boolean,
  processed integer,
  error text,
  runs_7d bigint,
  failures_7d bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with last_run as (
    select distinct on (job) job, started_at, ok, processed, error
    from cron_runs
    order by job, started_at desc
  ),
  week as (
    select job,
           count(*) as runs_7d,
           count(*) filter (where ok is false) as failures_7d
    from cron_runs
    where started_at >= now() - interval '7 days'
    group by job
  )
  select l.job, l.started_at, l.ok, l.processed, l.error,
         coalesce(w.runs_7d, 0), coalesce(w.failures_7d, 0)
  from last_run l
  left join week w on w.job = l.job;
$$;
