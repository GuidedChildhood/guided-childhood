-- Guided Childhood, Migration 366
-- THE LESSON LOOP RUNS: the columns the child's lesson loop needs to be
-- honest, and nothing else.
--
-- Plan: plans/2026-10-08-lessons-hub-plan.md (version 10, PR 1). Ten versions
-- through a seven lens panel; every column below exists because the panel
-- found something it could not say without it.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.
--
-- ── WHY EACH COLUMN ────────────────────────────────────────────────────────
--
-- lesson_question_answers.phase, first_correct, run_id
--   The pass is the prove items on the SETTLED answer, and the parent is told
--   about the FIRST tap. One `correct` boolean cannot hold both, so `correct`
--   becomes the settled answer and `first_correct` the first tap, which is
--   also what orders the Remember check and the stage check (missed first).
--   `phase` comes from the deck, never the client, so the route can tell a
--   starter from a gate. `run_id` is per attempt: a retake carries the
--   settled correct rows forward in memory, and only the current run's rows
--   are written, or three items would claim two retrievals where one
--   happened.
--
-- kid_lesson_missions.attempts
--   Nothing counted tries. lesson_completions is upserted on
--   (user_id, child_id, lesson_id, lesson_source), so it holds one row per
--   child per lesson for ever. Without a count the third attempt is not
--   derivable, and the fail update has no idempotency key: a fail leaves
--   status at 'sent', so the status predicate matches again and a double tap
--   would increment twice and push twice.
--
-- kid_lesson_missions.paid_at
--   The stars pay once, on the first FINISH, not on the pass, so the check
--   stays the one place in the app where nothing rides on being right.
--   lib/quests/bank.ts derives the bank from mission rows with
--   status = 'done', so keying the payment on anything else pays nothing at
--   all. This is the column the bank reads, and the week is attributed by it.
--
-- kid_lesson_missions.nudged_at and noted_at
--   Two senders, two columns. noted_at is the app's own weekly note from the
--   Planet Friend; nudged_at is the parent's one nudge. One column could not
--   cap both, and nudged_at is set only when the push reports it was sent, so
--   a tap at half nine in quiet hours does not burn the one nudge a lesson
--   ever takes.
--
-- kid_lesson_missions.child_note
--   The child's own sentence, written by them ("Show my grown up") or typed
--   by a grown up under 7 ("What did Teo say?"). Shown to the parent
--   verbatim. Never fed back to the child in their parent's name.
--
-- kid_lesson_missions.done_together
--   Set only on a finish carrying the opener's cookie, so a lesson done on a
--   parent's phone says so at any age, and a child's own pass a week later is
--   never mislabelled.
--
-- kid_lesson_missions.status gains 'skipped'
--   A lesson that has sat three weeks can be swapped for a different one, and
--   a skipped module goes back in the list unlabelled and unlocked.
--
-- digi_prompts.parent_note
--   One optional line the parent types after tapping "Teo taught me", shown
--   to the child in the parent's own name. The child's own sentence
--   (child_note) must never feed it.
--
-- ───────────────────────────────────────────────────────────────────────────

-- 1 · THE ANSWERS LEDGER: first tap, settled answer, phase, and one run.
alter table public.lesson_question_answers add column if not exists phase text;
alter table public.lesson_question_answers add column if not exists first_correct boolean;
alter table public.lesson_question_answers add column if not exists run_id uuid;

comment on column public.lesson_question_answers.correct is
  'The SETTLED answer: right after the answer beat finished, retry included. The pass gates on this.';
comment on column public.lesson_question_answers.first_correct is
  'The FIRST tap. What the parent is told, and what orders the Remember and stage checks, missed first.';
comment on column public.lesson_question_answers.phase is
  'The slide phase, read from the deck and never from the client: starter, teach, practise, prove, close.';
comment on column public.lesson_question_answers.run_id is
  'One attempt. A retake mints a new one and writes only its own rows.';

-- Missed first ordering reads first_correct per child per question.
create index if not exists lesson_question_answers_child_first_idx
  on public.lesson_question_answers (child_id, first_correct);

-- 2 · THE MISSION: attempts, what was paid, who nudged, what was said.
alter table public.kid_lesson_missions add column if not exists attempts int not null default 0;
alter table public.kid_lesson_missions add column if not exists paid_at timestamptz;
alter table public.kid_lesson_missions add column if not exists nudged_at timestamptz;
alter table public.kid_lesson_missions add column if not exists noted_at timestamptz;
alter table public.kid_lesson_missions add column if not exists child_note text;
alter table public.kid_lesson_missions add column if not exists done_together boolean not null default false;

comment on column public.kid_lesson_missions.attempts is
  'Finishes, passing or not. The fail update is keyed on this value, and the third attempt is attempts >= 2.';
comment on column public.kid_lesson_missions.paid_at is
  'When the stars were paid, once, on the first finish. lib/quests/bank.ts reads this.';
comment on column public.kid_lesson_missions.nudged_at is
  'The parent nudged, and the push actually left. One per mission, ever.';
comment on column public.kid_lesson_missions.noted_at is
  'The app sent its own weekly note from the Planet Friend. One per mission, ever.';
comment on column public.kid_lesson_missions.child_note is
  'The child''s own sentence, or what a grown up typed for them under 7. Shown to the parent verbatim.';
comment on column public.kid_lesson_missions.done_together is
  'Finished on a parent''s phone, proved by the opener''s cookie. Never inferred from a query string.';

-- 'skipped': a stalled lesson swapped for a different one. Widened, never
-- narrowed: both values the live constraint held on 8 October 2026, plus one.
alter table public.kid_lesson_missions
  drop constraint if exists kid_lesson_missions_status_check;

alter table public.kid_lesson_missions
  add constraint kid_lesson_missions_status_check
  check (status in ('sent', 'done', 'skipped'));

-- The stall rule asks for missions sent and not passed, by age.
create index if not exists kid_lesson_missions_child_status_sent_idx
  on public.kid_lesson_missions (child_id, status, sent_at desc);

-- 3 · THE PARENT'S OWN LINE on the pass card.
alter table public.digi_prompts add column if not exists parent_note text;

comment on column public.digi_prompts.parent_note is
  'One optional line the parent typed for the child after tapping Teo taught me. Never the child''s own sentence.';

-- The Tool of the week writes one row per child per iso week. child_id is
-- nullable, so the index coalesces it or a null row would escape the lock.
create unique index if not exists digi_prompts_tool_week_once_idx
  on public.digi_prompts (coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid), reason)
  where reason like 'tool_week:%';
