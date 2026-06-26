# Build vs Promises Audit

Date: 2026-06-26. Reconciles the original build plan and the schools and parents landing pages against what is actually built. No application files were changed to produce this. Keep this updated as gaps close.

## Headline

- The **database and seed content are the most finished part of the product.** When all seed files run, the `scripts` table holds **101 fully written scripts** (17 in `seed.sql` plus 84 across `seed-scripts/`). The "100+ scripts" claim is now backed by content in the seed.
- **The app does not use that content.** The member dashboard (`app/(dashboard)/dashboard/scripts/page.tsx`) renders a hardcoded array of 17 titles with no body text, and there is no individual script page (`/dashboard/scripts/[id]`). A paying member cannot actually read any script. This is the single biggest product and marketing gap, and it breaks non-negotiable 6 (scripts must come from the database).
- The **entire schools product is marketing only.** The pages promise 21 modules, teacher logins, a school dashboard, CPD, School DiGi, and Ofsted alignment. None of the educator, admin, or school app exists. Only Module 9 exists, as standalone HTML.
- **Several numbers contradict each other** across pages: script counts, guarantee length, social proof, stage names, and the funnel destination.

## Non-negotiables: status

| Non-negotiable | Status |
|---|---|
| Founder cap of 50 enforced in code | Met (`api/stripe/checkout/route.ts`) |
| DIGI_MODEL env var, default claude-fable-5, fallback chain | Met (`lib/config/digi.ts`) |
| social_media_law flag drives Stage 4 | Met (`lib/config/social-media-law.ts`, `lib/content/stages.ts`) |
| Every /join CTA routes to /starter-pack | Met on the TSX join page; the static index.html CTAs go to Mailchimp instead |
| Scripts live in the database, not hardcoded | BROKEN: dashboard reads a hardcoded 17-title array |
| No dashes in copy | Holds in new content |

## Promised but missing (priority order)

1. **Members cannot read scripts.** No `/dashboard/scripts/[id]`; dashboard list is hardcoded 17 titles, no bodies, no DB read. Highest priority. Fixing this makes the 101 seeded scripts real in-app and makes the "100+" promise true.
2. `/dashboard/settings` and `/api/stripe/portal` (account and billing management) are absent.
3. Tracker is a shell with no database writes or streak logic.
4. Schools: 21 module scheme of work does not exist (only Module 9). No educator or school dashboard, no school or module database tables, no School DiGi persona, no CPD or assembly deliverables, no SLT report generator.

## Built but not surfaced

- The 84 new seed scripts (fully written, invisible in the app).
- `wellbeing_checks`, `digi_questions`, `digi_conversations` tables (schema built, tracker not wired to them).
- `digi-squad` app pages and `ban-workarounds` page (exist, not linked from audited CTAs).

## Contradictions to resolve

1. Script count: free tier says 5 (index) vs 3 (starter-pack app); library says 17 (most pages) vs 100+ (starter-pack paywall). Seed has 101; app exposes 0 readable bodies.
2. Guarantee: 14-day vs 30-day across pages.
3. Social proof: 131 parents vs 2,400+ families.
4. Funnel: index.html parent CTAs go to a Mailchimp waitlist at £12.99; starter-pack and pathway sell via Stripe at £7.99.
5. Stage names: Stage 2 is "Builder" (code, pathway) vs "First Steps" (index, starter-pack); Stage 4 is "Shaper" (code) vs "Navigator" (index, starter-pack). One product, three name sets.
6. Schools page sells a product that does not exist yet. Either frame as pilot or waitlist, or build the educator shell before a school pays.

## Recommended sequence

1. Wire the dashboard scripts list to the database and build `/dashboard/scripts/[id]` (Say This, Not This, Why, Tonight). This is the highest value fix and unlocks all the script content.
2. Standardise the contradictory numbers and stage names across all pages.
3. Add `/dashboard/settings` plus the Stripe billing portal.
4. Decide the schools go-to-market: pilot framing now, or build the educator shell and module tables before selling.

Key files: `app/(dashboard)/dashboard/scripts/page.tsx` (the core gap), `supabase/seed-scripts/*.sql` (the unused scripts), `supabase/migrations/001_initial.sql` (no school or module tables), `app/(marketing)/schools/page.tsx` (marketing only), `lib/content/stages.ts` (canonical stage names).
