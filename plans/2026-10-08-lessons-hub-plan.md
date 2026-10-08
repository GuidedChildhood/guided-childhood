# 8 October 2026: Lessons, version 5. The child learns it, the parent closes it, both can see it stuck, and the cast carries it

Justin, looking at Lessons for Teo on his phone: "these are really for the
child to do ... it looks like we are asking the parent to take the lesson.
Come up with the best way to run this so it is coherent, flows and loops, so
the parent can be confident the child learns, the lesson is for the child,
giving the parent options, knowing it is not a lesson for them. What we come
up with must encourage ticking off on the system (lesson done, passport) and
the child's app wiring works." Then: "check your advice with as many agents as
possible ... as if the best school lessons but top known proven methods for
best results, and the mechanism is easy for parents and gives them a wow
factor. Do not stop until it scores 10 out of 10." Then, adding the seventh
lens: "a separate agent that makes sure it all appears easy to use and uses
images of Planet Friends animations on thumbnails in a really attractive way
as good as any character SaaS plus the front page and flow and easy to see
what is outstanding for pass of stage ... better than any character platform
lesson education tracker ... connected both co viewer or on child's app with
feedback to parent and PWAs emails linked not over done."

Four versions, each through the same panel. Six lenses to version 3, seven
from version 4: a teacher, a learning scientist, a learning app product lead,
a parent UX reviewer, a sceptical engineer, a child lens (a 12 year old
alone, a 5 year old on the sofa) and now a design lead for character led
learning products. Scores on A (the child learns, best proven methods), B
(easy for the parent, a wow), C (the loop runs), and for the designer D
(looks) and E (flow):

| Lens | v1 | v2 | v3 | v4 |
|---|---|---|---|---|
| Teacher | 6/5/5 | 7/8/7 | 9/10/9 | 9/10/10 |
| Learning scientist | 7/6/6 | 8/8/7 | 9/9/9 | 9/10/9 |
| Learning app lead | 6/5/5 | 8/8/7 | 9/9/8 | 10/9/9 |
| Parent UX | 3/4/3 | 8/7/6 | 9/9/7 | 10/10/10 |
| Sceptical engineer | 4/5/5 | 6/7/5 | 7/8/7 | 8/8/7 |
| Child lens | 5/5/4 | 7/8/7 | 9/9/9 | 9/9/9 |
| Designer | | | | D4 / E7 |

The reviews are in the session scratchpad (`lessons-review/round1/` to
`round4/`). Round 4 converged: three lenses independently found the same
design error in the retake, three found the same impossible copy, two found
the same missing column, and the engineer found two things that would have
changed the signed off classroom lesson. The designer found that the cast is
already in the database and no surface uses it. Version 5 closes all of it.

## What is true today (verified in the code, the decks and the live database)

1. **The loop has never run.** 0 `school_lesson` completions, 0
   `stage_quiz_passes`, 2 `kid_lesson_missions` ever, 0 answers with source
   `school_lesson`.
2. **The parent send route is dead** (RLS since migration 274), never pushes
   the child, never checks ownership, resets a passed mission, no paywall
   check. `pushToChild` returns nothing and leaves in quiet hours before any
   read.
3. **The check does not measure the lesson.** The pass is 70 percent of every
   choice slide, first tap only, the number written twice and trusted from
   the client. Measured over the 34 decks: 194 choice slides, of which 117
   have the right answer more than 20 percent longer than its longest
   distractor; 68 prove items, 2 per deck, 49 of them over that rule; 10
   prove items have two options, on which `answerBeat` gives no second go
   (`retryWorthHaving = optionCount > 2`), including both in the first
   Reception deck. The starter of a stage's first module recalls a lesson
   from the previous key stage. `tryAgain` rewinds to the slide before the
   first wrong answer, re asks the question whose answer just turned green,
   and banks the previous run's answers rather than clearing them.
4. **Stars pay on completion, not the pass**, and a fail tells the parent
   "3 stars landed". A pass is 3, a first film watch 10.
5. **The child's answers are thrown away.** Migration 239 holds `question`,
   `chosen`, `correct`, `lesson_id` and `stage_id`; `fetchAnswerFacts`
   selects `correct`; `recordQuestionAnswers`'s `source` is a literal union.
6. **The child's stage check draws from the parent library** and trusts
   `body.correct`.
7. **The week between lessons is a dice roll.** `pickDay` draws the lesson
   and the quiz by seed; a drawn undone lesson fails the day; the quiz row
   links to `?quiz=1`, which the page ignores; `/k/[token]/remember` does not
   exist; `stepForToday`'s `LEARNING` pair lets a pass tick the quiz step;
   the five a day cron runs 18:30 London, sends one push a day, and skips any
   child with no `kid_days` row today; Stage 1's day is four steps, drops
   homework and maths and keeps the quiz; `KidQuestScreen.tsx:2657` renders
   every mission row under "Star lessons from your grown up";
   `lib/planet/server.ts:244` counts a third lesson number, non school passes
   plus done missions, and persists it to open planets.
8. **The child meets the classroom deck.** Six to ten classroom slides per
   module; the half time prompt is in `config.prompt`, not `script`; no saved
   place; 22 of the 27 KS2 and up decks sit at their core minutes ceiling.
   **Five schools surfaces render whatever `parseSlides` returns**
   (`schools/app/class/[lessonId]`, and `print/[module]` plus its
   `booklet`, `organiser` and `overview`), and the printed check is
   `checks.slice(-2)`, so appending anything to a deck silently changes the
   classroom's printed exit quiz.
9. **The content has three shapes.** 25 decks carry `expected_verdict` and
   `teaching_point` on every worksheet item; nine carry neither (51 items),
   six of those as `stem` plus `text` sentence completions; and four
   (ks2-26, ks3-27, ks4-28, ks4-29) are an older shape throughout, with
   `teacher_notes.tool` and the worksheet items as plain strings. Every deck
   has `teacher_notes.misconceptions` and `teacher_notes.commitment_stem`.
   24 decks already run a `verdict-sort` in their practise phase, 19 of them
   over the worksheet items.
10. **Under 7 the grown up's words are stripped**, and the Foundation prove
    items are two option slides.
11. **The tea question is three kinds of question** under one label, and every
    `taught` line opens "Today we".
12. **The parent's close does not persist, and Home reads four things.**
    `DigiPrompts` renders in a closed fold at the foot of Home from day
    three; `TodayCard`'s only control on a row is the ring that means put
    away, its label in `aria-label` only; the prompts GET selects neither
    `cta` nor `reason`, returns the three newest pending rows, and the PATCH
    writes `status` only; `moment.ts` holds DiGi while any non insight card
    is pending; `collect.ts:39` lists every pending prompt without `reason`
    and the Today card counts them; the weekly review cron emails only
    families with a tick or a check in and selects no `child_id`; Home
    resolves one child. The passport counts the age band's AI modules,
    `/path` does not.
