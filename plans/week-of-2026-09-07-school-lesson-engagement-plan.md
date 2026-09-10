# The engagement cadence: 35 stretches where a class sits and watches

The lesson quality council scores engagement 6.96 out of 10: 80 of 115 stretches
are within the four minutes we set as the longest a child should sit without
doing anything. 35 are not.

"Fourteen modules of curriculum writing" was the shape I assumed. Measuring it
first says something better.

## What the 35 actually are

**Twenty of them are the same stretch, repeated.** Every module except
`eyfs-01` opens identically:

    title (1m) -> [video (1m)] -> objective (2m) -> keywords (2m) -> choice

That is five to seven minutes of a class watching before anything is asked of
them, and it is the first five to seven minutes of the hour, when a room is
deciding whether this lesson is a thing that happens to them or a thing they are
in.

`eyfs-01` is the exception. It opens with `star-breath` in a `connect` phase and
has no opening stretch at all.

**Fifteen are genuine mid lesson gaps**, and each needs its own answer:

| module | slides | minutes |
| --- | --- | --- |
| ks4-17-sextortion | 5 to 7 | 8 |
| ks2-08-kind-safe-online | 13 to 15 | 7 |
| ks3-14-bodies-image-pressure | 12 to 15 | 7 |
| ks5-20-ai-mastery-data-rights | 5 to 9 | 7 |
| ks5-21-digital-identity-future-work | 9 to 12 | 7 |
| eyfs-01-screens-kindness | 2 to 4 | 6 |
| ks2-05-gaming-time-spend | 9 to 11 | 6 |
| ks2-06-how-algorithms-work | 10 to 11 | 6 |
| ks3-11-social-workarounds | 5 to 8 | 6 |
| ks4-19-readiness-at-16 | 5 to 7 | 6 |
| ks2-05-gaming-time-spend | 5 to 6 | 5 |
| ks2-07-privacy-reputation | 6 to 7 | 5 |
| ks2-09-copyright-ownership | 13 to 14 | 5 |
| ks3-12-misinfo-deepfakes | 25 to 27 | 5 |
| ks3-13-scams-fraud-money | 15 to 16 | 5 |

## What the phase comments already say

`shared/lesson-slides.ts` already carries it, and the comment says why it exists:

> `connect` is the sixth and it is borrowed from Jigsaw, who put Connect us and
> Calm me before any content. Rosenshine has nothing to say about that because
> Rosenshine is about explicit instruction of academic material, and our subject
> is one where children are asked to talk about themselves. A class that has not
> settled cannot safely be asked whether anything frightening happened on a
> screen this week, so the settle is part of the teaching, not a warm up to it.

It was added at the front of the phase order deliberately without backfilling,
so nothing already written needed rewriting. One lesson has it. Twenty do not.

That framing pointed at the right problem and the wrong fix. A settle belongs at
the top of a lesson, and the top is exactly where an added beat does nothing for
the cadence. What the twenty need is a starter beat inside the opening block.
See Move 1.

## Move 1: every lesson asks something before it explains (20 modules, shipped)

One `discussion` slide per module, 2 minutes, pairs, 60 seconds on the timer.

**Where it goes, which is not where I first put it.** The obvious move is a beat
at the very top. Simulated against the council's own check that changes
NOTHING: the passive run is title plus objective plus keywords, and an action in
front of it only moves where the run starts. 6.96 to 6.96. The insert has to
land INSIDE the run.

Trying every position, one slot works for all twenty: **after the objective,
before the keywords.** The opening becomes title (and its video where there is
one) at one to two minutes, then the class talks, then objective and keywords at
four. Both sides inside the ceiling.

It is also the better lesson. The class names its own experience of the thing
before it is handed the vocabulary for it, so the keywords land on a room that
already has something at stake.

**Tagged `starter`, not `connect`.** `connect` is Jigsaw's Connect us and Calm
me and it belongs at the top of a lesson. This slot is not the top, and a
connect slide sitting third would put Connect after Recall on the phase strip
and march the marker backwards mid lesson. These are starter beats: activating
what a child already has, which is what a starter is for. `eyfs-01` keeps the
only genuine connect slide in the scheme.

So the honest version of "the connect phase was designed and never built" is
narrower than I first wrote it: the phase is right about `eyfs-01` and the other
twenty needed a starter beat, not a settle.

**Not the starter quiz.** Each module already has a four question
`starter_quiz` in `teacher_notes`, and putting one of its questions on the wall
was the cheaper option. It is the wrong one: the starter quiz is a printed
instrument a teacher marks to find out what prior knowledge is missing, and
projecting an answer next to a class about to be assessed on it spoils the
instrument to save writing twenty prompts.

**Safeguarding.** Every prompt is answerable with no prior knowledge, is about
the child's own week, and never asks anyone to disclose something that happened
to them. The three heaviest are worded hardest: `ks4-17` asks what makes
*anybody* in trouble stay silent, `ks3-14` asks about the *tools* an app has
rather than about any body, `ks4-16` asks who *should* decide rather than what
anyone has done.

**Result, measured on a real Postgres with the real scheme loaded:** engagement
6.96 to 8.89, prose held at 9.78, blocks 9.52 to 9.53. Migration 279.

## Move 2: fifteen bespoke beats

Each of the fifteen gaps gets one action slide placed inside the stretch, chosen
for what that stretch is teaching rather than to a formula. Mostly `discussion`
and `choice`; a `scenario` where the class needs raw material to look at.

The three safeguarding heavy stretches (`ks4-17-sextortion` slides 5 to 7,
`ks3-14-bodies-image-pressure` slides 12 to 15, `ks4-19-readiness-at-16`) get a
beat that asks the class to reason about the situation, never to disclose about
themselves. No "has this happened to you" in any form.

## Minutes

Every added slide adds time. Lessons currently run 38 to 66 minutes and nothing
in the product asserts a fixed length, so the totals move and the timing chips
move with them. The cycle map derives from minutes, so the cycles have to still
anchor after the change: that is a guard, not a hope.

## Guards on the migration

Every migration in this piece runs against a local Postgres seeded with the real
scheme before it goes near the live database, because this session has neither
`execute_sql` nor `apply_migration` permission and a migration nobody can run is
a migration nobody has checked.

279 carries six, all of which passed and all of which bite (re-running it fails
guard 2 and rolls back, leaving the slide count at 513 rather than 533):

1. Every module named in the plan exists.
2. The slide before each insert really is the objective, and the one after it
   really is the keywords, so a reordered deck fails loudly instead of landing
   the beat somewhere it makes no sense.
3. All twenty carry their beat, as a `discussion` in the `starter` phase.
4. Every new slide has a prompt, a `lookFor` and a script. A discussion with no
   `lookFor` is a minute of noise with nothing to listen for.
5. No dashes in any new copy.
6. The scheme is exactly 513 slides afterwards.

Outside the migration: `parseSlides` accepts all twenty (the same validator the
teach route uses), and the council is re-run against the migrated data rather
than against a simulation of it.

## Order

1. Move 1, the twenty starter beats. One shape, one migration, the biggest
   single win. **Done: migration 279, 6.96 to 8.89.**
2. Move 2, the fifteen bespoke beats.
3. Re-run the council and ratchet the engagement floor.
