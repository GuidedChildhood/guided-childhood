-- 286_the_lesson_animations_meet_the_new_cast.sql
--
-- SIX CLIPS THAT SHOW THE WRONG CHILDREN.
--
-- Eight video beats exist across five modules. Six of them show human children
-- from the squad that was retired on 23 July 2026, while character_cast on the
-- same row names a Planet Friend. ks1-03 shows a girl in a gold detective cape
-- against a cast of Pebble. ks2-04 shows a boy in a football kit against Bloop.
-- ks2-07 shows a girl in a green cape against Bloop. Three of the four ks3-12
-- beats show the same detective girl against Orbit. The clips rendered on 1 and
-- 3 July and the cast changed three weeks later, which is the gap
-- digi-squad/README.md has carried as still to do ever since.
--
-- Two beats are already right and are not touched: ks2-06, which is DiGi, and
-- the ks3-12 half time beat, which is DiGi Junior. Guard 5 proves it.
--
-- THE ALTERNATIVE MOVES WITH THE CLIP. Every video beat carries an accessible
-- alternative whose described field is read by a pupil who cannot hear or see
-- the clip, and by a teacher with broken speakers reading it to the room. Six
-- of those describe a girl or a boy who is no longer in the video. Swapping the
-- src without the description would leave the one route into the beat pointing
-- at somebody who is not there, which is worse than the mismatch it fixes.
-- Guard 4 fails the migration if any alternative still describes the old cast.
--
-- EVERY BEAT NOW SPEAKS, which is the second half of the job. Four of the eight
-- beats were silent, and the player says so out loud: "Nobody speaks in this
-- clip. Nothing is missing from your sound." Three of those four are re rendered
-- here with a voice, and alternative.spoken carries the exact words, checked
-- line by line against the finished audio. The fourth, ks2-06, is already on
-- cast and only wants a voiced re render, so guard 7 asserts it is the only
-- silent beat left rather than letting it slip.
--
-- WHAT IS NOT IN HERE. The onScreen field, which names the words burned into
-- each clip, is untouched. Whether the new clips carry those words legibly is a
-- judgement about what is on a projector, and it is checked by eye rather than
-- asserted here. If any of them does not, onScreen wants removing on that beat
-- in its own migration rather than being quietly left as a claim.
--
-- HOW THE UPDATES ARE GUARDED. Each one matches on the old src as well as the
-- slide index, so if a deck is ever reordered the update writes nothing at all
-- rather than putting a URL on the wrong slide. A silent no-op would be the
-- dangerous outcome, so guard 3 counts the new clips and fails if any is
-- missing.
--
-- Idempotent: re running matches nothing and changes nothing. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_286 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_286 enable row level security;

-- ks1-03-real-pretend-computer, slide 1: Real or fake? Taking a closer look
-- a girl in a gold detective cape -> Pebble
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(
                  jsonb_set(slides, '{1,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081117_50fdb52f-cad6-4328-b694-ec4e7902f43b.mp4'::text)),
                  '{1,alternative,described}', to_jsonb('Pebble, the round yellow Planet Friend, holds a big magnifying glass at the front of a classroom beside a picture on an easel. Pebble winks, lifts the glass to one eye to peer through it, then lowers it and smiles at the class.'::text)),
                  '{1,alternative,spoken}', '["Some pictures are real. Some are made on a computer. Today we look very closely. Ready?"]'::jsonb)
 where module_id = 'ks1-03-real-pretend-computer'
   and slides->1->>'type' = 'video'
   and slides->1->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210314_08e5094c-a1ad-42bc-aed4-ca3f2df62cde.mp4';

-- ks2-04-screen-routines, slide 1: Being the boss of your screen
-- a boy in a football kit -> Bloop
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(
                  jsonb_set(slides, '{1,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081136_e558411d-5dd9-413f-8c46-62eec87f1221.mp4'::text)),
                  '{1,alternative,described}', to_jsonb('Bloop, the round green Planet Friend, stands at the front of a classroom and talks to the class like a coach, gesturing with both rounded arms. Bloop starts serious, then breaks into a wide encouraging smile.'::text)),
                  '{1,alternative,spoken}', '["Your screen never says right, that is enough. So who does? You do. Today you learn how."]'::jsonb)
 where module_id = 'ks2-04-screen-routines'
   and slides->1->>'type' = 'video'
   and slides->1->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210302_73a1ddee-7a31-429c-b382-339dd740fdc9.mp4';

-- ks2-07-privacy-reputation, slide 1: Build your privacy shield
-- a girl in a green cape -> Bloop
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(
                  jsonb_set(slides, '{1,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081117_dcd36ba7-69bb-425f-9c7e-3cde634aff95.mp4'::text)),
                  '{1,alternative,described}', to_jsonb('Bloop, the round green Planet Friend, wears a cape and holds a glowing shield with both paws at the front of a classroom. Bloop looks down at the shield as it glows, then back up at the children with a broad smile.'::text)),
                  '{1,alternative,spoken}', '["Some things you share. Some things you keep. Today you build a shield. You choose what goes behind it."]'::jsonb)
 where module_id = 'ks2-07-privacy-reputation'
   and slides->1->>'type' = 'video'
   and slides->1->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210333_95e07492-9204-4682-99e3-fdbfb8effd35.mp4';

