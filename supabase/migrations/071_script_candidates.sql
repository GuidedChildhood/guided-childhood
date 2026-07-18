-- Guided Childhood — Migration 071
-- DiGi drafts new scripts for the library, every couple of weeks, from what
-- parents actually asked for and grounded in the research bank (Dr Becky,
-- Knibbs, the rest). Nothing goes live on its own: each draft lands here as
-- PENDING and only reaches the scripts table when the founder approves it on the
-- insights board. Real demand in, a founder gate always.

set lock_timeout = '3s';

create table if not exists public.script_candidates (
  id            uuid primary key default gen_random_uuid(),
  stage_id      text not null,
  category      text,
  title         text not null,
  situation     text not null,
  say_this      text not null,
  not_this      text not null,
  why_it_works  text not null,
  tonight       text not null,
  grounded_in   text,
  rationale     text,
  status        text not null default 'pending',
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index if not exists idx_script_candidates_status on public.script_candidates (status, created_at desc);

alter table public.script_candidates enable row level security;
-- Service role only (the cron and founder endpoints use the admin client); no
-- policies means no anon or authed access, which is what we want here.
