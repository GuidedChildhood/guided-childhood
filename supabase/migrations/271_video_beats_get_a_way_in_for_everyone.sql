-- 271_video_beats_get_a_way_in_for_everyone.sql
-- Phase 2 of the slide quality work, and the accessibility gap the Oak
-- source mining found on 7 September.
--
-- Plan:     plans/2026-09-07-oak-as-the-basis-plan.md
-- Sourced:  research/2026-09-07-oak-and-common-sense-source-mining.md
--
-- THE GAP. Oak's lesson page carries a transcript and a sign language option
-- beside its video. Ours carried neither, so a deaf pupil sat through a video
-- beat with no route into it at all, and a teacher whose classroom speakers
-- were broken had to skip the beat rather than read it out.
--
-- WHAT THE CLIPS TURNED OUT TO BE. Before writing a word of this, all eight
-- video beats in the scheme were looked up in the render records they were
-- generated from. Two findings changed the shape of the fix:
--
--   1. FOUR OF THE EIGHT HAVE NO DIALOGUE. The four primary beats (ks1-03,
--      ks2-04, ks2-06, ks2-07) were rendered on 1 July with no spoken line
--      authored and no sound setting at all. A transcript field on its own
--      would have rendered those four empty and let us mark the job done
--      while a pupil still got nothing. What is locked in a silent clip is
--      not audio, it is the action and the writing on the board behind the
--      character, and that shuts out a different pupil entirely.
--
--      So the shape written here is `alternative`, with three parts: what is
--      said (an empty array when nothing is), what happens on screen, and
--      the words shown on screen. The player says "Nobody speaks in this
--      clip" rather than showing a blank panel, because a teacher in a quiet
--      room needs to know it is the clip and not their speakers.
--
--   2. FOUR CAPTIONS NAME A CHARACTER WHO IS NOT IN THE CLIP. The beats play
--      the retired DiGi Squad kids (Oliver, Zara, Sofia). The captions were
--      later rewritten to the Planet Friends who replaced them, so ks1-03
--      says "Pebble" over a clip of a girl in a detective cape, ks2-04 says
--      "Bloop" over a boy with a football, and the two ks3-12 teach beats say
--      "Orbit" over the same detective girl. An honest description of what is
--      on screen cannot sit under a caption naming somebody else, so those
--      four captions stop naming a character. The two that are right, DiGi
--      and DiGi Junior, both golden stars and both still cast, are untouched.
--
--      This does NOT fix the underlying thing: the video beats show a cast we
--      retired. Re rendering them is a decision for Justin, with a cost, and
--      is deliberately not attempted here.
--
-- PROVENANCE OF THE WORDS. Every spoken line below is the dialogue the clip
-- was rendered from, quoted from its own generation record, not transcribed
-- by ear and not invented. Kling renders speech from that line, so a clip can
-- drift a word from its script; the alternative is trustworthy as the beat's
-- authored words, which is the strongest claim available without a human
-- watching all eight and confirming them. That check is worth doing and is
-- named in the pull request.
--
-- Matched on src rather than slide index, so a later migration inserting a
-- slide cannot move this onto the wrong beat. Non destructive: every other
-- key on every slide survives. Idempotent. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_271 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_271 enable row level security;

