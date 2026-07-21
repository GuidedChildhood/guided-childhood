-- Guided Childhood — Migration 087
-- Printables become a first class thing on the child's path. A child taps a
-- printable, does it at home, and marks it "show my grown up": that writes a
-- PENDING row here. The parent sees it in Waiting on you, confirms it is
-- really done, and the confirm awards the stars (through the star_bonuses
-- ledger) and flips the child's app to done. Keyed by the stable registry
-- printable_key, never a fragile title, so the loop can never mismatch.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.printable_completions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  printable_key text        not null,
  title         text        not null,
  emoji         text,
  stars         integer     not null default 5 check (stars >= 0 and stars <= 20),
  status        text        not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at    timestamptz not null default now(),
  decided_at    timestamptz
);

create index if not exists idx_printable_completions_user
  on public.printable_completions (user_id, child_id, status, created_at desc);

-- One open request per printable per child at a time: a child cannot stack a
-- pile of pending confirmations for the same sheet.
create unique index if not exists uq_printable_completions_pending
  on public.printable_completions (child_id, printable_key)
  where status = 'pending';

alter table public.printable_completions enable row level security;

drop policy if exists "printable_completions_own" on public.printable_completions;

create policy "printable_completions_own" on public.printable_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
