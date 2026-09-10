# The road ticked two things Justin had not done

Justin, 10 September 2026, with the daily path on his phone:
"moments has update today and scripts and haven't read one yet or ticked a
moment" and "it has passport but needs to then send them when clicked on
exactly the daily part needed to do that ticks when done like set up device
or a job send".

## 1. Moment: green because the DAY finished, not because a moment was done

His `daily_sessions` row for today:

| session_date | completed_at | cards_completed |
| --- | --- | --- |
| 2026-09-10 | 08:30:40 | **0** |

`momentDone` reads:

```ts
(!!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0))
```

`completed_at` on that row does not mean a moment was done. It is written by
`/api/daily/day-done`, whose own comment says why:

> The moments deck already records its own finish through /api/daily/complete,
> but since the rotation a day can complete on a lesson, a DiGi question or a
> passport look, none of which pass through the deck. ... It never claims cards
> were completed, because none were.

So the route deliberately does not claim a moment, and `momentDone` claims one
anyway by reading the wrong field off the shared row. Any day that completes on
a lesson, a DiGi question or a passport look turns the Moment rung green.

Both genuine moment paths write cards, so dropping that half loses nothing:
`/api/daily/complete` writes `cards_completed: 5`, `/api/daily/feedback`
writes `Math.max(1, ...)`.

## 2. Script: green for merely opening one

```ts
supabase.from('script_completions').select('id, child_id')...   // no status
const scriptDone = scriptRows.length > 0
```

`lib/pathway/script-status.ts` exists precisely to stop this, and says so:

> One definition, imported by the road and the passport both, because the two
> of them disagreeing about how far a family has got is the bug here that would
> cost us their trust in both at the same time.

The passport calls `countsTowardPathway`, which excludes `opened`. The road
never asks. So opening a script and closing it ticks the road and moves nothing
on the passport.

Justin's own row today is `not_needed`, which does count by that rule, so his
tick is correct under it. The defect is the `opened` case sitting next to it,
and it is the same rung.

## 3. Passport: the rung should be the actual job

`ParentToDo` already carries a `label` and an `href` per open section, and
`passportRead.sections` is already in hand where the rung is built. So the rung
can say "Set up a device" and land on it, instead of saying "Passport" and
landing on the book.

Passport day keeps its look: reading the record IS that day's one thing, and
that was a deliberate decision. Every other day names the work.

## Not this turn, and why

Justin's check in asks in the same message:

- the first check in showing the signup choices at one star each
- a line at the end saying anything raised with DiGi joins tomorrow
- a new concern arriving with a moment, a script or an auto DiGi question

The first is already true: five concerns seeded 9 September, all
`times_flagged: 1`. The other two are a real build across the check in, the
concern ledger and DiGi, not a correctness fix, and bolting them onto a
lying-ticks fix would make one PR nobody can review. Separate piece, next.

## Checks

typecheck, build, wiring, the ten guards, dash grep, Playwright at 390 and
1200 on the daily path fixture, and a guard so a rung can never again tick on
a field that means something else.
