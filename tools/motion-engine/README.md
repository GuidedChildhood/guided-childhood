# The Guided Childhood motion engine

Installed 16 November 2026. Turns one Claude reviewed research story into two
LinkedIn assets: a 1080 by 1350 PNG and a 1080 by 1350 MP4 at 30 fps, about 14
seconds. Remotion 4.0.539, React 19, TypeScript, FFmpeg. Its own package, so the
Next app is untouched.

## Where it sits

| Before it | The engine | After it |
| --- | --- | --- |
| The research register: a record with `claudeStatus` CLAUDE REVIEWED, a SHIP or EDIT verdict, cleared figures and a GDC number from the post register | `build-spec`, a person edits, the gate, `render`, `check` | `record` hands the files to `scripts/radar/assets.mjs`. The afternoon run copies them to Drive as it already does. The Metricool handoff is unchanged and its permissions still default to no |

The engine never claims a GDC number, never changes a record's visual
decision, never writes a Metricool handoff, never posts and never schedules.

The hand built HyperFrames films (for example
`content/packs/2026-11-11-gdc-058-motion/`) are a separate lane and stay as
they are. This engine is the templated research card.

## The steps, for one approved story

From `tools/motion-engine/`, after `npm install` once:

1. `node scripts/build-spec.mjs <researchId>` writes a draft to
   `content/motion/GDC-NNN/spec.json`, every word taken from the record. It
   refuses a record that is not Claude reviewed, has a HOLD or REJECT verdict,
   or has no GDC number. It never overwrites an existing spec.
2. A person shortens the draft to fit the card and sets `"draft": false`. The
   build prints what the gate will refuse.
3. `node scripts/render.mjs ../../content/motion/GDC-NNN/spec.json` runs the
   gate, then renders `gdc-NNN.mp4` and `gdc-NNN.png` beside the spec.
4. `node scripts/check.mjs ../../content/motion/GDC-NNN` measures the result.
5. `node scripts/record.mjs ../../content/motion/GDC-NNN --verdict PASS --review "what is on screen"`
   records both files on the story, as optional assets.

## What the gate refuses

- A record that is not CLAUDE REVIEWED, or a verdict other than SHIP or EDIT.
- A GDC number that does not match the record.
- Any number on the card that is not in the record's cleared figures.
- Causal wording ("causes", "leads to", "harms" and the like). Say what was
  found. A person may only change this when the design shows a cause.
- Wording the review marked not quotable.
- A missing source or limitation.
- Any dash, and any field too long to fit.
- More than 55 words on the card.

`npm test` runs sixteen cases, one per rule.

## What the check measures

Format (1080 by 1350, 30/1, H.264, yuv420p, silent), every frame decoding, the
index at the front of the file, the PNG size, that nothing moves after every
word has landed (frame 154), at least five seconds to read the finished card,
no one frame jumps (a stutter or a flicker), that the PNG matches the film's
last frame, and the contrast of every text colour against the darkest part of
the canvas (4.5 to 1 or better). It writes `check-report.json`.

## The look

Warm ivory canvas with a fixed paper grain, deep navy Nunito, IBM Plex Mono
labels, one restrained gold rule. Words rise a few pixels and fade, on one soft
easing with no overshoot. Type is never scaled, rotated or blurred, and once a
word lands its transform is removed, so it rests on whole pixels. Every word has
landed by about 5 seconds, then only the light drifts for the remaining 9.
Colours come from `shared/tokens.css`; the warmed ivory and the darker gold ink
for words (the token gold dark is 2.3 to 1 on ivory, too faint to read) are
explained in `src/theme.ts`.

## Footage and objects (Higgsfield and Seedance)

The card takes two optional picture layers, both behind an ivory wash so the
type always reads:

- `backgroundVideo`: a silent, text free plate in `public/plates/`.
- `objectImage`: a transparent PNG in `public/objects/`, for a 3D object.

How to brief and make them, and what to never ask for, is in
`higgsfield-plates.md`. Nothing is generated without Justin's yes, because it
spends credits.

## The demonstrations

`specs/demo-not-for-publication.json` and
`specs/demo-layers-not-for-publication.json` render placeholder cards with a
red NOT FOR PUBLICATION band and watermark. They go to `out/`, which git
ignores. `npm run demo` renders and checks the first. Before the layers demo,
run `npm run prepare-demo` to copy in its test object.

## Rendering here and on a laptop

In the cloud container the renderer uses the installed Playwright headless
Chrome. On a laptop Remotion fetches its own the first time. Set
`REMOTION_BROWSER` to use a particular one. A 14 second card took about four
minutes in the container, with lossless frames.
