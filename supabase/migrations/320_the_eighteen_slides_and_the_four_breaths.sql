-- 320: the eighteen slides inside their ceilings, and the four half time breaths with their friend
--
-- Justin, 20 September 2026: "yes fix slides". The council measured on
-- production this evening found eighteen slides over the wall ceiling: twelve
-- KS2 to KS4 concept slides that the September clauses (309, 310, 316) pushed
-- past the measured 105 word projector ceiling, and six early years slides
-- over the 12 word decoding ceiling. Past the ceiling a slide clips on a
-- 1920 by 1080 wall.
--
-- THE CLAUSES MOVE, THEY DO NOT GO. Every appended clause was put there to
-- meet a statutory requirement and the 147 phrase attestation reads it. So
-- each one leaves the wall and goes into the teacher's script, word for
-- word, introduced as "Say this, as written", sitting between the teacher's
-- own notes and the delivery notes the same migration added about it. The
-- wall keeps the idea the slide was built for; the teacher still says every
-- sentence; the attestation still finds every phrase, because the script is
-- part of the slide.
--
-- THE EARLY YEARS SLIDES get one short line a Reception or Year 1 child can
-- hear read to them, and the line that was there goes into the script the
-- same way. The council no longer counts the eyebrow label on a title slide
-- (scripts/council-checks.mjs), which is what made those three impossible.
--
-- THE FOUR BREATHS. The four lessons written on 19 September carried the
-- half time star breath with no friend, no heading, no half time words and a
-- thirty second cycle, which the player renders as one breath in that lasts
-- half a minute. They now breathe like the other twenty five: four seconds,
-- the module's friend, the register of the key stage. Contract rule 12 keeps
-- it that way.
--
-- Every write is guarded: the body must end with the exact clause the earlier
-- migration appended (or, for ks3-12, begin with its original opening), the
-- script must end with the notes that came with it, and the early years
-- fields must hold their exact current text. Any miss aborts the whole thing.

begin;

create table schools.school_lessons_backup_320 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_320 enable row level security;

create temp table miss(module text, target text);

-- The clause at the end of the body goes into the script, as written, between
-- the teacher's own notes and the delivery notes that arrived with it.
create or replace function schools.move_off_wall(p_module text, p_heading text, p_clause text, p_notes text)
returns void language plpgsql as $$
declare pos int; body text; script text; core text;
begin
  select ord - 1 into pos
  from schools.school_lessons l, lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
  where l.module_id = p_module and s.slide->>'heading' = p_heading limit 1;
  if pos is null then insert into miss values (p_module, 'heading: ' || p_heading); return; end if;
  select l.slides->pos->>'body', l.slides->pos->>'script' into body, script from schools.school_lessons l where l.module_id = p_module;
  if body is null or right(body, length(p_clause)) <> p_clause then insert into miss values (p_module, p_heading || ': the body does not end with the clause'); return; end if;
  if p_notes <> '' and (script is null or right(script, length(p_notes)) <> p_notes) then insert into miss values (p_module, p_heading || ': the script does not end with the notes'); return; end if;
  core := case when p_notes <> '' then left(script, length(script) - length(p_notes)) else coalesce(script, '') end;
  update schools.school_lessons l
     set slides = jsonb_set(
           jsonb_set(l.slides, array[pos::text, 'body'], to_jsonb(rtrim(left(body, length(body) - length(p_clause))))),
           array[pos::text, 'script'], to_jsonb(core || ' Say this, as written: ' || btrim(p_clause) || p_notes))
   where l.module_id = p_module;
end $$;

