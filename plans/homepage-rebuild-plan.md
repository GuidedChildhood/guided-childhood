# Homepage Rebuild Plan — the conversion first front page

Source: Duncan Rogoff's Claude Code website masterclass (transcript reviewed 8 Aug 2026).
Scope: the marketing homepage at app/page.tsx ONLY. The app, dashboard, onboarding and
every other route stay untouched.

## Why rebuild

The current homepage is 2,930 lines and roughly 25 stacked sections. It says many
true things instead of one thing. The masterclass thesis is that a premium site is
paid for because it converts, and it converts because it says ONE thing, in the
buyer's own words, funnelled to ONE call to action. Ours already has that CTA rule
(every CTA routes to /starter-pack) but the page above it is a library, not a story.

## What we keep from the current site

1. The hero promise and the calm, warm butter and ink look. No visual rebrand.
2. Checker design tokens, Nunito plus IBM Plex Mono, chunky 16px radius buttons
   with the hard 0 5px 0 shadow. Non negotiable 3 stands.
3. The pathway framing: never allow or deny, always a calibrated pathway.
4. Real early family quotes (What early families say) and research foundations strip.
5. The stages section (the four stage model) in a tighter form.
6. PassportSection if it earns its place in the new spine, otherwise it moves to /passport.
7. Founder rate capped at 50, enforced in code, shown honestly.
8. GSAP only motion. Subtle fade ups and staggered reveals.

## What the video adds that we are missing

1. Audience language research BEFORE copy. Mine Mumsnet, Reddit (r/Parenting,
   r/ScreenTime, UK subs), review sites and our own inbound for the exact sentences
   parents use about phones, guilt, fights at bedtime, the ban debate. Copy is
   written in those words so a parent recognises herself in the first screen.
2. One message discipline. The whole page argues a single line. Working candidate:
   "The ban tells you what to take away. Nobody tells you what to build." Every
   section either advances that or gets cut.
3. A scroll spine. One continuous story down the page (the transformation from
   nightly phone fights to a child with a pathway), not 25 interchangeable blocks.
   Target 8 to 10 sections total.
4. Quiet premium copy. Short headlines. Three to five word captions. Specific
   claims (numbers, ages, module counts) instead of adjectives. No dashes ever.
5. A five asset media budget. Two short videos, three images, same light, same
   palette, generated via the Higgsfield MCP in the digi squad house style. Less
   is more. No stock, no generic AI renders.
6. Single CTA funnel. Every button on the page goes to /starter-pack. One
   secondary quiet link for schools. Nothing else competes.
7. Self test before done. Chrome DevTools mobile and desktop passes, tap every
   button, submit the form, screenshot each breakpoint. Already our rule, now a
   formal build stage.

## Build stages (each is one Claude Code session step)

Stage 0 — Claim. Push this plan on branch claude/website-front-page-rebuild-75pwww
and open the draft PR naming the homepage lane. Done in the same session as this file.

Stage 1 — Research. Two parallel agents:
  a. Audience language sweep (Mumsnet, Reddit, reviews, ban discourse). Output
     research/homepage-audience-language.md with verbatim quotes grouped by pain,
     hesitation, dream outcome.
  b. Current page audit. Score all ~25 sections: which carry the message, which
     repeat, which convert. Output plans/homepage-section-audit.md with keep,
     merge, cut verdicts.

Stage 2 — Message and spine. Lock the one line message, choose the scroll style
(calm fade up narrative, no gimmicks), and write the 8 to 10 section spine as a
markdown outline with draft copy pulled from the audience language file. Approve
with Justin before any code.

Stage 3 — References. Mobbin pull (Good Inside, GoHenry, Greenlight, Finch flows)
plus the frontend design skill loaded. Translate patterns into our tokens, never
another brand's look.

Stage 4 — Assets. Five assets max via Higgsfield MCP, digi squad style, one
lighting sentence chosen first (the video's trick: describe who is using it,
where, in what light, then build the palette and prompts from that sentence).

Stage 5 — Build. New page.tsx from the spine. Keep listed sections, port copy,
wire GSAP reveals, all CTAs to /starter-pack.

Stage 6 — Verify. DevTools mobile and desktop, tap and submit everything,
console clean, Lighthouse pass, screenshots in the PR. Then merge same day.

## Prompting pattern (from the masterclass, adapted)

Never one shot the page. Sequence per stage, in plan mode first:
1. Interview style kickoff: product in one line, who it is for and what they
   should feel, the one thing to remember, what asset tool is connected.
2. Research prompt to a second agent while the first works (audience language).
3. Skill loaded design pass (frontend design skill plus our design system rules).
4. Copy pass with the rule sheet: short headlines, specific beats, no restated
   headlines, no dashes anywhere ever.
5. Asset generation pass bound to the palette sentence.
6. Final rebuild pass to snap sections, assets and copy together, then self test.

## External resources named in the video

- Anthropic skills repo (frontend design skill lives here):
  https://github.com/anthropics/skills
- Component reference: https://21st.dev (translate into our tokens, do not import styles)
- Brand and testimonial scraping: Firecrawl MCP (https://docs.firecrawl.dev/mcp)
- Asset generation: Higgsfield MCP (already connected in our sessions)

## Decisions needed from Justin

1. Approve the one line message candidate or give the line himself.
2. Confirm the hero asset direction: real family photo territory or digi squad
   illustrated world (recommendation: illustrated, we own it and it is consistent).
3. Confirm PassportSection stays on the homepage or moves to /passport.
