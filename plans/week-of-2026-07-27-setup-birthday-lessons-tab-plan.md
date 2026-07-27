# 27 Jul 2026: the birthday, a Lessons tab, and the loop back from a sheet

Branch `claude/guided-childhood-build-cknxds`, based on `claude/continue-build-ldot8v`
(PR #555) because tasks 1 and 3 both edit the welcome that PR rewrote. Until #555
merges my PR carries its two commits; after it merges the diff is mine alone.

Lane: platform code. Open PRs at claim time: #555 (welcome, migrations 114/115),
#556 (pace maths, quests board lessons tile, screen time claim). Neither touches
`NavTabs`, `MobileTabBar`, `lib/setup`, or the learning sheet. No migration in
this lane, so no number to claim.

## 1. The birthday belongs in setup, not in the welcome

Today it is `BIRTHDAY_CARD` in `lib/home/welcome-cards.ts`, injected at the front
of the welcome deck whenever a child has no `date_of_birth`. Wrong home. Setup is
where a parent looks for what is missing, and the birthday is the parent's job.

- New flag `birthday` in `SetupFlags`, new step in `STEPS`, computed in
  `getSetupState` from the children rows.
- The step is conditional the way `childLink` is: it only enters the path when a
  child on the account actually has no birthday. A family who filled it in at
  onboarding must never be shown a step they cannot complete or un-complete.
- Remove `BIRTHDAY_CARD` and the `needsBirthday` plumbing from the welcome, Home
  and `pickWelcomeCards`.

## 2. Lessons tab, desktop and mobile

`/dashboard/lessons` has no desktop tab at all and only a chip in the mobile
secondary row. Add it before Quests in `NavTabs` and `MobileTabBar`.

Six tabs across 360px is the risk. Measure it, do not assume: the icon pill is
44px wide and "Passport" at 12px is the longest label. Harness the real CSS at
360px and 320px in Chromium and read back the label widths.

## 3. The welcome hands over to DiGi, then Home

Primary action goes to `/dashboard/digi` carrying the day's prompt, so the front
door on a welcome day is hello, one conversation, Home. Later still goes straight
to Home. Sun, Tue, Thu and Fri have no welcome, so they keep no detour.

Each card gets an `ask`: the question a parent would actually put to DiGi about
that service. DiGi already sends a `?q=` question straight away.

## 4. The passport clean up

Justin asked in an earlier session and the request is lost. Ask him what is wrong
with it, or get a screenshot. Screenshots have worked well today.

## 5. A finished sheet offers a quest for the tricky bits

The loop that turns a printable into something a family comes back to. On the
done panel of `LearningSheet`, when something is flagged, offer to turn exactly
those objectives into one quest. New route modelled on
`app/api/moments/make-quest`: read the flagged objectives back from
`curriculum_objectives` by id, hand DiGi the verbatim lines, insert one
`family_quests` row, push it to the child.

Two rules. Only the objectives that came back validated from
`/api/learning/complete`, never the client's list. And the quest lands on the
child's phone, so it is practice in the child's voice and never a report on what
they got wrong.

## Traps to respect

- The MissionWelcome overlay has resisted every fixture. Check it in the real app.
  It only shows Mon, Wed, Sat.
- No doubled quote in a migration: `chr(39)` for apostrophes, `chr(59)` for
  semicolons. No migration in this plan, so nothing to trip over, but the rule
  stands for anything added later.
- No dashes in copy.
