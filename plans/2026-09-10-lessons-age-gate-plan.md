# The lesson a six year old should never have been offered

Justin, 10 September 2026, with three screenshots of Tester's passport:
"it seems to show all lessons from passport but should only have the ones
needed for their age to do, I did one but did not update passport"

Both halves are one bug.

## What actually happened, from the database

Tester: `c8fdea51`, age band 4 to 7, stage `foundation`, added 08:26 today.

The one lesson completion on the account:

| lesson | stage | passed | at |
| --- | --- | --- | --- |
| The feed is built to hold you | **explorer** (ages 11 to 13) | true | 08:41 |

The passport strand reads `0 of 17 lessons`. 17 is exactly the number of live
parent lessons at Foundation, so the strand is scoped correctly and its count
is right. It did not move because the lesson Justin did belongs to a stage
four years above the child it was done for.

So the passport is not broken. The lessons list handed him a Stage 3 lesson
for a Stage 1 child, and then nothing anywhere told him it would not count.

## Why the list offered it

The library already defaults to the child's own stage
(`LessonsBrowser`, `useState(initialStage ?? childStageNum)`). One thing
overrides that default, and it is pinned above the child's own lessons:

`ModuleCard`, the Social Media Ready module. It renders on the single
condition `moduleItems.length > 0`, with no age gate at all, and opening it
runs `setStage('all')`.

Every lesson in that module, checked against the live database:

| stage | lessons |
| --- | --- |
| explorer (11 to 13) | 4 |
| shaper (13 to 15) | 3 |
| independent (16+) | 2 |

Nothing at Foundation. Nothing at Builder. So the parent of a four to seven
year old is shown a pinned card promising a ramp "from ages 8 to 16",
containing nine lessons their child cannot do, above the seventeen their
child can. The card's own claim is wrong too: the youngest lesson in it is
ages 11 to 13.

The module also carries a "Send all 9 to Tester" button with no age gate,
while the single lesson page has had one since it was written
(`sendable = ... (STAGE_NUM[lesson.stage_id] ?? 99) <= childStageNum`).
So the module could push nine lessons about accounts, group chats and mood
checks onto a six year old's page, pointing at a list their own age gate
will not show.

## The three changes

1. **Gate the module by the stage it actually covers.** Derive the lowest
   stage from the items rather than hardcoding, and show the card only when
   the child is within one stage of it. A Foundation parent stops seeing it;
   a Builder parent sees it as the thing that comes next.

2. **Make the card and the module header tell the truth about their range**,
   read from the items rather than asserted in prose.

3. **Say it on the lesson itself.** Any lesson above the child's stage, by
   any route, says so under the title: which stage it is, and that it will
   not count towards this child's stamp. This is the half that closes
   "I did one but did not update passport" for every route in, not just the
   module.

Change 3 is the important one. 1 and 2 stop this particular trap; 3 means
the next one is visible the moment a parent walks into it.

## Not doing

- Changing how the passport counts. It is right, and a Stage 3 lesson
  filling a Stage 1 child's page would be the actual bug.
- Hiding other stages from the library. Reading ahead is legitimate; being
  misled about what counts is not.

## Checks

typecheck, build, wiring, the nine guards, dash grep, Playwright at 390 and
1200 on the library for a Foundation child and an Explorer child.
