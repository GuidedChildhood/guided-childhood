-- THREE TEACHER NOTE FIELDS ON THE FOUR NEW MODULES, IN THE SHAPE THE PAGES READ.
--
-- The four modules written on 19 September carried prior_knowledge and i_can
-- as prose strings and differentiation as one string with its own "Stretch:"
-- and "Support:" labels, where the other twenty five carry two lists and a
-- { support, stretch } object. The lesson home page maps over
-- prior_knowledge, so it crashed on all four in production, which a teacher
-- meets as "That page did not load" on the page they open first. The
-- learning record and the run sheet read i_can as a list, and the print pack
-- reads differentiation.support and .stretch, so those were blank or wrong
-- rather than broken.
--
-- Found on 20 September by rendering the pages against a fixture, a day
-- after the modules went live. The pages now tolerate a string
-- (schools/lib/notes.ts) and the module contract refuses one (rule 11), so
-- the shape is decided at the desk from now on. This migration puts the four
-- rows right: the same words, in lists and an object. Every write is guarded
-- by the exact string it expects to find, so it cannot run twice and cannot
-- run over anything it has not read, and the hash assertions at the end
-- prove the rows equal content/modules string for string.

begin;

create table if not exists schools.school_lessons_backup_319 as
select * from schools.school_lessons;
alter table schools.school_lessons_backup_319 enable row level security;

create temp table miss (module text, target text) on commit drop;

-- ks2-26-why-thirteen
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{prior_knowledge}', to_jsonb(array[teacher_notes->>'prior_knowledge']))
 where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'string' and teacher_notes->>'prior_knowledge' = 'Builds directly on the privacy lesson, where Bloop introduced the shield for what not to share, and on the gaming lesson, where the class met paying for a random chance. Neither is required. If your class has done them, name them out loud, because the continuity does real work here.';
insert into miss select 'ks2-26-why-thirteen', 'prior_knowledge: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{i_can}', to_jsonb(array[teacher_notes->>'i_can']))
 where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'i_can') = 'string' and teacher_notes->>'i_can' = 'I can say what the number on an app is protecting.';
insert into miss select 'ks2-26-why-thirteen', 'i_can: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'i_can') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{differentiation}',
 jsonb_build_object('support', 'focus on two of the four protections rather than all four, and use the hand up flat gesture as the memory hook.', 'stretch', 'ask why a company might prefer people to get the age wrong, which is the sharpest question in the lesson and some Year 6 pupils will reach it unaided.'))
 where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'differentiation') = 'string' and teacher_notes->>'differentiation' = 'Stretch: ask why a company might prefer people to get the age wrong, which is the sharpest question in the lesson and some Year 6 pupils will reach it unaided. Support: focus on two of the four protections rather than all four, and use the hand up flat gesture as the memory hook.';
insert into miss select 'ks2-26-why-thirteen', 'differentiation: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks2-26-why-thirteen' and jsonb_typeof(teacher_notes->'differentiation') = 'object');

-- ks3-27-when-it-turns-on-you
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{prior_knowledge}', to_jsonb(array[teacher_notes->>'prior_knowledge']))
 where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'string' and teacher_notes->>'prior_knowledge' = 'The direct secondary sequel to the KS2 lesson on being kind and safe online, where the class met the pile on and the three moves: do not pile on, save the evidence, tell someone who can help. Name it, save it, say it is the same shape with the names added. Say the link out loud if your class did that one.';
insert into miss select 'ks3-27-when-it-turns-on-you', 'prior_knowledge: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{i_can}', to_jsonb(array[teacher_notes->>'i_can']))
 where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'i_can') = 'string' and teacher_notes->>'i_can' = 'I can name what is happening, and say the thing that ends it.';
