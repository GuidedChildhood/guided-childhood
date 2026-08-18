# The passport is an application, and the page reads like one

Justin, 18 August 2026: the passport is the application for social media at 16.
Four strands fill it: devices set up right, flagged moments resolved, the
lessons on everything about going online, and the ongoing balance of device use
against jobs and quests. Super simple, step by step, able to return. A bit at
the top explaining the pathway to 16 on first look that reduces to a tap later,
then the passport with a Start here button that leads them through the to do.
Catch up for families who join mid stage, everything completing at the right
age, and find the final test.

Research first, per the house rule: Mobbin sweep (Mercury, Airbnb, Monzo, N26,
Duolingo, Peloton, Chime, Finch patterns) plus a full codebase fact check.
Design lesson from last week is recorded in decisions.md: the tabs were
approved in prose and rejected on sight, so THIS plan ships with a visual mock
to approve before any build.

## WHAT THE RESEARCH SETTLED (the shape)

The page is the Mercury skeleton, three bands under one slim header:

1. WHERE THE APPLICATION IS. The stage timeline toward 16: stamps earned,
   current stage live in its pastel, future stages greyed. Structural, not a
   percentage.
2. WHAT TO DO RIGHT NOW. "To earn the Explorer stamp" with the next task
   numbered and exactly ONE highlighted (Duolingo and Peloton both do this:
   one pulsing next action, never four equal choices).
3. STAMPED AND DONE. Completed work collapsed below, visible for reassurance,
   demoted off the fold.

Around that skeleton:

- FIRST VISIT ONLY: the Airbnb style overview. "The pathway to 16" as five
  stages, one line each, one Start here button. Every visit after, it reduces
  to one line in the header with a tap to reopen. PathwayIntro already does
  fold away after first visit; it gets reframed around the application.
- THE FOUR STRANDS AS FOUR CARDS, Monzo style: an illustration each (DiGi
  squad art), one line saying what it asks, a stamp corner that fills, copy
  that counts DOWN ("Two strands left for the Explorer stamp").
- RETURN SAFETY, Airbnb style: every step out (a lesson, a device, a script)
  already carries from=passport and BackTo; nothing is lost by leaving. The
  passport rung on Today is the standing way back in.
- CATCH UP, Grab and Chime style: unstamped earlier pages carry a needed dot
  and a paced line ("One a week fills this page before Teo turns 13"), from
  the rhythm design already synthesised (weeks left vs items left, exit ages
  from bandForYears: 8, 11, 13, 16).

## WHAT IS ALREADY TRUE IN THE CODE (verified 18 August)

- The Today loop already has a passport rung after quests, linking
  /dashboard/pathway?from=today, done when nothing is outstanding. BUT IT IS
  DORMANT: getTodayLoop takes passportSections as an eighth argument and the
  dashboard passes seven, so the rung never renders. Wiring it is step one.
- The Planet Friend pop in on Today is live (friend-of-the-day, TodayPathBig).
- The five checklist rows (passport-sections.ts) map onto Justin's four
  strands: devices = strand 1, moments = strand 2, lessons = strand 3, jobs
  AND balance together = strand 4. The UI shows four strands; the fourth reads
  the two rows underneath it.
- Scripts count toward the stamp (contentComplete = lessons AND scripts) but
  appear in no row. The lessons strand becomes "Lessons and the words", so a
  family can never sit at four green strands and an unstamped page.
- The final test exists and works: five questions sampled from the stage's own
  lessons (stage-quiz-gather), floor bank in stage-quizzes.ts, pass mark 4 of
  5, sat by the CHILD at /k/[token]/quiz, recorded in stage_quiz_passes,
  offered by StageReadiness when the strands go green.
- Catch up is fully possible: contentComplete has no date filter, so a family
  joining at 12 can earn Foundation and Builder stamps retroactively. On catch
  up pages only devices and lessons rows move; moments, jobs and balance are
  current stage readings, honestly pinned "Later".
- The monthly sweep exists: cron passport-check, 1st of the month, one
  refreshed note per child with an app, silent for families on top of things.
- PassportToDo is the step by step container and its tone rules are law:
  sage, closed by default, no rush said out loud.

## THE GAPS THE PLAN CLOSES

1. THE DORMANT RUNG. Dashboard builds the five sections (it already pays for
   the data) and hands them to getTodayLoop. The rotation then genuinely
   reaches the passport.
2. NO CHILD APP MEANS NO STAMP. StageReadiness dead ends without a kid link,
   yet app/api/pathway/stage-quiz/route.ts (a parent side recorder) exists
   with NOTHING calling it. Build the parent side sit of the check on top of
   the orphan route, offered only when there is no child link.
3. THE CATCH UP CHECK IS UNREACHABLE. /k/[token]/quiz always serves the
   child's CURRENT band, so an unpassed earlier stage check cannot be sat.
   The quiz page takes ?stage=N for unstamped EARLIER stages only.
4. THE QUIZ IS INVISIBLE UNTIL THE END. It joins the strand card copy ("Then
   DiGi's five question check earns the stamp") so the test is named from day
   one, Duolingo unit test style, not a surprise.
5. EXPLORER'S LABEL LIES. Code moves a child up on the 13th birthday; the copy
   says Ages 11 to 13. Copy changes to 11 to 12, everywhere the label renders.

## THE FLOW, SCREEN BY SCREEN (mocked in the artifact for approval)

1. TODAY: rung after quests reads "Passport · check the application". Planet
   Friend pops in beside the trail as now.
2. FIRST VISIT: the overview. Five stages, one line each, Start here.
3. EVERY VISIT: slim header (stage name, stamp ring, tap reopens the
   overview), the book, then the ONE next task highlighted, then four strand
   cards counting down, then Stamped and done collapsed.
4. STEP OUT AND BACK: task links out with from=passport; BackTo returns; the
   next task advances. Two minutes at school pickup is a real unit of work.
5. NEAR THE END: StageReadiness goes all green, offers the check. Child sits
   it on their app; no app, the parent sits it on the page. 4 of 5 stamps the
   page, confetti, next stage's page becomes the live one.
6. JOINED LATE: behind pages banner with the paced line per page, needed dot,
   catch up runs through the same one next task rail.

## BUILD ORDER (after the mock is approved)

1. Wire the dormant rung (dashboard passes sections; smallest, unlocks entry).
2. Reframe PathwayIntro as the application overview; slim header reopen.
3. Strand cards over the existing five rows; scripts join the lessons strand;
   one next task rail above them.
4. Parent side check on the orphan route; catch up ?stage=N on the kid quiz.
5. Paced catch up lines from the rhythm design (age maths already verified).
6. Explorer copy fix, everywhere the ages label renders.

Chrome DevTools at 390 and 1280 with screenshots to Justin at every step,
which is the recorded lesson from the tabs.

## OPEN QUESTIONS FOR JUSTIN (in the report, not blocking the mock)

- Does the passport page KEEP the road, school chest and friends sections
  below the application, or does the application become the whole page?
- The parent side check when there is no child app: happy for the parent to
  sit it alone, or should it wait until a child link exists?
