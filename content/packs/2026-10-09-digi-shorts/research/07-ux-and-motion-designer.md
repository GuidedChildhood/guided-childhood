# DiGi shorts: visual spec for the next cut

## 0. Summary

* **The current film scores 5/10 for Looks and 4.5/10 for Flow.** It's on brand and the story order is right. But the product it's selling can't be read on a phone. Chat text is 16 to 19 px in a 1920 frame, which comes out at about 3 to 5 pt in a mobile feed. The CTA arrives at 98 s of 103.
* **The fix is mostly maths.** Make the vertical film the master. Show the UI without the phone frame at 2.6x to 4.2x its real size, so body text lands at 44 to 72 px on a 1080 wide frame. Move the camera, then hold still while a line is read. Slow the reading rule from 288 to 200 words a minute.
* **Fix four truth problems before any styling.** I found these in the code:
  * DiGi in the product has been the 3D star since 8 October. The film still uses the flat SVG.
  * The ref fixtures carry Justin's real children's names: Teo, Olga and Alma.
  * The film's "Resting for a week" card isn't product copy.
  * The film shows 0.6 s of dots where the product shows its real thinking lines.
* **DiGi becomes the 3D clay star everywhere.** The acting comes from the approved Kling idle loop (blinks and eye squints, 960 px) plus the product's own GSAP moods. The code SVG retires from films.
* **The home page becomes the ground the film sits on.** Keep its butter gradient, headline, Planet Friends road and passport. Crop out the generated photo of children, the unverified quote and the price.

---

## 1. What I looked at, and the limits

* **Read directly:**
  * The three contact sheets.
  * `DiGi-star.png` (1024) and `DiGi-star-3d.png` (384).
  * Six frames I pulled from the approved DiGi idle loop.
  * The film's `build.mjs`, `beats.json` and `BRIEF.md`.
  * `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`.
  * The real thinking block in `DigiChat.tsx`, `ThinkingReassurance.tsx`, `DigiCharacter.tsx`, `RightNowButton.tsx`, `lib/concerns/outcome.ts` and `app/api/cron/followups/route.ts`.
* **Captured with Playwright, using the installed Chrome:**
  * The live home page at 1920x1080 and 390x844.
  * Five ref routes at 390x844 at 2x pixel density: `ref-digi-chat?chat=1&kids=1`, `ref-today-path`, `ref-kid-path`, `ref-timer-nudge`, `ref-checkin-acknowledge` and `ref-ask-popup?bedtime=1`.
  * The other routes failed. The only dev server on port 3000 belongs to another worktree, `musing-wing-5315a1`, and it hit a `Can't resolve 'qrcode'` build error part way through. The film session needs its own server, as the worktree node_modules memory note describes.
  * Saved working files, in `/private/tmp/claude-501/-Users-justinphillips-guided-childhood--claude-worktrees-amazing-khorana-116a1e/342c9a4d-9738-4ee5-acb0-02d4b6e93954/scratchpad/`:
    * `shots/sheet1.png` (the ref captures)
    * `shots/home-1920.png`
    * `shots/home-390.png`
    * `idle/strip.png` (the DiGi loop frames)
* **Mobbin:** pulled screens for AI thinking states, the Duolingo path, lock screen notifications, chores to screen time, and Finch.
* **Limits:**
  * I can't watch videos. Anything said about a specific film comes from written sources or Mobbin stills, and the whatships.com page for Rene has no breakdown.
  * The BBC subtitle guide and Apple's typography page both refused fetching, so those figures come from secondary sources.
  * The safe zone pixel numbers are third party; TikTok and YouTube publish no exact figures.
  * The web search budget ran out before a search on Good Inside's AI chat.
  * I couldn't query the database. I haven't verified that the script title "Bedtime stalling and one more thing" exists in the scripts table.

---

## 2. The existing film, scored

### Looks: 5/10

| What I found | Evidence |
|---|---|
| The UI can't be read on a phone | Chat body is 16 px, the parent pill 19 px, notification body 16 px, card eyebrows 12 px. The camera sits at 1.0 to 1.3x in chat beats. That's 16 to 25 px in a 1920 frame, or about 3 to 5 pt seen in a phone feed. |
| The brain section is a slide deck | Rows are 36 px and 30 px, eyebrows 20 px. On a phone that's about 6 pt. |
| The end card URL is tiny | 26 px mono, about 5 pt on a phone. |
| The frame is mostly empty | The phone is 430 px of a 1920 width (22%) and fills about 18 to 30% of the frame. The rest is flat cream. |
| DiGi is off model | The flat SVG star with code eyes. The product switched to `DiGi-star-3d.png` on 8 Oct (commit 3e3b5134), and the home page friends are 3D. |
| The memory cloud is clutter | Twelve cards at 25 px with 11 px chips. That's the sticker scatter the brand doc rules out (section 7), and there is no product screen behind it. |
| "WE DID IT" is a tilted sticker | Invented, and sticker energy. |
| No depth | Flat ground, grey shadows, nothing to separate the phone from the canvas. |

