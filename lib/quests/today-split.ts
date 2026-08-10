// Today's jobs, split into banked, waiting and still to do.
//
// Justin, 10 August 2026, having ticked the first of his five a day on the child
// app: "strange, I did the first one of five on the child's app but when I check
// balance it says 0 stars?"
//
// ── Why the screen contradicted itself ───────────────────────────────────────
//
// A child's tick lands as `pending`. The star bank counts only `approved`, on
// purpose: the whole product is a parent saying yes, and stars that appear
// before the yes are stars a grown up did not give. So the balance card read
// zero, correctly.
//
// The card underneath it counted every tick that was not rejected and read ten.
// Also correct, about a different question. Two right numbers, one screen, and a
// child left to work out which of them is lying.
//
// ── The rule now ─────────────────────────────────────────────────────────────
//
// Banked and waiting are counted apart and both are named. Nothing is hidden and
// nothing is promised: the job is shown as done the moment it is ticked, because
// the child did it, and the stars are shown as waiting until a grown up says
// yes, because that is where they are.
//
// Pure and in lib so it can be checked without a database, which is the only
// reason the old version's disagreement survived: it lived in the middle of a
// server component where nothing could see it.

export type TickRow = {
  quest_id: string
  /** Null means a whole family quest, which counts for every child. */
  child_id: string | null
  status: string
}

export type QuestRow = {
  id: string
  stars: number
}

export type TodaySplit = {
  approvedIds: Set<string>
  waitingIds: Set<string>
  /** Stars a grown up has already said yes to today. These are in the bank. */
  earned: number
  /** Stars ticked and waiting on a yes. Real work, not yet spendable. */
  waiting: number
  /** Stars still sitting in untouched jobs. */
  stillToEarn: number
}

/**
 * Split today's due jobs for one child.
 *
 * `due` is the jobs that are due today and belong to this child; `ticks` is
 * today's tick rows for the family, unfiltered, because whole family ticks carry
 * a null child_id and have to be let through here rather than at the query.
 */
export function splitToday(due: QuestRow[], ticks: TickRow[], childId: string): TodaySplit {
  const mine = ticks.filter(t => t.child_id === null || t.child_id === childId)
  // A rejected tick is not a done job. It goes back to being outstanding, which
  // is the only reading that lets a child put it right.
  const live = mine.filter(t => t.status !== 'rejected')

  const approvedIds = new Set(live.filter(t => t.status === 'approved').map(t => t.quest_id))
  const waitingIds = new Set(
    live.filter(t => t.status !== 'approved').map(t => t.quest_id).filter(id => !approvedIds.has(id)),
  )

  // A quest with no stars set is worth one, matching the board everywhere else.
  const starsFor = (q: QuestRow) => Number(q.stars) || 1
  const sum = (ids: Set<string>) => due.filter(q => ids.has(q.id)).reduce((s, q) => s + starsFor(q), 0)

  return {
    approvedIds,
    waitingIds,
    earned: sum(approvedIds),
    waiting: sum(waitingIds),
    stillToEarn: due
      .filter(q => !approvedIds.has(q.id) && !waitingIds.has(q.id))
      .reduce((s, q) => s + starsFor(q), 0),
  }
}
