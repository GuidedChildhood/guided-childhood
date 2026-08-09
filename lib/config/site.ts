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
// AND THE SUBDOMAIN WAS WRONG TOO, which is the half that would have hurt.
// plans/go-live-domains.md, JP's own note from 15 July, says the app goes to
// app.guidedchildhood.com and NOT to www, because www already serves
// /starter-pack and /digitalwellbeing and the app has its own versions of
// both. Pointing the app at www collides with two live pages and 404s four
// more. So app. it is, exactly as that plan says.
//
// One constant, because the three files disagreeing is what let this sit
// unnoticed. If www ever does become the app, this is the single line to
// change, and the redirect map in that plan doc has to land in the same
// breath.
export const SITE_URL = 'https://app.guidedchildhood.com'
