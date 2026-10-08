# 8 October 2026: Lessons, version 3. The child learns it, the parent closes it, and both can see it stuck

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

Three versions so far, each sent to the same six lens panel: a teacher, a
learning scientist, a learning app product lead, a parent UX reviewer, a
sceptical engineer and a child lens (a 12 year old alone, a 5 year old on the
sofa). Scores out of 10 on A (the child learns, best proven methods), B (easy
for the parent, a wow) and C (the loop runs):

| Lens | v1 A/B/C | v2 A/B/C |
|---|---|---|
| Teacher | 6/5/5 | 7/8/7 |
| Learning scientist | 7/6/6 | 8/8/7 |
| Learning app lead | 6/5/5 | 8/8/7 |
| Parent UX | 3/4/3 | 8/7/6 |
| Sceptical engineer | 4/5/5 | 6/7/5 |
| Child lens | 5/5/4 | 7/8/7 |

The reviews are in the session scratchpad (`lessons-review/round1/` and
`round2/`). Version 1 was right about the model and the shape and wrong about
what was underneath. Version 2 fixed the underneath and the panel found the
same six gaps from six directions: the check items themselves, a Remember
check with no page and no schedule, three fields with no columns, a pass card
in a closed fold, a parent tap with no route, and a finish that can run twice.
Version 3 closes them. Every change carries the lens that asked for it.

## What is true today (verified in the code and the live database, 8 October)

1. **The loop has never run.** Live: 0 `school_lesson` completions, 0
   `stage_quiz_passes`, 2 `kid_lesson_missions` ever, 0 answers with source
   `school_lesson`. Nothing in the 29 September model has been exercised by a
   real child.
2. **The parent send route is dead.** `app/api/quests/lessons/route.ts` reads
   the catalogue with the parent's RLS client; migration 274 revoked
   `schools.school_lessons` from `authenticated`, so every POST answers 503.
   It never pushes the child, never checks ownership, resets a passed mission
   to `sent`, and has no paywall check. `pushToChild` returns nothing and
   leaves in quiet hours before any read.
3. **The check does not measure the lesson.** The pass is 70 percent of every
   choice slide, first tap only, written twice (`LessonPlayer.tsx:1481`,
   `lesson-complete/route.ts:71`) and trusted from the client. Every deck has
   exactly two `prove` items. Across the 34 decks, 53 of the 68 prove items
   have the right answer as the longest option (48 by a quarter or more), and
   10 prove items have only two options, on which `answerBeat` gives no second
   go. In KS3 module 10 the right answer is the longest on all five choice
   slides, teach items included, and those feed the stage check. The starter
   of the first module in a stage scores a recall of a lesson from the
   previous key stage. The retake (`tryAgain`) rewinds to the slide before the
   first wrong answer and re asks the same question whose answer the child
   just watched turn green.
4. **Stars pay on completion, not the pass.** `status: 'done'` pays
   `mission.stars` whether or not the child passed, and the parent is told
   "3 stars landed" on a fail. A lesson is 3, a first film watch 10, a two
   minute mini lesson 3 plus 1 bonus.
5. **The child's answers are thrown away.** The mission branch never calls
   `recordQuestionAnswers`; migration 239 holds `question`, `chosen`,
   `correct` and nothing else, so first tap and settled answer cannot both be
   kept without a column.
6. **The child's stage check draws from the parent library.**
   `stage-quiz-gather.ts:128` reads `from('lessons')`; the kid quiz page uses
   it; `app/api/kid/stage-quiz/route.ts:27` trusts `body.correct`.
7. **The week between lessons is a dice roll.** `pickDay` draws the lesson
   row by seed into the middle slots (roughly one week in four with no prompt
   at Stage 2 and up); a drawn undone lesson fails the day's run and
   `lessonAlreadyThisWeek` then withholds it; the quiz row links to `?quiz=1`
   which the page ignores; `/k/[token]/remember` does not exist; nothing comes
   back after a pass before a stage check that can be a year away.
8. **The child meets the classroom deck.** Six to ten slides per module ask
   for a partner, a worksheet, a tally or a timer; the half time prompt lives
   in `config.prompt`, not `script`, so stripping the script leaves "write it
   on your sheet"; the title slide says one hour; the deck's passport slide
   fills a pretend page; no saved place. Every module carries
   `commitment_stem`, six `worksheet_items` with `expected_verdict` and
   `teaching_point`, and `misconceptions`, none of which the child's version
   uses.
9. **Under 7 the grown up's words are stripped**, and the two prove items in
   the first Reception deck are two option slides, so the first tap is a coin
   flip and there is no second go.
10. **The tea question is three kinds of question under one label**: teach,
    apply, quiz. Module 10 tells the child "Nobody else gets your data" and
    then asks the parent to ask for it. Every `taught` line opens "Today we",
    the school letter's voice.
11. **The parent's close does not persist, and Home reads four things.** The
    push is the only close. `DigiPrompts` renders inside a closed
    `FoldSection` at the foot of Home, shown only from day three, so a card
    there would not catch a missed push. The prompts GET selects neither `cta`
    nor `reason`, the PATCH writes `status` only, and `moment.ts` refuses to
    step in while any non insight card is pending. `journey.ts`,
    `daily-tasks.ts`, Home's own count and DiGi's labels each read the parent
    library; the passport counts the age band's AI modules (played on the
    parent dashboard), `/path` does not. The Sunday email cannot name a school
    pass and its lesson lines are prompt material, not rendered data.
