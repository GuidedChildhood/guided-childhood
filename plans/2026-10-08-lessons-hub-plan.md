# 8 October 2026: Lessons, version 7. The child learns it, the parent closes it, both can see it stuck, and the cast carries it

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

| Lens | v1 | v2 | v3 | v4 | v5 | v6 |
|---|---|---|---|---|---|---|
| Teacher | 6/5/5 | 7/8/7 | 9/10/9 | 9/10/10 | 9/10/10 | 9/10/10 |
| Learning scientist | 7/6/6 | 8/8/7 | 9/9/9 | 9/10/9 | 8/10/8 | 9/10/9 |
| Learning app lead | 6/5/5 | 8/8/7 | 9/9/8 | 10/9/9 | 9/9/8 | 10/9/9 |
| Parent UX | 3/4/3 | 8/7/6 | 9/9/7 | 10/10/10 | 10/10/10 | 10/10/10 |
| Sceptical engineer | 4/5/5 | 6/7/5 | 7/8/7 | 8/8/7 | 8/8/7 | 8/9/7 |
| Child lens | 5/5/4 | 7/8/7 | 9/9/9 | 9/9/9 | 9/9/9 | 9/9/9 |
| Designer | | | | Looks 4, Flow 7 | Looks 7, Flow 8 | Looks 8, Flow 9 |

Reviews in `lessons-review/round1/` to `round6/`. Round 6 found a pass a child
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

PRs 1 and 2 deploy behind one release, and so do 3 and 4. PR 1 writes the
parent's pass card and PR 3 builds the room it lives in, so on its own that
card would land in the closed fold at the foot of Home under a generic button,
be counted as an idea waiting, and hold DiGi quiet while it sat there. Either
they ship together or PR 1 does not write the card.

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

**The child's app loses its second lesson door.** `focusLesson` on the child's
home computes the next unpassed **parent library** lesson and
`KidQuestScreen`'s Learn tile offers it every day for 3 stars. Against a model
that says one a week from the school path, that is a second ladder on the
child's busiest screen, and after 1.3 the road beside it would read the school
count while the row offered a library lesson. So the Learn tile becomes the
week's school lesson through `childLessonPath().school.next`, the library
ladder leaves the child's app, and the guard names `focusLesson`. The parent's
own library drip email keeps its words and is relabelled as the parent's
reading, never "your child's next lesson".

**Decision 1, recommended: the AI modules leave the lessons count.** The
child's list teaches AI literacy in five modules, the AI area still counts
them, and they sit at the top of For you as "Counts toward Teo's AI area".
Stamps already issued are untouched; the gate applies forward only.

**1.4 One deck filter, found by search.** `visibleSlides(slides, audience)` in
`shared/lesson-slides.ts`, with `audience` of `classroom`, `kid` or
`together`. Every `parseSlides` caller passes through it, enumerated by grep
and asserted per file, because naming a list of five was wrong twice. In this
PR it hides nothing, so it is provably behaviour preserving: verified that in
all 34 decks exactly two choice slides carry `phase: 'prove'` and they are the
last two choice slides, so `print/[module]` can stop using `checks.slice(-2)`
and take the prove items by phase with the same output. The guard asserts
`lesson/[module]/run`'s total minutes and the phase table's row counts are
unchanged per module.

**1.5 The pass contract, marked on the server.**
`lessonPassed(answers, { together })` in `shared/lesson-slides.ts`: every
`prove` item right on its latest settled answer, a `reserve` standing in for
the item named by its `reserve_for`; when `together`, every prove item
answered.

- **The route derives correctness itself.** Every option in the deck carries
  `correct`, so the route marks `chosen` against the slide's options and
  computes `first_correct` and `settled_correct` from the deck, dropping any
  row whose `chosen` is not an option on that slide. The client's flags are
  never read. Version 6 reduced over a posted `settled_correct`, so a crafted
  request could have taken the pass, the passport tick and the stars. The
  stage check already marks from its own pool; the lesson is not the one
  surface that trusts the tap.
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
- **Stars pay on finishing, not on passing** (decision 2): 10 either way, once
  per lesson, so the check stays low stakes and the award is not performance
  contingent, which the plan already refuses for the parent's tap and the
  first answer. The pass carries the passport tick, the road dot and the
  parent's row, which are recognition rather than currency.
- Inside `credit()` on the first pass only, one `digi_prompts` row with
  `kind: 'celebration'`, `reason: 'lesson_pass:<lesson_id>'`, `child_id`, the
  href, `cta`, and `title` and `body` filled.
