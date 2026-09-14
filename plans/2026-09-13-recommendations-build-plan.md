# The seven choices, built in the order recommended

Justin, 13 September 2026, on the seven questions from the platform review:
"Go with recommendations."

## Order and PRs

1. **Hero photos and child home** (this PR). The landing page photos served
   through next/image with a drawn fallback if the host fails; the child
   home cut to one hero tile and three under it, the rest behind More, the
   splash cut to about a second.
2. **DiGi readability** (next PR). One answer shape under 120 words with a
   Tonight line; the reflective question moves from under every reply to
   once a day on Home; the fix of the week card shows the name and the
   button only.
3. **Researchers file** (own PR). A config switch that drops the file from
   the prompt in favour of retrieval, default off until the evals are run
   against both, because this container has no API key to run them.
   Built: `DIGI_RESEARCH_BASE` (file | retrieval), `staticSystemFor(base)`,
   the evals per base with `?research=both` and a board button, guard
   `check-digi-research-base.mjs` wired into CI.
4. **Middleware auth** (own PR, last). Local session verification, with a
   walk of login, logout and an expired session before it merges.
   Built: `lib/supabase/session.ts` (`sessionUser`, getClaims), used by the
   middleware and the dashboard layout; guard `check-session-check.mjs`
   wired into CI; the walk at 390 and 1440 (no session, login, expired
   session, logged out). The real login tap waits on the live site.

## What cannot be done from this container

The Higgsfield host is blocked by this container's proxy, so the photos
cannot be copied into /public from here. next/image with Vercel's optimiser
gets phones a small file and caches it on our own edge; a drawn fallback
covers a failed load. The copy into /public needs the two originals from
Justin or a session with the host reachable.
