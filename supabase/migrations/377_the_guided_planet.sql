-- 377: The Guided Planet, the newspaper's workflow, approvals and audit trail.
--
-- Justin, 13 October 2026: build the system that makes every edition of The
-- Guided Planet, with two approvals from him and nothing published without the
-- second. The engine lives in publishing/ and keeps the same records in a file
-- store for local runs; this is the real store the dashboard reads and writes
-- (/dashboard/admin/planet), shaped like publishing/engine/store.ts.
--
-- What each table is for:
--   planet_issues           one row per edition, its workflow state, and the
--                           hashes each approval was given against
--   planet_issue_versions   every version of the issue file that was synced,
--                           so the approved words are kept for ever
--   planet_stories          the candidate stories and the founder's decision
--   planet_issue_events     the audit trail, append only (the trigger below
--                           refuses any update or delete). Not planet_events:
--                           that is the children's Planet Friends ledger (252),
--                           and "if not exists" would have quietly skipped this
--                           table and put the append only lock on theirs.
--   planet_releases         one row per issue and channel; the unique key is
--                           what makes publishing idempotent
--   planet_generations      every Higgsfield attempt and the credits reported
--   planet_budgets          the credit budget Justin approved per issue
--
-- No child data. No parent data. Service role only, like the research queue
-- (068): RLS on with no policies, so nothing here is readable by a parent or
-- the public. The storage bucket is private; the dashboard shows previews by
-- signed URL.
--
-- Additive and idempotent. Nothing in the live app reads these tables.

set lock_timeout = '3s';

create table if not exists public.planet_issues (
  number int primary key check (number > 0),
  slug text not null unique,
  edition text not null,
  month text not null,
  state text not null default 'DRAFT' check (state in (
    'DRAFT','RESEARCHED','VERIFIED','EDITORIAL_REVIEW','APPROVED',
    'DESIGNING','PROOF_READY','FINAL_APPROVED','PUBLISHED')),
  stories_hash text,
  content_hash text,
  pdf_hash text,
  approved_content_hash text,
  approved_pdf_hash text,
  updated_at timestamptz not null default now()
);

create table if not exists public.planet_issue_versions (
  id bigserial primary key,
  issue int not null references public.planet_issues(number) on delete restrict,
  content_hash text not null,
  content jsonb not null,
  research jsonb,
  render_report jsonb,
  created_at timestamptz not null default now(),
  unique (issue, content_hash)
);

create table if not exists public.planet_stories (
  issue int not null references public.planet_issues(number) on delete restrict,
  id text not null,
  record jsonb not null,
  total int,
  decision text check (decision in ('approved','rejected','revise')),
  decision_note text,
  decided_at timestamptz,
  primary key (issue, id)
);

create table if not exists public.planet_issue_events (
  id bigserial primary key,
  issue int not null,
  at timestamptz not null default now(),
  actor_kind text not null check (actor_kind in ('founder','automation')),
  actor_id text not null,
  action text not null,
  from_state text,
  to_state text,
  detail jsonb not null default '{}'::jsonb
);

create index if not exists idx_planet_issue_events_issue on public.planet_issue_events (issue, at);

-- The audit trail is append only. A row can be added; nothing can change or
-- remove one, the service role included.
create or replace function public.planet_issue_events_append_only() returns trigger
language plpgsql set search_path = '' as $$
begin
  raise exception 'planet_issue_events is append only';
end $$;

create or replace trigger planet_issue_events_no_change before update or delete on public.planet_issue_events
  for each row execute function public.planet_issue_events_append_only();

create table if not exists public.planet_releases (
  issue int not null references public.planet_issues(number) on delete restrict,
  channel text not null,
  key text not null unique,
  status text not null check (status in ('prepared','sent','failed','manual')),
  at timestamptz not null default now(),
  external text,
  detail jsonb not null default '{}'::jsonb,
  primary key (issue, channel)
);

create table if not exists public.planet_generations (
  id text primary key,
  issue int not null,
  slot text not null,
  recipe text not null,
  tier text not null check (tier in ('draft','final')),
  prompt text not null,
  model text not null,
  status text not null check (status in ('planned','submitted','completed','approved','rejected','failed')),
  credits numeric,
  estimate numeric,
  job text,
  url text,
  reason text,
  at timestamptz not null default now()
);

create index if not exists idx_planet_generations_issue on public.planet_generations (issue, at);

create table if not exists public.planet_budgets (
  issue int primary key,
  credits numeric not null check (credits >= 0),
  approved_by text not null,
  at timestamptz not null default now()
);

alter table public.planet_issues enable row level security;
alter table public.planet_issue_versions enable row level security;
alter table public.planet_stories enable row level security;
alter table public.planet_issue_events enable row level security;
alter table public.planet_releases enable row level security;
alter table public.planet_generations enable row level security;
alter table public.planet_budgets enable row level security;

-- Only the service role reaches these (the routine and the founder gated API),
-- so the grant names it alone. Said explicitly because from 30 October 2026
-- Supabase stops granting new public tables to the Data API by default
-- (scripts/check-migration-grants.mjs). The audit trail gets no update or
-- delete, on top of its trigger.
revoke all on public.planet_issues, public.planet_issue_versions, public.planet_stories,
  public.planet_issue_events, public.planet_releases, public.planet_generations,
  public.planet_budgets from anon, authenticated;
grant select, insert, update, delete on public.planet_issues to service_role;
grant select, insert, update, delete on public.planet_issue_versions to service_role;
grant select, insert, update, delete on public.planet_stories to service_role;
grant select, insert on public.planet_issue_events to service_role;
grant select, insert, update, delete on public.planet_releases to service_role;
grant select, insert, update, delete on public.planet_generations to service_role;
grant select, insert, update, delete on public.planet_budgets to service_role;
grant usage, select on sequence public.planet_issue_versions_id_seq, public.planet_issue_events_id_seq to service_role;

-- The private bucket for proofs, previews and approved art.
insert into storage.buckets (id, name, public)
values ('guided-planet', 'guided-planet', false)
on conflict (id) do nothing;
