# The lesson tracker: a green tick a teacher can trust

Justin, 16 September 2026: a system that gives a big green tick for every
lesson, starting with the pilot. A checklist that walks a teacher through
running the lesson, step by step, tracking as they go, so that when it is
complete the teacher knows everything is done for that lesson.

## The short answer on where it lives

**The checklist already exists. It has no memory.** Three surfaces, and two of
them are already built:

| Surface | What it is today | What it becomes |
|---|---|---|
| `/lesson/[module]/run` | The run sheet. Before, during and after, in order, with tick boxes. Every step already derived from the lesson row. The boxes are `aria-hidden` squares for printing. | The working checklist. The boxes become real, remembered, 44px controls. |
| `/lesson/[module]` | The prep page. Answers "should I teach this". No state. | Carries the lesson's ring or green tick at the top, beside Teach this lesson. |
| `/hub/tracker` | Does not exist. | The roll up. Every lesson and its tick, the pilot's two first. |

So this is not a new system bolted on. It is memory added to the page a
teacher already runs the lesson from, plus one place to see it all.

## Why the run sheet and not a new page

The run sheet was built on exactly this shape (its own header comment cites
HelloFresh numbered steps and tickable sub steps). It already lists, derived
from the row and never hardcoded:

- Print the pack and photocopy per pupil
- Print the learning record, where the lesson has `i can` statements
- Read what children usually get wrong
- Tell your safeguarding lead, on flagged modules only
- Open the lesson on the board
- Then every phase, minute by minute, with the words to say
- Then the parent note home, the passport page, the learning record, the
  quiet word with the safeguarding lead

A second checklist page would be a second thing to keep in step with every
migration. The step list is right already. It just forgets.

## The steps, and which ones tick themselves

Ten steps, each one applicable only where the lesson row says so, so a
module with no safeguarding note never shows a safeguarding step and can
still reach a full tick.

**Before**

1. **Read the lesson.** Objective, misconceptions, what they need first. *Manual.*
2. **Look back.** What the last lesson left, and what this starter recalls. *Manual, and only where a previous module exists in the key stage.* This is the step Justin named that the run sheet does not have yet.
3. **Brief the safeguarding lead.** *Manual. Only on flagged modules.*
4. **Print and photocopy.** *Ticks itself when the print pack is opened.*
5. **Open it on the board.** *Ticks itself when the player is opened.*

**During**

6. **Teach it.** *Ticks itself when the player reaches the finish.*

**After**

7. **Fill the passport page.** *Already ticks itself.* The passport beat writes to the device memory that exists today.
8. **Parent notes into book bags.** The home code goes home with them. *Manual.*
9. **The learning record.** Each child colours the star they reached, you colour yours. *Manual. Only where the lesson has `i can` statements.*
10. **Log the coverage.** Class and date, for the subject lead's file. *Manual.* This is the "registration" step, and the section below is the important part of it.

**Four of the ten tick themselves.** That is the difference between a tracker
teachers use and a form they abandon. Never ask a teacher to tell the product
something the product already knows.

## The green tick is computed, never a button

No "mark this lesson done" control. The tick appears when every applicable
step is ticked, and it disappears if one is untasked. A tick a teacher can
award themselves is a tick that proves nothing to a subject lead, which is
the whole reason it exists.

Three states: not started, a ring reading "3 of 9", and the green tick.

## What "registration" can and cannot mean

This needs saying plainly, because it is the one place the ask and the
product's promise pull apart.

The schools app holds **no pupil data, no teacher accounts and no session**,
by design. The data processing agreement is written on that promise and the
whole split depends on it. So the tracker can record that a **lesson** was
delivered, by class name and date typed by the teacher, and it can never
record **who was in the room**. An attendance register is a different
product with a different legal footing.

That is not a workaround, it is the honest version, and it is worth saying to
a head in those words. When the staffroom arrives, which is after the first
pilot school signs, these same ten steps become the real record with accounts
behind them. The shape does not change, only where it is stored.

## Where the memory lives

`shared/schools-progress.ts`, a new file next to `shared/schools-taught.ts`
and following it exactly: `localStorage`, one key, a change event, read and
write helpers, every accessor wrapped so private mode cannot throw.

Shape: `{ [moduleId]: { [stepId]: isoDate } }`. The date, not a boolean, so
the coverage print can say when.

**One truth per fact.** The passport step is not stored twice. It reads
`schools-taught.ts`, which the player already writes. A second copy of the
same fact is the bug that arrives three weeks later.

**Said in words on every surface that shows it**, the way the passport hub
already does: this is this screen's memory, same browser, same laptop. It
names no child. Clearing the browser clears it. With a forget button, like
the passport one.

The honest cost: a teacher on a different laptop sees nothing, and a shared
classroom machine shows whoever used it last. Say so on the page rather than
let a teacher discover it. It is the correct trade until accounts exist.

## Scope it to the pilot first

A pilot school opens two lessons. `/hub/tracker` shows those two at the top
under "Your pilot", both achievable in a term, and the rest of the scheme
below as the full picture. A two item list that can reach two green ticks is
a pilot that feels finishable, and a finished pilot is the conversion
argument. `pilotModulesFor(phase)` already gives the two.

## The print twin

Both surfaces print, because the paper rule applies to guidance too:

- The run sheet prints with **empty** boxes, for the clipboard.
- The tracker prints as a **coverage sheet**: every lesson, its steps, the
  dates. That is the subject lead's file and the inspection evidence, and it
  is a selling point rather than a nicety.

## The guard

`scripts/check-lesson-tracker.mjs`: every step id is known and applicable by
a rule read from the lesson row rather than hardcoded; the tick is computed
from the steps and never stored as its own flag; no field anywhere can hold a
child's name; the passport step reads the existing memory rather than copying
it; every surface that shows the memory carries the words about what it is.
Mutation tested, as the last two guards were.

## Size and order

No migration. All of it is client state and existing content. Medium, and it
splits into four pushes that each stand alone:

1. `shared/schools-progress.ts` plus the step model derived from the row.
2. The run sheet's boxes become real.
3. The prep page ring and tick.
4. `/hub/tracker`, the pilot's two first, with the coverage print.

## What this plan does not do

- No accounts, no per child record, no attendance. That is the staffroom.
- No server state. Bridge b, the 29 August rule, still holds.
- No second checklist. The run sheet is the checklist.