-- The same, for the one slide whose appended parts came from more than one
-- place: it keeps its original opening and everything after it moves.
create or replace function schools.move_off_wall_after(p_module text, p_heading text, p_keep text, p_notes text)
returns void language plpgsql as $$
declare pos int; body text; script text; core text; clause text;
begin
  select ord - 1 into pos
  from schools.school_lessons l, lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
  where l.module_id = p_module and s.slide->>'heading' = p_heading limit 1;
  if pos is null then insert into miss values (p_module, 'heading: ' || p_heading); return; end if;
  select l.slides->pos->>'body', l.slides->pos->>'script' into body, script from schools.school_lessons l where l.module_id = p_module;
  if body is null or left(body, length(p_keep)) <> p_keep or length(body) <= length(p_keep) then insert into miss values (p_module, p_heading || ': the body does not begin with its original opening'); return; end if;
  if p_notes <> '' and (script is null or right(script, length(p_notes)) <> p_notes) then insert into miss values (p_module, p_heading || ': the script does not end with the notes'); return; end if;
  clause := substr(body, length(p_keep) + 1);
  core := case when p_notes <> '' then left(script, length(script) - length(p_notes)) else coalesce(script, '') end;
  update schools.school_lessons l
     set slides = jsonb_set(
           jsonb_set(l.slides, array[pos::text, 'body'], to_jsonb(p_keep)),
           array[pos::text, 'script'], to_jsonb(core || ' Say this, as written: ' || btrim(clause) || p_notes))
   where l.module_id = p_module;
end $$;

-- One field on one early years slide, proven by its title or heading and by
-- its exact current text; the old line goes into the script, as written.
create or replace function schools.replace_on_wall(p_module text, p_pos int, p_check_field text, p_check text, p_field text, p_expect text, p_new text)
returns void language plpgsql as $$
declare cur text; chk text;
begin
  select l.slides->p_pos->>p_check_field, l.slides->p_pos->>p_field into chk, cur from schools.school_lessons l where l.module_id = p_module;
  if chk is null or chk <> p_check then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not ' || p_check); return; end if;
  if cur is null or cur <> p_expect then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || p_field || ' is not the expected text'); return; end if;
  update schools.school_lessons l
     set slides = jsonb_set(
           jsonb_set(l.slides, array[p_pos::text, p_field], to_jsonb(p_new)),
           array[p_pos::text, 'script'], to_jsonb(coalesce(l.slides->p_pos->>'script', '') || ' The line that used to be on the wall, to say as written: ' || p_expect))
   where l.module_id = p_module;
end $$;

-- The bare breath becomes the friend's.
create or replace function schools.set_breath(p_module text, p_pos int, p_config jsonb, p_script text)
returns void language plpgsql as $$
declare comp text; cfg jsonb;
begin
  select l.slides->p_pos->>'component', l.slides->p_pos->'config' into comp, cfg from schools.school_lessons l where l.module_id = p_module;
  if comp is distinct from 'star-breath' or cfg is distinct from '{"seconds": 30}'::jsonb then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not the bare breath'); return; end if;
  update schools.school_lessons l
     set slides = jsonb_set(jsonb_set(l.slides, array[p_pos::text, 'config'], p_config), array[p_pos::text, 'script'], to_jsonb(p_script))
   where l.module_id = p_module;
end $$;

-- ── the twelve clauses, off the wall and into the script ────────────────
select schools.move_off_wall('ks2-06-how-algorithms-work', 'An algorithm is a recipe',
  ' Search boxes follow a recipe too. When you search for something, nobody hands you all the answers in the world: a recipe picks which ones to show you first, and the ones at the very top are often there because a company paid to be there. First does not mean truest. It means chosen.',
  ' Add the search box lines once the recipe idea has landed, because they are the same idea in the place children trust most. Most of this class believes a search result is just the answer. Two sentences fix that: something chose the order, and the top ones are sometimes adverts. Ask for a show of hands on who thought the first result was the best one. Do not spend more than a minute.');

