# Design tells, and the Apple standard

Justin, 19 November 2026: nothing we build should look AI made; it should look
as if a top Apple UX designer made it. This is the checklist. Read it before
building or changing any page, alongside SKILL.md in this folder. Our tokens
(shared/tokens.css) always win.

`npm run design-tells` (scripts/check-design-tells.mjs) enforces the half a
machine can judge, with no model in the loop. It is a ratchet: old pages keep
what they have, a new or edited file cannot add a tell. The other half is a
screenshot review, below.

None of these proves a page was machine made (Krebs, below). Each is a default
left untouched, and an untouched default is what reads as nobody chose it.

## Hard, the guard fails on a new one

| Rule | What it is | Do instead |
| --- | --- | --- |
| gradient-text | background clipped to the letters | solid ink, one butter word at most |
| purple-gradient | gradients through purple, indigo, violet | cream ground, flat stage pastels |
| glass | backdrop blur panels | a solid surface and a 1px border |
| edge-stripe | thick coloured stripe down one card edge | a mono label or a tinted ground |
| banned-font | Inter, Roboto, Arial, Space Grotesk, Geist, Syne | Nunito and IBM Plex Mono only |
| emoji-icon | sparkles, rockets, bulbs, stars as icons | a drawn icon from public/icons or none |
| glow-shadow | blur of 40px or more, shadow-xl | `0 4px 24px rgba(26,26,46,.07)` or the 5px button drop |
| bouncy-ease | elastic, bounce, back easing | `power2.out`, 0.6s or less |
| light-weight | font weights under 400 | 400 to 900 only |
| tiny-text | text under 11px | 11px floor, 12px for mono labels |
| arrow-glyph | "→" on buttons and links | the words do the work |
| dot-meta-line | "A · B · C" meta lines | one plain sentence, or a short list |

The last two are our own habits. The same Anthropic frontend design skill we
use names them, with a cream page, a mono caps eyebrow over every heading and
01/02/03 markers, as the next wave of generated defaults. Keep the cream and
butter: they are the brand. Ration the rest, starting with new pages.

A genuine exception carries `design-ok: <reason>` on the line.

## The judgement half, at screenshot review

Check each on phone (390 wide) and desktop (1280) before calling a page done.

1. **One primary action per screen.** One gold button leads. A second action is
   a text link. Apple HIG, buttons.
2. **Hierarchy by size and weight, not colour.** Five type sizes at most on a
   page. HIG, typography.
3. **One accent.** Butter marks the primary action and status, never decoration
   and never two meanings. HIG, color and branding.
4. **Line length 50 to 75 characters.** Body copy sits in a `max-width` of
   about 64ch. Baymard.
5. **Tap targets 44 by 44 or larger,** with room around them.
   `npm run tap-guard` covers the app. HIG, accessibility.
6. **Contrast 4.5:1 for body text, 3:1 for large.** HIG, accessibility.
7. **Motion has a job and is brief,** and every GSAP file respects
   `prefers-reduced-motion`. No animation on things people do often. HIG, motion.
8. **Radii nest.** An inner corner is the outer corner minus the padding; pills
   are half their height. One radius scale (tokens). WWDC 2025, session 356.
9. **Spacing from one scale,** not a new number per section, and not the same
   padding on every section either: rhythm comes from deliberate change.
10. **Content first.** The real thing (a real screen, a real script, a real
    photo) before decoration. No invented screens, no stock illustration.
11. **No three equal icon cards.** If three things are truly equal, a list
    reads better. If they are not, the layout should say which matters most.
12. **No badge pill above the H1, no centred everything.** Left aligned text
    reads as edited; a page of centred blocks reads as a template.

## Sources

- Wikipedia, Signs of AI writing (the copy half lives in content-engine/ai-tells.md):
  https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Adrian Krebs, design slop: https://adriankrebs.ch/blog/design-slop/
- Impeccable anti patterns: https://github.com/pbakaus/impeccable
- Utsubo, trust signals: https://www.utsubo.com/blog/built-with-ai-trust-signals-2026
- Anthropic frontend design skill: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines
  (accessibility, typography, color, branding, buttons, layout, motion)
- Apple, WWDC 2025 session 356: https://developer.apple.com/videos/play/wwdc2025/356
- Baymard, line length: https://baymard.com/blog/line-length-readability
