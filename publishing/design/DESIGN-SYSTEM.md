# The Guided Planet design system

The permanent rules every edition prints by. The code is
`publishing/design/newspaper.css`; where this file and `shared/tokens.css`
disagree, tokens.css wins.

**The identity in one line.** The warmth of an illustrated newspaper, the
restraint of an independent magazine, the imagination of a small illustrated
planet, in Guided Childhood's cream, ink and butter. Original: we learned
recognisability and simplicity from The Happy Newspaper and copy nothing of its
artwork, layout or lettering.

## 0. The two themes

Every issue names its look in `issue.json`, `"theme"`. Same pages, same checks.

- **boho** (the default since 13 October 2026, `design/boho.css`). Justin: the
  family account's audience, Inspired by Alma's, loved the Happy News look, and
  the free downloads have to win them. Sand paper, espresso ink, the house
  butter and sage warmed into clay, mustard and dusty rose; headlines in
  Fraunces at its softest and wonkiest; handwritten labels in Caveat; the
  painted rainbow, the FREE burst, stickers with hard shadows, wavy rules and
  smiley dots from the app's own `HappyNewsBits`; the app's own drawn Happy
  News icons (`library/happy-icons.json`, exported from `HappyIcon.tsx` and
  checked against it by the tests); the masthead word drawn from the font's
  outlines (`design/make-masthead.py`). This reverses, for the printables only,
  the 5 October rule that retired The Happy Newspaper as a reference for social
  cards. Their energy, our drawing, copy nothing.
- **editorial** (`design/newspaper.css` alone): cream, ink and butter, Nunito
  headlines, the magazine look. Kept for anything that wants the quieter voice.

## 1. The page

- A4 portrait, 210 by 297mm. Fixed page boxes, never flowing text.
- Bleed 3mm on the print PDF, 0 on the download and ink saver. Backgrounds run
  into the bleed; nothing meaningful does.
- Safe area 12mm inside the trim on every side. Only the running head and the
  folio sit in the margin, and never nearer the trim than 4mm (checked).
- A 12 column grid with a 4.5mm gutter.
- Every page has a running head (the mark, the section, the issue and month)
  and a folio (the destination, the number, "Page n of 12").

## 2. Type

| Use | Face | Size |
| --- | --- | --- |
| Masthead | Nunito 900 | 104pt "Planet" under 27pt "The Guided" |
| Page headline | Nunito 900, tracking minus 2.2 percent | 31pt, balanced |
| Section head | Nunito 900 | 17pt |
| Card head | Nunito 800 | 12pt |
| Standfirst | Nunito 600 | 12.5pt |
| Body, children's pages | Nunito 600 | 11.4pt on 1.44 |
| Body, grown ups' boxes | Nunito 500 | 10.6pt on 1.48 |
| Eyebrows, labels, folios | IBM Plex Mono 600 or 700, capitals, wide tracking | 7 to 7.4pt |
| Sources | Nunito 500 | 6.9pt |

Body text never under 10pt and no text under 5.2pt (checked). No Inter, no
hand lettering. Drop caps open the first paragraph of a story.

## 3. Colour

| Token | Hex | Use |
| --- | --- | --- |
| cream | `#F9F8F6` | The paper |
| ink | `#1A1A2E` | Text, lines, the night sky |
| butter | `#EDC35F` | The one gold detail, tags, the pathway |
| deep gold | `#C99A28` | Shadows and borders only (2.5 to 1 on cream, so never small text) |
| gold ink | `#7A5A0E` | Gold you can read |
| espresso | `#2E2818` | The Family Explorer |
| grey blue | `#8A8FA3` | Decoration only; `#4E546B` when it is text |
| pale sage | `#E8F0EE`, mid `#C9DBD2`, ink `#335C4B` | The Thinking Forest and the Connection Garden |
| passport | `#571C2A` | Only where the Passport itself appears |

Contrast is WCAG AA, measured on the rendered page against the real background
(4.5 to 1, or 3 to 1 for large text). A box carries its own paper and its own
ink, so a card on a dark page is never cream on white (a real bug the check
caught on the first proof).

## 4. The six destinations

Each has a ground, a tag and an emblem (`templates/art.ts`), so a reader knows
where they are from across the room.

| Destination | Ground | Tag |
| --- | --- | --- |
| The Discovery Observatory | night ink | ink with butter type |
| The Maker District | tint butter | butter |
| The Thinking Forest | pale sage | mid sage |
| The Connection Garden | pale sage | Bloop's soft green |
| The Research Room | pale grey blue | grey blue |
| The Family Explorer | cream | espresso with tint butter type |

## 5. Components

Fact file (butter tint, deep gold border, big numbers with their label and
note) · pull quote (butter opening mark) · research summary (what the research
found, what it cannot tell us yet) · friend says (an approved cutout and a
bubble with the friend's name) · activity box (dashed border, Activity and No
screen needed tags, numbered steps in ink circles) · cut line (dashed, a drawn
scissors mark) · sources box (numbered rings matching the markers in the text,
publisher, title, date, site) · QR (ink frame, label, the address in mono) ·
turn to tag · the Planet Passport (burgundy, gold dashed stamps, a sign off line).

## 6. Illustration

1. Ink line, round caps, one weight per drawing.
2. Flat fills from the palette; the only gradient is the night sky.
3. One gold detail per picture: the dotted gold pathway.
4. No faces of real children, no invented app screens, no words inside a
   picture except a map's place labels and a diagram's labels.
5. Characters are never drawn or generated. They are the approved cutouts and
   mood stills, placed on top of the art and hash checked.
6. Generated art (Higgsfield) is environments and props only, made from the
   recipes in `higgsfield/recipes.json`, approved before use.

## 7. The three PDFs and the web

- **Print ready**: 216 by 303mm with bleed, full resolution art, colour.
- **Download**: A4, lighter art (about 3 MB), for screens and home printers.
- **Ink saver**: white paper, light skies, for school photocopiers.
- **Online edition**: one accessible column, real headings, alt text, every
  citation linked, dark mode, readable at 320px.

## 8. What the validator checks on every render

Twelve pages, the folio matches the page, no frame overflows, no two blocks
collide, all text inside the safe area, body at 10pt or more, contrast AA, art
at 150 dpi or more on print (220 preferred), every image loaded, every font
embedded (Nunito and Plex Mono, nothing else), the PDF the right size, every
QR from an approved address. Then visual regression against the approved
baselines in `tests/baselines`.
