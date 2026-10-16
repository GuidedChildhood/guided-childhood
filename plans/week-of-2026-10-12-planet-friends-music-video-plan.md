# Planet Friends (Mission Control): the song and the music video

Written 16 October 2026. Re-read after any compaction. The progress log for the
song is `content/music/planet-friends-mission-control/PROGRESS.md`.

## What Justin asked for (16 October)

1. Cut the instrumental tail off the end (first read as a vocal split, which
   was also made). `trim_tail.sh` does it on every draft now.
2. Rewrite the lyrics so each Planet Friend raps the lessons they front in the
   schools build, plus a verse on every service Guided Childhood offers.
3. Make the chorus a better Guided Childhood philosophy reference.
4. A music video of the Planet Friends with motion graphics, in the look of a
   virtual band film (inked comic grit, night palette, band cuts).

5. Three sounds, all kept: breakbeat with sweeping strings, an atmospheric
   anthemic instrumental, and old school jazz. Several versions so the friend
   verses can be cut into shorts. No real artist or song name goes in a prompt
   and every melody stays original (style.txt rules).

## The lyric rewrite (done, awaiting Justin's ear)

- One verse per friend, sourced from `shared/schools-curriculum.ts`:
  Pebble (EYFS and KS1: real or pretend, the screen never says stop, paws off,
  private like a toothbrush, who is on the other side), Bloop (KS2: routines,
  gaming time and spend, privacy, kind and safe, my work and theirs, stay the
  maker, why thirteen), Orbit (KS3: mood, workarounds, deepfakes, scams, AI as
  a friend, doing my thinking, who owns what you make, when it turns on you),
  Nova (KS4: persuasion, the money and the odds, readiness at 16), Cosmo (KS5:
  AI mastery and data rights, identity and future of work, the Passport).
- Every friend line uses that friend's canon from `digi-squad/README.md` (prop,
  running joke, when wrong line). No friend raps a DiGi only topic (sextortion,
  consent and images, radicalisation, bodies and image, the content you did not
  go looking for): those are safeguarding decisions.
- The services verse: stage check, ten minutes a day, DiGi (never yes or no),
  scripts, jobs to stars to minutes, the paper chart, the check in faces, the
  quest board, the school letter snap, the homework decoder, device guides, The
  Guided Planet, the schools app. Each has a proof path in THE-STORY.md section 6.
- The chorus now carries philosophy commitments 1 to 3: the open door, not a yes
  not a no, connection is protection, step by step to sixteen.
- The TRUST verse was cut for length (song is now about four minutes). It is in
  git history if Justin wants it back.
- Cosmo now fronts KS5 lessons 20 and 21, so the open question "does Cosmo rap"
  is answered yes. The visual system still says Cosmo fronts no lesson; stale.

## The music video

### Look (needs Justin's yes on a style frame before the full build)

A night version of the house system, so it reads as a virtual band film and
still as Guided Childhood:

- Canvas: `--ink` #1A1A2E and espresso #2E2818, never a purple gradient.
- Each friend lit in their own accent from the visual system section 4, one
  friend per verse, as a coloured spotlight and halftone wash.
- Treatment over the APPROVED cutouts only (`public/digi-squad/friends/*.png`
  and the mood stills): a thick ink outline, a halftone shadow, paper grain,
  slight misregistration on the beat, comic panel frames for the band cuts.
  Never a regenerated or restyled character (visual system section 1).
- Type: Nunito 900 for the lyric hits, IBM Plex Mono for the friend name plates
  and lesson labels, set like stencilled flight cases. No marker or hand lettered
  face (visual system section 5), so the grit comes from texture, not the font.
- The gold pathway appears once, in the services verse, ending at the stage check.
- The artist the look nods to is never named in any public copy or prompt.

### Structure, timed to the final audio

| Section | Picture |
|---|---|
| Intro | Five name plates flicker on, a radio dish, "Planet Friends!" |
| Verse 1 (mission control) | All five in comic panels, the bridge you can cross |
| Chorus | Band line up, call and response hits, the open door |
| Pebble | Yellow spotlight, the upside down book flips, lesson titles as stickers |
| Bloop | Green, the controller, the missing piece found in a sock |
| Orbit | Blue, the oversized magnifier over a fake prize card |
| Nova | Purple, notification cards pile in and get moved aside |
| Cosmo | Orange, the checklist folds small, the Passport stamp |
| Bridge | Big type, NOT A BAN / IT'S A PLAN / STEP BY STEP |
| Services | Real product screens in panels (never invented), the gold path |
| Outro | Ends on the stage check: three questions, no sign up |

### Build route

HyperFrames (house default, GSAP only, no Three.js), 1920 by 1080 master plus a
1080 by 1920 vertical cut. Lyric timings from a transcription of the final mix.
Product screens are real captures per the product-shorts rule. A 10 second style
frame first, then the full film once Justin picks the look.

## Order of work

1. Generate the song with the new lyrics (seed 42, 240 seconds). Justin listens.
2. Style frame: the Pebble verse, 10 seconds. Justin says yes or adjusts.
3. Full film, landscape then vertical. Review against review.md, then Drive.
4. Shorts: each friend verse (about 25 seconds) plus the chorus as its own
   vertical short, from whichever sound Justin picks per short, ending on the
   stage check.

## Built (16 October)

- Jazz take leads (86 percent of lyric words clear in a speech recognition pass,
  clearest on Nova, Cosmo and the bridge). Breakbeat is the backup, the
  instrumental is the bed for parent facing films, the storyteller Orbit verse
  is a standalone short.
- `build.py` plus `film.tpl` generate `index.html` (16:9) and
  `vertical/index.html` (9:16) from `lyrics-timed.json` and `audiomap.json`.
  One `parentCta` variable: true ends on the stage check card (parents), false
  ends on "Planet Friends, step by step to sixteen" (schools, in app).
- `make_shorts.sh` cuts a vertical short per friend verse with the stage check
  card fading in over its last 3.5 seconds.

## How to use it (Justin asked, 16 October)

Best job: the theme tune that makes the Planet Friends memorable, every line a
real lesson or service. In order of value:

1. Schools. Each friend's verse opens that friend's lessons in the schools app,
   the full song for assemblies. Schools version only (no sign up ask).
2. Shorts on the family Instagram and Facebook, TikTok, Reels and Shorts: one
   friend per short, ending on the stage check. Parent version.
3. In the child app: the song when a Planet Friend is earned. Schools version.
4. YouTube: the full film (parent version). One LinkedIn post from Justin on
   why every line is a lesson, via content-engine, never an ad.

Rules: children facing cuts carry no call to action (UK CAP code on direct
exhortation of children); descriptions say "made with AI music" (the ACE-Step
licence asks for disclosure; it is MIT, commercial use allowed).
