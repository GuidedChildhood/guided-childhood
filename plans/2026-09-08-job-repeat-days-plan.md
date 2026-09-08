# The repeat picker: chosen days back, and every reader made to agree

Justin, 8 September 2026: "Noticed that with jobs and quests we previously had
a setting whether a one off day, recurring, or one per week etc, like Google
calendar entries. Can we get that back, super easy for user? And all wired into
checks done on time etc, earns time etc so nothing breaks, also that reminders
for outstanding still all works."

## What is actually missing

Not much, and that is the good news. `schedule_days` (a list of weekday
numbers, migration 060) is still in the table, still accepted by the create and
edit routes, still honoured by the canonical rule in `lib/quests/due.ts`, by the
board, by the child's job list, by the streak, and by the reminders cron.

The only thing gone is the way IN. Both add flows offer four fixed choices
(every day, school days, weekends, just once) and no way to say Monday,
Wednesday, Friday, or every Tuesday. So the capability is there and unreachable.

## What would break the moment it is reachable, and is fixed here

Five readers assume the schedule is one of those four words and ignore chosen
days entirely. Every one of them is a real family visible bug the day a parent
picks Tuesday and Thursday:

| Where | What goes wrong today |
| --- | --- |
| `app/k/[token]/KidQuestScreen.tsx` | The child is told a Tuesday job happens "every day" |
| `app/api/kid/path-complete/route.ts` | A job not due today still blocks the day done bonus |
| `app/(dashboard)/dashboard/quests/print/page.tsx` | The printed chart draws a box on every day of the week |
| `app/(dashboard)/dashboard/quests/page.tsx` | The balance verdict misreads a weekday job as not a weekday job |
| `components/quests/QuestStatusBoard.tsx` and `app/api/cron/job-reminders/route.ts` | Their own copies of the due rule, which happen to agree today |

The last two are the shape of the problem rather than a bug: three copies of one
rule, and `lib/quests/due.ts` already exists to be the one. They become imports.

## The build

1. **A fifth chip, Certain days**, in `JobPicker` and `JobComposer`, opening a
   Monday to Sunday row. Chosen days are sent as `schedule_days`, which every
   reader already prefers over the schedule word. One shared `DayPicker` so the
   two flows cannot diverge.
2. **Every reader through the canonical rule.** The two inline copies deleted,
   the three that never knew about chosen days taught to ask.
3. **One label everywhere.** `scheduleLabel` already says "every Tuesday and
   Thursday" properly and is used by the add confirmation and the emails. The
   child app gets it too, instead of its hardcoded ternary.

## What is deliberately NOT changed

"Just once" stays a job that waits until it is done rather than gaining a date.
A date would need a column, a migration, and a rule for a missed day, and the
current behaviour is the kinder one: a one off does not quietly expire. Said
plainly on the chip so nobody expects a calendar entry.

## Checks

tsc, wiring, the dash grep, `scripts/check-checkin-shifts.mjs`, and the child
side guard (`lib/quests/due.ts` has no imports at all, so the child app can hold
it). Browser at 390 and 1200: `/dev/add-job` picking certain days, and the
printed chart. The wiring proof: a job set to Tuesday and Thursday shows on the
board only on those days, tells the child "every Tuesday and Thursday", is
skipped by the day done gate on a Monday, and is not chased by the reminder.