-- ks3-12-misinfo-deepfakes, slide 5: Opening the case: real or made?
-- a girl in a gold detective cape -> Orbit
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(slides, '{5,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074831_00460c51-8df6-4a15-b117-7517bb528dd2.mp4'::text)),
                  '{5,alternative,described}', to_jsonb('Orbit, the round blue Planet Friend, wears a gold cape at the front of a secondary classroom. Orbit holds a photo up towards the class, gestures at the whiteboard, then leans in to the camera.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->5->>'type' = 'video'
   and slides->5->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061752_459b1662-1742-4e83-97af-e26c2b0e1688.mp4';

-- ks3-12-misinfo-deepfakes, slide 10: The three checks
-- a girl in a gold detective cape -> Orbit
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(slides, '{10,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074832_694bb4c7-293e-4890-a615-6024626d37b9.mp4'::text)),
                  '{10,alternative,described}', to_jsonb('Orbit, the round blue Planet Friend, stands beside a whiteboard in a gold cape and counts the three checks off one at a time. A green tick glows on the board behind it as each one lands.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->10->>'type' = 'video'
   and slides->10->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061754_66e88fe5-67c2-47ef-aa10-ebbf022ea96a.mp4';

-- ks3-12-misinfo-deepfakes, slide 25: Your mission: check before you share
-- a girl in a gold detective cape -> Orbit
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(slides, '{25,src}', to_jsonb('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074831_895acbfe-2b47-499c-a04b-8399e2142699.mp4'::text)),
                  '{25,alternative,described}', to_jsonb('Orbit, the round blue Planet Friend, stands in the school corridor in a gold cape and holds up a small gold badge in one paw, then points it warmly at the camera.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->25->>'type' = 'video'
   and slides->25->>'src' = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061806_129f9d14-d174-4444-8de3-e080bdbd52cb.mp4';

-- Guards.
do $mig$
declare n int; bad text;
begin
  -- 1. Every video beat in the scheme still has a src and an alternative.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (coalesce(s->>'src','') = '' or s->'alternative' is null);
  if n > 0 then raise exception 'Migration 286: % video beat(s) left without a src or an alternative', n; end if;

  -- 2. None of the six retired clips survives anywhere.
  select string_agg(distinct l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'src' in ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210314_08e5094c-a1ad-42bc-aed4-ca3f2df62cde.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210302_73a1ddee-7a31-429c-b382-339dd740fdc9.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210333_95e07492-9204-4682-99e3-fdbfb8effd35.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061752_459b1662-1742-4e83-97af-e26c2b0e1688.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061754_66e88fe5-67c2-47ef-aa10-ebbf022ea96a.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061806_129f9d14-d174-4444-8de3-e080bdbd52cb.mp4');
  if bad is not null then raise exception 'Migration 286: a retired clip is still in use on %', bad; end if;

  -- 3. All six new clips landed. Each update above is guarded on the old src,
  --    so one that matched nothing would be silent. This is what catches it.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'src' in ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081117_50fdb52f-cad6-4328-b694-ec4e7902f43b.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081136_e558411d-5dd9-413f-8c46-62eec87f1221.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_081117_dcd36ba7-69bb-425f-9c7e-3cde634aff95.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074831_00460c51-8df6-4a15-b117-7517bb528dd2.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074832_694bb4c7-293e-4890-a615-6024626d37b9.mp4',
                     'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260911_074831_895acbfe-2b47-499c-a04b-8399e2142699.mp4');
  if n <> 6 then raise exception 'Migration 286: expected 6 new clips in place, found %', n; end if;

  -- 4. No alternative still describes a child from the retired squad.
  select string_agg(distinct l.module_id, ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (s->'alternative'->>'described' ilike '%a girl in%'
       or s->'alternative'->>'described' ilike '%a boy in%');
  if bad is not null then raise exception 'Migration 286: an alternative still describes the old cast on %', bad; end if;

  -- 5. The two beats that were already on cast are untouched.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and s->>'src' in ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4',
                       'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_123550_bc3337b7-0b24-4d82-b1e3-965955dd3d1c.mp4');
  if n <> 2 then raise exception 'Migration 286: the two on cast beats should be untouched, found %', n; end if;

  -- 6. The eight beats are still eight. Nothing added, nothing lost.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s where s->>'type' = 'video';
  if n <> 8 then raise exception 'Migration 286: the scheme should hold 8 video beats, found %', n; end if;

  -- 7. All six beats this migration touches now speak, and exactly one beat in
  --    the whole scheme is still silent: ks2-06, which is on cast already and
  --    is the last one waiting for a voiced re render. Named here so it cannot
  --    be quietly forgotten.
  select string_agg(l.module_id || ' slide ' || (ord - 1), ', ') into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality t(s, ord)
   where s->>'type' = 'video'
     and coalesce(jsonb_array_length(s->'alternative'->'spoken'), 0) = 0;
  if bad is distinct from 'ks2-06-how-algorithms-work slide 1' then
    raise exception 'Migration 286: the silent beats should be ks2-06 alone, found %', coalesce(bad, 'none');
  end if;
end $mig$;

commit;
