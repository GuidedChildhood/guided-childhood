# PostHog on the public pages

**Asked, 21 October 2026.** Justin, straight after the gum SEO build (PR 1376):
"Add post hog."

**Why it matters.** gum tells us what Google shows and what gets clicked. It
cannot tell us what a parent does after the click. The whole game in
THE-STORY.md section 9 is parents to the stage check, roughly 8,000 of them,
counted by source. PostHog closes that gap: which page, post or search sent
the parent, and how far through the three questions they got. The growth
plan had already named it as the option ("Events table plus a tiny
/api/events endpoint, or PostHog if Justin prefers a tool").

## The rules it is built to

1. **The privacy page stays true.** It says we use no tracking cookies. So
   PostHog runs with `persistence: 'memory'`: no cookie, no localStorage,
   nothing written to the device. That also keeps us outside PECR's consent
   rule, so no cookie banner. The cost: a visit is one page load's worth of
   identity, so returning visitors are not stitched together. Fine for the
   question we are asking.
2. **Never on a child's page.** We are pre DPIA (review.md, the risk test). An
   allowlist of public marketing paths decides what is ever sent. The child
   app (`/k`), the family codes (`/home-code`, `/r`, `/m`), the dashboard,
   onboarding and auth are never captured, even after a client side
   navigation from a public page.
3. **Nothing typed leaves the page.** Autocapture off, session recording off,
   surveys and extra script loading off. The only custom event is the stage
   check step name (`intro`, `q1`, `q2`, `q4`, `reassure`, `result`,
   `account`). Never the child's name, age, answers or the parent's email.
4. **URLs are cleaned before sending.** Query strings are stripped except
   `utm_*` and `ref`, so a school code or a video link token never reaches
   PostHog. Internal referrers are cut to their path, or to the bare host when
   the path is not on the allowlist.
5. **EU hosting, first party path.** Events go to `/ingest` on our own domain,
   rewritten to PostHog's EU cloud. One origin, no third party script host.
6. **Off until the key is set.** No `NEXT_PUBLIC_POSTHOG_KEY`, nothing loads.
   The SDK is a dynamic import, so pages that never qualify never download it.

## The build

- `lib/analytics/posthog-policy.ts`: the allowlist and the cleaning, pure and
  tested (`npm run posthog-test`).
- `components/Analytics.tsx`: loads PostHog on an allowed path, in the root
  layout, so the home page and the marketing group are covered by one line.
- `/ingest` rewrites in `next.config.ts`.
- The stage check step event in `app/(marketing)/starter-pack/page.tsx`.
- The privacy page names PostHog, what it counts and what it never sees.
- `.env.local.template` documents the two keys.

## Not in this PR, needs Justin's yes

- The parent dashboard (adults, logged in). Useful for retention, but it
  means deciding what a member event may carry. Next PR if wanted.
- The schools app. Pupil pages are in it; same allowlist pattern when wanted.

## What Justin needs to do

1. Make a PostHog account on the **EU** cloud (eu.posthog.com), one project.
2. In project settings, turn on **Discard client IP data**.
3. Put the project API key in Vercel as `NEXT_PUBLIC_POSTHOG_KEY`, then
   redeploy.
