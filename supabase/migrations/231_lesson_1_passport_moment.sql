-- Guided Childhood — Migration 231
-- The passport moment: lesson 1 learns to explain what it is earning.
--
-- RENUMBERED from 230 in the merge of main into PR #926: two lanes claimed
-- 230 within minutes on 29 August and the passport codes lane's
-- 230_school_home_codes.sql merged first (#925). Renumbering the newer one is
-- the repo convention (see the wiring check). The content is unchanged and
-- had already been applied to production under its old number; it is
-- idempotent (strips its own slide before re-inserting), so running it again
-- as 231 is safe and changes nothing.
--
-- Justin, 29 August: one lesson from start to finish, everything in one run,
-- explaining the concept of earning the passport. The lesson had everything
-- except the why: a child finished it with the tool and the chant and no idea
-- that any of it was going anywhere. The parents app has carried the answer
-- for weeks, the five stage passport to sixteen, and the schools lesson never
-- once mentioned it.
--
-- VOCABULARY IS LAW HERE. The wording below follows the passport language
-- audit (29 August) and the locked decisions from the passport codes plan:
--   SAY: the passport, earn, stamp, page, fills the page, the journey to 16,
--        the big check, credit language ("your class covered this, the
--        passport records it").
--   NEVER: "digital passport" (collides with a UKCIS tool for children in
--        care), "test" or "pass or fail", "safe" or "ready for social media"
--        as a claim, any venue claim (a stamp never records where it was
--        earned), any countdown. Nobody fails the passport; it only fills.
--
-- One new slide (digi type, so DiGi Junior speaks it), placed between the
-- chant and the goodbye so the lesson ends: recap, chant, why it matters,
-- goodbye. Plus one line on the printed parent note, because the passport is
-- the school to home thread and the note is the only thing that reliably
-- crosses it. Timing 32 to 33 minutes.
--
-- Supabase editor rules: idempotent, flat statements. Safe to re-run: strips
-- its own slide before re-inserting.

update schools.school_lessons
set slides = (
  select coalesce(jsonb_agg(s order by ord), '[]'::jsonb)
  from jsonb_array_elements(slides) with ordinality t(s, ord)
  where not (s->>'type' = 'digi' and s->>'heading' = 'The passport')
)
where module_id = 'eyfs-01-screens-kindness';

update schools.school_lessons
set slides = (
  select jsonb_agg(s order by pos)
  from (
    select s, ord::numeric as pos
    from jsonb_array_elements(slides) with ordinality t(s, ord)
    union all
    select jsonb_build_object(
      'type', 'digi',
      'phase', 'close',
      'minutes', 1,
      'heading', 'The passport',
      'lines', jsonb_build_array(
        'Today filled a little bit of your passport page.',
        'Every lesson here and every job at home fills it a little more.',
        'A full page brings the big check, and the big check earns the stamp!'
      ),
      'script', 'DiGi Junior saves his favourite thing for last. Say: DiGi Junior keeps a special book called the passport. It is the book of getting ready for phones and screens, all the way to sixteen. Every lesson we do together fills a little bit of the page, and jobs at home fill it too. When a page is full, DiGi asks five little questions, the big check, and the page earns its stamp. Nobody can fail the passport and nothing in it ever runs out. It only ever fills up. The note going home today tells your grown ups about it, so they can follow the page at home. Read the three lines with the class as they appear, and on the last one let everybody shout the word stamp.'
    ),
    (
      select min(ord) - 0.5
      from jsonb_array_elements(slides) with ordinality t2(s2, ord)
      where s2->>'type' = 'digi' and s2->>'heading' = 'DiGi Junior says goodbye'
    )
  ) z
)
where module_id = 'eyfs-01-screens-kindness';

-- The line that crosses to home. Rendered by the printed parent note; written
-- so it works for a family that has never heard of us: it introduces the idea
-- and asks the child, it does not require an app.
update schools.school_lessons
set parent_note = jsonb_set(
  parent_note,
  '{passport}',
  '"Today also filled a little of your child''s passport page. The passport is the journey to sixteen that home and school walk together: lessons fill it at school, jobs and little wins fill it at home, and each stage of growing up ends with a stamp. Ask your child about DiGi Junior''s special book."',
  true
)
where module_id = 'eyfs-01-screens-kindness';

update schools.school_lessons
set teacher_notes = jsonb_set(
  teacher_notes,
  '{timing}',
  '"33 minutes: connect 2, starter 8, teaching 10, sorting game 4, circle time practice 6, prove 4, close 4"'
)
where module_id = 'eyfs-01-screens-kindness';

-- CASTING FIX. The title slide carried no character key, so introCharacterFor
-- fell back to its title regex, /screen|game|.../ matched "Screens and
-- kindness", and the lesson opened on ORBIT playing football. The lesson's
-- cast is Pebble with DiGi Junior, and Pebble's clip is the celebrate one.
-- The wrong friend at the door is exactly the kind of thing a four year old
-- notices and a teacher cannot explain. The title slide sits at index 1
-- because the star breath settle was placed in front of it by migration 199.
update schools.school_lessons
set slides = jsonb_set(slides, '{1,character}', '"celebrate"')
where module_id = 'eyfs-01-screens-kindness'
  and slides->1->>'type' = 'title'
  and slides->1->>'character' is null;
