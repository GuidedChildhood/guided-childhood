-- 364_the_lessons_match_the_wall.sql
--
-- The pilot review, 7 October 2026: every slide of all 36 lessons through the
-- real player. Migration 362 took the first two things it found (scripts that
-- asked for "a, b, c" and ks4-15's question). This takes the three that go
-- with the player changes in the same pull request, all of them words in the
-- rows that the wall now contradicts or never showed.
--
-- 1. THE SORT NOW SHOWS ITS ANSWERS, so one script stops saying it does not.
--    Every verdict sort card carries an answer and a why, and 25 of the 26
--    sort scripts say "tap the class verdict, read the reason". The sort never
--    showed either; now the card turns over after the vote and shows both
--    (shared/components/interactives). ks1-03, a primary pilot lesson, had
--    written around the gap ("The wall counts the votes, it does not mark
--    them, so the verdict and the reason are yours to say"), which the new
--    sort makes untrue. It now tells the teacher to read the reason the wall
--    shows. Its list of answers stays, for preparing.
--
-- 2. A CLICKER CANNOT TAP A BUTTON. Seven passport slide scripts say "Tap Fill
--    the page, or hand the clicker to someone". A presentation clicker sends
--    keys, which now move the deck (PageDown and PageUp), and it cannot press
--    a button on the wall. The line becomes "or let one of the class tap it".
--
--      ks3-10, ks3-11, ks3-12, ks3-13, ks3-14, ks3-22 and ks3-24
--
-- 3. A FULL STOP WHERE THE MIDDOT GOES. Eight eyebrows and sort labels read
--    "KS3 . Years 8 and 9" and "Ramp or swap . tap the class verdict", and the
--    sort labels are on the wall in uppercase. Each " . " becomes " · ", as in
--    every other eyebrow in the scheme.
--
--      ks2-25-stay-the-maker, ks3-24-is-it-doing-my-thinking,
--      could-you-be-an-entrepreneur, what-problem-would-you-solve
--
-- The mirrors in content/modules and content/standalone carry the same words.
--
-- Idempotent: every change matches the old words exactly and a second run
-- finds none. Backed up first. Proved: each fix landed the number of times
-- intended, and every backed up lesson now equals its backup with exactly
-- these replacements applied and nothing else, slide count included. The
-- proof was run against a planted extra change and caught it.

begin;

create table if not exists schools.school_lessons_backup_364 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in (
    'ks1-03-real-pretend-computer',
    'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes',
    'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure',
    'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking',
    'ks2-25-stay-the-maker', 'could-you-be-an-entrepreneur', 'what-problem-would-you-solve');

alter table schools.school_lessons_backup_364 enable row level security;

-- 1. ks1-03's sort script
update schools.school_lessons
   set slides = replace(slides::text,
         'The wall counts the votes, it does not mark them, so the verdict and the reason are yours to say.',
         'Once you tap, the wall shows the answer and its reason. Read the reason out before you tap Next card.')::jsonb
 where module_id = 'ks1-03-real-pretend-computer'
   and slides::text like '%The wall counts the votes, it does not mark them, so the verdict and the reason are yours to say.%';

-- 2. the clicker
update schools.school_lessons
   set slides = replace(slides::text,
         'Tap Fill the page, or hand the clicker to someone.',
         'Tap Fill the page, or let one of the class tap it.')::jsonb
 where module_id in (
     'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes',
     'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure',
     'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking')
   and slides::text like '%Tap Fill the page, or hand the clicker to someone.%';

-- 3. middots
update schools.school_lessons
   set slides = replace(slides::text, ' . ', ' · ')::jsonb
 where module_id in (
     'ks2-25-stay-the-maker', 'ks3-24-is-it-doing-my-thinking',
     'could-you-be-an-entrepreneur', 'what-problem-would-you-solve')
   and slides::text like '% . %';

do $$
declare n int; drift text;
begin
  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id = 'ks1-03-real-pretend-computer'
     and s->>'script' like '%Once you tap, the wall shows the answer and its reason.%';
  if n <> 1 then
    raise exception 'Migration 364: expected the ks1-03 sort script once, found %', n;
  end if;

  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where s->>'script' like '%Tap Fill the page, or let one of the class tap it.%';
  if n <> 7 then
    raise exception 'Migration 364: expected 7 passport scripts without the clicker, found %', n;
  end if;

  select count(*) into n
    from schools.school_lessons l
   where l.module_id in (
       'ks2-25-stay-the-maker', 'ks3-24-is-it-doing-my-thinking',
       'could-you-be-an-entrepreneur', 'what-problem-would-you-solve')
     and l.slides::text like '% . %';
  if n > 0 then
    raise exception 'Migration 364: % lesson(s) still carry a spaced full stop', n;
  end if;

  -- Nothing else moved. Each backed up lesson must equal its backup with these
  -- three changes applied, and only these.
  select string_agg(b.module_id, ', ') into drift
    from schools.school_lessons_backup_364 b
    join schools.school_lessons l using (module_id)
   where l.slides is distinct from (
     with s1 as (
       select case when b.module_id = 'ks1-03-real-pretend-computer'
                   then replace(b.slides::text,
                     'The wall counts the votes, it does not mark them, so the verdict and the reason are yours to say.',
                     'Once you tap, the wall shows the answer and its reason. Read the reason out before you tap Next card.')
                   else b.slides::text end as t),
     s2 as (
       select case when b.module_id in (
                     'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes',
                     'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure',
                     'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking')
                   then replace(t, 'Tap Fill the page, or hand the clicker to someone.', 'Tap Fill the page, or let one of the class tap it.')
                   else t end as t from s1),
     s3 as (
       select case when b.module_id in (
                     'ks2-25-stay-the-maker', 'ks3-24-is-it-doing-my-thinking',
                     'could-you-be-an-entrepreneur', 'what-problem-would-you-solve')
                   then replace(t, ' . ', ' · ')
                   else t end as t from s2)
     select t::jsonb from s3);
  if drift is not null then
    raise exception 'Migration 364: changed beyond the three fixes in %', drift;
  end if;
end $$;

commit;
