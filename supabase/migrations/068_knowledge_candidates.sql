-- Guided Childhood — Migration 068
-- The research updater's review queue. Every two weeks a cron drafts candidate
-- findings from what parents are actually asking, aligned to the calibrated
-- pathway, and drops them here as pending. Nothing reaches DiGi's live bank
-- (expert_knowledge) until the founder clicks OK on the insights board, which
-- promotes the row into expert_knowledge. Service role only, so it is never
-- readable by a parent or the public.

set lock_timeout = '3s';

create table if not exists public.expert_knowledge_candidates (
  id uuid primary key default gen_random_uuid(),
  source_type text,
  source_name text,
  finding text not null,
  age_bands text[] default '{}',
  topics text[] default '{}',
  url text,
  rationale text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.expert_knowledge_candidates enable row level security;

create index if not exists idx_ek_candidates_status on public.expert_knowledge_candidates (status, created_at desc);
