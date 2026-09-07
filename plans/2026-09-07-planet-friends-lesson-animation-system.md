# The Planet Friends lesson animation system

Justin, 7 September 2026: the animations in the school lessons are the old
characters, we need the Planet Friends, a series of animations made the same
way so they are all consistent, slides themed around different characters in
look so they pop up and are fun for kids, cooler as the children get older,
built with Seedance, and using the Happy News look we have developed.

This is the plan. Nothing is generated yet and no credits are spent.

---

## 1. The problem is bigger than the eight clips

The obvious job is eight video beats across five modules that still play the
retired DiGi Squad children. The real job is that **the whole production chain
still runs on the retired cast**, so anything generated tomorrow reproduces the
bug on purpose:

| Where | State | Count |
| --- | --- | --- |
| `content/lesson-scripts/*.md` (the source scripts) | Sofia, Zara, Oliver | 140 mentions, **0** Planet Friends |
| `.claude/skills/lesson-video/SKILL.md` | "House cast only" names Sofia, Zara, Oliver, Vix, Brock | 1 rule, applied every run |
| `digi-squad/README.md` | Documents Oliver, Zara, Sofia under "Squad Characters" | 3 profiles |
| The eight live video beats | Play the retired children | 8 clips |

So the order of work is: **recast the source, then fix the skill, then make the
films.** Doing the films first means making them twice.

The eight beats themselves, from the render records read on 7 September:

| Module | Slide | Length | Speaks? | Board reads |
| --- | --- | --- | --- | --- |
| ks1-03 | 2 | 8s | no | REAL OR FAKE |
| ks2-04 | 2 | 8s | no | BE THE BOSS OF YOUR SCREEN |
| ks2-06 | 2 | 8s | no | HOW THE ALGORITHM WORKS |
| ks2-07 | 2 | 8s | no | MY PRIVACY SHIELD |
| ks3-12 | 5 | 12s | yes | REAL OR MADE? |
| ks3-12 | 10 | 10s | yes | THE THREE CHECKS |
| ks3-12 | 17 | 8s | yes | (no board) |
| ks3-12 | 25 | 8s | yes | CHECK BEFORE YOU SHARE |

Thirteen of the twenty one modules have no video beat at all. The series is
therefore not a replacement job, it is a first proper run at the whole scheme.

---

## 2. The cast already encodes the age ladder

Justin asked for a look that gets cooler as children get older. That ladder is
already designed into the Planet Friends, so we lean on it rather than invent a
second one. Read from the art in `public/digi-squad/friends/`:

| Friend | Look | Reads as | Accent | Soft plate |
| --- | --- | --- | --- | --- |
| **Pebble** | Yellow egg, curled sprout with one leaf, wide open smile, pink cheeks | Youngest, delighted | `#C99A28` | `#FBEED0` |
| **Bloop** | Green, two leaf sprout, freckles, closed gentle smile, pink cheeks | Small and kind | `#6C9E38` | `#E4F0D4` |
| **Orbit** | Light blue, single antenna with a glowing tip, big bright eyes, belly spots | Curious explorer | `#3E86BC` | `#DCEBF7` |
| **Nova** | Purple, two small horns, half lidded steady eyes, level closed smile, no blush | Calm and grown | `#7E5AB0` | `#ECE3F7` |
| **Cosmo** | Orange, flame on the head, eyebrows, freckles, confident closed smile | Oldest, forward looking | `#CE7328` | `#FBE4D0` |
| **DiGi** | The golden star | The guide, any age | `#C99A28` | `#FDF4D9` |

The blush and the open smile drop out as you go up. The eyes go from wide to
half lidded. That IS the ladder, and the casting in
`shared/schools-curriculum.ts` already follows it: Pebble and Orbit at EYFS and
KS1, Bloop and Pebble through KS2, Nova and Cosmo at KS3, Cosmo and DiGi at KS4
and KS5, with DiGi alone carrying the four DSL modules.

**So the cast does not change. The treatment does.**

### The treatment ladder

Same characters, four registers, chosen by key stage. This is what makes a KS4
lesson feel cooler than a Reception one without a second cast:

