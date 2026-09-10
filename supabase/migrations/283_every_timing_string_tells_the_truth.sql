-- 283_every_timing_string_tells_the_truth.sql
--
-- THE LAST DISHONEST NUMBER IN THE SCHEME.
--
-- 267 and 270 set out to remove optimistic arithmetic from the lesson
-- timings, and 281 finished the cycle budgets. One number was still wrong
-- everywhere: the timing string a teacher reads when planning the period.
--
-- None of the 21 original modules had its string recomputed after 271 added
-- video alternatives, 278 split fourteen slides, 279 added twenty starter
-- beats and 280 added sixteen more. Every one of them under states its own
-- lesson, by two minutes on the smallest and six on eyfs-01, which says 33
-- and runs 39. A teacher planning a period from the string meets the
-- difference mid lesson, which is the exact failure 267 named on ks3-12 and
-- fixed for that module alone.
--
-- WHAT EACH NUMBER IS. Every figure below is the sum of the slides that part
-- of the lesson actually contains, taken from the live decks. The cycle
-- figures are the post 281 cycle minutes, so the string and the chrome now
-- agree. Nothing about any lesson changes: not a slide, not a script, not a
-- cycle, not a quiz. Only the description of what is already there.
--
-- THREE THINGS THE OLD STRINGS ALSO HAD WRONG, found by doing the sums:
--   ks2-04 listed three cycles for a four cycle deck.
--   ks4-16 listed cycles two and three in the wrong order, 7 then 9 when the
--     deck runs 9 then 7, and still called cycle three "pressure", the title
--     281 replaced because it anchored to nothing.
--   eyfs-01 stated 33 while its own components summed to 38 and the deck ran
--     39, so it disagreed with itself as well as with the lesson.
--
-- WHAT THIS DELIBERATELY DOES NOT DO. Twenty of these lessons now honestly
-- run past an hour. Only ks3-12 carries a plan for a shorter period, written
-- by the session that built it, and its numbers are updated here rather than
-- replaced. Writing that plan for the other twenty is a curriculum decision
-- about what a teacher should cut, not arithmetic, so it is left for the
-- schools lane rather than invented here.
--
-- Idempotent: sets an absolute value per module, so a rerun writes the same
-- string. Supabase editor rules: flat statements, no dashes in any copy.

