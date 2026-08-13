# The Setup Quest, and the check in that leads every visit

Justin, 13 August 2026:

> "welcome email should link to get set up and the reason why, and we should go
> to the setup page and this should be the next step. 1, a welcome greeting from
> DiGi which we have, then that goes to your first to do. This must start with
> check in. We need our check in to be the first thing they do on any sign in to
> the app if not done, so for a first ever sign in they need the first step as
> set up. That needs to go green once they have done each one. And remember the
> share to child, they can click no device for child for now and switch to the
> printable version of quests. We could call this Setup Quest on the setup page.
> If they have skipped any, needs to be an option. We need a weekly reminder to
> finish setup, or every now and again."

## What already exists, so nothing gets rebuilt

`/dashboard/setup` is real, with `lib/setup/steps.ts` holding seven steps and
`setupFlags` turning each one green as it completes. Home already carries a
compact card naming the next step and disappears when the list is done.

The seven, in their current order:

| Key | Step |
| --- | --- |
| `daily` | Do your first daily practice |
| `birthday` | Add your child's birthday |
| `push` | Turn on check ins |
| `quests` | Set up Family Quests |
| `school` | Set up school routines |
| `childLink` | Send your child their phone link |
| `agreement` | Build your family agreement |

So this is a reshaping job, not a new page.

## 1. The check in leads, on every visit, not just the first

Two separate things and both are Justin's point.

**First ever sign in:** the setup list IS the first to do. Home should lead with
it rather than offering it as one card among many.

**Every sign in after that:** if today's check in is not done, it is the first
thing. Not a nudge, the lead.

This depends on the change already written up in
`plans/tomorrow-duolingo-daily-and-passport.md` section 3b: the check in step is
currently conditional on there being live concerns, so a new family never sees
one, and the first check in is the BASELINE every later number is measured
against.

## 2. Setup Quest, in the Duolingo shape

Rename it, and draw it as a path rather than a checklist. The pieces are already
in the product:

- **A road, not a list.** `TodayPathBig` already draws a winding path with green
  done nodes, a ringed current node and DiGi beside it. The same component, the
  same language, seven nodes instead of five.
- **One step lit at a time.** Duolingo never shows you seven equal choices.
  Everything ahead is quiet, the next one is ringed.
- **Green stays green.** Already true through `setupFlags`.
- **A finish.** The last node is a chest, not a tick, and opening it is the
  moment the family agreement or the first star lands.

**Skipping is allowed and must not be a dead end.** A skipped step drops to the
bottom rather than vanishing, so a parent can always come back. Nothing here is
mandatory except the check in.

**The reminder.** Weekly, not daily, and it stops for good once the list is done
or once a parent has skipped the same step twice. A reminder that outlives a
decision is nagging.

## 3. No device for the child is a real answer

The `childLink` step already says "for younger children you do it together on
your device instead". That is the right idea buried in the middle of a
paragraph.

It becomes a **choice with two doors**: send the link, or no device for now and
switch to the printable quest chart. Both complete the step and turn it green.
Neither locks the other out later. Detail in
`plans/tomorrow-duolingo-daily-and-passport.md` section 0c.

## 4. Date of birth, not an age band, and this is the clearest call here

Justin asked: "should we ask the range of ages on starting sign in, or should we
ask for date of birth instead and determine their stage?"

**Date of birth, and the code already agrees.**

- `children.date_of_birth` exists and `lib/children/age.ts` derives the band from
  it, so the band is a VIEW of the birthday rather than a separate fact.
- `lib/learning/term.ts` needs the real date for the 31 August cutoff. Without it
  the app cannot say which school year a child is in, and it refuses to guess.
- The `birthday` setup step exists ONLY because onboarding asks for a band. We
  ask twice: once at signup for something we cannot use, and again later as a
  chore.

Asking for the birthday at signup:

- removes a setup step entirely
- puts the right school year in front of them from minute one
- stops a child silently ageing out of a band nobody updated
- keeps a band available anyway, because it is derived

Cost: a date is a slightly heavier question than a chip. Worth it, and month and
year is enough, which `settings` already supports through its month only toggle.

## 5. More than one child, at different ages

Already half built: `children` is a table, settings edits several, and
`ChildSwitcher` switches between them on the dashboard.

