# 8 October 2026: Lessons, version 4. The child learns it, the parent closes it, and both can see it stuck

Justin, looking at Lessons for Teo on his phone: "these are really for the
child to do ... it looks like we are asking the parent to take the lesson.
Come up with the best way to run this so it is coherent, flows and loops, so
the parent can be confident the child learns, the lesson is for the child,
giving the parent options, knowing it is not a lesson for them. What we come
up with must encourage ticking off on the system (lesson done, passport) and
the child's app wiring works." Then: "check your advice with as many agents as
possible ... the lessons teaching the end result of making sure Teo learns in
the best industry leading way possible, as if the best school lessons but top
known proven methods for best results, and that the mechanism is easy for
parents and gives them a wow factor. Do not stop coming up with the plan and
redoing it until it scores 10 out of 10 on these points."

Four versions, each sent to the same six lens panel: a teacher, a learning
scientist, a learning app product lead, a parent UX reviewer, a sceptical
engineer and a child lens (a 12 year old alone, a 5 year old on the sofa).
Scores out of 10 on A (the child learns, best proven methods), B (easy for the
parent, a wow) and C (the loop runs):

| Lens | v1 | v2 | v3 |
|---|---|---|---|
| Teacher | 6/5/5 | 7/8/7 | 9/10/9 |
| Learning scientist | 7/6/6 | 8/8/7 | 9/9/9 |
| Learning app lead | 6/5/5 | 8/8/7 | 9/9/8 |
| Parent UX | 3/4/3 | 8/7/6 | 9/9/7 |
| Sceptical engineer | 4/5/5 | 6/7/5 | 7/8/7 |
| Child lens | 5/5/4 | 7/8/7 | 9/9/9 |

The reviews are in the session scratchpad (`lessons-review/round1/` to
`round3/`). Each round the panel named the exact changes that would earn the
last points, and in round 3 they overlapped: the Foundation pass written into
the rule, the practice and the check kept apart, the Remember check drawing
application items, the parent's tap locked on the right column and reaching
the child as words rather than stars, the week's row always present, the
Today row's control labelled, and a build order in which every finish works
between merges. Version 4 makes those changes. Every item carries the lens
that asked for it.

## What is true today (verified in the code and the live database, 8 October)

1. **The loop has never run.** Live: 0 `school_lesson` completions, 0
   `stage_quiz_passes`, 2 `kid_lesson_missions` ever, 0 answers with source
   `school_lesson`.
2. **The parent send route is dead.** `app/api/quests/lessons/route.ts`
   reads the catalogue with the parent's RLS client; migration 274 revoked
   `schools.school_lessons` from `authenticated`, so every POST answers 503.
   It never pushes the child, never checks ownership, resets a passed mission
   to `sent`, and has no paywall check. `pushToChild` returns nothing.
3. **The check does not measure the lesson.** The pass is 70 percent of
   every choice slide, first tap only, written twice (`LessonPlayer.tsx:1481`,
   `lesson-complete/route.ts:71`) and trusted from the client. Every deck has
   two `prove` items; 53 of the 68 have the right answer as the longest
   option, 10 have two options (no second go), module 10's right answer is the
   longest on all five choice slides, and the starter of a stage's first
   module recalls a lesson from the previous key stage. `tryAgain` rewinds to
   the slide before the first wrong answer and re asks the question whose
   answer just turned green. 24 of the 34 decks already sort the six
   `worksheet_items` in their practise phase; 25 carry `expected_verdict` and
   `teaching_point` on every item; every deck has `teacher_notes.tool`,
   `teacher_notes.misconceptions` and `teacher_notes.commitment_stem`.
4. **Stars pay on completion, not the pass.** A fail pays and tells the
   parent "3 stars landed". A lesson is 3, a first film watch 10.
5. **The child's answers are thrown away.** Migration 239 holds `question`,
   `chosen`, `correct` only; `fetchAnswerFacts` selects `correct`.
6. **The child's stage check draws from the parent library** and trusts
   `body.correct`.
7. **The week between lessons is a dice roll.** `pickDay` draws the lesson
   and the quiz by seed; a drawn undone lesson fails the day; the quiz row
   links to `?quiz=1` which the page ignores; `/k/[token]/remember` does not
   exist; the `LEARNING` pair in `stepForToday` lets a lesson pass tick the
   quiz step; the five a day cron (18:30 London) sends one push a day and
   skips any child with no `kid_days` row today; `KidQuestScreen.tsx:2657`
   renders every mission row under "Star lessons from your grown up";
   `lib/planet/server.ts:244` counts a third lesson number for the planets.
8. **The child meets the classroom deck.** Six to ten classroom slides per
   module; the half time prompt lives in `config.prompt`; no saved place;
   22 of the 27 KS2 and up decks sit at their core minutes ceiling, so adding
   classroom slides trips `check-lesson-core.mjs`, `check-lesson-minutes.mjs`
   and `check-lesson-rubric.mjs`.
9. **Under 7 the grown up's words are stripped**, and both prove items in
   the first Reception deck are two option slides.
10. **The tea question is three kinds of question under one label**, and
    every `taught` line opens "Today we".
11. **The parent's close does not persist, and Home reads four things.**
    `DigiPrompts` renders inside a closed `FoldSection` at the foot of Home;
    `TodayCard`'s only control on a row is the ring that means put away; the
    prompts GET selects neither `cta` nor `reason`, returns the three newest
    pending rows, and the PATCH writes `status` only; `moment.ts` holds DiGi
    while any non insight card is pending; `collect.ts:39` lists every
    pending prompt and the Today card counts them; the weekly review cron
    emails only families with a tick or a check in that week and selects no
    `child_id`; Home resolves one child at a time. The passport counts the
    age band's AI modules (parent dashboard), `/path` does not.
12. **The hub reads as the parent's homework**; Explorer is "Ages 11 to 12".

