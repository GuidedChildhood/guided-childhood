-- 323: Cosmo fronts the sixth form
--
-- Cosmo fronted zero lessons. Both KS5 modules were cast to DiGi, and the
-- schools home page hides a friend the curriculum gives nothing to, so Cosmo
-- vanished from the one place that lists the cast while the hero picture, the
-- KS5 printouts and the parents app all still promised him. Justin's call on
-- 21 September: recast both, with DiGi still closing as it closes every lesson.
--
-- Four beats move per lesson: the title's cast key, the arrival, the half time
-- breath and the mission. The DiGi sign off that ends both lessons is not
-- touched and is proved untouched below. No slide is added or removed and no
-- minute changes, so the published length is unaffected.
--
-- Every write is guarded on the exact current text. Any miss aborts the whole
-- migration and writes nothing.

begin;

create table schools.school_lessons_backup_323 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_323 enable row level security;

create temp table miss(module text, target text);

do $$
declare title jsonb; arrival jsonb; breath jsonb; mission jsonb; cast_line text;
begin
  select l.slides->0, l.slides->1, l.slides->21, l.slides->28, l.character_cast
    into title, arrival, breath, mission, cast_line
  from schools.school_lessons l where l.module_id = 'ks5-20-ai-mastery-data-rights';

  if title is null or arrival is null or breath is null or mission is null then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the row or one of the four beats is missing'); return;
  end if;
  if cast_line is distinct from 'DiGi with motion graphics' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the cast line is not the one this rewrites'); return;
  end if;
  if title->>'character' is distinct from 'digi' or arrival->>'character' is distinct from 'digi'
     or breath->'config'->>'character' is distinct from 'digi' or mission->>'character' is distinct from 'digi' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'a beat is not cast to DiGi, it may already be recast'); return;
  end if;
  if arrival->>'heading' is distinct from 'DiGi opens the lesson' or arrival->>'script' is distinct from 'Let DiGi say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the arrival is not the one this rewrites'); return;
  end if;
  if breath->'config'->>'prompt' is distinct from 'Two slow breaths: in as the star grows, out as it shrinks. Then tell your neighbour one thing from today you want to remember, and write it on your sheet.' or breath->>'script' is distinct from 'Half time. Two breaths with the whole room, in as the star grows and out as it shrinks. Then thirty seconds in pairs on one thing they want to remember, and they write it on their sheet. Nothing is marked and nobody reads theirs out. Then straight into the practise.' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the half time beat is not the one this rewrites'); return;
  end if;
  if mission->>'heading' is distinct from 'One thing to take with you' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'slide 29 is not the mission'); return;
  end if;

  -- The cast line moves with the beats. Contract rule 8 holds every friend on
  -- a beat to this column, so the two can never be split.
  update schools.school_lessons set character_cast = 'Cosmo with DiGi' where module_id = 'ks5-20-ai-mastery-data-rights';

  update schools.school_lessons l set slides =
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(l.slides, array['0','character'],   to_jsonb('cosmo'::text), false),
                        array['1','character'], to_jsonb('cosmo'::text), false),
                        array['1','heading'],   to_jsonb('Cosmo opens the lesson'::text), false),
                        array['1','lines'],     '["I am Cosmo. I lead things, and everyone I lead has the same tools I do.","So if everyone has the same AI, what makes your work worth more than theirs?","Leave it open for now. By the end you answer it with work you can point at, not an opinion."]'::jsonb, false),
                        array['1','script'],    to_jsonb('Let Cosmo say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.'::text), false),
                        array['21','config','character'], to_jsonb('cosmo'::text), false),
                        array['21','config','prompt'],    to_jsonb('Two slow breaths, then read back what you have so far. Mark the one line you could not defend if someone asked, say which one to the person next to you, then finish the run.'::text), false),
                        array['21','script'],     to_jsonb('Half time. Two breaths with the whole room, then a minute on their own sheet finding the one line they could not defend if someone asked. Thirty seconds in pairs naming that line to each other. Nothing is marked and nobody reads theirs out. Then straight back into the run.'::text), false),
                        array['28','character'], to_jsonb('cosmo'::text), false),
                        array['28','lines'],     '["When someone hands you AI work, ask which part they checked.","It is not an accusation. It is just the question now, and soon enough you are the one answering it.","Ask it first, and the standard in the room is yours."]'::jsonb, false)
  where l.module_id = 'ks5-20-ai-mastery-data-rights';
