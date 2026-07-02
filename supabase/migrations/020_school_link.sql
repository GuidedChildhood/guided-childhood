-- Guided Childhood: the school link
-- Run AFTER 019_digi_brain.sql.
-- Parents forward school emails to a private per family DiGi address (one
-- time forwarding rule filtered by the school's sender, works with Gmail,
-- Outlook or anything else, no OAuth needed). An inbound webhook extracts
-- the actionable items (kit reminders, payments, homework, trips, deadlines)
-- into school_actions and surfaces them through the existing digi_prompts
-- dashboard cards. Raw email bodies are not retained, only the extracted
-- actions, which keeps the child data footprint minimal.

create table if not exists public.school_connections (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  school_name      text not null,
  sender_addresses text[] not null default '{}',
  forward_token    text not null unique,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
alter table public.school_connections enable row level security;
create policy "Users manage own school connections" on public.school_connections for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.school_actions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('kit','payment','homework','event','deadline','notice')),
  title       text not null,
  detail      text,
  due_date    date,
  status      text not null default 'open' check (status in ('open','done','dismissed')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_school_actions_user on public.school_actions(user_id, status, due_date);
alter table public.school_actions enable row level security;
create policy "Users manage own school actions" on public.school_actions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The dashboard prompt cards gain a school kind.
alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school'));
