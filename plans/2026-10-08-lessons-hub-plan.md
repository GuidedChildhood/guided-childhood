# 8 October 2026: Lessons, version 2. The child learns it, the parent closes it, and both can see it stuck

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

Version 1 (the hub, two buttons, a We talked card, one number) went to a six
lens panel: a teacher, a learning scientist, a learning app product lead, a
parent UX reviewer, a sceptical engineer and a child lens (a 12 year old alone,
a 5 year old on the sofa). Scores out of 10 on A (does the child learn, best
proven methods), B (easy for the parent, a wow) and C (the loop runs):

| Lens | A | B | C |
|---|---|---|---|
| Teacher | 6 | 5 | 5 |
| Learning scientist | 7 | 6 | 6 |
| Learning app lead | 6 | 5 (7 as planned) | 5 |
| Parent UX | 3 | 4 | 3 |
| Sceptical engineer | 4 | 5 | 5 |
| Child lens | 5 | 5 | 4 |

The reviews are in the session scratchpad (`lessons-review/round1/`), and
every point that changed this plan is marked below with the lens that made it.
Version 1 was right about the model and the shape. It was wrong about what is
underneath: the lesson a child meets, the pass maths, the stars, the send
route, the stage check, and the week between lessons.

## What is true today (verified in the code and the live database, 8 October)

1. **The loop has never run.** Live tables: 0 `school_lesson` completions,
   0 `stage_quiz_passes`, 2 `kid_lesson_missions` ever (one finished at 40
   percent before 29 September), 0 `lesson_question_answers` rows with source
   `school_lesson`. Nothing in the model decided on 29 September has been
   exercised end to end by a real child. (Learning scientist, engineer.)
2. **The parent send route is dead.** `app/api/quests/lessons/route.ts` reads
   the catalogue with the parent's RLS client; migration 274 revoked
   `schools.school_lessons` from `authenticated`, so every POST answers 503 and
   GET returns an empty list. It also never pushes the child, never checks the
   child belongs to the caller, resets a passed mission to `sent` (so a resend
   after a pass takes the first time path and tells the parent stars landed
   when none did), and has no paywall check. (Engineer, child lens.)
3. **The pass maths is not 70 percent.** Every choice slide counts, only the
   first tap counts, and the number is written twice (`LessonPlayer.tsx:1481`,
   `lesson-complete/route.ts:71`) and trusted from the client. Every deck has
   exactly two `prove` questions; the under 7 decks have three choice slides in
   all, so a Reception child must get 3 of 3 on the first tap; KS3 module 10 is
   4 of 5; most KS2 and KS3 decks are 5 of 6. The first module of every stage
   opens with a scored recall of a lesson from the previous key stage that a
   child joining at that stage never did. The hinge questions in the teach
   phase count too, and Wiliam designed those as the teacher's diagnostic, not
   the pupil's mark. In three prove items the right answer is the longest and
   most grown up sounding option. (Teacher, learning scientist, child lens.)
4. **Stars pay on completion, not on the pass.** The mission branch updates
   `status: 'done'` and pays `mission.stars` whether or not the child passed,
   and the push tells the parent "3 stars landed" on a fail. A pass is worth 3;
   a first film watch is worth 10; a two minute mini lesson is worth up to 10.
   (Teacher, app lead, child lens.)
5. **The child's answers are thrown away.** `LessonPlayer` posts
   `{question, chosen, correct}` for every choice; the mission branch never
   calls `recordQuestionAnswers`, while the three sibling routes do. So the
   stage check cannot order "missed first" for the lessons that now count, and
   the parent can never be shown which question tripped the child. (All six.)
6. **The child's stage check draws from the parent library.**
   `lib/pathway/stage-quiz-gather.ts:128` reads `from('lessons')` by stage, and
   `app/k/[token]/quiz/page.tsx` uses it. A 13 year old who passes all ten KS3
   modules sits a check built from lessons written for their parent.
   (Learning scientist.)
7. **The week between lessons is broken.** `lib/kid/five-a-day.ts` draws the
   lesson row by seeded chance into the middle slots, so a child who opens the
   app every day has roughly a one in four chance of a week with no lesson
   prompt at Stage 2 and up (nearer one in two at Foundation); a drawn and
   undone lesson fails the day's run and `lessonAlreadyThisWeek` then withholds
   it for the rest of the week; the quiz row links to `?quiz=1`, which the
   lessons page ignores; nothing comes back after a pass before the stage
   check, which can be a year away. (App lead, child lens, learning scientist.)
