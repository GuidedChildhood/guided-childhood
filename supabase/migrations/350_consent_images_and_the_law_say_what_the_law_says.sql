-- 350: The consent and images lesson says what the law says.
--
-- The V1 evidence pass, 25 September 2026. ks4-16 had no evidence panel, and
-- every legal line was read against legislation.gov.uk, UKCIS 2024, RSHE 2025,
-- KCSIE 2026, the IWF and the NCA, because a DSL will read this lesson with the
-- Acts open:
--   exceptions   "no exceptions" is false: PCA 1978 s.1A covers 16 and 17 year
--                olds living together as partners. What is true, and what RSHE
--                2025 says, is that agreeing is no defence and neither is being
--                the same age, so the slides now say that.
--   holding      "a photo that arrives unasked still counts" left out the
--                defence in CJA 1988 s.160(2)(c). It now gives the safe move:
--                do not save, show or forward it, tell an adult, then delete.
--   AI images    "treated exactly like a photograph" holds only when it looks
--                like one (PCA s.7(7)); it now says so.
--   Report Remove "takes images down" and "it works": the IWF works to remove
--                an image that breaks the law, and acted on 1,175 of 1,894
--                reports in 2025. Every line now says it works to.
--   threats      "complying never ends it": CEOP and the NCA say there is no
--                guarantee, and they will likely ask for more.
--   prevalence   "the single most used pressure line" had no source; "most
--                young people have never sent one" does (Madigan 2018, Mori
--                2022, about one in five or fewer).
--   police       "treats young people as children to protect first" now says
--                what KCSIE 2026 para 557 says: the law exists to protect them.
--   DSL note     a threat to share now follows the NCA alert: refer to the
--                police and/or children's social care, never view the image,
--                keep the messages.
--
-- Plus this module's four hard questions, never migrated from 21 September.
-- Guarded on the exact old text of every string it changes, evidence written
-- only onto an empty base, string hash recomputed on the server against the
-- source JSON, so the row matches content/modules exactly or nothing commits.

begin;

