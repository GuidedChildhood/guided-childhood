---
name: printables-engine
description: Production engine that turns one product request into a finished, listing ready Guided Childhood printable. Use whenever Justin asks to make a printable, a chart, a planner, a build at home kit, an escape kit, tracing cards, a classroom poster, or any Etsy product. Takes a product type, an age band and an occasion, then produces the PDF layouts, the Higgsfield image set in the digi squad style, the phone sized version, the funnel page, and the complete Etsy listing package. Built from verified market research on what actually sells (July 2026 sweep).
---

# Printables Engine — one request in, one listing ready product out

You produce sellable printables the way lesson-video produces videos: the same
hinged pipeline every time, so quality is repeatable and nothing ships off
brand. The deliverable is never a mockup or a concept. It is the full product
folder: print files, phone version, imagery, and the Etsy listing package.

**READ FIRST, EVERY TIME:**
1. `digi-squad/README.md` — the single source of truth for characters. The
   cast is DiGi (golden star, never the robot or owl), DiGi Junior, Oliver,
   Zara, Sofia, and the UK animal stage guides (Hog, Robin, Scout, Brock,
   Vix). Teo, Olga and Alma are legacy. Never render off model.
2. The design system block in CLAUDE.md and README.md — Nunito display and
   body, IBM Plex Mono labels, house colour tokens, chunky 16px radius
   buttons, no Inter, no purple gradients, no generic AI patterns.
3. `plans/etsy-launch-plan.md` — where this product slots in the launch grid,
   its price rung and its season window.

## Inputs (ask only for what is missing)

- **Product type** — one of the recipes below, or a new type Justin names
- **Age band** — 5 to 7, 8 to 11, or 12 to 14 (UK animals cover 0 to 16 by stage)
- **Occasion** — evergreen, end of term, back to school, Christmas, summer
- **Character** — default from the lane map below unless Justin overrides

## Character lane map (who fronts what)

| Lane | Character | Why |
|---|---|---|
| Screen time charts, routines, bedtime, wind down | Oliver | His lesson topic is literally screen time and sleep |
| Detective games, real or fake, escape kits, mystery | Zara | Detective missions, ages 8 to 13, the party sweet spot |
| Privacy, safety, calm down kits, feelings cards | Sofia | Safety Guardian, warm, ages 4 to 9 |
| Breathing pauses, calm corner, check in cards | DiGi Junior | Already does pause beats in lessons |
| Early learning cards (phonics, counting, tracing) | UK animal for the stage | One animal per age stage |
| Whole family products, agreements, bundles | DiGi | The guide who speaks to parents |
| Classroom and teacher products | Schools team when defined; the squad in classroom staging until then | Feeds the schools funnel, not the parent one |

Characters DEMONSTRATE on every page, never decorate. Oliver is doing the
bedtime routine on the bedtime chart. The distancing technique from lessons
applies to printables too: the character voices the struggle so the child
agrees with the character, not the instruction.

## Product recipes (verified against top sellers, July 2026)

### 1. Routine and screen time charts (£4 to £5, the review engine)
Proof: editable chore chart listings at 762 reviews and 4.9 stars; screen
time contracts selling at 3 to 5 dollars; one chart system shop at 71.9k
sales. Contents: one A4 chart per routine (morning, after school, bedtime),
editable name field, squad stamp reward tokens, a parent one pager, and the
detail the market loves: daily rewards for younger children, weekly rewards
for older ones. Variants per age band are separate listings.

### 2. School planner (£8 to £12, the core, seasonal)
Proof: category ceiling shop at 124,887 sales built on ONE listing re dated
every year; niche planners at 2 to 3x generic prices on identity positioning.
Contents: three date states in one listing (current academic year, next year,
undated), UK September to August variant, hyperlinked tabs (month to week to
day), subject hubs, timetable, homework tracker, exam and revision planner,
reading log, habit tracker, sticker sheet. Formats: GoodNotes file plus
hyperlinked PDF plus A4 and US Letter print versions. Colourways split into
separate listings. Re date every May, never relist.

### 3. Build at home kit (£4 to £12)
Proof: felt pattern kits at 68,422 sales; pretend play sets at 8,990 sales;
the reviews say parents pay for curation and five minute readiness.
Contents: one named outcome on the cover (run the escape party, build the
calm kit), a one page materials list of cheap household items with
quantities plus a nice to have column (NO affiliate links, ever), step by
step photo instructions, prep time in minutes, mess level, supervision
level, laminate and cardstock durability instructions, A4 and US Letter,
ink friendly version.

### 4. Escape and detective kits (£8 to £13, Zara's lane)
Proof: the escape room shops price 12.99 to 13.99 dollars and segment
strictly by age; tweens 9 to 13 are the sweet spot. Contents: a story
briefing from Zara, 6 to 8 puzzles, props to cut out, a hider's guide for
the parent, printable locks and clue envelopes, a 45 to 90 minute play arc,
5 to 15 minute setup promise on the cover.

