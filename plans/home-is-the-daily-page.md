# Home is the daily page. The pathway is the record.

Justin, 12 August 2026, after finding the school chest on the wrong page and
then scrolling the pathway properly for the first time in a while:

> "so this is what sort of clever bit was missing from today to do on main
> screen and we put on pathway in error, so all of these were intended for home
> page rotation and jobs chest that pop up or planet friend next to the green to
> do today list, so it rotates them all, they are all tidy, and upside home page
> keeping them on a trail, so we need to somehow make clean on homepage including
> the update Teo page how he has been doing."

And then, plainly:

> "lets rework these tidy all into the 5 a day next to green and updates to lead
> a to do every day that works."

---

## The finding, in one line

**The pathway page has become where the good daily material lives, and almost
nobody goes there daily.**

It is not that the pathway is bad. Every block on it is genuinely useful. The
problem is that they are all on the page a parent opens occasionally, while Home
is the page they open every day, and Home currently leads with a five step loop
and then a row of coins.

Justin proved it twice in one afternoon, first by hunting for the school chest
and reporting it missing while looking straight at it, and then by scrolling the
pathway and finding half a product he had forgotten was there.

## What is actually on the pathway that belongs in the daily loop

Taken from his screenshots, in the order they appear:

| Block | What it says today | Why it is daily material |
| --- | --- | --- |
| **Your focus** | "TV or screen turned off, getting better" plus "the words for tonight" | This is a live reading and a next action in one line. It is the single best thing on that page. |
| **Set up every device** | "2 of 4 set. Next: iPad." | A real countable next step with an end. |
| **Work through what comes up** | "1 to work through, starting with tv or screen turned off." | The concern queue, which is the heart of the product. |
| **Teo's lessons** | "3 of 23 done. Next: Mean messages." | The child's own progress and the clearest "do this next" on the page. |
| **How far you have come** | Fifteen concerns and where each got to | The payoff. Not a daily action, but the thing that makes the daily action feel worth it. |
| **Not sure of your next step** | The DiGi door | Already duplicated elsewhere. Probably drops. |

Every one of those is a **countable state plus a next step**. That is exactly
the shape the daily loop already uses.

## The decision

**Home leads. The pathway becomes the record.**

Not a copy of the pathway onto Home. A single rotating LEAD, chosen daily from
these live readings, sitting next to the green loop, in the coin and chest
language that is already there.

Concretely:

1. **One lead a day**, picked by what is actually live, not by a dice roll.
   `lib/home/next-up.ts` already does exactly this job for a smaller set and its
   rotation logic (urgent items never rotate, the rest walk forward by day
   index) is the right engine. Extend that rather than write a second one.
2. **It looks like the coins.** Icon, a short line, one tap. The trail Justin
   means is the one the loop already draws, so the lead sits ON that trail as a
   sixth stop rather than as another card underneath it.
3. **The pathway keeps everything.** Nothing is deleted from it. It stops being
   the only way to reach any of it.

## The ordering, and why

The lead has to be chosen, and the order is the whole design:

1. **Something waiting on you today** (a concern with an unanswered check in).
   Never rotated past.
2. **Set up every device**, while any device is unset. It has an end, and a
   parent who finishes it never sees it again.
3. **The child's next lesson**, when one is due.
4. **Your focus**, the concern being worked on, with the words for tonight.
5. **The school chest**, which is where it belonged all along.
6. **How far you have come**, on a Sunday, because a summary is a weekend thing.

## Done in this pass

**The Teo update is now a table.** `HowFarYouHaveCome` was a stack of a dozen
identical fat cards, most of them SORTED, every one saying "on the list since
you raised it" under a bold heading. It is now one line per concern, label left,
movement middle, state right, with the sorted ones folded behind a count.

Two specific fixes worth keeping in mind for the rest of the rework:

- **Resolved used to sort FIRST**, so a family with a good record opened it to a
  wall of green before reaching anything they could act on. Live first now.
- **"8 out of 10 at the start, 9 now" became "8 to 9".** Out of ten is the scale
  the whole check in uses. It does not need restating fifteen times down one
  page, and the sentence was three times the width of the fact.

## Not done, and deliberately

The rotation itself. It is a real design job that wants a clear head and a
browser, not the end of a long session. Everything above is the decision so that
it starts from a shape rather than a blank page.
