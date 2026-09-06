# Appendix A2: pricing, trial and cancellation (evidence)

Read only sweep of origin/main 97ef53a on 5 September 2026. Paths relative to repo root.

## What the code actually does

| Fact | Where | Value |
|---|---|---|
| Trial length | lib/access.ts:23 TRIAL_DAYS = 4; platform_config.trial_days seeded '4' in supabase/migrations/201_signup_charging.sql:105, read by lib/config/trial.ts:64-88 | 4 days |
| Stripe trial | app/api/stripe/checkout/route.ts:165-167,189: trial_period_days applied only when form field from is onboarding or choose | up to 4 days; 0 trial from /dashboard/upgrade |
| Card at trial start | checkout/route.ts:177 payment_method_collection: 'always' | Card always on the founder or standard door. The free door (app/api/plan/free/route.ts) never touches Stripe: no card |
| Trial enforced server side | middleware.ts:93-106 redirects /dashboard/* outside PAYWALL_OPEN_PREFIXES (lib/access.ts:345-351) to /dashboard/upgrade when hasFullAccess is false. Scripts RLS: trial sees starter_set only (migration 201:194-206). DiGi cap trial_digi_daily_limit 3 (app/api/digi/route.ts:362-365) | Yes |
| Trial end, card door | webhook writes trial_ends_at = now() and status active (app/api/stripe/webhook/route.ts:201-203) | First charge day 5 |
| Trial end, free door | hasFullAccess false, whole dashboard redirects to /dashboard/upgrade; founder card hidden when plan_choice is free (upgrade/page.tsx:128-131) | Locked, standard prices only |
| Prices | lib/stripe/index.ts:24-28: only env price IDs. No amount exists in code; every pound figure is copy | |
| Founder cap | lib/stripe/index.ts:30 FOUNDER_CAP = 50; getFounderCount() Stripe subscription search metadata tier founder, active or trialing (38-44); gate checkout/route.ts:100-105, fails open on Stripe error | 50, enforced |
| Cancel path | app/api/stripe/portal/route.ts (Stripe billing portal; portal_not_configured if not switched on in the dashboard); settings/page.tsx:239, buttons at 587 "Cancel and pay nothing" and 633 "Manage billing" | Exists |
| Pre charge reminder | app/api/email/cron/route.ts:260-285 founderPrechargeEmail once daysSince(trial_started_at) >= 2, only when plan_choice is founder; pushes app/api/cron/trial-pushes/route.ts | Card trials only |
| Renewal reminder (monthly or annual) | none found in lib/email, app/api/email, app/api/cron, app/api/stripe | None |

## Consistency table

| Surface | Trial wording | Card wording | Price wording | Matches code |
|---|---|---|---|---|
| Homepage app/page.tsx:305 | "Three questions. Two minutes. Free. No card required." | no card | | Yes |
| Homepage app/page.tsx:963-972 | "Four days. No card required." / "DiGi, with a daily limit" / "A starter set of scripts" | no card | Free | Yes |
| Homepage app/page.tsx:947-948 | | | "Founder Rate: first 50 members only. Lock in £7.99/month for life." | Yes |
| Homepage app/page.tsx:977-978 | | | "Annual OS £99 /year", "Save £57. Two months free." | Arithmetic wrong |
| Homepage app/page.tsx:1003-1004 | | | "£12.99 /month", "Cancel any time" | Yes |
| Homepage app/page.tsx:1106 | | "No card required" | "30 day money back on launch" | Not in code; Terms do not promise it |
| /join join/page.tsx:681-683 | | | "£7.99 / month" "Locked for life. Never increases." | Yes |
| /join join/page.tsx:723,742,746-750 | | | "£12.99 / month", "Save £57", "£99 / year", "£8.25 / month · Two months free" | £8.25 right; "Two months free" wrong |
| /join join/page.tsx:800 | | "No account needed. No card." | | Yes |
| /starter-pack page.tsx:564,589,656,1151 | "then free access to the platform. No card." / "No card. No commitment." | no card | | Yes |
| /starter-pack ResultScreen.tsx:355 | "Everything open for four days. No card needed to start." | no card | | Length yes; "Everything open" no |
| /pathway page.tsx:356-361 | | | "Founder rate · First 50 members", "£7.99 a month. For life." | Yes |
| /terms terms/page.tsx:40 | "new members get a 7 day free trial with everything unlocked." | "A card is collected at signup" | | No on all three counts |
| /terms terms/page.tsx:41-44 | | | "£7.99 a month … first 50 members. After that £12.99 a month or £99 a year." "renew automatically" "cancel any time … you simply move to the free tier." | Prices yes; "move to the free tier" no |
| /privacy privacy/page.tsx:43 | | "handled by Stripe. We never see or store your card number." | | Yes |
| TwoDoors.tsx:177-185 (founder door) | "Free for {freeDays} {dayWord}, then it starts" | card | "£7.99 a month", "One of only {cap} founder places" | Yes (dynamic) |
| TwoDoors.tsx:219-226 (sold out door, standard) | "£12.99 a month starts after your {freeDays} free days" | card | "£12.99 a month, or £99 a year" | Checkout yes; downstream copy no (contradiction 6) |
| FreeDoor.tsx:84-88 | "£0 for {days} days", "The same {trialDays} days, all of it open" | "No card, nothing taken" | "£12.99 a month or £99 a year after" | "all of it open" no |
| TrialCountdown.tsx:180-181 | "DiGi has a daily limit and a starter set of scripts for these {trialDays} days, then £7.99 a month starts" | | | Yes |
| TrialCountdown.tsx:107 (ended) | "Your {trialDays} days of full access are over" | | | Contradicts its own line 180 |
| upgrade/page.tsx:175 | "{n} free days left. Everything is open until then." | | | "Everything is open" no |
| upgrade/page.tsx:256-284 | none; founder form posts with no from | card, charged immediately, no trial | "£7.99 / month", "{remaining} of {FOUNDER_CAP} left" | Behaviour matches code comment; no copy says charge is immediate |
| upgrade/page.tsx:303-305 | | | "Cancel in a tap from Settings." "First 30 days: … we refund every penny, no questions asked." | Cancel yes; refund not in Terms |
| PlanChooser.tsx:13-14,51 | | no trial | "£99 / year Works out at £8.25 a month", "£12.99 / month", "Save £57" | £57 rounded from £56.88 |
| settings/page.tsx:575,595 | "Your founder rate of £7.99 a month starts on {date}. Cancel before then and you pay nothing." / "No card was taken … nothing here to cancel." | both stated | £7.99 | Yes for founder; wrong amount for the standard card trial |
| dashboard pages 1674-1675, pathway 630-631, lessons/[id] 131 | "One lesson in every stage is free" | | "Unlock everything for £7.99 / month" | Prices yes |
| lib/email/templates.ts:244,478-480,912,1450 | precharge: "Your free days end on {date} … £7.99 a month, on the card you added" | card | "£7.99 a month for life", "50 places", "enforced in the code" | Yes |
| templates.ts:247,499,1424,1456,1488,1563 | "the free tier is not going anywhere" / "you are on the free tier now" / "The free tier stops at three questions a day" | | | No: after the trial the dashboard locks |
| templates.ts:434 trialEndingEmail | "No card was taken, so nothing happens automatically" | no card | | Yes (no card trials only) |
| app/api/cron/trial-pushes/route.ts:95-104 | days left 3: "Two days of full access left"; 2: "Full access ends tomorrow. After tomorrow the free tier returns"; 1: "{50-count} of 50 seats left" | | | No: off by one day, "full access" during a limited trial, "free tier returns" when the app locks |
| emails/04-founder-rate-day-7.html:5,16 | "the free tier stays free. No tricks." | | "£7.99 a month for life, first 50 families only" | Prices yes; free tier no; day 7 send after a 4 day trial |
| public/index.html:800-849,896-897 (served at /index.html) | "Free forever" Starter Pack tier; "Join the waitlist"; "Launching soon" | "No card · Cancel any time" | "£12.99/month", "£99/year Save £57. Two months free.", "Your 131 existing subscribers", school "From £49 per year" (1016) | Stale pre launch page |
| public/starter-pack.html:661,733-743,740,848, public/scripts.html:241,483, public/device-checklist.html:562 | | | "Founder Rate £7.99/month", "Full refund. No questions asked."; buttons link to buy.stripe.com Payment Links | Bypass: Payment Links skip the founder cap, the trial and the webhook metadata the paywall depends on |
| public/pathway.html, public/schools.html | | | "50 founder spots", "48-hour advance access" | Stale |
| schools/ | invoice only (schools/app/pricing/InvoiceForm.tsx:105) | | £495 to £1,995 (schools/lib/pricing.ts:19-22) | Yes |
| public/financial-forecast.html:462, pitch-deck.html:1070,1079, pitch-deck-print.html:553,562, executive-summary.html:275-283 | | | "Saves £57. Two months free.", schools "£299/year", "£499/year", "£999+/year" | Annual note wrong; school prices contradict schools/lib/pricing.ts |

## Price arithmetic

- £12.99 x 12 = £155.88. £155.88 minus £99 = £56.88. "Save £57" is a 12p round up.
- £99 / 12 = £8.25: correct.
- "Two months free": wrong. £99 buys 12 months for the price of 7.62 monthly months, so the saving is 4.38 months, not two.
- THE-STORY.md:268-269 MRR arithmetic: correct.
- £9.99 appears only in public/five-questions.html:314 (Digital Health Check single report). £4.99 appears nowhere.

## Source of truth

Trial length: yes, platform_config.trial_days with TRIAL_DAYS fallback, and every screen with a day count reads it. Prices: no, there is no amount in code, only env price IDs, so every pound string is free text with no check against Stripe.

Hardcoded trial length in copy or logic: app/page.tsx:964,966; starter-pack/ResultScreen.tsx:355; terms/page.tsx:40 ("7 day"); app/api/cron/trial-pushes/route.ts:50 (4 * 86400000) and :31; app/api/email/cron/route.ts:260 (PRECHARGE_AFTER_DAYS = 2); migration 201:69.

Files with a pound price string (app and emails): app/page.tsx:948,977,978,1003,1004; join/page.tsx:681,723,742,746,750; terms/page.tsx:41; pathway/page.tsx:359; upgrade/page.tsx:256,284; settings/page.tsx:575; dashboard/page.tsx:1675; dashboard/pathway/page.tsx:631; lessons/[id]/page.tsx:131; app/ref-buttons/page.tsx:24; TwoDoors.tsx:177,180,185,219,220,226; FreeDoor.tsx:88; TrialCountdown.tsx:111,140,141,180,181; FounderBadge.tsx:121,122; PlanChooser.tsx:13,14,51; lib/email/templates.ts:244,478,479,912,1450; emails/04-founder-rate-day-7.html:5,16.

Webhook mapping lib/stripe/subscription-status.ts:43-47: active or trialing to active, past_due to past_due, else cancelled. past_due keeps access (lib/access.ts:96).

## Founder cap of 50

Code: FOUNDER_CAP = 50, Stripe search count, gate in checkout (fails open on Stripe error), public counter app/api/founder-spots/route.ts. Two other counters use a different source (profiles table, is_founder and subscription_status active) and one a literal 50: app/api/email/cron/route.ts:171-178 and app/api/cron/trial-pushes/route.ts:60-66. Copy: 30 mentions, all say 50. "Enforced in the code" is true for /api/stripe/checkout only; the legacy buy.stripe.com Payment Links in public/ are not gated.

## Cancellation, renewal, refunds

In app cancel: yes, Stripe billing portal, subject to the portal being enabled in the Stripe dashboard. Pre renewal reminder: only the day 3 founder pre charge email and three trial pushes. No reminder before monthly or annual renewals.

Terms, verbatim (terms/page.tsx:40-44,49):
- "Free trial: new members get a 7 day free trial with everything unlocked. A card is collected at signup and your plan begins when the trial ends unless you cancel before then."
- "Plans: the Founder rate is £7.99 a month, held for life while your subscription stays active, and limited to the first 50 members. After that, membership is £12.99 a month or £99 a year."
- "Billing: payments are taken by Stripe and renew automatically each period until you cancel."
- "Cancelling: you can cancel any time from your account. You keep access until the end of the period you have paid for, and we do not lock you out afterwards, you simply move to the free tier."
- "Refunds: if something has gone wrong, email us and we will always try to put it right fairly."

## Legal pages

- Terms: "Last updated 15 July 2026". Entity named only as "Guided Childhood" (line 25). No company number, no registered address. Contact hello@guidedchildhood.com. Law: England and Wales. Consent checkbox at Stripe checkout behind STRIPE_TOS_CONSENT (checkout/route.ts:183-185), default off.
- Privacy: "Last updated 8 August 2026". "Guided Childhood is the data controller" (line 34). Processors: Supabase, Vercel, Stripe, Resend, Anthropic (79-82). Payment records six years (87). No company number or address.
- Homepage footer (app/page.tsx:1143-1145,1193): "© 2026 Guided Childhood · Justin Phillips" plus the postal address from lib/content/contact.ts:52. That address is not on the Terms or Privacy pages.
- The 15 July Terms predate the four day decision: plans/decisions.md:474-476 (10 July) 14 day trial; :739 (16 July) 7 day trial; :5675 (8 August) "The trial was already four days". The Terms text was never revised.

## docs/01 and docs/08

docs/ does not exist on origin/main. CLAUDE.md:24,29 still routes payments to docs/01 and docs/08. The only copy is inside guided-childhood-build.zip (June 2026): docs/01-architecture.md:125-133 lists the three parent prices plus school licences at £299 and £499; docs/06-starter-pack-funnel.md:28-30 describes a permanent free tier. There is no docs/08 anywhere. The live intent document is plans/week-of-2026-08-14-signup-charging-plan.md and the code matches it.

## Concrete contradictions

1. Trial length: Terms "7 day" vs four days everywhere else and in code.
2. Card collection: Terms "A card is collected at signup" vs the free door taking none.
3. What the trial unlocks: "everything unlocked", "Everything open", "all of it open", "full access" vs a starter set of scripts and 3 DiGi messages a day.
4. What happens after: Terms "you simply move to the free tier", emails "the free tier stays free", pushes "the free tier returns" vs the whole dashboard locking to /dashboard/upgrade.
5. Annual saving: "Two months free" vs 4.38 months; "Save £57" vs £56.88.
6. Standard tier card trial labelled founder: webhook writes plan_choice founder for every subscription checkout (webhook/route.ts:156-163), so settings, TrialCountdown and the precharge email tell a £12.99 family their "founder rate of £7.99" starts.
7. Founder from the upgrade page has no free days and no copy says the charge is immediate.
8. Push timing off by one day ("Two days of full access left" at daysLeft 3).
9. Refund promise: homepage and upgrade page promise a 30 day no questions refund; Terms only "try to put it right fairly".
10. Founder cap sources disagree (Stripe vs profiles table, literal 50); Payment Links bypass the cap.
11. Stale public pages (waitlist, launching soon, free forever, 131 subscribers, school from £49, £299/£499/£999 school licences).
12. CLAUDE.md routes to docs/01 and docs/08 which are not on main.

## Consistent and verified

Four day trial across code and every dynamic screen; no card on the free door and card on the paid door stated correctly in settings and TrialCountdown; trial granted once server side and never restarted; prices £7.99, £12.99, £99, £8.25 identical everywhere; founder cap 50 everywhere and enforced at checkout; cancel path exists; day 3 pre charge email transactional and accurate; past_due keeps access; schools invoice only with one price module; privacy statement on Stripe matches code.
