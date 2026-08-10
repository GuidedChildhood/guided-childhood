// Which script the daily check in looks back at, and why.
//
// Justin, 10 August 2026, on the "From last time" card: "this keeps coming up
// every day I do it, can you check the logic on this and make sure it rotates
// and is truly intuitive and chooses relating to previous or runs through a
// programme so they are not repeated unless there is a problem. They could also
// relate to history check ins."
//
// ── Why it was stuck ─────────────────────────────────────────────────────────
//
// The card read the single most recent script_completions row with LIMIT 1. That
// is not a rotation, it is a pin. Until a parent completes a NEW script the card
// shows the same one forever, and Justin had been looking at "A low mood that
// will not lift" every day since he opened it.
//
// The copy made it worse rather than merely repetitive. "Last time you reached
// for the words for this one" is a claim about recency, and on day thirty it is
// simply untrue. A card that says something false about your own history is
// worse than a card that repeats.
//
// ── What replaces it ─────────────────────────────────────────────────────────
//
// Three rules, in order, and the card SAYS which one applied. The reason is the
// whole point: "worth another look" and "this one did not land" are different
// messages and a parent can tell instantly whether we are being useful or just
// filling a slot.
//
//   1. A PROBLEM outranks everything. A script the parent marked as not having
//      worked is the one worth returning to, and it is exactly the exception
//      Justin asked for to the no repeats rule. It may come back around.
//   2. SOMETHING THEY HAVE JUST FLAGGED. If a recent check in raised a topic and
//      they already own a script for it, that is the most useful thing we can
//      put in front of them today.
//   3. OTHERWISE ROTATE, one per day across everything they have completed, so
//      nothing comes back until the whole set has been round.
//
// Stateless on purpose. The rotation is a function of the day number and the
// list, so it needs no "last shown" column, nothing to write on read, and two
// devices on the same day agree.

/**
 * How long a script that did not work keeps its claim on the card.
 *
 * Thirty days. Long enough to be a real second attempt, short enough that a
 * single bad week cannot become the permanent shape of a parent's mornings.
 */
const FAILURE_WINDOW_MS = 30 * 86400000

export type Completion = {
  script_sort_order: number
  completed_at: string
  /** 'yes' | 'somewhat' | 'no', or null when never answered. */
  worked?: string | null
}

export type ReviewPick = {
  sortOrder: number
  /** Why this one, which decides what the card says. */
  reason: 'did-not-work' | 'flagged' | 'rotation' | 'only-one'
  /** How many they have completed, so the card can say "3 of 12". */
  total: number
  /** True when this is genuinely their most recent, so the copy may say so. */
  isMostRecent: boolean
}

/**
 * Pick the script to look back at today.
 *
 * `matchesTopic` decides whether a completed script relates to a flagged topic.
 * It is passed in rather than done here because the caller holds the script
 * titles; this module only ever sees sort orders and dates.
 */
export function pickReview(
  completions: Completion[],
  dayIndex: number,
  matchesTopic?: (sortOrder: number) => boolean,
): ReviewPick | null {
  if (completions.length === 0) return null

  // Newest first, which is the order the rest of this reasons in.
  const byRecent = [...completions].sort(
    (a, b) => Date.parse(b.completed_at) - Date.parse(a.completed_at),
  )
  const total = byRecent.length
  const mostRecent = byRecent[0].script_sort_order

  const pick = (sortOrder: number, reason: ReviewPick['reason']): ReviewPick => ({
    sortOrder,
    reason,
    total,
    isMostRecent: sortOrder === mostRecent,
  })

  // One completion is not a rotation. Say so honestly rather than pretending to
  // cycle through a set of one.
  if (total === 1) return pick(mostRecent, 'only-one')

  // 1. Did not work, but only while it is still live, and rotating if there
  //    are several.
  //
  //    The first version of this rule simply returned the failure, and that
  //    quietly rebuilt the bug it was written to fix: one script marked as not
  //    working would have pinned the card forever, exactly as LIMIT 1 did, just
  //    with a different trigger. A parent would have been shown their own worst
  //    moment every morning until the end of time.
  //
  //    So a failure wins for thirty days and then rejoins the ordinary
  //    rotation. That is long enough to be a genuine second go at something
  //    that did not land, and short enough that it cannot become the furniture.
  const failed = byRecent.filter(
    c => c.worked === 'no' && Date.now() - Date.parse(c.completed_at) < FAILURE_WINDOW_MS,
  )
  if (failed.length > 0) {
    return pick(failed[dayIndex % failed.length].script_sort_order, 'did-not-work')
  }

  // 2. Something they have flagged since. Most recently completed match, so a
  //    parent is handed the words they used most lately for this.
  if (matchesTopic) {
    const flagged = byRecent.find(c => matchesTopic(c.script_sort_order))
    if (flagged) return pick(flagged.script_sort_order, 'flagged')
  }

  // 3. Rotate. Oldest first so the set is walked in the order it was built,
  //    which makes a run through feel like a journey back rather than a shuffle.
  const byOldest = [...byRecent].reverse()
  return pick(byOldest[dayIndex % total].script_sort_order, 'rotation')
}

/** How long ago, in words a person uses. Empty when it is not worth saying. */
export function agoLabel(completedAt: string, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - Date.parse(completedAt)) / 86400000)
  if (!Number.isFinite(days) || days < 0) return ''
  if (days === 0) return 'earlier today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'last week'
  if (days < 62) return `${Math.round(days / 7)} weeks ago`
  return `${Math.round(days / 30)} months ago`
}
