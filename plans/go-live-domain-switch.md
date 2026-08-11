# Go live on the domain: the switch, step by step

**Justin, 11 August 2026:** *"let's go live with domain so let me know what we
need to do, how to do it, including stripe end point etc, emails, anything that
needs changing to work on live domain."*

Everything below was read out of the code today, not remembered. Where something
is a question rather than an instruction, it says so.

---

## The domain, already decided

**`app.guidedchildhood.com`.** Not www.

That is JP's own call from 15 July (`plans/go-live-domains.md`) and it is
already written into the code in one place, `lib/config/site.ts`, which
`robots.ts`, `sitemap.ts` and the share card metadata all read.

The reason is worth keeping in mind while you do the DNS: **www already serves
live pages the app would collide with.** `www.guidedchildhood.com/starter-pack`
and `/digitalwellbeing` both exist today and the app has its own versions of
both, and four more paths (`/five-questions`, `/evidence`, `/investor`,
`/investor-deck`) would start 404ing. Putting the app on `app.` breaks nothing
and needs no redirect map.

**Nothing in the code needs changing for the domain switch.** Every URL is built
from `NEXT_PUBLIC_APP_URL` or from `window.location.origin`. This is a settings
job, not a deploy.

---

## 1. Vercel: point the domain at the app

**First, one thing to confirm, because I could not settle it from the repo.**
There are two Vercel projects deploying this same codebase, `guided-childhood`
and `guided-childhood-app`, both with no root directory set. `vercel.json` at
the repo root registers 33 cron jobs, so both projects will have registered
them. **Which one is production, and are the crons running twice?** That wants
answering before you attach a domain, not after.

Then, on whichever project is production:

1. Settings, Domains, Add `app.guidedchildhood.com`.
2. Vercel gives you a CNAME record. Add it at your DNS host, pointing `app` at
   the value Vercel shows (normally `cname.vercel-dns.com`).
3. Wait for the certificate to go green. Usually minutes.

**Do not remove the `guided-childhood-app.vercel.app` alias.** See section 7.

---

## 2. The one environment variable that matters most

`NEXT_PUBLIC_APP_URL` → `https://app.guidedchildhood.com`

It is currently `https://guided-childhood-app.vercel.app`, set on 1 August so the
cron self calls would stop 401ing behind Deployment Protection
(`plans/go-live-two-manual-steps.md` has the whole story).

**What it drives, all of it:**

- **36 self calls across 30 files.** Routes that call other routes, including
  `/api/push/cron` posting to `/api/push/send`. Wrong here and pushes silently
  stop, with a 200 and the failure tucked inside the body.
- **Every button in every email**, and the unsubscribe link.
- **Stripe success and cancel URLs**, and the billing portal return.
- The cron self calls that refresh scripts, knowledge and DiGi quality.

Set it, then redeploy. Environment variables only take effect on a new build.

---

## 3. Stripe

### The endpoint

Stripe Dashboard, Developers, Webhooks, Add endpoint:

    https://app.guidedchildhood.com/api/stripe/webhook

Subscribe it to exactly these four, which are the four the route handles:

| Event | What it does here |
| --- | --- |
| `checkout.session.completed` | Turns the payment into an active membership |
| `customer.subscription.updated` | Plan changes and renewals |
| `customer.subscription.deleted` | Cancellation |
| `invoice.payment_failed` | The card that stopped working |

Copy the signing secret Stripe shows you into `STRIPE_WEBHOOK_SECRET`. It is
different for every endpoint, so this is a new value, not the one you have.

### Live mode is a different world

If you are moving from test keys to live keys at the same time, four things
change together and missing any one of them breaks checkout:

- `STRIPE_SECRET_KEY` becomes the `sk_live_` key.
- **Every price ID has to be recreated in live mode.** Test price IDs do not
  work with a live key. That is `STRIPE_PRICE_FOUNDER`, `STRIPE_PRICE_STANDARD`,
  `STRIPE_PRICE_ANNUAL`, `STRIPE_PRICE_SCHOOL_SMALL`, `STRIPE_PRICE_SCHOOL_MEDIUM`.
- **The customer portal has to be configured separately in live mode.** Stripe
  keeps test and live portal settings apart, and an unconfigured live portal
  errors when a parent taps Manage billing.
- `STRIPE_TOS_CONSENT` stays as it is. Set to `on` it makes checkout collect
  terms acceptance.

### Founder cap

House rule 10: the founder rate is capped at 50 in code, not just in copy. That
cap counts rows in the database, so it carries over unchanged. Worth knowing that
any test mode founder signups already sitting in the table count towards it.

---

## 4. Email (Resend)