| Band | Register | Motion | Plate | Character behaviour |
| --- | --- | --- | --- | --- |
| EYFS, KS1 | **Bouncy** | Springy, a little squash and stretch, a happy twirl allowed | Full circle plate, saturated | Waves, claps, delighted, big open smile |
| KS2 | **Playful** | Lighter bounce, purposeful gestures | Circle plate, softer | Points, counts on fingers, grins |
| KS3 | **Level** | Almost no bounce, one clean move per beat | Plate becomes a wide soft band, not a circle | Leans in, raises an eyebrow, confiding |
| KS4, KS5 | **Still** | Character holds, the graphics move instead | No plate, cream ground, one thin accent rule | Present and steady, a nod, never bouncy |

The four DSL modules (ks4-16 consent, ks4-17 sextortion, ks4-18 radicalisation,
plus ks3-14 bodies and image) are **Still**, DiGi only, no exceptions. A bouncy
creature next to a sextortion lesson is a safeguarding problem, not a style
choice. The ladder is doing pastoral work, not only aesthetic work.

---

## 2b. Three modules are cast against the agreed ladder, and that must be fixed before we film

`digi-squad/README.md` carries Justin's agreed design of 23 July 2026: one
friend per stage, unlocked as the child grows, ages written down.

| Stage | Ages | Friend | Verb |
| --- | --- | --- | --- |
| 1 | 4 to 7 | Pebble | Explore |
| 2 | 8 to 10 | Bloop | Create |
| 3 | 11 to 13 | Orbit | Explore |
| 4 | 13 to 15 | Nova | Guide |
| 5 | 16 plus | Cosmo | Lead |

Checked every schools module's cast against the year band it teaches. Eighteen
of twenty one fit. **Three are cast at the wrong age**, and each one cuts
directly against what Justin asked for, because the friend on screen is the
main thing that says how old this lesson is:

| Module | Class | Cast | Friend's ages | Problem | Proposed |
| --- | --- | --- | --- | --- | --- |
| ks1-03 real, pretend, computer | Years 1 to 2, ages 5 to 7 | Orbit | 11 to 13 | A Year 1 class hosted by the 11 to 13 friend | **Pebble**, whose verb is already Explore, keeping DiGi Junior |
| ks3-11 social workarounds | Years 7 to 9, ages 11 to 14 | Cosmo | 16 plus | The oldest friend fronting Year 7 | **Nova**, whose verb is Guide, which is the module's job |
| ks3-13 scams and money | Years 7 to 9, ages 11 to 14 | Cosmo | 16 plus | Same | **Nova** |

One softer stretch worth naming rather than changing: Pebble (4 to 7) hosts
ks2-07 and ks2-08 for Years 3 to 6 (7 to 11). The bands touch at 7 so it is not
a clean break, but a Year 6 class gets the youngest friend on privacy. Worth a
look when the pilot shows what Pebble reads like at that age on a projector.

This is a one line data change per module in `shared/schools-curriculum.ts` and
it costs nothing, but it has to happen **before** anything is filmed or we film
the wrong friend three times. It is a brand decision, so it is Justin's call
and not mine to make.

---

## 3. The look: Happy News, in motion

From `design-refs/happy-newspaper-notes.md` and
`plans/moments-illustration-spec.md`, the house look is already written down.
Translated to film:

- **The circle plate.** The single biggest borrow, and it moves perfectly. The
  character stands on or in front of a soft pastel circle in **their own** soft
  colour. That one device themes every beat by character for free, and it is
  already a token.
- **Cream and butter ground.** `#F9F8F6` cream, never white, never a dark tech
  aesthetic, never neon.
- **Ink line, flat fills.** Thick confident outline, flat colour inside, the
  way the post box drawing works. No photorealism.
- **One accent per beat**, the character's own. Never two.
- **A ribbon for the one heading that matters**, at most once per film, in
  hand lettered weight. Not on every beat.
- **Story over object.** The drawing shows the situation, not a thing. A phone
  being put face down beats a phone.
- **Warm, hopeful, never scary.** This is the rule that decides every hard
  topic: we show the moment after the worry, not the worry.

On screen words stay Nunito 800 to 900 with IBM Plex Mono for labels, cream
ground, ink text. Never Inter. No dashes, anywhere, ever.

---

## 4. The consistency spine: reference sheets plus Seedance

This is the part that makes a series rather than twenty one one offs.

The old clips were made with `kling3_0` from a **long text description** of each
character. That is why they drift: every prompt re describes the character and
every render interprets it slightly differently.

