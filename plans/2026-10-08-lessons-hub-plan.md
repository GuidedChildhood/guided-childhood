# 8 October 2026: Lessons, version 6. The child learns it, the parent closes it, both can see it stuck, and the cast carries it

Justin: "these are really for the child to do ... it looks like we are asking
the parent to take the lesson. Come up with the best way to run this so it is
coherent, flows and loops, so the parent can be confident the child learns ...
What we come up with must encourage ticking off on the system (lesson done,
passport) and the child's app wiring works." Then: "check your advice with as
many agents as possible ... as if the best school lessons but top known proven
methods for best results, and the mechanism is easy for parents and gives them
a wow factor. Do not stop until it scores 10 out of 10." Then, adding the
seventh lens: "a separate agent that makes sure it all appears easy to use and
uses images of Planet Friends animations on thumbnails in a really attractive
way as good as any character SaaS plus the front page and flow and easy to see
what is outstanding for pass of stage ... better than any character platform
lesson education tracker ... connected both co viewer or on child's app with
feedback to parent and PWAs emails linked not over done."

Five versions, each through the same panel. Six lenses to version 3, seven
from version 4: a teacher, a learning scientist, a learning app product lead,
a parent UX reviewer, a sceptical engineer, a child lens (a 12 year old alone,
a 5 year old on the sofa) and a design lead for character led learning
products. A, B and C are the child's learning, the parent's ease and wow, and
whether the loop runs; the designer scores Looks and Flow.

| Lens | v1 | v2 | v3 | v4 | v5 |
|---|---|---|---|---|---|
| Teacher | 6/5/5 | 7/8/7 | 9/10/9 | 9/10/10 | 9/10/10 |
| Learning scientist | 7/6/6 | 8/8/7 | 9/9/9 | 9/10/9 | 8/10/8 |
| Learning app lead | 6/5/5 | 8/8/7 | 9/9/8 | 10/9/9 | 9/9/8 |
| Parent UX | 3/4/3 | 8/7/6 | 9/9/7 | 10/10/10 | 10/10/10 |
| Sceptical engineer | 4/5/5 | 6/7/5 | 7/8/7 | 8/8/7 | 8/8/7 |
| Child lens | 5/5/4 | 7/8/7 | 9/9/9 | 9/9/9 | 9/9/9 |
| Designer | | | | Looks 4, Flow 7 | Looks 7, Flow 8 |

Reviews in `lessons-review/round1/` to `round5/`. Round 5 found two classes of
problem version 5 had introduced, both now closed: a retake that could never
pass, found independently by three lenses, with my own guard asserting the
thing that broke it; and a visual spec whose premise was wrong, because the
cast is one friend per stage rather than one per module, so a Friend Tile on
every row was decoration and a padlocked friend put the paywall back into the
child's picture after three rounds took it out of the child's words. Round 5
also showed that one pull request was four, and that the content pull request
gated the whole loop behind 162 new questions. Version 6 reshapes the build
into five, so a first family is through the loop in two merges.

The visual spec now lives in the repo at `brand/lessons-visual-layer.md`, with
a pointer in `DESIGN_SYSTEM.md`, because a spec in a session scratchpad is a
spec the builder reinvents.

## What is true today (verified in the code, the decks and the live database)

1. **The loop has never run.** 0 `school_lesson` completions, 0
   `stage_quiz_passes`, 2 `kid_lesson_missions` ever, 0 answers with source
   `school_lesson`.
2. **The parent send route is dead** (RLS since migration 274), never pushes
   the child, never checks ownership, resets a passed mission, no paywall
   check. `pushToChild` returns nothing and leaves in quiet hours before any
   read.
3. **The check does not measure the lesson.** 194 choice slides across the 34
   decks, 117 with the right answer more than 20 percent longer than its
   longest distractor. 68 prove items, two per deck, 49 of them over that
   rule, 10 with only two options (no second go, `retryWorthHaving =
   optionCount > 2`), including both in the first Reception deck. Every prove
   slide declares `minutes: 2`, and ks3-10 declares 69 minutes in total, the
   classroom hour. **37 of the 68 prove items announce themselves to the child
   as "Exit check one."**, teacher register and wrong arithmetic once there
   are four; the other 31 announce nothing, so whether a child knows their
   first answer counts depends on the deck they drew. `tryAgain` rewinds to
   the slide before the first wrong answer, re asks the question whose answer
   just settled green, and banks the previous run's answers rather than
   clearing them.
4. **The player's pass is shared with four other products.**
   `LessonPlayer.tsx:1481` computes `passed` at 0.7 over every choice slide
   for `lessonSource` of `lesson`, `ai_lesson` and `school_lesson`, across
   twelve mount points: the parent library, the AI modules, the tutor decks,
   the adventures, the schools class player and the tracker. Two further files
   hold their own `PASS_MARK = 0.7` and are the family stage lessons.
5. **Nineteen files read a deck.** `parseSlides` is called by nine schools
   surfaces (`class/[lessonId]`, `lesson/[module]`, `lesson/[module]/run`,
   `teach/[module]`, `hub/vocabulary`, and `print/[module]` with its
   `booklet`, `organiser` and `overview`), the kid mission page, the kid
   tutor, the kid lessons page, the parent library player, the AI module
   player, `TutorLessonCard`, `stage-quiz-gather` and two dev pages.
   `print/[module]` takes its printed check as `checks.slice(-2)` over every
   choice slide, and `lesson/[module]/run` sums `slide.minutes` across the
   deck, so appending anything to a deck silently changes both the printed
   pack and the hour a teacher is shown.
6. **Stars pay on completion, not the pass**, and a fail tells the parent "3
   stars landed". A pass is 3, a first film watch 10. The opener sets 3 while
   the POST default would set 10.
7. **The child's answers are thrown away.** Migration 239 holds `question`,
   `chosen`, `correct`, `lesson_id`, `stage_id`; `fetchAnswerFacts` selects
   `correct`; the source is a literal union.
8. **The child's stage check draws from the parent library** and trusts
   `body.correct`.
9. **The week between lessons is a dice roll**: `pickDay` draws the lesson and
   the quiz by seed, a drawn undone lesson fails the day, the quiz row links
   to a page that ignores it, `/k/[token]/remember` does not exist,
   `stepForToday`'s `LEARNING` pair lets a pass tick the quiz step, the five a
   day cron runs 18:30 and skips any child with no row today, Stage 1's day is
   four steps keeping the quiz, `KidQuestScreen.tsx:2657` lists every mission
   under "Star lessons from your grown up", `lib/planet/server.ts:244` counts
   a third lesson number (non school passes plus done missions, both as head
   only counts) and persists it to open planets, and
   `app/k/[token]/page.tsx:679` hands KidRoad a second lesson pair tied to the
   stamp.
