# The Guided Childhood Starter Pack — build plan

A premium, newspaper style Starter Pack that works on BOTH the app (the free
bonus behind /etsy-bonus email capture, and a member printable) and Etsy (the
lead magnet the printed sheets promise). Warm Happy News illustration quality,
branded, ages 4 upwards. The centrepiece is the star reward chart that mirrors
the app's own economy: 1 star = 5 screen minutes (STAR_MINUTES), stars earned
from real jobs release time on games, device and TV.

## The deal it teaches (must match the app exactly)
- Jobs and offline tasks earn stars.
- 1 star = 5 minutes of chosen screen time (games, device, TV). Config value.
- Younger children (4 to 7): reward daily. Older (8 plus): tally weekly.
- Never a hard stop, always the calibrated pathway. Play pays the top stars.

## Pack contents (the booklet, newspaper styled)
1. **Masthead cover** — "The Guided Childhood Weekly", date line, hero Happy
   News illustration, edition badges (print and play, ages 4 up, fridge ready).
2. **The Star Reward Chart** (hero) — child name field, the deal panel, 5 daily
   tasks across 7 days with star boxes, a "what you can spend stars on" row
   (games, device, TV), weekly total, colour and colour in.
3. **How to make your chart** — cut, stick, laminate, dry wipe, put it on the
   fridge. The grown up one pager.
4. **The jobs list** — offline tasks that earn stars, with star values, a blank
   row to add your own. The fridge companion to the chart.
5. **How to guides** (job skills, character demonstrates each): set the table,
   tidy your room, load the dishwasher. Steps plus a colour in.
6. **Move your body** — a simple kids workout / movement card.
7. **Football skills practice** — Oliver's four skills.
8. **Dance moves** — six moves to learn.
9. **Goal celebrations** — the celebrations to do when a job is done.
10. **Healthy breakfast guide** — child science backed, plate builder.
11. **Read with a grown up** — read together tasks (read with daddy, mummy,
    anyone), a tick list.
12. **Colouring pages** — the Planet Friends and squad to colour.
13. **A game or two** — a simple print and play (spot it, snakes and ladders
    style star run).
14. **Tips page** — how to assemble the starter pages into the booklet, plus
    the funnel bonus (Etsy edition only).

## Style
- Newspaper / Happy News booklet: masthead, column rules, section kickers,
  warm hand drawn illustrations. House tokens throughout (Nunito, IBM Plex
  Mono, butter and ink, chunky 16px radius, 0 5px 0 shadows). No dashes ever.
- Characters DEMONSTRATE (skill rule): Oliver does the football, DiGi hosts the
  chart, the Planet Friends colour in, a squad member shows each how to.

## Illustrations (Higgsfield, Happy News spirit)
Generate on Higgsfield (recraft / nano_banana), warm hand drawn Happy News
style (soft ink outlines, gentle grain, butter and cream, sage, sky). CDN is
blocked in the build environment, so each render is synced through the GUIDED
CHARACTERS Google Drive folder, then pulled local (same loop as the Planet
Friends and fish). Art list: masthead hero, section heroes for move, football,
dance, breakfast, read together, plus the how to demonstrator vignettes.

## Build and delivery
- content/printables/starter-pack/ : print.html (Etsy edition, with funnel),
  product PDFs (A4, US Letter, ink friendly), phone set, images, listing.
- App: served funnel free from public/printables (same split as the other
  products), added to lib/printables/registry.ts, and wired as the /etsy-bonus
  starter pack bundle behind email capture.
- Etsy: the funnel edition, listing package (title, tags, mockups, video and
  reel scripts).

## Order of build (drive to premium, do not stop early)
1. Star reward chart page (anchor, no image dependency). DONE FIRST.
2. Jobs list + how to make the chart.
3. Masthead cover + newspaper frame.
4. How to guides, move, football, dance, breakfast, read together, celebrations.
5. Colouring + a print and play game.
6. Higgsfield Happy News art batch, synced and swapped in.
7. PDFs, phone set, app wiring, Etsy listing package.
