# The Guided Planet, the publishing engine and Issue 001

Justin, 13 October 2026: build the system that makes every future edition of
The Guided Planet, a monthly 12 page illustrated newspaper for children 7 to 12
and their families ("The good side of screens"), and ship Issue 001, the
Curiosity Edition, through it. Founder time per edition: two approvals.

Claimed: migration 377 (`377_the_guided_planet.sql`). Lane: content and
publishing. Nothing in the parent app, child app or schools app changes
behaviour; the only app surface added is an admin page behind the existing
admin gate.

## How it relates to what already exists

- **The Planet Post** (PR 1284, merged today) is the four page free printable
  lead magnet in Happy News style, drawn in React and printed from
  `app/print-free`. The Guided Planet is a different product: a monthly
  editorial paper, cream and ink editorial with childhood warmth, twelve pages,
  researched news with sources. It reuses the Planet Post's lessons (Chromium
  print to PDF, fonts embedded, every line vector, the issue as data) but not
  its Happy News look, which `brand/GDC_SOCIAL_VISUAL_SYSTEM.md` retired as a
  reference on 5 October.
- **Characters** come only from the approved cutouts and mood stills. The
  social visual system forbids regenerating a character, so Higgsfield makes
  environments, skies and props with no character in them, and the layout
  engine places the approved Bloop on top. Identity cannot drift because it is
  never generated.
- **The research gate** follows the research updater pattern: a model drafts
  candidates, a human approves, only then does anything print.
- **Email** stays in house on Resend unless Justin decides otherwise; Mailchimp
  is prepared as an export adapter because no Mailchimp account or code exists.

## Architecture (decided here, reasons in `publishing/ARCHITECTURE.md`)

- `publishing/` is a self contained Node module: content schema, design
  system, templates, renderer, validators, research scoring, Higgsfield
  recipes and budget, distribution package, the state machine, tests.
- Templates are HTML and CSS functions over the issue data, printed by
  Playwright Chromium. Fixed page boxes, not Paged.js flow: a newspaper page is
  designed, not poured, and a fixed box lets the validator prove nothing
  overflows.
- The issue content is a versioned JSON file in git. Workflow state, approvals
  and the audit trail live in Supabase (migration 377), with a file store for
  local runs and tests. Every approval records the content hash it approved, so
  a change after approval voids it.
- Publishing is idempotent: one release row per issue and channel, keyed.
- Nothing goes out without FINAL APPROVED recorded against the exact PDF hash.

## Build order

1. Audit and architecture doc.
2. Design system, world bible, character library manifest.
3. Content schema, editorial validators, research scoring.
4. Higgsfield recipes, prompt builder, budget ledger (no paid runs without
   Justin's yes).
5. Research and verify Issue 001, draft the twelve pages.
6. Render, validate, page previews, accessible edition.
7. Admin dashboard and API, migration 377 (written, not applied).
8. Monthly runner and the scheduled workflow.
9. Distribution package generator and adapters (dry run by default).
10. Issue 002 sample from content only, no layout work.
11. Operation, deployment and cost docs.

## Needs Justin

- Apply migration 377.
- A Higgsfield budget for Issue 001 artwork (balance seen today: 1,107
  credits on Plus). Nothing generated until he names a number.
- Mailchimp or Resend for the newspaper list.
- The two approvals for Issue 001.