13. **The cast is in the database and no surface uses it.**
    `school_lessons.character_cast` is set on all 34 rows and
    `characterKeyFor` resolves every one (7 Pebble, 6 Bloop, 8 Orbit, 3
    Nova, 2 Cosmo, 6 DiGi, the DiGi ones being the safeguarding modules).
    `StarLessonRow` declares the column; `listStarLessons` does not select
    it. The child's list draws one hardcoded clapperboard for all 34
    (`app/k/[token]/lessons/page.tsx:112`); the pass screen draws
    `DigiCharacter` for all 34 (`LessonPlayer.tsx:1965`); the Today row
    would draw the same book as the school week row; the Sunday email has
    `lib/email/friends.ts` serving 192 square email safe PNGs by stage, not
    by module.
14. **The weekly promise runs out.** Modules per stage against the years each
    covers: Foundation 7 for ages 4 to 7, Builder 9 for 8 to 10, Explorer 9
    for 11 to 12, Shaper 7 for 13 to 15, Independent 2. A Builder family
    reaches the end of the lessons in month three of a subscription that can
    run three years.
15. **The parent's name is usually unknown and no pronoun exists.**
    `lib/email/parent-name.ts` returns null for every starter pack account
    on purpose; nothing anywhere holds a parent's gender, and
    `WelcomeWalkthrough.tsx` already sets the rule, they and their, because
    a wrong guess is worse than a neutral one. Explorer is "Ages 11 to 12"
    in `stages.ts`.

Keep exactly as it is (every lens said so): the answer beat, the near miss
screen's words, the next unpassed lesson always open regardless of the
paywall, stars minted once and never on a replay, stars derived from the
mission row so they cannot double, the stage check that only asks what the
lessons asked, the characters and their one friend one tint rule, the
`FriendPlate` register ladder, the feed mockups, the evidence slides taught
honestly, the content already written on every module, the child rail, the
Today card's one row per thing, the five a day's drawn crayon icons and its
cron's restraint, and the model.

## The model, said once

The child does the lesson in their own app, about fifteen minutes, one a week,
fronted by the Planet Friend who teaches it, and leaves with a tool they can
say in a sentence. The pass is four prove items with honest distractors on the
settled answer; the first tap is the in lesson signal; under 7 the pass is
finishing it together. A miss re teaches the idea that failed and asks that
item's own spare question, nothing else. The week after, the child logs the
tool on their own phone for seven nights and reads their own pattern; a
Remember check comes on a schedule and asks the tool on scenarios the child
has not met; the stage check at the end only asks what the lessons asked,
missed first. The parent has one job after a pass: let the child teach them
the tool at tea, ask one follow up, then tap Teo taught me on Home, and the
child's app carries back what the parent did, in the parent's words, never
invented. The week's lesson is on the child's app by itself, always, fronted
by its friend; the parent sees the state and can nudge once, in their own
name, or do it together on this phone. Every number about lessons comes from
one function, and the parent and the child see the same road with the stage
stamp at the end of it. The parent library is for the parent. Nothing claims
an outcome for a child.

## Build: four pull requests

