-- 351: The radicalisation lesson says what its sources say.
--
-- The V1 evidence pass, 25 September 2026. ks4-18 had no evidence panel, and
-- every claim was read against KCSIE 2026, RSHE 2025, Educate Against Hate, the
-- Home Office, the DfE's new Prevent guidance for DSLs and the research itself:
--   on ramp      "misogyny is the most common on ramp" has no UK source, and
--                Prevent does not record misogyny as a category. It is now "a
--                common way in" (DSIT 2026, RSHE para 81, KCSIE para 160).
--   KCSIE        "KCSIE names incel culture": it names misogyny (paras 23, 34,
--                160, 193) and never incels. RSHE 2025 names incels. The slide
--                and the DSL note now say which document says what.
--   playbook     "the same playbook as every other grooming" and "one playbook,
--                three targets": the sources say radicalisation is like grooming,
--                and no other module teaches isolate, flatter, escalate. It now
--                works like other grooming. The key learning point and the exit
--                quiz said "attention, belonging, then isolation", which
--                contradicted the slides; both now say isolate, flatter, escalate.
--   outrage      "the strongest attention fuel we have ever found": Rathje 2021
--                measured sharing of US political posts. The script now says that.
--   drift        "the drift is the design" and "the single most engineered thing
--                on your screen": drift is recorded (Regehr 2025); design and the
--                superlative are not.
--   blackmail    the ks4-17 retrieval now uses the NCA's words: no guarantee,
--                they will likely ask for more, never your fault.
--   trouble      "you will never be in trouble": no source promises it. It now
--                says asking for help does not get you into trouble, as the DfE's
--                own suggested words do, and a Prevent referral is no record.
--   mockery      "the single most radicalising thing a friend can do" is now
--                "likely to push him further in" (Educate Against Hate).
--
-- Plus this module's four hard questions, never migrated from 21 September.
-- Guarded on the exact old text of every string it changes, evidence written
-- only onto an empty base, string hash recomputed on the server against the
-- source JSON, so the row matches content/modules exactly or nothing commits.

begin;