8. **The child meets the classroom deck.** Six to ten slides per module ask
   for a partner, a worksheet, a class tally or a timer; the title slide says
   "One hour, one skill"; the deck's passport slide fills a pretend page; there
   is no saved place, so a child interrupted at slide 14 starts at slide 1.
   (Teacher, child lens.)
9. **Under 7 the grown up's words are stripped.** The Do it together route
   opens the kid route, which drops the `script` channel, so the one adult now
   doing the teacher's job gets no "say this" and the discussion slides show a
   sixty second classroom timer. (Teacher, learning scientist, app lead,
   child lens.)
10. **The tea question is three kinds of question under one label.** Some
    teach ("Can you teach me the star pause?"), some apply ("What do you think
    your feed has learned about you?"), some quiz ("Which four things stay
    private online?"). KS3 module 10 ends by telling the child "Nobody else
    gets your data", and the family question then asks the parent to ask for
    the data. (Teacher, learning scientist, child lens.)
11. **The parent's close does not persist, and Home reads four things.** The
    tea question is a 4pm push and a line on `/path`. Nothing on Home, nothing
    to tick, the Sunday email cannot name a school pass (`gatherWeek` looks up
    `lessons` only). `journey.ts` counts the parent library, `daily-tasks.ts`
    renders a parent library lesson as the day's Lesson rung, Home's own
    `stageLessonRows` count feeds `pickNextUp`, and DiGi's step in links point
    at the library. The passport counts the stage's school modules plus the age
    band's AI modules (the 13 September decision); `/path` counts the school
    modules only, so a hub reading "the passport's number" over ten rows would
    say 2 of 12. (Engineer, parent UX.)
12. **The hub reads as the parent's homework.** "Lessons you lead", 26 tiles
    opening the parent's player, a banner whose number disagrees with the
    passport, stage chips that put a Stage 1 list under a Stage 3 heading,
    films for ages 4 to 10 in second place for a 12 year old. (Parent UX.)

Also true and worth keeping exactly as it is (every lens said so): the answer
beat (a wrong first pick gets its own why, one more go, the right answer only
on settling), the retake that re teaches before it re asks, the Nearly screen's
words, the once a week ask counted as offered, the next unpassed lesson always
open regardless of the paywall, stars minted once and never on a replay, the
stage check that only asks what the lessons asked, the characters, the feed
mockups, the evidence slides taught honestly, the `taught` and `try_this`
lines already written on every module's parent note, the child rail, and the model.

## The model, said once

The child does the lesson in their own app, about fifteen minutes, one a week,
and leaves with a tool they can say in a sentence. The pass is the two prove
questions. The week after, the child uses the tool and is asked to remember
it; the stage check at the end only asks what the lessons asked. The parent
has one job after a pass: let the child teach them the tool at tea. The parent
can put a lesson on the child's phone (a note from the lesson's Planet Friend,
never from mum) or do it together on this phone; under 7 together is the way
and the grown up gets the words to say. Every number about lessons comes from
one function. The parent library is for the parent and never claims to move
the child. Nothing claims an outcome for a child; everything shows what the
child did and said.

## Build: three pull requests, A first, each mergeable the same day

### PR A: the loop and the hub (medium, no migration)

**A1. One lesson path function.** `lib/pathway/lesson-path.ts` exports
`childLessonPath(modules, completions, answers, childId, aiModules)` returning
`{ done, total, next, statusById }`, pure over rows, built on `lessonCreditKeys`
and `schoolCreditKey`. `progress.ts` calls it in both `getStageProgress` and
`getAllStagesProgress`; the hub's first tab, `journey.ts` (which gains a
`childId`), `daily-tasks.ts` (the Lesson rung and `nextLessonHref`), Home's
`stageLessonRows` and the Sunday nudge call the same function on the same rows.
No second `getStageProgress` call on Home: Home already runs
`getAllStagesProgress` once inside `getTodayLoop`, and the hub, the rung and
the alerts row read that result. (Engineer, app lead.)

The number: the passport's Lessons and tests row keeps counting the age band's
AI modules (the 13 September decision stands, the stamp gate is unchanged).
The hub's first tab therefore shows two groups under one number: "In Teo's
app" (the school modules) and "With you on this phone" (the AI modules, opened
at `/dashboard/ai-module/<id>` as today). The guard runs the function on
fixture rows and asserts the hub's row count equals the passport's total for
the same stage. If Justin would rather the AI modules left the count, that is
decision 1 below and a one line change in the function. (Engineer.)

