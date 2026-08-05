-- WHO passed the lesson, not just that the family did.
--
-- lesson_completions is keyed (user_id, lesson_id, lesson_source) and is written
-- by BOTH the parent's route and the child's own link, which upsert the same
-- row. So the family has exactly one completion per lesson and no record of who
-- sat it. For everything built so far that was the right shape: the passport
-- asks whether the household has covered a lesson, and a child doing it on the
-- sofa counts.
--
-- The road to social media needs the other answer.
--
-- Justin: "every month we need an appearance of Nova that says come this way for
-- the road to social media. It needs to then only be completed when they
-- complete relevant lesson on social media AND children have done their
-- necessary part, like an extra on the Duolingo pathway, keeps them on track to
-- get the passport pass."
--
-- Both sides, separately. A parent who has read about grooming and a thirteen
-- year old who has not is exactly the gap that road exists to close, and with
-- one shared row it is invisible.
--
-- Additive on purpose. lesson_completions keeps its meaning and every existing
-- reading of it is untouched; this table sits alongside and answers the narrower
-- question. Rows here are written best effort by the two completion routes, so a
-- failure to record who never costs anybody their pass.

create table if not exists public.lesson_pass_by (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  lesson_id  uuid        not null references public.lessons(id) on delete cascade,
  -- 'parent' when it came through the signed in dashboard, 'child' when it came
  -- through a kid link. Never inferred: each route knows which it is.
  who        text        not null check (who in ('parent', 'child')),
  -- Which child. Null for the parent's own pass, since a parent watching a
  -- lesson is watching it for the family rather than for one child.
  child_id   uuid        references public.children(id) on delete cascade,
  passed_at  timestamptz not null default now()
);

alter table public.lesson_pass_by enable row level security;

drop policy if exists "lesson_pass_by_own" on public.lesson_pass_by;
create policy "lesson_pass_by_own" on public.lesson_pass_by
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- One row per side per lesson. Two partial indexes rather than one constraint,
-- because a null child_id does not conflict with itself in Postgres: without
-- the first of these, every parent replay of a lesson would write another row.
create unique index if not exists lesson_pass_by_parent_once
  on public.lesson_pass_by (user_id, lesson_id) where child_id is null;
create unique index if not exists lesson_pass_by_child_once
  on public.lesson_pass_by (user_id, lesson_id, child_id) where child_id is not null;

-- The road reads every leg for one child in one go.
create index if not exists lesson_pass_by_lookup
  on public.lesson_pass_by (user_id, lesson_id);
