# The walkthrough campaign

Twenty posts that walk through the three platforms, one service a post, each
ending on one free step. **Drafts only.** Nothing is posted, scheduled or
spent until Justin says yes in chat.

- The plan, the strategy, the calendar and the decisions: `plans/week-of-2026-11-09-walkthrough-campaign-plan.md`
- The review page Justin was sent: https://claude.ai/artifact/VzV9qtvPqDJRYsZmhQEj89
- One file per post here, `01` to `20`: hook, script or slides, a caption per channel, the visual brief, the proof and the checks.

## What is built

| Post | What | Where | How to make it again |
|---|---|---|---|
| 01 | Reel, 30 seconds | `built/01-the-plan-in-thirty-seconds/` | `cd videos/2026-10-09-digi-shorts && sh tools/render-both.sh walkthrough-01`, then level the sound with `loudnorm=I=-16:TP=-1.5` |
| 02 | Carousel, 8 pages and a PDF | `built/02-schools-the-lesson-is-written/` | `node content/campaigns/platform-walkthrough/built/decks/render.mjs 02-schools <out folder> --pdf` |
| 03 | Card | `built/03-playlists-who-chose-the-next-one/` | `node tools/tsb-playlist-card/render.mjs tools/tsb-playlist-card/decks/walkthrough-01-who-chose-the-next-one.json` |

All three render free. Nothing in this folder used an image or video model.

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