Keep exactly as it is (every lens said so): the answer beat, the near miss
screen's words, the next unpassed lesson always open regardless of the
paywall, stars minted once and never on a replay, the stage check that only
asks what the lessons asked, the characters, the feed mockups, the evidence
slides taught honestly, the content already written on every module, the
child rail, the Today card's one row per thing pattern, the five a day cron's
restraint (one push a day, no push to a child who has not opened the app,
cited to the ICO Children's Code), and the model.

## The model, said once

The child does the lesson in their own app, about fifteen minutes, one a week,
and leaves with a tool they can say in a sentence. The pass is four prove
items with honest distractors on the settled answer; the first tap is the
signal the parent and the Remember check read; under 7 the pass is finishing
it together. The week after, the child logs the tool on their own phone for
seven nights and reads their own pattern; a Remember check comes on a
schedule and asks the tool on new scenarios, three a day until every due
lesson is covered; the stage check at the end only asks what the lessons
asked, missed first. The parent has one job after a pass: let the child teach
them the tool at tea, ask one follow up, then tap Teo taught me on Home, and
the child's app carries the parent's own words back. The week's lesson is on
the child's app by itself, always; the parent sees the state and can nudge
once, in their own name, or do it together on this phone. Every number about
lessons comes from one function. The parent library is for the parent.
Nothing claims an outcome for a child; everything shows what the lesson
taught, what the child did, and what they chose to say.

## Build: four pull requests

Order: D (the content) and A (the loop, the pass contract and the hub) are
built in parallel; D merges first because A makes the prove items the pass;
then B (the player's register and screens), then C (the week). Each is
mergeable the same day and every lesson finish works between merges, because
the route and the payload change in one PR. Migration numbers are claimed in
the draft PR titles and re checked against origin/main right before the first
push (366 and 367 as of 8 October; main reached 365 this afternoon).

### PR D: the content (migration 367 plus the JSON mirrors, merged first)

Every content change lands as a numbered migration with mirrors in
`content/modules`, because six guards read those files. This is an out of
cycle curriculum pass under the term review rule, justified because the
child's check is being rewritten. The classroom deck is untouched: the new
items are child only, so the schools product's hour, its core minutes and its
paper exit quiz stay exactly as signed off, and `check-lesson-core.mjs`,
`check-lesson-minutes.mjs` and `check-lesson-rubric.mjs` skip `kid_only`
slides (one line in each, named in PR D with their output pasted in the
body). (Engineer 3.)

**D1. Four prove items on the 27 KS2 and up decks, kept apart from the
practice.** Two new prove slides per deck flagged `kid_only: true`, and two
more flagged `kid_only: true, reserve: true` for the retake, all written as
parallels: the same `teaching_point` as a worksheet item on a new scenario,
never a sentence the practice cards or a teach slide already show. Module
10's reserve for the nothing verdict: "Forty minutes in a game's lobby after
school. You close it and feel exactly as you did before. The afternoon is
gone. Better, worse or nothing?" Every prove item has three options; every
distractor is one of the module's `misconceptions`, plausible and wrong,
parallel in grammar so none stands out by shape; no right answer is more than
20 percent longer than its longest distractor; in at least one item per
module the moderate sounding answer is the distractor; no correct option
reuses a sentence from a teach slide. The same length rule is applied to the
existing teach items, because they feed the stage check. Each prove item
carries `reteach`, the index of the slide that teaches it (module 10: the
evidence item to 7, the calibrated move to 17, the Priya item to 13), so the
retake re teaches the idea the child missed, not the nearest diagram. The
seven Foundation decks (EYFS and KS1) keep their two prove items and their
two options: at five the pass is finishing it together, and two options read
aloud is the right shape. (Teacher A1 and A2, learning scientist, app lead,
child lens, engineer 2 and 3; Haladyna, Downing and Rodriguez 2002.)

**D2. The family question teaches, with a listen for and a then ask.** Every
`parent_note.family_question` rewritten to one of three shapes: "Can you
teach me how X works", "Explain to me why X", or "What would you tell a
friend who X", with the parent's own life as the subject where the tool
applies (module 10: "Can you teach me the better, worse or nothing check? I
want to run it on my news app"). Each gains `listen_for` (the idea in one
sentence, written fresh in the second person, never trimmed from `taught`)
and `then_ask` (one why or transfer question in the parent's life: "What
would the audit say about my news app?"). No family question opens with
"Which app", "What did you" or "Did you". (Teacher, learning scientist,
child lens.)

**D3. The grown up's words on the seven Foundation decks.** A
`together_prompt` per slide on the EYFS and KS1 modules, one line, from the
classroom script with the cold calls and timers removed. (Teacher, learning
scientist.)

### PR A: the loop, the pass contract and the hub (large, migration 366)

**A0. Migration 366.** `lesson_question_answers` gains `phase text`,
`first_correct boolean` and `run_id uuid` (`correct` becomes the settled
answer; `fetchAnswerFacts` selects both and reads `first_correct ?? correct`
so the stage check's history survives the switch). `kid_lesson_missions`
gains `nudged_at timestamptz`, `child_note text` and `done_together boolean`.
(Engineer 1 and 7, app lead, child lens.)

**A1. One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath({ modules, aiModules, completions, passBy, childId })`
returning `{ school: { done, total, next }, ai: { done, total }, statusById }`,
pure over rows, built on `lessonCreditKeys` and `schoolCreditKey`, with
`aiModules` filtered through `AI_AUDIENCE_TO_STAGE` imported from
`readiness-areas.ts`. `progress.ts` calls it in both functions; the hub's
first tab, `journey.ts` (which gains a `childId`), `daily-tasks.ts`, Home's
own count, `app/api/kid/day/route.ts`, `lib/planet/server.ts` (which counted
a third number) and the Sunday nudge call the same function on the same
rows. Every child surface (the list header, the road, the planets) prints the
school pair, so the child never sees a count that includes modules they
cannot play. `getDailyTasks` at `daily-tasks.ts:1005`, a second reader with
no caller, goes. (Engineer 9, 10 and notes.)

**Decision 1, recommended: the AI modules leave the lessons count.** The
child's list now teaches AI literacy in five modules (22, 23, 24, 25, 34), so
the stamp's AI promise is kept twice over; the AI area in
`readiness-areas.ts` still counts them, and they sit at the top of For you as
"Counts toward Teo's AI area". If Justin keeps the 13 September gate, the
passport reads `school.done + ai.done` and the first tab shows the AI group
in the hero's shape with `Do it together now` only; either way the child
surfaces print the school pair. (Parent UX, engineer.)

**A2. The send route, alive and in the parent's own name.**
`app/api/quests/lessons/route.ts`: `createAdminClient()` for the catalogue
reads only; a `children` read proving `body.child_id` belongs to the caller
(404 otherwise); the lock rule (A9) refused with 403; a mission already
`done` answers `{ ok: true, already_passed: true }`; the upsert keeps an
existing row's `stars`; a nudge inside seven days of `nudged_at` is a no op
answering the date; then `pushToChild` (signature changed to return
`{ sent, reason }` as the ping route does) and `nudged_at` set. Orbit's own
note is the cron's (C1); the parent's nudge says where it came from, mildly:
"Sam gave Orbit a nudge. Still here when you are. No rush." Under the hub's
button: "Teo sees: Sam gave Orbit a nudge. Still here when you are, no rush."
When the cron has already sent this week the button reads "Orbit asked on
Thursday" and does nothing. Never "Sent by Mum", and never the parent hidden
inside the character. (Child lens, engineer notes, parent UX.)

**A3. The pass contract, in one PR.** The player and the route change
together so every finish works between merges. (Engineer 1.)

- `lessonPassed(answers, { together })` in `shared/lesson-slides.ts` next
  to `answerBeat`: the pass is every `prove` item right on its settled
  answer, a `reserve` item standing in for its pair on a retake; when
  `together` is true the pass is every prove item answered. Starter, teach
  and practise items give feedback and are recorded but never gate.
  `reteachIndex(slides, wrongIndex)` reads the item's `reteach`, falling back
  to the last concept or diagram teach slide before it. `ChoiceBlock` gains
  `onSettled(correct)`; `tryAgain` keys on the settled answer, scans `prove`
  items only, jumps to the reteach slide, skips `star-breath` and
  `class-tally` on the way forward, and swaps the failed item for its reserve
  (hidden on a first run, sent with its real index on the retake). The
  payload carries `slide`, `question`, `chosen`, `first_correct`,
  `settled_correct` and a `run_id` per finish. The Nearly screen counts prove
  items only: "Three of the four check questions. One more to get."
  (Learning scientist, teacher, engineer 2.)
- The route reads the deck through the admin catalogue, verifies each
  `question` against the deck slide at `slide`, reads `phase` from the deck,
  drops anything that does not match, treats a missing prove answer as a
  fail, derives `together` from the module's key stage (never the client),
  and computes the pass with `lessonPassed`. The client's `correct` and
  `total` are never read.
- The mission update is the lock: `.update({ status: 'done', ... })
  .eq('status', 'sent').select('id')`, and the completion, the stars, the
  card and the push happen only when a row came back. The player disables
  Continue once posting, so a failing double tap sends one "had a go".
  `done_together` is set when the opener was reached from the hub.
- `recordQuestionAnswers` on every finish, pass or fail, with `phase`,
  `first_correct`, `correct` (settled) and `run_id`, so "this run" is one
  read.
- Stars on the pass only, 10 (`SELF_STARTED_STARS` and the POST default). A
  fail leaves the mission `sent`, pays nothing; the push says the child had a
  go and will have another. A prior `passed: false` completion marks the
  second attempt: that push carries the missed prove item's why line and "Do
  the tricky bit together, five minutes", opening the opener with
  `initialIndex` at the reteach slide, and the hub row reads "Had a go on
  Tuesday. The nothing verdict tripped them." (Teacher, app lead, child lens.)
- Inside `credit()` on the first pass only, one `digi_prompts` row:
  `kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `source: null`,
  `child_id`, `href: '/dashboard/lessons?child=<id>&lesson=<id>'`,
  `cta: 'Teo taught me'`. (Engineer.)
- The push leads with the parent's action, the count built from the items
  and the grown up's first name where set: "Ask Teo at tea: can you teach me
  the better, worse or nothing check? (Passed Mood and screens, all four
  check questions right first time.)" (Parent UX, child lens.)
- `ensureWeekMission(admin, childId)` in `lib/lessons/school-path.ts` beside
  `lockedModuleIds`: idempotent on the unique key, writes the mission row for
  the next unpassed module at 10 stars, no op when none is left. Called by
  the opener, by the hub on render, and daily by the cron (C1), so the hub's
  state is always true and a passed row is followed by the next row at once.
  (App lead C1.)

**A4. The pass is a row in the Today card, labelled, for every child.**
Home reads every pending `lesson_pass:` prompt for the family (by `user_id`,
as the bell does), and `TodayCard` takes `lessonPasses: []`, one row per
child, the pass row leading the card above the week brief. The row: icon
`lessons`, title "Teo passed Mood and screens", line "Ask at tea: can you
teach me the better, worse or nothing check?", body tap opens the hub row.
The control is not the ring (which on every other row means put away): it is
a visible pill on the right edge, `Teo taught me`, Nunito 800, text xs, the
house button border and shadow, 26px tall; the `Row` type gains `action?:
{ label; run }` beside `putAway`. On tap the PATCH commits and the row swaps
in place to its done state and stays for the visit: title "Teo taught you
the mood audit", line "Teo's app tells them: Sam says you taught her the
mood audit. Next up: Social workarounds.", pill filled with a tick. Gone on
the next load because the server has it. Under 7: title "You and Teo did
Stop, look, ask a grown up", line "Ask again at tea: can you teach me the
star pause?" The row stays until the pill or the Sunday email carries it,
whichever first; the Sunday send marks the row `seen` and touches nothing
else. The prompts GET filters `lesson_pass:` server side
(`.not('reason', 'like', 'lesson_pass:%')`) so three passes never empty the
fold, `moment.ts` exempts the prefix from the pending count so Later never
silences DiGi, `collect.ts` tags the row and the Today count excludes it, and
Notifications still lists it. (Parent UX 1, 2, 4; app lead B1; engineer 4,
12 and notes.)

**A5. The taps, with a route, and the parent's words instead of stars.**
`app/api/digi/prompts/route.ts` GET selects `cta, reason, child_id`; PATCH
accepts `reaction` only for `kind = 'celebration'` with a `lesson_pass:`
reason, locks with `.is('reaction', null).select('id')` so Sunday's `seen`
and a `not` tap never kill a later `helped` (a `not` may become `helped`
once), and only when a row comes back pushes the child, through
`pushToChild`, the parent's own words: "Sam says you taught her the better,
worse or nothing check." The week card on the child's home carries the same
line for seven days. No stars on the tap and no `family_quests` insert: a
reward the child expects by week two is neither a surprise nor honest, and a
parent who knows the tap pays the child will tap, so "Teo taught you on
Wednesday" would stop meaning what it says. The 10 star pass is the reward,
and it is on the list card in plain sight. Three taps: `Teo taught me`
(`acted`, `helped`) on the Today row and the hub row; `Had a go, not yet`
(`acted`, `not`) and `Later` on the hub row (Later collapses the three for
the visit). No tap on any token page. The passport row reads "2 of 10 ·
talked about 2"; the hub row "Teo taught you this on Wednesday". (Learning
scientist B, Deci, Koestner and Ryan 1999; engineer 4 and 6; parent UX 3 and
4; child lens.)

**A6. Home reads one thing.** `journey.ts` and `suggestions.ts` take the
count and the next title from A1; the alerts row becomes "Teo's next lesson:
<module>. It is on their app. Do it together or give them a nudge", linking
the first tab, never counting days. `daily-tasks.ts` builds the Lesson rung
from A1. Home's own `stageLessonRows` goes. `moment.ts` and `word.ts` label
`/dashboard/lessons` as "Teo's lessons". (Engineer, app lead.)

**A7. The Sunday email says it back, from data, to the family that did the
lesson.** The weekly review cron gates on `school_lesson` completions this
week as well as ticks and check ins, and `gatherWeek` selects `child_id`,
splits ids by `lesson_source` and titles the school ones through
`starLessonTitles` (and `starLessonNotes`, one `.in('id', ids)` read each).
`weeklyReviewEmail` gains a "Lessons this week" block after the stats table,
built like "What has moved" from `stats.lessonPasses[]` and
`stats.stuckLesson`, in fixed words:

- "Teo passed Mood and screens on Tuesday, all four check questions right
  first time. Teo taught you the better, worse or nothing check on
  Wednesday." Under each pass not yet tapped: "When Teo has taught you, tap
  Teo taught me on Teo's lessons", linking the hub row.
- A `not` reaction: "Worth one more go at tea this week. The idea comes back
  in Teo's Remember check."
- The child's sentence, quoted, labelled "Teo said", when one exists.
- The retention line, sourced from the Remember check only: "On Thursday's
  Remember check Teo got last week's question right first go."
- The stuck line, once per mission, on the first Sunday after seven days
  unopened, never in the same email as a pass line for the same lesson:
  "The next lesson, Social workarounds, has been on Teo's app for a week.
  Fifteen minutes on the sofa would do it, or leave it, there is no deadline.
  If you mention it, Orbit's question is: does your feed leave you better,
  worse or nothing? Ask it about your own phone first."

(Parent UX 3 and 7, learning scientist, app lead notes, engineer 5, child
lens.)

**A8. One door.** `/dashboard/lessons/path` becomes a redirect to
`/dashboard/lessons` preserving `stage`, `child`, `lesson` and `from`; the
first tab scrolls to `[id="lesson-<id>"]`; `?stage=` opens the first tab and
honours a stage other than the child's own; `BackTo` gets the
`/dashboard/pathway#passport` fallback. (Engineer.)

**A9. The lock rule, once.** `lockedModuleIds(modules, passedIds, paid)` in
`school-path.ts`, used by the child's list, the hub, the opener (which reads
`hasFullAccess` from `profiles` as the list does and redirects when locked)
and the POST. (Engineer.)

**A10. The hub's first tab**, in the order a thumb reads it:

1. Eyebrow, mono, from `stages.ts`: `STAGE 3 · EXPLORER · AGES 11 TO 12`.
   No stage chips; `See what Stage 4 covers` at the foot opens `?stage=4`
   with "You are looking at Stage 4. Teo's own stage is 3."
2. Heading `Teo's lessons`. Under it: "Teo does these on their own app, one a
   week. Your job is one question at tea."
3. Tabs: `Teo's lessons · 10`, `For you · 26`, `Watch together · 10`. Films
   second only at Stages 1 and 2; the order is computed before the `TABS`
   block so the block stays free of `childStageNum`.
4. The progress line from A1: "2 of 10 passed. Each pass ticks the passport."
   At zero passes no bar and no counts. After the first pass `2 passed` and
   `8 to go`.
5. The hero: the week's lesson, whose row always exists (A3
   `ensureWeekMission`). Eyebrow `THIS WEEK FOR TEO`, the title, the
   module's `single_action_outcome`, "About 15 minutes on their app", the
   state, the buttons, then "One a week is plenty." The state, read from the
   row and capped so it is never a guilt counter: "On Teo's app from today"
   on Monday, "On Teo's app since Monday" inside seven days, "since last
   week" inside fourteen, then "Waiting on Teo's app" with no date. After a
   pass this week the hero reads "Passed Tuesday" with the tea question and
   then "Next: Social workarounds, on Teo's app now".
6. The buttons: `Give Teo a nudge` (A2; "Orbit asked on Thursday" when the
   cron has sent; "Nudged on Tuesday" after a tap) and `Do it together now`,
   every age, opening `/k/[token]/school/[id]?from=hub` on this phone, with
   "Together means you read it out and Teo taps the answers. Either way the
   pass lands on Teo's passport." `Send to Teo's phone` no longer exists:
   the lesson is on the child's app by itself. No app yet (Stage 2 and up
   only): the buttons are replaced by "Teo's lessons live on their own app,
   and Teo has not opened it yet. Nothing to install: show them the code and
   it opens on their phone, a tablet or the family laptop", primary `Show Teo
   the code` to `/dashboard/setup#share` (verified: `SetupQuest.tsx:210`
   renders the anchor), secondary `Do it together now`, which creates the kid
   link through the existing quests route when none exists and then opens.
   Under 7 the no app block never renders; `Do it together now` is the only
   button, full width; the line under the heading reads "At this age you do
   them together, on your phone. You read it out, Teo taps the answers.
   Twelve minutes on the sofa, one a week."
