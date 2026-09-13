# Every lesson animated, and the teacher carried start to finish

Justin, 13 September 2026: "make sure all lessons now flow, have enough
animations to make super engaging. That we have a product that is better than
Rosenshine and works instructing the teacher from start to finish."

Read as three promises, in the order a class meets them:

1. **A character carries every lesson.** The module's Planet Friend arrives,
   explains, pauses and hands over the mission, in every one of the 25
   lessons, not only the pilot.
2. **Better than Rosenshine** means the arc plus a guide. Our lessons already
   wear the Rosenshine phases openly (starter, teach, practise, prove, close,
   and the pass computed from real choice slides). What Rosenshine has nothing
   to say about is a room of children deciding whether this lesson is a thing
   that happens to them or a thing they are in. The friend on the wall is what
   decides that.
3. **The teacher never guesses what to do next.** Every beat tells them, in
   the script, what to say and what to hand out.

Migration **296** is claimed by this plan.

---

## 1. Where the 25 lessons actually stand (live database, 13 September)

| module | cast on the row | video beats | opens on | note |
| --- | --- | --- | --- | --- |
| eyfs-01 | Pebble with DiGi Junior | 0 | **Orbit** | no key on the title, heuristic picks the screen clip |
| ks1-02 | Pebble | 0 | Pebble | |
| ks1-03 | Pebble with DiGi Junior | 1 | Pebble | |
| ks2-04 | Bloop | 1 | Bloop | |
| ks2-05 | Bloop | 0 | Bloop | |
| ks2-06 | DiGi | 1 | **Bloop** | |
| ks2-07 | Bloop | 1 | Bloop | |
| ks2-08 | Bloop with Orbit | 0 | Bloop | |
| ks2-09 | Orbit | 0 | **Bloop** | |
| ks3-10 | Orbit with DiGi | 0 | Orbit | |
| ks3-11 | Orbit | 0 | Orbit | curriculum file says Nova was proposed, never decided |
| ks3-12 | Orbit | **6** | Orbit | the pilot, the bar |
| ks3-13 | Orbit | 0 | Orbit | curriculum file says Cosmo |
| ks3-14 | DiGi carries the calm register | 0 | **Orbit** | |
| ks4-15 | Nova | 0 | Nova | |
| ks4-16 | DiGi only | 0 | **Nova** | DSL module |
| ks4-17 | DiGi only, maximum calm | 0 | **Nova** | DSL module |
| ks4-18 | DiGi only | 0 | **Nova** | DSL module |
| ks4-19 | Nova with DiGi | 0 | Nova | |
| ks5-20 | DiGi with motion graphics | 0 | Cosmo | arguable, Cosmo is the KS5 friend |
| ks5-21 | DiGi with motion graphics | 0 | Cosmo | arguable |
| ks3-22 | Orbit asks, DiGi closes | 0 | **Nova** | |
| ks2-23 | Bloop asks, DiGi closes | 0 | **coin flip** | key `bloop` is unknown to the intro map |
| ks3-24 | Orbit opens, DiGi closes | 0 | **coin flip** | key `orbit` is unknown to the intro map |
| ks2-25 | Bloop opens, DiGi closes | 0 | **coin flip** | key `bloop` is unknown to the intro map |

So: **one lesson has a full set of beats, four have one, twenty have none.**
Every lesson does already have three things that move: the title intro (a
Planet Friend loop clip with a typed hello), DiGi closing the lesson in code,
and one tap interactive. Between the title and the close, on roughly 25
slides, nothing on the wall is alive except the reveal fades.

**Eight lessons open on the wrong friend and three on a coin flip.** The title
slide `character` keys are the July slot names (`football`, `dance`,
`celebrate`) plus `nova` and `cosmo`, and the three newest modules wrote real
friend names that the intro map has never heard of, so it falls back to a
title heuristic. That is the first slide of the lesson, on the wall, saying
which friend this is, and it is wrong more than a third of the time. Free to
fix, and it is fixed in this plan before anything new is animated.

**The teacher side is already strong**, which is worth saying because it
changes what this plan builds. The prep page carries the cycle map, the tool,
equipment, misconceptions, SEND and a paper fallback. The run sheet is before,
during and after with every script. The player has a script panel that stays
open across slides, a countdown on every talk task, a good answer revealed
when the timer ends, and the tool on the slide that needs it. What is missing
is not instruction, it is a guide on the wall between slide 2 and slide 26.

---

## 2. The money, so nobody plans in adjectives

Balance today: **72.24 credits**. Seedance 2.5 at 1080p costs **72 for eight
seconds and 108 for twelve**, whether or not it speaks (11 September). So the
balance is one clip.

| Route | Clips | Credits | Where it lands |
| --- | --- | --- | --- |
| Three video shots on each of the 24 non pilot modules, 8s, 1080p | 72 | **about 5,200** | two months of the Ultra plan |
| The same at 720p | 72 | roughly half, unmeasured on a wall | a top up, and a projector judgement first |
| Expression stills for the five friends, three moods each, Nano Banana Pro | 15 | **30** | makes the code beats emotive for ever |
| Everything in section 3 | 0 | **0** | today |