create table schools.school_lessons_backup_350 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_350 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_350(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks4-16-consent-images-law'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks4-16-consent-images-law'::text;
end $fn$;

select schools.swap_350('slides', array['9', 'body'], '33c12c50c072c8c03f1deed262edcc99',
  $f$ That is the whole rule, and it has no exceptions for circumstances people assume are fine.$f$,
  $r$$r$);
select schools.swap_350('slides', array['10', 'body'], '9a67b1498d69b4059d3669ba7015013d',
  $f$it makes every image of an under 18 person legally untouchable, so nobody can claim a loophole.$f$,
  $r$agreeing is no defence, so nobody can pressure a young person and then claim they said yes.$r$);
select schools.swap_350('slides', array['10', 'script'], '496680922a57a701ccf240f3062592bb',
  $f$the law is written to make images of under 18s untouchable with no loopholes, and that blanket rule catches this situation too. Then say the reassurance clearly, because it is true and it matters: police guidance treats young people in these situations as children to protect first, not criminals to charge.$f$,
  $r$the law is written so that agreeing is never a defence for images of under 18s, and that blanket rule catches this situation too. Then say the reassurance clearly, because it is true and it matters: the guidance schools and police follow says the law exists to protect young people, not to criminalise them.$r$);
select schools.swap_350('slides', array['11', 'caption'], '30fef7474e59fb6f8846841759e075b1',
  $f$There is no consent exception, no same age exception, and no exception for an image a computer made.$f$,
  $r$Agreeing does not make it legal, being the same age does not, and a fake that looks like a real photo counts too.$r$);
select schools.swap_350('slides', array['11', 'verdicts', '1'], '76ea336e0ff4c10e1e7ab78335369f8e',
  null,
  $r$Agreeing is no defence$r$);
select schools.swap_350('slides', array['11', 'script'], 'fecf197c5ca9b33e71c1503b8eb221ed',
  $f$illegal under 18, no exceptions, and the purpose is protection first.$f$,
  $r$illegal under 18, agreeing is no defence, and the purpose is protection first.$r$);
select schools.swap_350('slides', array['17', 'steps', '1', 'text'], '7bebfbf9c62007db10aa89f7fd4798d1',
  $f$making, holding or sharing, no exceptions.$f$,
  $r$making, holding or sharing, and agreeing is no defence.$r$);
select schools.swap_350('parent_note', array['taught'], '6edaec60cdaa2843b66ac8ce0eb43cac',
  $f$even of yourself, with no exceptions.$f$,
  $r$even of yourself, and agreeing is no defence.$r$);
select schools.swap_350('teacher_notes', array['differentiation', 'stretch'], '8303c0e3798139f7140b0b7d19ce9725',
  $f$a blanket rule leaves no loophole for anyone to exploit.$f$,
  $r$a rule where agreeing is no defence leaves no room for pressure dressed up as a yes.$r$);
select schools.swap_350('slides', array['11', 'steps', '1', 'text'], '14b19cd8957b082d1cdd17c2b69214c8',
  null,
  $r$Keeping it on a device. If one arrives that you never asked for, do not save, show or forward it: tell an adult, then delete it.$r$);
select schools.swap_350('slides', array['11', 'script'], '0605548abb2b1370fa8bad2bbaedf590',
  $f$an image that lands in a group chat you never asked for still creates a legal problem on your device, and the right move is delete, do not forward, and tell an adult.$f$,
  $r$the law has a defence for an image you never asked for and did not keep, so the move is: nothing saved, shown or sent on, and an adult told before it is deleted.$r$);
select schools.swap_350('slides', array['23', 'config', 'posts', '3', 'why'], '75a45b8c7f8caf09e619fb6279edd73c',
  $f$Holding and forwarding are both offences when the person is under 18, and forwarding is legally the same act as sharing.$f$,
  $r$Forwarding is legally the same act as sharing, and the law only protects someone who did not ask for an image and did not keep it.$r$);
select schools.swap_350('teacher_notes', array['worksheet_items', '3', 'teaching_point'], '75a45b8c7f8caf09e619fb6279edd73c',
  $f$Holding and forwarding are both offences when the person is under 18, and forwarding is legally the same act as sharing.$f$,
  $r$Forwarding is legally the same act as sharing, and the law only protects someone who did not ask for an image and did not keep it.$r$);
select schools.swap_350('slides', array['11', 'steps', '3', 'text'], 'ec615bae24169deedc45361d2002126e',
  null,
  $r$Making one with an app. If it looks like a real photo of someone under 18, the law treats it exactly like a photograph.$r$);
select schools.swap_350('slides', array['11', 'script'], 'fac60aac67a6eb9ea070f8bd411d5f64',
  $f$An image generated or edited by an app is treated the same as a photograph,$f$,
  $r$An image generated or edited by an app that looks like a real photo is treated the same as a photograph,$r$);
select schools.swap_350('slides', array['4', 'words', '2', 'meaning'], '233accbcb4801d8eaffd0eabd98ac2af',
  null,
  $r$The law's term for a nude or sexual image of a person under 18.$r$);
select schools.swap_350('teacher_notes', array['keywords', '2', 'definition'], '233accbcb4801d8eaffd0eabd98ac2af',
  null,
  $r$The law's term for a nude or sexual image of a person under 18.$r$);
select schools.swap_350('slides', array['14', 'body'], 'd0f244c36c2f75d8dcf8e42cfa91f0fd',
  $f$The single most used pressure line is everyone sends them, and it is simply false. Most young people do not, whatever the loudest voices claim.$f$,
  $r$A pressure line you will hear is everyone sends them, and it is simply false. Most young people have never sent one, whatever the loudest voices claim.$r$);
select schools.swap_350('slides', array['19', 'body'], 'fe2a370131cb90e0490934229605f22a',
  $f$confidentially and have it taken down from the open web, without needing a parent present and without going to the police themselves.$f$,
  $r$confidentially. If the image breaks the law, they work to get it taken down and stop it being posted again, and nobody has to go to the police themselves.$r$);
select schools.swap_350('slides', array['21', 'options', '1', 'feedback'], 'e42b3e945bf634e103a0bfdf6ba451eb',
  $f$Report Remove takes images of under 18s down from the open web,$f$,
  $r$Report Remove works to get images of under 18s taken down,$r$);
select schools.swap_350('slides', array['23', 'config', 'posts', '5', 'why'], '51a07c6e763a5caed45fcbc2f91a2f86',
  $f$Report Remove takes images down confidentially,$f$,
  $r$Report Remove works to take images down confidentially,$r$);
select schools.swap_350('teacher_notes', array['worksheet_items', '5', 'teaching_point'], '51a07c6e763a5caed45fcbc2f91a2f86',
  $f$Report Remove takes images down confidentially,$f$,
  $r$Report Remove works to take images down confidentially,$r$);
select schools.swap_350('slides', array['26', 'options', '0', 'text'], '02b38a064c401b4774507ba80fd4e68e',
  $f$can actually fix this$f$,
  $r$can actually help$r$);
select schools.swap_350('slides', array['26', 'options', '0', 'feedback'], '7f77ee8fb9df0cc820af67e50942a5b9',
  $f$Report Remove from Childline and the IWF takes images down confidentially,$f$,
  $r$Report Remove from Childline and the IWF works to take images down confidentially,$r$);
select schools.swap_350('slides', array['28', 'points', '3'], '16f5abbbdee2340a2e6ac261deca330a',
  $f$Report Remove from Childline and the IWF takes it down confidentially,$f$,
  $r$Report Remove from Childline and the IWF works to take it down confidentially,$r$);
select schools.swap_350('slides', array['31', 'lines', '2'], '20cf044619b36c0109efdaa6c96130cc',
  $f$and Report Remove can take it down.$f$,
  $r$and Report Remove can help take it down.$r$);
select schools.swap_350('teacher_notes', array['send', 'eal'], 'dc764ef52fce5ad6169abd25337d7f50',
  $f$the confidential route that takes images down.$f$,
  $r$the confidential route that works to take images down.$r$);
select schools.swap_350('teacher_notes', array['exit_quiz', '4', 'answer'], 'a1e8121e8d667864b35c02cb8cbf4433',
  $f$Report Remove is free, confidential and works.$f$,
  $r$Report Remove is free, confidential and can get images taken down.$r$);
select schools.swap_350('teacher_notes', array['misconceptions', '2'], '5f6e6c535af989703483606c406539f6',
  $f$the IWF gets images taken down$f$,
  $r$the IWF works to get images taken down$r$);
select schools.swap_350('teacher_notes', array['key_learning_points', '4'], 'f241fc5201344631e61cfd0da23efb5d',
  null,
  $r$Report Remove is free and confidential, and it can get images taken down.$r$);
select schools.swap_350('parent_note', array['taught'], '83bf57c066d6cce56bb05b27a692f7b3',
  $f$tool that gets images of under 18s taken down$f$,
  $r$tool that works to get images of under 18s taken down$r$);
select schools.swap_350('slides', array['23', 'config', 'posts', '4', 'why'], 'b3a5a99a375824e2e3c90962b50c3c03',
  $f$This is a criminal threat, and complying never ends it.$f$,
  $r$This is a criminal threat, and sending more is no guarantee it stops: they will likely ask for more.$r$);
select schools.swap_350('teacher_notes', array['worksheet_items', '4', 'teaching_point'], 'b3a5a99a375824e2e3c90962b50c3c03',
  $f$This is a criminal threat, and complying never ends it.$f$,
  $r$This is a criminal threat, and sending more is no guarantee it stops: they will likely ask for more.$r$);
select schools.swap_350('slides', array['19', 'script'], 'b41d01801f4d2f92e89cbbec80aa251c',
  $f$what happens next, and it is treated very differently from being found out later.$f$,
  $r$what happens next.$r$);
select schools.swap_350('dsl_note', array['note'], 'f1c3b3f778081219575719a9416a7ba1',
  $f$treat it as potential sextortion and follow your policy and local police guidance without asking the pupil to gather or show evidence.$f$,
  $r$treat it as potential sextortion: the NCA alert directs the DSL to refer it to the police and/or children's social care. Do not view or ask to see any image, and ask the pupil not to delete messages, because they may be evidence.$r$);

-- The evidence anchor is a plain text column, guarded the same way.
do $$ begin
  if (select md5(evidence_anchor) from schools.school_lessons where module_id = 'ks4-16-consent-images-law') is distinct from '9417b6ed948532b2651a86b3504d3cfc' then
    insert into miss values ('evidence_anchor is not the text this was written against');
  end if;
end $$;
update schools.school_lessons set evidence_anchor = $r$Protection of Children Act 1978, UKCIS 2024, RSHE 2025, KCSIE 2026$r$
 where module_id = 'ks4-16-consent-images-law' and md5(evidence_anchor) = '9417b6ed948532b2651a86b3504d3cfc';

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks4-16-consent-images-law') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"If we are both under 18 and we both agreed, it is legal, isn't it?","answer":"No. The law on sexual images of under 18s does not have a both agreed exception, and I would be doing you no favours softening that. Agreement matters enormously for how you treat each other. It is not what makes something lawful."},{"question":"Everyone sends them.","answer":"Large studies of under 18s put it at about one in five or fewer, and the belief that everybody does is itself a pressure technique. Whatever the number is, it does not change the law or what happens if an image moves, and those are the two things that will actually affect you."},{"question":"If there is already an image of me out there, am I in trouble?","answer":"No. You are the person this law exists to protect, and that stays true even if you took it and sent it yourself. Report Remove exists exactly for this and it can get images taken down. Tell somebody today."},{"question":"What if I agreed at the time and I do not now?","answer":"Then consent has ended, and it is allowed to end. Consent is not a form you signed once. Somebody who tells you that you cannot change your mind is telling you something about themselves."}]$hq$::jsonb)
 where l.module_id = 'ks4-16-consent-images-law' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks4-16-consent-images-law';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"It is illegal to make, keep or share a sexual image of anyone under 18, even an image of yourself, and agreeing is no defence.","source":"Protection of Children Act 1978 (PCA) s.1 makes it an offence to take, make, distribute or show an indecent photograph or pseudo photograph of a child, and s.7(6) defines a child as a person under 18; the Criminal Justice Act 1988 s.160 covers having one. DfE, RSHE statutory guidance, July 2025: keeping or forwarding indecent or sexual images of someone under 18 is a crime, even if the photo is of themselves or of someone who has consented. Scotland and Northern Ireland set the same age of 18 (Civic Government (Scotland) Act 1982 s.52; Protection of Children (Northern Ireland) Order 1978, article 2). The one narrow defence, PCA s.1A, covers a 16 or 17 year old and a spouse, civil partner or partner they live with in an enduring family relationship, and only while the image stays between the two of them; marriage under 18 has been void in England and Wales since 27 February 2023.","status":"verified"},{"claim":"If an image arrives that you never asked for, do not save, show or forward it: tell an adult, then delete it.","source":"Criminal Justice Act 1988 s.160(2)(c): it is a defence to prove the image was sent without any prior request and was not kept for an unreasonable time. The defence covers having it, not showing or forwarding it, because parting with an image to another person is distributing it (PCA 1978 s.1(2)). UKCIS, Sharing nudes and semi nudes: advice for education settings, updated 11 March 2024, section 2.5: young people who receive an image are advised to delete it from their devices and accounts and not to share it further.","status":"verified"},{"claim":"An image made or edited by an app that looks like a real photo of someone under 18 is treated the same as a photograph.","source":"PCA 1978 s.7(7): a pseudo photograph is an image, whether made by computer graphics or otherwise, which appears to be a photograph, and s.7(8) treats it as showing a child where the predominant impression is that the person shown is a child. DfE, RSHE 2025: the crime applies even if the image was created using AI generated imagery. KCSIE 2026, footnote 145: taking and sharing nude photographs of those aged under 18, including those generated using AI, is a criminal offence. Drawings and cartoons fall under a separate law, the Coroners and Justice Act 2009 s.62.","status":"verified"},{"claim":"Sharing an intimate image of an adult without their consent is also a crime, and so is threatening to share one.","source":"Sexual Offences Act 2003 s.66B, inserted by the Online Safety Act 2023 and in force from 31 January 2024: it is an offence to intentionally share a photograph or film which shows, or appears to show, another person in an intimate state without their consent or a reasonable belief in it, and to threaten to share one, whether or not the image exists. It has no age limit, so it protects under 18s too. DfE, RSHE 2025: sharing indecent images of people over 18 without consent is a crime.","status":"verified"},{"claim":"Most young people have never sent a nude: large studies of under 18s put it at about one in five or fewer.","source":"Madigan and colleagues, JAMA Pediatrics 2018, a meta analysis of 39 studies and 110,380 young people under 18: 14.8 percent had sent a sext and 27.4 percent had received one. Mori and colleagues, Journal of Adolescent Health 2022, 28 studies and 48,024 young people, data from 2016 on: 19.3 percent had sent one and 34.8 percent had received one. Rates rise with age, and a sext in these studies can be a sexual message as well as an image.","status":"verified"},{"claim":"Report Remove, from Childline and the Internet Watch Foundation, lets anyone under 18 in the UK report a sexual image of themselves confidentially. If it breaks the law, they work to get it taken down and stop it being posted again.","source":"Internet Watch Foundation, Report Remove: for young people under 18 in the UK to confidentially report sexual images and videos of themselves. The IWF reviews each report and works to have it removed if it breaks the law, and makes a hash, a digital fingerprint, that tech platforms use to help stop it being shared or uploaded again. Young people do not need to give their real name; those aged 13 or over are asked to prove their age with ID through Yoti. It was built with law enforcement so that children are not unnecessarily visited by the police. Removal is not guaranteed: in 2025 the IWF took action on 1,175 of the 1,894 reports it received.","status":"verified"},{"claim":"If an image of you has been shared, you will not be in trouble for asking for help, and the law exists to protect young people, not to criminalise them.","source":"DfE, RSHE statutory guidance, July 2025: pupils should understand that they will not be in trouble for asking for help, either at school or with the police, if an image of themselves has been shared. KCSIE 2026 para 557: staff should explain that the law exists to protect children and young people, not criminalise them. CEOP Education, for 11 to 18 year olds: if you have been pressured to share an image of yourself, you will not be in trouble. UKCIS 2024: the police must still record an incident, and where there is no exploitation, grooming, profit motive, malicious intent or extensive sharing they can record it as outcome 21, further action not in the public interest, which is a police decision.","status":"verified"},{"claim":"If someone threatens to share an image unless you send more, sending more is no guarantee it stops: they will likely ask for more. It is never the young person's fault.","source":"CEOP Education, Online blackmail, for 11 to 18 year olds: don't send them anything as they will just ask for more; block and report the account, tell an adult you trust, and it is never your fault if you are blackmailed online. NCA and CEOP Education, Financially motivated sexual extortion: alert for education settings, April 2024: there is no guarantee that paying will stop the threats, and once you have shown you can pay, they will likely ask for more; avoid deleting anything that could be used as evidence; a child or young person is never to blame; the designated safeguarding person should immediately refer a disclosure to the police and/or local authority children's services.","status":"verified"},{"claim":"Consent means agreeing by choice, with the freedom and capacity to choose, and it can be taken back at any time, even after a yes.","source":"Sexual Offences Act 2003 s.74: a person consents if he agrees by choice, and has the freedom and capacity to make that choice. DfE, RSHE statutory guidance, July 2025: sexual consent and their capacity to give, withhold or remove consent at any time, even if initially given. KCSIE 2026 para 543: consent can be withdrawn at any time during sexual activity, and each time activity occurs.","status":"verified"},{"claim":"Sharing an image without consent sits inside a wider group of behaviours called sexual harassment, and upskirting is a criminal offence.","source":"KCSIE 2026 para 539: sexual harassment means unwanted conduct of a sexual nature, online and offline. Para 540 lists examples including upskirting (this is a criminal offence), and online sexual harassment such as making or sharing nudes or semi nudes, sharing unwanted explicit content, and coercing others into sharing images of themselves. Sexual Offences Act 2003 s.67A, in force from 12 April 2019: operating equipment or recording an image beneath someone's clothing without consent, to see their genitals or buttocks, is an offence.","status":"verified"}]$ev$::jsonb, true)
 where l.module_id = 'ks4-16-consent-images-law' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'350 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_350 b on b.module_id = l.module_id
   where l.module_id <> 'ks4-16-consent-images-law'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '350 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks4-16-consent-images-law.json string for string:
-- 32 slides, 484 strings, multiset hash 043b83d694302371d1b30116a93e87ad (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks4-16-consent-images-law' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select title from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select year_band from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select audience from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks4-16-consent-images-law'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks4-16-consent-images-law';
  if got_hash is distinct from '043b83d694302371d1b30116a93e87ad' or got_n <> 484 or got_slides <> 32 then
    raise exception '350 aborted, ks4-16-consent-images-law does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_350(text, text[], text, text, text);

commit;
