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

From the slide and lesson design evidence report (research-slide-evidence.md,
20 September 2026, fifty checks across twelve areas). Access note that governs
every label: the session's network policy blocked every academic, publisher
and government host, so a source marked OPENED was read in full from a mirror
(the WCAG source files, Mayer and Moreno 2003, Roediger and Karpicke 2006,
two Karpicke Science papers, Dunlosky 2013, Rohrer and Taylor 2007, Weinstein
2018, Hattie and Timperley 2007 as page scans); EXTRACT means a search tool's
extract of the primary page; SECONDARY means a carrier. Where a number is the
scheme's own calibration rather than a figure from a source, the check says
so. The confidence labels are the report's, and they are honest about the
population: most of the multimedia work is on undergraduates, and its effect
sizes will not transfer to a Reception class even where its direction should.

The wall:

- **E1 · One idea per teach slide, named in the heading.** Every concept and
  diagram slide has a heading of 3 to 10 words that states the idea, and the
  script names the same idea. MEASURABLE (the range is calibration) plus
  JUDGEMENT. Source: Schneider, Beege, Nebel and Rey 2018,
  https://doi.org/10.1016/j.edurev.2017.11.001 (103 studies, N 12,201); Mayer
  and Moreno 2003, signalling 0.74. All ages. STRONG for signalling.
- **E2 · Nothing on the wall the lesson does not use.** A concept slide
  carries at most one emoji; a diagram no more emoji than steps; no
  decoration on a teach slide while the teacher talks; no sentence in the body
  off the teaching point. MEASURABLE (counts) plus JUDGEMENT. Source: Harp and
  Mayer 1998, https://doi.org/10.1037/0022-0663.90.3.414; Sundararajan and
  Adesope 2020, https://doi.org/10.1007/s10648-020-09522-4 (g 0.16 harmful, 50
  studies); Fisher, Godwin and Seltman 2014,
  https://doi.org/10.1177/0956797614533801 (kindergarten). All ages. STRONG in
  direction for adults, MODERATE for children.
- **E3 · Do not read the labels over the picture.** On a diagram slide the
  script shares no run of 8 or more consecutive words with any step text or
  caption. On a text only concept slide reading aloud is allowed and the prose
  ceiling is the control. MEASURABLE (8 is calibration). Source: Mayer, Heiser
  and Lonn 2001, https://doi.org/10.1037/0022-0663.93.1.187; Adesope and
  Nesbit 2012, https://doi.org/10.1037/a0026147 (spoken plus written no worse
  than written only when no picture competes). All ages. MODERATE; the
  boundary condition is the finding, and it is why the ceiling, not a ban on
  reading, is the instrument.
- **E4 · Labels live inside the thing they label.** Every diagram step has
  both a title and text; the caption sits beneath the picture. MEASURABLE.
  Source: Schroeder and Cenkci 2018, https://doi.org/10.1007/s10648-018-9435-9
  (58 comparisons, g 0.63); Ginns 2006,
  https://doi.org/10.1016/j.learninstruc.2006.10.001. All ages. STRONG
  (adults), direction for children.
- **E5 · Words and picture arrive together.** A diagram script contains a
  pointing instruction (point, walk, tap, touch each). MEASURABLE (regex) plus
  JUDGEMENT. Source: Ginns 2006; Mayer and Moreno 2003, temporal contiguity
  1.30 over 8 experiments. All ages. MODERATE.
- **E6 · Short segments, paced by the teacher.** Every concept and diagram
  slide runs 1 or 2 minutes and the player advances only on Continue.
  MEASURABLE (2 is calibration). Source: Rey et al 2019,
  https://doi.org/10.1007/s10648-018-9456-4 (56 investigations); Mayer and
  Moreno 2003, segmenting 1.36. All ages. STRONG for the effect.
- **E7 · Names before mechanism.** The keywords slide sits in the starter
  phase before the first teach slide, and every keyword appears at least once
  in teach phase prose. MEASURABLE. Source: Mayer and Moreno 2003, pretraining
  1.00 over 3 experiments (college students). All ages. MODERATE.
- **E8 · Speak to the child, and let the friend speak as itself.** At least
  one line in every digi slide uses I, me, my or we; body, prompt and
  question address the class as you on at least half the slides; nothing says
  "pupils should". MEASURABLE plus JUDGEMENT. Source: Ginns, Martin and Marsh
  2013, https://doi.org/10.1007/s10648-013-9228-0 (retention d 0.30, transfer
  d 0.54, fades past 35 minutes). All ages. MODERATE.