7. The list in teaching order, compact rows, no buttons on rows. A passed row
   shows the tick; "All four check questions right first time" or "Right
   first time on 3 of 4, the nothing verdict took a second go", built from
   the count; "Done together on Saturday" at any age when `done_together`;
   "What the lesson taught: the mood audit. Close it, ask better, worse or
   nothing, log one word" (from `teacher_notes.tool`); the tea question with
   `LISTEN FOR` and `THEN ASK`; `TEO SAID` when there is one; the three taps;
   the talked state. Under 7 a passed row shows "Done together on Saturday"
   and "What Teo said" only. Ahead rows are quiet; locked rows say "Opens in
   order on Teo's app". A nothing left state: the hero becomes the stage
   check card.
8. The stage check card mirroring the child's: "The Stage 3 check opens on
   Teo's app once all 10 are passed, and it only asks what the lessons asked.
   Passing it earns the stamp."
9. "Worried about social media in particular? The Social Media Ready ramp is
   in For you." The ramp card moves to the top of For you.
10. The school code card, as now.

Two children: the heading, the tab label and the row eyebrow carry the name;
the nudge takes its child id from the page's resolved `child`;
`LessonsBrowser` keeps `key={child?.id}`. The library tab opens with
"Written for you, not for Teo. Read one when you want the thinking behind a
lesson, or the words for a hard conversation. These do not move Teo's
passport." No "n of N" on it. The Stage 1 card keeps `childStageNum === 1`
for the guard and points at Do it together; the `pastTheFilmYears` card's
button opens the first tab and `check-watch-stage-copy.mjs` lines 84 to 90
change with it (the count becomes the A1 school total). `moduleInReach`,
`sendable`, `pastTheFilmYears`, `libForStage` and `watchShown` survive the
rewrite. (Parent UX, app lead, engineer 14.)

