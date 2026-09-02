# The first check in: two worries each, the sign up choice kept, a tick by the name

Justin, 2 September 2026: on the first check in, when each child is done,
a green tick by their name at the top; he is not sure where the first
worries come from, because he chose two at sign up and the check in
showed something else; start with two basic standard questions per child
to keep it easy, then add worries from the parent's moments, scripts and
DiGi chats as they come up, rest them when they score top, and catch up
in the monthly report on what works. Not too many on the first check in
until we know the issues.

## What the data shows (his account from this morning)

- Alma, the child named at sign up with "asking for a phone" chosen, got
  the four stock worries at 09:15, not the one he chose. Olga and Teo got
  the same four each the moment they were added in setup.
- Two faults. Sign up saves only the FIRST chosen worry (`challenge:
  challenges[0]`), so a parent who picks two loses the second. And the
  primary child's seeding is guarded on "no worries for this family yet",
  which is already false once a sibling has been added in setup, so the
  primary falls through to the stock four like everybody else.
- Adding worries later is already built: DiGi, Right now scripts, the
  wellbeing check in and moment feedback all raise a worry per child, and
  a worry scored 9 or 10 rests until it is flagged again. The monthly
  email exists. None of that changes.

## The build

1. Sign up keeps every chosen worry: `onboarding_answers.challenges`
   alongside the single `challenge` everything else reads.
2. Two starters, not four: `STARTER_SLUGS` is Bedtime screens and Will
   not put it down. Every child added later gets those two. The primary
   child gets what was chosen at sign up, topped up from the starters to
   two, so a parent who chose two sees exactly those two.
3. The primary child's seeding is per child, not per family: the check in
   loader seeds each uncovered child on its own, the primary from the
   sign up answers and the rest from the starters, whatever order they
   were added in.
4. A tick by the name: `lib/checkin/done-today.ts` works out which
   children have checked in today (every worry that is not resting was
   checked today, and at least one was), the dashboard layout hands the
   set to the child rail, and the switcher pill wears a small green tick
   on the initial. Streams inside the rail's Suspense so no page waits on
   it.
5. Dev fixture for the switcher with a ticked child, so it can be
   screenshotted at 390.

Existing families keep the worries they have. No migration.
