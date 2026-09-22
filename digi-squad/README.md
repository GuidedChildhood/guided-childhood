# The Character Bible

The single source of truth for every character. Read it at the start of any
session involving characters, lessons, animation or the kids section.

Rewritten 22 September 2026. The previous version led with Oliver, Zara and
Sofia, who were retired on 23 July 2026, and gave the live cast one table. They
are now an appendix at the foot of this file.

The canonical DATA (names, colours, art URLs, moods, intro lines) lives in code:
`shared/schools-curriculum.ts` for schools, `lib/content/stage-characters.ts`
for the parent app, `shared/intro-characters.ts` for the title clips. Edit
there. This file is the BEHAVIOUR: who they are, what they do, what they never
do. Code cannot hold that and it is what keeps them one cast rather than five
mascots.

---

## The cast

| Stage | Ages | Friend | Colour | Verb | Owns | Register |
|---|---|---|---|---|---|---|
| 1 | 4 to 7 | **Pebble** | yellow `#C99A28` | Explore | kindness, feelings, real or pretend | Bouncy |
| 2 | 8 to 10 | **Bloop** | green `#6C9E38` | Create | routines, gaming, privacy, who made it | Playful |
| 3 | 11 to 13 | **Orbit** | blue `#3E86BC` | Explore | mood, scams, deepfakes, thinking with AI | Level |
| 4 | 13 to 15 | **Nova** | purple `#7E5AB0` | Guide | persuasion, judgement, independence | Still |
| 5 | 16+ | **Cosmo** | orange `#CE7328` | Lead | independence, AI literacy, readiness | Still |

**DiGi**, the golden star, is the guide across all of them and is not a Planet
Friend. Register is set by key stage in `shared/friend-register.ts` and is
amplitude, not a different animation: the same friend, quieter, as the child
grows.

---

## The five, in full

Each block is what an animator, a script writer and a prompt all need. The prop
and entrance come from the Video Production System in Drive. Everything under
"joke", "habit", "wrong" and "never" is new canon, written 22 September, and is
the part that makes them a cast.

### Pebble · stage 1 · 4 to 7 · Bouncy

- **Prop**: a picture book, held upside down.
- **Entrance**: pops out from behind the book, turns it the right way round.
- **Running joke**: Pebble gets things the wrong way round first, cheerfully,
  and turns them round without a flicker of embarrassment. The book, a picture,
  a shoe. Never the lesson content itself.
- **Habit while listening**: rocks on the spot, whole body, in time with nothing.
- **When wrong**: delighted. "Oh. Other way round." Turns it and carries on.
  A four year old watching learns that being wrong is not a thing to hide.
- **Never**: never frightened of a screen, never tells a child off, never meets
  anything a four year old should not meet.
- **Says**: "I'm Pebble. I help you notice feelings, practise kindness and ask
  whether something on a screen is real."

### Bloop · stage 2 · 8 to 10 · Playful

- **Prop**: a games controller.
- **Entrance**: the controller wobbles as a timer rings; Bloop puts it down.
- **Running joke**: always mid build, always one piece short. Pats pockets,
  finds it somewhere daft, carries on. The joke is the searching, not the loss.
- **Habit while listening**: taps the controller against a palm, twice, thinking.
- **When wrong**: rebuilds rather than defends. "Right. Start again from the bit
  that worked."
- **Never**: never wins the game on screen, never makes a child feel slow.
- **Says**: "I'm Bloop. I help with gaming, routines and keeping personal things
  private."

### Orbit · stage 3 · 11 to 13 · Level

- **Prop**: an oversized magnifier.
- **Entrance**: the magnifier focuses on an obviously fake prize card.
- **Running joke**: the magnifier is comically too big for whatever is being
  examined, and Orbit uses it anyway, with total seriousness. Never winks at it.
- **Habit while listening**: tilts head, one beat, before answering.
- **When wrong**: pleased. "Good. That is one wrong answer we do not have to
  check again." The friend who makes checking feel like winning.
- **Never**: never smug, never catches somebody out to score a point.
- **Says**: "I'm Orbit. I like a question that needs checking."

### Nova · stage 4 · 13 to 15 · Still

- **Prop**: notification cards that crowd in.
- **Entrance**: the cards arrive; Nova calmly moves them aside.
- **Running joke**: the cards keep arriving mid sentence and Nova keeps not
  looking at them. The restraint is the joke. It gets funnier the less Nova
  reacts.
- **Habit while listening**: stillness. Moves once, deliberately, then stops.
- **When wrong**: names it plainly and moves on. "I had that wrong. Here is what
  changes."
- **Never**: never dramatises pressure, never jokes anywhere near something that
  could be a real disclosure.
- **Says**: "I'm Nova. I help you recognise pressure and think through difficult
  choices online."

### Cosmo · stage 5 · 16+ · Still

- **Prop**: an enormous checklist that folds down small.
- **Entrance**: opens the checklist, folds it neatly, ticks one item.
- **Running joke**: the list is always longer than expected and always folds
  smaller than expected. Competence made visible, never fussiness.
- **Habit while listening**: finishes the thing in hand before speaking. Puts
  the pen down, then talks.
- **When wrong**: checks it against a source out loud, then corrects. The
  correction IS the lesson at this age.
- **Never**: never implies they should already know it, never pretends
  independence is simple.