**A11. Guards rewritten in the same commit as the code.** Rules 1, 3 and 4
of `scripts/check-lesson-path.mjs` each read a literal this PR removes; they
are rewritten to the new truths, and guard 3 runs green on PR A alone because
`lessonPassed` is imported by both files in one commit. (Engineer 1 and 3.)

**A12. The walkthrough gate.** Before PR A merges, on the live database with
a test family, pasted into the PR body: the Monday row present before any
tap; a nudge inside quiet hours showing its state; a fail, then a retake on
the reserve item, then a pass (mission stays `sent`, no stars, no card, then
pays once); a double tap on the last slide (one card, one push); two children
with one sibling pass (two Today rows, the other's hub and passport
untouched); the Today pill, the swap in place, and the parent's words on the
child's side; a `Teo taught me` tap after Sunday has marked the row `seen`
(it still counts); `/dashboard/setup#share` landing; the time of the ks3-10
kid deck on a real phone (over eighteen minutes, cut a scenario slide before
the title says fifteen); the stage check pool size. (All six.)

### PR B: the player for one child, and for a sofa (medium, no migration)

**B1. The deck for one child.** In `kidMode`: a discussion slide renders as
"Think it: <prompt>" with one word typed or a two chip pick before "Show me"
reveals the `lookFor` line as "A good answer sounds like" (a reveal alone is
active, not constructive); the tryit renders the worksheet items as unscored
verdict cards, "Your turn. Six real closes. Better, worse or nothing?", with
the `teaching_point` as the why after each tap, class tallies hidden, label
"Your turn · tap your verdict", only in the ten decks with no verdict sort
already in their practise phase, minus any item used as a prove or reserve,
and as "Think it" cards with the teaching point on tap in the decks without
`expected_verdict`; elsewhere the tryit is skipped because the practice sort
already does the job; the class tally becomes one tap on the child's own
verdict; the half time slide (its prompt is in `config.prompt`) reads "Two
breaths with Orbit. Then one thing that surprised you, in your head"; the
title slide says "About 15 minutes"; the starter is labelled "Warm up from
an earlier lesson. No score, have a guess" when no passed module precedes
this one and is kept out of the stage pool in that case; the deck's passport
slide is skipped; concept slides show their one line recap above the
paragraph; the next lesson's title slide reads the previous mission's
commitment from `localStorage`: "Last time you said: TikTok". Saved place
per mission in `localStorage` under the mission id, capped at the slide
before the first prove item, offered as "Carry on from where you were, on
this phone". (Teacher, learning scientist notes, child lens, app lead,
engineer 11 and 13.)

