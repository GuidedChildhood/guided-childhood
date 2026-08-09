-- What the child said they actually did, per step of the five a day.
--
-- Justin, 9 August 2026, from the child app: "something kind just flashed off
-- as soon as clicked so we need to make this really work and add a reminder
-- somewhere and track if done somehow."
--
-- The track if done half. Until now a step was a key in the `done` array and
-- nothing else, so the app knew a box went green and no more than that. Worse,
-- the parent had NO view of the five a day anywhere: a child ticked five things
-- a day, every day, and no grown up ever saw one of them.
--
-- A step that a child now confirms through a sheet can carry what they picked
-- with it, so the report reads "made someone a drink" rather than "kind ✓".
--
-- Keyed by step rather than a kind_note column on purpose. The sheet is not
-- special to kindness: tidy, make, maths, talk, the screen break and reading all
-- open the same one, and the next self tick step added costs nothing here.
--
-- Shape: { "kind": "Make someone a drink", "make": "Bake something" }
-- Absent keys are the normal case. A child confirms without picking an idea more
-- often than not, and that is a complete answer, not a missing one: they did the
-- step, they just did their own version of it.

alter table public.kid_days
  add column if not exists notes jsonb not null default '{}'::jsonb;

comment on column public.kid_days.notes is
  'Per step, what the child said they did, keyed by step key. Written by the confirm sheet on the child app. Absent keys mean the step was confirmed without picking an idea, which is normal.';

-- No new policies. kid_days already has parents read own kid days on select, and
-- every write goes through the service role in lib/kid/day-store, so a note is
-- covered by exactly the rules the row it sits on already had.
