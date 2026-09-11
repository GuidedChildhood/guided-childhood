-- 290_the_tool_is_on_the_slide_that_needs_it.sql
--
-- A QUESTION YOU CANNOT ANSWER FROM THE SCREEN.
--
-- Justin, looking at ks3-12 on the wall: "should we show somewhere the 3 checks
-- so we know what the answers refer to?"
--
-- The slide asks "a post makes you furious the second you see it, which check
-- does that feeling trigger?" and offers "Check three: how is it trying to make
-- me feel", "No check", "Check one only". The three checks were taught nine
-- slides earlier and are nowhere on screen. A pupil who cannot remember the
-- numbering cannot reach the thinking, so the question stops measuring the
-- thinking and starts measuring memory for a list.
--
-- Every module already carries its one tool in teacher_notes.tool. It is on the
-- overview page, the poster and the organiser, and it was never once shown
-- inside the player. This migration turns it on for the slides that need it,
-- and the player renders it as a quiet numbered strip under the question.
--
-- WHICH SLIDES, and the sweep that decided it. Every choice slide in all 23
-- modules was checked for options too short to stand on their own, true and
-- false pairs excluded. Three came back:
--
--   ks3-12 slide 15 and 16, options reading "Check one" and "Check three"
--   ks4-15 slide 18, a quick fire whose options are the bare technique names
--   Urgency, Flattery and Outrage, which its tool names in full
--
-- TWO NEAR MISSES LEFT ALONE, on purpose.
--
--   ks4-15 slide 8 offers "Confirm shaming", "Fake urgency" and "Roach motel".
--   Those are dark pattern names, not the tool, and the slide teaching them is
--   immediately before it. Nothing is off screen.
--
--   ks4-16 slide 4 offers "Urgency", "Flattery" and "FOMO" and is a RETRIEVAL
--   starter from the previous lesson. Recalling the list without being shown it
--   is the entire point of retrieval practice. Putting the answer on the wall
--   there would quietly delete the exercise.
--
-- Opt in per slide rather than automatic, because a strip on every choice slide
-- is wallpaper by the third one and stops being read at all.
--
-- Idempotent: setting a key that already holds true changes nothing. Backed up.

begin;

create table if not exists schools.school_lessons_backup_290 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_290 enable row level security;

-- ks3-12: "which check does that feeling trigger?" and "which check fails first?"
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(slides, '{15,toolStrip}', 'true'::jsonb), '{16,toolStrip}', 'true'::jsonb)
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->15->>'type' = 'choice'
   and slides->16->>'type' = 'choice'
   and slides->15->>'question' ilike '%which check does that feeling%';

-- ks4-15: the quick fire whose options are bare technique names.
update schools.school_lessons
   set slides = jsonb_set(slides, '{18,toolStrip}', 'true'::jsonb)
 where module_id = 'ks4-15-manipulation-persuasion'
   and slides->18->>'type' = 'choice'
   and slides->18->>'question' ilike 'quick fire%';

-- Guards.
do $mig$
declare n int; bad text;
begin
  -- 1. Exactly three slides carry the strip, and they are the three intended.
  select string_agg(l.module_id || ' slide ' || (ord - 1), ', ' order by l.module_id || ' slide ' || (ord - 1)) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality t(s, ord)
   where (s->>'toolStrip')::boolean;
  if bad is distinct from 'ks3-12-misinfo-deepfakes slide 15, ks3-12-misinfo-deepfakes slide 16, ks4-15-manipulation-persuasion slide 18' then
    raise exception 'Migration 290: the strip should sit on three named slides, found %', coalesce(bad, 'none');
  end if;

  -- 2. Every slide carrying the strip is a choice slide whose module actually
  --    has a tool to show. A strip with nothing behind it renders nothing and
  --    would leave the question exactly as unanswerable as before.
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where (s->>'toolStrip')::boolean
     and (s->>'type' <> 'choice'
       or coalesce(jsonb_array_length(l.teacher_notes->'tool'->'lines'), 0) = 0);
  if bad is not null then raise exception 'Migration 290: strip on a slide with no tool behind it, on %', bad; end if;

  -- 3. The retrieval starter is still bare. ks4-16 slide 4 asks a class to
  --    recall the techniques from the previous lesson, and showing them would
  --    delete the exercise rather than support it.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks4-16-consent-images-law'
     and s->>'phase' = 'starter' and (s->>'toolStrip')::boolean;
  if n > 0 then raise exception 'Migration 290: the retrieval starter must not show the answer'; end if;
end $mig$;

commit;
