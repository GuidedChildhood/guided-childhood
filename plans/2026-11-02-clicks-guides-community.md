# Clicks, a guides section, and whether to have a community

**Asked, 2 November 2026.** Justin: "Also a way to track clicks on web, tell
me how to get all this set up, and if worth a blog or community on homepage
and if good idea how to set up."

## 1. Click tracking (built, this PR)

PostHog (PR 1377) already counts pageviews and each stage check step. This
adds `link_click`:

- Every link click on a public page sends where it went, cleaned by the same
  policy as every other URL (`lib/analytics/posthog-policy.ts`). A click
  towards a private page records only that it went to our own site.
- A `data-track="<label>"` on a link or button, or on a section around it,
  names which one it was. The homepage's five buttons to the stage check now
  carry `home-hero`, `home-inside`, `home-ask-digi`, `home-digi-chat` and
  `home-how-it-works`, so we can see which one earns the click.
- The link's text is never read: on the stage check result it can carry the
  child's name. A label must be a plain slug or the event is dropped.
- One listener in `components/Analytics.tsx`, nothing to wire per page. New
  buttons worth naming just get a `data-track`.

Not chosen: PostHog autocapture and heatmaps. Autocapture reads element text
(see above). Heatmaps would work but send their own event shape that the
policy would have to learn; worth it only once traffic is high enough for a
heatmap to mean anything.

## 2. A blog: yes, as a Guides section, not a blog

A dated blog is a fourth content stream beside LinkedIn, Substack and the
Guided Planet newspaper, and blogs die when the posting stops. What earns its
place is the Phase 4 roadmap box already planned: **public guides, one per
real search question, each built from a script, device guide or lesson we
already have, each ending at the stage check.** That is a blog in effect, but
evergreen and measured.

How it would be set up:

- Route: `/guides` (index) and `/guides/<slug>` (one question each), in the
  marketing group, in the sitemap, on the PostHog allowlist.
- Content lives in the repo as one file per guide, so it is reviewed like
  copy (ai-tells, no dashes, Justin's voice) and needs no CMS.
- Topic order comes from the gum report (`npm run seo -- report`): the
  striking distance queries with a proof path first. Until the first pulls
  land, start with three questions parents already ask us in their own words
  (research/homepage-audience-language.md), for example when to give a first
  phone, the nightly screen time argument, and Roblox.
- Homepage: one quiet strip near the foot, "Guides", three cards. Not a feed,
  not above the stage check.
- Each guide shows one free script or tip in full (the proof) and ends with
  the stage check hook, identical everywhere.

## 3. A community: not now, and not on the homepage

Decided in June: one Founders Room, no topic rooms until 200 members. That
still holds, for three reasons.

1. **Safeguarding.** Parents post about their children. A public or open
   community is a place for disclosures, names and photos of minors, and we
   are pre DPIA. Moderating that properly is a DSL level job, every day.
2. **The empty room.** Below a few hundred active members a community reads
   as dead, which is worse than none on a homepage.
3. **The parents are already gathered.** The channel plan uses existing
   parent groups and the share loop; we go to them rather than build a room
   and wait.

When it is right: at about 200 paying members, a members only room inside
the app (not public, not on the homepage), Justin posting three times a
week, a report button on every post, as decided in June.

## What Justin needs to do

See the reply in the session: PostHog account and key, gum on the Mac, and a
yes or no on building the Guides section.
