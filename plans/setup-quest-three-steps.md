# The Setup Quest: three numbered steps, animated, and each one gone for good

Justin, 13 August 2026, after walking signup end to end.

This supersedes the setup half of
`plans/setup-quest-and-the-first-check-in.md`. The seven step list there is now
three, because four of them either happen earlier or belong on Today.

## The shape

Numbered steps that FLASH UP one at a time, animated, not a static checklist.
One number, one card, one tap. Tap it, land on the page that does the job, come
back, and the step is ticked green.

**Anything ticked never comes up again.** Anything not ticked appears on the
next sign in, same process, still to do. That is the whole rule.

## The three, in order

1. **Build your family agreement.** Goes to the agreement builder, back, ticked.
2. **Share the child's app.** Goes to the share page, back, green.
   **And "no child device" ticks it too.** A parent who chooses the printable
   route has answered the question, so the step is done and must not keep
   asking. Another system already reminds them from time to time that the child
   app can be set up later, so nothing is lost by closing it here.
   This depends on the share page working, which it currently does not: the
   Share button links to `/dashboard/quests?tab=share` and that page never
   reads a `tab` parameter, so nothing opens. Fix that first.
3. **Set up as home page, and set reminders.** Both in one step, the PWA prompt
   plus push. Drops off once done. Gentle reminders if not, on sign in, not
   often.

## What is NOT in setup any more

- **The birthday.** Already asked at signup as month and year, and
  `allBirthdaysIn` in `lib/setup/flags.ts` goes true the moment every child has
  a `date_of_birth`. So it is already green and already absent. Nothing to do.
- **Jobs and school reminders.** They rotate through Today instead. Setup is
  the things that must happen ONCE; Today is the things that come round.
- **The first daily practice.** It is the daily loop, not a setup step.

## What happens when the last one goes green

Straight into Today: the coins, and the proper check in page.

**The baseline asks four common ones to start**, about phones, social media and
the rest, rather than reviewing concerns a new family does not have yet. After
that it updates as they go through moments, which is the existing chain:
moments create concerns, the check in scores them.

Then they are on the walk.

## Notes for whoever builds it

- `lib/setup/steps.ts` and `lib/setup/flags.ts` already hold the list and the
  flags. Cut the list to three, do not rebuild the machinery.
- The rung on Today already appears while `currentSetupStep` is not null and
  disappears for good when it is, so the "drops off" behaviour is done.
- Animate the reveal, one step at a time. `TodayPathBig` already has the
  language: a lit current node, everything ahead quiet.
- A step must never tick from being LOOKED at, only from being done. That fault
  was fixed once today for the daily practice step and will happen again here
  if the flags read presence rather than completion.
