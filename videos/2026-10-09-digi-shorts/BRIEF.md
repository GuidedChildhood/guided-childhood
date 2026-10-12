# DiGi shorts: the hero and Short 1

12 October 2026. Built from the research panel's series plan
(`content/packs/2026-10-09-digi-shorts/series-plan.md`): nine videos, the hero
and Short 1 (the switch off fight) first.

workflow: product-launch-video
destination: Reels, TikTok, Shorts, Facebook Reels. 9:16 master, 1080 by 1920.

| Cut | Length | File |
|---|---|---|
| Hero: the one thing to do, and the words to say | 50.0s | `cuts/hero.json` |
| Short 1: the switch off fight (Coming off screens) | 32.5s | `cuts/short-switch-off.json` |

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
  script deck ("Try as deck" on every script page), through `app/ref-script-deck`.
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

## Second pass, 12 October: the script, the science, the tracking

Justin: the scripts should look Dr Becky level, it should look useful and easy,
show the system keeps going until it is ticked off and resolved, and show it is
based in science. What changed:

- **The script is the deck, not the page.** The product already reads a script
  Good Inside style: one card per step, a curved header band, "Step 1 of 4, Say
  this, Use these words tonight", then a flip to a Done face. The first cut
  zoomed the long script page to giant quote text, which was our framing, not
  the product. The deck is filmed instead (`scenes/script-deck.json`).
- **Why it works, with its sources.** The third card names the study (28
  families with children aged 1 to 5, 380 endings) and the RCPCH guidance, with
  gold underlines. It shows the text with the content fixes from the separate
  migration PR (the ages, and "let's"), so that PR must ship before posting.
- **The tracker rail** (`rail` in a cut, drawn by `build.mjs`): a film caption
  across the top that ticks Asked DiGi, The words, Checked in, Sorted as each
  real screen lands. It labels what the screens show; it is not an app screen.
- **Recorder:** `"anims": true` in a scene pauses every CSS animation and sets
  it to fake clock time each frame, so the 700 ms card flip films smoothly; a
  `scroll` action eases a page scroll over frames.
- The today path beat left the hero to make room; the timer beat is shorter.

## What the films do not claim

No push for the follow up (it is the check in line). No locked device (a
shared countdown). No promised outcome: the faces are labelled this parent's
own rating, the time markers illustrative.

## Known gaps

- Recorder caveat: without `"anims": true`, CSS animations run on the real
  clock between frames.
- The stage check worry step could not be filmed (too animation heavy), so it
  is two real stills, before and after the ticks.
- Wave one still needs Short 2 (first phone) and the timer film.
