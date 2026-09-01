# Lesson excellence: the best ever lessons, matching school lessons

Justin, 1 September 2026: characters seemed to be blocked out with text;
lessons need to be high level and really teach them, the best at every
stage in the parent and child app; not as long as school lessons but super
structured to teach every aspect of each stage; the questions all get
stored for the passport stage pass and are added to a final test for the
stage; review on both apps so it is the best possible learning and digital
safety, matching school lessons in a slightly reduced version; apply
Mobbin examples; do not stop until the end result is the best ever
lessons, syncing with codes for the passport.

## What the audit found (1 September 2026, live database + full code map)

- The live player is `shared/components/LessonPlayer.tsx` for BOTH apps
  (kid mode strips the teacher script channel). 92 slide built lessons
  across the five stages, all on the house arc: title, objective, two
  concepts, two choices, DiGi close.
- THE FAULT JUSTIN SAW: the lesson intro (`shared/components/AnimatedIntro.tsx`)
  pasted a full width white speech bubble absolutely over the character
  clip. Long greetings wrap to four lines and cover the character from the
  waist down on a phone, on the FIRST slide of every lesson. Four smaller
  overlap sites: lesson browse tiles paint long titles over the cover art,
  the passport stamp squeezes an Earned label onto the Friend's feet, the
  watch tile centres its play button on the poster face, and the player
  header row can crowd DiGi off the edge on small phones.
- STRUCTURE GAP against a school lesson: across all 92 decks there are ZERO
  keywords slides (vocabulary), one recap, one tryit, no discussion, no
  stat slides. Every deck teaches then asks two questions and closes.
  A school lesson names its vocabulary, practises against a real scenario,
  checks understanding more than twice, recaps, and sets home practice.
- QUESTIONS: only one or two choice questions per lesson, and NO per
  question storage anywhere. The player counts right answers in memory and
  posts only the totals. Which question a child missed is thrown away.
- THE FINAL TEST ALREADY EXISTS and is exactly Justin's design: the end of
  stage check (kid `/k/quiz`, parent `/dashboard/pathway/check`) gathers
  its five questions FROM the stage's own lessons (stage-quiz-gather),
  pass is 4 of 5, a pass writes `stage_quiz_passes` and stamps the
  passport. What it cannot do yet is know which questions this child
  already met or missed, because nothing stores answers.
- CODES: school HOME codes credit school lessons to the passport record,
  and GC passport codes verify the printed passport. Both live, untouched
  by this plan except that better lessons feed them better evidence.

## The build, step by step

**Step 1. Characters never blocked by text (PR one, with this plan).**
The intro bubble moves ABOVE the character frame with a tail pointing down
at it, Duolingo's register exactly (Mobbin refs pulled 1 September: the
mascot is never covered; the bubble sits beside or above). Frame sized so
the Continue button stays on a phone screen. The dev fixture gains a title
slide so this stays verifiable. The four smaller sites fixed the same way:
art and text each get their own room, nothing overlaps.

**Step 2. Every question stored (migration 239).**
`lesson_question_answers`: user, child, lesson, source, the question text,
the option chosen, correct or not, answered at. Written by the lesson
player (both apps: it already knows every pick, it just forgets them) and
by both stage check surfaces per question. Fails soft everywhere: the
page always wins over the ledger. This is the store Justin asked for, and
it is also more honest evidence for the passport than a single score.

**Step 3. The final test reads the store.**
The stage check samples its five from the stage pool as now, but prefers
questions this child got wrong before, then questions never met, then the
rest, so the check is retrieval practice by design rather than luck. The
readiness card can say "12 of 18 stage questions met so far" from the
same store. Pass rule and stamp writing unchanged.

**Step 4 to 6. The school arc completed, stage by stage (migrations 240
to 244, one PR per pair of stages).**
Every slide built lesson grows to the full school shape while staying a
five to seven minute lesson, in Justin's voice, no dashes:
- a keywords slide after the objective (two or three words a school
  lesson would put on the board, kid friendly meanings),
- a scenario or discussion beat where the deck has none, so practise
  happens against something real,
- a third choice question so every lesson checks understanding at least
  three times and the stage pool grows to roughly fifty questions,
- a recap slide (three ticks, the lesson back in one breath),
- a tryit slide (one thing to do tonight, the home practice a school
  lesson sets).
Title slides get their `character` key stamped so the right Planet Friend
leads every lesson instead of a regex guessing from the title. Foundation
and Builder first (240, 241), then Explorer and Shaper (242, 243), then
Independent (244).

**Step 7. The walkthrough.** Playwright through a full lesson and a full
stage check on phone and desktop widths in both apps, every button
tapped, plus the house gates. decisions.md updated.

## What this deliberately does not touch

- The pass marks (70 percent lesson, 4 of 5 stage) and the never
  downgrade rule: earned stays earned.
- The parent guidance articles (text lessons at sort 10 and 20): they are
  for the grown up and are not decks.
- ai_lessons and school_lessons decks: same player, so they inherit the
  intro fix for free; their content belongs to other plans.
- The codes: HOME codes and passport codes work and stay as they are.

## Order of pull requests

PR one: step 1 + this plan (claims migrations 239 to 244). PR two: steps
2 and 3. PR three: step 4 (Foundation + Builder). PR four: step 5
(Explorer + Shaper). PR five: step 6 (Independent) + step 7. Small PRs,
merged same day where possible, per the house sync rules.

## BUILT, 1 September 2026, the whole plan in one evening

All on PR 945, one branch, three commits. Step 1: the intro bubble moved
above the character with a tail pointing down (the Duolingo register from
the Mobbin pull), plus the four smaller overlap sites, verified by
screenshot at phone and desktop widths. Steps 2 and 3: migration 239's
lesson_question_answers written by both apps' players and both stage
check surfaces, and the stage check ordering its pool missed first, never
met next, held last, so the passport final asks the wobbly ones first.
Steps 4 to 6: migrations 240 to 244 carried every one of the 92 decks to
the school arc, additively, registers held per stage, Nova fronting the
heavy Shaper decks and Cosmo the Independent ones; the library's question
count rose from 169 to 368 and every deck verified live by SQL: keywords,
four plus questions with one correct each, recap, tryit, character, zero
dashes. Step 7: tsc, wiring, checkin guard, rotation check, and Playwright
walks of the intro, a full lesson run and the new slide types, all green.
