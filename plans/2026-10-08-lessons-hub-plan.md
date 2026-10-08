# 8 October 2026: Lessons, version 8. The child learns it, the parent closes it, both can see it stuck, and the cast carries it

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

| Lens | v3 | v4 | v5 | v6 | v7 |
|---|---|---|---|---|---|
| Teacher | 9/9/9 | 9/10/10 | 9/10/10 | 9/10/10 | 9/9/9 |
| Learning scientist | 9/9/9 | 9/10/9 | 8/10/8 | 9/10/9 | 9/10/9 |
| Learning app lead | 9/9/8 | 10/9/9 | 9/9/8 | 10/9/9 | 10/9/9 |
| Parent UX | 9/9/7 | 10/10/10 | 10/10/10 | 10/10/10 | 10/10/9 |
| Sceptical engineer | 7/8/7 | 8/8/7 | 8/8/7 | 8/9/7 | 7/9/7 |
| Child lens | 9/9/9 | 9/9/9 | 9/9/9 | 9/9/9 | 9/9/9 |
| Designer | | Looks 4, Flow 7 | Looks 7, Flow 8 | Looks 8, Flow 9 | Looks 8.5, Flow 9.5 |

(v1 and v2 scored 3 to 7 and are in the reviews.)

Reviews in `lessons-review/round1/` to `round7/`. Round 7 found that two fixes
the panel itself had asked for combined into the worst hole in the plan, and
three lenses found it independently: the stars moved to paying on finishing
while a failed run stopped flipping the lesson to done, which was the only
thing keying the payment, so a child could have banked the largest award in
the app on every failed attempt, unbounded, in a product where stars buy
device time. Version 8 keys it off the completion read that already exists, so
it pays once on the first finish.

Round 7 also found: the server marking won in round 6 would mismark silently
the moment the child's view filtered a slide, because the posted slide index
stops addressing the stored deck; a window where the child's check does not
exist at all, which the same one clause closes for Foundation for ever and for
either apply order; a release pairing that contradicted itself in its own
paragraph, so the first family's pass card would have landed in a closed fold;
the parent's typed words never reaching the child, because both readers of that
card select pending rows only; nothing setting the pace, so a keen child could
clear a stage in nine days; and a Reception parent reading "Exit check one."
aloud for ever, because Foundation keeps the classroom items. Every one is
closed below.

Round 6 had found a pass a child
could take with a crafted request, a mission state machine the plan never wrote
down, a stalled lesson that would have become the cancel moment, and a
Reception parent reading "sit criss cross on the carpet" off a phone in the
front room for a fortnight. Version 7 closes all of it, and one structural
change closes five findings at once: **the child's four check questions are all
new child only slides, and the two classroom ones are hidden from the kid
view**, so no PR ever edits a slide the classroom shows, the length cue and the
"exit check one" wording stay where they belong, and the two option items stop
mattering.

Round 5 had found two classes of
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

## Build: six pull requests

The loop ships first and the big content pass ships fifth, because the loop
does not need 216 new questions to run. **No pull request ever edits a slide
the classroom shows**: the child's four check questions are all new `kid_only`
slides and the two classroom ones are hidden from the kid view, so the signed
off hour, its printed pack and its minute total are untouched by construction
rather than by care.

Order and migrations, re checked against origin/main before the first push:
**PR 1 takes 366**, **PR 2 takes 367**, PRs 3 and 4 take none, **PR 5 takes
368**, PR 6 takes none. The apply order runs both ways and the plan says which:
**366 and 367 are applied before their PR deploys**, because PostgREST returns
an error rather than throwing and a missing column would silently drop every
answer and pay nothing on every finish. **368 is applied after PR 5 deploys**,
because it adds the `kid_only` slides and PR 5 is the code that hides them, so
applying it first would put extra questions and minutes into every live
classroom lesson. The walkthrough re checks the printed pack and the teacher's
run minutes after that apply, not before.

PRs 1 and 2 deploy behind one release, and so do 3 and 4. **PR 1 writes no
parent card**: the `digi_prompts` celebration insert lives in PR 3, which
builds the row it renders in. Version 7 paired the releases and then said the
card must ship with its room, which are not the same thing, so the first pass
a family ever got would have landed in the closed fold at the foot of Home
under a generic button, counted as an idea waiting and holding DiGi quiet.
Release one still pushes the parent the tea question, which is the part that
needs no surface.

### PR 1: the loop runs (migration 366, applied first)

**1.1 Migration 366.** `lesson_question_answers` gains `phase text`,
`first_correct boolean` and `run_id uuid`; `correct` becomes the settled
answer and `fetchAnswerFacts` reads `first_correct ?? correct`.
`kid_lesson_missions` gains `nudged_at`, `noted_at`, `child_note text`,
`done_together boolean` and **`attempts int not null default 0`**, and its
status check widens to `('sent', 'done', 'skipped')`. `digi_prompts` gains
`parent_note text` and a **partial unique index on
`(child_id, reason)` where `reason like 'tool_week:%'`**, so a weekly row
cannot double write. `recordQuestionAnswers`'s source union gains `remember`,
and **`sanitizeAnswers` is widened in the same commit**: it drops every key it
does not know, so without that the new payload fields vanish silently on all
four calling routes.

**1.2 The mission state machine, written down.** Today the route sets
`status: 'done'` whether or not the run passed. From here: **a fail leaves the
mission `sent` and increments `attempts`**, under
`.eq('status', 'sent').select('id')`, which is also the fail push's
idempotency key; **only a pass flips `status` to `done`**, so `done` means
passed, which `ensureWeekMission`, the planets' count and `already_passed` all
assume. Without this sentence the retake after a fail returns no row from the
lock, falls into the done branch and credits nothing, and the walkthrough's own
"fail, retake, pass" line cannot pass. `attempts` is also what makes the third
attempt derivable, which nothing in version 6 could do: the completions table
upserts one row per child per lesson for ever and no column counted tries.

