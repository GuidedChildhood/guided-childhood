# The teacher start film (schools)

24 November 2026. 19.6 seconds, silent, two cuts:
- `teacher-start-v.mp4`, 1080 by 1920, for LinkedIn mobile, Reels and the pilot page on a phone
- `teacher-start-h.mp4`, 1920 by 1080, for the invitation and reminder emails (as a linked thumbnail), the pilot page and LinkedIn desktop

What it shows, all of it the real schools site (built in the UX batch 6 PR):
1. Caption "Not an online safety specialist? Watch this." over the school code page.
2. "1. Your school code": a made up code typed, Open the curriculum tapped.
3. "2. Pick your year": the start page, Years 3 to 6 tapped.
4. "3. Press Teach": the first lesson card, Teach this lesson tapped.
5. "The words to say are on every slide.": the classroom player, slide 1, the teacher script open.
6. End card: "The online side of RSHE, ready to teach. Two lessons free for a term. schools.guidedchildhood.com/pilot. No card. No contract. No pupil data."

Every claim has a proof path: the code door (/unlock), the start page (/start),
the player's teacher script, the pilot page (two lessons, a term, no card, no
contract, no pupil data). Nothing invented, no person, no child, no credits.

## Re-make it

`rec.mjs` drives a local schools build with Playwright, frame by frame, and
writes an ffmpeg concat list. Captions and the end card are injected film
layers on top of the real page. To re-make after a design change:

1. Run the schools app locally with a made up code:
   `SCHOOLS_ACCESS_CODES=demo-school-code SCHOOLS_ACCESS_SECRET=<anything> npx next dev -p 3100` in `schools/`
   (and a local stand in for `lib/supabase/server-db.ts` reading `content/modules`, never committed).
2. `node rec.mjs v <dir>` and `node rec.mjs h <dir>`.
3. `ffmpeg -f concat -safe 0 -i <dir>/list.txt -vf "fps=30,format=yuv420p" -c:v libx264 -crf 18 -movflags +faststart out.mp4`
