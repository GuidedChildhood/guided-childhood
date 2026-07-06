---
name: gc-slides
description: Build Guided Childhood branded presentation decks as single self contained HTML files. Use whenever Justin asks for an assembly, a CPD deck, a parent evening pack, a pitch deck for heads, or any standalone presentation. Borrows the frontend-slides method (fixed 1920x1080 stage, single file, keyboard navigation, PDF export) but the style is ALWAYS the Guided Childhood design system, never a stock template. Never used for classroom lessons, which are database rows in the interactive player.
---

# GC Slides — branded decks, the frontend-slides method, our destination

Adapted from github.com/zarazhangrui/frontend-slides (JP decision, spec section 9.6): we keep their production mechanics and replace their entire style layer with our brand. Reference, not copy.

## Scope guard (check before anything)

BUILD with this skill: the six assemblies (KS1 to KS5), the 2 hour CPD module deck, primary and secondary parent evening packs, the pilot pitch deck for heads and governors, and one off talks.
NEVER build with this skill: classroom lesson slides. Lessons live in school_lessons rows and render in the interactive player with auto marked checks (rule 6). If asked for lesson slides, point at the lesson pipeline instead.

## The mechanics we keep (proven by frontend-slides)

1. **Single self contained HTML file.** All CSS and JS inline, no external dependencies, no build step. Assets referenced by RELATIVE path only.
2. **Fixed 1920x1080 stage.** The slide canvas scales uniformly to fit the viewport (letterbox allowed), NEVER reflows internally. No responsive breakpoints inside slides.
3. **Slide markup:** every slide is a `section.slide`; the current one gets `.active`. Switch with visibility, opacity and pointer-events, never display none (keeps PDF export and transitions working).
4. **Navigation:** arrow keys, spacebar, click zones, touch swipe. Slide counter bottom right in IBM Plex Mono.
5. **Respect `prefers-reduced-motion`.** Subtle fade and rise transitions only (GSAP style easing in plain CSS), nothing spinning.
6. **PDF export:** each `.slide` screenshotted at 1920x1080 via headless Chromium (Playwright is preinstalled in this environment, launch with the installed Chromium) and combined; offer this whenever a deck is finished so schools get a printable handout.
7. **Never render internal workflow text on a slide** (no template names, file paths, phase labels).

## The style layer we replace (brand is law, not a choice)

There is no style discovery phase. Every deck uses the Guided Childhood system:

```css
:root {
  --cream: #F7F3EE;   --warm: #FDFBF8;   --ink: #1C1C1C;
  --ink-soft: #4A4A4A; --ink-muted: #6E6A62; --ink-light: #9B958A;
  --green: #AFDCA2;   --green-dark: #2E7D5A; --green-lt: #EEF7F2;
  --coral: #D4600A;   --coral-lt: #FEF3E8;   --coral-dark: #C0392B;
  --gold: #F2C94C;    --gold-lt: #FEFAE8;    --gold-dark: #C9962A;  --gold-hover: #E3B53A;
  --lav: #E7ECF8;     --lav-deep: #3D5BA9;   --border: #E4DFD7;
  --deep-teal: #173C46; /* the only dark surface allowed, never black */
}
```

- **Fonts:** Nunito (800 to 900 display, 400 to 600 body) + IBM Plex Mono (eyebrows, labels, counters), loaded from Google Fonts. Never Inter, never system fonts.

### Typography for schools (brand law + the accessibility research, plans/print-design-system.md)

School decks are read from the back of halls and classrooms by children, teachers and parents, and must satisfy the BDA/UKAAF rules our print research locked in:

- **Sizes on the 1920x1080 stage.** Assemblies (pupil facing, school hall): headlines 96 to 120px Nunito 900, body 48 to 56px minimum, never more than about 20 words on a slide. CPD, parent evening and pitch decks (adults, classroom distance): headlines 72 to 88px, body 36 to 44px minimum, bullets capped at 6 per slide. Nothing pupil facing ever below 44px body.
- **Heading tracking:** letter-spacing -0.01em maximum (Nunito reads cramped tighter, decisions.md 2026-07-01). Body tracking normal or slightly open, never negative.
- **Line height 1.4 to 1.5 for any multi line text. Left aligned, ragged right, never justified, never centred paragraphs** (centred is allowed only for single line title slides and certificates).
- **Emphasis is bold only. No italics, no underline, no block capitals in body text** (BDA: they slow or break reading). The uppercase IBM Plex Mono eyebrow is a short label, never a sentence: 6 words maximum.
- **Sentence case everywhere,** including headlines. Board text inside character video beats is the one exception (REAL OR MADE? style, it is scenery, not body text).
- **Contrast:** ink on cream passes; body text never in --ink-light; text on --deep-teal slides is cream or white at 700+ weight; never place text over the gold wash below 800 weight.
- **Numbers and data:** IBM Plex Mono for figures and citations; every stat carries its source and year on the same slide at 28 to 32px, ink-muted.
- **Dyslexia posture:** Nunito's rounded, evenly spaced letterforms pass BDA guidance; keep it, never substitute a decorative face for "variety". Meaning never by colour alone: pair every colour signal with an icon or label (one colour blind child in every classroom).
- **Slide grammar:** cream background; quiet mono eyebrow top left; Nunito 800 headline in ink (yellow is a shape, never text); one accent per deck section; chunky 16px radius cards with the hard `0 5px 0` shadow for callouts; the DiGi golden star as the recurring brand mark.
- **Characters:** cast per the spec 9.4 table (squad kids primary, Vix/Brock and DiGi secondary, DiGi only for sensitive topics). Character video beats embed as mp4 from the Higgsfield CDN; long form talking segments come from the Avatar pipeline. Never render DiGi as a robot or an owl.
- **Copy rules:** no dashes as punctuation anywhere. Justin's voice: warm, plain, direct. Every stat cited from LANDSCAPE_CONFIG (lib/config/landscape.ts) with source and date. Evidence discipline: nothing a hostile expert could kill (the Odgers test). The honest line where relevant: the ban removes the apps, it does not raise the child.

Within brand, offer JP a choice of THREE LAYOUT directions (not styles) when starting a new deck type: warm classic (cream, editorial, lots of air), contrast opener (deep teal title slides, cream body slides), character forward (squad presence on most slides). Render the three as real single slide previews, in brand, and let him pick.

## Deck skeletons

- **Assembly (KS band, 15 to 20 min, 12 to 16 slides):** hook question > character video beat > three teaching beats each with one idea and one big visual > whole room interaction moment > the one action to take away > parent note pointer.
- **CPD (60 min compressed or 2 hour full, 25 to 40 slides):** the research honestly stated > the cliff edge > what children actually encounter > the TRUST framework (canonical wording only, never invented; stop and ask JP if not in context) > classroom practice and disclosure response > the scheme walkthrough > certificate slide.
- **Parent evening (30 min, 15 to 20 slides):** mirror of the parent workshops in plans and the algorithm literacy workshop structure; ends on the family actions, never on fear.
- **Pitch deck for heads (10 to 12 slides):** the gap > statutory tailwind (from LANDSCAPE_CONFIG guidance keys) > the product in 3 slides (lesson, marking, evidence pack) > pilot offer > published pricing > the honest evidence stance as the closer.

## Workflow

1. Confirm deck type and audience (one question if not obvious). Check scope guard.
2. Gather content from the repo sources: plans/schools-lesson-build-spec.md, plans/lesson-format.md, lesson rows, LANDSCAPE_CONFIG, digi-squad/README.md. Never invent stats or TRUST wording.
3. First deck of a given type: render the three in brand layout previews, JP picks.
4. Generate the full single file deck. Verify: no dashes in copy, no stock template look, counter and nav working, reduced motion respected.
5. Offer PDF export and (if wanted) a Vercel deploy per the repo's two project convention.
6. Log the deck in decisions.md if it sets a reusable pattern.