create table schools.school_lessons_backup_351 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_351 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_351(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks4-18-radicalisation-misogyny'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks4-18-radicalisation-misogyny'::text;
end $fn$;

select schools.swap_351('slides', array['10', 'body'], '46904e7dbb2d0b8ba904bf3153582624',
  $f$For teenage boys in the UK, the most common pipeline entrance is misogyny:$f$,
  $r$For teenage boys, one common and well documented way in is misogyny:$r$);
select schools.swap_351('slides', array['10', 'heading'], '4367350df51d23f366e9867f5a68d162',
  null,
  $r$Misogyny is a common way in$r$);
select schools.swap_351('slides', array['26', 'points', '1'], '80f9d722026762ecea6fbba46807b4e7',
  $f$Misogyny is the most common on ramp aimed at teenage boys in the UK.$f$,
  $r$Misogyny is a common way in aimed at teenage boys.$r$);
select schools.swap_351('parent_note', array['taught'], '82c5362c3c3af4f4d808ff2af7d64e52',
  $f$with misogyny the most common version aimed at teenage boys$f$,
  $r$with misogyny a common version aimed at teenage boys$r$);
select schools.swap_351('teacher_notes', array['key_learning_points', '3'], '515b3c36718ac551c897b4d8351db05f',
  null,
  $r$Misogyny is a common way in, and RSHE 2025 names it.$r$);
select schools.swap_351('slides', array['11', 'body'], 'a8ace9ed2d160daecb3448b5c9ec91ec',
  $f$It is common enough that the safeguarding guidance every school follows, Keeping Children Safe in Education, and the RSHE curriculum both name misogyny and incel culture directly.$f$,
  $r$It is common enough that schools in England now treat misogyny as a safeguarding issue, and the RSHE guidance names misogyny and so called incels directly.$r$);
select schools.swap_351('dsl_note', array['note'], 'a1814bf6ca07ac339a7481630425b21d',
  $f$KCSIE names misogynistic content and incel culture as safeguarding concerns, so treat$f$,
  $r$KCSIE 2026 names misogyny within child on child abuse and harassment (paragraphs 23, 34 and 193) and misogynistic influencers among the online harms schools teach about (paragraph 160), and the RSHE guidance names so called incels, so treat$r$);
select schools.swap_351('slides', array['4', 'script'], '5780746c64e63dab19df082a87b84347',
  $f$Today the same word, the same playbook, aimed at beliefs.$f$,
  $r$Today the same word, and similar moves, aimed at beliefs.$r$);
select schools.swap_351('slides', array['5', 'script'], 'e967ee24a7cc40903705338faa28cbda',
  $f$and you are about to see it is the same playbook.$f$,
  $r$and you are about to see how similar the moves are.$r$);
select schools.swap_351('slides', array['13', 'script'], '7a4e2f74cfbcbcc3b3b355e91df59c5d',
  $f$ask the class where they have seen isolate, flatter, escalate before. They have, in the grooming and sextortion modules. The sentence to land: groomers do not have different playbooks for bodies, money and beliefs, they have one playbook and three targets.$f$,
  $r$ask the class where they have seen moves like these before. They have, in the sextortion module: the flattery, the speed, the order to tell nobody. The sentence to land: groomers use similar moves whether they are after your body, your money or your beliefs.$r$);
select schools.swap_351('slides', array['13', 'caption'], '80c1b245bb8795350a2b76a5c21d1553',
  null,
  $r$You already know moves like these from other grooming. Here they are aimed at your beliefs instead of your body or your money.$r$);
select schools.swap_351('slides', array['13', 'heading'], 'a25169b4d9e3f680b35846323ca1b44d',
  null,
  $r$Belief grooming works like other grooming$r$);
select schools.swap_351('teacher_notes', array['cycles', '1', 'title'], 'a25169b4d9e3f680b35846323ca1b44d',
  null,
  $r$Belief grooming works like other grooming$r$);
select schools.swap_351('slides', array['26', 'points', '2'], 'f360079ca7b13aa3f3de648e8d976ca0',
  null,
  $r$Belief grooming works like other grooming: isolate, flatter, escalate.$r$);
select schools.swap_351('teacher_notes', array['key_learning_points', '2'], 'de5cfd4a58f36759783ecceac2856ba4',
  null,
  $r$Belief grooming works like other grooming: isolate, flatter, escalate.$r$);
select schools.swap_351('teacher_notes', array['exit_quiz', '2', 'answer'], 'bdab803b04b90c7cf36eb3e19ab916ed',
  null,
  $r$Isolate, flatter, escalate.$r$);
select schools.swap_351('teacher_notes', array['exit_quiz', '2', 'teaching_point'], '8ffe5faad0f300a78570a2723de538b5',
  null,
  $r$The grooming moves, pointed at belief. Isolate comes first because it cuts off every voice that could pull you back.$r$);
select schools.swap_351('slides', array['8', 'script'], '65e53ff873dae62213225eecc187798d',
  $f$the algorithm is not evil and it is not on anyone's side, it optimises for attention, and outrage happens to be the strongest attention fuel we have ever found.$f$,
  $r$the algorithm is not evil and it is not on anyone's side. It learns from what gets a reaction, and attacks on the other side get a lot of reaction: in one study of 2.7 million political posts, each word about the other side raised the odds of a share by about two thirds.$r$);
select schools.swap_351('slides', array['21', 'script'], '069a5665af75b28140f7e0cb49f1b842',
  $f$the angriest voice gets the megaphone, not the truest one.$f$,
  $r$the angriest voice gets the megaphone, whether or not it is true.$r$);
select schools.swap_351('slides', array['10', 'script'], '3cbc35b5c15045a92b4ab0ee07ae253c',
  $f$and it runs the same way every time:$f$,
  $r$and it usually runs the same way:$r$);
select schools.swap_351('slides', array['4', 'words', '4', 'meaning'], 'ed949e9063de81b70d48e6450dcf9d80',
  null,
  $r$The system that picks your next clip. It is built to keep you watching, which is not the same as what is good for you.$r$);
select schools.swap_351('teacher_notes', array['keywords', '4', 'definition'], 'ed949e9063de81b70d48e6450dcf9d80',
  null,
  $r$The system that picks your next clip. It is built to keep you watching, which is not the same as what is good for you.$r$);
select schools.swap_351('teacher_notes', array['starter_quiz', '1', 'answer'], '52e80286c4f15b18885d844db84686b8',
  null,
  $r$Keeping you watching, which is not the same as what is good for you.$r$);
select schools.swap_351('teacher_notes', array['exit_quiz', '3', 'teaching_point'], 'ce41e66f027e4173afe5b2ec33ef770c',
  null,
  $r$Follow the money. Anger holds attention, and attention is what gets paid for.$r$);
select schools.swap_351('slides', array['23', 'options', '0', 'text'], '50f2415175ee242babcb01b9ba369fce',
  $f$Feeds drift towards hotter content because hotter holds attention, and that drift is the design, not your choices$f$,
  $r$Feeds can drift towards hotter content because it holds attention, and the drift says more about the feed than about you$r$);
select schools.swap_351('slides', array['23', 'options', '0', 'feedback'], 'cf0f8e08c0e8702c3c994466fa1cc40d',
  $f$The drift says nothing about who you are, it says everything about what holds attention.$f$,
  $r$The drift says little about who you are, and a lot about what holds attention.$r$);
select schools.swap_351('slides', array['23', 'options', '2', 'feedback'], 'ea1cc0d317aa6506936b9b0b90f13bfe',
  $f$They are the single most engineered thing on your screen, and escalation is a known pattern of that engineering.$f$,
  $r$They are built to learn what holds your attention, and drifting towards hotter content is a pattern researchers have recorded.$r$);
select schools.swap_351('teacher_notes', array['worksheet_items', '1', 'teaching_point'], 'c37b1849aa6a390c58a1d8701e37d5a8',
  $f$The drift is the design, not a reflection of you,$f$,
  $r$The drift comes from what holds attention, not from who you are,$r$);
select schools.swap_351('slides', array['5', 'options', '0', 'feedback'], 'ddbb9c97329df75258b229b357d918c7',
  null,
  $r$Exactly. Paying is no guarantee it stops, and they will likely ask for more. Telling someone breaks the secrecy the blackmail depends on. It is never your fault, and you are not in trouble for asking for help.$r$);
select schools.swap_351('slides', array['5', 'options', '1', 'feedback'], '051d5c718c370c702cc9bd87a94e4649',
  $f$and the demands almost always continue.$f$,
  $r$and they will likely ask for more.$r$);
select schools.swap_351('slides', array['5', 'options', '2', 'feedback'], '0c72cfdc781023c7ccc9f1af85623b68',
  $f$Secrecy is the lever the whole scam relies on.$f$,
  $r$Deleting can lose the evidence, and secrecy is the lever the whole scam relies on.$r$);
select schools.swap_351('slides', array['26', 'points', '3'], '8fa846d2ce8e36a1de0b7a475d3a2331',
  $f$talk to someone. You will not be in trouble.$f$,
  $r$talk to someone. Asking for help does not get you into trouble.$r$);
select schools.swap_351('slides', array['29', 'lines', '3'], '2d4d62994cd23d3d2b03bfa83bbc0277',
  $f$The way out is a conversation, and you will never be in trouble for starting it.$f$,
  $r$The way out is a conversation, and asking for help does not get you into trouble.$r$);
select schools.swap_351('teacher_notes', array['worksheet_items', '3', 'teaching_point'], '3da254a1da942aa0ef711e33f5496d6f',
  $f$He is not in trouble and neither are you.$f$,
  $r$Asking for help does not get him or you into trouble.$r$);
select schools.swap_351('slides', array['18', 'script'], '48d36b2f2e42b730105c9559bbd3fc75',
  $f$is the single most radicalising thing a friend can do,$f$,
  $r$is likely to push him further in,$r$);
select schools.swap_351('slides', array['18', 'lookFor'], 'c84bbd0d24f3bba96ea52fc5b2eee59a',
  $f$Mockery and contempt push deeper, they prove the us versus them story true.$f$,
  $r$Mockery and contempt can push someone deeper, because they seem to prove the us versus them story true.$r$);

-- The evidence anchor is a plain text column, guarded the same way.
do $$ begin
  if (select md5(evidence_anchor) from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny') is distinct from 'c1c32c2e4306019aef094194d9736b69' then
    insert into miss values ('evidence_anchor is not the text this was written against');
  end if;
end $$;
update schools.school_lessons set evidence_anchor = $r$RSHE 2025, KCSIE 2026, Educate Against Hate, UCL and Kent on TikTok feeds$r$
 where module_id = 'ks4-18-radicalisation-misogyny' and md5(evidence_anchor) = 'c1c32c2e4306019aef094194d9736b69';

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"Is this lesson an attack on boys?","answer":"No, and if it lands that way I have taught it badly. The pipeline targets boys, which makes them the people it is done to, not the people doing it. Naming that is on their side."},{"question":"What is wrong with fitness and money content?","answer":"Nothing, and most of it is exactly what it looks like. The entrance is harmless on purpose, which is the whole point of a pipeline. What we are watching for is the turn, where advice about yourself becomes contempt for other people."},{"question":"It is just jokes. Watching does not change anything.","answer":"A stereotype repeated often enough stops sounding like an opinion and starts sounding like a fact about somebody you have never met. That happens without you agreeing to it, and it is why the feed learning what you watch matters more than what you believe today."},{"question":"Only loners get radicalised.","answer":"That is the comforting version and it does not hold. It reaches ordinary people with friends and families, through a feed, at home. Believing it only happens to somebody else is the blind spot it gets through."}]$hq$::jsonb)
 where l.module_id = 'ks4-18-radicalisation-misogyny' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks4-18-radicalisation-misogyny';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"A feed can drift from ordinary content to misogynistic content without anyone searching for it.","source":"Regehr, Shaughnessy and colleagues at UCL and the University of Kent, Safer scrolling, published by ASCL in February 2024 and peer reviewed in Frontiers in Psychology 2025: four TikTok accounts modelled on young people, which only watched, with no liking, commenting or searching, saw misogynistic content on the For You page rise from 13 percent to 56 percent after five days. Four accounts on one platform, so it shows what a feed can serve, not what every teenager sees. DSIT, 10 February 2026: boys are particularly at risk of being algorithmically served misogynistic and harmful content, often without seeking it out.","status":"verified"},{"claim":"Feeds learn from reactions, and attacks on the other side get a lot of them.","source":"Rathje, Van Bavel and van der Linden, PNAS 2021, 2.7 million posts from US news media and members of Congress on Facebook and Twitter: each word about the political out group raised the odds of a share by 67 percent, the strongest of the language features tested. It is correlational and measures sharing, not attention. Milli and colleagues, PNAS Nexus 2025, 806 US adults: Twitter's engagement based ranking amplified emotionally charged, out group hostile content compared with a time ordered feed.","status":"verified"},{"claim":"Radicalisation works like grooming: it offers belonging, status and someone to blame, and cuts off other voices.","source":"Educate Against Hate (Department for Education): young people should be protected from being groomed and exploited by extremists; push factors include a sense of not belonging, a lack of self esteem and struggling with a sense of identity, and the ideology appears to make sense of feelings of grievance or injustice. DfE, The Prevent duty: practical guidance for designated safeguarding leads, September 2026: factors that may increase a learner's susceptibility include social isolation, unmet emotional or social needs, feelings of grievance or injustice, and online influences. Isolate, flatter, escalate is this lesson's teaching model of those moves, not a term from the guidance.","status":"verified"},{"claim":"Misogyny is a common way in aimed at teenage boys, and it reaches them at school as well as online.","source":"DSIT, 10 February 2026: boys are particularly at risk of being algorithmically served misogynistic and harmful content, often without seeking it out. DfE, Parent, Pupil and Learner Voice, December 2025 fieldwork: 44 percent of Year 10 and 11 pupils had heard comments by other pupils at school, on at least some days in the past week, that they would describe as misogynistic (63 percent in March 2025). DfE, RSHE 2025 para 81: young people may be more vulnerable to sexist and misogynistic influencers when they have low self esteem, are being bullied, or have other challenges in their lives. Prevent does not record misogyny as a category (incel extremism was 95 of 10,293 referrals in the year to September 2025), so no UK source ranks it as the most common way in, and the lesson does not claim that.","status":"verified"},{"claim":"Schools in England treat misogyny as a safeguarding issue, and the RSHE guidance names misogyny and so called incels.","source":"KCSIE 2026, in force from 1 September 2026: children can abuse other children online through abusive, harassing and misogynistic or misandrist messages (para 23); dismissing sexual harassment as banter can lead to a culture of unacceptable behaviour and misogyny (para 34); preventative education covers misogynistic influencers (para 160); child on child abuse includes harmful sexual behaviour and sexual harassment, which may include misogyny (para 193). KCSIE does not mention incels. DfE, RSHE statutory guidance, July 2025: pupils should be equipped to recognise misogyny and other forms of prejudice, and should discuss the sexual norms endorsed by so called involuntary celibates (incels) or online influencers. Both apply in England.","status":"verified"},{"claim":"These communities teach that attraction is a ranking, that women owe men something, and that anyone at the bottom has been cheated.","source":"Educate Against Hate, Incels: a guide for those teaching Year 10 and above, v1.1, November 2025: some incels express intense hatred for women, believing that they are entitled to sexual and romantic attention, and the black pill holds that their lives cannot be improved. Sparks, Zidenberg and Olver, Current Psychiatry Reports 2022, a review: a looks based hierarchy, higher sexual entitlement, and the belief that one cannot transcend that hierarchy. Whittaker, Costello and Thomas for the Commission for Countering Extremism, 2024, 561 adult incels: some believe that 80 percent of women desire only 20 percent of men.","status":"verified"},{"claim":"If you are blackmailed with an image, paying is no guarantee it stops and they will likely ask for more; it is never your fault.","source":"NCA and CEOP Education, Financially motivated sexual extortion: alert for education settings, April 2024: there is no guarantee that paying will stop the threats, and once you have shown you can pay they will likely ask for more; avoid deleting anything that could be used as evidence; a child or young person is never to blame if they have been a victim. CEOP Education, for 11 to 18 year olds: if you have been pressured to share an image of yourself, you will not be in trouble.","status":"verified"},{"claim":"Asking for help does not get you into trouble, and a Prevent referral is about safeguarding, not punishment.","source":"Home Office, Prevent factsheet, 6 August 2026: a Prevent referral does not lead to a criminal record, it is about safeguarding those at risk of radicalisation; Channel is voluntary and consent based, with consent through a parent or guardian for under 18s. DfE, Prevent duty guidance for designated safeguarding leads, September 2026, suggests saying to a learner: you're not in any trouble, I want to understand.","status":"verified"},{"claim":"Mockery and contempt can push someone deeper, so stay his mate and get curious rather than superior.","source":"Educate Against Hate, Manosphere explainer, v1.2: avoid judgmental language, because criticising their beliefs or telling them they are wrong can make them defensive, pushing them deeper into echo chambers and making them less likely to be honest about their thoughts and feelings. DfE, Prevent duty guidance for designated safeguarding leads, September 2026: the aim is to understand, rather than to challenge or debate beliefs.","status":"verified"},{"claim":"A stereotype repeated often enough starts to sound like a fact, which is how prejudice gets built.","source":"DfE, RSHE statutory guidance, July 2025, item 9: how stereotypes, in particular those based on sex, gender reassignment, race, religion, sexual orientation or disability, can cause damage, for example by normalising non consensual behaviour or encouraging prejudice. Fazio, Brashier, Payne and Marsh, Journal of Experimental Psychology: General 2015: repeated statements are perceived to be more truthful than new ones, even when people know better. Those studies used general knowledge statements, so applying them to stereotypes is this lesson's step.","status":"verified"}]$ev$::jsonb, true)
 where l.module_id = 'ks4-18-radicalisation-misogyny' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'351 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_351 b on b.module_id = l.module_id
   where l.module_id <> 'ks4-18-radicalisation-misogyny'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '351 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks4-18-radicalisation-misogyny.json string for string:
-- 30 slides, 448 strings, multiset hash 267ff6b48be1552bf1f357ff170af235 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks4-18-radicalisation-misogyny' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select title from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select year_band from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select audience from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks4-18-radicalisation-misogyny';
  if got_hash is distinct from '267ff6b48be1552bf1f357ff170af235' or got_n <> 448 or got_slides <> 30 then
    raise exception '351 aborted, ks4-18-radicalisation-misogyny does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_351(text, text[], text, text, text);

commit;
