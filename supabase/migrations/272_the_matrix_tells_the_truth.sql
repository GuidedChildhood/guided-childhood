-- 272_the_matrix_tells_the_truth.sql
-- The coverage audit of 8 September, applied.
--
-- Plan: plans/2026-09-08-the-perfect-lesson-standard.md, sections 1 and 2.
--
-- THE AUDIT. All 45 RSHE topic claims in the mapping matrix were checked
-- against what each module's own deck and teacher notes actually contain.
-- 42 held up. Three did not, and they broke the honesty note the matrix
-- itself prints, that a module is marked only where it substantively
-- teaches the topic:
--
--   ks2-04 screen routines claimed Online safety and harms. Its deck is
--     routines, the cool down lap, where screens sleep and the bedtime
--     spiral, and its own statutory hook says RSHE health and wellbeing.
--   ks1-03 real, pretend, computer claimed the same. Its deck is the three
--     kinds of picture and the detective question, and its own hook says
--     EfCW managing online information.
--   ks3-13 scams, fraud and money claimed Illegal online behaviours and
--     never mentioned that fraud is a crime, that there is a law, or that
--     there is anywhere to report it.
--
-- The first two are tag removals and they live in the curriculum manifest,
-- not here: shared/schools-curriculum.ts, alongside this migration.
--
-- THIS MIGRATION DOES THE THIRD ONE, which is the only one that is a hole
-- rather than padding. A school buys ks3-13 partly for its legal grounding
-- and the lesson taught a pupil to avoid being a victim without ever saying
-- the thing was illegal. One beat fixes it, and the beat also does
-- safeguarding work: it says out loud that the person targeted is never the
-- one in trouble.
--
-- The new slide goes at position 18, at the end of the teach phase, straight
-- after the discussion about a scam arriving from a friend's account. That
-- discussion asks what you DO, so reporting is the natural next breath.
--
-- TIMING IS KEPT TRUE. Migration 270 left a guard that a module's cycle
-- minutes must equal the minutes its teach phase actually runs, so the two
-- new minutes are added to cycle three, which is the cycle the new slide
-- sits in. The timing prose is rewritten at the same time: it had drifted
-- from the cycles array when 270 recomputed them, and said cycle one 10,
-- cycle two 8, cycle three 10 against an array of 12, 10 and 6.
--
-- ks3-13 also gains a sixth key learning point. The contract in migration
-- 268 asked for four or five; this module now genuinely teaches one more
-- thing, so six is the honest number rather than dropping a point to fit.
--
-- AI LITERACY. The audit also found ailit_domains populated on only 12 of
-- 21 modules, so the scheme half claimed the AI future. The nine empty ones
-- are filled here against the four UNESCO style domains already in use:
-- Engage with AI, Create with AI, Manage AI, Design AI. A domain is named
-- only where the module actually does that work.
--
-- Non destructive. Idempotent: the slide insert is guarded on its own
-- heading, so a re run cannot add it twice. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_272 as
  select id, module_id, slides, teacher_notes, ailit_domains, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_272 enable row level security;

-- 1. ks3-13 learns that fraud is a crime.

update schools.school_lessons
   set slides = jsonb_insert(slides, '{17}', '{
        "type": "concept",
        "phase": "teach",
        "minutes": 2,
        "emoji": "⚖️",
        "heading": "Fraud is a crime, and it gets reported",
        "body": "Everything in this lesson is against the law. Pretending to be someone else to take money or an account is fraud, and fraud is a criminal offence rather than bad luck. That matters twice over. You are never the one in trouble for being targeted, and there is somewhere for it to go: tell an adult you trust, tell the app, tell the bank if money moved, and the national route is Action Fraud, or Police Scotland if you are in Scotland. Reporting is what turns one person''s bad afternoon into evidence.",
        "script": "This is the beat that says the quiet part out loud. Everything we have looked at is illegal. Ask the class whose fault it is when someone is scammed, and land hard on the answer: the criminal, never the person targeted. Then give them the route, and say plainly that reporting is not telling tales, it is evidence."
      }'::jsonb)
 where module_id = 'ks3-13-scams-fraud-money'
   and not exists (
     select 1 from jsonb_array_elements(slides) s
      where s->>'heading' = 'Fraud is a crime, and it gets reported');