**1.3 One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath({ modules, aiModules, completions, missions, passBy,
childId })` returning `{ school: { done, total, next }, ai: { done, total },
anyLesson, statusById }`, pure over rows, `missions` in the signature because
`anyLesson` is the planets' own number and routing them through this function
must not close a planet that is open today. Called by `progress.ts` twice, the
hub, `journey.ts` (gaining a `childId`), `daily-tasks.ts`, Home's own count,
`lib/planet/server.ts` and the Sunday nudge; `app/k/[token]/page.tsx` stops
computing its own pair and KidRoad takes the school pair; `getDailyTasks` goes.

**The child's app loses its second lesson door, by deletion.** `focusLesson`
computes the next unpassed **parent library** lesson, and `learnTile`,
`learnTarget` and `dailyLearnDone` are computed from it and **rendered
nowhere**: nothing in the repo reads them. So rewiring it would resurrect a
dead tile beside PR 6's week card, two rows for one lesson on the child's
busiest screen, which is the daily pressure this plan refuses. All four go,
with the read that feeds them, and the guard names them. Where a Learn row is
wanted later it reads the **week's mission**, never `school.next`, because the
next unpassed module is next week's lesson and offering it the day after a
pass contradicts the card above it saying this week is done. The parent's own
library drip email keeps its words and is relabelled as the parent's reading,
never "your child's next lesson".

**Decision 1, recommended: the AI modules leave the lessons count.** The
child's list teaches AI literacy in five modules, the AI area still counts
them, and they sit at the top of For you as "Counts toward Teo's AI area".
Stamps already issued are untouched; the gate applies forward only.

**1.4 One deck filter, found by search.** `visibleSlides(slides, audience)` in
`shared/lesson-slides.ts`, with `audience` of `classroom`, `kid` or
`together`. Every `parseSlides` caller passes through it, enumerated by grep
and asserted per file, because naming a list of five was wrong twice. In this PR the classroom audience is unchanged, which is provably behaviour
preserving: verified that in all 34 decks exactly two choice slides carry
`phase: 'prove'`, both are `choice`, and they are the last two choice slides,
so `print/[module]` can stop using `checks.slice(-2)` and take the prove items
by phase with the same output. **The kid audience changes here, on purpose**:
it hides the classroom only slide types, because version 7 made the filter
hide nothing and the kid mission page strips only the `script` channel, so the
first families would still have met the timed discussion slide, the tryit
naming a printed worksheet, a class tally reading one, nought, nought, and a
deck declaring 69 minutes, on a phone. The gate can be weak for a fortnight.
The lesson cannot be a classroom lesson. The kid register renderings and the
computed eyebrow ship with it. The guard asserts
`lesson/[module]/run`'s total minutes and the phase table's row counts are
unchanged per module.

**1.5 The pass contract, marked on the server.**
`lessonPassed(answers, { together })` in `shared/lesson-slides.ts`: every
`prove` item right on its latest settled answer, a `reserve` standing in for
the item named by its `reserve_for`; when `together`, every prove item
answered.

- **The route derives correctness itself, from the deck the child was actually
  shown.** Every option carries `correct`, so the route marks `chosen` against
  the slide's options and computes both flags, dropping any row whose `chosen`
  is not an option there. The client's flags are never read: version 6 reduced
  over a posted `settled_correct`, so a crafted request could have taken the
  pass, the passport tick and the stars. **The audience is posted with the run
  and the route applies the same `visibleSlides(deck, audience)` before
  indexing**, with the question text as the fallback key, because the posted
  index is a position in the filtered view and the moment the kid view skips a
  slide it stops addressing the stored row. Mark against another slide's
  options and the row is dropped by this rule's own test, silently, since the
  ledger write is best effort. The stage check passes `kid` and marks from its
  own pool; the lesson is not the one surface that trusts the tap.
- **The player's `passed` branches on `lessonSource`.** The school path uses
  `lessonPassed`; the parent library, the AI modules, the tutor decks, the
  adventures and the schools players keep 0.7 untouched, and the two family
  `PASS_MARK` files are not touched at all. The guard asserts a fixture family
  deck still passes at 70 percent.
- **One run, one write.** Every answer entry carries its `run_id`. `tryAgain`
  mints a new one, clears only the failed prove items and their reserves, and
  **carries the settled correct rows forward in memory under their original
  `run_id`**; `recordQuestionAnswers` writes only rows whose `run_id` is the
  current one. Version 6 carried them under the new run, which would have
  written two identical rows claiming two retrievals where one happened and
  eaten the 500 row history window.
- `ChoiceBlock` gains `onSettled(correct)`. The payload carries `slide`,
  `question`, `chosen`, `phase` and `run_id`. The Nearly screen counts prove
  items only.
- **No count is claimed that the deck cannot support.** Every count is
  computed from the kid prove count, and **the "right first time" line is
  suppressed while that count is under four**, because for the fortnight
  before PR 5 the gate is the two classroom items and on 21 of the 34 decks
  both of those have the right answer as the longest option. The push for that
  cohort reads "Teo finished Mood and screens. Ask at tea: can you teach me
  the better, worse or nothing check?" The gate can be weak for a fortnight.
  The sentence cannot be wrong for a fortnight.
- **While a deck has no reserve, a second attempt is the together route**, not
  a solo retake of an item whose answer just settled green.
- The mission update is the lock and the surviving done branch records answers
  and returns `already_passed`. Continue is disabled once posting.
  `done_together` comes from a short lived httpOnly cookie at path `/`, scoped
  to the mission id, set by the opener and required on the finish.
- **The third attempt is a person, not a count.** At `attempts >= 2` the pass
  is `together`, and `together: true` outside Foundation requires the opener's
  cookie **or** the parent's own pill on the second fail row, `Teo told me the
  idea`, which posts the completion, pays once and claims no count. Otherwise a
  child could fail twice on purpose, reopen alone, tap anything and bank the
  largest award in the app. The row then reads "Did this one out loud with
  Sam", which names something a parent did.
- **Stars pay once, on the first finish** (decision 2), so the check stays the
  one place in the app where nothing rides on being right, which is what makes
  the first answer worth recording. **The key is the completion read
  `credit()` already does**: it selects the prior row before upserting, so the
  payment fires when that read returns nothing and never again. Without a key
  this is the worst hole the panel found, and three lenses found it: the old
  key was the status flip, 1.2 stops a fail flipping it, and paying under the
  surviving lock would hand a child ten stars for every failed attempt,
  unbounded, in an app where stars buy device time. The pass carries the
  passport tick, the road dot and the parent's row, which are recognition
  rather than currency, and both screens say which is which. The near miss
  screen, which has no stars line at all today, reads "10 stars are in your
  bank for the fifteen minutes. Your dot on the road is still waiting for the
  check." A retake pass reads "Your 10 stars went in on Tuesday. This one is
  the dot on your road." A pass screen claiming stars that do not land would
  be the same error the other way round.
- No `digi_prompts` row here: the card belongs to PR 3, for the reason in the
  preamble.
- `ensureWeekMission(admin, childId)` in `school-path.ts`, idempotent on the
  unique key, the next module neither passed nor skipped at
  `WEEKLY_LESSON_STARS = 10`, a no op when none is left, **dated to its week**.
- **The pace is written down, because nothing else sets it.** 1.6 removes the
  only cap there was, every pass makes the next row at once, and the stars pay
  each finish, so a keen eleven year old on half term would clear a stage in
  nine days, land nine Remember checks in one week and earn the stamp in a
  fortnight, which reaches decision 4's content problem ten times faster. The
  list opens the week's mission on its week, the pass screen reads "Social
  workarounds, on your app Monday", and a guard asserts no child opens two
  school lessons inside seven days, a `skipped` restart excepted.
- **The opener reads the paywall here, not later.** It has no `hasFullAccess`
  read today, so any module opens by URL, and this PR raises the award from 3
  to 10, which makes that hole pay more than three times what it did.
  `lockedModuleIds` and the opener's read move in with the constant, and the
  lock rule unlocks passed, skipped and next open, so a skipped module can
  never come back padlocked.
- `pushToChild` returns `{ sent, reason }`: it returns `void` today and counts
  nothing even on the happy path, and 1.7's honest states depend on the count.

**1.6 The week's rhythm, in the same PR**, so no child meets a day they
cannot finish: `pickDay` stops drawing `lesson` and `quiz`; the `LEARNING`
pair, the dead day tick and the `?next=1` redirect go, with rules 2 and 3 of
`check-lesson-path.mjs` rewritten in the same commit; the kid day route drops
its missions read and `lessonAlreadyThisWeek`; `loadDay` takes over the due
read PR 6 uses; `check-learning-step.mjs` is rewritten. The weekly lesson no
longer counts toward the five a day, said out loud.

**1.7 The send route, in the parent's own name.** Admin client for the
catalogue reads only, selecting `character_cast`; a `children` read proving
ownership; the lock rule refused with 403; a `done` mission answering
`already_passed`. **`nudged_at` is set only when `pushToChild` reports
`sent > 0`**, because the helper returns before any read in quiet hours and a
tap at half nine would otherwise burn the one nudge the lesson will ever take.
Quiet hours answers its own state and the button stays live. The nudge says
where it came from: "Sam gave Orbit a nudge. Still here when you are. No
rush."

**1.8 The walkthrough gate.** 366 applied before the deploy, then on the live
database with a test family, pasted into the PR body: a fail leaving the
mission `sent` with the attempt incremented and nothing paid; the retake
crediting and paying once; a forged payload claiming both answers right and
failing; a third attempt refused without the cookie or the pill, then passing
with the pill; a nudge at half nine leaving the button live; a double tap on
the last slide; a `done_together` open abandoned, then the child's own pass,
which must not read as together; a family deck still passing at 70 percent;
the printed classroom pack and the teacher's run minutes unchanged.

### PR 2: the content the loop reads (migration 367, applied first)

No slide is touched. These are `parent_note` and `teacher_notes` fields, so
the classroom deck, its minutes and its printed pack cannot move.

**2.1** The 34 family questions rewritten to teach ("Can you teach me how X
works", "Explain to me why X", "What would you tell a friend who X"), each
gaining `listen_for` (the idea in one sentence, written fresh in the second
person, never trimmed from `taught`, every one of which opens "Today we") and
`then_ask` (one why or transfer question in the parent's life). None opens with
"Which app", "What did you" or "Did you".

**2.2 The first two Foundation decks get their `together_prompt` lines**, in
teaching order, about two dozen lines. **The script channel is never passed
through to a parent.** Across the seven Foundation decks, 16 of the 20 scripts
on the first Reception deck and 8 to 13 on each of the others are classroom
register: "Sit criss cross on the carpet", "who needs a little more practice at
snack time tomorrow", "the printed exit quiz in your pack asks its own
questions". A Foundation family meets at most two modules in a fortnight, so
two decks cover the window and the other five come with PR 5. Until a deck has
its lines the together view shows the child's own slide with no grown up line,
which is today's behaviour: quiet rather than wrong. The guard asserts no
`isTogetherStage` path renders a `script`.

**2.3** The four older decks normalised: `teacher_notes.tool` and the worksheet
items are plain strings on ks2-26, ks3-27, ks4-28 and ks4-29. Headings: The
shield; Name it, save it, say it; The price, the odds, the loop; Stop it,
report it, say it. **This one does move the classroom's printed pack, for the
better**: the print page resolves `notes.tool?.heading`, which is undefined on
a string, so those four packs print a generic fallback today. Four wrong packs
become right, and the walkthrough's unchanged assertion exempts those four and
shows the before and after. The 51 worksheet items that carry neither
`expected_verdict` nor `teaching_point` move to PR 5, because their readers
are the spares, the Remember check's application item and the child's practice,
and nothing in release one reads them.

### PR 3: what the parent sees (no migration, deploys with PR 4)

**3.1 The card is written here, and it can be read back.** `credit()` writes
the `digi_prompts` row in this PR, on the first pass only, with
`kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `child_id`, the
href, `cta`, and `title` and `body` filled. **Both readers of that row select
pending only and no `child_id`, `reason`, `cta`, `reaction` or `parent_note`,
so as written the row vanishes on the next fetch and the parent's typed line
with it.** Both select those columns and include lesson rows acted within the
last day, so the done state survives a refresh and the words reach the child.
The pass is then a row in the Today card, labelled, for every child, one row
per pending lesson prompt, at most two, leading the card, with no Remember row
beside a pending pass row for the same child. The friend's plate, the
title, the question, and the pill on its own line at 44px rather than in the
26px control slot. The PATCH fires at once and Undo is a second PATCH setting
the reaction null and the status pending, which needs `pending` added to the
route's status whitelist for a lesson reason only. One exported
`isLessonRow(reason)` **and its prefix list**, because two of its five uses are
PostgREST queries and one is `head: true`, so they need
`.not('reason', 'like', 'lesson_pass:%')` clauses server side rather than a
predicate.

