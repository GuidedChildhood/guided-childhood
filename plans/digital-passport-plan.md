# Digital Passport plan (23 Jul 2026)

Owner: session claude/continue-build-ldot8v. Mobbin MCP offline this session, so
designing on our held references (GoHenry, Greenlight, Finch, Good Inside) and
the existing PassportBook pattern. No dashes in any copy. Planet Friends art from
lib/content/stage-characters.ts. Reference maps captured from two Explore passes.

## What Justin asked for (verbatim intent)
1. Rename and merge: the Progress tab becomes **Digital Passport**, covering both
   progress and the passport. Keep the pathway road diagram (you are here) and
   sit it **alongside** the passport.
2. Clear icon per stage, DiGi hovering over the current stage.
3. The ten minutes a day adds a stamp to each passport stage.
4. Per stage, an ordered checklist that is a tick or a click to do:
   1. correct device setup first, only devices they actually use, alert if a
      device is ahead of their age (a smartphone for a 4 year old).
   2. any moments or issues to resolve (click to how).
   3. lessons completed relevant to their age and tests passed.
   4. jobs done on time and routines done (the new jobs streak stamps here).
   5. balance of device use vs guidance, jobs and offline.
   Each links to the right page and to how to improve, with reassurance, and a
   running percentage total per stage.
5. Device settings age related, not all 19. Only the devices for their age.
6. Show the relevant Planet Friend character on each passport page.
7. Fix the daily done logic bug (ten minutes shows done when the DiGi step is not
   done) and confirm it resets each day.
8. Physical: link to get the passport printed by a supplier as a chargeable add
   on, sticker sheets per stage, plus Croc charms and plush. (Research done, see
   plans/physical-rewards, suppliers brief in session notes.)

## Current code (post PR #464 and #478 on main)
- Progress page: `app/(dashboard)/dashboard/tracker/page.tsx` (h1 "Is it working?").
- Stage cards: `components/pathway/LiteracyAreas.tsx` + `lib/pathway/literacy-status.ts`.
- Passport flip book: `components/pathway/PassportBook.tsx`, per stage progress
  from `lib/pathway/progress.ts` (`getAllStagesProgress`, blend
  lessons*0.4+scripts*0.3+streak*0.15+devices*0.15).
- Pathway road: `app/(dashboard)/dashboard/pathway/page.tsx` (PR #464 put the
  passport book under the road here).
- Characters: `lib/content/stage-characters.ts` (Pebble/Bloop/Orbit/Nova/Cosmo).
- Jobs streak: `lib/pathway/jobs-streak.ts`, credits `children.streak_weeks`.
- Daily done bug: `app/(dashboard)/dashboard/page.tsx` dayDone formula
  (`spent >= dailyBudget || stepsAllDone`) plus TodayPathBig/Strip mirrors; the
  strict signal is `daily_sessions.completed_at` (tracker already uses it).
- Device age gating: `lib/pathway/literacy-status.ts` deviceAgeToStageNum; no
  ownership filter and no ahead of age alert yet. Ownership status lives on
  `device_setup_progress.status` ('done'|'not_owned', migration 090).

## Build slices (small PRs, merge same day)
- **Slice 1 (this PR): the shell.** Rename Progress nav to Digital Passport.
  Bring the pathway road onto the page above the passport so map and stamps sit
  together. Put the Planet Friend for each stage on its passport page. Wire the
  jobs streak into the stage stamp. Keep LiteracyAreas for now.
- **Slice 2: the five section per stage checklist** with running percent, tick
  or click to do, links to fix, reassurance. Replaces the four fixed passport
  tasks. Device section age and ownership filtered with an ahead of age alert.
- **Slice 3: daily done fix + tangible DiGi step.** Gate done on the pathway
  session, not a minutes threshold. Rebuild the DiGi daily step (fresh start,
  suggested asks from recent moments, first time issue capture, done to a Good
  Inside style self care note). Confirm daily reset.
- **Slice 4: physical add ons.** Printed passport via Prodigi API (chargeable),
  sticker sheets, charms and plush as keepsakes. Research already gathered.

## Notes
- 10 min to stamp: a completed daily_session for the day increments a per stage
  stamp count; the visible stamp fills as the stage accrues its days.
- Ahead of age alert: `device_guides.min_age` above the child age flags a gentle
  heads up on the device section, never a block.
- decisions.md append after Slice 1 merges.
