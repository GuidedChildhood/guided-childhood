# Finishing a stage: the last week, the celebration, the keepsake, the monthly nudge

**2 August 2026.** Lane: platform. Migration claimed: **152**.

Justin, in three messages, describing the same thing:

> "jobs done and balance are all measurable to make sure we run the last week of
> stage then if all done we have big celebration and put the stamp relevant
> family character and link to buy the passport with first stamp in and the
> stickers for each stage for parent to manage plus they can order after each
> stage, we need to gently remind monthly parents on the progress and what needs
> to be done"

And earlier, on the ramp: passport completion at each stage should be the ramp
towards handling social media, AI and devices by 16.

---

## What already exists, and it is more than expected

**The celebration is built.** `PassportBook` line 123: the first time a page
crosses to earned it gets a stamp slam, a burst and a gentle buzz, and later
visits stay calm. That is exactly the "big celebration" and it does not need
rebuilding.

**The monthly channel is built.** `/api/email/monthly` runs and sends
`monthlyBalanceEmail`. The cadence Justin wants already has a cron.

**The products exist.** `lib/shop/catalogue.ts` has the printed passport at
£14 and per stage stickers, with `ProductKind` covering both.

**The quiz table exists.** `stage_quiz_passes`, migration 098, with score,
total and passed, and `lib/pathway/stage-quiz-status.ts` already reads it.

So this is four pieces of wiring between things that are already here, not four
new systems.

---

## What is missing, in the order I would build it

### 1. The celebration only exists on one device

`CELEBRATED_KEY` is localStorage. So a stage celebrated on a phone celebrates
again on the laptop, and clearing storage celebrates a two year old stage as if
it happened this morning. Worse for what Justin wants next: **there is no server
side record that a stage was ever completed**, so nothing can hang off it. No
email can mention it, no shop offer can follow it, and the founder board cannot
count it.

Migration 152, `stage_completions`: user, child, stage, completed_on, and the
five row percentages as they stood. One row per child per stage, written the
first time all five go green. Everything below reads from it.

### 2. The last week of the stage

Justin: "run the last week of stage". A stage is an age band, so its last week
is knowable from the birthday, the same way `transitionFor` already computes the
Year 6 window from a date of birth.

In that week the passport shows a review rather than a checklist: what went
green, what did not, and **what carries over into the next stage to keep an eye
on**. The carry over is the honest part. A stage that ends with two rows amber
should say so and follow those two forward, not quietly reset to zero.

### 3. The keepsake, at the moment it means something

The celebration currently ends. It should offer the printed passport with this
stamp already in it, and the sticker sheet for the stage. Not a shop banner
bolted to the page, the offer that belongs to the thing that just happened.

Justin: "plus they can order after each stage". So the offer repeats per stage
rather than being a one time upsell at stage one.

### 4. The monthly nudge, which is the ramp made visible

`/api/email/monthly` already sends. It should also carry: where this child is on
the ramp, which of the five rows are open, and the one thing worth doing next.

**Monthly, not weekly, and this is deliberate.** A stage lasts two to three
years. Fifty two nudges a year against a goal that moves that slowly makes every
one of them meaningless and teaches a parent to ignore the app. Twelve is a
prompt. The ramp itself lives on the passport page where it can be looked at any
time, and the email points into it.

---

## The two rows Justin says are measurable, and he is right

**Jobs**: `quest_ticks` over the last 60 days, already computed in
`passport-sections.ts`. **Balance**: `device_sessions` against the
recommended daily minutes, already computed. Both are real counted things, so
both can gate a stamp honestly.

**Moments and lessons cannot yet**, which is the open question from earlier
today and is deliberately not solved here:

- A moment completion is a tick on a date, not a verdict. `digi_outcomes` from
  migration 147 already has the verdict loop and moments should use it.
- Lessons have no child facing quiz, though `stage_quiz_passes` is waiting for
  one.

Both are their own plans. This one is about what happens when the five rows do
go green, and it holds whatever the rows come to mean.

---

## Rails

- **A stamp is never awarded automatically for time passing.** Turning nine does
  not complete stage two. If the rows are not green at the end of the stage, the
  page says what is still open and carries it forward.
- **Never a flat instruction.** The carry over is a thing to keep an eye on, not
  a failure, and the wording has to carry that or a stage end becomes a report
  card on a parent.
- **The shop offer is an offer.** It appears once per stage completion and never
  blocks the celebration.
- **The monthly email is one email.** It does not become a second digest.

---

## Order of work

**This pass.** Migration 152 and the server side record, so the celebration is
once per family rather than once per browser, and so anything can hang off it.

**Then.** The last week review and the carry over. Then the keepsake offer at
the moment of the stamp. Then the monthly email gains the ramp.

Nothing after the first is worth building before there is a real
`stage_completions` row to read, because all of it hangs off that one fact.