Order: **D** (content) merges first because A makes the prove items the pass;
then **A** (the loop, the pass contract, the hub, the week's mechanics), then
**B** (the player), then **C** (the week after). Each is mergeable the same
day, every lesson finish works between merges, and no PR changes the classroom
lesson. Migration numbers claimed in the draft PR titles, in merge order, and
re checked against origin/main before the first push: **D takes 366, A takes
367** (main reached 365 on 8 October). 366 must be applied before PR A
deploys, because PostgREST returns an error rather than throwing and a missing
column would silently drop every answer and pay nothing on every finish.

### PR D: the content (migration 366, plus the JSON mirrors, merged first)

Content lands as a numbered migration with mirrors in `content/modules`,
because six guards read those files. An out of cycle curriculum pass under the
term review rule, justified because the child's check is being rewritten.

**D0. The classroom lesson does not change, and that is enforced, not
asserted.** Every new slide is flagged `kid_only: true`. `visibleSlides(slides,
audience)` in `shared/lesson-slides.ts` is the one filter, used by the five
schools surfaces, the kid player and the parent co viewer; `print/[module]`
stops taking its exit checks with `checks.slice(-2)` and takes the two non
`kid_only` prove items by flag. `check-lesson-core.mjs`,
`check-lesson-minutes.mjs` and `check-lesson-rubric.mjs` skip `kid_only`, and
the guard asserts no schools surface renders one and that every module's
printed check count is unchanged. Output of all three pasted in the PR body.
(Engineer 3.)

**D1. Four prove items and four spares per KS2 and up deck.** Two new
`kid_only` prove slides and four `kid_only, reserve` slides, each reserve
carrying `reserve_for`, the index of the prove item it stands in for, and each
prove item carrying `reteach`, the index of the slide that teaches it, which
must be lower than the deck's first prove index. Every prove and reserve item
is written as a parallel: the same teaching point on a new scenario, never a
sentence the practice cards or a teach slide already show. Three options;
every distractor one of the module's listed `misconceptions`, plausible and
wrong, parallel in grammar; **no right answer more than 20 percent longer than
its longest distractor, on prove and reserve items only** (122 prove plus 108
reserve once written; the same rule for the 117 existing teach items is a
second, named content pass, because binding it here would make PR D unmergeable
in a day). In at least one item per module the moderate sounding answer is the
distractor. The two reserves pair first with the two prove items whose
misconceptions sit first in the module's list, so a spare never lands only on
the easy item. The seven Foundation decks keep two prove items at two options:
at five the pass is finishing it together. (Teacher A1, learning scientist,
app lead, child lens, engineer 2 and 5.)

**D2. The nine decks without verdicts.** Add `expected_verdict` and
`teaching_point` to the 51 worksheet items that have neither, from the
module's misconceptions and tool lines, so the spares, the Remember check's
application item and the child's practice have something to read. On the six
sentence completion decks the child's practice renders as "Finish the
sentence", one line typed, which is a stronger form than a verdict card it
cannot support. (Learning scientist, engineer.)

**D3. Normalise the four older decks.** ks2-26, ks3-27, ks4-28 and ks4-29
carry `teacher_notes.tool` and their worksheet items as plain strings, and
three surfaces print the tool as a short name. Normalise to
`{ heading, strapline, lines }` and to item objects. Headings: The shield;
Name it, save it, say it; The price, the odds, the loop; Stop it, report it,
say it. (Designer 7.)

**D4. The family question teaches, with a listen for and a then ask.** Every
`parent_note.family_question` rewritten to "Can you teach me how X works",
"Explain to me why X", or "What would you tell a friend who X", with the
parent's own life as the subject where the tool applies. Each gains
`listen_for` (the idea in one sentence, written fresh in the second person,
never trimmed from `taught`, every one of which opens "Today we") and
`then_ask` (one why or transfer question in the parent's life). None opens
with "Which app", "What did you" or "Did you". (Teacher, learning scientist,
child lens.)

**D5. The grown up's words on the seven Foundation decks.** A
`together_prompt` per slide, one line, from the classroom script with the cold
calls and timers removed.

**D6.** Every new or rewritten item listed in the PR body with the teaching
point it mirrors and the misconception behind each distractor, because a guard
can check length and shape and cannot tell a misconception from a caricature.
One human read covers all of them before the pass rests on them. (Teacher,
app lead 8.)

### PR A: the loop, the pass contract, the hub and the week's mechanics (large, migration 367)

**A0. Migration 367.** `lesson_question_answers` gains `phase text`,
`first_correct boolean` and `run_id uuid`; `correct` becomes the settled
answer and `fetchAnswerFacts` reads `first_correct ?? correct` so the stage
check's history survives. `kid_lesson_missions` gains `nudged_at`, `noted_at`
(the cron's note and the parent's nudge are two senders and one column cannot
cap both), `child_note text` and `done_together boolean`.
`recordQuestionAnswers`'s source union gains `remember`. (Engineer 1 and 8,
app lead 1.)

**A1. One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath({ modules, aiModules, completions, passBy, childId })`
returning `{ school: { done, total, next }, ai: { done, total }, anyLesson,
statusById }`, pure over rows, `aiModules` filtered through
`AI_AUDIENCE_TO_STAGE` imported from `readiness-areas.ts`. `anyLesson` is the
third count the planets persist, returned explicitly so routing the planets
through this function cannot close a planet that is open today. `progress.ts`
calls it in both functions; the hub, `journey.ts` (gaining a `childId`),
`daily-tasks.ts`, Home's own count, `app/api/kid/day/route.ts`,
`lib/planet/server.ts` and the Sunday nudge all call it on the same rows.
Every child facing surface prints the school pair. `getDailyTasks`, a second
reader with no caller, goes. (Engineer 7 and 9.)

**Decision 1, recommended: the AI modules leave the lessons count.** The
child's list teaches AI literacy in five modules, the AI area still counts
them, and they sit at the top of For you as "Counts toward Teo's AI area".
`/verify/[code]` prints a stage number whose meaning changes either way, so
the PR says what happens to stamps already issued: nothing, the gate only
applies forward. (Parent UX, engineer.)

**A2. The send route, alive and in the parent's own name.**
`createAdminClient()` for the catalogue reads only, **selecting
`character_cast`**, which `listStarLessons` omits today and every visual
surface needs; a `children` read proving ownership; the lock rule refused with
403; a `done` mission answering `{ ok: true, already_passed: true }`; the
upsert keeping an existing row's stars; `pushToChild` returning
`{ sent, reason }` as the ping route does. One exported `WEEKLY_LESSON_STARS =
10` in `school-path.ts`, used by the opener, the POST and
`ensureWeekMission`, so three writers cannot disagree. The parent's nudge says
where it came from: "Sam gave Orbit a nudge. Still here when you are. No
rush." It is a no op inside seven days of `nudged_at`, and when the cron
already sent this week the button reads "Orbit asked on Thursday". Never "Sent
by Mum", never the parent hidden inside the character. (Child lens, engineer,
designer 1.)

**A3. The pass contract, in one PR.** The player and
`app/api/quests/lesson-complete/route.ts` change together.

- `lessonPassed(answers, { together })` in `shared/lesson-slides.ts`: every
  `prove` item right on its settled answer, a `reserve` standing in for the
  item named by its `reserve_for`; when `together` is true, every prove item
  answered. Starter, teach and practise items give feedback, are recorded,
  and never gate. `retakePlan(slides, answers)` returns, for each failed
  prove item in deck order, its `reteach` slide then that item's own reserve,
  then the finish: settled correct items are carried and never re asked, so a
  retake is two or four screens rather than ten. `tryAgain` runs the plan,
  **mints a fresh `run_id` and clears the answer refs from the jump forward**,
  so one finish is one attempt. `ChoiceBlock` gains `onSettled(correct)`
  (three signatures plus a settled ref). The Nearly screen counts prove items
  only. The payload carries `slide`, `question`, `chosen`, `first_correct`,
  `settled_correct`, `phase` and the `run_id`. (Teacher A1 and A2, learning
  scientist, engineer 1 and 2.)
- The route reads the deck through the admin catalogue, verifies each
  `question` against the deck slide at `slide`, reads `phase` from the deck,
  drops anything that does not match, treats a missing prove answer as a
  fail, derives `together` from the module's key stage (never the client),
  and computes the pass with `lessonPassed`. The client's `correct` and
  `total` are never read. The two other files holding `PASS_MARK = 0.7` are
  the family stage lessons and keep it.
- The mission update is the lock: `.eq('status', 'sent').select('id')`, and
  the completion, the stars, the card and the push happen only when a row
  came back. `done_together` is set at the opener, from `?from=hub`, and
  honoured only on a finish in the same session. Continue is disabled once
  posting.
- `recordQuestionAnswers` on every finish, pass or fail, with `phase`,
  `first_correct`, `correct` and `run_id`.
- Stars on the pass only, 10. A fail leaves the mission `sent` and pays
  nothing; the push says the child had a go. A prior `passed: false`
  completion marks the second attempt, whose push carries the missed item's
  why line and "Do the tricky bit together, five minutes", opening the opener
  at the reteach slide (the mission page gains `searchParams`).
- Inside `credit()` on the first pass only, one `digi_prompts` row:
  `kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `child_id`,
  `href` with `child` and `lesson`, `cta: 'Teo taught me'`, and **`title` and
  `body` filled, because both are not null**.
- The push leads with the parent's action and the count built from the items:
  "Ask Teo at tea: can you teach me the better, worse or nothing check?
  (Passed Mood and screens, all four check questions right first time.)"
- `ensureWeekMission(admin, childId)` in `school-path.ts`: idempotent on the
  unique key, the next unpassed module at 10 stars, a no op when none is
  left. Called by the opener, the pass route, the cron, and the hub on render
  for the page's own child only, never on the `?stage=` preview path.

**A4. The week's rhythm moves here, so no child meets a day they cannot
finish.** `pickDay` stops drawing `lesson` and `quiz`; the `LEARNING` pair in
`stepForToday` retires; `markStepQuietly(..., 'lesson')` and the dead
`?next=1` redirect go, with rules 2 and 3 of `check-lesson-path.mjs` rewritten
in the same commit; `app/api/kid/day/route.ts` drops its missions read and
`lessonAlreadyThisWeek`; `check-learning-step.mjs` is rewritten. The weekly
lesson no longer counts toward the five a day, said out loud, because the
lesson sits above it. Without this in the same PR as `ensureWeekMission`,
every child gets a mission row while `pickDay` can still draw it, and an
undone drawn lesson fails the day. (Engineer 6 and 9, app lead.)

**A5. The pass is a row in the Today card, labelled, for every child.** Home
reads every pending `lesson_pass:` prompt for the family and `TodayCard` takes
`lessonPasses: []`, one row per child, leading the card above the week brief
(whose comment is rewritten in the same commit). The row: the friend's plate
(below), title "Teo passed Mood and screens", line "Ask at tea: can you teach
me the better, worse or nothing check?", body tap opening the hub row. The
control is **a labelled pill, never the ring**, which on every other row means
put away: `Teo taught me`, with a four second Undo before the PATCH fires,
because a stray tap sends a child a line about a conversation that never
happened. On commit the row swaps in place and stays for the visit. The
prompts GET filters `lesson_pass:` server side and selects `cta, reason,
child_id`; `collect.ts` selects `reason`, tags the row, and the Today ideas
count excludes it; `moment.ts` exempts the prefix from the pending count.
Under 7 the row's title and line read together, and the done state hands the
parent words to say out loud rather than a screen the child is not looking at.
(Parent UX 1 to 4, app lead B1, child lens, engineer 4 and 5, designer 5.)

**A6. The tap, with a route, and the parent's words carried back as the tap
they are.** The PATCH accepts `reaction` only for `kind = 'celebration'` with
a `lesson_pass:` reason; the `not` write locks on `.is('reaction', null)` and
the `helped` write on `reaction is null or reaction = 'not'`, so the upgrade
the plan promises is possible and the guard asserts both halves. No
`family_quests` insert and no stars: a tap that pays becomes a currency, and
once a parent knows it pays, "Teo taught you on Wednesday" stops measuring
anything. Instead one builder, `taughtMeLine(name, noun)` in
`lib/lessons/taught-me.ts`, used by Home, the push and the week card so all
three say the same thing, with no pronoun and the name optional, reporting the
tap rather than inventing a quote:

- "Sam ticked Teo taught me. The mood audit, at tea."
- "Your grown up ticked Teo taught me. The mood audit, at tea."
- When the parent typed something: "Sam wrote: you explained that better than
  the news did."

Three taps: `Teo taught me` on the Today row and the hub row; `Had a go, not
yet` and `Later` on the hub row. None on any token page. The passport row
reads "2 of 10 · talked about 2". Tap rate is the number to instrument, and if
Sunday's untapped line does not lift it the fix is richer words, never stars.
(Learning scientist, child lens, parent UX, app lead, engineer 4 and 11.)

**A7. Home reads one thing.** `journey.ts` and `suggestions.ts` take the count
and next title from A1; the alerts row becomes "Teo's next lesson: <module>.
It is on their app. Do it together or give them a nudge", with no date and
hidden while a pending pass row exists for that child. `daily-tasks.ts` builds
the Lesson rung from A1. Home's own `stageLessonRows` goes. `moment.ts` and
`word.ts` label `/dashboard/lessons` as "Teo's lessons".

**A8. The Sunday email says it back, from data, to the family that did the
lesson.** The cron gates on `school_lesson` completions as well as ticks and
check ins; `gatherWeek` selects `child_id` and titles school ids through
`starLessonTitles` (and `starLessonNotes`). `weeklyReviewEmail` gains a
"Lessons this week" block built from `stats.lessonPasses[]` and
`stats.stuckLesson` in fixed words, never the model's summary: the pass with
its count and day, the taught line or a link to tap it, the child's sentence
quoted when there is one, the Remember result **both ways** ("got last week's
question right first go", or "last week's question tripped Teo. It comes back
next week. If it helps, the idea is: <listen_for>"), and the stuck line once
per mission with Orbit's question for the parent's own phone. Led by the
friend who taught the lesson, through a new `emailFriendByCast`, and readable
with no images at all. (Parent UX, learning scientist 3, engineer 5, designer
6.)

**A9. One door, one lock.** `/dashboard/lessons/path` redirects preserving
`stage`, `child`, `lesson`, `from`; the first tab scrolls to the lesson;
`?stage=` opens the first tab; `BackTo` keeps the passport fallback.
`lockedModuleIds` in `school-path.ts` is used by the child's list, the hub,
the opener (reading `hasFullAccess` as the list does) and the POST.

**A10. The hub's first tab.** Eyebrow from `stages.ts`
(`STAGE 3 · EXPLORER · AGES 11 TO 12`), heading `Teo's lessons`, the line
"Teo does these on their own app, one a week. Your job is one question at
tea.", the three tabs with the order computed before the `TABS` block, then
**the road strip** (the visual spec below) with "2 passed · 8 to go", then the
hero, then flat rows, the stage check card, the For you pointer and the school
code card. No stage chips; `See what Stage 4 covers` at the foot.

The hero is the week's lesson, whose row always exists. State read from the
row and capped so it is never a guilt counter: "On Teo's app from today" on
Monday, "since Monday" inside seven days, "since last week" inside fourteen,
then "Waiting on Teo's app". After a pass this week: "Passed Tuesday" with the
tea question, then "Next: Social workarounds, on Teo's app now". After a fail
it reads the latest `passed: false` completion: "Had a go on Tuesday. Still on
Teo's app, no rush", and on a second fail "Had a go twice. The nothing verdict
tripped them", with the secondary button relabelled "Do the tricky bit
together, five minutes" and opening at the reteach slide.

Buttons: `Give Teo a nudge` (its three states read from `{ sent, reason }`:
nudged, quiet hours, no device, the last being honest because the child's week
card shows the nudge line) and `Do it together now`, every age, opening the
opener with `from=hub`, with the line "Together means you read it out and Teo
taps the answers. Either way the pass lands on Teo's passport." **Until this
child's first pass, `Do it together now` is primary and full width**: "Do the
first one together on this phone, fifteen minutes. Then show Teo the code and
the rest are theirs." They swap back after that pass, so a family who pays
today can reach the moment today rather than waiting on a child opening a
link. `Send to Teo's phone` no longer exists. With no app at Stage 2 and up,
`Show Teo the code` is secondary to `/dashboard/setup#share` (the anchor
exists, and A12 taps it); under 7 the no app block never renders and
`Do it together now` creates the kid link when none exists. Nothing on the
parent's side ever reads "waiting for your grown up" on the child's.

Every parent facing line that says "app" branches at `isTogetherStage`: the
heading line, the hero state ("This week, together", "Done together on
Saturday"), the Today row and its done state, the alerts row, the Sunday pass
line, and no pass push at all under 7, because the parent is holding the phone
that just showed the pass screen. (Parent UX 2 and 3, app lead B2, child lens,
engineer.)

Rows: the tick; "All four check questions right first time" or "Right first
time on 3 of 4, the nothing verdict took a second go", built from the count;
"Done together on Saturday" at any age when `done_together`; "What the lesson
taught: the mood audit. Close it, ask better, worse or nothing, log one word"
from `teacher_notes.tool.heading` and its lines; the tea question with
`LISTEN FOR` and `THEN ASK`; `TEO SAID` when there is one; the three taps; the
talked state. Under 7 a row shows only "Done together on Saturday" and "What
Teo said". Two children: the name in the heading, the tab label and the row
eyebrow, the nudge taking the resolved child's id, `key={child?.id}` kept. The
library tab's line and the Stage 1 card as in v4, with
`check-watch-stage-copy.mjs` lines 84 to 90 changed with the copy and the
identifiers kept.

**A11. Guards rewritten in the same commit as the code**, listed in full
below.

**A12. The walkthrough gate.** Migration 367 applied before the deploy, then
on the live database with a test family, pasted into the PR body: the Monday
row present before any tap; a nudge in quiet hours; a fail, a retake on the
reserve, then a pass (one attempt per payload, no stars on the fail, paid once
on the pass); a double tap on the last slide; two children with one sibling
pass (two Today rows); the Today pill, the Undo, the swap, and the parent's
line on the child's side with no name on file; a tap after Sunday marked the
row `seen`; `/dashboard/setup#share` landing; the ks3-10 kid deck timed on a
real phone (over eighteen minutes, cut the keywords slide, the breath and the
quote before any scenario, and time one deck per stage); the stage check pool
size.

### PR B: the player for one child, and for a sofa (medium, no migration)

**B1. The deck for one child**, through `visibleSlides`: a discussion slide
becomes "Think it", one word typed or a two chip pick before "Show me" reveals
the `lookFor` line, so nothing is a dead tap; the tryit renders the worksheet
items as unscored verdict cards minus any item used as a prove or reserve, in
the ten decks with no practise sort, as "Finish the sentence" on the six
sentence completion decks, and skipped where a sort already does the job; the
existing 24 practise sorts get `kidMode` threaded into the interactive
registry so no child alone sees a class tally reading one, nought, nought, and
the label reads "Your turn · tap your verdict"; the class tally becomes one
tap; the half time slide reads "Two breaths with Orbit. Then one thing that
surprised you, in your head"; the title slide says "About 15 minutes", and
"About 12 minutes" in together mode; the starter is labelled "Warm up from an
earlier lesson. No score, have a guess" when no passed module precedes and is
kept out of the stage pool then; the deck's passport slide is skipped; concept
slides show their recap line above the paragraph; the next lesson's title
slide reads the previous commitment from `localStorage`. Saved place per
mission, capped at the slide before the first prove item, "on this phone".

**B2. The pass screen.** The module's friend at 112 with DiGi at 56 beside it,
the tool as the hero, then the three tile row, then the commitment stem with
its blank, then the tea question told to the child first with the grown up's
first name where there is one, then "Next up: Social workarounds. Open now, or
it is next week's card", then the dignity line: "Your passport ticked. Your
grown up sees the tick, when you have a go, which check question took you two
goes, and your own words if you choose to show them. Never which answer you
picked." Nothing about stars, nothing about the parent's words. "Show my
grown up" writes `child_note` (200 characters, plain text) and is labelled
"Add what Teo said" when the opener came from the hub.

**B3. Together mode for under 7.** `together_prompt` as a quiet "Say:" strip;
discussion slides "Ask each other:" with no timer; sheet and circle time
slides skipped. The deck keeps the lesson: star breath, the friend's question,
the three words, the diagram, a photo is real and dragons are made up, the
sort, who is a grown up you could ask, the two prove items, three fingers, the
chant, Fill the page showing the real passport, the goodbye. About twelve
slides, twelve minutes. Pebble at 112 on the pass screen, no tile row, one
textarea, "Tonight at tea, Teo teaches you the star pause. Then tap Teo taught
me on your Home", and `Back to your Home` to `/dashboard?child=<id>` only with
`from=hub`.

**B4. The stage check asks the child's lessons, marked server side.**
`stage-quiz-gather.ts` exports `questionsFromSlides` and `standsAlone` and
gains a source; the kid route passes the child's school modules through
`starLessonDecks(admin, ids)`, ordered by `first_correct ?? correct`, with at
least one application item (a reserve the child has not met, else a verdict
item) per lesson; `orderPoolByHistory` prefers an item unseen in any `run_id`;
the stage quiz route marks from the pool, not `body.correct`. Its heading says
"the questions the lessons asked".

**B5. The child's list tells the whole truth**, with the Friend Tiles and the
road strip from the visual spec, the tool chip, "Passed" with no bare count,
the locked row reading "After Social workarounds, this one is waiting for
you", and the once line: "Your grown up sees when you open it, when you have a
go, and which check question took two goes. Never your taps."

### PR C: the week after (medium, no migration)

**C1. The cron carries the week.** Its own loop before the `kid_days` gate:
`ensureWeekMission` for every child (a `children` read by `parent_id` with the
age band, so an under 7 child with no `kid_links` row is included), and
Orbit's note once per mission on the weekday this child most often opens the
app (one grouped 28 day read, Saturday with no history), setting `noted_at`.
The note replaces that day's push, never joins it; a mission takes at most one
note and one nudge, ever; from week three the card alone carries "No rush." At
Foundation the note goes to the parent through the parent push, once per
mission. The cron's comment block is rewritten to say all of this, because its
current rule is one push a day only to a child who has opened the app.

**C2. The child's week card**, above `KidFiveADay`, replacing the "Star
lessons from your grown up" section: this week's lesson with its friend, tool
and stars, "Any day this week", rotating to the tool line in week two and "No
rush. It is here when you are" in week three. After a pass it holds the
commitment, the seven night log (three buttons, `localStorage`, never sent,
reading the pattern back on night seven and folding to a "Last week" row), and
the parent's line for seven days. **When `done_together` is set it branches**:
"Sam did this one with you on Saturday. The tool is yours", with the
commitment blank and the log unprompted, and the list row keeps a quiet "Go
through it yourself" that mints nothing, so a lesson done on the parent's
phone still hands the child their half.

**C3. The Remember check, real and scheduled.**
`app/k/[token]/remember/page.tsx`: the token check; the child's passed
modules; three questions, one tap each with the why; the lesson's Friend Tile
beside each question; a token POST recording under `source: 'remember'` with
`lesson_id` and ticking the quiz step. The page says "No stars, no stamp. This
one counts toward your five. The one that tripped you first, then two more."
The due rule in a pure `lib/kid/remember-due.ts`, guarded on fixtures: due 5
to 9 days after a pass, again at 30, then **every 90 days for as long as the
child is in the stage, including after the stage check is passed**, because
that is when it is the only thing left; ranked missed first then longest
overdue; three a day until every due lesson is covered; never forced on a day
the next lesson is already passed; a `done_together` pass for a child with
their own app is not due until the child has met the tool there. **At
Foundation**: due once at 5 to 9 days, verdict items only, two options, read
aloud by the grown up ("Grown up, read these out. Three questions, about a
minute. No score"); with no child app it goes to the parent as one Today row,
"Ask Teo one from last week", with an `Asked it` pill and no marking.
`loadDay` forces the quiz step only when something is due, replacing a middle
row so a Foundation day stays four.

**C4. The week after the modules run out.** Once every module in the stage is
passed, the child's week card and the hub hero name the Remember check as the
week's thing ("Nothing new this week. Thursday's Remember check keeps your
tools sharp") rather than a finished stage check card, and a **Tool of the
week** row draws one passed module's tool, an unused reserve or worksheet item
as its scenario, and that module's `then_ask` as the tea question, so the
parent's row, the tap and the Sunday line keep coming on content PR D already
wrote. (App lead C2.)

## The visual spec

The designer's full spec is in `lessons-review/round4/designer.md`. Its
surfaces land in the PR that owns them. Nothing is generated, nothing is
regenerated, no new art is commissioned: everything below is an existing asset.

**The Friend Tile, the one device on every surface.** Ground
`CHARACTERS[key].soft`, 2px edge `accent`, `--radius-tile`, the friend's
cutout at 118 percent anchored to the floor, the module's position as a mono
badge top left. The friend is `characterKeyFor(row.character_cast)`, no new
mapping. The pose carries the state, so eight Orbit cards are not eight
identical pictures: passed is `moods.happy` on the friend's soft with its
accent edge; this week is `moods.thinking` with a 3px accent edge and
`--lift`; ahead is the base cutout on cream with a hairline border; locked is
the base cutout at half opacity with a padlock, never hidden, because a child
should see whose lesson is waiting. DiGi fronted modules draw the 3D star and
skip the pose swap. Sizes: 76 on the child's list, 56 on hub rows and the week
card, 44 on the pass screen's Next tile and beside each Remember question, 26
inside the Today row's existing 38px plate (whose ground becomes the friend's
soft), 96 in the email. On a load failure `FriendMark` falls back to the
friend's emblem and the tile keeps its colour, so a failure is a coloured tile
and never an empty box. No `character_cast` means DiGi, the guide.

**`components/lessons/LessonRoadStrip.tsx`, rendered identically on the
child's list header and the parent's hub.** Ten dots plus a stamp square,
geometry borrowed from `StageDot` so the lessons road and the road to 16 are
one family, the friend mark standing on the current dot (the one place that
device is used), the stamp as the final node in sage once passed. This is the
one glance answer to what is outstanding for the pass of the stage, and it is
the same eleven shapes on both phones. The stamp silhouette is identical on
the child's check card, the last road node, the passport row and the hub's
check card.

**The pass screen** (PR B): the module's friend at 112 with `arrive` and the
register ladder for its key stage, DiGi at 56 to its right, the tool as the
hero at display weight, then three white tiles, `THE CHECK`, `THE COMMITMENT`,
`NEXT UP`, the last carrying the next module's tile at 44 so the next friend
is met before the next lesson. The near miss screen keeps its words and its
DiGi, with the module friend joining at `thinking`, smaller. No sad pose
exists and none is made.

**The hub first tab** (PR A): the road strip above the hero; the hero the only
card on the page with a shadow; `Do it together now` gold with the house
shadow, the nudge outline; state lines in mono, never red, never a count of
days; rows flat with 56 tiles and no buttons. No stage pastels: the friend
colours carry it. The parent's eye goes strip, hero, rows: outstanding, this
week, what happened.

**The Today row** (PR A): the friend's plate, the labelled pill on the thumb
edge, the swap in place on commit. No friend on any other row, in the
navigation or on the library tab: the parent's app stays an adult's app with
one warm row.

**The Sunday email** (PR A): a cream panel after the stats table, the
teaching friend's email PNG at 96 through `emailFriendByCast`, one image per
email even with two passes, alt text carrying the sentence, and the block
reading perfectly with no art at all.

**Motion**: GSAP, one timeline, on the pass and nowhere else. 900ms: the week
dot fills and scales back out, the friend mark travels to the next dot, the
tool word fades up. `prefers-reduced-motion` respected, which `FriendPlate`
already checks. The hub has no motion beyond the pill's swap: a parent's
screen does not perform.

**Restraint, deliberately**: no confetti on the road (`HappyNews` owns
confetti and two celebrations for one pass is a product that does not trust
its own news); no friend scene, background illustration or sticker scatter; no
second animation beyond the register ladder; no friend above 28px on a list
row; no new icon set, radius or shadow; no art on a push.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| The pass is the prove items on the settled answer; the first tap is the in lesson signal; feedback on every option | Kornell, Hays and Bjork 2009 (a wrong attempt plus feedback helps later recall); Butler and Roediger 2008; Soderstrom and Bjork 2015 (performance during acquisition is an unreliable index of learning, so the gate is for learning, the first tap is the less contaminated of the two in lesson numbers, and the retention claim comes only from the Remember check at a delay) | Learning scientist, teacher, child lens |
| Four prove items, honest distractors, no length cue, kept apart from the practice | Haladyna, Downing and Rodriguez 2002 (item writing and item independence); Little, Bjork, Bjork and Angello 2012; Roediger and Karpicke 2006 | Teacher, learning scientist, app lead |
| One spare per item; the retake re teaches the idea that failed then asks its own spare | Rawson and Dunlosky 2011 (relearning is of the item that failed); Pyc and Rawson 2009 (the attempt must be effortful and successful); Butler 2010 and Pan and Rickard 2018 (transfer to new scenarios); Rosenshine 2012 | Teacher, learning scientist, engineer |
| Practice before the prove, generating rather than revealing | Rosenshine 2012; Chi and Wylie 2014 (ICAP: a typed completion or a verdict tap is constructive, a reveal is not) | Teacher, learning scientist, child lens |
| Remember at 5 to 9 days, 30, then every 90 for as long as the stage lasts; three a day until covered; application items | Cepeda et al 2008; Rawson and Dunlosky 2022; Kang 2016; Rohrer and Taylor 2007; Agarwal, Nunes and Blunt 2021 (low stakes retrieval) | Learning scientist, app lead |
| Once a week, fixed, forgiving | Dunlosky et al 2013 (distributed practice), and the product's own data once it runs. Duolingo's streak figures are a company blog, read as practice | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| No reward on the parent's tap; the parent's own words instead | Deci, Koestner and Ryan 1999 (expected performance contingent tangible rewards undermine, more so for children), and the product reason: a tap that pays stops measuring anything | Learning scientist, app lead, child lens |
| The commitment stem and the seven night log | Gollwitzer and Sheeran 2006 (implementation intentions); Harkin et al 2016 (progress monitoring works when the reading is recorded and seen, which is why Sunday reports a miss as well as a hit) | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps; the pass is finishing it | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek et al 2015; Takeuchi and Stevens 2011 | Learning scientist, teacher, child lens |
| The parent sees what the lesson taught and a tap that does something | EEF parental engagement (an average across very different programmes, as the toolkit says); Sparx's parent email and Khan's family engagement research, read as practice | App lead, parent UX |
| The week's lesson is the app's own; the parent's nudge is in the parent's name | Grolnick 2002 and 2009 (autonomy support against control); Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| The first finished lesson is the onboarding | Khan Academy Kids drops a child into content in the first session; Duolingo runs its first lesson before sign up | App lead |
| The cast on every thumbnail, one friend one tint, the register ladder | The 5 October brand decision; Duolingo's path nodes and mascot on the path; Khan Academy Kids' library; Finch's one character at the top and plain rows below | Designer |
| Fifteen minutes on a phone, twelve at five | A judgement, timed on a real phone in A12. The Oak evaluation supports a phone first player, not a length | Child lens, teacher |

## What the guard asserts

`scripts/check-lesson-path.mjs`, with rules 1 to 4 rewritten in the commits
that change them, plus:

1. `lesson-path.ts` takes `passBy`, returns the school pair, the AI pair and
   `anyLesson`, and is imported by `progress.ts` twice, the hub, `journey.ts`,
   `daily-tasks.ts`, `app/api/kid/day/route.ts`, `lib/planet/server.ts` and
   the weekly review; no file under the lessons folder does its own count or
   redeclares an `age_7:` map; `getDailyTasks` is gone.
2. Fixture run, no database: two children with one sibling pass, a failed run,
   a retake after a fail, a legacy null child row, a stage with two AI
   modules, and a child with Learn tab passes and no school pass. Assert the
   pairs per child, the hub's row count equal to the passport's school total,
   the list header and the road agreeing, and that `anyLesson` never falls.
3. `shared/lesson-slides.ts` exports `lessonPassed`, `reteachIndex`,
   `retakePlan` and `visibleSlides`; the player and the route import
   `lessonPassed` in one commit; neither contains `0.7`; `tryAgain` clears the
   answer refs and mints a `run_id`, and a fixture retake's payload holds
   only this attempt; a fixture retake shows only a reteach slide and a
   reserve, never a practise, discussion or breath slide; a fixture deck with
   a reserve passes when it stands in for the item named by `reserve_for`; a
   Reception fixture with one settled miss passes with `together`; the route
   verifies `question` against the deck at `slide`, reads `phase` from the
   deck, derives `together` from the key stage, fails a run with a missing
   prove answer, and records with `source`, `phase`, `first_correct` and
   `run_id`.
4. Migration 367 exists; `answers.ts` inserts the new columns and its source
   union holds `remember`; `fetchAnswerFacts` coalesces `first_correct` and
   `correct`.
5. The mission update has `.eq('status', 'sent')` and `.select(`; the
   completion, stars, card and push sit inside the returned row branch; the
   `digi_prompts` insert carries `kind`, the `lesson_pass:` reason with the
   id, `child_id`, `cta`, a non null `title` and `body`, and sits inside
   `credit()`; the push literal matches.
6. The send route reads the catalogue through `createAdminClient()` with
   `character_cast` in the select, reads `children` for ownership, calls
   `pushToChild(`, returns early on a `done` mission and inside seven days of
   `nudged_at`, and sets `nudged_at`; `pushToChild` returns `{ sent, reason }`;
   `WEEKLY_LESSON_STARS` is the one constant three writers use;
   `ensureWeekMission` is exported and called by the opener, the pass route,
   the cron and the hub, never on the `?stage=` path.
7. The lock rule is one function used in four places and the opener reads
   `hasFullAccess`.
8. The prompts GET selects `cta, reason, child_id` and filters `lesson_pass:`
   server side; the PATCH accepts `helped` over an existing `not` exactly
   once and `not` only over null; no `family_quests` insert exists in the
   prompts route and none anywhere carries a `Taught:` title; no file under
   `app/k/` or `app/api/kid/` writes `digi_prompts.reaction`; the weekly
   review's `seen` write does not touch `reaction`.
9. `TodayCard` takes `lessonPasses` and renders a labelled `action` with an
   Undo on those rows and never the ring; `DigiPrompts` skips `lesson_pass:`;
   `moment.ts` exempts it; `collect.ts` selects `reason`, tags it, and the
   ideas count excludes it.
10. The weekly cron gates on `school_lesson` completions; `weekly-review.ts`
    selects `child_id` and calls `starLessonTitles(`; `templates.ts` renders
    the block from `stats.lessonPasses` with a miss line as well as a hit, and
    calls `emailFriendByCast`; the stuck line and a pass line never share a
    lesson id.
11. No child facing lesson line contains a gendered pronoun for a parent, and
    every such line renders with a null parent name; `taughtMeLine` is the one
    builder used by Home, the push and the week card; no card, row or push
    body contains "learned", "now knows", "can now", "Today" or "Sent by"; no
    child facing lesson screen contains "screen time"; the pass screen
    contains no star count; the kid list contains no "ask your grown up to
    open".
12. `/path` redirects preserving the four names; `passport-sections.ts` still
    links it; the first tab carries `data-do-together` and
    `schoolModulesForStage`; `check-watch-stage-copy.mjs` matches the A1 count
    and the `TABS` block is free of `childStageNum`.
13. `'lesson'` and `'quiz'` are absent from `ROTATING`; the `LEARNING` pair,
    `markStepQuietly(..., 'lesson')` and the `?next=1` redirect are gone, with
    rules 2 and 3 rewritten; `check-learning-step.mjs` rewritten; a fixture
    day for a child with no passes and nothing due completes without a quiz
    step; a forced quiz replaces a middle row; `/k/[token]/remember/page.tsx`
    exists before the href points at it; `questionsFromSlides` and
    `standsAlone` are exported; `remember-due.ts` passes its fixtures (5 to 9,
    30, 90s continuing after the stage check, ten due lessons giving three a
    day until covered, Foundation once only on verdict items, a
    `done_together` pass waiting for the child, never on a day the next lesson
    is passed); the cron's ensure and note sit before the `kid_days` gate and
    no mission takes a third push, with `noted_at` and `nudged_at` separate.
14. The stage pool comes from `schoolModulesForStage` with an application item
    per lesson, prefers an item unseen in any `run_id`, and the stage quiz
    route marks from the pool.
15. The saved place is capped at the first prove index; `child_note` is capped
    at 200; `KidQuestScreen.tsx` contains no "from your grown up" and renders
    no mission list apart from the week card.
16. Content: every KS2 and up module has four `prove` slides, two of them
    `kid_only`, and four `kid_only reserve` slides whose `reserve_for`
    resolves one per prove item; every `reteach` resolves to a teach slide
    lower than the first prove index; no prove or reserve text matches a
    practice card or a teach sentence in the same deck; no right answer more
    than 20 percent longer than its longest distractor **on prove and reserve
    items**; three options on every prove item outside Foundation, which keeps
    two of two; `listen_for` and `then_ask` on every module; no family
    question opening with the three banned stems; `together_prompt` on every
    slide the together deck shows; `expected_verdict` and `teaching_point` on
    every worksheet item; `tool` an object on all 34.
17. `visibleSlides` is called by the five schools surfaces, the kid player and
    the co viewer; no schools surface renders a `kid_only` slide; each
    module's printed check count is unchanged and its exit checks are the two
    non `kid_only` prove items; `check-lesson-core.mjs`,
    `check-lesson-minutes.mjs` and `check-lesson-rubric.mjs` skip `kid_only`
    and pass, output pasted in PR D's body.
18. The visual layer: `listStarLessons` selects `character_cast`; no lessons
    surface contains a hardcoded `🎬`; the pass screen renders
    `FriendPlate` keyed on the module's cast; `LessonRoadStrip` is imported by
    both the child's list and the hub; the Today row's plate takes the
    friend's `soft`; `emailFriendByCast` exists and the email block degrades
    to text; `characterKeyFor` resolves all 34 rows (a fixture over the
    manifest).
19. `check-lesson-age-gate.mjs`, `check-watch-stage-copy.mjs`,
    `check-co-watch.mjs`, `check-digi-step-in.mjs` and `check-day-by-age.mjs`
    still pass, listed in each PR body as run.

## The loop, end to end, after

Monday the cron makes sure Mood and screens is on Teo's app, and Teo's home
shows the week card with Orbit on it. The hub shows the road strip, the friend
standing on dot three, seven dots and a stamp ahead of him, and a hero reading
"On Teo's app from today" with a nudge and Do it together. Thursday evening
Orbit's note arrives, because Thursday is when Teo opens the app, and it
replaces that day's push. Teo gets fifteen minutes in the kid register: a word
typed before each Show me, six real closes to sort, four prove items with
honest distractors. A miss on the nothing verdict re teaches the mood audit
slide and asks that item's own spare scenario, two screens, not ten. The pass
screen gives him Orbit at full size, the tool as the headline, the check, the
commitment and the next friend, the tea question he will be asked, and the
dignity line. The route verifies every answer against the deck, locks on the
status change, records the first tap, the settled answer and the run, writes
the completion, pays 10 stars once, pushes the parent the question, writes the
card, and makes sure the next lesson's row exists. Home shows the pass as the
first row in the Today card, Orbit on its plate, a labelled pill on the thumb
edge, one row per child. At tea Teo teaches it, the parent asks the then ask
and taps the pill; the row swaps and stays; Teo's app says "Sam ticked Teo
taught me. The mood audit, at tea." On the week card Teo logs one word a night
and on night seven reads his own pattern. Six days later the Remember check is
forced into his day: the item that tripped him, a scenario he has not met, and
one more. Sunday's email leads with Orbit, names the pass, the conversation,
the Remember result either way, and the sentence Teo chose to show. Under 7 the
Monday row exists without an app, the parent taps Do it together, reads the
"Say:" strip, the child taps, the pass is finishing it, the parent types what
Teo said and taps Back to your Home, and the pill waits there with words to
say out loud. When the stage's modules run out the week card names the
Remember check and a Tool of the week keeps the parent's row coming. At the
end of the stage the check asks only what Teo's own lessons asked, on
scenarios he has not met, the ones he missed first.

## Decisions for Justin

1. The AI modules leave the lessons count (recommended), or stay with the
   13 September gate and show on the first tab as Do it together. Stamps
   already issued are untouched either way.
2. Stars: 10 for a pass, nothing on the parent's tap, the parent's own words
   carried back instead (recommended, and all three lenses that argued for
   stars withdrew). The app lead would also bring a film's first watch from
   10 to 5 so fifteen minutes with a check outranks pressing play; the plan
   assumes 10 stays.
3. Four prove items and four spares on KS2 and up now, in PR D, as child only
   slides so the classroom deck and its printed pack are untouched
   (recommended by every lens that scored it). The seven Foundation decks keep
   two of two.
4. **The curriculum cadence.** Nine modules is nine weeks against a
   subscription that can run three years. PR C keeps the week alive with the
   Remember check and a Tool of the week, which buys months on content that
   already exists. Whether the scheme grows past nine modules a stage, and at
   what rate, is a curriculum decision rather than a build one, and it is
   yours. The plan does not assume it.
5. The order: D, then A, then B, then C. All four before the schools pilot
   families reach the first KS3 module.

## Not building, and why

- A new assignment table, a new player, a new push path, a new cron, or any
  generated or regenerated character art.
- Stars for the parent library, stars on the parent's tap, a first tap bonus
  on a school lesson (it would reward the exact signal the parent reads).
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson, a weekly lesson run counter, a date on Home's
  alerts row.
- A lesson day setting, a voice note, a keepsake surface in the child's
  passport, a stage certificate, the class tally rendered as the class the
  child joined, confetti on the road. Later or never.
- The 20 percent length rule on the 117 existing teach items: a second,
  named content pass, so PR D stays a day's work.
- More Foundation modules in this plan: seven is a term at one a week, and
  the cadence is decision 4.
