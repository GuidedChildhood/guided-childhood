-- 289_the_pilot_lesson_gets_its_bookends.sql
--
-- THE LESSON WE SEND OUT.
--
-- ks3-12 is the pilot. It carries four video beats already, more than any other
-- module, three of them re rendered with Orbit in 286 and speaking their lines
-- word for word. This migration gives it the two bookends that make it the
-- lesson you can hand somebody and say: this is what the scheme is.
--
--   A DiGi welcome, one minute, straight after the title card.
--   A passport beat, one minute, just before DiGi closes the case.
--
-- Six animated beats in seventy two minutes, roughly one every twelve, and
-- every one of them speaks with a transcript beside it.
--
-- WHY THE BOOKENDS SIT WHERE THEY DO. Both land outside the teach phase, which
-- is where the cycles live. A cycle opens on the teach slide whose heading it
-- names and runs to the slide before the next one opens, so nothing in the
-- cycle map moves and no cycle budget needs recomputing. Guard 3 proves it:
-- teach still runs 29 minutes and the cycles still state 29. This is the
-- lesson 281 taught, applied before the fact rather than after.
--
-- The welcome goes after the title rather than before it, because on a
-- projector the title card is what orients a room. The class sees where they
-- are, then DiGi says hello.
--
-- WHAT DiGi SAYS, and it is the same thing the AI lessons teach. "I am a
-- machine, and I am quite good at this." The guide introducing itself as a
-- machine is not a throwaway. It is ks2-23 and ks3-22 in one line, from the
-- character best placed to say it.
--
-- THE PASSPORT BEAT EXISTS BECAUSE THE PASSPORT IS THE PRODUCT. Four to
-- sixteen, filled with things a child can do rather than birthdays they have
-- had. A lesson that ends by placing itself on that road is a different thing
-- from a lesson that just ends.
--
-- AND ks2-06 FINALLY SPEAKS. It was the last silent beat in the scheme, held
-- visible by guard 7 of 286. Same DiGi, now voiced, and its line hands the
-- next lesson its starting point: an app is following a recipe somebody wrote.
-- ks2-23's prior_knowledge already names that sentence as what a pupil brings
-- from ks2-06, so the two now match.
--
-- ONE FIELD GOES WITH IT. ks2-06 was the only beat still carrying an onScreen
-- claim, because its clip was the untouched July one. That clip is replaced
-- here, the new one was checked and the board could not be read, so the claim
-- goes the same way as the six in 288. Guard 6 asserts no beat anywhere still
-- makes it.
--
-- Idempotent for the ks2-06 swap, which is guarded on the old src. The two
-- inserts are NOT idempotent by construction, so guard 1 fails loudly on a
-- second run rather than quietly doubling the deck. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_289 as
  select id, module_id, slides, teacher_notes, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_289 enable row level security;

-- ks2-06: the last silent beat gets a voice, and loses its board claim.
update schools.school_lessons
   set slides = (jsonb_set(
                  jsonb_set(
                  jsonb_set(slides, '{1,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_083441_f5d4c661-8140-42b1-8b1e-ee4f26877a20.mp4'::text)),
                  '{1,alternative,described}', to_jsonb('DiGi, the golden star, floats at the front of a classroom, glowing softly and bobbing gently as it talks to the class. The children sit on the carpet and watch.'::text)),
                  '{1,alternative,spoken}', '["An app is following a recipe somebody wrote. Today you find out what that recipe is watching."]'::jsonb)
                ) #- '{1,alternative,onScreen}'
 where module_id = 'ks2-06-how-algorithms-work'
   and slides->1->>'type' = 'video'
   and slides->1->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4';

-- ks3-12: the DiGi welcome, straight after the title card.
update schools.school_lessons
   set slides = jsonb_insert(slides, '{1}', '{
         "type": "video",
         "phase": "starter",
         "minutes": 1,
         "caption": "DiGi opens the lesson",
         "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_083441_fd2c21fd-7acf-46a4-85a8-c45c344a643d.mp4",
         "script": "Let it play. It is eight seconds and it does the job the first minute of a lesson usually costs you: the room settles, and the guide tells them what it is before anybody asks.",
         "alternative": {
           "spoken": ["Hello. I am DiGi. I am a machine, and I am quite good at this. Shall we start?"],
           "described": "DiGi, the golden star, floats into shot at the front of the classroom, glowing softly and bobbing as it talks, then gives a small happy twirl with a trail of sparkles."
         }
       }'::jsonb, false)
 where module_id = 'ks3-12-misinfo-deepfakes'
   and jsonb_array_length(slides) = 29
   and slides->0->>'type' = 'title';

