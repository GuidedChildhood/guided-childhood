# Lessons for the youngest: the parent's app leads, the child's app is optional

Justin, 15 September 2026: *"the lessons for younger ages cannot be on the app
as they probably will not have an app, and younger cannot read, so it needs to
be co watched on the parent's app. We need to make sure, although an override to
add the app so it can be added on an iPad for example to co use, so we could
build that in."*

Decided the same day, in three answers:

1. A passed lesson counts for the day's learning step whichever face today wore.
   **Built and shipped** in this PR.
2. A lesson done together on the parent's device **should** tick the child's five
   a day. Not built yet, and the reason is below.
3. Under about eight the parent's app is the home for lessons, and the child's
   app is an **optional add on** for a shared iPad, with an override to install it.

## Why point 2 is not a one line change

The child's day is ticked by `markStepQuietly` inside
`app/api/kid/lesson-complete/route.ts`, which is the CHILD's route and is
authenticated by the child's link token. It knows exactly which child sat the
lesson.

The parent's route writes `lesson_completions` with `child_id = null`, a
household row. That is deliberate and the passport reads it on purpose
(`lib/stickers/book.ts`, `lessonsFor`: *"this child's rows plus the household
rows with no child on them, so a lesson a parent led with the child beside them
counts"*).

So a parent led lesson has **no child on it**. There is nothing to tick a day
for. Making it tick means the parent's lesson player has to know WHICH child it
was done with, which is a real question with a real answer a parent must give,
not something to infer.

## The shape, when it is built

**One question at the end of a parent led lesson.** "Who did this with you?"
with the family's children as chips and a Nobody option. The answer writes
`child_id` on the completion row and ticks that child's learning step through
the same `markStepQuietly` the child's route uses, so there is one path and not
two.

That single question also fixes the household row's other weakness: today a
parent with three children gets one row that counts for all three.

**The age line.** Under eight, the parent's Lessons screen leads with a
*co watch* framing: read it together, big type, the questions asked out loud by
the grown up. The child's own app is not required, and setup stops implying it.

**The override.** A parent may still install the child's app on a shared iPad.
That is the existing QR hand over on the Quests Share tab, unchanged; what
changes is that it stops being presented as the only way in for a four year old.

## Not decided yet, and worth Justin's call before building

- Whether a co watched lesson should also earn the child's stars, or only tick
  the day. Stars are earned, and a lesson a grown up mostly read is a different
  kind of earning.
- Whether the "who did this with you" question appears for every parent or only
  for families with a child under eight.

## Guard, when built

The pair rule shipped today is protected by `scripts/check-learning-step.mjs`,
which runs the real `stepForToday`. The co watch write will need its own: a
parent led completion with a named child must tick that child's day, and a
completion with no child named must not tick anybody's.
