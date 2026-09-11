-- 291_the_half_time_beat_finishes_its_sentence.sql
--
-- TWO THINGS JUSTIN SAW ON THE WALL.
--
-- "digis half time check cuts off before finishes last sentence and can we add
-- write it down on the papers they're given"
--
-- The half time beat was the July clip: eight seconds against a line that needs
-- eleven, so it stopped mid sentence every single time it played. Re rendered
-- at twelve, on the star, and checked frame by frame: the line lands at eleven
-- seconds with a second still to spare.
--
-- The line itself gained a second half. It used to end "tell your neighbour in
-- five words", which is a good beat and leaves nothing behind. It now ends
-- "then write it on your sheet", and the clip closes on the worksheet with a
-- pencil beside it, so the instruction and the paper are in the same shot. The
-- transcript carries the new words too, which guard 3 asserts: a deaf pupil
-- reads that line instead of hearing it, and an instruction missing from it is
-- an instruction they never get.
--
-- "on the last digi clip could we also end with a image of the passport and
-- stamps in it with planet friend stamps"
--
-- It now does. The camera leaves DiGi and settles on an open passport, and the
-- stamps land on the page one after another in the Planet Friend colours:
-- Pebble yellow, Bloop green, Orbit blue, Nova purple, which is what
-- shared/passport-stages.ts actually holds.
--
-- ONE THING DELIBERATELY NOT DONE. Justin also said "star stamps". The passport
-- has no star stamps and should not: components/pathway/PassportStamps.tsx says
-- it outright, that stars are the child's daily quest reward and stamps are a
-- whole stage earned. Putting stars in the passport would blur the one
-- distinction the reward design rests on, so the clip shows the five stage
-- stamps and the stars stay where they belong.
--
-- Idempotent: both swaps are guarded on the caption as well as the index, so a
-- re run or a shifted deck writes nothing. A silent miss is the danger, so
-- guard 1 counts the new clips. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_291 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_291 enable row level security;

update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(
                  jsonb_set(slides, '{18,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_091451_ec7ebc00-4417-4e6d-96f9-14bb076596df.mp4'::text)),
                  '{18,alternative,described}', to_jsonb('DiGi Junior, the small golden star, floats in beside a desk with the worksheet and a pencil on it, bobbing gently as it talks, then sparkles and gestures down at the sheet.'::text)),
                  '{18,alternative,spoken}', '["Beep boop! Half time check. Take one breath. Has anything today surprised you? Tell your neighbour in five words, then write it on your sheet."]'::jsonb)
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->18->>'type' = 'video'
   and slides->18->>'caption' = 'DiGi Junior half time check in';

update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(slides, '{29,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_091642_99cd613e-0a8b-4efc-bbee-fd1580496201.mp4'::text)),
                  '{29,alternative,described}', to_jsonb('DiGi, the golden star, floats and glows, then the camera settles on an open passport on the table as coloured stamps land on the page one after another, each carrying a Planet Friend face.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->29->>'type' = 'video'
   and slides->29->>'caption' = 'Where this lesson sits on your passport';

do $mig$
declare n int; bad text;
begin
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'src' in ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_091451_ec7ebc00-4417-4e6d-96f9-14bb076596df.mp4',
                       'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_091642_99cd613e-0a8b-4efc-bbee-fd1580496201.mp4');
  if n <> 2 then raise exception 'Migration 291: expected 2 new clips in place, found %', n; end if;

  select string_agg(distinct l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'src' in ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_123550_bc3337b7-0b24-4d82-b1e3-965955dd3d1c.mp4',
                       'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081117_90508caf-20e5-4bc8-8e95-af703325561c.mp4');
  if bad is not null then raise exception 'Migration 291: a retired clip is still in use on %', bad; end if;

  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-12-misinfo-deepfakes'
     and s->>'caption' = 'DiGi Junior half time check in'
     and s->'alternative'->'spoken'->>0 ilike '%write it on your sheet%';
  if n <> 1 then raise exception 'Migration 291: the half time transcript does not mention the sheet'; end if;

  select count(*) into n from schools.school_lessons l, jsonb_array_elements(l.slides) s where s->>'type' = 'video';
  if n <> 10 then raise exception 'Migration 291: the scheme should hold 10 video beats, found %', n; end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (coalesce(jsonb_array_length(s->'alternative'->'spoken'), 0) = 0 or s->'alternative' ? 'onScreen');
  if bad is not null then raise exception 'Migration 291: a beat is silent or claims a board, on %', bad; end if;
end $mig$;

commit;