select schools.move_off_wall('ks2-07-privacy-reputation', 'The internet remembers',
  ' And here is the part that surprises people: online, anybody can say they are anybody. A grown up can make an account that says they are eleven, with a photo that is not theirs. That is not a reason to be frightened of everyone, it is a reason to have one rule. If someone you have not met asks you anything about yourself, asks for a photo, or asks you to keep the chat secret, you stop and you tell a grown up. Every single time.',
  ' The added lines matter and the register matters more. Say it the way you would say look both ways: a fact, then a rule, no fear. Anybody can claim to be anybody, so the rule is not about spotting the bad one, it is about what you do when someone you have not met asks for something. Land the three asks, information, a photo, or secrecy, and the one answer: stop and tell a grown up. If any child looks worried, follow it up afterwards rather than in front of the room.');

select schools.move_off_wall('ks2-08-kind-safe-online', 'Telling is strength, not snitching',
  ' One more thing, and it is the most useful sentence in this lesson. In this school there is a grown up whose actual job is this. Not something they do as well as teaching. The job. Your teacher is going to say their name out loud now, and it is worth writing down, because the worst moment to work out who to tell is the moment you need to.',
  ' Stop here and name your designated safeguarding lead out loud, by name, and say where in the building they are. Write it on the board and leave it there for the rest of the lesson. This is the one moment in the primary scheme that only you can deliver, and a class that leaves knowing the name is the whole difference between a policy and a child who tells somebody.');

select schools.move_off_wall('ks3-11-social-workarounds', 'A group chat with strangers in it',
  ' That is the difference between a private space and a public one, and online the two look identical from the inside. A private space is one where you could name everyone. Everything else is public, whatever the app calls it. And what you say in either is held to the same standard as what you say out loud in a corridor: being behind a screen changes who can see you, never what is decent.',
  ' The added lines give the room two words worth having: private means you could name everyone, public is everything else. Then the standard, said once and not laboured, because this class has been hearing it since Year 1: the screen changes the audience, not the rules.');

select schools.move_off_wall('ks3-14-bodies-image-pressure', 'What it is, and what it is not',
  ' There is one more thing worth knowing, because it is the part that reaches other people. Watching a lot of it can quietly change what someone expects of a partner, and a lot of it is made as though one person matters and the other is there to be used. That is where it does its damage: not in the watching, but in someone carrying that expectation into a real relationship, as though another person owes them something.',
  ' The added lines are the ones to deliver most steadily, because they are the reason this is in a relationships curriculum at all. The harm being named is an attitude travelling into a real relationship, not a private act. Keep it short, keep it factual, take no questions into detail, and move straight on to the check.');

select schools.move_off_wall('ks4-16-consent-images-law', 'What consent actually is',
  ' Those four properties were never only about images. They are what consent is for anything: going further, meeting up, being touched, being filmed, being posted. Freely given means nobody was worn down first. Specific means yes to one thing is not yes to the next thing. Ongoing means it gets checked rather than assumed from last time. Reversible means anybody can change their mind partway through, and that is simply the end of it, with no debt and no explanation owed. Exactly the same in a room and on a phone, and the phone is the harder one, because a message makes it so much easier to keep asking.',
  ' Land the four properties as a general rule before the lesson narrows to images, because taught the other way round they sound like a rule about photographs. The last sentence is the one to say slowly: a phone makes asking again cost nothing, which is exactly why worn down is the property that breaks first. Do not invite examples and do not ask anybody to apply it to themselves.');

select schools.move_off_wall('ks4-16-consent-images-law', 'A threat is never your fault',
  ' Sharing an image without consent sits inside a bigger group of behaviours with a name: sexual harassment. It covers unwanted sexual messages or attention, pressuring someone into anything sexual, and taking a photo up someone''s clothing without them knowing, which is the offence called upskirting. None of it is banter and none of it is the fault of the person it happens to.',
  ' Read the second half at the same steady pace. You are naming a category, not starting a new topic: sharing without consent is one member of a family of behaviours, and the family has a name. Upskirting is worth saying out loud because it is a specific criminal offence and most classes have never heard it named by an adult. Do not invite examples.');

