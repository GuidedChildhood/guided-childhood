# The review board

Every Friday morning eleven agents score Guided Childhood out of ten, and every
Claude session starts by asking Justin about anything only he can do. Built
13 October 2026 (`plans/2026-10-13-review-board-plan.md`, PR 1288).

## The eleven lenses

| # | Lens | Agent |
| --- | --- | --- |
| 1 | Value above AI | `review-value-above-ai` |
| 2 | Solves the problem | `review-solves-problem` |
| 3 | Right audience | `review-right-audience` |
| 4 | Will pay over AI | `review-will-pay` |
| 5 | Simple to use | `review-simplicity-flow` |
| 6 | Keeps coming back (the Duolingo test) | `review-keeps-coming-back` |
| 7 | Marketing | `review-marketing` |
| 8 | UX expert | `review-ux-expert` |
| 9 | Competitor watch | `review-competitor-watch` |
| 10 | AI and tools watch | `review-ai-tools-watch` |
| 11 | Business running (the chief of staff and the round up) | `review-chief-of-staff` |

Plus `review-skeptic`, who challenges every nine and ten before it stands.

## The files here

- `scorecard.json`: every run's scores, headlines and top gaps, and the
  dashboard URL. The trend on the dashboard comes from here.
- `tasks.json`: the task list. Owner `justin` or `claude`, priority 1 to 3,
  a due date, open, done or dropped.
- `answers/`: one small file per answer Justin gives at the start of a
  session. Folded into `tasks.json` and cleared by the next weekly run.
- `runs/<date>.md`: each run's full report.
- `product-pulse.sql`: the one read only select the Friday run uses to read
  real family behaviour. Its rows are never committed.
- `dashboard.html`: drawn by the script, published as an Artifact.

## The commands

```
npm run review-board -- alerts              what the session start hook prints
npm run review-board -- list [--all]        the task list
npm run review-board -- done <id> [note]    Justin says it is done
npm run review-board -- notyet <id>         not yet; not asked again today
npm run review-board -- snooze <id> 7       not asked again for 7 days
npm run review-board -- drop <id> [reason]  no longer needed
npm run review-board -- add --owner justin --title "..."
npm run review-board -- pulse --rows <f>    the one line of real behaviour (unknown if unreadable)
npm run review-board -- dashboard           redraw the page
npm run review-board-test                   the tests
```

## The routines around it

The board reads what these already find; it never redoes them.

| Routine | When |
| --- | --- |
| Weekly platform review board (this) | Friday 06:49 London |
| Monday research radar | Monday 07:49 London |
| Weekly UX walkthrough as the perfect customer | Wednesday 07:00 UTC |
| Weekday PR review against review.md | Weekdays 07:30 UTC |
| Sunday social batch | Sunday 18:55 London |
| Daily health sweep | Daily 09:30 UTC |

The Wednesday walkthrough saves its report in `walkthroughs/<date>.md`. The
instructions a routine reads from the repo live in `routines/`, always read
from `origin/main` and never from a checkout.

## The one limit worth knowing

Every cloud session starts from a fresh copy of main. An answer Justin gives
in one session reaches the others when the branch carrying its answer file
merges. So the same question can come up in two sessions on the same day
when the first session's work has not merged yet.
