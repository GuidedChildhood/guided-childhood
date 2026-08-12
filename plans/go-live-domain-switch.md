# Go live on the domain: the switch, step by step

**Justin, 11 August 2026:** *"let's go live with domain so let me know what we
need to do, how to do it, including stripe end point etc, emails, anything that
needs changing to work on live domain."*

Everything below was read out of the code today, not remembered. Where something
is a question rather than an instruction, it says so.

---

## The domain: www.guidedchildhood.com, and only that

**The app takes www.** Marketing at `/`, the product at `/dashboard`, children at
`/k/<token>`, all one host, all one Next build.

This overturns the 15 July plan, which put the app on `app.guidedchildhood.com`,
and the reason is that **the only argument for the subdomain has expired.** That
note chose `app.` because taking www would have broken four pages that lived on
the old site and not in this app: `/five-questions`, `/evidence`, `/investor` and
`/investor-deck`, and would have collided with `/starter-pack` and
`/digitalwellbeing`. **The app now serves all six**, every one of them in
`app/(marketing)`. There is nothing left to protect.

Justin, 11 August, on the old site: *"it's a waiting list page so that will go
and happy with that, and we don't need app.guided as we have never published
that."* So `app.` is not being registered at all. Nothing points at it, nothing
has ever pointed at it, and adding it now would only be a second host to keep
straight.

### Why not the split everyone else seems to have

Slack, Figma and Notion put the product on `app.` because **their marketing site
is a different codebase**, usually on a different platform with a different team
shipping to it daily. The subdomain is a deployment boundary they already had,
not a design decision.

Here the marketing pages and the dashboard are the same build in the same
repository. `app.` would buy a boundary that does not exist and charge twice for
it: search authority split across two hosts, and every marketing page living on a
subdomain nobody links to. One host, one canonical, one thing for Google to think
about.

### The link that has to survive

`www.guidedchildhood.com/digitalwellbeing` keeps its address. The app has its own
version of that page and it already links out to
`wellbeing.guidedchildhood.com/signup`, which is what the 17 July note required.
**What changes is the page behind the URL**, so it is worth looking at the app's
version once and confirming it is the one you want. If it is not, that path gets
a redirect out to wherever the real page lives instead, and the address still
works either way.

`wellbeing.`, `tools.` and `evidence.` are separate hosts. Nothing here touches
them.

---

## The two domains, .com and .co.uk

Justin owns both. **One is canonical and the other redirects to it. Never both
serving.**

Two domains serving the same pages is the one thing to avoid: Google has to pick
a winner, your links are split across two addresses, and half your visitors are
on a version of the site you are not measuring.

**The .com is canonical**, and that is decided by what already exists rather than
by preference. Everything the business owns is on the .com: `hello@guidedchildhood.com`
in the terms, the privacy page and the contact page, plus `wellbeing.`, `tools.`
and `evidence.`, plus the live `/digitalwellbeing` page. Making .co.uk canonical
would mean moving all of that for nothing.

So four domains go on the Vercel project:

| Domain | What it does |
| --- | --- |
| `www.guidedchildhood.com` | **Serves the app. The canonical.** |
| `guidedchildhood.com` | Redirects to www |
| `www.guidedchildhood.co.uk` | Redirects to `www.guidedchildhood.com` |
| `guidedchildhood.co.uk` | Redirects to `www.guidedchildhood.com` |

Vercel has this built in. Add the domain, then choose **Redirect to another
domain** rather than serving it, and it sends a permanent redirect that keeps the
path, so `guidedchildhood.co.uk/scripts` lands on `www.guidedchildhood.com/scripts`.
No code, no redirect map.

**Keep renewing the .co.uk anyway.** It is a defensive registration now: it stops
anyone else having it, and it catches every UK visitor who assumes a British
company is on a British domain. It costs a few pounds a year and it never serves a
page.

**Already fixed in code.** The home page was declaring `www.guidedchildhood.co.uk`
as its canonical in five places, including the Organization and WebSite structured
data. That is worse than untidy: a canonical tag pointing at a domain that is
about to be a redirect tells Google the real page is somewhere else. The 9 August
pass fixed robots, the sitemap and the metadataBase and missed the home page,
which is the page all of them point at. Everything now reads `SITE_URL` from
`lib/config/site.ts`.

---

---

## 1. The production project is guided-childhood-app

Justin, 11 August 2026, asked which of the two it was: **"app one."** So
`guided-childhood-app` is production, and that is the project the domains go on
and the one whose environment variables matter.

### Which leaves the other one, and it is not harmless

`guided-childhood` deploys the same repository with no root directory set, so it
has its own production deployment of this code. `vercel.json` at the repo root
registers 33 cron jobs, and Vercel registers them per project, against whatever
that project's production deployment is.

**So the schedule is almost certainly running twice.** Not a launch risk, a live
one: two copies of the daily digest, two of the weekly review, two morning
pushes at 07:15, two lots of school reminders at 17:00. Every family on the list
getting everything twice.

