---
name: review-board
description: The weekly review board. Eleven agents score Guided Childhood out of ten (value above AI, solves the problem, right audience, will pay over AI, simplicity, keeps coming back, marketing, UX, competitors, AI and tools, business running), a skeptic challenges every nine and ten, and the chief of staff turns the gaps into one task list. Writes the scores, the tasks and the dashboard. Use when the Friday routine fires, or whenever Justin says "run the board", "review the platform", "how are we scoring", "weekly review", or asks whether a lens is at ten yet. Never builds anything itself.
---

# The review board

Justin, 13 October 2026: agents that check the platform every week on ten
questions and keep reviewing until each one is ten out of ten, with a
dashboard and an alert at every session that asks him whether outstanding
tasks are done.

**What it is.** A score is a measurement, and the board's job is to make the
measurement true, week after week, so Justin can see which parts of the
business are finished and which are not. It never edits product code. A gap
becomes a task, and a normal session builds the task.

**Where things live.**

| What | Where |
| --- | --- |
| The eleven agents | `.claude/agents/review-*.md` |
| The scorecard shape every lens returns | `.claude/skills/review-board/scorecard-contract.md` |
| Every week's scores | `plans/review-board/scorecard.json` |
| The task list | `plans/review-board/tasks.json`, plus answers in `plans/review-board/answers/` |
| Each run's full report | `plans/review-board/runs/<date>.md` |
| The dashboard | `plans/review-board/dashboard.html`, published at the URL in `scorecard.json` |
| The book keeper | `scripts/review-board.mjs` (`npm run review-board`), tests in `scripts/review-board.test.mjs` |
| The session start alert | the SessionStart hook in `.claude/settings.json` |

## Phase 0: the brief (one pass, shared by every lens)

1. `git fetch origin main` and work from the latest commit of main.
2. Read THE-STORY.md sections 1 to 3, 9 and 12, and review.md sections 1 and 2.
3. `npm run review-board -- list --all` and read `plans/review-board/scorecard.json`
   (last run's scores, headlines and top gaps).
4. Gather the week once, so ten agents do not each gather it:
   - `git log origin/main --since="7 days ago" --merges --pretty="%h %ad %s" --date=short`
   - the open pull requests with their age (GitHub MCP `list_pull_requests`)
   - decision titles from the last seven days in `plans/decisions.md`
   - the routines and their last run (`list_triggers` if the tool is
     available; otherwise name the routines in `plans/review-board/README.md`
     and say their state is unknown)
5. Write it to a scratch file as **the brief**: today's date, the week in
   twenty lines, and per lens its last score and top gap.

## Phase 1: the ten lenses, in parallel

Launch all ten in ONE message, each with `subagent_type` set to its agent:
`review-value-above-ai`, `review-solves-problem`, `review-right-audience`,
`review-will-pay`, `review-simplicity-flow`, `review-keeps-coming-back`,
`review-marketing`, `review-ux-expert`, `review-competitor-watch`,
`review-ai-tools-watch`.

Each prompt is: the brief, its own previous score and top gap, today's date,
and "Return only the scorecard, exactly as the contract says." Do not add your
own opinion of the score to the prompt; the lens judges.

If the Agent tool says an agent type is not found (agent files load when a
session starts, so a session that created or renamed one cannot call it yet),
launch `general-purpose` with `model: sonnet` instead and open the prompt with:
"You are a read only reviewer. Your instructions are the body of
.claude/agents/review-<lens>.md: read that file and follow it exactly as your
role." The same goes for the skeptic and the chief of staff (no model
override for those two).

When they return, check each is valid JSON with a whole number score. A lens
that fails or returns prose gets one retry with the same prompt. A lens that
fails twice is left out of the run and named in the report; never invent its
score.

## Phase 2: keep reviewing until happy (the skeptic)

For every scorecard with a score of 9 or 10, or a rise of two or more since
last week, launch one `review-skeptic` agent, all in one message, each given
that scorecard and the lens id. The skeptic only ever lowers. Its verdicts go
into the run file as `skeptic` and the script applies them. This is what makes
a ten mean ten: the score has to survive someone trying to knock it down.

A lens is **closed** when it has held ten for two runs in a row. A closed lens
still runs every week, because a closed lens can reopen.

## Phase 3: the chief of staff

Launch `review-chief-of-staff` with: the brief, all ten scorecards after the
skeptic, the skeptic verdicts, the open pull requests, and the current
`npm run review-board -- list --all` output. It returns its own scorecard
(`business-running`), the round up, the one thing, the task list (filtered
through the feedback filter, duplicates merged, carried forward by id), what
it found completed, and what it declined.

Check its tasks before you accept them: at most three priority 1 tasks, every
`justin` task is something only he can do, and no task breaks a
non negotiable. Fix the JSON rather than pass a bad list through.

## Phase 4: write it down

1. Assemble the run file in the scratchpad:
   `{ "date", "report": "plans/review-board/runs/<date>.md", "scorecards": [ten], "skeptic": [...], "chief": {...} }`
2. `npm run review-board -- ingest <run file>`. This writes the scores and the
   tasks, folds in every answer Justin gave this week, and redraws the
   dashboard.
3. Write `plans/review-board/runs/<date>.md`: a score table (lens, last week,
   this week, the skeptic's change), then per lens the headline, the strengths
   with proofs, the gaps, the questions for Justin and the sources; then the
   declined list with reasons; then the round up. No dashes in the prose.
4. `npm run review-board-test` and `npm run ai-tells` must pass.

## Phase 5: publish and hand over

1. Publish `plans/review-board/dashboard.html` with the Artifact tool. If
   `scorecard.json` has a `dashboard_url`, read that artifact first and
   publish to that `url` so the link Justin pinned stays the same. If it has
   none, publish a new one with `icon: "chart"` and store the URL with
   `npm run review-board -- set-url <url>`. If the Artifact tool is not
   available, say so in the pull request and the hand over.
2. Commit to `claude/review-board-<date>`, push, and open a pull request titled
   `Review board <date>: <n> of 11 at ten`. It touches only
   `plans/review-board/`, so it is quick to merge, and the session alerts
   only see the new tasks once it has merged. Say that in the body.
3. Add one decisions entry only if the board changed a decision. Scores are
   not decisions.
4. Hand over to Justin in three lines, per CLAUDE.md: the scores and what moved,
   the one thing, and what he needs to do (his priority 1 tasks and the
   questions only he can answer). Then the dashboard link.

## Rules that do not bend

- **Read only.** No lens, the skeptic or the chief edits product code, posts,
  emails, schedules, or writes to the database. The run writes only
  `plans/review-board/`.
- **Advice is an input.** Every gap passes the feedback filter before it is a
  task. A gap that breaks the philosophy is declined with the reason, however
  many lenses raised it.
- **No churn on the curriculum.** Lesson wording is reviewed once a term
  (Justin, 21 September 2026). A lens that wants to rewrite lessons is out of
  scope; the chief of staff declines it.
- **Do not repeat a routine.** The UX walkthrough (Wednesday), the PR review
  (weekdays), the research radar (Monday), the social batch (Sunday) and the
  health sweep (daily) already run. The board reads what they found; it does
  not redo them.
- **Evidence or silence.** No invented numbers in a scorecard, a task or the
  report.
- **Ten is earned.** A ten needs every rubric line proven by a file and the
  skeptic's agreement. Two weeks at ten closes a lens.
