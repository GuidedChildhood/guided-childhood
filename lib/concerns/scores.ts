// Reading a worry's score history, once, the same way everywhere.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Six places ask concern_events the same question, order it the same way and
// build the same two maps by hand: the check in, done-today, the moments
// deck, the pathway page, the sorted list and the report. Six copies of a
// loop is six chances to read it differently, and the rule that reads those
// maps has just grown from "the last score" to "the last few scores", which
// no hand rolled copy would have picked up.
//
// So the loop lives here and returns everything any caller needs from one
// pass: the last score, when it landed, how many top band scores are on the
// end of the run, and the FIRST score, which is the base a family's progress
// is measured from.
//
// ── THE BASE ────────────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "use as base as part of the reporting
// improvements."
//
// concern_events has carried a score_at_start column since the beginning and
// it has been written 0 times out of 117 scores, so the base has never
// existed as data. It does not need to: the first score a parent ever gave a
// worry IS the base, it is already in the table, and deriving it cannot drift
// from the truth the way a denormalised column can. `first` below is that
// number, and it is what lets a report say "you started at Really tough and
// you are at Getting there" instead of only "raised four times".

/** One scored row, as every caller already selects it. */
export type ScoredEvent = {
  concern_id: string
  score: number | null
  created_at: string
}

export type ScoreReading = {
  /** The most recent score per concern. */
  last: Map<string, number>
  /** When that score landed, as the stored timestamp string. */
  lastAt: Map<string, string>
  /** The first score the parent ever gave it. The base. */
  first: Map<string, number>
  /** When the base was set. */
  firstAt: Map<string, string>
  /** How many scores on the END of the run are top band, without a break. */
  topRun: Map<string, number>
  /** How many scores this worry has in total. */
  count: Map<string, number>
}

/**
 * Read a set of scored events into everything the rules need.
 *
 * `events` must be NEWEST FIRST, which is the order all six callers already
 * ask for. Rows with a null score are ignored rather than treated as zero: a
 * skipped day is not a bad day, and counting it as one would break the run
 * that decides whether a worry has reached silver.
 */
export function readScores(events: ScoredEvent[], topBand: number): ScoreReading {
  const last = new Map<string, number>()
  const lastAt = new Map<string, string>()
  const first = new Map<string, number>()
  const firstAt = new Map<string, string>()
  const topRun = new Map<string, number>()
  const count = new Map<string, number>()
  // Whether the top band run for a concern is still unbroken as we walk back.
  const running = new Map<string, boolean>()

  for (const e of events) {
    if (typeof e.score !== 'number') continue
    const id = e.concern_id
    if (!last.has(id)) {
      last.set(id, e.score)
      lastAt.set(id, e.created_at)
      running.set(id, true)
      topRun.set(id, 0)
    }
    count.set(id, (count.get(id) ?? 0) + 1)
    // Newest first, so the LAST one seen for a concern is its first ever.
    first.set(id, e.score)
    firstAt.set(id, e.created_at)
    if (running.get(id)) {
      if (e.score >= topBand) topRun.set(id, (topRun.get(id) ?? 0) + 1)
      else running.set(id, false)
    }
  }

  return { last, lastAt, first, firstAt, topRun, count }
}
