---
name: lesson-video
description: Turn one module's five minute explainer script into a finished, captioned lesson video, the same way every time, by hinging together the pieces we already build. Use whenever Justin wants to make a lesson explainer video, produce a module video, animate a lesson, or turn a lesson script into a video. Takes a script from content/lesson-scripts, generates one illustrated diagram or B roll clip per beat on Higgsfield in the house style, animates the host character pop ins from the digi-squad reference art, drops a HeyGen avatar segment where a human presenter is wanted, burns in captions, and stitches it all into one MP4 with the Higgsfield explainer assembler. Repeatable for all 21 modules. Never used for the interactive slides themselves, which are database rows in the player.
---

# Lesson Video — the module explainer factory

One script in, one finished captioned lesson video out, identical process every module. This is the assembly line behind the five minute explainer that plays before the interactive slides on every lesson. It does not build the interactive lesson (that is a `school_lessons` row rendered in the player, rule 6). It builds the video beat that opens it.

## What this hinges together

Every piece already exists in the repo or the connected tools. This skill is the join:

- **The script** already written, seven beats, in `content/lesson-scripts/<band>.md`, each beat with Narration, On screen, and a paste ready Illustration prompt (format locked in `plans/lesson-explainer-sample.md`).
- **The diagrams and B roll** generated one per beat on Higgsfield (`generate_image` for stills and diagrams, `generate_video` or `motion_control` to give a still a gentle move), 16 by 9, house style below.
- **The host character pop ins** animated on Higgsfield from the digi-squad reference art (`Zara.png`, `Oliver.png`, `Sofia.jpeg`, `Digi.png` and the rest), the character opening a segment and handing over, never lecturing.
- **The human presenter segment**, optional, delivered by Justin's HeyGen digital twin avatar (`create_video_from_avatar` or `create_video_agent`), used for a teacher facing intro or a parent framing, never for the child voiced beats.
- **The voiceover** from the module host character voice (Higgsfield `generate_audio` with the character's cloned voice, or a real read).
- **The captions** burned in for sound off, HeyGen captions on the avatar segment and Higgsfield `explainer_video` subtitles on the assembled beats.
- **The stitch** with Higgsfield `explainer_video`, per beat clips plus per beat voice takes into one exact length MP4, subtitles on.

## Non negotiables (inherited, do not relitigate)

- No dashes anywhere in narration or on screen text. Justin's voice, warm, plain, direct.
- House cast only, per the module script header: Sofia the protector, Zara sees through tricks, Oliver thinks ahead, DiGi the guide with the golden star, Vix streetwise and honest, Brock grounded and gentle, DiGi Junior for the youngest. Never render DiGi as a robot or an owl.
- Guided Childhood tokens for every on screen word: cream #F7F3EE ground, ink #1C1C1C text, one accent per lesson from green #2E7D5A, coral #D4600A or gold #F2C94C. Nunito 800 to 900 for display, IBM Plex Mono for eyebrows, labels and any stat. Never Inter.
- Every stat on screen carries its source and year on the same frame. Odgers test on every claim, nothing a hostile expert could kill.
- Characters pop up, they never lecture. Four beats of animation total, roughly 45 to 60 seconds across the five minutes, each opening a segment and handing back.
- Reduced motion respected, gentle moves only, no spinning, no Three.js energy.

## House illustration style (paste block, use on every Higgsfield image)

Append to every beat illustration prompt so the whole module looks like one hand:

"Warm hand illustrated style, flat friendly shapes, generous white space, Guided Childhood palette of cream, soft green, coral and gold on a cream ground, ink line work, gentle and calm not corporate, no photorealism, no neon, no dark tech aesthetic, 16 by 9, room left clear for a caption along the lower third."

## The pipeline (run this for any module)

**Phase 0 — Load the script.** Read the module's script from `content/lesson-scripts/<band>.md`. Confirm the host character, the accent colour, the learning outcome, and the seven beats. Restate the module in one line. If asked for a module that is not scripted yet, say so and point at the script step first.

**Phase 1 — Generate the beat visuals (Higgsfield).** For each of the seven beats, take the beat's Illustration prompt, append the house style block, and call `generate_image` (model per `models_explore` recommendation, 16 by 9). For beats that carry a mechanic (a loop, a race, a three step check), prefer a clean diagram over a scene, and consider animating the still with `generate_video` so the mechanic moves (the loop tightens, the race runs, the checks light up in turn). Poll `job_display` per id. Save the job ids into the production doc against each beat.

**Phase 2 — Animate the character pop ins (Higgsfield).** For the beats where the script marks the character popping in, generate a short character animation from the host's reference PNG (image to video, or `motion_control` to puppeteer the reference), 8 to 15 seconds, transparent or cream ground so it composites over the beat visual. Cast per the script header, Vix only for the cameo the script names.

**Phase 3 — The presenter segment (HeyGen), optional.** If the module wants a human framing, a teacher intro or a parent note, generate it with Justin's avatar (id from `list_avatar_looks`, voice from `list_voices`) via `create_video_from_avatar`, portrait or 16 by 9 to match, captions on. Keep it to the framing only, the child voiced beats stay with the character and the character voice.

**Phase 4 — Voiceover.** Generate each beat's narration as audio in the host character's voice (Higgsfield `generate_audio` with the character voice element, or a real read), one take per beat, matched to the beat window.

**Phase 5 — Stitch and caption (Higgsfield `explainer_video`).** Assemble the beat clips in order, each beat a fixed block with its voice take laid over it, subtitles on (font matched to the warm style). Prepend the HeyGen presenter segment if there is one. Output one MP4 at the source resolution. This is the hinge that makes it one video.

**Phase 6 — Deliver.** Save the production doc to `content/packs/<date>-<module-slug>-video/` with every beat, its prompts, its job ids, the caption text, and the stitch order. Send Justin the MP4 and the doc. Offer the same for the next module.

## The production doc (write this for every module)

`content/packs/<date>-<module-slug>-video/production.md`, one table row per beat:

| Beat | Window | Narration (verbatim) | On screen | Higgsfield image prompt (with house block) | Animate? | Character pop in | Caption (burned in) | Job ids |

Plus a header with module, stage, host character, accent colour, learning outcome, runtime, and the stitch order including any HeyGen segment. Every number in the narration mapped to its source.

## Repeat for each module

The 21 modules are already scripted across `eyfs-ks1.md`, `ks2.md`, `ks3.md`, `ks4.md`, `ks5.md`. Once the reference module is approved to this format, the rest are produced mechanically: same phases, same house style, swap the host character and accent colour per the script header. Log the reference module in decisions.md as the locked pattern so every later module matches.

## Honest limits to state, never hide

- The character animation and the HeyGen avatar are clean and consistent, not full cinematic. Fine for a five minute explainer.
- A fully automated stitch across two platforms is close but a final human editor pass may sharpen timing. Say so rather than overclaim a one click finish.
- HeyGen on the free plan caps length and watermarks. A real lesson library needs a paid plan.
- Character voices must be created once (Higgsfield `create_voice`) before Phase 4 can use them.
