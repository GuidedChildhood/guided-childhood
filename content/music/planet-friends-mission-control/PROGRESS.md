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