Seedance 2.0 on Higgsfield takes `image_references` and holds identity across
generations. So the method changes:

1. **Generate one reference sheet per friend, once.** Six sheets: Pebble,
   Bloop, Orbit, Nova, Cosmo, DiGi. Each a turnaround plus an expression strip,
   built from the existing `public/digi-squad/friends/*.png` art so the sheet
   matches what the product already shows. Style preset `3d-stylized`, the
   Pixar register the art already sits in.
2. **Commit the sheets to the repo** at `digi-squad/friends/sheets/`. They
   become the single source of truth, the way the tokens are for colour.
3. **Every clip, forever, passes its friend's sheet as `image_references`.**
   The prompt then describes the ACTION only, never the character. That is the
   whole trick, and it is why the series will hold together.
4. **Never re describe a friend in a prompt.** If a prompt contains the words
   "a green creature with", it is wrong. The reference carries identity, the
   prompt carries behaviour.

Model choice, from the live Higgsfield catalogue:

| Use | Model | Why |
| --- | --- | --- |
| Reference sheets | `nano_banana_2` or the account default image model | Stills, one off |
| Draft passes | `seedance_2_0_mini` | 480p and 720p, cheap, for judging the action |
| Final beats | `seedance_2_0`, `mode: std`, 1080p, 16:9 | `image_references`, consistent identity, native audio switchable |

`generate_audio` is set deliberately per beat, not left on the default. That
choice is now a contract, not an accident, because of section 6.

---

## 5. The shot grammar: four shots, reused everywhere

A series reads as a series when the shots repeat. Four named shots cover every
module, and no module needs all four.

| Shot | Length | Where in the arc | What happens | Speaks |
| --- | --- | --- | --- | --- |
| **Arrival** | 6 to 8s | connect or starter | The friend arrives on their plate and asks the lesson's question | Yes above KS2 |
| **Explain** | 8 to 10s | teach | The friend beside a board, one idea, counted or pointed | Yes |
| **Pause** | 5 to 6s | mid teach | The friend breathes, the class breathes, nothing is taught | No, ambient only |
| **Mission** | 6 to 8s | close | The friend hands the task to camera and goes | Yes |

The **Pause** is ours and it is the one nobody else has. It is the regulation
beat, it teaches nothing, and it is the reason a heavy KS4 lesson is bearable.
It is always silent, always Still register, always DiGi or the module's friend
holding steady.

Twenty one modules at two to four shots each is roughly **fifty to sixty
clips** for the full scheme. That is the size of the series.

---

## 6. Every clip ships with its words, by construction

Migration 271 (merged today) put an `alternative` on every video slide: what is
said, what happens on screen, and the words shown on screen. Writing it after
the fact meant recovering dialogue from render records.

From now it is free and it is exact, because **the Seedance prompt is the
script**. The production step is:

```
prompt written  ->  clip generated  ->  alternative written from the same prompt
```

The spoken line in the prompt becomes `spoken`. The action clause becomes
`described`. The board text becomes `onScreen`. `generate_audio: false` means
`spoken: []` and the player says the clip is silent. No clip is wired into a
lesson without its `alternative`, and the guards in migration 271 already
refuse one that tries.

This also fixes the open item from this morning: the words stop being "the
authored script, probably what is said" and become "the script this clip was
made from, and we chose the audio setting".

---

## 7. Slide theming by character, in code, at no cost

Half of what Justin asked for needs no video at all. The lesson player can tint
every slide to its module's friend today, using the `CHARACTERS` tokens that
already exist in `shared/schools-curriculum.ts`.

- The phase strip, the progress bar and the choice chips take the friend's
  `accent` instead of butter gold everywhere.
- Concept and diagram cards take the friend's `soft` as their plate.
- The friend's art appears as a small **circle plate** avatar in the corner of
  their own slides, the Happy News device, and pops in on arrival slides.
- The intensity of all of the above steps down the treatment ladder in section
  2: full colour at EYFS, a thin accent rule and a cream ground by KS4.

This is a code change to `shared/components/LessonPlayer.tsx` plus a lookup
from `character` on the lesson row. It ships this week, free, and it is
probably the bigger half of "make the slides feel like the character".

---

## 8. The prompt system, paste ready

### The shared preamble, on every clip

