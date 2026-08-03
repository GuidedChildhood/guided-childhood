# The parent's home: one path, one live thing, and pop ups that cost something

**3 August 2026.** Lane: platform, parent side. No migration needed.

Justin, holding up Duolingo's home screen:

> "when you open Duolingo first time it has pathway only on Home Screen scroll,
> this is neat. I like pop ups we have like this week once a week and anything
> urgent, but after pathway is done for the day it should move away leaving all
> the next important tabs. We can then use the pop up for urgent stuff like
> click quests, run timer etc. Thoughts?"
> → **"Yes parents and let's go as advised"**

---

## The problem, as a number

`app/(dashboard)/dashboard/page.tsx` renders these, in this order, before a
parent has scrolled:

    ChildSwitcher · WeeklyReviewCard · DigiWelcomeSheet · MissionWelcome
    ChildAppNudge · DealReviewNudge · LiveTimerChip · WaitingOnYou
    CommunityBite · nextUp · DayCheckup · TodayPathBig · RevealCard
    DigiFlashUp · SetupUnlockToast · HomeStats · PushPrompt · HomeMain
    FoldSection · DeviceSetupBanner · FoldSection · checkin · DiGi

Twenty three. Most are conditional, so no parent sees all of them, but the ones
that do fire compete for the same first screen with nothing deciding between
them. That is the whole of "I cannot tell what matters", and it is why the
weekly round up and the trial banner ended up stacked on top of each other in
Justin's screenshot with the actual day below the fold.

Duolingo's home has one job on it. Ours has twenty three candidates for the job.

---

## What the references actually do

Mobbin first, per the rule. Duolingo is the reference Justin brought, but it is
the weakest fit of the four, because Duolingo has no "somebody is waiting on
you" state at all. These do:

**[Airwallex, My tasks](https://mobbin.com/screens/183421be-24a2-47db-b692-a98293277b3a)** —
this is the whole answer in one screen. Five cards. Four read "You're up to
date" with a grey tick. One carries a yellow count and a chevron. Settled things
**stay visible as one quiet line**; only the outstanding one has weight. Nothing
vanishes, nothing shouts.

**[Deel, Upcoming actions](https://mobbin.com/screens/5b830b5a-6ccc-4d7e-a6b5-2f08e404a95b)** —
a fixed slot at the top that always exists, with its empty state written out
("No pending items to approve") and its button greyed rather than removed. A
parent learns where to look once and it is always the same place.

**[Greenlight](https://mobbin.com/screens/21cafe44-cc81-4953-ba5e-536506229f5a)** —
requests listed with the action inline on each row. Approve where you are
looking, which is the fix that just shipped for our own waiting panel.

**[GoHenry](https://mobbin.com/screens/b704341b-8bc3-4ec8-910c-33bd0f38f35a)** —
"2 money requests" as a compact count above the per child list. The multi child
shape, which Duolingo never has to solve.

All four agree with each other and with Justin: **one place for what is
outstanding, and settled things shrink rather than disappear.**

---

## The design

### One ordered stack, with a budget of three

**1. The live thing.** At most one, and only if a person is waiting on the other
end of it: a child asking for screen time right now, a timer running, a job
waiting on a yes. This is the only element allowed to be loud. Fixed slot, so a
parent learns where to look. When there is nothing, it is one grey line saying
so, Deel style, not an absence.

**2. Today.** The path. `TodayPathBig` already exists and is already the right
component; it just sits eleventh. It becomes the spine of the screen.

**3. When today is done, it collapses to one line** and the next thing rises
into its place. That is Justin's "moves away leaving all the next important
tabs", and the Airwallex screen is exactly what the collapsed state should look
like: a tick, a sentence, no drama.

Everything else moves below the fold into the existing tile grid, or goes.

### What happens to the other twenty

Three fates, and each one has to be decided rather than defaulted:

- **Folds into the live slot**: LiveTimerChip, WaitingOnYou, DeviceSetupBanner.
  They are all the same sentence in different clothes.
- **Becomes a row inside Today**: ChildAppNudge, DealReviewNudge, DayCheckup,
  PushPrompt, SetupUnlockToast. These are tasks, and Today is where tasks live.
- **Below the fold, or nothing**: CommunityBite, RevealCard, HomeStats,
  MissionWelcome, DigiFlashUp. Worth having, not worth the first screen.

DigiWelcomeSheet and WeeklyReviewCard are pop ups and are covered below.

### The pop up allowance

Justin: "we can then use the pop up for urgent stuff like click quests, run
timer etc."

**This is the one place I would hold a harder line than the brief**, and Justin
has already heard the argument and said go:

> A pop up is an interrupt. The moment one is spent on routine navigation, a
> parent learns to dismiss pop ups without reading them, and the next one that
> genuinely matters is dismissed with the same reflex. That is exactly how the
> weekly round up became invisible: it was one of five things springing up, so
> it got the same flick as the other four.

So the allowance is:

| Allowed | Why |
| --- | --- |
| The weekly round up, once a week | Justin's, and it expires: it is about a week that has finished |
| A person waiting right now | A child asking for time, a timer that just ended |

That is the entire list. "Go to quests" is a row on the page. The test is the
same one the red badge already uses: **is there a person on the other end of
this, waiting?** If not, it is not a pop up.

---

## Rails

- **Nothing vanishes silently.** Done collapses to a line with a tick. A parent
  who finishes the day and finds an empty screen thinks it broke, which is the
  same complaint Justin made about the round up disappearing on a Monday.
- **The live slot is never invented.** If nothing is waiting it says so. A slot
  that manufactures urgency to justify itself is the pattern this whole product
  exists to argue against.
- **One number, one meaning.** The badge work that just merged applies here: a
  count on the home screen and the count on the tile it points at are the same
  count or one of them is wrong.
- **No loss language.** Nothing on this screen tells a parent what they have
  failed to do. What is outstanding is stated plainly and once.

---

## Order of work

1. **The live slot**, with its empty state. Nothing else can be ordered until
   there is one place for "somebody is waiting".
2. **Today as the spine**, with the collapsed done state.
3. **Move the other twenty**, one at a time, each with its fate written down.
4. **Enforce the pop up allowance**, which is mostly deletion.

Step 1 and 2 are one PR. Step 3 is where the risk is, so it is its own PR and
its own review: twenty conditional components, each of which somebody added for
a reason, and the reasons are in the comments.

**Not in this plan:** the hard block at trial end, and the child push review.
Both are waiting on Justin. And the stage quiz stays next in the stated build
order once this lands.
