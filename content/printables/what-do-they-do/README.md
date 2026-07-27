# What Do They Do? — product folder

Recipe: early learning game (printables-engine, phonics and jobs), brought into
Zara's detective lane for ages 5 to 8. Price rung £3.95. Evergreen for home
learning and early years, peaks each September.

Built 21 July 2026 by the printables-engine pipeline. Fronted by Zara the Truth
Finder (detective energy, scaled down to ages 5 to 8). Concept modelled on the
La Casita "Children's professions: what do they do?" syllable and jobs game,
rebuilt whole in the Guided Childhood house style. No third party art, no brand
named.

## The format: colour plus colour in plus tips
One HTML source (print.html) renders three PDFs:
- `product/what-do-they-do-colour-A4.pdf` — full colour, A4, 9 pages.
- `product/what-do-they-do-colour-USLetter.pdf` — full colour, US Letter, 9 pages.
- `product/what-do-they-do-colour-in-A4.pdf` — line art edition, 10 pages (the 9
  pages as bold black colourable outlines, plus Zara's colouring tips page). Made
  by adding body class `colourin`, which strips decorative SVG fills to white with
  strong ink outlines (non scaling stroke, even line weight at any size), whitens
  the syllable tiles and clap dots so they colour cleanly, keeps all text in ink,
  and swaps the Zara photo for a line art magnifying glass. Faces stay put because
  eyes carry class `keep` (solid ink).

## The nine pages
1. Cover: title, Zara, ages 5 to 8, clap build match badges.
2. How to play plus grown up guide, with the full answer key.
3 to 6. Eight job cards, two per page. Each card: a worker illustration, the
   syllable tiles to cut and build (for example BA + KER makes BAKER), the letter
   boxes, and the place and tool to match.
7. Match the worker to their tool: eight workers (A to H) and eight shuffled
   tools (1 to 8), draw a line. Answer note points to the guide page.
8. Clap the syllables: how many beats in each job, with dot cues and write boxes.
9. Funnel page: free More Jobs edition plus a warm review ask.
10. Colouring tips (colour in edition only).

## The eight jobs, verified
| Job | Syllables | Claps | Place | Tool |
|---|---|---|---|---|
| BAKER | BA KER | 2 | bakery | rolling pin |
| DOCTOR | DOC TOR | 2 | surgery | stethoscope |
| FARMER | FARM ER | 2 | farm | tractor |
| TEACHER | TEACH ER | 2 | classroom | book |
| BUILDER | BUILD ER | 2 | building site | hammer |
| VET | VET | 1 | animal clinic | bandage |
| CHEF | CHEF | 1 | kitchen | frying pan |
| POSTIE | POST IE | 2 | post office | letters |

Syllable splits use spaces, never hyphens. UK spelling and UK jobs throughout
(surgery, postie, building site). No dashes in any copy.

**Match page answers (verified against the drawn tools): A to 1, B to 4, C to 8,
D to 7, E to 2, F to 6, G to 3, H to 5.** Both the answer key on page 2 and the
shuffled tool column on page 7 were cross checked against each worker's card.

## Worker illustrations (colour edition)
The colour edition job cards use real Higgsfield illustrations (nano_banana,
flat premium preschool card style, UK jobs) in `images/jobs/clean/`, cleaned to
transparent backgrounds and tight cropped by the canvas processor (grey card
frames removed from builder and vet). The colour in edition keeps the bold SVG
line art so children colour clean outlines, so both editions coexist in one
print.html (CSS: `.jobcard.has-photo .worker-svg` is hidden in colour mode,
`.worker-photo` is hidden in colour in mode).

All eight jobs are illustrated: baker, doctor, farmer, teacher, builder, vet,
chef, postie. The doctor is the `e248ce05` render with its decorative frame inset
cropped and the background floodfilled to transparent, so it reads as a bust
rather than full body but sits cleanly on the card; the other seven are full
body. The colour in edition keeps the SVG line art for every card so children
colour clean outlines.

## Assets
- `images/Zara.png` — Zara's real character art (cover and avatar).
- `images/jobs/clean/*.png` — cleaned Higgsfield worker illustrations (6 jobs).
- `images/preview-page-N.png` — colour edition page previews (1 to 9).
- `images/colour-in-preview-page-N.png` — colour in previews (1 to 10, tips is 10).
- `fonts/` — Nunito and IBM Plex Mono, local, via local-fonts.css.

## Funnel wiring
Last PDF page offers the free More Jobs edition at guidedchildhood.com/etsy-bonus
(page still to be built on the platform). Discreet guidedchildhood.com footer on
every page.

## Rebuild
`node build-wdtd.mjs` from the scratchpad (Playwright, chromium at
/opt/pw-browsers). Edit print.html then rerun to regenerate all three PDFs and
both preview sets.

## Still to do before listing goes live
1. Build the More Jobs edition and wire /etsy-bonus on the platform.
2. Shoot the hands on table listing video and the Instagram reel.
3. Mockup photos (kitchen table hero, colour vs colour in side by side,
   tiles being pushed together).
4. Optional: a US Letter colour in variant if buyers ask (colour in ships A4 only).