select schools.move_off_wall('ks4-16-consent-images-law', 'And something can be done',
  ' The same door opens the other way round, and almost nobody says this out loud. If it is your own behaviour worrying you, if you pressured somebody, or sent something on, or did something you have not been able to stop thinking about since, telling an adult early is still the thing that changes what happens next, and it is treated very differently from being found out later. If somebody has hurt you, every route on this slide is yours. And if you have been physically hurt, that is a GP, or 111, or A and E, and going is not an admission of anything. None of these doors close because time has passed.',
  ' The own behaviour lines are the reason this slide now runs slightly longer, and they are worth the seconds. Say them in exactly the same voice as the rest, with no warning and no weight, because a pupil who is in that position will be listening very hard for a change of tone and will stop listening if they hear one. Do not look at anybody while you read it. Know your own school process first, because the question that follows is always what would actually happen.');

select schools.move_off_wall('ks4-17-sextortion', 'What sextortion is',
  ' It has a family name, and knowing the family is more use than knowing one member of it. Exploitation is somebody getting something out of you using a power they have and you do not: age, money, information, or a secret. Sexual exploitation uses sex. Criminal exploitation uses you to carry or to sell. Financial exploitation uses your money or your bank account. Abuse is the word for the harm underneath all of them. And grooming is the part that comes first in every single one, the warm, generous, patient stretch, because all of these need trust before they need anything else. They are separate crimes in law and they share one opening move, which is why learning the opening move beats memorising the list.',
  ' Land the family idea before the lesson narrows back to sextortion, because it is the part that transfers to something they have not met yet. The sentence worth repeating is the last one: five different crimes, one opening move, so learn the move. If somebody asks whether grooming always means something sexual, the accurate answer is no, and criminal exploitation is exactly the case that proves it.');

select schools.move_off_wall('ks4-17-sextortion', 'The scripts they use',
  ' Those scripts are the extreme version of something far more ordinary, and it happens between people who actually know each other. Pressure is asking again after a no. It is going quiet until somebody gives in. It is if you actually liked me. It is everyone else already has. None of those is a request, they are a wearing down, and the answer to all four is the same: a no does not need a reason and it does not expire. Then the half nobody teaches. Read your own messages for those four moves. Asking twice is human. Asking until somebody stops saying no is pressure, whoever is doing it.',
  ' The four ordinary moves land better than the criminal scripts do, because most of this room has seen all four. Read them plainly and do not moralise. Then the turn at the end is the important part and it needs no build up: check your own sent messages. Say it once, move on, and do not ask for a show of hands. A pupil who recognises themselves needs the sentence, not the spotlight.');

select schools.move_off_wall('ks4-18-radicalisation-misogyny', 'Misogyny is the most common on ramp',
  ' And it is not only about women, which is worth saying plainly. The same machine runs on race, on religion, on disability, on sexual orientation and on trans people, and it runs the same way every time: a stereotype arrives as a joke, agreeing with it gets rewarded, and the feed learns to bring more. The damage is not the joke. It is that a stereotype repeated often enough stops sounding like an opinion and starts sounding like a fact about somebody you have never met. That is how prejudice gets built one post at a time, and it is the same road by which treating a person as though their answer does not matter starts to seem ordinary.',
  ' Read the added lines at the same flat pace as the rest. The list of characteristics is deliberately said once and not dwelt on, because a register change here turns the slide into a lecture and the class stops listening. The sentence that does the work is the last one: a stereotype is how somebody becomes a category, and a category is easier to treat badly than a person. If a pupil argues that a joke is only a joke, the honest answer is that the joke is not the damage, the repetition is.');

select schools.move_off_wall('ks1-02-kind-screens-calm-bodies', 'Screens change how bodies feel',
  ' And here is how you know when to go and tell a grown up. It is not only when something huge happens. It is when the yucky feeling will not go away by itself, or when it comes back again tomorrow, or when something makes you want to keep it secret. Any one of those three is enough. You do not need all three and you do not need a reason.',
  ' The three signals at the end are new and they are the point of the slide. Count them on your fingers: it will not go away, it comes back tomorrow, it wants to be a secret. Say the last one twice, because secrecy is the signal that matters most and the one children are least likely to act on. Then say the permission part plainly: one is enough, and you never have to explain why first.');

