import type { StageId } from '@/lib/pathway/progress'

// THE PRINTED PASSPORT'S OWN PALETTE.
//
// The burgundy and gold of a real passport, and one colour per stage, shared
// by the two things that print the book: the A6 page per sheet file a
// commercial printer receives (keepsakes/passport-print) and the free one
// sheet zine a parent folds at home (keepsakes/passport-print/zine).
//
// HERE RATHER THAN IN BOTH, because the two have to be recognisably the same
// object. A child who folds the paper one and later opens the posted one
// should see their own passport twice, not two products.
//
// The stage colours are the pathway's, deepened for ink: the pastels that
// work on a screen go to mud on a photocopier.

export const STAGE_IDS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

export const STAGE_COLOURS = ['#EDC35F', '#2F8F6B', '#2E6F8E', '#7A5CC0', '#D4600A']

export const BURGUNDY = 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)'
/** The same burgundy flat, for anywhere a gradient would band on paper. */
export const BURGUNDY_FLAT = '#571C2A'
export const GOLD = '#EDC35F'

/** The paper the pages are printed on, warmer than white. */
export const PAGE_CREAM = '#FFFCF3'
export const PAGE_INK = '#2A1F14'
export const PAGE_INK_SOFT = '#4A3B25'
export const PAGE_INK_FAINT = '#A08247'

// ── WHAT HAS TO BE TRUE OF THE PAPER, IN ONE PLACE ──────────────────────────
//
// Justin, 16 September 2026: "this needs to be premium and ability to print
// and put together." Measured first, and it could not be printed at all.
// Rendered in print media and turned into a PDF, the A4 zine came out at
// 317.8mm by 224.7mm and spilled onto two pages, and the A6 file came out at
// 112.35mm by 158.36mm on an A6 page box, clipped on every page.
//
// THE 7 PER CENT IS A ZOOM. shared/tokens.css zooms body by 1.07 to make the
// whole interface bigger at once. The dashboard shell turns that off on body
// and puts the same 1.07 on `.gc-dash > main` instead. Zoom applies on paper
// as well as on screen, and both passport print routes render inside that
// main, so every millimetre in this booklet went to the printer 7 per cent
// too big. Seven other printables already reset it (BucketSheet line 64,
// FriendsPoster line 158 and five more). These two did not. main's own
// paddingBottom of calc(132px plus safe area) is never cleared either, which
// added about 35mm of nothing after the sheet.
//
// AND CHROME SHIPS WITH BACKGROUND GRAPHICS OFF, buried under More settings.
// Every colour on this booklet is a CSS background: the burgundy covers, the
// cream page, the stage band, the stamp ring. So without print-color-adjust
// the first thing a family sees is white paper with pale gold text on it.
// Six other printables in this repo already guard against it. The one object
// meant to feel premium was the one that did not.
//
// SHARED, AND THE REF FIXTURE GETS IT TOO, because a fixture that prints
// under different rules from the real route cannot catch a print fault. It
// is the only place either sheet can be measured without a login.
export const PASSPORT_PRINT_RESET = `
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  body, .gc-dash > main, .gc-dash > header { zoom: 1 !important; }
  .gc-dash > main { padding-bottom: 0 !important; }
  .bottom-tab-bar, nav, header, [data-rightnow] { display: none !important; }
`
