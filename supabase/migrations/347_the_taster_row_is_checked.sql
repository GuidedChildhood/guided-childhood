-- 347: The taster's one unchecked row is checked.
--
-- Migration 341 wrote the iProov row as "verify" because iproov.com could not
-- be opened from the build environment. It can now. iProov's release of 12
-- February 2025 says 2,000 UK and US consumers were tested, and only 0.1
-- percent could tell real from fake across every image and video, in a study
-- where they were primed to look for deepfakes. That is what the row and slide
-- 10 already say, so the status becomes "verified" and the caveat about
-- industry research stays.
--
-- Plus the module's four hard questions, never migrated from 21 September.
-- "It has happened to nearly everybody in this room and to most adults" had no
-- source and becomes "it happens to plenty of people, adults included". The
-- voice line keeps "from a surprisingly short clip": VALL-E (Wang and
-- colleagues, 2023) cloned a voice from a 3 second recording.
--
-- Guarded on the exact old status, string hash recomputed on the server.

begin;

create table schools.school_lessons_backup_347 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_347 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_347(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks3-12-misinfo-deepfakes'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks3-12-misinfo-deepfakes'::text;
end $fn$;

select schools.swap_347('teacher_notes', array['evidence_base', '1', 'status'], 'e8418d1d706cd73548f9f16f1d55ad6e',
  $f$verify$f$,
  $r$verified$r$);

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"Can you really fake a voice that well?","answer":"Yes, and from a surprisingly short clip. This is the bit that has changed fastest. It is why the three checks are about where it came from and what else says it, rather than about how convincing it looks or sounds."},{"question":"So if AI made it, it is fake?","answer":"No. AI made is not the same as false, and treating it that way will make you wrong a lot. Plenty of true things are AI assisted now. The checks are about whether the claim holds up, not about what tool touched it."},{"question":"Am I supposed to distrust everything?","answer":"That is just as useless as believing everything, and it is exhausting. The checks are for the post that hits you hard and fast, because that is the one built to travel. Most of what you see does not need them."},{"question":"I shared something that turned out to be fake. Is that bad?","answer":"It happens to plenty of people, adults included. Say so, and say so where you shared it. A correction from the person who shared it travels further than one from anybody else."}]$hq$::jsonb)
 where l.module_id = 'ks3-12-misinfo-deepfakes' and not (l.teacher_notes ? 'hard_questions');

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'347 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_347 b on b.module_id = l.module_id
   where l.module_id <> 'ks3-12-misinfo-deepfakes'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '347 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks3-12-misinfo-deepfakes.json string for string:
-- 35 slides, 508 strings, multiset hash e4f4f90066be59ebb53fd6d543ad7a76 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks3-12-misinfo-deepfakes' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select title from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select year_band from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select audience from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if got_hash is distinct from 'e4f4f90066be59ebb53fd6d543ad7a76' or got_n <> 508 or got_slides <> 35 then
    raise exception '347 aborted, ks3-12-misinfo-deepfakes does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_347(text, text[], text, text, text);

commit;