- `ensureWeekMission(admin, childId)` in `school-path.ts`, idempotent on the
  unique key, the next module neither passed nor skipped at
  `WEEKLY_LESSON_STARS = 10`, a no op when none is left.

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

**2.3** The four older decks normalised: `teacher_notes.tool` and the
worksheet items are plain strings on ks2-26, ks3-27, ks4-28 and ks4-29, and
three surfaces print the tool as a short name. Headings: The shield; Name it,
save it, say it; The price, the odds, the loop; Stop it, report it, say it.
And `expected_verdict` plus `teaching_point` on the 51 worksheet items that
have neither, so the spares, the Remember check's application item and the
child's practice have something to read.

### PR 3: what the parent sees (no migration, deploys with PR 4)

**3.1 The pass is a row in the Today card, labelled, for every child**, one
row per pending lesson prompt, at most two, leading the card, with no Remember
row beside a pending pass row for the same child. The friend's plate, the
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
quest insert. One builder, `taughtMeLine(name, noun, parentLine)`, with no
pronoun and the name optional: "Sam says you taught them the mood audit, at
tea."; "Your grown up says you taught them the mood audit, at tea."; with a
typed line, "Sam says: you explained that better than the news did." The typed
field appears **in the row's done state, after the tap**, labelled "Add a line
Teo will see. Optional.", 120 characters, into `parent_note`. The guard forbids
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
badly: one nudge ever, the week's row not advancing while a lesson sits unsent,
and the child's list opening only the first unpassed module. From week three
the child would see the same card, the hub would say waiting, the Today card
would be empty, and the Sunday stuck line would be written for the one family
the gate excludes. Three clauses, no new cron and no new push path: at
twenty one days sent with no completion the hero's secondary reads `Start a
different one`, setting the mission `skipped` and calling `ensureWeekMission`,
with the skipped module returning to the list unlabelled; "a mission sent more
than ten days ago with no completion" joins the Sunday gate, capped at one
stuck line per mission; and one lesson aware line goes in the existing
re engagement cron, which already runs daily to opted in parents at most once
every four days, when a mission has sat fourteen days.

**3.5 Home reads one thing, and the Sunday email says it back from data.**
The weekly cron gates on a completion, a lesson reaction, a `remember` answer
**or a stalled mission**; `gatherWeek` selects `child_id`; the block is built
from data in fixed words, reports the Remember result both ways, is led by the
teaching friend through `emailFriendByCast`, closes with "Lesson 4 of 9 in
Explorer. Five to go before the stamp", and escapes every string that came
from a child or a parent.

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
the screen asking them to be honest. At Foundation the deck's own words do the
work with no claim at all: `PEBBLE'S LAST TWO QUESTIONS`, and for the grown up
"Pebble has two last questions for you. Have a go together."

**4.3 The retake, as a sequence.** `retakePlan(slides, answers)` returns, per
failed prove item in deck order, its reteach slide then that item's own
reserve, then the finish; `reteach` is a start index that plays the next slide
when it is the same teach pair; the player holds a playlist and a cursor;
`tryAgain` reuses `runAgain`'s existing ref clearing. The second miss screen
gets its own words, because `Have another go` retires there: "Nearly", the
prove count, then "This one finishes out loud. Say the mood audit to someone
at home, in your own words", with a gold `Show me the tricky bit again` that
replays the reteach pair and asks nothing.

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

**5.3** `visibleSlides` now hides `kid_only` from the classroom and the two
classroom prove items from the kid view. Every new item is listed in the PR
body with the teaching point it mirrors and the misconception behind each
distractor, because a guard can check length and shape and cannot tell a
misconception from a caricature. The three content guards' output is pasted,
and the printed pack and the run minutes are re checked **after** 368 is
applied.

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

**6.4 The week after the modules run out**: the week card and the hero name
the Remember check, and a **Tool of the week** row drawn by the Monday cron
when no unpassed module is left, with `reason: 'tool_week:<lesson_id>:<iso
week>'`, read before insert and held unique by 366's partial index, carrying a
passed module's tool, an unused spare as its scenario and that module's
`then_ask` as the tea question. At Foundation its scenario is one verdict the
grown up reads out. The Sunday block gains its line.