- **E9 · A live human voice reads the script.** The player never autoplays
  synthetic speech for the script or the friend's lines. MEASURABLE from the
  player. Source: Mayer's 2017 pooling, human voice d 0.74 (carried by Craig
  and Schroeder, https://files.eric.ed.gov/fulltext/EJ1341358.pdf); Mayer and
  DaPra 2012, https://doi.org/10.1037/a0028616. All ages. THIN.

Load and sequence:

- **E10 · A worked example before the class tries it.** In every cycle a
  concept or diagram showing the tool applied precedes the first choice; the
  first interactive or try it has a modelled instance earlier. MEASURABLE
  (index order) plus JUDGEMENT. Source: Sweller and Cooper 1985,
  https://doi.org/10.1207/s1532690xci0201_3 (secondary pupils; half the time,
  a fifth of the errors); Atkinson et al 2000,
  https://doi.org/10.3102/00346543070002181; Rosenshine 2012 principle 4; the
  EEF 2021 review. All ages. STRONG.
- **E11 · Small steps with a response after each.** No more than two
  consecutive teach slides pass without a slide the class responds to.
  MEASURABLE (two is calibration; A3's four minutes is the same idea in
  time). Source: Rosenshine 2012 principle 2; Bunce, Flens and Neiles 2010,
  https://doi.org/10.1021/ed100409p; Rey et al 2019. All ages. STRONG for
  direction.
- **E12 · One new term per slide.** No concept slide is the first appearance
  of more than one keyword. MEASURABLE. Source: Sweller 1988,
  https://doi.org/10.1207/s15516709cog1202_4; Sweller, van Merriënboer and
  Paas 2019 (SECONDARY). All ages. MODERATE.
- **E13 · Less scaffold as the key stage rises.** The ratio of modelled to
  response slides is lower at KS4 and KS5 than at KS1 and KS2, and every KS4
  and KS5 lesson opens at least one cycle on a scenario or a choice before
  its concept. MEASURABLE plus JUDGEMENT. Source: Kalyuga, Ayres, Chandler and
  Sweller 2003, https://doi.org/10.1207/S15326985EP3801_4. KS4, KS5. MODERATE.
- **E14 · Never "read this while I explain that".** No script asks the class
  to read a block while the teacher says different content. MEASURABLE
  (regex) plus JUDGEMENT. Source: Ginns 2006; Schroeder and Cenkci 2018. All
  ages. STRONG (adults).

Diagrams and examples:

- **E15 · A diagram shows a structure, not a decoration.** Every diagram has
  at least 2 steps with text and its heading or caption names the
  relationship. MEASURABLE plus JUDGEMENT. Source: Clark and Paivio 1991,
  https://doi.org/10.1007/BF01320076; the EEF 2021 review; Weinstein, Madan
  and Sumeracki 2018, https://doi.org/10.1186/s41235-017-0087-y. All ages.
  MODERATE.
- **E16 · A concrete case on every concept slide, tied back to the idea.**
  The body or script names an instance and the next sentence restates the
  general point. JUDGEMENT. Source: Weinstein et al 2018; Clark and Paivio
  1991. All ages. MODERATE.

The arc:

- **E17 · A retrieval starter that reaches back.** The starter runs 5 to 8
  minutes and contains at least one choice or discussion that refers to an
  earlier module; eliciting today's topic does not count; across a key stage
  each starter retrieves from at least one module other than the previous
  one. MEASURABLE. Source: Rosenshine 2012 ("five-to-eight-minute review",
  https://www.aft.org/sites/default/files/Rosenshine.pdf); Roediger and
  Karpicke 2006, https://doi.org/10.1111/j.1467-9280.2006.01693.x (56 versus
  42 percent at one week, d 0.83); Agarwal, Nunes and Blunt 2021,
  https://doi.org/10.1007/s10648-021-09595-9 (50 classroom experiments);
  Dunlosky et al 2013, https://doi.org/10.1177/1529100612453266; Cepeda et al
  2006, https://doi.org/10.1037/0033-2909.132.3.354. All ages. STRONG.
- **E18 · Mixed retrieval formats, low stakes.** The starter quiz has at least
  3 items including a multiple choice item and an open prompt; nothing in the
  starter is scored for the child. MEASURABLE. Source: Agarwal et al 2021;
  Adesope, Trevisan and Sundararajan 2017,
  https://doi.org/10.3102/0034654316689306 (SECONDARY). All ages. MODERATE.
- **E19 · A hinge in every cycle.** Every cycle contains at least one choice.
  MEASURABLE. Source: Rosenshine 2012 principles 3 and 6; Wiliam 2011 and 2015
  (SECONDARY). All ages. STRONG for the principle.
