# The stage check opens on one tap (14 November 2026)

**Why.** Round 1's paid adverts (12 to 14 November) reached 9,210 parents, got
216 clicks and 136 page loads, and not one parent answered question one. The
counter was checked and works (every database write succeeded; the page
counts correctly when walked by hand). Question one asked a stranger for
their child's first name and month and year of birth before giving anything
back, with no button: two dropdowns that moved on by themselves. The adverts
promised "three questions, no sign up". Justin paused the campaign and said
fix it.

**What changes.**
1. Question one is "How old is your child?": thirteen buttons, 4 to 16, one
   tap moves on. The band comes from the age (`bandForYears`). The first name
   stays, optional, above the ages.
2. The birth month moves to the save screen, above the one tap providers so
   both ways in carry it. With the age the year is exact: born in a month
   already reached this year means born `age` years ago, otherwise one more.
   A resumed older run with no age gets a year select too. A select, not a
   box, so the save screen still blocks only on email and password
   (`scripts/check-starter-order.mjs`).
3. "Not you? Start fresh" shows only to a visit that really answered
   something before. It was showing to new parents from adverts.

**What it keeps.** The date of birth is still asked once, at sign up, as
THE-STORY always said; the school year still comes out right. A parent who
skips the month joins with no birthday, which the app already handles (14 of
49 children have none).

**Then.** Switch round 1 back on with left out leading, and judge on stage
checks begun per thousand reached.
