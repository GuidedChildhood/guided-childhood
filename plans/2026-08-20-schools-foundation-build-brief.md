# Schools foundation build brief: SEL mapping, implementation guide, drop in, primary lessons

Written 20 August 2026. The remaining schools side work from the Common Sense review
(plans/2026-08-19-common-sense-curriculum-review.md) and the foundation scaffold
(plans/2026-08-20-foundation-scaffold-and-cs-borrows.md). Written as a brief the schools session
builds into public.school_lessons and the schools app, so it lands in the right place and does not
collide with the parent app. No dashes. Every claim carries a framework anchor (the road to 16 rule).

Scope of this doc, four parts:
1. The SEL and CASEL mapping (a finished reference).
2. The primary implementation guide (a finished one page for a head or PSHE lead).
3. The 20 minute drop in spec (a format to add to existing decks).
4. The scaffold overlay on the primary module map (Section 5 of the build spec, ready to author).

The scaffold across all of it is Notice, Choose, Tell (already tagged on parent_lessons in migration
221 and school_lessons in migration 220).

---

## 1. SEL AND CASEL MAPPING (finished reference)

Why: the review found Common Sense maps to CASEL, which widens the schools buyer, especially SEL led
and international schools. We already map to UKCIS Education for a Connected World (EFCW) and
statutory RSHE. This adds the CASEL competency layer on top, it does not replace the EFCW mapping in
the school_lessons.efcw_strands column.

CASEL five competencies: Self awareness, Self management, Social awareness, Relationship skills,
Responsible decision making.

### The scaffold to CASEL (the clean bridge)
- NOTICE maps to Self awareness and Social awareness. Noticing what the machine is doing, noticing
  your own feelings on a screen, noticing there is a real person on the other side.
- CHOOSE maps to Self management and Responsible decision making. Bringing the stop, balance, saying
  no, choosing before you share or press.
- TELL maps to Relationship skills and Responsible decision making. Asking a trusted adult, seeking
  help, reporting, repair.

### The 15 KS3 (13+) modules to CASEL (for the existing school lessons)
Primary CASEL competency per module, using the scaffold tag from migration 220.

| Module | Scaffold | Primary CASEL competency |
|---|---|---|
| 01 how the machine works | NOTICE | Self awareness |
| 02 the deal you signed | NOTICE | Responsible decision making |
| 03 locking your doors | CHOOSE | Self management |
| 04 the highlight reel | NOTICE | Self awareness |
| 05 bodies and filters | NOTICE | Self awareness |
| 06 influencers and the sell | NOTICE | Responsible decision making |
| 07 how people treat each other | TELL | Relationship skills |
| 08 strangers, dms and grooming | TELL | Relationship skills |
| 09 nudes, the law and sextortion | TELL | Responsible decision making |
| 10 rabbit holes and radicalisation | NOTICE | Social awareness |
| 11 the inner life | CHOOSE | Self awareness |
| 12 sleep, attention and the body | CHOOSE | Self management |
| 13 the good side held honestly | CHOOSE | Social awareness |
| 14 taking the wheel | CHOOSE | Self management |
| 15 ai companions and chatbots | NOTICE | Responsible decision making |

How to land it: add a nullable casel_competency text column to school_lessons in a new migration
(claim the next free number, currently 221 is the highest so 222), populate by module_id, and surface
it on the curriculum page filter next to the EFCW strands. Non destructive, mirrors 220.

---

## 2. PRIMARY IMPLEMENTATION GUIDE (finished, one page for a head or PSHE lead)

The thing Common Sense has and we do not. A scope and sequence and a roll out a leader can act on in a
minute. Lives as a page in the schools app (a printable and a screen), sourced from the ladder.

**Guided Childhood for primary, in one page.**

- What it is. A digital literacy pathway for Reception to Year 6, taught by the DiGi Squad, mapped to
  all eight Education for a Connected World strands and to RSHE. Every lesson has one child facing
  idea and one thing they can do, held together by three words the whole school shares: Notice,
  Choose, Tell.
- The three words. NOTICE what the screen is doing. CHOOSE the stop yourself. TELL a trusted adult,
  and you will not be in trouble. From Reception to Year 6 the same three words, deeper each year.
- Scope and sequence. One short lesson per half term per year group, six a year, plus a start of year
  assembly on the three words. The cast is the SCHOOLS cast from the build spec Section 9.4, not the
  parent app Planet Friends: EYFS and KS1 are Sofia with DiGi Junior, KS2 is Oliver, Zara and Sofia
  as the squad proper, DiGi anchors throughout.
- How to run it. Twenty minutes, drops into a PSHE or computing slot, tutor time or assembly. No prep,
  no download wall, no booking. A teacher opens a module and teaches it today.
- Safeguarding fit. Aligns to the school's statutory online safety duty (KCSIE) and RSHE. Each lesson
  carries a DSL note flagging what to watch for and where a disclosure goes. The scaffold's TELL is
  the reporting route made child sized.