**B2. The pass screen, in the order a 12 year old wants it.**

1. The tool, big: `teacher_notes.tool`.
2. The commitment, as the module's `commitment_stem` with its blank first,
   then an optional sentence. Both are his: they fill his week card (C2) and
   stay on this phone. A separate tap, "Show my grown up", writes them to
   `child_note` (200 characters, plain text) and they appear on the parent's
   row as `TEO SAID`. The box never says "this is what your grown up sees".
3. The score with its shape: "All four check questions right first time",
   or the one that took two goes with its one line why.
4. The tea question, told to the child first, with the grown up's first name
   where set: "Sam will ask you at tea: can you teach me the better, worse or
   nothing check? You are the one who knows it."
5. "Next up: Social workarounds. Open now, or it is next week's card."
6. The dignity line: "Your passport ticked. Your grown up sees the tick,
   which check question took you two goes, and your own words if you choose
   to show them. Never which answer you picked." Nothing about stars.

(Child lens, teacher, app lead.)

**B3. Together mode for under 7.** Keyed off `isTogetherStage`: every slide
carries its `together_prompt` as a quiet "Say:" strip; discussion slides read
"Ask each other:" with no timer; sheet and circle time slides are skipped.
The together deck keeps the lesson: the star breath, the friend's question,
the three words, the diagram, a photo is real and dragons are made up, the
sort, who is a grown up you could ask, the two prove items, three fingers,
the chant with actions, Fill the page showing the real passport, and the
goodbye, about twelve minutes. The pass screen reads "You did it together",
the tool as a chant, "What did Teo say?" for the grown up to type into
`child_note`, and "Tonight at tea, Teo teaches you the star pause. Then tap
Teo taught me on your Home", with a `Back to your Home` button shown only
when the opener was reached with `from=hub`, never to a child holding the
link alone. No tap on this screen. (Child lens, teacher, learning scientist,
parent UX 6, engineer 6.)

