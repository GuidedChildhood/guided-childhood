# Week 5 Plan — Scripts, DiGi Polish, Stripe

Date: 2026-06-24
Branch: platform-week-5

## What week 4 delivered
- Deployment config (app-vercel.json, separate Vercel project)
- Supabase schema + seed (scripts 1-3 fully seeded, foundation + builder content in seed.sql)
- All API routes written (digi, stripe, tracker, founder-spots)
- Dashboard home, scripts list, DiGi page shells — all built
- Auth flow complete (signup, login, forgot-password, callback, middleware)

## What is missing (build order)

### Priority 1 — Scripts individual page (build today)
`/dashboard/scripts/[id]` does not exist. The scripts list page links to it. 
Format: Good Inside numbered cards — 1 Say this / 2 Not this / 3 Why it works / 4 Tonight.
Data comes from Supabase `scripts` table. Gated: free users can only open scripts 1, 2, 3.

### Priority 2 — Complete seed data (scripts 4–17)
Seed.sql has foundation + builder fully. Need explorer (11-13), navigator (13-15), independent (16+) content.
Write 10 remaining scripts with full say_this / not_this / why_it_works / tonight fields.

### Priority 3 — DiGi conversation history
On page load, fetch last 10 messages from digi_conversations table and display them.
Currently the chat starts blank every session — bad experience.

### Priority 4 — Tracker full UI
The tracker page is a shell. Build: weekly check-in form (5 questions, 1-5 scale), 
score saved to wellbeing_checks table, trend line showing last 8 weeks.

### Priority 5 — Settings page
`/dashboard/settings` — change name, child name/age, cancel subscription, billing portal link.

## Day plan

Day 1 (today): Script detail page `/dashboard/scripts/[id]` + scripts 4-6 seed content
Day 2: Scripts 7-17 seed content — all 17 fully seeded
Day 3: DiGi conversation history + prompt suggestions by stage
Day 4: Tracker full UI — weekly check-in + trend view
Day 5: Settings page + mobile/desktop console check

## Non-negotiables
1. No dashes in copy — ever
2. DIGI_MODEL via env var only
3. Design tokens only — no hardcoded hex outside globals.css
4. Mobile checked at 375px before declaring done
5. Scripts content: Justin's voice — warm, plain, direct
