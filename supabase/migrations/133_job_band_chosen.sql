-- The part of the day a job belongs to, chosen rather than guessed.
--
-- Three reminder crons already run on exactly these bands: 07:15, 16:30 and
-- 18:45. What decided which band a job fell into was bandForJob(title), a
-- keyword match over the words the parent happened to type. "Feed the cat"
-- contains "cat", so it landed in after school, in a house that feeds the cat
-- at seven in the morning. The reminder then arrived at the wrong end of the
-- day and nothing anywhere let the parent say otherwise.
--
-- It is the same fault the repeat picker fixed: a default nobody can see is a
-- default nobody agreed to.
--
-- Null keeps the guess.
--
-- Deliberately not backfilled. A null band means "work it out from the title",
-- which is precisely what happens today, so every existing job behaves exactly
-- as it did this morning. Only a job whose band a parent has actually chosen
-- carries a value, and only that job stops being guessed at.

alter table public.family_quests
  add column if not exists band text;

comment on column public.family_quests.band is
  'morning, after_school or evening when the parent chose. Null means derive from the title, which is the behaviour that predates this column.';

-- Guards the three values the reminder crons know how to fire on. Anything
-- else would be a job that silently never reminds.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'family_quests_band_check'
  ) then
    alter table public.family_quests
      add constraint family_quests_band_check
      check (band is null or band in ('morning', 'after_school', 'evening'));
  end if;
end $$;