**A2. The send route, alive and honest.** `app/api/quests/lessons/route.ts`:
`createAdminClient()` for the three catalogue reads only; a `children` read
proving `body.child_id` belongs to the caller (404 otherwise); the lock rule
(A9) refused with 403; a send on a mission already `done` answers
`{ ok: true, already_passed: true }` and changes nothing; the upsert keeps the
existing row's `stars` when one exists; then `pushToChild(admin, ...)` from
`lib/quests/kid-push.ts`, best effort, returning `sent` and `reason` so the
button can show its four honest states. (Engineer.)

The push is from the lesson's Planet Friend, never from the parent, with the
hook, the time and the stars: "Orbit has a question for you. Does your feed
leave you better, worse, or nothing? Fifteen minutes, 10 stars, any day this
week." Title line from the module's `cast` friend and its hook slide; the
template is one function `friendNote(module)` so the five a day's lesson row
and the Sunday nudge can say the same thing. On the child's list the card
reads "Open for you this week", never "Sent by Mum". (Child lens; the
autonomy evidence is in the table below.)

**A3. The pass route tells the truth and keeps the evidence.**
`app/api/quests/lesson-complete/route.ts`, mission branch:

- Read the deck through the admin catalogue and compute the pass server side
  from `body.answers` with the shared rule (B1), never from the client's
  `correct` and `total`. The mini lesson branch already marks server side.
  (Learning scientist C5.)
- `recordQuestionAnswers(supabase, { userId, childId, source: 'school_lesson',
  lessonId }, sanitizeAnswers(body.answers))` on every finish, pass or fail,
  with each answer's `phase`, `first_correct` and `settled_correct` (B1 adds
  them to the payload; the helper stores the pair). (All six.)
- Stars on the pass only. A fail leaves the mission `sent` and
  `completed_at` null, pays nothing, and the parent push for a fail says the
  child had a go and will have another, with no stars line. On the first pass
  the mission goes `done` and pays its stars once. `SELF_STARTED_STARS` and the
  POST default become 10, and the migration 034 check (1 to 10) already allows
  it. (Teacher, app lead, child lens.)
- Inside `credit()` on the first pass only, write one `digi_prompts` row:
  `kind: 'celebration'`, `reason: 'lesson_pass'`, `source: null`,
  `child_id`, `href: '/dashboard/lessons?child=<id>'`, `cta: 'Teo taught me'`,
  the title and body from the copy section below. The jobs streak card is the
  precedent; `moment.ts` reads `reason` prefixes, so `lesson_pass` never counts
  against the step in cap, and because the row is inside `credit()` a replay
  can never write a second card. (Engineer.)
- The push leads with the parent's action: "Ask Teo at tea: can you teach me
  the better, worse or nothing check? (Passed Mood and screens, both check
  questions right.)" (Parent UX.)
- `askAtTea` renders `family_question` and the new `listen_for` line (C1).

**A4. The hub's first tab, in the order a thumb reads it.** (Parent UX, with
the app lead's "see, then ask".)

1. Eyebrow, mono: `STAGE 3 · EXPLORER · AGES 11 TO 13`. The stage is said here
   and nowhere else on the tab. No stage chips on this tab; a `See what Stage 4
   covers` link at the foot opens the same tab with `?stage=4` and the notice
   "You are looking at Stage 4. Teo's own stage is 3."
2. Heading `Teo's lessons`. Under it: "Teo does these on their own app, one a
   week. Your job is one question at tea."
3. Tabs: `Teo's lessons · 10`, `For you · 26`, `Watch together · 10`. Films
   second only at Stages 1 and 2, where they are for the child's age.
4. The progress line from A1: "2 of 10 passed. Each pass ticks the passport."
   At zero passes no bar and no counts, only the hero. After the first pass
   `2 passed` and `8 to go`, never "still to do".
5. The hero: one card, the next lesson. Eyebrow `NEXT FOR TEO`, the title, the
   module's `single_action_outcome`, "About 15 minutes on their app", then the
   two buttons, then "One a week is plenty. Teo's app shows this one as next up
   either way."
6. The list in teaching order, compact rows, no buttons on rows. A passed row
   shows the tick, `Both check questions right` or `Right after a second go on
   the nothing verdict`, the `What Teo now knows` line (the `taught` line with
   the name swapped in, cut at the first full stop), the tea question with its
   listen for line, the child's own sentence if they wrote one (B3), and the
   talked state ("Teo taught you this on Wednesday"). Ahead rows are quiet;
   locked rows say "Opens in order on Teo's app".
