# The multi child audit, 18 August 2026

Justin asked: "just checking that the whole platform has child selector for each
part that works for each child, so DiGi lessons per age, quests reminders know
for which child when update etc. Please check platform functions for multi child
and that DiGi also does, but also takes the family as a whole with thinking."

Three parallel sweeps: every dashboard page, the per child content, and DiGi.

**The honest answer is no.** This is a single child product with a child switcher
on two pages. `is_primary` is the de facto "which child" almost everywhere, and
migration 203 closing the multi primary hole turned a silent CRASH into a silent
WRONG CHILD, which is harder to notice.

## THE ROOT CAUSE, and it is one line

**The child choice does not survive a tap.** ChildSwitcher writes `?child=` into
the URL of the page that set it. Nothing in the dashboard layout carries it
forward, and across the entire codebase only SIX links append it. NavTabs and
MobileTabBar carry nothing.

So a parent of two picks the second child on Home, taps any tile, and lands on
the first child's page with no signal the switch was undone. Every item below is
worse because of this one.

## TIER 1: SILENT DATA CORRUPTION. Fix first, it is writing wrong rows now.

1. **Watch a lesson with the second child, the first child gets the credit.**
   `/dashboard/lessons/together/[code]` reads `is_primary` and writes the
   completion, the stars and the stage passport against that child. The file's
   own header comment admits it. A parent cannot see or undo this.
2. **DiGi files everything against the primary child.** Memory, concerns,
   questions, all hardcode `child?.id` whoever the conversation was about. Since
   194 keyed concerns on child_id, a worry about the second child is now
   permanently attached to the first and will surface on the wrong check in for
   ever.
3. **A family job pays every child.** `family_quests.child_id` is nullable, a null
   quest renders on every board, and the tick inherits the null, so the bank
   counts it for everyone. The 14 year old empties the dishwasher and both
   children bank the stars.
4. **`lesson_completions` has no child_id at all.** Unique on
   (user_id, lesson_id, source). Doing a lesson with one child ticks it green for
   the other, for ever, and the Today rung skips it for both.

## TIER 2: WRONG ADVICE, which is the non-negotiable

DiGi's entire retrieval is keyed to the PRIMARY child's age band and stage.
Research, community wisdom, proven solutions, rated outcomes, moment cards and
the recommended script are all chosen for the wrong child when a parent asks
about a sibling. Nothing in the prompt says so, so it answers confidently.

- Concerns are fetched WITHOUT child_id, so DiGi cannot tell Olga's worries from
  Teo's and will attribute one to the other.
- Wellbeing scores are unlabelled and `.limit(6)` blends two children's weeks
  into one average and one trend.
- Screen time sums every child's minutes and holds the total against one child's
  age guide, so it raises an alarm about a number that was never one child's.
- `get_child_history`, the tool DiGi reaches for when asked about a specific
  child, has no child parameter and is introduced as authoritative.
- `learningContextFor` picks the primary child itself, so a question about the
  older child's reading is answered with the younger one's Year 2 curriculum.

**On "takes the family as a whole with thinking":** DiGi gets the roster of names
and nothing else. It has no ages, no per child picture, and no way to reason
about siblings. It cannot do "the older one is fine, the younger copies him",
which is the question parents of two actually ask.

## TIER 3: WRONG CONTENT, locked to the primary child, no switcher

`/dashboard/stats` (says "Teo's week" out loud), `/dashboard/daily` (the whole
ten minute loop, so a second child gets no daily practice at all),
`/dashboard/devices`, `/dashboard/moments`, `/dashboard/lessons`,
`/dashboard/digi`.

## TIER 4: STRUCTURAL GAPS

- **`school_actions` has no child_id across 205 migrations.** The school diary is
  family wide, so the 5 year old sees the 14 year old's homework on their own app
  and neither can tell whose is whose.
- **Push to "kids" broadcasts to every child.** `sendPush` has no childId. A per
  child door exists, `pushToChild`, and eleven call sites use the broadcast one
  for child specific news.
- **The star cap uses the 8 to 10 guide for every child** at seven of twelve call
  sites, including the parent board and the spend route.
- **The approval push does not say which child ticked.** Two children with a job
  called "Tidy your room" is indistinguishable.

## WHAT WORKS, so nobody rebuilds it

Concerns per child (194), the star banks fan out per child and credit whole
family ticks to everyone, the check in rung counts children properly and labels
rows by name, settings edits every child and promotes a replacement primary, the
setup share step is now per child, and 26 dashboard routes are genuinely child
agnostic and correctly have no switcher.

## THE ORDER I WOULD TAKE IT

1. Carry `?child=` through the layout and the nav. One change, and it is the
   root cause of most of tier 3.
2. Tier 1, in the order listed. Those four are writing wrong rows today.
3. DiGi: pass the child being discussed, label concerns and wellbeing by child,
   give `get_child_history` a child parameter, and give the prompt the family
   picture so it can say "which one do you mean?".
4. `school_actions.child_id` and the push audience.
5. Then agreements per child (section 9), which sits inside all of this.

**This is a substantial piece of work, not an afternoon.** It is also the
difference between a product that works for one child and one that works for a
family, which is what it claims to be.
