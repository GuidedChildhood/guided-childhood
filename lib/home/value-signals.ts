// Has a family seen the product work? Five signals, counted from real rows.
//
// Review board, 13 October 2026 (task board-reads-real-numbers): the board
// scored "value above AI" from code alone because nothing counted how many
// tester families had actually reached the moments that prove the product.
// The lens named five. This file is where each one is defined, once, so the
// admin product pulse and the weekly board run read the same arithmetic.
//
// Pure, no imports, so scripts/review-board.mjs can load it straight from the
// repo and a test can run it on a fixed set of rows.
//
//   memory            DiGi holds an active memory about the family
//                     (digi_memory.active), so it can say "you told me".
//   childLink         the child opened their own link at least once
//                     (kid_links.last_seen_at is set).
//   secondCheckIn     a worry has two scored check ins, the minimum for the
//                     What is working page to say anything moved
//                     (concern_events.score on the same concern, twice).
//   scriptVerdict     the parent told us how a script went: a concern event
//                     linked to a script that carries a better, same or hard
//                     answer (concern_events.linked_type 'script').
//   followUpAnswered  the parent answered DiGi's "how did that go?"
//                     (digi_outcomes.verdict is set).
//
// Counts only. No composite score, ever (lib/working/movement.ts): the
// output is how many families reached each signal and how many reached three,
// never a number per family.

export const SIGNALS = ['memory', 'childLink', 'secondCheckIn', 'scriptVerdict', 'followUpAnswered'] as const
export type Signal = (typeof SIGNALS)[number]

/** Family (parent user) ids per signal, plus every family that counts. */
export type SignalRows = { families: string[] } & Record<Signal, string[]>

export type ValueSignals = {
  /** Families in the denominator: every parent with at least one child. */
  families: number
  /** Families that reached each signal. */
  counts: Record<Signal, number>
  /** Families with a worry that has two scored check ins. Same as counts.secondCheckIn, named for the board's line. */
  secondCheckInFamilies: number
  /** Families that reached at least three of the five. */
  reachedThree: number
  /** Families that reached at least one of the five. */
  reachedAny: number
}

export const SIGNAL_THRESHOLD = 3

export function valueSignals(rows: SignalRows): ValueSignals {
  const family = new Set(rows.families.filter(Boolean))
  const per = new Map<string, number>()
  const counts = {} as Record<Signal, number>
  for (const s of SIGNALS) {
    const ids = new Set(rows[s].filter(id => family.has(id)))
    counts[s] = ids.size
    for (const id of ids) per.set(id, (per.get(id) ?? 0) + 1)
  }
  let reachedThree = 0
  for (const n of per.values()) if (n >= SIGNAL_THRESHOLD) reachedThree++
  return {
    families: family.size,
    counts,
    secondCheckInFamilies: counts.secondCheckIn,
    reachedThree,
    reachedAny: per.size,
  }
}

/** Parents who have a worry with two or more scored check ins. */
export function secondCheckInUsers(events: { concern_id: string; user_id: string; score: number | null }[]): string[] {
  const perConcern = new Map<string, { user: string; n: number }>()
  for (const e of events) {
    if (!e.concern_id || !e.user_id || typeof e.score !== 'number') continue
    const c = perConcern.get(e.concern_id) ?? { user: e.user_id, n: 0 }
    c.n++
    perConcern.set(e.concern_id, c)
  }
  const users = new Set<string>()
  for (const c of perConcern.values()) if (c.n >= 2) users.add(c.user)
  return [...users]
}
