# Provenance and scope

Audit run 5 September 2026 (evening, UTC), read only. Nothing in the product
was changed, committed, pushed or deployed by this audit.

## What was inspected

| Thing | Value |
| --- | --- |
| Repository | GuidedChildhood/guided-childhood |
| Audit baseline (origin/main) | 97ef53abd474ad2b2b31bbd1a006026051475e57, "Merge pull request #966" |
| Working branch in this session | claude/claude-code-ai-employee-p37w5v at 6da757bc4f2f5a987c0f82d5317856f559d17d65 (PR 968, ahead of main by one commit, UI finish only) |
| Working tree before audit | clean |
| Highest migration on main | 253_planet_codes_and_mission_scripts.sql |
| Highest migration claimed in an open PR | 254 (PR 967, Planet Friends slice 2c) |
| Open pull requests | 967 (Planet Friends slice 2c, migration 254), 968 (parent app happy news finish, ready for review, Vercel preview build FAILING, see 01-report.md) |
| Deployed revision (production) | BLOCKED. www.guidedchildhood.com, schools.guidedchildhood.com, evidence.guidedchildhood.com and wellbeing.guidedchildhood.com are not reachable from this container (egress blocked, HTTP 000). Findings are against origin/main, which is what Vercel deploys for the guided-childhood project per THE-STORY.md section 8. Assume production equals main unless Justin knows of an unmerged hotfix. |
| Vercel projects (from the Vercel bot on PR 968) | guided-childhood (production parent app), guided-childhood-app (duplicate, scheduled for retirement per THE-STORY.md section 11), guided-childhood-schools (root directory schools/) |

## Safe checks run (working tree, no network, no database)

| Check | Result |
| --- | --- |
| npx tsc --noEmit (root) | 0 errors |
| npm run wiring | 0 new, 19 known and still open (baseline, three duplicate migration numbers among them: 106, 109, 147) |
| npm run checkin-guard | all passed (desktop renders, no console errors) |
| npm run build (Turbopack production build) | FAILS on the PR 968 head, see finding P0-7. Not run against main (main deploys are green per Vercel history). |

## Method

Six parallel read only sweeps of the origin/main snapshot (claims, pricing,
stars, DiGi, privacy and security, curriculum and UX), each returning
path:line evidence. The external PDF (Deep research audit and improvement
roadmap, 4 September 2026) was treated as a list of hypotheses. Every hypothesis
is in the ledger (ledger.csv) with one of six statuses.

## Not inspected, and why

- Live production pages and the real database: no network route from here, and
  the brief forbids production reads of child records anyway.
- Stripe dashboard settings (trial days on the Price, card collection): only
  what the code sends is visible.
- The evidence microsite content if it is deployed from outside this repo.
- Curriculum lessons stored only in the database and not in a migration.
