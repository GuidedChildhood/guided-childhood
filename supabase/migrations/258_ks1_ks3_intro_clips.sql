-- 258: Pebble, Bloop and Orbit take over the KS1 to KS3 lesson intros.
--
-- Justin approved the casting on 6 September 2026 (the P0 wave,
-- plans/2026-09-06-p0-wave-plan.md). This completes what migration 233
-- started for KS4 (nova) and KS5 (cosmo): every module now opens with the
-- Planet Friend whose key stage it is, matching the family's own mapping
-- in shared/intro-characters.ts (Pebble the first safe steps, Bloop the
-- habits, Orbit the explorer). eyfs-01 already carries celebrate from
-- migration 199 and is untouched here.
--
-- The clip keys are the manifest's slot names: celebrate is Pebble's clip,
-- dance is Bloop's, football is Orbit's. The title slide is found by type,
-- never by index (migration 231's lesson). Idempotent: rerunning rewrites
-- the same value. Snapshot first, RLS on the backup, same as 230/231/233.

create table if not exists schools._backup_lesson_258 as
  select id, module_id, slides
  from schools.school_lessons
  where module_id in (
    'ks1-02-kind-screens-calm-bodies',
    'ks1-03-real-pretend-computer',
    'ks2-04-screen-routines',
    'ks2-05-gaming-time-spend',
    'ks2-06-how-algorithms-work',
    'ks2-07-privacy-reputation',
    'ks2-08-kind-safe-online',
    'ks2-09-copyright-ownership',
    'ks3-10-mood-and-screens',
    'ks3-11-social-workarounds',
    'ks3-12-misinfo-deepfakes',
    'ks3-13-scams-fraud-money',
    'ks3-14-bodies-image-pressure'
  );

alter table schools._backup_lesson_258 enable row level security;

update schools.school_lessons
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'title' then s || '{"character":"celebrate"}'::jsonb else s end
    order by idx
  )
  from jsonb_array_elements(slides) with ordinality as t(s, idx)
)
where jsonb_typeof(slides) = 'array'
  and module_id in (
    'ks1-02-kind-screens-calm-bodies',
    'ks1-03-real-pretend-computer'
  );

update schools.school_lessons
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'title' then s || '{"character":"dance"}'::jsonb else s end
    order by idx
  )
  from jsonb_array_elements(slides) with ordinality as t(s, idx)
)
where jsonb_typeof(slides) = 'array'
  and module_id in (
    'ks2-04-screen-routines',
    'ks2-05-gaming-time-spend',
    'ks2-06-how-algorithms-work',
    'ks2-07-privacy-reputation',
    'ks2-08-kind-safe-online',
    'ks2-09-copyright-ownership'
  );

update schools.school_lessons
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'title' then s || '{"character":"football"}'::jsonb else s end
    order by idx
  )
  from jsonb_array_elements(slides) with ordinality as t(s, idx)
)
where jsonb_typeof(slides) = 'array'
  and module_id in (
    'ks3-10-mood-and-screens',
    'ks3-11-social-workarounds',
    'ks3-12-misinfo-deepfakes',
    'ks3-13-scams-fraud-money',
    'ks3-14-bodies-image-pressure'
  );
