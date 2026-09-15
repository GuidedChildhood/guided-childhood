# Lessons for the youngest: the parent's app leads, the child's app is optional

Justin, 15 September 2026: *"the lessons for younger ages cannot be on the app
as they probably will not have an app, and younger cannot read, so it needs to
be co watched on the parent's app. We need to make sure, although an override to
add the app so it can be added on an iPad for example to co use, so we could
build that in."*

Decided the same day, in three answers:

1. A passed lesson counts for the day's learning step whichever face today wore.
   **Built and shipped** (#1087).
2. A lesson done together on the parent's device **should** tick the child's five
   a day. **Built**, 15 September, and smaller than this plan expected. See the
   correction below.
3. Under about eight the parent's app is the home for lessons, and the child's
   app is an **optional add on** for a shared iPad, with an override to install it.
   Still to do.

## Correction: this plan was out of date on its own central claim

Written before the code was read properly. What it says below about the parent's
route is **half wrong**, and the half that is wrong made the job look bigger
than it was.

`/api/lessons/complete` has accepted a `child_id` and scoped the completion to
that child since migration 213, on Justin's decision of 18 August: *"lessons are
child related not family."* And `MarkLessonDone`, the tick on the parent's
lesson page, already sends the open child.

What was actually missing was narrower, and it was two things:

- The **full lesson player** on that same page passed no `completeBody`, so
  playing a lesson through to the end wrote a household row while ticking the
  same lesson off with the checkbox recorded it against the child. Two paths on
  one screen disagreeing.
- **Neither** parent path ticked the child's five a day. The child's own route
  has done so since the lesson step was wired.

Both fixed on 15 September. The player now posts the child the page has already
resolved, and the route ticks that child's day through `markStepQuietly`, the
same function the child's own lesson uses.

## The question that is NOT asked, and why

This plan proposed *"Who did this with you?"* at the end of every parent led
lesson. **Justin's call, 15 September: do not build it.**

The app already knows. A parent opened that child to reach the lesson, and the
page uses it for the send button and the reading ahead notice. Asking at the end
would be asking for an answer we are already holding, and a tap for every parent
on every lesson to catch a case that is the exception. With no child open it
stays an honest household row, exactly as before, so nothing regresses.

## Stars: the same as any lesson

Also decided 15 September. A co watched lesson earns exactly what the child's
own lesson earns, not a reduced version.

The instinct to pay it less ("a lesson a grown up mostly read is a different
kind of earning") is wrong for the age this exists for. Under eight, co watching
is not a lesser way of doing a lesson, it is the **intended** way, so paying it
differently would punish precisely the children the design is for. It also comes
out right for free by routing through the same function, rather than a second
scoring path that is free to drift.

## What the ORIGINAL plan said, kept for the record

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

## Guards

The pair rule is protected by `scripts/check-learning-step.mjs`, which runs the
real `stepForToday`.

The co watch write is protected by `scripts/check-co-watch.mjs`: the parent's
player must name the child, a passed lesson with a child named must tick that
child's day, one with no child named must tick nobody's, and both routes must
tick through the one function so the two can never drift apart. Five mutations,
five caught.
