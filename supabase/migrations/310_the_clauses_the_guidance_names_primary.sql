-- THE SAME CLAUSES, AT PRIMARY.
--
-- Companion to 309. Same rule: no slide is added, no minute changes, every
-- clause is a sentence inside an idea the lesson already teaches.
--
-- One difference from 309, and it is worth keeping. 309 addressed slides by
-- index and guarded on the heading, which skips quietly if a deck has been
-- renumbered. This one FINDS the slide by its heading and raises if it cannot,
-- so a miss is loud. A migration that silently writes nothing is how a
-- coverage claim gets made about a sentence that was never added, which is the
-- exact class of mistake the audit was written to catch.
--
-- Requirements closed here:
--   RSHE-P-OSA-1   the same principles apply, including where people are anonymous
--   RSHE-P-OSA-2   that people pretend to be someone else, including a child
--   RSHE-P-OSA-4   privacy and location settings
--   RSHE-P-BS-4    responding safely to adults online, known and unknown
--   RSHE-P-WO-1    the positive and negative aspects of the internet
--   RSHE-P-WO-2    why online is unlikely to be a good substitute for in person
--   RSHE-P-WO-9    search engines, and how results are selected
--   RSHE-P-WO-10   rights over personal data, privacy and consent
--   RSHE-P-WO-11   how to report, in the app as well as to an adult

begin;

create table if not exists schools.school_lessons_backup_310 as
select * from schools.school_lessons;

-- Find the slide whose heading matches and append to one of its text fields.
-- A miss is RECORDED rather than raised on the spot, and the whole migration
-- aborts at the end with every miss listed, so one run tells you everything
-- that is wrong instead of one thing at a time. It caught one on the first
-- attempt: ks1-02's keywords heading, which this migration had guessed. That
-- slide is now addressed by type instead, and nothing was written.
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

-- Address the first slide of a type. For ks1-02, whose keywords heading this
-- migration guessed wrong on the first run.
create or replace function schools.append_by_type(
  p_module text, p_type text, p_field text, p_add text
) returns void language plpgsql as $$
declare pos int;
begin
  select ord - 1 into pos
  from schools.school_lessons l,
       lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
  where l.module_id = p_module and s.slide->>'type' = p_type limit 1;
  if pos is null then insert into miss values (p_module, 'type: ' || p_type); return; end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array[pos::text, p_field],
           to_jsonb(coalesce(l.slides->pos->>p_field, '') || p_add))
   where l.module_id = p_module;
end $$;

-- ── ks2-07, the settings and the stranger ────────────────────────────────
-- RSHE-P-OSA-4 has two sentences. The module taught the first in full, the
-- judgement about what to share, including that location leaks hide in the
-- corners of photos. It never taught the second: that privacy and location
-- settings exist and can be turned on. A child who has the judgement and not
-- the control has half of what the guidance asks for.
select schools.append_by_heading(
  'ks2-07-privacy-reputation', 'The share test', 'caption',
  ' And one more thing you can do before any of this: most apps have a settings page with a privacy switch and a location switch on it. Turning location off means a photo stops carrying a little map of where you were.');

select schools.append_by_heading(
  'ks2-07-privacy-reputation', 'The share test', 'script',
  ' Finish with the settings line, which is new and is the one thing on this slide a child can act on tonight. Say it simply: apps have a settings page, and two of the switches on it are privacy and location. Location off means the photo stops carrying a map. Do not walk through any one app, because they all differ and they all change. The point is that the switches exist and are theirs to find, with a grown up.');

-- RSHE-P-OSA-2 asks for a specific worked example: that people sometimes
-- behave differently online, including pretending to be someone else or
-- pretending to be a child, and that this can lead to dangerous situations.
-- RSHE-P-BS-4 asks how to respond to adults encountered online. The module
-- already puts pupils in a group chat with two people they have never met,
-- which is exactly the right place to say it.
select schools.append_by_heading(
  'ks2-07-privacy-reputation', 'The internet remembers', 'body',
  ' And here is the part that surprises people: online, anybody can say they are anybody. A grown up can make an account that says they are eleven, with a photo that is not theirs. That is not a reason to be frightened of everyone, it is a reason to have one rule. If someone you have not met asks you anything about yourself, asks for a photo, or asks you to keep the chat secret, you stop and you tell a grown up. Every single time.');

