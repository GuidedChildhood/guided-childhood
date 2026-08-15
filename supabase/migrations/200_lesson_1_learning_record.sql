-- Guided Childhood — Migration 200
-- The three "I can" statements behind My learning record, for lesson 1.
--
-- WHY THREE, AND WHY THE CHILD COLOURS ONE. Jigsaw's best move, and the
-- cheapest real differentiator available to us: the child colours the
-- statement they think they reached, the teacher colours theirs beside it,
-- and then the two of them talk about the gap. The conversation IS the
-- assessment. A grid a teacher fills in alone tells you what the teacher
-- thinks; this tells you what the CHILD thinks, which is the only one of the
-- two you can teach into.
--
-- They live in teacher_notes.i_can rather than a new column so that a lesson
-- which has not been written up yet simply does not offer the sheet, instead
-- of printing an empty one. The print route 404s when the array is missing,
-- which is the honest behaviour: no half sheet with three blank boxes.
--
-- WRITTEN AS A LADDER, not as three ways of saying the same thing. Notice,
-- then act, then explain to somebody else. Explaining it to a friend is the
-- top one because a four year old who can say WHY we ask has understood the
-- thing rather than learned the words, and because it is the one a teacher
-- can actually hear happening on the carpet.
--
-- Deliberately not scored, not levelled and not nationally recognised, and
-- the sheet says so in print. A head has been sold overclaimed progression
-- data many times; naming the limit of your own measure buys more trust than
-- another badge would.
--
-- Supabase editor rules: idempotent, flat statements. Safe to re-run.

update schools.school_lessons
set teacher_notes = jsonb_set(
  teacher_notes,
  '{i_can}',
  jsonb_build_array(
    'I can point to something real and something made up.',
    'I can stop and ask a grown up if something on a screen is real.',
    'I can tell a friend why asking a grown up is a clever thing to do.'
  ),
  true
)
where module_id = 'eyfs-01-screens-kindness';
