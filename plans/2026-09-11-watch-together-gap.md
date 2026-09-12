# The content estate, counted

Justin, 11 September 2026, twice, with the Watch together tab showing "Nothing
written for this stage yet": is it true we have no lessons for this stage, and
can we build them with the same skill, scripts plus Higgsfield images, for both
parent and child, and convert the school curriculum into the same format.

**The premise is half right, and the half that is wrong is the good half.**
His child has 26 lessons for that stage. That is the "Lessons 26" on the same
screen. What is missing is only the parent facing film.

But counting the whole estate to answer him turned up one real hole, and cost me
a wrong claim I have corrected below.

## What actually exists, counted 11 September 2026

| set | rows | covers | state |
|---|---|---|---|
| child lessons (`lessons`) | 147 rows, **92 live child lessons** | all five stages, nine strands | complete, every one decked and sendable |
| AI lessons (`ai_lessons`) | 54 | ages 7, 9, 11, 13, 16 plus parent and teacher | all play, nothing wrong |
| school lessons (`schools.school_lessons`) | 25 | EYFS to KS5 | all have slides, **24 of 25 have no video beats** |
| parent films (`parent_lessons`) | 10 | **stage 1 only** | four segments each, all filmed |

So 236 written lessons exist across four separate sets, and ten of them are
films.

### Hole one, withdrawn. There is no gap.

**Second correction, 12 September 2026.** I said 55 lessons could not reach a
child. Before that I said 55 would not play at all. Both were wrong, and both
came from the same mistake: reading the `lessons` table without the filters the
app puts on it.

Read with the filters, the table says this:

| status | audience | rows | decked | who sees it |
|---|---|---|---|---|
| live | parent | 102 | 92 | the parent list |
| stub | teacher | 44 | 0 | **nobody**, filtered twice |
| live | teacher | 1 | 0 | nobody, filtered by audience |

The parent list query is `.eq('audience', 'parent').neq('status', 'stub')`.

So the 44 rows I counted as a missing deck per strand are deliberate teacher
stubs. They are placeholders for a version that does not exist yet, they are
excluded by both filters, and nothing references them: zero completions, zero
kid missions. They were never meant to have a deck.

Of the ten live parent lessons without a deck, every one has no strand and a
title written to the grown up:

- Setting the bedroom rule before it is hard
- Talking about strangers online without frightening them
- What to do before you hand over a screen
- Reading the mood signal before it becomes a pattern
- Understanding the algorithm together
- Keeping the door open when something goes wrong
- Talking about digital footprint without a lecture

Those are parent coaching pieces. They play for the parent on the generated
deck and they should never be sent to a child. Correctly undecked.

**So the child curriculum is complete: 92 lessons, every one decked, every one
sendable.** Nothing to write.

### The one loose thread, and it is small

One row is `status = 'live'` with `audience = 'teacher'`, where the other 44
teacher rows are `stub`. The audience filter hides it from parents either way,
so nothing is broken. It is an inconsistency worth a glance, not a job.

### Hole two, withdrawn

The AI curriculum claim is gone. 54 rows, every one plays, because the module
page falls back the same way. Nothing to do.

### Hole three: the school lessons are still one field away from being films

This one stands, and it is now the only real finding in this file. All 25 school
lessons have slides, a parent note, and a `home_code` tying each to the home
curriculum. They also have `video_beats`, exactly what the `lesson-video` skill
consumes, and it is **empty on 24 of 25**. Only `ks3-12-misinfo-deepfakes` has
beats, which is why that one is the taster.

## So the answer to what he asked

His child has 26 lessons for that stage and every child lesson in the product is
complete. The only thing genuinely missing is the parent facing film above
stage 1, which is where this file started.

1. **Fill `video_beats` on the 24 school lessons** and let the video skill run.
   The `home_code` mapping means each lands as both a school module and a home
   lesson without the content being written twice.
2. **Then the parent films for stages 2 to 5.** Ten per stage, forty to make,
   the only genuinely new authoring on the list. Each stage is the same ten
   strands with the situation changed rather than the vocabulary: a talking toy
   at four, a chatbot that says it is your friend at fourteen.

Two AI films per stage from stage 3 up rather than one, because exactly one AI
safety film exists in the product today (1.9, "Some voices are not people") and
it is written for a five year old.

## A note for whoever reads this next

Two wrong findings in this file came from counting rows in a table and calling
the gap a bug. Both times the app was already filtering those rows out on
purpose. Before reporting anything as missing from a table, read the query the
product actually runs against it. A count is not a finding.

## Who does what

The `lesson-video` skill session owns anything that produces an MP4: the beats,
the Higgsfield image sets, the captions, the stitch. It made the existing ten,
so the look is settled and that part is a production run rather than a design
problem.

Everything above it is database content in the same shapes that already exist,
so it does not need the video skill and can run in parallel without touching
the same files.

## What does not need changing

The Watch together fallback is already correct. It shows everything rather than
a dead end and it says why. The only honest improvement is telling the parent
the films for their child's age are being made, which is a line of copy for the
look and feel pass.
