# The Guided Childhood social visual system

**Read this before making any Guided Childhood social visual, carousel,
campaign image, thumbnail or image generation brief.** Instagram, Facebook,
LinkedIn, YouTube, TikTok, Reels and Shorts all draw from this one file, so
a parent who meets us on any of them recognises the same world.

Installed 5 October 2026 at Justin's request. The audit of the templates that
already existed on that day, and the decisions still open, are in
`plans/2026-10-05-social-visual-system.md`.

**What this file is not.** It does not repeat the craft that already lives
elsewhere. Sizes, the 3:4 grid safe zone, the Facebook carousel trap, the
renderer and the last card rule are in `content/brand-story/visual-system.md`.
The week's posting rhythm is in `content/brand-story/weekly-rhythm.md`. Who
the characters are, how they behave and what they never do is in
`digi-squad/README.md`. This file sits above those and decides the look.

---

## 1. The source of truth rule

**The real product is the authority. Nothing on a reference board overrides
it.**

| Question | The answer comes from | Never from |
|---|---|---|
| What a Planet Friend looks like | The approved cutouts, section 3 | A generated image, a reference board, a prompt |
| What DiGi looks like | `public/digi-squad/DiGi-star.svg` | Any other star, the green robot, the owl |
| What the Passport looks like | `components/pathway/PassportBook.tsx` and the real screenshots | An invented book or stamp |
| What the app looks like | Real screenshots of the live product | A mocked up or generated screen |
| Colour | `shared/tokens.css`, then section 4 | Eyedropping a reference image |
| Type | Nunito and IBM Plex Mono, section 5 | A reference board's lettering |
| The logo | `shared/brand.ts` | A star emoji, a redrawn mark |

**Never regenerate or reinterpret a character when an approved asset exists.**
Identity comes from the cutout file, never from a prompt. If an approved asset
does not exist for what a creative needs (a pose, a prop, a mood), the creative
changes to fit the assets we have, or the gap goes to Justin as a request.
Nobody fills it by generating a lookalike.

### The reference board, and what it is for

`brand/references/2026-10-05-social-reference-board.webp` is the approved
**composition** reference. It shows hierarchy, whitespace, the headline
treatment, the six recurring formats and how a character sits inside a post.

It is **not** a source for character artwork, UI, typography or colour. Its
characters are redrawn approximations of ours, its hand lettered headline face
is not our type, its product screen is invented, and its stat is a placeholder.
Take the layout. Take nothing else.

Two other references were looked at the same day and are deliberately not
stored here, because they are other people's work: an educational characters
site (bold colour blocks, a character cast fronting every panel) and a
parenting carousel series (one topic split cleanly across six slides, a
consistent tinted ground). From those we keep only the lessons: one cast, used
consistently, is recognisable across a whole feed; and a series is recognised
by its repeated frame, not by its topic. We copy no one's typography,
illustration or palette. The same holds for The Happy Newspaper, which
`content/brand-story/visual-system.md` used as its mood reference: we learned
recognisability and simplicity from it, and the look in this file replaces its
sticker and polka dot energy.

---

## 2. The core idea and the 80 / 20 balance

| In the product | On social it stands for |
|---|---|
| Guided Childhood | The world |
| The Planet Friends | The developmental guides, one per stage |
| DiGi, the golden star | Evidence led help and answers |
| The Digital Passport | Progression and readiness |
| The gold pathway | The journey towards independence |
| Real product, lesson and printable screens | The proof |

**Roughly 80 percent intelligent adult editorial, 20 percent childhood warmth.**
The reader is the adult. Typography, hierarchy, evidence and whitespace carry
the authority; the character carries the warmth. If a card could pass for a
generic children's education brand, it has too much of the 20.

---

## 3. The authoritative assets

Every path below exists in this repo as of 5 October 2026.

### The Planet Friends

| Friend | Stage, ages | Social meaning | Approved cutout |
|---|---|---|---|
| **Pebble** | 1, 4 to 7 | Early childhood, first digital experiences, kindness, feelings, what is real | `public/digi-squad/friends/pebble.png` |
| **Bloop** | 2, 8 to 10 | Routines, gaming, privacy, understanding digital environments | `public/digi-squad/friends/bloop.png` |
| **Orbit** | 3, 11 to 13 | Questions, AI, scams, deepfakes, misinformation, critical thinking | `public/digi-squad/friends/orbit.png` |
| **Nova** | 4, 13 to 15 | Persuasion, social pressure, teenage digital life, growing independence | `public/digi-squad/friends/nova.png` |
| **Cosmo** | 5, 16 and over | Mastery, data rights, adulthood, the road to work | `public/digi-squad/friends/cosmo.png` |