end $$;

do $$
declare title jsonb; arrival jsonb; breath jsonb; mission jsonb; cast_line text;
begin
  select l.slides->0, l.slides->1, l.slides->20, l.slides->27, l.character_cast
    into title, arrival, breath, mission, cast_line
  from schools.school_lessons l where l.module_id = 'ks5-21-digital-identity-future-work';

  if title is null or arrival is null or breath is null or mission is null then
    insert into miss values ('ks5-21-digital-identity-future-work', 'the row or one of the four beats is missing'); return;
  end if;
  if cast_line is distinct from 'DiGi with motion graphics' then
    insert into miss values ('ks5-21-digital-identity-future-work', 'the cast line is not the one this rewrites'); return;
  end if;
  if title->>'character' is distinct from 'digi' or arrival->>'character' is distinct from 'digi'
     or breath->'config'->>'character' is distinct from 'digi' or mission->>'character' is distinct from 'digi' then
    insert into miss values ('ks5-21-digital-identity-future-work', 'a beat is not cast to DiGi, it may already be recast'); return;
  end if;
  if arrival->>'heading' is distinct from 'DiGi opens the lesson' or arrival->>'script' is distinct from 'Let DiGi say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.' then
    insert into miss values ('ks5-21-digital-identity-future-work', 'the arrival is not the one this rewrites'); return;
  end if;
  if breath->'config'->>'prompt' is distinct from 'Two slow breaths: in as the star grows, out as it shrinks. Then tell your neighbour one thing from today you want to remember, and write it on your sheet.' or breath->>'script' is distinct from 'Half time. Two breaths with the whole room, in as the star grows and out as it shrinks. Then thirty seconds in pairs on one thing they want to remember, and they write it on their sheet. Nothing is marked and nobody reads theirs out. Then straight into the practise.' then
    insert into miss values ('ks5-21-digital-identity-future-work', 'the half time beat is not the one this rewrites'); return;
  end if;
  if mission->>'heading' is distinct from 'One thing to take with you' then
    insert into miss values ('ks5-21-digital-identity-future-work', 'slide 28 is not the mission'); return;
  end if;

  -- The cast line moves with the beats. Contract rule 8 holds every friend on
  -- a beat to this column, so the two can never be split.
  update schools.school_lessons set character_cast = 'Cosmo with DiGi' where module_id = 'ks5-21-digital-identity-future-work';

  update schools.school_lessons l set slides =
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(l.slides, array['0','character'],   to_jsonb('cosmo'::text), false),
                        array['1','character'], to_jsonb('cosmo'::text), false),
                        array['1','heading'],   to_jsonb('Cosmo opens the lesson'::text), false),
                        array['1','lines'],     '["I am Cosmo. Most of the people who will decide about you in ten years have not met you yet.","What will still be worth paying you for in ten years?","That is one of the two. The other is what your name already brings up on a screen, and you answer that one first."]'::jsonb, false),
                        array['1','script'],    to_jsonb('Let Cosmo say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.'::text), false),
                        array['20','config','character'], to_jsonb('cosmo'::text), false),
                        array['20','config','prompt'],    to_jsonb('Two breaths first, then a colder read of your own sheet, the way an employer or an admissions tutor would read it. Tell the person next to you the one line you would want them to stop on, then finish the plan.'::text), false),
                        array['20','script'],     to_jsonb('Half time. Two breaths with the whole room, then a minute reading their own sheet the way a stranger deciding about them would read it. Thirty seconds in pairs naming the one line they would want that stranger to stop on. Nothing is marked and nobody reads theirs out. Then straight back into the plan.'::text), false),
                        array['27','character'], to_jsonb('cosmo'::text), false),
                        array['27','lines'],     '["Name the skill exactly, then hand everyone the same AI and ask whether its value climbs or falls.","Run it on the course you are about to choose, and on the job someone has told you is safe.","If something you were counting on comes back falling, that is worth knowing now and not in ten years."]'::jsonb, false)
  where l.module_id = 'ks5-21-digital-identity-future-work';
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- the proof: all four beats took, the sign off is still DiGi's, nothing moved

