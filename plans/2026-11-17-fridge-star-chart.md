# Fridge star chart, 17 November 2026

Justin: make the printed star chart the best fridge chart there is, looking like
the child's app, with where the phone lives, outside ideas, and a link back to
the app so paper and app encourage each other. Print on demand ready later.

## What the research said (agent report, this session)
- Bestsellers win on: watching it fill, pictures per job, a goal you can see,
  looking good in a kitchen. They lose on hardware and on a hidden goal.
- Keep to a few jobs, a star quest first, picture per job, the reward written
  at the top, a fresh sheet each week, never subtract, a line for specific praise.
- Paper to app precedent is thin (EasyRewards QR, Rocketbook). A QR to the
  parent's end of week entry is the honest, simple link.

## The real rule the sheet must match
- Planet Friends come from FULL DAYS (all five of the five a day), ladder
  2, 10, 22, 38, 58 (lib/pathway/streak-unlock.ts). The old sheet said
  "4 stars in a day = one Planet Friend". Wrong; fixed.
- Paper week total enters the star bank (app/api/quests/fridge-week), stars
  only. Full days count when jobs are ticked in the app each day. Say so.

## Build
1. StarChartSheet page one, in the app's look: rainbow band, "My five a day"
   ribbon, star quest row first, a Full day planet row, the friend trail with
   this child's real progress when known (fullDays prop), the goal line.
2. Three panels: where our phones sleep (fill in, plus screen free zones),
   outside this week (seasonal, from the sheet's week), end of the week
   (tally, praise line, QR to the paper week entry).
3. Page two keeps the cut out stars, fixes the friend copy, shows the ladder.
4. fullDays plumbed from the parent page (per child) and the child print page.
5. Static QR svg in public, anchor on the paper week card.
6. Fits one A4 at 5 and 11 jobs. Check 320, 390, 1280 and the printed PDF.
