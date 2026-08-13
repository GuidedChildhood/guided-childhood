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

The welcome email links to `/dashboard/setup` and says why in one line. It is
transactional, sent on signup, so it never spends the week's one programme slot.

Order agreed:

| When | Email | Kind |
| --- | --- | --- |
| On signup | Welcome, the pathway to sixteen, and finish setting up | transactional |
| Week 1 | Your first script is ready | programme |
| Trial ending | The founder offer | transactional |
| Ongoing | The weekly programme | programme |

## Still to fix first

The lead nurture "free starter pack" email reaching people who have already set
up. Both lead programmes DO exclude members, but only on an exact email match,
so anybody who joined the waitlist with one address and signed up with another
keeps getting it. Fix: mark the lead converted at signup rather than trying to
match addresses later.