with beat(src, caption, alternative) as (values

  -- ks1-03, starter. Silent. Caption named Pebble over Zara's clip.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210314_08e5094c-a1ad-42bc-aed4-ca3f2df62cde.mp4',
   'Real or fake? Taking a closer look',
   '{"spoken": [],
     "described": "A girl in a gold detective cape holds a big magnifying glass up to a picture on an easel at the front of a classroom. She narrows her eyes like a detective on a mission. The children on the carpet lean forward, gasp and point.",
     "onScreen": "REAL OR FAKE"}'::jsonb),

  -- ks2-04, starter. Silent. Caption named Bloop over Oliver's clip.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210302_73a1ddee-7a31-429c-b382-339dd740fdc9.mp4',
   'Being the boss of your screen',
   '{"spoken": [],
     "described": "A boy in a green and coral football kit stands at the front of a classroom with a football balanced under one foot. He gestures like a coach explaining a game plan, and the children on the carpet laugh and put their hands up.",
     "onScreen": "BE THE BOSS OF YOUR SCREEN"}'::jsonb),

  -- ks2-06, starter. Silent. Caption correct: this one really is DiGi.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4',
   'DiGi explains how the algorithm works',
   '{"spoken": [],
     "described": "DiGi, the golden star, floats at the front of a classroom, glowing softly and bobbing as if he is talking. He gestures with his star points while the children on the carpet put their hands up and laugh.",
     "onScreen": "HOW THE ALGORITHM WORKS"}'::jsonb),

  -- ks2-07, starter. Silent. Caption names nobody, so it stands.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210333_95e07492-9204-4682-99e3-fdbfb8effd35.mp4',
   'Build your privacy shield',
   '{"spoken": [],
     "described": "A girl in a green cape with a shield badge holds up a glowing see through shield with both hands at the front of an infant classroom. She smiles at the children sitting on the carpet, and they look up and clap.",
     "onScreen": "MY PRIVACY SHIELD"}'::jsonb),

  -- ks3-12, teach. Speaks, two shots. Caption named Orbit over Zara's clip.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061752_459b1662-1742-4e83-97af-e26c2b0e1688.mp4',
   'Opening the case: real or made?',
   '{"spoken": ["Detective question. This photo got two million shares. It is completely fake.",
                "Today you learn the three checks that catch it in under a minute. Case open."],
     "described": "A girl in a gold detective cape stands at the front of a secondary classroom. She flips a photo card in her hand and holds it up to the class with an eyebrow raised, then taps the whiteboard and leans in to the camera.",
     "onScreen": "REAL OR MADE?"}'::jsonb),

  -- ks3-12, teach. The core beat. Caption named Orbit over Zara's clip.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061754_66e88fe5-67c2-47ef-aa10-ebbf022ea96a.mp4',
   'The three checks',
   '{"spoken": ["Who made it. What do other places say. And the big one: how is it trying to make me feel? Fakes aim for your feelings, because feelings share fast."],
     "described": "A girl in a gold detective cape stands beside a whiteboard and counts the three checks off on her fingers. A tick glows on the board behind her as each one lands.",
     "onScreen": "THE THREE CHECKS"}'::jsonb),

  -- ks3-12, teach. The star pause. Caption correct: DiGi Junior is cast.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_123550_bc3337b7-0b24-4d82-b1e3-965955dd3d1c.mp4',
   'DiGi Junior half time check in',
   '{"spoken": ["Beep boop! Half time check. Take one breath. Has anything today surprised you? Tell your neighbour in five words."],
     "described": "DiGi Junior, the small golden star, floats into shot beside a desk with a worksheet on it, bobbing gently as if he is breathing. He waves one rounded arm at the camera, then does a happy twirl with a trail of sparkles."}'::jsonb),

  -- ks3-12, close. Speaks. Caption names nobody, so it stands.
  ('https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061806_129f9d14-d174-4444-8de3-e080bdbd52cb.mp4',
   'Your mission: check before you share',
   '{"spoken": ["Your mission: next shocking post you see, run the three checks before you even think about sharing. You are the detective now. Case closed."],
     "described": "A girl in a gold detective cape stands at the open classroom door with her school bag over her shoulder. She holds up a small gold detective badge, then points it warmly at the camera.",
     "onScreen": "CHECK BEFORE YOU SHARE"}'::jsonb)
)
update schools.school_lessons l
   set slides = (
     select jsonb_agg(
              case when b.src is null then t.s
                   else t.s || jsonb_build_object('alternative', b.alternative, 'caption', b.caption)
              end
              order by t.ord)
       from jsonb_array_elements(l.slides) with ordinality as t(s, ord)
       left join beat b on b.src = t.s->>'src'
   )
 where l.slides is not null
   and exists (select 1 from jsonb_array_elements(l.slides) s
                join beat b2 on b2.src = s->>'src');

-- Guards. The point of these is that the NEXT video beat somebody wires in
-- cannot ship without a way in for a pupil who cannot hear it or see it.
do $$
declare bad int; total int;
begin
  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video' and not (s ? 'alternative');
  if bad > 0 then
    raise exception 'Migration 271: % video beat(s) with no accessible alternative', bad;
  end if;

  -- `spoken` must be present and an array, because an absent one is
  -- ambiguous between "silent" and "nobody wrote it down", and the player
  -- tells a teacher which of those it is.
  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (jsonb_typeof(s->'alternative'->'spoken') is distinct from 'array'
       or coalesce(length(trim(s->'alternative'->>'described')), 0) = 0);
  if bad > 0 then
    raise exception 'Migration 271: % video beat(s) with an incomplete alternative', bad;
  end if;

  -- A spoken line that is blank is worse than an empty array: it renders as
  -- an empty pair of quotation marks and reads as a missing word.
  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and exists (select 1 from jsonb_array_elements_text(s->'alternative'->'spoken') line
                  where coalesce(length(trim(line)), 0) = 0);
  if bad > 0 then
    raise exception 'Migration 271: % video beat(s) with a blank spoken line', bad;
  end if;

  select count(*) into total
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video';
  if total <> 8 then
    raise exception 'Migration 271: expected 8 video beats in the scheme, found %', total;
  end if;
end $$;

commit;
