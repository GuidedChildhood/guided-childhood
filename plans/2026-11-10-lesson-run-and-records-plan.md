# The lesson run and the school's record (10 November 2026)

Justin, 10 November 2026: "a one click button flow from start to finish for each lesson,
including prep and what they need to do to teach, scripts step by step, a turn key
solution, and how it records." And the question the pilot teacher's head asked: how do we
record progress and how children are learning, the level progression, given the
curriculum has a fixed progression. "Build that in really simply to all the school
platform, automated as much as possible, but instructing step by step."

This is the first build of `plans/2026-11-09-one-click-tracking-spec.md` (approved 9
November), widened to cover French, with the head's question answered inside it.

## The outside advice, weighed (feedback filter)

The head saw the French scheme on its own site and has not seen the digital Hub.

| Point | Their words | Verdict | Objective it serves | Size |
|---|---|---|---|---|
| Record what was taught | "how to record progress" | **Adopt.** Already specified and approved on 9 November: one delivery record per lesson, per class, saved for the school | Schools as distribution: a head signs for a scheme that evidences itself | Medium |
| Record how children are doing against the fixed progression | "how children are learning the level progression" | **Adapt.** A count of pupils at each level for each statement, per class. Never a named pupil. The French scheme already reports "the share of pupils at SOLO 4 or above", so this is its own measure, kept | Same, and it holds the "no pupil data, ever" position the DPA is written on | Medium |
| One guided run per lesson, prep to record | Justin: "one click flow from start to finish" | **Already built for digital** (`/lesson/[module]/run`, the nine step tracker). **Missing for French.** Build the French run; make the digital one end in the same record | A teacher who is not a linguist can teach it; a head can see it was taught | Medium |
| Scripts step by step | Justin | **Already built for digital** (presenter notes and the run sheet, from the lesson row). **Adapt for French:** the steps come from her own plan (sequence, main task, what to look for). No teacher script is invented for her lessons; if she writes them they arrive through the sync | Evidence or silence: we do not put words in her scheme | Small |
| Roles for admin and teachers | "how all admin teachers need to do records" | **Park.** Roles need accounts. Decision B (9 November) stands: anyone with the school's code sees the record | Waits for accounts | Large |

Conflict checked: none with the 9 November decisions. The only new thing is level counts,
which is the spec's `objective_marks` used for French.

## What gets built in this PR

1. **One table for both subjects.** `schools.lesson_records` and the append only
   `schools.lesson_record_events` (migration 391). A row says: this school taught this
   lesson to these classes on this date, and optionally how they did. `subject` is
   `digital` or `fr`. No framework credits are stored; everything else is worked out when
   a page is read.
   - Two changes from the spec, both smaller: the lesson version is hashed in the server
     action when the row is written, so there is no trigger on `school_lessons`; and the
     school's pseudonym is 32 characters, not the share link's 8, because two schools
     sharing a record would be a leak and 8 is short enough for that to happen one day.
   - `lesson_type` waits for the first assembly or workshop row to exist.
2. **`shared/lesson-records.ts`**: the rules with no imports (academic year, class names,
   level counts, the summaries), so a guard can run them under plain node.
3. **`schools/lib/records.ts` and `schools/app/records/actions.ts`**: the school is always
   read from the signed cookie on the server. The browser never sends a school.
4. **The French lesson page becomes the run**: three numbered steps on one page.
   - **Get ready**: what to print (each version), the words, what is assessed today and
     what to look for, the plan to print.
   - **Teach**: the board, the order of the slides, the main task, the song.
   - **Record**: one button, "Mark lesson delivered". The class is remembered on the
     device. On a lesson that assesses a statement, the count of pupils at SOLO 3, 4 and 5,
     copied from the What I can do sheet. Optional, and "not assessed" is never shown as a
     score.
5. **`/languages/fr/progress`** in Plan and assess: for each class, how far through each
   half term it is, and for each statement the share at SOLO 4 or above. Prints for the
   head. This is the answer to the head's question.
6. **The digital run sheet ends in the same button**, with the class judgement (secure,
   developing, needs revisiting) and the judgement by objective.
7. **DPA and privacy wording** change in the same PR. Justin reads them before it merges
   (decision E).