### 5. Tracing and fine motor sets (£3 to £5, animal lane)
Proof: the La Casita format, reels at 30 to 70k views on exactly this.
Contents: cute animal or squad outlines with dashed pre writing lines,
laminate and dry wipe instructions so it is reusable, one skill per set,
seasonal themes swap in and out.

### 6. Calm down and feelings kits (£5 to £8, Sofia and DiGi Junior)
Contents: feelings cards, a breathing exercise poster using DiGi Junior's
existing pause script style, a calm corner sign, a parent script card in
Justin's voice. Wellbeing wording rules below are strict here.

### 7. Classroom line (£4 to £8, schools funnel)
Proof: class rules posters with characters pulled 69.5k views for La Casita.
Contents: class rules poster set, whole class reward chart, brain break
cards, transition songs cards. Listing copy speaks to teachers, funnel
points to the schools offer.

### 8. Family screen agreements and parent guides (£4 to £6)
The guides already written, repackaged: cover, warm layout, the agreement as
a fill in together ceremony page, DiGi fronting. Never medical claims.

### Bundles (£15 to £25, the revenue core)
Compose 3 to 5 singles into a named outcome (The Family Screen Reset Kit,
The End of Term Survival Kit) priced 20 to 30 percent under the sum.

## The pipeline (same order every time)

**1. Recipe check.** Confirm product type, age band, occasion, character,
price rung against the plan. If the product does not map to a recipe, find
the nearest proven anatomy before inventing one.

**2. Content draft.** Write every word of the product in Justin's voice.
Warm, plain, direct. No dashes anywhere. Ages written as 5 to 7, never 5-7.
No allow or deny framing, always the calibrated pathway. Wellbeing products
must pass the claims rule: helps families build healthier habits is fine,
reduces anxiety is a prohibited medical claim on Etsy and everywhere else.

**3. Imagery on Higgsfield.** Generate every illustration slot with
generate_image, anchored to the digi-squad reference art files
(Oliver, Zara, Sofia images in digi-squad/, the golden star for DiGi).
House style in every prompt: warm butter and cream background, ink outlines,
the character's own colour token, Nunito adjacent rounded feel, flat
sticker friendly shapes, no photorealism, no generic AI gloss. Generate at
2x print resolution. One test image first, check on model, then batch the
set. Reject anything off model and regenerate rather than shipping it.

**4. Layout.** Build print pages as HTML to PDF at exact A4 and US Letter,
using the design system fonts and tokens. Every product ships: colour
version, ink friendly version, and where the recipe calls for it the
editable or hyperlinked version. Check every page at print scale.

**5. Phone version.** Export a 9:16 phone sized set of the child facing
pages, sized for the send to child phone channel. This is the differentiator
no Etsy competitor has: mention it in the listing copy.

**6. Funnel wiring.** Last page of every PDF: one named free bonus gated at
/etsy-bonus, chosen to extend this product (chart buyers get a free DiGi
mini lesson, guide buyers get the agreement template). A discreet footer URL
on pages that live on the fridge. Never a checkout link, never a cheaper on
our site line, nothing that moves an Etsy transaction off Etsy.

**7. Listing package.** Deliver alongside the product folder:
- Title, front loaded, around 70 characters: product, format, age band
- 13 tags phrased differently from the title
- All 10 image slots planned: lifestyle mockup first, contents flat lay,
  instant download overlay, sizing guide, how it works, bonus mention
- A 5 to 15 second demo video script in the hands on table format: real
  hands using the printable, the Natalia method, nothing produced
- Price, rung on the ladder, launch sale line, seasonal window
- The reel script for Instagram in the same hands on format

**8. Mobbin check.** Before finalising any layout that is app like (planner
pages, phone versions), pull reference screens per the MOBBIN FIRST rule.
If Mobbin tools are absent, say so and proceed on gathered references.

## Output folder convention

```
content/printables/<product-slug>/
  product/     — final PDFs (A4, US Letter, ink friendly, editable)
  phone/       — 9:16 child phone set
  images/      — Higgsfield outputs plus job IDs in images.md
  listing/     — title, tags, photos plan, video script, reel script
  README.md    — recipe used, price rung, season window, bonus wired
```

Record every Higgsfield job ID in images.md the way digi-squad/README.md
does, so imagery is reusable and auditable.

## Hard rules (non negotiable)

1. On model characters only, from the reference art. Off model output is
   regenerated, never shipped.
2. No dashes in any copy. House fonts and tokens only. No generic AI look.
3. No affiliate links inside any PDF. No medical claims. No off Etsy
   transaction moves.
4. Every product ships with its funnel page and its listing package or it
   is not done.
5. Founder rate, starter pack routing and platform CTAs follow CLAUDE.md
   rules everywhere they appear.
