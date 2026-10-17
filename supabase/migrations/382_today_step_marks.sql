-- 382: a step on today's path, marked done by the parent.
--
-- Justin, 17 October 2026: a step that takes the parent off the path (DiGi,
-- the devices job) must let them mark it done so it goes green, "otherwise
-- they are stuck on digi instead of going back to path".
--
-- Most rungs finish themselves: a check in is a scale moved, a lesson is a
-- lesson passed, quests are a tick approved. Two do not. DiGi only went green
-- on a question asked, so a parent who read the advice and had nothing to ask
-- was left on the page with no way to say they were done. The passport job
-- only went green on a whole section finished, which can take a week.
--
-- One row is one parent saying "done" for one step, for one child, on one
-- day. Its own table rather than a fake row in digi_questions, so DiGi's log
-- stays a log of questions somebody actually asked.
--
-- Additive and idempotent. Supabase editor rules: flat statements, no DO
-- blocks, no semicolons inside string literals.

create table if not exists public.today_step_marks (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        references public.children(id) on delete cascade,
  day        date        not null,
  step_key   text        not null check (step_key in ('digi', 'passport')),
  created_at timestamptz not null default now()
);

-- One mark per parent, child, day and step. A household mark (no child) is
-- its own slot, which is why the child is coalesced rather than left null:
-- nulls never collide in a plain unique index.
create unique index if not exists uq_today_step_marks
  on public.today_step_marks (user_id, coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid), day, step_key);

alter table public.today_step_marks enable row level security;

-- Who may reach it (scripts/check-migration-grants.mjs): from 30 October 2026
-- Supabase stops granting new public tables to the Data API by default, and
-- app/api/daily/mark-step reads and writes this with the parent's session.
-- Idempotent; a table created before that date already holds these grants.
grant select, insert on public.today_step_marks to authenticated;
grant select, insert, update, delete on public.today_step_marks to service_role;

drop policy if exists "today_step_marks own read" on public.today_step_marks;
create policy "today_step_marks own read" on public.today_step_marks
  for select using (auth.uid() = user_id);

drop policy if exists "today_step_marks own insert" on public.today_step_marks;
create policy "today_step_marks own insert" on public.today_step_marks
  for insert with check (auth.uid() = user_id);