- **E20 · Everyone answers, and the script says how.** Every choice script
  names a whole class method (fingers, cards, whiteboards, devices, vote).
  MEASURABLE plus JUDGEMENT. Source: Randolph 2007,
  https://doi.org/10.1177/10983007070090020201 (quiz d 1.08, participation up
  47.7 points, off task down 34.3). All ages. STRONG for direction.
- **E21 · Three seconds written in.** Every choice and discussion script
  contains a think pause before answers are taken. MEASURABLE (regex). Source:
  Rowe 1986, https://doi.org/10.1177/002248718603700110; Tobin 1987,
  https://doi.org/10.3102/00346543057001069 (3 second threshold, elementary to
  high school). All ages. STRONG.
- **E22 · Pitched at four in five.** Live mean correct on prove choices sits
  between 70 and 90 percent; at authoring the writer names the popular wrong
  answer. MEASURABLE (live) plus JUDGEMENT. Source: Rosenshine 2012 (82 versus
  73 percent in fourth grade maths; "about 80 percent"). All ages. MODERATE.
- **E23 · Guided before independent, and the prove step tests what was
  practised.** Phases run starter, teach, practise, prove, close; every prove
  choice tests a tool that appears in a practise slide. MEASURABLE plus
  JUDGEMENT. Source: Rosenshine principles 5 and 9; Rohrer and Taylor 2007,
  https://doi.org/10.1007/s11251-007-9015-8 (63 versus 20 percent a week
  later). All ages. STRONG.
- **E24 · A short recap and an exit check.** The recap has 3 to 5 points and
  the exit quiz is not empty. MEASURABLE (5 is calibration). Source:
  Rosenshine principles 1 and 10; Agarwal et al 2021. All ages. STRONG for the
  review.
- **E25 · The teacher thinks aloud once.** At least one teach script models a
  thought ("here is what I would notice first"). MEASURABLE (regex) plus
  JUDGEMENT. Source: the EEF metacognition guidance,
  https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition.
  All ages. MODERATE.

The choice item:

- **E26 · Three options, one right.** Two to four options, three by default,
  exactly one correct. MEASURABLE. Source: Rodriguez 2005,
  https://doi.org/10.1111/j.1745-3992.2005.00006.x; Haladyna, Downing and
  Rodriguez 2002, https://doi.org/10.1207/S15324818AME1503_5. All ages. STRONG.
- **E27 · Item hygiene.** No "all of the above", "none of the above" or
  negative stem; the correct option is the longest in no more than half a
  lesson's items; no correct position holds more than half the items.
  MEASURABLE. Source: Haladyna et al 2002 (31 guidelines, wording SECONDARY).
  All ages. STRONG for the consensus.
- **E28 · Distractors are misconceptions, and each is answered.** Every
  option's feedback is at least 8 words (the house floor is 12, C1); wrong
  option feedback names why and points to the right idea; at least one
  misconception maps to a distractor per cycle. MEASURABLE plus JUDGEMENT.
  Source: Haladyna et al 2002; Van der Kleij, Feskens and Eggen 2015,
  https://doi.org/10.3102/0034654314564881 (elaborated 0.49, correct answer
  only 0.32, right or wrong only 0.05). All ages. STRONG.
- **E29 · Feedback is about the answer, never the child, and never a
  prize.** No feedback praises or blames the pupil or offers a reward; correct
  option feedback explains beyond its affirmation. MEASURABLE plus JUDGEMENT.
  Source: Hattie and Timperley 2007, https://doi.org/10.3102/003465430298487
  (praise 0.14, task information highest, rewards negative 0.34); Kluger and
  DeNisi 1996, https://doi.org/10.1037/0033-2909.119.2.254 (over a third of
  interventions lowered performance). All ages. STRONG.
- **E30 · Every hard question has a written answer.** The teacher notes' hard
  questions are not empty, each with a question and an answer. MEASURABLE.
  Source: the DfE RSHE guidance 2025; Ofsted 2021. All ages. STRONG
  (guidance).

Legibility:

- **E31 · Big enough for the back row, with the room declared.** With a
  declared board width and room depth, the smallest body text subtends an x
  height of at least 0.2 degrees at the farthest seat (on a 2 metre board at
  1920 px: 40 px for 6 metres, 60 px for 8 metres); KS1 uses the larger
  figure. MEASURABLE once the room is declared. Source: Legge and Bigelow
  2011, https://doi.org/10.1167/11.5.8; Hughes and Wilkins 2000
  (SECONDARY). All ages. MODERATE.
