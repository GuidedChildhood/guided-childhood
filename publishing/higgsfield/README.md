# Higgsfield in The Guided Planet

Higgsfield paints the backdrops: skies, places, workshops, gardens. It never
paints a character, a logo, a screen or a word. Bloop and the Planet Friends are
the approved files in `publishing/library/characters.json`, placed by the
layout engine on top of the art, so their identity cannot drift between
editions. That is `brand/GDC_SOCIAL_VISUAL_SYSTEM.md` section 1 made into code:
`brief.ts` refuses to build any prompt that names a friend.

Every slot already has a vector drawing (`templates/art.ts`), so an edition is
complete at zero credits and a failed or rejected generation holds nothing up.

## What was checked, 13 October 2026

- Access: the Higgsfield connector in Claude sessions. No API key or code in
  the repo, so generation runs through a session, never from the routine.
- Plan and balance: Plus, 1,107 credits.
- Reference elements: Justin, and two of Cosmo. None for Bloop, and none is
  needed, because characters are composited rather than generated.
- Models: GPT Image 2.5 (with transparent backgrounds and quality levels),
  Nano Banana 2.1, FLUX 3, all taking reference images. The only measured cost
  in the repo is about 1 credit per GPT Image 2.5 still at low quality.

## The workflow, per issue

1. **Justin sets a budget** on the desk (`/dashboard/admin/planet/<n>`, The art).
   No budget, no generation. The engine counts credits Higgsfield actually
   charged, never estimates.
2. **The brief**: `npm run planet -- higgsfield <n>` writes
   `issues/<NNN>/higgsfield/brief.md` and `brief.json`: every slot, its recipe,
   model, aspect, prompt, estimate, and whether it may run now.
3. **Drafts first.** A Claude session runs each runnable draft with
   `generate_image` (model and params from the brief, the composition reference
   board as the only reference image), waits with `jobs_wait`, then records it:
   `npm run planet -- art-record <n> <slot> draft <job id> <url> <credits>`.
   Credits come from the job result or `transactions`.
4. **Justin approves or rejects** each draft on the desk. A draft is judged on:
   on palette, no people, no characters, no text, space left where the
   character goes, matches the page's vector composition closely enough to drop
   in.
5. **Finals** only for slots with an approved draft, at the final model's
   settings. The first final's real cost becomes the estimate for the rest.
6. **Into the paper**: `npm run planet -- art-pull <n>` fetches approved finals
   into `issues/<NNN>/assets/approved/<slot>.png`; the next render uses them in
   place of the vector default and checks their print resolution (150 dpi
   minimum, 220 preferred, so a full width image needs about 1,800px).
7. Nothing expensive starts by itself: the brief marks any unpriced run as
   needing its own approval, and video is never in the routine.

## The recipes

`recipes.json`: newspaper cover, world map, Discovery Observatory, Maker
District, Thinking Forest, Connection Garden, Research Room, Family Explorer,
Bloop explains (the backdrop only), printable activity line art, Digital
Passport stamps. Each gives the aspect, minimum pixels, composition, lighting,
where the character will go (always "none in the image"), palette, the never
list and the output.

## Video

The cover reveal is made in code from the real cover (`distribution/motion.ts`)
in 9:16, 1:1 and 16:9, at zero credits. The trailer, three teasers and Bloop's
explainer are scripted in each package (`video-scripts.md`). Higgsfield video
(Seedance 2.0, or Kling 3.0 from an approved start frame) is an option for a
sky plate behind the opening shot, behind the same budget, and never animates
a generated character.