**B4. The stage check asks the child's lessons, on new scenarios, marked
server side.** `stage-quiz-gather.ts` exports `questionsFromSlides` and
`standsAlone`, takes a source, and gains a worksheet source; the kid route
passes the child's school modules through a `starLessonDecks(admin, ids)`
sibling in the catalogue, ordered by `first_correct ?? correct` history, with
at least one verdict item per lesson beside the prove items; the stage quiz
route marks against the pool rather than `body.correct`. The parent pathway
keeps the library. (Learning scientist, engineer.)

**B5. The child's list tells the whole truth.** Each card wears its friend
and its tool ("Orbit: the mood audit · 15 min · 10 stars"); the passed chip
reads "Passed"; a ten dot strip on the list header shows the road with the
stage check at the end, from the A1 school pair; the locked row reads "After
Social workarounds, this one is waiting for you" (never "ask your grown up
to open this one"); and the once line reads "Your grown up sees when you
open it, which check question took two goes, and if one trips you twice they
get that question to do with you. Never your taps." (Child lens, app lead.)

### PR C: the week (medium, no migration)

**C1. The week's lesson is on the child's app by itself, always.** The five
a day cron (`app/api/cron/five-a-day/route.ts`) gains its own loop over
`kid_links` before the `kid_days` gate: `ensureWeekMission` for every child
(under 7 keyed on children, not links, so the Foundation week exists without
an app), and Orbit's note once per mission on the weekday this child most
often opens the app (one grouped 28 day `kid_days` read, Saturday when there
is no history). The cron's own rule is rewritten in its comment block and
kept: the note is a reminder of one named thing on the child's own list, it
goes once per mission whether or not there is a row today, it replaces the
daily push on that day, there are never two in a day, and a mission gets at
most two pushes ever (the note and one parent nudge); from week three the
card alone carries "No rush." At Foundation the note goes to the parent
instead, once per mission: "Teo's lesson this week: Screens and kindness.
Twelve minutes on the sofa, you read, Teo taps." The child's home shows
"This week's lesson: Mood and screens. Orbit: the mood audit · 15 min · 10
stars. Any day this week", directly above `KidFiveADay`, replacing the "Star
lessons from your grown up" section, which goes; week two unpassed the line
is the tool, week three "No rush. It is here when you are." `pickDay` stops
drawing the lesson and the quiz; the `LEARNING` pair in `stepForToday`
retires so a lesson pass never ticks the Remember check, and
`check-learning-step.mjs` is rewritten; an unpassed lesson never fails a
day's run; `app/api/kid/day/route.ts` drops its missions read and
`lessonAlreadyThisWeek`. (App lead C1 and C2, engineer 6, 8 and 9, child
lens, teacher, parent UX 5.)

**C2. The log runs seven nights from the pass.** After a pass the week card
holds the commitment and the tool with three buttons: "Last close: Better ·
Worse · Nothing. Stays on your phone. Seven nights from tonight", stored in
`localStorage`, never sent, a strip under whatever lesson card is current
until it has seven dots. On the seventh night, one line in his words: "Your
week: 4 better · 2 nothing · 1 worse. That is your pattern. One calibrated
move is yours to pick, or not." Then it folds to a small "Last week" row for
seven days. The parent's words from A5 sit on the same card for seven days.
(Child lens, teacher; Gollwitzer and Sheeran 2006, Harkin et al 2016.)

**C3. The Remember check, real and scheduled.**
`app/k/[token]/remember/page.tsx`: the token check; this child's passed
school modules; decks through `starLessonDecks`; three questions, one tap
each with the why (no second go, so "right first go"); the first draw for a
lesson asks its original prove item and one verdict item, later draws ask
the reserve and verdict items so the check tests the tool, not the green
option; `KidStageQuiz` at length three with no stamp and no stakes, and one
line on the page: "No stars, no stamp. Your grown up's Sunday note says how
it went. The one that tripped you first, then two more." A token POST
records answers under `source: 'remember'` with `lesson_id` and ticks
`markStepQuietly(…, 'quiz')`. The due rule in a pure `lib/kid/remember-due.ts`,
guarded on fixtures: a lesson is due 5 to 9 days after its pass, again at
30, then every 90 days until the stage check is passed; due lessons are
ranked missed first then longest overdue; three questions a day; lessons not
covered stay due and lead the next day's draw; a missed item is due in the
next draw; the check is never forced on a day the next lesson is already
passed. `loadDay` forces the `quiz` step into the day, replacing a middle
row (so a Foundation day stays four), when anything is due, and never
otherwise, so a week one child never meets an unfinishable day. A forced
check left undone fails the day and the daily push names it, which is its
carrier for free. (Learning scientist, app lead, engineer 6.)

## The copy, exact

**The Today row.** Title "Teo passed Mood and screens". Line "Ask at tea:
can you teach me the better, worse or nothing check?" Pill `Teo taught me`.
Done state: "Teo taught you the mood audit" and "Teo's app tells them: Sam
says you taught her the mood audit. Next up: Social workarounds." Under 7:
"You and Teo did Stop, look, ask a grown up" and "Ask again at tea: can you
teach me the star pause?"

**The hub row after a pass.** Eyebrow `TEO PASSED A LESSON`. Title: the
module. "What the lesson taught: the mood audit. Close it, ask better, worse
or nothing, log one word." "All four check questions right first time,
Tuesday 4.10pm." `TEO SAID` when there is one. `ASK AT TEA`, `LISTEN FOR`,
`THEN ASK`. Buttons `Teo taught me` · `Had a go, not yet` · `Later`. Never
"Teo learned", "now knows", "can now" or "Today".

**The push to the parent.** "Ask Teo at tea: can you teach me the better,
worse or nothing check? (Passed Mood and screens, all four check questions
right first time.)" Second fail: "Teo had a second go at Mood and screens and
the nothing verdict tripped them. Do the tricky bit together, five minutes."

**The pushes to the child.** Orbit's, from the cron: "Orbit has a question
for you. Does your feed leave you better, worse, or nothing? Fifteen minutes,
10 stars, any day this week." The parent's nudge: "Sam gave Orbit a nudge.
Still here when you are. No rush." After the tap: "Sam says you taught her
the better, worse or nothing check."

