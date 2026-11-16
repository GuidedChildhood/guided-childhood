# Watch together booking: implementation plan

16 November 2026. For Justin's approval before any code. Nothing here changes
existing behaviour or deploys anything until he says yes.

## What exists today (inspected)

| Piece | Where | What it does now |
| --- | --- | --- |
| Watch together lessons | `parent_lessons`, `parent_lesson_segments`, `parent_lesson_cards` (migration 049), read only through `lib/lessons/parent-lessons.ts` | Ten Stage 1 films (1.1 to 1.10), each a stage, journey step, three segments and pause cards. Content lives in the database |
| Parent side | `/dashboard/lessons/together` and `/together/[code]`, `ParentLessonPlayer` | Lists and plays the films. `LessonSendButton` pings the child now |
| Child side | `/k/[token]` (token link, no login) and `/k/[token]/adventures/[code]` | Every film from Stage 1 up to the child's own stage, always available as an adventure |
| Finishing | `POST /api/parent-lessons/complete` | Works from either side, awards stars, checks the stage passport, sends the parent a good news push |
| Notifications | `lib/push/send.ts` (web push, parents or one child's devices), `lib/push/quiet-hours.ts` | Nothing buzzes a child 19:00 to 07:00, London time. Held pushes are dropped, not queued |
| Parent nudge ceiling | `lib/push/nudge-cap.ts` | Two scheduled nudges a day per parent, enforced in code |
| Parent's daily lead | `lib/home/next-up.ts` | The one picker for what Home leads with |
| Email | `lib/email` | One programme email a week, enforced inside `sendEmail` |
| A cron every minute | `/api/cron/device-time` | Already runs, so a due booking can be picked up without a new schedule |

Stage 2 films are scripts only. Booking works for whatever rows `parent_lessons`
holds, so new films join it with no code change.

## What it adds

1. **Book.** On each film page, beside "Send to [child]", a second button:
   Book a time. One sheet: which child (preselected if only one), a day in the
   next 14 days, then three suggested times plus "another time" in 15 minute
   steps. One tap to confirm.
2. **The parent reminder.** A push 15 minutes before, and the booking becomes
   their Home lead for that hour through `next-up.ts` (no second picker).
   An "Add to my calendar" file is offered on the confirmation, made on the
   device (question 4).
3. **The child's app at the time.** From the booked time until it is watched
   or the day ends, a big card leads the child's page: the film's poster, "Film
   time! Watch with your grown up", one Play button. Before
   the time the child sees nothing about it (question 2). The film stays in
   their adventures before, during and after, exactly as now.
4. **Change or cancel.** The booking shows on the film page and on the
   Watch together page with Change time and Cancel. Cancelling removes the card
   from the child's page at once.
5. **After watching.** The completion route already fires. The parent's player,
   and a push to the parent if the child finished on their own device, then
   show one short "Tonight" card: one activity or one question. Stored per film
   in the database, not in code (non negotiable 6). The ten Stage 1 parent
   notes in `content/child-films/2026-11-14-inventory-and-release-list.md`
   become the first ten.
6. **Missed.** If the day ends unwatched, the parent gets one line on Home the
   next day: "Pick a new time for [film]?" Never a push, never anything to the
   child.

## What it needs

- **Migration 399** (free on main and in every open PR today; re checked at the
  first push). One table and one column:
  - `watch_bookings`: id, parent_id, child_id, lesson_code, starts_at
    (timestamptz), status (booked, watched, cancelled, missed), reminded_at,
    shown_at, watched_at, created_at, updated_at. Foreign keys to `children`
    and `parent_lessons(lesson_code)`, on delete cascade. One live booking per
    child per film. RLS: a parent reads and writes only their own children's
    rows; the child page reads through the service role scoped to the token's
    child, as every other kid read does.
  - `parent_lessons.after_prompt` (text, nullable), seeded for 1.1 to 1.10.
- **Routes**: `POST/PATCH/DELETE /api/watch-bookings` (parent session, child
  ownership checked like the completion route).
- **Stage mapping**: the server refuses a booking for a film above the child's
  own stage, the same gate the child page uses. The booking stores child and
  lesson code; stage is read from `parent_lessons.stage_id`, never copied.
- **Cron**: the existing every minute job gets one more step: reminders due,
  child pushes due (07:00 to 18:59 only), and missed at day end. Or a small
  new route on the same schedule if Justin prefers it kept apart.
- **Watched**: the completion route marks today's booking for that child and
  film watched. One added update, no change to stars or passports.
- **Guards** (CI, like the others): a booking push to a child can never send
  in quiet hours; the booking reminder is not counted as a nudge but cannot
  exceed one per booking; the child page never shows a booking before its time.

Estimated size: one migration, one API file, one sheet component, two cards
(parent and child), small edits to the film page, the completion route,
`next-up.ts` and the cron. One PR. Mobile first, built from the existing
buttons, cards and tokens.

## Privacy

- **Nothing new about the child.** A booking is a child id, a film code and a
  time. No location, no device data, no free text.
- **No free text from parent to child.** The child card's words are fixed.
  A booking is not a messaging channel, so it cannot become one.
- **The calendar file carries no child name**: "Watch together: Screens go to
  bed first". Calendars sync to outside services.
- **Erasure**: the table cascades from `children` and from the account, so
  deleting either deletes every booking. Added to the erasure check list.
- **No email.** Push and Home only, so the one email a week rule is untouched
  and no new mailing list exists.
- **Retention**: watched, cancelled and missed rows older than 90 days are
  deleted by the same cron. Completions already record that a film was watched.

## Safeguarding

- **Quiet hours stay absolute.** An evening booking shows on the child's page
  silently. Nothing is queued for the morning.
- **No countdown on a child's screen**, for under 8s certainly. A timer telling
  a small child "film in 2 hours" is a pull, the thing the product argues
  against.
- **The child cannot book, change or cancel.** It is a grown up's promise to sit
  with them.
- **The after card can surface a worry.** Films like 1.4 and the new 1.6 invite
  a child to tell. The card for those films ends with what to do if they do:
  thank them, stay calm, and the Moments route to record it and get DiGi's
  pathway; Childline 0800 1111 where the film's own parent note carries it.
- **A missed booking is never a failure in front of the child.** No streak, no
  "you missed it", no star lost.

## Questions for Justin

1. **Times**: three suggestions plus "another time" (recommended), or a free
   time picker only?
2. **Before the time**: the child sees nothing until the time (recommended), or
   "Film time, Thursday at 5" shown ahead?
3. **Evening slots**: allowed and silent after 19:00 (recommended), or bookings
   stop at 19:00?
4. **Calendar file**: include it (recommended), or not now?
5. **Buzz the child at the time** (daytime only): on by default, or off unless
   the parent ticks it? Recommendation: on by default.

## Not in this plan

- No change to how films play, to stars, to passports or to the lesson list.
- No booking for school lessons, star lessons or printables.
- No reminders by text message, and no shared bookings between two parents
  (a second parent account is not in the product yet).
