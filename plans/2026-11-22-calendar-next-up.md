# Calendar: next up, a photo reader that misses nothing, three script tiles

Justin, 22 November 2026: the photo add did not read one letter that had a date
in it; the calendar page is messy at explaining what is coming next and should
be super simple, things popping up and going away once dealt with, nothing
missed, a parent's best friend. Also yes to the three script illustrations.

## 1. Photo reader (lib/school/extract.ts, app/api/school/catch)

Three ways a letter with a date could come back empty, all fixed:

- The prompt said "only real actions" and "ignore newsletters with no action",
  so an inset day, a term date or a non uniform day (a date, nothing to do)
  could be dropped. Now every dated thing a parent needs to know is an item.
- The answer was cut at 600 tokens. A letter with a dozen dates ran past it, the
  list never closed and the whole reply was thrown away. Now 2000 tokens, and a
  cut list keeps every complete item (lib/school/parse-items.ts, tested).
- The route kept eight items. Now twenty.
- When it still finds nothing the card offers "Add it by hand" rather than
  only telling the parent to try again.

## 2. The page (app/(dashboard)/dashboard/school)

Mobbin, 22 November: Future Pro (one big next thing with its two actions),
Givingli (a date tile beside each event), Slack Later (Complete on the row),
Partiful (Next up first). So:

- Next up first: one large card for the single next thing, date tile, whose it
  is, how long to go, one Done button.
- Then the rest of the next seven days as short rows that pop in one after
  another, each with a tick. Ticking sends it away and the next one rises.
- Overdue sits on top and never leaves until it is ticked, and a one line count
  says what is left, so nothing is missed.
- Later than a week folds to one line with its count.
- Add from school is one button under it. The week grid, routines, forwarding
  and the rest fold under "Week view, routines and settings", open on a link.

## 3. Script tiles

Three picture book tiles in the same hand as the 12 July set, for phones,
something online and big feelings, made on Higgsfield with an existing tile as
the style reference. Justin said yes on 22 November.