select schools.move_off_wall_after('ks3-12-misinfo-deepfakes', 'Content can be manufactured',
  'Some of what you see online is real. Some is edited. And some is made entirely by a computer: faces, voices, whole events that never happened. The three look identical at first glance. That is not a reason to panic. It is a reason to check, and checking takes under a minute once you know the three questions.',
  ' The conspiracy lines are new and they are the ones to slow down for. Land the tell rather than any example: a claim built so that counter evidence becomes more proof is the shape to recognise. Deliberately no worked example here, because naming a live theory in a classroom hands it an audience. If a pupil offers one, take the shape and not the topic: does anything count as evidence against it?');

-- ── the five early years lines ───────────────────────────────────────────
select schools.replace_on_wall('eyfs-01-screens-kindness', 1, 'title', 'Screens and kindness, real and not real', 'body',
  'Our very first screen lesson with Pebble and DiGi Junior. Some things on a screen are real. Some are made up. And we always have a grown up to ask.',
  'Real, or made up? Ask.');

select schools.replace_on_wall('eyfs-01-screens-kindness', 8, 'heading', 'Stop, look, ask a grown up', 'caption',
  'Our special tool. DiGi Junior does the star pause at Stop, and you can too.',
  'DiGi Junior does the star pause.');

select schools.replace_on_wall('ks1-02-kind-screens-calm-bodies', 0, 'title', 'Kind screens, calm bodies', 'body',
  'Today we find out how screens make our bodies and our feelings feel, and we learn what to do with a big feeling.',
  'Big feelings from screens, and what to do.');

select schools.replace_on_wall('ks1-02-kind-screens-calm-bodies', 7, 'heading', 'Pebble''s three steps', 'caption',
  'Pebble is our gentle yellow guide. When a feeling arrives after screen time, we do her three steps.',
  'Feel it, name it, tell a grown up.');

select schools.replace_on_wall('ks1-03-real-pretend-computer', 0, 'title', 'Real, pretend, or made by a computer', 'body',
  'Today we become picture detectives. Some pictures are real, some are pretend, and some are made by a computer. Can you tell which is which?',
  'Picture detectives, are you ready?');

-- ── the four breaths ─────────────────────────────────────────────────────
select schools.set_breath('ks2-26-why-thirteen', 20, '{"seconds":4,"character":"bloop","register":"playful","heading":"Half time · everyone together","prompt":"Two breaths: in as Bloop grows, out as Bloop shrinks. Then tell your neighbour one thing from today that surprised you, and write it on your sheet."}'::jsonb,
  'Half time. Two breaths with the whole room, in as Bloop grows and out as Bloop shrinks. Then thirty seconds in pairs on one thing that surprised them, and they write it on their sheet. Nothing is marked and nobody reads theirs out. This lesson runs on one idea repeated, which is tiring in a different way from a busy lesson, so the pause earns its place here. Then straight into the sorting task.');

select schools.set_breath('ks3-27-when-it-turns-on-you', 20, '{"seconds":4,"character":"orbit","register":"level","heading":"Half time","prompt":"Two breaths with Orbit: in as Orbit grows, out as Orbit shrinks. Then tell your neighbour one thing from today that surprised you, and write it on your sheet."}'::jsonb,
  'Half time. Two breaths with the whole room, in as Orbit grows and out as Orbit shrinks. Then thirty seconds in pairs on one thing that surprised them, and they write it on their sheet. Nothing is marked and nobody reads theirs out. This lesson sits close to real experience for some of the room and the pause is not decoration here. Say nothing during the breaths. Then straight into the sort.');

