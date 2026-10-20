# Planet Friends (Mission Control): progress log

Pick up from any device: read this, then the latest phase section.

## Phase 0: sync with the build (15 October 2026)

Done, waiting on Justin's sign off of the lyric diff.

- Cast swapped in: Pebble, Bloop, Orbit, Nova, Cosmo (five, not four). Lines
  redistributed by stage and register in mic_map.md.
- Every product claim checked against the code. TRUST letters match /join word
  for word; Passport to Sixteen, jobs earning screen time, snapping a school
  letter (lib/school/extract.ts) and the schools app are all shipped.
- Changed: the chorus question (too close to a famous film theme hook), WiFi
  without the hyphen (the dash rule), and the outro now ends at the stage check.
- Style prompt now asks for five rappers.

Open questions for Justin: does Cosmo rap (he fronts no lesson yet), and the
optional lines in the PR body.

## Phase 1: setup

Not started. This cloud container has no GPU (4 CPUs, 15 GB RAM), so ACE-Step
cannot run here in useful time. Route: a hosted endpoint, or Justin's own
machine if it has an NVIDIA GPU or Apple Silicon.

## Sample attempt (15 October 2026)

Higgsfield makes speech only, no music. The free ACE-Step 1.5 demo on Hugging
Face works with no cost, but anonymous runs from this machine hit its limit.
`make_sample.py` is ready: add a free Hugging Face Read token as `HF_TOKEN` in
the environment settings, start a new session, and say "make the sample".

## Sample attempt 2 (16 October 2026, Justin's Mac)

The Mac's system Python is 3.9, too old for the current Gradio client, so
`make_sample.mjs` does the same call from Node. The first anonymous run reached
the demo, which aborted the GPU task and spent the anonymous quota for 24 hours.
A free Hugging Face account fared no better: the demo aborted again and the
daily allowance (each run books 180 seconds) was gone.

## Phase 1 done: it runs on Justin's Mac (16 October 2026)

First draft made locally: `outputs/planet-friends-sample-seed-42.mp3`, 3 minutes,
95 BPM, B minor. Free, no daily limit, about 8 minutes a song on the M5.

- uv installed (`~/.local/bin/uv`), ACE-Step 1.5 cloned into `ACE-Step-1.5/`
  (gitignored), `uv sync` done, models in `ACE-Step-1.5/checkpoints`.
- The 1.7B lyric model plus the turbo DiT ran out of memory on 16 GB. The 0.6B
  lyric model with both offload flags fits; `local_sample.py` sets all of it.
- Another draft: `cd ACE-Step-1.5 && uv run python ../local_sample.py <seed> >
  sample.toml && rm -f instruction.txt && yes "" | uv run python cli.py -c
  sample.toml`. The mp3 lands in `outputs/`.

Next: Justin listens and picks a seed, or asks for more seeds.

## Phase 2: new lyrics, three sounds (16 October 2026)

- Lyrics rewritten: a verse per friend from the lessons they front in
  `shared/schools-curriculum.ts`, a services verse, and a chorus on the
  philosophy (the open door, not a yes not a no, connection is protection, step
  by step to sixteen). TRUST verse cut for length; it is in git history.
- Cosmo raps: he fronts KS5 lessons 20 and 21 now, which settles that question.
- Three sounds kept side by side, each a section of `style.txt`:
  breakbeat with sweeping strings (MAIN, 88 BPM), the atmospheric anthem
  (INSTRUMENTAL BED, no vocals) and old school jazz (JAZZ, 94 BPM). Justin wants
  several versions so the friend verses can be cut into shorts.
- `make_track.sh <vocal|instrumental|jazz> <seed> <seconds> <name>` makes one,
  and `trim_tail.sh` cuts the instrumental tail (Demucs finds where the vocals
  stop). Files: `outputs/planet-friends-<sound>-...-trimmed.mp3`.
- Music video plan: `plans/week-of-2026-10-12-planet-friends-music-video-plan.md`,
  project `videos/2026-10-16-planet-friends-mission-control`.