7. The AI modules group, "With you on this phone", as today's module cards.
8. The stage check card mirroring the child's: "The Stage 3 check opens on
   Teo's app once all 10 are passed, and it only asks what the lessons asked.
   Passing it earns the stamp."
9. "Worried about social media in particular? The Social Media Ready ramp is
   in For you." The ramp card moves to the top of For you.
10. The school code card, as now.

The two buttons. Primary `Send to Teo's phone`, with the line under both
buttons: "Teo gets a note from Orbit, not from you. Either way the pass lands
on Teo's passport." States read from the `kid_lesson_missions` row so they
survive a reload: `Sending...`, `On Teo's phone ✓`, `On Teo's app since
Tuesday` (a label, with a small `Nudge again` after seven days that pings the
open mission and never creates a second one), `On Teo's app. The buzz goes in
the morning` (quiet hours), `On Teo's app (their phone has no buzz yet)`.
Never on a passed row. Hidden under 7. The row has no column saying who
created it, so the copy is always "on Teo's app since", never "you sent".
(Parent UX, engineer.) Secondary `Do it together now`, every age, opening
`/k/[token]/school/[id]` on this phone: "Together means you read it out and
Teo taps the answers." Under 7 it is the only button, full width, and the line
under the heading becomes "At this age you do them together, on your phone.
You read it out, Teo taps the answers. Fifteen minutes on the sofa, one a
week." No child app yet: in place of the buttons, "Teo's lessons live on their
own app, and Teo has not opened it yet. Nothing to install: show them the code
and it opens on their phone, a tablet or the family laptop", primary `Show Teo
the code` to `/dashboard/setup#share`, secondary `Do it together now`.
(Parent UX.)

Two children: the heading, the tab label and the card eyebrow all carry the
name; the Send button takes its child id from the page's resolved `child`,
never the first `kid_links` row; `LessonsBrowser` keeps `key={child?.id}` so a
switch remounts tab and stage state. (Parent UX, engineer.)

The library tab `For you · 26` opens with "Written for you, not for Teo. Read
one when you want the thinking behind a lesson, or the words for a hard
conversation. These do not move Teo's passport." No "n of N" on it; a tile
says `Read` once opened and `Passed` only if the parent sat its check. The
Stage 1 card keeps `childStageNum === 1` for the guard and now points at Do it
together on the first tab. The `pastTheFilmYears` card's button opens the
first tab, and `check-watch-stage-copy.mjs:90` changes with it. The identifiers
`moduleInReach`, `sendable`, `pastTheFilmYears`, `libForStage` and
`watchShown` survive the rewrite so the three existing guards keep passing.
(Engineer.)

**A5. Taught me, not a tick.** `app/api/digi/prompts/route.ts` selects `cta`;
`DigiPrompts.tsx` renders `p.cta ?? (href ? 'Open Lessons' : 'Talk it
through')`. The lesson card carries three taps in the shape the follow up card
already uses: `Teo taught me` (PATCH `status: 'acted'`, `reaction: 'helped'`),
`Not really` (`acted`, `reaction: 'not'`; Sunday says it is worth one more go
at tea and the Remember check brings the idea back), and `Not yet` (leaves it
pending; the card stays until a tap or seven days). No migration: the reaction
check already allows `helped` and `not`. The passport row reads `2 of 10 ·
talked about 2`; the hub row reads "Teo taught you this on Wednesday"; the
child's app shows "Your grown up said you taught it brilliantly" and a one off
quest pays 2 stars, approved in the same tap, so the parent's close is visible
to the child and a pass plus a tea conversation is the best paid learning event
in the app (12 against a film's 10). (App lead, learning scientist, parent UX,
engineer.) While a lesson card is pending DiGi's step in stays quiet (the
existing one card rule), which is why the taps have to be on the card itself.

**A6. Home reads one thing.** `journey.ts` and `suggestions.ts` take the
count and the next title from A1 and the alerts row becomes "Teo's next
lesson: <module>. Send it to their phone or do it together", linking to the
first tab. `daily-tasks.ts` builds the Lesson rung from A1. Home's own
`stageLessonRows` goes. `lib/digi/moment.ts` step in links and
`lib/digi/word.ts` label `/dashboard/lessons` as "Teo's lessons" and link the
first tab, never a parent library lesson as the child's. (Engineer.)

