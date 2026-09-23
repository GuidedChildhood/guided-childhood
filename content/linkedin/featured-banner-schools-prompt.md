# The LinkedIn Featured banner for the schools service

One image, one job: a head scrolling past sees the weight of what they are
legally required to teach, and sees that the answer already exists. Written
23 September 2026.

The banner links from the Featured section to
`https://schools.guidedchildhood.com`.

## Every number on it is checkable

Nothing goes on this image that the product cannot prove. The four claims and
where each one is held:

| Claim | Where it is proved |
|---|---|
| 57 online and digital requirements | `shared/schools-rshe-2026.ts`, 57 rows, counts computed not typed |
| All 57 taught | every row verdict is FULL, held by `scripts/check-rshe-coverage.mjs` |
| 29 lessons | `CURRICULUM` in `shared/schools-curriculum.ts`, 29 modules |
| Reception to Year 13 | the key stage order, EYFS to KS5 |

The source behind the requirements is the statutory RSE and Health Education
guidance, July 2025. The guidance as a whole runs to 195 numbered items across
28 strands; the 57 are its online and digital part, which is what this scheme
is. The banner says "online and digital" for exactly that reason. The public
page a head can check it against is `/hub/rshe-mapping`.

## The prompt

Paste the block below into ChatGPT and ask for the image.

```
Create a wide LinkedIn banner image, 1200 by 627 pixels, landscape 1.91:1.

STYLE
Flat editorial vector illustration. Warm, confident, printed rather than
digital. Closer to a good UK education publisher's cover than to a tech
startup. No photorealism, no 3D render, no glossy highlights, no lens flare,
no bokeh, no full canvas gradient, no glow behind type, no neon, no purple,
no blue tech palette, no circuit boards, no robots, no cartoon mascots, no
stock photo people, and no government crests, logos or official branding of
any kind.

PALETTE, use these exact values and nothing else
background cream #F9F8F6
ink #1A1A2E for line work and type
butter gold #EDC35F for the answer side and the highlight
deep gold #C99A28 for the solid shadow under gold shapes
deep espresso #2E2818 for the darkest accents
one muted cold grey blue #8A8FA3, used only on the problem side

COMPOSITION, left to right across the full width

Left third, the problem, cold grey blue and ink on cream.
A tall, leaning, precarious stack of official guidance documents and ring
binders, drawn flat with clean ink outlines. The stack is cropped by the top
edge of the frame so it reads as taller than the image. Dozens of thin sticky
tabs bristle out of the pages in dull grey and dusty tones. The pages carry
tiny abstract clause marks and numbered lines, illegible squiggles standing in
for text, never real readable words. At the base of the stack a small simple
ink figure of a teacher, dwarfed by it, holding one sheet of paper. Everything
on this side is drained of warmth.

Centre.
A single clean vertical edge where the cold side ends and warm butter light
begins, like a door opened onto a lit classroom. A hard deliberate edge, not a
soft blend. The butter glow spills only to the right of it.

Right two thirds, the answer, butter gold on cream.
The same clauses resolved into order: a neat rectangular grid of small rounded
squares, each carrying a confident ink tick, laid out calmly with generous
spacing. Beside the grid, one chunky rounded rectangle card, corner radius 16
pixels, cream fill, 2 pixel ink border, and a solid flat drop shadow offset 5
pixels straight down in deep gold #C99A28 with no blur at all. Behind the card,
the suggestion of a classroom whiteboard, one simple warm rectangle, nothing
written on it.

TYPOGRAPHY
Display type in a heavy rounded geometric sans, Nunito or the closest
available, weights 800 to 900, tight letter spacing. Label type in a monospace
face, IBM Plex Mono or the closest, uppercase, wide letter spacing. Never
Inter, Helvetica, Arial or Montserrat.

TEXT IN THE IMAGE, exactly these strings, spelled exactly as written, and no
other words anywhere in the picture
1. Small uppercase mono label above the stack, grey blue: STATUTORY RSHE GUIDANCE
2. Large display over the left side, ink: 57 online and digital requirements
3. Large display on the card, ink, with the number in butter gold: All 57 taught
4. Smaller display under it, ink: 29 lessons, Reception to Year 13
5. Small uppercase mono, bottom right, deep espresso: GUIDED CHILDHOOD SCHOOLS

Add no other text. No tagline, no web address, no dates, no numbers other than
those above. Never use a hyphen or a dash anywhere in the image.

LAYOUT SAFETY
This will be cropped inside a LinkedIn Featured tile. Keep all five text
strings and the whole tick grid within the centred area, leaving at least 100
pixels clear on the left and right edges and 60 pixels clear top and bottom.
The image must still read at 300 pixels wide: the contrast between the cold
leaning stack and the warm ordered grid is the message, and it has to be
obvious before a single word is read.
```

## If the text comes out garbled

Image models misspell. Two fixes, in order:

1. Re run and name the failing string: "keep everything, fix only the line so
   it reads exactly: 29 lessons, Reception to Year 13".
2. If it still fails, ask for the same image with **no text at all**, then set
   the five strings over it in Nunito 900 and IBM Plex Mono. That is the
   reliable route and the type will be on brand rather than approximated.

## Variant B, if A reads too busy at thumbnail size

Same palette and rules, one object instead of two sides: a single heavy ring
binder, cold and tabbed, opening from left to right, and what comes out of it
is not more paper but one clean butter gold lesson card with a tick. Text
drops to two strings, "57 online and digital requirements" on the binder and
"All 57 taught" on the card. Fewer words survives cropping better.

## What must never go on it

- No characters. Pebble, Bloop, Orbit, Nova and Cosmo are only ever their real
  art from `public/digi-squad/`, never generated fresh. If the banner wants
  them, drop the real cutouts in afterwards.
- No dashes, in any string, ever.
- No claim that is not in the table at the top of this file.
- No crest, seal, department logo or anything that implies endorsement.
