# Three tier star time: core, earned, protected

Approved by Justin, 26 August 2026 ("Yes" to core time and protected windows).
Evidence base: content/packs/2026-08-26-star-system-evidence/rewards-evidence.md.
This plan claims **migration 223** (checked: highest on origin/main is 222, no
open PR claims 223).

## The decision this encodes

Pillar 4 changes from "earned, not granted" to "a small guaranteed baseline,
everything else earned, and some time no stars can buy." The change is what
separates our system from the version the evidence warns about, where the
screen becomes the ultimate prize and every boundary becomes a negotiation.
THE-STORY.md pillar 4 is updated only when the build ships, so the story never
describes something that does not exist yet.

## Phase 1: the tiers (migration 223 plus enforcement)

**Migration 223_star_time_tiers.sql**, one new table `child_time_settings`
(idempotent, flat statements, no apostrophes in seeded text):

- `core_minutes_daily int default 0` unconditional daily recreation, parent
  set. Default 0 so existing families see no behaviour change until the parent
  turns it on. Suggested values shown in UI by age band (roughly a third of
  the age guide).
- `bedtime_start time` and `bedtime_end time`, defaults by age band (4 to 7:
  19:00 to 07:00, 8 to 10: 20:00 to 07:00, 11 to 13: 21:00 to 07:00, 13 to 15:
  22:00 to 07:00, 16+: null). Parent adjustable.
- `protect_mealtimes boolean default false` (advisory windows 07:30 to 08:00,
  12:00 to 12:45, 17:30 to 18:30 when on).
- `protect_school_hours boolean default false` (Mon to Fri 08:45 to 15:15,
  term time aware via the existing school holiday helper).

**Enforcement** in the three timer paths (app/api/quests/time/start,
time/parent-start, quests/spend):

- Child self start inside a protected window converts to an ask to the parent,
  exactly the existing gentle brake pattern. Never a flat block (non
  negotiable 1), but the default answer at midnight is no longer the timer
  starting. Push copy to the child: "Screens are resting now. Ask a grown up
  if it is important."
- Parent started sessions and gifts still work inside a window (the parent is
  the override, a film that runs past bedtime on a Friday is their call), but
  the session is tagged `in_protected_window` so the weekly review can name it
  gently.
- Core minutes draw down before stars in the spend order (core first, then
  stars, then holiday bank), so the baseline is truly unconditional and the
  child sees stars last longer.

**Child app UI**: the timer screen shows the three tiers plainly. "Your free
time today", "Your earned time", and during a protected window the sleeping
screen state. Checker tokens, Nunito, mobile and desktop checked in Chrome
DevTools before done.

**Parent UI**: one settings card on the child page, "Time that is always
theirs, time they earn, time that is protected." Three controls, no jargon.

## Phase 2: clean the reward hooks (no migration needed)

Evidence rule: reward only what a child can control and do, never mood or
compliance.

- Template "Screen off first ask" renamed to "Finished screen time and handed
  it back" (the controllable act is the handing back, not the first ask
  compliance).
- SpotSomethingGood chip "A great attitude today" replaced with "Kept going
  when something was hard" (controllable persistence, not disposition).
- Fair play green week star: decouple from the parent answer. The star goes to
  a child whose own sessions all ran through the timer that week (their
  controllable act), not to every child when the parent reports a green house.

## Phase 3: the fade, spec only this week

The ladder from parent regulation to shared regulation to self regulation,
staged by the existing stage bands. Build later, spec now so the tiers are
designed with it in mind:

- Stage 1 to 2: parent sets everything (current behaviour).
- Stage 3: child chooses how to spend earned time across agreed activities,
  weekly digital budget view.
- Stage 4: caps become advisory, the weekly review becomes the mechanism, the
  system reports rather than gates.
- The per child star rate (today a deployment env, 1 star = 5 minutes) moves
  to `child_time_settings.star_minutes int default 5` in phase 3, already
  named as a follow up in lib/quests/templates.ts.

## Review

Diff checked against review.md before push. Migration idempotent and additive.
No dashes in any copy string. Scripts stay in the database. The evidence pack
is the source for any public claim about this build.