-- Cycle three absorbs the two new teach minutes, and the timing prose is
-- rewritten to match the cycles array rather than the numbers it drifted to.
update schools.school_lessons
   set teacher_notes = teacher_notes
     || jsonb_build_object(
          'cycles', '[{"verb": "Spot", "title": "Phishing: the fake that fishes", "outcome": "I can spot a scam''s three tells: it rushes, it asks for something odd, it is too good to be true.", "minutes": 12}, {"verb": "Value", "title": "Why your gaming account is worth stealing", "outcome": "I can explain why my accounts are worth money to someone else.", "minutes": 10}, {"verb": "Refuse", "title": "Anatomy of an account theft", "outcome": "I can stop, check and refuse when a message rushes me, and I know that fraud is a crime I can report.", "minutes": 8}]'::jsonb,
          'timing', '66 minutes: starter 8, cycle one 12, cycle two 10, cycle three 8, practise 15, prove 4, close 5, class interactive 4',
          'key_learning_points', '["The three tells are: it rushes you, it asks for something odd, it is too good to be true.", "Phishing dresses a fake up as something you already trust.", "A gaming account is worth money, which is why it is a target.", "Scam scripts work on clever people, because they attack the moment, not the intelligence.", "Stop, check, refuse. Checking through a different route is what breaks the script.", "Fraud is a crime. The person targeted is never the one in trouble, and reporting it is what makes it evidence."]'::jsonb)
 where module_id = 'ks3-13-scams-fraud-money';

update schools.school_lessons
   set statutory_hooks = array['Citizenship digital financial literacy (fraud and scam prevention)', 'Fraud Act 2006, taught as the reporting route rather than as law']
 where module_id = 'ks3-13-scams-fraud-money';

-- 2. AI literacy named on the nine modules that had none.
--    Only where the module does the work, never to fill a column.

update schools.school_lessons set ailit_domains = array['Engage with AI']
 where module_id = 'ks1-02-kind-screens-calm-bodies';          -- what a screen is, first contact

update schools.school_lessons set ailit_domains = array['Manage AI']
 where module_id = 'ks2-04-screen-routines';                    -- deciding when the machine stops

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Manage AI']
 where module_id = 'ks2-05-gaming-time-spend';                  -- designed systems, and managing them

update schools.school_lessons set ailit_domains = array['Engage with AI']
 where module_id = 'ks2-08-kind-safe-online';                   -- moderation and what a feed shows

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Manage AI']
 where module_id = 'ks3-10-mood-and-screens';                   -- recommender effects on mood

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Manage AI']
 where module_id = 'ks3-13-scams-fraud-money';                  -- AI written scams, and refusing them

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Design AI']
 where module_id = 'ks4-15-manipulation-persuasion';            -- persuasion built into systems

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Manage AI']
 where module_id = 'ks4-16-consent-images-law';                 -- generated images and consent

update schools.school_lessons set ailit_domains = array['Engage with AI', 'Manage AI']
 where module_id = 'ks4-17-sextortion';                         -- AI generated threats, and refusing them

-- Guards.
do $$
declare bad int; teach int; cyc int;
begin
  -- The new beat exists exactly once.
  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-13-scams-fraud-money'
     and s->>'heading' = 'Fraud is a crime, and it gets reported';
  if bad <> 1 then
    raise exception 'Migration 272: expected exactly 1 fraud beat, found %', bad;
  end if;

  -- Migration 270's rule still holds: cycle minutes equal the teach phase.
  select coalesce(sum((s->>'minutes')::int), 0) into teach
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks3-13-scams-fraud-money' and s->>'phase' = 'teach';
  select coalesce(sum((c->>'minutes')::int), 0) into cyc
    from schools.school_lessons l, jsonb_array_elements(l.teacher_notes->'cycles') c
   where l.module_id = 'ks3-13-scams-fraud-money';
  if teach <> cyc then
    raise exception 'Migration 272: ks3-13 teach is % minutes but its cycles claim %', teach, cyc;
  end if;

  -- And it holds for every other module too, untouched.
  select count(*) into bad from schools.school_lessons l
   where (select sum((c->>'minutes')::int) from jsonb_array_elements(l.teacher_notes->'cycles') c)
      <> (select coalesce(sum((s->>'minutes')::int), 0) from jsonb_array_elements(l.slides) s
           where s->>'phase' = 'teach');
  if bad > 0 then
    raise exception 'Migration 272: % module(s) whose cycle minutes no longer match the teach phase', bad;
  end if;

  -- Every module now names at least one AI literacy domain, from the four
  -- in use. The scheme either believes in the AI future everywhere or it
  -- should stop saying so.
  select count(*) into bad from schools.school_lessons
   where ailit_domains is null or cardinality(ailit_domains) = 0;
  if bad > 0 then
    raise exception 'Migration 272: % module(s) still name no AI literacy domain', bad;
  end if;

  select count(*) into bad from schools.school_lessons l
   where exists (select 1 from unnest(l.ailit_domains) d
                  where d not in ('Engage with AI', 'Create with AI', 'Manage AI', 'Design AI'));
  if bad > 0 then
    raise exception 'Migration 272: % module(s) name an AI literacy domain outside the four', bad;
  end if;
end $$;

commit;
