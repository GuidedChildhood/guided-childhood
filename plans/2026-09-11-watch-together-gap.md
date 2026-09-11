# The film library stops at stage 1

Justin, 11 September 2026, with the Watch together tab showing "Nothing written
for this stage yet": if that is true we need the same style of film "for every
age, a version condensed for the school curriculum, for children and parents, to
get them AI and social media safe from 4 to 16."

It is true. Here is exactly how true, counted against the live database on
11 September 2026.

## What exists

| | |
|---|---|
| Parent films (`parent_lessons`) | **10 lessons, all stage 1**, four segments each, every one filmed |
| Stages 2, 3, 4 and 5 | **zero films** |
| Written child curriculum (`lessons`) | **147 lessons across all five stages**, 9 strands each |

So the writing is done and the filming is not. Every child above the age of
seven opens Watch together and is handed the four to seven films with an
apology. That is what the blue box on Justin's screen is.

The ten that exist, one per strand:

| code | title | strand |
|---|---|---|
| 1.1 | Me on a screen and me in real life | Self image and identity |
| 1.2 | Kind words on screens | Online relationships and bullying |
| 1.3 | The internet remembers | Online reputation |
| 1.4 | When screens make you sad | Health, wellbeing and lifestyle |
| 1.5 | Real or pretend? | Managing online information |
| 1.6 | Screens, sleep and growing bodies | Health, wellbeing and lifestyle |
| 1.7 | My privacy shield | Privacy and security |
| 1.8 | Someone made that | Copyright and ownership |
| 1.9 | Some voices are not people | **AI safety** |
| 1.10 | The Yes No Button | Online relationships and consent |

One AI safety film exists in the whole product, and it is written for a five
year old. Nothing above it. For a platform whose thesis is preparing children
for an AI world, that is the gap that matters most.

## The shape of the work

Ten per stage, five stages, is fifty films. Ten exist, so **forty to make.**

The ten strand set above is the right spine, because it is one film per strand
and a parent can see the whole year in one screen. Each stage gets its own
version of the same ten, not a harder edit of the stage 1 script: what changes
is the situation, not the vocabulary. "Some voices are not people" at 4 to 7 is
a talking toy. At 13 to 16 it is a chatbot that says it is your friend, an AI
girlfriend app, and a deepfake of someone in your year.

The AI strand should carry two films per stage from stage 3 up, not one. That
takes it to forty five to make. It is the strand parents are most frightened of
and the one where the curriculum is thinnest.

## Who makes them

The `lesson-video` skill, in the session that already holds it. It takes a
script from `content/lesson-scripts`, generates the illustrated beats in the
house style, animates the squad pop ins, burns captions and stitches one MP4.
That pipeline made the ten that exist, so the look is already settled and this
is a production run rather than a design problem.

What that session needs from this one, and it is all in the database already:

1. The 147 written child lessons per stage are the source. The film is the
   condensed version of the stage's strand, not a new curriculum.
2. `parent_lessons` rows 1.1 to 1.10 are the template: four segments, the
   pause and quiz cards in `parent_lesson_cards`, the poster, the catchphrase,
   the misconception, the parent note. A new stage means new rows in the same
   shape with a new `stage_id`, so nothing in the player changes.
3. The stage 1 scripts are the tone reference for length and pacing.

## What to do about it before then

Nothing in the app needs changing. The fallback already does the right thing:
it shows everything rather than a dead end, and it says why. The only honest
improvement is to stop calling it a fallback to the parent and say plainly that
the films for their child's age are being made, which is true.

That is a copy change, so it can ride with the parent UX pass rather than
becoming its own piece of work.
