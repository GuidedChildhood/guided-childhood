-- Guided Childhood — Initial Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query → paste → Run

-- ─────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- profiles
-- Created automatically when a user signs up via trigger below.
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  full_name           text,
  avatar_url          text,

  -- Subscription
  stripe_customer_id  text unique,
  subscription_status text not null default 'free'
                        check (subscription_status in ('free','active','past_due','cancelled')),
  subscription_tier   text
                        check (subscription_tier in ('founder','standard','annual','school_small','school_medium', null)),
  is_founder          boolean not null default false,

  -- Onboarding
  onboarding_complete boolean not null default false,
  onboarding_answers  jsonb,

  -- School link (optional — set when parent links to a school code)
  school_id           uuid,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role (webhook, admin) can write freely
create policy "Service role full access to profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- children
-- One parent can have multiple children; is_primary = true is the default focus child.
-- ─────────────────────────────────────────────
create table if not exists public.children (
  id              uuid primary key default uuid_generate_v4(),
  parent_id       uuid not null references public.profiles(id) on delete cascade,
  name            text not null default 'Your child',
  age_band        text not null
                    check (age_band in ('4-7','8-10','11-13','13-15','16+')),
  stage_id        text not null
                    check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  is_primary      boolean not null default true,
  streak_weeks    int not null default 0,
  actions_this_week int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.children enable row level security;

create policy "Parents can manage own children"
  on public.children for all
  using (auth.uid() = parent_id);

create policy "Service role full access to children"
  on public.children for all
  using (auth.role() = 'service_role');

create trigger children_updated_at
  before update on public.children
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- scripts
-- All 17 scripts live here. Free tier sees is_free=true only.
-- law_flag: 'none' | 'partial_ban' | 'full_ban_u16'
-- ─────────────────────────────────────────────
create table if not exists public.scripts (
  id          uuid primary key default uuid_generate_v4(),
  stage_id    text not null
                check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  title       text not null,
  situation   text not null,
  say_this    text not null,
  not_this    text not null,
  why_it_works text not null,
  tonight     text not null,
  law_flag    text not null default 'none'
                check (law_flag in ('none','partial_ban','full_ban_u16')),
  is_free     boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.scripts enable row level security;

-- Free scripts visible to everyone (including anon, for the static /scripts page)
create policy "Free scripts are public"
  on public.scripts for select
  using (is_free = true);

-- Paid scripts visible to active subscribers
create policy "Paid scripts visible to active members"
  on public.scripts for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and subscription_status = 'active'
    )
  );

create policy "Service role full access to scripts"
  on public.scripts for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- digi_conversations
-- One row per user — rolling message history (last 20 pairs).
-- ─────────────────────────────────────────────
create table if not exists public.digi_conversations (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  messages          jsonb not null default '[]'::jsonb,
  message_count     int not null default 0,
  messages_today    int not null default 0,
  last_message_date date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id)
);

alter table public.digi_conversations enable row level security;

create policy "Users can manage own DiGi conversation"
  on public.digi_conversations for all
  using (auth.uid() = user_id);

create policy "Service role full access to digi_conversations"
  on public.digi_conversations for all
  using (auth.role() = 'service_role');

create trigger digi_conversations_updated_at
  before update on public.digi_conversations
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- digi_questions
-- Append-only log of every question asked. Used for analytics, not rendering.
-- ─────────────────────────────────────────────
create table if not exists public.digi_questions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  child_id    uuid references public.children(id) on delete set null,
  stage_id    text not null,
  question    text not null,
  response    text not null,
  created_at  timestamptz not null default now()
);

alter table public.digi_questions enable row level security;

create policy "Users can read own DiGi questions"
  on public.digi_questions for select
  using (auth.uid() = user_id);

create policy "Users can insert own DiGi questions"
  on public.digi_questions for insert
  with check (auth.uid() = user_id);

create policy "Service role full access to digi_questions"
  on public.digi_questions for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- wellbeing_checks
-- Weekly tracker — one row per child per week (upsert on conflict).
-- ─────────────────────────────────────────────
create table if not exists public.wellbeing_checks (
  id                  uuid primary key default uuid_generate_v4(),
  child_id            uuid references public.children(id) on delete set null,
  parent_id           uuid not null references public.profiles(id) on delete cascade,
  week_start          date not null,
  mood_score          smallint check (mood_score between 1 and 5),
  sleep_score         smallint check (sleep_score between 1 and 5),
  social_score        smallint check (social_score between 1 and 5),
  screen_mood_score   smallint check (screen_mood_score between 1 and 5),
  open_communication  smallint check (open_communication between 1 and 5),
  concern_level       text not null default 'none'
                        check (concern_level in ('none','low','medium','high')),
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (child_id, week_start)
);

alter table public.wellbeing_checks enable row level security;

create policy "Parents can manage own wellbeing checks"
  on public.wellbeing_checks for all
  using (auth.uid() = parent_id);

create policy "Service role full access to wellbeing_checks"
  on public.wellbeing_checks for all
  using (auth.role() = 'service_role');

create trigger wellbeing_checks_updated_at
  before update on public.wellbeing_checks
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- schools
-- Schools can be added by an admin or self-registered by an educator.
-- school_code is the 6-char code parents enter to link their account.
-- ─────────────────────────────────────────────
create table if not exists public.schools (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  school_code     text not null unique,
  dsl_user_id     uuid references public.profiles(id) on delete set null,
  subscription_tier text
                    check (subscription_tier in ('school_small','school_medium', null)),
  subscription_status text not null default 'free'
                    check (subscription_status in ('free','active','cancelled')),
  stripe_customer_id text unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.schools enable row level security;

-- DSL can read/update their own school
create policy "DSL can manage own school"
  on public.schools for all
  using (auth.uid() = dsl_user_id);

create policy "Service role full access to schools"
  on public.schools for all
  using (auth.role() = 'service_role');

create trigger schools_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

-- Add FK from profiles to schools (deferred so schools table exists first)
alter table public.profiles
  add constraint fk_profiles_school
  foreign key (school_id) references public.schools(id) on delete set null;

-- ─────────────────────────────────────────────
-- Indexes (performance)
-- ─────────────────────────────────────────────
create index if not exists idx_children_parent_id on public.children(parent_id);
create index if not exists idx_digi_conversations_user_id on public.digi_conversations(user_id);
create index if not exists idx_digi_questions_user_id on public.digi_questions(user_id);
create index if not exists idx_wellbeing_checks_parent_id on public.wellbeing_checks(parent_id);
create index if not exists idx_wellbeing_checks_child_week on public.wellbeing_checks(child_id, week_start);
create index if not exists idx_scripts_stage on public.scripts(stage_id, is_free, sort_order);
create index if not exists idx_profiles_stripe on public.profiles(stripe_customer_id);
