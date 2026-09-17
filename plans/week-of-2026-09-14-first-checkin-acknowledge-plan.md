# The first check in acknowledges, it does not rate

17 September 2026. Justin, after signing up a fresh account and watching his own
first check in: "can we check first check in with 5 star rating needs to be done
this way as it's just to acknowledge first concerns raised so seems overkill to
ask them to do a check in maybe we should just acknowledge they are added to
solve first and are on next day ... and if any more moments to add so we keep
addressing the issues and helping until they go away."

## What the live data says, before any opinion

One account, created tonight, read from production:

| time | what happened |
| --- | --- |
| 20:58:40 | account created |
| 20:58:42 | Timbotee added |
| 20:58:55 | seven concerns written in one go, Biting among them, from the words typed into Something else |
| 20:59:29 | first rating, Biting, one star |
| 21:00:04 | seventh rating |

**Seven ratings in thirty five seconds, every one scored the same.** Five
seconds a worry, taken ninety seconds after the account existed, by a parent who
had not yet watched a single day with any of those worries in mind.

That number is not idle. It is the baseline the weekly email compares against,
the one the passport stamp is earned from, and the one behind every "is it
getting better" sentence in the product. We were anchoring the whole instrument
on a reading taken before there was anything to read.

Justin's separate worry, that Biting never reached the check in, is not a
defect: it was written from what he typed and it was the first card he rated.
The flow worked. It went past in five seconds, which is the same finding wearing
a different coat.

## The two changes, both approved

### 1. Day one acknowledges

No stars on a family's first visit. The screen shows what they named, per child,
in their own words, says these are the ones we start on, and says the asking
starts tomorrow. One tap to confirm. Add and remove live on that screen, because
the moment a parent is reading their own list back is the moment they think of
the one they forgot.

The first real rating then happens on day two, with a day of watching behind it.
That is a truer baseline, not a missing one.

### 2. The daily check in asks about a few, not everything

At most three per child, longest unasked first, so every worry comes round and a
day's check in always fits in under a minute. It ends by asking whether anything
else happened today, pointing at the moments deck, so new things keep joining
the list while old ones keep being chased until they rest at five stars.

## What must not move

`review.md` section 4a governs this surface, and none of it is up for grabs
here. Five stars are five bands; star n posts the top of its band; the server
compares bands and never raw numbers; movement is said in words; last time is
grey and today is gold; state is keyed per child by concern id; the scored
`concern_events` write comes first and its failure is an error rather than a
silent Saved; five stars rests the worry; `check-concern-dots.mjs` passes.

This change touches **when** we ask and **how many** we ask, never the
instrument itself.

## The build

**Migration 304**, `profiles.concerns_confirmed_at`. It has to be its own
column rather than a reuse of `first_checkin_at`, because those two now mean
different things: one is "they have seen and agreed their list", the other is
"they have given us a reading". The review filter in `lib/checkin/today.ts` keys
off the second and must keep doing so.

1. **Migration 304.** One nullable timestamp, read guarded everywhere, because
   migrations run by hand here and naming a missing column fails the whole query
   it sits in.
2. **`lib/checkin/today.ts`.** A third state before the existing two: nothing
   confirmed yet means return the list to acknowledge rather than the list to
   rate. Once confirmed, the daily rule applies and the cap comes in.
3. **The cap and the order.** Three per child, `last_checked_at` ascending with
   nulls first, which is "longest unasked" and makes the rotation fair without a
   new column to track it.
4. **The acknowledgement screen.** Its own component beside `ConcernCheckIn`,
   in the same vocabulary, with the add and remove rows and one confirm button.
5. **Anything else today.** One line at the end of a finished check in pointing
   at the moments deck. Not a new surface, a doorway to the one that exists.
6. **A guard**, mutation tested, holding the four things that would quietly
   undo this: day one never asking for a score, the cap staying in place, the
   order staying longest unasked first, and the instrument's own rules being
   untouched.

## What this does not do

It does not change what a rating means, what happens to a rested worry, the
weekly email, the passport stamp, or the moments deck itself. It does not change
how concerns are seeded from sign up, which was verified working tonight.
