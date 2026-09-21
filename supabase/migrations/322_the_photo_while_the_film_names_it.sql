-- 322: the photo is on the wall while the film names it
--
-- Justin, on a phone, 21 September 2026: "he says this photo and the photo has
-- gone. He needs to hold up the photo as he says it." Slide 7 of ks3-12-misinfo-deepfakes
-- is a twelve second film in which Orbit holds a photo up and says "This photo
-- got two million shares", and the prop leaves Orbit's hands before the line
-- lands. Migration 308 put the exhibit in the deck on slide 8; this puts
-- it on the film's own slide so the reference lands. A re-render of the beat
-- costs about 108 credits against a balance of 8.54, and a generated clip
-- cannot be directed to hold a prop on a particular word, so this is the fix
-- that works today and is undone by deleting one key if a re-render lands.
--
-- Guarded on the exact current state of both slides. Any miss aborts the whole
-- migration and writes nothing.

begin;

create table schools.school_lessons_backup_322 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_322 enable row level security;

create temp table miss(module text, target text);

do $$
declare have_film jsonb; have_post jsonb;
begin
  select l.slides->6, l.slides->7 into have_film, have_post
  from schools.school_lessons l where l.module_id = 'ks3-12-misinfo-deepfakes';

  if have_film is null or have_post is null then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'the row or one of the two slides is missing'); return;
  end if;
  if have_film->>'type' is distinct from 'video' or have_film->>'caption' is distinct from 'Opening the case: real or made?' then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'slide 7 is not the opening film'); return;
  end if;
  if have_film ? 'post' then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'slide 7 already carries an exhibit'); return;
  end if;
  if have_post->>'type' is distinct from 'scenario' or have_post->>'handle' is distinct from 'bloop.official'
     or have_post->>'text' is distinct from 'BLOOP LANDS ON THE MOON 🌝 nobody told us this was happening today. absolute legend' or have_post->>'stats' is distinct from '❤ 4.8M   ↻ 2.1M   💬 96K'
     or have_post->'picture' is distinct from '{"alt":"Bloop, the green Planet Friend, beaming, with a rocket, the moon and a planet staged around them. It never happened.","mood":"happy","props":["🚀","🌝","🪐"],"friend":"bloop"}'::jsonb then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'slide 8 is not the Bloop post this expects'); return;
  end if;
  if have_post->>'script' is distinct from 'This is the photo from the clip, and it is the easy one on purpose. Let them laugh, it is meant to be funny. Then the real question, and hold them on it: almost nobody who shared this was fooled. They shared it because it was FUN. Write that word on the board, because it is the engine for the whole hour. One more thing before you move on, and it is check one arriving early: look at the handle. It says official. Anyone can type the word official.' then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'slide 8 does not carry the script this rewrites'); return;
  end if;

  update schools.school_lessons l
     set slides = jsonb_set(
           jsonb_set(l.slides, array['6', 'post'], '{"type":"scenario","label":"The photo from the clip","avatar":"🧩","handle":"bloop.official","meta":"6h · Shared 2.1 million times","text":"BLOOP LANDS ON THE MOON 🌝 nobody told us this was happening today. absolute legend","stats":"❤ 4.8M   ↻ 2.1M   💬 96K","picture":{"alt":"Bloop, the green Planet Friend, beaming, with a rocket, the moon and a planet staged around them. It never happened.","mood":"happy","props":["🚀","🌝","🪐"],"friend":"bloop"},"platform":"feed"}'::jsonb, true),
           array['7', 'script'], to_jsonb('The class has had this on the wall since the clip, so do not present it as a reveal. Go straight at it: two million people shared this, and Bloop has never been to the moon, so why did it travel? Hold them on the answer, because almost nobody who shared it was fooled. They shared it because it was FUN. Write that word on the board, it is the engine for the whole hour. Then check one arriving early: look at the handle. It says official. Anyone can type the word official.'::text), false)
   where l.module_id = 'ks3-12-misinfo-deepfakes';
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: the film carries the exhibit, and it is the same post ──
do $$
declare film jsonb; post jsonb;
begin
  select l.slides->6, l.slides->7 into film, post
  from schools.school_lessons l where l.module_id = 'ks3-12-misinfo-deepfakes';
  if not (film ? 'post') then raise exception '322: the film still carries no exhibit'; end if;
  if film->'post'->>'handle' is distinct from post->>'handle'
     or film->'post'->>'text' is distinct from post->>'text'
     or film->'post'->'picture' is distinct from post->'picture' then
    raise exception '322: the exhibit on the film is not the post on the next slide';
  end if;
  if film->'post' ? 'prompt' or film->'post' ? 'script' then
    raise exception '322: the exhibit carries a prompt or a script, which belong to the discussion slide';
  end if;
  if post->>'script' is distinct from 'The class has had this on the wall since the clip, so do not present it as a reveal. Go straight at it: two million people shared this, and Bloop has never been to the moon, so why did it travel? Hold them on the answer, because almost nobody who shared it was fooled. They shared it because it was FUN. Write that word on the board, it is the engine for the whole hour. Then check one arriving early: look at the handle. It says official. Anyone can type the word official.' then
    raise exception '322: the discussion script was not rewritten';
  end if;
end $$;

-- ── the proof: nothing else moved ──
do $$
declare n int; total int;
begin
  select jsonb_array_length(slides) into n from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if n is distinct from 33 then raise exception '322: slide count is % not 33', n; end if;
  select sum((s->>'minutes')::int) into total
    from schools.school_lessons l, jsonb_array_elements(l.slides) s where l.module_id = 'ks3-12-misinfo-deepfakes';
  if total is distinct from 73 then
    raise exception '322: the lesson now runs % minutes, not 73', total;
  end if;
end $$;

-- ── the proof: the row equals the file in content/modules, string for string ──
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select title from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select key_stage from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select year_band from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select audience from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select evidence_anchor from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select single_action_outcome from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select character_cast from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select scaffold from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
  ) t;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if got_slides is distinct from 33 or got_n is distinct from 472 or got_hash is distinct from '9f7fa26c5d22995444592904836b313d' then
    raise exception '322: ks3-12-misinfo-deepfakes is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

commit;