### ANSWERED, 12 AUGUST 2026: THEY ARE NOT DOUBLED. NOTHING TO DISABLE.

Checked against `cron_runs`. Every job runs exactly once. Count the runs against
what a single project should produce and it is not close, it is exact:

| Job | Schedule | Runs in 2 days | One project should give |
| --- | --- | --- | --- |
| `/api/cron/device-time` | every minute | 2879 | 2880 |
| `/api/school/soon` | every 15 min | 193 | 192 |
| `/api/push/cron` | every 30 min | 96 | 96 |
| every daily job (digest, weekly review, morning push, school remind, and the rest) | daily | 2 | 2 |

Two projects firing would have given 5760 device-time runs and 4 of every daily
job. So `guided-childhood` has no crons registered, and **step 1 on the day is
already done. Do not disable anything.**

### The query in the original plan was misleading, and this is why

It was:

    select job, date_trunc('minute', started_at) as minute, count(*)
    from cron_runs
    where started_at > now() - interval '2 days'
    group by 1, 2
    having count(*) > 1
    order by minute desc;

with the rule "rows back means two projects are firing". **It returns 35 rows
here, and they mean nothing.** Almost all of them are `device-time`, which runs
EVERY MINUTE, so a run that starts at 05:21:59.8 and the next at 05:22:00.1 land
in the same minute bucket and look like a duplicate. That is clock jitter on a
per minute job, at 1.3 percent of runs, not a second project.

Following the old rule literally would have had somebody disable a working set
of crons on launch day on the strength of rounding.

**Count the runs instead, and compare against the schedule.** That is the query
that actually answers it:

    select job, count(*) as runs, min(started_at), max(started_at)
    from cron_runs
    where started_at > now() - interval '2 days'
    group by 1 order by runs desc;

A doubled job shows roughly TWICE what its schedule allows across the window. A
daily job showing 4 in two days is doubled. One showing 2 is fine.

**If it ever is doubled**, turn the crons off on `guided-childhood` rather than
deleting the project: Settings, Cron Jobs, disable. Deleting is a bigger move
than this needs and the old project is still a working rollback target while the
domain moves.

One thing the count does surface, and it is not a duplicate: `settings-nudge`
ran once in two days where a daily job should run twice. That is a MISSED run,
consistent with Vercel documenting crons as best effort, which
`plans/go-live-two-manual-steps.md` already recorded happening on 31 July. Worth
knowing, not worth fixing.

---

## 2. Add the domains and the DNS records

On the production project, Settings, Domains:

1. Add `www.guidedchildhood.com`. This is the one that serves.
2. Add `guidedchildhood.com` and set it to redirect to www.
3. Add both `.co.uk` forms and set them to redirect to `www.guidedchildhood.com`.

Vercel gives you the DNS records for each. The apex ones are an A record, www is a
CNAME. Add them at whichever host holds each domain, and wait for the certificates
to go green.

---

## 3. The one variable that matters most

`NEXT_PUBLIC_APP_URL` → `https://www.guidedchildhood.com`

It currently points at the vercel.app alias, set on 1 August so the scheduled jobs
would stop failing behind deployment protection.

**What it drives, all of it:**

- **36 self calls across 30 files.** Routes that call other routes, including the
  push job that posts to the send route.
- **Every button in every email**, and the unsubscribe link.
- **Stripe's success, cancel and billing portal return addresses.**

Set it, then redeploy. Variables only take effect on a new build.

**Get this wrong and:** push check ins stop arriving and nothing errors. The route
still replies with a success and tucks the failure inside the body, which is
exactly how nobody noticed for weeks last time.

---

## 4. Supabase has to allow the new address

Authentication, URL Configuration:

- **Site URL** → `https://www.guidedchildhood.com`
- **Redirect URLs** → add `https://www.guidedchildhood.com/auth/callback`

The app builds these from whatever address the browser is on, so the code is right
either way. Supabase still has to allow the domain. Leave the existing vercel.app
entries in the list.

**Skip it and:** the confirmation link in every new signup, and every password
reset, lands on an error instead of the app.

---

## 5. The Stripe endpoint

Developers, Webhooks, Add endpoint:

    https://www.guidedchildhood.com/api/stripe/webhook

Subscribe it to exactly these four, which are the four the route handles:

| Event | What it does here |
| --- | --- |
| `checkout.session.completed` | Turns the payment into an active membership |
| `customer.subscription.updated` | Plan changes and renewals |
| `customer.subscription.deleted` | Cancellation |
| `invoice.payment_failed` | The card that stopped working |

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`. It is different for every
endpoint, so this is a **new value**, not the one you already have.

**Skip it and:** parents pay and nothing happens. The money arrives, the
membership does not turn on.

---

## 6. If Stripe is going to live mode at the same time

- `STRIPE_SECRET_KEY` becomes the live key.
- **Every price has to be created again in live mode.** Test price IDs do not work
  with a live key. Founder, standard, annual and both school prices.
- **The billing portal has to be configured again in live mode.** Stripe keeps the
  two modes apart, and an unconfigured live portal errors the moment a parent taps
  Manage billing.
- The trial is 4 days and `TRIAL_DAYS` in `lib/access.ts` sets the checkout's
  `trial_period_days` from the same constant, so the card and the app cannot
  disagree about when it runs out.

The founder cap of 50 counts rows in the database, so it carries over. Any test
mode founder signups sitting in that table already count against it.

---

## 7. Email needs no change, only a check

The from address is already on the .com and the app is going on www of it, so
**nothing about email changes.** What matters is that it was right in the first
place:

- `guidedchildhood.com` is a **verified** domain in Resend, with SPF, DKIM and
  DMARC live. An unverified domain fails at Resend with nothing wrong our side.
- `RESEND_API_KEY` and `CRON_SECRET` are both fatal if unset. The daily run
  returns skipped and stops, and a dead programme looks exactly like a quiet one.
- School forwarding has its own two, the inbound domain and its signing secret,
  plus the webhook secret for delivery events.

Then read it rather than assume it: **`/dashboard/admin/health`** already checks
every one of these and says when an email last genuinely went out.

---

## 8. Notifications will have to be allowed again

A real cost rather than a setting. **A push subscription belongs to a web
address.** Every subscription in the database was created against the vercel.app
host and none are valid on the new one. The keys do not change and nothing needs
regenerating, but every parent and child with notifications on has to open the app
at the new address and allow them again.

For children it is more than that. Their app is a page saved to a home screen, so
the icon on their phone still points at the old address and they need the link
sharing again. The product spots this on its own after a month of silence and
offers the code, but at a domain switch it is worth doing deliberately.

---

## 9. Leave the old address switched on

Every child link already saved to a home screen points at the vercel.app host, and
so does every link in an email already sent. While that alias stays up they all
keep working, and Vercel keeps it for free.

---

## 10. Schools, whenever you are ready

A separate switch and it can be a separate day. The four schools redirects are
deliberately temporary, so nothing has cached the interim address. At schools
launch, both together in one commit:

- Point `SCHOOLS_SITE_URL` at `https://schools.guidedchildhood.com`.
- Flip those four redirects to permanent, so search engines move their index then
  and only then.

---

## Still open, and none of it is DNS

1. ~~**Migrations 183, 185 and 186 have still not been confirmed as run.**~~
   **CLOSED, 12 August 2026. Everything up to and including 190 is applied**,
   checked against the production database rather than the file list:

   | | how it was confirmed |
   | --- | --- |
   | 183 | the `script_completions_status_check` constraint includes `read` and `not_needed` |
   | 185 | `scripts.only_on_signal` exists |
   | 186 | the new gaming script is in the table |
   | 187 | the "Free scripts are public" policy is gone |
   | 188 | `tutor_lessons` exists |
   | 189 | `email_addresses` exists |
   | 190 | `checkin_shifts` exists |

   So the concern this item was really about is closed too: 185 is live, and the
   recommender no longer offers the "they have told you they are gay, bi or
   trans" script to families who never signalled anything.

   One warning for whoever checks this next, because it nearly produced a wrong
   answer here: **probe the thing the migration actually changes.** 183 first
   came back missing because the probe looked for a `script_reads` table. There
   is no such table. 183 alters a CHECK CONSTRAINT on `script_completions`, and
   reading the constraint is what settles it.

2. **The paywall.** Justin, 11 August: *"I don't want the scripts free so that
   needs to be paywalled, as everything should be 4 days free paywall."* The trial
   is already 4 days. What is not is the permanent free plan sitting beside it: 63
   scripts are flagged free and the free plan hands out 2 of them a week, for ever,
   on a weekly renewing allowance. Separately, 135 lessons with their full slide
   decks are world readable at the database level, so the screens hold the paywall
   and the rows do not. Both close together. Tracked as its own piece of work.
3. ~~**Whether the 33 crons are firing twice**, one set per Vercel project.~~
   **CLOSED, 12 August 2026. They are not.** Every job runs exactly once,
   counted against its own schedule rather than guessed at. The evidence and the
   corrected query are in step 1. Nothing to disable on the day.

---

## The order on the day

1. ~~Run the duplicate cron query~~ **Already done, 12 August 2026: the crons
   are NOT doubled and there is nothing to disable. Skip to step 2.**
2. Add the four domains, add the DNS records, wait for the certificates.
3. Set the app URL variable, then redeploy.
4. Supabase site URL and redirect URL.
5. Stripe endpoint, live key, live prices, live portal.
6. Confirm the Resend domain is verified.
7. Open the health page and read it top to bottom.
8. Sign up as a stranger. Confirm the email lands and its buttons go to www.
9. Upgrade with a real card. Check the membership actually turned on.
10. Open the billing portal, then cancel.
11. Check `guidedchildhood.co.uk/scripts` lands on `www.guidedchildhood.com/scripts`.
12. Re share the child link to your own child's phone, and allow notifications
    again on both sides.
