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

**Where it disagrees.** Duolingo does not use top tabs. The reason the daily quest
panel needs no scrolling is not tabs, it is that the list is only three or four
rows. Five rows of one line each fits one phone screen with room to spare. So the
five step redesign solves the scrolling problem on its own, and top tabs would add
a row of chrome to a screen that no longer needs it.

Navigation to the other places (lessons, printables, stickers, timer, balance)
still has to exist, and every app in this space puts that in a BOTTOM bar, thumb
height: Duolingo, GoHenry, Greenlight, Finch. Top tabs on a child's phone sit
where the thumb cannot reach and compete with the browser chrome in a PWA.

Recommendation: five steps on one screen, no scroll, plus a bottom tab bar. That
delivers what JP asked for ("no need to scroll", "nothing lost", "navigation back
to menu") using the pattern the evidence supports, rather than the mechanism he
named. Flagged as a question below rather than assumed, because he asked for tabs
at the top specifically.

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

**This collides with the star economy plan and the collision needs deciding.**
`plans/star-economy-weekly-reset-plan.md` already has unused minutes converting
into sticker credits, approved tonight with the stretched thresholds. Now streaks
also produce stickers. Two earn paths into one book means the maths in that plan
no longer holds, and a child could fill the book twice as fast as intended.

The clean split, if JP agrees: **unused minutes buy sticker book pages** (restraint,
the thing the product exists to teach) and **streaks earn the older friends**
(showing up five days running). Different currencies, different lessons, one book
with two kinds of thing in it. Named as a question below.

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
3. **The bottom tab bar**, carrying every section that exists today so nothing is
   lost. This is the "nothing is lost" audit, done against the list above.
4. **The streak takeover**, full screen, week strip, names tomorrow.
5. **Streak to sticker**, five streaks to an older friend, appearing on the app.
6. **Weekend minutes** from the same five, once the star economy split is settled.

Steps 1 to 4 are a week. 5 and 6 depend on the currency question.

## Questions for JP

1. **Top tabs or a bottom bar?** Recommendation above is a bottom bar plus five
   steps that need no scrolling, because that is what Duolingo, GoHenry and Finch
   all do and because top tabs sit where a thumb cannot reach.
2. **Do streaks and unused minutes both feed the sticker book?** Recommendation:
   unused minutes buy pages, streaks earn the older friends, so the two rewards
   stay distinguishable and the month long pacing survives.
3. **How many extra weekend minutes for five streaks?** It has to be small enough
   that the weekly cap still means something. 30 minutes is my suggestion.
4. **What happens when a day is missed?** Duolingo resets to zero and sells a
   freeze. For a product about not manipulating children, my instinct is the run
   simply starts again with no loss of stickers already earned, and no way to buy
   it back.
