-- GUIDED CHILDHOOD CATCH UP · STEP 01 · tables-ai-and-feedback
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

-- Guided Childhood — Migration 002
-- Adds category column to scripts table for the expanded script library.
-- Run in Supabase SQL Editor after 001_initial.sql.

alter table public.scripts
  add column if not exists category text;

-- Index for category filtering
create index if not exists idx_scripts_category
  on public.scripts(category, is_free, sort_order);

-- Update existing 17 scripts with sensible categories
update public.scripts set category = 'first-device'   where sort_order in (1, 2, 3);
update public.scripts set category = 'first-device'   where sort_order in (4, 5, 6);
update public.scripts set category = 'social-media'   where sort_order in (7, 8, 9);
update public.scripts set category = 'social-media'   where sort_order in (10, 11, 12);
update public.scripts set category = 'gaming'         where sort_order in (13, 14, 15);
update public.scripts set category = 'first-device'   where sort_order in (16, 17);

-- Guided Childhood: AI Literacy module
-- Run AFTER 001_initial.sql.
-- Two tables:
--   ai_lessons  : the evergreen, age-tiered AI literacy content (rarely changes)
--   ai_updates  : the living layer of current AI news and safety items, drafted
--                 by the refresh job and published only after human approval.

-- ─────────────────────────────────────────────
-- ai_lessons (evergreen content)
-- audience covers the same age tiers as the rest of the platform plus parents
-- and teachers. Content is educational and public, so anyone can read it and
-- DiGi can draw on it.
-- ─────────────────────────────────────────────
create table if not exists public.ai_lessons (
  id            uuid primary key default uuid_generate_v4(),
  audience      text not null
                  check (audience in ('age_7','age_9','age_11','age_13','age_16','parent','teacher')),
  category      text not null,
  title         text not null,
  the_idea      text not null,
  why_it_matters text not null,
  try_this      text not null,
  key_message   text not null,
  digi_prompt   text not null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.ai_lessons enable row level security;

-- Evergreen AI lessons are educational and public (free to all, like the free scripts).
create policy "AI lessons are public"
  on public.ai_lessons for select
  using (true);

create policy "Service role full access to ai_lessons"
  on public.ai_lessons for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- ai_updates (the living layer)
-- One row per current item (a new model, a safety guidance, a scam pattern).
-- origin: 'claude' means drafted by the refresh job, 'editor' means written by a
--   human. status: a draft is never shown to families. Only 'published' rows are
--   public. This human-in-the-loop step is deliberate: a children's product must
--   not surface unreviewed, machine-generated claims about the latest AI.
-- ─────────────────────────────────────────────
create table if not exists public.ai_updates (
  id            uuid primary key default uuid_generate_v4(),
  headline      text not null,
  summary       text not null,
  audience      text not null default 'parent'
                  check (audience in ('age_7','age_9','age_11','age_13','age_16','parent','teacher')),
  category      text not null default 'ai_news',
  source_name   text,
  source_url    text,
  origin        text not null default 'editor'
                  check (origin in ('claude','editor')),
  status        text not null default 'draft'
                  check (status in ('draft','approved','published','archived')),
  published_at  timestamptz,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.ai_updates enable row level security;

-- Only published updates are visible to families.
create policy "Published AI updates are public"
  on public.ai_updates for select
  using (status = 'published');

-- The refresh job and editors use the service role to draft, review, and publish.
create policy "Service role full access to ai_updates"
  on public.ai_updates for all
  using (auth.role() = 'service_role');

create index if not exists ai_lessons_audience_idx on public.ai_lessons (audience, sort_order);
create index if not exists ai_updates_status_idx on public.ai_updates (status, published_at desc);

-- DiGi daily feedback loop
-- One reflective question per user per day, answered by the parent.
-- Stored responses seed the next day's DiGi context for personalization.

CREATE TABLE IF NOT EXISTS public.digi_feedback (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id         uuid        REFERENCES public.children(id) ON DELETE SET NULL,
  feedback_date    date        NOT NULL DEFAULT CURRENT_DATE,
  question         text        NOT NULL,
  parent_response  text,
  digi_insight     text,  -- DiGi's stored interpretation, used as next-session seed
  responded_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT digi_feedback_user_date_unique UNIQUE (user_id, feedback_date)
);

ALTER TABLE public.digi_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own digi feedback"
  ON public.digi_feedback FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for efficient lookup by user + recent dates
CREATE INDEX IF NOT EXISTS idx_digi_feedback_user_date
  ON public.digi_feedback (user_id, feedback_date DESC);

-- 009_daily_moments.sql
-- Moment cards: each row is a real parenting scenario with DiGi context

CREATE TABLE IF NOT EXISTS public.daily_moments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  category       text NOT NULL CHECK (category IN ('Morning','Digital','School','Food','Evening','Transitions','Emotions')),
  age_bands      text[] NOT NULL DEFAULT '{}',
  icon           text NOT NULL DEFAULT '💡',
  science_brief  text NOT NULL,
  digi_opener    text NOT NULL,
  solutions      jsonb NOT NULL DEFAULT '[]',
  expert_note    text,
  sort_order     integer NOT NULL DEFAULT 0,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Completions: parent marks a moment as done today
CREATE TABLE IF NOT EXISTS public.moment_completions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id    uuid REFERENCES public.children(id) ON DELETE SET NULL,
  moment_id   uuid NOT NULL REFERENCES public.daily_moments(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT CURRENT_DATE,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT moment_completions_unique UNIQUE (user_id, moment_id, completed_on)
);

ALTER TABLE public.daily_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_completions ENABLE ROW LEVEL SECURITY;

-- Everyone can read moments
CREATE POLICY "moments_readable_by_all" ON public.daily_moments
  FOR SELECT USING (true);

-- Users manage their own completions
CREATE POLICY "completions_own" ON public.moment_completions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_moments_category  ON public.daily_moments (category);
CREATE INDEX IF NOT EXISTS idx_daily_moments_sort      ON public.daily_moments (sort_order);
CREATE INDEX IF NOT EXISTS idx_completions_user_date   ON public.moment_completions (user_id, completed_on DESC);

-- Push notification subscriptions
create table if not exists push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  stage         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table push_subscriptions enable row level security;

create policy "Users manage own subscriptions"
  on push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can read all (for sending notifications)
create policy "Service role reads all"
  on push_subscriptions
  for select
  using (auth.role() = 'service_role');

create index on push_subscriptions(user_id);

-- 011_daily_feedback.sql
-- Add moment feedback to daily sessions so the next day's card can be personalised

ALTER TABLE public.daily_sessions
  ADD COLUMN IF NOT EXISTS moment_feedback jsonb NOT NULL DEFAULT '[]';

-- Guided Childhood: AI Literacy check-in for parents of children aged 11+
-- Stores parent answers to a short AI readiness questionnaire.
-- One row per user (upsert on user_id).
create table if not exists public.ai_literacy_checkins (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  answers    jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint ai_literacy_checkins_user_unique unique (user_id)
);

alter table public.ai_literacy_checkins enable row level security;

create policy "Users can read own checkins"
  on public.ai_literacy_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.ai_literacy_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.ai_literacy_checkins for update
  using (auth.uid() = user_id);

create index if not exists ai_checkins_user_idx on public.ai_literacy_checkins (user_id);

select 'STEP 01 COMPLETE · tables-ai-and-feedback' as status;