select schools.append_by_heading(
  'ks2-07-privacy-reputation', 'The internet remembers', 'script',
  ' The added lines matter and the register matters more. Say it the way you would say look both ways: a fact, then a rule, no fear. Anybody can claim to be anybody, so the rule is not about spotting the bad one, it is about what you do when someone you have not met asks for something. Land the three asks, information, a photo, or secrecy, and the one answer: stop and tell a grown up. If any child looks worried, follow it up afterwards rather than in front of the room.');

-- ── ks2-06, the search box ───────────────────────────────────────────────
-- RSHE-P-WO-9 names search engines specifically. The module teaches selection
-- and targeting in full, and a search for the words returns one hit in the
-- whole scheme, at KS5, about being searchable by an employer. A child who
-- knows a feed is chosen but thinks a search is neutral has the wrong half.
select schools.append_by_heading(
  'ks2-06-how-algorithms-work', 'An algorithm is a recipe', 'body',
  ' Search boxes follow a recipe too. When you search for something, nobody hands you all the answers in the world: a recipe picks which ones to show you first, and the ones at the very top are often there because a company paid to be there. First does not mean truest. It means chosen.');

select schools.append_by_heading(
  'ks2-06-how-algorithms-work', 'An algorithm is a recipe', 'script',
  ' Add the search box lines once the recipe idea has landed, because they are the same idea in the place children trust most. Most of this class believes a search result is just the answer. Two sentences fix that: something chose the order, and the top ones are sometimes adverts. Ask for a show of hands on who thought the first result was the best one. Do not spend more than a minute.');

-- ── ks2-08, the button as well as the grown up ───────────────────────────
-- RSHE-P-WO-11 asks where AND how to report. The trusted adult route is taught
-- thoroughly from Reception. The in platform route, the report and block
-- controls that sit in every app, was taught nowhere at primary.
-- RSHE-P-WO-2 asks pupils to discuss why online relationships are unlikely to
-- be a good substitute for high quality in person ones. Both land on the
-- recap, which is where this module already sends things home.
select schools.append_by_heading(
  'ks2-08-kind-safe-online', 'What to remember', 'body',
  ' Two more things to take home. Almost every app has a report button and a block button, usually behind three dots next to a message: report tells the app, block stops that person reaching you, and neither one replaces telling a grown up. And talking to your friends online is real talking, but it is thinner than being with them, because a screen carries your words and drops your face and your voice. That is why a message can land ten times harder than the same thing said out loud.');

-- ── ks2-09, the rights half of ownership ─────────────────────────────────
-- RSHE-P-WO-10 asks pupils to know they have rights in relation to sharing
-- personal data, privacy and consent. The module teaches ownership, permission
-- and credit for work, which is the same idea aimed at a drawing rather than
-- at the child.
select schools.append_by_heading(
  'ks2-09-copyright-ownership', 'What to remember', 'body',
  ' The same rule works the other way round, and this part is about you. Your name, your face, your birthday and where you live belong to you in exactly the way your drawing does. Nobody gets to use them without asking, and asking means a real yes from you, not a box that was already ticked. You are allowed to say no, and you are allowed to change your mind later.');

-- ── ks2-04, both halves of the internet ──────────────────────────────────
-- RSHE-P-WO-1 asks pupils to think about the positive AND negative aspects of
-- the internet. The scheme's whole register does this and no slide ever asks
-- it as a question, so a teacher could deliver the module without a child ever
-- naming a good thing out loud.
select schools.append_by_heading(
  'ks2-04-screen-routines', 'What to remember', 'body',
  ' One last thing, and it is the point of the whole lesson. The internet is not the enemy and it is not a treat: it is a place you will spend some of your life, with brilliant things in it and rubbish things in it, often on the same screen. Being good at it means knowing which is which, and choosing on purpose instead of being carried.');

-- ── ks1-02, the word the guidance uses ───────────────────────────────────
-- RSHE-P-OSA-1 requires that pupils know the same principles apply "including
-- where people are anonymous". The module teaches the principle beautifully,
-- that screen words are real words, and never names the case where you cannot
-- see who is speaking.
select schools.append_by_type(
  'ks1-02-kind-screens-calm-bodies', 'keywords', 'script',
  ' One extra idea to drop in while these words are on the screen, in your own words and in about fifteen seconds. Sometimes on a screen you cannot see who is talking to you. That does not change anything: we still use kind words, and if what somebody sends makes your tummy feel yucky, you still tell a grown up. Not knowing who it is makes telling a grown up more important, not less.');

-- Every miss, in one exception, with nothing written.
do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not found: %', n, list; end if;
end $$;

drop function if exists schools.append_by_heading(text, text, text, text);
drop function if exists schools.append_by_type(text, text, text, text);

commit;
