// The shelves on the Scripts page, worked out from what this family has done.
//
// Justin, 17 November 2026: the page "needs a really intelligent way of
// showing scripts: ones done that they may want to revisit, ones that apply to
// their age, and ones that respond to things they have said on the app."
//
// Two of those three already existed in the recommender (lib/pathway/recommend
// reads concerns, check in dips and devices, and the age band). What never
// existed was the third: a script a parent has already met coming back at the
// right moment. This file is that shelf, and the small tally beside it.
//
// WHY A SCRIPT COMES BACK, in the order it matters:
//
//   1. It did not land. The parent told us "somewhat" or "no" when the reader
//      asked if it helped. That is the strongest reason there is to look again,
//      and the reader's "if they push back" section is written for exactly it.
//   2. It worked, and a while has passed. Spaced review is one of the most
//      repeated findings in learning research (Cepeda et al 2006, a review of
//      over 300 experiments): a second look after a gap holds far longer than
//      a second read the same day. Three weeks is our gap, chosen because the
//      moments these scripts are for come round on roughly that cycle, not
//      because a paper names it.
//   3. It was read but never tried. Reading the words is not the conversation,
//      and the parent training evidence is that practising with your own child
//      is one of the components linked to the largest effects (Kaminski et al
//      2008, 77 programmes). A gentle nudge to try it, never a nag.
//
// Never back: anything marked not needed. A parent who said "this does not
// apply to us" has answered the question, and asking again is how a shelf
// stops being trusted.

export type CompletionLite = {
  script_sort_order: number
  status: string | null
  worked: 'yes' | 'somewhat' | 'no' | null
  completed_at: string | null
  child_id?: string | null
}

export type RevisitReason = 'did-not-land' | 'refresh' | 'try-it'

export type Revisit = {
  sort_order: number
  reason: RevisitReason
  line: string
}

const DAY = 86_400_000
/** How long after a conversation that went well before it comes back. */
export const REFRESH_AFTER_DAYS = 21
/** How long after a read before it is offered as one to try. */
export const TRY_AFTER_DAYS = 3

function weeksAgo(days: number): string {
  const w = Math.round(days / 7)
  if (w <= 1) return 'a week ago'
  if (w === 2) return 'two weeks ago'
  if (w === 3) return 'three weeks ago'
  if (w === 4) return 'a month ago'
  return w < 9 ? `${['', '', '', '', '', 'five', 'six', 'seven', 'eight'][w]} weeks ago` : 'a while ago'
}

/**
 * The scripts worth another look, best first, at most `limit`.
 *
 * `rows` should already be this child's rows (plus any household row with no
 * child on it). `exclude` holds scripts already on the page in a shelf above,
 * so the same card is never shown twice.
 */
export function revisitShelf(
  rows: CompletionLite[],
  opts: { now?: Date; exclude?: Set<number>; limit?: number } = {},
): Revisit[] {
  const now = (opts.now ?? new Date()).getTime()
  const exclude = opts.exclude ?? new Set<number>()
  const limit = opts.limit ?? 3

  // One row per script. A child row and a household row can both exist for
  // the same script; the more recent one is the truer picture.
  const latest = new Map<number, CompletionLite>()
  for (const r of rows) {
    const held = latest.get(r.script_sort_order)
    if (!held || String(r.completed_at ?? '') > String(held.completed_at ?? '')) latest.set(r.script_sort_order, r)
  }

  const out: (Revisit & { rank: number; age: number })[] = []
  for (const r of latest.values()) {
    if (exclude.has(r.script_sort_order)) continue
    if (r.status === 'not_needed') continue
    const at = r.completed_at ? Date.parse(r.completed_at) : NaN
    const age = Number.isFinite(at) ? (now - at) / DAY : 0

    if (r.worked === 'no' || r.worked === 'somewhat') {
      out.push({
        sort_order: r.script_sort_order, reason: 'did-not-land', rank: 0, age,
        line: r.worked === 'no'
          ? 'You said it did not land. The push back part is written for this'
          : 'You said it partly helped. Worth one more go',
      })
    } else if (r.status === 'used' && age >= REFRESH_AFTER_DAYS) {
      out.push({
        sort_order: r.script_sort_order, reason: 'refresh', rank: 1, age,
        line: `You used this ${weeksAgo(age)}. A quick look keeps the words ready`,
      })
    } else if (r.status === 'read' && age >= TRY_AFTER_DAYS) {
      out.push({
        sort_order: r.script_sort_order, reason: 'try-it', rank: 2, age,
        line: 'You read this one. Has the moment come up yet?',
      })
    }
  }

  return out
    .sort((a, b) => a.rank - b.rank || b.age - a.age)
    .slice(0, limit)
    .map(({ sort_order, reason, line }) => ({ sort_order, reason, line }))
}

/**
 * The tally a parent sees: conversations they have actually had.
 *
 * Counts up and never down. There is no streak and nothing to lose, on
 * purpose: a streak makes keeping the chain the goal (Silverman and Barasch
 * 2023), and the goal here is the conversation, which might rightly happen
 * once a fortnight.
 */
export function conversationTally(rows: CompletionLite[]): { had: number; wentWell: number } {
  const used = new Set<number>()
  const well = new Set<number>()
  for (const r of rows) {
    if (r.status === 'used' || r.worked) used.add(r.script_sort_order)
    if (r.worked === 'yes') well.add(r.script_sort_order)
  }
  return { had: used.size, wentWell: well.size }
}
