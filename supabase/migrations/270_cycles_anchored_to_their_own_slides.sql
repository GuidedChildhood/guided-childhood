-- 270_cycles_anchored_to_their_own_slides.sql
-- Phase 3 of the Oak plan: the exemplar QA, and the finding it produced.
--
-- Plan:  plans/2026-09-07-oak-as-the-basis-plan.md, Phase 3.
-- QA:    research/2026-09-07-oak-qa-pass-16-to-18.md
--
-- THE FINDING. Migration 268 gave every module named learning cycles and the
-- player derived which cycle a slide sat in by spending each cycle's stated
-- minute budget against the minutes the slides already carried. Phase 2
-- verified that against a nine slide fixture where every teach slide was its
-- own cycle, which is the easy case and hid the problem.
--
-- Run against the 21 production decks, that derivation opened a cycle on the
-- slide it is named after only 28 times out of 61. On ks3-12 the exemplar, a
-- pupil on the slide headed "The three checks" was shown "Notice: Content can
-- be manufactured" in the chrome. The minute budgets are approximations and
-- the boundaries landed a slide early or late all over the scheme.
--
-- THE FIX, in two halves. The player now anchors a cycle to the slide whose
-- heading it names (the code change alongside this migration). For that to
-- work the data has to be true, which is what this migration does:
--
--   1. Seven cycle titles were written from the timing string's prose rather
--      than from a slide, so they named nothing in their own deck. Retitled
--      to the deck's own heading:
--        ks2-06 c1  Algorithms are recipes        -> An algorithm is a recipe
--        ks3-11 c3  Group chats and judgement     -> A group chat with strangers in it
--        ks4-15 c2  Engineered outrage            -> Rage is a business model
--        ks4-15 c3  Influencers, and follow...    -> Parasocial trust, and why it sells
--        ks4-16 c4  Options                       -> If an image is already out there
--        ks5-21 c1  Identity as portfolio         -> The identity audit
--        ks5-21 c2  The jobs landscape            -> What AI actually does to work
--
--   2. Every cycle's `minutes` is recomputed from the slides it actually
--      contains, so the number on the map is the real runtime rather than a
--      budget it was never measured against. Each module's cycle minutes now
--      sum exactly to its teach phase.
--
--   3. Two structural corrections the audit surfaced. ks2-04 had five taught
--      concepts under three cycles and a third cycle swallowing eight slides
--      and nineteen minutes; it gains a fourth, "Set: The table and the desk",
--      which the deck already taught without naming. ks4-17 had a second cycle
--      of one slide and two minutes; it is re anchored on "The scripts they
--      use", a real beat in the deck, giving 10, 8 and 10 minutes.
--
-- After this: 62 of 62 cycles open on the slide they are named after, checked
-- against the live decks. No slide content, script, quiz or note is touched.
--
-- Non destructive apart from the cycles array itself, which is replaced whole.
-- Idempotent. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_270 as
  select id, module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_270 enable row level security;

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Look", "title": "Real and made up", "outcome": "I can point to something real and something made up.", "minutes": 3}, {"verb": "Ask", "title": "Stop, look, ask a grown up", "outcome": "I can stop and ask a grown up if something on a screen is real.", "minutes": 7}]'::jsonb)
 where module_id = 'eyfs-01-screens-kindness';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Notice", "title": "Screens give our bodies feelings", "outcome": "I can notice how my body feels after screen time.", "minutes": 3}, {"verb": "Name", "title": "Pebble''s three steps", "outcome": "I can name the feeling and tell my grown up.", "minutes": 10}]'::jsonb)
 where module_id = 'ks1-02-kind-screens-calm-bodies';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Look", "title": "Three kinds of pictures", "outcome": "I can spot that a picture might be pretend or made by a computer.", "minutes": 7}, {"verb": "Ask", "title": "The detective question", "outcome": "I can stop and ask real, pretend, or computer made before I believe it.", "minutes": 7}]'::jsonb)
 where module_id = 'ks1-03-real-pretend-computer';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Notice", "title": "Routines beat willpower", "outcome": "I can spot the difference between a routine that works and a trap.", "minutes": 2}, {"verb": "Practise", "title": "The cool down lap", "outcome": "I can run my own cool down lap: warn, finish, swap.", "minutes": 7}, {"verb": "Place", "title": "Where screens sleep matters", "outcome": "I can explain why where a screen sleeps changes how well I sleep.", "minutes": 10}, {"verb": "Set", "title": "The table and the desk", "outcome": "I can name one place at home where screens are put away, and say why.", "minutes": 9}]'::jsonb)
 where module_id = 'ks2-04-screen-routines';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Hold", "title": "Brilliant AND designed. Both true.", "outcome": "I can hold both ideas at once: a game can be brilliant and built to keep me playing.", "minutes": 9}, {"verb": "Follow", "title": "Free games that cost, and how the price hides", "outcome": "I can spot when a game is rushing me, hiding a price or selling a mystery.", "minutes": 14}, {"verb": "Check", "title": "The spend spotters", "outcome": "I can stop before I spend and run the three spend spotter questions.", "minutes": 5}]'::jsonb)
 where module_id = 'ks2-05-gaming-time-spend';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Learn", "title": "An algorithm is a recipe", "outcome": "I can say what an algorithm is in my own words.", "minutes": 11}, {"verb": "Trace", "title": "The feed loop", "outcome": "I can describe the feed loop: you watch, it learns, it serves more.", "minutes": 9}, {"verb": "Catch", "title": "The bottomless bowl", "outcome": "I can catch the loop working on me when a video starts on its own.", "minutes": 8}]'::jsonb)
 where module_id = 'ks2-06-how-algorithms-work';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Decide", "title": "You are the editor of your own story", "outcome": "I can spot when something is risky to share.", "minutes": 11}, {"verb": "Follow", "title": "The journey of one shared photo", "outcome": "I can explain how one share can follow future me around.", "minutes": 7}, {"verb": "Check", "title": "The share test", "outcome": "I can run the share test before I share anything.", "minutes": 10}]'::jsonb)
 where module_id = 'ks2-07-privacy-reputation';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Name", "title": "Unkind or bullying? There is a difference", "outcome": "I can recognise unkindness online when I see it.", "minutes": 10}, {"verb": "Understand", "title": "Why pile ons grow", "outcome": "I can explain why a pile on grows and what a bystander adds to it.", "minutes": 6}, {"verb": "Move", "title": "The three moves", "outcome": "I can make the three moves: do not pile on, save the evidence, tell someone who can help.", "minutes": 12}]'::jsonb)
 where module_id = 'ks2-08-kind-safe-online';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Own", "title": "You are a maker, and makers own their work", "outcome": "I can tell the difference between my work and someone else''s work.", "minutes": 11}, {"verb": "Use", "title": "Make it, credit it, ask first", "outcome": "I can credit the maker or ask first before I use their work.", "minutes": 8}, {"verb": "Question", "title": "The AI wrinkle", "outcome": "I can explain where an AI picture really comes from.", "minutes": 9}]'::jsonb)
 where module_id = 'ks2-09-copyright-ownership';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Weigh", "title": "What the research actually says", "outcome": "I can describe what the evidence says without overstating it.", "minutes": 7}, {"verb": "Sort", "title": "Connecting or comparing", "outcome": "I can notice what an app leaves behind: better, worse or nothing.", "minutes": 6}, {"verb": "Audit", "title": "The mood audit", "outcome": "I can run the mood audit on my own habits for a week and read the pattern.", "minutes": 15}]'::jsonb)
 where module_id = 'ks3-10-mood-and-screens';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "See", "title": "How the machine works", "outcome": "I can name the protection hiding behind a rule.", "minutes": 10}, {"verb": "Trade", "title": "Workaround culture", "outcome": "I can name what a workaround skips before I decide anything.", "minutes": 11}, {"verb": "Judge", "title": "A group chat with strangers in it", "outcome": "I can explain why a group chat with strangers in it changes the risk.", "minutes": 7}]'::jsonb)
 where module_id = 'ks3-11-social-workarounds';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Notice", "title": "Content can be manufactured", "outcome": "I can spot the signs that something might be fake or engineered.", "minutes": 9}, {"verb": "Check", "title": "The three checks", "outcome": "I can run the three checks and give my verdict: believe, pause or do not share.", "minutes": 14}, {"verb": "Trace", "title": "How a fake travels", "outcome": "I can explain why a fake spreads faster than the correction.", "minutes": 6}]'::jsonb)
 where module_id = 'ks3-12-misinfo-deepfakes';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Spot", "title": "Phishing: the fake that fishes", "outcome": "I can spot a scam''s three tells: it rushes, it asks for something odd, it is too good to be true.", "minutes": 12}, {"verb": "Value", "title": "Why your gaming account is worth stealing", "outcome": "I can explain why my accounts are worth money to someone else.", "minutes": 10}, {"verb": "Refuse", "title": "Anatomy of an account theft", "outcome": "I can stop, check and refuse when a message rushes me.", "minutes": 6}]'::jsonb)
 where module_id = 'ks3-13-scams-fraud-money';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "See", "title": "Every polished image is a set of choices", "outcome": "I can spot when an image has been edited to sell a feeling.", "minutes": 6}, {"verb": "Follow", "title": "The economics of insecurity", "outcome": "I can explain who profits when we feel worse about ourselves.", "minutes": 16}, {"verb": "Check", "title": "The image check", "outcome": "I can run the image check when a post makes me feel worse about how I look.", "minutes": 6}]'::jsonb)
 where module_id = 'ks3-14-bodies-image-pressure';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Spot", "title": "Dark patterns", "outcome": "I can notice the pull before I act on it.", "minutes": 11}, {"verb": "Name", "title": "Rage is a business model", "outcome": "I can name the technique being used on me: urgency, outrage, flattery or FOMO.", "minutes": 7}, {"verb": "Follow", "title": "Parasocial trust, and why it sells", "outcome": "I can explain where the money goes when the technique works.", "minutes": 10}]'::jsonb)
 where module_id = 'ks4-15-manipulation-persuasion';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Define", "title": "Consent", "outcome": "I can say what real consent means and name its four properties.", "minutes": 6}, {"verb": "Know", "title": "The law", "outcome": "I can say what the law actually covers.", "minutes": 9}, {"verb": "Resist", "title": "Pressure", "outcome": "I can explain why pressure is not consent.", "minutes": 7}, {"verb": "Act", "title": "If an image is already out there", "outcome": "I can tell a friend their options, including Report Remove, without judgement.", "minutes": 6}]'::jsonb)
 where module_id = 'ks4-16-consent-images-law';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Recognise", "title": "What sextortion is, and how it starts", "outcome": "I can recognise how sextortion starts and the scripts it uses.", "minutes": 10}, {"verb": "Understand", "title": "The scripts they use", "outcome": "I can name the scripts they use and explain why paying never ends it.", "minutes": 8}, {"verb": "Act", "title": "The three lifelines", "outcome": "I can use the three lifelines: do not pay, do not keep it secret, report it.", "minutes": 10}]'::jsonb)
 where module_id = 'ks4-17-sextortion';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Trace", "title": "Nobody starts at the extreme", "outcome": "I can describe how a pipeline moves someone gradually.", "minutes": 13}, {"verb": "Recognise", "title": "Belief grooming runs the grooming playbook", "outcome": "I can recognise when content is grooming my beliefs.", "minutes": 9}, {"verb": "Check", "title": "The pipeline check", "outcome": "I can run the pipeline check when content makes me angry.", "minutes": 7}]'::jsonb)
 where module_id = 'ks4-18-radicalisation-misogyny';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Locate", "title": "The world you are standing in", "outcome": "I can name what will be waiting for me when full access arrives.", "minutes": 14}, {"verb": "Understand", "title": "The cliff edge", "outcome": "I can explain why a change that arrives all at once is harder than one that arrives gradually.", "minutes": 6}, {"verb": "Plan", "title": "The arrival plan", "outcome": "I can write my arrival plan: my defaults, my first week audit, my exit rule.", "minutes": 11}]'::jsonb)
 where module_id = 'ks4-19-readiness-at-16';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Brief", "title": "Using is not mastering", "outcome": "I can use an AI tool like a professional, with a clear brief.", "minutes": 9}, {"verb": "Check", "title": "Use it, check it, own it", "outcome": "I can check AI output like an editor and defend where I checked its work.", "minutes": 11}, {"verb": "Trade", "title": "Free tools, and what they cost", "outcome": "I can explain the data trade behind a free tool and my rights inside it.", "minutes": 4}]'::jsonb)
 where module_id = 'ks5-20-ai-mastery-data-rights';