Nothing in this plan spends a credit. The video series is a decision for
Justin with the number beside it, and the 30 credit stills are the one spend
I would recommend, because they upgrade every code beat in every lesson at
once and never need rendering again.

---

## 3. The build, all of it free, in the order it ships

### A. The intro opens on the right friend (code)

`shared/intro-characters.ts` is keyed by CharacterKey (pebble, bloop, orbit,
nova, cosmo, digi) with the July slot names kept as aliases, so old rows keep
playing. DiGi has no intro clip and should not need one: for a DiGi module the
frame shows the golden star itself, in code, waving. Migration 296 rewrites
every title slide's `character` to its real key so the data stops lying.

### B. The Planet Friend beat (code)

`DigiClosingBlock` becomes `CharacterBeat`: the same pop in, plate, and typed
bubbles, for any friend. The art is the friend's cutout from `CHARACTERS`, the
plate is the friend's own soft colour, the accent is theirs, and the motion
follows the treatment ladder from the 7 September plan, chosen by key stage:

| Band | Register | What the friend does on arrival |
| --- | --- | --- |
| EYFS, KS1 | Bouncy | springs in with squash and stretch, a happy hop, the plate blooms |
| KS2 | Playful | a light bounce and a settle, the plate blooms |
| KS3 | Level | one clean lean in, almost still, a soft band rather than a circle |
| KS4, KS5 | Still | fades up and holds, a slow blink of scale, no plate, one thin rule |

A `digi` slide that carries `character` renders the friend; without it, DiGi,
exactly as today. No new slide type, so nothing else in the platform changes.
The three DSL modules and ks3-14 are DiGi only, Still register, no exceptions,
because that is a safeguarding call already made and not a style one.

### C. The friend is present on the teach slides (code)

A small plate avatar of the module's friend sits in the corner of concept,
keywords, diagram and stat slides, bobbing in its register, tilting to think
on a choice slide and hopping on a right answer. The phase strip's current
pill, the progress bar and the cycle map take the friend's accent. DiGi keeps
the header, because DiGi is the star; the friend keeps the slide.

### D. Migration 296: three beats in every lesson (data)

For the 24 modules that are not the pilot, in ks3-12's own shape:

| Beat | Where | Minutes | Counts as | What it does |
| --- | --- | --- | --- | --- |
| **Arrival** | after the title, starter phase | 1 | passive | the friend arrives and asks the lesson's question |
| **Pause** | before the practise phase opens | 1 | action (star breath) | half time: one breath, tell your neighbour one thing that surprised you, then write it on your sheet |
| **Mission** | before DiGi closes | 1 | passive | the friend hands the single action outcome to the room, then steps back for DiGi |

Every line is written per module from its own outcome, tool and cycles, in the
friend's register, no dashes, and every beat carries a teacher script that
says what to do while it plays. The Mission beat takes its minute from the
DiGi close so the close stays at two minutes of watching, and the migration
computes every passive run itself and refuses to apply if any run is over
four minutes, the council's own rule. Cycle minutes are untouched because
nothing is inserted inside the teach phase.

The four modules that also live as JSON in `content/modules/` get the same
beats in the file, so the contract check sees them.

### E. Guards

- `check-module-contract`: a `digi` slide with a `character` must name a
  friend that appears in the module's cast; a title slide `character` must be
  a real CharacterKey.
- Migration 296 guards: slide counts, the three beats present on all 24, the
  DiGi close still last, no passive run over four minutes, no dashes.
- Render at 390 and 1440 via `?slide=N` on one module per register, plus the
  DSL case, before it is called done.

### F. Not in this plan

- The video series. Priced above, Justin's call.
- A presenter view (the script on the teacher's phone while the wall shows
  the slide). The run sheet covers it on paper today. Worth its own week.
- The five minute explainer scripts in `content/lesson-scripts/` still name
  the retired cast (126 mentions, no Planet Friends). A different artefact,
  the lesson-video skill, and it is noted here so it stops being forgotten.
- Whether the dark teal intro card should become cream to match the Happy
  News look. Justin chose that card in July; not reopened without him.

---

## 4. What is needed from Justin

1. Nothing to start. Everything in section 3 is free and ships this week.
2. **Yes or no to 30 credits** for fifteen expression stills, three moods per
   friend. Recommended.
3. **The video series decision**: about 5,200 credits at 1080p for three shots
   on every remaining lesson, or the six pilot beats stay the only films and
   the code beats carry the rest. Either is a real product; one costs two
   months of Ultra.
4. Two cast lines in `shared/schools-curriculum.ts` disagree with the
   database (ks3-11 and ks3-13). The wall shows the database. Say if either
   should be Nova, as the 7 September plan proposed; otherwise the file is
   corrected to match the database.
