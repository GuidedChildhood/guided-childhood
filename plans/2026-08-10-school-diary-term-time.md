# The school diary learns about the holidays, and a wrong reminder can be fixed

**Justin, 10 August 2026**, from Teo's phone, a Show and tell routine firing
red at 13:38 on Monday 10 August, mid summer holidays:

> "this reminder is flagging up but shows an error so it's a school reminder,
> show and tell, but coming up in the school holidays and no way for it to be
> edited so we need to know if it's school time reminders or home life
> reminders and we need a way for them to click in and simply stop it edit it
> if wrong"

Three faults in one screenshot:

1. **A weekly school routine fired in the school holidays.** The app knows the
   holidays (lib/learning/holidays, isSchoolHoliday, drawn wide on purpose)
   and the diary never asked it.
2. **It wore the overdue red**, because 08:15 had passed. A reminder that
   should not exist today, shouting.
3. **No way in to fix it.** The chips on the child's week are not tappable,
   and the parent's card can clear or dismiss but not edit.

## The build

**Migration 182: school time or home life, stored.** One column on
school_actions: `runs_in_holidays boolean not null default false`. False is a
school time reminder and pauses in the school holidays; true is a home life
one (a club that runs all year) and keeps going. Only WEEKLY ROUTINES are
paused: a dated one off in the holidays was typed on purpose. The default is
false because school_actions is the school diary, so the truthful backfill
for existing routines is school time, which is exactly what fixes Show and
tell in August without a single edit.

**The hold, everywhere routines surface:**
- The child's home banner and tomorrow heads up skip held routines.
- The child's week shows a held routine greyed with an "on hold for the
  holidays" pill on holiday days rather than hiding it, so nothing vanishes
  mysteriously, and it can never wear the urgent red while held.
- The parent's card labels each routine school time or holidays too, and says
  "on hold until school is back" during the holidays instead of counting down.
- The reminder pushes (school remind, morning, soon) skip held routines.

**Tap in to fix, both sides:**
- Parent: an Edit on every reminder, opening the same add sheet prefilled
  (title, kind, day, time, weekly, send to child, holidays too), saved
  through PATCH on /api/school/actions. Dismiss stays the stop.
- Child: every chip on their week opens a small sheet. Their own items they
  can edit or take off (new PATCH and DELETE on /api/kid/school-add, scoped
  to rows added_by_child_id = their child id). A grown up's items show the
  details and one button: tell your grown up it looks wrong, which pings the
  parent naming the item. A child never edits a grown up's reminder directly.

**Both add sheets gain the question**, only when Every week is picked:
"School time only" or "In the holidays too", two chips, defaulting to school
time.

## Order

1. Migration 182 claimed in the draft PR at the start.
2. lib/school/child-items grows the shared held-today rule so the banner,
   week, and crons cannot drift.
3. APIs, then the four surfaces, then fixtures and screenshots at 320, 390,
   430 per the standing rule.
