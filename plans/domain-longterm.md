# Long term domain plan: one home on the main domain

**Decision, 15 July 2026, before the native app is built.** Choose the domain
architecture now, because the native app's deep links and associated domains
must point at a canonical host that we do not want to change later.

## The choice

Two options were on the table:

- **A. One home on the main domain.** The Next app (marketing pages and the
  product together, it is one codebase) serves guidedchildhood.com. Marketing
  pages are folded in as real routes. The app, the marketing and the native
  app's links all live on the main domain.
- **B. Split.** Marketing stays on the main domain (on the current external
  host), the app lives on app.guidedchildhood.com.

## Chosen: A, one home on the main domain

Why A wins for the long term:

1. **The marketing pages already live inside the app codebase** (home, schools,
   starter-pack, digitalwellbeing, pathway, scripts, privacy, terms, join). If
   the app is on the main domain, those pages get the main domain's full SEO
   authority for free. Splitting would either strand them on a subdomain or
   force a second, separately maintained marketing site. More work, worse SEO.
2. **SEO consolidates on one domain.** Subfolders on one host beat content split
   across a subdomain and an apex (Moz case studies, Google guidance). One home
   means every page compounds the same authority.
3. **The native app is simpler and cleaner.** Universal links and the Apple App
   Site Association file point at one canonical domain. A shared
   guidedchildhood.com link opens the app. No subdomain indirection.
4. **The child link reads as trusted.** guidedchildhood.com/k/<token> on a QR a
   child scans, or a link a parent forwards, is shorter and more trustworthy
   than app.guidedchildhood.com/k/<token>.
5. **No subdomain sprawl.** One brand, one home. app. subdomains are a fine
   launch shortcut but a weaker permanent shape.

B (split) only wins if we refuse to move the marketing pages into the app. Since
there are only a couple of pages not already in the app, that is not worth the
long term fragmentation.

## The end state

- **guidedchildhood.com (apex) is canonical** and serves the Next app, marketing
  and product together. Apex is shorter and reads best on shared child links.
- **www.guidedchildhood.com 301 redirects to the apex**, so both work, one is
  canonical.
- **The native app** sets its associated domain to guidedchildhood.com. A shared
  link opens the app.
- **Genuinely separate tools stay on their own subdomains** (tools.), untouched.
- **Investor pages move off the funnel:** investor.guidedchildhood.com (a
  subdomain), since they are not for SEO or the public funnel. Keeps the main
  domain clean.

## Getting there without breaking a single link

Order matters. Do this before pointing DNS at the app.

1. **Fold the last marketing pages into the app** as real Next routes, so the
   main domain serves them natively (full SEO):
   - Already in the app: home, starter-pack, digitalwellbeing, schools, pathway,
     scripts, privacy, terms, join.
   - To rebuild in the app (JP sends the current content): **/five-questions**
     and **/evidence**.
2. **Decide evidence.** If the evidence subdomain content should rank as part of
   marketing, bring it to /evidence in the app and 301 the subdomain to it. If
   it is a separate heavy resource, leave the subdomain and skip the app route.
3. **Move the investor pages** to investor.guidedchildhood.com, and 301
   guidedchildhood.com/investor and /investor-deck there (in case anyone hits the
   apex path).
4. **Add the redirect map** in next.config.ts for anything that moved host, so
   old URLs 301 to the new home and pass their SEO on.
5. **Point DNS** at the app: apex to Vercel, www 301 to apex. Verify every link
   from JP's list resolves, native route or 301, zero 404s.
6. **Only then build the native app**, associated domain set to
   guidedchildhood.com.

## What JP decides or sends

- Confirm apex as canonical (recommended) rather than www.
- Send the current content of /five-questions and /evidence to rebuild in app.
- Confirm investor pages can move to investor.guidedchildhood.com.
- Confirm tools.guidedchildhood.com stays a separate subdomain (no change).

## The old go-live note

plans/go-live-domains.md holds the safe launch shortcut (app on app. first).
That is still fine as a stopgap if we want to launch before the consolidation
above. This document is the long term target to build the native app against.
