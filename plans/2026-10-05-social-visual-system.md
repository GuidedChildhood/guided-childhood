# 5 October 2026: the social visual system, installed, and the audit

Justin asked for one brand default for every Guided Childhood social channel
(Instagram, Facebook, LinkedIn, YouTube), built from an approved reference
board, with the real product assets as the source of truth, and a routine that
automates as much of the posting as possible.

**Scope of this pass, as he set it:** install the system, route to it, link the
existing docs to it, audit the existing templates, then **stop**. No template
is redesigned or deleted until he approves the verdicts below. No live UI, no
character art, no campaign or register IDs and no paid generation are touched.

## What was built

| File | What |
|---|---|
| `brand/GDC_SOCIAL_VISUAL_SYSTEM.md` | The permanent system, written against the real asset paths |
| `brand/references/2026-10-05-social-reference-board.webp` | The approved board, stored as a composition reference only |
| `CLAUDE.md` | One routing line: read the system before any social visual or image brief |
| `content/brand-story/visual-system.md` | A pointer at the top: the new system decides the look, this file keeps the craft |
| `.claude/skills/family-social/SKILL.md` | A pointer beside the visual-system link |
| `.claude/skills/silent-ugc/SKILL.md` | A pointer for the cover frame and burned in hook |
| `.claude/skills/content-engine/linkedin-engagement.md` | A pointer in the image section |
| `.claude/skills/viral-post/SKILL.md` | A pointer in the research card section, naming the open question |

## How the brief was adapted to the repo

- The brief says "existing age stage colours". The product has two sets that
  do not match: the stage pastels in `shared/tokens.css` (yellow, sky, coral,
  pink, lavender) and the friend colours. A Bloop card on a sky ground reads as
  the wrong friend, so social uses **the friend triplets** from
  `shared/schools-curriculum.ts`. Open question 2 below.
- The "gold pathway" is not one thing in the product. Today's path
  (`TodayPathBig.tsx`) is a green trail; the 4 to 16 road (`StageRoad.tsx`) is
  a butter dotted trail. Social takes the road, in `#EDC35F`, drawn in code.
- The board's characters are redrawn approximations, its headline face is a
  marker hand, its product screen is invented, its DiGi card sits on a pink
  that is not a token, and its 49% is a placeholder. All five are named in the
  system file as things not to take.
- Higgsfield: still images never generate a character. Video animates the
  approved file by image to video, which is how the lesson and DiGi films are
  already made, rather than banning a method the product depends on.
- Scenario quotes carry an IBM Plex Mono eyebrow (A THING PARENTS SAY) so they
  are visibly illustrative.

## The audit

