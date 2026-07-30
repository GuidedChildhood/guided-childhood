# The child app: five a day, streaks, and no scrolling

29 July 2026. JP, after testing on Yusuf's phone:

> "If we have these tabs here at top we don't need them scrolled down, although
> the quest below goes to add a job, so can we just make them all tabs at top so
> no need to scroll, and a navigation back to menu, all tabs, and make sure
> nothing is lost, just under the right tabs.
>
> Can we do a full review of the child pathway and make it 5 steps per day.
> 1 making sure jobs are done that parent has sent and outstanding. 2 any lessons
> to do. 3 do age related quiz. 4 when pressed will check if balance of jobs and
> device is good. 5 is add a new job request to parent and link to this, they do
> this, and once the system knows they sent a job from this point a big
> celebration animation and 1 streak achieved. Now guru start the best day so
> scrolls down to start new day and mix up same, throw in any lessons not done
> and homework task reading 10 mins. Can you plan these changes but review
> Duolingo and Mobbin and devise best system, ask me any questions. It needs to be
> simple and earn streaks, and clear 5 streaks equals stickers of older friends,
> and once 5 streaks let them appear on app so clear they achieved. This is to
> encourage offline tasks and can earn extra minutes for weekend."

Planned rather than started, because two parts change the shape of the whole
screen and one of them contradicts the Mobbin evidence in a way worth settling
before a line is written.

## What the screen is today

One file, `app/k/[token]/KidQuestScreen.tsx`, 2,840 lines, three internal tabs
(`quests`, `lessons`, `print`) buried two thirds of the way down, plus a tile grid
and a long vertical stack. Sections currently on it, all of which have to survive:

Today list (jobs plus Learn and Move) · Use my time and the device timer · My path
· My lessons · Our deal · Make it mine · Ask for a job (now its own page) ·
Printables · Coming up on other days · the streak bar · the reminders prompt ·
the squad intro · the balance and stats.

## Mobbin, and where it disagrees with the ask

Duolingo's Daily Quests is the closest proven pattern to "five steps per day", and
the shape is worth copying almost exactly:

- [Daily Quests panel](https://mobbin.com/screens/0b1b367c-1d8c-493f-8d77-d1d895ae613d):
  three or four rows, each ONE line of text, its own thin progress bar, and a
  chest on the right. A countdown on the header says how long the window lasts.
- [Quest point earned](https://mobbin.com/screens/60b2c7e0-b3c5-4ebe-ae99-976f7cb8ece6):
  finishing one shows a small takeover with the list and the bar that just moved.
- [Streak day one](https://mobbin.com/screens/e319cd42-df5e-4862-ad4a-9cffdc5234d2)
  and [day five](https://mobbin.com/screens/84ec5a7b-37ce-4c38-808d-7c3c91c3c0aa):
  a full screen takeover, a huge number, "N day streak", and a week strip Mo to
  Su with ticks so a child sees the run rather than a bare count.
- [Day six](https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88) names
  tomorrow: "Tomorrow makes 7 days, let's go."

## Navigation: settled, and JP was right

I first recommended a bottom bar over top tabs, on the strength of Duolingo,
GoHenry and Finch all using one. JP's reply corrected the question:

> "Just checking this is just the child's app, as we have tabs at the top at the
> moment."

He is right, and it changes the answer. The child app ALREADY has a tab strip
(`quests`, `lessons`, `printables`). The problem was never that tabs were the
wrong pattern. It was that this strip sits **1,570 lines into the page**, inside
the scroll, so a child has to scroll down to reach the thing that navigates.

The proof was already in the code: **six separate places called
`scrollIntoView` on `#kid-tabs`** to drag a child back up to it. Six workarounds
for one placement problem, each of them moving the page under a child's thumb to
reach a control that should never have been out of reach.

So the fix is to pin the existing strip rather than invent a second navigation
system. Sticky is done (`position: sticky, top: 0`), opaque so it stays readable
over moving content, with a shadow so it floats above the list. No bottom bar and
no new pattern for a child to learn.

### But sticky alone does NOT fix it, and this is the number that matters

Measured on the real page at 390px: **the tab strip sits 2,384px down the
document.** Sticky only engages once a child has scrolled TO it, so it does
nothing at all for the 2,384px above. Verified: at `tabs+0` the strip is 1,290px
below the fold, at `tabs+900` it pins at 0.

So the strip being sticky helps a child who is already deep in the page and does
not help the child Justin is describing, who opens the app and wants to switch
section. Claiming this as done would have been wrong, and only measuring caught
it: the CSS is correct and the outcome is still the complaint.

**Why it cannot simply be moved up.** Everything from the header down to the strip
renders on EVERY tab: the welcome, the streak bar, the Today list, the tile grid,
the ask card. Only the section BELOW the strip switches. So today the page is one
long always on stack with a tab controlled tail, and moving the strip above the
stack would put tabs over content the tabs do not control, which is worse than
where it is.

The real fix is the restructure in step 3 below: the always on stack becomes the
content of the Quests tab, so the strip can sit directly under the header and
genuinely switch between three sections. That is what makes "no need to scroll"
true rather than nearly true.

Worth keeping two things. When the code contains several workarounds for the same
inconvenience, the workarounds are the bug report: six `scrollIntoView` calls were
sat there all day and I read past every one of them. And a correct CSS change is
not the same as a solved problem, which only a measurement tells you.

## The five steps

One card, five rows, in this order. Each row is one line, a state dot, and a tap
target. Nothing else on the first screen.

| # | Row | Done when | Where it goes |
| --- | --- | --- | --- |
| 1 | Your jobs | every job due today is ticked | inline tick, stays on screen |
| 2 | A lesson | one lesson passed today | `/k/<token>/lessons` |
| 3 | Today's quiz | the age quiz passed | the quiz, stage appropriate |
| 4 | Check my balance | opened and read | the balance page |
| 5 | Ask for a job | one idea sent | `/k/<token>/suggest` |

Step 4 is the interesting one, and JP's wording is exact: "when pressed will check
if balance of jobs and device is good." So it is not a task, it is a look in the
mirror. It opens the balance, shows jobs done against device time used, and says
plainly whether it is in a good place. It completes by being read, because a child
cannot be asked to hit a number they do not control.

Step 5 last is deliberate and is JP's design: the day ends with the child offering
to do something, not with them consuming something. That is the whole product in
one row.

**All five done → the streak.** Full screen takeover, the huge number, the week
strip, and a line naming tomorrow. Copy the Duolingo shape, in butter and ink with
Nunito, never their green.

## Streaks to stickers to weekend minutes

JP: "clear 5 streaks equals stickers of older friends, and once 5 streaks let them
appear on app so clear they achieved ... encourage offline tasks and can earn extra
minutes for weekend."

- 5 day streaks → one sticker of an older squad friend, which then APPEARS on the
  child's app. Visible proof, not a number in a table.
- The same 5 also unlock extra weekend minutes.

This collided with the star economy plan, where unused minutes already convert to
sticker credits. Two earn paths into one book would have filled it twice as fast
as the month long pacing assumes.

**Decided, JP, 29 July: split them.**

- **Unused minutes buy sticker book pages.** Rewards restraint, which is the thing
  the product exists to teach: the child who uses less gets more.
- **Five streaks earn an older squad friend.** Rewards showing up five days
  running, and the friend then appears on the app as visible proof.

Two currencies, two different lessons, one book holding two kinds of thing. The
thresholds in `plans/star-economy-weekly-reset-plan.md` stand unchanged, because
only the minutes feed them.

## "Start the best day", and mixing it up

JP: "now guru start the best day so scrolls down to start new day and mix up same,
throw in any lessons not done and homework task reading 10 mins."

Steps 1, 4 and 5 are fixed every day, because they are the habit. Steps 2 and 3
rotate from a pool so the day is not identical:

- any lesson not yet done for the stage
- the age quiz
- reading ten minutes
- a homework task
- a printable already sent by the parent
- a movement task

Rotation seeded by the date and the child id, so it is stable within a day (a
refresh must not reshuffle a half finished list) and different across days.

## Build order

1. **The day model.** A `kid_day` row per child per date holding the five steps
   chosen, their state, and whether the streak landed. Without this the list
   reshuffles on refresh and a streak cannot be proved. Migration needed, number
   claimed at PR time.
2. **The five step card**, replacing the tile grid and the long stack as the
   first screen. One screen, no scroll, at 390px.
3. **The strip to the top, for real.** Fold the always on stack into the Quests
   tab so the tab strip can sit directly under the header and actually switch
   sections, then delete the six `scrollIntoView` workarounds. This is also the
   "nothing is lost" audit, done against the section list above, and it is the
   step that makes the 2,384px go away.
4. **The streak takeover**, full screen, week strip, names tomorrow.
5. **Streak to sticker**, five streaks to an older friend, appearing on the app.
6. **Weekend minutes** from the same five, once the star economy split is settled.

Steps 1 to 4 are a week. 5 and 6 depend on the currency question.

## A missed day: decided

**JP, 29 July: the run starts again, and everything already earned stays.** No way
to buy a streak back, no freeze to sell.

Duolingo resets to zero and then sells you a streak freeze, which is the exact
pressure the ICO Children's Code names and the exact pattern this product exists
to be the alternative to. A child who misses a Tuesday because they were ill has
not failed at anything, and a product that makes them feel they have, then offers
to sell the feeling away, is not one we are building. The stickers are earned and
they are kept.

## Still open

**How many extra weekend minutes for five streaks?** Needs to be small enough that
the weekly cap still means something. 30 minutes is my suggestion: noticeable to a
child, and well inside one week's recommended allowance so it cannot undo the
guideline the whole balance system is built on. Not a blocker, because it is one
number and it lands last in the build order.
