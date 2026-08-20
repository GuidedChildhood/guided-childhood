-- 220_school_lessons_scaffold.sql
-- Mirrors 219 on the SCHOOLS side. Tags the 13 plus Social Media Literacy
-- school lessons (public.school_lessons, seeded by 109 to 112) with the
-- Notice, Choose, Tell scaffold, so the schools app and the parent app share
-- one spine across the whole pathway.
-- Plan: plans/2026-08-20-foundation-scaffold-and-cs-borrows.md
--
-- Non destructive. Adds one nullable column and populates it by module_id.
-- No existing lesson content (title, slides, outcomes, strands) is touched.
-- The schools app selects school_lessons columns explicitly (id, module_id,
-- title), so a new column does not affect it. Content stays in the database.
--
-- The mapping across the 15 KS3 modules (7 / 5 / 3):
--   NOTICE, see what the machine is doing:
--     01 how the machine works, 02 the deal you signed, 04 the highlight reel,
--     05 bodies and filters, 06 influencers and the sell,
--     10 rabbit holes and radicalisation, 15 ai companions and chatbots.
--   CHOOSE, bring the stop, run your own settings, balance, take the wheel:
--     03 locking your doors, 11 the inner life, 12 sleep attention and the body,
--     13 the good side held honestly, 14 taking the wheel.
--   TELL, tell a trusted adult, report, the first call plan:
--     07 how people treat each other, 08 strangers dms and grooming,
--     09 nudes the law and sextortion.

begin;

alter table public.school_lessons
  add column if not exists scaffold text
  check (scaffold in ('NOTICE', 'CHOOSE', 'TELL'));

update public.school_lessons set scaffold = 'NOTICE'
  where module_id in (
    'sm13-01-how-the-machine-works',
    'sm13-02-the-deal-you-signed',
    'sm13-04-the-highlight-reel',
    'sm13-05-bodies-and-filters',
    'sm13-06-influencers-and-the-sell',
    'sm13-10-rabbit-holes-and-radicalisation',
    'sm13-15-ai-companions-and-chatbots');

update public.school_lessons set scaffold = 'CHOOSE'
  where module_id in (
    'sm13-03-locking-your-doors',
    'sm13-11-the-inner-life',
    'sm13-12-sleep-attention-and-the-body',
    'sm13-13-the-good-side-held-honestly',
    'sm13-14-taking-the-wheel');

update public.school_lessons set scaffold = 'TELL'
  where module_id in (
    'sm13-07-how-people-treat-each-other',
    'sm13-08-strangers-dms-and-grooming',
    'sm13-09-nudes-the-law-and-sextortion');

commit;
