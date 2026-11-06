# The Jobs Board for 11 to 15s: product folder

Build next number 3 (`plans/2026-11-06-etsy-build-next-five-plan.md`), from
rows 11 and 15 of `plans/2026-11-06-etsy-top-sellers-research.md`. Orbit (11
to 12) and Nova (13 to 15) front it. List £5.99 with the permanent 25 percent
sale, buyers pay £4.49.

The one idea: two columns that never mix. Family jobs earn nothing; earning
jobs pay in screen time.

## Pages (8)

1. Cover.
2. For the grown up: family jobs, earning jobs, a weekly most, protected
   time, pitching, and the ladder (you, together, them).
3. A filled example board (Sam's week, totals worked out).
4. The weekly board, blank and fillable.
5. Stars to minutes: the converter at 5 and 10 minutes, the rate, my time,
   the weekly most, the protected windows.
6. Six pitch a job slips.
7. Our jobs deal: six terms, who runs the board, signatures, review date.
8. The Orbit and Nova Passport stickers and the free gift
   (`../pack-finish.js`, `strip: false`).

## Proof paths

In the head comment of `print.html`: family jobs (migration 223), the rate
(`lib/quests/templates.ts`, migration 225), the weekly cap
(`lib/quests/star-week.ts`, `lib/quests/screen-balance.ts`), core time,
protected windows (`lib/quests/time-tiers.ts`), the pitch
(`components/kid/KidAskForJob.tsx`, `app/api/quests/request/route.ts`), and
the ladder (THE-STORY.md section 3).

## Contents

- `product/`: jobs-board-11-to-15-A4.pdf, USLetter.pdf, A4-ink-friendly.pdf,
  all fillable.
- `phone/`: the-deal.png and pitch-a-job.png, 1080 by 1920.
- `images/`: Orbit, Nova, DiGi, `preview/`, the ledger.
- `listing/`: `listing.md` and `images/`, the 2000 by 2000 photo set.

## Rebuild

    node content/printables/build-pack.mjs jobs-board [print|phone|listing]

Checks: `node scripts/check-ai-tells.mjs` on the html and md here, and
`node content/printables/check-listing-tags.mjs content/printables/jobs-board/listing/listing.md`.