Not in this PR (the spec's later PRs): `/hub/tracker` reading the server record, the seven
reports and CSV, corrections with reasons from the tracker, the retention job.

## The one thing for Justin to confirm

Level counts per class with no names (built), rather than a record per pupil. A record per
pupil needs pupil data, accounts and a different legal footing. Recommendation: counts.

## Checks

Typecheck; a guard for the pure rules (`scripts/check-lesson-records.mjs`); Playwright at
390 and 1440 with two made up codes against a local stand in for the database: one tap
records, undo removes, levels save, progress shows it, a second school sees nothing.

## What schools are actually expected to do (researched and verified, 10 November 2026)

Justin asked whether this is what schools, trusts and the government curriculum now expect,
and whether it ticks every box. The honest answer is **most, not all**, and one thing we
must never say. Fourteen findings were checked against the primary source by a second,
adversarial pass: 12 confirmed, 2 corrected, none thrown out.

### What it does meet

| Expectation | Source | How the record meets it |
|---|---|---|
| Assessment is used "to check understanding and make changes to teaching and/or the curriculum" | Ofsted school inspection toolkit, in use from September 2026, page 25 | A statement marked low, or a lesson marked "needs revisiting", is the prompt to reteach. That is its job |
| The RSE policy should "describe how the subject is monitored and evaluated" | DfE RSHE statutory guidance, in force 1 September 2026, paragraph 14 | The delivery record is the monitoring: which lesson, which class, when |
| Governors "should ensure that children are taught about how to keep themselves and others safe, including online" | Keeping children safe in education 2026, paragraph 158 | The record is evidence for governors that it was taught |
| Primary languages: "15% make no assessment of their pupils' language learning and keep no record of progress" | Ofsted languages research review, 7 June 2021 | A school using this is not in that 15%. Ofsted wants assessment tied to a sequenced curriculum, which is what the fixed six half terms are |
| Collect only what is needed | UK GDPR Article 5(1)(c); DfE edtech procurement guidance, 9 July 2026 | A class and a count, no names |
| Workload: no more than two or three attainment collections a year unless they take no time outside lessons | Making data work, Teacher Workload Advisory Group, 2018, page 11 (advisory) | The level count is optional and is done in the lesson, from a sheet the class already filled in |

### What we must never claim

- **Never "Ofsted ready" or "what Ofsted expects to see".** The toolkit says: "Inspectors
  will not review internal data." Ofsted also lists "performance and pupil-tracking
  information" among the things a school need not provide, and prefers no method of
  planning, teaching or assessment. The printout helps a subject lead explain their
  decisions. It is not inspection evidence.
- **Never "a legal requirement".** No source requires a coverage record. Academies are not
  yet bound by the national curriculum at all; the duty is intended to start with the
  revised curriculum in September 2028.
- **Never "expected level" as if it were national.** There is no statutory assessment in
  KS2 languages and the Curriculum and Assessment Review reported that "substantial
  progress in one language" is unclear. SOLO 3, 4 and 5 are the scheme's own levels, and
  the pages say so.
- **Never a claim about what trusts require.** There is no good published evidence.

### Where a class record does not tick the box (told to Justin plainly)

| Gap | Why | What to do |
|---|---|---|
| The annual report to parents | Maintained schools must report on each pupil in every subject (Education (Pupil Information) (England) Regulations 2005, Schedule 1). A class count writes nobody's report | The What I can do sheet in each book already holds the pupil's level. Say so on the progress page rather than pretend otherwise |
| Which pupils need support | RSHE guidance, paragraph 50: assessments "should identify where pupils need extra support or intervention". A count shows how many, not who | The teacher knows who from the sheet. A named record would need pupil data, accounts and a new legal footing: Justin's decision |
| Disadvantaged pupils and pupils with SEND | Inspectors "take particular care" over these groups. A class total hides them | Same decision |
| Year 6 to Year 7 | Nothing about a child passes to secondary | A class transition summary is a later build (idea 8 in the French plan) |
| The statements will move | The government accepted the Review: core content for French, German and Spanish, final curriculum spring 2027, first teaching September 2028 | Already safe: the statements are data from the scheme, not code |

Could not be verified, so not relied on: an Ofsted languages subject report after 2021, ICO
guidance on small counts, and any evidence on trust tracking requirements.
