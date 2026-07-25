-- Guided Childhood — Migration 099
-- Retire the old human squad from the schools curriculum.
--
-- The 22 July decision (plans/character-maturation-plan.md) was to retire the
-- human characters entirely, so the cast is DiGi plus the five Planet Friends,
-- one coherent family. Any lesson that used a human now uses that stage's
-- Friend. The app code was already clean; this is the content half, which lives
-- in school_lessons rows seeded by migrations 023 through 049.
--
-- Who replaces whom is decided by the LESSON's key stage, not by the old
-- character, so each age meets the Friend who belongs to it:
--
--   EYFS and KS1  (ages 4 to 7)   -> Pebble
--   KS2           (ages 7 to 11)  -> Bloop
--   KS3           (ages 11 to 14) -> Orbit
--   KS4           (ages 14 to 16) -> Nova
--
-- One deliberate exception: in KS2, Zara becomes Orbit rather than Bloop. Her
-- lessons are the older, trickier ones (copyright, the unkind pile on) and
-- ks2-08 casts Sofia AND Zara together, which would otherwise collapse into
-- "Bloop with Bloop".
--
-- Idempotent by nature: replace() on a name already gone is a no op, so this can
-- be run twice safely.
--
-- Supabase editor rules: flat statements, no DO blocks, no semicolons inside
-- string literals.

-- EYFS and KS1: Sofia and Zara both become Pebble.
update public.school_lessons set
  title                 = replace(replace(title, 'Sofia', 'Pebble'), 'Zara', 'Pebble'),
  evidence_anchor       = replace(replace(evidence_anchor, 'Sofia', 'Pebble'), 'Zara', 'Pebble'),
  single_action_outcome = replace(replace(single_action_outcome, 'Sofia', 'Pebble'), 'Zara', 'Pebble'),
  character_cast        = replace(replace(character_cast, 'Sofia', 'Pebble'), 'Zara', 'Pebble'),
  slides                = replace(replace(slides::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb,
  video_beats           = replace(replace(video_beats::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb,
  assessment            = replace(replace(assessment::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb,
  parent_note           = replace(replace(parent_note::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb,
  teacher_notes         = replace(replace(teacher_notes::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb,
  dsl_note              = replace(replace(dsl_note::text, 'Sofia', 'Pebble'), 'Zara', 'Pebble')::jsonb
where key_stage in ('EYFS', 'KS1');

-- KS2: Sofia and Oliver become Bloop, Zara becomes Orbit.
update public.school_lessons set
  title                 = replace(replace(replace(title, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit'),
  evidence_anchor       = replace(replace(replace(evidence_anchor, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit'),
  single_action_outcome = replace(replace(replace(single_action_outcome, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit'),
  character_cast        = replace(replace(replace(character_cast, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit'),
  slides                = replace(replace(replace(slides::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb,
  video_beats           = replace(replace(replace(video_beats::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb,
  assessment            = replace(replace(replace(assessment::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb,
  parent_note           = replace(replace(replace(parent_note::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb,
  teacher_notes         = replace(replace(replace(teacher_notes::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb,
  dsl_note              = replace(replace(replace(dsl_note::text, 'Sofia', 'Bloop'), 'Oliver', 'Bloop'), 'Zara', 'Orbit')::jsonb
where key_stage = 'KS2';

-- KS3: Vix and Brock become Orbit.
update public.school_lessons set
  title                 = replace(replace(title, 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  evidence_anchor       = replace(replace(evidence_anchor, 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  single_action_outcome = replace(replace(single_action_outcome, 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  character_cast        = replace(replace(character_cast, 'Vix', 'Orbit'), 'Brock', 'Orbit'),
  slides                = replace(replace(slides::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  video_beats           = replace(replace(video_beats::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  assessment            = replace(replace(assessment::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  parent_note           = replace(replace(parent_note::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  teacher_notes         = replace(replace(teacher_notes::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb,
  dsl_note              = replace(replace(dsl_note::text, 'Vix', 'Orbit'), 'Brock', 'Orbit')::jsonb
where key_stage = 'KS3';

-- KS4: Vix and Brock become Nova.
update public.school_lessons set
  title                 = replace(replace(title, 'Vix', 'Nova'), 'Brock', 'Nova'),
  evidence_anchor       = replace(replace(evidence_anchor, 'Vix', 'Nova'), 'Brock', 'Nova'),
  single_action_outcome = replace(replace(single_action_outcome, 'Vix', 'Nova'), 'Brock', 'Nova'),
  character_cast        = replace(replace(character_cast, 'Vix', 'Nova'), 'Brock', 'Nova'),
  slides                = replace(replace(slides::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  video_beats           = replace(replace(video_beats::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  assessment            = replace(replace(assessment::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  parent_note           = replace(replace(parent_note::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  teacher_notes         = replace(replace(teacher_notes::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb,
  dsl_note              = replace(replace(dsl_note::text, 'Vix', 'Nova'), 'Brock', 'Nova')::jsonb
where key_stage = 'KS4';

-- Two lines described Sofia by her colour. Pebble is yellow, so the colour has
-- to move with the name or the slide describes a character who is not there.
update public.school_lessons set
  slides = replace(replace(slides::text, 'gentle green guide', 'gentle yellow guide'), 'the calm one in green', 'the calm one in yellow')::jsonb
where key_stage in ('EYFS', 'KS1');
