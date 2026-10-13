# The review board: eleven lenses, one weekly score, one alert at every session

**Justin, 13 October 2026:** build a set of agents that check the platform every
week on ten questions and keep reviewing until each is 10 out of 10, with a
dashboard, an easy alert system, and a check at the start of every session that
asks him, through the question buttons, whether outstanding tasks are done.

## The lenses (his list, renumbered 1 to 11 because 3 appeared twice)

| # | Lens | The question it answers each week |
| --- | --- | --- |
| 1 | Value above AI | Does the platform give a parent something a free chatbot cannot? |
| 2 | Solves the problem | Does it end the nightly fight, in the parent's own words? |
| 3 | Right audience | Is the perfect customer the right one, and does every surface speak to them? |
| 4 | Will pay | Would that parent pay £7.99 or £12.99 rather than ask ChatGPT for free? |
| 5 | Simplicity and flow | What should change so the flow stays simple? |
| 6 | Keeps coming back | The Duolingo test: streak, daily pull, reason to return tomorrow |
| 7 | Marketing | The best way to bring parents to the stage check, now |
| 8 | UX expert | A senior product designer's pass on the live screens |
| 9 | Competitor watch | What competitors shipped, and what we can borrow honestly |
| 10 | AI and tools watch | New models, tools and techniques that would help us |
| 11 | Chief of staff | The round up: everything happening in the repo, the routines and the plan, what is stuck, what Justin owes, what Claude owes |

## What gets built

1. `.claude/agents/review-*.md`, one agent per lens, each with a 10 out of 10
   rubric written as checkable facts, not a mood. Read only. Each returns one
   JSON scorecard: score, evidence with file proof, the gaps to ten (each owned
   by justin or claude, sized), and questions for Justin.
2. `.claude/agents/review-skeptic.md`: the "keep reviewing until happy" step.
   Any score of 9 or 10, or any rise of two or more, is challenged before it
   stands. A ten that cannot survive a hostile reader comes back down.
3. `.claude/skills/review-board/SKILL.md`: the weekly run. Ten lenses in
   parallel, the skeptic, then the chief of staff, who filters every gap
   through the feedback filter (adopt, adapt, park, decline) before it becomes a
   task. Nothing is built from the board's findings without a task Justin can see.
4. `plans/review-board/` holds the state: `scorecard.json` (every week's scores,
   so the trend is real), `tasks.json` (the outstanding list), `runs/<date>.md`
   (the full report), `dashboard.html` (rendered).
5. `scripts/review-board.mjs` (`npm run review-board`): `alerts`, `ingest`,
   `done`, `notyet`, `snooze`, `drop`, `asked`, `list`, `dashboard`. One file,
   no dependencies, unit tested in `scripts/review-board.test.mjs`.
6. A SessionStart hook in `.claude/settings.json` runs `review-board alerts`.
   It prints at most a dozen lines: red for Justin's tasks past due, amber for
   a board run more than eight days old, the questions to put to him. Each task
   is asked at most once a day, so five sessions in a day do not nag five times.
   Scheduled routines have nobody to answer, so the alert tells them to skip
   the questions.
7. The dashboard is published as an Artifact and refreshed by the weekly run at
   the same link.
8. A weekly Routine, Friday 06:49 London, so the scores land before his Friday
   review slot.

## What it deliberately does not do

- It does not repeat the five routines that already run (radar, social batch,
  PR review, UX walkthrough, health sweep). The chief of staff reads what they
  produced.
- It never edits product code, posts, emails, or writes to the database. It
  scores and lists. Building is a normal session picking up a task.
- It does not review lesson wording. The curriculum review runs once a term
  (Justin, 21 September 2026).
- Ten is a bar, not a promise. A lens closes only when it holds ten for two
  weeks running, and reopens the moment it drops.

## Order

Claim (this file, branch, draft PR) → agents → skill → script and tests → hook →
first baseline run → dashboard artifact → routine → decisions entry.
