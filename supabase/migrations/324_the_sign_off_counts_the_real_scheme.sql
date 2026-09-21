-- 324: the sign off counts the real scheme
--
-- DiGi closes ks5-20 with "Twenty modules, and here is where they were all
-- heading." It was true when the scheme had 21 lessons and this was the 20th.
-- The scheme has 29 now, so the line counts a scheme that no longer exists,
-- on a wall in front of a Year 13 class.
--
-- The number it becomes is 28: the count of modules up to and including this
-- one in the order the scheme teaches, which is what the original construction
-- meant. 29 would claim the pupil has finished a scheme with one lesson
-- still to come, which is the same untruth in the other direction.
--
-- One line moves. The rest of the sign off, its heading and its script are
-- untouched, and the slide carries no character key before or after, because
-- the close is the machine's own and migration 323 left it that way.
--
-- The write is guarded on the exact current text. A miss aborts and writes
-- nothing.

begin;

create table schools.school_lessons_backup_324 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_324 enable row level security;

create temp table miss(module text, target text);

do $$
declare signoff jsonb;
begin
  select l.slides->29 into signoff from schools.school_lessons l where l.module_id = 'ks5-20-ai-mastery-data-rights';

  if signoff is null then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the row or slide 30 is missing'); return;
  end if;
  if signoff->>'type' is distinct from 'digi' or signoff->>'phase' is distinct from 'close'
     or signoff->>'heading' is distinct from 'DiGi signs off' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'slide 30 is not the DiGi sign off'); return;
  end if;
  if signoff ? 'character' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the sign off carries a character key and must not'); return;
  end if;
  if jsonb_array_length(signoff->'lines') is distinct from 4 then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the sign off does not have 4 lines'); return;
  end if;
  if signoff->'lines'->>0 is distinct from 'Twenty modules, and here is where they were all heading. ⭐' then
    insert into miss values ('ks5-20-ai-mastery-data-rights', 'the first line is not the one this rewrites'); return;
  end if;

  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array['29','lines','0'], to_jsonb('Twenty eight modules, and here is where they were all heading. ⭐'::text), false)
   where l.module_id = 'ks5-20-ai-mastery-data-rights';
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- the proof: the line took, nothing else in the sign off moved
do $$
declare s jsonb; signoff jsonb;
begin
  select l.slides into s from schools.school_lessons l where l.module_id = 'ks5-20-ai-mastery-data-rights';
  signoff := s->29;
  if signoff->'lines'->>0 is distinct from 'Twenty eight modules, and here is where they were all heading. ⭐' then
    raise exception '324: the sign off still reads %', signoff->'lines'->>0;
  end if;
  if signoff ? 'character' then
    raise exception '324: the sign off gained a character key and it must stay DiGi''s';
  end if;
  if jsonb_array_length(signoff->'lines') is distinct from 4
     or signoff->>'heading' is distinct from 'DiGi signs off' then
    raise exception '324: the sign off was disturbed beyond its first line';
  end if;
  if jsonb_array_length(s) is distinct from 30 then
    raise exception '324: ks5-20-ai-mastery-data-rights has % slides, not 30', jsonb_array_length(s);
  end if;
end $$;

-- the proof: the retired line is gone from every lesson, not just this one.
-- An exact match rather than a pattern, because the only thing worth asserting
-- here is that the stale sentence is nowhere. The general rule, that any stated
-- module count must be one that is true, is scripts/check-lesson-counts.mjs,
-- which can say it properly and runs on every push.
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where jsonb_typeof(x) = 'string' and (x #>> '{}') = 'Twenty modules, and here is where they were all heading. ⭐';
  if cnt > 0 then raise exception '324: % lesson(s) still carry the retired line: %', cnt, list; end if;
end $$;

-- the proof: the row equals its file in content/modules, string for string
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
  if got_slides is distinct from 30 or got_n is distinct from 414 or got_hash is distinct from '9c688fb1d99a8f473b7dc62d98517df8' then
    raise exception '324: ks5-20-ai-mastery-data-rights is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

commit;
