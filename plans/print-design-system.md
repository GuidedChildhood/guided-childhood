# The Print Design System — Guided Childhood Schools
**Created 5 Jul 2026 · Distilled from deep research into Twinkl, White Rose Maths, Oak National Academy (design tokens verified from their public code), Jigsaw PSHE, SCARF and Common Sense Education, plus BDA/UKAAF/RNIB accessibility standards and mono photocopier production rules. This is the spec the /educator/print routes are built to. No Canva, ever: everything generates from lesson data as HTML/CSS print pages.**

---

## 1. The ten conventions the best materials share (adopt all ten)

1. **One skill per sheet** (White Rose's most praised trait). Our worksheet covers one action outcome only.
2. **Progression on the page**: fluency → reasoning → problem solving (White Rose). Ours: recognise → apply the checks → explain your verdict.
3. **Differentiation is visible and systematic**: Twinkl's one/two/three stars bottom left; SCARF's emerging/expected/exceeding. Ours: the star convention, mapped to working towards / met / exceeded so print matches the marking screen.
4. **Character voices the claim, pupil corrects the character** (White Rose speech bubbles: "Dexter says X. Do you agree? Explain your reasoning."; Jigsaw's soft toy distancing). Ours: Zara/Oliver/Sofia claims in speech bubbles on worksheets. The character is sometimes wrong on purpose.
5. **Answers ship with everything** (Twinkl answer pages, White Rose answer PDFs, Oak with/without answers versions). Every check and worksheet prints a teacher version with answers and teaching points.
6. **Name/date line where work is handed in, absent on display materials.**
7. **Footer discipline**: page N of M, copyright line, brand mark bottom right, differentiation stars bottom left (Twinkl anatomy).
8. **Eco and mono versions are a product feature, not an afterthought**: Twinkl ships Super Eco Colour (46% less ink) and Eco Black and White (73% less). We ship a colour pack and an eco line art pack from the same data.
9. **Learning outcome in pupil voice**: Oak's "I can..." (max 30 words). Already our single_action_outcome format.
10. **Parent material is a first class artefact**: Jigsaw's parent leaflet, Common Sense's per lesson Family Activity + Family Tips in 10 languages. Our parent note stays a fixed page of every pack.

**The strategic finding:** teachers now read heavy clip art density, rainbow borders and decorative fills as "Twinklisation" (some schools have banned Twinkl sheets for it). The premium look in 2026 is **clean, ink light, accessibility first** — Oak's direction. Our brand (Nunito, cream, one accent per artefact, generous white space) is already on the right side of this. Illustration = one character spot per page maximum, never behind text.

## 2. Typography and accessibility (hard rules, BDA 2023 / UKAAF / RNIB verified)

- Body sizes: **KS1 16 to 18pt, KS2 13 to 14pt, KS3 12pt, never below 12pt** for continuous prose. Headings at least 20% larger, bold.
- **Line height 1.5**, line length 60 to 70 characters, left aligned ragged right, never justified.
- **Bold for emphasis only. No italics, no underline, no all caps** (BDA: they make text run together or slow reading).
- Nunito passes BDA guidance (plain, evenly spaced, rounded sans; its single storey g helps). Verify I/l/1 distinction at our weights. Keep IBM Plex Mono to eyebrows and codes only, never body.
- Meaning never carried by colour alone (450,000 colour blind UK school children, one per classroom): pair every colour signal with a label, icon or pattern. No red/green pairs as differentiators.
- Cream reading background is achieved by cream PAPER, never a printed tint (printed tints copy as dirty grey and burn toner).

## 3. Mono photocopier rules (the unglamorous rules that decide whether teachers love it)

- Design in black on white first; colour is decoration that must drop out safely. **Greyscale proof every artefact** before shipping.
- Text and rules at 100% black. No tints below 15%. Prefer patterns (stripes, dots, cross hatch) plus labels over tints.
- Line art over photos always; outlined shapes with white interiors; no large solid fills.
- Two pack variants generated from the same data: **Colour** and **Eco black and white** (line art, no fills), like Twinkl's leaf flagged versions.

## 4. Per artefact anatomy (implement exactly)

### 4.1 Worksheet (photocopy per pupil, A4 portrait)
- Header: lesson title in Nunito 800, module eyebrow in mono caps, Name/Date line.
- "Directions:" block (Common Sense convention), one sentence.
- Questions numbered in **solid filled circles with white numerals** (White Rose), sub parts a/b/c.
- Progression: 2 recognise items → 3 apply items → 1 explain/reasoning item ending with a **character speech bubble claim: "Zara says [claim]. Do you agree? Explain your reasoning."**
- Generous answer space: full width rules ~10mm apart (KS2/3); answer boxes for verdicts.
- Footer: stars bottom left · page N of M centre · Guided Childhood mark + © line right.
- Teacher version: identical layout, answers in the accent colour, teaching point per item.

### 4.2 Teacher one pager (A4 portrait, one per lesson)
Order (blend of Oak lesson overview + Common Sense lesson plan, already close to ours): title + key stage band → "I can" action outcome → objective → timing line → **statutory coverage box** (KCSIE / RSHE / Citizenship / EfCW strands / evidence anchor) → keywords (2 to 5, definitions under 200 chars, Oak convention) → misconceptions (3) → differentiation (support / stretch) → safeguarding box (coral border, flagged modules) → no screen fallback note.

### 4.3 Quiz cards (start and exit, cut in half)
- Oak's verified conventions: instruction line **"Tick 1 correct answer."**, answers as ☐ checkbox | a) letter | text rows, ▁▁▁ fill lines for short answers.
- Start card tests LAST lesson (retrieval); exit card tests this lesson and always includes one keyword question (Oak rule). Exit card ends with the action commitment write in line.

### 4.4 Cut out scenario cards (The Mystery Feed packs, check cards)
- **8 per A4** (105 x 74mm) for pupil handled cards; 4 to 6 per page for teacher led discussion cards.
- 1px dashed mid grey rectangular cut lines with a scissors glyph at the line origin, top left.
- **3 to 5mm white margin inside every cut line** (lamination seal; school printers cannot bleed). Card border 1 to 2pt in the character colour, 3 to 6mm radius, white interior. Cut line stays rectangular.

### 4.5 Bookmark strip (the three checks)
- **4 per portrait A4** as full height vertical strips (~52 x 297mm). Duplex option: back page columns mirrored, flip on short edge.
- Anatomy: character colour top band with the eyebrow, the three checks as bold numbered lines, one line strapline, brand mark at the foot.

### 4.6 Parent note (A4, goes home, no login)
Jigsaw leaflet + Common Sense Family Tips blend, one page: what we taught (2 sentences) → the locked wording box (the three checks etc.) → one Try this at home action → the dinner table question in bold → one line footer ("no login, nothing to sign up for, this note is yours").

### 4.7 Certificate (landscape A4 + 2 up A5 variant)
Element order: DiGi star top centre → award title (largest type) → "This is to certify that" → **name line, the most prominent element (28 to 40pt)** → "for..." reason rule → Signed ___ and Date ___ side by side → decorative border inside 8 to 10mm margins (the one artefact where a full frame is expected). Three tier variants map to working towards/met/exceeded colourways.

### 4.8 The pupil booklet exception: colour first (JP directive, 6 Jul 2026)

The ink light stance governs teacher and admin materials. The PUPIL BOOKLET is the deliberate exception: it is the artefact in a child's hands, and it must be the most colourful, most exciting lesson companion a kid could imagine, per age band. Rules:

- **Colour first, twice over:** designed to look beautiful on screen (the booklet route renders as a full colour digital artefact, viewable on any device, before it is ever printed) AND to print in full colour on a colour printer (print-color-adjust exact on colour bands, character panels and sticker style badges). The eco mono line art twin still ships from the same data for mono photocopier schools, per section 3.
- **Age banded worlds:** EYFS/KS1 booklets are the character's picture world (Sofia's garden, big art, minimal words); KS2 is the full squad adventure register (capes, badges, case file styling, collect the stamps); KS3 cools into the detective dossier register (case file aesthetic, character as emblem not narrator, sharper type per the kids player brief); KS5 drops characters for a clean field notebook.
- **Comprehensive, not a leaflet:** the booklet carries the whole lesson journey: cover with name line, the rundown, keyword cards, the follow along case file, the interactive moments' paper twins, the mission, the family question, and a back cover progress/stamp spot per lesson so booklets collect across the year.
- **Character art:** each booklet cover and section headers carry rendered character art (Higgsfield stills, background removed), the same canonical designs as the video beats. Requires credits and a one off art pass per character per band.
- **The bar:** a child should want to keep it. If it would not survive on a fridge or in a keepsake box, it is not done.

## 5. Colour system for print

One accent per artefact, drawn from the character/stage tokens (Zara gold, Oliver coral, Sofia green, DiGi star gold), used for: header band, circled question numbers, speech bubble strokes, teacher version answers. Everything else ink. Common Sense proves topic colour coding works (their six body part characters = six topic colours); ours is character colour = module presenter, consistent between screen and paper.

## 6. What this system deliberately rejects

- Clip art density and rainbow borders (Twinklisation).
- Printed background tints and full bleed cards (photocopier reality).
- Italics, caps, underlines, justified text (BDA).
- Colour as the only signal (colour blindness).
- Manual design tools: every artefact is an HTML/CSS print route generated from the lesson row. A red pen wording change regenerates every affected page.

## 7. Implementation map

- `/educator/print/[module]` (live) upgrades to this spec: v2 adds Directions blocks, circled numbering, speech bubble reasoning item, stars, footer discipline, teacher version toggle, eco variant toggle.
- Cut card pages (Mystery Feed style packs) and certificates are new print routes on the same pattern.
- Print CSS: A4 @page, ~12mm margins, exact mm sizing per 4.4/4.5, `print-color-adjust: exact` for accent bands in the colour pack, stripped in eco.
- Full source URLs and the verbatim research live in the session research reports; key exemplars: Oak's design tokens (github.com/oaknational/oak-components), White Rose free workbooks (whiteroseeducation.com), BDA Style Guide 2023, Twinkl visual identity guide, Jigsaw parent leaflet, Common Sense Family Tips.
