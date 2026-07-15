# Routines, the Sunday DiGi review, and trust that grows with age

**Started 15 July 2026, from JP's red pen.** The plan for turning the star
economy into a running household system: routines built from tasks, a weekly
DiGi review every Sunday, and device time trust that widens as a child gets
older.

## Shipped in this pass (child app + quests)

- **Routine packs** (`lib/quests/routines.ts`): the parent adds a whole moment
  of the week in one tap, School morning, After school, Dinner helper, Bedtime
  wind down, Weekend reset, Holiday days. Each drops its jobs in on the right
  days, skipping anything already set. In the Quests manager above the
  templates.
- **Obvious to-do for the child**: a bold "My to-do today" header with a live
  "N to do" count, a loud tappable "You have N things to do today" signpost
  under the star bank that jumps to the list, and a daily DiGi hello pop-up on
  first open ("Hi Mia, 3 things to do today").
- Confirmed already built: when the child starts device time the parent's
  phone gets a push and the parent's quests board shows the same live
  countdown with the alarm at zero.

## Next: richer routine scheduling (needs a small migration)

The pack tasks use the existing schedules (daily, weekdays, weekend, once).
JP wants more real shapes:
- **N times a week** (room tidy three times), **specific weekdays**, and a
  **holiday mode** where the morning screen time is earned rather than given.
- Build: extend `family_quests.schedule` (or add a `schedule_days` / `times_per_week`
  column), update `questDueToday` to read it, and track weekly completion count
  so an N-times quest drops off once hit. Migration 057.

## Next: the Sunday DiGi weekly review (the headline)

Every Sunday evening DiGi looks across the family's own week and hands the
parent a warm, useful summary plus next week set up in one tap.

- **The data it reads** (all already stored): quests approved and missed,
  stars earned and spent, streak, device minutes used, before-screens gate
  hits, school actions done, any wellbeing check ins and concerns.
- **What it produces**: a short DiGi note in JP's voice, what went well, one
  gentle watch-for, and a concrete next-week suggestion (add the bedtime
  routine, ease off after a heavy week, one child needs more play quests). The
  Insight and wisdom engines already exist (`digi_insights`, the daily miner);
  this is a family-scoped weekly variant.
- **Delivery**: a `45 18 * * 0` cron (Sunday ~7:45pm) that builds each family's
  review, stores it, pushes the parent, and surfaces it on the dashboard as a
  DiGi card with a "Set up next week" action that pre-fills routines.
- **Never a report card on the child**: the tone stands beside the parent,
  celebrates effort, never shames a missed week. Same ethos as the smart
  alerts and the normal-moments library.

## Next: device time trust that grows with age

JP: younger children need the grown up in the loop; older ones earn autonomy.
- A per-child **device time trust** setting: *Ask first* (the child's start
  sends a request the parent approves before the timer runs), *Start freely,
  I watch* (today's behaviour, the child starts and the parent gets the push
  and countdown), and *Trusted* (older, lighter touch, a daily summary rather
  than a per-session ping).
- Default by stage: younger stages to Ask first, older to Start freely.
- Build: add `children.device_trust`, gate `/api/quests/time/start` on it (Ask
  first creates a pending request instead of a session), and a parent control
  on the Screen time card. Pairs with the existing countdown and alarm.

## Build order

1. Routines + obvious to-do (done this pass).
2. Sunday DiGi weekly review (migration for the stored review + cron + card).
3. Device time trust by age (migration + start-route gate + parent control).
4. Richer routine scheduling (migration + questDueToday + weekly counts).