create table if not exists schools.school_lessons_backup_283 as
  select id, module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_283 enable row level security;

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{timing}', to_jsonb(v.timing))
  from (values
  ('eyfs-01-screens-kindness',
   '39 minutes: connect 3, starter 8, teaching 10, sorting game 4, circle time practice 6, prove 4, close 4'),
  ('ks1-02-kind-screens-calm-bodies',
   '45 minutes: starter 10, cycle one 3, cycle two 10, practise 10, prove 4, close 4, class interactive 4'),
  ('ks1-03-real-pretend-computer',
   '47 minutes: starter 12, teach cycles 14, practise 10, prove 4, close 3, class interactive 4'),
  ('ks2-04-screen-routines',
   '67 minutes: starter 11, cycle one 2, cycle two 7, cycle three 10, cycle four 9, practise 15, prove 4, close 5, class interactive 4'),
  ('ks2-05-gaming-time-spend',
   '70 minutes: starter 10, cycle one 11, cycle two 16, cycle three 5, practise 15, prove 4, close 5, class interactive 4'),
  ('ks2-06-how-algorithms-work',
   '69 minutes: starter 11, cycle one (algorithms are recipes) 13, cycle two (the feed loop) 9, cycle three (the bottomless bowl) 8, practise 15, prove 4, close 5, class interactive 4'),
  ('ks2-07-privacy-reputation',
   '69 minutes: starter 11, cycle one 13, cycle two 7, cycle three 10, practise 15, prove 4, close 5, class interactive 4'),
  ('ks2-08-kind-safe-online',
   '68 minutes: starter 10, cycle one 10, cycle two 6, cycle three 14, practise 15, prove 4, close 5, class interactive 4'),
  ('ks2-09-copyright-ownership',
   '68 minutes: starter 10, cycle one 11, cycle two 8, cycle three 11, practise 15, prove 4, close 5, class interactive 4'),
  ('ks3-10-mood-and-screens',
   '66 minutes: starter 10, cycle one 7, cycle two 6, cycle three 15, practise 15, prove 4, close 5, class interactive 4'),
  ('ks3-11-social-workarounds',
   '68 minutes: starter 10, cycle one (how the machine works) 12, cycle two (workaround culture) 11, cycle three (group chats and judgement) 7, practise 15, prove 4, close 5, class interactive 4'),
  ('ks3-12-misinfo-deepfakes',
   '70 minutes as scripted: starter 10, teach cycles 29 with the half time pause, spread race 4, paper practice 15, exit checks 4, close 8. To fit a 55 minute period: run one discussion instead of two, and give paper practice 10 with items five and six as homework.'),
  ('ks3-13-scams-fraud-money',
   '70 minutes: starter 10, cycle one 12, cycle two 12, cycle three 8, practise 15, prove 4, close 5, class interactive 4'),
  ('ks3-14-bodies-image-pressure',
   '68 minutes: starter 10, cycle one 6, cycle two 18, cycle three 6, practise 15, prove 4, close 5, class interactive 4'),
  ('ks4-15-manipulation-persuasion',
   '66 minutes: starter 10, cycle one dark patterns 11, cycle two engineered outrage 7, cycle three influencers and follow the money 10, practise 15, prove 4, close 5, class interactive 4'),
  ('ks4-16-consent-images-law',
   '66 minutes: starter 10, cycle one consent 6, cycle two the law 9, cycle three everyone is not sending them 7, cycle four options 6, practise 15, prove 4, close 5, class interactive 4'),
  ('ks4-17-sextortion',
   '70 minutes: starter 10, cycle one 14, cycle two 8, cycle three 10, practise 15, prove 4, close 5, class interactive 4'),
  ('ks4-18-radicalisation-misogyny',
   '66 minutes: starter 10, cycle one 13, cycle two 9, cycle three 7, practise 15, prove 4, close 4, class interactive 4'),
  ('ks4-19-readiness-at-16',
   '68 minutes: starter 9, cycle one 16, cycle two 6, cycle three 11, practise 15, prove 4, close 3, class interactive 4'),
  ('ks5-20-ai-mastery-data-rights',
   '63 minutes: starter 10, cycle one 11, cycle two 11, cycle three 4, practise 15, prove 4, close 4, class interactive 4'),
  ('ks5-21-digital-identity-future-work',
   '63 minutes: starter 10, cycle one (identity as portfolio) 9, cycle two (the jobs landscape) 12, cycle three (skills that endure) 7, practise 12, prove 4, close 5, class interactive 4')
) as v(module_id, timing)
 where l.module_id = v.module_id;

-- ── Guards ───────────────────────────────────────────────────────────
do $$
declare bad text; n int;
begin
  -- 1. THE WHOLE SCHEME, not just this migration's rows. 282 held ks3-22 to
  --    an honest timing string and said it was the only module that could
  --    meet it. After this, every module can, so the check goes scheme wide.
  select string_agg(l.module_id || ' says ' || stated || ' and runs ' || actual, ', ')
    into bad
  from schools.school_lessons l
  cross join lateral (
    select (regexp_match(l.teacher_notes->>'timing', '^(\d+)'))[1]::int as stated,
           (select coalesce(sum((s->>'minutes')::int), 0)
              from jsonb_array_elements(l.slides) s) as actual
  ) t
  where stated is distinct from actual;
  if bad is not null then
    raise exception 'Migration 283: timing string disagrees with the deck: %', bad;
  end if;

  -- 2. Every module still has a timing string at all.
  select count(*) into n from schools.school_lessons
   where coalesce(teacher_notes->>'timing', '') = '';
  if n > 0 then
    raise exception 'Migration 283: % module(s) left with no timing string', n;
  end if;

  -- 3. No dashes in the new copy. Justin, standing rule.
  select string_agg(module_id, ', ') into bad from schools.school_lessons
   where teacher_notes->>'timing' like '%-%';
  if bad is not null then
    raise exception 'Migration 283: dash in a timing string: %', bad;
  end if;

  -- 4. Nothing else in teacher_notes moved. Only the timing key may differ
  --    from the backup taken at the top of this migration.
  select string_agg(b.module_id, ', ') into bad
    from schools.school_lessons_backup_283 b
    join schools.school_lessons l on l.module_id = b.module_id
   where (l.teacher_notes - 'timing') is distinct from (b.teacher_notes - 'timing');
  if bad is not null then
    raise exception 'Migration 283: teacher_notes changed beyond timing on %', bad;
  end if;
end $$;
