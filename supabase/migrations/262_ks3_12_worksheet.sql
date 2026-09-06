-- 262 (born 257): ks3-12 gets its worksheet and its tool block.
--
-- RENUMBERED 6 September 2026, twice, and here is the ledger so nobody
-- has to reconstruct it. Two lanes claimed 257 on the same day: this file
-- (PR 979) and the DiGi situations bank (PR 978), and the wiring check
-- rightly broke on the collision. This file first moved to 260, but the
-- DiGi lane's own fix (PR 983) takes 260 for the bank, matching the name
-- it was applied to production under, and claims 261 for its scripts. So
-- this file takes 262, which collides with nothing whichever PR merges
-- first. It was APPLIED to production under the name 257_ks3_12_worksheet
-- on 6 September; it is idempotent, so tooling that replays it under the
-- new name changes nothing.
--
-- The master audit (research/2026-09-05-master-audit.md, Report 14 P0 item
-- 2) found ks3-12-misinfo-deepfakes to be the only module with no worksheet
-- and no teacher_notes.tool, on the most named statutory ground in the
-- scheme (RSHE 2026 and KCSIE 2026 both name deepfakes and misinformation).
-- The lesson itself already teaches a complete frame on its diagram slide:
-- three checks (who made this, what do other places say, how does it want
-- me to feel) ending in one of three verdicts (Believe, Pause, Do not
-- share). This migration writes that same frame into the teacher notes so
-- the print pack's answer key and the run sheet stop skipping the module.
-- Nothing on the slides changes.
--
-- Six casework items in the house pattern (expected_verdict +
-- teaching_point on every item, same as the other 20 modules), calibrated
-- two Believe, two Pause, two Do not share, because the module's own
-- misconception list warns that checking must end in believe verdicts too.
-- Snapshot first, RLS on the backup, idempotent: jsonb_set overwrites the
-- same keys on a rerun. Pattern follows 230/231/233.

create table if not exists schools._backup_lesson_257 as
  select id, module_id, teacher_notes
  from schools.school_lessons
  where module_id = 'ks3-12-misinfo-deepfakes';

alter table schools._backup_lesson_257 enable row level security;

update schools.school_lessons
set teacher_notes = teacher_notes
  || jsonb_build_object(
    'tool', jsonb_build_object(
      'heading', 'The three checks',
      'strapline', 'Under a minute, and pause is a perfectly good verdict.',
      'lines', jsonb_build_array(
        'Who made this?',
        'What do other places say?',
        'How does it want me to feel?'
      )
    ),
    'worksheet', jsonb_build_object(
      'title', 'The three checks casework',
      'directions', 'Run the three checks on each item: who made it, what do other places say, how does it want you to feel. Give your verdict and name the check that decided it.',
      'verdict_options', jsonb_build_array('Believe', 'Pause', 'Do not share')
    ),
    'worksheet_items', jsonb_build_array(
      jsonb_build_object(
        'n', 1,
        'item', 'A news video about flooding in the north, on the broadcaster''s own verified account, matching reports on two other news sites.',
        'expected_verdict', 'Believe',
        'teaching_point', 'Check one and check two both pass: a named source you can follow, and other places agreeing. The checks end in believe verdicts too, checking is not distrusting everything.'
      ),
      jsonb_build_object(
        'n', 2,
        'item', 'A voice note that sounds exactly like a famous footballer announcing a free giveaway, posted by a fan account.',
        'expected_verdict', 'Do not share',
        'teaching_point', 'Voices can be cloned cheaply and convincingly, so the sound proves nothing. Check one fails, a fan account is not the footballer, and a giveaway plus excitement is check three firing.'
      ),
      jsonb_build_object(
        'n', 3,
        'item', 'A screenshot of a headline, with no link, sent to your group chat by a good friend, saying a celebrity has died.',
        'expected_verdict', 'Pause',
        'teaching_point', 'A screenshot cuts the claim off from its source, and a friend''s name never verifies a claim, it only tells you who passed it on. Check two settles this in under a minute: search the headline and see what other places say.'
      ),
      jsonb_build_object(
        'n', 4,
        'item', 'A video of a politician saying something outrageous, posted an hour ago, that no news site anywhere is carrying yet.',
        'expected_verdict', 'Pause',
        'teaching_point', 'An event this big with zero coverage anywhere fails check two right now, but an hour is early. Pause is the calibrated verdict: if it is real, three places will carry it by tonight, and if it is a deepfake, you did not help it travel.'
      ),
      jsonb_build_object(
        'n', 5,
        'item', 'An illustration on a science page, clearly labelled as AI generated, showing how a volcano works, matching your textbook.',
        'expected_verdict', 'Believe',
        'teaching_point', 'AI made is a method, not a verdict. This is labelled honestly, comes from a source you can follow, and other places agree. The lie in a deepfake is the pretending, never the tool.'
      ),
      jsonb_build_object(
        'n', 6,
        'item', 'A post that makes you furious about your own town and urges everyone to share it before it gets taken down.',
        'expected_verdict', 'Do not share',
        'teaching_point', 'Share before it disappears is engineered urgency, and fury is the doorway feeling from check three. The one step of a fake''s journey it cannot control is whether you notice the feeling and check instead of share.'
      )
    )
  )
where module_id = 'ks3-12-misinfo-deepfakes';