12. **The hub reads as the parent's homework**, and Explorer is "Ages 11 to
    12" in `stages.ts`, not 11 to 13.

Keep exactly as it is (every lens said so): the answer beat, the near miss
screen's words, once a week counted as offered, the next unpassed lesson
always open regardless of the paywall, stars minted once and never on a
replay, the stage check that only asks what the lessons asked, the
characters, the feed mockups, the evidence slides taught honestly, the
`taught`, `try_this`, `tool`, `worksheet_items` and `commitment_stem` already
written on every module, the child rail, the Today card's one row pattern,
and the model.

## The model, said once

The child does the lesson in their own app, about fifteen minutes, one a week,
and leaves with a tool they can say in a sentence. The pass is four prove
items with honest distractors, settled answer, and the first tap is the
signal the parent and the Remember check read. The week after, the child uses
the tool on their own phone and is asked to remember it on a schedule; the
stage check at the end only asks what the lessons asked, missed first. The
parent has one job after a pass: let the child teach them the tool at tea,
then tap Teo taught me on Home, which lands two stars on the child as a
surprise. The lesson is on the child's app every Monday by itself; the parent
sees the state and can nudge, or do it together on this phone; under 7
together is the way and the grown up gets the words to say. Every number
about lessons comes from one function. The parent library is for the parent.
Nothing claims an outcome for a child; everything shows what the lesson
taught, what the child did and what they chose to say.

## Build: four pull requests

Order: A and D are built in parallel; D (the content) merges first because A
makes the prove items the pass; then A, B, C. Each is mergeable the same day.
Migration numbers are claimed in the draft PR titles and re checked against
origin/main right before the first push (366 and 367 as of 8 October; main
reached 365 this afternoon).

### PR A: the loop and the hub (medium, migration 366)

**A0. Migration 366.** `lesson_question_answers` gains `phase text` and
`first_correct boolean` (`correct` becomes the settled answer; the first tap
is what `orderPoolByHistory` reads, so it switches to `first_correct`).
`kid_lesson_missions` gains `nudged_at timestamptz` and `child_note text`.
(Engineer 1, app lead B3 and C2.)

**A1. One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath({ modules, aiModules, completions, passBy, childId })`
returning `{ done, total, next, statusById }`, pure over rows, built on
`lessonCreditKeys` and `schoolCreditKey`, with `aiModules` filtered through
`AI_AUDIENCE_TO_STAGE` imported from `readiness-areas.ts` and never
redeclared. `progress.ts` calls it in both functions; the hub's first tab,
`journey.ts` (which gains a `childId`), `daily-tasks.ts`, Home's own count,
`app/api/kid/day/route.ts` and the Sunday nudge call the same function on the
same rows. Home runs `getAllStagesProgress` once already; nothing adds a
second read. Answers are not part of the count and stay in the hub.
(Engineer 9 and 10.)

The number: **recommended, decision 1 below: the AI modules leave the
lessons count.** The scheme now teaches AI literacy inside the child's own
list (modules 22, 23, 24, 25 and 34), so the stamp's AI promise is kept twice
over, and tiles the parent plays on their own dashboard under "Teo does these
on their own app" is the thing Justin saw in September. One line in
`childLessonPath`, the AI area in `readiness-areas.ts` still counts them, and
the AI modules sit at the top of For you as "Counts toward Teo's AI area".
If Justin keeps the 13 September gate instead, the group sits on the first
tab in the hero's shape with `Do it together now` only and the line "These
count for the stamp too. About ten minutes each, on this phone, Teo taps the
answers", and guard 9 requires `data-do-together` on any `/dashboard/ai-module/`
link under the first tab. (Parent UX 8, engineer 10.)

**A2. The send route, alive and honest.** `app/api/quests/lessons/route.ts`:
`createAdminClient()` for the catalogue reads only; a `children` read proving
`body.child_id` belongs to the caller (404 otherwise); the lock rule (A9)
refused with 403; a mission already `done` answers
`{ ok: true, already_passed: true }` and changes nothing; the upsert keeps an
existing row's `stars`; then `pushToChild` (signature changed to return
`{ sent, reason }` as the ping route does; its 36 callers ignore the return)
and `nudged_at` set. The push is from the lesson's Planet Friend, never from
the parent, built by one `friendNote(module, nth)` so the Monday card, Nudge
and the lesson day note share it and never repeat: first "Orbit has a
question for you. Does your feed leave you better, worse, or nothing?
Fifteen minutes, 10 stars, any day this week", second "Still here when you
are. No rush." A nudge inside seven days of `nudged_at` is a no op. On the
child's list the card reads "Open for you this week", never "Sent by Mum".
(Engineer, app lead B3, child lens, parent UX.)

**A3. The pass route tells the truth, keeps the evidence, and runs once.**
`app/api/quests/lesson-complete/route.ts`, mission branch:

- The payload carries `slide` (the index), `question`, `chosen`,
  `first_correct` and `settled_correct` per choice. The route reads the deck
  through the admin catalogue, verifies each `question` equals the deck slide
  at that index, reads `phase` from the deck, drops anything that does not
  match, treats a missing prove answer as a fail, and computes the pass with
  the shared rule (B1). The client's `correct` and `total` are never read.
  (Engineer 16, learning scientist C5.)
- The mission update is the lock: `.update({ status: 'done', ... })
  .eq('status', 'sent').select('id')`, and the completion, the stars, the card
  and the push happen only when a row came back. A second request from a
  double tap finds nothing. The player disables Continue once posting.
  (Engineer 8.)
- `recordQuestionAnswers` on every finish, pass or fail, with `phase`,
  `first_correct` and `correct` (settled). (All six.)
- Stars on the pass only. A fail leaves the mission `sent`, pays nothing, and
  the parent push says the child had a go and will have another, with no
  stars line. On the second fail the push carries the missed prove question's
  why line and "Do the tricky bit together, five minutes", opening the opener
  with `initialIndex` at the reteach slide (B1), and the hub row reads "Had a
  go on Tuesday. The nothing verdict tripped them." `SELF_STARTED_STARS` and
  the POST default become 10. (Teacher B1, app lead, child lens.)
- Inside `credit()` on the first pass only, one `digi_prompts` row:
  `kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `source: null`,
  `child_id`, `href: '/dashboard/lessons?child=<id>&lesson=<id>'`,
  `cta: 'Teo taught me'`, title and body from the copy section. `moment.ts`
  filters on the `step_in:` prefix so the reason is safe; the lesson id in it
  is what the hub row, the passport, Sunday and the follow up read.
  (Engineer 5 and 14.)
