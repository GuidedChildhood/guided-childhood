-- Guided Childhood — Migration 101
-- The sticker book. A child collects a sticker as they reach a milestone: a
-- Planet Friend for each stage they grow into, and badges for stars earned and
-- printables finished. One permanent row per sticker per child, keyed by a
-- stable sticker_key from lib/stickers/catalog.ts, so a broken streak or a
-- spent star never takes an earned sticker back. Earning is reconciled on read
-- from the real numbers (the star bank, confirmed printables, the stage), so
-- this table is the permanence, not the source of truth.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.earned_stickers (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  child_id    uuid        not null references public.children(id) on delete cascade,
  sticker_key text        not null,
  reason      text,
  earned_at   timestamptz not null default now()
);

create index if not exists idx_earned_stickers_child
  on public.earned_stickers (child_id, earned_at desc);

-- One row per sticker per child: earning it again is a no op.
create unique index if not exists uq_earned_stickers_child_key
  on public.earned_stickers (child_id, sticker_key);

alter table public.earned_stickers enable row level security;

drop policy if exists "earned_stickers_own" on public.earned_stickers;

create policy "earned_stickers_own" on public.earned_stickers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
