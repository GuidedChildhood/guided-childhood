-- 346: Sextortion says what the National Crime Agency says.
--
-- The V1 evidence pass, 24 September 2026, checked against the NCA's alert for
-- education settings (CEOP Education, April 2024), its press release of 29
-- April 2024, the IWF's Report Remove page, the CEOP Safety Centre and the
-- UKCIS advice on sharing nudes (March 2024).
--
-- The alert to every UK school stands: the NCA's own letter for parents says
-- all schools were sent it. What changes is what the lesson claimed beyond it:
--   paying  "never" ends it, in eight places. The NCA says there is no guarantee
--           paying stops the threats and they will likely ask for more.
--   speed   "often within minutes"; the NCA says some cases took under an hour.
--   CEOP    "the police child protection command" sending cases to "specialist
--           police"; CEOP is a command of the National Crime Agency and reports
--           go to its Child Protection Advisors.
--   blocking "deletes the evidence"; deleting does. The NCA says block, after
--           keeping the messages.
--   the law  "sending an image is not a crime committed against yourself"
--           could be heard as sending is not a crime, which ks4-16 correctly
--           says it is. The feedback now puts the crime where it belongs.
--
-- The DSL note moves furthest, because a DSL acts on it. UKCIS bases the
-- response on what the DSL is told about an image, so a pupil may describe
-- it; viewing is to be avoided but is not itself the offence, copying and
-- saving are. And a live case goes from the DSL to the police and/or
-- children's social care, as the alert directs, not "DSL, then CEOP".
--
-- Plus the module's four hard questions, never migrated from 21 September,
-- with the "never" corrected there too. Guarded on the exact old text,
-- evidence written only onto an empty base, string hash recomputed on the
-- server against the source JSON.

begin;

