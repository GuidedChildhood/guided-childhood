# Adding a reminder: easy, first, any day, and reminders at 4pm and 7:20

Justin, 23 November 2026: adding a reminder should be easy and one of the first
things on the school page; it seems he can only choose the day he is on; the
default reminders should be 16:00 the day before and 07:20 that morning, on the
phones (the PWA push), if that works best.

## What was wrong
- "+ Add reminder" in the week card opened the sheet locked to today. Only
  "Type it in", a quiet button inside the snap card, let a parent choose a day,
  and that was a bare date box.
- Adding by hand was the third thing on the page at best.
- The reminders went at 17:00 and 07:05 UTC, so 6pm and 8:05 in summer: after
  the shops and after the school run.

## The change
1. One "Add a reminder" button directly under the page heading.
2. The sheet gets a day strip (WHOOP's day tiles, Slack's When row): Today,
   Tomorrow and the next twelve days as tiles, then "Another date". It opens on
   tomorrow. Both add buttons use it.
3. Reminders at 16:00 the day before and 07:20 on the day, UK time all year:
   each cron fires at both UTC hours and the route sends only in the London
   hour, so the clocks changing never moves it. Parent's phone and, for the
   child's kinds, the child's.
4. The sheet and the confirmations say those two times.
No migration.
