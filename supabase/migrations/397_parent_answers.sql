-- What a parent who stopped tells us (Justin, 15 November 2026).
--
-- One row per parent per question, written from /tell-us through a signed
-- link, read on the founder's asks page. Service role only: no policy is
-- added on purpose, so no browser session can read another family's words.
create table if not exists public.parent_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null check (char_length(question) between 1 and 40),
  answer text not null check (char_length(answer) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question)
);

alter table public.parent_answers enable row level security;

create index if not exists parent_answers_created_idx on public.parent_answers (created_at desc);