create table schools.school_lessons_backup_346 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_346 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_346(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks4-17-sextortion'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks4-17-sextortion'::text;
end $fn$;

select schools.swap_346('slides', array['4', 'words', '2', 'meaning'], '26e004bac4f2fe15088d8b7c81f7f94e',
  $f$ taken down from the internet. It works.$f$,
  $r$ taken down from the internet.$r$);
select schools.swap_346('teacher_notes', array['keywords', '2', 'definition'], '26e004bac4f2fe15088d8b7c81f7f94e',
  $f$ taken down from the internet. It works.$f$,
  $r$ taken down from the internet.$r$);
select schools.swap_346('slides', array['4', 'words', '3', 'meaning'], '19354248858060215566cc98448dd640',
  null,
  $r$The National Crime Agency's child protection command. Its online report form goes straight to experienced Child Protection Advisors.$r$);
select schools.swap_346('teacher_notes', array['keywords', '3', 'definition'], '19354248858060215566cc98448dd640',
  null,
  $r$The National Crime Agency's child protection command. Its online report form goes straight to experienced Child Protection Advisors.$r$);
select schools.swap_346('slides', array['6', 'body'], 'dd4655b0bd08d59d30ced431c80734db',
  $f$usually run by groups overseas working through fake accounts, and the National Crime Agency warns it increasingly targets teenage boys with demands for money.$f$,
  $r$usually run by groups overseas working through fake or hacked accounts, and the National Crime Agency warns that a large share of victims are boys aged 14 to 18.$r$);
select schools.swap_346('slides', array['6', 'script'], '4b9c941bbed0edd968cfe7a539cd8ddc',
  $f$running a process on thousands of people at once$f$,
  $r$running a process on many people at once$r$);
select schools.swap_346('slides', array['9', 'options', '0', 'text'], 'af34b213890f070caea5dd0c5b5f4cd3',
  $f$on thousands of people at once.$f$,
  $r$on many people at once.$r$);
select schools.swap_346('slides', array['9', 'options', '1', 'feedback'], 'b87b6ef5fb4e232f0bc3a3d990ff79ab',
  $f$it is being sent to thousands of people at the same time.$f$,
  $r$it is being sent to many people at the same time.$r$);
select schools.swap_346('slides', array['10', 'steps', '3', 'text'], '0b927e447337d2c3625f9d0698b892c9',
  $f$Threats and a demand arrive, often within minutes.$f$,
  $r$Threats and a demand arrive, sometimes within the hour.$r$);
select schools.swap_346('slides', array['10', 'caption'], '3d3c68bb4f6a46e0089991ef9daf827d',
  $f$run on thousands of people at once.$f$,
  $r$run on many people at once.$r$);
select schools.swap_346('slides', array['13', 'options', '1', 'feedback'], 'e1cdb74af7e5417ba0d9f19ec9a5da98',
  $f$Fake profiles use real, stolen photos and look completely ordinary.$f$,
  $r$Fake and hacked accounts can look completely ordinary.$r$);
select schools.swap_346('slides', array['15', 'heading'], '13c23ceeb7eb4a06f3f1db5359e58320',
  null,
  $r$Why paying is not the way out$r$);
select schools.swap_346('slides', array['15', 'body'], 'adf6badf2f753f0c09e7e21826be34b6',
  null,
  $r$Paying feels like the fast way out. It is not. The moment someone pays, they prove they will pay, and the blackmailer will likely ask for more. The National Crime Agency is clear on this: there is no guarantee paying stops the threats. The same is true of sending more images. The moves that help are the ones the blackmailer is afraid of: telling someone and reporting it.$r$);
select schools.swap_346('slides', array['15', 'script'], '0d5968f87b1f591611ad07120044f37e',
  $f$This must land as fact, not advice, so deliver it like you would deliver how gravity works.$f$,
  $r$This must land as fact, not advice, so deliver it plainly: paying buys no guarantee, and the National Crime Agency warns the demands will likely grow.$r$);
select schools.swap_346('slides', array['16', 'steps', '0', 'text'], '90c36fb95b0d6ae28e9fbd472d499581',
  null,
  $r$Not once, not a little, not to buy time. Payment proves pressure works, and they will likely ask for more.$r$);
select schools.swap_346('slides', array['16', 'steps', '2', 'text'], '078a0e94b7c3582ddf6b7174652f1e54',
  $f$CEOP takes the report to specialist police.$f$,
  $r$CEOP, part of the National Crime Agency, takes the report.$r$);
select schools.swap_346('slides', array['17', 'lookFor'], 'b8f3bfd9420a5762c72d475b5c5d8db2',
  $f$Surface the phone fear deliberately, fear of device confiscation is one of the most documented reasons young people stay silent, and adults who promise calm first help most.$f$,
  $r$Surface the phone fear deliberately: a young person who expects to lose their phone has one more reason to stay quiet, and the National Crime Agency asks adults to make sure children know they will not be judged.$r$);
select schools.swap_346('slides', array['23', 'options', '0', 'feedback'], '47f30e84ad6e3eaf9295e4e941909014',
  $f$Payment proves pressure works, and the demands continue.$f$,
  $r$Payment proves pressure works, and they will likely ask for more.$r$);
select schools.swap_346('slides', array['23', 'options', '2', 'feedback'], 'a8dc4b1e10afd059dea175d58b386147',
  null,
  $r$Deleting everything destroys the evidence, and saying nothing leaves the person alone with it. Save the messages, tell an adult, then block.$r$);
select schools.swap_346('slides', array['24', 'options', '1', 'feedback'], '2a30e2c16b0c5a8dead99e082269daec',
  null,
  $r$Blackmail is the crime here, the blackmailer is the criminal, and the police treat the young person as the victim to protect.$r$);
select schools.swap_346('slides', array['26', 'points', '0'], '4a3f793388c4a2251e6279a3e71eacf1',
  $f$and it increasingly targets teenage boys.$f$,
  $r$and it most often targets teenage boys.$r$);
select schools.swap_346('slides', array['26', 'points', '3'], '3072b9550f8794cad4cff89c278ca8c9',
  $f$Paying is the one move that never works.$f$,
  $r$Paying is the one move never to make.$r$);
select schools.swap_346('teacher_notes', array['misconceptions', '0'], '7f6cd0962a0f4edfc4c76716908359ad',
  $f$which is why the NCA alerted every UK school in 2024)$f$,
  $r$as the NCA warned every UK school in 2024)$r$);
select schools.swap_346('teacher_notes', array['misconceptions', '1'], '75b758b8c01dbb2a29e22bf7d4a10210',
  $f$the demands continue and grow, and police guidance is clear that paying never ends it)$f$,
  $r$the blackmailer will likely ask for more, and the National Crime Agency is clear there is no guarantee paying stops it)$r$);
select schools.swap_346('teacher_notes', array['key_learning_points', '2'], 'afd0d2d746bdc41d42429e22787748c7',
  null,
  $r$Paying invites the next demand. There is no guarantee it ends anything.$r$);
