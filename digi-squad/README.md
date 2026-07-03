# The DiGi Squad — Character Reference

This folder is the single source of truth for all DiGi Squad characters. Read it at the start of any session involving characters, lessons, or the kids section.

---

## The Team

### DiGi — The Guide
- **Role**: Coach and wise guide for parents and children across all stages
- **Design**: A friendly golden star with a warm smiling face (public/digi-squad/DiGi-star.svg). Confirmed by Justin: DiGi IS the star. The green robot (Digi.png, job `62f19158`) and the owl (job `a195409b`) are both legacy designs, superseded.
- **Where used**: Homepage DiGi card, /join chat preview, DiGi advisor throughout the platform, animated via components/digi/DigiCharacter.tsx
- **Voice**: Warm, calm, knowledgeable. Speaks to parents. Never preachy.
- **Classroom lesson video**: `2052451b` (8s, HOW THE ALGORITHM WORKS, https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4), wired into the exemplar Explorer lesson in migration 017

### DiGi Junior — The Pause Guide
- **Role**: Mid-lesson pause beats, breathing moments, check-ins between steps (like Jigsaw's Jerrie Cat)
- **Design**: DiGi IS the star, so DiGi Junior is the same friendly golden star with the warm smiling face, shown small and child-friendly. Bobs, waves and twirls with a soft sparkle trail. Confirmed by Justin 3 Jul 2026: never render DiGi or DiGi Junior as the robot or the owl, both are legacy designs.
- **Voice**: Fun, playful, "BEEP BOOP!" energy. Speaks directly to children.
- **Higgsfield job IDs**: `bc3337b7` (8s classroom pause beat: half time check in, golden star design, kling3_0, first clip of the reusable pause library). Legacy, do not reuse: `62f19158` (old robot image), `8be302c2` (robot version of the pause beat, superseded)
- **Component**: `components/lessons/DigiJuniorPause.tsx`

---

## Squad Characters

### Oliver — Screen Time Boss
- **Age**: 8
- **Background**: English. Fair skin, sandy brown hair, blue eyes, green hoodie, sporty build.
- **Digital superpower**: Knows when to play and when to stop. Teaches kids to be the boss of their screens, not the other way round.
- **Personality**: Confident, sporty, uses football metaphors. "The cool-down lap", "Knowledge is power like knowing the other team's move."
- **Colour**: Coral (#D4600A / var(--coral))
- **Kit**: Green and coral football kit, number 10, flowing coral cape
- **Lesson topics**: Screen time routines, dopamine loops, wind-down strategies, sleep
- **Stage**: 2 to 3 · Ages 7 to 11
- **Intro speech**: "Hi! I'm Oliver and I'm here to help you today! You know how I love football? Well today we're going to find out why your brain treats screens exactly like a REALLY exciting match. Ready? Let's kick off!"
- **Higgsfield job IDs**: `5019bb19` (still image, 1:1 avatar), `a28311bc` (5s video: kicking football), `73a1ddee` (8s classroom lesson video: BE THE BOSS OF YOUR SCREEN, https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210302_73a1ddee-7a31-429c-b382-339dd740fdc9.mp4)

### Zara — Truth Finder
- **Age**: 9
- **Background**: British Muslim. Olive skin, dark hair, purple headband, coral orange top. Sharp and curious.
- **Digital superpower**: Spots the tricks, the fakes and the traps before anyone else. Thinks before tapping.
- **Personality**: Curious, sharp, detective energy. "Going on a DETECTIVE mission."
- **Colour**: Gold (#C9962A / var(--gold-dark))
- **Kit**: Gold and purple striped top, navy trousers, detective-style gold cape
- **Lesson topics**: Fake news, stranger danger, passwords, what to do when something feels wrong
- **Stage**: 2 to 4 · Ages 8 to 13
- **Intro speech**: "Hi! I'm Zara and I'm here to help you today! Today we're going on a DETECTIVE mission to spot what's real online. Put your thinking hat on and let's go!"
- **Higgsfield job IDs**: `e29b139c` (still image, 1:1 avatar), `4641ac49` (5s video: celebration leap), `08e5094c` (8s classroom lesson video: REAL OR FAKE, https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210314_08e5094c-a1ad-42bc-aed4-ca3f2df62cde.mp4)
- **Schools reference lesson beats (KS3 module 12, migration 018, kling3_0, secondary classroom staging)**: `459b1662` (12s intro: REAL OR MADE?, hf_20260703_061752), `66e88fe5` (10s concept: THE THREE CHECKS, hf_20260703_061754), `129f9d14` (8s mission: CHECK BEFORE YOU SHARE, hf_20260703_061806)

### Sofia — Safety Guardian
- **Age**: 6
- **Background**: Southern European. Mediterranean skin, wavy chestnut hair, lavender jumper, warm and brave.
- **Digital superpower**: Keeps the whole squad safe. Knows what to keep private always.
- **Personality**: Warm, brave, protective. "Building YOUR privacy shield."
- **Colour**: Green (#2E7D5A / var(--green-dark))
- **Kit**: Lavender dress, green cape with a shield emblem
- **Lesson topics**: Personal information, photo sharing, who to talk to, what to do if someone asks for your info
- **Stage**: 1 to 2 · Ages 4 to 9
- **Intro speech**: "Hi! I'm Sofia and I'm here to help you today! Today we're going to build YOUR privacy shield. Ready to be a guardian?"
- **Higgsfield job IDs**: `9a93adee` (still image, 1:1 avatar), `457b92ac` (5s video: spinning with sparkles), `95e07492` (8s classroom lesson video: MY PRIVACY SHIELD, https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210333_95e07492-9204-4682-99e3-fdbfb8effd35.mp4)

---

## Team Poster
- All four characters together (Oliver, Zara, Sofia, DiGi Junior)
- Dark forest green stadium background, golden spotlights, bokeh effects
- **Higgsfield job ID**: `9424aadf` (legacy — shows Teo/Olga/Alma, needs regenerating)

---

## UK Animal Stage Guides

Each developmental stage has a UK animal guide. DiGi (the golden star, never the owl) coaches the whole squad.

| Animal | Name | Stage | Ages | Personality |
|--------|------|-------|------|-------------|
| Hedgehog | Hog | Stage 1 | 0 to 3 | Curious, needs protection |
| Robin | Robin | Stage 2 | 4 to 6 | Friendly, trusting |
| Red Squirrel | Scout | Stage 3 | 7 to 9 | Energetic, exploratory |
| Badger | Brock | Stage 4 | 10 to 12 | Independent, reliable |
| Fox | Vix | Stage 5 | 13 to 16 | Street-smart, sharp |

**Higgsfield job IDs**: `5dd2f0d8` (hedgehog), `937a5bf2` (robin), `173d41c3` (squirrel), `4edb2fc5` (badger), `8365a8ff` (fox)

---

## Lesson Architecture

Modelled on Jigsaw PSHE but cinematic. Every lesson follows this arc:

```
1. CHARACTER INTRO (CharacterIntro.tsx)
   Full-screen: character floats, speech bubble opener, lesson title, big START button

2. LESSON STEPS (LessonStep.tsx)
   Steps cycle through: learn → think → discover → challenge
   Each step has: heading, body, character speech bubble, optional brain fact

3. DIGI JUNIOR PAUSE (DigiJuniorPause.tsx)
   At the halfway point DiGi Junior appears for a breathing/check-in beat
   Kids can "take a breath" (4s animation) or keep going

4. FINAL STEP → COMPLETION SCREEN
   Trophy animation, mission card, family question, links to more lessons
```

### Step types
- `learn` — did you know fact
- `think` — reflection question
- `discover` — new concept revealed
- `challenge` — interactive task
- `mission` — weekly action (always the final step)

### Character voice rules
- Oliver: uses football metaphors. "Cool-down lap", "the other team's move", "kick off"
- Zara: uses detective metaphors. "Mission", "clue", "case solved"
- Sofia: uses shield/guardian metaphors. "Privacy shield", "guardian", "protect"
- DiGi / DiGi Junior: playful robot voice. "BEEP BOOP!", "brilliant!", casual and fun

### The distancing technique (from Jigsaw)
Characters voice the struggle so the child agrees rather than being challenged directly.
NOT: "Do you find it hard to stop playing?" (confrontational)
YES: "Teo finds it SO hard to stop mid-match — do you know that feeling?" (child agrees with the character, not the topic)

---

## Component Locations

```
components/lessons/
  CharacterIntro.tsx   — full-screen lesson opener with character + speech bubble
  LessonStep.tsx       — individual step card with character reactions
  DigiJuniorPause.tsx  — mid-lesson DiGi Junior breathing pause beat

app/(marketing)/digi-squad/
  page.tsx             — squad homepage (meet Oliver, Zara, Sofia + animal guides)
  lesson/page.tsx      — Oliver's first lesson: "Why your brain loves screens"
```

---

## Adding new lessons

Each lesson needs:
```typescript
{
  character: 'oliver' | 'zara' | 'sofia'
  greeting: string          // character's opening speech bubble
  lessonTitle: string
  ageStage: string          // e.g. "Stage 2 to 3 · Ages 7 to 11"
  steps: LessonStep[]       // 4 to 6 steps
  pause: { message: string } // DiGi Junior pause message
  mission: { heading, body, reward }
  familyQuestion: string    // one question for dinner/bedtime
}
```

Lessons currently live in the page file. When the database is set up, move them to the `scripts` table per CLAUDE.md rule 6.

---

## Tone and copy rules (all characters)
- Warm, direct, never preachy
- No dashes in any copy ever (CLAUDE.md rule 4)
- Ages as "7 to 11" not "7-11"
- Short sentences. Kids reading level for lesson content.
- Every lesson ends with a family conversation question
- No allow/deny framing — always a calibrated pathway (CLAUDE.md rule 1)
