-- 369: the extension marks reach the live decks.
--
-- On 21 September 2026 (PR 1143, commit c75b64f9) 147 slides across 26
-- lessons were marked `extension: true`: the slides a teacher short of time
-- can skip and still run the whole arc to the exit quiz
-- (plans/2026-09-21-core-and-extension-plan.md). The marks went into
-- content/modules, and the migration that plan named was never written, so
-- the live rows carry none of them. Since PR 1236 the run sheet computes the
-- core and the skip list from the live deck, so until this lands every run
-- sheet says nothing is marked to skip, and the lessons loop's trims keyed on
-- the flag do nothing.
--
-- WHAT MOVES. One key, `extension`, set to true on the 147 slides the files
-- mark. Nothing else: no text, no slide order or count, no other column, no
-- other lesson. The 8 scheme decks with no marks (the seven youngest, which
-- already fit, and ks3-34, written after the marking pass) are not touched,
-- and neither are the two standalone lessons, which carry their own marks.
--
-- GUARDED, per deck, before anything is written. Each marked deck must have
-- the slide count it was marked against, each marked slide must be the type
-- and phase it was marked on, and no scheme slide may carry an extension
-- value the files do not. Any miss aborts the whole migration.
--
-- Checked read only against production on 12 October 2026: every deck has
-- the count, every marked slide the type and phase, and every slide string
-- the text, that the files have, and no scheme slide carries a mark.
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every slide, except that each marked slide
-- gained "extension": true. The text is byte identical, and any other change
-- fails the proof.
--
-- Idempotent: a second run finds the marks in place, writes the same values
-- and passes the same proof. Backed up first.
--
-- Generated from content/modules by scripts/gen-369.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_369 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in ('ks2-04-screen-routines', 'ks2-05-gaming-time-spend', 'ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation', 'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership', 'ks2-23-when-a-machine-talks-like-a-friend', 'ks2-25-stay-the-maker', 'ks2-26-why-thirteen', 'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure', 'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking', 'ks3-27-when-it-turns-on-you', 'ks4-15-manipulation-persuasion', 'ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-18-radicalisation-misogyny', 'ks4-19-readiness-at-16', 'ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking', 'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work');

alter table schools.school_lessons_backup_369 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_369 on commit drop as select * from schools.school_lessons;