- The push leads with the parent's action, with the grown up's first name
  where the family set one: "Ask Teo at tea: can you teach me the better,
  worse or nothing check? (Passed Mood and screens, both check questions
  right first time.)" (Parent UX, child lens.)

**A4. The pass is a row in the Today card, not a card in the fold.** Home's
`page.tsx` reads the pending `lesson_pass:` prompt server side and passes
`lessonPass` to `TodayCard` beside `childApp` and `weekBrief`. The row: icon
`lessons`, title "Teo passed Mood and screens", line "Ask at tea: can you
teach me the better, worse or nothing check?", body tap opens the hub row.
The circle is `Teo taught me`; on tap a settle state of 1.5 seconds in the
check in tick's motion reads "Teo gets 2 stars for teaching you. Their app
says so. Next up: Social workarounds." Under 7: title "You and Teo did Stop,
look, ask a grown up", line "Ask again at tea: can you teach me the star
pause?" The row stays until the circle or the Sunday email carries it,
whichever first; the Sunday send marks the row `seen`. `DigiPrompts` in the
fold skips `lesson_pass:` rows so nothing shows twice, and `moment.ts`
exempts them from the pending count so Later never silences DiGi for a week.
Notifications still lists the row. (Parent UX 1, 3, 6; app lead B4;
engineer 6.)

**A5. The taps, with a route.** `app/api/digi/prompts/route.ts` GET selects
`cta, reason, child_id`; PATCH accepts `reaction` only for `kind =
'celebration'` with a `lesson_pass:` reason, updates with
`.eq('status', 'pending').select('id')`, and only when a row comes back
inserts a `family_quests` row titled `Taught: <module>` (2 stars, `schedule:
'once'`) plus an approved `quest_ticks` row, deduped on that title per child
like the game path, so a replayed tap mints nothing. The child's push is
plain: "Your grown up tapped Teo taught me. 2 stars landed." Three taps:
`Teo taught me` (`acted`, `helped`) on the Today row and the hub row; `Had a
go, not yet` (`acted`, `not`) and `Later` (leave it) on the hub row. No tap on
any token page: a child holding the link must not be able to act the parent's
card. The Foundation pass screen says where the tap is. The passport row reads
"2 of 10 · talked about 2"; the hub row "Teo taught you this on Wednesday".
The 2 stars are never mentioned to the child before tea. (Engineer 4 and 6;
parent UX 4; child lens; Deci, Koestner and Ryan 1999 in the table.)

**A6. Home reads one thing.** `journey.ts` and `suggestions.ts` take the
count and the next title from A1; the alerts row becomes "Teo's next lesson:
<module>. It is on their app. Do it together or give them a nudge", linking
the first tab. `daily-tasks.ts` builds the Lesson rung from A1. Home's own
`stageLessonRows` goes. `moment.ts` and `word.ts` label `/dashboard/lessons`
as "Teo's lessons". (Engineer.)

**A7. The Sunday email says it back, from data.** `gatherWeek` splits ids by
`lesson_source` and titles the school ones through `starLessonTitles` (and
`starLessonNotes` for tea questions, one `.in('id', ids)` read each).
`weeklyReviewEmail` gains a "Lessons this week" block after the stats table,
built like "What has moved" from `stats.lessonPasses[]` (child, title, day,
first time or second go, taught state, the child's sentence when one exists,
the tea question) and `stats.stuckLesson`, in fixed words, never from the
model's summary:

- "Teo passed Mood and screens on Tuesday, both check questions right first
  time. Teo taught you the better, worse or nothing check on Wednesday."
- A `not` reaction: "Worth one more go at tea this week. The idea comes back
  in Teo's Remember check."
- The child's sentence, quoted, labelled "Teo said".
- The retention line, sourced from the Remember check only, never a starter:
  "On Thursday's Remember check Teo got last week's question right without a
  second go."
- The stuck line, once: "The next lesson, Social workarounds, has been on
  Teo's app since last Monday. Fifteen minutes on the sofa this week would do
  it, or leave it, there is no deadline."

No new cron for the email. (Parent UX 7, learning scientist, engineer.)

