-- 049_parent_lessons.sql
-- Parent and child co view lessons: content tables, completion with redo,
-- stars (10 per first completion, 2 per redo), and the stage passport.
-- Content lives in the database (non negotiable 6). Videos live on the CDN;
-- these tables store URLs only. Seed arrives in 050_parent_lessons_seed.sql.

-- ── Content ────────────────────────────────────────────────────────────────

create table if not exists public.parent_lessons (
  id uuid primary key default gen_random_uuid(),
  lesson_code text not null unique,          -- '1.1' .. '1.10'
  stage_id integer not null,                 -- 1..5, matches the pathway stages
  journey_step integer not null,             -- teaching order within the stage
  title text not null,
  strand text not null,                      -- EFACW strand
  keyword text not null,                     -- the lesson's single keyword
  catchphrase text not null,
  knowledge_intention text not null,
  emotional_intention text not null,
  misconception text not null,               -- 'children often think...' for the parent note
  parent_note text,                          -- extra guidance incl. the promise-keeping note
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_lesson_segments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.parent_lessons(id) on delete cascade,
  segment text not null check (segment in ('full','A','B','C')),
  video_url text not null,
  duration_seconds numeric,
  sort integer not null default 0,
  unique (lesson_id, segment)
);

-- Pause cards and the quiz live between segments. card_type:
--   'ask'  = PAUSE & ASK (grown up asks the child; older_variant for 6 to 7s)
--   'say'  = PAUSE & SAY (the exact words the grown up says)
--   'quiz' = a What would DiGi do choice; options jsonb:
--            [{"text":..., "correct":bool, "reaction":...}, ...]
create table if not exists public.parent_lesson_cards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.parent_lessons(id) on delete cascade,
  position integer not null,                 -- 1 = after segment A, 2 = after B, 3+ = quiz after C
  card_type text not null check (card_type in ('ask','say','quiz')),
  prompt text not null,
  older_variant text,
  options jsonb,
  unique (lesson_id, position)
);

-- ── Progress ───────────────────────────────────────────────────────────────

create table if not exists public.parent_lesson_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  lesson_code text not null references public.parent_lessons(lesson_code),
  first_completed_at timestamptz not null default now(),
  last_completed_at timestamptz not null default now(),
  times_completed integer not null default 1,
  quiz_right_first_try boolean,
  stars_awarded integer not null default 10, -- 10 on first completion; +2 per redo (app writes the running total)
  unique (child_id, lesson_code)
);

create table if not exists public.stage_passports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  stage_id integer not null,
  awarded_at timestamptz not null default now(),
  unique (child_id, stage_id)
);

create index if not exists idx_plc_child on public.parent_lesson_completions(child_id);
create index if not exists idx_passports_child on public.stage_passports(child_id);
create index if not exists idx_pls_lesson on public.parent_lesson_segments(lesson_id);
create index if not exists idx_plcards_lesson on public.parent_lesson_cards(lesson_id);

-- ── RLS ────────────────────────────────────────────────────────────────────

alter table public.parent_lessons enable row level security;
alter table public.parent_lesson_segments enable row level security;
alter table public.parent_lesson_cards enable row level security;
alter table public.parent_lesson_completions enable row level security;
alter table public.stage_passports enable row level security;

-- Lesson content is readable by anyone (the kid link has no login; content is
-- not personal data). Writes are service role only.
drop policy if exists "read active parent lessons" on public.parent_lessons;
create policy "read active parent lessons" on public.parent_lessons
  for select using (active = true);

drop policy if exists "read parent lesson segments" on public.parent_lesson_segments;
create policy "read parent lesson segments" on public.parent_lesson_segments
  for select using (true);

drop policy if exists "read parent lesson cards" on public.parent_lesson_cards;
create policy "read parent lesson cards" on public.parent_lesson_cards
  for select using (true);

-- Progress rows: a parent sees and writes rows only for their own children.
-- (Kid link completions are written through the API with the service role,
-- same pattern as star lessons.)
drop policy if exists "parents read own children completions" on public.parent_lesson_completions;
create policy "parents read own children completions" on public.parent_lesson_completions
  for select using (
    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid()));

drop policy if exists "parents write own children completions" on public.parent_lesson_completions;
create policy "parents write own children completions" on public.parent_lesson_completions
  for insert with check (
    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid()));

drop policy if exists "parents update own children completions" on public.parent_lesson_completions;
create policy "parents update own children completions" on public.parent_lesson_completions
  for update using (
    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid()));

drop policy if exists "parents read own children passports" on public.stage_passports;
create policy "parents read own children passports" on public.stage_passports
  for select using (
    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid()));

drop policy if exists "parents write own children passports" on public.stage_passports;
create policy "parents write own children passports" on public.stage_passports
  for insert with check (
    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid()));
