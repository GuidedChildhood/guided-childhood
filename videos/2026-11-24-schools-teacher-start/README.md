# The teacher start film (schools), version 3

24 November 2026. A cut in the walkthrough engine
(`videos/2026-10-09-digi-shorts`), per the product-shorts skill ("One engine,
one structure, every film"). Version 3 is rebuilt from the research led
storyboard in `plans/2026-11-24-teacher-film-walkthrough-research.md` (nine
shots, the home page tokens, the premium motion spec). `rec.mjs` is version 1's
one off recorder, kept only for reference; do not re-make the film with it.

| | |
|---|---|
| Run | Schools |
| Service | Zero prep lessons: the lesson is written, three steps to Teach, the words to say, safeguarding first, the pack prints, a note goes home |
| Format | 40.0s full, 32.1s short. Music and sound cues, no voice. Vertical 1080 by 1920 and horizontal 1920 by 1080 |
| Channels | LinkedIn (`content/packs/2026-11-24-teacher-start-film/linkedin-post.md`), Reels, the pilot page, the pilot emails (poster with a play button, never an embed) |
| Free step | The pilot: two lessons free for a term, no card, no contract, no pupil data. `schools.guidedchildhood.com/pilot` |
| Cuts | `cuts/schools-teacher-start.json` (vertical master), `cuts/schools-teacher-start-h.json` (horizontal, its own layout: words left, object right), `cuts/schools-teacher-start-short.json` (vertical, shots 5 and 8 dropped, for LinkedIn and TikTok). All three are written by `tools/make-teacher-v3.mjs`; edit that, not the JSON |
| Files | `teacher-start-v.mp4`, `teacher-start-h.mp4`, `teacher-start-short-v.mp4` here; the first two also in `schools/public/films/` with `teacher-start-poster.jpg` (horizontal) and `teacher-start-poster-v.jpg` |

## The shots (full cut)

1. **The problem** (3.9s, teal hero ground). "The problem", the pill "I teach Year 4, not online safety.", the Guided Childhood Schools mark in by 0.6s.
2. **The lesson is already written** (5.2s). Hard cut to cream. `/lesson/ks2-04-screen-routines` in a phone: it rises with a 2 degree tilt that settles, pushes, then focuses on the page's own line "69 minutes · 29 slides · 3 interactive", which glows. Eyebrow "A made up school. Real screens."
3. **School code, Your year, Teach** (4.0s). The same phone; its screen slides on twice (`/unlock` with the made up code, `/start`, `/start?stage=KS2`), a tap ripple on each button, the three step chips lighting butter in turn.
4. **The words to say, under every slide** (4.7s). The phone lifts away; the classroom player rises in a board frame (`/teach/ks2-04-screen-routines`, 1280 by 800) and the camera dives to the script's first line, "Settle everyone with this slide up.", then settles back.
5. **A sensitive lesson? Your safeguarding lead comes first.** (3.6s). Same board, cross fade to ks2-08's Before slide 1 screen with a made up lead ("Mrs Hale"), focus on the lead line.
6. **The whole pack prints. Ready to photocopy.** (3.3s). Print Sheets 1, 3 and 5 drop in as A4 paper, fanned, each with a soft contact shadow.
7. **And a note goes home.** (5.0s). Sheet 6, the parent note, slides in on top and the camera pushes into its Ask at tea question, "Can you teach me the cool down lap?". The sheet fades out below that box, so the passport box and any home code block are never in frame.
8. **For your PSHE lead: every online RSHE requirement, mapped to a lesson.** (4.3s). `/hub/rshe-mapping` on the board, "All 57 online requirements are taught.", then a pan down to the first requirement and the lessons that teach it.
9. **End card** (6.0s, teal). DiGi (the approved `DiGi-star.svg`), the mark, "One plan for screens, phones and AI.", "Two lessons free for a term.", "No card. No contract. No pupil data.", Request a pilot, `schools.guidedchildhood.com/pilot`, "A made up school. Real screens."

The short cut is the same film without shots 5 and 8.

Every claim is a real screen: the lesson page's minutes line, the `/start`
three steps, the player's teacher script, `BeforeSlideOne.tsx` on a flagged
lesson, the print page's sheets, Sheet 6 and ks2-04's `family_question`, the
open mapping page, the pilot page's terms. Nothing PARTIAL or MISSING in
`plans/2026-11-24-school-home-bridge-audit.md` is shown or said: no line says a
code or lesson fills or credits the passport, and nothing is on a child's record.

## What changed from version 2, and why

- **Colour.** The schools home page tokens, not the parents film's butter
  ground: cream `#F9F8F6` with a soft white radial lift, the hero teal gradient
  on the hook and end card, ink text, butter only on the one thing to look at.
- **Shading.** Real screens now sit in real objects (a phone for the staff room
  steps, a classroom board for the player, A4 paper for the pack) with the home
  page's warm three layer shadow (`rgba(46,40,24,a)`, never black), a contact
  shadow and a faint glass sheen. Version 2 was a zoomed phone screenshot with
  no frame, and filmed the projected player on a phone.
- **Motion.** Every shot has an eased entry push (power3.out), a focus move to
  the proof line (power2.inOut) and a hold that meets the reading rule. Shots
  join by match moves (the phone and board stay put while their screens change)
  or a rise and lift, never a jump. Highlights are soft glows, not boxes. Words
  fade up in staggered lines on their own layer above a veil of the ground.
- **Proof.** Four proofs version 2 did not show: minutes and slides, the
  safeguarding screen, the pack, the note home; plus one handoff shot for the
  PSHE lead. 40s against 28.6s, every added second a proof.

## Rebuild it

1. Captures (only after a design change). In `schools/`, back up
   `lib/supabase/server-db.ts` and stand in for it with a local reader of
   `content/modules/*.json` (never commit it; restore it after), then
   `SCHOOLS_ACCESS_CODES=demo-school-code SCHOOLS_ACCESS_SECRET=local-secret ../node_modules/.bin/next dev -p 3100`.
   From the engine folder: `CHROME=<chromium> node tools/capture-schools.mjs`.
   It writes 5x stills to `assets/captures/schools/` (phone screens at 390 wide,
   board and laptop screens at 1280 by 800, print sheets at A4 width) and prints
   where each highlighted line sits. Put changed numbers in `AT` at the top of
   `tools/make-teacher-v3.mjs`.
2. Cuts: `node tools/make-teacher-v3.mjs`.
3. Render, from the engine folder:
   `sh tools/render-both.sh schools-teacher-start schools-teacher-start-h schools-teacher-start-short`
   (outputs in `renders/out/`). Read it at 10 frames a second before sending.
4. Level and compress:
   `ffmpeg -i renders/out/<cut>.mp4 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -af "loudnorm=I=-16:TP=-1.5" -c:a aac -b:a 128k -movflags +faststart <file>.mp4`.
   Posters are the 27.6s frame (the Ask at tea close up) of each full render,
   as the research asks for email.

## How the engine does it

Stage shots (`"stage": true` in a cut) are drawn by `tools/stage3.mjs`, which
`build.mjs` loads only when a cut has one, so every other cut builds byte for
byte as before (walkthrough 01, 04 and 19 were diffed). A stage shot has a
ground, objects (phone, board, paper) holding capture pages with glows, taps,
pans and in frame page changes, a world camera, a veil, and its words.
