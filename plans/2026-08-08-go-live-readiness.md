# Go live readiness check, 8 August 2026

Justin: *"can we do overnight a full check so tomorrow or Monday we will set up
a plan to go live on domain."*

Everything below was measured against the live database and a real production
build, not read off the code and assumed. Where something was not checked, it
says so.

---

## The one thing to decide before you launch

### 1. The curriculum is readable by anybody, without signing in or paying

**135 lessons, including their full `slides` decks, plus 54 AI lessons, 40
parent lesson segments, 73 expert knowledge rows and 25 child scripts, are
world readable.** Each of those tables has RLS on with a policy of
`USING (true)` for the public role, and the `anon` grant is present.

The anon key is not a secret, it ships in the browser bundle by design, so the
gate is the policy. The app itself is careful: the Lessons browser computes a
`locked` flag per tile and the pathway respects the paywall. **The database
does not.** That is the same shape as the hole found this morning on
`profiles`: the screen enforces the rule and the row does not.

The upgrade page charges £7.99 a month for, among other things, "All 5 stages
as your child grows".

**Scripts, by contrast, are correctly gated**, and worth understanding because
it is the pattern to copy:

| policy | effect |
| --- | --- |
| `Free scripts are public` | `USING (is_free = true)`, 63 rows |
| `Paid scripts visible to active members` | active subscription or a live trial, 233 rows |

Worth noting: **that policy only became real this morning.** Until migration
175 a parent could set their own `subscription_status` to `active` from the
browser console, and this policy would then have handed them all 233. The
paywall and 175 are the same lock.

**This is a decision, not a bug to fix on my own judgement.** Some products
deliberately keep the teaching open and charge for the experience around it.
Locking `lessons` blindly would break anything that legitimately reads it while
signed out, for example a public lesson preview or the stage quiz. So it needs
ten minutes of your intent, then it is a small migration in the shape of the
scripts one.

---

## Fixed tonight

| what | why it mattered |
| --- | --- |
| `metadataBase` added to the root layout | Without it Next resolves share card images against localhost and warns at build. On a brand new domain that is the difference between a link preview and a blank box. Set to `https://www.guidedchildhood.co.uk`, matching what `robots.ts` and `sitemap.ts` already hardcode, so all three now agree. |
| Three dashes removed from metadata copy | "Stage-by-Stage" in the Open Graph title, "stage-by-stage" in the Twitter description, "Word-for-word" on the scripts page. House rule 4 is no dashes ever, and this is the copy a stranger sees first, in search results and when the link is shared. |

Rendered marketing copy was scanned separately and is **clean**: zero em or en
dashes and zero hyphenated words in anything a visitor actually reads. The 2040
matches on a first pass were all inside code comments, which are exempt.

---

## Needs you, before the domain switch

### 2. There is no share image

`twitter.card` is set to `summary_large_image` and **no image is defined
anywhere**, and there is no candidate in `public/` beyond the 192 and 512 app
icons. So every share of the new domain, on WhatsApp, LinkedIn, Facebook,
renders an empty card. On a launch day where the link is the product, that is
the most visible flaw on this list and the cheapest to fix.

Needs one 1200x630 image. Once it exists, `metadataBase` is already in place so
a relative path will resolve.

### 3. Confirm the domain is `www`

`robots.ts` and `sitemap.ts` both hardcode `https://www.guidedchildhood.co.uk`,
and `metadataBase` now matches them. **If the live site ends up on the apex,
`guidedchildhood.co.uk` with no www, all three are wrong** and the sitemap will
advertise URLs that redirect. Pick one, and make the other a permanent redirect
at the DNS or Vercel level.

### 4. Two Supabase dashboard toggles

- **Leaked password protection is off.** One switch, checks new passwords
  against HaveIBeenPwned. On a product for families, worth having on day one.
- **The Stripe customer portal still has to be switched on** (Settings,
  Billing, Customer portal), which is the outstanding item from #756. Until
  then "cancel any time" on the upgrade page has no working door behind it.

### 5. Nine `SECURITY DEFINER` functions are callable without signing in

Flagged by the Supabase linter, and they run with the definer's rights, so the
usual RLS reasoning does not protect them. The ones worth a look:
`handle_new_user()`, `cron_job_status()`, `prune_cron_runs()`,
`match_scripts()` and `match_moments()`.

`match_scripts` is the one to check first: it is a vector search over the
scripts table, and if it does not re-check the caller it is a way around the
paywall that the table policy would otherwise enforce. **I have not confirmed
whether it does.** Outbound HTTP is blocked from this sandbox, so I could not
call the REST endpoint to prove it either way, and I am not going to report a
hole I have not seen.

---

## Checked and healthy

- **Production build passes**, exit 0, compiled in 27 seconds. One deprecation
  notice: Next 16 wants `middleware.ts` renamed to `proxy.ts`. Not urgent, but
  it will become an error in a future major.
- **Typecheck clean. `npm run wiring` 0 new**, 19 known and pre existing.
- **Preview and dev pages are properly hidden in production.** `middleware.ts`
  404s every `/ref-*` route and `app/dev/layout.tsx` 404s `/dev`, both gated on
  `VERCEL_ENV === 'production'` rather than `NODE_ENV`, which is the correct
  choice: `NODE_ENV` is production on preview builds too.
- **No hardcoded `localhost` or `*.vercel.app` anywhere** in shipped app, lib
  or component code. Nothing to sweep at switchover.
- **`robots.ts` and `sitemap.ts` both exist** and are on the right origin.
- **Migrations 172, 174 and 175 are all applied.** Verified on the live
  database: `children.streak_week_seen` exists, zero `reason = 'stage'` sticker
  rows remain, and on `profiles` the five locked columns are unwritable by
  `authenticated` while all nineteen ordinary ones still are. That second half
  matters, because a revoke that ran without its grant back would look
  identical from the outside and would quietly stop parents editing their own
  name and settings.

---

## Not checked, and worth saying so

- **Nothing was clicked through while signed in.** There is no test account in
  this sandbox, so every dashboard, quests, DiGi and settings screen is
  unverified tonight beyond typecheck and build.
- **Stripe was not exercised.** No test checkout, no webhook replay.
- **Emails were not sent.** Resend configuration is unverified.
- **No load or performance testing**, and the Supabase performance advisors
  were not run, only the security ones.

---

## Suggested order for Monday

1. Decide the lesson content question in section 1. It is the only one that
   changes what you are selling.
2. Make the share image, and confirm www against apex.
3. Flip the two Supabase toggles and the Stripe portal.
4. Read `match_scripts` and the other definer functions, or have me do it once
   I can reach the API.
5. Then switch the domain.

Steps 2 and 3 are an hour. Step 1 is the one to sleep on.
