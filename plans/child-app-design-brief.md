# Child app design brief (for the Mobbin design session)

Written by the continue-build session on 2026-07-17. The child app is
functionally complete and simplified on PR 303. This brief is for the design
session to perfect the LOOK. Please do not change the parent app or the marketing
page (other lanes) or the data flow, only the visual polish of the child app.

## Where it is
The child app is the token route `app/k/[token]/` (component
`app/k/[token]/KidQuestScreen.tsx`). It opens from the kid link, no login. Age
range is roughly 4 to 10 for the co-view default, older kids on their own device.

## The reference (what good looks like)
Greenlight (the two Family home screens Justin shared) is the north star for the
clean, icon led feel: white cards, a rounded colour icon square, a bold short
title, one short line, generous whitespace, big tappable tiles, a simple tab row.
Also lean on GoHenry and Finch for the star and reward loop, and Good Inside for
simplicity and big friendly type. Translate into OUR butter and ink and Nunito,
never a copy of another brand. It should feel a touch bigger and more playful
than Greenlight, because our child is younger.

## Current structure (top to bottom), what to polish
1. DiGi says card: the buddy the child chose greets them with one line.
2. Star card: the star count, the minutes it buys, and the streak flame. The
   left accent and the buddy ring take the child's chosen colour.
3. Four icon tiles (the whole path): My jobs, Use my time, New job, Our deal.
   White card, rounded colour icon square, bold title, one short line. This is
   the Greenlight pattern, done in our colours.
4. Tab row: Quests, Lessons, Printables, with a red badge when something new
   lands. This is how the child reaches lessons and printables.
5. Tab content below (the quest list, the lessons grid, the printables grid).
6. Two sheets: Make it mine (pick buddy and colour) and Our family deal.

Where the polish would help most:
- The tile and star icons are emoji today. Custom illustrated icons in the DiGi
  squad style would lift it from good to premium.
- The tab row could become a cleaner segmented control, or a proper bottom bar,
  whichever tests better on Mobbin for a kid.
- The buddy avatars (DiGi, Oliver, Sofia, Zara) could be consistent illustrated
  characters rather than mixed photo and svg.
- Consistent spacing, corner radius and shadow across every card, one system.
- A little celebratory motion when a job is ticked (GSAP only, subtle).

## Constraints (non negotiable)
- Checker design tokens only, Nunito plus IBM Plex Mono, no purple gradients, no
  generic AI patterns.
- No dashes in any copy, ever.
- Big, friendly, obvious for a young child: few words, big icons, one clear path
  (jobs to stars to time).
- Everything reachable, nothing hard locked.

## Status: READY FOR HANDOVER
Functionally done and simplified on PR 303. Perfect the look against Greenlight
and our system.
