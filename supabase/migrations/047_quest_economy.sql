-- Guided Childhood — Migration 047
-- The quest economy grows up. Two new tables close the loop Justin asked
-- for: children can ask for their own quests (clean my room) and parents
-- can mark screen time as used, so the star bank shows what is earned,
-- what is spent and what is left. Stars stay a family currency: earned
-- through the approve loop, spent when the agreed screen time happens.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.quest_requests (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  title      text        not null,
  emoji      text        not null default '⭐',
  status     text        not null default 'pending' check (status in ('pending', 'added', 'declined')),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.star_spends (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  stars      int         not null check (stars between 1 and 1000),
  minutes    int         not null check (minutes between 1 and 1440),
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_quest_requests_user on public.quest_requests (user_id, status, created_at desc);
create index if not exists idx_star_spends_child   on public.star_spends (child_id, created_at desc);

alter table public.quest_requests enable row level security;
alter table public.star_spends    enable row level security;

drop policy if exists "quest_requests_own" on public.quest_requests;
drop policy if exists "star_spends_own"    on public.star_spends;

create policy "quest_requests_own" on public.quest_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "star_spends_own" on public.star_spends
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
