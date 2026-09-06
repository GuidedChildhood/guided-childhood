# The perfect lessons wave, 6 September 2026

Justin asked "Do we now have the perfect lessons?" and the honest answer was
not yet, with the gap named in six lines. He answered "All step by step",
which means: work the remaining queue in order until the gap is closed.
Lane: schools curriculum content (this session's lane). Branch:
claude/lesson-3-5-deep-dive-4mzjyp. Sources: research/2026-09-05-master-audit.md
Report 14 items 8, 9, 10 and the P2 gold standard; the eyfs-01 completeness
checklist artifact.

## Migration numbers claimed here

Main's ledger ends at 264 (unapplied, the other lane's, applies on Justin's
word). This wave claims, and names in the draft PR at claim time:

- **265** learning record: teacher_notes.i_can for the 20 modules without it
- **266** completeness: teacher_notes.send per module, ailit_domains to
  21/21, parent_note.passport to 21/21
- **267** gold standard: ks3-12 script and slide deepening after the
  15 pass QA

## Step 1. The learning record to 21 of 21 (migration 265)

The shape is migration 200's: three statements, always three, child
language, always starting "I can", written as a ladder (notice, then act,
then explain to someone else), never three ways of saying the same thing.
Each module's ladder is written from its own tool, worksheet and single
action outcome so the sheet matches what was actually taught. The print
route already renders any module with the array, and the teach page
already shows the button when it is present, so this is data work only.
Verify: /print/<module>/record renders for all 21, no code change needed.

## Step 2. CPD briefings for the flagged five + the induction page

Ten modules are safeguarding flagged (dsl_note.required plus the static
dsl flags): M02, M07, M08, M10, M11, M12, M14, M16, M17, M18. Briefings
exist for M08, M14, M16, M17, M18. This step writes the missing five (M02,
M07, M10, M11, M12) in the exact house shape (covers, register, watchFor,
disclosure, line) into schools/app/hub/cpd/page.tsx, and updates the FAQ
line that honestly said "with the rest on the way".

Then the fifteen minute staff induction page the audit named (Report 9):
/hub/induction, one page a head can run as a staff meeting before the
scheme starts: what the programme is, how a lesson runs, the scripts
promise, the print room, the flagged modules and their briefings, the no
pupil data ground rule, and where the DSL crosswalk lives. Linked from the
hub card grid.

## Step 3. SEND adaptations and the data backfills (migration 266)

- **teacher_notes.send**: per module, specific and practical, in the
  differentiation idiom but named for the graduated approach: three keys,
  communication (speech, language and communication needs), attention
  (ADHD and executive function), sensory (autism and sensory regulation),
  plus eal (English as an additional language). Written from each module's
  own activities, not generic advice. Rendered on the teach page beside
  Support and Stretch.
- **ailit_domains**: currently 7 of 21. Tag the remaining 14 with the
  honest domains their content earns (Engage, Create, Manage, Design), no
  inflation: a module that only brushes AI gets one tag or none earned by
  an actual slide.
- **parent_note.passport**: the eyfs-01 paragraph pattern, rewritten per
  key stage register, to 21 of 21.

## Step 4. The gold standard exemplar: ks3-12 (migration 267)

The brief's own definition of perfect: ONE lesson taken to gold standard
first, never mass produced mediocrity. ks3-12 because it is the most
statutory named ground (RSHE 2026 and KCSIE 2026 both name deepfakes) and
the weakest scripted (about 225 characters of differentiation, thinnest
scripts). Deepen every slide script to teaching depth (the register held,
misconception handling inline, questions with expected answers), then run
the 15 pass QA from the master brief and score it; ship only at 90 or
above, and record the passes and score in the migration header and
decisions.md.

## Rules that hold

Backup table per migration, RLS enabled, idempotent. No dashes anywhere in
copy. Nothing claims what does not exist. Wiring check, tsc and the
Playwright pass at 390 and 1280 on every touched page before ready.
Migrations applied to production only after the diff is complete and
verified, in ledger order, then verified by read back.
