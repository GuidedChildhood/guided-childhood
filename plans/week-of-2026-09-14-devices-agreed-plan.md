# Devices agreed, so a stage is never permanently locked

Justin, 17 September 2026, looking at the passport:

> On the passport it says devices first but we should have over use if parents
> decide not to do it? Maybe override which just means a note added device
> settings agreed but set trust child maybe? As don't want to force then never
> able to complete stage of passport.

Then, when I put the option to him: **"Yes go on devices agreed."**

## The problem, precisely

`devicesPct` is a real gate. The passport reads it, the stage ring reads it, and
a stage cannot read complete while it sits short. Today a device has exactly two
honest answers:

- `done`, the settings walkthrough has been worked through on that screen
- `not_owned`, we do not have this

A family who has a Switch, has talked about it, and has decided together that
this one runs on trust rather than on parental controls has no answer. Their
choices are to lie (tick set up), to lie the other way (say they do not own it),
or to leave the stage short forever. All three are worse than the thing they
did, which was parent well.

That is also a philosophy problem, not just a counting one. We never allow or
deny. A product that only counts restriction as progress is a blocking app with
better manners.

## The answer: a third status

`agreed`, beside `done` and `not_owned`.

- It **counts for the passport exactly as done does**. `progress.ts` and
  `passport-sections.ts` already counted `status !== 'not_owned'`, so the stage
  unlocks there with no change to the sums. **`journey.ts` did not**: it asked
  for `status === 'done'`, which the new guard caught. Left alone, an agreed
  screen would have counted on the passport and not on Home, so Home would have
  said "2 of 3 set up" while the passport said "All set" about the same three
  screens. Fixed to the same rule as the other two.
- It **carries one line of what was agreed** instead of a walkthrough, written
  by the parent. That line is the point: the record says a decision was made,
  not that a job was skipped.
- It **reads differently everywhere**. The row says Agreed, in gold rather than
  green, with the note under it. The passport row says Agreed rather than All
  set. Nobody should be able to glance at this and think the settings are on.

## What gets built

1. **Migration 306** adds `device_setup_progress.agreed_note text`. The status
   column has no check constraint, so the third value itself needs no DDL. Read
   and write both guarded, because migrations are run by hand here.
2. **`app/api/devices/complete/route.ts`** accepts `agreed` in `STATUSES` and a
   trimmed, capped `note`. Its DELETE path stops asking for `status = 'done'`
   when it works out whether any other screen still holds the guide up, so
   unticking one screen cannot pull the board out from under an agreed one.
3. **`GuideBody`** gains a third, quiet option under the two buttons: we have
   agreed this one instead. It opens a short note field with three one tap
   starters and a Save.
4. **`YourScreens`** renders the agreed state on the row: Agreed, gold, note
   underneath, and the guide still openable so a parent can change their mind.
5. **`passport-sections.ts`** says Agreed rather than All set when any counted
   device is agreed, and the help line explains what that means.
6. **`GuideBody`** stops saying "Marked as set up" over an agreed screen. The
   button goes gold and reads "Set the settings up too", because the settings
   are still the open action there and the row already counts.
7. **The summary line above the list** says "3 of 4, 1 agreed" rather than
   "4 of 4 set up". It is read before any row, so it has to tell the same truth
   the rows do.
8. **A guard**, `scripts/check-devices-agreed.mjs`, mutation tested to 100 per
   cent (31 of 31), wired into CI. It holds the things that would rot quietly:
   agreed counts as done in all four readers, the API accepts it, the DELETE
   sweep does not filter on `done`, the toggles do not read an agreed screen as
   ticked and delete the agreement, every surface says Agreed rather than All
   set, an empty note cannot be saved, and no dashes.

## Migration number: 306, and how that was settled

Two sessions claimed **304** on the same evening, PR 1109 at 21:15 and PR 1110
at 21:17. The filenames differ, so nothing conflicted and both merged. Main
carried `304_first_checkin_acknowledge.sql` and `304_school_promo_dismissal.sql`
at once, which left their order undefined and turned `wiring` red on main.

I started renumbering mine to 305 while that was still in flight. That was the
wrong half to move: PR 1110 merged first at 22:10, so `304_first_checkin_
acknowledge.sql` keeps 304, and PR 1112 renumbers the school one to **305**.
The renumber commit was dropped and this branch was restarted from main.

So the free number really is **306**, and it is claimed in the pull request
title at the moment the branch is pushed, which is the half of the CLAUDE.md
rule that both 304 claims skipped: check every OPEN PR, not just the directory,
because the directory cannot see work that has not merged yet.

## What does not move

The instrument. Nothing here touches what a device guide says, what the settings
do, or how any other part of the passport is counted. `devicesPct` is the same
arithmetic over the same denominator. A family who does the settings sees exactly
what they saw before.