**3.2 The tap, and the parent's words carried back as the tap they are.** The
`not` write locks on `.is('reaction', null)`, the `helped` write on
`reaction is null or reaction = 'not'` with `.select('id')`. No stars and no
quest insert. The pill carries `listen_for` beside it, the idea in one sentence, which PR 2
already writes for the tea question: without it the only human judged pass in
the loop is a rubber stamp, and shared success criteria is the oldest thing in
this trade. One builder, `taughtMeLine(name, noun, parentLine)`, with no
pronoun and the name optional: "Sam says you taught them the mood audit, at
tea."; "Your grown up says you taught them the mood audit, at tea."; with a
typed line, "Sam says: you explained that better than the news did." The typed field appears **in the row's done state, after the tap**, labelled
"Add a line Teo will see. Optional.", 120 characters, into `parent_note`.
**On the pill path the card is suppressed**, because the pill posts the
completion, a first pass writes the celebration row, and the Today card would
then lead with "ask Teo at tea" addressed to the parent who had just done it.
The child's app is told instead, since nothing currently reaches a child whose
lesson was finished from a parent's phone: the week card carries "Sam closed
this one with you" and the tool. The guard forbids
any path passing `child_note` into `taughtMeLine`.

**3.3 The hub's first tab**, as the visual layer specifies: eyebrow, heading,
the line, the tabs, the road strip and its caption, the hero, flat rows, the
check card. The hero's primary button is visible with no scroll on a 375 by
667 phone. The hero state is capped so it is never a guilt counter, carries
"Had a go on Tuesday. Still on Teo's app, no rush" and the second fail
relabelling, and `Do it together now` is primary and full width until this
child's first pass **and creates the kid link at any age when none exists**.
Every parent facing line that says "app" branches at `isTogetherStage`,
including no pass push at all under 7. The alerts row branches on no child app
and reads `hasKidLink` unconditionally rather than through its evening gate.
**The line "Each lesson comes back a week later, then a month later" is held
behind PR 6**, or rendered only when the due function can return something, so
nothing promises what the build has not reached.