insert into miss select 'ks3-27-when-it-turns-on-you', 'i_can: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'i_can') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{differentiation}',
 jsonb_build_object('support', 'teach two of the four names rather than all four, bullying and coercive control, and keep the three moves as the whole takeaway.', 'stretch', 'ask why the law names harassment and stalking but has no offence called being unkind, which reaches the repetition and pattern idea from the other direction.'))
 where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'differentiation') = 'string' and teacher_notes->>'differentiation' = 'Stretch: ask why the law names harassment and stalking but has no offence called being unkind, which reaches the repetition and pattern idea from the other direction. Support: teach two of the four names rather than all four, bullying and coercive control, and keep the three moves as the whole takeaway.';
insert into miss select 'ks3-27-when-it-turns-on-you', 'differentiation: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(teacher_notes->'differentiation') = 'object');

-- ks4-28-the-money-and-the-odds
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{prior_knowledge}', to_jsonb(array[teacher_notes->>'prior_knowledge']))
 where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'string' and teacher_notes->>'prior_knowledge' = 'The direct sequel to manipulation and persuasion at KS4, where the class met dark patterns and followed the money. This is the same skill pointed at the one product category built entirely out of them. At KS2 the scheme met loot boxes once, in the lesson on how games are designed to hold you, so most pupils will have the word and none of them will have the arithmetic.';
insert into miss select 'ks4-28-the-money-and-the-odds', 'prior_knowledge: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{i_can}', to_jsonb(array[teacher_notes->>'i_can']))
 where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'i_can') = 'string' and teacher_notes->>'i_can' = 'I can work out what a chance really costs me, and say when the loop has somebody.';
insert into miss select 'ks4-28-the-money-and-the-odds', 'i_can: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'i_can') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{differentiation}',
 jsonb_build_object('support', 'teach the price cycle in full and take the odds cycle as far as the wheel has no memory, then go straight to the loop question, which is the part that transfers.', 'stretch', 'ask where the 37 percent comes from, which reaches the independence idea through arithmetic rather than through intuition.'))
 where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'differentiation') = 'string' and teacher_notes->>'differentiation' = 'Stretch: ask where the 37 percent comes from, which reaches the independence idea through arithmetic rather than through intuition. Support: teach the price cycle in full and take the odds cycle as far as the wheel has no memory, then go straight to the loop question, which is the part that transfers.';
insert into miss select 'ks4-28-the-money-and-the-odds', 'differentiation: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(teacher_notes->'differentiation') = 'object');

-- ks4-29-did-not-go-looking
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{prior_knowledge}', to_jsonb(array[teacher_notes->>'prior_knowledge']))
 where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'string' and teacher_notes->>'prior_knowledge' = 'Follows the KS3 lesson on online conflict, which taught name it, save it, say it. The shape is deliberately familiar and the content is different: that lesson was about something aimed at a person, this one is about things that arrive without anybody aiming them. If your class has had manipulation and persuasion at KS4, the recommender idea in cycle one is a direct continuation of it.';
insert into miss select 'ks4-29-did-not-go-looking', 'prior_knowledge: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'prior_knowledge') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{i_can}', to_jsonb(array[teacher_notes->>'i_can']))
 where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'i_can') = 'string' and teacher_notes->>'i_can' = 'I know what to do with something I never asked to see, and that I am not in trouble for it.';
insert into miss select 'ks4-29-did-not-go-looking', 'i_can: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'i_can') = 'array');
update schools.school_lessons set teacher_notes = jsonb_set(teacher_notes, '{differentiation}',
 jsonb_build_object('support', 'teach cycle one and the three moves in full and take cycle three only as far as money out of proportion to the task, which is the part that transfers.', 'stretch', 'ask why a system that nobody designed to do harm ends up here anyway, which reaches optimisation from the inside.'))
 where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'differentiation') = 'string' and teacher_notes->>'differentiation' = 'Stretch: ask why a system that nobody designed to do harm ends up here anyway, which reaches optimisation from the inside. Support: teach cycle one and the three moves in full and take cycle three only as far as money out of proportion to the task, which is the part that transfers.';
