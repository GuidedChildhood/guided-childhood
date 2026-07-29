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

---

# Decided: unused minutes become sticker book

29 July, JP: "Let's get unused minutes to convert to sticker book and make the
maths realistic to take a month or so."

That settles the open question. Two findings from wiring it up, one of which
changes the shape.

## Finding 1: a weekly reset would break the sticker book

lib/stickers/book.ts earns stickers from `banks[0].earned`, which is the SAME
cumulative lifetime total that produced 342. So if stars reset on Monday, a
child loses sticker progress every week. The reset cannot ship on its own.

The fix is a split the code does not currently make:

- **Spendable stars** — weekly, reset Monday, capped at the band's recommended
  minutes. Buys screen time. This is the number on the child's balance.
- **Sticker credit** — never resets. Feeds the sticker book.

That split is also what makes JP's idea work, and it is a better rule than the
one there now. Today stickers come from EARNING, which is the same thing the
star chart already rewards, so the book is a second scoreboard for one
behaviour. Under this, stickers come from NOT SPENDING. The star chart pays
doing the jobs; the book pays restraint. Two currencies, two different lessons,
and the second one is the one the product exists to teach.

## Finding 2: the current thresholds finish in under three weeks

Sticker star rules today are 1, 10, 25, 50, 100. At a realistic 42 stars a week
(three jobs a day at two stars):

| Sticker | Reached after |
| --- | --- |
| First Star (1) | 0.2 days |
| Ten Stars (10) | 1.7 days |
| Twenty Five (25) | 4.2 days |
| Fifty Stars (50) | 8.3 days |
| Star Champion (100) | 16.7 days |

The whole star set is done inside seventeen days, and that is before the
conversion adds anything. "A month or so" needs the thresholds re-cut against
the new currency, not the old one.

## The maths, to land at about a month

Unused minutes a week, realistically: a child earns roughly half the band guide
and spends most of it, so call it 60 to 150 minutes left over.

Proposal, to be sanity checked by JP rather than assumed:

- **1 sticker credit = 30 unused minutes**, awarded at Monday rollover.
- That is 2 to 5 credits a week for a typical child.
- Re-cut the five star stickers onto credits at **3, 8, 15, 25, 40**.
- At ~3 credits a week: first at day 7, last at about week 13.
- At ~5 credits a week: last at about week 8.

That is longer than a month for the full set, which is right, because the set
should outlast the first month rather than finish in it. The FIRST few land in
week one and week three, so the loop is felt early and the book still has
somewhere to go. If JP wants the whole book inside a month, halve the top two.

## Build order, none of it started

1. Migration: a sticker_credits store and a star week boundary.
2. Split getStarBanks into spendable (weekly, capped) and lifetime.
3. Point the sticker rules at credits rather than cumulative stars.
4. Monday rollover that converts unused minutes and writes the credits.
5. Fix the stats page "aim for tomorrow 210 min", which spreads the unused
   weekly budget forward and tells a parent to aim at nearly double the daily
   guide. Same logic, same change.

## Separately requested, not started

PWA re-engagement pushes: an "are you there, it only takes ten minutes to check
in" for parents who have not started the pathway, then Duolingo style escalating
reminders (two days, then wider). Needs its own plan: cadence, the opt out, and
the line where encouragement becomes nagging a parent who is already struggling.

---

# Built, 29 July 2026 (migration 124)

Justin: "Agreed 30 finish building."

## What shipped

1. **`lib/quests/star-week.ts`** — Monday to Monday in London, plus the per band
   weekly cap from the same BAND table the balance graphs use, so the ceiling
   stays sourced rather than invented. Seven boundary cases tested including both
   clock changes and the Sunday into Monday edge.
2. **`getStarBanks` split** — lifetime figures kept (the passport and stats want
   them) and `weekEarned / weekSpent / weekBalance / weekMinutes / weekCap` added.
   Both are computed from the same rows by the same predicate, because two
   separate passes is how they drift.
3. **Screen time spends the WEEK** — `/api/quests/spend` and
   `/api/quests/time/parent-start` now gate on `weekBalance`.
4. **Sticker book reads credits, not stars** — `lib/stickers/book.ts` no longer
   touches the star bank at all. Thresholds re-cut to 3, 8, 15, 25, 40.
5. **Monday rollover** — `/api/cron/star-week-rollover`, 00:10 Monday, converts
   unused minutes at 30 a credit and pushes the child.
6. **The stats page 210** — fixed, see below.

## The numbers, verified rather than asserted

| Band | Weekly cap | Cap in minutes |
| --- | --- | --- |
| 4 to 7 | 84 stars | 420 |
| 8 to 10 | 105 | 525 |
| 11 to 13 | 126 | 630 |
| 13 to 15 | 168 | 840 |

The test child's 342 stars and 1,710 minutes (28.5 hours) becomes a hard ceiling
of 525 minutes, 8.8 hours, in any one week. A child earning 200 stars in a week
is capped at 105. Justin asked to make it "almost impossible" for the 342 to
happen again; it is now arithmetically impossible.

Credits at a realistic week: 2 to 7. Ladder completion at 2 credits a week is
weeks 2, 4, 8, 13, 20; at 5 a week it is weeks 1, 2, 3, 5, 8. First sticker inside
a fortnight, full set outlasting the month, which is what was asked for.

## Four things the build turned up that the plan had not

1. **Goals would have broken.** A cinema trip at 40 stars is a SAVE UP mechanic.
   Gating it on the weekly balance would make any goal costing more than one
   week's cap permanently unreachable. So goals still spend the lifetime balance,
   annotated at both redemption sites so nobody later "fixes" it. Hoarding screen
   time is the thing we prevent; saving towards a cinema trip is the thing we want.
2. **Redeeming a goal would have wiped the week's screen time.** Goal redemption
   writes a `star_spends` row with `minutes: 0`, and the weekly spend originally
   summed every spend row. So cashing in a saved up reward silently cost a child
   their screen time that week: a punishment for using the feature. Weekly now
   counts screen time spends only.
3. **The rollover needed to read a PAST week.** It runs after midnight, so without
   a `weekStart` argument it would have read the brand new empty week, found
   nothing left over, and silently never paid anybody. Both ends of the window are
   bounded for the same reason.
4. **The stats page was recommending double the guidance.** `suggestTomorrow` was
   capped at twice the daily guide, which is where Justin's "aim for tomorrow 210
   min" came from against a guide of 105. A screen built entirely on age guidance
   was advising double it. Worse than a wrong number, because a parent following it
   faithfully ends up over. Capped at the guide now: unspent allowance is not a
   debt to catch up on, which is the same principle as the weekly reset.

## Not built, and why

**Five streaks to an older squad friend, and the 30 weekend minutes.** Both need
the per day step model from `plans/child-app-five-a-day-plan.md`, because a
"streak" under the new design means all five of a day's steps done, and nothing
records that yet. `WEEKEND_BONUS_MINUTES = 30` and `STREAKS_PER_REWARD = 5` are in
`lib/quests/star-week.ts` waiting for it, deliberately as named constants rather
than numbers buried in a component.