**A7. The Sunday email says it back.** `gatherWeek` splits completion ids by
`lesson_source` and titles the school ones through `starLessonTitles`
(one `.in('id', ids)` read, plus a sibling `starLessonNotes` for tea questions
so the hub stops doing one read per pass). The review is family wide, so the
line names the child: "Teo passed Mood and screens on Tuesday, both check
questions right. Teo taught you the better, worse or nothing check on
Wednesday." A `not` reaction: "Worth one more go at tea this week; the idea
comes back in Teo's Remember check." The retention line when the next pass's
starter was right: "A week on, Teo still remembered last week's lesson." The
stuck line, once: "The next lesson, Social workarounds, has been on Teo's app
since last Tuesday. Fifteen minutes on the sofa this week would do it, or
leave it, there is no deadline." No new push, no new cron. (Parent UX,
learning scientist, app lead, engineer.)

**A8. One door.** `/dashboard/lessons/path` becomes a redirect to
`/dashboard/lessons` preserving `stage`, `child`, `lesson` and `from`; the
first tab scrolls to `[id="lesson-<id>"]` on mount (DiGi's focus link drops
its fragment through a server redirect, so the id travels as a query);
`?stage=` opens the first tab, not the library, and the tab honours a stage
other than the child's own; the hub's `BackTo` gets the `/dashboard/pathway
#passport` fallback `/path` had. Rule 4 of `check-lesson-path.mjs` is
rewritten in the same PR to assert the redirect preserves the four names and
the first tab carries `data-do-together` and `schoolModulesForStage`.
(Engineer.)

**A9. The lock rule, once.** `lockedModuleIds(modules, passedIds, paid)` in
`lib/lessons/school-path.ts`, used by the child's list, the hub, the opener
(redirect to the list when locked) and the POST. (Engineer.)

**A10. The walkthrough gate.** Before PR A merges: on the live database with
a test family, send a lesson, pass it on the child link, and paste into the PR
body the completion row, the answers rows, the passport count, the five a day
tick, the parent push text, the Home card, the Taught me tap and its 2 stars,
the Sunday email line, and the stage check pool size for that stage. A guard
reads code; only a walkthrough reads this. (Learning scientist C7.)

### PR B: the player for one child, and for a sofa (medium, no migration)

**B1. The pass rule, written once.** `lessonPassed(answers)` in
`shared/lesson-slides.ts` next to `answerBeat`: the pass is every `prove`
question right on its settled answer; starter, teach and practise questions
give feedback and are recorded but never gate. The settled answer is the
answer until correct rule the evidence supports; the first tap is recorded
separately and is what the parent sees as "right first time" or "after a
second go". A prove question settled wrong fails the run and the existing
retake re teaches from the slide before it. The payload adds `phase`,
`first_correct` and `settled_correct` per answer (ChoiceBlock already knows
both: `tries` and `settled`). `LessonPlayer` and the route both import the one
function; the two copies of `0.7` go and the guard asserts the import. For a
three question Reception deck this turns 3 of 3 on the first tap into the two
prove questions right with a second go on each. (Learning scientist A1,
teacher 1, child lens 6, app lead.)

