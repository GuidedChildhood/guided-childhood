# The fifth step unblocked, the calendar in the Happy News look, the sticker book prettier

Justin, 14 September 2026, 12:30, five screenshots: the ask page saying "Lots
of ideas already waiting", Jonny's week on the blue dotted ground, the child
home with My week at 4 of 5, the sticker book's Every day page, and The Happy
Newspaper website (white page, a big yellow disc behind a drawn envelope, a
pink disc behind a drawn post box, a yellow ribbon that says FREE HAPPY NEWS).

"Still blocking last one of 5, so we either need to be able to add a job or do
a job outstanding? I'm guessing they are stuck on parents app? Also design of
background blue dots is not the right look, we want happy news style as the
image here for calendar, and also passport design although matches parents
should try to make more pretty visually with stickers."

## 1. The fifth step (bug)

Why it blocks: three readers of quest_requests count pending asks three ways.
The API cap counts every pending ask for the child. The ask page reads a
fortnight. The home page reads a WEEK and at most eight rows, then hands the
five a day `asksPending` off that list. Jonny's five pending ideas are older
than a week, so home sees zero, the auto tick never fires, and the ask page
refuses a sixth. The ideas are with the parent (QuestBoard, "Add it" and a
cross), so Justin's guess is right.

Fix
- Home page: a head count of pending asks for the child, no window, passed
  to the five a day as the pending number. One idea with the grown up ticks
  the step, whatever its age.
- Ask page at the cap: the note says the ideas are with the grown up and
  points at the jobs board, and a line with a door to the jobs stays on the
  page while it is full, so a child at the cap always has a thing to do.
- Parent side is already there: the nav badge, the daily path rung, the
  QuestBoard rows. Nothing to add.

## 2. The calendar, Happy News

Reference: The Happy Newspaper page. A white ground. Big flat colour discs,
sun yellow and soft pink, with the drawing sitting on top. Black hand drawn
lines. One yellow ribbon banner with black words. Nothing patterned.

Translation in our tokens (butter, coral, ink, Nunito): 
- No polka dot sky anywhere on the child side. The ground is white.
- Every day is a DISC. Done: butter disc, ink edge, ink ledge, the child's
  Planet Friend sitting on it with a green tick. Today: soft pink disc with a
  coral edge and eight short ink rays around it, the sun from the masthead.
  Ahead: white disc, dashed ink. A quiet past day: pale cream disc.
- The count is a butter Burst (the sun) with the number in it, not a white
  pill. The ribbon heading stays: it is the one Happy News element already in
  the kit.
- Jonny's week page: the same white ground, the day strip as discs with the
  date in them and a coral dot under a day that has something, the chosen day
  card unchanged, the Friend on a butter Plate beside the title.

Mobbin, this session: Me+ (the mascot on the week card), Finch (week dots
above the day), Duolingo streak widget (character beside the week). None of
them is copied; they confirm the Friend belongs on the week, not beside it.

## 3. The sticker book, prettier

Reference: Swarm's sticker collection (locked as grey silhouettes, earned in
colour), Kit's sticker sheet (white die cut edges on every sticker), Finch's
Micropedia (a bound thing with a count on it).

- The stickers lead every page. The how it works paragraph folds behind a
  "How it works" line (details/summary), so Justin's 6 August rule, every
  page says how it works, still holds, one tap away.
- Earned sticker: the art on a white die cut disc, thin ink edge, hard ink
  shadow, tilted a few degrees each way like a sheet of peeled stickers.
- Locked sticker: the same shape as a pale silhouette, name and cost under.
- The cover band carries the child's Friend as a big tilted sticker and the
  collected count in a butter Burst.
- The Every day page carries the new calendar.
- The passport takeover header: the Friend on a Plate, the book's name in a
  ribbon, the paragraph cut to one line.

## Wiring

- check-stickers-land.mjs gains rules: no "48px 40px" polka ground on the
  child side, home counts pending asks with no window, the ask page has a
  jobs door at the cap, the calendar draws discs with rays on today, the
  book's tiles are die cut and the how text is behind a summary.
- Fixtures: /dev/kid-week, /dev/kid-school-week, /dev/kid-passport,
  /dev/stickers. Walked at 390 and 1440.
