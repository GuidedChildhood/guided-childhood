-- 344: Mood and screens says what the Oxford study actually found.
--
-- The V1 evidence pass, 24 September 2026. ks3-10 had no evidence panel, and
-- checking its claims against the primary papers found the lesson crediting
-- Orben and Przybylski (Nature Human Behaviour, 2019) with a finding it never
-- measured. The study found screen time explained at most 0.4 percent of the
-- variation in wellbeing, and that sleep, breakfast and being bullied had much
-- bigger links. It did not measure what young people do on a screen or how it
-- leaves them feeling. That idea is real, but it comes from diary studies:
-- Beyens and colleagues (Scientific Reports, 2020) and Irmer and Schmiedek
-- (Communications Psychology, 2023). The panel now says so, and the slides
-- stop putting it in the Oxford study's mouth.
--
-- One line was contradicted outright. Slide 14 said passive use is the
-- pattern most linked with feeling flat; in Beyens, after passive use 46
-- percent of teenagers felt better, 44 percent no different and 10 percent
-- worse. It now says nearly half felt no different, which is what the slide
-- is about. Slide 18 said no app has ever asked how you felt; mood apps do,
-- so it now says the feed never asks.
--
-- It also carries this module's four hard questions, written into the source
-- JSON on 21 September and never migrated, with one overclaim softened.
--
-- Guarded on the exact old text of every string it changes, writes the
-- evidence base only onto an empty one, and ends by recomputing the module's
-- string hash on the server against the source JSON, so the row either
-- matches content/modules exactly or nothing commits.

begin;

create table schools.school_lessons_backup_344 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_344 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_344(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks3-10-mood-and-screens'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks3-10-mood-and-screens'::text;
end $fn$;

select schools.swap_344('slides', array['7', 'body'], 'c1511292d7312e9eca5465297f4b55ae',
  $f$They found the link between raw hours and wellbeing is real but tiny, far too small to explain a generation. What showed up as mattering more was what you do on the screen, who you do it with, and how it leaves you feeling.$f$,
  $r$They found the link between screen time and wellbeing is tiny, far smaller than the headlines claim. Sleep, breakfast and being bullied all showed much bigger links with wellbeing.$r$);
select schools.swap_344('slides', array['7', 'script'], '6e75f18b8a95c3846506e1517bd1e4c6',
  $f$It annoys the panic side because the effect of hours is tiny, and it annoys the nothing to see here side because how you use screens really does show up in the data.$f$,
  $r$It annoys the panic side because the link with screen time is tiny, and it annoys the nothing to see here side because it still found a link.$r$);
select schools.swap_344('slides', array['9', 'options', '2', 'feedback'], 'cfe2a036404998a76e11e9923c4f85c3',
  null,
  $r$This research came from independent academics, and it is no free pass for the tech companies: a tiny link with hours does not make their apps good for you. Follow the evidence, not the conspiracy.$r$);
select schools.swap_344('slides', array['10', 'body'], 'd51a4f660bef3ef4a81c65314b4e31c6',
  $f$Researchers see the same split: actively talking with people you know lands differently from passively watching people you do not.$f$,
  $r$Researchers see the same split: messaging people you know tends to lift mood, and feeling others are better off tends to lower it.$r$);
select schools.swap_344('slides', array['14', 'body'], '2f92637a25c83c33219344b1ace887c7',
  $f$Researchers call this passive use, and it is the pattern most linked with feeling flat.$f$,
  $r$Researchers call this passive use, and in one study nearly half of teenagers felt no different after it.$r$);
select schools.swap_344('slides', array['18', 'prompt'], 'dea86f6402e2a929f76c0508f47fc1d2',
  $f$Every app measures your attention down to the second. Nothing measures your mood.$f$,
  $r$Your feed measures your attention down to the second. It never asks about your mood.$r$);
select schools.swap_344('slides', array['18', 'script'], 'db9a6beffff5c0dcdfeea82e063fb32e',
  $f$and no app has ever asked how you felt after closing it.$f$,
  $r$and no feed asks how you felt after closing it.$r$);
select schools.swap_344('teacher_notes', array['misconceptions', '2'], 'c8915bd890f3b67f74c230c4d3c42014',
  $f$nothing is a verdict too, an hour that gives nothing back is worth noticing and it is the pattern most linked with feeling flat)$f$,
  $r$nothing is a verdict too, and an hour that gives nothing back is worth noticing, because the hour itself was the cost)$r$);
select schools.swap_344('parent_note', array['taught'], '6aa2bfed65acb338039a8ffa6ed0dac8',
  $f$the biggest studies say what young people do on a screen and how it leaves them feeling matters far more than raw hours.$f$,
  $r$the biggest studies found raw hours explain very little of how young people feel, so what they do on a screen and how it leaves them feeling is the better thing to watch.$r$);