**A8. One door.** `/dashboard/lessons/path` becomes a redirect to
`/dashboard/lessons` preserving `stage`, `child`, `lesson` and `from`; the
first tab scrolls to `[id="lesson-<id>"]` on mount; `?stage=` opens the first
tab and honours a stage other than the child's own; the hub's `BackTo` gets
the `/dashboard/pathway#passport` fallback. (Engineer.)

**A9. The lock rule, once.** `lockedModuleIds(modules, passedIds, paid)` in
`lib/lessons/school-path.ts`, used by the child's list, the hub, the opener
(redirect to the list when locked) and the POST. (Engineer.)

**A10. The hub's first tab**, in the order a thumb reads it (parent UX, app
lead's see then ask):

1. Eyebrow, mono, read from `stages.ts`: `STAGE 3 · EXPLORER · AGES 11 TO 12`.
   The stage is said here and nowhere else on the tab. No stage chips; a
   `See what Stage 4 covers` link at the foot opens the tab with `?stage=4`
   and the notice "You are looking at Stage 4. Teo's own stage is 3."
2. Heading `Teo's lessons`. Under it: "Teo does these on their own app, one a
   week. Your job is one question at tea."
3. Tabs: `Teo's lessons · 10`, `For you · 26`, `Watch together · 10`. Films
   second only at Stages 1 and 2; the order is computed before the `TABS`
   block so the block stays free of `childStageNum`.
4. The progress line from A1: "2 of 10 passed. Each pass ticks the passport."
   At zero passes no bar and no counts. After the first pass `2 passed` and
   `8 to go`.
5. The hero: the week's lesson. Eyebrow `THIS WEEK FOR TEO`, the title, the
   module's `single_action_outcome`, "About 15 minutes on their app", then the
   state and the buttons (below), then "One a week is plenty."
6. The list in teaching order, compact rows, no buttons on rows. A passed row
   shows the tick, "Both check questions right first time" or "Right after a
   second go on the nothing verdict", "What the lesson taught: the mood
   audit. Close it, ask better, worse or nothing, log one word" (from
   `teacher_notes.tool`), the tea question with `LISTEN FOR` and `THEN ASK`,
   the child's sentence under `TEO SAID` when one exists, the taps from A5,
   and the talked state. Under 7 a passed row shows "Done together on
   Saturday" and "What Teo said", never first time against second go, because
   the pass at Foundation is finishing it together. Ahead rows are quiet;
   locked rows say "Opens in order on Teo's app".
7. The stage check card mirroring the child's: "The Stage 3 check opens on
   Teo's app once all 10 are passed, and it only asks what the lessons asked.
   Passing it earns the stamp."
8. "Worried about social media in particular? The Social Media Ready ramp is
   in For you." The ramp card moves to the top of For you.
9. The school code card, as now.

The state and the buttons. The week's mission row exists from Monday (C1), so
the primary is the state read from the row: `On Teo's app since Monday`, with
a small `Give Teo a nudge` (A2; no op inside seven days of `nudged_at`, so a
second tap says "Nudged on Tuesday"), and `Do it together now`, every age,
opening `/k/[token]/school/[id]` on this phone, with the line "Together means
you read it out and Teo taps the answers. Either way the pass lands on Teo's
passport." `Send to Teo's phone` appears only when no mission row exists,
which after C1 is a child with no app: there the buttons are replaced by
"Teo's lessons live on their own app, and Teo has not opened it yet. Nothing
to install: show them the code and it opens on their phone, a tablet or the
family laptop", primary `Show Teo the code` to `/dashboard/setup#share` (the
same address Home's setup step uses; the walkthrough taps it), secondary `Do
it together now`, which creates the kid link through the existing quests
route when none exists and then opens. Under 7 `Do it together now` is the
only button, full width, and the line under the heading reads "At this age
you do them together, on your phone. You read it out, Teo taps the answers.
Twelve minutes on the sofa, one a week." Nothing on the parent's side ever
reads "waiting for your grown up" on the child's. (Parent UX, app lead B2,
engineer 7, child lens.)

Two children: the heading, the tab label and the row eyebrow carry the name;
the nudge takes its child id from the page's resolved `child`;
`LessonsBrowser` keeps `key={child?.id}`. The library tab `For you · 26`
opens with "Written for you, not for Teo. Read one when you want the thinking
behind a lesson, or the words for a hard conversation. These do not move
Teo's passport." No "n of N" on it. The Stage 1 card keeps
`childStageNum === 1` for the guard and points at Do it together; the
`pastTheFilmYears` card's button opens the first tab and
`check-watch-stage-copy.mjs` lines 84 to 90 change with it (the count becomes
the A1 total, not the library's). `moduleInReach`, `sendable`,
`pastTheFilmYears`, `libForStage` and `watchShown` survive the rewrite.
(Engineer 14.)

**A11. Guards rewritten in the same commit as the code.** Rules 1, 3 and 4
of `scripts/check-lesson-path.mjs` (which CI runs) each read a literal this PR
removes: `schoolCreditKey(l.id)` twice in `progress.ts`, `correct / total >=
0.7`, `Ask them at tea: ${askLine}`, and the `/path` list. They are rewritten
to the new truths (the full list is in the guard section). (Engineer 3.)

**A12. The walkthrough gate.** Before PR A merges, on the live database with
a test family, and pasted into the PR body: a send inside quiet hours showing
its state; a fail, then a retake, then a pass (mission stays `sent`, no stars,
no card, then pays once); a double tap on the last slide (one card); two
children with one sibling pass (the other's hub, passport and row untouched);
the Today row, the Taught me tap and its 2 stars on the child's side; the
Sunday block; `/dashboard/setup#share` landing; the stage check pool size for
that stage. A guard reads code; only a walkthrough reads this. (Learning
scientist C7, engineer.)

