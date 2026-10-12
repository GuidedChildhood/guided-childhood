# DiGi shorts: the hero and Short 1

12 October 2026. Built from the research panel's series plan
(`content/packs/2026-10-09-digi-shorts/series-plan.md`): nine videos, the hero
and Short 1 (the switch off fight) first.

workflow: product-launch-video
destination: Reels, TikTok, Shorts, Facebook Reels. 9:16 master, 1080 by 1920.

| Cut | Length | File |
|---|---|---|
| Hero: the one thing to do, and the words to say | 46.4s | `cuts/hero.json` |
| Short 1: the switch off fight (Coming off screens) | 30.3s | `cuts/short-switch-off.json` |

## How it is built

- **Every screen is the real product.** The ref-* preview pages render the
  live components with made up data. `tools/record2.mjs` films them frame by
  frame on Playwright's paused fake clock (typing, the real thinking lines on
  their real 2.2 second rotation, the reply streaming through the real
  renderer, the check in taps and their real outcome copy, the real timer
  counting to "Time for offline fun!"). `tools/capture.mjs` takes 5x stills.
  Only the server is stood in for.
- **Names.** The fixtures carry Justin's children's real names; `tools/names.js`
  swaps them for the film family (Ava, 9, and Sam) before any frame exists.
  Scene files may also relabel their own fixture data (`swap`), never product
  copy. The script beat shows free script 9671's verbatim text in the real
  script component.
- **DiGi's reply is illustrative and labelled.** Written to the live rails in
  `lib/digi/system.ts` (under 120 words, two bold lead ins, Tonight last, one
  script link, the check in and check back lines the tool rules require).
- **The camera.** `build.mjs` lays each recording on a screen layer and frames
  it at a scale, so 16 px UI reads at 47 to 72 px on a vertical frame. Move,
  then hold. `tools/where.mjs` measures where any text sits.
- **DiGi** on the end card is the approved Kling idle loop (job dc3673e0) of the
  product's 3D star. One gold detail per frame, so the button is ink.
- **Sound.** Justin's Pixabay leberch track, lifting on the timer beat;
  synthesised cues; final audio loudness normalised to about minus 15 LUFS.

## What the films do not claim

No push for the follow up (it is the check in line). No locked device (a
shared countdown). No promised outcome: the faces are labelled this parent's
own rating, the time markers illustrative.

## Known gaps

- Recorder caveat: CSS keyframe animations run on the real clock between
  frames; nothing in these cuts depends on one.
- The stage check worry step could not be filmed (too animation heavy), so it
  is two real stills, before and after the ticks.
- Wave one still needs Short 2 (first phone) and the timer film.
