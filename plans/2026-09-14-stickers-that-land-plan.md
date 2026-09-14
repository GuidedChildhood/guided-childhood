# Stickers that land: every sticker earned is seen, told, and kept

Justin, 14 September 2026, afternoon walkthrough (two messages):

> Once they achieve first badge we should link to order passport and sticker
> sheet and the system should say congratulations, you or they have earned a
> badge or sticker, it will be added to their passport: either purchase one
> with stickers and add as they go along, or print when complete from the
> system. Make sure all daily stickers towards achievement are populated on
> parent's and child's passport. Child's should display a bit more life and
> give them stars when they use timer, complete jobs, outside especially,
> offline especially. Big pop up passport animation of relevant Planet Friend
> and a visual sticker going in the passport, also big character sticker for
> lessons and doing printable tasks. Make sure this wiring all works and fits
> together seamlessly, for example letting parents know stickers earned and
> why. One last big one: the home tab on the app always has a Duolingo type
> reminder to return to daily tasks until done so they don't get lost on other
> tabs, and each day done shows clearly done.

> Can we make sure stickers reflect the stickers required in the platform,
> also an image of the passport print out, and research suppliers we can send
> to produce and how we press them, same with cuddly toys of each character
> and costs so we can work out prices for all.

## What the map found (three agents, 14 September)

- Twenty one catalogue stickers exist (Friends, stamps, saving, sheets, streak,
  lessons) plus sorted stamps. Nothing earns a sticker for timer use, jobs, or
  time outside. The daily sticker (kid_days.sticker_awarded_at, migration 284)
  is in no book and has no celebration.
- The sticker pop lives inside the passport modal, so a child who earns First
  Lesson never sees it unless they open the passport. The load that earns a
  sticker also misses it (the seen read races the book's write).
- The parent hears "finished all five" by push, never the sticker. The parent
  passport strip shows days, stars, lessons left and the timer, no stickers.
  There is no first sticker moment anywhere.
- The child's home has three tabs, no Today entry, and seven sub pages with no
  way back to the five a day. Done days are only shown inside the day done
  takeover; the always visible week row counts job ticks, not full days.
- Keepsakes: the sticker sheet copy names six characters and five stamps, not
  the catalogue; the passport has no print out to look at; fulfilment is by
  hand with no file to send a printer.

## The build

1. **Three new sticker kinds** in the catalogue: timer (days the timer ran:
   1, 7, 30), jobs (jobs approved: 1, 10, 50), outside (days with the move
   step done: 1, 10, 30). Read on the same reconcile, ratcheted like credits.
   A "Every day" page in the child's book shows this week's daily stickers
   and the total, so the daily sticker finally lives in the passport.
2. **The sticker lands.** A full screen moment on the child's home the
   moment any non Friend sticker is owed: the child's Planet Friend, the
   sticker big, one line saying why, then the sticker flies into a small
   passport at the foot and it stamps. One way out: open my passport. Marked
   seen on show. The race is closed by reading seen after the book writes.
   The day done screen names the daily sticker it just paid.
3. **Parents are told.** A push at the moment a sticker is written, naming
   the sticker and why. The first ever sticker says the passport line
   (order the printed passport and sticker sheet and add them as they go, or
   print it when complete). A card on Home says the same, with the two
   doors. The parent passport strip gains a stickers line: total, new this
   week, and the way to the book.
4. **Home tab reminder.** A Today tab first in the child's sticky bar, with
   the count left in butter until done and a green tick after; sub pages
   carry a sticky "N of 5 left today, back to today" bar. A week row of
   full days under the five a day, always visible, from kid_days. The open
   load only auto switches to Lessons or Printables when the DAY is done.
5. **Keepsakes.** The sticker sheet card shows the real catalogue (every
   sticker they can earn) so the sheet matches the platform. The passport
   card links to a print out preview page at A6, which is also the file a
   printer receives. The floating Now button stays off the shop.
6. **Suppliers.** Research written to
   plans/2026-09-14-keepsakes-suppliers-research.md (agent, web verified).
7. Guard `scripts/check-stickers-land.mjs`, mutation tested, wired.

No migration: every read is on tables that exist.

Mobbin: Duolingo home tab and streak row, Finch collection reveal, Discord
"added to your collection" (from the arrival screen's notes). Nothing copied.