> Warm hand illustrated children's picture book animation, flat art with a
> confident ink outline, gentle and hopeful in the spirit of Happy News, never
> clinical and never scary. Cream ground, muted warm palette, one accent
> colour only. Soft pastel circle plate behind the character. No photorealism,
> no neon, no dark tech aesthetic, no text on screen unless named. 16 by 9,
> lower third left clear for a caption.

### The identity clause

There is no identity clause. Identity comes from `image_references`. The only
naming allowed is the friend's name, so the log stays readable.

### The register clause, chosen by band

- **Bouncy** (EYFS, KS1): `springy squash and stretch, a small happy hop, delighted, wide open smile`
- **Playful** (KS2): `light bounce, purposeful gesture, grinning, one clear movement`
- **Level** (KS3): `almost still, one clean lean toward camera, confiding, no bounce`
- **Still** (KS4, KS5): `held and steady, only a slow blink and a small nod, calm and level, graphics move instead of the character`

### The four shot clauses

- **Arrival**: `<Friend> arrives onto the circle plate, settles, looks to camera and asks the question. Ends holding still, ready to hand over.`
- **Explain**: `<Friend> stands beside a soft board that reads <BOARD TEXT>, and marks each point as it lands.`
- **Pause**: `<Friend> is still on the plate, breathing slowly, one gentle rise and fall. Nothing else happens.`
- **Mission**: `<Friend> gives the task to camera, then steps back off the plate and the frame settles on the plate alone.`

### A worked example, ks3-12 slide 10, the beat we already have

> [preamble] Orbit stands beside a soft board that reads THE THREE CHECKS, and
> marks each of three ticks as it lands. Almost still, one clean lean toward
> camera, confiding, no bounce. Circle plate in soft blue. Orbit says: Who made
> it. What do other places say. And the big one: how is it trying to make me
> feel? Fakes aim for your feelings, because feelings share fast.

with `image_references: [orbit-sheet.png]`, `duration: 10`, `resolution:
1080p`, `aspect_ratio: 16:9`, `generate_audio: true`, `mode: std`.

Note what is absent: any description of what Orbit looks like.

---

## 9. Phases, and what each costs

The account holds **48.24 credits** on a Plus plan. That is the binding
constraint and it is why this is staged rather than promised whole. Nothing
below spends a credit without Justin saying so.

| Phase | What | Cost | Ship |
| --- | --- | --- | --- |
| **0. Stop the bleed** | Recast `content/lesson-scripts/*.md` to the Planet Friends. Fix the cast rule in `lesson-video/SKILL.md`. Update `digi-squad/README.md` to mark the DiGi Squad children retired. | Free | Same day |
| **1. Theme the slides** | Character tinting, circle plate avatars, the treatment ladder, in the player. | Free | This week |
| **2. The spine** | Six reference sheets, generated once, committed. | Small, stills only | Needs a yes |
| **3. The pilot** | One module end to end. ks3-12, four shots, all four registers exercised at KS3 Level. Judge it against the old clips side by side. | **Priced here**, one module tells us the real number | Needs a yes |
| **4. The rollout** | The remaining beats in casting order, EYFS upward, replacing the eight retired clips first. | Phase 3 number times about 12 | Needs a yes and a budget |

Phase 3 is deliberately the decision point. One module priced is worth more
than my estimate of twenty one, and if the look is wrong it is one module
wasted rather than a scheme.

---

## 10. What is needed from Justin

1. **A yes to phase 0 and 1**, which cost nothing and stop new work landing on
   the retired cast.
2. **The pilot module.** I propose ks3-12, because it already has four beats,
   it is the exemplar the QA runs against, and KS3 Level is the middle of the
   ladder so it tests both directions.
3. **The three recasts in section 2b.** ks1-03 to Pebble, ks3-11 and ks3-13 to
   Nova. Free, one line each, and it must land before filming.
4. **Whether the DSL modules get a character at all.** My reading is DiGi only,
   Still register, no plate, and I would like that confirmed rather than
   assumed, because it is a safeguarding call and not a design one.
5. **A credit budget** once phase 3 gives us a real per module number.

## Not in this plan, on purpose

- Re rendering the old clips as a like for like swap. The scripts are recast
  first or we make them twice.
- Voice cloning for the friends. Native Seedance audio is enough to judge the
  pilot, and a house voice is a separate decision.
- The five minute explainer films in `lesson-video`. That skill builds a
  different artefact and only its cast rule is touched here.
