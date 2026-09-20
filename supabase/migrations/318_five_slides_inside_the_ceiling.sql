-- FIVE KS4 CONCEPT SLIDES BROUGHT INSIDE THE 105 WORD CEILING.
--
-- The lesson council's counted checks (scripts/council.mjs) were run over
-- all 29 modules on 20 September 2026, the first time since the four new
-- modules landed. Prose scored 9.81: 7 of 375 prose slides over the ceiling,
-- and 5 of those 7 were in the two new KS4 modules, at 120 to 165 words
-- against a ceiling of 105 that was measured on the real projector (see
-- WORD_CEILING in scripts/council-checks.mjs). Every other structural
-- measure on the four new modules matched the other twenty five.
--
-- Justin's decision the same day: trim. So each of the five bodies is
-- rewritten to at most 103 words with its heading, two under the ceiling so
-- a later copy edit has room. No claim is dropped: what left the wall moved
-- into the teacher script on the same slide, which is the teacher's words
-- and is not read while they talk. Every evidence phrase the statutory
-- attestation holds these modules to is still on the slide it was found on.
--
-- Same discipline as 310 and 316: every target is looked up by its real
-- heading, the body it must currently hold is checked before it is
-- replaced, misses are collected, and the whole migration aborts with all
-- of them listed rather than writing a partial answer. The two hash
-- assertions at the end prove the rows now equal the source JSON in
-- content/modules, string for string.

begin;

create table if not exists schools.school_lessons_backup_318 as
select * from schools.school_lessons;
alter table schools.school_lessons_backup_318 enable row level security;

create temp table miss (module text, target text) on commit drop;

-- Replace one field of one slide, found by heading, and only if the body
-- is exactly what this migration expects to find there.
create or replace function schools.set_by_heading(
  p_module text, p_heading text, p_expect_body text, p_field text, p_value text
) returns void language plpgsql as $$
declare pos int;
begin
  select ord - 1 into pos
  from schools.school_lessons l,
       lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
  where l.module_id = p_module and s.slide->>'heading' = p_heading limit 1;
  if pos is null then insert into miss values (p_module, 'heading: ' || p_heading); return; end if;
  if (select l.slides->pos->>'body' from schools.school_lessons l where l.module_id = p_module) is distinct from p_expect_body then
    insert into miss values (p_module, 'body drifted under: ' || p_heading); return;
  end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array[pos::text, p_field], to_jsonb(p_value))
   where l.module_id = p_module;
end $$;

-- ks4-28-the-money-and-the-odds, slide 16, "The loop, and how fast it runs": 120 words to 103
select schools.set_by_heading('ks4-28-the-money-and-the-odds', 'The loop, and how fast it runs', 'Two products can carry identical odds and be completely different things to use, and the biggest difference between them is speed. A draw once a week puts seven days between staking and knowing. An online slot puts about two seconds there. Nobody has actually proved that the speed itself is what causes the harm, and it is still the thing the law acts on: since 2025 nobody in Britain may stake more than £5 on one spin of an online slot, and anyone under 25 is capped at £2. A lottery ticket has no cap at all. If you keep one question from this hour, keep this one: how fast is the loop?', 'body',
  'Two products can carry identical odds and be different to use, and the difference is speed. A weekly draw puts seven days between staking and knowing. An online slot puts about two seconds there. Nobody has proved the speed itself causes the harm, and it is still what the law acts on: since 2025 nobody in Britain may stake more than £5 on one online slot spin, and under 25s are capped at £2. A lottery ticket has no cap. If you keep one question from this hour, keep this one: how fast is the loop?');

-- ks4-28-the-money-and-the-odds, slide 18, "What it does to a person": 148 words to 103
select schools.set_by_heading('ks4-28-the-money-and-the-odds', 'What it does to a person', 'This is the part that usually gets left out. Gambling harm is not mainly about money, and it starts with money. Because the price is hidden and the loss is gradual, it is gone before the feeling of spending arrives, and the gap gets filled by borrowing: from a friend, from a sibling, from a card that is not yours. Then the borrowing has to be hidden too. People describe not sleeping, lying to the people closest to them, and a background dread that never lifts. It is linked with anxiety and with depression, and at its most serious it is linked with suicide. That is why there are NHS clinics for it rather than it being filed under bad habits. None of that makes anybody who plays a game weak. It makes this worth understanding now, while it is still theory.', 'script',
  'Slow right down here and drop your volume rather than raising it. Somebody in most rooms has a parent or an older sibling in this paragraph, which is why the harm is described as things a person does and feels rather than as a diagnosis. Do not ask for examples and do not ask anyone to imagine a family member. Go straight on to the next slide, which is the one that gives them somewhere to put it. The borrowing in that paragraph is from a friend, a sibling, or a card that is not theirs, and the clinics exist because this is treated as a health problem rather than filed under bad habits. Both can be said out loud if the room needs them.');
