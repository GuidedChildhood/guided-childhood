-- Guided Childhood — Migration 107
-- Which line actually worked.
--
-- DiGi offers three calibrated lines in a rehearsal and the parent taps one.
-- We have never recorded which. So the only thing DiGi learns from a script is
-- whether the SCRIPT helped, at the level of the whole page, when the thing
-- that actually varies is the individual sentence a parent said out loud.
--
-- Asking "which one worked best?" at the end of the rehearsal is the obvious
-- place and the wrong one: nothing has happened yet. The parent has practised
-- against a simulated child, and an answer about a simulation is not evidence,
-- it is a preference. Training DiGi on it would teach DiGi which lines sound
-- good to a parent sitting calmly at a laptop, which is close to the opposite
-- of what we want to know.
--
-- So it splits in two. The rehearsal records the lines a parent took away, with
-- no question attached. Then the existing Did this help prompt, which fires
-- after a parent has been through the real moment with a real child, asks the
-- one extra question worth asking: of the lines you took, which one worked.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

-- The lines a parent actually took out of a rehearsal, so the follow up can
-- offer their own lines back rather than a generic list.
create table if not exists public.script_lines_used (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  script_sort_order int         not null,
  line              text        not null check (char_length(line) between 1 and 400),
  created_at        timestamptz not null default now(),
  unique(user_id, script_sort_order, line)
);

create index if not exists idx_script_lines_used
  on public.script_lines_used (user_id, script_sort_order, created_at);

alter table public.script_lines_used enable row level security;

drop policy if exists "script_lines_used_own" on public.script_lines_used;

create policy "script_lines_used_own" on public.script_lines_used
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The winner, kept beside the rating it belongs to rather than in a table of
-- its own, because it only ever means anything next to a yes.
alter table public.script_completions
  add column if not exists worked_line text;
