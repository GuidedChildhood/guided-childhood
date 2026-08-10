# Guided Childhood design system

**Rewritten 9 Aug 2026 from the real tokens.** The previous version of this
file documented a design system that never shipped (blue terracotta, Fraunces
and Inter). The single source of truth is `shared/tokens.css`, imported first
by every app's root layout; this file is the guided tour, never the authority.
If this file and `shared/tokens.css` ever disagree, the CSS wins and this file
gets fixed.

## The one sentence

Butter gold on warm cream, deep ink type set in Nunito, IBM Plex Mono for
eyebrows and labels, chunky 16px radius buttons with a hard 5px drop shadow,
GSAP for motion, and a pastel stage spine that walks from yellow (ages 4 to 7)
to lavender (16+).

## Core palette (from shared/tokens.css)

| Token | Value | Use |
|---|---|---|
| `--cream` | `#F9F8F6` | Page ground of the marketing site and cards |
| `--app-bg` | `#F1EFEA` | The app page behind white cards, one real step greyer |
| `--white` | `#FFFFFF` | Card fills |
| `--ink` | `#1A1A2E` | Headings and body text |
| `--ink-soft` / `--ink-muted` / `--ink-light` | `#52526A` / `#8888A0` / `#AEAEC0` | Supporting text, receding order |
| `--border` | `#EAEAF0` | Hairlines |
| `--terracotta` | `#EDC35F` | THE accent: butter gold. The name is legacy, the colour is not terracotta |
| `--terracotta-dark` | `#C99A28` | Button shadows, gold text on light grounds |
| `--terracotta-lt` | `#FEF7E0` | Gold tint fills |
| `--deep-teal` | `#2E2818` | Dark sections. Despite the name it is deep warm espresso, never teal, never black |
| `--retro-green` / `--retro-green-dark` | `#2F8F6B` / `#236F52` | Friendlier dark panels |
| `--danger` on `--danger-bg` | `#991B1B` on `#FEF2F2` | The "not this" side of scripts only |
| `--kid-bg` | anthracite gradient `#4C5057 → #34373D` | The child app ground |

## The stage spine

Five stages, each with a pastel ground, a bold band and a readable text
colour. Ages 4 to 7 yellow (`--stage-1*`), 8 to 10 sky (`--stage-2*`),
11 to 13 coral (`--stage-3*`), 13 to 15 pink (`--stage-4*`), 16+ lavender
(`--stage-5*`). Pastels are card grounds, bolds are header bands and
character colours, text tokens are the only colours ever set on a bold band.

## Legacy aliases, read before styling anything

`--gold` is NOT the accent gold: it aliases `--stage-1-bold` (`#FEF08A`).
`--coral` and `--green-dark` both alias `--terracotta`. `--gold-dark`
aliases `--terracotta-dark`. These aliases keep 300 odd older call sites
rendering; new work names the real token, never the alias.

## Type

- Fonts load via `next/font` in each app's root layout (self hosted,
  preloaded): Nunito exposes `--font-nunito`, IBM Plex Mono exposes
  `--font-ibm-plex-mono`. No CSS `@import` of fonts, ever.
- `--font-display` and `--font-body` are both Nunito (display 800 to 900,
  body 400 to 600). `--font-mono` is for `.eyebrow`, labels and chips,
  uppercase with letter spacing.
- The type scale lives in the tokens file (`--text-xs` up). Rule enforced by
  the wiring check: `--text-xs` is for mono eyebrows and labels only, never
  a body sentence.
- `body { zoom: 1.07 }` is the one global readability dial for both apps.
  Components compensating for it say so in a comment.
- iOS Dynamic Type: `@supports (font: -apple-system-body)` adopts the system
  body size on `html`; body reasserts Nunito so only the size comes through.

## Components (shared classes, in the tokens file)

- **Buttons** `.btn` family: border radius 16px, `box-shadow: 0 5px 0
  <shadow-colour>`, chunky, pressed state translates down. Gold buttons
  shadow with `--terracotta-dark`.
- **Cards** `.card`: white fill on cream or app-bg ground, `--border`
  hairline, generous radius.
- **Inputs** `.input`: same geometry as buttons, focus ring in gold.
- **Stage badge** `.stage-badge`: bold band colour with its matching text
  token.
- **Layout**: `.section` 96px/64px padding, `.container` max width 1080px.
- **Motion**: GSAP only. `.fu` fade ups for scroll reveals, never the hero
  (the hero is still from first paint, on purpose, see the GSAP block
  comment). `.lift` for cursor lift cards. `prefers-reduced-motion`
  disables both.

## The two apps

Both import `@gc/shared/tokens.css` first, then their own stylesheet on
top. Parent only sections (bottom tab bar, DiGi card, pathway grid, squad
section, announcement bar) live in `app/globals.css`. The schools app
carries its own thin stylesheet for educator surfaces. Nothing product
specific belongs in the tokens file.

## Non negotiables (CLAUDE.md, repeated here on purpose)

No Inter. No purple gradients. No generic AI patterns. No dashes in any
copy. Mobile and desktop checked in Chrome DevTools before anything is
declared done.
