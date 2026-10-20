# Weekly UX walkthrough: where the report goes

Added 16 October 2026 (review board task `ux-walkthrough-report-in-repo`).
The walkthrough runs Wednesday 07:00 UTC as the perfect customer and judges the
live product against `review.md` (sections 2, 4, 4a and 5). Until now its report
lived in that one session and was gone by Thursday: the 7 October report cannot
be found. The board and every later session can only read what is in the repo,
so the report is a file.

Read this file, and `review.md`, from `origin/main`, never from a checkout.

## Where it goes

`plans/review-board/walkthroughs/<YYYY-MM-DD>.md`, the Wednesday's date in
London. One file per run, never edited after the run; a rerun the same day
replaces that day's file.

Commit only that file, on a branch named `claude/ux-walkthrough-<date>`, and
open a pull request titled `UX walkthrough <date>: <n> must fix, <n> should fix`.
Touch nothing else. A change outside `plans/review-board/walkthroughs/` is not
the walkthrough's job: if you found a bug, it goes in the report as a finding
and the board turns it into a task.

If you cannot push or open a pull request, print the whole report in your
reply and say it could not be saved. Never say it was saved when it was not.

## The shape of the report

Plain markdown, in this order, so the board can read the top two lines without
reading the rest:

```
# UX walkthrough, <date>
Verdict: <n> must fix, <n> should fix, <n> okay to ship. <Blocks shipping | Nothing blocks shipping>.

**Who and how.** The perfect customer (review.md section 2), the browser and
the two widths used (mobile first, then desktop), the live address, and whether
you were signed in as a test family.

## Must fix
- <one line: the surface, what the parent sees, why it breaks review.md>. Proof: <route or file>, <what you did to see it>

## Should fix
- (same shape)

## Okay to ship
- (same shape, listed out loud so nothing passes silently)

## What I walked
The surfaces in the order visited, each with one line: what a parent would
understand in five seconds, and whether the main action worked end to end.

## Not walked
Anything you could not reach (sign in wall, broken page, no test data), so a
gap in the walkthrough is never read as a pass.
```

## Rules that carry over

- Findings are sorted into exactly three buckets, as `review.md` says. A must
  fix breaks a non negotiable, the main flow, or children's data, payments or
  auth.
- Evidence or silence. Every finding names the route and what you did to see it.
  Do not quote a number you did not read off the screen.
- No dashes in the copy you write. Justin's voice: warm, plain, direct.
- Read bodies, not status codes. A page that loads but shows a failure inside it
  is a finding.
- The report holds no family's private detail. Use a test family only; never
  paste a real child's name or answer.
- The board reads this report; it does not redo it (`SKILL.md`, "Do not repeat a
  routine"). The newest file here is part of the board's weekly brief.
