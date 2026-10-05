# The visual system: how the cards are built

**How we actually build the pictures. No dashes in any copy on any card.**

**The look is decided in `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`** (5 October
2026): the six formats, the real assets, the friend colours, the gold road
and the evidence rule. Read it first. This file keeps the craft: sizes, the
safe zone, Facebook, the renderer and the last card.

---

## The reference, and what changed

The Happy Newspaper was this account's first mood reference (stickers, smiley
polka dots, a new colour on every card). It taught us recognisability and
simplicity, and on 5 October 2026 Justin replaced its look with the system
file: roughly 80 percent intelligent adult editorial, 20 percent childhood
warmth. The reader is the parent. The type and the whitespace carry the
authority; one Planet Friend carries the warmth. The teardown stays in
`design-refs/happy-newspaper-notes.md` as history.

**The espresso card stays as the serious note.** Our Wednesday and Monday
posts carry real substance and sometimes discomfort, so `tone: ink` exists for
that one beat. A deck that is cheerful on every card cannot land the cliff
edge.

---

## Sizes, and which to use

| Use | Pixels | Notes |
|---|---|---|
| **Instagram carousel and single post** | **1080 x 1350** | Portrait 4:5. The default for everything |
| Instagram square | 1080 x 1080 | Only when a photo is genuinely square |
| Instagram Story | 1080 x 1920 | Keep text inside the middle 80% or the interface covers it |
| **Facebook feed** | **1080 x 1350** | Same file. Facebook moved to portrait in late 2025 |

**One artboard serves both.** An earlier draft of this file said Facebook needed
its own 1200 x 630 landscape render. That was out of date. Build once at
1080 x 1350.

### The safe zone, which is the part that catches people out

Instagram changed the profile grid from square to **3:4 in 2025**. A 4:5 upload
is previewed in the grid at roughly 1013px wide, so about **34px is shaved off
each side**, and it is the sides that go first.

**Keep everything meaningful inside the centre 1013px**, which means nothing
important in the outer 34px. Our 88px padding clears this comfortably, and the
frame and road in `template.html` were set with it in mind. Check it if you
move anything to the edge.

### Facebook does not have the Instagram carousel

This is the correction that matters most, and it is structural rather than
cosmetic. **A multi photo organic post on Facebook renders as a collage or grid,
all visible at once, not a swipeable sequence.** True swipeable carousels are
effectively an ads format and cannot be built in the normal composer.

So a nine card Instagram carousel does not survive the crossing. It arrives as a
jumble with the order broken and the argument destroyed.

**What to do instead, one of two things.**

1. Publish **slide one alone as a single tall image**, and put the whole argument
   in the post text. Facebook rewards long, warm, human text in a way Instagram
   does not.
2. Publish **one deliberately built single image that carries the whole idea.**
   The three age band card is exactly this and needs no swipe to work.

And post it where the parents actually are. In the UK, Facebook carries the
parents of secondary school age children, which is precisely the phone worry
audience, and it carries them **inside Groups** rather than on Pages. Group
reach is a different order of magnitude to Page reach.

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

The six permanent formats: `hook`, `question`, `printable`, `screen`,
`road`, `situation`. The supporting slides inside a carousel: `cover`,
`text`, `big`, `stat`, `quote`, `photo`, `list`, `script`, `ages`, `ask`,
`cta`.

A deck names its lead friend once (`"lead": "orbit"`) and every card takes
that friend's soft ground and ink, so a series is recognised by its colour.
No lead means cream. `tone: ink` is the espresso card, once per deck at most.

Worked examples are in `tools/social-cards/decks/`; `six-formats.json` shows
every format.

### The two templates that do the heavy lifting

Borrowed from the two strongest save engines in the parenting category, and both
happen to fit our thesis exactly.

**`script`, the say this not this card.** Big Little Feelings built a 3M
following on this unit. The atomic thing is **a sentence a parent can say out
loud tonight**, not a concept. It is the highest saving format in the category
because a save means "I will need these words later".

**`ages`, the three age band card.** Solid Starts built 1.4M followers on one
repeatable diagram: the same food, prepared three ways for three ages. The
template is the brand, not the topic.

Ours is the same situation at three ages with three calibrated pathways, and it
is worth noticing why this fits so well. It is **non negotiable 1 rendered as a
picture**. Never allow or deny, always a calibrated pathway. One layout, endless
content, and it teaches the whole philosophy without arguing for it.

**A repeatable diagram template beats a content calendar.** Build these two into
the rotation deliberately rather than treating them as occasional formats.

### Deck length and the last card

**Seven to ten cards** is the working range for an educational carousel. Our
first decks run to six, which is on the short side and fine for the handover,
but a Friday teaching post should reach seven or eight.

**The last card is an `ask`, not a `cta`.** Instagram ranks partly on sends per
reach, and carousels earn their keep on saves rather than likes. So the final
card spends itself on those two:

- **Save it**, with a stated future use. "Save it for five o'clock today,
  because that is when you will want the words." A reason to save beats "save
  this".
- **Send it**, naming a person. "Send it to the parent who is already dreading
  the summer." A send is a personal vouch, and it is what opens distribution
  beyond our own followers.

**The product ask goes in the caption, not on the last card.** The last card is
too valuable to spend on a link nobody can tap from a carousel anyway.

A post built for likes is a statement. A post built for saves is a tool. A post
built for sends is a mirror. Friday should be a tool. Saturday should be a
mirror.

---

## Where Higgsfield fits

The repo already uses Higgsfield for character art and lesson video, and the
job IDs are recorded in `digi-squad/README.md`. For social it earns its place in
three specific jobs and no others:

1. **Scenes and objects behind a card** when there is no photo and a stat card
   would be dull. The friend on the card is always the approved cutout,
   composited on top, never generated (`brand/GDC_SOCIAL_VISUAL_SYSTEM.md`
   section 15).
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
4. **No stickers, no doodles.** One gold detail per card: the road, a pill, or
   DiGi. A third of the card stays empty.
5. **One colour per deck.** The lead friend's ground on every card, so the
   series is recognisable. The espresso card is the only change.
6. **The espresso card is the serious beat.** Use it once per deck at most.
7. **Never a child's face** without consent, and no faces at all in a generated
   image.
8. **Cream, never white.** Flat white reads as a corporate slide.
9. **The last card carries the ask** on Friday and Saturday. On Monday and
   Wednesday the last card loops back to the idea instead.
10. **Colours come from the live tokens only**, which are in
    `shared/tokens.css`, plus the friend triplets in
    `shared/schools-curriculum.ts`. Ignore `DESIGN_SYSTEM.md`, it is stale.

---

## The palette actually in use

The full table, with the friend triplets and the Passport burgundy, is section
4 of `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`. The short version:

| Token | Hex | Where |
|---|---|---|
| Cream | `#F9F8F6` | The card ground when no friend leads |
| Ink | `#1A1A2E` | Every headline |
| Ink soft | `#52526A` | Secondary text |
| Butter gold | `#EDC35F` | The road, pills, the logo |
| Butter dark | `#C99A28` | The road's shadow, eyebrows |
| Espresso | `#2E2818` | The serious card. Never black |

Type: Nunito 900 for display, 600 to 800 for body, IBM Plex Mono 600 for
eyebrows and the page counter. Pills: 16px plus radius, hard `0 5px 0`
shadow, chunky.