**3.4 A stalled lesson gets a second move.** Four rules in version 6 met
badly: one nudge ever, the week's row not advancing while a lesson sat, and
the child's list opening only the first unpassed module. From week three the
child would have seen the same card, the hub would have said waiting, the
Today card would have been empty, and the Sunday stuck line would have been
written for the one family the gate excluded. Three clauses, no new cron and
no new push path, and **the rule is "no PASSING completion", not "no
completion"**, because a failed run already writes one, so version 7's wording
would have given the exit to the child who never opened it and none to the
child who failed twice.

At twenty one days with no passing completion the hero's secondary reads
`Start a different one`, replacing the spent nudge rather than the gold
button, setting the mission `skipped` and calling `ensureWeekMission`, with
the skipped module returning to the list unlabelled and unlocked. **The window
is attempt sensitive**: at `attempts >= 2` with no pass it is seven days, not
twenty one, because the child who worked hardest should not wait longest
beside a list that opens nothing else. A stalled mission joins the Sunday gate
at ten days, capped at one line per mission. And one lesson aware line goes in
the existing re engagement cron, which fires only for a parent with no session
for three days, so it reaches the quiet parent while the Sunday line and the
hero reach the attentive one, and the two carriers do not overlap. That line
needs one batched missions read keyed by user, because the cron computes its
message once for the whole cohort before its loop, and its link is the lessons
tab.

**3.5 Home reads one thing, and the Sunday email says it back from data.** The
weekly cron gates on a completion, a lesson reaction, a `remember` answer **or
a stalled mission**; `gatherWeek` selects `child_id`; the block is built from
data in fixed words, reports the Remember result both ways, is led by the
teaching friend through `emailFriendByCast`, and escapes every string that came
from a child or a parent. **It closes on passes, not on position**: "Teo has
passed 4 of the 9 Explorer lessons. Five to go before the stamp", both numbers
from `school.done` and `school.total` minus `school.done`. Version 7 closed
with "Lesson 4 of 9", the lesson not yet done, so a parent would have read four
on Sunday, opened the app on Monday and read four for a different lesson, with
the road caption beside it counting a different way again. One function returns
every "to go" string in the product.

**3.7 PR 3's own walkthrough gate**, because 1.8 belongs to PR 1 and this PR
owns every surface a parent touches: the hub on a 375 by 667 phone with the
primary button above the fold; two children giving two rows and no third; the
tap, the swap, the Undo and the row still rendering after a refresh with the
typed line on it; the Sunday number read beside the child's badge; an under 7
family with no app seeing the gold button and no code block.

**3.6 One door, one lock**, as before: the redirect preserving four names, the
scroll to the lesson, `lockedModuleIds` in four places with the opener reading
`hasFullAccess`.

### PR 4: what the child sees (no migration, deploys with PR 3)

**4.1 The deck for one child**, through `visibleSlides(slides, 'kid')`, which
from PR 5 hides the two classroom prove items and every `reserve` on a first
run. Think it slides generate before they reveal; the tryit renders the
worksheet items as unscored verdict cards minus any used as a prove or reserve,
"Finish the sentence" on the six completion decks, skipped where a practise
sort already does the job; the 24 existing sorts get `kidMode` threaded
through the interactive registry, **which needs its
`ComponentType<{ config }>` type widened** and a guard, or a child alone reads
a class tally of one, nought, nought. The half time slide, the starter label,
the skipped passport slide, the recap lines and the saved place as before.

**A kid minutes contract**: a kid minute per slide type, **a named ceiling of
fifteen minutes in the kid view and twelve in together mode**, the line
computed from `visibleSlides(slides, 'kid')` rather than written, and the
minutes guard asserting the ceiling over the kid view instead of skipping the
new slides.

**4.2 The check is announced truthfully.** A mono eyebrow in kid mode, its
count computed, never written:

> `CHECK 1 OF 4`
> Your first answer is the one your grown up sees. Miss it and you still get
> another go.

Both halves are true, and they sit before the check rather than after it.
Version 6 said "your first answer is the one that counts", which the pass rule
contradicts, and one lesson would have taught the child the line was untrue on
the screen asking them to be honest. **The second sentence is gated on the same
count as the parent's line**: in the fortnight before PR 5 the parent is told
nothing about the first answer, so the eyebrow reads `CHECK 1 OF 2` with "Miss
one and you still get another go", and the clause about the grown up seeing it
appears only when it is true.

**"Exit check" is stripped at render, never edited in content.** Twenty one
decks carry "Exit check one." or "Exit check two." in the child visible
question text, and Foundation keeps those two items for ever, so a parent would
read teacher register aloud to a six year old permanently while guard 16
forbids editing the slide. So the kid and together audiences strip a leading
"Exit check one.", "Exit check two." or "Exit check." sentence from a prove
slide's question, the way the mission page already strips the script channel.
`ks1-03` then opens "You see a photo of a cat flying with big feathery wings",
and the guard asserts nothing under those audiences renders "Exit check". At Foundation the deck's own words do the
work with no claim at all: `PEBBLE'S LAST TWO QUESTIONS`, and for the grown up
"Pebble has two last questions for you. Have a go together."

**4.3 The retake, as a sequence.** `retakePlan(slides, answers)` returns, per
failed prove item in deck order, its reteach slide then that item's own
reserve, then the finish; `reteach` is a start index that plays the next slide
when it is the same teach pair; the player holds a playlist and a cursor;
`tryAgain` reuses `runAgain`'s existing ref clearing. The second miss screen gets its own words, because `Have another go` retires
there: "Nearly", the prove count, the stars line from 1.5, then "This one
finishes out loud. Say the mood audit to someone at home, in your own words",
with a gold `Show me the tricky bit again` that replays the reteach pair and
asks nothing. **And one door that is the child's own**, because otherwise both
ways to a third attempt run through an adult's phone and the child who says
the idea to a sibling has no move at all: a field, `Who did you say it to?`,
and a button, `Done, tell my grown up`. It writes `child_note` and lifts the
parent's pill onto that hub row with the child's own sentence above it, so the
adult confirms something already in front of them rather than starting it from
nothing.

**4.4 The pass screen**: the stage friend at 112, DiGi at 56 except on DiGi
fronted modules, the tool as the hero, the three tiles with "10 stars in your
bank" under the check, the commitment stem, the tea question with the grown
up's name where there is one, the next line, and the dignity line. On a third
attempt `THE CHECK` tile reads "Did this one out loud with Sam". "Show my
grown up" writes `child_note`, bounded by the same child check the complete
route uses, and is labelled "Add what Teo said" when the opener came from the
hub.

**4.5 Together mode for under 7**: the `together_prompt` strip where a deck
has one and nothing where it does not, discussion slides as "Ask each other:",
sheet and circle time slides skipped, the twelve slide deck that keeps the
lesson, Pebble at 112, one textarea, the tea line, and `Back to your Home`
only with `from=hub`. Foundation has no retake path.

**4.6 The child's list and its road**, per the visual layer: the strip with the
child's theme and caption, numbered tiles with art on three rows, **no padlock
and no dimmed row**, the tool chip, and the once line, which now names the
email too: "Your grown up sees when you open it, when you have a go, and which
check question took two goes. Never your taps. On Sunday they get a short note
with the same things in it."

