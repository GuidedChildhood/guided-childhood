# The animation system — lessons and scripts

**Written 8 Jul 2026 · One motion system for the whole product · Builds on lesson-format.md (video beats, the interactive layer) and lessons-depth-plan.md, honours the design system motion rule**

Justin's ask: build animations to go with the lessons and the scripts, and plan it first. Today the motion is placeholder: lesson slides do a plain opacity fade, the characters (Teo, Olga, Alma, DiGi Junior) are emoji inside a CSS float, the planned GSAP interactive layer is an empty folder, the video beats are specced but unrendered, and scripts have no motion at all. This plan sets one system that covers all of it, decides the technology, names the one real dependency (character art), and phases the build so we never drown.

---

## 0. The house illustration style (LOCKED 8 Jul 2026 by JP)

Every animation on the parent platform is drawn in one style, set by the balloon at the cliff image JP handed over. Call it the **living sketch**. It is what makes the product feel human and unmistakably ours, and it is now the fixed reference for all parent facing illustration and motion.

The style, precisely so it stays consistent:
- **Hand drawn black ink linework.** Rough, energetic, confident, imperfect. Single pen weight with natural thick and thin. Lines overshoot corners a little. Nothing vector clean, nothing geometric.
- **Felt tip marker colour, sparingly.** A tight palette only: the Guided Childhood red (the balloon, the hearts), a strong hoodie blue, an occasional warning orange. Colour is scribbled in with visible marker streaks, never flat filled, and it never fully reaches the lines. Most of the frame stays white.
- **Loads of white space.** The drawing sits in a lot of paper. No backgrounds, no gradients, no boxes around things.
- **Hand lettering** for any word inside a scene (signs, labels), never a typeface baked into the art. UI type stays Nunito and Plex Mono around the illustration, not inside it.
- **The metaphor is always the pathway to 16.** The child, the balloon marked 16, the old path behind, the pull of the feed. This scene and its cast (one child, the 16 balloon, notification icons as weather) are the visual world every other illustration draws from.

How the living sketch moves, so the style survives animation:
- **Draw on.** Lines sketch themselves in the way a hand would, using SVG stroke reveal (stroke dashoffset). This is the signature move and it is pure GSAP.
- **The boil.** Once drawn, key strokes jitter one or two pixels on a slow loop so the sketch feels alive and hand held, never a frozen clip. Subtle, or it reads as noise.
- **Object motion with weight.** The balloon floats and tugs on its string, the notification icons swirl and rise like a tide, hearts drift up. Real physics feel, gentle, slow.
- Everything stays GSAP plus SVG, which fits the design rule below exactly. No raster, no video, for the living sketch pieces, so they stay tiny, editable, and razor sharp on every screen.

This answers the open dependency in section 3: the character art is the living sketch, hand drawn as layered SVG so the lines can draw on, boil, and gesture. Produce the cast (the child, and the four squad characters rendered into this same pen) once, in this one style, and every lesson, script, pathway and empty state draws from it.

## 1. The rule we stay inside

The design system is explicit: motion is GSAP only, subtle, purposeful, no Three.js. Everything here obeys that. Nothing 3D, nothing decorative, no motion that does not teach or guide. Reduced motion is respected everywhere by drawing the calm end state, never nothing (the Celebration component already sets this pattern). Sixty frames a second on a mid range phone or it ships simpler. The living sketch style in section 0 sits inside this rule cleanly: SVG stroke reveal and gentle transforms are exactly the GSAP motion the system already allows.

---

## 2. Two tiers, and when each is allowed

We do not animate everything the same way. There is a cheap, editable, on brand workhorse, and there is an expensive hero moment used sparingly.

**Tier one, the workhorse: in app GSAP plus SVG, driven by data.** A component keyed by a string, handed a config object from the lesson or script row (exactly the interactive layer contract already written in lesson-format.md section 3.1). On brand because it uses the checker tokens and fonts. Tiny because it is vector and code, not video. Editable because changing a lesson is a database update, never a re render. Accessible because it is DOM and SVG we control. Reusable because one component built for one lesson is instantly available to all 45 and to every script. **This is the spine. Default to it.**

**Tier two, the hero moment: pre rendered character clips.** Eight to fifteen seconds of a real character (Higgsfield via the connected media MCP), used only for the three or four video beats in a flagship lesson where a living character lands harder than vector can. Costly to make, impossible to edit without a re render, so rationed. Never used for a script, never used for a concept a vector interactive can carry. A screenless twin is always described in the teacher and parent notes (the equity rule).

If a designer reaches for tier two and a tier one interactive would teach the same thing, they use tier one. Video is the exception, not the medium.

---

## 3. The one real dependency: a character system

Everything warm in the product leans on four characters who are currently emoji. Real animation needs them drawn as **layered SVG**: body, face, eyes, mouth, one arm, a prop, each on its own group so GSAP can bob them, blink them, gesture, and lip flap a speech line. Draw each of the four (Teo, Olga, Alma, DiGi Junior) once in two or three poses. That single asset set is the unlock for the character intro, the DiGi Junior pause, every lesson beat done in vector, and the script moment cards. Until it exists we animate with the current emoji as a stand in so the engine can be built and tested in parallel. **This is the critical path item and the one thing that needs a real illustrator or a controlled generation pass; flag it to JP as the first decision.**

Note the existing typo to fix while we are here: the character key is `alam` in CharacterIntro.tsx and should be `alma`.

---

## 4. The motion layers, smallest to largest