- **E32 · Contrast.** Text at least 4.5 to 1, large text and meaningful
  graphics at least 3 to 1, wall text aiming at 7 to 1. MEASURABLE. Source:
  WCAG 2.2 criteria 1.4.3, 1.4.6, 1.4.11, https://www.w3.org/TR/WCAG22/
  (source files read). All ages. STRONG (standard).
- **E33 · Line length, spacing, alignment.** No rendered body line over 80
  characters; line height at least 1.5; left aligned, never justified.
  MEASURABLE. Source: WCAG 1.4.8 and 1.4.12; the BDA Dyslexia Style Guide
  2023, https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf;
  Dyson 2004, https://doi.org/10.1080/01449290410001715714. All ages.
  MODERATE.
- **E34 · No italics, underlining or capitals for emphasis; sans serif body;
  mono for labels only.** MEASURABLE. Source: BDA 2023; Rello and Baeza-Yates
  2013, https://doi.org/10.1145/2513383.2513447 (48 adults with dyslexia).
  All ages. MODERATE.
- **E35 · The six by six rule is folk; the measured ceilings stand.** No copy
  or rubric cites a words per line or lines per slide rule. Source: vendor
  pages only; no study found. FOLK for the rule.
- **E36 · A readability floor for KS2 and above.** Body prose at or below a
  Flesch Kincaid grade of the year group minus one; EYFS and KS1 use the
  decoding ceiling. MEASURABLE but unvalidated in the UK; anchors are the
  national curriculum reading expectations and GOV.UK's adult reading age of
  9. KS2 to KS5. THIN.

Pacing and pauses:

- **E37 · No passive stretch over four minutes, and every stretch ends with
  everyone responding.** MEASURABLE (four is calibration; A3). Source: Bunce
  et al 2010; Godwin et al 2016,
  https://doi.org/10.1016/j.learninstruc.2016.04.003 (K to 4, lowest on task
  in whole group formats); Rosenshine principle 2. All ages. MODERATE.
- **E38 · No attention span claim.** No copy, script or note asserts an
  attention span in minutes. MEASURABLE (regex). Source: Wilson and Korn 2007,
  https://doi.org/10.1080/00986280701291291; Bradbury 2016,
  https://doi.org/10.1152/advan.00109.2016. All ages. The ten minute rule is
  FOLK; STRONG that it is folk.
- **E39 · The pause changes the activity and claims nothing.** The half time
  breath's prompt includes movement or pair talk, and no copy claims the
  breath improves attention, calm or wellbeing. MEASURABLE plus JUDGEMENT.
  Source: Watson et al 2017, https://doi.org/10.1186/s12966-017-0569-9
  (direction only); Kuyken et al 2022 MYRIAD,
  https://doi.org/10.1136/ebmental-2021-300396 (8,376 pupils, no benefit);
  Dunning et al 2019, https://doi.org/10.1111/jcpp.12980. All ages. THIN for
  the breath, MODERATE for the change of activity.

Character and fear:

- **E40 · The friend voices the struggle first, then hands over.** The
  arrival beat's lines are first person with a question or an admission
  before the last line; the mission beat sets something the child can do
  tonight. MEASURABLE plus JUDGEMENT. Source: Bandura 2004,
  https://doi.org/10.1177/1090198104263660; Schroeder, Adesope and Gilbert
  2013, https://doi.org/10.2190/EC.49.1.a (larger effect for K to 12); Green
  and Brock 2000, https://doi.org/10.1037/0022-3514.79.5.701. All ages.
  MODERATE.
- **E41 · "What would Bloop do?" in EYFS to KS2.** At least one practise or
  discussion prompt asks what the friend would do or has the child tell the
  friend. MEASURABLE (regex). Source: White and Carlson 2016,
  https://doi.org/10.1111/desc.12314 (five year olds improved, three year olds
  did not); White et al 2017, https://doi.org/10.1111/cdev.12695 (SECONDARY).
  Reception to KS2. MODERATE.
- **E42 · Every harm has a route out, and no lesson ends on a harm.** Any
  slide naming a harm (grooming, stranger, bullying, scam, nude, abuse,
  addiction, gambling) is followed within the cycle by a slide whose prose or
  verdicts carry a concrete action (tell, block, report, ask, screenshot,
  leave); the final teach slide is not a harm slide; nothing depicts harm
  graphically; no copy blames the child. MEASURABLE plus JUDGEMENT. Source:
  Witte and Allen 2000, https://doi.org/10.1177/109019810002700506; Kok et al
  2018, https://doi.org/10.1080/17437199.2017.1415767; Petrosino et al 2013,
  https://doi.org/10.1002/14651858.CD002796.pub2 (Scared Straight raised
  offending, ages 14 to 20); PSHE Association principle 3; the DfE RSHE 2025
  guidance ("support and not to alarm"). All ages. STRONG for direction.

