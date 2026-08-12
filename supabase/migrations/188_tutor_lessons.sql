-- Guided Childhood — Migration 188
-- The private tutor: a lesson built for one child, from the homework in front
-- of their parent, played on the child's own phone.
--
-- Justin, 11 August 2026: "the homework decoder, can it match whatever evidence
-- we can research for typical homework given for a particular part of the
-- syllabus, then can we develop a lesson to match that can be sent to a child."
--
-- ── WHY THE SLIDES ARE STORED, WHICH IS THE WHOLE ARCHITECTURE ──────────────
--
-- There is not one Anthropic call anywhere on the child's side of this product,
-- and migration 064 says why in a line: always from the parent, never a message
-- from us to the child. A tutor that talks back would overturn that quietly, so
-- it does not.
--
-- Instead the deck is generated ONCE, on the parent's side, before they have
-- sent anything. The parent reads it, bins it or sends it, and what the child
-- opens is a row in this table. No model runs on their phone. That is what the
-- slides column buys, and it is the reason this table exists at all rather than
-- the lesson being assembled on demand like the decode is.
--
-- ── WHY objective_ids ───────────────────────────────────────────────────────
--
-- Migration 108 made source NOT NULL on every curriculum objective and said why:
-- an objective nobody can trace cannot be inserted at all. A generated lesson
-- inherits that. These are the statutory lines the deck was built from, so any
-- lesson can be walked back to the curriculum it came from, and a deck built off
-- an objective we later correct can be found.
--
-- ── WHAT IS DELIBERATELY NOT HERE ───────────────────────────────────────────
--
-- No score, no grade, no level, no mark. The learning surface has refused
-- assessment data from the start on the grounds that we hold none and could not
-- answer honestly if we tried, and a tutor does not change that. done_at says
-- the child finished it. Whether they found it easy is theirs.
--
-- Supabase editor rules: idempotent creates, flat statements, no DO blocks.

create table if not exists public.tutor_lessons (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  -- Where the lesson came from. 'homework' is a parent pasting tonight's sheet,
  -- 'checkpoint' is practice for a real national check (the Year 1 phonics
  -- screening, the Year 4 tables check, the Year 6 SATs).
  origin        text        not null default 'homework',
  year_group    int         not null,
  subject       text,
  objective_ids uuid[]      not null default '{}',
  title         text        not null,
  emoji         text,
  -- The deck, in the shared/lesson-slides contract. Read by the player on both
  -- sides. parseSlides skips slide types a build does not know rather than
  -- failing, so a deck outliving a deploy degrades to a shorter lesson.
  slides        jsonb       not null,
  stars         int         not null default 3,
  created_at    timestamptz not null default now(),
  -- Null until the parent sends it. A generated deck the parent never sent is
  -- invisible to the child, which is the point of generating it early.
  sent_at       timestamptz,
  done_at       timestamptz,
  cleared_at    timestamptz
);

create index if not exists idx_tutor_lessons_open
  on public.tutor_lessons (child_id, sent_at desc)
  where sent_at is not null and done_at is null and cleared_at is null;

create index if not exists idx_tutor_lessons_family
  on public.tutor_lessons (user_id, created_at desc);

alter table public.tutor_lessons enable row level security;

drop policy if exists "tutor_lessons_own" on public.tutor_lessons;

-- The family and nobody else. The child reads their lesson through the service
-- role scoped by their link token, exactly as the star lessons do, so there is
-- no anon policy here and there must never be one: the deck is written for one
-- named child and holds the statutory lines it was built from.
create policy "tutor_lessons_own" on public.tutor_lessons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

comment on table public.tutor_lessons is
  'A lesson generated for one child from their own homework or an upcoming national check. Slides are stored rather than generated on demand so that no model ever runs on the child device. Holds no grade or score by design.';

comment on column public.tutor_lessons.objective_ids is
  'The curriculum_objectives rows this deck was built from. Provenance, in the spirit of migration 108: a lesson nobody can trace back to the statutory wording should not have been made.';