### PR D: the content (migration 367 plus the JSON mirrors, built with A, merged first)

Every content change lands as a numbered migration with mirrors in
`content/modules`, because six guards read those files. This is an out of
cycle curriculum pass under the term review rule, justified because the
check is being rewritten. (Engineer 15.)

**D1. Four prove items with honest distractors, every module.** The pass
rests on the prove items, so they have to measure the lesson. On the 26
decks whose worksheet items carry `expected_verdict` and `teaching_point`,
two prove items are lifted from them (module 10's Priya item, "I feel
nothing, so it does nothing to me, agree?", is the one question in the module
that tests understanding rather than recognition); on the other eight, two
are written. Every prove item has three options; every distractor is one of
the module's listed `misconceptions`, plausible and wrong; no right answer is
more than 20 percent longer than its longest distractor, and in at least one
item per module the moderate sounding answer is the distractor. Module 10,
slide 24: the right answer cut to "Make one calibrated move: mute it, move
it, or change the use", and "Delete every app to be safe" replaced by "Keep it
as it is, because feeling nothing means it is not affecting you". The same
length rule is applied to the teach items, because they feed the Remember and
stage checks. (Teacher A1, learning scientist, app lead A1 and A2, child
lens; Haladyna, Downing and Rodriguez 2002.)

