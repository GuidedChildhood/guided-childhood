# Homework and projects: reminders that lead up to the day (week of 16 November 2026)

Justin, 19 November, after snapping the Anderson shelter letter: the dates went
into the calendar, but the alerts showed at once for something due 1 December,
and the one project came in as two items. Asked for reminders leading up to the
due date, Apple simple, on the child's app too, then a prompt for a walkthrough
film and posts.

## What is wrong today
- The notifications page shows every open school item from the moment it is added,
  so a 1 December project sits as an alert on 19 November.
- The only reminders are the night before (evening cron) and the morning of.
  Nothing helps a two week project get started.
- One project split into "Build" and "Hand in", both due the same day.

## The change
1. `lib/school/lead-up.ts`: homework and deadlines with room get early reminders,
   a week before (when 8 or more days away when added) and 3 days before (when 4
   or more). The night before stays as it is. A parent can turn each on or off
   (Apple Reminders' "Early reminder"), stored in `school_actions.remind_days`
   (migration 401, null means the automatic plan).
2. The evening cron sends the early reminders to the parent and, for homework, to
   the child's app.
3. Notifications show a dated item only from its first reminder, with the date
   in words ("due Tue 1 Dec · 12 days to go").
4. The school page card shows the reminder chips under any homework or deadline
   with room, and the days to go.
5. The extractor is told one item per piece of work, and near duplicates with the
   same date are merged on the way in.

Migration 401 must be applied before the chips save; everything else works and
falls back to the automatic plan until then.
