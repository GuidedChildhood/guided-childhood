# The passport proves the four things (13 September 2026)

Justin, 13 September 2026, decoded from a voice note: "Make sure the passport
works and is updated based on progression through the areas we have agreed
need to be met. Easy to understand and follow for both parents and child,
keeps interest daily and shows measurable progression. It has to fit the loop.
A full check and review that all lessons and progress along the way show
clearly how child behaviour improved, better use of devices, easy for parents,
safety, and that they learn enough to be as safe as possible, aware and
educated on devices, social media risks and benefits, healthy, AI literate,
safe and ready for the future we think AI will give us."

## What the passport is today (audited, nothing changed yet)

- One book, two views. Parent: `components/pathway/PassportBook.tsx` on
  `/dashboard/pathway`. Child: the same book read only inside
  `components/kid/KidPassport.tsx`, plus their sticker book.
- A stage page shows five ACTIVITY slots (`lib/pathway/passport-sections.ts`):
  devices, moments, lessons, jobs, balance. A stamp needs every parent lesson
  and script done AND the child passing the stage check (`lib/pathway/stamped.ts`).
- The four OUTCOME areas the family is building toward (Safe online, Healthy
  balance, AI and chatbots, Social media ready) live in a separate card,
  `components/pathway/LiteracyAreas.tsx`, fed by
  `lib/pathway/literacy-status.ts`, which reads `lessons.category` through
  `lib/content/literacy.ts`.
- The readiness stamps per stage (Calm screen offs, Healthy habits, Knows how
  it works, Owns their footprint, Ready for the world) are copy in
  `lib/content/readiness.ts` and name the stamp on the check card.

## What the audit found, against Justin's list

| Justin asked for | What the passport does today | Gap |
| --- | --- | --- |
| Progression through the agreed areas | The book shows five activity slots. The four areas sit in a different card and never appear on the passport. | The passport does not show the areas at all. |
| AI literate, ready for the AI future | The child's own AI modules (`ai_lessons`, 7 to 8 per age band, all five bands) count toward nothing: not the stamp, not the AI area. The AI area matches only three parent lessons in the whole library ("chatbots and ai", "deepfakes and ai") and says "comes at age 11" while the lessons hub offers "What is AI?" to a five year old. | AI is invisible to the passport. |
| Aware and educated on social media risks and benefits | Five lesson categories map to no area: bullying, information, ownership, relationships, reputation. That is 36 parent lessons, about a third of the library, counted toward no readiness reading. | A third of the teaching is invisible to the four things. |
| Shows clearly how child behaviour improved | The moments slot is a ratio (sorted over total). Live data has worries moving from 3 to 10 out of ten and the passport never says so. The child gets a sorted sticker; the parent gets no line. | No movement readout on the passport. |
| Better use of devices, healthy | Balance slot reads this week; the child strip reads timer days this week; total balanced days exists in `kid_days`. | Adequate. The daily sticker decided on 10 September is not built (no daily kind in `lib/stickers/catalog.ts`). Separate piece. |
| Safety | Devices slot plus the Safe area (guides done, worries open, safe lessons). | Adequate once the orphan categories land. |
| Easy for parents | The to do line, the one next step, the ring. | Adequate. |
| Keeps interest daily | Five a day, Planet Friends, streak and lesson stickers on the child's app. | Adequate for the child. The daily sticker is the next piece. |
| Fits the loop | Passport rung on the road, monthly to do, sends to the child's app. | Adequate. |

Live numbers today: 36 children, 1 child with lesson passes, 0 stage checks
passed, 0 stamps ever earned. Nothing here needs a backfill.

Two rules of this repo apply. One definition per fact (the stamped audit of 2
September found four). A guard its own documentation satisfies is not a guard.

## The build (this branch, one PR, no migration)

1. **Every lesson category lands in an area** (`lib/content/literacy.ts`).
   bullying to Safe online; information to AI and chatbots (telling what is
   real is that area's own blurb); ownership, relationships and reputation to
   Social media ready; `ai_safety` to AI (the underscore was defeating the
   word boundary, so it fell through to Safe).
2. **One start age per area, declared once.** `AREA_START` exported from
   `lib/content/literacy.ts` and read by the four places that each declared
   their own (LiteracyAreas, the pathway page, StageRoad, IsItWorkingReport).
   AI starts at stage 1: the product already offers AI modules to 4 to 7 and
   the copy said they come at 11. The algorithm conversation still lands in
   stage 3 through its lessons.
3. **The child's AI modules count in the AI area.** `lib/pathway/readiness-areas.ts`
   holds the one counting rule: parent lessons by category plus the age band's
   AI modules, passes credited through `lessonCreditKeys` (the stamp's own
   rule). `literacy-status.ts` reads it for the current stage; the passport
   reads it for all five.
4. **The four areas on every passport page.** A compact 2 by 2 block under the
   ring: name, "3 of 7", a slim bar in the stage's ink. Lesson counts only, so
   the child's read only book carries it unchanged. Mobbin references: Nibble
   category rows with level and bar, Duolingo ABC level card with counts,
   Withings score with the "+2 points" delta line.
5. **The behaviour line, parent's book only.** On the child's current page:
   "Phones in the car went from 2 to 5 stars", from `childWorries` gaining the
   first band. Never on the read only book: the guard extends to it.
6. **Guard** `scripts/check-readiness-areas.mjs`, mutation tested, in CI:
   every known category maps to an area through the real `literacyAreaFor`;
   `AREA_START` is the only start rule; the AI count includes `ai_lesson`
   passes; the behaviour line renders only when the book is not read only.

## Not in this build, for Justin to decide

- **Should the AI modules gate the stamp?** Today a page stamps on parent
  lessons, scripts and the check. The modules will be counted and shown, and
  the stamp rule stays as it is until he says otherwise.
- **The daily sticker** (10 September decision) is the "keeps interest daily"
  piece for the child and is a separate build.