-- The evidence anchor is a plain text column, guarded the same way.
do $$ begin
  if (select md5(evidence_anchor) from schools.school_lessons where module_id = 'ks3-10-mood-and-screens') is distinct from '4ce0052fd7e99709da3fc15302f336e0' then
    insert into miss values ('evidence_anchor is not the text this was written against');
  end if;
end $$;
update schools.school_lessons set evidence_anchor = $r$Orben and Przybylski 2019 on hours, Beyens 2020 and Irmer 2023 on use$r$
 where module_id = 'ks3-10-mood-and-screens' and md5(evidence_anchor) = '4ce0052fd7e99709da3fc15302f336e0';

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks3-10-mood-and-screens') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"So how many hours is safe?","answer":"There is no number, and anybody who gives you one is going past what the evidence supports. On their own the hours tell you very little; what you were doing and how you felt afterwards tell you much more. That is why the audit asks better, worse or nothing, rather than counting."},{"question":"My friend is on it constantly and she is fine.","answer":"She might well be, and the same app genuinely lands differently on different people. That is one of the most consistent findings in recent research. It is also why this is an audit you run on yourself rather than a rule I hand to all of you."},{"question":"I felt nothing after two hours, so it did nothing.","answer":"Feeling nothing is a result worth writing down, and it is the honest answer for a lot of sessions. It is also worth checking what the two hours replaced, because the cost sometimes sits there instead."},{"question":"Are you going to tell us to delete it?","answer":"No. One calibrated change that you choose is worth more than a ban you did not, because you are the one who has to live with it on a Tuesday. If your audit says nothing needs changing, that is a legitimate answer."}]$hq$::jsonb)
 where l.module_id = 'ks3-10-mood-and-screens' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks3-10-mood-and-screens';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"Across data from over 350,000 young people, screen use explained at most 0.4 percent of the differences in teenage wellbeing, a link about the same size as the one with regularly eating potatoes.","source":"Orben and Przybylski, Nature Human Behaviour, 2019. Three large surveys from the US and the UK, 355,358 young people, mostly aged 12 to 18. Technology use explained at most 0.4 percent of the variation in wellbeing, and regularly eating potatoes was nearly as negative, 0.9 times as strong. Being bullied, sleep and breakfast all had much bigger links. These are correlations at one point in time, so they cannot show what causes what.","status":"verified"},{"claim":"There is no safe number of hours, and anyone who gives you one is going past what the evidence supports.","source":"UK Chief Medical Officers, commentary on screen based activities and children and young people's mental health and psychosocial wellbeing, 7 February 2019: scientific research is currently insufficiently conclusive to support evidence based guidelines on optimal amounts of screen use.","status":"verified"},{"claim":"The same app lands differently on different people, which is why each pupil runs their own audit instead of trusting an average.","source":"Beyens, Pouwels, van Driel, Keijsers and Valkenburg, Scientific Reports, 2020. 63 Dutch teenagers aged about 15 answered six short check ins a day for a week. After passive social media use, 46 percent felt better, 44 percent felt no different and 10 percent felt worse. A small study of mostly happy teenagers, so it shows that effects differ from person to person, not how often each one happens.","status":"verified"},{"claim":"Comparing mostly reads worse: feeling that other people are better off than you goes with feeling worse about yourself.","source":"Irmer and Schmiedek, Communications Psychology, 2023. 200 young people aged 10 to 14 in Germany kept a diary for 14 days. On days they felt others were better off than them, their self worth and mood were lower, and this partly explained the link between their social media use and how they felt.","status":"verified"},{"claim":"Connecting mostly reads better: messaging people you know tends to lift mood.","source":"Beyens and colleagues, Scientific Reports, 2020, the same study: on average the teenagers felt better at moments when they had spent more time sending messages, posting or sharing, and reading WhatsApp messages, an app used mostly with friends, also went with feeling better.","status":"verified"}]$ev$::jsonb, true)
 where l.module_id = 'ks3-10-mood-and-screens' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'344 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_344 b on b.module_id = l.module_id
   where l.module_id <> 'ks3-10-mood-and-screens'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '344 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks3-10-mood-and-screens.json string for string:
-- 29 slides, 426 strings, multiset hash 3a9864e663a48c816e01071bc4b11976 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks3-10-mood-and-screens' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select title from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select year_band from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select audience from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks3-10-mood-and-screens'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks3-10-mood-and-screens';
  if got_hash is distinct from '3a9864e663a48c816e01071bc4b11976' or got_n <> 426 or got_slides <> 29 then
    raise exception '344 aborted, ks3-10-mood-and-screens does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_344(text, text[], text, text, text);

commit;