select schools.swap_346('teacher_notes', array['key_learning_points', '4'], '71370fd9590474518b8a7dbd92219e0b',
  null,
  $r$Report Remove and CEOP exist for exactly this.$r$);
select schools.swap_346('teacher_notes', array['exit_quiz', '2', 'teaching_point'], '6e8b6fd540aad5b01f29610517e49178',
  null,
  $r$Payment proves pressure works, so they will likely ask for more.$r$);
select schools.swap_346('teacher_notes', array['exit_quiz', '3', 'pairs', '1', 'right'], '71776a62aeddac3103c775afee1f130a',
  null,
  $r$Sends the report to specialist child protection advisors$r$);
select schools.swap_346('teacher_notes', array['exit_quiz', '3', 'answer'], 'fdce2e5c7b5fb652b61b71ef3287ba6c',
  $f$CEOP goes with sends the report to specialist police officers;$f$,
  $r$CEOP goes with sends the report to specialist child protection advisors;$r$);
select schools.swap_346('teacher_notes', array['worksheet_items', '0', 'teaching_point'], 'ecb5f8adf2fc47584fdbdf4f6e1d996c',
  $f$Payment proves pressure works and marks the victim as someone who pays. The demands continue and grow.$f$,
  $r$Payment proves pressure works and marks the victim as someone who pays, and the blackmailer will likely ask for more.$r$);
select schools.swap_346('teacher_notes', array['worksheet_items', '4', 'teaching_point'], '573bc9f60c48c6f09fd90542f6676bb3',
  $f$and CEOP investigates the account.$f$,
  $r$and CEOP can act on the account.$r$);
select schools.swap_346('parent_note', array['taught'], 'fa51bd547b471af0f0d18841e500e9eb',
  $f$which increasingly targets teenage boys.$f$,
  $r$which most often targets teenage boys.$r$);
select schools.swap_346('parent_note', array['taught'], '51e9d5998ab4090f96aefa8bf4d47cc2',
  $f$why paying never makes it stop,$f$,
  $r$why paying is not the way out,$r$);
select schools.swap_346('teacher_notes', array['cycles', '1', 'outcome'], 'a765b6b1c7b990c79832cddc3ee262e5',
  $f$explain why paying never ends it.$f$,
  $r$explain why paying is not the way out.$r$);
select schools.swap_346('slides', array['17', 'script'], '29ec80b88428acd08da7dc3a70dec634',
  $f$then answer the two biggest ones directly:$f$,
  $r$then answer two of them directly:$r$);
select schools.swap_346('parent_note', array['try_this'], '01016209a8070ff8c4c8760a7ece1dcc',
  $f$Fear of blame and fear of losing the device are the two biggest reasons young people stay silent, and one calm sentence from you removes both.$f$,
  $r$Fear of blame and fear of losing the phone can both keep young people silent, and one calm sentence from you answers both.$r$);
select schools.swap_346('dsl_note', array['note'], 'e4ec2f8df16e598e4df60539dd2a4063',
  $f$Never ask a pupil to show, send, describe or forward the image, and do not view it if offered, an adult viewing or receiving it creates a further offence and further harm.$f$,
  $r$Never ask a pupil to show, send or forward the image, and do not view it if offered: UKCIS advice is that staff must not intentionally view it, and copying, saving or sharing it is illegal. Base your response on what the pupil tells you about it.$r$);
