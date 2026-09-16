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

## The panel, copied from the pattern

Justin, 16 September 2026, with a screenshot of Meta's "You're following best
practices" panel: like this, that auto ticks as they go.

That is the right reference and the anatomy is worth copying exactly:

- A green filled circle with a white tick, one per row.
- A **bold claim in the past tense**, stating the thing as done. Not "print
  the pack" but "Your pack is printed".
- A **grey line underneath saying why it matters**, one sentence. This is the
  half people skip and it is why the panel feels like help rather than
  nagging.
- A heading that is a verdict about the teacher, not a title. "You are ready
  to teach this."
- A quiet link at the foot to the fuller thing, which for us is the run sheet.

**Why that panel works, and the rule it sets for us.** Every row in it is
machine checked. Meta never asks you to confirm anything, so nothing on it
can be wrong, and a person reads six green ticks and believes them. The
moment one row needs a human to tap it, the whole panel becomes a form, and a
green tick stops being evidence. So the rule this sets: **a green tick is only
ever awarded for something the product can see for itself.**

## What the product can actually see

Which is more than the first draft of this plan assumed. Two signals were
missing:

- **Printing is observable.** `window.addEventListener('beforeprint')` fires
  for the print button and for a browser print from the keyboard alike, so
  "printed" is a real signal rather than a guess from a page visit. The
  packs, the record and the quizzes each have their own route, so each one
  ticks its own row.
- **Finishing is observable.** The player already holds a `finished` state,
  so "you taught it" needs no new concept, only a write when it flips.

That takes the auto rows from four to seven of nine.

**Ticks itself, every one in the past tense:**

1. **You have read the lesson.** The prep page opened. *Knowing the misconceptions before the room says them is the difference between a lesson and a reading.*
2. **You have looked back.** The lesson before this one opened, or already taught. *This starter recalls it, so the class is warmer when you begin.*
3. **The pack is printed.** `beforeprint` on the pack route. *One photocopy run and the whole lesson can be taught with no screen.*
4. **The learning record is printed.** Only where the lesson has `i can` statements. *The assessment is the conversation about the gap.*
5. **The board is ready.** The player opened. *Open it before they come in, not while thirty children watch you type.*
6. **You taught it.** The player reached the finish. *Recorded here, with the date, for your own record.*
7. **The class filled the passport page.** Already written by the passport beat. *The page fills at school and at home, and this screen keeps its own count.*

**Yours, because we cannot see them.** Kept in a separate block under a
different heading, with outlined circles rather than filled green ticks, and
worded as a reminder rather than a judgement:

8. **Brief the safeguarding lead.** Flagged modules only. *So they know why a child may come to them this week.*
9. **Parent notes into book bags.** *The home code travels on that note, which is the whole bridge to home.*

Tapping those two turns them green, and the panel says in one line that these
two are a teacher's word rather than the product's. That is the honest
version of the pattern, and it is better than pretending.

## The green tick is computed, never a button

No "mark this lesson done" control. The big tick appears when every row that
applies is green, and it goes if one is untasked. A tick a teacher can award
themselves proves nothing to a subject lead, which is the reason it exists.

Three states, matching the pattern: the rows as they fill, a ring reading
"5 of 9", and the green tick with the date.

**Rows that are not yet true are shown, not hidden.** This is the one place
to depart from Meta, which simply omits what you have not done. A teacher
needs the list of what is left, so a row that is not yet true sits in grey
with its circle empty and stays in its running order.

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
And the rule the pattern sets: **every row in the green ticked block has a
machine signal behind it**, so a row can never be moved from the teacher's
block into the automatic one without a real detector to back it.
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


## Built, 16 September 2026

Justin: build it, roll up at `/hub/tracker`. All four pushes shipped.

| | Built | Where |
|---|---|---|
| 1 | The memory and the step model | `shared/schools-progress.ts` |
| 2 | The four detectors | `schools/components/tracker/signals.tsx`, `TrackedPlayer.tsx` |
| 3 | The panel, on the run sheet and the prep page | `schools/components/tracker/TrackerPanel.tsx` |
| 4 | The roll up and the coverage print | `schools/app/hub/tracker/` |

Three things changed from the plan while building, each for a reason:

- **The run sheet's own tick boxes stayed printable squares.** The plan's
  table said they would become live controls, and then the Meta section
  established that a tick is only awarded for a machine signal. Making the
  body boxes live would have put the same fact in two interactive places and
  let a teacher award themselves five of the seven automatic rows. The panel
  is the working checklist; the squares are the clipboard.
- **The player gained an `onFinish` prop.** It passes `completeEndpoint` null
  for schools and returned early, so nothing at all was observable. `onFinish`
  fires before that return, the parents app does not pass it, and a thin
  wrapper in the schools app does the knowing so the player never learns what
  a tracker is.
- **`dslRequired` comes from the manifest, not the row.** `FLAGGED_MODULES`
  already carries it, so the roll up needs one query for `i can` rather than
  one per lesson.

## Still open

- The staffroom, which is when these same rows get accounts behind them and
  become a real record rather than a screen's memory. After the first pilot
  signs, as before.
