-- Guided Childhood — Migration 113
-- What happened when a child worked a learning sheet.
--
-- The sheet itself is not stored. It is assembled on the day from
-- curriculum_objectives for the child's year group, subject and term, so a
-- corrected objective improves every sheet printed after it rather than
-- leaving old copies quietly wrong. What is worth keeping is what came back.
--
-- ── The tricky flags are the product ─────────────────────────────────────────
--
-- Not the score. The child works through and marks anything they found hard,
-- and that flag reaches the parent as a plain line: she is shaky on column
-- subtraction. That is a place to help, which is useful, rather than a mark out
-- of ten, which is a judgement.
--
-- The child is deliberately never shown a number. Decided 25 July and worth
-- restating here because it is the kind of thing a later change would undo
-- without realising: a score turns a warm shared thing into a test that judges
-- them, and a judged child stops flagging what they found hard, which is the
-- entire mechanism. The parent gets the substance either way.
--
-- Objective ids rather than free text, so a flag stays attached to the exact
-- statutory line and a parent summary can always name it precisely.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.learning_sheet_results (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  curriculum    text        not null default 'england',
  year_group    integer     not null,
  subject       text        not null,
  term          text        not null,
  -- The objectives the child marked as hard. Empty is a real answer: it means
  -- they found none of it tricky, which is worth knowing too.
  tricky        uuid[]      not null default '{}',
  -- Stars awarded, so a finished sheet lands on the same balance as a job and
  -- counts on the off screen total like every other printable.
  stars         integer     not null default 0,
  completed_at  timestamptz not null default now()
);

create index if not exists idx_learning_results_child
  on public.learning_sheet_results (child_id, completed_at desc);

alter table public.learning_sheet_results enable row level security;

drop policy if exists "learning_results_own" on public.learning_sheet_results;

-- A family reads and writes only its own results.
create policy "learning_results_own" on public.learning_sheet_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