What's working: brand colours and Nunito/Plex correct throughout, a faithful UI vocabulary (the periwinkle `#DCE7FB` pill, DiGi with no bubble, the chunky butter buttons), one gold stroke on the end card, and headline sizes of 84 to 100 px.

### Flow: 4.5/10

| What I found | Evidence |
|---|---|
| Too long for a sales short | 103.4 s. The CTA lands at about 98 s. Wistia's 2025 figures, via secondary coverage, put sub minute videos at the highest average engagement (50%). |
| Lines are too fast, yet the film is long | `beats.json` holds lines at 4.8 words a second (288 wpm), and the brain section at 5.2 (312 wpm). Adult silent reading averages 238 wpm for non fiction, range 175 to 300 (Brysbaert 2019). Slower readers lose lines on a phone, and the film still runs long because it shows too many lines. |
| Three chat scenes look the same | Cold open, check back and remembers are the same phone at the same scale. |
| Brand arrives late | The "Introducing" card at 16 s interrupts a chat the viewer can't read. |
| Justin's asks are missing | No real thinking lines (0.6 s of dots), no pathway, no top moments, no timer. |
| Proof is 29 s of lists | Researcher, papers, families and rules layers, at about 312 wpm. |
| Nothing labelled illustrative | The cold open line and the family are invented, with no "example family" label. |

What's working: the cold open idea (the parent's own words first), the "Comes back to check" loop (true and unique), and the beat order: problem, answer, follow up, memory, progress, proof, CTA.

### What makes each a 10

**Looks 10**

1. Every line the viewer must read is at least 47 px in the 9:16 master, which is about 17 pt on a phone. Nothing is ever below 31 px.
2. In reading beats the UI fills at least 85% of the frame width, and the line being read sits inside the safe box (section 5).
3. The product looks exactly as it ships: the 3D star, the real thinking lines, the real outcome card, the real push copy, the real path.
4. There is depth from three parallax layers (home page ground, UI, lifted text), warm contact shadows and a focus pull. There is no 3D rotation, so the house "no Three.js, subtle" rule holds.
5. One gold detail per beat. DiGi acts on model. No scatter and no stickers.

**Flow 10**

1. The parent's line is readable inside 1.5 s, and DiGi is visibly working by 5 s.
2. One problem, one answer, one follow up, one proof, then the CTA by 35 to 45 s for the hero cut.
3. Every hold comes from the 200 wpm rule. The camera moves, then holds.
4. Match cuts between beats, never generic crossfades: notification into chat, path star into the DiGi avatar, check in face into the pathway node.
5. Each beat answers the question the previous one raised.
6. The thinking state is the trust beat, and the biggest UI moment in the film.

---

## 3. Truth fixes from the code (must do first)

1. **Use the 3D star, not the SVG.**
   * `shared/components/DigiCharacter.tsx` renders `/digi-squad/DiGi-star-3d.png` with whole body moods. The chat avatar (`DigiAvatar`) uses it too.
   * `digi-squad/README.md` (8 Oct) keeps the SVG only for the home screen icon generator.
   * Section 3 of `GDC_SOCIAL_VISUAL_SYSTEM.md` still names the SVG. It predates the switch and should be updated.
2. **Swap the real children's names in the fixtures.**
   * `ref-digi-chat` uses Teo and Olga. `ref-today-path`, `ref-kid-path` ("TEO'S PATHWAY") and `ref-timer-nudge` use Teo. `ref-checkin-acknowledge` shows "ALMA ROSE".
   * `content/brand-story/founder-context.md` names Justin's children as Alma, Olga and Teo, and stories about them are AMBER.
   * Every capture must swap names to the film's invented family (Ava, 9, and Sam, 6) before a frame is saved.
   * Also replace the `ref-digi-chat?chat=1` fixture reply. It says "the answer is not yet, with a date", which edges toward a deny. Use the panel's rails checked answer instead.
3. **Use the real outcome copy.**
   * With `SILVER_RUN = 1`, one "Going great" returns **"Sorted! That is a great day."** and **"Off your list. We will check in a week that it held. If it comes back, log it as a moment."** (`lib/concerns/outcome.ts`).
   * Use those exact strings. Drop "Bedtime: going great. Resting for a week." and "WE DID IT".
4. **Show the real thinking state** (detail in section 9).
5. **Use the real push copy.** The title is "How did that go?" and the body is the booked follow up question (`app/api/cron/followups/route.ts`).
6. **Label the illustrative family.** Show a 32 px IBM Plex Mono eyebrow, AN EXAMPLE FAMILY, for at least 2 s at the family's first appearance, plus a line on the end slate. DiGi's replies must be faithful to its rails and never presented as a logged conversation.
7. **Hide the Next.js dev badge.** The "N" indicator appears bottom left in every ref capture.
8. **Treat the memory cloud as editorial.** No product surface shows DiGi's saved memories as cards. If it stays, keep it typographic and unlike UI, with at most 5 cards at 56 px or more.

