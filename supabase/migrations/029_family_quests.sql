-- Guided Childhood — Migration 029
-- Family Quests: the earn the deal loop. Parents set quests, kids tick
-- them off (printed sheet for little ones, their private link for older
-- ones), parents approve, stars land, the agreement defines what stars
-- buy. Kid link access goes through service role routes only, the token
-- is the auth, exactly like the school letterbox.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.family_quests (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        references public.children(id) on delete cascade,
  title      text        not null,
  emoji      text        not null default '⭐',
  stars      int         not null default 1 check (stars between 1 and 10),
  schedule   text        not null default 'daily' check (schedule in ('daily', 'weekdays', 'weekend', 'once')),
  active     boolean     not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quest_ticks (
  id          uuid        primary key default gen_random_uuid(),
  quest_id    uuid        not null references public.family_quests(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  child_id    uuid,
  tick_date   date        not null default current_date,
  status      text        not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  ticked_by   text        not null default 'child' check (ticked_by in ('child', 'parent')),
  approved_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (quest_id, tick_date)
);

create table if not exists public.kid_links (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  child_id     uuid        not null references public.children(id) on delete cascade,
  token        text        not null unique,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz,
  unique (child_id)
);

create table if not exists public.star_goals (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  child_id     uuid        not null references public.children(id) on delete cascade,
  title        text        not null,
  stars_needed int         not null default 20 check (stars_needed between 1 and 500),
  achieved_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (child_id)
);

create index if not exists idx_family_quests_user   on public.family_quests (user_id, active);
create index if not exists idx_quest_ticks_user     on public.quest_ticks (user_id, status, tick_date desc);
create index if not exists idx_quest_ticks_child    on public.quest_ticks (child_id, tick_date desc);

alter table public.family_quests enable row level security;
alter table public.quest_ticks   enable row level security;
alter table public.kid_links     enable row level security;
alter table public.star_goals    enable row level security;

drop policy if exists "quests_own"     on public.family_quests;
drop policy if exists "ticks_own"      on public.quest_ticks;
drop policy if exists "kid_links_own"  on public.kid_links;
drop policy if exists "star_goals_own" on public.star_goals;

create policy "quests_own" on public.family_quests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ticks_own" on public.quest_ticks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "kid_links_own" on public.kid_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "star_goals_own" on public.star_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