-- The marks, as content/modules has them: deck, its slide count, the slide
-- index, and the type and phase that slide was marked on.
create temp table marks_369 (module_id text, n int, i int, type text, phase text) on commit drop;
insert into marks_369 (module_id, n, i, type, phase) values
  ('ks2-04-screen-routines', 29, 9, 'discussion', 'teach'),
  ('ks2-04-screen-routines', 29, 11, 'scenario', 'teach'),
  ('ks2-04-screen-routines', 29, 17, 'discussion', 'teach'),
  ('ks2-04-screen-routines', 29, 18, 'choice', 'teach'),
  ('ks2-04-screen-routines', 29, 20, 'interactive', 'practise'),
  ('ks2-05-gaming-time-spend', 31, 7, 'discussion', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 9, 'discussion', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 13, 'choice', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 15, 'scenario', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 16, 'discussion', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 17, 'choice', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 20, 'scenario', 'teach'),
  ('ks2-05-gaming-time-spend', 31, 22, 'interactive', 'practise'),
  ('ks2-06-how-algorithms-work', 29, 7, 'discussion', 'teach'),
  ('ks2-06-how-algorithms-work', 29, 9, 'scenario', 'teach'),
  ('ks2-06-how-algorithms-work', 29, 13, 'choice', 'teach'),
  ('ks2-06-how-algorithms-work', 29, 14, 'discussion', 'teach'),
  ('ks2-06-how-algorithms-work', 29, 17, 'scenario', 'teach'),
  ('ks2-06-how-algorithms-work', 29, 20, 'interactive', 'practise'),
  ('ks2-07-privacy-reputation', 29, 13, 'choice', 'teach'),
  ('ks2-07-privacy-reputation', 29, 16, 'scenario', 'teach'),
  ('ks2-07-privacy-reputation', 29, 17, 'choice', 'teach'),
  ('ks2-07-privacy-reputation', 29, 18, 'discussion', 'teach'),
  ('ks2-07-privacy-reputation', 29, 20, 'interactive', 'practise'),
  ('ks2-08-kind-safe-online', 30, 6, 'scenario', 'teach'),
  ('ks2-08-kind-safe-online', 30, 13, 'choice', 'teach'),
  ('ks2-08-kind-safe-online', 30, 15, 'discussion', 'teach'),
  ('ks2-08-kind-safe-online', 30, 18, 'discussion', 'teach'),
  ('ks2-08-kind-safe-online', 30, 19, 'choice', 'teach'),
  ('ks2-08-kind-safe-online', 30, 21, 'interactive', 'practise'),
  ('ks2-09-copyright-ownership', 29, 7, 'scenario', 'teach'),
  ('ks2-09-copyright-ownership', 29, 8, 'discussion', 'teach'),
  ('ks2-09-copyright-ownership', 29, 12, 'scenario', 'teach'),
  ('ks2-09-copyright-ownership', 29, 15, 'discussion', 'teach'),
  ('ks2-09-copyright-ownership', 29, 17, 'discussion', 'teach'),
  ('ks2-09-copyright-ownership', 29, 20, 'interactive', 'practise'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 10, 'discussion', 'teach'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 14, 'discussion', 'teach'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 18, 'scenario', 'teach'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 20, 'discussion', 'teach'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 24, 'discussion', 'practise'),
  ('ks2-23-when-a-machine-talks-like-a-friend', 33, 26, 'scenario', 'practise'),
  ('ks2-25-stay-the-maker', 31, 8, 'discussion', 'teach'),
  ('ks2-25-stay-the-maker', 31, 14, 'discussion', 'teach'),
  ('ks2-25-stay-the-maker', 31, 19, 'discussion', 'teach'),
  ('ks2-25-stay-the-maker', 31, 23, 'discussion', 'practise'),
  ('ks2-26-why-thirteen', 31, 8, 'discussion', 'teach'),
  ('ks2-26-why-thirteen', 31, 12, 'scenario', 'teach'),
  ('ks2-26-why-thirteen', 31, 19, 'discussion', 'teach'),
  ('ks2-26-why-thirteen', 31, 23, 'discussion', 'practise'),
  ('ks3-10-mood-and-screens', 29, 6, 'scenario', 'teach'),
  ('ks3-10-mood-and-screens', 29, 11, 'scenario', 'teach'),
  ('ks3-10-mood-and-screens', 29, 12, 'discussion', 'teach'),
  ('ks3-10-mood-and-screens', 29, 16, 'scenario', 'teach'),
  ('ks3-10-mood-and-screens', 29, 18, 'discussion', 'teach'),
  ('ks3-10-mood-and-screens', 29, 20, 'interactive', 'practise'),
  ('ks3-11-social-workarounds', 31, 11, 'choice', 'teach'),
  ('ks3-11-social-workarounds', 31, 12, 'scenario', 'teach'),
  ('ks3-11-social-workarounds', 31, 15, 'choice', 'teach'),
  ('ks3-11-social-workarounds', 31, 16, 'scenario', 'teach'),
  ('ks3-11-social-workarounds', 31, 17, 'discussion', 'teach'),
  ('ks3-11-social-workarounds', 31, 20, 'discussion', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 7, 'scenario', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 8, 'scenario', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 14, 'discussion', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 15, 'scenario', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 16, 'choice', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 17, 'choice', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 18, 'scenario', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 21, 'discussion', 'teach'),
  ('ks3-12-misinfo-deepfakes', 35, 23, 'interactive', 'practise'),
  ('ks3-13-scams-fraud-money', 31, 6, 'scenario', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 11, 'scenario', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 13, 'choice', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 14, 'discussion', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 15, 'scenario', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 17, 'choice', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 19, 'discussion', 'teach'),
  ('ks3-13-scams-fraud-money', 31, 22, 'interactive', 'practise'),
  ('ks3-14-bodies-image-pressure', 30, 6, 'scenario', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 10, 'scenario', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 11, 'discussion', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 12, 'choice', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 15, 'choice', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 19, 'discussion', 'teach'),
  ('ks3-14-bodies-image-pressure', 30, 21, 'interactive', 'practise'),
  ('ks3-22-when-an-ai-acts-like-a-friend', 31, 9, 'discussion', 'teach'),
  ('ks3-22-when-an-ai-acts-like-a-friend', 31, 14, 'discussion', 'teach'),
  ('ks3-22-when-an-ai-acts-like-a-friend', 31, 19, 'discussion', 'teach'),
  ('ks3-22-when-an-ai-acts-like-a-friend', 31, 23, 'discussion', 'practise'),
  ('ks3-24-is-it-doing-my-thinking', 31, 9, 'discussion', 'teach'),
  ('ks3-24-is-it-doing-my-thinking', 31, 14, 'discussion', 'teach'),
  ('ks3-24-is-it-doing-my-thinking', 31, 19, 'discussion', 'teach'),
  ('ks3-24-is-it-doing-my-thinking', 31, 23, 'discussion', 'practise'),
  ('ks3-27-when-it-turns-on-you', 31, 8, 'discussion', 'teach'),
  ('ks3-27-when-it-turns-on-you', 31, 12, 'scenario', 'teach'),
  ('ks3-27-when-it-turns-on-you', 31, 19, 'discussion', 'teach'),
  ('ks3-27-when-it-turns-on-you', 31, 23, 'discussion', 'practise'),
  ('ks4-15-manipulation-persuasion', 30, 7, 'scenario', 'teach'),
  ('ks4-15-manipulation-persuasion', 30, 10, 'scenario', 'teach'),
  ('ks4-15-manipulation-persuasion', 30, 13, 'discussion', 'teach'),
  ('ks4-15-manipulation-persuasion', 30, 14, 'scenario', 'teach'),
  ('ks4-15-manipulation-persuasion', 30, 18, 'discussion', 'teach'),
  ('ks4-15-manipulation-persuasion', 30, 21, 'interactive', 'practise'),
  ('ks4-16-consent-images-law', 32, 12, 'choice', 'teach'),
  ('ks4-16-consent-images-law', 32, 13, 'scenario', 'teach'),
  ('ks4-16-consent-images-law', 32, 16, 'discussion', 'teach'),
  ('ks4-16-consent-images-law', 32, 20, 'discussion', 'teach'),
  ('ks4-16-consent-images-law', 32, 21, 'choice', 'teach'),
  ('ks4-16-consent-images-law', 32, 23, 'interactive', 'practise'),
  ('ks4-17-sextortion', 30, 9, 'choice', 'teach'),
  ('ks4-17-sextortion', 30, 11, 'scenario', 'teach'),
  ('ks4-17-sextortion', 30, 13, 'choice', 'teach'),
  ('ks4-17-sextortion', 30, 14, 'scenario', 'teach'),
  ('ks4-17-sextortion', 30, 17, 'discussion', 'teach'),
  ('ks4-17-sextortion', 30, 19, 'choice', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 7, 'scenario', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 12, 'scenario', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 14, 'discussion', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 18, 'discussion', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 19, 'choice', 'teach'),
  ('ks4-18-radicalisation-misogyny', 30, 21, 'interactive', 'practise'),
  ('ks4-19-readiness-at-16', 34, 7, 'discussion', 'teach'),
  ('ks4-19-readiness-at-16', 34, 11, 'scenario', 'teach'),
  ('ks4-19-readiness-at-16', 34, 14, 'choice', 'teach'),
  ('ks4-19-readiness-at-16', 34, 16, 'discussion', 'teach'),
  ('ks4-19-readiness-at-16', 34, 19, 'scenario', 'teach'),
  ('ks4-19-readiness-at-16', 34, 20, 'choice', 'teach'),
  ('ks4-19-readiness-at-16', 34, 23, 'discussion', 'teach'),
  ('ks4-19-readiness-at-16', 34, 25, 'interactive', 'practise'),
  ('ks4-28-the-money-and-the-odds', 32, 8, 'discussion', 'teach'),
  ('ks4-28-the-money-and-the-odds', 32, 14, 'scenario', 'teach'),
  ('ks4-28-the-money-and-the-odds', 32, 19, 'discussion', 'teach'),
  ('ks4-28-the-money-and-the-odds', 32, 23, 'discussion', 'practise'),
  ('ks4-29-did-not-go-looking', 32, 8, 'discussion', 'teach'),
  ('ks4-29-did-not-go-looking', 32, 12, 'scenario', 'teach'),
  ('ks4-29-did-not-go-looking', 32, 19, 'discussion', 'teach'),
  ('ks4-29-did-not-go-looking', 32, 23, 'discussion', 'practise'),
  ('ks5-20-ai-mastery-data-rights', 30, 8, 'discussion', 'teach'),
  ('ks5-20-ai-mastery-data-rights', 30, 12, 'scenario', 'teach'),
  ('ks5-20-ai-mastery-data-rights', 30, 20, 'discussion', 'teach'),
  ('ks5-20-ai-mastery-data-rights', 30, 22, 'interactive', 'practise'),
  ('ks5-21-digital-identity-future-work', 29, 7, 'scenario', 'teach'),
  ('ks5-21-digital-identity-future-work', 29, 9, 'discussion', 'teach'),
  ('ks5-21-digital-identity-future-work', 29, 13, 'discussion', 'teach'),
  ('ks5-21-digital-identity-future-work', 29, 15, 'discussion', 'teach'),
  ('ks5-21-digital-identity-future-work', 29, 21, 'interactive', 'practise');