-- ks3-12: the passport beat, just before DiGi closes the case. The index is 29
-- because the insert above already moved everything down by one.
update schools.school_lessons
   set slides = jsonb_insert(slides, '{29}', '{
         "type": "video",
         "phase": "close",
         "minutes": 1,
         "caption": "Where this lesson sits on your passport",
         "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_083441_5fb23b96-ba77-4492-83a8-055570c7abac.mp4",
         "script": "The widening out. They have spent an hour on one skill, and this puts it on the road to sixteen. Worth saying out loud afterwards that the three checks they learned today are one of the stamps.",
         "alternative": {
           "spoken": ["From four to sixteen, your passport fills up. Not with birthdays. With things you can actually do. Every stage gets stamped when you are ready."],
           "described": "DiGi, the golden star, floats and glows while a row of stamps lights up one after another along a curving path, each landing with a small sparkle, and the last one glows brightest."
         }
       }'::jsonb, false)
 where module_id = 'ks3-12-misinfo-deepfakes'
   and jsonb_array_length(slides) = 30
   and slides->29->>'type' = 'digi';

-- ks3-12: the timing string tells the truth again. 70 becomes 72, starter 10
-- becomes 11, close 8 becomes 9, and the cycles are untouched at 29.
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{timing}', to_jsonb('72 minutes as scripted: starter 11 with the DiGi welcome, teach cycles 29 with the half time pause, spread race 4, paper practice 15, exit checks 4, close 9 with the passport beat. To fit a 55 minute period: run one discussion instead of two, and give paper practice 10 with items five and six as homework.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes';

-- Guards.
do $mig$
declare n int; m int; bad text;
begin
  -- 1. The pilot is 31 slides and 72 minutes. A second run would make it 33,
  --    so this is also what stops the inserts doubling the deck.
  select jsonb_array_length(slides),
         (select sum((s->>'minutes')::int) from jsonb_array_elements(slides) s)
    into n, m
    from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if n <> 31 then raise exception 'Migration 289: ks3-12 should hold 31 slides, found %', n; end if;
  if m <> 72 then raise exception 'Migration 289: ks3-12 should run 72 minutes, found %', m; end if;

  -- 2. The timing string says 72 as well, rather than only the slides.
  select (regexp_match(teacher_notes->>'timing', '^(\d+)'))[1]::int into n
    from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if n <> 72 then raise exception 'Migration 289: the timing string says % minutes', n; end if;

  -- 3. Nothing landed in the teach phase, so no cycle budget moved. This is the
  --    whole reason the bookends go where they go.
  select coalesce(sum((s->>'minutes')::int), 0) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-12-misinfo-deepfakes' and s->>'phase' = 'teach';
  select coalesce(sum((c->>'minutes')::int), 0) into m
    from schools.school_lessons l, jsonb_array_elements(l.teacher_notes->'cycles') c
   where l.module_id = 'ks3-12-misinfo-deepfakes';
  if n <> m then raise exception 'Migration 289: cycles state % minutes, teach phase runs %', m, n; end if;
  if n <> 29 then raise exception 'Migration 289: the teach phase should still run 29 minutes, found %', n; end if;

  -- 4. Every cycle still anchors a teach slide heading, by the player's own
  --    rule. An insert that shifted a heading would drop the whole cycle map
  --    silently, which is the failure 281 found on ks4-16.
  select string_agg(cy->>'title', ', ') into bad
    from schools.school_lessons l,
         jsonb_array_elements(l.teacher_notes->'cycles') with ordinality c(cy, i)
   where l.module_id = 'ks3-12-misinfo-deepfakes' and i > 1
     and not exists (select 1 from jsonb_array_elements(l.slides) s
                      where s->>'phase' = 'teach' and lower(s->>'heading') = lower(cy->>'title'));
  if bad is not null then raise exception 'Migration 289: cycle(s) naming no slide: %', bad; end if;

  -- 5. The pilot carries six animated beats and the scheme carries ten, and
  --    every single one of them speaks. No beat in the scheme is silent now.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-12-misinfo-deepfakes' and s->>'type' = 'video';
  if n <> 6 then raise exception 'Migration 289: the pilot should hold 6 video beats, found %', n; end if;

  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s where s->>'type' = 'video';
  if n <> 10 then raise exception 'Migration 289: the scheme should hold 10 video beats, found %', n; end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (coalesce(s->>'src','') = ''
       or coalesce(s->'alternative'->>'described','') = ''
       or coalesce(jsonb_array_length(s->'alternative'->'spoken'), 0) = 0);
  if bad is not null then raise exception 'Migration 289: beat(s) without a clip, a description or a voice on %', bad; end if;

  -- 6. No beat anywhere still claims what the board reads. ks2-06 was the last
  --    one and its clip was replaced here.
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video' and s->'alternative' ? 'onScreen';
  if bad is not null then raise exception 'Migration 289: onScreen still claimed on %', bad; end if;

  -- 7. The bookends are in the phases they were meant for, and are bookends.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality t(s, ord)
   where l.module_id = 'ks3-12-misinfo-deepfakes' and s->>'type' = 'video'
     and ((ord = 2 and s->>'phase' = 'starter') or (ord = 30 and s->>'phase' = 'close'));
  if n <> 2 then raise exception 'Migration 289: the two bookends are not at slides 2 and 30, found %', n; end if;
end $mig$;

commit;
