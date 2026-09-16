# Stage 2 co watch films, ages 8 to 10

Five scripts for the Watch together tab, the Stage 2 successors to the ten Stage 1
films that have been live since July 2026.

Justin, 16 September 2026, after finding "Nothing written for this stage yet" on his
13 to 15 year old: offered forty films to cover every stage or an honest reframe, he
chose to make the Stage 2 ones, where a parent and child still watch together, and to
stop calling it a missing film above that.

## The five

| Code | Title | Keyword | The mechanism it hands over |
| --- | --- | --- | --- |
| 2.1 | What we keep private online | JIGSAW | Pieces are asked for one at a time, on different days, because nobody would hand over all three at once |
| 2.2 | Spot the trick | TELL | A trick has to rush you, because a person with time to think does not fall for it |
| 2.3 | Screens and sleep | LANDING | The brain believes light over the clock, and a tired brain against a designed pull is not a fair fight |
| 2.4 | Why stopping feels hard, and how to win at it | ENDING | Stopping is hard by design, built that way by people who are good at their jobs, so it is not a flaw in the child |
| 2.5 | Mean messages | AUDIENCE | A nasty message is aimed at the audience, not the person, so the third door goes to the person |

Every title is a real Stage 2 lesson in the `lessons` table, per the syllabus rule in
`content/graduation/graduation-films-system.md`: a film may only teach what that stage
actually teaches.

**One substitution, flagged.** The films system doc names the fifth Stage 2 film as
"What social media really is". That is not a Stage 2 lesson in the database and social
media is a 13 plus strand here, so 2.5 is "Mean messages" instead, which is a real
Stage 2 lesson and is the thing that actually happens at 8 to 10. Waiting on Justin if
he wants a different fifth.

## The shape

Each script matches the shipped Stage 1 format exactly, because the platform player
expects it: three segments split at the two ◆ marks, with the interactive slides
slotted between them, nine beats, two pause beats each carrying an older child
variant, a What would DiGi do quiz with one seeded misconception, and a NARRATION TEXT
FOR TTS section that is what actually gets recorded.

Measured against the real thing rather than guessed: lesson 1.7 runs 292 seconds and
1.10's recorded narration is 637 words, so Mabel reads at 131 words a minute. Stage 2
is budgeted at about 820 words, a genuine step up to roughly six and a quarter minutes
without becoming an evening's commitment.

## What is different about Stage 2

The co watch structure stays, because that is the part the evidence supports. The
register underneath it changes. A nine year old switches off if spoken to like a five
year old, and more importantly they are ready for the MECHANISM: not "do not do that"
but "here is how the thing is built, and now you can see it coming". That is what
turns being warned into feeling clever, and it is the line every one of these five
scripts is built on.

They also assume a child who has already met the real internet. A group chat, a game
with a shop in it, a rabbit hole. Stage 1 could be written for a child who had not.

## Not yet produced

These are scripts. Nothing has been rendered. The Stage 1 pipeline is Higgsfield for
the illustration and voice, ffmpeg for the assembly, the files on the CloudFront CDN,
and rows in `parent_lessons` plus `parent_lesson_segments` (see
`content/packs/2026-09-01-lesson-video-rerender/production.md`). Roughly 25 minutes of
finished animation for the five.