10. **The content has three shapes.** 25 decks carry `expected_verdict` and
    `teaching_point` on every worksheet item; nine carry neither (51 items),
    six as `stem` plus `text` completions; four (ks2-26, ks3-27, ks4-28,
    ks4-29) hold `teacher_notes.tool` and the worksheet items as plain
    strings. Every deck has `misconceptions` and `commitment_stem`. 24 decks
    already run a `verdict-sort` in practise, 19 over the worksheet items, and
    the interactive registry is typed `ComponentType<{ config }>`, so a
    `kidMode` prop needs that type widened or it is dropped in review.
11. **Under 7 the grown up's words are stripped**, and the Foundation prove
    items are two option slides.
12. **The parent's close does not persist, and Home reads four things.**
    `DigiPrompts` sits in a closed fold from day three; `TodayCard`'s only row
    control is the ring that means put away, label in `aria-label` only, and
    it commits before the fold; the prompts GET selects neither `cta` nor
    `reason` and returns three newest pending rows; the PATCH writes `status`
    only; `moment.ts` holds DiGi while any non insight row is pending;
    `collect.ts:39` lists every pending prompt without `reason` and the Today
    card counts them; the weekly review cron gates on an approved tick or a
    scored check in and selects no `child_id`; Home resolves one child.
    `digi_prompts.title` and `body` are not null and have no field for a
    parent's own words.
13. **The cast is one friend per stage and no surface uses it.**
    `character_cast` is set on all 34 rows and `characterKeyFor` resolves
    every one: Foundation all Pebble, Builder 8 Bloop and 1 DiGi, Explorer 8
    Orbit and 1 DiGi, Shaper 3 Nova and 4 DiGi, Independent 2 Cosmo.
    `listStarLessons` does not select the column although the row type
    declares it. The child's list draws one hardcoded clapperboard for all 34;
    the pass screen draws `DigiCharacter` for all 34; the Today row would draw
    the same book as the school week row; the email serves friends by stage,
    not by module. The child's app is washed in the child's chosen accent
    (thirteen, two dark), and the passport's stamp is a 46px circle.
14. **The weekly promise runs out, and then runs out again.** Foundation 7
    modules for ages 4 to 7, Builder 9 for 8 to 10, Explorer 9 for 11 to 12,
    Shaper 7 for 13 to 15, Independent 2. A Builder family reaches the end in
    month three of a subscription that can run three years, and `age-up` is
    the one real restock in that time: it already pushes the parent "The
    Builder stage opens", and nothing on the child's app or the hub names it.
15. **The parent's name is usually unknown and no pronoun exists.**
    `parent-name.ts` returns null for every starter pack account on purpose;
    nothing holds a parent's gender, and `WelcomeWalkthrough.tsx` already sets
    the rule, they and their. `hasKidLink` exists in `suggestions.ts` but is
    gated to 17:00 to 20:00. Explorer is "Ages 11 to 12" in `stages.ts`.

Keep exactly as it is (every lens said so): the answer beat, the near miss
screen's words, the next unpassed lesson always open regardless of the
paywall, stars minted once and derived from the mission row so they cannot
double, the stage check that only asks what the lessons asked, the characters
and their one friend one tint rule, the `FriendPlate` register ladder, the
feed mockups, the evidence slides taught honestly, the content already written
on every module, the child rail, the Today card's one row per thing, the five
a day's drawn crayon icons and its cron's restraint, `runAgain`'s existing ref
clearing, and the model.

## The model, said once

The child does the lesson in their own app, about fifteen minutes, one a week,
fronted by the Planet Friend of their stage, and leaves with a tool they can
say in a sentence. The pass is the prove items on the settled answer, the
first tap is the in lesson signal, and the child is told the check has started
and that the first answer is the one that counts. Under 7 the pass is
finishing it together. A miss re teaches the idea that failed and asks that
item's own spare question, nothing else; a second miss hands the lesson to the
parent, and the third attempt passes by the child saying the idea back, with
no first time count claimed. The week after, the child logs the tool on their
own phone for seven nights and reads their own pattern; a Remember check comes
on a schedule, drawn from every module the child has ever passed, asking
scenarios they have not met, and a missed question comes back before the
session ends. The stage check only asks what the lessons asked, missed first.
The parent has one job after a pass: let the child teach them the tool at tea,
ask one follow up, then tap Teo taught me on Home, and the child's app carries
back what the parent did, in the parent's words, never invented. The week's
lesson is on the child's app by itself, always; the parent sees the state and
can nudge once per lesson, in their own name, or do it together on this phone,
which is the main button until the child's first pass. Every number about
lessons comes from one function, and the parent and the child see the same road
with the stage stamp at the end of it. Nothing claims an outcome for a child.

## Build: five pull requests

The loop ships first and the content follows it, because the content is 162 new
questions and the loop does not need them to run. Order and migrations, re
checked against origin/main before the first push (main reached 365 on 8
October): **PR 1 takes 366**, PR 2 and PR 3 take none, **PR 4 takes 367**,
PR 5 takes none. 366 is applied before PR 1 deploys, because PostgREST
returns an error rather than throwing, so a missing column would silently drop
every answer and pay nothing on every finish.

### PR 1: the loop runs (migration 366)

**1.1 Migration 366.** `lesson_question_answers` gains `phase text`,
`first_correct boolean` and `run_id uuid`; `correct` becomes the settled
answer and `fetchAnswerFacts` reads `first_correct ?? correct`, so the stage
check's history survives. `kid_lesson_missions` gains `nudged_at`, `noted_at`
(the app's note and the parent's nudge are two senders and one column cannot
cap both), `child_note text` and `done_together boolean`. `digi_prompts` gains
`parent_note text`, the parent's own optional line to the child.
`recordQuestionAnswers`'s source union gains `remember`.

