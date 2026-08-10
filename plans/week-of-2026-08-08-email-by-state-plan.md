# Emails by state, not by signup date

Justin, 8 August 2026:

> "note that the emails are not just new sign ups we need to be emailing everyone
> that registers adds email including users so needs to know the difference
> between 1 just signed up, 2 using it but haven't paid, 3 paid users and emails
> need to deal with those encouraging sign ups that have not continued after
> trial and providing service help for paid users"

## The problem, stated plainly

Another session was on this in parallel and landed two commits while this was
being written (6a73d4f, 83dc5aa). They re-paced the whole programme to one email
a week and added ten more, carrying it to week 26. **They did not do any of the
state work**, so this is built on top of theirs rather than instead of it: their
commits are length and pacing, this is who gets what.

The whole programme is keyed on **days since signup**, and the cron only loads
profiles created inside a rolling window (they widened it from 60 days to 200,
which moves the cliff rather than removing it):

```ts
const since = new Date(Date.now() - 200 * 86400000).toISOString()
```

So a parent who registered 201 days ago **is not loaded at all**. Not for win
back, not for trial nurture, not for anything. They are invisible to the email
system for the rest of their life with the product, and nothing logs that it
happened. Widening the number buys time and keeps the cliff.

## The three states, and what each one gets today

`lib/email/lifecycle.ts` already computes state. Almost nothing uses it.

| Justin's group | state today | emails it gets today |
| --- | --- | --- |
| 1 · Just signed up | `trialing` | the 30 onboarding emails, week 1 to 26 |
| 2 · Using it, not paid | `trialing`, then `lapsed` | `trial-ending` (once), `winback-1` (once) |
| 3 · Paid | `active` | **nothing of its own.** The same onboarding as everyone, then silence |

So group 3, the people actually paying, is the worst served group in the system.
And group 2 gets exactly one win back email, ever, and only if they lapsed
inside the window.

`past_due` (a paying member whose card failed) falls through `lifecycleState`
to `unknown` and gets nothing at all.

## The change

**Split the cron into two passes.**

### Pass A, onboarding. Unchanged.

The other session's 26 week programme, untouched. Their day gates and their
pacing stay exactly as they wrote them. The window becomes a guard on this block
(`days <= 200`) rather than a filter on the query, which is the only change:
without it, opening the query would restart week 1 for every existing member.

### Pass B, state tracks. Everyone.

**No `created_at` filter.** Every onboarded profile, branched on lifecycle
state. This is the fix for "everyone that registers, including users".

Pass B needs to know two things the old code never asked:

1. **How long since the last email in this track**, so a sequence can pace
   itself without a signup date. `email_log.sent_at` already exists, so this
   needs no migration. One bulk read, keyed by `(user_id, email_key)`.
The per profile `children` query also moves out of the loop and becomes one bulk
read. With the window gone the loop runs over every member, so a query inside it
would be one round trip per member per day.

### The sequences

**Lapsed, encouraging the ones who did not continue.** `winback-1` stays where
it is. Two more follow, paced off the previous send rather than off signup:

| key | when | the one idea |
| --- | --- | --- |
| `winback-1` | exists | the door is still open, the free tier is real |
| `winback-2` | 7 days after 1 | what is sitting there unused, named for their child |
| `winback-3` | 21 days after 2 | the founder rate, the one thing that runs out |
| `wb-tease-*` | one a week after that | seven teasers, one service each |

**Superseded the same day.** This started as three and stop, on the reasoning
that a fourth is nagging. Justin then asked for the opposite: "make sure we tease
sign ups that disappear after trial ends and keep emailing them weekly to entice
back." So seven weekly teases follow the three, ten emails over about eleven
weeks, reusing the pre signup teaser bank rather than seven new templates. A
lapsed parent is in exactly the position a lead is in. `winBackLastEmail` lost
its "this is the last one" framing, because it stopped being true.

**Paid, the service help track.** Keyed on being `active` and paced off the
previous send. This track is help, not selling, because they have already
bought:

| key | when | the one idea |
| --- | --- | --- |
| `paid-1` | day 60, or on becoming active if later | what your plan actually unlocks, the parts most people never open |
| `paid-2` | 14 days after 1 | reply to this email and I will answer it myself |
| `paid-3` | 30 days after 2 | the things paid parents ask most, answered |
| `paid-4` | 21 days after 3 | what this looks like from the child's phone |
| `paid-5` | 21 days after 4 | the words a child needs to tell you something |
| `paid-6` | 21 days after 5 | reading ahead, every stage unlocked |
| `paid-7` | 21 days after 6 | where the screen time number comes from |
| `paid-8` | 21 days after 7 | more than one child, same subscription |

The depth five were added after Justin asked for "every aspect of what they can
do... both types of users", and their topics were picked by auditing every
existing subject line first, because two sessions had already duplicated each
other on this once. Two of the five are about what the CHILD experiences, which
nothing in the programme had covered.

Starts at day 60 to stay clear of the dense opening weeks. Anyone upgrading
later gets it on the next run, which is the right moment anyway: just after
paying is exactly when to show someone what they bought.

**Past due.** One email, plainly: the card failed, here is the link, nothing has
been taken away yet. It is the cheapest save in the system and it did not exist.

## Rules

- No dashes in any copy.
- Every send guarded by `email_log`, same as the existing twenty.
- Pass B skips anyone `email_opt_out`, same as pass A.
- A lapsed parent KEEPS receiving the onboarding programme. That was going to be
  suppressed until the trial clock was checked: a no card trial expires around
  day 14, so `lapsed` is the normal state for everyone who has not paid, and
  suppressing on it would have silently gutted the programme for most of the
  list. The two tracks also do not fight: win back says the free tier is a fine
  place to be, and the programme is the free tier's value.

## Not doing

- **No migration.** `email_log.sent_at` is already there and is all the pacing
  needs.
- Both new sequences send **one email per run**, never a catch up burst. With
  the window gone, every long standing member becomes eligible on the same day.
- No preference centre, still. Worth doing, still not this change.
- Not touching the weekly digest or monthly balance. Those already reach
  everyone and are reports rather than programme.


## What this uncovered, and what was done about it

Two published claims turned out to be false, both found by checking a link
before writing copy around it rather than by anyone reporting them:

1. **There was no way to cancel.** `/dashboard/upgrade` had promised "cancel any
   time" since it was written. Fixed properly rather than in copy: a Stripe
   hosted billing portal at `/api/stripe/portal`, with a Your plan section in
   settings. It fixes card updates in the same stroke, which is what the past
   due email needed and could not have.
2. **The privacy policy said we do not ask for a date of birth.** The app has
   asked for one since migration 083, and for interests since 088. The policy
   now describes both, says they are optional, says what each is for, and says
   they can be cleared. The product was not changed: the birthday is what moves
   a child into the next stage on the right day, which is worth having and worth
   describing honestly.

**Still unverified, and deliberately left alone:** the same privacy sentence
says we do not ask for a school. No UI was found that collects one, so it was
left as written rather than rewritten on a guess. `profiles.school_id` and
`school_region` exist and nothing in the parent app appears to set them, which
is worth someone confirming before the ICO registration goes in.
