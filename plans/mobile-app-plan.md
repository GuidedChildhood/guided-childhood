# The iPhone app plan: App Store presence without touching the web build

Written 12 July 2026. Owner: JP. Builder: a NEW Claude session in a NEW repo.
This document is the brief that session starts from.

## The one decision this plan makes

**Wrap first, go native later if the numbers demand it.** The web app is
already mobile first (tabs, Today's Path, kid quest links that install like
mini apps). The fastest credible App Store presence is a Capacitor shell
around the deployed web app, plus the two things a wrapper cannot fake:
native push notifications and a home screen widget. Everything heavier
(Expo or Swift rebuild) waits until the wrapped app proves the store
channel is worth it.

Why this order and not a React Native rebuild now: a rebuild is 6 to 10
weeks of parallel product surface that immediately violates our one lane
rule and doubles every future feature. The wrapper is 1 to 2 weeks, ships
the exact product that already works, and the store listing, push and
widget are the actual new value.

## Why the Starter Story lesson points here

The Early app playbook (plans/week-of-2026-07-11-starter-story-growth-plan.md)
was: one showable hook plus a native iOS surface people see every day.
Their surface was the alarm. Ours is a **home screen widget**: the passport
ring filling, the streak flame, tonight's script title. That widget is the
Duolingo pattern JP asked for weeks ago and it is only possible with a real
app. The widget is the reason to be in the store, not a nice to have.

## Isolation guarantees (how the web build stays untouched)

1. **New repo: guided-childhood-app.** Zero shared code with this repo.
   The app consumes the LIVE deployed web app and its existing API routes.
   Nothing in guided-childhood changes except, later, tiny additive things
   (a cookie bridge for native push tokens, a couple of meta tags).
2. **New Claude session, its own lane.** Per the multi session rules, the
   app session never edits this repo. If it needs an API change it writes
   an issue for this lane instead.
3. **Additive only bridge points.** Native push registers through a new
   additive endpoint; nothing existing is modified. If the app dies
   tomorrow, the web app never notices.

## The stack, concretely

- **Shell:** Capacitor 6 (capacitorjs.com). Wraps the production URL,
  gives native APIs through plugins. Not Cordova, not a WebView hack:
  Capacitor is what Ionic maintains and what most wrapped store apps use.
- **Widget:** a small SwiftUI WidgetKit extension beside the shell. Reads
  a tiny JSON endpoint (passport pct, streak, tonight's script title) via
  an authenticated token. This is the one genuinely native piece.
- **Push:** Capacitor Push Notifications plugin feeding APNs, bridged to
  the existing push_subscriptions table with a new source column value.
- **Build and signing:** no Mac required day to day. Codemagic or Ionic
  Appflow cloud builds sign and upload to TestFlight. A Mac is only nicer,
  never necessary.

## What Apple demands (the non code checklist for JP)

1. **Apple Developer Program**: developer.apple.com, £79 a year, needs
   D-U-N-S number only if enrolling as a company (recommended: enrol as
   the company for the trust of "Guided Childhood Ltd" in the store).
   Approval takes 1 to 3 days.
2. **Guideline 4.2 risk (minimum functionality).** Apple rejects bare
   website wrappers. Our answer: native push, the WidgetKit widget, and
   offline handling of the shell. Apps like this pass every day; bare
   wrappers do not.
3. **Privacy**: App Privacy labels (we collect first name, age range,
   email), a privacy policy URL (exists), and the parental gate rules if
   we ever market TO children (we do not; the parent is the user, the kid
   link stays a web page, which keeps us outside the strictest kids
   category rules).

## Phases

**Phase 0, this repo, 1 PR:** a /api/widget endpoint (token authed, returns
passport pct, streak, tonight's script) and a meta viewport audit. Additive
only. This is the ONLY work this repo ever does for the app.

**Phase 1, new repo, week 1:** Capacitor shell wrapping app.guidedchildhood.com,
app icons and splash in checker tokens, TestFlight build via Codemagic,
JP installs it on his phone.

**Phase 2, week 2:** native push wired to the existing check in slots, the
WidgetKit widget (small and medium sizes: passport ring plus streak, and
tonight's script title), App Store listing copy in Justin's voice,
screenshots from the real app, submit for review.

**Phase 3, only if the store channel earns it:** evaluate Expo rebuild of
the daily loop for native feel. Decision gate: 1,000 installs or clear
review feedback complaining about web feel, whichever first.

## Costs

Apple £79 a year. Codemagic free tier covers our build volume to start.
No new infrastructure: the app is a client of what already runs.

## How to kick this off

Open a NEW Claude session pointed at a fresh guided-childhood-app repo
(create it empty on GitHub first), paste this plan as the first message,
and name the lane: "You own the app repo only, never guided-childhood."
This session (platform lane) ships Phase 0 when asked.