**1.2 One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath({ modules, aiModules, completions, missions, passBy,
childId })` returning `{ school: { done, total, next }, ai: { done, total },
anyLesson, statusById }`, pure over rows. `missions` is in the signature
because `anyLesson` is the planets' own number (non school passes plus done
missions) and routing the planets through this function must not close a
planet that is open today. `aiModules` filtered through
`AI_AUDIENCE_TO_STAGE`, imported, never redeclared. Called by `progress.ts`
twice, the hub, `journey.ts` (gaining a `childId`), `daily-tasks.ts`, Home's
own count, `lib/planet/server.ts` and the Sunday nudge. `app/k/[token]/page.tsx`
stops computing its own stage lesson pair and KidRoad takes the school pair.
`getDailyTasks`, a reader with no caller, goes. `app/api/kid/day/route.ts` is
not in the list, because 1.5 removes its reason to count lessons.

**Decision 1, recommended: the AI modules leave the lessons count.** The
child's list teaches AI literacy in five modules, the AI area still counts
them, and they sit at the top of For you as "Counts toward Teo's AI area".
Stamps already issued are untouched; the gate applies forward only, and
`/verify/[code]` says so.

**1.3 One deck filter, found by search and not by a list.**
`visibleSlides(slides, audience)` in `shared/lesson-slides.ts`, with
`audience` of `classroom`, `kid` or `together`. Every one of the nineteen
`parseSlides` callers passes through it. `print/[module]` stops using
`checks.slice(-2)` and takes the two classroom prove items by flag. The guard
greps for `parseSlides` and fails on any caller that does not then call
`visibleSlides`, because naming a list of five was wrong twice. In this PR the
filter hides nothing yet, so it is provably behaviour preserving: verified on
all 34 decks that the last two choice slides are the two prove items in every
one, and the guard asserts `lesson/[module]/run`'s total minutes and the
phase table's row counts are unchanged per module.

**1.4 The pass contract.** `lessonPassed(answers, { together })` in
`shared/lesson-slides.ts`: every `prove` item right on its **latest settled
answer**, a `reserve` standing in for the item named by its `reserve_for`;
when `together`, every prove item answered. Starter, teach and practise items
give feedback, are recorded, and never gate.

- **The player's `passed` branches on `lessonSource`.** The school path uses
  `lessonPassed`; the parent library, the AI modules, the tutor decks, the
  adventures and the schools players keep 0.7 untouched, and the two family
  `PASS_MARK` files are not touched at all. The guard asserts no `0.7` on the
  school branch and that a fixture family deck still passes at 70 percent.
- **Every answer entry carries its own `run_id`.** `tryAgain` mints a new one
  and clears only the failed prove items and their reserves; settled correct
  rows are carried forward with their original `first_correct`, under the new
  `run_id`. `lessonPassed` reduces by prove item on the latest settled answer.
  `recordQuestionAnswers` writes only the current run's entries, so history is
  not double written. Without this the retake posts one answer of four and the
  route fails it, which is what version 5 specified and what its own guard
  asserted.
- `ChoiceBlock` gains `onSettled(correct)`, three signatures plus a settled
  ref. The payload carries `slide`, `question`, `chosen`, `first_correct`,
  `settled_correct`, `phase` and `run_id`. The Nearly screen counts prove
  items only. "Right first time" is built from the **first** run for that
  mission, never the posted run, and the guard asserts the literal appears
  only where the first correct count equals the prove count.
- The route (`app/api/quests/lesson-complete/route.ts`) reads the deck through
  the admin catalogue, verifies each `question` against the deck slide at
  `slide`, reads `phase` from the deck, drops what does not match, treats a
  missing prove answer as a fail, derives `together` from the key stage and
  never the client, and computes the pass with `lessonPassed`. The client's
  `correct` and `total` are never read.
- The mission update is the lock: `.eq('status', 'sent').select('id')`, and
  the completion, stars, card and push happen only when a row came back. The
  surviving `status === 'done'` branch answers `{ ok: true, already_passed:
  true }` and records answers only. Continue is disabled once posting.
- **`done_together` needs a session, not a query string.** The opener sets a
  short lived httpOnly cookie scoped to that mission id; the finish writes the
  flag only when the cookie matches. Otherwise a parent who opens Do it
  together, reads two slides and stops would have the child's own pass a week
  later labelled as done with them.
- Stars on the pass only, through one exported `WEEKLY_LESSON_STARS = 10` used
  by the opener, the POST and `ensureWeekMission`. A fail pays nothing and the
  push says the child had a go. A prior `passed: false` completion marks the
  second attempt, whose push carries the missed item's why line and "Do the
  tricky bit together, five minutes", opening at the reteach slide (the
  mission page gains `searchParams`). **On a third attempt** (two prior fails)
  the route passes `together: true`, because the only spare has already been
  revealed, and the push and the row claim no count: "Did it together on
  Saturday."
- Inside `credit()` on the first pass only, one `digi_prompts` row:
  `kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `child_id`, the
  href with `child` and `lesson`, `cta: 'Teo taught me'`, and `title` and
  `body` filled.
- `recordQuestionAnswers` on every finish, pass or fail.
- `ensureWeekMission(admin, childId)` in `school-path.ts`: idempotent on the
  unique key, the next unpassed module at 10 stars, a no op when none is left.
  Called by the opener, the pass route and the five a day cron.

**1.5 The week's rhythm, in the same PR, so no child meets a day they cannot
finish.** `pickDay` stops drawing `lesson` and `quiz`; the `LEARNING` pair
retires; `markStepQuietly(..., 'lesson')` and the dead `?next=1` redirect go,
with rules 2 and 3 of `check-lesson-path.mjs` rewritten in the same commit;
`app/api/kid/day/route.ts` drops its missions read and `lessonAlreadyThisWeek`,
and `loadDay` takes over the due read PR 5 will use; `check-learning-step.mjs`
is rewritten. The weekly lesson no longer counts toward the five a day, said
out loud, because the lesson sits above it.

**1.6 The send route, alive and in the parent's own name.**
`createAdminClient()` for the catalogue reads only, **selecting
`character_cast`**; a `children` read proving ownership; the lock rule refused
with 403; a `done` mission answering `already_passed`; the upsert keeping an
existing row's stars; `pushToChild` returning `{ sent, reason }` as the ping
route does. **One nudge per mission, ever**: once `nudged_at` is set the route
is a no op and the button reads back "Orbit asked on Thursday" rather than re
enabling, so a mission that sits three weeks cannot be nudged three times. The
nudge says where it came from: "Sam gave Orbit a nudge. Still here when you
are. No rush."