select schools.set_by_heading('ks4-28-the-money-and-the-odds', 'What it does to a person', 'This is the part that usually gets left out. Gambling harm is not mainly about money, and it starts with money. Because the price is hidden and the loss is gradual, it is gone before the feeling of spending arrives, and the gap gets filled by borrowing: from a friend, from a sibling, from a card that is not yours. Then the borrowing has to be hidden too. People describe not sleeping, lying to the people closest to them, and a background dread that never lifts. It is linked with anxiety and with depression, and at its most serious it is linked with suicide. That is why there are NHS clinics for it rather than it being filed under bad habits. None of that makes anybody who plays a game weak. It makes this worth understanding now, while it is still theory.', 'body',
  'Gambling harm starts with money and is not mainly about money. Because the price is hidden, the loss is gone before the feeling of spending arrives, and the gap gets filled by borrowing, which has to be hidden too. People describe not sleeping, lying to those closest to them, and a dread that never lifts. It is linked with anxiety and with depression, and at its worst with suicide. That is why the NHS has clinics for it. None of that makes anybody who plays weak. It makes this worth understanding now, while it is still theory.');

-- ks4-29-did-not-go-looking, slide 14, "What helps afterwards": 151 words to 102
select schools.set_by_heading('ks4-29-did-not-go-looking', 'What helps afterwards', 'Here is the part that almost never gets taught. Seeing something you were not ready for can keep coming back for a while, at odd moments and without being invited. That is an ordinary response to something out of the ordinary. It is not weakness and it is not a sign that anything is wrong with you. Two things shorten it. Saying it out loud to one person, which takes it out of the private loop it is stuck in. And knowing the free routes are already there, so that if it does not fade there is an obvious place to go. Samaritans on 116 123, any age, day or night, and it does not show on the phone bill. Childline on 0800 1111 if you are under 19. HOPELINE247 on 0800 068 4141, which is there for anyone under 35 and for anyone worried about somebody else.', 'body',
  'Seeing something you were not ready for can keep coming back, uninvited. That is an ordinary response to something out of the ordinary. It is not weakness, and not a sign anything is wrong with you. Two things shorten it: saying it out loud to one person, which breaks the private loop, and knowing the free routes are there if it does not fade. Samaritans on 116 123, any age, day or night, not on the phone bill. Childline on 0800 1111 for under 19s. HOPELINE247 on 0800 068 4141 for anyone under 35, or worried about somebody else.');

-- ks4-29-did-not-go-looking, slide 16, "What the offer actually is": 154 words to 103
select schools.set_by_heading('ks4-29-did-not-go-looking', 'What the offer actually is', 'The other thing that arrives is an offer. It comes from somebody you half know, or somebody who found you through a friend, and it is friendly first. Easy money, a lift somewhere, hold onto this for me, nothing heavy. What is actually being sold is you: somebody who can carry something they would rather not be caught carrying. It is sold as a job and it works like a debt, because sooner or later something goes missing and is owed, and the owing is what makes leaving hard. That is the design, not a thing that went wrong. The same door sells other things. Knives get advertised as though a website were a loophole, and it is not one: selling one to anybody under 18 has been an offence for decades, and since 2022 it is also an offence to deliver one bought online to a home address.', 'script',
  'The offer comes from somebody they half know, or somebody who found them through a friend, and the friendly opening is the design rather than a coincidence. Level tone, no drama. The idea to land is that the debt is the mechanism rather than an accident, which is why the friendly part comes first and lasts exactly as long as it needs to. Pupils who know somebody in this will be listening very carefully, so give them nothing to react to on their faces: no examples, no naming areas, no asking whether anybody has been approached. The knife lines at the end are deliberately flat and factual, because the useful thing there is simply that the website is not a loophole. On knives, the under 18 sale offence has stood for decades; the 2022 change added the offence of delivering one bought online to a home address.');
