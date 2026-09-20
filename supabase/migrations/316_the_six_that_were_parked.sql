-- THE SIX THAT WERE PARKED, TAUGHT RATHER THAN HANDED OVER.
--
-- The audit marked six requirements BY DESIGN: real, in the guidance, and
-- described in the mapping as the school's own scheme to teach. That was an
-- honest position and Justin took a better one on 19 September 2026: teach all
-- six, framed through the online context, because a school buying this scheme
-- still has its own RSE and the useful thing is the half that happens on a
-- phone. The guidance agrees, in its own words: RSHE-S-BS-1 says consent
-- applies "in all contexts, including online".
--
-- Same rule as 309, 310 and 311. No slide is added, no minute changes, every
-- clause is a sentence inside an idea the lesson already teaches. And the same
-- loud failure: every target is looked up by its real heading, misses are
-- collected, and the whole migration aborts with all of them listed rather
-- than writing a partial answer.
--
-- The headings were read out of the production snapshot rather than guessed,
-- which is what migration 310 learned the hard way.
--
-- Requirements closed here:
--   RSHE-P-GW-9   where and how to seek support, INCLUDING recognising the
--                 triggers for it, and who in school to speak to
--   RSHE-S-RR-9   how stereotypes based on sex, gender reassignment, race,
--                 religion, sexual orientation or disability cause damage
--   RSHE-S-BS-1   recognising, respecting and communicating consent and
--                 boundaries in relationships, in all contexts including online
--   RSHE-S-BS-2   identifying, resisting and understanding pressure, including
--                 sexual pressure, AND how to avoid putting pressure on others
--   RSHE-S-BS-11  the concepts and laws relating to exploitative harms
--   RSHE-S-BS-16  seeking support for your own worrying behaviour or for
--                 behaviour experienced from others, and where to report

begin;

create table if not exists schools.school_lessons_backup_316 as
select * from schools.school_lessons;

create temp table miss (module text, target text) on commit drop;

create or replace function schools.append_by_heading(
  p_module text, p_heading text, p_field text, p_add text
) returns void language plpgsql as $$
declare pos int;
begin
  select ord - 1 into pos
  from schools.school_lessons l,
       lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
  where l.module_id = p_module and s.slide->>'heading' = p_heading limit 1;
  if pos is null then insert into miss values (p_module, 'heading: ' || p_heading); return; end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array[pos::text, p_field],
           to_jsonb(coalesce(l.slides->pos->>p_field, '') || p_add))
   where l.module_id = p_module;
end $$;

-- ── RSHE-P-GW-9, first half: knowing WHEN to tell somebody ───────────────
-- The requirement asks for the triggers for seeking support, not only the
-- route. The scheme taught the route from Reception and never taught the
-- signal, which leaves a child waiting for something obviously terrible.
-- Three plain tests, at the age the feeling vocabulary is being built.
select schools.append_by_heading(
  'ks1-02-kind-screens-calm-bodies', 'Screens change how bodies feel', 'body',
  ' And here is how you know when to go and tell a grown up. It is not only when something huge happens. It is when the yucky feeling will not go away by itself, or when it comes back again tomorrow, or when something makes you want to keep it secret. Any one of those three is enough. You do not need all three and you do not need a reason.');

select schools.append_by_heading(
  'ks1-02-kind-screens-calm-bodies', 'Screens change how bodies feel', 'script',
  ' The three signals at the end are new and they are the point of the slide. Count them on your fingers: it will not go away, it comes back tomorrow, it wants to be a secret. Say the last one twice, because secrecy is the signal that matters most and the one children are least likely to act on. Then say the permission part plainly: one is enough, and you never have to explain why first.');

-- ── RSHE-P-GW-9, second half: WHO in school ──────────────────────────────
-- Only the school can name its own staff, so the lesson makes the teacher say
-- it out loud in the moment rather than leaving a blank on a slide. The note
-- in the mapping used to say this could not be taught. It can; it just cannot
-- be printed.
select schools.append_by_heading(
  'ks2-08-kind-safe-online', 'Telling is strength, not snitching', 'body',
  ' One more thing, and it is the most useful sentence in this lesson. In this school there is a grown up whose actual job is this. Not something they do as well as teaching. The job. Your teacher is going to say their name out loud now, and it is worth writing down, because the worst moment to work out who to tell is the moment you need to.');

select schools.append_by_heading(
  'ks2-08-kind-safe-online', 'Telling is strength, not snitching', 'script',
  ' Stop here and name your designated safeguarding lead out loud, by name, and say where in the building they are. Write it on the board and leave it there for the rest of the lesson. This is the one moment in the primary scheme that only you can deliver, and a class that leaves knowing the name is the whole difference between a policy and a child who tells somebody.');

-- ── RSHE-S-RR-9, the rest of the protected characteristics ───────────────
-- The module teaches the misogyny on ramp in full, which is the commonest
-- one and not the only one. The requirement names sex, gender reassignment,
-- race, religion, sexual orientation and disability, and asks HOW stereotypes
-- do damage, including normalising non consensual behaviour.
select schools.append_by_heading(
  'ks4-18-radicalisation-misogyny', 'Misogyny is the most common on ramp', 'body',
  ' And it is not only about women, which is worth saying plainly. The same machine runs on race, on religion, on disability, on sexual orientation and on trans people, and it runs the same way every time: a stereotype arrives as a joke, agreeing with it gets rewarded, and the feed learns to bring more. The damage is not the joke. It is that a stereotype repeated often enough stops sounding like an opinion and starts sounding like a fact about somebody you have never met. That is how prejudice gets built one post at a time, and it is the same road by which treating a person as though their answer does not matter starts to seem ordinary.');