---

## 4. The readability rule (the maths)

Effective size on the viewer's screen = film px × k, where k is points per film pixel. The targets come from Apple's iOS type scale as reported by secondary sources: 11 pt floor (caption 2) and 17 pt body.

| Viewing case | k | Floor (11 pt) | Body (17 pt) | Hero line (24 pt) |
|---|---|---|---|---|
| 9:16 full screen on a 390 to 430 pt phone | 0.36 to 0.40 | 31 px | **47 px** | 67 px |
| 4:5 in a phone feed | 0.36 | 31 px | 47 px | 67 px |
| 16:9 in a phone feed | 0.20 | 55 px | 85 px | 120 px |
| 16:9 full screen on a laptop | about 0.75 | 15 px | 23 px | 32 px |

This lines up with practitioner caption guidance for 1080x1920: 60 to 75 px for primary captions, about 48 px minimum (Blitzcut).

**S** is film pixels per CSS pixel of the captured 390 wide UI. Real body text is 16 px × the dashboard's 1.07 zoom, about 17 CSS px.

| Framing in 9:16 | S | Body renders at | Use |
|---|---|---|---|
| Establishing, device visible | 1.9 | 32 px | 1.2 s at most, never for reading |
| Context read, no frame, screen about 1014 px wide | 2.6 | 44 px | Reading two or three messages |
| Key line | 3.4 | 58 px | The sentence that sells |
| Detail | 4.2 | 72 px | Thinking line, notification title, a face |
| Maximum | 5.0 | 86 px | Beyond this, context and sharpness go |

**Reading hold** replaces `wps 4.8`, `brainWps 5.2` and `dots 0.6`:

* hold = 0.6 s + words ÷ 3.3 (200 wpm), never under 1.4 s
* add 0.5 s when a new screen appears
* the thinking lines hold 2.2 s each, the product's own interval
* a streamed reply reveals at 6 words a second, then holds by the rule

Where 200 wpm comes from:

* Brysbaert's 2019 meta analysis: 238 wpm mean for silent non fiction, range 175 to 300.
* UK subtitling's long standing target of 160 to 180 wpm. Ofcom reportedly dropped the numeric target in 2024, per a secondary source.
* Reading on a phone, on a moving frame, needs headroom. Harvey et al. 2017 found scrolling text reduced sentence level integration.

---

## 5. Formats: 9:16 master, 4:5 by crop, 16:9 rebuilt

* **9:16 (1080x1920) is the master** for the hero short and the series: Reels, TikTok, Shorts, LinkedIn mobile and Facebook Reels. Google states vertical is prioritised for Shorts ads, and horizontal assets get blurred bars.
* **4:5 (1080x1350) is a straight crop of the master.** Design all critical content inside the 1080 wide band from y 285 to 1635, and it crops cleanly with no second build.
* **The critical box** is where text, the line being read and the CTA must live. It is the intersection of the 4:5 band with the TikTok, Reels and Shorts overlays (third party measures, 2025): **x 90 to 990, y 285 to 1550**.
  * Keep the bottom 370 px clear of the CTA.
  * Keep the right 90 to 140 px clear of the important words.
  * Backdrop and phone edges may bleed past it.
* **16:9 (1920x1080) is rebuilt, not cropped.** Practitioner guidance says text and UI must be re-laid out per format. Use a "split stage":
  * The right 45% holds the phone at S 2.0 to 2.2, cropped by the frame bottom. The UI reads there at about 36 px, fine on desktop.
  * The left 55% (x 140 to 1000) holds the **lifted line**. The real message element animates out of the phone (measured, then scaled) and lands at 96 to 120 px, so it reads at 85+ px even in a phone feed.

---

## 6. Type scale for overlay text (Nunito, Plex Mono)

| Role | 9:16 and 4:5 | 16:9 |
|---|---|---|
| Hook / headline (900, tracking -0.03em, line height 1.02, 2 lines max, 8 words max) | 96 to 120 px | 120 to 150 px |
| Section title (900) | 72 to 84 px | 96 to 110 px |
| Lifted UI line (800, the real words) | 64 to 76 px | 96 to 120 px |
| Support line (700) | 48 to 56 px | 60 to 68 px |
| Mono eyebrow (Plex 600, caps, +0.14em) | 30 to 34 px | 34 to 38 px |
| URL (Plex 600) | 40 to 44 px | 44 to 48 px |
| Absolute floor, any text | 31 px | 55 px if seen on phones |

* At most 12 words to read on screen at once.
* Never set text in gold `#EDC35F`: it's about 1.6:1 on cream. Gold is for strokes and fills. Eyebrows in gold use `#8A6A1B` or `#7A5A0E`.

---

## 7. Framing per beat type (9:16 master)

