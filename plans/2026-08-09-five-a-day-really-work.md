# Making the five a day really work

Justin, 9 August 2026, from the child app, and then "yep take them over" once
PR 770 merged and the lane was free:

> "This should match app colours chosen ... also something kind just flashed off
> as soon as clicked so we need to make this really work and add a reminder
> somewhere and track if done somehow."

Three separate faults in one sentence. PR 770 is **merged**, so nothing here
collides.

## 1. Why "Something kind" flashed off

Not a glitch. It is what the code does.

Seven of the steps have `href: null` (`kind`, `maths`, `tidy`, `make`, `talk`,
`grownup_break`, `reading`). Those render as a button whose entire handler is
`mark(key)`, and `mark` optimistically pushes the key into `done` on the same
tick. The row leaves the live slot instantly and reappears as a slim struck
through line. **One tap, gone, no confirmation and no way back.**

Worse, the row is dressed as a navigation row. It carries the same `›` chevron
as the steps that really do open a page, so a child taps it expecting to be
taken somewhere and instead silently ticks off a thing they have not done.

That is not only annoying, it hollows out the whole day. A completed day banks
screen time minutes through `grantDayMinutes`, so today the entire five can be
cleared in about five seconds by a child who has done none of it. A list that
can be finished without doing anything teaches a child that the list is pretend.

**The fix: a self tick step opens, it does not tick.** Tapping opens a small
sheet that names the step, offers concrete ideas for it, and asks. "I did it"
confirms, "Not yet" closes and leaves the step exactly where it was. Only the
confirm marks anything. The `›` chevron comes off any row that is not a link.

## 2. Track if done

There is nothing to track against, and no one to show it to. **The parent has no
view of the child's five a day anywhere in the app.** A child ticks five things a
day, every day, and no grown up ever sees one of them.

Two parts:

- **Migration 181** adds `kid_days.notes`, a jsonb map of step key to what the
  child said they did. Keyed by step rather than a `kind_note` column, so the
  next self tick step that wants one costs nothing.
- **`FiveADayReport`** on the pathway page, under Is it working, which is the
  section that already asks that question. Today's five with what they said, and
  the last seven days as a strip so a run is visible without a scoreboard.

## 3. The reminder

A once a day push to the child, in the exact shape of `job-reminders`, which is
the restraint this product already settled on:

- one push per child per day, however many steps are open
- nothing at all when the day is done, so a child on top of it never hears from
  us
- only children with their own app and a push subscription, never a fallback to
  chasing the parent
- plain and factual about what is open. No streak at risk, no countdown. The ICO
  Children's Code is explicit that nudges must not be engineered to pull a child
  back, and the job reminder file already says so at length

**18:30**, after the evening job band at 17:45, with enough evening left to read
a book, do a kind thing or tidy a room. A reminder after the moment has gone is
just a telling off, which is the rule `job-reminders` was built on.

## 4. The colours

The live step wears `2px solid var(--terracotta)` and `0 4px 0
var(--terracotta-dark)`, and the progress bar is terracotta too. All three are
fixed, so a child who picked Ocean in Make it mine still gets a terracotta card.
Now `lib/kid/theme.ts` exists (earlier today), these read the child's accent.

## Not in this batch

The other self tick steps get the same sheet, because the fault is the shape of
the row rather than anything about kindness, but only `kind` gets a written idea
list in this pass. The rest carry their existing hint and the same confirm.
