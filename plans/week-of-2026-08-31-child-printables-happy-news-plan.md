# Child printables, the happy news overhaul

Justin, 2 September 2026, with four screenshots from Jonny's app (the
Printables tab, the bucket list builder, the five a day's A printable row):
printables on the child's app need checking; a better happy news type UI,
easy to select, the most common ones first, kept simple, super fun and
luxury; check the print button, the known issue on the web app; make sure
doing a printable completes one of the five things, because it does not;
the back button says My quests but should go back to where they came from,
with a better close button everywhere for back navigation, and quicker;
apply the overhaul to all printables with happy newspaper style decoration
(reference: thehappynewspaper.com/education).

## What the screenshots and the code show

1. The Printables tab is two plain white hero rows (star chart, bucket
   list) and then one tall card per sheet, each with three stacked buttons
   (Print it now, I finished it, No printer?). Eight cards for Jonny is
   twenty four buttons on one scroll. Nothing on it says happy.
2. The bucket list builder is a chip cloud on cream with a mono back link.
   The picks work, but it reads like a form.
3. The print button. KidSheetOverlay and both builders call
   window.print(). Inside the installed app on an iPhone (display mode
   standalone) window.print() does nothing at all: iOS gives a standalone
   web app no print dialog. That is the issue on the web app. On a desktop
   browser and in Safari it works.
4. The five a day. The printable step is ticked by /api/kid/printable-done
   (markStepQuietly). Only the grown up assigned printable calls it. The
   sheets on the tab post "Finished the X sheet" through the quest ask
   pipeline instead, and the builders never tell the day store anything, so
   a child who prints and finishes a sheet from the tab never completes the
   step.
5. Back. KidBackLink says My quests and pushes the heaviest page in the
   app; the builders use a plain Link to /k/token?tab=print, a full server
   render. The child came from the printables tab and should land straight
   back on it, from the router cache, in a frame.

## Mobbin, read this morning

- Me+, Routine Plan: category chips, then a two column grid of tall poster
  cards, one tap opens the plan.
- Finch, Discovery: a grid of tinted tiles with a count under each, the
  whole library visible without scrolling.
- Greenlight and GoHenry (from the Add a job work): rows with one icon
  tile, one title, one value, one action.
- Happy Newspaper (from content/brand-story/visual-system.md, the rule we
  already keep): vibrant colour blocking, smiley polka dots, sticker
  doodles, hand lettered warmth, newsprint cream. We take the energy and
  draw our own: butter, ink, Nunito 900, our smiley sticker in SVG.

## The build

1. `components/kid/HappyNewsBits.tsx`: the decoration kit, all SVG in our
   tokens. SmileyDot, BurstStar, Sticker (a rotated roundel with a word on
   it), RainbowArc, WavyRule, Confetti. Used by everything below and by
   nothing off the child app.
2. `components/kid/KidPrintables.tsx`: the tab, lifted out of
   KidQuestScreen. A butter masthead (Printables, the child's tally as a
   sticker, smiley dots), the two builders as big poster tiles first
   (star chart, bucket list, Justin's best three with the planner leading
   the sheets), sticker chips for the kinds, then a two column poster grid
   of the sheets: the paper preview tall, a rotated star sticker with the
   stars on it, the title under, a padlock sticker when it needs a grown
   up. Most common first: planner, lists, colour in, hunts, dares, learn,
   and anything a grown up said yes to first of all. One tap opens the
   sheet.
3. `KidPrintableSheet` (in the same file): the one screen for one sheet.
   Big preview, the blurb, ONE big Print it button, then I finished it,
   then No printer, ask a grown up. Locked sheets show Ask a grown up
   instead. Close is a round cross top right.
4. Print that works everywhere: `lib/kid/print-anywhere.ts`. canPrintHere
   is false inside an installed iOS app. When it is false, every print
   button opens `/k/token/print?...` in a new tab, which lands in Safari,
   where the page prints itself on load and shows a Share then Print note
   in case the dialog is blocked. One print page for the three things a
   child prints: a sheet (by key), the bucket list (picks in the URL) and
   the star chart (jobs in the URL). Everywhere else the button still
   calls window.print() in place.
5. The five a day: I finished it posts to /api/kid/printable-done (ticks
   the step, pings the grown up to confirm, same as the assigned
   printable). Printing anything (a sheet, the bucket list, the star
   chart) posts to a new /api/kid/printable-step which only ticks the
   step, quietly, so a child who printed and coloured has done their part
   of the day whichever button they reach for.
6. Back everywhere: KidBackLink gets a label (default Back), a close
   variant (round cross) and goes back through history whenever the home
   screen is behind it, so it lands on the tab it came from instantly. The
   builders' kid variant, the lesson list, the path and the print page all
   use it. The print sheet window keeps window.close.
7. The builders get the happy news treatment on screen (masthead, sticker
   chips for the ideas, a Print it bar that always shows) and the printed
   bucket sheet gets a masthead ribbon and smiley dots to colour. The star
   chart sheet's print geometry is untouched.
8. Dev fixture at /dev/kid-printables (tab, sheet, bucket, print page) so
   Playwright can screenshot every state at 390 and 1280.

No migration. No copy with a dash.