- The cutouts are 512 by 512 transparent PNGs, handed over by Justin on
  13 August 2026. `lib/content/stage-characters.ts` points at them.
- Mood stills (happy, wave, thinking, fifteen in all, approved 13 September)
  are on the CDN, listed in `CHARACTERS.moods` in `shared/schools-curriculum.ts`.
  Use these when a card needs a pose rather than the standing cutout.
- Black and white line art for colouring is the `colouring` field in
  `lib/content/stage-characters.ts`.
- **Do not use** `public/printables/friends/*.png` or
  `content/printables/starter-pack/images/friends/*.png` for social. The
  Pebble, Bloop and Orbit files there have damaged transparency.
- **Never use** Oliver, Zara, Sofia, the green robot `Digi.png` or the owl.
  Retired. The UK animal guides (Hog, Robin, Scout, Brock, Vix) have no art in
  the repo and do not appear on social.
- Cosmo fronts no lesson yet (THE-STORY.md section 12). Cosmo can appear on a
  journey card and a Road to 16 card. Do not show Cosmo teaching something the
  product does not teach.

### DiGi

- `public/digi-squad/DiGi-star.svg`, the gold star, drawn in code by
  `shared/components/DigiCharacter.tsx`. `public/digi-squad/DiGi-star.png` is
  the 1024 raster for video reference only.
- DiGi is not a Planet Friend. DiGi is the guide across all of them.

### The Digital Passport

- Rendered in code by `components/pathway/PassportBook.tsx` (preview at
  `/ref-passport-book`). Burgundy cover, gold foil.
- **Do not use** the screenshots in `public/marketing/passport-*.png` on
  social: they show the old brown cover and a real child's name. The card
  maker draws the current burgundy cover from the `PassportBook.tsx` styles,
  with "Our family" where a name would be.
- The printed product: `public/shop/passport_printed.webp`.
- There is no standalone passport illustration file. The cover in
  `tools/social-cards/template.html` copies the code's styles exactly. Never
  draw a different one.

### The logo

- The butter rounded square with four rising white bars, beside
  "Guided Childhood" in Nunito 800. Data in `shared/brand.ts` (`LOGO_GOLD`,
  `LOGO_BARS`, `BRAND_NAME`), drawn by `shared/components/PrintBrand.tsx`.
- There is no logo image file. A social template draws the mark from
  `shared/brand.ts`, the way `PrintBrand` does, rather than a star or an emoji.

### Product proof

- Real screens: `public/marketing/kid-page.png` (a demo child, Sofia). For anything else, capture the live app with Playwright
  (the `webapp-testing` skill) at 390 wide for phone. A real child's name is
  blurred.
- Real printables: page previews in `public/printables/*.png` and
  `content/printables/*/phone/*.png`.
