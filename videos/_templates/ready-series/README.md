# "Ready, one worry at a time": the series template

One parent worry per episode, about a minute, the same cartoon family as
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
   using the times the build writes to the episode's `score.json` (voice at
   DiGi's plan, lift at how it works, return at sorted, hold at the end card).
   The licensed track replaces it when there is one.
5. Render from the episode folder:
   `npx --yes hyperframes@0.8.82 render . -o renders/<name>.mp4`. Kill stale
   `hyperframes` processes first.

## Beats (template v2)

Every episode tells the same four stage story, shown in a strip along the top
of every beat: **The worry, DiGi's plan, How it works, Sorted**, with a day
stamp ("Night 1, 9:14pm", "Night 5", "Ten years on") so the viewer sees when
the advice lands and how long it takes to work. Each beat has one focus and
one caption place, under the focus, centred.

| kind | fields | job |
|---|---|---|
| hook | step, stamp, clip, quote, source | the worry, quoted, over the footage |
| shot | step, stamp, clip, line | footage full frame, one caption |
| chat | step, stamp, me | the parent's question to DiGi, typing dots |
| chat | step, stamp, plan: true, digi[] | DiGi's plan as numbered steps, each written "Tonight: the words" |
| screen | step, stamp, screen, y, h, line | one REAL product screen in a phone, centred |
| screen | step, stamp, rec, line | or a screen recording (mp4) from `recordings/` |
| end | none | the logo and the stage check |

Any beat may set `d` (seconds), `off` (source offset) and `origin` (push in
point). The build refuses a dash, a caption over eight words, a DiGi line over
eighteen words, a beat shorter than its words take to read at 2.6 words a
second, and a beat without a step and a stamp. An episode's `needs` list says
what is still missing before it can be cut.

## Rules from Justin, 12 October

- **The child starts at nine or older.** A younger child with a screen looks
  like we encourage screens too young.
- **The hook is the worry in a parent's own words, with no source named.** No
  Mumsnet, no survey on screen.
- **DiGi's plan is DiGi's real advice.** Take it from its own scenario in
  `digi/06-scenarios.md` (name it in the episode's `needs`), and run the
  question as an eval case (`lib/digi/evals.ts`, `runCase`) against live DiGi
  before finals. Never write advice for DiGi that its playbook does not give.
- **No backing track.** Episodes build without music; Justin adds the track in
  the edit. Leave `music` out of the episode.

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
("Approve the stars", but it names Teo, so leave it out), `kid-deal.png` ("One star is worth 5 minutes"),
`kid-five.png` (her five a day), `kid-day-done.png`, `concern-scale.png` (crop above the "Teo" label),
`child-deal.png` (the child's deal, heading cropped), `digi-followup.png`
(DiGi checking back five nights on, from `tools/capture-followup.mjs`).

Recordings of the real child app (`tools/record-child.mjs`) scroll only and
never tap, because a tap ticks a real job on a real account. They stay out of
git (`recordings/` is ignored), and the child's name is cropped before use.