select schools.swap_346('dsl_note', array['note'], 'f49f4797a4dd130db3f88257acda1e4b',
  $f$Where a case is live, the pathway is DSL, then CEOP report and Report Remove with the pupil supported, preserving messages as evidence.$f$,
  $r$Where a case is live, the DSL refers it straight away to the police and/or children's social care through your safeguarding procedures, as the NCA alert directs, and the pupil is supported to use Report Remove, preserving messages as evidence.$r$);

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks4-17-sextortion') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"This happens to girls mostly, doesn't it?","answer":"For this particular crime, boys are targeted heavily, and financially motivated cases skew towards teenage boys. Saying otherwise would leave half this room thinking it is not about them, which is precisely what the people doing it count on."},{"question":"If I just pay once, will it stop?","answer":"No. Paying tells them it works, there is no guarantee it stops the threats, and the National Crime Agency warns they will likely ask for more. That is why the answer is stop, save, tell rather than pay."},{"question":"I sent the image myself though. That is on me.","answer":"It is not. Being tricked or pressured into sending something and then threatened over it is a crime committed against you, and how the image came to exist does not change that. You are not in trouble here. Not from me, and not from the police."},{"question":"What if they said they will send it to my family in an hour?","answer":"That hour is a pressure technique, and it turns up again and again. Stop replying, save what you have, tell an adult now. This is not something to handle alone at night, and every adult in this building would rather be woken up than told afterwards."}]$hq$::jsonb)
 where l.module_id = 'ks4-17-sextortion' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks4-17-sextortion';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"In 2024 the National Crime Agency took the rare step of sending an alert to every school in the UK, warning that financially motivated sextortion was rising sharply and that teenage boys are the most common targets.","source":"National Crime Agency, NCA issues urgent warning about sextortion, press release, 29 April 2024: an unprecedented alert to hundreds of thousands of education professionals, after reports to the US National Center for Missing and Exploited Children more than doubled in 2023, from 10,731 to 26,718. A large proportion of victims were boys aged 14 to 18, and 91 percent of victims in UK cases handled by the Internet Watch Foundation in 2023 were male. The alert's own letter for parents says all schools in the UK were sent it.","status":"verified"},{"claim":"It is organised crime, usually run by groups overseas through fake or hacked accounts, and it can move from a first message to blackmail in under an hour.","source":"NCA and CEOP Education, Financially motivated sexual extortion: alert for education settings, April 2024: usually carried out by organised crime groups based overseas who are motivated by money. Victims describe accounts that look like another young person or a hacked friend, being moved to a private messaging app, the offender sending an image first, or a claim to have images whether it is true or not. The NCA press release adds that some cases went from first contact to blackmail in under an hour.","status":"verified"},{"claim":"Do not pay: paying is no guarantee the threats stop, and the blackmailer will likely ask for more. Keep the evidence, block, and report.","source":"NCA alert, the letter for parents and carers: don't pay, do stop contact and block. There is no guarantee paying will stop the threats, and once you have shown you can pay, they will likely ask for more. Avoid deleting anything that could be evidence. Report to the police, or through the CEOP Safety Centre.","status":"verified"},{"claim":"It is not your fault and you are not in trouble, even if you sent an image yourself.","source":"NCA alert: a young person who has shared an image has been groomed and manipulated into doing so, and they are never responsible for their abuse; victims are supported as with any other child sexual abuse. UKCIS, Sharing nudes and semi nudes: advice for education settings, updated March 2024, adds that a criminal justice response against a child would only be considered in exceptional circumstances.","status":"verified"},{"claim":"Report Remove, from Childline and the Internet Watch Foundation, lets under 18s in the UK confidentially report sexual images of themselves and get them taken down.","source":"Internet Watch Foundation, Report Remove: for young people under 18 in the UK to confidentially report sexual images or videos of themselves and remove them from the internet; the IWF reviews each report and works to have the content removed. The NCA alert names it first of three removal steps, alongside Take It Down from the US National Center for Missing and Exploited Children, and reporting to the platform.","status":"verified"},{"claim":"CEOP is the National Crime Agency's child protection command, and a report to it goes to experienced Child Protection Advisors.","source":"CEOP Safety Centre, ceop.police.uk: make a report to one of CEOP's Child Protection Advisors; CEOP is a command of the National Crime Agency.","status":"verified"},{"claim":"Staff never view or ask for the image, and a disclosure goes from the DSL to the police or children's social care.","source":"UKCIS, Sharing nudes and semi nudes, updated March 2024: staff must not intentionally view any nudes unless there is good and clear reason, never copy, print, share, store or save them, and should base the response on what the DSL has been told. NCA alert: the designated safeguarding person should immediately refer a disclosure to the police and/or local authority children's services.","status":"verified"}]$ev$::jsonb, true)
 where l.module_id = 'ks4-17-sextortion' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'346 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_346 b on b.module_id = l.module_id
   where l.module_id <> 'ks4-17-sextortion'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '346 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks4-17-sextortion.json string for string:
-- 30 slides, 439 strings, multiset hash f5a437422282c7b5b20fbcf270500125 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks4-17-sextortion' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select title from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select year_band from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select audience from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks4-17-sextortion'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks4-17-sextortion'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks4-17-sextortion';
  if got_hash is distinct from 'f5a437422282c7b5b20fbcf270500125' or got_n <> 439 or got_slides <> 30 then
    raise exception '346 aborted, ks4-17-sextortion does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_346(text, text[], text, text, text);

commit;
