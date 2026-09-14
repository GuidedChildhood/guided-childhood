# The deal is the root: where the family agreement lives in the loop

Justin, 14 September 2026, from the Monday walkthrough, two screenshots of
Andy's Foundation passport (Timer days 0, "the device timer has not been used
this week"):

> Note here on passport Andy prob won't use timer at this age. Can we also see
> where best to add in family agreement as this determines how jobs, device
> time is all agreed and passports and device all stem from that, and we need
> to agree, to remind, maybe print, appears on child phone, discuss it when
> building, and it's in line with science and data. Please build this into
> best loop placement so all works throughout daily tasks, passport etc.

## What is true today

The agreement already exists on six surfaces, each built on its own day:

| Surface | What it does | Gap |
|---|---|---|
| Setup | Removed on 18 August (it put parents off) | Right call, keep |
| Quests page | `AgreementOffer` after the first job, snoozable a week | Only on that page |
| Today road | Weekly "The deal" review rung, only for a SIGNED agreement | Nothing asks a family to MAKE one |
| Builder | Type per stage, clauses with a science why, sign, review date, print | No prompt to actually talk it through |
| Child phone | "Our family deal" lists the promises and says agreed | The child cannot agree from their side |
| Ask and yes (PR 1073) | Both cards say the two lines the ask is about | Done today |
| Passport | Nothing about the deal at all | And "Timer days" nags at 4 to 7 |

So the deal is talked about in five places and rooted in none. This plan
gives it one root reading (signed, agreed on, review due) and puts that
reading on the road, the passport and the child's phone.

## The build

1. **Passport, age aware.** `readPassportChild` reads the agreement row and
   says whether the parent runs the timer (age 4 to 7). At that age the
   fourth cell is "Deal" (✓ or ·) instead of "Timer days", and the timer
   nudge does not show: the timer is the parent's at that age, so a zero
   against the child's name was a score for a thing they cannot do. Every
   age gets a deal line under the cells: no deal yet (make it together),
   started but unsigned (finish it), review due (sit down together), or
   agreed with the print link. DiGi's family state line drops the timer
   clause at 4 to 7 for the same reason.
2. **The road.** Once a family has a job and no signed deal, a "Make the
   deal" rung appears in the agreement slot (after the moment, before the
   script). It is a recommendation, never the lead, so nothing is blocked.
   When the review date has passed and the deal was not touched since, the
   weekly rung reads "Review the deal" and is not done.
3. **The child agrees on their phone.** A new kid route, token scoped like
   every other, sets `signed_by_child` on the family's agreement and stamps
   `agreed_date` if the parent has already signed. "Our family deal" gets an
   "I agree" button when the promises are there and the child has not yet
   agreed, then the same green line the parent sees.
4. **Talk it through while building.** Every clause gains a `talk` line, one
   question to ask the child at the table, shown under the options once the
   clause is in. The science why stays on the clause head where it was.
5. **Guard** `scripts/check-deal-in-the-loop.mjs`, mutation tested, wired.

No migration: `signed_by_child`, `agreed_date` and `review_date` exist.

Mobbin: Liven's "let's make a contract" (the commitments as a short list, a
signature, a stamp) and Me+'s contract sign screen. Our version is the
child's tap, in their own app, in butter and ink.

## Not in this plan

A signature drawn with a finger (a tap is honest enough at this age and the
print already carries the names). Per child agreements (one per family by
design). Push reminders for the review date (the road rung is the reminder).
