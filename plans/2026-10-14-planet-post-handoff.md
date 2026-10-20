# Handoff spec: The Planet Post, Issue 1, canvas to code

14 October 2026. From the Claude Design canvas
(https://claude.ai/artifact/GFpy5WcLJ1Gys1zCHtvreP) to the code version that
renders the downloads: `components/printables/news/PlanetPost.tsx`, words in
`lib/printables/free/planet-post.ts`, PDFs by `scripts/render-free-printables.mjs`.

Includes the critique of 14 October (six fixes) and the accessibility audit of
the same day. Nothing here is built yet. Build it in one PR, then re-render.

## Overview

A four page A4 / US Letter newspaper for children 6 to 11, read and filled in
at the kitchen table with a pencil, and printed at home by the parent who
downloaded it. The live PDFs and the page previews on /free/planet-post are the
older code version. The canvas is ahead: it has the Planet Friends line up and
the fixes. This spec brings the code level with the canvas, plus the six
critique fixes that are on neither yet.

## Layout and the one scale rule

| | Canvas | Code |
|---|---|---|
| Page | 794 x 1123 px (A4 at 96 dpi) | `NEWS_W` 740 x `NEWS_H` 1000 px, centred on A4 or Letter |
| Width factor | 1 | 0.932 |
| Height budget at the same width | 1123 | 1073 |

**Rule:** the canvas numbers below are canvas px. Multiply widths, type and
spacing by 0.93 for code, and treat the height as 50 px tighter than the canvas
shows. Keep 740 x 1000: it is what lets one design print on both papers with
10 mm clear on every edge (comment at the top of PlanetPost.tsx). Page 1 is the
only page where the tighter height bites, and the budget below pays for it.

## Design tokens used

Code names are the ones already imported in PlanetPost.tsx.

| Token (design system) | Code | Value | Usage |
|---|---|---|---|
| `ink` | `HAPPY.ink` / `INK` | #1A1A2E | All text, every edge, every ledge |
| `paper` | `#fff` | #FFFFFF | Page, boxes |
| `butter-light` | `HAPPY.butterLt` / `CRAYON.paper` | #FEF7E0 | Masthead ground, quiet boxes, every message bubble, the job stars |
| `butter` | `HAPPY.butter` | #EDC35F | Lead ribbon, wheel hub |
| `crayon-sky` | `CRAYON.sky` | #8EC3F0 | Page 3 ribbon, mine jar |
| `crayon-green` | `CRAYON.green` | #93CFA8 | The hill under the Friends, page 4 ribbon |
| `coral` | `HAPPY.coral` | #E5734B | FREE burst (free edition only) |
| `ink-muted` | `MUTED` | #6B6B80 | Decorative eyebrows only, 5.2:1 on white, 4.85:1 on butter light |
| answers grey | new `ANSWER` | #3F3F55 | Orbit's answers, 10.2:1 |
| `edge-print` | `3px solid INK` | 3 px | Box edges |
| `ledge-print` | `box()` shadow | 4px 5px 0 ink | Printed boxes |
| `radius-tile` | 14 | 14 px | Boxes |
| `radius-pill` | 999 | | Name tags, REAL / PRETEND |
| Display | `display(n)` | Nunito 900, -0.02em | Headlines |
| Body | `body(n)` | Nunito 600, 1.45 | Reading text |
| Labels | `mono(n)` | Plex Mono 700, caps, 0.14em | Eyebrows only (see the type floor) |

### The type floor (new, from the accessibility audit)

Two kinds of small text, treated differently:

- **Decorative eyebrows** (FRONT PAGE NEWS, BLOOP'S COLUMN, the footer): mono
  caps may stay at 10 to 11 px code. Nobody has to act on them.
- **Anything a child must read to do the task**: Nunito, sentence case, at least
  **14 px code** (about 10.5 pt printed). That is: "Colour it in", "Draw the
  picture for your story", the headline line label, REAL and PRETEND, the word
  list, Orbit's answers. Mono caps at 8 pt are the hardest thing on the page for
  a six year old to decode.

## Components

| Component | Status | Props | Notes |
|---|---|---|---|
| `FriendsBand` | **New**, page 1 | `ink` | Replaces the weather strip. Spec below |
| `MiniWheel` | Change | `size` | Label and icon radii move, spec below |
| `MessageBubble` | Change (inline today) | `from`, `text` | One fill for all three |
| `Pill` (REAL / PRETEND) | Change | `label` | Nunito 900 14 px, padding 4 x 12, 2 px ink edge |
| `JobStar` | Change | `size` | 50 px code, fill `CRAYON.paper`, ink 3 px |
| `SectionHead` | Reuse | `tint` | Page 3 now uses it with `CRAYON.sky` |
| `Burst` FREE | Conditional | `edition` | Only on the free edition (see Edge cases) |

### FriendsBand (page 1, new)

- Box: full width, **140 px tall** code (150 canvas), white, `box(ink)`,
  margin `16px 0 12px`, `overflow: hidden`.
- Hill: an SVG along the bottom, 32 px tall, `viewBox 0 0 690 40`,
  `preserveAspectRatio="none"`, fill `CRAYON.green`, top edge stroked ink
  2.5 px. Path from the canvas: `M0 18 Q 86 4 172 16 T 345 14 T 518 16 T 690 12 V 40 H 0 Z`.
- Top left: `mono(11)` "Meet the Planet Friends", at 15 / 11 px.
- Top right: `body(12)` weight 800 "One for every stage of growing up".
- Five Friends, `justify-content: space-around`, sitting on the hill, each
  **96 px** square, `object-fit: contain`, in the order Pebble, Bloop, Orbit,
  Nova, Cosmo.
- Art: `CHARACTERS[key].moods.wave` from `shared/schools-curriculum.ts`, the
  approved waving stills (13 September 2026). **Never a new or redrawn Friend**
  (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 15).
- Name tag under each: `display(12)`, white, 2 px ink edge, radius-pill,
  padding `1px 9px`, `margin-top: -8px` so it overlaps the feet.
- Ink saver: hill fill white with the ink line kept; Friends go through the
  same grey light treatment `Friend` already uses when `ink` is on.

### Page 1 height budget (the band costs 152 px with margins)

| Change | Saves |
|---|---|
| Drop the weather strip (sun, weather line, two dots) | 78 px |
| Lead paragraphs `body(17.5)` to `body(16)` | about 30 px |
| Wheel 300 to 270 | 30 px of the right column |
| Masthead 232 to 220 tall | 12 px |

If it still overflows, the editor's note drops to `body(13.5)` before anything
else shrinks. The lead must stay at or above 16 px code.

### MiniWheel (critique fix 2)

FAMILY runs into the house and READ touches the book. In the SVG (280 viewBox):
icons move in from radius 66 to **60** and scale 0.95 to **0.85**. Labels move
out from radius 99 to **110**, `fontSize 10`. Check every slice at print size.
No label may touch an icon or a spoke.

## Changes, page by page

### Page 1, the front page
1. FriendsBand under the masthead, weather strip removed (above).
2. Wheel labels (above). Wheel caption becomes `body(14)` weight 800
   "Colour it in", sentence case.
3. Inside box: unchanged.

### Page 2, three jars (critique fix 5)
In `planet-post.ts`:
- `mine.line`: `'minutes, just for me'`
- `earned.line`: `'minutes per star'`

Both currently wrap with one word on the second line. NOBODY'S jar footnote
`mono(9.5)` goes to `body(12)` weight 800 "No stars can buy these".

### Page 3, real or pretend
1. **Critique fix 1, the giveaway:** every bubble `CRAYON.paper`. Today
   `i === 1 ? CRAYON.green` makes Grandma's message (the real one) the only
   green one, so the answer is visible before it is read. Remove the condition.
2. Heading: `SectionHead` with `CRAYON.sky` and "Real or pretend?", and Orbit's
   plate to its left at 66 px, as on the canvas.
3. REAL / PRETEND pills: `Pill` (above).
4. **Critique fix 4:** word search box `justifyContent: 'flex-start'` so its
   heading sits at the top. The word list becomes `body(13)` weight 800 with an
   empty 14 px square, wrapping in rows of four.
5. Tomorrow's headline: "The Planet Post · Tomorrow" stays a mono eyebrow (it
   is part of the pretend masthead). "Draw the picture for your story" becomes
   `body(14)` weight 800.
6. Orbit's answers: `body(13)` in `ANSWER` #3F3F55, still upside down.

### Page 4, the back page
1. Job stars: `JobStar` 50 px with the butter light fill, so a number fits.
2. `jobs.intro` becomes: "Ask your grown up how many stars each job is worth.
   Write the number in the star, then colour the circle when the job is done."
   That is the canvas wording, and it names the circle the child actually colours.
3. **Critique fix 6:** family jobs box. The heart sits directly under the list
   (`margin: 10px 0 6px`, not `auto`), so there is no empty gap. "Signed"
   becomes **"My name"** next to "Grown up".
4. The grown up strip and QR: unchanged. The QR must still read
   `https://www.guidedchildhood.com/starter-pack?src=planet-post-1` (the guard
   checks it).

## States and interactions

This is print, so there is no hover or tap. Two states matter:

| Element | State | Behaviour |
|---|---|---|
| Whole paper | Colour | As specified |
| Whole paper | Ink saver (`ink`) | Every fill white, every line kept, Friends grey and light, hill white with ink line, burst outlined |
| FREE burst | Free edition | Shown |
| FREE burst | Etsy edition | Removed. The space goes to the masthead sheet (`right: 26`) |

## Edge cases

- **Issues 2 and 3 reuse this layout.** Content limits so it never overflows:
  lead headline 2 lines at 44 px (about 32 characters), lead 2 paragraphs at
  most 240 characters together, 3 messages each under 90 characters (2 lines),
  5 earn jobs and 3 family jobs at most, each under 28 characters.
- **Long names in the band:** the names are fixed. No other Friend joins the band.
- **Remote art fails to load at render:** the render script must wait for every
  `img` to report `complete && naturalWidth > 0` before `page.pdf()`, and fail
  loudly if any did not. A PDF with a missing Friend never ships.
- **Etsy edition:** if Justin chooses the Etsy pack, add `edition: 'free' | 'etsy'`
  to `PlanetPostPages`. Etsy removes the FREE burst and changes the grown up
  strip to the /etsy-bonus line. That is the printables-engine funnel rule:
  nothing moves an Etsy sale off Etsy.

## Motion

None. It is paper. (The reel, if approved, is a separate film.)

## Accessibility

**PDFs** (`scripts/render-free-printables.mjs`):
- `page.pdf({ ..., tagged: true, outline: true })` so screen readers get
  structure and the pages get bookmarks.
- Document title: the print route sets `<title>The Planet Post, Issue 1</title>`
  and `lang="en-GB"`. Today every PDF carries the site's default title
  ("Digital Literacy for Children Age 4 to 16…").
- Real headings in reading order: the masthead name is the h1, each page's
  ribbon an h2, column titles h3. Decorative SVGs keep `aria-hidden`.
- Images: every Friend img has alt text naming the Friend ("Pebble waving").

**Web page** (`/free/planet-post`, from the same audit, same PR):
- `app/layout.tsx`: remove `maximumScale: 1`. It blocks pinch to zoom on the
  whole site (WCAG 1.4.4). Inputs are already 17 px, so iOS will not auto zoom.
- `MagnetGate` email input: a visible focus ring (2 px ink outline, 2 px offset)
  instead of `outline: none`, and a border of at least 3:1 against white (use
  `#8A8AA0` or ink at 2 px). WCAG 2.4.7 and 1.4.11.
- `MagnetGate` errors: `role="alert"` on the error line, and `aria-invalid` plus
  `aria-describedby` on the input when an error shows. The success panel gets
  `role="status"` and focus moves to its heading. WCAG 3.3.1 and 4.1.3.
- Eyebrow "FREE PRINTABLE · ISSUE 1": `--terracotta-dark` on white measures
  2.58:1. Use ink, or ink on a butter sticker. WCAG 1.4.3.
- Wrap the page in `<main>`. WCAG 1.3.1.
- Mobile: put a "Send it to me" jump link to the form straight after the intro,
  because on a phone the form is 3,000 px down below four previews.

## Acceptance

1. `node scripts/render-free-printables.mjs` produces the five PDFs. Page counts
   are 4/4/4/4/2, and `pdfinfo` shows `Tagged: yes` and the right title.
2. Contact sheet of the four colour pages beside the canvas renders. Nothing
   clipped, nothing touching, nothing overflowing 1000 px.
3. The ink saver prints on a nearly empty cartridge: no large fills.
4. The previews in `public/printables/free/planet-post-1-p1..p4.png` are regenerated.
5. `node scripts/check-free-printables.mjs` passes. Add three checks to it: no
   message bubble fill depends on its index; the band uses `moods.wave` art only;
   the render call passes `tagged: true`.
6. `npm run ai-tells` is clean on the changed copy (no dashes).
7. The web page: axe shows no violations on /free/planet-post at 390 and 1280
   wide. Tab reaches the input with a visible ring. A bad email is announced.
