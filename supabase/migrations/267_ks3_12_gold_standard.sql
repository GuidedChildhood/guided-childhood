-- 267: the gold standard exemplar. ks3-12 through the fifteen pass QA.
--
-- The full QA record is research/2026-09-06-ks3-12-gold-standard-qa.md:
-- fifteen passes, three findings, score 94 after this migration (84
-- before the wave). The findings this file closes:
--
-- 1. TIMING ARITHMETIC (pass 4). The timing string said 64 minutes with
--    starter 5; the slides sum to 66 with starter 8. A teacher planning a
--    period from the string would be two minutes short and would meet the
--    difference mid lesson. The new string matches the slides exactly and
--    names the flex for a 55 minute period, because honest arithmetic
--    with a named flex beats optimistic arithmetic every time.
-- 2. COMMITMENT STEM (pass 12). teacher_notes.commitment_stem was null,
--    so the printed exit card fell back to the generic stem instead of
--    the mission Orbit actually sets on the closing video (run the checks
--    on one thing in your own feed). Now the card and the video say the
--    same thing.
-- 3. STATUTORY EDITION (pass 3). statutory_hooks, the DSL note and the
--    evidence anchor said KCSIE 2025. KCSIE 2026 is the edition in force
--    this term and the scheme's canon (migration 262, the mapping matrix)
--    already names it. The hook and note move to 2026; the evidence
--    anchor keeps the honest provenance (the content risk expansion
--    arrived in 2025 and is retained in 2026).
--
-- Snapshot first, RLS on the backup, idempotent: every write overwrites
-- the same key with the same value on a rerun.

create table if not exists schools._backup_lesson_267 as
  select id, module_id, teacher_notes, dsl_note, statutory_hooks, evidence_anchor
  from schools.school_lessons
  where module_id = 'ks3-12-misinfo-deepfakes';

alter table schools._backup_lesson_267 enable row level security;

update schools.school_lessons
set
  teacher_notes = teacher_notes || jsonb_build_object(
    'timing', '66 minutes as scripted: starter 8, teach cycles 29 with the half time pause, spread race 4, paper practice 15, exit checks 4, close 6. To fit a 55 minute period: run one discussion instead of two, and give paper practice 10 with items five and six as homework.',
    'commitment_stem', 'My commitment: this week I will run the three checks on one thing in my own feed before I share it, starting with...'
  ),
  dsl_note = dsl_note || jsonb_build_object(
    'note', 'KCSIE 2026 keeps misinformation, disinformation and conspiracy theories named as content harms. A pupil may disclose distress about something they have seen or shared. Follow your school safeguarding policy and record in your school system. This platform does not record disclosures.'
  ),
  statutory_hooks = array_replace(statutory_hooks, 'KCSIE 2025 content risks', 'KCSIE 2026 content risks'),
  evidence_anchor = 'KCSIE content risk expansion (2025, retained in KCSIE 2026); Orben 2025 review'
where module_id = 'ks3-12-misinfo-deepfakes';
