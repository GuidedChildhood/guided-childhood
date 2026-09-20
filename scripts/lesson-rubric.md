# The lesson rubric

What every one of the 29 lessons is held to, check by check, each with its
source. Written 20 September 2026 from two research reports (the best UK
schemes lesson by lesson, and the evidence on projected slides and scripted
lessons) and from the instruments the scheme already runs. Justin's bar: "the
best presentation lessons a teacher has ever used", with the house rule that
nothing ships without a source.

**How it is used.** The review workflow (plans/week-of-2026-09-21-best-lessons-plan.md,
step 6) briefs one reviewer and one verifier per lesson with this file. The
MEASURABLE checks are run by scripts (named on each line) and are not the
reviewer's job. The JUDGEMENT checks are the reviewer's brief and the
verifier's grounds for rejection. The SCHEME checks need a new field, slide
type or surface and cannot be met by editing a slide; they are the list for
Justin.

**How a check is written.** An id; the test in one sentence, phrased so a
reader can say yes or no of one slide or one lesson; MEASURABLE (with the
script) or JUDGEMENT or SCHEME; the ages it applies to; confidence, STRONG
(replicated, meta analysed, or guidance with a clear evidence base), MODERATE,
THIN (one study, adults only, or contested) or FOLK (a popular rule with no
evidence behind it, kept only where it says so); the source.

**What it is not.** Not a score. The council (scripts/council.mjs) scores; the
ratchet gate refuses a regression. This file says what good is.

## A. The instruments already in force

MEASURABLE, and already enforced. Listed so a reviewer does not spend edits
on them and so their sources sit beside the new checks.

- **A1 · Words on the wall.** A slide's prose (title with body, heading with
  body, heading with caption) has at most 12 words for EYFS and KS1 and 105
  for KS2 to KS5. MEASURABLE, council check 2a (scripts/council-checks.mjs
  WORD_CEILING) and every review batch's server proof. All ages. Source: the
  12 is the decoding argument (a four to seven year old is learning to read;
  migration 276 showed every idea in the cut paragraphs was already in the
  script); the 105 was measured on the projector rather than chosen (decision
  of 9 September 2026, "the KS2 to KS5 ceiling, measured instead of asserted",
  plans/decisions-archive/2026-09.md). Confidence MODERATE: a house
  measurement, not a study.
- **A2 · Words per block.** Each thing a child reads to decide (a question, an
  option, a recap point, a keyword meaning, a diagram step) sits under the same
  ceiling on its own, never summed. MEASURABLE, council check 2b. All ages.
  Source: the same instrument; the split between prose and blocks is the
  redundancy argument (see B, the Mayer checks). Confidence MODERATE.
- **A3 · Nobody sits still for more than four minutes.** No run of slides
  without a choice, a discussion, a try it, an interactive, a scenario or a
  verdict exceeds four minutes. MEASURABLE, council check 2c and contract rule
  3 (scripts/check-module-contract.mjs). All ages. Source: "our judgement, not
  a standard" (the instrument's own words). Confidence THIN; see B for what
  the attention evidence does and does not say.
- **A4 · Every slide carries a script and a minute count, and the minutes add
  up.** Contract rules 2, 4 and 7. All ages. Source: the contract, written
  after three diagram slides shipped with no script.
- **A5 · No dashes in any copy.** No em dash, no en dash, no hyphen between two
  letters; identifiers excepted. Contract rule 5 and the review batch
  generator. Source: the house rule (CLAUDE.md non negotiable 4).
- **A6 · The friend's shape.** The title slide names a real friend; the friend
  arrives in the starter phase and hands over the mission in the close; the
  half time star breath is four seconds, the friend's, with a heading, the
  words and the key stage's register; the passport beat is present. Contract
  rules 8, 9, 12 and 13. Source: plans/character-appearances-plan.md.
- **A7 · The contract keys, the scaffold and the teacher notes shapes.**
  Contract rules 6, 10 and 11.
- **A8 · The attested phrases.** Every RSHE requirement the lesson is named on
  is held by a phrase in at least one of its lessons, and every computing
  statement by a phrase in every lesson it names. MEASURABLE, the two coverage
  guards (scripts/check-rshe-coverage.mjs, scripts/check-computing-coverage.mjs)
  and every batch's server proof; scripts/protected-phrases.mjs prints a
  lesson's list. Source: shared/schools-rshe-2026.ts and
  shared/schools-computing-pos.ts, each row citing its statutory text.

## B. The evidence checks

(Merged in from the slide and lesson design evidence report; see the section
of that name below once it lands. The section is written last so nothing here
is asserted ahead of its source.)

