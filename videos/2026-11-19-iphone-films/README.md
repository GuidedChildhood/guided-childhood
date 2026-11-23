# iPhone service films

1. Record a real screen: `DEV=http://localhost:3000 DPR=2 PLAYWRIGHT_DIR=<repo>/node_modules/playwright/index.mjs node tools/record2.mjs scenes/<name>.json` (the frames land in `renders/rec/<name>/`). The same scene format as `videos/2026-10-09-digi-shorts`, plus `jsclick` for a control below the fold.
2. Cut a film: `node render.mjs films/<film>.json`. Segments choose a recording, a start time and a duration, the headline, and camera keys (`s` scale, `fy` focus in app pixels, `up` lift). `shift` hides a fixture caption at the top. Add `--frames 30,300` for stills only.
3. Output: `out/<film>.mp4`, 1080 x 1920, 30 fps, a silent track. The trending sound is added at upload.

Fixture pages carry real family names in places; `tools/names.json` swaps them in text, but not in typed input values. Check every frame before posting.