- **Says**: "I'm Cosmo. More independence brings decisions you need to make
  yourself. Being confident includes knowing when to ask for help."

---

## DiGi and DiGi Junior

**DiGi IS the golden star.** Confirmed by Justin. The green robot
(`Digi.png`, job `62f19158`) and the owl (`a195409b`) are legacy and must never
be rendered again. DiGi is drawn in code by `DigiCharacter.tsx` and
`FriendPlate`, never filmed, which is why DiGi has no intro clip and does not
need one.

- **DiGi**: the guide. Warm, calm, plain. Speaks to parents and closes every
  lesson. **When wrong: says what it does not know.** That is the whole point of
  the character and the reason the product can be trusted.
- **DiGi Junior**: the pause guide. The same star, smaller, for breathing beats
  and half time check ins. Speaks to children.

Three modules and ks3-14 are **DiGi only, Still register, no exceptions**. That
is a safeguarding decision, not a style one.

---

## Rules for the whole cast

**The never list.** These hold for every character, every surface, every render.

1. No jokes during distress, abuse, exploitation or a crisis disclosure. The
   character goes quiet and the words do the work.
2. Never mock a child, or a parent, or a teacher.
3. KS4 and KS5 get restrained humour. A preschool performance in front of Year
   10 loses the room and the sale.
4. Never allow or deny. Always the calibrated pathway.
5. No dashes in any copy, ever. Ages as "7 to 11".
6. A friend never solves it for the child. The friend voices the struggle; the
   child does the thinking.

**The distancing technique.** The character carries the difficulty so the child
agrees with the character rather than being challenged directly.

- Not: "Do you find it hard to stop playing?"
- Yes: "Bloop finds it so hard to stop mid game. Do you know that feeling?"

**Voice.** Generated, one per friend, decided 22 September. Each friend gets a
voice id, a sample and a pronunciation note recorded in the table below the day
the new Higgsfield account is connected. **Never infer a voice from a colour and
never pick a new one because the old one cannot be found.**

| Friend | Voice id | Sample | Pronunciation |
|---|---|---|---|
| Pebble | to be set | | |
| Bloop | to be set | | |
| Orbit | to be set | | |
| Nova | to be set | | |
| Cosmo | to be set | | |

---

## What is actually filmed today

Counted 22 September 2026, not remembered.

| Asset | Count | Made | Plays |
|---|---|---|---|
| Intro loop clips, one per friend | 5 | Jul and Aug 2026 | `shared/intro-characters.ts`, title slide of every lesson |
| Lesson video slides | 10, across 5 lessons | all 11 Sep 2026 | ks3-12 has 6, ks1-03 / ks2-04 / ks2-06 / ks2-07 have 1 each |
| Expression stills | 15, three moods each | 13 Sep 2026 | `CHARACTERS.moods`, drives `FriendPlate` |

So 24 of 29 lessons have no filmed beat between the title and the close, and
everything filmed is 8 to 12 seconds. **No long form animation exists yet.**

A note the previous version got wrong: it said eight lesson beats still played
the retired children. They were all re-rendered on 11 September. No retired
character appears anywhere in the live product.

The plan for what gets made next, with the credit arithmetic, is
`plans/2026-09-22-animation-and-mini-series-plan.md`.

---

## Where they are drawn

```
shared/components/FriendPlate.tsx    the friend in a lesson: GSAP, five moods, register
shared/components/FriendMark.tsx     the friend as a still chip on marketing pages
shared/components/DigiCharacter.tsx  the golden star
shared/friend-register.ts            register by key stage
shared/intro-characters.ts           the title clip per friend
shared/schools-curriculum.ts         art, moods, accent, soft and ink per friend
```

Character art lives in `public/digi-squad/` and on the CDN. Use the real art,
never a placeholder.

---

## UK animal stage guides

One animal per developmental stage in the parent app. DiGi, the star, coaches
the whole squad.

| Animal | Name | Stage | Ages | Job ID |
|---|---|---|---|---|
| Hedgehog | Hog | 1 | 0 to 3 | `5dd2f0d8` |
| Robin | Robin | 2 | 4 to 6 | `937a5bf2` |
| Red Squirrel | Scout | 3 | 7 to 9 | `173d41c3` |
| Badger | Brock | 4 | 10 to 12 | `4edb2fc5` |
| Fox | Vix | 5 | 13 to 16 | `8365a8ff` |

---

## Appendix: the retired squad

Superseded 23 July 2026 by the Planet Friends. Kept for history and for the job
IDs. **Never generate Oliver, Zara or Sofia into anything new.** They appear
nowhere in the live product.

| Character | Was | Art | Job IDs |
|---|---|---|---|
| Oliver | Screen Time Boss, 8, football metaphors | `Oliver.png`, `Oliver-football.png` | `5019bb19`, `a28311bc`, `73a1ddee` |
| Zara | Truth Finder, 9, detective metaphors | `Zara.png` | `e29b139c`, `4641ac49`, `08e5094c`, plus KS3 beats `459b1662`, `66e88fe5`, `129f9d14` |
| Sofia | Safety Guardian, 6, shield metaphors | `Sofia.jpeg` | `9a93adee`, `457b92ac`, `95e07492` |
| Team poster | all four together | | `9424aadf` (shows an even older cast, unusable) |

Teo, Olga and Alma are older still. Vix and Brock appear in some legacy skill
text as children and were never built; the names belong to the animal guides
above.
