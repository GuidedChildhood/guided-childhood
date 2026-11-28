# A second chance at the founding rate, for sign ups who lapsed

Justin, 28 November 2026: "investigate if we should give sign ups another
chance on email chain to get the founder rate still, maybe an offer? A poll?"

## What the data says (live, 28 November)

- 36 accounts since 12 July. 1 paying (standard). 0 founders, so all 50
  founding places are still open.
- 32 accounts are lapsed (trial over, not paying), all still emailable.
- 25 of them had the day 7 founding rate email. That is the only time the
  founding rate was put to them.
- 0 have had any win back email. Win back 1, 2 and 3 (win back 3 is the
  founding rate reminder, written 8 August) have never been sent to anyone.
- 14 of the 32 finished at least one day before lapsing.
- 1 parent has answered the "what stopped you" questions; 3 were asked.
- Some of the 36 may be Justin's own test accounts. Not separated here.

## Why the win back never sent

The email cron sends one email per person per run, and programme mail is
held to one a week. A lapsed parent is still eligible for the general weekly
programme (method week, service drip, weekly stories, digest), and those come
earlier in the file than the win back. Each week the slot goes to the next
programme email, so the win back is always queued behind something and never
reaches its turn. (`app/api/email/cron/route.ts`, `deliver` at line 219, win
back at line 570.)

## Recommendation

1. Fix the order (small, a bug). For a lapsed parent, the win back goes
   ahead of the general programme. That alone gives every lapsed family the
   second chance at the founding rate, in copy already written and approved.
2. Put the poll in the first win back (small). Reuse the one tap "what
   stopped you" page (`lib/asks/stalled.ts`). One of its answers is "The
   price screen put me off", which is exactly what we need to know before
   changing any offer. The stalled ask cron only reaches recent sign ups; the
   win back carries it to everyone lapsed.
3. An offer, only if Justin wants one (medium). The honest offer is a free
   week back with the founding rate still held, not a discount: a discount
   off £7.99 for life undercuts the founders who pay it. Hold this until the
   poll has answers, so the offer answers the reason people give.

Nothing claims a place is running out faster than it is: the count is real
and 50 are left, so the copy says "still open", never "nearly gone".
