# Add a job: its own page, three tabs, and a count that finds you

Justin, 31 July, testing on Chrome. The build side of the restructure written up
in `week-of-2026-07-30-app-protocol-and-nudges-plan.md` under "The quests
restructure (31 July)". Read that first; this file is only what this PR builds.

## The one sentence

Adding a child job is the most important thing on this surface and it is the
thing the layout gets in the way of.

## What is actually there now, checked before writing this

`/dashboard/quests/manage` already exists as a real page, and the Manage jobs
tile already points at it. So "manage jobs is a tab, not a page" is half fixed
already. What Justin photographed is the page itself: `ManageJobs.tsx` is one
long unbroken stack, and the composer is followed by a used before chip row,
then six ideas, then a show all toggle. Two screens of chips between the parent
and the board. Landing is correct, the arrival is not.

Also there now, and not to be rebuilt:

- multi add, the schedule and band persist between adds
- repeats: every day, school days, weekends, once
- bands, migration 133, `band` column and `bandForQuest`
- cancel, `removeQuest`, a button per job
- `schedule_days` is an array, so "Tuesday only" already stores
- the soft guide at five jobs

The job model is finished. This is layout and navigation.

## Build

**1. Three tabs on the add a job page.** The page holds three different jobs
and currently stacks them, so the one with a deadline sits above the one you
came for, or below it, depending on the day.

- Add a job. The composer, and it opens here.
- Waiting for you to agree. Ticks the child has sent up.
- Waiting for the child. What is on the board, not done yet.

The composer tab opens first and the input is the first thing under the tabs.
The idea chips come after the board summary, not before it.

**2. A red count on the way in.** Jobs waiting to be agreed are the only thing
here with a person waiting at the other end. `QuestShortcuts` already reads
`ticksToConfirm` and renders it as a quiet neutral badge, same as every other
tile. Agreeing is not the same kind of thing as "2 waiting" printables, so it
gets the notification red, and the tab inside carries the same number.

**3. The screen time card off the top.** `ParentDeviceTime` opens the Quests
page full width. It is a good card in the wrong place: a parent opening Quests
came for the jobs. Smaller, to one side, still reachable in one tap.

**4. Manageable from the board.** The dashboard board should add and agree
without going into the page first.

**5. The star total says which minutes are which.** `QuestBoard.tsx:260` reads
`⭐ 116 = 580 min of screen time left`, which is this week's allowance and the
holiday bank added together with no seam. The bank is deliberate: earned above
the weekly cap, spendable only while school is out, never expiring
(`lib/quests/holiday-bank.ts`). In August that is the feature working and it
reads like a runaway number. Split the two, name the bank, say when it unlocks.

## Reference

Superlist, Justin's own pick, three screens in the 30 July plan: quick add with
chips under the input, a chip that resolves in place without leaving the card,
added items stacking with the keyboard up. Grok for the live count beside the
composer, Tiimo for the value pill per row.

## Also in this PR: the printed passport button moves onto the passport

Justin, same day: "maybe this button should be a smaller version in corner of
actual passport?"

Right, and it fixes a second thing at the same time. "Have this passport
printed" is a full card sitting under the passport competing with it, while
`PassportBook.tsx` carries no shop link at all. So a page gets stamped, the
celebration fires, the stamp slams, and then nothing is said to the one person
in the product most likely to want the real booklet.

A small affordance in the corner of the passport itself, and the separate card
goes. `PassportBook` already knows which pages are newly stamped, because that
is what drives the slam, so the moment to say it is already detected.

Quiet is the whole requirement. A booklet offered the instant a child earns
something has to read as an offer and never as the point of having earned it.

## Not in this PR

Holiday job sets and the spotlight registry. Both written up in the 30 July
plan, both separate work.