**4.7 The stage check** from the child's modules, marked server side, ordered
by first answer history, with an application item per lesson and a preference
for items unseen in any run.

### PR 5: the content (migration 368, applied after the deploy)

**5.1 Four child only check questions and four spares per KS2 and up deck.**
Four `kid_only` prove slides and four `kid_only, reserve` slides, one reserve
per prove item, each carrying `reserve_for` and sharing that item's `reteach`,
which resolves to a teach slide below the first prove index, ascending in deck
order. **The two classroom prove items stay exactly as they are and are hidden
from the kid view**, which is what keeps the length cue, the "exit check one"
wording and the ten two option items out of the child's gate without editing a
single classroom slide. Every new item is a parallel: the same teaching point
on a new scenario, three options, every distractor one of the module's listed
misconceptions pulling on the same error as the item it mirrors, parallel in
grammar, one idea per item, and no right answer more than 20 percent longer
than its longest distractor. The seven Foundation decks keep their two
classroom prove items and pass on answering them.

**5.2** The remaining five Foundation decks get their `together_prompt` lines.

**5.2a Where the new slides go.** Inserted at the first prove index, ascending
in deck order, never appended. Appended, the child's view would read teach,
practise, the five close slides, and then the four checks, so the lesson would
say goodbye before it asked anything and the saved place cap at the first prove
index would mean nothing. Verified index safe: the deepest slide position any
guard pins on a scheme deck sits below that deck's first prove index.

**5.3 The hide is conditional on the deck, never on the release.**
`visibleSlides` hides `kid_only` from the classroom, and hides the two
classroom prove items from the kid view **only where that deck carries at
least one `kid_only` prove slide**. One clause closes three holes: the window
between this PR's deploy and 368's apply, in which the kid view would
otherwise hold no check at all, pass on finishing, and render an eyebrow
reading check one of nought; the seven Foundation decks, which keep their two
classroom items for ever and would otherwise have lost both their check and
Pebble's two questions; and any future ordering of those two steps.

**5.4 The three content guards, named with their fix.** As written this PR
fails CI on 27 decks: the core guard fails every deck already at its ceiling,
the minutes guard fails the deck against the manifest's published minutes, and
the rubric guard fails its timing check. The fix is `minutes: 0` on every new
`kid_only` slide plus a `kid_only` exclusion in each guard's sums, so the
classroom totals are arithmetically untouched and the kid ceiling from 4.1
governs the child's deck instead. All three outputs are pasted, with the
printed pack and the teacher's run minutes re checked **after** 368 is applied,
and the four normalised packs shown before and after.

**5.5** `expected_verdict` and `teaching_point` on the 51 worksheet items that
carry neither, which the spares, the Remember check's application item and the
child's practice all read. Every new item is listed in the PR body with the
teaching point it mirrors and the misconception behind each distractor,
including that each reserve's distractors pull on the same error as the item it
stands in for.

**5.6 Then the items meet their own data.** A PR body read by the person who
wrote it is the weakest control there is, and an implausible distractor
inflates a pass without retrieval while a caricature fails a child who
understood. 366 already stores whether each child got each question right first
time, so after the first fifty children through a module the first correct rate
per item is read and any item under 0.3 or over 0.95 is rewritten. A standing
content job, not a build step.

### PR 6: the week after (no migration)

**6.1 The cron carries the week**: its own loop before the day gate,
`ensureWeekMission` for every child including an under 7 with no link, and
Orbit's note once per mission on the weekday this child most often opens the
app, setting `noted_at`, replacing that day's push, never joining it. At
Foundation the note goes to the parent.

**6.2 The child's week card** above the five a day, replacing the mission
list, with the `4/9` badge, the rotating lines (and no fade, because a card at
0.85 reads as the app being disappointed), the seven night log **keyed by week
in `localStorage` so night seven can read back three weeks rather than
overwriting one**, the parent's line for seven days, the nudge line, the
Remember warning the day before, and the `done_together` branch that hands the
child their half.

**6.3 The Remember check, real and scheduled.** The page, the three questions
with their why, the stage friend once at the head, the module title per
question, the token POST under `source: 'remember'`, and "No stars, no stamp.
Three questions, about a minute. This one counts toward your five. The one
that tripped you first, then two more."

The due rule in a pure `lib/kid/remember-due.ts`, guarded on fixtures: the
pool is **every module the child has ever passed**, surviving an age up; due 5
to 9 days after a pass, again at 30, then every 90, weekly once every module in
the stage is passed; **ranked through `orderPoolByHistory` rather than
excluding met items**, with a floor of 30 days since an item was last asked,
because excluding anything met empties the pool inside a year and the problem
was never repetition but a short gap; when fewer than three items clear the
floor the check is shorter and the Tool of the week carries the week; the facts
read is **scoped to the due lesson ids**, because it takes the last 500
household answers today; a missed item returns at the end of the three; the
short end of the 5 to 9 window whenever any item needed a second go while no
reserves exist; never forced on a day the next lesson is already passed; a
`done_together` pass waiting until the child has met the tool. At Foundation:
5 to 9, 30, then every 90, read aloud, verdict items, two options, no score,
no marking, so those three dates are the whole schedule; with no child app it
is one parent Home row with an `Asked it` pill.

`loadDay` forces the quiz step only when something is due, replacing a middle
row so a Foundation day stays four. **But a forced row only reaches a child who
is already coming back**: the five a day cron skips any child with no row
today, deliberately, so that it cannot become a re engagement push. So the
child the whole schedule exists for would never be told a check is waiting. The
carrier is the one 3.4 already uses: the re engagement cron gains a lesson
aware line for a check overdue by a week, to the opted in parent, and the hub
hero names it. Home stays quiet.

Two mechanical notes the rule depends on. The 30 day floor **cannot live inside
`orderPoolByHistory`**, whose fact type carries only the question and whether
it was right and whose read selects no `answered_at`: add the column to the
select and the type, and apply the floor in `remember-due.ts` before ranking.
And when fewer than three items clear the floor, a missed item must not come
straight back inside the same short check, which is immediate repetition and
the one shape massed retrieval does not help: it returns in the next check
unless two other items sit between.

**6.4 The week after the modules run out**: the week card and the hero name the
Remember check, and a **Tool of the week** row drawn by the Monday cron when no
unpassed module is left, with `reason: 'tool_week:<lesson_id>:<iso week>'`,
read before insert and held unique by 366's partial index, which keys on a
coalesced `child_id` because that column is nullable and a null row would
otherwise escape the index. It carries a passed module's tool, an unused spare
as its scenario and that module's `then_ask` as the tea question. At Foundation its scenario is one verdict the
grown up reads out. The Sunday block gains its line.

**6.5 The road gains a second state, and that state counts.** A passed dot
becomes `kept` when that lesson's 90 day retrieval lands, and each further
retrieval it survives closes a quarter of its ring, capped at a closed ring.
Two states alone are eighteen transitions, all spent by about month seven,
which is not the three years version 7 claimed. With the ring, nine staggered
dots change something every few weeks out to roughly month twenty, on rows the
product already stores. `kept` is resolved inside `statusById` so the road and
the hub cannot disagree, and the cap stops it reading as a number to farm.

