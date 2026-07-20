-- Guided Childhood — Migration 086
-- Fair play: honesty about the timer becomes part of the weekly rhythm.
-- 1. The weekly DiGi check in gains a third strand, fairplay, asking whether
--    screens mostly went through the agreed timer this week. Graded warmly
--    like the others, never a judgement.
-- 2. star_bonuses: a small ledger of stars granted outside the quest loop.
--    First use: one star per child for a green fair play week, so honesty
--    literally pays. The bank folds these into earned.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.literacy_checkins drop constraint if exists literacy_checkins_strand_check;

alter table public.literacy_checkins add constraint literacy_checkins_strand_check check (strand in ('safe', 'social', 'fairplay'));

create table if not exists public.star_bonuses (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  stars      integer     not null check (stars > 0 and stars <= 20),
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_star_bonuses_user on public.star_bonuses (user_id, child_id, created_at desc);

alter table public.star_bonuses enable row level security;

drop policy if exists "star_bonuses_own" on public.star_bonuses;

create policy "star_bonuses_own" on public.star_bonuses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
