-- Guided Childhood — Migration 099
-- The community bite. One poll a month, asked inside the app, so a parent sees
-- what everyone else is actually dealing with. The whole point is the reassurance
-- of the crowd: you are not the only one whose ten year old will not hand the
-- tablet back. Results go out with the weekly review email once a month.
--
-- One vote per parent per poll, enforced by the unique index rather than by
-- trust. Counting is done server side with the service role, so a parent can
-- read and write only their own vote while still being shown the totals.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.community_polls (
  id         uuid        primary key default gen_random_uuid(),
  month      date        not null,
  question   text        not null,
  options    jsonb       not null,
  active     boolean     not null default true,
  created_at timestamptz not null default now()
);

-- One poll per month, so the bite is a monthly ritual and never a pile.
create unique index if not exists idx_community_polls_month on public.community_polls (month);

create table if not exists public.community_poll_votes (
  id         uuid        primary key default gen_random_uuid(),
  poll_id    uuid        not null references public.community_polls(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  choice     integer     not null,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create index if not exists idx_community_poll_votes_poll on public.community_poll_votes (poll_id);

alter table public.community_polls enable row level security;
alter table public.community_poll_votes enable row level security;

drop policy if exists "community_polls_read" on public.community_polls;
drop policy if exists "community_poll_votes_own" on public.community_poll_votes;

-- Every signed in parent can read the question. Nobody writes it from the app.
create policy "community_polls_read" on public.community_polls
  for select using (auth.role() = 'authenticated');

-- A parent reads and writes only their own vote. Totals come from the server.
create policy "community_poll_votes_own" on public.community_poll_votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The first bite, so the feature is alive the moment it ships.
insert into public.community_polls (month, question, options)
values (
  date_trunc('month', now())::date,
  'What is the hardest screen moment in your house right now?',
  '["Getting them off it when time is up","The constant asking for more","What they are actually watching","Screens at bedtime","Homework and screens tangled together","Honestly, we are in a good place"]'::jsonb
)
on conflict (month) do nothing;
