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
| child lessons (`lessons`) | 147 | all five stages, nine strands | all play for a parent, **55 can never be sent to the child** |
| AI lessons (`ai_lessons`) | 54 | ages 7, 9, 11, 13, 16 plus parent and teacher | all play, nothing wrong |
| school lessons (`schools.school_lessons`) | 25 | EYFS to KS5 | all have slides, **24 of 25 have no video beats** |
| parent films (`parent_lessons`) | 10 | **stage 1 only** | four segments each, all filmed |

So 236 written lessons exist across four separate sets, and ten of them are
films.

### Hole one: 55 lessons a parent can read and a child can never be sent

**Correction, 12 September 2026.** An earlier version of this file said 55 child
lessons and all 54 AI lessons "will not play". That was wrong, and the mistake
was reading the database without reading the code that consumes it.

Both parent facing lesson pages fall back on purpose: when `slides` is null,
`autoSlidesFromLesson` builds a deck out of the lesson's own four text fields
and a generated check question. So **every lesson plays for a parent**, and the
AI module is fine exactly as it is. That part of the plan is withdrawn.

What is real is narrower and worse.

The child's own app takes the authored deck and nothing else:

```
// app/k/[token]/lessons/[lessonId]/page.tsx
const rawSlides = parseSlides(lesson.slides)
if (!rawSlides) notFound()
```

and the parent's Send button is gated on the same thing:

```
// app/(dashboard)/dashboard/lessons/[id]/page.tsx
const sendable = !!child && !!parseSlides(lesson.slides) && ...
```

Both are deliberate and the comments say so: the generated deck is written to a
grown up, so a child must never land on one. Correct call.

The consequence is that **a lesson with no authored deck can be read by a parent
and can never reach the child.** There are 55 of them.

### The pattern is exact, which says what happened

Nine strands per stage, two lessons in each strand, and in every single pair one
has a deck and one does not.

| stage | strands with a pair | pairs missing a deck | plus untagged | total |
|---|---|---|---|---|
| foundation | 9 | 9 | 2 | 11 |
| explorer | 8 | 8 | 3 | 11 |
| builder | 9 | 9 | 2 | 11 |
| shaper | 9 | 9 | 2 | 11 |
| independent | 9 | 9 | 2 | 11 |

That regularity is not rows somebody parked. It is a second lesson per strand
that was written and never decked, on every stage, in the same shape. Five
stages, eleven each, 55 lessons that exist for the parent and are invisible to
the child.

### Hole two, withdrawn

The AI curriculum claim is gone. 54 rows, every one plays, because the module
page falls back the same way. Nothing to do.

### Hole three: the school lessons are still one field away from being films

This one stands. All 25 school lessons have slides, a parent note, and a
`home_code` tying each to the home curriculum. They also have `video_beats`,
exactly what the `lesson-video` skill consumes, and it is **empty on 24 of 25**.
Only `ks3-12-misinfo-deepfakes` has beats, which is why that one is the taster.

## So the answer to what he asked

Yes, and the order has changed now the AI claim is withdrawn. Two of these are
conversions and one is authoring.

1. **Deck the 55 second lessons.** They are written already. What they lack is
   the authored slide array, and that array is the only thing standing between a
   parent reading a lesson and being able to send it to their child. Biggest
   real gain, and the shape is the one 92 lessons already use.
2. **Fill `video_beats` on the 24 school lessons** and let the video skill run.
   The `home_code` mapping means each lands as both a school module and a home
   lesson without the content being written twice.
3. **Then the parent films for stages 2 to 5.** Ten per stage, forty to make,
   the only genuinely new authoring on the list. Each stage is the same ten
   strands with the situation changed rather than the vocabulary: a talking toy
   at four, a chatbot that says it is your friend at fourteen.

Two AI films per stage from stage 3 up rather than one, because exactly one AI
safety film exists in the product today (1.9, "Some voices are not people") and
it is written for a five year old.

**Before starting number one, answer one question:** was the second lesson in
each pair meant to be sent to the child at all, or is it deliberately a parent
only companion to the first? The uniformity makes either reading possible, and
writing 55 decks for lessons that were never meant to reach a child would be 55
lessons of wasted work. The pairs are visible in `lessons` by stage and strand,
so an hour reading four or five of them settles it.

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
