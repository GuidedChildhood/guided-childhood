# The teacher start film (schools)

24 November 2026. Now a cut in the walkthrough engine
(`videos/2026-10-09-digi-shorts`), the same structure and finish as the
Instagram walkthrough Reels, per the product-shorts skill ("One engine, one
structure, every film"). The first version was a one off recorder (`rec.mjs`,
kept only for reference; do not re-make the film with it).

| | |
|---|---|
| Run | Schools |
| Service | Zero prep lessons: code, year, Teach, the words to say on every slide |
| Format | 28.6s, music and sound cues, no voice. Vertical 1080 by 1920 and horizontal 1920 by 1080 |
| Channels | LinkedIn (`content/packs/2026-11-24-teacher-start-film/linkedin-post.md`), Reels, the pilot page, the pilot emails |
| Free step | The pilot: two lessons free for a term, no card, no contract, no pupil data. `schools.guidedchildhood.com/pilot` |
| Cuts | `cuts/schools-teacher-start.json` (vertical master), `cuts/schools-teacher-start-h.json` (horizontal, its own layout: words left, screen right) |
| Files | `teacher-start-v.mp4`, `teacher-start-h.mp4` here and in `schools/public/films/`, with `teacher-start-poster.jpg` (horizontal) and `teacher-start-poster-v.jpg` |

## The shots

1. **The problem.** "The problem", the pill "I'm not an online safety specialist. I teach Year 4.", the marker "Inside Guided Childhood. Schools", "A made up school. Real screens."
2. **The turn.** "So the lesson is" / "already written."
3. **1 Your school code** (One code for the staff room): `/unlock` with a made up code typed, the code highlighted, Open the curriculum tapped.
4. **2 Pick your year** (Reception to Year 13): `/start`, Years 3 to 6 highlighted and tapped.
5. **3 Press Teach** (No preparation): `/start?stage=KS2`, the first lesson card, its title highlighted, Teach this lesson tapped.
6. **4 The words to say** (On every slide): the classroom player, slide 1, then an unseen cut down to the open teacher script, its first line highlighted.
7. **End card.** DiGi, "One plan for screens, phones and AI.", "Two lessons free for a term.", "No card. No contract. No pupil data.", Request a pilot, the pilot URL, the slate.

Every claim has a proof path on the schools site: the code door (/unlock, "One
code for the whole staff room"), the start page (/start, Reception to Years 12
and 13, "runs with no preparation"), the player's teacher script, the pilot
page (two lessons, a term, no card, no contract, no pupil data). No person, no
child, no credits, no real school code. Short enough that no TikTok cut is needed.

## Rebuild it

1. Captures (only after a design change). In `schools/`, stand in for
   `lib/supabase/server-db.ts` with a local reader of `content/modules/*.json`
   (back the real file up first, restore it after, never commit it), then
   `SCHOOLS_ACCESS_CODES=demo-school-code SCHOOLS_ACCESS_SECRET=local-secret npx next dev -p 3100`.
   From the engine folder: `CHROME=<chromium> node tools/capture-schools.mjs`.
   It writes 5x stills to `assets/captures/schools/` and prints where the
   highlighted lines sit, for the cut's `inScreen` boxes.
2. Render, from the engine folder:
   `sh tools/render-both.sh schools-teacher-start schools-teacher-start-h`
   (outputs in `renders/out/`). Read it at 10 frames a second before sending.
3. Level and compress for the site:
   `ffmpeg -i renders/out/<cut>.mp4 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -af "loudnorm=I=-16:TP=-1.5" -c:a aac -b:a 128k -movflags +faststart teacher-start-<v|h>.mp4`.
   Posters are the 16.0s frame (step 3) of each render.

The horizontal cut and the longer end card line use the engine's `css` field
(a cut's own styles, added 24 November; cuts without it build byte for byte as before).
