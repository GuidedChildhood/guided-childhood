-- Guided Childhood — Migration 038
-- Capture the parent's email at the starter pathway quiz, before they ever
-- reach signup. A lead who answers the four questions but does not create an
-- account is otherwise lost; this keeps the email and their answers so the
-- starter pack can reach them and a return visit lands them in the right
-- place. Upserted by email, so re running the quiz updates rather than
-- duplicates. Written by the server (service role) only, never read by the
-- browser, so row level security stays closed with no public policy.

create table if not exists public.starter_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  answers     jsonb not null default '{}'::jsonb,
  stage_id    text,
  converted   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.starter_leads enable row level security;

create index if not exists starter_leads_created_at_idx on public.starter_leads (created_at desc);
