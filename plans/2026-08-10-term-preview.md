# The term preview

Justin, 10 August 2026:

> "could we add a diary entry to give a preview note for term whats coming up
> and what the child could be learning? I need a way for this to be put onto
> platform but in the most useful meaningful way"

and on the shape, when asked: **"three subjects with one line each"**.

## What already exists, so this does not rebuild it

- `nextTermTarget()` in `lib/learning/term.ts` already works out which term and
  year group comes next, and already gets the awkward case right: a half term
  is not a new term, so it returns the term the child is already in rather than
  showing work months away.
- `buildYearView()` already reads `curriculum_objectives` and groups them.
- The child's homework page already shows "what is coming up" **in the holidays
  only**.

So the gap is narrow and worth naming precisely: **the parent never sees a
preview at all, and the child only sees one if they open the homework page
during a holiday.** The data has been there the whole time.

## The window: a holiday, and the first week back

Not "the last fortnight of term", which is what I first pitched. We hold no term
END dates, only whether a given day is a holiday, so a fortnight before the end
of term cannot be calculated without inventing a school calendar we do not have.

So it shows **during any school holiday, and for the first seven days back**.
That is the moment it is useful anyway: the question "what are they doing next
term" is a holiday question, and the first week back is when a parent wants to
recognise what the child comes home talking about.

Silent the rest of the year. A card that appears every day to say the same thing
is a card nobody reads by week three.

## Three subjects, one line each

The line for a subject is its **strand names for that term**, joined. Not an
objective, and not a paraphrase.

> **Maths** Fractions, measurement, and time
> **English** Reading comprehension, and writing composition
> **Science** States of matter

That is honest (the strands are what the class is actually taught), short enough
to read on a phone, and needs no summarising model in the loop that could get it
wrong. The quote never paraphrase rule that governs the rest of the curriculum
data holds here too: these are the Department's own strand names.

Under it, **one thing to try at home**, written per subject by hand. Not
generated. A curated line per subject is defensible and cheap; an invented
activity per objective is neither.

## Where it appears

1. **Parent, dashboard home.** `TermPreviewCard`, dismissible, in the same shape
   as `SchoolAheadCard` which already does exactly this job for school events.
   Dismissal is a display preference in localStorage keyed by term, so it lasts
   for this Easter and not for every Easter, matching what `SchoolAheadCard`
   settled on.
2. **Child, their own week.** One diary entry in their words, on the same card
   they already read: "Next term you will be doing fractions." Derived, not
   stored, so there is no row to clean up and nothing to go stale.
3. **DiGi.** The preview joins the learning context in
   `lib/learning/digi-context.ts` during the window, so "what will she be doing
   next term" is answered from the curriculum rather than generally.

## No migration

Everything is derived from `curriculum_objectives`, which is already seeded, plus
the child's birthday. Justin asked for the SQL if there was any: **there is
none.**

## Rules

- No dashes in any copy.
- Says "the class", never "your child". We know what a Year 4 in England is
  taught. We do not know what this child has understood, and the sentence has to
  be honest about which of the two it is. Same rule `yearBlurb` already follows.
- Nothing about performance, because we hold none.
