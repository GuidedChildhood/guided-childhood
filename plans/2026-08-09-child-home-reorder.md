# The child's home screen, reorganised

**Justin, 9 August 2026:** *"we have way too much on Home Screen so let's
organise better."*

Two small bugs from the same message are already fixed and are not in this
plan: the Skip intro button is now a proper 44px pill instead of 12px corner
text, and closing the intro lands at the top of the page instead of halfway
down.

What follows is his order, in his words, turned into a build.

---

## The order he asked for

| # | Block | What changes |
| --- | --- | --- |
| 1 | **School diary** | Moves to the very top, and becomes the first job. The child can **add things themselves**, and it must be **obvious which items the child added and which the parent added**. |
| 2 | **Morning welcome** | Second, not first. |
| 3 | **Streaks** | Kept, but in a **smaller box** than it has now. |
| 4 | **Five a day** | Tap to open **one at a time**: do the first, the second appears, and so on. Not five open rows at once. |
| 5 | *(the block after it today)* | **Delete as a separate section.** It duplicates the five a day and should be part of it. |
| 6 | **Today's jobs, inside the five a day** | Tapping it opens the **jobs page**, carrying the "do these jobs" list and the **payback message**. |
| 7 | **Use my time** | After the five a day. |
| 8 | **Tab bar** | **More visible.** |

## The two that are more than a reorder

**The school diary needs adding and provenance.** Today the child can see the
week (`KidSchoolWeek`) but not add to it. This needs a child side add control
and a visible difference between a child added item and a parent added one.
Provenance has to be stored, not inferred, so it survives an edit: a column on
the row saying who put it there, not a guess from which table it came.

**The five a day becomes one at a time.** Today all five show at once. He wants
the next one to appear as the previous is done, which is a different component
shape, not a CSS change, and it needs a sensible end state when all five are
done.

## Before building

**MOBBIN FIRST**, per CLAUDE.md. This is a home screen redesign for a child, so
pull real reference screens before drawing anything: Finch and Greenlight for
the reward loop and the one thing at a time pattern, Good Inside for the
simplicity and the big text. Translate into butter, ink and Nunito, never a
copy. The Mobbin tools were reachable in this session.

## Order to build

1. School diary add plus provenance. The only piece with a data change in it,
   so it lands first and on its own.
2. Five a day, one at a time, absorbing the duplicated block below it and
   pointing today's jobs at the jobs page with the payback message.
3. The reorder itself, plus the smaller streak box and the more visible tabs.
   Pure layout once the two above are in, and cheap to iterate on with him.

Each step gets a screenshot at 320, 390 and 430 before it is called done. The
child app has no test account in the sandbox, so anything needing a signed in
child gets a ref fixture that imports the real components, the same way
`ref-kid-week` and `ref-upgrade-block` do.