- The gold pathway and the stage road are drawn in code:
  `components/pathway/StageRoad.tsx` (the 4 to 16 road, butter dotted trail)
  and `components/daily/TodayPathBig.tsx` (today's path, a green trail).

### Schools

- `schools/app/icon.svg` (a navy star on a butter square), `schools/public/og.png`,
  the shared DiGi star, and the friends through `shared/components/FriendMark.tsx`.
  No schools logo file and no school photography exist.

---

## 4. Colour

All from live code. `shared/tokens.css` wins over every document, including
`DESIGN_SYSTEM.md`, which is stale.

### The canvas

| Role | Token | Hex |
|---|---|---|
| Canvas, the default for every card | `--cream` | `#F9F8F6` |
| Headline and body ink, the very dark navy | `--ink` | `#1A1A2E` |
| Secondary text | `--ink-soft` | `#52526A` |
| Brand gold, the pathway, highlights, pills | `--terracotta` (alias `--butter`) | `#EDC35F` |
| Gold shadow and eyebrows | `--terracotta-dark` | `#C99A28` |
| Butter ground | `--tint-butter` | `#FFF6DE` |
| The serious beat, once per deck at most | `--deep-teal` (espresso) | `#2E2818` |

Trap: `--gold` in tokens.css is the stage 1 pastel yellow, not the brand gold.
Use `#EDC35F`.

### One friend, one tint

When a friend leads a card, the card may take that friend's `soft` as its
ground and `ink` for its accents. These triplets live in
`shared/schools-curriculum.ts` and match `digi-squad/README.md`:

| Lead | Accent | Soft ground | Ink |
|---|---|---|---|
| Pebble | `#C99A28` | `#FBEED0` | `#7A5A0E` |
| Bloop | `#6C9E38` | `#E4F0D4` | `#3F5E1E` |
| Orbit | `#3E86BC` | `#DCEBF7` | `#1F4E6E` |
| Nova | `#7E5AB0` | `#ECE3F7` | `#4A2F73` |
| Cosmo | `#CE7328` | `#FBE4D0` | `#8F4A12` |
| DiGi | `#C99A28` | `#FDF4D9` | `#7A5A0E` |

Headlines stay `--ink` on every ground. A deck keeps one ground per friend, so
a friend's colour becomes a recognisable series signal. **Decided by Justin,
5 October 2026:** the friend colour, not the app's stage pastels, which put
Orbit on coral and Bloop on sky.

### The Passport

Burgundy `#6B2333` to `#4A1723` (the cover gradient in `PassportBook.tsx`),
gold foil `#EDC35F`. Burgundy appears on social **only** when the Passport
itself is on the card.

---

## 5. Type

- **Headlines.** Nunito 900, tight leading, slight negative tracking, large
  enough to read at thumbnail size. Sentence case by default; capitals allowed
  for a headline of six words or fewer.
- **Body.** Nunito 600 to 700. Two lines on a card, three at the most.
- **Eyebrows, franchise names, labels, page counters.** IBM Plex Mono 600,
  capitals, letter spaced.
- **Never** a hand lettered or marker face, never Inter, never a script.
- The font files are the self hosted ones in `app/fonts/`, the same files the
  renderer and the printables use.
- **No dashes on any card, caption or alt text.** Ages as "4 to 16".
  `npm run ai-tells` checks the copy.
- **Never trust text inside a generated image.** All words are set in HTML
  over the picture.

---

## 6. The signature device: the gold pathway

The gold line is the brand's signature. It comes from the product's stage road
(`StageRoad.tsx`), drawn as SVG in `#EDC35F`, solid or as the dotted trail.

It can:

- underline a headline, as a single hand weighted stroke
- run through a carousel from slide to slide, so the swipe feels like travel
- connect the five stages left to right, Pebble to Cosmo
- travel behind a product screenshot
- lead to the Passport at the end of a journey

It is recognisable, never overpowering: one pathway per card, never a
background pattern, never a doodle. It is drawn in code, never generated.

---

## 7. Composition

- Cream canvas, generous whitespace. Roughly a third of every card is empty.
- **One main character per creative.** The full cast only when the post is
  about the whole childhood journey.
- One gold detail per card: the pathway, a pill, or DiGi.
- The logo mark small at the foot of the cover card and the last card.
- At most two small gold sparks near a character. No sticker scatter, no polka
  dots, no doodles on top of words.
- Rounded geometry from the product: 16px radius and up, the chunky
  `0 5px 0` button shadow for pills.
- **Avoid:** the generic Canva look, stock children, clutter, every character
  on every post, feature dumping, invented UI, invented character art, another
  brand's typography or illustration.

---

## 8. The six permanent formats

Every visual is one of these. The approved renders are in
`brand/proposals/2026-10-05-six-formats/`, and `tools/social-cards` builds
every one of them from a JSON deck (`decks/six-formats.json` is the example).

### 1. Big stat or hook
A large editorial headline, very little copy, cream, one meaningful character
or object, one gold detail.

> A ban can delay access.
> It can't build judgement.

### 2. Character and question
Leads with a useful or thought provoking question, voiced by the friend who
owns that topic. Series names: **ORBIT ASKS**, **DiGi, WHAT DO I SAY?**

### 3. Printable or offline
The real printable or the real activity is the hero. Photographed or taken
from the real page preview, never redrawn.

### 4. Product screen
Real functionality, real screenshot, told as a story rather than a feature
list:

> The problem → the useful action → how Guided Childhood supports it

### 5. Age stage and journey
The Planet Friends on the gold pathway, ending at the Passport. The primary
franchise is **THE ROAD TO 16**.

### 6. Parent situation
A recognisable moment, in quotation marks, followed by the turn.

> "Everyone else has Snapchat."
> What would you say next?

**Scenario quotes are illustrative and must look it.** An IBM Plex Mono
eyebrow such as A THING PARENTS SAY sits above the quote. Never attribute an
invented quote to a real child, parent or customer, and never present one as
a testimonial.

---

## 9. The franchises

| Franchise | Format | Lead | Mainly on |
|---|---|---|---|
| THE ROAD TO 16 | Age stage and journey | The cast, the Passport | Instagram, Facebook |
| ORBIT ASKS | Character and question | Orbit | Instagram |
| DiGi, WHAT DO I SAY? | Character and question, Parent situation | DiGi | Facebook, Instagram |
| ONE STUDY. PROPERLY EXPLAINED. | Big stat, then explanation | The friend who owns the topic, or none | LinkedIn, Instagram |
| INSIDE GUIDED CHILDHOOD | Product screen | DiGi or the friend whose screen it is | All three |
| EVERY YEAR HAS A JOB. | Age stage and journey, for schools | The friend for the key stage | LinkedIn, the schools account |

A franchise is recognised by its frame, so its eyebrow, its ground and its
character never change from one post to the next.

---

## 10. Carousels

One main idea per slide. Slide one earns the swipe without misleading.

> Hook → tension → explanation → useful action → evidence or product proof → close

- Seven to ten slides for an educational carousel.
- Short copy on the graphic. The explanation lives in the caption or the next
  slide.
- The close is the save or send ask, as `content/brand-story/visual-system.md`
  sets out. The product ask, the stage check, goes in the caption.
- Facebook never gets the carousel. It gets slide one or a single card that
  carries the whole idea, plus the argument in the post text.

---

## 11. Channels

All of them are recognisably one world. What changes is the emphasis.

| Channel | Prioritise |
|---|---|
| **Instagram** | Instant comprehension, curiosity, saves and shares, the franchises, a strong first slide |
| **Facebook** | Parent situations, useful answers, DiGi, practical activities, things worth sending to another parent |
| **LinkedIn** | Evidence, research, schools, product thinking, the founder's view, the most restrained treatment. Justin's own research posts keep the proven serif research card from `viral-post` (decided 5 October 2026); anything posted as Guided Childhood uses this file |
| **YouTube, TikTok, Reels, Shorts** | The cover frame and the burned in hook follow this file. Video rules stay in `silent-ugc`, `explainer-video` and `talking-head-video`. Every vertical ends at the stage check |

On the family account, Founder Monday stays a real photo (`weekly-rhythm.md`).
This system governs the graphic cards around it, never replaces a real photo.

---

## 12. The evidence rule

**Evidence accuracy beats virality, every time.**

- A hook can create curiosity. It cannot turn an association into causation or
  remove an uncertainty that matters.
- If slide one asks the question, slide two answers it honestly:

  > 49% higher risk?
  >
  > That's the association. It isn't proof the phone caused it.

  The 49 is the reference board's placeholder, not a finding. Every number on
  a card needs a named source checked by the `citation-verifier` agent before
  it is published.
- Every product claim has a proof path in the product (THE-STORY.md section 10).
- No living clinician's name on our advice. No outcome claims for a child.

---

## 13. The Passport, used with care

The Passport is one of the most distinctive things we own. Use it for
readiness, progression, skills, independence, the stages, the Road to 16, and
completion. Never on a card that is about none of those.

---

## 14. Show, do not say

Wherever a post can show the real thing, it does: a real app screen, a real
lesson slide, a real script, a real quest, a real printable, a real Passport
stage. That is what separates us from accounts that only give advice.

---

## 15. Image generation briefs

When a brief goes to Higgsfield or any other model:

1. For a still image, generate **environments, objects and textures only**.
   Never a Planet Friend, DiGi, the Passport, the logo or a screen. Composite
   the approved asset on top in HTML.
2. For video, a character moves only by image to video **from the approved
   file**, with the action alone in the prompt (the method in
   `digi-squad/README.md` and the `lesson-video` skill). Check the result
   against the cutout and discard any frame that drifts off model. Never
   text to image for a character.
3. Never a person presented as a real parent, child or customer. Never a
   child's face.
4. No text in the generated image.
5. State the palette: cream ground, ink line, butter gold accent, no neon, no
   dark tech look, no purple gradient, no photorealistic stock feel.
6. No paid generation without Justin's yes on the credit cost first.

---

## 16. Before anything goes out

- [ ] Every character is an approved file, unaltered
- [ ] Every screen is a real screenshot
- [ ] One main character, one gold detail, a third of the card empty
- [ ] Colours from section 4 only
- [ ] Nunito and IBM Plex Mono only
- [ ] No dashes on the card, the caption or the alt text
- [ ] Every number sourced and verified; association never sold as cause
- [ ] Any scenario quote labelled as illustrative
- [ ] Readable at thumbnail size, inside the 3:4 grid safe zone
- [ ] The Passport only where the post is about progress
