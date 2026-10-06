---
name: explainer-video
description: Turn one idea into a hand drawn explainer video in the Guided Childhood look, the way the whiteboard draw on films do it (an ink line drawing draws itself under a bold headline), but in our cream, ink and butter. Use whenever Justin says "make an explainer", "draw out", "whiteboard video", "animate this idea", "show how we solve X", pastes a research finding and wants a video, or asks for the five o'clock fight style film. Takes an idea, researches the ideal user and their problem in their own words, shows how one real service solves it, builds the composition from the template, and renders landscape and vertical MP4s plus the platform captions. Never claims an outcome for a child. Never a synthetic person.
---

# Explainer video: one idea in, a drawn film out

Built 1 October 2026 from the whiteboard animation Justin attached
(IMG_7330.MOV, a football safeguarding explainer: blue line drawings that draw
themselves on a white board under bold headline text, a hand holding the pen).
We borrow the mechanism, the draw on, and the shape, one headline and one
picture per beat. We do not borrow the look. Ours is the house frame: cream
field, ink stroke, butter accent, Nunito 900 headlines, IBM Plex Mono eyebrows.

## Read first

- THE-STORY.md sections 1, 2, 3 and 10. The film is a road to the stage check.
- `content/brand-story/founder-context.md`: Justin's true scenes. The opening beat may be one of them when it is the clearest way into the problem (the Teo dance video for DiGi, the YouTube moment for the playlist). Never invented, AMBER scenes flagged in POSTS.md.
- `research/homepage-audience-language.md`: the parent's own words for the
  problem. The first beat is always in their words, never ours.
- The service catalogue (`content/brand-story/service-post-map.md`): the real
  service that answers the problem, with its hinge. The film shows one service.
- `.claude/skills/content-engine/ai-tells.md` and `hidden-thread.md`: the
  copy rules and the one in ten rule.
- `videos/_templates/explainer-draw/frame.md`: the tokens.

## The shape: six beats, about twenty five seconds

| Beat | Job | Where the words come from |
| --- | --- | --- |
| 1 | The moment, in the parent's words | homepage-audience-language.md |
| 2 | You are not alone, and nobody gave you a plan | one verified number, or none |
| 3 | The honest pivot, or the reframe | our philosophy, commitment 4 |
| 4 | What we built, in one line | the service catalogue entry |
| 5 | How it works, the hinge | the catalogue's hinge line |
| 6 | The stage check | identical every time |

Beat 6 is always: headline "What stage is your child?", sub "Three questions,
no sign up.", url guidedchildhood.com/starter-pack. For a Social Billboard
film the last beat is "Your choices. A playlist to match." with
thesocialbillboard.com/safe-youtube-for-kids, and the series eyebrow reads
THE SOCIAL BILLBOARD.

Headlines are twelve words or fewer. Subs are one sentence. No dashes
anywhere; the build script refuses a dash. A number appears only if a
primary source is in the evidence bank or the research folder, and the sub
names the source in plain words when it does.

## The steps

1. **Research the problem.** Take the idea. Find the ideal user (one parent,
   one age, one moment) and write the problem in their words from the
   research file. If the idea came from a study, grade it VERIFIED or LIKELY
   first; LIKELY numbers do not go on screen.
2. **Pick the service.** One catalogue entry. Copy its problem, what we made
   and the hinge. If the idea is about a service that does not exist, stop
   and say so.
3. **Write the brief.** `videos/<date>-<slug>/brief.json` in the shape of
   `videos/_templates/explainer-draw/brief.example.json`. Pictures: for any
   beat that wants a scene rather than a glyph, generate a real ink
   illustration on Higgsfield and trace it with `tools/ink-trace/` (read its
   README), then use those paths for the beat. The stock icons in
   `icons.json` (clock, phone, tablet, house, star, child, bubble, school,
   play, list, road, tick, hand, pen) are only for a beat that genuinely
   wants a glyph. The first film used icons on every beat and looked basic
   because of it (Justin, 1 October 2026).
4. **Build.** From the template folder:
   `node build.mjs ../../<date>-<slug>/brief.json ../../<date>-<slug>` and
   again with `--vertical`.
5. **Check and look.** In the project folder `npm run check`, then
   `npx --yes hyperframes@0.8.82 snapshot` at three times (a headline, a
   half drawn icon, the stage check) and read the images. Fix clipping before
   rendering. The pen must sit on the line while it draws.
6. **Render.** `npm run render` for landscape (LinkedIn, Facebook, YouTube)
   and `npm run render` inside the `vertical` folder for Reels,
   TikTok and Shorts.
7. **Write the posts.** One caption per platform, from the beats, in the
   voice rules: LinkedIn (story, question, link in first comment), Facebook
   (warmer, link in body), Instagram (link in bio), YouTube (title under
   sixty characters, description with the stage check link, three thumbnail
   lines). Save them as `POSTS.md` beside the video.
8. **Hand over.** Put the MP4s in Drive, Guided Childhood Content Engine, 03
   Brand Story Video Library, 08 Approved and Published Masters. Justin
   publishes. This skill never publishes.

## Non negotiables

1. Never allow or deny, never a claim of an outcome for a child, never
   "safe" as a promise. The wording is a plan, a pathway, a stage completed.
2. No synthetic person. The drawings are line icons, not people presented as
   parents. A real face only arrives as Justin's own footage in a different
   lane (talking head video).
3. The product is shown as a drawing in this format. When a real screen is
   needed, cut to the talking head lane with a screen recording instead.
4. One idea per film. If the brief needs a seventh beat, it is two films.
5. Silent by default, so the headline and sub carry everything. A voice
   track is a later addition through the talking head lane.

## Where to find things

- Template: `videos/_templates/explainer-draw/` (build.mjs, icons.json,
  brief.example.json, frame.md).
- First film: `videos/2026-10-01-five-oclock-fight/` (the five o'clock fight
  into the star quest).
- Hooks bank for the first beat: section 6 of the Control Room doc and the
  silent UGC skill's hook rules.
