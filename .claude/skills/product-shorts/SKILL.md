---
name: product-shorts
description: Make a vertical problem to solution film from the REAL Guided Childhood app, the same way every time, ready to post. One parent problem per film, answered by DiGi, a script card, the tool, and the check in that tracks it until it is sorted, ending on the stage check. Use whenever Justin asks for "the next short", "Short 2", "the timer film", "a DiGi short", "a video showing how the app solves X", "film the app", or a new film in the DiGi shorts series. Records real screens with made up data (never invents a screen), times every line to the reading rule, checks platform safe zones, runs a marketing review through the feedback filter, and hands over a posting playbook. Never publishes.
---

# Product shorts: a real app film, right first time

Built 12 October 2026 from the hero and Short 1 (`videos/2026-10-09-digi-shorts`),
after two outside reviews and three re-cuts. Everything below is something a
cut got wrong once. That project is the template: copy its cut files and add
new scenes there, or copy the folder to a new dated one.

## The brand line every film carries

Justin: "the solution to all problems digital, from AI to screens, all backed
on research, with the goal to keep them safe, with an easy to use system."

So each film shows **one** problem. The series says the breadth by repetition:
- The end card says **"One plan for screens, phones and AI."** word for word, under the wordmark.
- The caption says "built on research".
- "Safe", "proven" and "fix" never appear on screen. They promise an outcome for a child (silent-ugc rule 4).

## Read first

1. `THE-STORY.md`: sections 1 to 4, 6 and 10. Read `.claude/skills/silent-ugc/SKILL.md` too.
2. `content/packs/2026-10-09-digi-shorts/series-plan.md`: the nine film series, and which problem comes next.
3. `content/packs/2026-10-09-digi-shorts/research/07-ux-and-motion-designer.md`: section 4 is the reading rule, section 5 the safe zones.
4. `videos/2026-10-09-digi-shorts/BRIEF.md`: how the engine works, and the three passes.
5. `plans/2026-10-12-shorts-marketer-review-weighed.md`: what the reviewers caught.

## The checklist (every film, before anything renders)

1. **One problem**, named in a stage check worry tile's exact words. That tile is the end card eyebrow ("Coming off screens?").
2. **The opening is the parent's own words** from the research packs, in the chat bubble, first person. Lead with the feeling ("I feel so guilty"), never a label that blames ("bad guy" was turned down). The first frame is a complete thought: set `typedFrom` so the opening words are already there.
3. **DiGi's reply** is written for this film's own question, inside the live rails in `lib/digi/system.ts`:
   - under 120 words, two bold lead ins, the check in line, one script link, Tonight last
   - every clause answers something the parent typed (Short 1 once answered a guilt nobody mentioned)
   - labelled illustrative
4. **The four labels**: example family (the slate under the opening bubble and on the end card), illustrative reply, illustrative time markers, this parent's own rating (from the first face tap).
5. **The arc**: ask DiGi, the script deck, the tool, the check in tracked to Sorted. The tracker rail (Asked DiGi, The words, Checked in, Sorted) ticks as each lands.
6. **The script is the deck**, Good Inside style ("Try as deck", `app/ref-script-deck`), never the long page zoomed. Push in on the one line to say, under a band.
7. **Research only where the study's ages match the film's child.** The 1 to 5 year old study belongs on the early years film only. Otherwise the research goes in the caption.
8. **The reading rule**: a hold is 0.6s plus words ÷ 3.3, never under 1.4s, and 0.5s more for a new screen. Thinking lines hold the product's 2.2s. No unchanged frame lasts longer than its reading need: trim dead air with an unseen cut inside the same screen.
9. **Safe zones**: text and the line being read sit inside x 90 to 990 and y 285 to 1550. The rail starts at y 236 or lower. The end card's URL and slate stay above y 1480.
10. **Read every word on screen at 10 frames a second**, including fades and the app's suggested questions. Look for:
    - a child's age against an app's age limit (Instagram at nine was caught)
    - anything left over from the fixture's own child (stage, age, name)
    - "Earn more stars"
    - outcome words and dashes
11. **The end card** carries the series line, "What stage is your child? Three questions, no sign up. See what to do tonight.", the film's own `/v/<code>` link, and the slate.
12. **Two cuts**: the full film for Reels and Facebook, and a 35 to 40s TikTok cut. The TikTok cut drops the send, the link tap, the pop up and the tap lead in, and carries its own `/v/` code.
13. **Renders** are levelled with `loudnorm=I=-16:TP=-1.5`, saved to Downloads/Motion advert, and the old ones versioned `-vN`. Only the newest is ever posted.

## The pipeline

1. **Brief.** From the series plan and the research packs, write down the problem, the opening line, the script (by sort order), the tool beat and the reply. Check the script's text in the live table before filming it. If it needs fixing, that is a content migration PR that ships first.
2. **Scenes.** Copy the nearest `scenes/*.json`. Chat scenes stub `/api/digi` with the reply. `swap` relabels fixture data only, never product copy. The fixtures carry Justin's children's real names, and `tools/names.json` swaps them before any frame exists.
3. **Record, one at a time.** Run `sh tools/rec-safe.sh <scene>`:
   - `record2.mjs` runs on Playwright's paused fake clock
   - `"anims": true` pins CSS animations to it (card flips)
   - a stalled screenshot retries
   - a hang on close is encoded anyway
   Check where text sits with `tools/where.mjs`. Then confirm underline positions on a real frame, because a Playwright click can shift the measurement.
4. **Cut.** Copy `cuts/hero.json` or `cuts/short-switch-off.json`:
   - camera keys
   - overlays: `pill` with `typed` and `typedFrom`, `band`, `label`, `marker`, `lower`, `veil` with `fade`, `end` with `tagline`
   - the `rail`
   - music lane
   Run `node build.mjs cuts/<cut>.json`, then check by eye with `node tools/frames.mjs --name <n> <seconds...>`. The film server is the `digi-shorts-film` launch config, on port 4174.
5. **Render** with `sh tools/render-both.sh <cut...>`. It waits for any other HyperFrames render on the Mac, because a render from another session cancels ours. Check the length with ffprobe.
6. **Review.** Brief a marketing agent:
   - frame sheets at 1 frame a second, key frames, and a shot list
   - THE-STORY, the silent-ugc rules and the Control Room routine
   Weigh every point with `.claude/skills/feedback-filter` and check its claims in the code. Bring Justin only his decisions, as quick questions.
7. **Hand over.**
   - Update `content/packs/<pack>/posting-plan.md` with the files, the playbook, the captions per platform, the two weeks and the numbers.
   - Make the per-platform `/v/` links on Admin, Film links. Nothing is posted before they count.
   - Send the films with SendUserFile.

## Platform rules (Control Room, section 11)

- Instagram: link in bio only. Facebook: the link in the post text. LinkedIn: the link in the first comment. TikTok: the bio link, or in the caption if there is none.
- £0 paid for the first 30 days, then at most £100, and only on a post that has already moved stage checks.
- Post Short films around 19:30, after the fight. That is a working assumption until two weeks of the platform's own numbers exist.

## Never

- An invented screen, a regenerated character, or a synthetic person presented as a parent.
- A child's face, a real child's name, or a fixture detail that contradicts the film's child.
- A claim without a proof path in the product, or research outside its ages.
- Publishing. Justin posts.
