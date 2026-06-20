# Week 1 Plan — w/c 2026-06-16

## Done

- [x] `starter-pack.html` — quiz + two-column result + sticky sidebar (tonight's action, agreement, warning signs, Ask DiGi, founder rate)
- [x] `scripts.html` — full conversation decision tree, 4 issues × 3 age bands, expert scripts, print contract
- [x] `vercel.json` — `/scripts` route, `/join` → Mailchimp redirect
- [x] PR #11 — clean deploy branch, no conflicts, ready to merge

## Tomorrow — Platform Build

Platform code is in PR #9 (branch `feature/platform-build`).
Steps when ready:

1. Merge PR #11 to main (starter pack goes live)
2. Rebase platform branch onto updated main (resolve vercel.json conflict — small)
3. Set up Supabase project:
   - Tables: `users`, `sessions`, `scripts` (scripts live in DB per NON-NEGOTIABLE #6)
   - Add env vars to Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
4. Set up Stripe:
   - Product: Guided Childhood Founder Rate £7.99/mo
   - Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - Enforce 50-founder cap in code (NON-NEGOTIABLE #10)
5. DiGi chat:
   - Wire up DIGI_MODEL env var (default: claude-fable-5)
   - Replace Mailchimp link in sidebar with `/chat` once live
   - Methodology: Dr Becky Kennedy, Ross Greene, Dan Siegel, Sue Atkins, Catherine Knibbs
6. Dashboard: session history, streak, next stage unlock

## Reminders

- Founder rate hard cap: 50. Enforce server-side.
- DIGI_MODEL never hardcoded — env var only.
- Every CTA on /join routes to /starter-pack.
- No dashes in copy. Ever.
- scripts table in Supabase — pull from DB, not hardcoded.
