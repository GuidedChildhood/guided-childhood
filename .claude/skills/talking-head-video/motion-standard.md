# The motion standard: as good as Nate's, in butter and ink

Justin, 29 September 2026: "I want the motion graphics to be as good as
Nate's." Nate's quality is not luck and not the model. It is a written standard
(`hyperframes-student-kit/MOTION_PHILOSOPHY.md`, eleven laws) and a reel grammar
(`hyperframes-student-kit/.claude/skills/motion-showreel/SKILL.md`), checked
against every build with frame strips before anyone calls it done. This file is
the same standard translated to our brand. Read it before Step 5 of the pipeline
and check every video against section 4 before Step 7.

Where Nate's rule and ours differ, ours wins, because his audience wants energy
and ours is a tired parent at 11 o'clock. The craft is the same. The register
is not.

## 1. The eleven laws, ours

1. **One idea per beat, cut clean.** A beat is 1.5 to 2.5 seconds (Nate cuts at
   1.5; parents need the extra half second). If a scene says two things, split
   it. Big text, few words.
2. **Cream is the canvas.** Most of every frame is cream `#FFFBEE` or white.
   Negative space is the design. Never a busy frame.
3. **Paper and ink, not light.** Nate lights his frames with chrome and halos.
   We are a picture book: flat ink type, white cards with the 3px ink outline
   and the hard offset shadow. The only glow in the whole brand is the DiGi
   star, used once per video, at the hero moment.
4. **Something is always moving, and every move is finite.** A pathway line
   draws, a star settles, a card lands. Never a static dump, never a loop.
   HyperFrames is seeked frame by frame, so every bit of life is a finite tween
   over the hold (no `repeat`, no `yoyo`, no `Math.random`, no `Date.now`).
5. **Every cut hides inside motion.** A butter streak, a card that pushes the
   last one off, a zoom through a word. Never a bare fade between beats.
6. **Object metaphors carry the meaning, and they return.** The star is earned
   time. The passport page is progress. The pathway line is the road from first
   screen to sixteen. The five Planet Friends are the five ages. The same star
   returns at least three times in any video over twenty seconds.
7. **Five hues, each with a job.** Ink `#1A1A2E` is truth. Butter `#EDC35F` is
   action and earning (buttons, stars). Butter dark `#C99A28` is the shadow and
   the marker. The stage tints (sky, mint, lavender, peach, butter tint) are
   the ages, one each, never mixed. White is the card. Nothing else, ever.
8. **Type is a character.** Nunito 900 scales up to eight times, tracks tight
   from wide, swaps in place, splits and slides. Sentence case, never Title
   Case, never all caps except the mono eyebrows. No gradient fills (they
   render invisible in capture anyway). Emphasis is size and a butter marker
   sweep, not colour.
9. **Hold the hero.** The star bloom holds two seconds. The end card (the stage
   check hook) holds four seconds or more. Motion, then stillness, is the
   catharsis.
10. **One unifying texture.** A faint ink dot grid (5 percent) on cream, corner
    crop marks, hand drawn outline stars at the edges, and the mono HUD line.
    Present in most frames so the piece reads as one film. Paper grain at 3
    percent, no vignette (cream does not vignette; it just goes grey).
11. **Timelines fill their slots.** Every sub composition ends with
    `tl.to({}, { duration: SLOT }, 0)` so it can never go dark early.

## 2. The reel grammar, ours

- **One motif, transformed.** The DiGi star. It opens the video as a dot, becomes
  the marker on the pathway, the fill of the button, the stamp on the passport,
  and lands as punctuation in the final lockup. A transition should turn the
  current object into the next one; hard cuts are for the flurry only.
- **Chapters, labelled in the HUD.** Mono eyebrow, uppercase, tracked 0.2em,
  about 16px: `01 · THE FIGHT`, `02 · THE THIRD WAY`, `03 · THE REAL THING`,
  `04 · YOUR STAGE`. Our words, never craft jargon.
- **Show the work with the real thing.** Nate overlays physics readouts and
  bezier panels. Our tool overlay is the live product: the star bank, a
  passport page, the stage check question. Real screens, never rebuilt.
- **Persistent HUD.** Crop marks in the corners, `GUIDED CHILDHOOD` top left,
  a spec line top right (`1920 × 1080 · 60P`), and along the bottom the age
  ruler `4 · 7 · 10 · 12 · 15 · 16` as the progress bar, with the star as the
  playhead. That ruler is the whole product in one line, and it is unmistakably
  ours.
- **Value flips at every chapter.** Cream, then ink (the one dark frame), then
  cream, then a butter tint. One held back colour appears only at the climax:
  the full butter field behind the star bloom.
