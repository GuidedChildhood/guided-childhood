-- 308_the_photo_the_clip_points_at.sql
--
-- THE CLASS WAS ASKED TO LOOK AT A PHOTO THAT DID NOT EXIST.
--
-- Justin, watching the sample lesson on 18 September 2026: "the sample video
-- has bloop talking and says this is hot and points but no photo we have. a
-- funny photo as if on instagram with the likes, showing bloop doing something
-- silly."
--
-- He was reading a real hole. Slide 6 of ks3-12 is a video beat: Orbit holds a
-- photo up to the class and says "Detective question. This photo got two
-- million shares. It is completely fake." Then the clip ends and the wall goes
-- to a football transfer post with a film clapper emoji on it, shared 48,200
-- times. So the photo was never shown, and the number in the clip matched
-- nothing on the screen either. The opening thirty seconds of the lesson we
-- give away free asked a room to examine an exhibit that was not there.
--
-- WHY A PLANET FRIEND IS THE RIGHT FAKE. You cannot put a real person's face on
-- a forged post and hand it to thirty children, which is the reason this hole
-- was never filled with a photograph. Bloop can be faked honestly: provably
-- ours, provably invented, and funny, which is what gets a Year 8 room to lean
-- in. The laugh is not decoration, it is the teach. Nobody shares the moon post
-- because they were fooled, they share it because it is fun, and that is the
-- engine the rest of the lesson is about. Then the football post lands and it
-- is the one nobody in the room can call.
--
-- AND IT FEEDS CHECK ONE. The handle is bloop.official. Anyone can type the
-- word official, and a class that spots that in the easy example has already
-- done check one before check one is taught.
--
-- NO CREDITS SPENT. The photo is drawn in the player from Bloop's own cutout
-- art (ScenarioSlide.picture, LessonPlayer.PostPhoto), the same files
-- FriendPlate has been animating since 13 September 2026, so it cannot drift
-- off model and it cost nothing to make.
--
-- THE CLOCK DOES NOT MOVE. The new beat takes its minute from the vote slide,
-- which needs one fewer now that the class has been warmed up by an easy one.
-- So the teach phase still runs the same total, the cycle minutes in
-- teacher_notes still match it, and the module's stated timing string is still
-- true. scripts/check-cycle-anchors.mjs is the proof, and it is run against
-- this deck before and after.
--
-- Idempotent: the insert is guarded on the video caption above it AND on the
-- transfer post still sitting at index 7, so a re run writes nothing. Backed up
-- first. The guards at the end fail loudly rather than let a silent miss ship,
-- which is the failure mode every migration in this folder has had.

begin;

create table if not exists schools.school_lessons_backup_308 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_308 enable row level security;

-- 1. The photo, straight after the clip that points at it.
update schools.school_lessons
   set slides = jsonb_insert(slides, '{7}', '{
         "type": "scenario",
         "label": "The easy one",
         "phase": "teach",
         "minutes": 1,
         "platform": "feed",
         "handle": "bloop.official",
         "avatar": "🧩",
         "meta": "6h · Shared 2.1 million times",
         "text": "BLOOP LANDS ON THE MOON 🌝 nobody told us this was happening today. absolute legend",
         "picture": {
           "friend": "bloop",
           "mood": "happy",
           "alt": "Bloop, the green Planet Friend, beaming, with a rocket, the moon and a planet staged around them. It never happened.",
           "props": ["🚀", "🌝", "🪐"]
         },
         "stats": "❤ 4.8M   ↻ 2.1M   💬 96K",
         "prompt": "Two million people shared this. Bloop has never been to the moon. So why did it travel?",
         "script": "This is the photo from the clip, and it is the easy one on purpose. Let them laugh, it is meant to be funny. Then the real question, and hold them on it: almost nobody who shared this was fooled. They shared it because it was FUN. Write that word on the board, because it is the engine for the whole hour. One more thing before you move on, and it is check one arriving early: look at the handle. It says official. Anyone can type the word official."
       }'::jsonb)
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->6->>'type' = 'video'
   and slides->6->>'caption' = 'Opening the case: real or made?'
   and slides->7->>'handle' = 'transfer.insider';

-- 2. The vote slide gives up the minute, because it needs one fewer now.
update schools.school_lessons
   set slides = jsonb_set(
                  jsonb_set(slides, '{8,minutes}', '1'::jsonb),
                  '{8,script}', to_jsonb('Straight in, they do not need a warm up, they have just had one. Run the vote and count the hands both ways, fast. Then the reveal: it does not matter which way the class voted, because nobody in this room can tell by looking. Not you, not me. Let that sit for a second. That discomfort is the lesson starting.'::text))
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->8->>'type' = 'scenario'
   and slides->8->>'handle' = 'transfer.insider'
   and (slides->8->>'minutes')::int = 2;

do $mig$
declare n int; teach_mins int; cyc_mins int;
begin
  -- The photo is on the wall, once, and it is Bloop.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-12-misinfo-deepfakes'
     and s->>'handle' = 'bloop.official'
     and s->'picture'->>'friend' = 'bloop';
  if n <> 1 then raise exception 'Migration 308: expected 1 Bloop post, found %', n; end if;

  -- It is the slide immediately after the clip that points at it. Anywhere
  -- else and the pointing still lands on nothing.
  select count(*) into n from schools.school_lessons
   where module_id = 'ks3-12-misinfo-deepfakes'
     and slides->6->>'caption' = 'Opening the case: real or made?'
     and slides->7->>'handle' = 'bloop.official';
  if n <> 1 then raise exception 'Migration 308: the photo is not the beat after the clip'; end if;

  -- Every photo carries its alt text. A picture the lesson rests on that a
  -- pupil cannot see is the original bug wearing a different hat.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s ? 'picture'
     and coalesce(length(s->'picture'->>'alt'), 0) < 20;
  if n <> 0 then raise exception 'Migration 308: % post photo(s) with no usable alt text', n; end if;

  -- The deck grew by exactly one beat.
  select jsonb_array_length(slides) into n from schools.school_lessons
   where module_id = 'ks3-12-misinfo-deepfakes';
  if n <> 33 then raise exception 'Migration 308: expected 33 slides, found %', n; end if;

  -- AND THE CLOCK DID NOT MOVE. The teach phase still runs the minutes the
  -- cycles claim, which is what a teacher plans against and what
  -- check-cycle-anchors holds in CI.
  select sum((s->>'minutes')::int) into teach_mins
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-12-misinfo-deepfakes' and s->>'phase' = 'teach';
  select sum((c->>'minutes')::int) into cyc_mins
    from schools.school_lessons l, jsonb_array_elements(l.teacher_notes->'cycles') c
   where l.module_id = 'ks3-12-misinfo-deepfakes';
  if teach_mins is distinct from cyc_mins then
    raise exception 'Migration 308: teach phase runs % minutes, the cycles claim %', teach_mins, cyc_mins;
  end if;
end $mig$;

commit;