**6.5 The road gains a second state.** A passed dot becomes `kept` when that
lesson's 90 day retrieval lands, so nine dots carry twenty seven states across
three years instead of nine that stop moving the month a stage is finished.
The retention mechanism, made visible, at no curriculum cost.

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
teach me the better, worse or nothing check? (Passed Mood and screens.)" The
hub row's equivalents are "All four check questions right first time, Tuesday
4.10pm", "Right first time on 3 of 4, the nothing verdict took a second go",
"Both check questions right first time, Tuesday 4.10pm", and on a third
attempt "Did this one out loud with Sam". Second fail: "Teo had a second go at Mood and screens and
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
| Four child only check items, honest distractors, no length cue, one idea per item, kept apart from the practice, with the classroom's two hidden from the kid view | Haladyna, Downing and Rodriguez 2002 (item writing, item independence, parallel forms); Little, Bjork, Bjork and Angello 2012; Roediger and Karpicke 2006 | Teacher, learning scientist, app lead |
| One spare per item; the retake re teaches the idea that failed then asks its own spare; the third attempt is the child saying it back | Rawson and Dunlosky 2011 (relearning is of the item that failed); Pyc and Rawson 2009 (the attempt must be effortful and successful, not shown then repeated); Butler 2010 and Pan and Rickard 2018 (transfer to new scenarios); Rosenshine 2012; Fiorella and Mayer 2014 | Teacher, learning scientist, engineer |
| Practice before the check, generating rather than revealing | Rosenshine 2012; Chi and Wylie 2014 (ICAP: a typed completion or a verdict tap is constructive, a reveal is not) | Teacher, learning scientist, child lens |
| Remember at 5 to 9 days, 30, then every 90, over every module ever passed, weekly once the stage's content is done; ranked by history with a 30 day floor; a missed item asked again before the session ends | Cepeda et al 2008 (the gap scales with how long it must last); Bahrick et al 1993 (widely spaced relearning sustains over years); Rawson and Dunlosky 2022; Kang 2016; Lindsey, Shroyer, Pashler and Mozer 2014 (review by item history beats a fixed schedule); Agarwal, Nunes and Blunt 2021 (low stakes retrieval). The cross module pool is interleaving as well as spacing: Rohrer and Taylor 2007, Taylor and Rohrer 2010. The weekly cadence once a stage is done is a judgement about the card, not a reading of the research | Learning scientist, app lead |
| Once a week, fixed, forgiving | Dunlosky et al 2013 (distributed practice), and the product's own data once it runs. Duolingo's streak figures are a company blog, read as practice | App lead, child lens |
| The tea question is the child teaching, with one follow up | Nestojko et al 2014; Fiorella and Mayer 2014; Roscoe and Chi 2007; Kobayashi 2019; Chase et al 2009; Chi et al 1994 | Learning scientist, teacher, child lens |
| No reward on the parent's tap, no bonus on the first answer, and the 10 stars paid on finishing rather than on passing | Deci, Koestner and Ryan 1999 (expected performance contingent tangible rewards undermine, more so for children); Agarwal, Nunes and Blunt 2021 and Agarwal et al 2014 (retrieval lowers anxiety when nothing rides on it). The product reason is the same each time: a reward that hangs on a signal stops that signal measuring anything, and the pass is the signal the parent reads | Learning scientist, app lead, child lens |
| The commitment stem and the seven night log | Gollwitzer and Sheeran 2006 (implementation intentions); Harkin et al 2016 (progress monitoring works when the reading is recorded and seen, which is why Sunday reports a miss as well as a hit) | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps; the pass is finishing it; the Remember check is read aloud | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988; Hirsh Pasek et al 2015; Takeuchi and Stevens 2011. The Foundation schedule's shape is a judgement about a five year old's day, not a reading of the spacing work | Learning scientist, teacher, child lens |
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
7. The "right first time" literal renders only where the kid prove count is
   four and the first correct count equals it.
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
19. The visual layer: `listStarLessons` selects `character_cast`; no lessons
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
2. **Stars: 10 on finishing the lesson, not on passing the check**
   (recommended, on the learning scientist's case that a reward hanging on the
   pass stops the pass measuring anything, which is the reason the plan already
   refuses stars on the parent's tap and a bonus on the first answer). The pass
   carries the passport tick, the road dot and the parent's row. The app lead
   would also bring a film's first watch from 10 to 5 so fifteen minutes with a
   check outranks pressing play; the plan assumes 10 stays.
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
   always open regardless of the paywall, which the panel kept deliberately, so
   an unpaid family can walk a whole stage at one module a week. PR 6's cron now
   creates that next mission and sends Orbit's note to every child, unpaid
   included, which is new. Either `ensureWeekMission` runs only for a family
   with full access, or the plan says plainly that the scheme is free at one a
   week and the subscription buys the parent's side, the passport and the pace.
   This is yours and the plan does not assume either.

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