| Template or doc | Verdict | Reason |
|---|---|---|
| `tools/social-cards/render.mjs` | **KEEP** | The right engine: JSON in, PNG out, real fonts, real tokens, no generated art. Every new format should be built on it |
| `tools/social-cards/template.html` | **UPDATE** | Sticker scatter, smiley polka dots and a rotating colour per card are the Happy News look the new system replaces. Its wordmark is a star, not the logo bars from `shared/brand.ts`. No slot for a friend cutout, the gold pathway, a screenshot or the Passport |
| `script` and `ages` card types | **KEEP** | `script` is DiGi, WHAT DO I SAY? already; `ages` is the Road to 16 already. The two strongest save formats survive the change |
| `tools/social-cards/decks/*.json` (three decks) | **KEEP** the copy | Words are fine. Re-render once the template is updated |
| `content/brand-story/visual-system.md`, sizes, safe zone, Facebook, last card (L36 to 181) | **KEEP** | Correct craft, now linked rather than duplicated |
| `content/brand-story/visual-system.md`, the Happy News reference (L7 to 32) and card rules 4, 5 and 10 (L214 to 225) | **UPDATE** | Stickers, colour rotation and the "take the energy" brief conflict with 80 percent editorial. Rule 10 points at `app/globals.css`; the tokens live in `shared/tokens.css` |
| `content/brand-story/visual-system.md`, Higgsfield job 1 (L191 to 193) | **UPDATE** | "Illustrated Saturday cards in the plush mascot house style" would generate characters. Composite the approved cutouts instead |
| `design-refs/happy-newspaper-notes.md` | **RETIRE** as a visual reference | Keep as history. The system names what we learned from it and replaces its look |
| `content/brand-story/weekly-rhythm.md` | **KEEP** | Founder Monday stays a real photo; the system governs the cards around it |
| `.claude/skills/family-social/SKILL.md` | **KEEP** | Pointer added. Its character, consent and dash checks already agree |
| `.claude/skills/viral-post/stat-card.html` and `carousel.html` | **UNCERTAIN** | Playfair and Source Serif with a terracotta accent, deliberately not Nunito. It is the format behind the best post (73,911 impressions) and is Justin's own voice. Open question 3 |
| `content/packs/2026-08-13-louder-than-the-evidence/carousels/`, `2026-08-27-big-tech-fines/cards/` | **KEEP** as published history | Already out. Not reworked |
| `content/packs/2026-07-11-kids-are-alright/kids-carousel.html` | **RETIRE** as a template | EB Garamond newsprint look from July, pre dates the tokens |
| `content/linkedin/featured-banner/` | **KEEP** | Cream, Nunito, built in code, no generated art |
| `content/linkedin/featured-banner-schools-prompt.md` | **RETIRE** | Superseded by the built banner, as its own README says |
| `videos/_templates/explainer-draw/` | **KEEP** | Cream, ink, butter, Nunito, dash guard in the build. Only the leftover "Daisy Days, Fredoka" label in `frame.md` needs a one line **UPDATE** |
| `videos/2026-10-02-ask-digi/` | **KEEP** | The real DiGi SVG, animated in code |
| `videos/2026-10-01-how-digi-works/` | **KEEP** | Image to video from the approved star, which the system now names as the allowed route |
| `videos/guided-childhood-intro/` | **KEEP** | Captured from the live site |
| `.claude/skills/silent-ugc/SKILL.md` | **KEEP** | Pointer added. No synthetic person, real screens, ends at the stage check |
| `.claude/skills/explainer-video/SKILL.md`, `talking-head-video/SKILL.md` | **KEEP** | Already the same house frame and the same real screens rule |
| `.claude/skills/content-engine/linkedin-engagement.md`, section 3 | **KEEP** | Photo first for Justin's own posts. Pointer added for when a graphic is the point |
| `content/ugc/README.md`, L30 to 32 "one generated portrait reused for every clip" | **RETIRE** that line | Contradicts CLAUDE.md (never a synthetic person presented as a real parent) and the rest of the same file |
| `agents/config/tasks.yaml` L234 to 245, the image prompt spec | **RETIRE** | White or very dark grounds, burnt orange. Conflicts with cream and the tokens |
| `agents/outputs/2026-06-13-image-prompts.md` | **RETIRE** | June output, charcoal and navy cards. History only |
| `content/packs/2026-07-08-agency-operating-system/README.md`, visual brief L20 | **RETIRE** that section | Lists Hanken Grotesk and lavender tokens that no longer exist |
| `.claude/skills/printables-engine/SKILL.md`, cast and lane map L15 to 47 | **UPDATE** | Still assigns retired Oliver, Zara and Sofia. Format 3 (printables) depends on it |
| `.claude/skills/gc-slides/SKILL.md` L56 | **UPDATE** | "squad kids primary" is out of date. Not social, noted in passing |
| `plans/moment-art-prompts.md`, `plans/moments-illustration-spec.md` | **KEEP** | In app tiles, not social. Already no people, no text, butter and cream |
| `content/etsy-shop/branding/assets.html` | **KEEP** | Real DiGi star, cream, the same fonts |
| `tools/tsb-playlist-card/` | **KEEP**, out of scope | The Social Billboard is a separate company with its own brand. This system does not apply |
| The Monday and Friday carousel generator in the Drive Control Room | **UNCERTAIN** | Not in the repo, so it could not be audited. It should render through `tools/social-cards` once that is updated |

## Conflicts found

1. **Two sets of friend colours in live code.** `lib/content/stage-characters.ts`
   (Pebble `#E6B93E`, Bloop `#7CB342`, Orbit `#4C9FD6`, Nova `#9B72CF`, Cosmo
   `#E8873C`) against `shared/schools-curriculum.ts` and the character bible
   (`#C99A28`, `#6C9E38`, `#3E86BC`, `#7E5AB0`, `#CE7328`).
2. **The stage pastels do not match the friends.** Stage 2 is sky and Bloop is
   green; stage 3 coral and Orbit blue; stage 4 pink and Nova purple.