**D2. The family question teaches, with a listen for and a then ask.** Every
`parent_note.family_question` rewritten to one of three shapes: "Can you
teach me how X works", "Explain to me why X", or "What would you tell a
friend who X", with the parent's own life as the subject where the tool
applies to it (module 10: "Can you teach me the better, worse or nothing
check? I want to run it on my news app"). Each gains `listen_for` (the idea
in one sentence, from `taught`) and `then_ask` (one why or transfer question
in the parent's life: "What would the audit say about my news app?"), so the
parent is an audience with one follow up, never an examiner. No family
question opens with "Which app", "What did you" or "Did you". (Teacher,
learning scientist A6 and question 3, child lens.)

**D3. The grown up's words on the seven Foundation decks.** A
`together_prompt` per slide on the EYFS and KS1 modules, one line, from the
classroom script with the cold calls and timers removed. (Teacher, learning
scientist A5.)

### PR B: the player for one child, and for a sofa (medium, no migration)

**B1. The pass rule, written once.** `lessonPassed(answers)` in
`shared/lesson-slides.ts` next to `answerBeat`: the pass is every `prove`
item right on its settled answer; starter, teach and practise items give
feedback and are recorded but never gate. The first tap is recorded
separately and is what the parent sees and the Remember check orders by. The
rule is told to the child once, on the list card: "Two goes on each check
question. The first go is the one your grown up sees." `ChoiceBlock` gains
`onSettled(correct)`; `tryAgain` keys on the settled answer, scans `prove`
items only, and jumps to `reteachIndex(slides, wrongIndex)`: the last
`concept` or `diagram` teach slide before the wrong item, so the idea comes
round before the question does; the re asked item is a parallel worksheet
item rendered as a choice (D1 leaves two per module unused for exactly this),
so the retake is a choice, not a recognition of the green option.
`LessonPlayer` and the route both import `lessonPassed`; the two copies of
`0.7` go. (Learning scientist question 1 and A, teacher A2 and A3, child
lens.)

**B2. The deck for one child.** In `kidMode`: a discussion slide renders as
"Think it: <prompt>" with one tap ("Show me" reveals the `lookFor` line as
"A good answer sounds like", so nothing is a dead tap); the tryit renders the
six `worksheet_items` as unscored verdict cards, "Your turn. Six real closes.
Better, worse or nothing?", each `teaching_point` as the why after the tap,
using the existing `verdict-sort` interactive, so the child practises before
they prove; the class tally becomes one tap on the child's own verdict; the
half time slide (its prompt is in `config.prompt`) reads "Two breaths with
Orbit. Then one thing that surprised you, in your head"; the title slide says
"About 15 minutes"; the starter is labelled "Warm up from an earlier lesson.
No score, have a guess" when no passed module precedes this one, and is kept
out of the stage pool in that case; the deck's passport slide is skipped;
concept slides show their one line recap above the paragraph. Saved place per
mission in `localStorage` under the mission id, capped at the slide before
the first prove item, offered as "Carry on from where you were, on this
phone". (Teacher A4, child lens, engineer 13.)

**B3. The pass screen, in the order a 12 year old wants it.**

1. The tool, big: `teacher_notes.tool` ("Close it. Ask: better, worse, or
   nothing? Log one word.").
2. The commitment, as the module's own `commitment_stem` with its blank
   first ("every time I close ........ I will log one honest word"), then an
   optional sentence. Both are his: they fill his week card (C2) and are kept
   on this phone. A separate tap, "Show my grown up", writes them to
   `child_note` and they appear on the parent's row as `TEO SAID`. The box
   never says "this is what your grown up sees". (Teacher A5, child lens,
   app lead C2.)
3. The score with its shape: "Both check questions right first time", or
   the one that took two goes with its one line why.
4. The tea question, told to the child first, with the grown up's first
   name where set: "Sam will ask you at tea: can you teach me the better,
   worse or nothing check? You are the one who knows it."
5. "Next up: Social workarounds. Open now, or it is next week's card."
6. The dignity line: "Your passport ticked. Your grown up sees the tick,
   which check question took you two goes, and your own words if you choose
   to show them. Never which answer you picked." "Stars mean screen time"
   and "Your grown up just got the good news" go. Nothing about the 2 stars.

**B4. Together mode for under 7.** Keyed off `isTogetherStage`: every slide
carries its `together_prompt` as a quiet "Say:" strip; discussion slides read
"Ask each other:" with no timer; sheet and circle time slides are skipped.
The together deck keeps the lesson, not only the scaffolding: the star
breath, the friend's question, the three words, the diagram, a photo is real
and dragons are made up, the sort, who is a grown up you could ask, the two
prove items, three fingers, the chant with actions, Fill the page showing the
real passport, and the goodbye: about twelve slides and twelve minutes. The
pass screen reads "You did it together", the tool as a chant ("Stop! Look!
Ask a grown up!"), "What did Teo say?" for the grown up to type into
`child_note`, and "Tonight at tea, Teo teaches you the star pause. Then tap
Teo taught me on your Home." No tap on this screen. At Foundation the pass is
finishing it together; first time against second go is never shown. (Child
lens 6 corrected, teacher, learning scientist A5 and B5, engineer 6.)

**B5. The stage check asks the child's lessons, marked server side.**
`stage-quiz-gather.ts` exports `questionsFromSlides` and `standsAlone` and
takes a source; the kid route passes the child's school modules through a
`starLessonDecks(admin, ids)` sibling in the catalogue, ordered by
`first_correct` history; `app/api/kid/stage-quiz/route.ts` marks against the
pool rather than `body.correct`. The parent pathway keeps the library.
(Learning scientist A3, engineer 11 and 18.)

**B6. The child's list is a road.** Each card wears its friend and its tool
("Orbit: the mood audit · 15 min · 10 stars"); the passed chip reads
"Passed"; a ten dot strip on the list header shows the road with the stage
check at the end, using the A1 number. KidRoad stays the road to 16. (Child
lens, app lead.)

### PR C: the week (medium, no migration)

**C1. The week's lesson is on the child's app by itself.** The five a day
cron (`app/api/cron/five-a-day`, which already runs daily and pushes the
child) on Monday ensures the mission row for the next unpassed module for
every child with a kid link, 10 stars, so the hub's state is true before
anyone taps anything. The child's home shows "This week's lesson: Mood and
screens. Orbit: the mood audit · 15 min · 10 stars. Any day before Sunday",
directly above `KidFiveADay`, open all week, never a rotating row; week two
unpassed the line is the tool, week three "No rush. It is here when you are."
`pickDay` stops drawing the lesson; `stepForToday` still lets a pass tick the
day it lands on; an unpassed lesson can never fail a day's run. The same cron
sends `friendNote` once, on the weekday this child most often opens the app
(from `kid_days`, Saturday when there is no history), skipped inside seven
days of `nudged_at`; at Foundation the note goes to the parent instead:
"Teo's lesson this week: Screens and kindness. Twelve minutes on the sofa, you
read, Teo taps." No new cron, no new column, no setting. (App lead B2 and
C1, child lens 5, teacher B2, engineer 12.)

**C2. The log on the week card.** After a pass the week card holds the
commitment and the tool with three buttons: "Last close: Better · Worse ·
Nothing. Stays on your phone. Sunday shows your week", stored in
`localStorage`, never sent, seven dots by Sunday. The module's
`commitment_stem` asks for exactly this, and it is the thing a child puts on
the table unprompted. (Child lens, teacher A5.)

**C3. The Remember check, real.** `app/k/[token]/remember/page.tsx`: the
token check; this child's passed school modules; decks through
`starLessonDecks`; three questions through `questionsFromSlides`, every due
lesson covered, missed first then oldest; `KidStageQuiz` at length three with
no stamp and no stakes, every answer with its why; a token POST that records
answers under `source: 'remember'` with `lesson_id` (the column has no check
constraint; the `answers.ts` union widens) and ticks `markStepQuietly(…,
'quiz')`. The due rule in a pure `lib/kid/remember-due.ts`, guarded on
fixtures: a lesson is due 5 to 9 days after its pass, again at 30, then every
90 days until the stage check is passed; a missed item is due in the next
draw. `loadDay` forces the `quiz` step into the day when anything is due, the
way C1 handles the lesson, so the check is scheduled, never drawn. The quiz
row's href points at the page. The maths quiz stays on the path character.
(Learning scientist question 2 and C, app lead A3 and A4, engineer 11.)

## The copy, exact

**The Today row (Home).** Title "Teo passed Mood and screens". Line "Ask at
tea: can you teach me the better, worse or nothing check?" Circle `Teo taught
me`. Settle line "Teo gets 2 stars for teaching you. Their app says so. Next
up: Social workarounds." Under 7: "You and Teo did Stop, look, ask a grown
up" and "Ask again at tea: can you teach me the star pause?"

**The hub row after a pass.** Eyebrow `TEO PASSED A LESSON`. Title: the
module. "What the lesson taught: the mood audit. Close it, ask better, worse
or nothing, log one word." "Both check questions right first time, Tuesday
4.10pm." `TEO SAID` in a cream box when there is one. `ASK AT TEA` and the
question. `LISTEN FOR` and the line. `THEN ASK` and the follow up. Buttons
`Teo taught me` · `Had a go, not yet` · `Later`. Never "Teo learned",
"now knows", "can now" or "Today".

**The push to the parent.** "Ask Teo at tea: can you teach me the better,
worse or nothing check? (Passed Mood and screens, both check questions right
first time.)" On a second fail: "Teo had a second go at Mood and screens and
the nothing verdict tripped them. Do the tricky bit together, five minutes."

**The push to the child.** First: "Orbit has a question for you. Does your
feed leave you better, worse, or nothing? Fifteen minutes, 10 stars, any day
this week." Second: "Still here when you are. No rush." After the parent's
tap: "Your grown up tapped Teo taught me. 2 stars landed."

**The child's list card.** "Orbit: the mood audit · 15 min · 10 stars", "Open
for you this week", and once: "Two goes on each check question. The first go
is the one your grown up sees."

**The Sunday lines.** In A7.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| Pass is the prove items on the settled answer, first tap recorded; feedback on every option | Kornell, Hays and Bjork 2009 (a wrong attempt plus feedback helps later recall); Butler and Roediger 2008; Soderstrom and Bjork 2015 (performance under feedback is the poorest proxy, so the first tap is the signal and the gate is for learning) | Learning scientist, child lens |
| Four prove items, honest distractors, no length cue | Haladyna, Downing and Rodriguez 2002; Little, Bjork, Bjork and Angello 2012 (retrieval only when distractors compete); Roediger and Karpicke 2006 (dose) | Teacher, learning scientist, app lead |
| The retake re teaches then re asks a parallel item | Rosenshine 2012; Rawson and Dunlosky 2011 (relearning, not retesting alone) | Learning scientist, teacher |
| Practice before the prove; a tap on every prompt | Rosenshine 2012 (guided practice); Chi and Wylie 2014 (ICAP) | Teacher, child lens |
| Remember check at 5 to 9 days, 30, then every 90; missed first; mixed | Cepeda et al 2008; Rawson and Dunlosky 2022; Kang 2016; Rohrer and Taylor 2007; Agarwal, Nunes and Blunt 2021 | Learning scientist, app lead |
| Once a week, fixed, forgiving, the child's own day | Duolingo streak research (a company blog, read as such); Grolnick 2002 and 2009 on autonomy support | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| The 2 stars arrive after tea as a surprise | Deci, Koestner and Ryan 1999 (expected contingent rewards undermine, unexpected do not) | Child lens |
| Under 7 the grown up asks and the child taps | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek and Zosh 2015; Takeuchi and Stevens 2011 | Learning scientist, app lead, child lens |
| The parent sees what the lesson taught and a tap that does something | EEF parental engagement; Sparx parent email (status plus one thing to do); Khan family engagement research | App lead, parent UX |
| The send is a note from the friend, never from mum | Grolnick 2002 and 2009; Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| Fifteen minutes on a phone; twelve at five | Oak evaluation 2021; early years attention guidance | Child lens, teacher |

## What the guard asserts (`scripts/check-lesson-path.mjs`, rewritten rules 1, 3 and 4, plus these)

1. `lib/pathway/lesson-path.ts` takes `passBy` and is imported by
   `progress.ts` (twice), the hub page, `journey.ts`, `daily-tasks.ts`,
   `app/api/kid/day/route.ts` and the weekly review; no file under
   `app/(dashboard)/dashboard/lessons/` does its own count or redeclares an
   `age_7:` map; `AI_AUDIENCE_TO_STAGE` is imported from `readiness-areas.ts`.
2. Fixture run with no database: two children with one sibling pass, a
   failed run, a retake after a fail, a legacy null child row, a stage with
   two AI modules; assert `done`, `total`, `next` per child and that the hub's
   row count equals the passport's total.
3. `shared/lesson-slides.ts` exports `lessonPassed` and `reteachIndex`;
   `LessonPlayer.tsx` and the route import `lessonPassed`; neither contains
   `0.7`; `tryAgain` references `prove` and `reteachIndex`; the route verifies
   `question` against the deck at `slide`, reads `phase` from the deck, fails
   a run with a missing prove answer, and calls `recordQuestionAnswers` with
   `source: 'school_lesson'`, `phase` and `first_correct`.
4. Migration 366 exists and `answers.ts` inserts `phase` and `first_correct`.
5. The mission update in `lesson-complete` has `.eq('status', 'sent')` and
   `.select(`, and the completion, the stars, the card and the push sit inside
   the returned row branch; the `digi_prompts` insert has `kind:
   'celebration'`, `reason: \`lesson_pass:${`, `child_id`, `cta`, and sits
   inside `credit()`.
6. `app/api/quests/lessons/route.ts` reads the catalogue through
   `createAdminClient()`, reads `children` for ownership, calls
   `pushToChild(`, returns early on a `done` mission, and sets `nudged_at`;
   `pushToChild` returns `{ sent, reason }`.
7. The lock rule is one exported function used in four places.
8. The prompts GET selects `cta, reason, child_id`; the PATCH writes
   `reaction` only for `celebration` with a `lesson_pass:` reason, carries
   `.eq('status', 'pending')`, and the `Taught:` quest insert sits after a
   returned row check; no file under `app/k/` or `app/api/kid/` writes
   `digi_prompts.reaction` or inserts a `Taught:` title.
9. `TodayCard` takes `lessonPass`; `DigiPrompts` skips `lesson_pass:`;
   `moment.ts` exempts `lesson_pass:` from the pending count.
10. `weekly-review.ts` calls `starLessonTitles(` and splits on
    `lesson_source === 'school_lesson'`; `templates.ts` renders a "Lessons
    this week" block from `stats.lessonPasses`; the retention line's source is
    `remember`.
11. The library copy matches neither `/move .{0,30}progress/i` nor
    `/lessons you lead/`; the first tab never links `/dashboard/lessons/[id]`;
    no card or row body contains "learned", "now knows", "can now" or
    "Today"; no child facing lesson screen contains "screen time".
12. `/path` is a redirect preserving `stage`, `child`, `lesson`, `from`;
    `passport-sections.ts` still links `/dashboard/lessons/path?stage=`; the
    first tab carries `data-do-together` and `schoolModulesForStage`.
13. `check-watch-stage-copy.mjs` lines 84 to 90 match the A1 count and the
    `TABS` block is free of `childStageNum`.
14. Every five a day step href with a query string is read by the page it
    names; `/k/[token]/remember/page.tsx` exists before `five-a-day.ts`
    points at it; `questionsFromSlides` and `standsAlone` are exported;
    `remember-due.ts` passes its fixtures (due at 5 to 9, 30, 90s; a missed
    item returns next draw).
15. The kid quiz page's pool comes from `schoolModulesForStage` and the stage
    quiz route marks from the pool, not `body.correct`.
16. The saved place is capped at the first `prove` index.
17. Content: every module has four `prove` choice slides, each with three
    options, no right answer more than 20 percent longer than its longest
    distractor on any choice slide; `listen_for` and `then_ask` on every
    module; no family question opening with "Which app", "What did you" or
    "Did you"; `together_prompt` on every slide the together deck shows; the
    six existing content guards still pass.
18. `check-lesson-age-gate.mjs`, `check-watch-stage-copy.mjs`,
    `check-co-watch.mjs`, `check-digi-step-in.mjs` and `check-learning-step.mjs`
    still pass, listed in each PR body as run.

## The loop, end to end, after

Monday the cron puts Mood and screens on Teo's app and Teo's home shows the
week card; the hub shows `THIS WEEK FOR TEO`, "On Teo's app since Monday", a
nudge and Do it together. Thursday evening Orbit's note arrives, because
Thursday is when Teo opens the app. Teo gets fifteen minutes in the kid
register: a tap on every prompt, six real closes to sort before the check,
four prove items with honest distractors, a saved place if the doorbell goes.
The pass screen hands over the tool, the commitment blank, the tea question
coming, and "open now or next week's card". The route verifies every answer
against the deck, locks on the status change, records first tap and settled,
writes the completion (passport ticks, the day's lesson step ticks), pays 10
stars once, pushes "Ask Teo at tea: can you teach me the better, worse or
nothing check?", and writes the card. Home shows it as a row in the Today
card. At tea Teo teaches it and the parent asks the then ask; the parent taps
`Teo taught me`; the row settles with "Teo gets 2 stars for teaching you";
Teo's app says the grown up tapped it and 2 stars landed. On the week card
Teo logs one word a night, on the phone, never sent. Six days later the
Remember check is forced into the day with three questions, missed first.
Sunday's email names the pass, the conversation, the Remember result and the
sentence Teo chose to show. If a lesson sits for a week the next Sunday says
so once, with no deadline. Under 7 the parent taps Do it together, reads the
"Say:" strip, the child taps, the pass lands on the child, the parent types
what Teo said, and the tap waits on Home. At the end of the stage the check
asks only what Teo's own lessons asked, the ones Teo missed first.

## Decisions for Justin

1. The AI modules leave the lessons count (recommended; the child's list now
   teaches AI literacy in five modules, and the AI area still counts them), or
   stay with the 13 September gate and show on the first tab as Do it
   together.
2. Stars: 10 for a pass, 2 more on Teo taught me as a surprise after tea, 3
   on the school week tick as now. Recommended. The app lead also suggests
   bringing a film's first watch from 10 to 5 so a pass stands above a film
   without the parent's tap; the child lens is content with parity. Your
   call; the plan assumes 10 stays.
3. Four prove items now, in PR D, before the pass rests on them (recommended
   by all four lenses who scored it), rather than two this term.
4. The order: D and A together, D merged first, then B, then C. All four
   before the schools pilot families reach the first KS3 module.

## Not building, and why

- A new assignment table, a new player, a new push path or a new cron: the
  missions table, the star lesson player, `pushToChild`, the five a day cron,
  the Today card, `family_quests` and the Sunday review already do the work.
- Stars for the parent library. It is the parent's reading.
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson, a weekly lesson run counter. The evidence runs the
  other way, and the ten dot road is the one number the child needs.
- A lesson day setting: the note goes on the day the child already opens the
  app. A voice note: text first. A keepsake surface in the child's passport
  and a stage certificate: later, once the loop has run a term. The class
  tally rendered as the class the child joined: per module content, later.
- The Sunday pattern chart from the log: the seven dots on the week card are
  the chart; nothing is sent.
- More Foundation modules: seven exist for ages 4 to 7, a term at one a
  week; more belong to the curriculum cycle.
