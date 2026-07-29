# The star economy: weekly reset, and why the daily limit is the wrong lever

29 July 2026. JP, after seeing a test child holding 342 stars and 1710 minutes:

> "I think we should make it almost impossible by jobs and star calculation for
> this to happen so I think we have a limit of daily jobs but to answer the
> stars minutes mounting up we refresh each week ... if their jobs done earns
> recommended device time so we do that calculation and any left over go into
> bank so accurate then we have a reward system for unused minutes"

Three ideas in there. Two are right. One the arithmetic argues against, which is
worth settling before anything gets built.

## The arithmetic

Guidance already in the code (lib/quests/screen-balance.ts, sourced to WHO, AAP,
the Canadian 24 hour movement guidelines and RCPCH):

| Band | Recommended a day | A week | Stars needed at 5 min each |
| --- | --- | --- | --- |
| 4 to 7 | 60 min | 420 | 84 a week, 12 a day |
| 8 to 10 | 75 min | 525 | 105 a week, 15 a day |
| 11 to 13 | 90 min | 630 | 126 a week, 18 a day |
| 13 to 15 | 120 min | 840 | 168 a week, 24 a day |
| 16 plus | 120 min | 840 | 168 a week, 24 a day |

The 28 job templates average **2.04 stars**. So to earn the recommended time:

| Band | Jobs a day needed |
| --- | --- |
| 4 to 7 | 5.9 |
| 8 to 10 | 7.4 |
| 11 to 13 | 8.8 |
| 13 to 15 | 11.8 |

**No family does twelve jobs a day.** A realistic board is three to five, which
at 2.04 stars earns 30 to 50 minutes. So a real child already earns roughly HALF
the recommended time, and often less.

## So the daily job limit is the wrong lever

A cap on daily jobs would bite a ceiling nobody reaches. It cannot be what
produced 342 stars, and adding it would only push a child further below a
guideline they are already under.

Where 342 actually came from: about 3 jobs a day at 2 stars is 6 a day, 42 a
week. Over roughly eight weeks of testing that is ~336. It matches. The number
is not a daily earning problem at all. **It is eight weeks with no reset.**

One lever fixes it and the other two do nothing. Worth being clear about,
because a daily cap would feel like it was working while changing nothing.

## The design

**1. Stars reset weekly, Monday morning.** The earned balance is computed from
the current star week only. This is the whole fix and everything else is detail.

**2. The week's ceiling is the age recommendation.** A child cannot hold more
than one week of their band's recommended minutes. 4 to 7 tops out at 420
minutes, 13 to 15 at 840. So the worst case a parent ever faces is one week's
worth, never 28 hours.

**3. Unused minutes do not carry as minutes. They convert.** This is JP's
"reward system for unused minutes" and it is the part that makes the reset fair
rather than punitive. On Monday, whatever was earned and not spent becomes a
separate currency that DOES persist. Screen time cannot hoard, because hoarding
screen time is the thing we are trying to prevent. Restraint still pays, because
a child who does their jobs and chooses not to watch should end up better off,
not reset to nothing.

That inversion is the whole point of the product in one mechanic: the child who
uses less gets more.

**4. Calibration goes UP, not down.** Since a realistic board earns about half
the guideline, the honest options are to raise star values on the everyday jobs,
or make a star worth more minutes for older bands. Not urgent, because the cap
in (2) makes over earning impossible either way, but worth doing so a full day's
jobs feels like it earns a real evening.

## What this needs

- A star week boundary (Monday 00:00 local) and earned computed within it.
- A per band weekly ceiling from the existing BAND table, so the numbers stay
  sourced rather than invented.
- A conversion at rollover, and a store for the converted currency.
- Copy for the child that makes the reset feel like a fresh start, never a
  punishment, and makes the conversion feel like a win.

## The open question for JP

What unused minutes turn into. The candidates already in the product are
keepsakes and the sticker book. Both persist, both are collectable, neither is
screen time. Needs his call before the conversion is built, because it is the
part a child will care about most.