- **Verify the sending domain.** `EMAIL_FROM` defaults to
  `Justin at Guided Childhood <hello@guidedchildhood.com>`. `guidedchildhood.com`
  has to be a verified domain in Resend, with its SPF, DKIM and DMARC records
  live at your DNS host, or every send is rejected at Resend with nothing wrong
  on our side.
- The from address does **not** need to change for the domain switch. It is
  already on the .com and the app is going on a subdomain of it.
- `RESEND_API_KEY` and `CRON_SECRET` are both fatal if unset: the daily run
  returns `skipped` and stops, and a dead programme looks exactly like a quiet
  one.
- **School inbound forwarding** has its own two: `SCHOOL_INBOUND_DOMAIN` and
  `RESEND_INBOUND_SIGNING_SECRET`, plus `RESEND_WEBHOOK_SECRET` for delivery
  events. If the inbound domain has an MX record pointing at Resend, that stays
  where it is.

**Check it afterwards at `/dashboard/admin/health`.** That page already reads
every one of these and tells you what is missing and when an email last
genuinely went out.

---

## 5. Supabase auth

Supabase Dashboard, Authentication, URL Configuration:

- **Site URL** → `https://app.guidedchildhood.com`
- **Redirect URLs** → add `https://app.guidedchildhood.com/auth/callback`

The code builds these from `window.location.origin`, so it is right whatever the
domain. Supabase still has to allow the domain, or the confirmation link in a
new signup and the password reset link both land on an error instead of the app.

Leave the existing vercel.app entries in the list. They cost nothing and they
keep the old host working.

---

## 6. Push notifications will need re allowing

This one is a real cost, not a setting, and it is the part worth telling
families about rather than letting them discover.

**A push subscription belongs to an origin.** Every subscription in the database
was created against `guided-childhood-app.vercel.app`, and none of them are
valid for `app.guidedchildhood.com`. The VAPID keys do not change and nothing
needs regenerating, but every parent and child who has notifications on will
have to open the app on the new address and allow them again.

For children it is worse: the child's app is a page saved to a home screen, so
the icon on their phone points at the old host. They will need the link sharing
again. The card that spots this is already in the product (a month with nothing
opened raises "send it again" with the QR code on it), but at a domain switch it
is worth doing deliberately rather than waiting a month for the app to notice.

---

## 7. Do not switch the old host off

Two reasons, both about children rather than parents:

1. Every `/k/<token>` link already saved to a child's home screen points at
   `guided-childhood-app.vercel.app`. While that alias stays up, they keep
   working.
2. The same is true of any link in an email already sent.

Vercel keeps the `.vercel.app` alias for free. Leave it.

---

## 8. Schools, when you are ready

Separate switch, separate day if you like. In `next.config.ts` the four schools
redirects are deliberately temporary 307s pointing at
`SCHOOLS_SITE_URL`, so nothing has cached the interim address.

At schools launch, both together in one commit:

1. Set `SCHOOLS_SITE_URL` to `https://schools.guidedchildhood.com`.
2. Flip those four redirects to `permanent: true`, so search engines move their
   index then and only then.

---

## Still open before you launch

These are decisions and jobs, not domain settings, and three of them predate
today.

1. **Migrations 183, 185 and 186 have still not been confirmed as run.** 185 and
   186 are the ones that stop the recommender offering the "they have told you
   they are gay, bi or trans" script to families who never signalled anything.
   Until they run, that is live for everyone who reaches the recommender.
2. **The whole curriculum is readable without signing in or paying.** 135
   lessons including their full slide decks, 54 AI lessons, 40 parent segments,
   73 knowledge rows and 25 child scripts all have an RLS policy of
   `USING (true)`. Scripts are correctly gated and are the pattern to copy. This
   is a pricing decision, not a bug to fix on my own judgement, and it wants ten
   minutes of your intent before the doors open. Then it is a small migration.
3. **Confirm which Vercel project is production**, and whether 33 crons are
   registered twice across the two.

---

## The order to do it in

1. Answer the two projects question.
2. Add the domain in Vercel, add the DNS record, wait for the certificate.
3. Set `NEXT_PUBLIC_APP_URL`, redeploy.
4. Supabase Site URL and redirect URL.
5. Stripe endpoint, live keys, live prices, live portal.
6. Confirm the Resend domain is verified.
7. Open `/dashboard/admin/health` and read it top to bottom.
8. Then, in this order, live tests with real money and a real card: sign up,
   confirm the email lands and its buttons go to `app.`, upgrade, check the
   membership actually turned on, open the billing portal, cancel.
9. Re share the child link to your own child's phone and allow notifications
   again on both sides.
