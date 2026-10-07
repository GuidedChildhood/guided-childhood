-- 362_the_quiz_slides_match_the_wall.sql
--
-- Two things the pilot review found on quiz slides, 7 October 2026. In both,
-- what the wall shows and what the lesson says had come apart.
--
-- 1. THREE SCRIPTS ASK FOR A LETTER THE CLASS CANNOT SEE. They tell the room
--    to answer "for a, b, c", and the wall numbers the same three answers 1, 2
--    and 3 on keycaps. A teacher reading the script aloud asks for a letter
--    nobody can find. Two of the three are in the free sample lesson, the first
--    thing a school opens.
--
--      ks3-12-misinfo-deepfakes   slides 12 and 17
--      ks3-10-mood-and-screens    one slide
--
--    Each becomes "for one, two or three", the way the rest of the scheme
--    already says it. Only the script text moves.
--
-- 2. THE RIGHT ANSWER WAS UNDER THE TEACHER SCRIPT. ks4-15 slide 20, in a
--    secondary pilot lesson, asks the class to name the technique: a three line
--    question with the tool strip beneath it. Migration 290 put the strip there
--    on purpose, because the answers are bare technique names and the strip
--    spells them out. On a 1920 projector that left Flattery and Outrage on the
--    wall and Urgency, the right answer, out of sight below them.
--
--    The strip is now one line on the wall (shared/components/LessonPlayer.tsx),
--    and the question drops "booking", "at this price" and "In high demand",
--    which the two numbers already say, so it sits on two lines:
--
--      was  Quick fire. A hotel booking site shows: Only 2 rooms left at this
--           price! In high demand, booked 7 times today. Name the technique.
--      now  Quick fire. A hotel site says: Only 2 rooms left! Booked 7 times
--           today. Name the technique.
--
--    Measured through the real player with the strip, at 1920x1080 and
--    1366x768: 94px and 90px hidden before, 16px and 34px after, inside
--    check-wall-fit's 40px slack. The three feedback lines and the script
--    still read true against the shorter question.
--
-- The mirrors in content/modules carry the same words.
--
-- Idempotent. Backed up first. Proved: no "a, b, c" left in either lesson,
-- three scripts changed, the ks4-15 question is the new one and nothing else in
-- that lesson moved, and no lesson changed its slide count.

begin;

create table if not exists schools.school_lessons_backup_362 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens', 'ks4-15-manipulation-persuasion');

alter table schools.school_lessons_backup_362 enable row level security;

update schools.school_lessons
   set slides = replace(slides::text, 'for a, b, c.', 'for one, two or three.')::jsonb
 where module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
   and slides::text like '%for a, b, c.%';

update schools.school_lessons
   set slides = jsonb_set(slides, '{19,question}',
         to_jsonb('Quick fire. A hotel site says: Only 2 rooms left! Booked 7 times today. Name the technique.'::text))
 where module_id = 'ks4-15-manipulation-persuasion'
   and slides->19->>'type' = 'choice'
   and slides->19->>'question' = 'Quick fire. A hotel booking site shows: Only 2 rooms left at this price! In high demand, booked 7 times today. Name the technique.';

do $$
declare left_over int; changed int; asked text; moved int; resized int;
begin
  select count(*) into left_over
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
     and s->>'script' like '%a, b, c%';
  if left_over > 0 then
    raise exception 'Migration 362: % script(s) still say a, b, c', left_over;
  end if;

  select count(*) into changed
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
     and s->>'script' like '%for one, two or three.%';
  if changed < 3 then
    raise exception 'Migration 362: expected at least 3 scripts to read one, two or three, found %', changed;
  end if;

  select slides->19->>'question' into asked
    from schools.school_lessons
   where module_id = 'ks4-15-manipulation-persuasion';
  if asked is distinct from 'Quick fire. A hotel site says: Only 2 rooms left! Booked 7 times today. Name the technique.' then
    raise exception 'Migration 362: ks4-15 slide 20 asks %', coalesce(asked, 'nothing');
  end if;

  -- Nothing else in ks4-15 moved: every slide matches the backup once slide
  -- 20's question is set aside.
  select count(*) into moved
    from schools.school_lessons_backup_362 b
    join schools.school_lessons l using (module_id)
    join lateral jsonb_array_elements(b.slides) with ordinality bt(s, ord) on true
    join lateral jsonb_array_elements(l.slides) with ordinality lt(s, ord) on lt.ord = bt.ord
   where b.module_id = 'ks4-15-manipulation-persuasion'
     and (case when bt.ord = 20 then bt.s - 'question' else bt.s end)
         is distinct from (case when lt.ord = 20 then lt.s - 'question' else lt.s end);
  if moved > 0 then
    raise exception 'Migration 362: % ks4-15 slide(s) changed beyond the slide 20 question', moved;
  end if;

  select count(*) into resized
    from schools.school_lessons_backup_362 b
    join schools.school_lessons l using (module_id)
   where jsonb_array_length(b.slides) <> jsonb_array_length(l.slides);
  if resized > 0 then
    raise exception 'Migration 362: % lesson(s) changed their slide count', resized;
  end if;
end $$;

commit;
