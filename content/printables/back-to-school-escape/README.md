# Zara's Back to School Escape — product folder

Recipe: escape and detective kits (printables-engine recipe 4), Zara's lane.
Price rung £4.99. Seasonal peak late July to early September, evergreen the
rest of the year.

Built 21 July 2026 by the printables-engine pipeline. Fronted by Zara the
Truth Finder (detective, ages 8 to 13). Concept modelled on the print and play
back to school escape format (the client's La Casita reference), rebuilt whole
in the Guided Childhood house style. No third party art, no TV format named.

## The format: colour plus colour in plus tips
The headline feature. One HTML source (print.html) renders three PDFs:
- `product/back-to-school-escape-colour-A4.pdf` — full colour, A4, 9 pages.
- `product/back-to-school-escape-colour-USLetter.pdf` — full colour, US Letter.
- `product/back-to-school-escape-colour-in-A4.pdf` — line art edition, 10 pages
  (the 9 pages as bold black colourable outlines, plus Zara's colouring tips
  page). Made by adding body class `colourin`, which strips decorative SVG fills
  to white with strong ink outlines (non scaling stroke so the line weight is
  even at any size), keeps all text in ink, and swaps the Zara photo for a line
  art magnifying glass. In SVG labels that must stay readable (coin values)
  carry class `keep` so they stay solid ink.

## The nine pages
1. Cover: title, Zara, 5 clues 1 padlock, setup and age badges.
2. How to play plus grown up guide, with the small answer key.
3 to 7. Five puzzles, each yields one digit:
   - P1 Count the supplies (school shop stall SVG) = 7
   - P2 Crack the word (CIL + PEN unscrambles to PENCIL, 6 letters) = 6
   - P3 Pack the PE bag (sort items, 5 belong in the PE bag) = 5
   - P4 The timetable code (count the maths lessons in the week) = 3
   - P5 Lunch money (two £2 coins and four £1 coins add to £8) = 8
8. The padlock finale: five digit boxes, case solved message, certificate.
9. Funnel page: free Christmas Escape edition plus a warm review ask.

**The padlock code is 7 6 5 3 8.** Verified against the drawn artwork and the
answer key on page 2. Chosen so no digit can be guessed from the others.

## Assets
- `images/Zara.png` — Zara's real character art (cover and avatar).
- `images/preview-page-N.png` — colour edition page previews (1 to 9).
- `images/colour-in-preview-page-N.png` — colour in previews (1 to 10, tips is 10).
- `fonts/` — Nunito and IBM Plex Mono, local, via local-fonts.css.

## Funnel wiring
Last PDF page offers the free Christmas Escape edition at
guidedchildhood.com/etsy-bonus (page still to be built on the platform).
Discreet guidedchildhood.com footer on every page.

## Rebuild
`node build-btse.mjs` from the scratchpad (Playwright, chromium at
/opt/pw-browsers). Edit print.html then rerun to regenerate all three PDFs and
both preview sets.

## Still to do before listing goes live
1. Build the Christmas Escape edition and wire /etsy-bonus on the platform.
2. Shoot the hands on table listing video and the Instagram reel.
3. Mockup photos (kitchen table hero, colour vs colour in side by side,
   part coloured page).
4. Optional: a US Letter colour in variant if buyers ask (currently colour in
   ships A4 only).
5. Optional phone sized 9:16 set of the puzzle pages (skipped for launch).