**6.6 The age up is the restock, so it is named** on the child's card and the
hub hero, with the road restarting at one and the earned stamp behind it.

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

**The pushes.** Every count in every line below is computed from the kid prove
count, never written, and the "right first time" clause is suppressed while
that count is under four, which is the fortnight before PR 5. To the parent,
with four items: "Ask Teo at tea: can you teach me the better, worse or
nothing check? (Passed Mood and screens, all four check questions right first
time.)" With two, and for the whole interim cohort: "Ask Teo at tea: can you
teach me the better, worse or nothing check? (Passed Mood and screens.)" The hub row's equivalents are "All four check questions right first time,
Tuesday 4.10pm" and "Right first time on 3 of 4, the nothing verdict took a
second go" once there are four items; for the interim cohort, "Passed the
check, Tuesday 4.10pm", because the suppression rule forbids any first time
claim below four and version 7 listed one anyway; and on a third attempt "Did
this one out loud with Sam". Second fail: "Teo had a second go at Mood and screens and
the nothing verdict tripped them. Do the tricky bit together, five minutes."
To the child, from the cron: "Orbit has a question for you. Does your feed
leave you better, worse, or nothing? Fifteen minutes, 10 stars, any day this
week." The parent's nudge: "Sam gave Orbit a nudge. Still here when you are.
No rush." After the tap: `taughtMeLine`, as 2.2.

**The child's list card.** "Orbit: the mood audit · 15 min · 10 stars", and
once: the whole truth line in 4.6.

**The five parent strings, written down at last** (asked for three rounds
running, and this section is called the copy, exact):

- The alerts row with no child app: "Teo's next lesson: Mood and screens. Show
  Teo the code and it is on their app, or do it together."
- The nudge's three states: "Nudged on Tuesday"; "Nudged. Teo's phone buzzes in
  the morning"; "Nudged. It shows on Teo's list." The third is honest only
  because the week card renders the nudge line, which the guard now asserts.
- The Sunday stuck line, under the no day count rule: "Mood and screens is
  still on Teo's app. No rush, and you can swap it for a different one."
- The stall line in the re engagement push: "Mood and screens has been waiting
  on Teo's app. Twelve minutes together would do it, or swap it for another."
- The result of `Start a different one`: "Mood and screens goes back in the
  list. Social workarounds is on Teo's app now."
- And "Comes back Thursday" on a passed row carries a week when the due date
  is beyond seven days: "Comes back next Thursday", because the window is 5 to
  9 days and a bare Thursday nine days out reads as the day after tomorrow.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| The pass is the prove items on the settled answer; the first tap is the in lesson signal; feedback on every option | Kornell, Hays and Bjork 2009; Butler and Roediger 2008; Soderstrom and Bjork 2015 (performance during acquisition is an unreliable index of learning, so the gate is for learning, the first tap is the less contaminated of the two in lesson numbers, and the retention claim comes only from the Remember check at a delay) | Learning scientist, teacher, child lens |
| Four child only check items, three options each, honest distractors, no length cue, one idea per item, kept apart from the practice, with the classroom's two hidden from the kid view | Haladyna, Downing and Rodriguez 2002 (item writing, item independence, parallel forms); Rodriguez 2005 (three options is the meta analytic optimum); Little, Bjork, Bjork and Angello 2012; Butler 2018; Roediger and Karpicke 2006 | Teacher, learning scientist, app lead |
| One spare per item; the retake re teaches the idea that failed then asks its own spare; the third attempt is the child saying it back | Rawson and Dunlosky 2011 (relearning is of the item that failed); Pyc and Rawson 2009 (the attempt must be effortful and successful, not shown then repeated); Butler 2010 and Pan and Rickard 2018 (transfer to new scenarios); Rosenshine 2012; Fiorella and Mayer 2014 | Teacher, learning scientist, engineer |
| Practice before the check, generating rather than revealing | Rosenshine 2012; Chi and Wylie 2014 (ICAP: a typed completion or a verdict tap is constructive, a reveal is not) | Teacher, learning scientist, child lens |
| Remember at 5 to 9 days, 30, then every 90, over every module ever passed, weekly once the stage's content is done; ranked by history with a 30 day floor; a missed item asked again before the session ends | Cepeda et al 2008 (the gap scales with how long it must last); Bahrick et al 1993 (widely spaced relearning sustains over years); Rawson and Dunlosky 2022; Kang 2016; Lindsey, Shroyer, Pashler and Mozer 2014 (review by item history beats a fixed schedule); Agarwal, Nunes and Blunt 2021 (low stakes retrieval). The cross module pool is mostly spacing with varied context; the interleaving
work (Rohrer and Taylor 2007, Taylor and Rohrer 2010) is about discriminating
confusable types within a session, so mixing is cheap and plausibly helps
discrimination rather than carrying the row. The weekly cadence once a stage is done is a judgement about the card, not a reading of the research | Learning scientist, app lead |
| Once a week, fixed, forgiving | Dunlosky et al 2013 (distributed practice), and the product's own data once it runs. Duolingo's streak figures are a company blog, read as practice | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| No reward on the parent's tap, no bonus on the first answer, and the 10 stars paid on finishing rather than on passing | Deci, Koestner and Ryan 1999 (expected performance contingent tangible rewards undermine, more so for children); Agarwal, Nunes and Blunt 2021 and Agarwal et al 2014 (retrieval lowers anxiety when nothing rides on it). The product reason is the same each time: a reward that hangs on a signal stops that signal measuring anything, and the pass is the signal the parent reads | Learning scientist, app lead, child lens |
| The commitment stem and the seven night log | Gollwitzer and Sheeran 2006 (implementation intentions); Harkin et al 2016 (progress monitoring works when the reading is recorded and seen, which is why Sunday reports a miss as well as a hit) | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps; the pass is finishing it; the Remember check is read aloud | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek et al
2015; Takeuchi and Stevens 2011 (a centre report, not peer reviewed). The Foundation schedule's shape is a judgement about a five year old's day, not a reading of the spacing work | Learning scientist, teacher, child lens |
| The parent sees what the lesson taught and a tap that does something | EEF parental engagement (an average across very different programmes, as the toolkit says); Sparx's parent email and Khan's family engagement research, read as practice | App lead, parent UX |
| The week's lesson is the app's own; the parent's nudge is in the parent's name | Grolnick 2002 and 2009 (autonomy support against control); Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| The first finished lesson is the onboarding | Khan Academy Kids drops a child into content in the first session; Duolingo runs its first lesson before sign up | App lead |
| One friend per stage, so the friend carries stage and state and the number carries the row; the character stands on the current node | The 5 October one friend one tint decision; Duolingo's path; Khan Academy Kids' library; Finch's one character at the top and plain rows below; GoHenry's single bar in the parent's view | Designer |
| Fifteen minutes on a phone, twelve at five | A judgement, timed on a real phone in 1.8 and guarded by the kid minutes contract. The Oak evaluation supports a phone first player, not a length | Child lens, teacher |

