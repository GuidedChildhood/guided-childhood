-- 288_the_board_stops_claiming_words_nobody_checked.sql
--
-- A LINE THAT ONLY ONE PUPIL READS, AND IT HAS TO BE TRUE.
--
-- Every video beat carries an alternative, and one field in it is onScreen: the
-- words burned into the clip. LessonPlayer.tsx renders it as
--
--   THE BOARD READS: REAL OR FAKE
--
-- inside the disclosure under the clip. That line exists for one reader: a pupil
-- who cannot see or hear the video, and who therefore cannot check it. It is the
-- one claim in the whole deck that its audience is unable to verify, which is
-- exactly why it has to be true.
--
-- 286 replaced six of the eight clips. Those six were checked frame by frame,
-- and on none of them could the board be read. The instrument is not blind to
-- text: on the July original it reads REAL OR MADE? off the whiteboard cleanly,
-- and on the new three checks beat it reads the three green ticks that landed on
-- the board but no heading above them. So the board is being drawn and the words
-- are not.
--
-- WHAT WE KNOW AND WHAT WE DO NOT. Justin looked at one clip on 11 September and
-- said the whiteboard was good. That clip has since been replaced by a voiced re
-- render, so the observation does not carry to the file that is live now. That
-- leaves six beats whose onScreen text nobody has confirmed, and a rendered line
-- asserting it to the reader least able to argue.
--
-- So the six lose the field. Not the words: the slide's own caption still names
-- the beat in Nunito at the projector legibility floor, and described still says
-- what happens in the clip. Only the specific claim about what is written on the
-- board goes, because it is the only part we cannot stand behind.
--
-- TWO BEATS KEEP IT, deliberately. ks2-06 is the untouched July clip whose board
-- was rendered by the same generation that demonstrably put REAL OR MADE? on
-- screen, so its claim still stands. The ks3-12 half time beat never had an
-- onScreen to begin with. Guard 1 pins both.
--
-- IF THE WORDS TURN OUT TO BE THERE, this is one insert away from being undone,
-- and the right way round: a field that says nothing is a smaller fault than a
-- field that says the wrong thing.
--
-- Idempotent: removing a key that is gone changes nothing. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_288 as
  select id, module_id, slides, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_288 enable row level security;

update schools.school_lessons
   set slides = slides #- '{1,alternative,onScreen}'
 where module_id = 'ks1-03-real-pretend-computer' and slides->1->>'type' = 'video';

update schools.school_lessons
   set slides = slides #- '{1,alternative,onScreen}'
 where module_id = 'ks2-04-screen-routines' and slides->1->>'type' = 'video';

update schools.school_lessons
   set slides = slides #- '{1,alternative,onScreen}'
 where module_id = 'ks2-07-privacy-reputation' and slides->1->>'type' = 'video';

update schools.school_lessons
   set slides = ((slides #- '{5,alternative,onScreen}') #- '{10,alternative,onScreen}') #- '{25,alternative,onScreen}'
 where module_id = 'ks3-12-misinfo-deepfakes'
   and slides->5->>'type' = 'video'
   and slides->10->>'type' = 'video'
   and slides->25->>'type' = 'video';

-- Guards.
do $mig$
declare n int; bad text;
begin
  -- 1. Exactly one video beat still claims what the board reads, and it is the
  --    one clip this session never touched.
  select string_agg(l.module_id || ' slide ' || (ord - 1), ', ' order by l.module_id) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality t(s, ord)
   where s->>'type' = 'video' and s->'alternative' ? 'onScreen';
  if bad is distinct from 'ks2-06-how-algorithms-work slide 1' then
    raise exception 'Migration 288: onScreen should survive on ks2-06 alone, found %', coalesce(bad, 'none');
  end if;

  -- 2. Nothing else in any alternative was disturbed. Every beat still has the
  --    two fields a pupil actually needs.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'type' = 'video'
     and (coalesce(s->>'src','') = ''
       or coalesce(s->'alternative'->>'described','') = ''
       or s->'alternative'->'spoken' is null);
  if n > 0 then raise exception 'Migration 288: % video beat(s) lost a src, a description or a transcript', n; end if;

  -- 3. Still eight beats. A #- with a wrong path silently rewrites nothing, and
  --    a wrong path with a number in it could rewrite the wrong slide instead,
  --    so the shape is checked rather than assumed.
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s where s->>'type' = 'video';
  if n <> 8 then raise exception 'Migration 288: the scheme should hold 8 video beats, found %', n; end if;
end $mig$;

commit;
