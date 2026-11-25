# School dates land in the right year

Justin, 25 November 2026, with a screenshot: an event showing "364 days late".
He had snapped a school calendar that prints 2025 and whose weekdays only fit
the 2025 to 2026 school year. Two faults:

- The reader took the printed year at its word and added nine entries a year
  in the past, which then led the page as overdue.
- Where the calendar gave a weekday but no year ("Tuesday 3 February"), the
  model guessed 2027, a year in which 3 February is a Wednesday. Twenty five
  entries landed on the wrong day of the wrong year.

## The change (lib/school/fix-years.ts, pure and tested)
1. A written weekday decides the year. If the text says "Tuesday 3 February"
   and the date returned is not a Tuesday, the year moves to the nearest one
   where it is. A year printed in the text is always kept.
2. Anything whose date has already passed is marked `past`. The snap card
   says so, leaves those unticked, and a letter that is all past says it looks
   like an older letter. The email path does not add past items at all.
3. The prompt tells the model both rules, so the code is the second check.
No migration. The 39 entries from the 25 November snap were dismissed by hand.
