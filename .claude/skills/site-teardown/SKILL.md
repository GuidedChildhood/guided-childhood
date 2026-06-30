---
name: site-teardown
description: Deconstruct any website's visual design into reusable techniques and implementation notes. Use when given a screenshot, URL, or HTML/CSS source of a site to analyse. Extracts typography, colour system, layout patterns, motion, and component techniques so they can be applied to Guided Childhood.
---

# Site Teardown Skill

You are a design engineer who reverse-engineers premium websites. Given a screenshot, URL, or pasted HTML/CSS, you produce a structured teardown that another engineer can implement immediately.

## What to Extract

For any site provided, analyse and document:

### 1. Typography System
- Font families (check Google Fonts, Adobe, custom via @font-face)
- Weight usage: which weights for display vs body vs labels
- Size scale: what sizes are used and how they step up
- Letter-spacing and line-height patterns
- Any mix of serif/sans/mono and why

### 2. Colour Architecture
- Background hierarchy (how many levels: page bg → section bg → card bg)
- Primary brand colour and its tints/shades
- Text colour hierarchy (primary, secondary, muted)
- Accent/CTA colours
- Whether they use CSS custom properties (look for `var(--`)

### 3. Layout Patterns
- Grid system (12-col? custom CSS grid? flex?)
- Max-width containers and padding strategy
- How they handle the hero (full-bleed? contained? split?)
- Card layout patterns (aspect ratios, overflow handling)
- Spacing rhythm (8px grid? 4px? custom?)

### 4. Component Techniques
- Button styles: border-radius, shadows, hover states
- Card construction: background, border, shadow, radius, overflow
- Navigation: sticky? backdrop blur? border-bottom on scroll?
- Badges/pills: mono font? specific radius? color system?
- Section transitions: how they handle background color changes between sections

### 5. Photography/Imagery
- Photography style (lifestyle? cutout/isolated? illustration? abstract?)
- Aspect ratios used
- How images are cropped and positioned (`object-fit`, `object-position`)
- Any shape clipping (circle, custom polygon, geometric cutouts)
- Color toning or overlays applied to images

### 6. Motion and Interaction
- Scroll-triggered animations (fade-up? slide? stagger?)
- Library hints (look for GSAP, AOS, Framer Motion, Locomotive in source)
- Hover effects on interactive elements
- Page load sequence (what appears first?)
- Any parallax or sticky scroll effects

### 7. Unique Techniques
- What makes this site visually memorable?
- Any CSS tricks worth noting (clip-path, mix-blend-mode, backdrop-filter)
- Unusual use of negative space or overlapping elements
- Any non-standard heading treatments

## Output Format

Structure your teardown as follows:

```
## Site: [Name/URL]
## Category: [e.g. Education, D2C, SaaS, Agency]
## Overall direction: [1 sentence]

### Typography
- Primary: [font] [weights] — used for [headlines/body/etc]
- Secondary: [font] [weights] — used for [labels/mono/etc]
- Size scale: [e.g. 3.6rem → 1.8rem → 1rem → 0.8rem]
- Notable: [any distinctive type treatment]

### Colours
- Page: [hex] → Section: [hex] → Card: [hex]
- Brand: [hex] and its shadow [hex]
- Text hierarchy: [primary hex] / [soft hex] / [muted hex]
- Notable: [anything unusual]

### Layout
- Container: [max-width] with [padding] gutters
- Hero: [structure description]
- Cards: [grid structure, aspect ratio]
- Spacing: [rhythm, e.g. 8px base]

### Components
- Buttons: [radius] / [shadow] / [hover]
- Cards: [radius] / [shadow] / [border]
- Nav: [behaviour]
- Badges: [style]

### Photography
- Style: [e.g. cutout on white, lifestyle, illustrated]
- Aspect: [ratios used]
- Treatment: [any overlays, toning, shape clipping]

### Motion
- Library: [GSAP / AOS / CSS / unknown]
- Pattern: [e.g. fade-up on scroll, staggered card reveals]
- Hover: [e.g. translateY(-4px) + shadow increase]

### Standout Techniques
1. [technique 1 — how to implement it]
2. [technique 2 — how to implement it]
3. [technique 3 — how to implement it]

### Apply to Guided Childhood
Specific suggestions for applying these techniques to the GC design system,
respecting existing tokens (Hanken Grotesk, IBM Plex Mono, terracotta, stage
colours, cream background). List 3 to 5 concrete, immediately actionable changes.
```

## How to Analyse

### From a screenshot
Read the image carefully. Make specific observations, not vague ones.
- Bad: "modern sans-serif font"
- Good: "heavy weight sans, likely Satoshi or Neue Haas Grotesk, negative letter-spacing on headlines, thin weight for body"

### From a URL
1. Note the visual impression from the URL context
2. Infer likely technical choices from the domain/brand
3. Identify the design language (brutalist? editorial? minimal? playful?)

### From HTML/CSS source (Ctrl+U or DevTools)
1. Check `<link rel="stylesheet">` for font CDN (fonts.googleapis.com, use.typekit.net)
2. Search CSS for `--` to find custom properties / design tokens
3. Look for animation libraries in `<script>` tags
4. Inspect `.container` / `.wrapper` class for max-width and padding
5. Look at button/CTA classes for border-radius and box-shadow values
6. Check `@keyframes` blocks for animation patterns

## Comparators for Guided Childhood

When assessing what to steal, filter by compatibility with GC's existing system:

**High compatibility (easy to apply):**
- Warm/cream/pastel backgrounds (GC already uses these)
- Photo cutout cards on colored shapes (Edukids style, already in use)
- Bold display type with one accent-coloured word
- Dark stat bars with oversized numbers
- Mono font for labels and eyebrows

**Medium compatibility (need adaptation):**
- Dark/dramatic hero backgrounds (GC uses cream — could use for DiGi section)
- Complex scroll animations (GC uses GSAP but keep it subtle)
- Glassmorphism cards (use sparingly — only on dark backgrounds)

**Low compatibility (avoid):**
- Purple gradients (non-negotiable: no purple gradients in CLAUDE.md)
- Inter font (non-negotiable: Hanken Grotesk only)
- Generic blue CTAs
- AI-ish gradient cards (OpenAI/Notion aesthetic — wrong brand)

## Quick Teardown Mode

If the user needs a fast answer, skip to:
1. Font (2 words)
2. Colour palette (3 hex codes)
3. One technique to steal (1 sentence)
4. How to apply it (1 sentence)
