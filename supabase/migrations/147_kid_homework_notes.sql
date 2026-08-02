-- Homework stops being a box to tick and becomes somewhere to put the homework.
--
-- "Homework done" asked a child to self certify and gave them nothing back. A
-- tick that records no information is the weakest row of the five: nobody can
-- act on it, a parent cannot see what was set, and a child gets no credit for
-- the thing they actually did.
--
-- Justin: "can it be they click and it's a free type note to store their
-- homework". So the row now opens a note. What the child writes is the record,
-- and writing it is what completes the step.
--
-- One note per child per day. A child who opens it twice is editing the same
-- note, not stacking a second one, which is what the unique key is for. The day
-- is a date rather than a timestamp so it lines up with kid_days and with every
-- other date in the app.
--
-- Deliberately NOT sent to a parent for approval. Homework is between the child
-- and their school; the value here is a child having one place to put it and a
-- parent being able to see it if they look. Putting an approval gate on it would
-- make it another thing to be checked on, which is the opposite of the point.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.kid_homework_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  day date not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kid_homework_notes
  drop constraint if exists kid_homework_notes_child_day_key;
alter table public.kid_homework_notes
  add constraint kid_homework_notes_child_day_key unique (child_id, day);

create index if not exists idx_kid_homework_notes_child_day
  on public.kid_homework_notes (child_id, day desc);

alter table public.kid_homework_notes enable row level security;

-- The parent owns the row and can read what their child wrote. The child app
-- never uses this policy: it has no account, and its writes go through the
-- service key exactly like every other child route.
drop policy if exists "kid_homework_notes owner" on public.kid_homework_notes;
create policy "kid_homework_notes owner" on public.kid_homework_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

comment on table public.kid_homework_notes is
  'What a child typed into the Homework step, one note per child per day. The note IS the completion: writing it ticks the step. Never sent for parent approval.';