insert into miss select 'ks4-29-did-not-go-looking', 'differentiation: not the string expected' where not exists
 (select 1 from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(teacher_notes->'differentiation') = 'object');

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- Proof: ks2-26-why-thirteen now equals content/modules/ks2-26-why-thirteen.json, string for string.
do $$
declare
  got_hash text;
  got_n int;
  got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*)
    into got_hash, got_n
  from (
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
  where l.module_id = 'ks2-26-why-thirteen' and jsonb_typeof(x) = 'string'
  union all
  select module_id from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select title from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select key_stage from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select year_band from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select audience from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select evidence_anchor from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select single_action_outcome from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select character_cast from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select scaffold from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  union all
  select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks2-26-why-thirteen'
  ) q;
  select jsonb_array_length(slides) into got_slides
  from schools.school_lessons where module_id = 'ks2-26-why-thirteen';
  if got_slides is distinct from 31
     or got_n is distinct from 437
     or got_hash is distinct from 'dc57f310af6a8037f7dcffcf59d13330' then
    raise exception '319 ks2-26-why-thirteen: ks2-26-why-thirteen is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- Proof: ks3-27-when-it-turns-on-you now equals content/modules/ks3-27-when-it-turns-on-you.json, string for string.
do $$
declare
  got_hash text;
  got_n int;
  got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*)
    into got_hash, got_n
  from (
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
  where l.module_id = 'ks3-27-when-it-turns-on-you' and jsonb_typeof(x) = 'string'
  union all
  select module_id from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select title from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select key_stage from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select year_band from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select audience from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select evidence_anchor from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select single_action_outcome from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select character_cast from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select scaffold from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  union all
  select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you'
  ) q;
  select jsonb_array_length(slides) into got_slides
  from schools.school_lessons where module_id = 'ks3-27-when-it-turns-on-you';
  if got_slides is distinct from 31
     or got_n is distinct from 442
     or got_hash is distinct from 'a0eed07df63ce71ce2e685b018d86cd6' then
    raise exception '319 ks3-27-when-it-turns-on-you: ks3-27-when-it-turns-on-you is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- Proof: ks4-28-the-money-and-the-odds now equals content/modules/ks4-28-the-money-and-the-odds.json, string for string.
do $$
declare
  got_hash text;
  got_n int;
  got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*)
    into got_hash, got_n
  from (
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
  where l.module_id = 'ks4-28-the-money-and-the-odds' and jsonb_typeof(x) = 'string'
  union all
  select module_id from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select title from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select key_stage from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select year_band from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select audience from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select evidence_anchor from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select single_action_outcome from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select character_cast from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select scaffold from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  union all
  select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds'
  ) q;
  select jsonb_array_length(slides) into got_slides
  from schools.school_lessons where module_id = 'ks4-28-the-money-and-the-odds';
  if got_slides is distinct from 31
     or got_n is distinct from 477
     or got_hash is distinct from 'f945e9a44589cfbfa20b4a7ab7f89ce9' then
    raise exception '319 ks4-28-the-money-and-the-odds: ks4-28-the-money-and-the-odds is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- Proof: ks4-29-did-not-go-looking now equals content/modules/ks4-29-did-not-go-looking.json, string for string.
do $$
declare
  got_hash text;
  got_n int;
  got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*)
    into got_hash, got_n
  from (
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
  where l.module_id = 'ks4-29-did-not-go-looking' and jsonb_typeof(x) = 'string'
  union all
  select module_id from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select title from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select key_stage from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select year_band from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select audience from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select evidence_anchor from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select single_action_outcome from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select character_cast from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select scaffold from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  union all
  select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking'
  ) q;
  select jsonb_array_length(slides) into got_slides
  from schools.school_lessons where module_id = 'ks4-29-did-not-go-looking';
  if got_slides is distinct from 31
     or got_n is distinct from 477
     or got_hash is distinct from '80fbbba502db34ec75d4eabe240591f0' then
    raise exception '319 ks4-29-did-not-go-looking: ks4-29-did-not-go-looking is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

commit;
