# Ready before 16: the plan (25 November 2026)

PR 1719. Result page work waits for PR 1718 (ResultScreen.tsx is claimed).

## What Justin decided

1. Lead with the curriculum and the Passport. The message is "ready before 16":
   "At 16 they go from nothing to everything overnight. This gets them ready
   before that day." This overrules THE-STORY section 10 ("the star quest leads
   every list") and the 24 November decision to lead with the star quest.
2. Keep the 4 day free trial. The first line about it always says: "Free for 4
   days. No card, so nothing is ever charged unless you pick a plan."
3. Stars and the timer stay, shown third on the homepage after the curriculum and
   the Passport: "Getting the balance right. Real jobs, outside time and a timer
   you can both see. Screen time ends because the timer says so, not because
   you're the bad guy."
4. In the app, a daily screen allowance is the default. Earning extra minutes
   with jobs is something the parent switches on.
5. Trust comes from sources and schools (every lesson shows its source, maps to
   RSHE, schools teach the same lessons) and from Justin as "the dad who did the
   homework": dad of three, wife a teacher, read the research. Never claim
   expert or clinical status.
6. Build order: result page and the bulletproof bedroom script, then the
   homepage, then the earning default.

## Why

- Mumsnet: "did I need an app for that"; "screens to avoid screens" (earning
  read as more screens); fear of being charged after four days; a confusing
  result page; generic advice; scripts a child can argue with ("OK, I'll put it
  on do not disturb").
- Market research: parents feel ill equipped. ICO, April 2026: 46% of parents of
  4 to 11s are not confident protecting their child's privacy online, and 21%
  have never discussed it. Schools are the most trusted channel.
- Earning as default: screens as a reward is associated with more screen use in
  two correlational studies, and rewards can cause anxiety for some
  neurodivergent children. An association, so it is a default, not a ban.

## Build sequence

1. **Result page, after PR 1718 merges** (`app/(marketing)/starter-pack/ResultScreen.tsx`).
   Order: what this stage means; three things a child this age should understand,
   from the curriculum; one conversation for this week with a blank for the
   child's own reason; then what happens next and one button. Feature cards sit
   below. The trial line is decision 2 word for word. Step 3 of PR 1718's "What
   happens next" card no longer leads with jobs and the timer.
   **What you get** (Justin approved), one service a line, in this order, then
   the trial line. Proof path in brackets; "check" means confirm before claiming.
   1. The road to 16: short lessons you do together from 4 to 16, on scams, group
      chats, AI and who they are really talking to in games. The same lessons
      schools teach, mapped to the new RSHE guidance. (lessons hub, rshe-guard)
   2. The Passport: every lesson your child finishes becomes a stamp, so you can
      see what they know rather than guess. (dashboard/passport, lessons stamps)
   3. What school is teaching this year: know what is coming up, so you can get
      there first. (dashboard/learning/LearningYear.tsx; check: it reads the
      year group's objectives for the term, not the child's own school timetable)
   4. What to say: words for the hard conversations, with answers to the
      comebacks children actually use. (scripts table `if_they_push_back`;
      check: hand written on few rows, DiGi writes the rest on first view)
   5. Phone and device setup: step by step settings for each screen.
      (dashboard/devices, dashboard/phone-setup)
   6. Getting the balance right: real jobs, outside time and a timer you can both
      see; screen time ends because the timer says so, not because you are the
      bad guy. Optional. (star quest and timer)
   7. Ask DiGi: answers from research for your child's age, never a yes or no.
   The starter page intro, the three questions and the choose moments step stay
   as they are (Justin likes them).
   Bedroom script: done in this PR (stages.ts, script cards, Passport,
   public/scripts.html, public/device-checklist.html, migration 405 with the
   three comebacks in `if_they_push_back`).
2. **Homepage** (`app/page.tsx`, the live home; there is no
   `app/(marketing)/page.tsx`). Cut from about thirteen sections to about six:
   ready before 16 hero, the curriculum, the Passport, getting the balance right
   (stars and timer, third), the dad who did the homework with sources and
   schools, pricing with the trial line. One button label throughout.
3. **Earning default** (`lib/quests/time-tiers.ts`, `app/api/quests/time/settings/route.ts`,
   `child_time_settings`). Daily allowance on by default; earning with jobs off
   until the parent switches it on. New migration for the column default, number
   claimed in the PR at the time. Existing families keep what they chose.
4. **Replace the generic tip** "The timer is the rule, not you" where it is the
   first thing a parent sees, with a first conversation for that stage:
   `lib/content/stages.ts` (Foundation `screens_takeover`),
   `app/(marketing)/pathway/page.tsx` (preview line),
   the lessons hub SQL (`013_lessons_hub.sql` row, by a new migration),
   `content/printables/guided-childhood-passport/passport-data.js`,
   `lib/content/stage-quizzes.ts`.

## Rules for every step

No dashes in copy. Justin's voice. Scripts change in the database by a new
migration, never an old one. Every claim has a proof path; evidence is described
as an association where it is one. review.md before each push.
