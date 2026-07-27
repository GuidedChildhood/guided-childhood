# Pre live checklist

Written 2026-07-17. Work top to bottom. The items marked BLOCKER must be true
before the app is pointed at the main domain. Everything else is check and fix.

## 1. Domains and DNS (BLOCKER)
- [ ] Point `guidedchildhood.com` and `www.guidedchildhood.com` at the app project in Vercel.
- [ ] Leave `wellbeing.`, `tools.` and `evidence.` subdomains exactly as they are. Do not touch their DNS. The report at `wellbeing.guidedchildhood.com/signup` keeps working because it is a separate product on a separate host.
- [ ] Confirm `www.guidedchildhood.com/digitalwellbeing` serves and its buttons now go to `wellbeing.guidedchildhood.com/signup` (the report), not the platform. (Done in code, verify live.)
- [ ] Redirect map for legacy paths if any should live elsewhere: `/five-questions`, `/evidence`, `/investor`, `/investor-deck`. These now exist as app pages, so confirm the app versions are the ones you want, or add redirects in `next.config.ts`.
- [ ] `/starter-pack` on the app is the platform funnel. Confirm it should replace the old one, or the old one moves to a new path.

## 2. Environment variables (BLOCKER)
- [ ] `NEXT_PUBLIC_APP_URL` set to the final main domain. This builds every email link, push deep link and cron callback. Wrong value breaks all of them.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and the anon key set.
- [ ] `SUPABASE_SERVICE_KEY` (and or `SUPABASE_SERVICE_ROLE_KEY`) set. The crons and admin reads use it.
- [ ] `CRON_SECRET` set. Every cron rejects calls without it.
- [ ] `RESEND_API_KEY` set (else the email cron skips silently).
- [ ] Stripe keys set: secret key, publishable key, webhook signing secret.
- [ ] Web push `VAPID` public and private keys set (device timer, school reminders, pings).
- [ ] `FOUNDER_NOTIFY_EMAIL` set to Justin (gates the founder insights board and the product pulse).
- [ ] `DIGI_MODEL` set or defaulting to claude-fable-5. Never hardcoded.

## 3. Database (BLOCKER)
- [ ] Every migration applied to the production database, in order. Spot check the recent ones: 067 (child buddy and accent, needed for Make it mine), the school alerts migration, digi brain and wisdom tables.
- [ ] The seed content is in prod: scripts, lessons, ai_lessons, daily_moments, printables, device_guides, expert_knowledge.
- [ ] RLS policies on: a signed in parent can only read their own family, the kid link token reads only its child.

## 4. Payments (BLOCKER)
- [ ] Stripe webhook endpoint live and pointed at the main domain, signing secret matching.
- [ ] Founder rate: £7.99, cap of 50, enforced in code. Confirm the live counter reads the real count.
- [ ] Annual is the default at checkout, monthly is the visible downgrade.
- [ ] The 14 day trial flow works end to end: sign up, trial, card, active.

## 5. Email (Resend)
- [ ] Sending domain verified in Resend (SPF, DKIM, DMARC) so mail does not land in spam.
- [ ] Send a test of each lifecycle email and the new service drip. Links point at the main domain.
- [ ] Unsubscribe works and is honoured (email_opt_out).

## 6. Crons (Vercel)
- [ ] All schedules present in vercel.json and enabled: device-time (every minute), push/cron, push/reengage, school/remind, school/morning, email/cron, cron/digi-insights, cron/digi-wisdom, cron/digi-quality, cron/weekly-review.
- [ ] Each authorises with CRON_SECRET. Trigger one manually and confirm a 200, not a 401.

## 7. Auth and security
- [ ] Middleware gates /dashboard, /educator, /admin, /onboarding. No session goes to /login. (Verified in code.)
- [ ] The kid link (`/k/{token}`) opens the child app only, sets no session, exposes no parent data. (Verified.)
- [ ] Optional: a reset child link button so a leaked share link can be revoked.
- [ ] Privacy policy and terms pages live. Health check disclaimer present (not clinical advice, see GP or CAMHS).

## 8. Child app
- [ ] The child link and QR open the child app on a fresh device.
- [ ] Make it mine (buddy and colour) is visible and saves. Needs PR 320 merged.
- [ ] DiGi the star renders, not a broken image. Needs PR 320 merged (the next/image SVG fix).
- [ ] A quest ticks, a star lands, screen time spends, the timer ends and the parent gets the push.

## 9. Mobile and console
- [ ] Home, quests, pathway, lessons, school, progress all reachable on a phone.
- [ ] Lessons reachable on mobile (the DiGi lesson nudge plus the Home tile).
- [ ] No console errors on the main flows. Layout checked in Chrome DevTools at phone and desktop widths.

## 10. Open pull requests to land first
- [ ] PR 320: the visible Make it mine button, the DiGi star fix, the report CTA fix, and this checklist. Merge before go live.
- [ ] Any open Mobbin marketing or child app polish PRs the team wants in the launch.

## 11. Day one watching
- [ ] Founder insights board loads (product pulse, child app adoption funnel).
- [ ] Error monitoring on (Vercel logs at least).
- [ ] A real end to end sign up on the live domain, by a person who is not already logged in, to catch anything the team cannot see from inside their own session.
