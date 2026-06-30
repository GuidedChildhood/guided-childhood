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