| Beat | Framing | S | What reads, at what size | Hold |
|---|---|---|---|---|
| Hook (the parent's line) | Full frame on butter ground; the real periwinkle pill (`#DCE7FB`, ink `#1B2A4A`, 800) | Pill at about 5 (19 CSS becomes 96 px) | The line at 96 px; mono AN EXAMPLE FAMILY above it | Rule, typed in at 8 words a second |
| Send and reveal | Pull out from S 5 to 2.6 so the pill lands in the real chat (the existing cold open idea, readable) | 5 to 2.6 | Context | 0.9 s move |
| Thinking | Push onto the thinking block (section 9) | 4.2 | Reassurance line at 72 px; avatar 109 px | 2.2 s per line |
| Reply | Pull back to the reply's first paragraph; it streams | 3.2 to 3.4 | Bold lead ins at 55 to 58 px | Rule |
| Script card (`DigiScriptNudge`) | Card fills the frame width | 3.4 | Title 19 CSS at 65 px; eyebrow 41 px | Rule, plus the tap |
| Notification | Lock screen full bleed, then the banner drops | 2.6, then 3.4 on the banner | "How did that go?" at about 58 px | Rule, then a dive (section 8) |
| Top moments | The real moment sheet; five tiles lift out into a column at frame width | 2.6, then lifted | Labels at 60 to 64 px, one tile every 0.7 s | 0.7 s each, 1.5 s on the pick |
| Pathway (`TodayPathBig`) | Title, then a vertical dolly down the trail to the current node | 2.6, then 3.0 | "Ava's path today" at 57 px; the Next card at 51 px | Rule on the Next card |
| Check in face and the number | The `ConcernCheckIn` row, the tap on Going great, then the real outcome card | 3.6, then 3.4 | Face labels at 61 px; "Sorted! That is a great day." at 58 px | Rule |
| Memory (editorial) | At most 5 typographic cards, staggered, never UI styled | Not applicable | 56 to 64 px | Rule per card |
| Proof | One claim per frame; mono source eyebrow; at most 3 names visible | Not applicable | Claim at 72 to 84 px; source at 32 px | Rule |
| End card | Logo, line, a real chunky button, URL; one gold stroke | Not applicable | Logo mark 168 px; "What stage is your child?" at 96 px; "Three questions, no sign up." at 56 px; button text 60 px; URL 42 px mono | At least 3 s |

* The end card button sits above y 1550 and routes, as copy, to the stage check: **"Find my child's stage"**, the site's own button, over "guidedchildhood.com/starter-pack".
* Show the phone frame only for the establishing shot and the lock screen, where "it reaches your phone" is the point. Every reading beat drops the frame.

---

## 8. Zoom and motion choreography

**Camera rules**

* **Move, then hold.** A line never moves while it is being read. During a hold the only motion allowed is a scale drift of 1.5% or less, linear.
* **Reframe:** 0.7 s, `power3.inOut`.
* **Emphasis push:** 0.9 s, `power2.inOut`, at most ×1.35 per push.
* **Dive** through an element: 0.55 s `expo.in`, a match cut on the shape, then 0.5 s `expo.out`, with 6 to 10 px directional blur at the peak. Never more than 2× zoom in one uncut move.
* **Anticipation:** the camera lands 0.2 s before the element appears, so the eye is already there.
* One thing moves at a time. That's the Vox principle in `plans/2026-10-02-how-it-works-film-research.md`.

**Element motion copied from the product, so the film moves like the app**

| Element | Motion |
|---|---|
| Parent pill | Scale 0.88 to 1, y 10 to 0, 0.38 s `back.out(2)`, origin bottom right |
| DiGi reply | No bubble; words fade in with a 0.035 s stagger (it streams in the product) |
| Script card | Scale 0.9 to 1, 0.45 s `back.out(1.8)`, origin top centre |
| Thinking dots | 7 CSS px, `ink-light`, 1.2 s bounce, 0.2 s stagger, in a cream pill |
| Reassurance line | 0.5 s opacity fade, 2.2 s period |
| Button press | translateY 4 px, shadow `0 5px 0` to `0 1px 0`, 0.09 s yoyo, plus a 44 CSS ink ripple at 20% opacity, 0.5 s. No finger: a tap is a ripple and the real pressed state. |
| Notification | y from minus 110% to 0, 0.5 s `back.out(1.6)` |

**Highlight, one per beat**

* A gold underline drawn as an SVG stroke in `#EDC35F`.
* Thickness 0.1em, offset 0.12em, round caps.
* Draws left to right in 0.45 s `power2.out`, 0.25 s after the line lands.
* This is the brand's pathway signature (section 6). Never combine it with a highlighter band, and never use gold text.

**Captions versus UI text: the UI is the caption.**

* When UI text meets the size rule, never caption it a second time.
* Overlay text is only for the hook, the beat title and voice over captions.
* Overlays sit in the top band (y 285 to 520) when the UI is centred, and never over the line being read.
* Voice over captions: 60 to 72 px Nunito 800, two lines at most (`silent-ugc` rules).

**Worked example: the core chat beat in 9:16, times from the beat start**

| Time | What happens |
|---|---|
| 0.0 | The hook pill at S 5, typed in. |
| 1.4 | Holding. |
| 3.4 | Send pop. The camera pulls from S 5 to 2.6 (0.9 s); the frameless chat assembles around the pill. |
| 4.5 | Push to S 4.2 on the thinking block (0.7 s). |
| 4.9 | Line 1 fades in. |
| 7.1 | Line 2 fades in. |
| 9.3 | Reply begins. Pull to S 3.3 (0.7 s); it streams. |
| 11.5 to 13.4 | Rule hold. |
| 13.4 | The card pops. Push to S 3.4 (0.7 s); the underline draws under the title. |
| 14.4 to 16.4 | Hold. |
| 16.4 | Press "Read the script". Dive. |

---

## 9. The thinking state, the trust beat

What the product actually shows (`DigiChat.tsx`, around lines 1509 to 1525):

* The 3D star avatar at 26 px in its `thinking` mood: a minus 10° tilt and a 4 px lift over 1.2 s, sine.
* "DiGi" in Nunito 800.
* A cream pill with three bouncing dots.
* Beside it, `ThinkingReassurance`: 13 lines rotating every 2,200 ms with a 0.5 s fade.
* A 1,400 ms floor, so even a fast first answer shows a line.

The component remounts for each wait, so a real wait always runs in order from line 0:

1. "Checking our reviewed research, not the open web."
2. "Reading what the research says for a child this age."
3. "Finding where your child is on their pathway."

**Spec**

* Show lines 1 and 2 in that order at S 4.2 (72 px), 2.2 s each. Never reorder them, and never speed the rotation up.
* To show more of the set, such as "Never a flat yes or no. Working out your next step." or "What other parents found, never who they are.", use a separate **editorial** beat outside the phone:
  * an eyebrow, WHILE DIGI THINKS, IT TELLS YOU WHAT IT IS DOING
  * then 3 or 4 exact strings at 64 px, one at a time
  * every string copied from `LINES`, never paraphrased

Why it's the differentiator, from the Mobbin pulls:

* [ChatGPT](https://mobbin.com/screens/67a0c5d3-e9fc-4855-a616-18a662a92392) shows one shimmering word.
* [Linktree](https://mobbin.com/screens/e9c6c041-97b2-4850-92ca-d8a1f5131588) shows a sparkle and "Thinking".
* [Microsoft Copilot](https://mobbin.com/screens/f7046e88-81cf-4ca0-9e84-24bb5498832f) uses two lines: "Thinking... This takes about 30 seconds".
* [Grok](https://mobbin.com/flows/8ec178dc-517f-416b-a069-af8a78aa2c63) shows "Thinking for 6 seconds" over blurred reasoning.
* [Dot](https://mobbin.com/screens/adf02679-bcb3-45b9-aee0-c1ddf9af20f7) centres one big status sentence.

DiGi is the only one in these pulls that says, in plain words, what it is checking. Buck's Notion AI work makes the same case against "sparkles and magic" and showed thinking through the character's brows instead. Here DiGi's tilt does that job, with the line carrying the meaning.

---

## 10. Notification, pathway, moments, the number

* **Notification.** Rebuild the lock screen in code; it's iOS chrome, not our screen.
  * Large clock, the banner with the real app mark, title "How did that go?" and the booked question as body.
  * Push to S 3.4 on the banner, the tap ripple, then a dive: the banner scales to fill the frame and match cuts into the chat's follow up card.
  * References: the [Duolingo](https://mobbin.com/screens/48b9a512-c166-4c70-a6a7-6cb88e7b8145) and [Forest](https://mobbin.com/screens/1959671e-3363-44c0-938a-3e4bcbc9f1ea) lock screens show a single banner as the hero, set low with the clock large.
* **Pathway as it appears in the app.**
  * Use `TodayPathBig` from `/ref-today-path`. It has the title, the 5, 10 and 15 min choice, the trail from Check in (green tick) to the star on the trail to "A moment", and the "Next: A moment" card with Go.
  * Dolly down the real trail. Hold on the current node the way [Duolingo's path](https://mobbin.com/screens/02544e61-aefd-4d89-815e-ffcc83d83539) pops a callout over the current lesson.
  * The child's version is `/ref-kid-path`, with "Claim your star" and `?claimed=1`.
  * The 4 to 16 `StageRoad` with the five friends and the Passport is for brand moments and the end card, where it's also on the home page.
* **Top moments.**
  * The real tiles live in `RightNowButton.tsx` `SITUATIONS`: "Will not get up, late night before", "Morning TV, will not get ready", "TV or screen turned off", "Phone handover fight", "Bedtime battle", "Sibling fight over device", "Homework refusal".
  * Which five is a content call. It comes from the panel's top problems, or from moment counts in the database if Justin prefers product truth.
  * There is no ref route for the sheet. Add `/ref-moment-sheet`, which mounts `RightNowButton` and dispatches `OPEN_MOMENT_EVENT`, or stub it in Playwright.
* **The number that moves.**
  * The honest surface is the Progress page, `IsItWorkingReport` at `/dashboard/pathway`, which shows the concern arcs.
  * No ref route exists. Add a `/ref-progress` fixture showing one worry going Hard going, Up and down, Getting there, Going great, with the data labelled illustrative.
  * Cut from the check in face tap to that arc moving.

---

## 11. DiGi: the 3D clay star, the loop, and retiring the SVG

* **Which raster.** Justin's note names `DiGi-star.png`: 1024 px, July, white ground, no alpha. The product draws `DiGi-star-3d.png`: 384 px, alpha, palette PNG, picked by Justin on 8 Oct (Higgsfield job `5ba895ef`, cutout `9199c10c`). They are different renders, with different brows, smile and proportions. Using both puts two stars in one film. **Recommendation:** use the 3d family everywhere, and pull the full resolution original of `5ba895ef` and `9199c10c` for hero sizes above about 380 px. Justin to confirm.
* **Acting.**
  1. The approved Kling idle loop (job `dc3673e0`, 960x960, 24 fps, 5.04 s; the frames show blinks and soft eye squints) for every hero hold.
     * Its ground samples at about `#FDF6E6`, warmer than the cream `#F9F8F6`. Put DiGi beats on the butter ground (`#FDF6DE`, the home hero's own tint) with a 160 px feathered radial mask, or colour key it at low similarity to keep the baked contact shadow.
  2. The product's own moods as GSAP on the PNG, so film and app move alike, exactly as in `DigiCharacter.tsx`:
     * idle: y minus 10 over 1.8 s, sine
     * thinking: minus 10° tilt over 1.2 s
     * happy: a hop with 8° rotation
     * speak: 1.06 pulses
     * wave
  3. Landing squash: scaleX 1.12, scaleY 0.88, origin 50% 92%, 0.09 s. That's a transform, not a redraw.
  4. Any new expression (look left and right, a wink, a nod) only by image to video from the approved file, with the action alone in the prompt and checked against the cutout (brand section 15.2). It needs Justin's yes on the credit cost.
  5. Never paint eyelids on, and never redraw features over the PNG.
* **Sizes.** In 9:16 the hero DiGi is 440 to 560 px wide; in 16:9, 360 to 480 px. In the UI, DiGi is whatever the product renders (the 26 CSS avatar comes out at 109 px at S 4.2).
* One DiGi per frame. No sparkles, at most two small gold sparks. The code SVG retires from films.

---

## 12. The home page backdrop

What the live hero is, from the capture and `app/page.tsx`:

* Background: `radial-gradient(ellipse 90% 130% at 88% 45%, #FAEDC2, #FDF6DE 42%, #FFFBEE 72%)`.
* Eyebrow: FOR PARENTS OF CHILDREN AGED 4 TO 16.
* Headline: "A clear digital pathway from first screen to 16.", Nunito 900, -0.035em.
* The "Find my child's stage" chunky button.
* The 3D Planet Friends on a dotted gold road ending at the burgundy Passport.

**Crop out of every frame:**

* The announcement bar. It carries a legal claim the film can't source in passing.
* The hero photo circle. It's generated, and it shows children's faces.
* The "Rachel" parent quote, unless Justin confirms it's a real, permissioned customer.
* The founding price, which changes and carries "for life".

**Three treatments:**

1. **Opener (site to app).**
   * 9:16: the 390 mobile hero at S 2.77. The 32 CSS headline comes out at about 89 px.
   * 16:9: the 1920 hero, sharp for 1.2 to 1.5 s.
   * Then the dotted gold road becomes the gold trail of the in app path. That's the brand's "pathway runs through" device, and it doubles as the cut into the product.
2. **Ground for reading beats.** Only the radial gradient, with the friends road at 35% opacity and 24 px blur along the bottom. Scale 1.06, parallax at 0.3x of the camera move, blur from 0 to 16 px as the UI enters (0.6 s). The phone shadow is warm: `0 40px 90px rgba(122,90,14,0.22)`, never grey.
3. **End card.** Back on the sharp hero, with the CTA set in the film's own type over it. The site button copy and the stage check line agree.

* **Capture:** Playwright at 1920x1080 at 2x density, and 390x844 at 3x density full page. `npx hyperframes capture https://www.guidedchildhood.com` also scaffolds layered scenes and downloads assets.

---

## 13. Capture plan

For stills, use 5x pixel density (1950x4220 from a 390x844 viewport), so pushes up to S 5 stay sharp.

For the chat, prefer a **DOM lift**:

1. Drive the real route in Playwright to each state.
2. Inline its stylesheets, strip the scripts, and save the fragment into the composition inside a 390x844 box.
3. GSAP then animates the real elements, and text stays vector sharp at any zoom.

That's our version of the screen replacement compositing that Apple's product films are anonymously said to use; it's an unverified forum claim.

**On every capture:**

* Wait for `document.fonts.ready`.
* Inject `nextjs-portal{display:none!important}`, which removes the "N" badge.
* Pause CSS animations.
* Run from this worktree's own dev server.
* Swap names (Teo, Olga, Alma Rose, Timbotee) to Ava and Sam.

| Beat | Route and params | States to capture | Stub needed |
|---|---|---|---|
| Chat, thinking, reply, script card | `/ref-digi-chat?kids=1` | Empty, typed in the real "Type or tap the mic" input, sent, thinking line 1, thinking line 2, streaming, done, card | Route `/api/digi` to wait 4.4 s, then stream the panel's rails checked reply |
| Pathway (parent) | `/ref-today-path`, `?done=1` | Full path; the Next card | None |
| Pathway (child) | `/ref-kid-path`, `?claimed=1` | Stone, claim, glow walks on | None |
| Check in faces | `/ref-baseline-checkin` | The faces row; Going great tapped | The confirm route 401s; capture before the post |
| Tracker | `/ref-checkin-acknowledge` | "Heard. These are on your tracker" | Name swap |
| Day tick | `/ref-day-tick`, `?first=1` | The tick flow | None |
| Moments | New `/ref-moment-sheet` | Sheet open; the picked tile; the script card | Stub the script fetch |
| The number | New `/ref-progress` | One worry's arc | Illustrative data |
| Notification | Rebuilt in code | Lock screen and banner | Real copy from `followups/route.ts` |
| Passport | `/ref-passport-book` | Only where the beat is about progress | None |
| Home | `www.guidedchildhood.com` | 1920 hero; 390 full page | Crop list in section 12 |

---

## 14. The timer film: visual spec

The order follows the star quest, and every frame is a real component.

1. **A job done.** `/ref-kid-path` (or `ref-kid-jobs`, `ref-job-board`): the stone ticks, "Claim your star", the star flies (a gold match cut) into the balance.
2. **Stars become minutes.** `/ref-timer-nudge`: the balance (17 stars), device chips, the 15/30/45/60 min chips, "Start 30 min", "6 stars from [name]'s 17 · on the Tablet". Push to S 3.4 on that line. Five minutes a star is visible in the real copy.
3. **The deal at the yes.** `/dev/parent-timer`: "7pm on school nights, later at weekends" and "Stars from quests buy screen minutes, one star is five minutes".
4. **Protected time is an ask, never a flat no.** `/ref-ask-popup?bedtime=1`:
   * SCREEN TIME ASK, "[name] is asking for 30 minutes. On the TV. That is 6 stars, they have 6. Your yes takes the stars now."
   * "Screens are meant to be resting right now. Saying yes still works."
   * Yes, Not now, Decide later.
   * Hold this beat longest. Run it with and without the flag to show the warning appears only in protected time.
5. **The countdown.** `/ref-ask-first?view=timer`, plus the child's view, `?view=child`.
6. **Three kinds of time and the weekly cap.** `/ref-time-tiers`, which needs the `/api/quests/time/settings` stub.
7. **The week.** `/ref-balance` and `?days=2`; `/ref-kid-today?holiday=ready` for the holiday bank.

* Framing as section 7: frameless at S 2.6 for context, S 3.4 on the deciding sentence, and one gold underline per beat.
* Mobbin references for the earn loop:
  * [GoHenry](https://mobbin.com/screens/8c96f881-62da-4f5f-842d-0325a3e06555) (tasks to earnings, one big total)
  * [Greenlight](https://mobbin.com/screens/03ce4a0b-ad29-45e2-af14-fd030a5b4ca5) (chores)
  * [Finch](https://mobbin.com/screens/274b0501-513a-4505-90cd-5cf273669fe9) (dotted progress trail with a countdown)
  * [Structured](https://mobbin.com/screens/f724a5db-76fd-4df5-92e6-88ab2a51ebb9) (one giant "29:53 REMAINING"; apply the same scale to our countdown)
  * [Jomo](https://mobbin.com/screens/0cde19c2-cf0d-4aa2-af08-99fcc7b86185) ("+5min" earned per routine)
  * None of these have protected time going to a parent as an ask, so that's the frame to hold longest.
* The film shows only made up data, and every rate it states matches the code (5 by default).

---

## 15. Asks for Justin

1. Which DiGi raster: `DiGi-star-3d.png` (recommended, it's what the product shows) or `DiGi-star.png` (named in the brief)? And approval to pull the full resolution Higgsfield originals `5ba895ef` and `9199c10c`.
2. A yes on the credit cost if DiGi needs expressions beyond the idle loop (two or three image to video clips from the approved file).
3. Confirm the film family stays Ava, 9, and Sam, 6, and that captures swap out Teo, Olga and Alma.
4. Approve two small fixture routes, `ref-moment-sheet` and `ref-progress`, or say Playwright stubs only.
5. Is the "Rachel" quote a real, permissioned customer? Until it is, it stays out of frame, along with the announcement bar.
6. Confirm the script "Bedtime stalling and one more thing" exists in the scripts table (I couldn't check the database).
7. Agree the brand doc's DiGi line (SVG) gets updated to the 3D star.

---

## Sources

* Brysbaert, M. (2019), *How many words do we read per minute?*, Journal of Memory and Language: [paper PDF](https://www.Gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf)
* Ofcom subtitle speed history (secondary): [liamodell.com 2024](https://liamodell.com/2024/04/16/ofcom-access-code-guidelines-disability-subtitles-audio-description-signing-channel-four/), [Ofcom access services quality](https://www.ofcom.org.uk/tv-radio-and-on-demand/accessibility/ensuring-quality-of-tv-and-on-demand-access-services). The BBC subtitle guide could not be fetched.
* Harvey et al. 2017, reading horizontally scrolling text: [Northumbria research portal](https://researchportal.northumbria.ac.uk/en/publications/oculomotor-and-linguistic-processing-effects-in-reading-dynamic-h/)
* iOS type sizes (secondary; Apple's page could not be read): [Median](https://median.co/blog/apples-ui-dos-and-donts-typography), [Figma forum](https://forum.figma.com/t/apple-human-interface-font-sizes/26267)
* Safe zones (third party, not official): [Ignite Social Media](https://www.ignitesocialmedia.com/?p=57511), [Blitzcut](https://blitzcutai.com/blog/safe-zones-youtube-shorts-reels-tiktok), [Adaptly](https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide), [Google Ads Shorts guide](https://support.google.com/google-ads/answer/16041697?hl=en), [Google video ad specs](https://support.google.com/google-ads/answer/13547298)
* Caption sizes (practitioner): [Blitzcut TikTok caption size](https://blitzcutai.com/blog/best-caption-size-tiktok-2026)
* Length benchmarks (secondary): [Wistia optimal length](https://wistia.com/blog/optimal-video-length), [Chief Marketer on Wistia 2025](https://chiefmarketer.com/wistia-state-of-video-report-engagement-down-content-under-promoted)
* Buck, Notion AI: [buck.co/work/notion-ai](https://buck.co/work/notion-ai)
* Product UI motion (vendor guidance, weak evidence): [Hera](https://hera.video/blog/ui-animation-video-for-software-marketing)
* Brief reference: [whatships.com Rene](https://whatships.com/videos/rene/) (directory entry only, no breakdown)
* Mobbin:
  * AI thinking states: [ChatGPT](https://mobbin.com/screens/67a0c5d3-e9fc-4855-a616-18a662a92392), [Copilot](https://mobbin.com/screens/f7046e88-81cf-4ca0-9e84-24bb5498832f), [Linktree](https://mobbin.com/screens/e9c6c041-97b2-4850-92ca-d8a1f5131588), [Dot](https://mobbin.com/screens/adf02679-bcb3-45b9-aee0-c1ddf9af20f7), [Grok flow](https://mobbin.com/flows/8ec178dc-517f-416b-a069-af8a78aa2c63)
  * Paths: [Duolingo path](https://mobbin.com/screens/8780abad-ff46-47f2-949b-56cc24c7eff5), [Duolingo current node](https://mobbin.com/screens/02544e61-aefd-4d89-815e-ffcc83d83539)
  * Lock screens: [Duolingo](https://mobbin.com/screens/48b9a512-c166-4c70-a6a7-6cb88e7b8145), [Forest](https://mobbin.com/screens/1959671e-3363-44c0-938a-3e4bcbc9f1ea)
  * Earn loops and timers: [Finch home](https://mobbin.com/screens/978a5333-71dc-4c54-98e2-453bc041c5b8), [Finch trail](https://mobbin.com/screens/274b0501-513a-4505-90cd-5cf273669fe9), [GoHenry](https://mobbin.com/screens/8c96f881-62da-4f5f-842d-0325a3e06555), [Greenlight](https://mobbin.com/screens/03ce4a0b-ad29-45e2-af14-fd030a5b4ca5), [Structured](https://mobbin.com/screens/f724a5db-76fd-4df5-92e6-88ab2a51ebb9), [Jomo](https://mobbin.com/screens/0cde19c2-cf0d-4aa2-af08-99fcc7b86185)
* Repo:
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/videos/2026-10-08-digi-launch/build.mjs`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/videos/2026-10-08-digi-launch/beats.json`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/components/digi/ThinkingReassurance.tsx`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/app/(dashboard)/dashboard/digi/DigiChat.tsx`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/shared/components/DigiCharacter.tsx`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/concerns/outcome.ts`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/components/rightnow/RightNowButton.tsx`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/digi-squad/README.md`
  * `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/brand/GDC_SOCIAL_VISUAL_SYSTEM.md`