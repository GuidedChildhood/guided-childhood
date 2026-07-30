# The visual system: carousels, Facebook images and the Happy News feel

**How we actually build the pictures. No dashes in any copy on any card.**

---

## The reference, and how far we take it

The Happy Newspaper by Emily Coxhead is the mood reference for the account, and
especially for Happy News Saturday. What makes it work: vibrant colour, quirky
hand lettering, smiley face polka dots, sticker doodles, and the warmth of
newsprint rather than the gloss of a brand deck.

**We take the energy. We never take the artwork.** Same rule the repo already
applies to Mobbin references: design against a proven pattern, then translate it
into our own butter and ink and Nunito, never a copy of another brand. Emily
Coxhead's hand lettering and illustration are hers. Ours has to be ours.

| What we take from it | How we do it in our tokens |
|---|---|
| Joyful colour blocking | One accent per card, rotated across the deck, from the live palette only |
| Hand lettered warmth | Nunito 900 at 100px plus, tight leading, negative tracking. Already round and friendly |
| Smiley polka dots | Our own smiley sticker, drawn in SVG, in butter, pink, blue or green |
| Sticker doodles | Stars (DiGi is already a star), dots, squiggles. Sparse, rotated a few degrees |
| Newsprint paper | A cream base with a 5% grain overlay, never flat white |
| Scrapbook layering | Photo frames with tape, slight rotation, hard shadows |
| Cheerful, never naive | The copy stays plain and honest. The pictures carry the warmth, the words carry the truth |

**The thing we do not take: relentless brightness.** Our Wednesday and Monday
posts carry real substance and sometimes discomfort, so the espresso card
(`tone: ink`) exists as the serious note. A deck that is joyful on every single
card cannot land the cliff edge.

---

## Sizes, and which to use

| Use | Pixels | Notes |
|---|---|---|
| **Instagram carousel and single post** | **1080 x 1350** | Portrait 4:5. The default. Takes the most vertical space in the feed |
| Instagram square | 1080 x 1080 | Only when a photo is genuinely square |
| Instagram Story | 1080 x 1920 | Keep text inside the middle 80% or the interface covers it |
| **Facebook feed** | **1200 x 630** | Landscape. A portrait card gets cropped badly in the feed |

**Facebook needs its own render, it is not the same image.** This is the mistake
that makes an account look automated. A 4:5 carousel card posted to Facebook
gets centre cropped and loses the headline. The renderer has a `size: "fb"`
variant for exactly this.

---

## How we build them

Two routes, and the split matters.

### Route 1 · The renderer, for anything repeated or text led

`tools/social-cards/` turns a JSON file into finished PNGs at exact pixel sizes,
using the same self hosted Nunito and IBM Plex Mono the app, the printables and
the Etsy branding use. A card, a star chart and the dashboard all match, because
they are literally the same font files and the same hex values.

```bash
node tools/social-cards/render.mjs                          # every deck
node tools/social-cards/render.mjs tools/social-cards/decks/happy-news-saturday.json
```

Out to `tools/social-cards/out/<deck>/01-<card>.png`, numbered in swipe order so
they upload in the right sequence.

**Use it for:** Wednesday research cards, Friday service cards, Saturday happy
news, quote cards, stat cards, anything with a number, and every Facebook
variant. Anything that will be made more than once.

**Why it is worth having.** It is free, it is instant, it never drifts off
brand, and it means a whole week of cards is a text file rather than an evening
in a design tool. Editing a headline is editing one line of JSON and running one
command.

**To design by eye:** open `tools/social-cards/template.html` in a browser. It
renders a sample deck live. Tweak the CSS, refresh, and when it looks right, run
the renderer.

### Route 2 · By hand, for anything photo led

Monday is a real photo every time, and so is roughly half of Saturday. A photo
card wants a human eye choosing the crop, and ten years of archive is the
biggest asset in the plan.

Natalia has run a design led business for a decade, so this is the part to leave
in her hands rather than automate. The renderer's photo card type exists to give
her the frame, the tape and the caption bar at the right size. She drops the
photo in.

### The card types available

`cover`, `text`, `big`, `stat`, `quote`, `photo`, `list`, `cta`.

Tones: `butter`, `pink`, `blue`, `green`, `amber`, `ink`, or the default cream.

A worked example of each is in the two decks already in
`tools/social-cards/decks/`.

---

## Where Higgsfield fits

The repo already uses Higgsfield for character art and lesson video, and the
job IDs are recorded in `digi-squad/README.md`. For social it earns its place in
three specific jobs and no others:

1. **Illustrated Saturday cards** when there is no photo and a stat card would
   be dull. Generate in the established plush mascot house style from Justin's
   reference sheet, never a generic AI illustration.
2. **Founder Monday video**, if a chapter is better told to camera than in text.
3. **Printable and product art**, which is already the `printables-engine`
   route.

**Where it must not be used.** Never for a photo that pretends to be our family.
Never for a child. Never for a stock feeling lifestyle image, because a real
photo of a real kitchen beats a generated one every time on this account, and
the audience knows the difference. The whole trust position rests on being the
real thing.

---

## Rules for every card

1. **No dashes.** On the card, in the caption, in the alt text. Ages as
   "4 to 16".
2. **One idea per card.** If a card needs two sentences of headline, it is two
   cards.
3. **Headline first, always readable at thumbnail size.** The cover slide is
   doing 90% of the work.
4. **Sparse stickers.** Four per card, maximum, and never on top of a word. The
   Happy News look is playful, not cluttered.
5. **Colour rotates through the deck.** Never two of the same tone next to each
   other.
6. **The espresso card is the serious beat.** Use it once per deck at most.
7. **Never a child's face** without consent, and no faces at all in a generated
   image.
8. **Cream, never white.** Flat white reads as a corporate slide.
9. **The last card carries the ask** on Friday and Saturday. On Monday and
   Wednesday the last card loops back to the idea instead.
10. **Colours come from the live tokens only**, which are in `app/globals.css`.
    Ignore `DESIGN_SYSTEM.md`, it is stale and still lists Fraunces and Inter.

---

## The palette actually in use

| Token | Hex | Where |
|---|---|---|
| Cream | `#F9F8F6` | The default card base |
| Butter gold | `#EDC35F` | The brand accent, pills, stars |
| Butter dark | `#C99A28` | Eyebrows, pill shadow |
| Butter light | `#FEF7E0` | The butter tone card base |
| Espresso | `#2E2818` | The serious card. Never black |
| Ink | `#1A1A2E` | All body text and outlines |
| Ink soft | `#52526A` | Secondary text |
| Retro green | `#2F8F6B` | Stickers, the green pill |
| Coral | `#D4600A` | Squiggles, accents |
| Pastel pink deep | `#F9A8D4` | The pink pill |
| Tint blue | `#D8E8F8` | Photo slots |

Type: Nunito 900 for display, 600 to 800 for body, IBM Plex Mono 600 for
eyebrows and the page counter. Buttons and pills: 16px plus radius, hard
`0 9px 0` shadow, chunky.