- The home link. A one page family agreement per age band goes home, built on the same three words,
  so school and home say the same thing. This is the parent product's on ramp, and the schools
  distribution multiplier (one primary is roughly 268 families, DfE census).
- The evidence. Framework anchored throughout: EFCW, RSHE, Rosenshine lesson design, Day of AI and
  UNESCO for the AI seeds, CASEL for the SEL mapping.

Roll out in three steps: assembly on the three words in week one, then one lesson per year group per
half term, then the family agreement home before the winter break.

---

## 3. THE 20 MINUTE DROP IN SPEC

Add a short version to every young lesson, the format the market now expects. Same school_lessons row,
a shorter slides array flagged as the drop in.

Shape, five beats, about 20 minutes:
1. The three words recall, 2 minutes. Which word is today, Notice, Choose or Tell.
2. One idea, 5 minutes. The single knowledge intention, one Planet Friend, one worked example.
3. Try it, 6 minutes. The one activity, the single_action_outcome made real.
4. Quick check, 4 minutes. Two or three choice questions, high success, warm feedback, never a red X.
5. Catchphrase and the word, 3 minutes. Say the catchphrase, name the scaffold word, DiGi handoff.

Implementation: a slides_short jsonb column on school_lessons, or a boolean drop_in flag on a second
lighter lessons row. The schools session picks the cleaner one. This is a schema plus authoring job,
not covered by the migrations already merged.

---

## 4. THE SCAFFOLD OVERLAY ON THE PRIMARY MODULE MAP (not a parallel set)

Correction from the first draft, made when this was synced to the schools session's source of truth,
plans/schools-lesson-build-spec.md. The primary modules are NOT invented here. Section 5 of that spec
already maps the primary scheme: EYFS module 1, KS1 modules 2 and 3, KS2 modules 4 to 9. So this part
does not create a parallel ks1-01 set. It overlays the Notice, Choose, Tell word and the CASEL
competency onto the modules the spec already owns, and asks the schools session to author those rows.
The cast is the schools cast from Section 9.4 (Sofia, DiGi Junior, Oliver, Zara), never the parent app
Planet Friends. This overlay is now written into the spec at Section 5, so it lands in the right place.

### The overlay, module by module (Section 5 numbering)

| Spec module | Stage | Cast (9.4) | Scaffold | Primary CASEL |
|---|---|---|---|---|
| 1 Screens and kindness / real vs not real | EYFS | Sofia, DiGi Junior | NOTICE | Self awareness |
| 2 Kind screens, calm bodies | KS1 | Sofia | TELL | Relationship skills |
| 3 Real, pretend, or made by a computer | KS1 | Zara junior, DiGi Junior | NOTICE | Responsible decision making |
| 4 Screen routines that work | KS2 | Oliver | CHOOSE | Self management |
| 5 Gaming: time, intensity and spend | KS2 | Oliver | NOTICE | Responsible decision making |
| 6 How algorithms work | KS2 | DiGi | NOTICE | Social awareness |
| 7 Privacy and digital reputation | KS2 | Sofia | CHOOSE | Responsible decision making |
| 8 Being kind and safe with others online | KS2 | Sofia, Zara | TELL | Relationship skills |
| 9 My work and other people's work | KS2 | Zara | NOTICE | Social awareness |

Every module keeps its existing EfCW strands, statutory hook, evidence anchor and single action
outcome from Section 5. This overlay adds only two data points per module: the scaffold word and the
primary CASEL competency, exactly the two nullable columns proposed (scaffold, already on the table
via migration 220 for the 13+ set, and casel_competency, proposed in part 1).

### One reconciliation the schools session owns
The 13+ rows already seeded and tagged (school_lessons, migrations 109 to 112 and 220) use sm13 module
ids. The build spec Section 5 uses a 1 to 21 numbering with partly different KS3 and KS4 topics. That
is a pre existing tension inside the schools scheme, not something this brief resolves. Flagging it so
the schools session reconciles the two id schemes before authoring the primary rows, rather than
inheriting the mismatch.

### Build order and definition of done
1. Reconcile the sm13 ids with the Section 5 1 to 21 map (schools session decision).
2. Author EYFS then KS1 then KS2 as public.school_lessons rows (audience teacher), each with full
   slides to the 017 contract, the Section 9.4 cast host, DiGi closing, assessment jsonb and dsl_note.
   No dashes, never allow or deny, wrong answers get warm feedback.
3. Tag each row with its scaffold word and CASEL competency per the overlay above.
4. Add the 20 minute drop in version (part 3) as each is authored.
5. Surface on the schools /curriculum page, so the pilot count rises from the 13+ set to the full
   Reception to Year 6 pathway.

## What is needed from a human
- A yes to the scaffold word and CASEL competency per module in the overlay above, then the schools
  session authors the rows.
- The CASEL surfacing decision (filter on the curriculum page, or just data) for part 1.
- A yes on which id scheme wins, sm13 or the Section 5 1 to 21 map, so the primary rows are numbered
  once and correctly.