**The child's list card.** "Orbit: the mood audit · 15 min · 10 stars", and
once: "Your grown up sees when you open it, which check question took two
goes, and if one trips you twice they get that question to do with you.
Never your taps."

**The Sunday lines.** In A7.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| Pass is the prove items on the settled answer, first tap recorded; feedback on every option | Kornell, Hays and Bjork 2009; Butler and Roediger 2008; Soderstrom and Bjork 2015 (performance during acquisition is an unreliable index of learning, so the first tap is the signal and the gate is for learning) | Learning scientist, teacher, child lens |
| Four prove items, honest distractors, no length cue, kept apart from the practice | Haladyna, Downing and Rodriguez 2002 (item writing, item independence); Little, Bjork, Bjork and Angello 2012; Roediger and Karpicke 2006 | Teacher, learning scientist, app lead |
| The retake re teaches the idea missed, then re asks a parallel item | Rosenshine 2012; Rawson and Dunlosky 2011 | Learning scientist, teacher |
| Practice before the prove, constructive not passive | Rosenshine 2012; Chi and Wylie 2014 (ICAP: generating beats revealing) | Teacher, learning scientist, child lens |
| Remember check at 5 to 9 days, 30, then every 90; three a day until covered; application items | Cepeda et al 2008; Rawson and Dunlosky 2022; Kang 2016; Butler 2010 (transfer to new questions); Pan and Rickard 2018 | Learning scientist, app lead |
| Once a week, fixed, forgiving | Dunlosky et al 2013 (distributed practice); the product's own data once it runs. Duolingo's streak figures are a company blog, read as practice | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| No reward on the parent's tap; the parent's words instead | Deci, Koestner and Ryan 1999 (performance contingent tangible rewards undermine, more so for children) | Learning scientist |
| The commitment stem and the seven night log | Gollwitzer and Sheeran 2006 (implementation intentions); Harkin et al 2016 (progress monitoring) | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps; the pass is finishing it | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek et al 2015; Takeuchi and Stevens 2011 | Learning scientist, teacher, child lens |
| The parent sees what the lesson taught and a tap that does something | EEF parental engagement (an average across very different programmes, as the toolkit says); Sparx's parent email and Khan's family engagement research, read as practice | App lead, parent UX |
| The week's lesson is the app's own; the parent's nudge is in the parent's name | Grolnick 2002 and 2009 (autonomy support against control); Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| Fifteen minutes on a phone; twelve at five | A judgement, checked on a real phone in the walkthrough. The Oak evaluation (ImpactEd 2021) supports a phone first player, not a length | Child lens, teacher |

## What the guard asserts (`scripts/check-lesson-path.mjs`, rewritten rules 1, 3 and 4, plus these)

1. `lesson-path.ts` takes `passBy`, returns the school and AI pairs apart, and
   is imported by `progress.ts` (twice), the hub page, `journey.ts`,
   `daily-tasks.ts`, `app/api/kid/day/route.ts`, `lib/planet/server.ts` and
   the weekly review; no file under `app/(dashboard)/dashboard/lessons/` does
   its own count or redeclares an `age_7:` map; `getDailyTasks` is gone.
2. Fixture run with no database: two children with one sibling pass, a
   failed run, a retake after a fail, a legacy null child row, a stage with
   two AI modules; assert the pairs per child, that the hub's row count
   equals the passport's school total, and that the list header and the road
   agree under both answers to decision 1.
3. `shared/lesson-slides.ts` exports `lessonPassed` and `reteachIndex`;
   `LessonPlayer.tsx` and the route import `lessonPassed` in the same commit;
   neither contains `0.7`; `tryAgain` references `prove`, `reteachIndex` and
   `reserve`; a fixture deck with a reserve item passes when the reserve
   stands in for its pair; a Reception fixture with one settled miss passes
   with `together`; the route verifies `question` against the deck at
   `slide`, reads `phase` from the deck, derives `together` from the key
   stage, fails a run with a missing prove answer, and calls
   `recordQuestionAnswers` with `source: 'school_lesson'`, `phase`,
   `first_correct` and `run_id`.
4. Migration 366 exists; `answers.ts` inserts the new columns;
   `fetchAnswerFacts` selects `first_correct` and `correct` and coalesces.
5. The mission update has `.eq('status', 'sent')` and `.select(`; the
   completion, the stars, the card and the push sit inside the returned row
   branch; the `digi_prompts` insert has `kind: 'celebration'`, `reason:
   \`lesson_pass:${`, `child_id`, `cta`, a `lesson=` on the href, and sits
   inside `credit()`; the push literal matches A3.
6. `app/api/quests/lessons/route.ts` reads the catalogue through
   `createAdminClient()`, reads `children` for ownership, calls
   `pushToChild(`, returns early on a `done` mission and inside seven days of
   `nudged_at`, and its push text contains the parent's name slot and never
   "Sent by"; `pushToChild` returns `{ sent, reason }`;
   `ensureWeekMission` is exported from `school-path.ts` and called by the
   opener, the hub page and the cron.
7. The lock rule is one exported function used in four places, and the
   opener reads `hasFullAccess`.
8. The prompts GET selects `cta, reason, child_id` and filters
   `lesson_pass:` server side; the PATCH writes `reaction` only for
   `celebration` with a `lesson_pass:` reason and locks with
   `.is('reaction', null)`; no `family_quests` insert exists in the prompts
   route; no file under `app/k/` or `app/api/kid/` writes
   `digi_prompts.reaction`; the weekly review's `seen` write does not touch
   `reaction`.
9. `TodayCard` takes `lessonPasses` and renders a labelled `action` pill on
   those rows, never the ring; `DigiPrompts` skips `lesson_pass:`;
   `moment.ts` exempts it from the pending count; `collect.ts` tags it and
   the Today count excludes it.
10. The weekly review cron gates on `school_lesson` completions;
    `weekly-review.ts` selects `child_id`, calls `starLessonTitles(` and
    splits on `lesson_source === 'school_lesson'`; `templates.ts` renders a
    "Lessons this week" block from `stats.lessonPasses`; the retention line's
    source is `remember`; the stuck line and a pass line never share a lesson
    id.
