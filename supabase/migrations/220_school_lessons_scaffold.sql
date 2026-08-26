-- 220_school_lessons_scaffold.sql
-- Tags the whole school curriculum (schools.school_lessons, the 21 module
-- eyfs to ks5 set) with the Notice, Choose, Tell scaffold, so the schools app
-- and the parent app share one spine across the whole pathway.
-- Plan: plans/2026-08-20-foundation-scaffold-and-cs-borrows.md
--
-- REWRITTEN 26 August 2026, approved by Justin. As first merged this file
-- targeted public.school_lessons and the sm13-* 15 module KS3 set, but the
-- live database carries the 21 module whole school curriculum in the schools
-- schema and no sm13 rows, so the original would have tagged nothing. Never
-- applied anywhere in its original form, which is why an in place rewrite is
-- safe. The mapping below follows the same logic as the sm13 version and 221:
--   NOTICE, see what the machine is doing.
--   CHOOSE, bring the stop, run your own settings, balance, take the wheel.
--   TELL, tell a trusted adult, report, the first call plan.
--
-- Non destructive. Adds one nullable column and populates it by module_id.
-- No existing lesson content (title, slides, outcomes, strands) is touched.
--
-- The mapping across the 21 modules (9 / 8 / 4):
--   NOTICE:
--     eyfs-01 screens and kindness real and not real, ks1-03 real pretend or
--     made by a computer, ks2-06 how algorithms work, ks2-09 my work and
--     other peoples work, ks3-12 misinformation and deepfakes, ks3-13 scams
--     fraud and money (spotting the con is the machine seeing skill),
--     ks3-14 bodies image and pressure, ks4-15 manipulation and persuasion,
--     ks4-18 radicalisation and misogyny.
--   CHOOSE:
--     ks1-02 kind screens calm bodies (you bring the stop), ks2-04 screen
--     routines, ks2-05 gaming time intensity and spend, ks2-07 privacy and
--     reputation (run your own settings), ks3-10 mood and screens (the inner
--     life), ks4-19 readiness at 16 (taking the wheel), ks5-20 ai mastery
--     and data rights, ks5-21 digital identity and the future of work.
--   TELL:
--     ks2-08 being kind and safe with others online, ks3-11 group chats and
--     the workarounds (keeping an adult in the loop when the chat goes
--     wrong), ks4-16 consent images and the law, ks4-17 sextortion.

begin;

alter table schools.school_lessons
  add column if not exists scaffold text
  check (scaffold in ('NOTICE', 'CHOOSE', 'TELL'));

update schools.school_lessons set scaffold = 'NOTICE'
  where module_id in (
    'eyfs-01-screens-kindness',
    'ks1-03-real-pretend-computer',
    'ks2-06-how-algorithms-work',
    'ks2-09-copyright-ownership',
    'ks3-12-misinfo-deepfakes',
    'ks3-13-scams-fraud-money',
    'ks3-14-bodies-image-pressure',
    'ks4-15-manipulation-persuasion',
    'ks4-18-radicalisation-misogyny');

update schools.school_lessons set scaffold = 'CHOOSE'
  where module_id in (
    'ks1-02-kind-screens-calm-bodies',
    'ks2-04-screen-routines',
    'ks2-05-gaming-time-spend',
    'ks2-07-privacy-reputation',
    'ks3-10-mood-and-screens',
    'ks4-19-readiness-at-16',
    'ks5-20-ai-mastery-data-rights',
    'ks5-21-digital-identity-future-work');

update schools.school_lessons set scaffold = 'TELL'
  where module_id in (
    'ks2-08-kind-safe-online',
    'ks3-11-social-workarounds',
    'ks4-16-consent-images-law',
    'ks4-17-sextortion');

commit;
