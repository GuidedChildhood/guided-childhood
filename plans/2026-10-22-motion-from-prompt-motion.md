# Three motions from the Prompt Motion gallery (22 October 2026)

Justin pointed at prompt-motion.com ("in both apps we could use some of these
motion ideas") and said yes to the three in-app picks. The gallery is rendered
promo videos, mostly for films; what carries into the apps is three moves,
built in our house style: GSAP only, subtle, reduced motion gets the final
state, nothing hides content a reader is already looking at.

## The three

1. **Numbers count up** (shared `CountUp`). Schools: the four coverage tiles on
   `/hub/rshe-mapping`. Parents: the week total on the Balance report.
   The server renders the final number; on the schools pages it only counts
   when it starts below the fold (the HomeReveals rule, no flash of a reset).
   A screen reader gets the final number, never the ticking one.
2. **Coverage bars draw themselves in** (shared `CoverageBar`). One stacked bar
   on `/hub/rshe-mapping` and `/hub/computing-mapping`, segments in the page's
   own verdict colours, drawing left to right as it comes into view. The
   Balance report's row bars draw in on load the way PassportBook's do.
3. **Squash and stretch on a reward landing** (shared `squashLand` in
   `shared/motion.ts`). The stamp in `KidWinPop` and the sticker in
   `KidStickerLand` squash as they land and settle with a small elastic.
   The passport book in KidStickerLand already squashes and stays as it is.

## Checks

Typecheck both apps, wiring check, ai-tells on any copy, Playwright
screenshots at 390 and 1440 on the two mapping pages and `/ref-balance`,
reduced motion run showing final state, print stylesheet showing full bars.