## C. What the best schemes do that we do not, yet

From the scheme by scheme report (research-best-schemes.md, 20 September
2026). Access note that governs every label here: the session's egress policy
blocked most vendor sites, so Oak National Academy, Common Sense Education
and the full Be Internet Legends curriculum pack were read directly
(OBSERVED), and everything else is the vendor's or a reviewer's words seen
through a search snippet (CLAIMED) or UNKNOWN. Nothing here was invented to
fill a gap.

Checks a slide edit can meet:

- **C1 · Feedback that says why, on every option.** Every option on every
  choice slide has feedback of at least twelve words that explains why that
  option is right or wrong; in the primary lessons wrong option feedback
  never opens with a bare "No" or "Wrong" (a fifteen year old is told no
  plainly, on purpose). MEASURABLE (scripts/check-lesson-rubric.mjs) and
  JUDGEMENT for whether the why is the real why. All ages. Source: no scheme
  read does this on a quiz; Oak marks the correct answer only (OBSERVED,
  https://www.thenational.academy/teachers/programmes/digital-literacy-primary-ks2/units/digital-wellbeing-stay-connected-happy-and-well-online/lessons/screen-time-and-healthy-habits);
  Digital Matters gives "a reaction screen to get immediate feedback on
  whether the choice was positive" after each story choice (CLAIMED,
  https://www.internetmatters.org/advice/apps-and-platforms/skills-building/digital-matters/).
  The evidence for feedback that explains is in B. Confidence STRONG for the
  principle, and it is already the house rule ("green, amber, one retry,
  always reveal why", decision of 11 September 2026).
- **C2 · A misconception, named and caught.** The teacher notes name at least
  one misconception with its response, and at least one choice slide's
  feedback or script names it. MEASURABLE (to add) and JUDGEMENT. All ages.
  Source: Oak's lesson details carry "a common misconception associated with
  every lesson" with the suggested response (OBSERVED,
  https://www.thenational.academy/blog/how-to-address-common-misconceptions-in-lessons);
  the NCCE lists "Challenge misconceptions" among its twelve pedagogy
  principles (CLAIMED, https://static.teachcomputing.org/pedagogy/Pedagogy-principles.pdf).
  Confidence MODERATE.
- **C3 · The lesson's tool has a name a child can say, and it recurs.** The
  teacher notes' tool is named on at least three slides including the recap,
  and the scaffold is one of Notice, Choose, Tell. MEASURABLE (to add). All
  ages. Source: Jigsaw's six part Piece, Kapow's "Recap and recall, Attention
  grabber, Main event, and Wrapping up", Common Sense's named thinking
  routines, repeated so that "we can support a disposition or habit of mind to
  think in those ways without having to ask" (OBSERVED, research backgrounder,
  https://www.commonsense.org/system/files/pdf/2021-08/common-sense-education-digital-citizenship-research-backgrounder.pdf).
  Confidence MODERATE.
- **C4 · Distance every scenario through a named fictional character, and let
  the character voice the struggle.** Every scenario and choice slide names a
  character or a handle; no scenario addresses the pupil as "you" about
  something that happened to them; the friend admits the mistake or the
  worry before the class is asked to. MEASURABLE for the naming (to add),
  JUDGEMENT for the voice. All ages, and the DfE guidance names it for the
  sensitive topics. Source: the PSHE Association, "stories, role-play,
  scenarios of real situations but with fictional characters and storylines"
  (CLAIMED, https://pshe-association.org.uk/guidance/ks1-5/handling-complex-issues-safely-classroom);
  Jigsaw's Friend as "a useful distancing technique" (CLAIMED,
  https://whp.greenheartlearning.org/wp-content/uploads/2024/06/The-Jigsaw-Approach.pdf);
  the DfE 2025 guidance's "distancing techniques" (CLAIMED through
  https://www.healthysurrey.org.uk/professionals/healthy-schools/news/updated-dfe-guidance-statutory-pshe).
  Confidence STRONG as guidance, MODERATE as evidence.
- **C5 · One dilemma with no clean answer, worked through the tool.** At least
  one scenario or sorting item in the lesson is genuinely unclear, and the
  lesson's tool is applied to it rather than a rule. JUDGEMENT. KS2 up.
  Source: Common Sense, "A digital life dilemma is a tricky situation... and it
  doesn't always have an obvious right or wrong answer" (OBSERVED, the
  backgrounder above). Confidence MODERATE.
- **C6 · Positive framing: no shock, no guilt, no talking down.** The script
  never opens with a warning, never blames the child, and from KS3 up never
  talks down. JUDGEMENT. All ages. Source: PSHE Association principle 3, "does
  not attempt to induce shock or guilt" (CLAIMED,
  https://www.ghll.org.uk/Ten%20Principles%20of%20PSHE%20Education.pdf); the
  DfE 2025 guidance, teaching should "support and not to alarm pupils"
  (CLAIMED, https://pshe-association.org.uk/news/final-updated-rshe-guidance-launched-today);
  Ofsted 2021, pupils found some RSHE resources "patronising" (CLAIMED,
  https://learning.nspcc.org.uk/research-resources/2021/ofsted-review-sexual-abuse-in-schools-colleges-caspar-briefing).
  The fear appeal evidence is in B. Confidence STRONG.
- **C7 · Teacher background at the point of need, one paragraph, the why not
  the what.** Every teach phase concept slide's script runs at least thirty
  words and explains why rather than restating the slide; the teacher tip is
  present. MEASURABLE for the length (to add), JUDGEMENT for the why. All
  ages. Source: Be Internet Legends' "Let's talk" background on every activity
  (OBSERVED, curriculum pack page 4); Oak's one paragraph teacher tip
  (OBSERVED, the Year 5 lesson above); Kapow's teacher video "delivering this
  knowledge just when it is needed" (CLAIMED). Confidence MODERATE.
- **C8 · Minutes on every step, and the lesson fits the hour.** Every slide
  has minutes; the phase sums equal the teacher notes timing; the full lesson
  runs 45 to 60 minutes. MEASURABLE (contract rules 2 and 4 for the sums; the
  45 to 60 window to add). All ages. Source: Common Sense prints minutes on
  every step (OBSERVED, https://www.commonsense.org/education/digital-citizenship/lesson/your-rings-of-responsibility);
  the PSHE Association asks for "accurate timings for each stage of the
  lesson" and says most lessons last "50-60 minutes" (CLAIMED,
  https://pshe-association.org.uk/news/writing-a-pshe-education-lesson-plan);
  Be Internet Legends shows the failure, timed activities totalling 70 minutes
  inside a "one-hour lesson" (OBSERVED, pack pages 125 to 128). ks2-26 runs 63
  today. Confidence MODERATE.
- **C9 · Question variety.** The lesson uses at least three distinct
  interactive types across choice, sort, discussion, scenario, try it and the
  passport page. MEASURABLE (to add). All ages. Source: Oak's quizzes mix
  multiple choice, fill in the blank, matching, multiple correct and short
  typed answers (OBSERVED, https://www.thenational.academy/teachers/programmes/rshe-pshe-primary-ks2/units/media-influence-how-do-i-decide-what-is-true-online/lessons/recognising-fake-and-ai-generated-images).
  Confidence MODERATE.
- **C10 · Three or four keywords with a definition a pupil can read.** The
  keywords slide has three or four words, each with a meaning on the wall, and
  the exit quiz asks for at least one of them. MEASURABLE (to add). All ages.
  Source: Oak gives each keyword a one line definition and ends the exit quiz
  with a matching item on those words (OBSERVED, the Year 5 lesson above).
  Confidence MODERATE.
- **C11 · A retrieval starter of four to six questions on prior learning and
  an exit quiz of four to six that tests the key learning points, each item
  with its why.** MEASURABLE (scripts/check-lesson-rubric.mjs reads the bank
  in either shape, teacher_notes.starter_quiz and exit_quiz for the older
  lessons, assessment.retrieval_starter and exit_quiz for the newer, and asks
  for four to six items with options and a teaching point). All ages. Source: Oak runs 4
  and 4 at Year 5 and 6 and 6 at Year 6 and KS3, and states the exit quiz
  "checks understanding of the key learning points, keywords and
  misconceptions" (OBSERVED, https://support.thenational.academy/using-oaks-new-teaching-resources).
  The retrieval evidence is in B. Confidence STRONG for retrieval, MODERATE
  for the counts.

Checks that need a field, a slide type or a surface (SCHEME), for Justin:

- **C12 · A baseline the lesson comes back to.** A starter beat that captures
  what the class thinks now, and a close beat that returns to it in a
  different colour. Source: Be Internet Legends, "draw a scale from 1-10...
  This will be revisited at the end of the lesson" (OBSERVED, pack pages 125
  and 130); the PSHE Association, "revisit the original baseline activity"
  (CLAIMED). Today the commitment stem is revisited only at the next lesson.
- **C13 · Ground rules at the top of a sensitive lesson**, naming the right to
  pass and no personal stories. Source: Oak RSHE, each lesson "begins with
  ground rules" (OBSERVED, https://www.thenational.academy/teachers/curriculum/rshe-pshe-primary/overview);
  Be Internet Legends, "no personal stories, the right to pass" (OBSERVED, pack
  page 124); the DfE 2025 guidance names "setting ground rules with the class"
  (CLAIMED). Today no ground rules slide type exists.
- **C14 · Signpost a person and a service in every sensitive lesson**, and an
  anonymous question route named in the starter and the close. Source: Be
  Internet Legends signposts "CEOP, NSPCC, and Childline" and the "ask it
  basket" (OBSERVED, pack page 124); Oak RSHE signposts "the NHS and to
  Childline" (OBSERVED); the DfE 2025 guidance names "question boxes"
  (CLAIMED). Today the lessons name the designated safeguarding lead by the
  school's own panel and nothing names a service.
- **C15 · Disclosure response steps inside the lesson notes.** A numbered
  response script in dsl_note for every flagged lesson. Source: Be Internet
  Legends prints four steps inside the activity (OBSERVED, pack page 108);
  Childnet writes the duty of care into its educator guidance (CLAIMED,
  https://www.childnet.com/resources/pshe-toolkit/myth-vs-reality/educators-guidance/).
- **C16 · A content guidance label and a supervision flag on the catalogue
  card.** Source: Oak prints "Content guidance" and "Adult supervision
  recommended" on the lesson page (OBSERVED, https://www.thenational.academy/teachers/programmes/rshe-pshe-primary-ks2/units/our-online-lives-how-can-i-be-kind-and-happy-online/lessons/keeping-safe-in-the-online-world).
- **C17 · A support line and a challenge line on every practice task.**
  Source: Be Internet Legends on every activity (OBSERVED, pack pages 126 to
  127); Kapow's "Pupils needing extra support" and "greater depth" (CLAIMED).
  Today differentiation is one paragraph per lesson in the teacher notes.
- **C18 · A symbol supported route for pupils with SEND.** Source: Childnet's
  STAR SEND toolkit, "accessible Widgit symbols" and "3 ways of approaching the
  topic" per teaching point (CLAIMED, https://www.childnet.com/resources/star-send-toolkit/).
- **C19 · The family note in more than one language.** Source: Common Sense
  ships family tips in English, Spanish and further languages (OBSERVED,
  https://www.commonsense.org/sites/default/files/pdf/2020-09/2020-digitalcitizenshipcurriculum-overview-final-release.pdf).
- **C20 · Three band teacher judgement with an exemplar per band.** Source:
  Jigsaw's "Working towards, Working at, and Working beyond" with
  exemplifications (CLAIMED, https://www.tgps.uk.com/wp-content/uploads/2020/07/PSHE-Policy.pdf).
- **C21 · A fifteen to twenty minute version made from tagged slides.**
  Source: Common Sense's "15 mins" quick lessons beside its full ones
  (OBSERVED, https://www.commonsense.org/education/collections/quick-digital-citizenship-lessons-for-grades-k-12).
  The drop in is promised in the build spec and no slide is tagged for it.
- **C22 · Rationale on the printed quiz items too.** The older lessons' banks
  carry a teaching point per item; the four lessons written from 19 September
  store an answer index only, so their paper answer sheets cannot say why.
- **C23 · Keyword meanings on the wall for the four newest lessons.** ks2-26,
  ks3-27, ks4-28 and ks4-29 store each keyword's meaning under "definition",
  and the player draws "meaning" (shared/components/LessonPlayer.tsx), so
  the class sees the word and no meaning. A key rename, not a slide edit:
  the first structural migration.

Two things no scheme read does, kept because they are what to beat with: the
recurring cast that teaches (Jigsaw's Friend is a soft toy, CEOP's cast is on
film, Common Sense's Digital Citizens are on video for the young years only),
and the passport, which home and school both write to.

## D. Honest limits

- The scheme report's OBSERVED labels cover Oak, Common Sense and the Be
  Internet Legends pack. Teach Computing, ProjectEVOLVE, Childnet, CEOP,
  Kapow, Twinkl, Jigsaw, the PSHE Association, Ofsted and gov.uk were blocked
  by the session's network policy, so every line from them is a quotation
  seen in a search snippet, and every DfE 2025 and PSHE Association quotation
  should be checked against the PDF before it appears in CPD copy.
- No 2023 Ofsted PSHE or RSHE subject report was found; the 2013 "Not yet good
  enough" report and the 2021 review of sexual abuse in schools are what exist.
- The council's four minute passive ceiling is a house judgement. The
  evidence on attention in lessons is in B, and it is thinner than the popular
  ten minute rule suggests.
