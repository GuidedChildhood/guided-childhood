-- 325: ks3-12 gets the two beats it never had
--
-- It is the last lesson failing the module contract, on two rules: the half
-- time breath is not led by a friend (it has none at all) and no friend hands
-- over the mission in the close. It is the odd one out because it was built as
-- the film pilot, before migration 296 gave every other lesson its beats.
--
-- The breath is a template, word for word the beat in ks3-11 and ks3-24. The
-- mission is new and Justin approved the lines on 21 September.
--
-- Two slides means 73 minutes becomes 75, so teacher_notes.timing moves
-- with them. The timing string also claimed a half time pause that did not
-- exist, which is now true rather than aspirational.
--
-- Every write is guarded on the exact current text. A miss aborts and writes
-- nothing.

begin;

create table schools.school_lessons_backup_325 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_325 enable row level security;

create temp table miss(module text, target text);

do $$
declare s jsonb; breath_pos int; mission_pos int; timing text;
begin
  select l.slides, l.teacher_notes->>'timing' into s, timing
    from schools.school_lessons l where l.module_id = 'ks3-12-misinfo-deepfakes';

  if s is null then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'the row is missing'); return;
  end if;
  if jsonb_array_length(s) is distinct from 33 then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'the lesson does not have 33 slides'); return;
  end if;

  -- Refuse if either beat is already there, so this cannot run twice.
  if exists (select 1 from jsonb_array_elements(s) e where e->>'component' = 'star-breath') then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'a star breath already exists'); return;
  end if;
  if exists (select 1 from jsonb_array_elements(s) e
             where e->>'type' = 'digi' and e->>'phase' = 'close' and e ? 'character') then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'a friend beat already exists in the close'); return;
  end if;

  -- The two anchors, by what they are rather than where they sit.
  select ord into breath_pos from jsonb_array_elements(s) with ordinality t(e, ord)
    where e->>'component' = 'spread-race' and e->>'phase' = 'practise';
  select ord into mission_pos from jsonb_array_elements(s) with ordinality t(e, ord)
    where e->>'component' = 'passport-page' and e->>'phase' = 'close';
  if breath_pos is null or mission_pos is null then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'the spread race or the passport page is not where this expects'); return;
  end if;
  if timing is distinct from '73 minutes as scripted: starter 11 with the DiGi welcome, teach cycles 29 with the half time pause, spread race 4, paper practice 15, exit checks 4, close 10 with the passport beat. To fit a 55 minute period: run one discussion instead of two, and give paper practice 10 with items five and six as homework.' then
    insert into miss values ('ks3-12-misinfo-deepfakes', 'teacher_notes.timing is not the one this rewrites'); return;
  end if;

  -- Each beat goes half a position before its anchor, so the order is stated
  -- rather than counted and every existing slide is carried through as it is.
  update schools.school_lessons l set
    slides = (
      select jsonb_agg(e order by ord)
      from (
        select e, ord::numeric as ord from jsonb_array_elements(l.slides) with ordinality t(e, ord)
        union all select '{"type":"interactive","phase":"practise","config":{"prompt":"Two breaths with Orbit: in as Orbit grows, out as Orbit shrinks. Then tell your neighbour one thing from today that surprised you, and write it on your sheet.","heading":"Half time","seconds":4,"register":"level","character":"orbit"},"script":"Half time. Two breaths with the whole room, in as Orbit grows and out as Orbit shrinks. Then thirty seconds in pairs on one thing that surprised them, and they write it on their sheet. Nothing is marked and nobody reads theirs out. Then straight into the practise.","minutes":1,"component":"star-breath"}'::jsonb, breath_pos - 0.5
        union all select '{"type":"digi","lines":["When something hits you hard and fast, that is the signal. Not the proof.","Three checks before you believe it. The same three before you send it on.","And not sure is a real answer. Pause, and you have already done the job."],"phase":"close","script":"The handover. Say nothing over it. When the last line lands, ask them to look at you and say the mission once more in your own words. Then the passport page, and DiGi closes the case after it.","heading":"Your mission, the next time a post hits you hard","minutes":1,"character":"orbit"}'::jsonb, mission_pos - 0.5
      ) z
    ),
    teacher_notes = jsonb_set(l.teacher_notes, array['timing'], to_jsonb('75 minutes as scripted: starter 11 with the DiGi welcome, teach cycles 29, half time pause 1 with Orbit, spread race 4, paper practice 15, exit checks 4, close 11 with Orbit’s mission and the passport beat. To fit a 55 minute period: run one discussion instead of two, and give paper practice 10 with items five and six as homework.'::text), false)
  where l.module_id = 'ks3-12-misinfo-deepfakes';
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- the proof: both beats landed, in the right phase, in the right place
do $$
declare s jsonb; b int; mi int; sr int; pp int; mins int;
begin
  select l.slides into s from schools.school_lessons l where l.module_id = 'ks3-12-misinfo-deepfakes';

  if jsonb_array_length(s) is distinct from 35 then
    raise exception '325: ks3-12-misinfo-deepfakes has % slides, not 35', jsonb_array_length(s);
  end if;

  select ord into b from jsonb_array_elements(s) with ordinality t(e, ord) where e->>'component' = 'star-breath';
  select ord into sr from jsonb_array_elements(s) with ordinality t(e, ord) where e->>'component' = 'spread-race';
  select ord into mi from jsonb_array_elements(s) with ordinality t(e, ord) where e->>'type' = 'digi' and e->>'phase' = 'close' and e->>'character' = 'orbit';
  select ord into pp from jsonb_array_elements(s) with ordinality t(e, ord) where e->>'component' = 'passport-page';

  if b is null or mi is null then raise exception '325: one of the two beats did not land'; end if;
  if b <> sr - 1 then raise exception '325: the breath is at % and the spread race at %, they must be adjacent', b, sr; end if;
  if mi <> pp - 1 then raise exception '325: the mission is at % and the passport at %, they must be adjacent', mi, pp; end if;

  -- Contract rule 12: the breath must name a friend, in its config.
  if (s->(b - 1)->'config'->>'character') is distinct from 'orbit' then
    raise exception '325: the half time breath does not name Orbit';
  end if;
  -- The DiGi sign off stays DiGi's, and stays last.
  if (s->-1->>'type') is distinct from 'digi' or (s->-1 ? 'character') then
    raise exception '325: the last slide is no longer DiGi''s own close';
  end if;

  select sum((e->>'minutes')::int) into mins from jsonb_array_elements(s) e;
  if mins is distinct from 75 then
    raise exception '325: ks3-12-misinfo-deepfakes runs % minutes, not 75', mins;
  end if;
end $$;

-- the proof: the published figure still equals the slides, which is what
-- check-lesson-minutes holds on every push
do $$
declare mins int; stated int;
begin
  select sum((e->>'minutes')::int) into mins
    from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e where l.module_id = 'ks3-12-misinfo-deepfakes';
  select substring(l.teacher_notes->>'timing' from '^(\d+)')::int into stated
    from schools.school_lessons l where l.module_id = 'ks3-12-misinfo-deepfakes';
  if stated is distinct from mins then
    raise exception '325: teacher_notes.timing says % minutes and the slides run %', stated, mins;
  end if;
end $$;

-- the proof: the row equals its file in content/modules, string for string
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
  ) z;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks3-12-misinfo-deepfakes';
  if got_slides is distinct from 35 or got_n is distinct from 488 or got_hash is distinct from '2a07cc1e29c6e76bd6f5acbce0c74d67' then
    raise exception '325: ks3-12-misinfo-deepfakes is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

commit;
