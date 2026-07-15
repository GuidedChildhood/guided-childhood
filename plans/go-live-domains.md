# Go live domains: keep every existing link working

**From JP, 15 July 2026.** The list of existing links that must not break when the
app goes live on the real domain, mapped against what the app already serves, so
nothing 404s.

## The existing links JP wants kept

| Link | Type | App has this path? | Risk |
| --- | --- | --- | --- |
| tools.guidedchildhood.com | subdomain | n/a | none, separate host |
| evidence.guidedchildhood.com | subdomain | n/a | none, separate host |
| www.../starter-pack | www path | YES (core CTA page) | CLASH |
| www.../digitalwellbeing | www path | YES | CLASH |
| www.../five-questions | www path | no | 404 if app takes www |
| www.../evidence | www path | no | 404 if app takes www |
| www.../investor | www path | no | 404 if app takes www |
| www.../investor-deck | www path | no | 404 if app takes www |

## The safe launch: app on app.guidedchildhood.com

Point the Next app at **app.guidedchildhood.com** and leave www, tools and
evidence exactly where they are.

- Every existing www page keeps working, untouched, including the two that clash.
- Both subdomains keep working.
- The app (its marketing home and the product) lives at app., and sign up CTAs
  point there.
- Zero break, no redirect guesswork, nothing to reconcile. This is the launch
  we should do first.

Later, if www itself should become the app, do the apex move below with a
redirect map in hand.

## The apex move (later, only if www becomes the app)

If the app takes www, four paths would 404 and two would be replaced by the
app's own versions. To protect them, add redirects in next.config.ts, one per
path, pointing at wherever each page really lives:

    async redirects() {
      return [
        { source: '/five-questions',  destination: 'https://…', permanent: false },
        { source: '/evidence',        destination: 'https://evidence.guidedchildhood.com', permanent: false },
        { source: '/investor',        destination: 'https://…', permanent: false },
        { source: '/investor-deck',   destination: 'https://…', permanent: false },
      ]
    }

Open questions before the apex move (JP to confirm):
1. Where are /five-questions, /investor and /investor-deck hosted right now
   (which tool or subdomain)? Needed to set each redirect target.
2. /digitalwellbeing: keep JP's existing page, or let the app's version take it?
3. /starter-pack: the app's version is the product funnel and the CTA target.
   Confirm it should replace the old /starter-pack, or the old one moves to a
   new path (for example /starter) so both live.

## Not to touch at go live

- Do not move DNS for tools. or evidence. subdomains.
- Do not point www at the app until the redirect map above is filled and the two
  clashes are decided.
