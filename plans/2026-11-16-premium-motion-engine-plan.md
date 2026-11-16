# The premium motion engine

Written 16 November 2026, from Justin's brief of the same day. Plan before
build, as CLAUDE.md asks.

## What already exists, read first

| Piece | Where | What it means for this build |
| --- | --- | --- |
| Motion workflow | HyperFrames 0.8.82, one hand built HTML film per pack (`content/packs/2026-11-11-gdc-058-motion/`), the motion standard in `.claude/skills/talking-head-video/motion-standard.md` | Stays as it is. The new engine is a templated lane for research cards, not a replacement for hand built films |
| Visual system | `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`, tokens in `shared/tokens.css` | Ink `#1A1A2E`, brand gold `#EDC35F`, gold dark `#C99A28`, cream `#F9F8F6`. Nunito and IBM Plex Mono from `app/fonts/`. All words set in code, never inside a generated image |
| The look for evidence posts | Open since 12 November (`content/analytics/visual-performance-2026-11-12.md`): three looks on the table | This brief chooses one: warm ivory, navy type, restrained yellow, editorial. Recorded as Justin's decision for this engine |
| Research | `content/research-register/studies.jsonl`, read through `scripts/radar/register.mjs`. A reviewed record carries `claudeReview.verifiedStatistics`, `limitations`, `proposedTitle` | The engine reads only records with `claudeStatus` CLAUDE REVIEWED and a SHIP or EDIT verdict, and only cleared figures |
| Assets | `scripts/radar/assets.mjs`: `recordAsset`, `probeVideo`, `assetProblems` | Renders are recorded through it, so the existing gates and the approval sheet see them unchanged |
| Drive handoff and Metricool | `scripts/radar/metricool.mjs`, `content/publication/metricool-handoff-GDC-NNN.json`, permissions default to no | Untouched. The engine never writes a handoff and never changes a permission |
| Post register | `content/gdc-post-register.md`, numbers claimed only through the pipeline | Read only. The engine never claims a number |
| Higgsfield | Connector in Claude sessions | Catalogue read only. No generation without Justin's say |

## What gets built

1. `tools/motion-engine/`, its own package so the Next app is untouched:
   Remotion 4, React, TypeScript, FFmpeg.
2. One composition, the research card: 1080 by 1350, 30 fps, 420 frames
   (14 seconds). Every word is landed by about 5 seconds, then nothing moves
   but a very slow background drift, giving over 8 seconds to read.
3. A story spec built from a research record by `build-spec.mjs`, with a
   gate that refuses any number on screen that is not in the cleared
   figures, any dash, and any record that is not Claude reviewed.
4. Two outputs per story: the PNG is the last frame of the MP4, so the still
   and the film can never disagree.
5. An optional background plate (Higgsfield or Seedance footage, no text in
   it) and an optional object still, both behind an ivory wash so the type
   always reads.
6. A demonstration marked NOT FOR PUBLICATION, rendered and checked.

## What it will not do

Post, schedule, create a Metricool draft, claim a GDC number, change an
approval rule, or spend Higgsfield credits.
