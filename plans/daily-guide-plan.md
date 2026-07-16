# Recommended daily viewing, built into the timer

Justin, 16 July 2026. Backend + logic lane. Mobbin session does the visual polish.

## What it does

Every child has an age banded recommended daily amount of screen time (a soft
guide, never a hard limit). The timer now knows how many minutes have already
been logged today, and both the parent and the child can see, at a glance:

- the recommended amount for that age, as one plain line
- how much has been used today
- when they have reached it (a calm alert, never a telling off)
- when they have gone over, framed as a treat the grown up allowed

Works the same for a child WITH their own phone (their app runs the timer) and
one WITHOUT (co view, the parent runs it and marks minutes used).

## The pieces

1. `lib/quests/screen-balance.ts` — export `recommendedDailyMinutes(ageBand)`
   and `bandLabelFor(ageBand)` from the existing BAND guide. One source of truth.
2. `lib/quests/daily-guide.ts` — pure `dailyGuide(ageBand, usedMinutes)` →
   { recommended, used, remaining, pct, status: under|reached|over, overBy,
   reached, bandLabel }. No I/O, easy to reason about and reuse.
3. `lib/quests/usage.ts` — `getMinutesUsedToday(client, userId, childIds)` →
   Map<childId, minutes>. Sums today's device_sessions.minutes plus any
   star_spends.minutes not already tied to a session (the co view / manual
   mark path), so neither path is missed and nothing is double counted. Works
   with the parent session client and the admin client.

## Where it shows

- Parent screen time card (ParentDeviceTime): a tight guide line + slim bar per
  child, and a quiet treat note when the amount being granted would take them
  over the recommended for the day.
- Parent DiGi balance insight (ScreenBalanceInsight): copy cut right down to a
  headline, one line, and bullet points of the guide + used today.
- Child timer (DeviceTimeCard): a small used / recommended chip and bar always,
  and when they reach the guide the invite becomes a calm "you have had your
  screen time today" pause, still letting them ask a grown up for a treat.

## Data plumbing

- `/api/quests/time/active` returns usedToday + recommended + ageBand per child.
- `/api/quests` GET returns a `usage` map (childId → minutes used today).
- Child page computes usedToday via getMinutesUsedToday and passes it +
  recommended into KidQuestScreen → DeviceTimeCard.

No migration: star_spends and device_sessions already carry the columns.

## Not blocking on the server (noted for later)

The child pause is a strong visual nudge, not a hard server block. The parent
already holds the real control (trust level, bonus grant), and now sees used vs
recommended and the over flag. A hard server side cap can come later if wanted.
