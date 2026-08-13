# 13 August 2026 — The subscription block, the daily loop, and the Planet Friends

Built on three plans already in this repo:
`plans/setup-quest-and-the-first-check-in.md`,
`plans/tomorrow-duolingo-daily-and-passport.md`,
`plans/home-is-the-daily-page.md`. This file is the execution order for today.

## WHAT ACTUALLY SHIPPED, 13 August

Done and pushed on `claude/mobbin-ux-references-i142dd` (PR 838): job 1 the
subscription block, job 5 the baseline check in, job 2 the daily lead, and the
welcome email plus the child link domain fix from the behind the list section.

Not started: jobs 3 (setup quest), 6 (what is working dashboard), 7 (passport
tidy) and 8 (monthly shop). Job 4 (Planet Friends) is deliberately waiting on
the Duolingo screenshots Justin said he would send, per his own instruction to
ask before designing that layout.

### The walk, and why it could not be a browser walk

The container's egress policy blocks supabase.co outright (403 at the proxy on
both curl and node fetch), so a headless signup could not authenticate and the
live walk Justin asked for was impossible here. Rather than reason from the
code, which is how this was misdiagnosed four times, the substitute was the
live database: ten of the eleven accounts read subscription_status 'free', and
of the eight most recent, six named a challenge at onboarding and had zero
concern rows. Both findings drove the build.

### What the fault turned out to be

The two door screen DID exist, last in onboarding. `onboarding_complete` is
written four screens earlier, at personalisation, and the init guard sends
anybody carrying that flag straight to the dashboard, so any reload between
DiGi's introduction and the final tap deleted the one screen that asks for
money, permanently, for that parent. A comment on that screen had already
diagnosed this exact thing and the write was never moved. The ask moved
instead, which is the better answer anyway.

### Still open, worth carrying into the next session

- `scripts/check-concern-dots.mjs` is stale and failing, and it predates this
  work. It asserts ten dots in a row at 390 and 320, which is the design
  deliberately replaced on 12 August by five stacked full width words. It
  guards the check in card, so it is worth rewriting rather than deleting.
- The email order now has the welcome at day 0 and everything else pushed out
  by the six day floor on its own. There is no separate "Your first script is
  ready" email yet; the subject is free for one.

## Two rules over everything

1. **Do not break the DiGi brain.** Nothing today touches the DIGI_MODEL path,
   the knowledge bank, the refresh cron or `lib/learning/digi-context.ts`.
   Before building: map what feeds DiGi and write it down here. After building:
   confirm the same paths still work.
2. **Justin gets walked through anything he has to click**, screen by screen,
   especially Stripe.

## The order

### 1. The subscription. Urgent, first, tested before anything else.

Nothing blocks at sign up, so nobody is ever asked to pay. One block, shown
AFTER the first check in. Two doors:

- **Founder.** Card now, Stripe subscription with a four day trial, charges at
  the founder rate on day five, rate held. Cap of 50 enforced in code.
- **Free trial.** No card. Four days, DiGi limited to the existing three
  message cap (reuse the built limit, find it). Full block at standard pricing
  on day five.

Both doors set the same `trial_ends_at` so the existing Home countdown reads
one field. Walk the current flow on a clean email FIRST and write down where
it actually goes, before changing anything. Test matrix: both doors, the
countdown on both, no charge on day one for founder, DiGi cap on free, 390
and 1280.

### 2. The daily loop

One lead a day picked by what is live, everything else quieter. Extend
`lib/home/next-up.ts`, never a second picker. The six blocks from
`plans/tomorrow-duolingo-daily-and-passport.md` section 1. Done when a parent
can say out loud what they are doing today.

### 3. Setup Quest

Reshape `/dashboard/setup` + `lib/setup/steps.ts`. Check in leads every
visit. Duolingo path via `TodayPathBig`, chest at the end. Says what is still
needed. No device door as an equal choice (younger leads paper, older leads
code, both stay open). Date of birth at signup replaces the age band question
(band derived in `lib/children/age.ts`). A second child step. Weekly finish
reminder, stopping after the same step is skipped twice.

### 4. Planet Friends bonus

The digi-squad cast rotates INTO the daily list as a named option, a new one
every two days, each carrying its reason to click from `lib/pathway/planets.ts`
short lines. Shooting star (ChestSpark) and bonus coin stay. Bonus and daily
lead never offer the same thing on the same day. Ask Justin for his Duolingo
screenshots before designing the layout; pull Mobbin references.

### 5. The check in is step one, and the first one is the baseline

`lib/pathway/daily-tasks.ts` gates the check in on live concerns, so a new
family never sees one. Day one it leads, framed as "where are things now".
After that the existing rule stays. Same component, no first run form,
`concern_events` already stores it. Add the movement to the weekly summary.

### 6. A "what is working" dashboard

Its own page, not a passport section. Movement over time from
`concern_events`, a sentence a parent can say out loud, no composite score
ever. A Planet Friend appears in the daily loop at week's end and links to it.

### 7. Tidy the passport

The record only: journeys, stamps, readiness readings, the line "journey to
16, social media and device ready". Concern table done 12 August; the what is
working material moves out in job 6.

### 8. The monthly shop pop up

Shop icon joins the rotation once a month, never the daily lead, reusing the
rotation engine and whatever printable selling already exists.

## Behind the list, not dropped

- Rewrite `welcomeEmail` (kind programme, new subject, order per the setup
  plan; frees "Your first script is ready" for a week later).
- Child link domain fix: `ChildLinkShare.tsx` and `QrHandoverModal.tsx` build
  from `window.location.origin`; switch to `SITE_URL` from
  `lib/config/site.ts`.
- Back to school email and founder offer email.
- Emails carry the digi-squad art already on disk, never fresh generation.

## House rules

No dashes in copy. Migrations: highest on main is 190, claim any new number
in the draft PR. 390 and 1280 before done. Commit messages via `git commit -F`
file, heredocs fail here. Report back in three things and stop.

## The rule that decides placement

Helps them know what to do today → daily loop. Record of what they did →
what is working dashboard. A service → the chest beside the road, never a
task.