**1.7 The content the loop reads, and nothing more.** The 34 family questions
rewritten to teach ("Can you teach me how X works", "Explain to me why X",
"What would you tell a friend who X"), each gaining `listen_for` (the idea in
one sentence, written fresh in the second person, never trimmed from `taught`,
every one of which opens "Today we") and `then_ask` (one why or transfer
question in the parent's life); none opening with "Which app", "What did you"
or "Did you". The ten two option prove items outside Foundation raised to
three options so the settled rule can fail them. Nothing else: the 162 new
items are PR 4.

**The honest cost of shipping here.** This cohort's gate is the two existing
prove items, 49 of 68 of which still carry a length cue, and the retake still
re asks a revealed item until PR 4. No stage stamp rests on it in the
meantime, and a fortnight of a weaker gate beats a month of no loop. It is
written here so nobody discovers it later.

**1.8 The walkthrough gate.** 366 applied before the deploy, then on the live
database with a test family, pasted into the PR body: the Monday row present
before any tap; a nudge in quiet hours and a second nudge refused; a fail, a
retake, then a pass (one row per prove item in the payload, the carried ones
keeping their first attempt, no stars on the fail, paid once on the pass); a
third attempt passing as together with no count claimed; a double tap on the
last slide; a `done_together` open abandoned, then the child's own pass, which
must not read as together; a family deck still passing at 70 percent; the ks3
kid deck timed on a real phone; the printed classroom pack and the teacher's
run minutes unchanged.

### PR 2: what the parent sees (no migration)

**2.1 The pass is a row in the Today card, labelled, for every child.** Home
reads every pending `lesson_pass:` prompt for the family; `TodayCard` takes
`lessonPasses: []`, one row per child, leading the card above the week brief,
whose comment is rewritten in the same commit. **At most two lesson rows
render**, and a Remember row never renders for a child who already has a
pending pass row, because the promise is one job. The row carries the friend's
plate, the title, the question, and **the pill on its own line at 44px**, not
in the 26px control slot where the sentence would make a five line row.
The PATCH fires at once and Undo is a second PATCH setting the reaction null
and the status pending, which the locks in 2.2 already allow, because holding
a write for four seconds while the row's body tap navigates loses taps. On
commit the row swaps in place and stays for the visit. The prompts GET filters
lesson rows server side and selects `cta, reason, child_id, parent_note`;
`collect.ts` selects `reason`, tags them, and the ideas count excludes them;
`moment.ts` exempts them from the pending count. One exported
`isLessonRow(reason)` matching `lesson_pass:` and `tool_week:` is used by
Home's read, the GET filter, the `DigiPrompts` skip, the `moment.ts` exemption
and the `collect.ts` tag, so PR 5's row inherits all five.

**2.2 The tap, and the parent's words carried back as the tap they are.** The
PATCH accepts `reaction` only for `kind = 'celebration'` on a lesson reason;
the `not` write locks on `.is('reaction', null)`, the `helped` write on
`reaction is null or reaction = 'not'` with `.select('id')` and a zero row
branch, so the upgrade the plan promises is possible and observable. No stars
and no quest insert: a tap that pays becomes a currency, and once a parent
knows it pays, "Teo taught you on Wednesday" stops measuring anything. One
builder, `taughtMeLine(name, noun, parentLine)` in `lib/lessons/taught-me.ts`,
used by Home, the push and the week card so all three say the same thing, with
no pronoun and the name optional:

- "Sam says you taught them the mood audit, at tea."
- "Your grown up says you taught them the mood audit, at tea."
- With a typed line: "Sam says: you explained that better than the news did."

The parent's typed line is one optional field beside the pill, labelled so
they know who reads it: "Add a line Teo will see. Optional.", 120 characters,
stored in `digi_prompts.parent_note`. **The guard forbids any path passing
`child_note` into `taughtMeLine`**, because `child_note` is the child's own
sentence and returning it in their parent's name is the regression round 4
removed. Three taps: `Teo taught me` on the Today row and the hub row; `Had a
go, not yet` and `Later` on the hub row. None on any token page. Tap rate per
pass is instrumented from the first family.

**2.3 The hub's first tab.** Eyebrow from `stages.ts`, heading `Teo's
lessons`, the line "Teo does these on their own app, one a week. Your job is
one question at tea.", the three tabs with the order computed before the
`TABS` block, **the road strip** and its caption from
`childLessonPath().school`, then the hero, the rows, the stage check card, the
For you pointer and the school code card. The hero's primary button must be
visible with no scroll on a 375 by 667 phone.

The hero state is read from the mission row and the latest failed completion,
capped so it is never a guilt counter: "On Teo's app from today" on Monday,
"since Monday" inside seven days, "since last week" inside fourteen, then
"Waiting on Teo's app"; "Passed Tuesday" then "Next: Social workarounds, on
Teo's app now"; "Had a go on Tuesday. Still on Teo's app, no rush"; and on a
second fail "Had a go twice. The nothing verdict tripped them", with the
secondary button relabelled "Do the tricky bit together, five minutes".

Buttons: `Give Teo a nudge` with its three honest states, and `Do it together
now` at every age, opening the opener, with "Together means you read it out
and Teo taps the answers. Either way the pass lands on Teo's passport."
**Until this child's first pass it is primary and full width**, with "Do the
first one together on this phone, fifteen minutes. Then show Teo the code and
the rest are theirs", and **it creates the kid link at any age when none
exists**, because it is the one gold button a family taps an hour after
paying. `Send to Teo's phone` no longer exists. With no app at Stage 2 and up,
`Show Teo the code` is secondary; under 7 that block never renders. One line
framing the week ahead: "Each lesson comes back a week later, then a month
later. A miss is the point, it is how it sticks."

Every parent facing line that says "app" branches at `isTogetherStage`: the
heading line, the hero state, the Today row and its done state (which hands
the parent words to say out loud, "Tell Teo: you taught me the star pause"),
the alerts row, the Sunday pass line, and no pass push at all under 7, because
the parent is holding the phone that just showed the pass screen. The alerts
row also branches on no child app, reading `hasKidLink` unconditionally rather
than through its evening gate, and is hidden while a pending pass row exists.

Rows: the tick; the count built from the items; "Done together on Saturday" at
any age when the flag is set; "What the lesson taught" from
`teacher_notes.tool`; the tea question with `LISTEN FOR` and `THEN ASK`;
`TEO SAID` when there is one; the three taps; the talked state. Under 7 a row
shows only "Done together on Saturday" and "What Teo said".

**2.4 Home reads one thing, and the Sunday email says it back from data.**
`journey.ts`, `suggestions.ts` and `daily-tasks.ts` take the count and the next
title from 1.2; Home's own `stageLessonRows` goes; `moment.ts` and `word.ts`
label `/dashboard/lessons` as "Teo's lessons". The weekly cron gates on a
`school_lesson` completion, **a lesson reaction, or a `remember` answer this
week**, so a family whose month is a tap and a check still gets the email;
`gatherWeek` selects `child_id` and titles school ids through
`starLessonTitles` and `starLessonNotes` (both new, named as new).
`weeklyReviewEmail` gains a "Lessons this week" block built from
`stats.lessonPasses[]` and `stats.stuckLesson` in fixed words: the pass with
its count and day, the taught line or a link to tap it, the child's sentence
quoted, the Remember result **both ways** ("right first go", or "last week's
question tripped Teo. It comes back next week. If it helps, the idea is:
<listen_for>"), and the stuck line once per mission with Orbit's question for
the parent's own phone. Led by the teaching friend through `emailFriendByCast`,
whose alt text names the lesson. **Every string from a child or a parent
passes through an escape helper**, because free text reaches raw HTML today.

**2.5 One door, one lock.** `/dashboard/lessons/path` redirects preserving
`stage`, `child`, `lesson`, `from`; the first tab scrolls to the lesson;
`?stage=` opens the first tab; `BackTo` keeps the passport fallback.
`lockedModuleIds` is used by the child's list, the hub, the opener (reading
`hasFullAccess`) and the POST.

**2.6 The visual layer for these surfaces**, per `brand/lessons-visual-layer.md`:
`LessonRoadStrip` taking its length from the function with no strip under four
modules, the numbered tile as the default with friend art on three rows only,
the passport's stamp circle as the final node, the Today row's friend plate
with its accent border, and the email's friend.

### PR 3: what the child sees (no migration)

**3.1 The deck for one child**, through `visibleSlides(slides, 'kid')`, which
in this PR also hides every `reserve` so the child never answers a spare on a
first run. A discussion slide becomes "Think it", one word typed or a two chip
pick before "Show me" reveals the look for line, so nothing is a dead tap; the
tryit renders the worksheet items as unscored verdict cards minus any item used
as a prove or reserve in the ten decks with no practise sort, as "Finish the
sentence" on the six completion decks, and is skipped where a sort already
does the job; the 24 existing practise sorts get `kidMode` threaded into the
interactive registry, **which means widening its
`ComponentType<{ config }>` type**, so no child alone sees a class tally
reading one, nought, nought, and the label reads "Your turn · tap your
verdict"; the class tally becomes one tap; the half time slide reads "Two
breaths with Orbit. Then one thing that surprised you, in your head"; the
starter is labelled "Warm up from an earlier lesson. No score, have a guess"
when no passed module precedes and is kept out of the stage pool then; the
deck's passport slide is skipped; concept slides show their recap line above
the paragraph; the next lesson's title slide reads the previous commitment from
`localStorage`.

**A kid minutes contract.** The three content guards skip `kid_only` to
protect the classroom, which leaves the child's deck unguarded for length at
the moment it grows. So: a kid minute per slide type (a three option tap is
under a minute, not the two a classroom slide declares), the "About 15
minutes" line **computed** from `visibleSlides(slides, 'kid')` rather than
written, twelve minutes in together mode, and the minutes guard asserting a
kid ceiling over the kid view instead of skipping it. Saved place per mission,
capped at the slide before the first prove item, "on this phone".

**3.2 The retake, as a sequence.** `retakePlan(slides, answers)` returns, for
each failed prove item in deck order, its reteach slide then that item's own
reserve, then the finish. `reteach` is a start index that plays the next slide
when it is the same teach pair, because the ideas are taught in pairs (ks3-10
teaches the evidence at 7 and the number at 8, and names the sneaky verdict at
14 rather than 13). The plan is non contiguous, so the player holds a
playlist of indexes and a cursor that `advance`, `goBack` and `isLast` read
while a plan is active; `tryAgain` reuses `runAgain`'s existing ref clearing
rather than growing a second path. Until PR 4's content lands there are no
reserves, so the plan falls back to today's behaviour and the guard says so.
After a second miss on the same item, `Have another go` gives way to the
together route, because the only spare has been revealed.

**3.3 The pass screen.** The stage friend at 112 with `arrive`, DiGi at 56
beside it except on DiGi fronted modules, the tool as the hero, then the three
tiles, `THE CHECK`, `THE COMMITMENT`, `NEXT UP`, with one mono line under the
check reading "10 stars in your bank", because 10 is the largest award in the
app and a balance should not move unexplained. Then the commitment stem with
its blank, the tea question told to the child first with the grown up's name
where there is one, "Next up: Social workarounds. Open now, or it is next
week's card", and the dignity line: "Your passport ticked. Your grown up sees
the tick, when you have a go, which check question took you two goes, and your
own words if you choose to show them. Never which answer you picked." Nothing
about the parent's words. "Show my grown up" writes `child_note` (200
characters, plain text, bounded by the same child check the complete route
uses) and is labelled "Add what Teo said" when the opener came from the hub.

