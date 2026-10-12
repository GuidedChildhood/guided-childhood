# "Ready, one worry at a time": the series template

One parent worry per episode, about forty seconds, the same cartoon family as
the hero film `videos/2026-10-12-ready`. The plan, the five worries and why
this shape is in `plans/2026-10-12-ready-series-plan.md`.

## Make an episode

1. Copy an episode folder (start from `videos/2026-10-12-ready-ep1-bedtime`)
   to `videos/<date>-ready-ep<n>-<worry>/` and edit its `episode.json`.
2. Put the clips it names in its `assets/`. Reuse "Ready" footage first
   (`videos/2026-10-12-ready/assets/s01.mp4` to `s13.mp4`, slowed copies by
   `ffmpeg -vf setpts=1.9*PTS` when a chat needs longer). New shots go through
   Higgsfield with the girl reference `videos/2026-10-12-ready/refs/girl-ref.jpg`
   (media id in that film's treatment), and only after Justin says yes to the
   credit cost.
3. Build: `node videos/_templates/ready-series/build.mjs <episode.json>` for
   16:9, add `--vertical` for 9:16. Each writes the episode's `index.html`, so
   build and render one orientation at a time.
4. Score: fit the guide piano to the beats with
   `node videos/_templates/ready-series/tools/guide-score.mjs <out.wav> '{"len":..,"voice":..,"lift":..,"hush":..,"ret":..,"hold":..}'`
   (voice at the chat, lift at the first screen, return at the first payoff,
   hold at the end card). The licensed track replaces it when there is one.
5. Render from the episode folder:
   `npx --yes hyperframes@0.8.82 render . -o renders/<name>.mp4`. Kill stale
   `hyperframes` processes first.

## Beats

| kind | fields | job |
|---|---|---|
| hook | clip, quote, source | the worry, quoted, under four seconds |
| shot | clip, age, line | the moment, with a caption |
| chat | clip, me, digi[] | the DiGi chat, drawn like `DigiChat.tsx` |
| screen | clip, screen, y, h, tag, line | a REAL product screen in a phone over the blurred clip |
| payoff | clip, age, line | the same family, older, doing it themselves |
| end | none | the logo and the stage check |

Any beat may set `d` (seconds), `off` (source offset) and `origin` (push in
point). The build refuses a dash, a caption over nine words, a DiGi line over
twenty two words, and a beat too short for its words.

## Real screens only

`screens/` holds captures of the running app at phone width, taken by
`tools/capture.mjs` from the `/dev` and `/ref` preview pages (they 404 in
production, so run the app locally, see the worktree node_modules note).
`y` and `h` crop a capture in pixels at three times density, so a beat shows
one card, not a whole page. Never mock up a screen, never generate one. If a
screen the story needs has no preview page (the bedtime "Screens are resting
now" banner, a live countdown), add a `/ref` page for it first.

Useful captures: `kid-ask.png` (the child's timer, "What screen?"),
`kid-ask-gate.png` ("Phone charges outside the bedroom first. Then screens."),
`device-time-popup.png` (the parent's Yes or Not now), `ask-first-child.png`
("Waiting for their yes", "They said yes!"), `notification-cards.png`
("Approve the stars"), `kid-deal.png` ("One star is worth 5 minutes"),
`kid-five.png` (her five a day), `kid-day-done.png`, `concern-scale.png`.