select schools.set_by_heading('ks4-29-did-not-go-looking', 'What the offer actually is', 'The other thing that arrives is an offer. It comes from somebody you half know, or somebody who found you through a friend, and it is friendly first. Easy money, a lift somewhere, hold onto this for me, nothing heavy. What is actually being sold is you: somebody who can carry something they would rather not be caught carrying. It is sold as a job and it works like a debt, because sooner or later something goes missing and is owed, and the owing is what makes leaving hard. That is the design, not a thing that went wrong. The same door sells other things. Knives get advertised as though a website were a loophole, and it is not one: selling one to anybody under 18 has been an offence for decades, and since 2022 it is also an offence to deliver one bought online to a home address.', 'body',
  'The other thing that arrives is an offer. It is friendly first: easy money, a lift, hold onto this for me. What is actually being sold is you, somebody to carry what they would rather not be caught carrying. It is sold as a job and works like a debt: sooner or later something is owed, and the owing is what makes leaving hard. The same door sells knives, and the website is not a loophole. Selling one to anybody under 18 is an offence, and since 2022 so is delivering one bought online to a home address.');

-- ks4-29-did-not-go-looking, slide 18, "The part of this that is on your side": 165 words to 101
select schools.set_by_heading('ks4-29-did-not-go-looking', 'The part of this that is on your side', 'Three things are true at once here, and pupils usually only hear the first. Supplying drugs is a serious criminal offence and being young changes nothing about that, and the offer by itself is already the offence, before anything changes hands. Second, being sent a message is not an offence. Passing somebody else''s offer on can be one, and that is the single route by which a person who only received something ends up in trouble, which is exactly why the first move is to stop it. Third, if you were pushed, tricked or threatened into carrying or selling, the law calls that exploitation, and there is a defence written for people under 18 in exactly that position. It will not stop you being arrested or questioned, and nobody here is going to pretend it will. What it means is that telling an adult early is the single thing most likely to count in your favour.', 'script',
  'Three things are true at once here and pupils usually only hear the first, so say that before you read them. Say all three and soften none of them, especially not the third, where the temptation is to round it up into a promise. Do not. Pupils who are in this have been told by whoever recruited them that nobody will believe them and that they will simply be arrested, and a pupil who is told the comforting version and is then arrested will decide the teacher lied and stop listening to the whole module. The honest version is stronger anyway. Read the subject knowledge on this before you teach it, because the next question is always what would actually happen, and there are two things worth having ready: the defence covers drug supply and does NOT cover robbery, and a school is not the body that makes the formal referral. Then go straight to the routes, because a pupil who has just heard this needs somewhere to put it before the feeling passes.');
select schools.set_by_heading('ks4-29-did-not-go-looking', 'The part of this that is on your side', 'Three things are true at once here, and pupils usually only hear the first. Supplying drugs is a serious criminal offence and being young changes nothing about that, and the offer by itself is already the offence, before anything changes hands. Second, being sent a message is not an offence. Passing somebody else''s offer on can be one, and that is the single route by which a person who only received something ends up in trouble, which is exactly why the first move is to stop it. Third, if you were pushed, tricked or threatened into carrying or selling, the law calls that exploitation, and there is a defence written for people under 18 in exactly that position. It will not stop you being arrested or questioned, and nobody here is going to pretend it will. What it means is that telling an adult early is the single thing most likely to count in your favour.', 'body',
  'Supplying drugs is a serious criminal offence, being young changes nothing, and the offer alone is the offence. Being sent a message is not an offence, but passing somebody else''s offer on can be, so stop it first. If you were pushed, tricked or threatened into carrying or selling, the law calls that exploitation, and there is a defence written for under 18s. It will not stop you being arrested or questioned, and nobody will pretend it will. Telling an adult early is the thing most likely to count in your favour.');

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not found: %', n, list; end if;
end $$;

drop function if exists schools.set_by_heading(text, text, text, text, text);

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
     or got_n is distinct from 476
     or got_hash is distinct from '16e31404aa5b454e06d34c6088b7f34a' then
    raise exception '318 ks4-28-the-money-and-the-odds: ks4-28-the-money-and-the-odds is not intact (slides %, strings %, hash %)',
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
     or got_n is distinct from 476
     or got_hash is distinct from '0387224b6dae2ef0fc09246a24a4545d' then
    raise exception '318 ks4-29-did-not-go-looking: ks4-29-did-not-go-looking is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

commit;
