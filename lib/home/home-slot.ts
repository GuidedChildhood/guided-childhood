// HOME IS THE LEAD PLUS ONE (Justin agreed, 12 November 2026).
//
// The board's simplicity lens counted about twenty conditional cards on the
// parent Home, and on a busy day eight of them could stack under the lead:
// sticker news, catch up, DiGi's word, DiGi's question, the phone bridge,
// school ahead, the term preview and the school window. Each was right on its
// own. Together they were the reason Home read as a feed rather than a plan.
//
// So those eight share ONE slot. Nothing is deleted: every card still exists,
// still sits where it always sat on the page, and still shows on the day it is
// chosen. Only one of them shows on any day.
//
// ── THE RULE: A REAL NEED STILL WINS, THE REST ROTATE ───────────────────────
//
// The same shape as lib/home/next-up.ts. Four cards are not suggestions, they
// are something waiting: DiGi asked this parent a question, the family has
// been away and their child's week is news, the school window is open now,
// the Year 6 phone move is live. The first of those that applies takes the
// slot. Otherwise the other four take turns by London day, walking forward
// from the day's position in the full list, so a family making progress on one
// does not reshuffle which day the others land on.

export type HomeSlotKey =
  | 'digiQuestion'
  | 'catchup'
  | 'schoolWindow'
  | 'phoneBridge'
  | 'stickerNews'
  | 'schoolAhead'
  | 'termPreview'
  | 'digiWord'

/** Waiting on the parent: the first of these that applies takes the slot. */
export const SLOT_NEEDS: HomeSlotKey[] = ['digiQuestion', 'catchup', 'schoolWindow', 'phoneBridge']

/** Suggestions: one a day, in turn. */
export const SLOT_ROTATION: HomeSlotKey[] = ['stickerNews', 'schoolAhead', 'termPreview', 'digiWord']

export function pickHomeSlot(eligible: Partial<Record<HomeSlotKey, boolean>>, day: number): HomeSlotKey | null {
  for (const k of SLOT_NEEDS) if (eligible[k]) return k
  const n = SLOT_ROTATION.length
  const start = ((day % n) + n) % n
  for (let i = 0; i < n; i++) {
    const k = SLOT_ROTATION[(start + i) % n]
    if (eligible[k]) return k
  }
  return null
}