- **Cut on a grid even in silence.** Most of our videos have no music, so the
  grid is 0.5 seconds. Every cut, flash and flip lands on a grid line. When a
  HeyGen bed exists, measure its BPM and cut to the kick.
- **Accelerate, then hold.** Roughly three quarters development, a short flurry
  (three to six half second cuts of real product moments), then the resolve on
  the hook. The hook never moves once it lands.
- **Density breathes.** One word, then five friends, then two screens, then one
  star, then the flurry, then one line.
- **Three type voices.** Nunito 900 for statements, Nunito 600 italic for the
  parent's own words (quotes from the research), IBM Plex Mono for the machine
  layer (HUD, ages, URL).
- **Physical finish, paper edition.** Squash and stretch on the star only,
  motion blur on the streaks, 3 percent grain, hard shadows, no bloom, no
  chromatic fringe.
- **Bookend.** Opens on the star as a dot. Closes on the lockup: the rule draws,
  the hook types on with a block cursor, the star lands as the full stop with
  a squash, the URL arrives last.

## 3. Recipes we reuse

- **Dot grid ground:** `repeating-radial-gradient` ink at 5 percent, 48px
  pitch, on cream, its own full duration clip on track 0. Parallax by tweening
  `backgroundPosition` a few pixels over the frame, finite.
- **Butter streak whip:** a blurred butter bar, `xPercent -150 → 250`, 0.35s
  `power3.in`, fired at the cut; the next beat starts at its peak.
- **Word reveal carrier:** first word slides 360px, tail words decay 120, 60,
  25, 12px; carrier `expo.out` 0.33s, tail `power2.out` 0.2s. On a talking head,
  anchor to the transcript word onsets and lead the visual by 0.2s.
- **Cut the curve:** exit `y: -150, blur 30px, 0.33s power2.in`; entry from
  `y: 150, blur 30px` to rest over 1.0s `power2.out`, same direction both
  sides, velocity matched.
- **Star squash landing:** `scaleX 1.2 / scaleY 0.8` at contact, settle
  `power3.out` 0.4s. The one playful overshoot allowed per video.
- **Marker sweep:** a butter highlight drawn left to right under the key word,
  0.4s, `power2.out`.
- **Eases:** enter `power2.out` or `expo.out`; exit `power2.in`; camera
  `power2.inOut`; never `bounce`, never `elastic` (Nate uses them, our register
  does not). Declare ease and duration on every tween, no `gsap.defaults()`.
- **Tween comments name the seam:** every entry comment names the exit it
  matches in the neighbouring beat. If you cannot name it, the seam is not
  designed.

## 4. Pre flight, before anyone says "done"

- [ ] Average beat 1.5 to 2.5s in the middle; no dead air over 1s outside a
      deliberate hold
- [ ] Every cut rides motion; no bare fades
- [ ] Five hues at most, each with its job; no colour without a meaning
- [ ] Type is flat ink or white; no gradient fills; sentence case
- [ ] Dot grid, crop marks and the mono HUD in most frames; the age ruler
      progresses
- [ ] The star returns at least three times (videos over twenty seconds)
- [ ] The hook holds four seconds or more and never moves once landed
- [ ] Every timeline ends with the slot anchor; the duration diagnostic shows no
      composition shorter than its slot
- [ ] Every tween end snaps to a frame boundary (multiples of 1/60)
- [ ] `lint` and `check` clean; contact sheet read at every beat entry and
      every cut
- [ ] Ten frame strips across every transition, viewed:
      `ffmpeg -i render.mp4 -vf "select='between(n\,440\,449)',scale=384:-1,tile=layout=5x2" -frames:v 1 -fps_mode passthrough strip.png`
- [ ] The brand test: six random frames, HUD covered, each reads as Guided
      Childhood
- [ ] No dashes anywhere on screen. Ages as "4 to 16". No claim without a
      proof path.

## 5. What we do not copy from Nate

- Black canvas, chrome type, halos, glass cards. Ours is paper.
- 1.5 second cuts throughout. Ours breathe at two.
- `repeat: -1` breathing and drift. Ours is finite, because the render seeks.
- Generated people, generated product shots, other brands' assets.
- A different Google font per beat. We have two families and that is the point.
- Music as the spine, until HeyGen is signed in. Silence and captions until
  then.

## 6. How we get better each time

The first intro (`videos/guided-childhood-intro/`) was built before this file
existed and fails five checks in section 4: no HUD, no dot grid, the star
appears once, bare crossfade into frame 4, and no frame strips. It is the
baseline. Each video after it is measured against this list, Justin's one line
of feedback goes into SKILL.md under Learned, and the list grows only when he
says the same thing twice.
