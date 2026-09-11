# The content estate, counted

Justin, 11 September 2026, twice, with the Watch together tab showing "Nothing
written for this stage yet": is it true we have no lessons for this stage, and
can we build them with the same skill, scripts plus Higgsfield images, for both
parent and child, and convert the school curriculum into the same format.

**The premise is half right, and the half that is wrong is the good half.**
His child has 26 lessons for that stage. That is the "Lessons 26" on the same
screen. What is missing is only the parent facing film.

But counting the whole estate to answer him turned up three bigger holes.

## What actually exists, counted 11 September 2026

| set | rows | covers | state |
|---|---|---|---|
| child lessons (`lessons`) | 147 | all five stages, nine strands | **only 92 playable** |
| AI lessons (`ai_lessons`) | 54 | ages 7, 9, 11, 13, 16 plus parent and teacher | **zero playable** |
| school lessons (`schools.school_lessons`) | 25 | EYFS to KS5 | all have slides, **24 of 25 have no video beats** |
| parent films (`parent_lessons`) | 10 | **stage 1 only** | four segments each, all filmed |

So 236 written lessons exist across four separate sets, and ten of them are
films.

### Hole one: a third of the child curriculum will not play

`lessons` has 147 rows and 92 of them have slides. The other 55 are titles with
no lesson behind them.

| stage | lessons | playable | missing |
|---|---|---|---|
| foundation | 26 | 15 | 11 |
| explorer | 27 | 16 | 11 |
| builder | 28 | 17 | 11 |
| independent | 26 | 15 | 11 |
| shaper | 40 | 29 | 11 |

Eleven per stage, every stage. That is a pattern, not a coincidence: something
wrote 147 rows and filled 92. Find out which eleven and why before writing a
single new word, because a set of rows that were deliberately parked is a
different problem from a job that stopped halfway.

### Hole two: the AI curriculum exists and cannot be opened

54 rows covering every age band we serve, plus a parent set and a teacher set.
**None of them have slides.** So the thing Justin is most worried about, getting
children AI safe from four to sixteen, is already written for every age, and a
parent cannot watch any of it.

This is the cheapest big win on the list. The content is done. What is missing
is the slide array, which is the same shape the 92 playable child lessons
already use.

### Hole three: the school lessons are one field away from being films

Every one of the 25 school lessons has slides, a parent note, and a `home_code`
tying it to the home curriculum. They also have a `video_beats` column, which
is exactly the input the `lesson-video` skill consumes.

**It is empty on 24 of the 25.** Only `ks3-12-misinfo-deepfakes` has beats, and
it has four.

So converting the school curriculum into parent and child films is not a
rewrite. The `home_code` already says which home lesson each school module maps
to. Fill `video_beats` and the pipeline that made the existing ten films runs.

## So the answer to what he asked

Yes, and the order matters, because three of these are conversions and only one
is authoring.

1. **Fill the 54 AI lessons' slides.** Already written for every age including
   parents. Pure format work, the biggest coverage gain per hour, and it lands
   on the strand he cares most about.
2. **Find the missing eleven per stage** in the child curriculum and decide
   whether they are parked or dropped. Do not write until that is known.
3. **Fill `video_beats` on the 24 school lessons** and let the video skill run.
   The `home_code` mapping means each one lands as both a school module and a
   home lesson without the content being written twice.
4. **Then the parent films for stages 2 to 5.** Ten per stage, forty to make,
   and this is the only one that is genuinely new authoring. Each stage is the
   same ten strands with the situation changed rather than the vocabulary: a
   talking toy at four, a chatbot that says it is your friend at fourteen.

Two AI films per stage from stage 3 up rather than one, because exactly one AI
safety film exists in the product today (1.9, "Some voices are not people") and
it is written for a five year old.

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
