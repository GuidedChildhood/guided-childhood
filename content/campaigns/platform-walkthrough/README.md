# The walkthrough campaign

Twenty posts that walk through the three platforms, one service a post, each
ending on one free step. **Drafts only.** Nothing is posted, scheduled or
spent until Justin says yes in chat.

- The plan, the strategy, the calendar and the decisions: `plans/week-of-2026-11-09-walkthrough-campaign-plan.md`
- The review page Justin was sent: https://claude.ai/artifact/VzV9qtvPqDJRYsZmhQEj89
- One file per post here, `01` to `20`: hook, script or slides, a caption per channel, the visual brief, the proof and the checks.

## What is built

All 20, as of 10 November. Each folder under `built/` is named for its post.

| Posts | What | How to make it again |
|---|---|---|
| 01, 04, 07, 16, 19 | Parents Reels, 29 to 34 seconds | `cd videos/2026-10-09-digi-shorts && sh tools/render-both.sh walkthrough-04` (and `-01`, `-07`, `-16`, `-19`), then level the sound with `loudnorm=I=-16:TP=-1.5` |
| 12 | Film 10, reused, with a new cover | The film is in `content/packs/2026-10-09-digi-shorts/films/`. The cover: `node tools/social-cards/render.mjs content/campaigns/platform-walkthrough/built/decks/12-cover.json` |
| 05, 09, 10, 14, 17, 18, 20 | Parents carousels and cards | `node tools/social-cards/render.mjs content/campaigns/platform-walkthrough/built/decks/<deck>.json` |
| 02, 06, 11, 15 | Schools carousels and PDFs | `node content/campaigns/platform-walkthrough/built/decks/render.mjs <02-schools or 06-schools or 11-schools or 15-schools> <out folder> --pdf` |
| 03, 08, 13 | Playlists cards and carousel | `node tools/tsb-playlist-card/render.mjs tools/tsb-playlist-card/decks/walkthrough-0<1 to 3>-*.json` |

All of it renders free. Nothing in this folder used an image or video model.

## Where the screens come from

| Folder | What | Made by |
|---|---|---|
| `built/screens/` | Parent and child screens, the film family's names | `built/screens/capture.mjs`, against the local dev server's reference pages |
| `built/screens-schools/` | The public schools site | `built/decks/capture-schools.mjs`, against the live site |
| `built/screens-live/` | Six pages of the live parent app that no reference page shows | Captured in Justin's signed in Chrome on 10 November, names swapped on the page first, family data cropped out. To redo one, he signs in and the same swap runs before the capture |

## The rules these drafts were written to

- Every screen is the real product. Parents screens come from the reference
  preview pages with the film family's names. Schools screens are captures of
  the public live site (`built/02-schools-the-lesson-is-written/screens/`).
- One free step a post, and only the free step. Only the stage check says
  "no sign up".
- No dashes in any copy: `node scripts/check-ai-tells.mjs content/campaigns/platform-walkthrough`
- A proof block at the foot of every draft. If the proof path has moved, the
  post waits.
- No founder scenes. Those belong to the founder journey posts.

## Before any of it goes out

1. Justin's yes on the look, the numbering, the dates and the ask ratio (section 9 of the plan).
2. The tracked links made on Admin, Film links (section 8 of the plan).
3. For each film: the marketer review and feedback filter pass from `product-shorts`.
4. For each playlists post: Justin's phone check of the sign up buttons.
5. A row in `content/brand-story/posted-log.md` the day something publishes.
