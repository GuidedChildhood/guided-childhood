# Guides: the public search pages

**Asked, 2 November 2026.** Justin: "Yes on guides", after the
recommendation in `plans/2026-11-02-clicks-guides-community.md` (PR 1394).
This is the first slice of the Phase 4 roadmap box "Public SEO pages generated
from device guides and script problems".

## The line on what is free

Scripts are paid (Justin, 11 August 2026; migration 187 removed anon access).
So a guide gives the approach away and names the words without showing them:

- Free on the page: the problem in parents' words, why it keeps happening,
  what works, how to start earlier, and the source behind it. This is the
  same register as `/five-questions`.
- Named, not shown: the real scripts in the product that cover it, as locked
  cards ("In the app"), so the page proves the product exists without giving
  the paid words away. Titles come from `lib/content/device-issues.ts`, which
  already names them as each problem's proof.
- Every guide ends at the stage check, with the hook word for word.

## The build

- `lib/content/guides.ts`: one entry per guide, each built on a
  `DEVICE_ISSUES` key so the mechanism, response and source are written once
  and the guide adds only its question, intro and ages.
- `/guides` index and `/guides/[slug]`, statically generated, in the
  marketing group.
- Sitemap lists the index and every guide; the PostHog allowlist gains
  `/guides`; `npm run seo` counts guide URLs in its "never shown" check.
- Homepage: one quiet strip of three guides near the foot, under the last
  stage check button.
- Article structured data on each guide.

## The first three (from research/homepage-audience-language.md)

1. The nightly screen time argument (issue `negotiation`).
2. When should my child get a phone (issue `first_phone`).
3. Roblox and Robux spending (issue `in_game_spending`).

After that the gum report decides the order.