**3.4 Together mode for under 7.** The `together_prompt` as a quiet "Say:"
strip (PR 4 writes them; until then the script channel is passed through for
`isTogetherStage` only); discussion slides "Ask each other:" with no timer;
sheet and circle time slides skipped. The deck keeps the lesson: the star
breath, the friend's question, the three words, the diagram, a photo is real
and dragons are made up, the sort, who is a grown up you could ask, the two
prove items, three fingers, the chant, Fill the page showing the real
passport, the goodbye. Twelve slides, twelve minutes. Pebble at 112, no tile
row, one textarea, "Tonight at tea, Teo teaches you the star pause. Then tap
Teo taught me on your Home", and `Back to your Home` to `/dashboard?child=<id>`
only when the opener came from the hub. **Foundation has no retake path**:
`together` passes on every prove item answered, so `retakePlan` is never
reached there.

**3.5 The child's list and its road.** The road strip with the child's theme
and the child's caption, "You are on lesson 3", never a count of what is
owed; numbered tiles with friend art on this week, the latest pass and the
check card; **no padlock and no dimmed friend on any child row**, the order
sentence doing that work ("After Social workarounds, this one is waiting for
you"); the tool chip replacing the score line on a passed row; the once line
reading "Your grown up sees when you open it, when you have a go, and which
check question took two goes. Never your taps."

**3.6 The stage check asks the child's lessons, marked server side.**
`stage-quiz-gather.ts` exports `questionsFromSlides` and `standsAlone` and
gains a source; the kid route passes the child's modules through
`starLessonDecks(admin, ids)` (new), ordered by `first_correct ?? correct`,
with at least one application item per lesson, preferring an item unseen in
any `run_id`; the stage quiz route marks from the pool. Its heading says "the
questions the lessons asked".

### PR 4: the content (migration 367)

Content lands as a numbered migration with mirrors in `content/modules`,
because six guards read those files. An out of cycle curriculum pass under the
term review rule, justified because the child's check is being rewritten.

**4.1 Four prove items and four spares per KS2 and up deck.** Two new
`kid_only` prove slides and four `kid_only, reserve` slides, **one reserve per
prove item**, each carrying `reserve_for` and sharing that item's `reteach`,
which must resolve to a teach slide below the deck's first prove index. The
four are ordered in teaching order so the reteach indices ascend. Every prove
and reserve item is a parallel: the same teaching point on a new scenario,
never a sentence the practice cards or a teach slide already show. Three
options; every distractor one of the module's listed `misconceptions`, pulling
on the same error as the item it mirrors; parallel in grammar; compound stems
split so each item tests one idea; **no right answer more than 20 percent
longer than its longest distractor, on prove and reserve items only**. The
seven Foundation decks keep two prove items at two options: at five the pass
is finishing it together.

**4.2 The child is told the check has started.** Strip "Exit check one." and
"Exit check two." from the 37 items that carry it, and render a mono eyebrow in
kid mode instead: `CHECK 1 OF 4 · your first answer is the one that counts`.
Without it the first tap partly measures whether the child noticed the check
had begun, which is test craft, and the wording is teacher register for a
Reception child and wrong arithmetic once there are four.

**4.3 The nine decks without verdicts.** `expected_verdict` and
`teaching_point` on the 51 worksheet items that have neither, from the
module's misconceptions and tool lines, so the spares, the Remember check's
application item and the child's practice have something to read.

**4.4 Normalise the four older decks.** ks2-26, ks3-27, ks4-28 and ks4-29 hold
`teacher_notes.tool` and their worksheet items as plain strings, and three
surfaces print the tool as a short name. Normalise to
`{ heading, strapline, lines }` and to item objects. Headings: The shield;
Name it, save it, say it; The price, the odds, the loop; Stop it, report it,
say it.

**4.5 The grown up's words on the seven Foundation decks.** A
`together_prompt` per slide, one line, from the classroom script with the cold
calls and timers removed.

**4.6** `visibleSlides` now hides `kid_only` from the classroom, and the
printed check takes the two classroom prove items by flag. Every new or
rewritten item is listed in the PR body with the teaching point it mirrors and
the misconception behind each distractor, including that each reserve's
distractors pull on the same error as the item it stands in for, because a
guard can check length and shape and cannot tell a misconception from a
caricature. The three content guards' output is pasted, with the teacher's
run minutes and the printed check counts shown unchanged.

### PR 5: the week after (no migration)

**5.1 The cron carries the week.** Its own loop before the `kid_days` gate:
`ensureWeekMission` for every child (a `children` read by `parent_id` with the
age band, so an under 7 child with no link is included), and Orbit's note once
per mission on the weekday this child most often opens the app (one grouped 28
day read, Saturday with no history), setting `noted_at`. The note replaces
that day's push, never joins it; a mission takes at most one note and one
nudge, ever. At Foundation the note goes to the parent through the parent
push. The cron's comment block is rewritten, because its current rule is one
push a day only to a child who has opened the app.

**5.2 The child's week card**, above `KidFiveADay`, replacing the "Star
lessons from your grown up" section, with the badge reading `4 / 9`, the
rotating lines, the seven night log from the pass (three buttons,
`localStorage`, never sent, reading the pattern back on night seven), the
parent's line for seven days, the nudge line from `nudged_at` inside seven
days, and the Remember warning the day before one is due. **When
`done_together` is set it branches**: "Sam did this one with you on Saturday.
The tool is yours", with the commitment blank and the log unprompted, and the
list row keeps a quiet "Go through it yourself" that mints nothing.

**5.3 The Remember check, real and scheduled.**
`app/k/[token]/remember/page.tsx`: the token check; three questions, one tap
each with the why; the stage friend once at the head; each question labelled
with its module title; a token POST recording under `source: 'remember'` with
`lesson_id` and ticking the quiz step. The page says "No stars, no stamp. This
one counts toward your five. The one that tripped you first, then two more."

The due rule in a pure `lib/kid/remember-due.ts`, guarded on fixtures:

- **The pool is every module the child has ever passed**, not the current
  stage, so a child who ages up still revisits the year they just did.
- Due 5 to 9 days after a pass, again at 30, then every 90. Where two or more
  items needed a second go, the short end of the 5 to 9 window.
- **The draw**: one item per due lesson, through `orderPoolByHistory`,
  preferring an unused `reserve` unseen in any `run_id`, else a verdict item,
  never one already met in that lesson's runs. After a miss, the why, then
  that item again at the end of the three, so the child leaves having
  produced the answer once.
- Ranked missed first then longest overdue; three a day until every due lesson
  is covered; never forced on a day the next lesson is already passed; a
  `done_together` pass for a child with their own app is not due until the
  child has met the tool there.
- **Once every module in the stage is passed the check becomes weekly**, three
  items across every passed module, because nine lessons on a 90 day cycle is
  one check a month and the card would name a check that is not due three
  weeks in four.
- **At Foundation**: due at 5 to 9 days, again at 30, then the 90 day cycle,
  in the grown up read form, verdict items, two options, no score shown. With
  no child app it is one Today row, "Ask Teo one from last week", with an
  `Asked it` pill and no marking, capped as 2.1 says.

`loadDay` forces the quiz step only when something is due, replacing a middle
row so a Foundation day stays four. A forced check left undone fails the day
and the daily push names it, which is its carrier for free.

**5.4 The week after the modules run out.** The week card and the hub hero
name the Remember check as the week's thing ("Nothing new this week.
Thursday's Remember check comes back to last week's tools"), and a **Tool of
the week** row draws one passed module's tool, an unused reserve or worksheet
item as its scenario, and that module's `then_ask` as the tea question. It is
written by the cron as a `digi_prompts` row with
`reason: 'tool_week:<lesson_id>:<iso week>'`, so `isLessonRow` from 2.1 gives
it Home's read, the GET filter, the `DigiPrompts` skip, the `moment.ts`
exemption and the `collect.ts` tag without a second mechanism. At Foundation
its scenario is one verdict the grown up reads out, so the week holds a
retrieval attempt and not only a conversation. The Sunday block gains a Tool
of the week line.

**5.5 The age up is the restock, so it is named.** `age-up` already pushes the
parent. On that day the child's week card and the hub hero say it ("Teo is a
Stage 3 Explorer from today. Nine new lessons, starting with Mood and
screens"), and the road strip starts again at one with the earned stamp shown
behind it, so a year of work is visible rather than wiped.

## The copy, exact

**The Today row.** "Teo passed Mood and screens" / "Ask at tea: can you teach
me the better, worse or nothing check?" / pill `Teo taught me`. Done: "Teo
taught you the mood audit" / "Teo's app tells them: Sam says you taught them
the mood audit, at tea. Next up: Social workarounds." Under 7: "You and Teo
did Stop, look, ask a grown up" / "Ask again at tea: can you teach me the star
pause?", and done: "Tell Teo: you taught me the star pause."

**The hub row after a pass.** Eyebrow `TEO PASSED A LESSON`, the title, "What
the lesson taught: the mood audit. Close it, ask better, worse or nothing, log
one word.", "All four check questions right first time, Tuesday 4.10pm.",
`TEO SAID`, `ASK AT TEA`, `LISTEN FOR`, `THEN ASK`, and `Teo taught me` ·
`Had a go, not yet` · `Later`. Never "Teo learned", "now knows", "can now",
"Today" or "Sent by".

**The pushes.** To the parent: "Ask Teo at tea: can you teach me the better,
worse or nothing check? (Passed Mood and screens, all four check questions
right first time.)" Second fail: "Teo had a second go at Mood and screens and
the nothing verdict tripped them. Do the tricky bit together, five minutes."
To the child, from the cron: "Orbit has a question for you. Does your feed
leave you better, worse, or nothing? Fifteen minutes, 10 stars, any day this
week." The parent's nudge: "Sam gave Orbit a nudge. Still here when you are.
No rush." After the tap: `taughtMeLine`, as 2.2.

**The child's list card.** "Orbit: the mood audit · 15 min · 10 stars", and
once: the whole truth line in 3.5.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| The pass is the prove items on the settled answer; the first tap is the in lesson signal; feedback on every option | Kornell, Hays and Bjork 2009; Butler and Roediger 2008; Soderstrom and Bjork 2015 (performance during acquisition is an unreliable index of learning, so the gate is for learning, the first tap is the less contaminated of the two in lesson numbers, and the retention claim comes only from the Remember check at a delay) | Learning scientist, teacher, child lens |
| Four prove items, honest distractors, no length cue, one idea per item, kept apart from the practice | Haladyna, Downing and Rodriguez 2002 (item writing, item independence, parallel forms); Little, Bjork, Bjork and Angello 2012; Roediger and Karpicke 2006 | Teacher, learning scientist, app lead |
| One spare per item; the retake re teaches the idea that failed then asks its own spare; the third attempt is the child saying it back | Rawson and Dunlosky 2011 (relearning is of the item that failed); Pyc and Rawson 2009 (the attempt must be effortful and successful, not shown then repeated); Butler 2010 and Pan and Rickard 2018 (transfer to new scenarios); Rosenshine 2012; Fiorella and Mayer 2014 | Teacher, learning scientist, engineer |
| Practice before the check, generating rather than revealing | Rosenshine 2012; Chi and Wylie 2014 (ICAP: a typed completion or a verdict tap is constructive, a reveal is not) | Teacher, learning scientist, child lens |
| Remember at 5 to 9 days, 30, then every 90, over every module ever passed, weekly once the stage's content is done; one unseen application item per lesson; a missed item asked again before the session ends | Cepeda et al 2008 (the gap scales with how long it must last); Bahrick et al 1993 (widely spaced relearning sustains over years); Rawson and Dunlosky 2022; Kang 2016; Lindsey, Shroyer, Pashler and Mozer 2014 (review by item history beats a fixed schedule); Agarwal, Nunes and Blunt 2021 (low stakes retrieval) | Learning scientist, app lead |
| Once a week, fixed, forgiving | Dunlosky et al 2013 (distributed practice), and the product's own data once it runs. Duolingo's streak figures are a company blog, read as practice | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| No reward on the parent's tap; the parent's own words instead | Deci, Koestner and Ryan 1999 (expected performance contingent tangible rewards undermine, more so for children), and the product reason: a tap that pays stops measuring anything. The child's 10 stars are the app's existing currency for every activity, not a new contingency on this one | Learning scientist, app lead, child lens |
| The commitment stem and the seven night log | Gollwitzer and Sheeran 2006 (implementation intentions); Harkin et al 2016 (progress monitoring works when the reading is recorded and seen, which is why Sunday reports a miss as well as a hit) | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps; the pass is finishing it; the Remember check is read aloud | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek et al 2015; Takeuchi and Stevens 2011. The Foundation schedule's shape is a judgement about a five year old's day, not a reading of the spacing work | Learning scientist, teacher, child lens |
| The parent sees what the lesson taught and a tap that does something | EEF parental engagement (an average across very different programmes, as the toolkit says); Sparx's parent email and Khan's family engagement research, read as practice | App lead, parent UX |
| The week's lesson is the app's own; the parent's nudge is in the parent's name | Grolnick 2002 and 2009 (autonomy support against control); Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| The first finished lesson is the onboarding | Khan Academy Kids drops a child into content in the first session; Duolingo runs its first lesson before sign up | App lead |
| One friend per stage, so the friend carries stage and state and the number carries the row; the character stands on the current node | The 5 October one friend one tint decision; Duolingo's path; Khan Academy Kids' library; Finch's one character at the top and plain rows below; GoHenry's single bar in the parent's view | Designer |
| Fifteen minutes on a phone, twelve at five | A judgement, timed on a real phone in 1.8 and guarded by the kid minutes contract. The Oak evaluation supports a phone first player, not a length | Child lens, teacher |

## What the guard asserts

`scripts/check-lesson-path.mjs`, rules rewritten in the commits that change
them, plus:

1. `lesson-path.ts` takes `missions` and `passBy`, returns the school pair,
   the AI pair and `anyLesson`, and is imported by `progress.ts` twice, the
   hub, `journey.ts`, `daily-tasks.ts`, `lib/planet/server.ts` and the weekly
   review; no file under the lessons folder does its own count or redeclares
   an audience map; `getDailyTasks` is gone; `app/k/[token]/page.tsx` does not
   compute its own stage lesson pair.
2. Fixture run, no database: two children with one sibling pass, a failed run,
   a retake after a fail, a legacy null child row, a stage with two AI
   modules, and a child with Learn tab passes and no school pass. Assert the
   pairs, the hub's row count equal to the passport's school total, the list
   header and the road agreeing, and `anyLesson` reproducing
   `lessonsPassedCount` and never falling.
3. `shared/lesson-slides.ts` exports `lessonPassed`, `reteachIndex`,
   `retakePlan` and `visibleSlides`. A grep over every `parseSlides` caller
   fails on any that does not then call `visibleSlides`.
   `lesson/[module]/run`'s total minutes and the phase table's row counts are
   unchanged per module; the printed check count is unchanged and, after PR 4,
   its items are the two classroom prove items.
4. The school branch of the player contains no `0.7`; a fixture family deck
   still passes at 70 percent; a fixture retake with one miss and a right
   reserve passes, its payload holds one row per prove item with exactly one
   `run_id` per row and the carried rows keeping their first attempt's
   `first_correct`, and only the new run's rows are written; a fixture retake
   plays only a teach slide and a reserve; a Reception fixture with one
   settled miss passes with `together`; a third attempt passes with
   `together` and the "right first time" literal does not render.
5. Migration 366 exists; `answers.ts` inserts the new columns and its source
   union holds `remember`; `fetchAnswerFacts` coalesces.
6. The mission update has `.eq('status', 'sent')` and `.select(`; the
   completion, stars, card and push sit inside the returned row branch; the
   surviving done branch records answers and returns `already_passed`;
   `done_together` is written only on a finish carrying the opener's cookie;
   the card's reason carries the lesson id and the href carries `lesson=`.
7. The send route reads the catalogue through the admin client with
   `character_cast` selected, reads `children` for ownership, calls
   `pushToChild(`, is a no op once `nudged_at` is set (a fixture three week
   mission takes one nudge), and `WEEKLY_LESSON_STARS` is the one constant
   three writers use; `ensureWeekMission` is exported and called by the
   opener, the pass route and the cron.
8. `isLessonRow` is used by Home's read, the prompts GET filter, the
   `DigiPrompts` skip, `moment.ts` and `collect.ts`; the PATCH accepts
   `helped` over an existing `not` exactly once with `.select(`; no quest
   insert and no stars anywhere on the tap; no file under `app/k/` or
   `app/api/kid/` writes `digi_prompts.reaction`; the weekly `seen` write does
   not touch `reaction`; **no path passes `child_note` into `taughtMeLine`**.
9. `TodayCard` renders a labelled action with an immediate PATCH and an Undo,
   never the ring, on at most two lesson rows, with no Remember row beside a
   pending pass row for the same child.
10. The weekly cron gates on a completion, a reaction or a `remember` answer;
    `templates.ts` renders the block from `stats.lessonPasses` with a miss
    line as well as a hit, calls `emailFriendByCast`, and escapes every string
    that came from a child or a parent.
11. No child facing lesson line contains a gendered pronoun for a parent, and
    every such line renders with a null parent name; no card, row or push body
    contains the banned verbs, "Today" or "Sent by"; no child facing lesson
    screen contains "screen time"; the kid list contains no "ask your grown up
    to open"; **no child row renders a padlock or a reduced opacity friend**.
12. `/path` redirects preserving the four names; the first tab carries
    `data-do-together` and `schoolModulesForStage`; with no passed module for
    this child `Do it together now` is primary and full width and creates the
    kid link when none exists; `check-watch-stage-copy.mjs` matches the
    function's count and the `TABS` block is free of `childStageNum`.
13. `'lesson'` and `'quiz'` are absent from `ROTATING`; the `LEARNING` pair,
    the dead day tick and the `?next=1` redirect are gone;
    `check-learning-step.mjs` rewritten; a fixture day for a child with no
    passes and nothing due completes without a quiz step; a forced quiz
    replaces a middle row; `/k/[token]/remember/page.tsx` exists before the
    href points at it; `remember-due.ts` passes its fixtures: the pool is
    every module ever passed and survives an age up, 5 to 9 then 30 then 90,
    weekly once the stage's modules are done, ten due lessons giving three a
    day until covered, an unused unseen reserve preferred then a verdict item
    and never a met item, a missed item returning at the end of the three,
    Foundation at 5 to 9 and 30 and then 90 in the read aloud form, a
    `done_together` pass waiting for the child, never on a day the next lesson
    is passed.
14. The stage pool comes from `schoolModulesForStage` with an application item
    per lesson, prefers an item unseen in any `run_id`, and the route marks
    from the pool.
15. The saved place is capped at the first prove index; `child_note` is capped
    at 200 and bounded by the child check; `KidQuestScreen.tsx` contains no
    "from your grown up" and renders no mission list apart from the week card;
    the kid minutes ceiling holds over `visibleSlides(slides, 'kid')` and the
    minutes line is computed, not written.
16. Content: four `prove` slides per KS2 and up module, two `kid_only`, and
    four `kid_only reserve` slides whose `reserve_for` resolves one per prove
    item and whose `reteach` resolves to a teach slide below the first prove
    index, ascending in deck order; no prove or reserve text matches a
    practice card or a teach sentence in the same deck; no right answer more
    than 20 percent longer than its longest distractor on prove and reserve
    items; three options outside Foundation, which keeps two of two; no prove
    item's child visible text contains "exit check"; `listen_for` and
    `then_ask` on every module; no family question opening with the three
    banned stems; `together_prompt` on every slide the together deck shows;
    `expected_verdict` and `teaching_point` on every worksheet item; `tool` an
    object on all 34.
17. `check-lesson-age-gate.mjs`, `check-watch-stage-copy.mjs`,
    `check-co-watch.mjs`, `check-digi-step-in.mjs`, `check-day-by-age.mjs` and
    the three content guards pass, listed in each PR body as run.
18. The visual layer: `listStarLessons` selects `character_cast`; no lessons
    surface contains a hardcoded clapperboard; the pass screen renders
    `FriendPlate` keyed on the module's cast and draws DiGi once;
    `LessonRoadStrip` is imported by the child's list and the hub, takes its
    length from the function, takes a theme, uses the passport's stamp circle,
    and renders nothing under four modules; the Today plate takes the friend's
    `soft` with an accent border; `emailFriendByCast` exists and the block
    degrades to text; `characterKeyFor` resolves all 34 rows; the Remember
    page renders one friend, not one per question.

## The loop, end to end, after

Monday the cron makes sure Mood and screens is on Teo's app, and his week card
shows Orbit, the tool, `4 / 9`, and "Any day this week". The hub shows the road
strip, Orbit standing on dot four, five dots and the stamp ahead, and a hero
reading "On Teo's app from today" with a nudge and Do it together. Thursday
evening Orbit's note arrives, because Thursday is when Teo opens the app, and
it replaces that day's push. Teo gets fifteen minutes in the kid register: a
word typed before each Show me, six real closes to sort, then a mono line
telling him the check has started and that his first answer is the one that
counts. A miss on the nothing verdict re teaches the two slides that taught it
and asks that item's own spare scenario, two screens, not ten. The pass screen
gives him Orbit at full size, the tool as the headline, the check, the
commitment, the next friend, ten stars named, the tea question he will be
asked, and the dignity line. The route verifies every answer against the deck,
locks on the status change, records the first tap, the settled answer and the
run, writes the completion, pays 10 stars once, pushes the parent the
question, writes the card, and makes sure the next lesson's row exists. Home
shows the pass as the first row in the Today card, Orbit on its plate, a
labelled button on its own line, one row per child. At tea Teo teaches it, the
parent asks the then ask, taps the button and types a line; the row swaps and
stays; Teo's app says "Sam says: you explained that better than the news did."
On the week card Teo logs one word a night and on night seven reads his own
pattern. Six days later the Remember check is forced into his day: the item
that tripped him, a scenario he has not met, and one more, with the missed one
coming back before the session ends. Sunday's email leads with Orbit, names
the pass, the conversation, the Remember result either way, and the sentence
Teo chose to show. Under 7 the Monday row exists without an app, the parent
taps Do it together, reads the "Say:" strip, the child taps, the pass is
finishing it, and the pill waits on Home with words to say out loud. When the
stage's modules run out the check goes weekly and a Tool of the week keeps the
parent's row coming. On the day Teo ages up his card and the hub name it, and
the road starts again with the stamp he earned behind it.

## Decisions for Justin

1. The AI modules leave the lessons count (recommended), or stay with the
   13 September gate and show on the first tab as Do it together. Stamps
   already issued are untouched either way.
2. Stars: 10 for a pass, nothing on the parent's tap, the parent's own words
   carried back instead (recommended; all three lenses that argued for stars
   withdrew). The app lead would also bring a film's first watch from 10 to 5
   so fifteen minutes with a check outranks pressing play; the plan assumes 10
   stays.
3. Shipping order: the loop first on the two prove items that exist, the 162
   new items in PR 4 (recommended by the app lead and supported by the
   engineer, who found PR A was four PRs). The cost is a fortnight on a weaker
   gate with no stamp resting on it. The alternative is content first and a
   month before any family is through the loop.
4. **The curriculum cadence.** Nine modules is nine weeks against a
   subscription that can run three years. PR 5 keeps the week alive on content
   that already exists, over every module ever passed, weekly once a stage is
   done. Whether the scheme grows past nine modules a stage, and at what rate,
   is a curriculum decision and it is yours. The plan does not assume it.

## Not building, and why

- A new assignment table, a new player, a new push path, a new cron, or any
  generated or regenerated character art.
- Stars for the parent library, stars on the parent's tap, a first tap bonus
  on a school lesson (it would reward the exact signal the parent reads).
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson, a weekly lesson run counter, a date on Home's alerts
  row.
- A lesson day setting, a voice note, a keepsake surface in the child's
  passport, a stage certificate, the class tally rendered as the class the
  child joined, confetti on the road, a friend on the Remember page's
  questions or on any other Home row.
- The 20 percent length rule on the 117 existing teach items: a second, named
  content pass, so PR 4 stays reviewable.
- More Foundation modules in this plan: seven is a term at one a week, and the
  cadence is decision 4. The seven night log is the first thing to drop if PR
  5 runs long, because nothing else reads it.
