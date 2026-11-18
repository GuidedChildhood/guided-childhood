# The digital curriculum against Oak, Jigsaw, White Rose and Common Sense (18 November 2026)

Justin, 18 November 2026: "review this curriculum, that it has everything needed and a simple
way of teaching that is engaging, as good as Oak Academy, Jigsaw, White Rose, and Common Sense:
animations, use of characters, goal of a full curriculum, top digital syllabus based on Ofsted
and government requirements in industry."

Read only. Nothing was edited. This builds on three earlier passes and does not repeat them:
the competitor review of 15 November (scratchpad `review-competitors.md`), the French teacher's
pupil sites review (`review-kidsites.md`), and `plans/2026-11-11-progression-and-assessment-review.md`,
whose amendments 1 to 7 are now live (descriptors on all 37 lessons, the 21 lesson musts, a year
for every lesson, quiz counts, the leader's coverage page, the look back quiz, one record).
Every competitor point went through the feedback filter: an input, never an instruction.

The bar for a must is the one CLAUDE.md sets for a term review: only what a head, subject lead
or inspector would actually mark down, or a real gap against statutory guidance.

## What the scheme is today, in numbers read from the files

| Fact | Value | Where |
|---|---|---|
| Lessons | 34 in the scheme (plus 3 standalone), Reception to Year 13 | `shared/schools-curriculum.ts`, `content/modules/` |
| Lessons a year group | 1 to 4, most years 2 or 3 (Year 12 and Year 13 have one each) | `shared/schools-progression.ts` SUGGESTED_YEAR |
| Scripted length | 42 to 75 minutes, median 67, with a computed short route | slide minutes; `schools/app/lesson/[module]/run/page.tsx` |
| Statutory RSHE rows | 57 (24 primary, 34 secondary), all FULL, each held to phrases in live slides | `shared/schools-rshe-2026.ts`, `scripts/check-rshe-coverage.mjs` |
| KCSIE 2026 crosswalk | 36 of the 57 name a KCSIE paragraph | same file |
| EfCW strands | all eight taught, the thinnest Copyright (4 lessons) and Reputation (5) | `row.efcw_strands` in each module |
| Quizzes | starter 4 questions, exit 4 to 6, on paper with answers; three descriptor lines per lesson | `teacher_notes`, `assessment.teacher_judgement` |
| SEND and EAL notes | SEND on 34 of 34, EAL by name on 30 | `teacher_notes.send` |
| Subject knowledge note | 14 of 34 (unchanged since 11 November) | `teacher_notes.subject_knowledge` |
| Staff briefings | 17 modules | `schools/app/hub/cpd/page.tsx` |
| Video in the lesson | 10 video slides in 5 of 34 lessons | slide type `video` |
| DSL flagged lessons | 18 | `dsl: true` in the manifest |

## What the benchmarks do (primary sources, opened 18 November 2026 unless noted)

- **Oak National Academy.** Free. Each RSHE lesson: one outcome, 5 key learning points, 5 keywords,
  one named misconception, content guidance, slides in learning cycles, a worksheet, a 6 question
  starter and 6 question exit quiz, a planning video with transcript, an online pupil version.
  No SEND specific adaptation on the page beyond "adapt to your pupils".
  https://www.thenational.academy/teachers/programmes/rshe-pshe-primary-ks2/units/our-online-lives-how-do-i-thrive-online/lessons/dangers-to-watch-out-for-in-the-online-space
- **Jigsaw PSHE.** A character per year group plus a whole school one, a chime and a Calm Me
  pause every lesson, six Puzzles a year with working towards, at and beyond descriptors, a paper
  tracking grid, a mapping to the PSHE Association SEND framework (from the 15 November review,
  partly via school published documents; Jigsaw's own assessment page returned 404).
- **White Rose.** Every block broken into small steps, each with key learning, exemplar questions
  and a short video modelling it; mixed age versions where each step is met twice; a free
  progression and curriculum mapping. https://assets.whiteroseeducation.com/Content/new-schemes/wrm-new-sol-sample.pdf
  (and school published copies of its small steps documents).
- **Common Sense Education.** The old Digital Citizenship curriculum (6 topics, 3 to 7 lessons a
  grade, six cartoon characters and an intro song for K to 2) is being archived in December 2026.
  https://www.commonsense.org/education/digital-citizenship/curriculum . Its replacement, Digital
  Literacy and Well-Being: "170+ K to 12 lessons", about 20 minutes for K to 8 and 40 for 9 to 12,
  the same six topics plus AI literacy, deepfakes, consent, gambling, family tips and workshops,
  free. No assessment described. https://www.commonsense.org/education/digital-literacy/about
- **ProjectEVOLVE / Education for a Connected World.** Eight strands, age statements EY to 18,
  Knowledge Maps that place a class on a scale before and after. https://projectevolve.co.uk/toolkit/ ,
  https://www.gov.uk/government/publications/education-for-a-connected-world
- **DfE RSHE statutory guidance**, July 2025, in force 1 September 2026 (gov.uk updated it that day).
  https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education
- **Computing national curriculum**, the safety and literacy statement at every key stage.
  https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study
- **Ofsted computing research review (2022).** "establish a carefully sequenced curriculum for
  e-safety that builds on what pupils have already learned"; "the digital native is a fallacy";
  pupils "may lack basic digital literacy skills".
  https://www.gov.uk/government/publications/research-review-series-computing/research-review-series-computing
  Ofsted has not published a PSHE research review in that series as far as I could find, so the
  PSHE lens is the 2026 inspection toolkit lines already quoted in the 11 November review.
- **KCSIE 2026.** I could not open the statutory text today; commentary (SWGfL, Computing at
  School) says it pushes AI, deepfakes and image sharing into the online safety curriculum.
  https://swgfl.org.uk/magazine/keeping-children-safe-in-education-2026-what-do-schools-need-to-know/
  Treat that as unverified until the paragraphs are opened.

## 1. Scores out of ten

| Dimension | Score | Best of the benchmarks | Where we stand, and the evidence |
|---|---|---|---|
| Statutory coverage | **8** | Oak (states alignment to the 2026 guidance); ProjectEVOLVE (EfCW) | Ahead on proof: 57 requirements quoted verbatim and guarded in CI, 36 with a KCSIE paragraph, all eight EfCW strands, every computing safety statement mapped (`shared/schools-rshe-2026.ts`, `shared/schools-computing-pos.ts`, `/hub/rshe-mapping`, `/hub/computing-mapping`). Marked down for one false gap on our own map (must 1), Reception mapped to nothing statutory (EYFS is not RSHE), and the KS2 "use search effectively" clause left untaught |
| Sequencing and progression | **7** | White Rose small steps; Common Sense 6 topics at every grade | A year for every lesson, a builds on chain held by `scripts/check-progression.mjs`, a year plan with end of year statements (`/hub/year-plan`, `/hub/progression`). Thin per year: 2 or 3 lessons, one each in Years 12 and 13, so each statutory item is usually met once in a key stage, and revisiting rests on the starter and the look back quiz. Secondary lessons assume our own primary lessons (must 3). KS3 still opens on harassment and KS4 on unwanted content: Justin's call, pending since 11 November. No mixed age cycle |
| Lesson simplicity for a non specialist | **8** | Oak: slides, worksheet, two quizzes, a misconception, a planning video | A script and minutes on every slide, run sheet, computed short route, paper fallback, misconceptions, hard questions with answers (`content/modules/*/teacher_notes`, `/lesson/[module]/run`). No rival has a script per slide. Held back by length (median 67 minutes; Common Sense K to 8 runs 20) and by 11 lessons with neither a subject knowledge note nor a staff briefing (must 2) |
| Engagement: characters and animation | **6.5** | Jigsaw (puppet, chime, pause, every lesson); Common Sense K to 2 (characters and a song) | One cast for ages 4 to 18, each friend owning a strand and a register (`digi-squad/README.md`), three mood stills that change on a right answer (`shared/components/FriendPlate.tsx`), GSAP motion that respects reduced motion, a character pause in every lesson, DiGi's mission and a passport stamp at every close. Held back: the speaking intro for every lesson, decided 22 September, has not landed (video in 5 of 34 lessons); EYFS and KS1 lessons have one mid lesson character moment, where the youngest need most; interactives beyond the pause and the stamp number about thirty across the scheme; Cosmo still does not speak at KS5 |
| Assessment and evidence | **7.5** | Oak 6 plus 6 quizzes; Jigsaw three point descriptors; ProjectEVOLVE before and after | Starter and exit quizzes, three descriptor lines on every lesson, quiz counts beside the judgement, an end of term look back quiz, a pupil learning record of "I can" statements, a commitment revisited next lesson (`/print/[module]/record`, `/print/look-back`). Per pupil tracking is absent by design; pupil self assessment exists only on paper |
| SEND and EAL | **6.5** | Jigsaw's SEND framework mapping; the French plus site's one switch scaffold | SEND notes on all 34 (EAL, sensory, attention, communication on most), keyboard, screen reader announcements, read aloud, reduced motion, paper fallback (`/hub/accessibility`). Our own statement says adapted printable sheets are still to come; no scaffolded version of a slide; no SEND framework mapping; parent notes are English only |
| Teacher workload and recording | **8.5** | Kapow and Jigsaw: spreadsheets and paper grids | One tap record per class with no pupil names, every class grid, last year, one spreadsheet (`/hub/progress`, `/hub/progress/export`). Nobody in the benchmark set records faster. Lessons are long to plan around, which the short route answers |
| Leader oversight | **8.5** | Kapow deep dive toolkit (paper); ProjectEVOLVE quiz dashboard | Coverage joined to the record ("started", never "covered" until taught), deep dive questions with where the answer is, pupil voice, staff confidence audit, intent and impact framing, policy, DSL, AI governance, data protection (`/hub/coverage`, `/hub/subject-lead`). Marked down only for the false gap in must 1, which a leader would print |

Overall, about 7.5. Against the four Justin named, on these lines: ahead of Oak and Common Sense
on recording, oversight and proof of coverage; level with Jigsaw on assessment; behind Jigsaw and
Common Sense on the felt experience of a character in the room for the youngest, and behind
White Rose and Common Sense on breadth inside each year.

## 2. MUST (three, all would be marked down)

| # | What | Why a reader would mark it down | Exact surface | Size |
|---|---|---|---|---|
| 1 | **Correct the KS1 computing claim.** `CPOS-KS1-6` is PARTIAL, saying "Keeping personal information private is taught at KS2 (ks2-07) and not yet at KS1". ks1-32 *Private like a toothbrush* (Year 2) teaches the four things that stay private online and asking before you share. Make it FULL with ks1-32 named and its evidence phrases added | A head or computing lead reading our own map sees a statutory KS1 gap that does not exist, and our coverage page repeats it | `shared/schools-computing-pos.ts` (row and its evidence), checked by `scripts/check-computing-coverage.mjs`; renders on `/hub/computing-mapping` and `/hub/coverage` | Small |
| 2 | **Subject knowledge for the 11 lessons that have neither a note nor a briefing**: eyfs-01, ks1-03, ks2-04, ks2-05, ks2-06, ks2-09, ks3-13, ks4-15, ks4-19, ks5-20, ks5-21. A short note in the 14 lessons' existing pattern, from each lesson's own evidence base | Ofsted's computing review wants e-safety taught by staff with their own subject knowledge, and a deep dive asks a teacher exactly this. The 11 November review scored it 5 and named this as the alternative to CPD videos; it has not moved | `teacher_notes.subject_knowledge` in those 11 `content/modules/*.json` files, through a guarded migration like 393 and 394; shows on the lesson prep page | Medium |
| 3 | **Year 7 entry for a secondary buying KS3 alone.** Either the one Year 7 bridge lesson decided on 22 September, or one line per KS3 lesson's prior knowledge saying what to do when the intake has not had the primary lesson it names (ks3-10, ks3-12, ks3-14, ks3-22 and others assume ks2-06, ks1-03, ks2-23 by id) | "Builds on what pupils have already learned" and "the digital native is a fallacy" (Ofsted computing review). A secondary lead would find lessons that assume a primary scheme their feeder schools did not teach | `content/modules/ks3-*.json` `teacher_notes.prior_knowledge` and, for the bridge, a new module in `shared/schools-curriculum.ts` plus its row | Medium (lines) or Large (bridge) |

Nothing else reaches the bar. Coverage is real and guarded, assessment is now in line with the
best, and oversight is ahead.

## 3. SHOULD

| What | Exact surface | Size |
|---|---|---|
| The speaking friend intro on every lesson (decided 22 September), Reception and KS1 first, where a character carries the room most | the `video` slide at position 2 in each `content/modules/*.json`; `plans/2026-09-22-animation-and-mini-series-plan.md`; credits | Large |
| A second character moment in each EYFS and KS1 lesson: the friend hosts one choice activity and reacts to the answer (the host and reaction pair from the kidsites review), so the youngest meet Pebble mid lesson more than once | choice and interactive slides in the 7 EYFS and KS1 modules; `FriendPlate` already supports the moods | Medium |
| One scaffold switch, not a second product: two choices instead of three, the first step given, bigger targets, same look, on choice slides and on the printed sheet (closes the gap our own accessibility page names) | `shared/components/LessonPlayer.tsx` choice rendering, `/print/[module]`, `/hub/accessibility` copy | Medium |
| Map Reception to the EYFS statutory framework (PSED: self regulation, managing self, building relationships), since RSHE starts at Year 1 | a short block on `/hub/progression` or `/hub/rshe-mapping` for the 3 EYFS lessons | Small |
| Say plainly what we are: the digital strand a school adds to its PSHE and computing schemes, 2 or 3 lessons a year, about 2 to 3.5 hours (Common Sense K to 8 is roughly 4 to 6 hours of 20 minute lessons). The 11 November review asked for this on pricing and it is on no page | pricing page and `/hub` intro | Small |
| A two year rolling programme view for mixed age primaries, computed from SUGGESTED_YEAR (every lesson already stands alone) | `/hub/year-plan` | Small |
| Justin's call on the KS3 and KS4 openings (harassment first, unwanted content first), pending since 11 November | `shared/schools-progression.ts` order, if he moves them | Small |
| Write Cosmo into the two KS5 lessons, as the teacher test in `review.md` already lists as open work | `content/modules/ks5-20*.json`, `ks5-21*.json`; `plans/2026-09-14-cosmo-at-sixth-form-spec.md` | Medium |
| A SEND framework mapping like Jigsaw's, once the PSHE Association framework has been opened and read by us (not verified today) | `/hub/accessibility` | Small |
| Open the KCSIE 2026 online safety paragraphs and recheck the 36 crosswalk references against the published text | `scripts/gen-rshe-2026.py` `kcsie` column | Small |

Parked, with the reason: thirty six lessons a year and per pupil accounts (both decided against
on 11 November, still right: they make us a different product); the KS2 "use search effectively"
clause (a computing scheme's job, and our map already says so honestly).

## 4. What we already beat them on

- A script and minutes on every slide, a run sheet and a computed short route. Oak, Jigsaw and
  Common Sense give slides and notes, not words to say.
- Statutory claims proved in code: 57 RSHE requirements and every computing safety statement held
  to phrases in the live slides, with a KCSIE crosswalk. Nobody else shows the working.
- Recording a class in one tap with no pupil data, joined live to coverage. The others are
  spreadsheets, paper or quiz only dashboards.
- The home link: a parent note per lesson and a parents app behind it.
- Current content none of the four has as a sequence: AI companions at KS2 and KS3, staying the
  maker, the money and the odds, sextortion, readiness at sixteen in the ban world.
- One cast from 4 to 18 that ages with the pupil. Jigsaw's characters stop at 11 and Common
  Sense's at grade 2.
- Never in trouble for telling, and a calibrated pathway on every hard slide, with 18 lessons
  carrying a DSL note.
