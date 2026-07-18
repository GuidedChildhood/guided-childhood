-- Guided Childhood — Migration 071
-- Parent flagged answers from the DiGi chat. When a parent taps "something off
-- with this" under one of DiGi's replies and adds a note, it lands here for the
-- team to read and work on. The question, the answer, and their note, kept with
-- the parent so we can follow up, never shown back to other parents.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.digi_answer_flags (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  question   text,
  answer     text,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_digi_answer_flags_created on public.digi_answer_flags (created_at desc);

alter table public.digi_answer_flags enable row level security;

drop policy if exists "digi_answer_flags_own" on public.digi_answer_flags;

create policy "digi_answer_flags_own" on public.digi_answer_flags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