11. The library copy matches neither `/move .{0,30}progress/i` nor
    `/lessons you lead/`; the first tab never links `/dashboard/lessons/[id]`
    and never `/dashboard/ai-module/` without `data-do-together`; no card,
    row or push body contains "learned", "now knows", "can now", "Today" or
    "Sent by"; no child facing lesson screen contains "screen time" or
    "stars" on the pass screen; the kid list contains no "ask your grown up
    to open".
12. `/path` is a redirect preserving `stage`, `child`, `lesson`, `from`;
    `passport-sections.ts` still links `/dashboard/lessons/path?stage=`; the
    first tab carries `data-do-together` and `schoolModulesForStage`.
13. `check-watch-stage-copy.mjs` lines 84 to 90 match the A1 school count and
    the `TABS` block is free of `childStageNum`.
14. `'lesson'` and `'quiz'` are absent from `ROTATING`; the `LEARNING` pair
    is gone and `check-learning-step.mjs` is rewritten; a fixture day for a
    child with zero passes and nothing due completes without a quiz step; a
    forced quiz replaces a middle row; `/k/[token]/remember/page.tsx` exists
    before `five-a-day.ts` points at it; `questionsFromSlides` and
    `standsAlone` are exported; `remember-due.ts` passes its fixtures (5 to
    9, 30, 90s; ten due lessons give three a day until covered; never on a
    day the next lesson is passed); in the cron the ensure and the note sit
    before `if (!row) continue`, and no mission gets a third push.
15. The kid quiz page's pool comes from `schoolModulesForStage` with a
    worksheet source, and the stage quiz route marks from the pool.
16. The saved place is capped at the first `prove` index; `child_note` is
    capped at 200 characters; `KidQuestScreen.tsx` contains no "from your
    grown up".
17. Content: every KS2 and up module has four `prove` choice slides, two of
    them `kid_only`, plus two `kid_only` `reserve` slides, each with three
    options and a `reteach` pointing at an earlier teach slide; no prove or
    reserve text matches a practice card or a teach sentence in the same
    deck; no right answer more than 20 percent longer than its longest
    distractor on any choice slide; the seven Foundation decks keep two prove
    slides; `listen_for` and `then_ask` on every module; no family question
    opening with "Which app", "What did you" or "Did you"; `together_prompt`
    on every slide the together deck shows; `check-lesson-core.mjs`,
    `check-lesson-minutes.mjs` and `check-lesson-rubric.mjs` skip `kid_only`
    and pass, output pasted in PR D's body.
18. `check-lesson-age-gate.mjs`, `check-watch-stage-copy.mjs`,
    `check-co-watch.mjs`, `check-digi-step-in.mjs` and
    `check-day-by-age.mjs` still pass, listed in each PR body as run.

## The loop, end to end, after

Monday the cron makes sure Mood and screens is on Teo's app and Teo's home
shows the week card; the hub shows `THIS WEEK FOR TEO`, "On Teo's app from
today", a nudge and Do it together. Thursday evening Orbit's note arrives,
because Thursday is when Teo opens the app, and it replaces that day's push.
Teo gets fifteen minutes in the kid register: a word typed before each Show
me, six real closes to sort before the check, four prove items with honest
distractors, a saved place if the doorbell goes. A miss on the nothing
verdict re teaches the mood audit slide and asks the lobby scenario instead.
The pass screen hands over the tool, the commitment blank, the tea question
coming, and "open now or next week's card". The route verifies every answer
against the deck, locks on the status change, records first tap, settled and
the run, writes the completion (passport ticks), pays 10 stars once, pushes
"Ask Teo at tea: can you teach me the better, worse or nothing check?",
writes the card, and makes sure the next lesson's row exists. Home shows the
pass as the first row in the Today card with a `Teo taught me` pill, one row
per child. At tea Teo teaches it and the parent asks the then ask; the parent
taps the pill; the row swaps to "Teo taught you the mood audit" and stays;
Teo's app says "Sam says you taught her the better, worse or nothing check".
On the week card Teo logs one word a night on the phone and on night seven
reads his own pattern. Six days after the pass the Remember check is forced
into the day: the item he missed, a new scenario for the same tool, and one
more. Sunday's email names the pass, the conversation, the Remember result
and the sentence Teo chose to show. If a lesson sits for a week the next
Sunday says so once, with no deadline and Orbit's question for the parent's
own phone. Under 7 the Monday row exists without an app; the parent taps Do
it together, reads the "Say:" strip, the child taps, the pass is finishing
it, the parent types what Teo said, taps Back to your Home, and the pill
waits there. At the end of the stage the check asks only what Teo's own
lessons asked, on new scenarios, the ones Teo missed first.

## Decisions for Justin

1. The AI modules leave the lessons count (recommended), or stay with the
   13 September gate and show on the first tab as Do it together.
2. Stars: 10 for a pass, nothing on the parent's tap (recommended by the
   learning scientist on the evidence and for the honesty of the Sunday
   line; the app lead and the child lens had wanted 2 as a surprise). The
   parent's words reach the child instead. If you want stars on the tap,
   they are said openly on the pass screen as part of the lesson's reward,
   never hidden. The app lead also suggests a film's first watch from 10 to
   5; the plan assumes 10 stays.
3. Four prove items on KS2 and up now, in PR D, as child only slides so the
   classroom deck is untouched (recommended); the seven Foundation decks keep
   two.
4. The order: D and A together, D merged first, then B, then C. All four
   before the schools pilot families reach the first KS3 module.

## Not building, and why

- A new assignment table, a new player, a new push path or a new cron: the
  missions table, the star lesson player, `pushToChild`, the five a day cron,
  the Today card and the Sunday review already do the work.
- Stars for the parent library, stars on the parent's tap, a first tap bonus
  on a school lesson (it would reward the exact signal the parent reads).
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson, a weekly lesson run counter, a date on Home's
  alerts row.
- A lesson day setting: the note goes on the day the child already opens the
  app. A voice note: text first. A keepsake surface in the child's passport
  and a stage certificate: later, once the loop has run a term. The class
  tally rendered as the class the child joined: per module content, later.
  The seven night log holds only if PR C runs long; nothing reads it.
- More Foundation modules: seven exist for ages 4 to 7, a term at one a
  week; more belong to the curriculum cycle.