3. **`shared/passport-stages.ts`** stamps Orbit twice, gives Nova the
   independent stage and never uses Cosmo.
4. **Orbit's ages:** 11 to 12 in `stage-characters.ts`, 11 to 13 in the bible.
5. **Three logos.** The app draws the butter square with bars; the social card
   renderer draws a star; the schools nav uses a star emoji.
6. **The legacy green robot `Digi.png`** is still referenced by the live
   `public/starter-pack.html` (L518) and `public/school-pack.html` (L185).
   Live UI, so not touched here.
7. **CLAUDE.md routes UI work to `docs/05` and `docs/07`, which do not exist**,
   and `AGENTS.md` is a stale copy of an old CLAUDE.md.
8. **Autoposting.** Every social skill says "never publish", and
   `content/packs/2026-07-08-posting-calendar/daily-routine.md` says live
   posting stays human. Nothing in the repo posts, and no Meta, Buffer or
   YouTube connector is attached to this environment. Automating publishing is
   a decision, not a setting.
9. Small stale lines: `PassportBook.tsx` L18 says "teal cover", the code is
   burgundy; `DESIGN_SYSTEM.md` lists `--ink-muted #8888A0` and old fonts.

## Missing assets

- A logo file (SVG and PNG, on cream and on ink). The mark exists only as code.
- A profile avatar for each social account, made from that logo.
- A Passport cover as a still image. Only code renders and three screenshots.
- A lineup of the six (DiGi and the five friends) as one approved image. The
  journey format needs it; compositing the five cutouts in HTML works until then.
- Friends with their props (Orbit's magnifier, Bloop's controller, Nova's
  cards, Cosmo's checklist). Only three moods exist (happy, wave, thinking).
- Real screenshots beyond five: the star bank, a DiGi answer, a script, the
  quest board, a lesson slide, the stage check.
- A schools logo and any school photography.

## Decided by Justin, 5 October 2026

1. **The audit verdicts: approved and applied.** The updates and retirements
   above are done (the retired files carry a one line note and stay as
   history; nothing was deleted).
2. **Colours: the friend triplets**, not the stage pastels.
3. **LinkedIn: the serif research card stays for Justin's own posts**;
   anything posted as Guided Childhood uses the system.
4. **The routine: a Sunday batch, and Justin posts.** No autoposting.
5. **Happy News Saturday keeps the same look as every other day.** The day
   stays; only the sticker look went.

## What was built after the decisions

- `brand/proposals/2026-10-05-six-formats/`: the rendered proposal he approved.
- `tools/social-cards/`: rebuilt into the six formats (the frame, the road,
  one lead friend per deck). The three old decks re-rendered as proof;
  `decks/six-formats.json` shows every format. `npm run social-cards`.
- `tools/social-cards/week.mjs` (`npm run social-week -- <folder>`): renders a
  week of decks, writes `THIS-WEEK.md` (swept by `npm run ai-tells`) and builds
  the page.
- **The page:** https://claude.ai/artifact/1yUXSQ4EdHBThHkEPfWf7v, "GDC posts".
  Today's post first, swipe the cards, hold to save, copy the words, tick
  Posted. Same link every week; it shows a sample week until Sunday.
- `.claude/skills/social-week/SKILL.md`: the Sunday batch, step by step.
- **The routine** "Sunday social batch" (`trig_01LXCMUEJTwBSPULSghPAfA4`):
  Sundays 18:55 UK time, after the 18:00 ideas sheet, a fresh session runs
  the skill and opens a draft PR. Push notification on finish. Never posts.

## How Justin runs it

- **Sunday evening** (the phone buzzes): open the page, check the week, and
  either schedule it all in Meta Business Suite (about 20 minutes) or leave
  it for each morning.
- **Each morning:** open the pinned page, today's post is at the top, save
  the cards, copy the words, post, tick Posted. Two minutes.

## Found while building

- `public/marketing/passport-*.png` show the old brown passport cover and a
  real child's name. Kept off social; the card maker draws the current cover.
- The routine cannot hold the Google Drive connector when created from a
  session, so it needs adding on the Routines screen, or it plans from the
  weekly rhythm instead of the sheet.
- The local "Instagram carousel generator" (Monday and Friday 07:03) would
  now duplicate the Sunday batch.