All four check items sit at the end of the deck rather than spaced through it,
and that is a choice with a cost: it trades the in lesson spacing of a question
asked near its teaching for a lag of fifteen slides or more between the teach
and the check, which is the lag that makes the check worth marking, plus one
boundary the eyebrow, the retake order, the saved place cap and the printed
classroom pack can all key off. The mid lesson hinge questions still sit in the
teach phase with feedback and no gate, which is where Wiliam puts them.

## What the guard asserts

`scripts/check-lesson-path.mjs`, rules rewritten in the commits that change
them, plus:

1. `lesson-path.ts` takes `missions` and `passBy`, returns the school pair, the
   AI pair and `anyLesson`, and is imported by `progress.ts` twice, the hub,
   `journey.ts`, `daily-tasks.ts`, `lib/planet/server.ts` and the weekly
   review; `getDailyTasks` is gone; **`focusLesson` and the child's Learn tile
   come from the same function or are gone**; the "no own count" rule is scoped
   to the school count, because the library tab legitimately counts its own.
2. Fixture run, no database: two children with one sibling pass, a failed run,
   a retake after a fail, a legacy null child row, a stage with two AI modules,
   and a child with Learn tab passes and no school pass. Assert the pairs, the
   hub's row count equal to the passport's school total, the strip caption and
   the week card badge reading one value, and `anyLesson` reproducing the
   planets' number and never falling.
3. A grep over every `parseSlides` caller file fails on any that does not call
   `visibleSlides`; `lesson/[module]/run`'s total minutes and the phase table's
   row counts are unchanged per module; the printed check count is unchanged
   and its items are the two classroom prove items by phase.
4. **The mission state machine**: a fixture fail leaves `status = 'sent'`,
   increments `attempts`, pays nothing and writes no card; the retake that
   follows credits and pays once; only a pass flips to `done`.
5. **A forged payload fails**: a row whose `chosen` is not an option on that
   slide is dropped, and the pass is computed from the deck, so claiming both
   answers right cannot pass. The school branch contains no `0.7`; a fixture
   family deck still passes at 70 percent.
6. A fixture retake's payload holds one row per prove item, the carried ones
   keeping their original `run_id` and `first_correct`, and **only rows whose
   `run_id` is the current one are written**; a fixture retake plays only a
   reteach slide and a reserve; a reserve passes for the item named by its
   `reserve_for`; a Reception fixture with one answered pair passes with
   `together`; at `attempts >= 2` a pass without the cookie or the parent's
   pill is refused, and with the pill it pays once and renders no count.