RSHE and PSHE:

- **E43 · Start where they are.** The starter contains a discussion with a
  lookFor before the first concept. MEASURABLE. Source: PSHE Association
  principle 1; Rosenshine principle 1. All ages. STRONG (guidance).
- **E44 · Realistic, relevant, and a true norm.** Every lesson has at least
  one scenario judged on "would this pass for real", and no copy states a
  harmful behaviour as what everyone does without the true figure and its
  source. MEASURABLE (presence) plus JUDGEMENT. Source: PSHE principle 5;
  Ofsted 2021; Finkelhor et al 2021, https://doi.org/10.1177/1524838020916257.
  All ages. MODERATE.
- **E45 · The behaviour is practised, with time.** The practise phase runs at
  least 5 minutes with at least one interactive or try it in which the child
  performs the behaviour. MEASURABLE. Source: Jones, Mitchell and Walsh 2014,
  https://www.ojp.gov/library/publications/content-analysis-youth-internet-safety-programs-are-effective-prevention;
  the EEF SEL guidance (SAFE); PSHE principle 9; the DfE RSHE 2025 guidance.
  All ages. STRONG (guidance and review).
- **E46 · Sequenced and spiral.** The teacher notes' prior knowledge names at
  least one earlier module; the passport stage is valid. MEASURABLE. Source:
  PSHE principle 2; the EEF SEL guidance (Sequenced); the DfE RSHE 2025
  guidance. All ages. STRONG (guidance).
- **E47 · Safe distance.** No prompt, question or script asks a child to
  disclose ("have you ever"); scenarios use named third parties. MEASURABLE
  plus JUDGEMENT. Source: PSHE principle 10; the DfE RSHE 2025 guidance. All
  ages. STRONG (guidance).
- **E48 · Hooked to the statute and to home.** Statutory hooks and strands
  are not empty; the parent note has its five fields. MEASURABLE. Source: the
  DfE RSHE 2025 guidance; UKCIS Education for a Connected World 2020; the DfE
  Teaching online safety in schools guidance. All ages. STRONG.

Accessibility:

- **E49 · Every non text element has words, and colour never carries meaning
  alone.** Video and interactive slides carry a caption; images carry alt
  text; every emoji sits beside meaning bearing text; verdict chips and answer
  states are told apart by text or shape. MEASURABLE. Source: WCAG 2.2
  criteria 1.1.1 and 1.4.1. All ages. STRONG (standard).
- **E50 · Motion, flashing, targets, and the adjustments owed in advance.**
  No automatic animation over five seconds without a pause control; nothing
  flashes over three times a second; options at least 24 by 24 CSS pixels on
  the child's device; the teacher notes' send, paper fallback and
  differentiation support are specific (at least 20 words, never "support as
  needed"). MEASURABLE plus JUDGEMENT. Source: WCAG 2.2 criteria 2.2.2, 2.3.1,
  2.5.8; the Equality Act 2010 anticipatory duty via the EHRC technical
  guidance,
  https://www.equalityhumanrights.com/sites/default/files/reasonable_adjustments_for_disabled_pupils_1.pdf;
  the EEF SEND guidance 2020. All ages. STRONG (law, standard and guidance).

What the report ranks strongest and weakest: retrieval practice (E17, E18,
E24) and feedback that explains the task (E28, E29) are the best evidenced
things in this file, measured in classrooms; whole class response and the
three second wait (E20, E21) were measured in school classrooms; the
multimedia principles (E1 to E7) are strong in direction and adult in
population; the character evidence (E40, E41) never measured a lesson
outcome; the redundancy boundary (E3), type size on a wall (E31) and reading
age (E36) are thin; the ten minute attention span, the six by six rule and
the single four second breath are folk (E35, E38, E39 exist to keep them out
of the copy).

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
- **C8 · Minutes on every step, and the length is the one a school can
  timetable.** Every slide has minutes; the phase sums equal the teacher
  notes timing; the full lesson runs 45 to 60 minutes. MEASURABLE (contract
  rules 2 and 4 for the sums; the 45 to 60 window in
  scripts/check-lesson-rubric.mjs). All ages. Today the timing strings are
  honest and nineteen of the first twenty exported lessons state 63 to 73
  minutes, so this is a scheme decision for Justin rather than a slide edit:
  trim to the hour, split into two sessions, or print the true length on the
  catalogue card. Source: Common Sense prints minutes on
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
