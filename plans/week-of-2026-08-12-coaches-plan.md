# Private tutor phase 2: the coaches, and leaving with a plan

## Where this came from

Justin, 11 August 2026, pointing at Good Inside: named specialists you pick by
problem, a face, a chip saying what each one helps with. Their real coaches cost
195 dollars for forty minutes.

And his own framing, which is the better one, from the same conversation about
Eton and Clifton: what those schools actually sell is not teaching, it is the
**tutor system**. A person who knows the child, meets them weekly, and tracks the
whole child rather than the grades. Every child gets what a Clifton parent pays
for.

Phase 1 shipped on 11 August: homework in, matched lesson out, onto the child's
phone. This is the next phase.

---

## The decision that shapes it, taken up front

**We do not build AI personas of five real, named, identifiable people currently
working for a competitor.** That is passing off and a personality rights problem,
and a child safety brand cannot take it. It is also unnecessary: the format is
available without the people.

So the coaches are ours. Named, drawn, given a specialism and a plain sentence
about what they help with.

---

## The half that is actually worth building

Good Inside's flow is three steps: pick a coach, have the session, leave with a
plan. **The third step is the one an AI can do better than a human, and the one
we are uniquely set up for.**

Their coach cannot put a job on a child's phone at the end of a call. We can.

Every component already exists:

| Piece | What it is | Where |
| --- | --- | --- |
| The words | scripts | `scripts` table, 312 of them |
| The next steps | quests | `family_quests`, already pushes to the phone |
| The thing you share | the family agreement | `family_agreements` |
| Keeping it | the save flow | docs/08 |
| The lesson | the tutor deck | `tutor_lessons`, migration 188 |

**What is missing is the assembly.** A DiGi conversation currently ends as a
conversation. It should end as a plan with a name on it: two or three concrete
steps, the script for the hard bit, and a job on the child's phone if one helps.

That is the build. The coaches are the front door; the plan is the product.

---

## Shape

1. **A coach registry**, same pattern as `lib/content/stage-characters.ts` and
   `lib/pathway/planets.ts`: key, name, specialism, the one line, the art. One
   file, so renaming or re-pointing art is one edit.

2. **Pick by problem, not by person.** A parent does not know which coach they
   need, they know what happened last night. So the entry is the concern, and
   the coach is what the concern maps to. The concern slugs already exist and
   the pathway already maps them to stage actions.

   **And the way in is a button INSIDE DiGi, not a directory page.** Justin, 12
   August 2026, approving this: "we will eventually have it as a button, like a
   help button. Where school work is mentioned in DiGi it says need help with
   school work, pick a coach, for example."

   That is the better design and it changes the build. A coaches page is a place
   a parent has to decide to visit, which means it gets visited once out of
   curiosity and then never. A button that appears in the reply, at the moment
   they have just typed the problem in their own words, needs no decision at all:
   the parent has already told us what is wrong, so we already know which coach.

   It also solves the "do not become a second DiGi" risk in the note below by
   construction. The coach cannot be a parallel conversation with its own
   history if it is offered from inside the only conversation there is.

   Mechanically this is lane detection, which already exists: `app/api/digi`
   classifies a message into a lane and records lane misses. The coach offer is
   one more thing a lane can carry, so a school work lane offers the school work
   coach and a sleep lane offers a different one. No new classifier.

3. **The session is a DiGi conversation with a coach's system prompt.** Not a new
   model, not a new safety layer: `callDigi` with the `DIGI_MODEL` ladder and the
   existing lane rules, plus the coach's specialism as context. Same
   never allow or deny rule, same calibrated pathway.

4. **It ends with a plan, saved.** A new `family_plans` row: the concern, the
   coach, two or three steps, the script chosen, the quest sent. Printable, and
   it appears on the pathway as something the family did.

5. **The plan is the thing that gets followed up.** A week later DiGi asks how it
   went, and that answer feeds `checkin_shifts` (migration 190) like everything
   else, so the brain learns which plans actually move a rating.

6. **The weekly email can carry more than one service.** Justin: "on emails
   weekly we can add more than one service on some emails."

   Worth stating the constraint that governs it, because it is the exact fault
   we fixed on 12 August: the floor is now per ADDRESS, not per programme
   (`lib/email/address-guard.ts`, migration 189). So putting the coaches into a
   weekly email must mean a SECOND SECTION of the email that already goes, never
   a second email. Two programmes each correctly sending one is how five parents
   got two emails 1.1 seconds apart.

---

## What I would watch

**A coach is a promise.** The moment we put a face and a specialism on screen, a
parent expects expertise. The copy has to be honest that this is DiGi with a
specialism, not a human therapist, and it has to say so without deflating the
thing. The existing DiGi voice rules already do most of this work.

**Do not let it become a second DiGi.** There is one chat in this product and it
is good. If the coaches become a parallel chat with its own history, its own
context and its own memory, we have two DiGis that disagree. The coach should be
a lens on the same conversation, not a different one.

**Phases 3 and 4 are still ahead**, and phase 4 is the bigger commercial gap:
there is no curriculum data above Year 6, so nothing school related works for a
child over 11.

---

## Not started

This file is the plan, written before building per CLAUDE.md. Nothing in the
repo has changed for phase 2 yet.
