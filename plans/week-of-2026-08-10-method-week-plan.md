# The method week: quiet nudges and a one week email series

Justin, 10 August 2026:

> "We should also have little nudges, best way to inform them use timer when
> child uses device, and list why this is useful, the methodology, and
> reconsider the balance of offline online, and teaching habits that jobs done
> equals device time. So emails to show this one week, but little pop ups, not
> intrusive or annoying."

Two halves. Emails carry the WHY over a week. In app nudges catch the moment,
one at a time, and get out of the way.

## What is already there, and what is genuinely missing

The lifecycle programme runs to day 182 and already covers this ground:
`week-jobs-stars` at day 147 and `week-device-time` at day 175.

**That is five and six months in.** The habit that makes the whole product work
is explained half a year after a family starts, which is months after they have
either formed it on their own or given up. The gap is not content, it is timing.

The nudge shape exists too, in `components/setup/SetupNudge.tsx`: one per visit,
a 24 hour snooze per item, Start or Not now. That is already the answer to "not
intrusive or annoying" and it gets reused rather than reinvented.

## Half one: the method week emails

**Anchored to first use, not to signup day.** Days 0 to 7 already carry five
emails. Adding four more to the same week is the pressure Justin is asking us to
avoid, and a lecture about the timer on day one lands before a family has a
device session to apply it to.

So the anchor is the first day this family has a live loop: the earliest of
their first job, their first device session, and their first child link. That is
the day the method becomes real for them, whether it is day two or day forty.

No migration. The anchor is derived per run from rows we already hold, and each
send is locked once by the existing `(user_id, email_key)` row in `email_log`,
exactly like every other email in the programme.

| after anchor | key | what it teaches |
| --- | --- | --- |
| day 1 | `method-timer` | Start the timer when the screen goes on, and why a visible clock ends the argument rather than winning it |
| day 3 | `method-earned` | Jobs done equals device time. Why earned time is a different thing from given time |
| day 5 | `method-offline` | The offline half, what it is actually for, and the game pack |
| day 7 | `method-week` | What one week of this looks like, and the one number worth watching |

Same banded blocks as `weekly-programme.ts`, Justin's voice, no dashes.

**The claims stay inside what we already cite.** `screen-balance.ts` carries WHO,
the American Academy of Pediatrics, the RCPCH and Sue Atkins, described at the
breadth of their published positions. No new study names, no numbers we cannot
trace. Where the honest claim is narrower than the impressive one, take the
narrow one.

## Half two: the nudges

`components/home/HabitNudge.tsx`, built on the SetupNudge rules: one nudge per
visit, 24 hour snooze each, Start and Not now, and Not now means it.

Four rules, each fired only when it is true of this family right now, each
pointing at one thing to do:

1. **The timer has never been started**, and there are jobs on the board. The
   screen time is happening either way; a clock everyone can see is the change.
2. **Stars are waiting on a yes**, and have been since yesterday. Directly the
   thing Justin hit an hour ago: a child ticked a job and nothing moved, because
   the yes never came.
3. **Minutes are banked and unspent** for several days. The loop worked and
   nobody spent it, which usually means the child does not know it is there.
4. **A run of screen days with nothing offline.** Points at the game pack, which
   is the offline half made of paper.

Rules live in `lib/home/habit-nudges.ts`, pure, so they can be run over a month
of simulated days rather than eyeballed once. That is the lesson from the last
three bugs in a row: every one of them was correct on a single day and wrong
across days, and nothing tested across days.

**Never more than one, never twice in a day, never a modal.** A nudge that
blocks the screen is a pop up, and Justin asked for the opposite.

## Order

1. `lib/home/habit-nudges.ts` plus `scripts/check-habit-nudges.mjs`
2. `components/home/HabitNudge.tsx`, wired on the parent home
3. `lib/email/method-week.ts`, four templates
4. Cron wiring, anchored to first use, plus the 200 day guard
5. `/dev/habit-nudges` and `/dev/method-week` fixtures, checked at 390 and 1280
6. Typecheck, build, wiring, screenshots, draft PR

## What this is not

Not push notifications: those are a separate consent surface and a separate
argument. Not a new table. Not a second nudge system living beside the setup one.
