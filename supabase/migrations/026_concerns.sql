-- Guided Childhood — Migration 026
-- The concerns ledger: the platform's memory of what keeps coming up for
-- this family. Every flagged moment, script struggle, DiGi worry or Right
-- Now rescue lands here as one row per concern slug. times_flagged counts
-- repeats, status tracks the arc (open, improving, resolved), and the
-- daily check in stamps last_checked_at so tomorrow can ask "how did the
-- bedtime battle go" instead of starting cold.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals.

create table if not exists public.concerns (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  child_id        uuid,
  source          text        not null check (source in ('moment', 'script', 'digi', 'rightnow')),
  slug            text        not null,
  label           text        not null,
  status          text        not null default 'open' check (status in ('open', 'improving', 'resolved')),
  times_flagged   int         not null default 1,
  last_flagged_at timestamptz not null default now(),
  last_checked_at timestamptz,
  created_at      timestamptz not null default now(),
  unique(user_id, slug)
);

create index if not exists idx_concerns_user_status
  on public.concerns(user_id, status);

alter table public.concerns enable row level security;

drop policy if exists "Users manage their own concerns" on public.concerns;

create policy "Users manage their own concerns"
  on public.concerns
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