select schools.set_breath('ks4-28-the-money-and-the-odds', 20, '{"seconds":4,"character":"nova","register":"still","heading":"Half time","prompt":"Two slow breaths: in as Nova grows, out as Nova shrinks. Then tell your neighbour one thing from today you want to remember, and write it on your sheet."}'::jsonb,
  'Half time. Two breaths with the whole room, in as Nova grows and out as Nova shrinks. Then thirty seconds in pairs on one thing they want to remember, and they write it on their sheet. Nothing is marked and nobody reads theirs out. The previous two slides sit close to home for part of the room and this pause is doing real work rather than decorating. Say nothing during the breaths. Then straight into the sort.');

select schools.set_breath('ks4-29-did-not-go-looking', 20, '{"seconds":4,"character":"digi","register":"still","heading":"Half time","prompt":"Two slow breaths: in as the star grows, out as it shrinks. Then tell your neighbour one thing from today you want to remember, and write it on your sheet."}'::jsonb,
  'Half time. Two breaths with the whole room, in as the star grows and out as it shrinks. Then thirty seconds in pairs on one thing they want to remember, and they write it on their sheet. Nothing is marked and nobody reads theirs out. This lesson asks more of a room than any other in the scheme and the pause is doing real work rather than decorating. Say nothing during the breaths. Then straight into the sort.');

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: nothing on the wall is over its ceiling ───────────────────
-- The same rule the council runs (scripts/council-checks.mjs), with the
-- eyebrow no longer counted on a title slide.
do $$
declare cnt int; list text;
begin
  with s as (
    select l.module_id, l.key_stage, e.ord as sn, e.slide
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality e(slide, ord)
  ), prose as (
    select module_id, key_stage, sn,
      case slide->>'type'
        when 'title' then concat_ws(' ', slide->>'title', slide->>'body')
        when 'concept' then concat_ws(' ', slide->>'heading', slide->>'body')
        when 'tryit' then concat_ws(' ', slide->>'heading', slide->>'body')
        when 'recap' then slide->>'heading'
        when 'keywords' then slide->>'heading'
        when 'digi' then slide->>'heading'
        when 'diagram' then concat_ws(' ', slide->>'heading', slide->>'caption')
        else null end as text
    from s
  ), over as (
    select module_id, sn, array_length(regexp_split_to_array(btrim(text), '\s+'), 1) as words
    from prose where text is not null
      and array_length(regexp_split_to_array(btrim(text), '\s+'), 1) > case key_stage when 'EYFS' then 12 when 'KS1' then 12 else 105 end
  )
  select count(*), string_agg(module_id || ' s' || sn || ' (' || words || ')', '; ') into cnt, list from over;
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % slide(s) still over the wall ceiling: %', cnt, list; end if;
end $$;

-- ── the proof: every star breath breathes for four seconds, the friend led ones
-- carry their words, and the four new lessons' half time breaths are the
-- friend's. (A lesson can carry other breaths, the Reception settle, the KS1
-- calm bodies practice, the KS4 panic lever, and those need no words.)
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(l.module_id || ' s' || e.ord, '; ') into cnt, list
  from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality e(slide, ord)
  where e.slide->>'component' = 'star-breath'
    and ((e.slide->'config'->>'seconds')::int is distinct from 4
      or (e.slide->'config'->>'character' is not null and (e.slide->'config'->>'prompt' is null or e.slide->'config'->>'heading' is null or e.slide->'config'->>'register' is null)));
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % breath(s) not in shape: %', cnt, list; end if;
  select count(*), string_agg(l.module_id, '; ') into cnt, list
  from schools.school_lessons l
  where l.module_id in ('ks2-26-why-thirteen', 'ks3-27-when-it-turns-on-you', 'ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking')
    and l.slides->20->'config'->>'character' is null;
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % half time breath(s) still without a friend: %', cnt, list; end if;
end $$;

