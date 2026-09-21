# Guided Childhood — Claude Code Instructions

Read THE-STORY.md at the start of every session. It is the whole picture:
philosophy, product map, business model, what exists and where it lives.
(It replaces the old guided-childhood-build/README.md pointer, which named a
directory that no longer exists in this repo.)
Re-read /plans/decisions.md after any compaction. It is an index plus the last
couple of days in full. The full text of every past decision is in the monthly
archives at /plans/decisions-archive/. Never load an archive whole: each one
opens with an index giving the line number of every entry, so one decision is a
`sed -n` away and a search across all of them is one `grep`.

## CONTEXT ROUTING — load only what the task needs

- ANY research, marketing, content, social, email copy or story task
  → THE-STORY.md FIRST, before the skill runs. Every piece must relate to
  what the product actually does: the one line story, the perfect customer,
  the star quest leading the pieces, the stage check hook, every claim with
  a proof path in the product. Research agents inherit this too: brief them
  with the relevant section of THE-STORY.md so findings land on our thesis
  rather than beside it.

- Building any UI            → docs/05 + docs/07 (design system, motion rules) + .claude/skills/frontend-design (Anthropic's skill; our tokens always win where they conflict)
- Verifying any UI           → .claude/skills/webapp-testing (Playwright screenshots, tap every button) alongside the Chrome DevTools check
- Anything DiGi              → digi/01-philosophy.md (DIGI_MODEL env var, default claude-fable-5-1)
- Characters / lessons       → digi-squad/README.md (DiGi plus the Planet Friends: Pebble, Bloop, Orbit, Nova, Cosmo)
- Database work              → docs/02 only
- Payments / paywall         → docs/01 (Stripe section) + docs/08 (save flow)
- Emails or any copy         → research/01 voice rules; no dashes ever in copy
- Any social / Drive content  → apply .claude/skills/content-engine/hidden-thread.md (the mission filter + 1 in 10 rule) AND .claude/skills/content-engine/linkedin-engagement.md (hooks, dwell time, real photos, no body links) before drafting
- Family Instagram / Facebook → .claude/skills/family-social + content/brand-story/ (the family voice, NOT Justin's; four anchor days; every service claim needs a proof path)
- School features            → schools/01 + docs/09
- Retention features         → docs/08
- Marketing pages            → docs/06 + docs/09 (delivery model)
- Ban resilience             → docs/11 (social_media_law config flag)
- UX flow / onboarding       → design-refs/good-inside-notes.md (copy structure, not brand)

## CONTEXT BUDGET — what a session pays before it starts

Every session reads CLAUDE.md, THE-STORY.md and the decisions index before it
does any work, and carries them on every turn after that. On 16 September 2026
the decisions log had reached 1 MB, roughly 250,000 tokens, so a session spent a
quarter of a million tokens before the first question. That is what was reaching
the daily model limit by the afternoon.

- `npm run context-guard` prints what a session start costs and fails if any of
  those files is over budget. Run it before pushing a change that touches them.
- `npm run roll-decisions` moves decisions older than two days into the month
  archive and rebuilds the index. Nothing is deleted. Run it at session end.
- A decision entry is under a dozen lines: what was decided, the one reason
  worth knowing, and the PR number where the detail lives. The reasoning belongs
  in the code comments and the pull request body, which is what the reporting
  rule below has always said.
- Detail that only some tasks need belongs in a skill or a doc that loads on
  demand, never in CLAUDE.md.
- Reserve the deep model for work that needs it. A copy change, a layout pass or
  a guard script is Sonnet work, and `/model sonnet` draws on a different limit.
  That is a Claude Code setting for the session, nothing to do with DIGI_MODEL,
  which stays claude-fable-5-1 for DiGi.

## REVIEW STANDARD

Before pushing any change, check the diff against review.md at the repo root
(must fix / should fix / okay to ship). The PR review routine reviews every
open PR against the same file each weekday morning, and the weekly UX
walkthrough judges the live product against its customer test. If the quality
bar changes, change review.md, not the routines.

## PLANS

Write every plan to /plans/<week>-plan.md INSIDE this repo before building.
Re-read it after any compaction. Never rely on plan mode's disposable global file.

## MULTI-SESSION SYNC — read before claiming any work

Several Claude sessions can run against this repo on the same day. In-flight
work is invisible until it merges, so these rules stop two sessions building
the same thing (it happened: PR 55 and PR 56 built the same Phase 2 twice on
3 July 2026).

1. **Check before claiming.** At session start: `git fetch origin main`, read
   the roadmap and decisions.md FROM origin/main (the clone snapshot may be
   hours stale), then list OPEN pull requests and branches pushed in the last
   7 days. Any roadmap box or feature named by an open PR is claimed. Skip it
   and take the next free box.
2. **Claim early and visibly.** The moment you pick your work, push the branch
   and open the draft PR immediately, naming the claimed roadmap boxes in the
   title. The draft PR is the lock other sessions check. Fill in the real diff
   later.
3. **Migration numbers are claimed the same way.** Before creating a migration,
   check the highest number on origin/main AND in every open PR. Name your
   number in the draft PR at claim time.
4. **One lane per concurrent session.** If sessions run in parallel, each gets
   an explicit lane (platform code, curriculum content, marketing, schools).
   An open ended prompt like "continue the build" must only ever be live in
   one session at a time.
5. **Merge or close the same day.** Long lived branches are the duplication
   window. Small PRs, fast merges. decisions.md is append only; on conflict
   keep both entries.

## NON-NEGOTIABLES

1. Never allow/deny. DiGi always returns a calibrated pathway.
2. DIGI_MODEL is a config value (env var). Default: claude-fable-5-1. Never hardcoded.
3. Checker design tokens only. No Inter. No purple gradients. No generic AI patterns.
4. No dashes in any copy — ever. Not in headings, not in buttons, not in body text.
5. Mobile and desktop checked in Chrome DevTools before declaring anything done.
6. Scripts live in the database (scripts table), not hardcoded in the app.
7. social_media_law flag drives Stage 4 content without a rewrite (docs/11).
8. Justin's voice throughout. Warm, plain, direct. No AI-isms.
9. Every CTA on /join routes to /starter-pack.
10. Founder rate capped at 50 — enforced in code, not just in copy.

## REPORTING BACK TO JUSTIN

Summarise. Do not narrate every detail.

Justin, 4 August 2026: "please summarise in general as a rule, as no need to go
into so much detail as takes too long to read, as long as vital info there, it
worked and why, and let me know what you need from me."

So every update is three things and stops:

1. What changed, in a line each.
2. Whether it worked, and the one reason worth knowing.
3. What is needed from him, named plainly.

Depth on request, never by default. A long report on a small change is not
thoroughness, it is a thing he has to read before he can do anything. The
reasoning still belongs in the code comments and the pull request body, where it
is there when someone goes looking, rather than in the message he opens on his
phone.

## DESIGN SYSTEM

Fonts: Nunito (700-900 display, 400-600 body) + IBM Plex Mono (labels, eyebrows)
Colours: see README.md colour token block
Buttons: border-radius 16px, box-shadow 0 5px 0 <shadow-colour>, chunky
Motion: GSAP only — subtle fade-ups, staggered reveals, no Three.js

MOBBIN FIRST: before building or redesigning any UI, pull real reference
screens from the Mobbin MCP (search_screens / search_flows) and design against
proven patterns, then translate them into our own butter and ink and Nunito,
never a copy of another brand. If the Mobbin tools are not in the session, say
so and proceed on the references already gathered plus best practice. Reference
apps we lean on: GoHenry, Greenlight, Finch (star and reward loops), and Good
Inside (the simplicity, big text, swipe to discard, DiGi comes up first).

## WEEKLY RHYTHM

Monday: new session → read CLAUDE.md + decisions.md → write week-N-plan.md → approve → build
Daily: check /plans/, update decisions.md with anything decided
Session end: `npm run roll-decisions` so the log stays an index, not a 1 MB file
Friday: layout + console check → `npm run context-guard` → push → Vercel deploy
