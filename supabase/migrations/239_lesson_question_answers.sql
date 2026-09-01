-- Every question a family answers, kept. (Lesson excellence plan, step 2.)
--
-- Justin, 1 September 2026: "the questions all get stored for passport stage
-- pass and are added to a final test." The final test already gathers its
-- questions from the stage's own lessons; what nothing could do was remember
-- which of them THIS child had met and which they got wrong, because the
-- player counted answers in memory and posted only the totals.
--
-- One row per question answered, from the lesson player in both apps and
-- from both end of stage check surfaces. The stage check reads it to put a
-- child's missed questions first, which turns the check into retrieval
-- practice by design instead of luck, and it is honest evidence behind the
-- passport stamp: not just a score, the actual questions held.
--
-- Append only, like stage_quiz_passes: history is the point. The question is
-- stored as text rather than an id because questions live inside the slides
-- JSONB and carry no ids; text matching is exactly how the stage quiz pool
-- dedupes already.

create table if not exists public.lesson_question_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Null means the household, the same meaning it carries everywhere else.
  child_id uuid references public.children(id) on delete cascade,
  -- lesson | ai_lesson | school_lesson | stage_check
  source text not null default 'lesson',
  -- The lesson the question was met in; null for a stage check run.
  lesson_id uuid,
  -- The stage a check run belonged to; null for in lesson answers.
  stage_id integer,
  question text not null,
  chosen text not null default '',
  correct boolean not null,
  answered_at timestamptz not null default now()
);

-- The stage check's read: this child's history, newest first.
create index if not exists lesson_question_answers_child_idx
  on public.lesson_question_answers (user_id, child_id, answered_at desc);

alter table public.lesson_question_answers enable row level security;

drop policy if exists "Own question answers" on public.lesson_question_answers;
create policy "Own question answers" on public.lesson_question_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
