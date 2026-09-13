# The daily loop solves the top device problems by age, and holds a Duolingo grade habit

Justin, 13 September 2026: "make the daily loop work and really provide
success help for parents, and DiGi can answer and provide solutions for each
device related issue. Research by age, for each parent, the top proven common
issues from science, experts and parent forums, all solved in our service and
prevented. Use top agents to make sure we have Duolingo habit forming for
parents, and do not stop until that works."

## Thesis check (THE-STORY.md 1 to 3)

Ten minutes a day, parent and child together, the words for the arguments.
Never allow or deny. Evidence or silence: every issue below carries a source
and a proof path in the product, or it is marked as a gap out loud.

## What exists (build on, never beside)

- The ten problems briefing, verified 9 September 2026
  (`briefings/2026-09-09-parent-device-problems-v2.html`): ranked, with
  causes and an honest audit per problem. Named gaps: no boredom entry point,
  fair play only on the weekly rotation, no de escalation script for a
  frightened parent, phone readiness printable only, AI companions light.
- DiGi's situation reader (`lib/digi/situation.ts`), horizons by band
  (`lib/digi/horizons.ts`), the bank (`expert_knowledge`, about 200 rows),
  the six situations scripts (migration 261), the recommender's four signals
  (`lib/pathway/recommend.ts`).
- The daily loop: `lib/pathway/daily-tasks.ts` with the one lead tick, the
  seven day focus cycle on completed days (`day-focus.ts`), the parent streak
  (`lib/pathway/streak.ts`), habit nudges that fire only when true
  (`lib/home/habit-nudges.ts`), the rotating next up (`lib/home/next-up.ts`).

## Lane one: the issues, by age, solved and prevented

- [x] `lib/content/device-issues.ts`: the bank. Per band, the top issues
      ranked by how often parents raise them, each with the parent's words,
      the mechanism, the response (a calibrated pathway, never a rule), what
      prevents it a stage earlier, the source, and the PROOF PATH: the exact
      script titles, the moment key, the concern slug, the mechanic, the link.
      A gap is written as a gap.
- [x] `lib/content/device-issues-match.ts`: `issuesFor(band)` and
      `inferIssue(message, band)` (keywords, no model call), so DiGi and the
      loop read one bank.
- [x] DiGi: `app/api/digi/route.ts` injects THE ISSUE THIS FAMILY IS IN with
      the response, the prevention and real script links resolved from the
      titles, so DiGi answers every named issue with a solution that exists.
- [x] The loop: on Home, the fix of the week for this child's band, the
      first issue not yet acted on, with its proof path, ticked when the
      script is read or the moment resolved (`lib/home/issue-of-week.ts`,
      `components/home/IssueOfTheWeek.tsx`). The recommender gains the band's
      top issues as a fifth, weakest signal so a quiet family is still handed
      the script for the problem their child's age actually brings.
- [x] Scripts for the named gaps, migration 298: the de escalation script for
      a parent who is frightened (11 to 16), the boredom entry point (4 to
      10), the AI companion conversation (11 to 15). Justin's voice, no
      confiscation, every one gives the child something to be competent at.
- [x] Guard `scripts/check-device-issues.mjs`: every issue has a source URL
      and a proof path, every script title named exists in the migrations
      (`scripts/lib/script-titles.mjs`), every band has at least six issues,
      the top three per band carry no gap, the route injects the block, the
      matcher hits a sentence per issue, no dashes. Mutation tested, in CI.

## Lane two: the habit, Duolingo grade

- [x] Audit by agent against the published playbook; build the top gaps.
      Candidates: streak at risk in the evening (push and in app, quiet
      hours held, never guilt), a grace day so one miss does not zero the
      chain, a parent daily goal the parent chooses, perfect week, the
      comeback line after days away, the streak said on the day done screen.
- [x] Measure it: a report of day done rate, return rate and streak
      distribution the founder can read (`/api/admin` or the insights board).

## Verification

- tsc, build, guards, the fixture walk at 390 and 1440, the DiGi block
  checked by running the matcher over one sentence per issue.
