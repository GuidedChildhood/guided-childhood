-- Guided Childhood — Migration 101
-- The sweep 100 should have been.
--
-- Migration 100 mapped each old character to the Friend for its key stage, but
-- it decided WHICH names to look for per stage from a scan of migration 033
-- alone. The curriculum is seeded across 023, 026, 031, 032, 038 and 049 as
-- well, so a lesson seeded elsewhere slipped through: ks3-12-misinfo-deepfakes
-- still taught with Zara, because the KS3 rule had only been told to look for
-- Vix and Brock.
--
-- This does not repeat that mistake. Every old name is replaced in every key
-- stage, so it cannot matter which migration seeded a lesson or which character
-- happens to be in it. The mapping is still by the lesson's key stage, so each
-- age meets the Friend who belongs to it:
--
--   EYFS and KS1  (ages 4 to 7)   -> Pebble
--   KS2           (ages 7 to 11)  -> Bloop, except Zara who becomes Orbit
--   KS3           (ages 11 to 14) -> Orbit
--   KS4           (ages 14 to 16) -> Nova
--
-- Idempotent: replace() on a name already gone is a no op, so running this after
-- 100, or twice, changes nothing further.
--
-- Note on colour: "Bloop is the calm one in green" in ks2-07 is CORRECT and is
-- deliberately left alone. Bloop is green. Only Pebble needed her colour moved,
-- which 100 already did.

-- EYFS and KS1: every old name becomes Pebble.
update public.school_lessons set
  title                 = replace(replace(replace(replace(replace(title, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble'),
  evidence_anchor       = replace(replace(replace(replace(replace(evidence_anchor, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble'),
  single_action_outcome = replace(replace(replace(replace(replace(single_action_outcome, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble'),
  character_cast        = replace(replace(replace(replace(replace(character_cast, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble'),
  slides                = replace(replace(replace(replace(replace(slides::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb,
  video_beats           = replace(replace(replace(replace(replace(video_beats::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb,
  assessment            = replace(replace(replace(replace(replace(assessment::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb,
  parent_note           = replace(replace(replace(replace(replace(parent_note::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb,
  teacher_notes         = replace(replace(replace(replace(replace(teacher_notes::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb,
  dsl_note              = replace(replace(replace(replace(replace(dsl_note::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble'), 'Oliver', 'Pebble'), 'Vix', 'Pebble'), 'Brock', 'Pebble')::jsonb
where key_stage in ('EYFS', 'KS1');

-- KS2: Zara becomes Orbit (her material is the older end), the rest become Bloop.
update public.school_lessons set
  title                 = replace(replace(replace(replace(replace(title, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop'),
  evidence_anchor       = replace(replace(replace(replace(replace(evidence_anchor, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop'),
  single_action_outcome = replace(replace(replace(replace(replace(single_action_outcome, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop'),
  character_cast        = replace(replace(replace(replace(replace(character_cast, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop'),
  slides                = replace(replace(replace(replace(replace(slides::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb,
  video_beats           = replace(replace(replace(replace(replace(video_beats::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb,
  assessment            = replace(replace(replace(replace(replace(assessment::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb,
  parent_note           = replace(replace(replace(replace(replace(parent_note::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb,
  teacher_notes         = replace(replace(replace(replace(replace(teacher_notes::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb,
  dsl_note              = replace(replace(replace(replace(replace(dsl_note::text, 'Zara', 'Orbit'), 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Vix', 'Bloop'), 'Brock', 'Bloop')::jsonb
where key_stage = 'KS2';

-- KS3: every old name becomes Orbit. This is the one that caught ks3-12.
update public.school_lessons set
  title                 = replace(replace(replace(replace(replace(title, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  evidence_anchor       = replace(replace(replace(replace(replace(evidence_anchor, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  single_action_outcome = replace(replace(replace(replace(replace(single_action_outcome, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  character_cast        = replace(replace(replace(replace(replace(character_cast, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  slides                = replace(replace(replace(replace(replace(slides::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  video_beats           = replace(replace(replace(replace(replace(video_beats::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  assessment            = replace(replace(replace(replace(replace(assessment::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  parent_note           = replace(replace(replace(replace(replace(parent_note::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  teacher_notes         = replace(replace(replace(replace(replace(teacher_notes::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  dsl_note              = replace(replace(replace(replace(replace(dsl_note::text, 'Sofia', 'Orbit'), 'Zara', 'Orbit'), 'Oliver', 'Orbit'), 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb
where key_stage = 'KS3';

-- KS4: every old name becomes Nova.
update public.school_lessons set
  title                 = replace(replace(replace(replace(replace(title, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova'),
  evidence_anchor       = replace(replace(replace(replace(replace(evidence_anchor, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova'),
  single_action_outcome = replace(replace(replace(replace(replace(single_action_outcome, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova'),
  character_cast        = replace(replace(replace(replace(replace(character_cast, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova'),
  slides                = replace(replace(replace(replace(replace(slides::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  video_beats           = replace(replace(replace(replace(replace(video_beats::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  assessment            = replace(replace(replace(replace(replace(assessment::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  parent_note           = replace(replace(replace(replace(replace(parent_note::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  teacher_notes         = replace(replace(replace(replace(replace(teacher_notes::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  dsl_note              = replace(replace(replace(replace(replace(dsl_note::text, 'Sofia', 'Nova'), 'Zara', 'Nova'), 'Oliver', 'Nova'), 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb
where key_stage = 'KS4';

-- Any lesson with no key stage set at all still gets the humans out, using DiGi,
-- who belongs to every age, rather than guessing at one.
update public.school_lessons set
  title          = replace(replace(replace(replace(replace(title, 'Sofia', 'DiGi'), 'Zara', 'DiGi'), 'Oliver', 'DiGi'), 'Vix', 'DiGi'), 'Brock', 'DiGi'),
  character_cast = replace(replace(replace(replace(replace(character_cast, 'Sofia', 'DiGi'), 'Zara', 'DiGi'), 'Oliver', 'DiGi'), 'Vix', 'DiGi'), 'Brock', 'DiGi'),
  slides         = replace(replace(replace(replace(replace(slides::text, 'Sofia', 'DiGi'), 'Zara', 'DiGi'), 'Oliver', 'DiGi'), 'Vix', 'DiGi'), 'Brock', 'DiGi')::jsonb
where key_stage is null or key_stage not in ('EYFS', 'KS1', 'KS2', 'KS3', 'KS4');
