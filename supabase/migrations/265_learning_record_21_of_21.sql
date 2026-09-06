-- 265: My learning record for every module. i_can from 1 of 21 to 21 of 21.
--
-- The master audit (research/2026-09-05-master-audit.md, Report 14 item 8)
-- found the learning record live for one module only, eyfs-01, from
-- migration 200. The FAQ and the Ofsted answer both point at "the printed
-- learning record each child colours in their book" as the scheme's
-- evidence trail, so twenty modules were quietly not keeping the promise.
-- The print route 404s without the array and the teach page hides the
-- button, which was the honest behaviour; this migration makes the honest
-- behaviour and the promised behaviour the same thing.
--
-- The shape is migration 200's, unchanged: three statements, always three,
-- child language, always starting "I can", and written as a LADDER, not as
-- three ways of saying the same thing. Notice, then act, then explain to
-- somebody else. The top rung is explaining because a child who can say WHY
-- has understood the thing rather than learned the words, and because it is
-- the rung a teacher can actually hear happening in the room. Every ladder
-- below is written from its own module's tool and worksheet (the exact
-- house line names appear inside the statements: the cool down lap, the
-- share test, the three moves, the three checks, the three lifelines, the
-- pipeline check, the arrival plan), so the sheet the child colours matches
-- the lesson they were just taught, not a generic outcome.
--
-- Register scales with age: EYFS and KS1 tell a grown up and a friend, KS3
-- tells a mate, KS4 and KS5 explain and defend. Deliberately not scored,
-- not levelled, not nationally recognised, and the sheet says so in print.
--
-- Snapshot first, RLS on the backup, idempotent: jsonb_set overwrites the
-- same key on a rerun. eyfs-01 keeps its migration 200 ladder untouched.

create table if not exists schools._backup_lesson_265 as
  select id, module_id, teacher_notes
  from schools.school_lessons
  where module_id != 'eyfs-01-screens-kindness';

alter table schools._backup_lesson_265 enable row level security;

update schools.school_lessons l
set teacher_notes = jsonb_set(l.teacher_notes, '{i_can}', v.i_can, true)
from (values
  ('ks1-02-kind-screens-calm-bodies', jsonb_build_array(
    'I can notice how my body feels after screen time.',
    'I can name the feeling and tell my grown up.',
    'I can tell a friend Pebble''s three steps: feel it, name it, tell a grown up.')),
  ('ks1-03-real-pretend-computer', jsonb_build_array(
    'I can spot that a picture might be pretend or made by a computer.',
    'I can stop and ask real, pretend, or computer made before I believe it.',
    'I can tell a friend why a WOW picture needs the detective question.')),
  ('ks2-04-screen-routines', jsonb_build_array(
    'I can spot the difference between a routine that works and a trap.',
    'I can run my own cool down lap: warn, finish, swap.',
    'I can explain to someone at home why the warn step makes stopping easier.')),
  ('ks2-05-gaming-time-spend', jsonb_build_array(
    'I can spot when a game is rushing me, hiding a price or selling a mystery.',
    'I can stop before I spend and run the three spend spotter questions.',
    'I can explain to a friend how games are built to make spending feel small.')),
  ('ks2-06-how-algorithms-work', jsonb_build_array(
    'I can describe the feed loop: you watch, it learns, it serves more.',
    'I can catch the loop working on me when a video starts on its own.',
    'I can explain to someone at home why my feed shows me what it shows me.')),
  ('ks2-07-privacy-reputation', jsonb_build_array(
    'I can spot when something is risky to share.',
    'I can run the share test before I share anything.',
    'I can explain to a friend how one share can follow future me around.')),
  ('ks2-08-kind-safe-online', jsonb_build_array(
    'I can recognise unkindness online when I see it.',
    'I can make the three moves: do not pile on, save the evidence, tell someone who can help.',
    'I can tell a friend why telling someone who can help is the strongest move.')),
  ('ks2-09-copyright-ownership', jsonb_build_array(
    'I can tell the difference between my work and someone else''s work.',
    'I can credit the maker or ask first before I use their work.',
    'I can explain to a friend why makers deserve their name on their work.')),
  ('ks3-10-mood-and-screens', jsonb_build_array(
    'I can notice what an app leaves behind: better, worse or nothing.',
    'I can run the mood audit on my own habits for a week and read the pattern.',
    'I can explain my pattern to someone I trust and name one change worth making.')),
  ('ks3-11-social-workarounds', jsonb_build_array(
    'I can name the protection hiding behind a rule.',
    'I can name what a workaround skips before I decide anything.',
    'I can explain to a mate why a workaround is a trade, never a free win.')),
  ('ks3-12-misinfo-deepfakes', jsonb_build_array(
    'I can spot the signs that something might be fake or engineered.',
    'I can run the three checks and give my verdict: believe, pause or do not share.',
    'I can explain to a mate why pause is a strong verdict, not a weak one.')),
  ('ks3-13-scams-fraud-money', jsonb_build_array(
    'I can spot a scam''s three tells: it rushes, it asks for something odd, it is too good to be true.',
    'I can stop, check and refuse when a message rushes me.',
    'I can explain to someone at home why scam scripts work on clever people too.')),
  ('ks3-14-bodies-image-pressure', jsonb_build_array(
    'I can spot when an image has been edited to sell a feeling.',
    'I can run the image check when a post makes me feel worse about how I look.',
    'I can explain to a mate who profits when we feel worse about ourselves.')),
  ('ks4-15-manipulation-persuasion', jsonb_build_array(
    'I can notice the pull before I act on it.',
    'I can name the technique being used on me: urgency, outrage, flattery or FOMO.',
    'I can explain where the money goes when the technique works.')),
  ('ks4-16-consent-images-law', jsonb_build_array(
    'I can say what real consent means and what the law actually says.',
    'I can ask the three questions before anything is shared.',
    'I can tell a friend their options, including Report Remove, without judgement.')),
  ('ks4-17-sextortion', jsonb_build_array(
    'I can recognise how sextortion starts and the scripts it uses.',
    'I can use the three lifelines: do not pay, do not keep it secret, report it.',
    'I can tell a friend it is not their fault and help them find the way out.')),
  ('ks4-18-radicalisation-misogyny', jsonb_build_array(
    'I can recognise when content is grooming my beliefs.',
    'I can run the pipeline check when content makes me angry.',
    'I can explain who profits from my anger and what they get if I stay angry.')),
  ('ks4-19-readiness-at-16', jsonb_build_array(
    'I can name what will be waiting for me when full access arrives.',
    'I can write my arrival plan: my defaults, my first week audit, my exit rule.',
    'I can explain why a plan made before day one beats willpower on day one.')),
  ('ks5-20-ai-mastery-data-rights', jsonb_build_array(
    'I can use an AI tool like a professional, with a clear brief.',
    'I can check AI output like an editor and defend where I checked its work.',
    'I can explain the data trade behind a free tool and my rights inside it.')),
  ('ks5-21-digital-identity-future-work', jsonb_build_array(
    'I can name the human skills that hold their value when everyone has the same AI.',
    'I can run the endurance test on my own plans and choose a skill to build.',
    'I can explain the record I want found under my own name and how I am building it.'))
) as v(module_id, i_can)
where l.module_id = v.module_id;