**B2. The deck for one child.** In `kidMode`: a discussion slide renders as
"Think it: <prompt>" with no timer and the `lookFor` line shown as "A good
answer sounds like"; a tryit that names a worksheet becomes "Your turn this
week" carrying the mission; the class tally becomes one tap on the child's
own verdict with the deck's split shown as the class they just joined
(module 10's Beyens split is already in its evidence base); the title slide's
"One hour, one skill" becomes "About 15 minutes"; the deck's passport slide is
skipped (the real passport ticks on the pass); concept slides show their one
line recap (the recap points on the close slide are already at the right
length) above the paragraph. Saved place per mission: the slide index is kept
in `localStorage` under the mission id and offered as "Carry on from where you
were" on reopen. (Teacher 2 and 4, child lens 8.)

**B3. The pass screen, in the order a 12 year old wants it.** (Child lens 2,
app lead, teacher.)

1. The tool, big, as the thing earned: the module's `teacher_notes.tool` line
   ("Close it. Ask: better, worse, or nothing? Log one word.").
2. "Your week" card holding the deck's mission ("Every close, one word. Read
   the pattern on Sunday"), kept on the child's home for seven days.
3. The score with its shape: "Both check questions right", or the one missed
   with its one line why.
4. "Say it in your words": one optional box, 140 characters, under the line
   "This is what your grown up sees. Skip it if you like." At Foundation the
   grown up types it: "What did Teo say?"
5. The tea question, told to the child first: "Mum will ask you at tea: can
   you teach me the better, worse or nothing check? You are the one who knows
   it."
6. "Next lesson opens Monday: Social workarounds."
7. The dignity line: "Your passport ticked. Your grown up sees the tick, which
   questions you got, and your own words if you wrote them. Not what you
   tapped." "Stars mean screen time" goes from this screen; "Your grown up
   just got the good news" goes.

The keepsake: the deck's "Say it like Orbit" slide becomes a card in the
child's passport, "Teo's mood audit: after I closed it, better, worse, or
nothing?", with the friend and the date. The parent's card is the parent's
view; this card is the child's, and it says what they can do, not what they
scored. (Child lens 7.)

**B4. Together mode for under 7.** Keyed off `isTogetherStage`, set by the
mission page: every slide carries a one line grown up prompt (C2) rendered as
a quiet "Say:" strip; discussion slides read "Ask each other:" with no timer;
sheet and circle time slides are skipped; the together deck is the star
breath, the friend's question, the diagram, the sort, the two prove questions,
Fill the page and the goodbye, about twelve minutes. The pass screen reads
"You did it together", the tool as a chant ("Stop! Look! Ask a grown up!"),
"What did Teo say?" for the grown up to type, and the tea line "Tonight, Teo
teaches you the star pause", with the Taught me taps on this screen because
the parent is holding the phone. (Teacher, learning scientist A5 and B5, app
lead, child lens 6.)

**B5. The week, fixed.** On the child's home (`app/k/[token]/page.tsx`, beside
the week mission card that already exists for school): "This week's lesson:
Mood and screens. Any day before Sunday", with the friend, the tool name and
the stars, open Monday and persistent until passed or the week ends, never a
rotating row. `pickDay` stops drawing the lesson; `stepForToday` still lets a
pass tick the day it lands on; an unpassed lesson can never fail a day's run,
so the streak is for the small daily things and the lesson is for the week.
"Lesson day" in Make it mine, default Saturday morning, moves the push.
The quiz row becomes the Remember check: three questions from this child's
passed school lessons, missed first then oldest pass first, mixed across
lessons, built by `questionsFromSlides` so nothing new is authored, answered
with the why, ticked through `markStepQuietly(…, 'quiz')`, drawn in the week
after a pass and again about a month later. The row's href opens
`/k/[token]/remember`, a page that exists. The maths quiz stays on the path
character. (App lead, learning scientist A4, child lens 5.)

**B6. The stage check asks the child's lessons.** `stage-quiz-gather.ts` takes
a source: the kid route passes `listStarLessons` plus
`schoolModulesForStage(stageId)` and runs the same `standsAlone` and
`questionsFromSlides` over those decks, ordered by the child's recorded
history; the parent pathway keeps the library. The existing floor top up stays
for KS5's eight choice slides. (Learning scientist A3.)

**B7. The child's list is a road.** Each card wears its friend and its tool
("Orbit: the mood audit") instead of one film emoji; the passed chip reads
"Passed" (the raw correct count with no denominator goes); the list header
shows the ten tiles as a road with the stage check at the end, using
`KidRoad.tsx`, and the same A1 number as the passport. (Child lens 5.)

### PR C: the content (small, data only, written through the service role)