update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles}', '[{"verb": "Audit", "title": "The identity audit", "outcome": "I can explain the record I want found under my own name and how I am building it.", "minutes": 9}, {"verb": "Map", "title": "What AI actually does to work", "outcome": "I can describe what AI compresses and what it expands.", "minutes": 10}, {"verb": "Test", "title": "Skills that endure", "outcome": "I can run the endurance test on my own plans and choose a skill to build.", "minutes": 7}]'::jsonb)
 where module_id = 'ks5-21-digital-identity-future-work';

-- Guards. Every cycle keeps its four keys, and a module's cycle minutes must
-- equal the minutes its teach phase actually runs, which is the property the
-- old budgets never had.
do $$
declare bad int;
begin
  select count(*) into bad from schools.school_lessons l
   where exists (select 1 from jsonb_array_elements(l.teacher_notes->'cycles') c
                  where not (c ?& array['verb','title','outcome','minutes']));
  if bad > 0 then
    raise exception 'Migration 270: % module(s) with an incomplete cycle', bad;
  end if;

  select count(*) into bad from schools.school_lessons l
   where (select sum((c->>'minutes')::int) from jsonb_array_elements(l.teacher_notes->'cycles') c)
      <> (select coalesce(sum((s->>'minutes')::int), 0) from jsonb_array_elements(l.slides) s
           where s->>'phase' = 'teach');
  if bad > 0 then
    raise exception 'Migration 270: % module(s) whose cycle minutes do not match the teach phase', bad;
  end if;
end $$;

commit;
