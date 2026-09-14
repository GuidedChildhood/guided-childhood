# 14 September 2026: the deal ties together, and DiGi says hello properly

Justin, 14 September 2026, from the Monday walkthrough on his phone, four
screenshots: "on daily tasks we have add a job and we need to give a note
when they add a job that it can add screen time or just mark as family task.
We also need to build in the family agreement at the time they ask to use
the device so it all ties in. Can we say when they have added the
recommended amount of tasks that this is maybe enough for the first week,
let your child get used to the agreement, then add life tasks. Also on the
device timer it does need to get used to letting both know they are getting
to recommended use and if there is scope to earn more time with outside
tasks. Also the first ever intro is DiGi and it says welcome back, but the
first time should acknowledge and know it is the first time."

## What exists already (so nothing is rebuilt)

- Family jobs: `family_quests.is_family_job` (migrations 223 and 226), the
  API takes it on create and patch, the manage list has a chip to flip it,
  the approve route thanks without pricing. What is missing is the choice
  AT ADD TIME and any note that a job can be either.
- The healthy job load: `lib/quests/job-load.ts` has the sweet spot per age
  (3 to 6 jobs). The composer's nudge is a flat five, with no age and no
  first week framing.
- The agreement: `family_agreements` with sections (bedtime, how time is
  earned in extra_agreements) and the child already sees it in Our deal.
  The child's ask flow and the parent's yes box do not show it.
- The daily guide: `lib/quests/daily-guide.ts` gives under, reached, over.
  The child is told at reached and past; the parent's card speaks only at
  reached, over, or a treat. Neither says "you are getting close" or "there
  is room to earn more" before the guide is hit.
- DiGi's welcome sheet counts visits in `gc_welcome_count` but always says
  Welcome back.

## The build, one PR

1. **Add a job says what it is worth, and can be a family job.** In
   `JobComposer`, a worth row while the questions run: "Worth 1 star, that
   is 5 minutes of screen time" and a chip "Family job, no stars". The
   choice rides into onAdd and both parent pages send `is_family_job`. The
   confirmation names what landed. The child's jobs list shows a heart for
   a family job instead of a star count (the read gains the flag).
2. **Enough for the first week.** The composer's nudge becomes age aware
   through the real sweet spot: at the age's job count it says that is
   about right for the first week, let {child} get used to the deal, then
   add the life jobs. Both parent pages pass the age band and name.
3. **The deal at ask time.** The child's device time card gets `dealLines`
   (bedtime and how time is earned, from the agreement) and shows Our deal
   while they pick. The parent's active feed returns the same two lines and
   the yes box shows them; with no agreement, one line points to making
   one.
4. **Both told about the guide.** Child card idle and picking states and
   the parent's guide line gain the under and nearly there wording, with
   the earn more line when jobs are still to do (outstanding minutes on the
   child side, jobs left on the parent side).
5. **DiGi's first hello.** `DigiWelcomeSheet` takes `newFamily`; on the
   first greeting of a new account it says Lovely to meet you and what it
   is, instead of Welcome back. Home passes account age under a week.

Guard: `scripts/check-deal-ties-together.mjs`, wired into CI. Walk: the
fixtures at 390 and 1440 (add-job, device-time, digi-welcome, a new
parent-timer fixture for the yes box and guide line).

## Not in this PR

The agreement builder itself, the star rate, and any change to what the
guide numbers are. Copy only where the surfaces already exist.