-- ── the guards ─────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  select string_agg(d.module_id || coalesce(' has ' || jsonb_array_length(l.slides) || ' slides, not ' || d.n, ' is missing'), '; ')
    into bad
    from (select distinct module_id, n from marks_369) d
    left join schools.school_lessons l using (module_id)
   where l.module_id is null or jsonb_array_length(l.slides) <> d.n;
  if bad is not null then raise exception '369 aborted, a deck is not the one marked: %', bad; end if;

  select string_agg(m.module_id || ' slide ' || m.i || ' is ' || coalesce(l.slides->m.i->>'type', 'null') || '/' || coalesce(l.slides->m.i->>'phase', 'null')
                    || ', marked as ' || m.type || '/' || m.phase, '; ')
    into bad
    from marks_369 m join schools.school_lessons l using (module_id)
   where l.slides->m.i->>'type' is distinct from m.type
      or l.slides->m.i->>'phase' is distinct from m.phase;
  if bad is not null then raise exception '369 aborted, a marked slide is not the one marked: %', bad; end if;

  select string_agg(l.module_id || ' slide ' || (s.k - 1) || ' carries extension ' || (s.v->'extension')::text, '; ')
    into bad
    from schools.school_lessons l
    cross join lateral jsonb_array_elements(l.slides) with ordinality s(v, k)
    left join marks_369 m on m.module_id = l.module_id and m.i = s.k - 1
   where l.module_id in ('eyfs-01-screens-kindness', 'eyfs-30-the-screen-never-says-stop', 'eyfs-31-paws-off-ask-first', 'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer', 'ks1-32-private-like-a-toothbrush', 'ks1-33-who-is-on-the-other-side', 'ks2-04-screen-routines', 'ks2-05-gaming-time-spend', 'ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation', 'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership', 'ks2-23-when-a-machine-talks-like-a-friend', 'ks2-25-stay-the-maker', 'ks2-26-why-thirteen', 'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure', 'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking', 'ks3-27-when-it-turns-on-you', 'ks3-34-who-owns-what-you-make', 'ks4-15-manipulation-persuasion', 'ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-18-radicalisation-misogyny', 'ks4-19-readiness-at-16', 'ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking', 'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work')
     and s.v ? 'extension'
     and (m.i is null or s.v->'extension' <> 'true'::jsonb);
  if bad is not null then raise exception '369 aborted, a slide carries a mark the files do not: %', bad; end if;