select schools.append_by_heading(
  'ks4-18-radicalisation-misogyny', 'Misogyny is the most common on ramp', 'script',
  ' Read the added lines at the same flat pace as the rest. The list of characteristics is deliberately said once and not dwelt on, because a register change here turns the slide into a lecture and the class stops listening. The sentence that does the work is the last one: a stereotype is how somebody becomes a category, and a category is easier to treat badly than a person. If a pupil argues that a joke is only a joke, the honest answer is that the joke is not the damage, the repetition is.');

-- ── RSHE-S-BS-1, consent past the image ──────────────────────────────────
-- The module teaches the four properties of consent beautifully and applies
-- them to images only. The guidance's own wording is "in all contexts,
-- including online", so the four properties are simply carried across to
-- what they were always for.
select schools.append_by_heading(
  'ks4-16-consent-images-law', 'What consent actually is', 'body',
  ' Those four properties were never only about images. They are what consent is for anything: going further, meeting up, being touched, being filmed, being posted. Freely given means nobody was worn down first. Specific means yes to one thing is not yes to the next thing. Ongoing means it gets checked rather than assumed from last time. Reversible means anybody can change their mind partway through, and that is simply the end of it, with no debt and no explanation owed. Exactly the same in a room and on a phone, and the phone is the harder one, because a message makes it so much easier to keep asking.');

select schools.append_by_heading(
  'ks4-16-consent-images-law', 'What consent actually is', 'script',
  ' Land the four properties as a general rule before the lesson narrows to images, because taught the other way round they sound like a rule about photographs. The last sentence is the one to say slowly: a phone makes asking again cost nothing, which is exactly why worn down is the property that breaks first. Do not invite examples and do not ask anybody to apply it to themselves.');

-- ── RSHE-S-BS-16, the door that opens both ways ──────────────────────────
-- The scheme teaches getting help for what was done TO you, thoroughly. The
-- requirement also asks about seeking support for your own worrying or
-- abusive behaviour, which is the half almost nothing teaches, and where to
-- seek medical attention.
select schools.append_by_heading(
  'ks4-16-consent-images-law', 'And something can be done', 'body',
  ' The same door opens the other way round, and almost nobody says this out loud. If it is your own behaviour worrying you, if you pressured somebody, or sent something on, or did something you have not been able to stop thinking about since, telling an adult early is still the thing that changes what happens next, and it is treated very differently from being found out later. If somebody has hurt you, every route on this slide is yours. And if you have been physically hurt, that is a GP, or 111, or A and E, and going is not an admission of anything. None of these doors close because time has passed.');

select schools.append_by_heading(
  'ks4-16-consent-images-law', 'And something can be done', 'script',
  ' The own behaviour lines are the reason this slide now runs slightly longer, and they are worth the seconds. Say them in exactly the same voice as the rest, with no warning and no weight, because a pupil who is in that position will be listening very hard for a change of tone and will stop listening if they hear one. Do not look at anybody while you read it. Know your own school process first, because the question that follows is always what would actually happen.');

-- ── RSHE-S-BS-2, pressure in both directions ─────────────────────────────
-- The module teaches the criminal scripts, which is the extreme end. The
-- requirement is about ordinary pressure between people who know each other,
-- and it asks for the half nobody teaches: how to avoid putting pressure on
-- others.
select schools.append_by_heading(
  'ks4-17-sextortion', 'The scripts they use', 'body',
  ' Those scripts are the extreme version of something far more ordinary, and it happens between people who actually know each other. Pressure is asking again after a no. It is going quiet until somebody gives in. It is if you actually liked me. It is everyone else already has. None of those is a request, they are a wearing down, and the answer to all four is the same: a no does not need a reason and it does not expire. Then the half nobody teaches. Read your own messages for those four moves. Asking twice is human. Asking until somebody stops saying no is pressure, whoever is doing it.');

select schools.append_by_heading(
  'ks4-17-sextortion', 'The scripts they use', 'script',
  ' The four ordinary moves land better than the criminal scripts do, because most of this room has seen all four. Read them plainly and do not moralise. Then the turn at the end is the important part and it needs no build up: check your own sent messages. Say it once, move on, and do not ask for a show of hands. A pupil who recognises themselves needs the sentence, not the spotlight.');

-- ── RSHE-S-BS-11, the family name for the harms ──────────────────────────
-- The scheme teaches sextortion, criminal exploitation and financial harm as
-- separate lessons and never names them as one family with one opening move.
-- The requirement asks for the concepts, so the concept is what goes in.
select schools.append_by_heading(
  'ks4-17-sextortion', 'What sextortion is', 'body',
  ' It has a family name, and knowing the family is more use than knowing one member of it. Exploitation is somebody getting something out of you using a power they have and you do not: age, money, information, or a secret. Sexual exploitation uses sex. Criminal exploitation uses you to carry or to sell. Financial exploitation uses your money or your bank account. Abuse is the word for the harm underneath all of them. And grooming is the part that comes first in every single one, the warm, generous, patient stretch, because all of these need trust before they need anything else. They are separate crimes in law and they share one opening move, which is why learning the opening move beats memorising the list.');

select schools.append_by_heading(
  'ks4-17-sextortion', 'What sextortion is', 'script',
  ' Land the family idea before the lesson narrows back to sextortion, because it is the part that transfers to something they have not met yet. The sentence worth repeating is the last one: five different crimes, one opening move, so learn the move. If somebody asks whether grooming always means something sexual, the accurate answer is no, and criminal exploitation is exactly the case that proves it.');

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not found: %', n, list; end if;
end $$;

drop function if exists schools.append_by_heading(text, text, text, text);

commit;
