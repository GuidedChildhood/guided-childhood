-- 081: Ask first by default, and the in app kid nudges.
--
-- device_trust: the default becomes 'ask' for everyone. 'watch' was only
-- ever the untouched default from migration 058, so existing 'watch' rows
-- flip to 'ask' too; a parent who truly wants watch or trusted taps once in
-- "Who starts the timer?" on their screen time card.
--
-- device_requests gains a 'started' status: the parent's yes marks an ask
-- approved, and the child's own Start tap marks it started, so the child's
-- banner can tell "waiting", "say yes landed" and "timer running" apart.
--
-- kid_nudges: when a parent taps Remind on a blocking job, the push is best
-- effort but this row always lands, so the child sees the nudge on their own
-- dashboard next open either way.

alter table public.children alter column device_trust set default 'ask';

update public.children set device_trust = 'ask' where device_trust = 'watch';

alter table public.device_requests drop constraint if exists device_requests_status_check;
alter table public.device_requests add constraint device_requests_status_check
  check (status in ('pending', 'approved', 'declined', 'started'));

create table if not exists public.kid_nudges (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  quest_id   uuid        references public.family_quests(id) on delete cascade,
  message    text        not null,
  seen       boolean     not null default false,
  created_at timestamptz not null default now()
);

alter table public.kid_nudges enable row level security;

drop policy if exists "kid_nudges_own" on public.kid_nudges;
create policy "kid_nudges_own" on public.kid_nudges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists kid_nudges_unseen_by_child
  on public.kid_nudges (child_id, created_at desc) where not seen;
