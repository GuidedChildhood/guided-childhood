// THE ONE PLACE THE LIVE ORIGIN IS WRITTEN DOWN.
//
// Justin, 9 August 2026, on the go live checklist: "check as might also be
// .com". It is, and the check was worth making, because three files were
// pointing somewhere the business does not live.
//
// WHAT WAS ACTUALLY WRONG. robots.ts, sitemap.ts and the metadataBase added
// on 8 August all hardcoded https://www.guidedchildhood.co.uk. Every real
// thing this business owns is .com: hello@guidedchildhood.com in the terms,
// the privacy page, the contact page and the error screen, plus the live
// www.guidedchildhood.com/digitalwellbeing, wellbeing., tools. and evidence.
// subdomains the marketing pages already link out to. Nothing anywhere serves
// .co.uk. A sitemap advertising the wrong domain does not redirect, it just
// tells Google about pages that are not there.
//
// ── 11 AUGUST 2026: WWW, NOT app. ────────────────────────────────────────────
//
// Justin: "is it not a good idea to have the home page at
// www.guidedchildhood.com and the app at suggested?" Then, on being shown that
// the old site is a waiting list page: "that will go and happy with that, and
// we don't need app.guided as we have never published that."
//
// He is right, and the reason this file said app. had quietly expired.
//
// THE ONLY ARGUMENT FOR app. WAS FOUR PAGES THAT WOULD HAVE 404ed. JP's note of
// 15 July (plans/go-live-domains.md) put the app on a subdomain because taking
// www would have broken /five-questions, /evidence, /investor and
// /investor-deck, which existed on the old site and not in the app, and would
// have collided with /starter-pack and /digitalwellbeing. THE APP NOW SERVES
// ALL SIX, every one of them in app/(marketing). The blocker is gone, and with
// it the reason.
//
// AND THE SPLIT WAS NEVER OURS TO COPY. Slack, Figma and Notion put the product
// on app. because their marketing site is a different codebase on a different
// deploy cadence, usually not even the same language. The subdomain is a
// deployment boundary they already had. Here the marketing pages and the
// dashboard are the same Next build in the same repository, so app. would have
// bought a boundary that does not exist and paid for it twice: search authority
// split across two hosts, and every marketing page living on a subdomain nobody
// links to. One host, one canonical, one place Google has to think about.
//
// WHAT THIS COSTS. Taking www replaces what is on it, which is a waiting list
// page Justin is happy to lose. /digitalwellbeing keeps its address and is
// served by the app's own version, which already links out to
// wellbeing.guidedchildhood.com/signup, so the 17 July requirement still holds.
// The wellbeing., tools. and evidence. subdomains are separate hosts and this
// does not touch them.
//
// One constant, because three files disagreeing is what let the .co.uk sit
// unnoticed. Everything that needs the live origin reads this: robots.ts,
// sitemap.ts, the metadataBase in the root layout, and the marketing home
// page's canonical.
export const SITE_URL = 'https://www.guidedchildhood.com'
