# Week 2 Plan — Individual Script Pages + Settings + Polish

**Goal:** Complete the core dashboard experience — all 17 scripts readable, settings page live, tracker functional, weekly actions from DB.

---

## Deliverables checklist

### Scripts (priority 1)
- [ ] lib/content/scripts.ts — full content for all 17 scripts (sayThis, notThis, why, context, action)
- [ ] /dashboard/scripts/[id] — individual script page (protected, paywall for scripts 4-17)
- [ ] Script pages: Say This / Not This / Why It Works layout
- [ ] Ask DiGi deep-link from each script
- [ ] Prev/Next navigation on script pages

### Settings page
- [ ] /dashboard/settings — account page
- [ ] Show: name, email, subscription status, child's stage
- [ ] Billing portal link (Stripe customer portal)
- [ ] Sign out button

### Tracker
- [ ] /dashboard/tracker — weekly action tracker
- [ ] Mark action complete
- [ ] Streak display (streak_weeks from children table)
- [ ] 3 actions this week (hardcoded for now, from DB in Week 3)

### Database (Justin to do)
- [ ] Run Week 2 migration: create scripts table with id, title, stage_id, tag, context, say_this, not_this, why, action, law_flag, is_paid, sort_order
- [ ] Seed all 17 scripts from lib/content/scripts.ts data
- [ ] Add Stripe billing portal route /api/stripe/portal

### Polish
- [ ] DiGi: show previous conversation history on page load (load from DB)
- [ ] Dashboard: weekly actions link through to the script they reference
- [ ] Onboarding: redirect to /dashboard/scripts/1 on first visit instead of plain dashboard

---

## Build order

1. lib/content/scripts.ts (full content)
2. /dashboard/scripts/[id] page
3. /dashboard/settings page
4. /dashboard/tracker improvements
5. /api/stripe/portal route
6. DiGi conversation history on load
7. Commit + push

---

## Acceptance criteria

- [ ] All 17 script titles visible on /dashboard/scripts for paid users
- [ ] Individual script page loads for script IDs 1-3 without auth
- [ ] Scripts 4-17 redirect free users to /dashboard/upgrade
- [ ] Settings page shows correct subscription status
- [ ] Billing portal link works in Stripe test mode
- [ ] No dashes in any copy
- [ ] Mobile + desktop checked