7. The **all four** first time literal renders only where the kid prove count
   is four and the first correct count equals it; the partial line ("Right
   first time on 3 of 4") is allowed, because version 7's wording would have
   banned the plan's own honest line; and no first time claim of any kind
   renders while the kid prove count is under four.
8. Migration 366 exists with `attempts`, the widened status check and the
   partial unique index on the weekly reason; `sanitizeAnswers` preserves
   `slide`, `phase` and `run_id`; `fetchAnswerFacts` coalesces and is scoped to
   the due lesson ids when the Remember check calls it.
9. The send route reads the catalogue through the admin client with
   `character_cast` selected, reads `children` for ownership, and **sets
   `nudged_at` only when the push reports `sent > 0`**, with a fixture quiet
   hours nudge leaving the button live; `WEEKLY_LESSON_STARS` is the one
   constant three writers use; `ensureWeekMission` skips a module that is
   `skipped` as well as one that is passed.
10. `isLessonRow` and its prefix list are both exported, the two PostgREST
    callers filter server side, the PATCH whitelist includes `pending` for a
    lesson reason only, the `helped` write carries `.select(`, no quest insert
    or star award exists on the tap, and no path passes `child_note` into
    `taughtMeLine`.
11. `TodayCard` renders a labelled action with an immediate PATCH and an Undo,
    never the ring, on at most two lesson rows, with no Remember row beside a
    pending pass row for the same child.
12. The weekly cron gates on a completion, a reaction, a `remember` answer or a
    stalled mission; the block renders from data with a miss line as well as a
    hit, calls `emailFriendByCast`, closes with the stage position, and escapes
    every string that came from a child or a parent.
13. No child facing lesson line contains a gendered pronoun for a parent, and
    every such line renders with a null parent name; no card, row or push body
    contains the banned verbs, "Today" or "Sent by"; no child facing lesson
    screen contains "screen time"; **no child row renders a padlock or a
    reduced opacity**; the kid list contains no "ask your grown up to open";
    **no `isTogetherStage` path renders a `script`**.
14. `'lesson'` and `'quiz'` are absent from `ROTATING`; the `LEARNING` pair,
    the dead day tick and the `?next=1` redirect are gone; a fixture day for a
    child with no passes and nothing due completes without a quiz step; a
    forced quiz replaces a middle row; `remember-due.ts` passes its fixtures:
    the pool is every module ever passed and survives an age up, 5 to 9 then 30
    then 90, weekly once the stage is done, ranked with a 30 day floor and
    never emptied by exclusion, a shorter check when fewer than three clear the
    floor, ten due lessons giving three a day until covered, a missed item
    returning at the end of the three, Foundation on its three dates in the
    read aloud form, a `done_together` pass waiting for the child, never on a
    day the next lesson is passed.
15. The kid minutes ceiling holds over `visibleSlides(slides, 'kid')` at
    fifteen and twelve, and the minutes line is computed; the saved place is
    capped at the first prove index; `child_note` is capped at 200 and bounded
    by the child check; `kidMode` reaches the practise sorts.
16. Content: four `kid_only` prove slides and four `kid_only reserve` slides
    per KS2 and up module, each reserve resolving to one prove item and sharing
    its `reteach`, which resolves to a teach slide below the first prove index,
    ascending in deck order; no new item's text matches a practice card or a
    teach sentence in the same deck; no right answer more than 20 percent
    longer than its longest distractor; three options on every new item; the
    two classroom prove items untouched on all 34 decks; `listen_for` and
    `then_ask` on every module; no family question opening with the three
    banned stems; `together_prompt` on every slide the together deck shows;
    `expected_verdict` and `teaching_point` on every worksheet item; `tool` an
    object on all 34.
17. **No PR before PR 5 changes an option count or a slide on any deck**, and
    368 is applied after PR 5 deploys, asserted by the printed pack and the run
    minutes pasted after the apply.
18. The three content guards and `check-lesson-age-gate.mjs`,
    `check-watch-stage-copy.mjs`, `check-co-watch.mjs`,
    `check-digi-step-in.mjs` and `check-day-by-age.mjs` pass, listed in each PR
    body as run.
19. **A kid run marks against the right slide**: a payload captured from a
    filtered kid deck marks correctly, a row whose index is off by the filter
    is not silently dropped, and the audience travels with the run.
20. `visibleSlides(deck, 'kid')` returns two prove slides on a Foundation deck
    and on any deck with no `kid_only` items, and four on a deck that has
    them, so neither apply order can empty the check; the new slides sit at
    the first prove index and `check-source-claims.mjs` passes after 368.
21. **A lesson row survives its own tap**: fetched again it still renders, with
    `parent_note` readable, and the two readers select `child_id`, `reason`,
    `cta`, `reaction` and `parent_note`.
22. **The stars pay once, on the first finish**, keyed off the prior completion
    read: a fixture of three failed attempts then a pass pays ten in total,
    and a fail writes no card.
23. A fail leaves the mission countable as stalled at ten and twenty one days,
    and at `attempts >= 2` at seven; a skipped module is unlocked and
    unlabelled on the child's list; `focusLesson`, `learnTile`, `learnTarget`
    and `dailyLearnDone` are gone.
24. No child opens two school lessons inside seven days, a `skipped` restart
    excepted; nothing under the kid or together audience renders "Exit check";
    `pushToChild` returns a count.
25. The visual layer: `listStarLessons` selects `character_cast`; no lessons
    surface contains a hardcoded clapperboard; the pass screen renders
    `FriendPlate` keyed on the cast and draws DiGi once; `LessonRoadStrip` is
    imported by the child's list and the hub, takes its length from the
    function and a theme, uses the passport's stamp circle, renders nothing
    under four modules, and draws a numbered tile with one numeral; the hero's
    tile is 72; `FriendMark` has an `onError` fallback to the emblem;
    `emailFriendByCast` exists and the block degrades to text.

## The loop, end to end, after

Monday the cron makes sure Mood and screens is on Teo's app, and his week card
shows Orbit, the tool, `4/9` and "Any day this week". The hub shows the road
strip, Orbit standing on dot four, five dots and the stamp ahead, and a hero
reading "On Teo's app from today" with a nudge and Do it together. Thursday
evening Orbit's note arrives, because Thursday is when Teo opens the app, and
it replaces that day's push. Teo gets fifteen minutes in the kid register: a
word typed before each Show me, six real closes to sort, then a mono line
telling him the check has started and that his first answer is the one his
grown up sees, and that a miss still gets another go. Both are true. A miss on
the nothing verdict re teaches the two slides that taught it and asks that
item's own spare scenario, two screens, not ten. The pass screen gives him
Orbit at full size, the tool as the headline, the check, the commitment, the
next friend, ten stars named, the tea question he will be asked, and the
dignity line. The route marks every answer against the deck, locks on the
status change, records the first tap, the settled answer and the run, writes
the completion, pays the ten once, pushes the parent the question, writes the
card, and makes sure the next lesson's row exists. Home shows the pass as the
first row in the Today card, Orbit on its plate, a labelled button on its own
line, one row per child. At tea Teo teaches it, the parent asks the then ask,
taps the button and types a line; the row swaps and stays; Teo's app says "Sam
says: you explained that better than the news did." On the week card Teo logs
one word a night and on night seven reads his own pattern. Six days later the
Remember check is forced into his day: the item that tripped him, a scenario he
has not met, and one more, with the missed one coming back before the session
ends. Sunday's email leads with Orbit, names the pass, the conversation, the
Remember result either way, where he is in the stage, and the sentence he chose
to show. If a lesson sits three weeks the hub offers to start a different one
and nothing nags. Under 7 the Monday row exists without an app, the parent taps
Do it together, reads the "Say:" strip, the child taps, the pass is finishing
it, and the pill waits on Home with words to say out loud. When the stage's
modules run out the check goes weekly, a Tool of the week keeps the parent's
row coming, and each dot turns from passed to kept as its ninety day check
lands. On the day Teo ages up his card and the hub name it, and the road starts
again with the stamp he earned behind it.

## Decisions for Justin

1. The AI modules leave the lessons count (recommended), or stay with the
   13 September gate and show on the first tab as Do it together. Stamps
   already issued are untouched either way.
2. **Stars: 10 once, on the first finish, not on the pass** (recommended, on
   the case that a reward hanging on the pass stops the pass measuring
   anything, which is why the plan already refuses stars on the parent's tap
   and a bonus on the first answer). The pass carries the passport tick, the
   road dot and the parent's row. Both the child lens and the app lead would
   also bring a film's first watch from 10 to 5, so fifteen minutes with a
   check outranks pressing play; the plan assumes 10 stays and that is a line
   of config, not a build.
3. Shipping order: the loop first on the two classroom check items that exist,
   the 216 new child only items in PR 5. The cost is a fortnight where the gate
   is two items with a length cue, no stamp resting on it, and no count claimed
   to the parent. The alternative is a month before any family is through.
4. **The curriculum cadence.** Nine modules is nine weeks against a
   subscription that can run three years. PR 6 keeps the week alive on content
   that already exists, over every module ever passed, weekly once a stage is
   done, with the road still moving. Whether the scheme grows past nine modules
   a stage is a curriculum decision and it is yours. The cheapest restock
   available is opening the stage above within three months of an age up, since
   the scheme holds 34 modules and a child meets seven to nine.
5. **A pricing question the build surfaces.** The next unpassed module is
   always open regardless of the paywall, which the panel kept deliberately,
   so an unpaid family can walk a whole stage at one module a week, and PR 6's
   cron now sends Orbit's note to every child, unpaid included.

   **The panel's recommendation is the second arm: say plainly that the scheme
   is free at one lesson a week, and the subscription buys the pace, the
   parent's side and the stamp.** Three reasons. Gating the cron makes the
   child the collection agent, and three rounds of this panel took money out
   of the child's words, with the no padlock rule now in the guard; a cron
   going quiet on an unpaid child is the same message with no screen to argue
   with. It is not new behaviour either, since the five a day, the re
   engagement push and the weekly review all read the profile without ever
   asking about full access. And nine modules at one a week is a lead magnet
   rather than a giveaway, because lessons are one surface of a larger
   product: full access opens the shelf, so a keen child or a holiday week
   runs four rather than one.

   The comparators agree where they are children's learning. Duolingo keeps
   the whole course free and rate limits it. Prodigy Math keeps the game free
   and sells the parent's side, which is this exact split, and has taken
   public criticism for selling to parents through a child's screen, which is
   what the no padlock rule protects us from. Khan Academy is free outright.
   The counter case is Lingokids, which gates content, and is not the one to
   copy. Still yours, and the plan does not assume either arm.

## Not building, and why

- A new assignment table, a new player, a new push path, a new cron, or any
  generated or regenerated character art.
- Stars for the parent library, stars on the parent's tap, a bonus on the first
  answer, and after decision 2, stars that hang on the check at all.
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson, a weekly lesson run counter, a date on Home's alerts
  row, a fading card.
- A lesson day setting, a voice note, a keepsake surface in the child's
  passport, a stage certificate, the class tally rendered as the class the
  child joined, confetti on the road, a friend on the Remember page's questions
  or on any other Home row.
- The 20 percent length rule on the 117 existing teach items, and any edit to
  the two classroom check items: the kid view hides them instead, so the
  classroom scheme stays as signed off and a later term review can take them if
  it wants them.
- More Foundation modules in this plan: seven is a term at one a week, and the
  cadence is decision 4. The seven night log is the first thing to drop if PR 6
  runs long, because nothing else reads it.