**C1. The family question teaches.** Every scheme module's `parent_note.family_question`
rows rewritten to one of three shapes: "Can you teach me how X works", "Explain
to me why X", or "What would you tell a friend who X", with the parent's own
life as the subject where the tool applies to it (module 10: "Can you teach me
the better, worse or nothing check? I want to run it on my news app"). Each
gains `listen_for`, the idea in one sentence derived from `taught`, so the
parent is an audience who recognises the idea, never an examiner. The rule,
in the guard: no family question opens with "Which app", "What did you" or
"Did you"; every module has `listen_for`. (Teacher 3, learning scientist A6,
child lens 3.)

**C2. The grown up's words on the seven Foundation decks.** A
`together_prompt` per slide on the EYFS and KS1 modules, one line, derived
from the classroom script with the cold calls and timers removed. (Teacher,
learning scientist A5.)

**C3. The length tell.** In every prove item where the right answer is the
longest option, trim it to the length of the others or make a moderate answer
the distractor. (Teacher 1, child lens 8.) This is an out of cycle content pass
under the term review rule, justified because the check is being rewritten.

**C4, should, for Justin to call.** Grow the prove phase from two to four
items on KS2 and above by lifting the worksheet items that already carry an
expected verdict and a teaching point (module 10's Priya item is the one
question in the module that tests understanding rather than recognition).
Decision 3 below.

## The copy, exact

**The Home card (DigiPrompts, kind celebration).**
Eyebrow `TEO PASSED A LESSON`. Title: the module title. Line one, the
concept: "Teo learned that secrecy plus moving the chat somewhere quieter is
the pattern to stop on." Line two, the evidence: "Both check questions right
first time, Tuesday 4.10pm" or "Right after a second go on the nothing
verdict." The child's sentence in a cream box, labelled `TEO SAID`, only when
they wrote one. Then `ASK AT TEA` and the question, then `LISTEN FOR` and the
line. Buttons: `Teo taught me`, `Not really`, `Not yet`. Under 7 the eyebrow
is `YOU AND TEO DID A LESSON` and the label is `ASK AGAIN AT TEA: you were
there for the answer. Ask it once more and see if it stuck.` Never a word
about an outcome for the child; "Teo learned that" and "Teo can now say" are
claims about a lesson and are true.

**The push to the parent.** "Ask Teo at tea: can you teach me the better,
worse or nothing check? (Passed Mood and screens, both check questions
right.)"

**The push to the child from the send.** "Orbit has a question for you. Does
your feed leave you better, worse, or nothing? Fifteen minutes, 10 stars, any
day this week."

**The child's list card.** "Orbit: the mood audit · 15 min · 10 stars", and
"Open for you this week" when a parent sent it.

**The Sunday lines.** In A7.

## The evidence behind each call

| Call | Evidence | Lens |
|---|---|---|
| Pass is the prove questions, settled answer; feedback on every option; the retake re teaches | Butler and Roediger 2008; Butler, Karpicke and Roediger 2007 (answer until correct is as good as being told); Rosenshine 2012; Rawson and Dunlosky 2011; Soderstrom and Bjork 2015 (performance is a poor proxy for learning); Wiliam 2011 on hinge questions | Learning scientist, teacher |
| Record answers; stage check and Remember check missed first | Roediger and Karpicke 2006; Roediger, Agarwal, McDaniel and McDermott 2011; Agarwal, Nunes and Blunt 2021; IES practice guide 2007 | Learning scientist, app lead |
| A spaced re test in the week after and a month after | Cepeda et al 2008 (review at 10 to 20 percent of the gap); Rawson and Dunlosky 2022; Rohrer and Taylor 2007 (interleaving); Dunlosky et al 2013 | Learning scientist |
| Once a week, fixed, forgiving, child picks the day | Duolingo streak research (Weekend Amulet plus 4 percent return, minus 5 percent streak loss; day 7 hinge); Grolnick on autonomy support versus control | App lead, child lens |
| The tea question is the child teaching | Nestojko et al 2014 (expecting to teach); Fiorella and Mayer 2013 and 2014; Chase et al 2009 (protégé effect); Chi et al 1994 (self explanation); Kang et al 2007 | Learning scientist, teacher, child lens |
| Under 7 the grown up asks and the child taps | Strouse, O'Doherty and Troseth 2013; Whitehurst et al 1988 (dialogic reading); Hirsh Pasek and Zosh 2015; Takeuchi and Stevens 2011 | Learning scientist, app lead, child lens |
| The parent sees what stuck, not a score; a tap that does something | Hattie and Timperley 2007 (task level feedback); EEF parental engagement (positive learning interactions at home); Sparx parent email (status plus one thing to do); Khan family engagement research (conversation beats supervision) | Learning scientist, app lead, parent UX |
| The send is a note from the friend, not homework from mum | Grolnick 2002 and 2009; Children's Commissioner on "they just keep telling us the same thing" | Child lens |
| Fifteen minutes on a phone, not sixty nine | Oak evaluation 2021 (completion on phone a fifth of desktop); attention at five of ten to fifteen minutes | Child lens, teacher |

## What the guard asserts (extend `scripts/check-lesson-path.mjs`, no new file)

1. `lib/pathway/lesson-path.ts` is imported by `progress.ts` (both functions),
   the hub page, `journey.ts`, `daily-tasks.ts` and the weekly review; no file
   under `app/(dashboard)/dashboard/lessons/` does its own `lessonsTotal`
   arithmetic or counts `from('lessons')` for the child.
2. Fixture run with no database: two children with one sibling pass, a failed
   run, a retake after a fail, a legacy null child row, a stage with two AI
   modules; assert `done`, `total`, `next` per child and that the hub's row
   count equals the passport's total.
3. `shared/lesson-slides.ts` exports `lessonPassed`; `LessonPlayer.tsx` and
   `lesson-complete/route.ts` both import it; neither file contains `>= 0.7`;
   the route computes the pass from `body.answers` against the deck and calls
   `recordQuestionAnswers` with `source: 'school_lesson'`.
4. The route pays stars only inside `if (passed)`; the `digi_prompts` insert
   has `kind: 'celebration'`, `reason: 'lesson_pass'`, `child_id` and `cta`,
   and sits inside `credit()` (text order check).
5. `app/api/quests/lessons/route.ts` reads the catalogue through
   `createAdminClient()`, reads `children` for ownership before the upsert,
   calls `pushToChild(`, and returns early on a `done` mission.
6. The lock rule is one exported function used in four places.
7. `app/api/digi/prompts/route.ts` selects `cta`; `DigiPrompts.tsx` renders
   `p.cta`.
8. `weekly-review.ts` calls `starLessonTitles(` and splits on
   `lesson_source === 'school_lesson'`.
9. The library copy matches neither `/move .{0,30}progress/i` nor
   `/lessons you lead/`; the first tab never links `/dashboard/lessons/[id]`;
   the card body never contains an outcome word for the child.
10. `/path` is a redirect preserving `stage`, `child`, `lesson`, `from`;
    `passport-sections.ts` still links `/dashboard/lessons/path?stage=`.
11. Every five a day step href with a query string is read by the page it
    names; the quiz row opens `/k/[token]/remember`.
12. The kid quiz page's pool comes from `schoolModulesForStage`, and every
    stage yields at least `STAGE_QUIZ_LENGTH` standalone questions before the
    floor top up.
13. Content: every module has two `prove` choice slides, `listen_for`, and a
    family question that does not open with "Which app", "What did you" or
    "Did you"; the seven Foundation decks carry `together_prompt` on every
    slide the together deck shows.
14. `check-lesson-age-gate.mjs`, `check-watch-stage-copy.mjs`,
    `check-co-watch.mjs` and `check-digi-step-in.mjs` still pass, listed in the
    PR body as run.

## The loop, end to end, after

Monday: Teo's home shows "This week's lesson: Mood and screens. Orbit: the
mood audit · 15 min · 10 stars." The parent, on the hub, sees `NEXT FOR TEO`
and the same card, and taps Send; Teo's phone gets Orbit's question. Any day
that week Teo opens it, gets fifteen minutes in the kid register with a saved
place, settles both prove questions right, and the pass screen hands over the
tool, the week's mission, the tea question coming, a box for their own words,
and the next lesson's day. The route marks it server side, records every
answer, writes the completion (passport ticks, the day's lesson step ticks),
pays 10 stars once, pushes the parent "Ask Teo at tea: can you teach me the
better, worse or nothing check?", and writes the Home card inside `credit()`.
At tea Teo teaches it; the parent taps `Teo taught me`; Teo's app says the
grown up said so and 2 stars land. Two days later the Remember check asks
three questions from the lessons Teo has passed, missed first. Sunday's email
names the pass, the conversation and the one still to remember. If the lesson
sits for a week the next Sunday says so once, with no deadline. Under 7 the
parent taps Do it together, reads the "Say:" strip, the child taps, the pass
lands on the child, and the tea line is on the screen the parent is holding.
At the end of the stage the check asks only what Teo's own lessons asked, the
ones Teo missed first.

## Decisions for Justin

1. The AI modules stay in the passport's lessons count and show on the first
   tab as "With you on this phone" (recommended, keeps the 13 September
   decision and the stamp gate), or leave the count.
2. Stars: 10 for a pass, 2 more on Taught me, 3 on the school week tick as
   now. Recommended.
3. Grow the prove phase to four items from the worksheets on KS2 and above
   (C4). Recommended after the mechanism has run for a term; two items with
   the settled answer rule is honest today.
4. The order: PR A, then B, then C. A alone makes the loop true and visible; B
   makes the lesson a child's lesson; C makes the tea question teach. All
   three before the schools pilot families reach the first KS3 module.

## Not building, and why

- A new assignment table, a new player, a new push path or a new cron: the
  missions table, the star lesson player, `pushToChild`, DigiPrompts and the
  Sunday review already do the work.
- Stars for the parent library. It is the parent's reading.
- A parent dashboard of percentages, a leaderboard, a public streak, a daily
  pressure on the lesson. The evidence runs the other way.
- A voice note on the pass screen: text first; voice is a later pass.
- The seven day one tap mood log and the Sunday pattern chart the KS3 module
  asks for (child lens): the week's mission card holds the ask; the daily log
  is a later build once the loop has run for a term.
- More Foundation modules (app lead): seven exist for ages 4 to 7 after the
  30 September additions, which is a term at one a week; more belong to the
  curriculum cycle, not this plan.