do $$
declare s jsonb; signoff jsonb; cast_line text;
begin
  select l.slides, l.character_cast into s, cast_line from schools.school_lessons l where l.module_id = 'ks5-20-ai-mastery-data-rights';
  if s->0->>'character' is distinct from 'cosmo' or s->1->>'character' is distinct from 'cosmo'
     or s->21->'config'->>'character' is distinct from 'cosmo' or s->28->>'character' is distinct from 'cosmo' then
    raise exception '323: ks5-20-ai-mastery-data-rights did not take all four beats';
  end if;
  -- Contract rule 8: a friend on a beat must be named in the row's cast line.
  if lower(cast_line) not like '%cosmo%' then
    raise exception '323: ks5-20-ai-mastery-data-rights casts Cosmo on its beats but its cast line reads %', cast_line;
  end if;
  signoff := s->29;
  if signoff->>'type' is distinct from 'digi' or signoff ? 'character' then
    raise exception '323: the sign off on ks5-20-ai-mastery-data-rights was disturbed, and it must stay DiGi''s';
  end if;
  if jsonb_array_length(s) is distinct from 30 then
    raise exception '323: ks5-20-ai-mastery-data-rights has % slides, not 30', jsonb_array_length(s);
  end if;
end $$;

do $$
declare s jsonb; signoff jsonb; cast_line text;
begin
  select l.slides, l.character_cast into s, cast_line from schools.school_lessons l where l.module_id = 'ks5-21-digital-identity-future-work';
  if s->0->>'character' is distinct from 'cosmo' or s->1->>'character' is distinct from 'cosmo'
     or s->20->'config'->>'character' is distinct from 'cosmo' or s->27->>'character' is distinct from 'cosmo' then
    raise exception '323: ks5-21-digital-identity-future-work did not take all four beats';
  end if;
  -- Contract rule 8: a friend on a beat must be named in the row's cast line.
  if lower(cast_line) not like '%cosmo%' then
    raise exception '323: ks5-21-digital-identity-future-work casts Cosmo on its beats but its cast line reads %', cast_line;
  end if;
  signoff := s->28;
  if signoff->>'type' is distinct from 'digi' or signoff ? 'character' then
    raise exception '323: the sign off on ks5-21-digital-identity-future-work was disturbed, and it must stay DiGi''s';
  end if;
  if jsonb_array_length(s) is distinct from 29 then
    raise exception '323: ks5-21-digital-identity-future-work has % slides, not 29', jsonb_array_length(s);
  end if;
end $$;

-- the proof: no lesson anywhere still opens on a friend it is not cast to
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l
  where l.key_stage = 'KS5' and l.slides->0->>'character' is distinct from 'cosmo';
  if cnt > 0 then raise exception '323: % sixth form lesson(s) still open on someone else: %', cnt, list; end if;
end $$;

-- the proof: each row equals its file in content/modules, string for string

do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = 'ks5-20-ai-mastery-data-rights' and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select title from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select key_stage from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select year_band from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select audience from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select evidence_anchor from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select single_action_outcome from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select character_cast from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select scaffold from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights'
  ) z;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks5-20-ai-mastery-data-rights';
  if got_slides is distinct from 30 or got_n is distinct from 414 or got_hash is distinct from 'fdee462cafd8aa2d8d94e81e6bc4950b' then
    raise exception '323: ks5-20-ai-mastery-data-rights is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = 'ks5-21-digital-identity-future-work' and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select title from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select key_stage from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select year_band from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select audience from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select evidence_anchor from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select single_action_outcome from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select character_cast from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select scaffold from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work'
  ) z;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks5-21-digital-identity-future-work';
  if got_slides is distinct from 29 or got_n is distinct from 380 or got_hash is distinct from 'a864bd0e53892a1340bd1306d09dbe48' then
    raise exception '323: ks5-21-digital-identity-future-work is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

commit;
