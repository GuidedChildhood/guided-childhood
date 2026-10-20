# Week of 19 October 2026: the Meta Muse connector

Justin, 20 October 2026: connect Guided Childhood to Meta's Muse agent, and
"happy for guided to appear" inside it. Muse's connector form (platform.muse.ai)
offers two connection types, Raw API or Existing MCP, with an API URL, an
optional OpenAPI spec, a documentation URL and an access requirements box.

## The decision

**Raw API with an OpenAPI spec.** No new packages, plain Next.js route handlers
like every other route, and the form's default. An MCP wrapper over the same two
functions is a later, separate step if Claude or ChatGPT connectors are wanted.

**Revenue is the funnel, not Muse.** Meta publishes no revenue share. Every
answer ends at the stage check, `/starter-pack?src=muse`, and migration 379
already counts a `?src=` code per channel, so the founder page shows Muse
checks the day it ships. Payments in the form: None.

## What it does

Two operations, parents only (Muse itself is 18 plus), nothing about a child
stored anywhere.

1. `POST /api/muse/ask` (operationId `askDigi`). A parent's question and an
   optional child age. DiGi answers with the same static rails as the app
   (`STATIC_SYSTEM`: never allow or deny, the calibrated pathway, the words to
   say), no family context because there is none, no app links. Crisis and
   safeguarding language gets the deterministic opener first, exactly as in
   the app. Dashes stripped. Ends with the stage check line.
2. `GET /api/muse/scripts?q=` (operationId `findScripts`). Up to three matching
   scripts from the scripts table, FREE scripts only, each with its public
   `/say/<uuid>` link. Never a paid script's words, so the API is not a ladder
   down the paid library (the same reason /say uses the uuid).

Plus:

- `GET /api/muse/openapi.json`, the spec for the form.
- `/connectors/muse`, a plain documentation page for the form's docs field.
- Privacy policy: a short "If you use us through Muse" paragraph (what Muse
  sends, what we keep, which is a count and nothing else).

## Cost guard

DiGi calls cost money and Muse traffic is anonymous. `MUSE_DAILY_CAP` (env,
default 300) model answers a day across everyone, counted in a new table. Over
the cap, `askDigi` answers from the matched free scripts with no model call, so
it degrades rather than fails. `MUSE_CONNECTOR_KEY` (env, optional): when set,
requests need it in `x-api-key`, for when Muse supplies an auth setting.

## Migration 383 (claimed, highest on main and in open PRs is 382)

- `muse_calls`: id, kind (`ask`, `ask_fallback`, `scripts`, `signpost`),
  created_at. No question text, no age, no IP. Service role only.
- `video_links` row `muse`, channel `other`, so the stage check counts it.

## Done when

- Both operations answer locally against the real rails, the crisis path
  returns the opener, the cap falls back to scripts.
- The spec validates and matches the routes.
- `npm run ai-tells` passes on every new piece of copy; the docs page checked
  at mobile and desktop.
- `integrations/muse/submission.md` holds every field for both form pages.
- Justin submits the form after deploy (it is his account and his submit).
