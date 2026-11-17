# The passport and its Planet Friend stickers, one rule on screen and paper

Justin, 17 November 2026, on the parent passport page: the order card shows the
wrong passport (a yellow "Digital Literacy Passport" photo) and a generic sticker
sheet. The real passport is the app's burgundy cover with the five Planet
Friends in foil. The stickers must be the five Planet Friends, one per stage.
The paper passport has to run with the app: stage done in the app means
"Stage done, sticker added to your passport" for parent and child, and a colour
sticker page to print. Each sticker says in a line what was learnt.

## What the code actually checks (read before writing any rule)

`lib/pathway/stamped.ts` and `lib/pathway/page-count.ts`: a page is stamped when
the stage's school lessons are all passed by this child, every parent talk
(script) on the page is done, and the child has passed the big check. A stored
stamp (migration 378) never comes off. Moments, stars, balance, outside time
and the timer earn nothing toward the stamp: the 17 October passport plan
(decision 1.4) took them out deliberately.

So the rule printed everywhere is those three things and nothing else. The
detailed app version shows moments sorted, jobs approved, days outside and
timer days as "along the way", clearly not needed for the sticker. Whether any
of them should become part of the rule is Justin's call, asked in the PR.

## What to build

1. `lib/pathway/stage-stickers.ts` (pure): per stage the Planet Friend, the
   page name, the colour token, the one line the sticker says it learnt
   (grounded in that key stage's real modules in content/modules), and the
   rule lines for paper and screen built from `pageCount`. Guard on fixtures.
2. `components/passport/PassportCover.tsx`: the app's burgundy cover lifted out
   of InsideBlocks so the order card, the stage check and the print share one
   drawing. Stamped friends show in colour, the rest in foil.
3. `components/passport/StageSticker.tsx`: one Planet Friend sticker, a
   passport stamp roundel in the stage colour, the friend art from
   public/digi-squad/friends, the stage name, and the learnt line. Earned in
   colour, not yet as a dashed outline.
4. Order card: the real cover and the five stickers, the ones earned in colour.
5. Passport page: the progress card names the sticker it earns and its line;
   an "along the way" strip for the detailed record; a "Stage done, sticker
   added to your passport" card when a page is stamped, with the print button.
6. Print the colour stickers: `/dashboard/keepsakes/passport-print/stickers`
   for the parent and `/k/[token]/print?stickers=1` for the child, one A4 page,
   five stickers, earned ones in colour, the rest as outlines naming the rule.
7. Child app: the stamp celebration says "Stage done. Sticker added to your
   passport", shows the friend sticker and its line, and links to print it.
8. Parent push on the stamp says the same words.
9. The A6 printed book and the zine: "Digital Childhood Passport" (matching the
   app), friends in place of the emoji, stage pages show the one rule.
10. "What has learnt" check: it reads the same passed lessons as the count
    (`lessonCreditKeys` via `childLessonPath`), confirmed, no change needed.

## Checks

320, 390, 1280 and A4 print screenshots; ai-tells, token-guard, tap-guard,
hex-guard, tsc; review.md.

## Part 2: the paper record book (Justin, 17 November 2026, picked from four)

A printable record book like a swimming badge book. One A4 page per stage:
the Planet Friend sticker spot and its line, then every step on its own row in
the order the app teaches it: each school lesson, each grown up talk, the big
check. Each row says how to do it in a few words, carries a tick and the date
when the app already has it done, and a box for a grown up's initials. The
cover explains it in four steps, and a QR code takes the family to the passport
page. The ticks come from the same reads as the page count (childLessonPath,
countsTowardPathway, the passed stage checks), so paper and app agree.
Route: /dashboard/keepsakes/passport-print/record, linked from the order card,
the Stage done card and the earn card. No migration.
Parked for Justin: the child's own page view, gentle reminders, the evidence check.