What setup does not do is ask for the second child. It should, once the first is
done, as its own optional step: **add another child**. Each child then carries
their own birthday, their own stage, their own quests and their own link or
chart. The daily loop still leads with ONE child at a time, because a loop that
asks about three children at once is a form rather than a habit.

## The email that starts it

The welcome email links to `/dashboard/setup` and says why in one line.

**It already exists**, and this is the answer to a question Justin asked twice.
`welcomeEmail` in `lib/email/templates.ts` opens "Welcome, Justin", is sent on
signup by `/api/onboarding/digi`, and carries the subject "Your first script is
ready". So the welcome and the first script email are the SAME email wearing the
wrong subject line, which is why the sequence looked like it was missing one.

It is a rewrite, not a new email. The plumbing, the unsubscribe, the send on
signup and the weekly floor are already there and working.

**It sends as `programme`, not transactional**, and that is Justin correcting me:

> "so if they get this welcome email the next email after that needs to be a week
> apart."

He is right. The rule is one email a week FROM ALL SYSTEMS, and a welcome is a
real email in a real inbox. Transactional would exempt it from the floor, the
programme would fire the next morning, and a new parent would get two emails in
two days. Sending it as programme stamps the shared clock in
`email_addresses.last_sent_at` and the existing six day floor pushes everything
else out by a week on its own. No new machinery.

Order agreed:

| When | Email | Kind |
| --- | --- | --- |
| On signup | Welcome, the pathway to sixteen, finish setting up | **programme** |
| A week later | Your first script is ready | programme |
| Trial ending | The founder offer | programme |
| Ongoing | The weekly programme | programme |

Consequence worth naming: "Your first script is ready" now arrives a week after
signup rather than the next day, because the welcome is doing the first touch.

### What the rewrite has to say

From Justin's brief, and the ordering matters more than the list:

1. Thank you for joining, plainly.
2. The destination: **safe and social media ready at sixteen**.
3. The shape: **ten minutes a day**, small tasks, a habit rather than a course.
4. The pieces, briefly and not as a feature list: scripts for the fights,
   lessons for the moments, AI and social media, printables.
5. The one that is genuinely ours, and it should lead the pieces: **jobs and
   chores earn the screen time, at the balance the research supports.**
6. The passport, filled in with the child, to sixteen.
7. One button: **finish setting up**.

His own question was whether to put all of it in the welcome or a bit each week.
A bit each week. The welcome names the destination and the shape and gives one
step. The weekly programme teaches one piece at a time. All of it at once reads
as a feature list, and what sells is the promise plus the first small move.

## Still to fix first

The lead nurture "free starter pack" email reaching people who have already set
up. Both lead programmes DO exclude members, but only on an exact email match,
so anybody who joined the waitlist with one address and signed up with another
keeps getting it. Fix: mark the lead converted at signup rather than trying to
match addresses later.

---

## The baseline, and the progress that follows it

Justin, 13 August 2026:

> "make sure we save the baseline so we know what they came in to the service
> concerned about, so we can really track progress and report it. I think we have
> that built, it just doesn't display very smartly at the moment, so can we
> revisit that as it lives on the passport page and it is a mess. The progress
> that follows the check in numbers changing etc. The check in we put for welcome
> is the check in we have already designed that we use every day."

**One check in component, two jobs.** Not a special first run screen. The same
daily check in a family uses for ever, and the FIRST time they complete it the
numbers it records become the baseline. Nothing extra to build on the input side,
which is the point: a separate baseline form would be a second thing to maintain
and would ask the same questions in different words.

**It is already stored.** `concern_events` (migration 164) holds
`score_at_start` and `score`, and `HowFarYouHaveCome` already reconstructs the
journey from them. So the data is right and Justin is correct that the fault is
the display.

**Half of that display was fixed on 12 August**: the concern list became a table,
live first, sorted folded, "8 to 9" instead of a sentence. What is still missing
is the part he means by "the progress that follows the check in numbers
changing":

- **Movement over time, not just start and end.** Two numbers cannot show a
  concern that got worse before it turned. The events are all there.
- **A read a parent can say out loud.** "Bedtime went from 5 to 8 over six weeks"
  is the sentence. The table shows the numbers and never says it.
- **Where it lives.** Its own page rather than buried down the pathway scroll,
  which is section 5 of this plan.

**Do not invent a score.** No composite, no overall family number. Every reading
stays tied to the concern the parent named, because a made up index is exactly
the kind of thing this product refuses elsewhere and it would not survive a
parent asking where it came from.