Four layers, each with a clear job. A lesson uses several; a script uses one or two.

1. **Transitions and reveals (every slide, already partly there).** Replace the plain opacity fade in SlidePlayer with GSAP: a staggered fade up of heading then body then options, a slide card that eases in, the progress bar filling with a spring. Subtle, fast, the private school polish. This is pure upgrade to what exists, no new data.
2. **Character beats (the warm layer).** The character bobs in, delivers a line in a speech bubble that types or fades word by word, gestures at the idea, hands over. Tier one vector by default, tier two clip for flagship hero beats. Driven by `video_beats` for clips and a new `character_beats` config for vector.
3. **Concept interactives (the teaching layer).** The GSAP components already specced but unbuilt: `feed-loop`, `verdict-sort`, `signal-meter`, `spread-race`, `class-tally`, `star-breath`. These ARE the lesson's teaching in motion. Built once, keyed from the slide row, work class paced on a projector and solo on a phone. Start with `star-breath` (it doubles as the DiGi Junior pause and the script breathing tool) and `verdict-sort` (reused across five modules).
4. **Delight and reward (the close layer).** The Celebration confetti on finishing, a star that fills as a lesson completes, the streak flame. Mostly built; extend to lesson completion.

---

## 5. Scripts get motion too (this is new)

A script is the parent's word for word line for a hard moment (the screen off handover, the morning rush, the sibling flare up). Motion helps a script in two specific, non gimmicky ways:

- **The moment card: a short silent looping vector animation that sets the scene**, sitting above the words. Six to ten seconds, on loop, no sound: the child on the device, the parent coming down to their level, the device going on charge downstairs. It shows the shape of the good version of this moment so the parent walks in holding a picture, not just a line. One reusable component, `script-moment`, keyed by a `motion` field on the script row with a small config (which beat, which characters). Content in the database, code in the app, rule six intact.
- **The breathing tool for in the moment use: the same `star-breath` component**, offered on any script tagged as a flashpoint, so a parent who is about to lose it can take the four second breath with the child before they speak. One component doing double duty across lessons and scripts.

Data change: add a nullable `motion` jsonb field to the `scripts` table (`{ "component": "script-moment", "config": {...} }`). Null means no animation, and most scripts stay null; we animate the twenty or so highest traffic flashpoints first.

---

## 6. The data contract (so nothing is hardcoded)

One shared shape everywhere, matching the interactive layer already in the spec:

```
{ "component": "<key>", "config": { ... }, "caption": "optional line" }
```

- Lessons store an array of these in the slide JSON (the eighth slide type, `interactive`) plus `video_beats` for tier two clips.
- Scripts store one in the new `motion` field.
- The component code lives in `components/lessons/interactives/` (today empty) and, for the script only pieces, `components/scripts/motion/`. A registry maps key to component so a new key is available product wide the moment it is written.

New keys require a decisions.md entry, never an improvisation, exactly as the slide grammar rule already says.

---

## 7. Performance and accessibility, non negotiable

- **Reduced motion**: every component renders a calm static end state, never blank. Test with the OS toggle on.
- **Lazy and off screen paused**: interactives mount only when their slide is active; loops pause when scrolled away or the tab is hidden.
- **Weight budget**: tier one vector plus GSAP is a few kilobytes; a tier two clip is capped and lazy loaded, poster frame first, never autoplaying with sound.
- **Mobile and desktop checked in Chrome DevTools before any of it is called done** (non negotiable 5).
- **Sixty fps or ship simpler**: if a beat cannot hold frame rate on a mid phone, it degrades to the static frame rather than stuttering.

---

## 8. Build order

1. **Decide the character art** (tier one vector set for four characters, two or three poses). Critical path. Everything warm waits on this, so start it first and build the engine against emoji in parallel.
2. **GSAP the SlidePlayer transitions and reveals.** Immediate polish, no art or data needed, upgrades every lesson at once.
3. **Build `star-breath` first**, because it is the DiGi Junior pause, the lesson pause beat, and the script breathing tool in one component. Highest reuse in the system.
4. **Build `verdict-sort` and `feed-loop`**, the two highest reuse teaching interactives, and wire them into the flagship lesson to prove the keyed data contract end to end.
5. **Add the `motion` field to scripts** and build `script-moment`; animate the top twenty flashpoint scripts.
6. **Render the three or four tier two hero beats** for the one flagship lesson only, via the media MCP, once the character look is signed off, and put them in front of JP with the red pen protocol from lesson-format.md.
7. **Then batch**: one interactive per remaining teaching need, one moment card per remaining flashpoint script, always keyed, never hardcoded.

---

## 9. Why this is the right shape

It gives Justin real, warm, premium motion without turning the product into a video library we cannot edit. The workhorse is vector and data driven, so it is cheap, on brand, accessible, and every piece built for one lesson pays off across forty five lessons and every script. Video is kept as a rationed hero moment, not the medium. It obeys the GSAP only rule, it keeps content in the database, and it points every animation at one job: teaching the idea or steadying the parent, never decoration. The character art is named as the one real dependency up front, so it is a decision made on purpose rather than a thing that quietly blocks the build.

---

## 10. First actions

1. Put the character art decision to JP (illustrator vs controlled generation, two or three poses each, layered SVG).
2. Fix the `alam` to `alma` key in CharacterIntro.tsx.
3. GSAP the SlidePlayer reveals and transitions (no dependency).
4. Build `star-breath` as the first shared interactive.
5. Claim the next migration number for the scripts `motion` field in the draft PR at build time, per the multi session rules.
