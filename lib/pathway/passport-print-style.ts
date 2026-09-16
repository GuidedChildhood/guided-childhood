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
