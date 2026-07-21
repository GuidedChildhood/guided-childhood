# Left and Right with Oliver

A print and play laterality printable for ages 4 to 7 that teaches left and
right, fronted by Oliver the Screen Time Boss through a football theme. Our
house style version of La Casita Educativa's right and left sorting activity.

## Recipe used
Tracing and fine motor / early learning lane (printables engine recipe 5),
extended into a full sorting and directions pack. Character: Oliver (his colour
is coral, his metaphor is football and the kicking foot).

## Price rung and season
List £2.99, launch sale to £2.39 for the first two weeks. Early learning
review engine band. Evergreen with a small back to school lift. Refresh
imagery each August.

## Pages (8 product pages, plus 1 colour in only tips page)
1. Cover: Left and Right with Oliver, football theme, ages 4 to 7
2. How to play and grown up guide: body first, then the page, Oliver's kicking
   foot trick, plus the answer note for the sorting cards
3. The left and right sorting mat: LEFT and RIGHT halves, dashed divider, giant
   arrows, hand rest strip
4. Cut out cards set 1: arrows, pointing hands, cars (six cards, left and right)
5. Cut out cards set 2: football boots, kicking footballers, signposts (six cards)
6. Which hand: trace your left hand and right hand, plus a put your right hand
   on activity with tick boxes
7. Follow the arrows to the goal: a zig zag dribble, say right, left, right
8. Funnel: free bonus at guidedchildhood.com/etsy-bonus plus a plain review ask
9. Oliver's colouring tips (appears in the colour in edition only)

Every card that belongs on a side carries a small corner arrow pointing to its
correct side, and the grown up answer note on page 2 lists all twelve. Six
cards belong left, six belong right.

## Outputs
### PDFs (in product/)
- left-and-right-colour-A4.pdf (full colour, A4)
- left-and-right-colour-USLetter.pdf (full colour, US Letter)
- left-and-right-colour-in-A4.pdf (bold colourable line art via the colourin
  body class, fills to white, text stays readable, plus Oliver's tips page)

### Previews (in images/)
- preview-page-1.png to preview-page-8.png (full colour)
- colour-in-preview-page-1.png to colour-in-preview-page-9.png (line art,
  includes the tips page)
- Oliver.png (character art, copied from public/digi-squad/Oliver.png, used on
  the cover, the guide avatar and the funnel page)

### Listing (in listing/)
- listing.md: title, price, 13 tags, 10 photo slots, video and reel scripts,
  compliance notes

## How it was built
print.html holds all nine pages. The colourin body class strips fills to white
and forces bold ink outlines for the colour in edition, and reveals the tips
page. Character art is the real Oliver.png on the cover, guide and funnel; a
simple football avatar stands in for Oliver in the colour in edition where the
photo is hidden. All other art is hand drawn inline SVG. Fonts are local Nunito
and IBM Plex Mono in fonts/.

Rebuild with the scratchpad script (playwright-core, chromium):
`node /tmp/claude-0/-home-user/4ddcfdbf-8e4b-5429-b4bd-ed1d171477d2/scratchpad/build-lar.mjs`
It renders the three PDFs and all preview PNGs.

## House rules honoured
Nunito plus IBM Plex Mono, house colour tokens only, chunky 16px cards, coral
as Oliver's colour, no dashes anywhere, UK spelling, ages written as 4 to 7. No
medical claims. Funnel points to a free bonus, never a checkout. Bonus and
review ask carry no incentive.