end $$;

-- ── the marks ──────────────────────────────────────────────────────────────

-- ks2-04-screen-routines: 29 slides, 5 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{9,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-04-screen-routines';

-- ks2-05-gaming-time-spend: 31 slides, 8 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{9,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true),
         '{22,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-05-gaming-time-spend';

-- ks2-06-how-algorithms-work: 29 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{9,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-06-how-algorithms-work';

-- ks2-07-privacy-reputation: 29 slides, 5 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{13,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-07-privacy-reputation';

-- ks2-08-kind-safe-online: 30 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{6,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-08-kind-safe-online';

-- ks2-09-copyright-ownership: 29 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{8,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-09-copyright-ownership';

-- ks2-23-when-a-machine-talks-like-a-friend: 33 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{10,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true),
         '{24,extension}', 'true'::jsonb, true),
         '{26,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-23-when-a-machine-talks-like-a-friend';

-- ks2-25-stay-the-maker: 31 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-25-stay-the-maker';

-- ks2-26-why-thirteen: 31 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks2-26-why-thirteen';

-- ks3-10-mood-and-screens: 29 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{6,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-10-mood-and-screens';

-- ks3-11-social-workarounds: 31 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{11,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-11-social-workarounds';

-- ks3-12-misinfo-deepfakes: 35 slides, 9 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{8,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-12-misinfo-deepfakes';

-- ks3-13-scams-fraud-money: 31 slides, 8 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{6,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{22,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-13-scams-fraud-money';

-- ks3-14-bodies-image-pressure: 30 slides, 7 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{6,extension}', 'true'::jsonb, true),
         '{10,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-14-bodies-image-pressure';

-- ks3-22-when-an-ai-acts-like-a-friend: 31 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{9,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-22-when-an-ai-acts-like-a-friend';

-- ks3-24-is-it-doing-my-thinking: 31 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{9,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-24-is-it-doing-my-thinking';

-- ks3-27-when-it-turns-on-you: 31 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks3-27-when-it-turns-on-you';

-- ks4-15-manipulation-persuasion: 30 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{10,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-15-manipulation-persuasion';

-- ks4-16-consent-images-law: 32 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{12,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-16-consent-images-law';

-- ks4-17-sextortion: 30 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{9,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{17,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-17-sextortion';

-- ks4-18-radicalisation-misogyny: 30 slides, 6 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{18,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-18-radicalisation-misogyny';

-- ks4-19-readiness-at-16: 34 slides, 8 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{11,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{16,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true),
         '{25,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-19-readiness-at-16';

-- ks4-28-the-money-and-the-odds: 32 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{14,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-28-the-money-and-the-odds';

-- ks4-29-did-not-go-looking: 32 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{19,extension}', 'true'::jsonb, true),
         '{23,extension}', 'true'::jsonb, true)
 where module_id = 'ks4-29-did-not-go-looking';

-- ks5-20-ai-mastery-data-rights: 30 slides, 4 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{8,extension}', 'true'::jsonb, true),
         '{12,extension}', 'true'::jsonb, true),
         '{20,extension}', 'true'::jsonb, true),
         '{22,extension}', 'true'::jsonb, true)
 where module_id = 'ks5-20-ai-mastery-data-rights';

-- ks5-21-digital-identity-future-work: 29 slides, 5 marked
update schools.school_lessons
   set slides = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(slides,
         '{7,extension}', 'true'::jsonb, true),
         '{9,extension}', 'true'::jsonb, true),
         '{13,extension}', 'true'::jsonb, true),
         '{15,extension}', 'true'::jsonb, true),
         '{21,extension}', 'true'::jsonb, true)
 where module_id = 'ks5-21-digital-identity-future-work';

-- ── the proof ──────────────────────────────────────────────────────────────

do $$
declare bad text; n int;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_369)
     or exists (select module_id from before_369 except select module_id from schools.school_lessons) then
    raise exception '369: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l join before_369 b using (module_id)
   where (to_jsonb(l) - 'slides') is distinct from (to_jsonb(b) - 'slides')
      or jsonb_array_length(l.slides) <> jsonb_array_length(b.slides);
  if bad is not null then raise exception '369: a column other than slides, or a slide count, moved in %', bad; end if;

  select string_agg(l.module_id || ' slide ' || (s.k - 1), ', ') into bad
    from schools.school_lessons l
    join before_369 b using (module_id)
    cross join lateral jsonb_array_elements(b.slides) with ordinality s(v, k)
    left join marks_369 m on m.module_id = l.module_id and m.i = s.k - 1
   where (l.slides -> (s.k::int - 1)) is distinct from
         case when m.i is null then s.v else s.v || '{"extension": true}'::jsonb end;
  if bad is not null then raise exception '369: changed beyond the extension key: %', bad; end if;

  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in ('eyfs-01-screens-kindness', 'eyfs-30-the-screen-never-says-stop', 'eyfs-31-paws-off-ask-first', 'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer', 'ks1-32-private-like-a-toothbrush', 'ks1-33-who-is-on-the-other-side', 'ks2-04-screen-routines', 'ks2-05-gaming-time-spend', 'ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation', 'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership', 'ks2-23-when-a-machine-talks-like-a-friend', 'ks2-25-stay-the-maker', 'ks2-26-why-thirteen', 'ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money', 'ks3-14-bodies-image-pressure', 'ks3-22-when-an-ai-acts-like-a-friend', 'ks3-24-is-it-doing-my-thinking', 'ks3-27-when-it-turns-on-you', 'ks3-34-who-owns-what-you-make', 'ks4-15-manipulation-persuasion', 'ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-18-radicalisation-misogyny', 'ks4-19-readiness-at-16', 'ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking', 'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work')
     and s ? 'extension';
  if n <> 147 then raise exception '369: % scheme slides carry a mark, not 147', n; end if;
end $$;

commit;
