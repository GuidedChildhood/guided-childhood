-- 233: Nova and Cosmo take over the KS4 and KS5 lesson intros.
--
-- Justin approved both clips on 30 August 2026 (decisions.md). The clip
-- entries have sat inert in shared/intro-characters.ts since PR 928;
-- introCharacterFor only serves them when a title slide names the key, so
-- this migration is the switch: it writes character on the title slide of
-- every KS4 deck (nova, steady and calm for the heaviest topics) and every
-- KS5 deck (cosmo, for AI, data rights and the working life ahead).
--
-- The title slide is found by type, never by index, because deck shapes
-- vary (lesson 1 taught us that in migration 231). Idempotent: rerunning
-- rewrites the same value. Snapshot first, same pattern as 230/231; the
-- backup table gets RLS enabled with no policies so it is invisible to the
-- anon key, which is the gap migration 232 closed on _backup_lesson_230.

create table if not exists schools._backup_lesson_233 as
  select id, module_id, slides
  from schools.school_lessons
  where module_id in (
    'ks4-15-manipulation-persuasion',
    'ks4-16-consent-images-law',
    'ks4-17-sextortion',
    'ks4-18-radicalisation-misogyny',
    'ks4-19-readiness-at-16',
    'ks5-20-ai-mastery-data-rights',
    'ks5-21-digital-identity-future-work'
  );

alter table schools._backup_lesson_233 enable row level security;

update schools.school_lessons
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'title' then s || '{"character":"nova"}'::jsonb else s end
    order by idx
  )
  from jsonb_array_elements(slides) with ordinality as t(s, idx)
)
where jsonb_typeof(slides) = 'array'
  and module_id in (
    'ks4-15-manipulation-persuasion',
    'ks4-16-consent-images-law',
    'ks4-17-sextortion',
    'ks4-18-radicalisation-misogyny',
    'ks4-19-readiness-at-16'
  );

update schools.school_lessons
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'title' then s || '{"character":"cosmo"}'::jsonb else s end
    order by idx
  )
  from jsonb_array_elements(slides) with ordinality as t(s, idx)
)
where jsonb_typeof(slides) = 'array'
  and module_id in (
    'ks5-20-ai-mastery-data-rights',
    'ks5-21-digital-identity-future-work'
  );