-- ── the proof: ks2-26-why-thirteen equals content/modules/ks2-26-why-thirteen.json ──
-- ks2-26-why-thirteen
--
-- ks2-26-why-thirteen was carried into production in hash verified chunks
-- (scripts/module-to-chunks.mjs, proved by scripts/module-string-hash.mjs)
-- rather than as one statement, because a module migration is forty to
-- seventy thousand characters and the Supabase tool cannot carry that
-- reliably. The migration itself is supabase/migrations/ks2-26-why-thirteen.sql in
-- the repository. This entry is the executable proof that the row arrived
-- intact: 31 slides, 441 strings, and the multiset hash the
-- source JSON produces. It raises if anything differs, which also makes it
-- fail loudly if anybody later edits the row by hand.
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
     or got_n is distinct from 441
     or got_hash is distinct from '264587c87b256b7d2dec1bb1e8d9facd' then
    raise exception 'ks2-26-why-thirteen: ks2-26-why-thirteen is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- ── the proof: ks3-27-when-it-turns-on-you equals content/modules/ks3-27-when-it-turns-on-you.json ──
-- ks3-27-when-it-turns-on-you
--
-- ks3-27-when-it-turns-on-you was carried into production in hash verified chunks
-- (scripts/module-to-chunks.mjs, proved by scripts/module-string-hash.mjs)
-- rather than as one statement, because a module migration is forty to
-- seventy thousand characters and the Supabase tool cannot carry that
-- reliably. The migration itself is supabase/migrations/ks3-27-when-it-turns-on-you.sql in
-- the repository. This entry is the executable proof that the row arrived
-- intact: 31 slides, 446 strings, and the multiset hash the
-- source JSON produces. It raises if anything differs, which also makes it
-- fail loudly if anybody later edits the row by hand.
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
     or got_n is distinct from 446
     or got_hash is distinct from '22385dc9bbdb4c7a1092e91a16222ca9' then
    raise exception 'ks3-27-when-it-turns-on-you: ks3-27-when-it-turns-on-you is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- ── the proof: ks4-28-the-money-and-the-odds equals content/modules/ks4-28-the-money-and-the-odds.json ──
-- ks4-28-the-money-and-the-odds
--
-- ks4-28-the-money-and-the-odds was carried into production in hash verified chunks
-- (scripts/module-to-chunks.mjs, proved by scripts/module-string-hash.mjs)
-- rather than as one statement, because a module migration is forty to
-- seventy thousand characters and the Supabase tool cannot carry that
-- reliably. The migration itself is supabase/migrations/ks4-28-the-money-and-the-odds.sql in
-- the repository. This entry is the executable proof that the row arrived
-- intact: 31 slides, 481 strings, and the multiset hash the
-- source JSON produces. It raises if anything differs, which also makes it
-- fail loudly if anybody later edits the row by hand.
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
     or got_n is distinct from 481
     or got_hash is distinct from '586b102ed9901b83f154432460c1fbaa' then
    raise exception 'ks4-28-the-money-and-the-odds: ks4-28-the-money-and-the-odds is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

-- ── the proof: ks4-29-did-not-go-looking equals content/modules/ks4-29-did-not-go-looking.json ──
-- ks4-29-did-not-go-looking
--
-- ks4-29-did-not-go-looking was carried into production in hash verified chunks
-- (scripts/module-to-chunks.mjs, proved by scripts/module-string-hash.mjs)
-- rather than as one statement, because a module migration is forty to
-- seventy thousand characters and the Supabase tool cannot carry that
-- reliably. The migration itself is supabase/migrations/ks4-29-did-not-go-looking.sql in
-- the repository. This entry is the executable proof that the row arrived
-- intact: 31 slides, 481 strings, and the multiset hash the
-- source JSON produces. It raises if anything differs, which also makes it
-- fail loudly if anybody later edits the row by hand.
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
     or got_n is distinct from 481
     or got_hash is distinct from '15c6256c30c61ab88730157537eaa707' then
    raise exception 'ks4-29-did-not-go-looking: ks4-29-did-not-go-looking is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;

drop function if exists schools.move_off_wall(text, text, text, text);
drop function if exists schools.move_off_wall_after(text, text, text, text);
drop function if exists schools.replace_on_wall(text, int, text, text, text, text, text);
drop function if exists schools.set_breath(text, int, jsonb, text);

commit;
