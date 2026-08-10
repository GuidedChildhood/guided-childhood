// Which script to put in front of a family today, once the signals are counted.
//
// Separate from recommend.ts, which reads the database, so this half can be run
// across simulated days by scripts/check-recommend-rotation.mjs. That is not a
// tidiness point: the bug below was correct on any single day and only wrong
// over time, which is exactly the shape nothing we had could see.

export type Scoring = {
  /** What this family's signals are worth for a category. Zero when nothing points at it. */
  scoreOfCategory: (category: string | null) => number
  /** Looked at and put down. */
  opened: Set<number>
  /** Set aside, and the return date has come. */
  returned: Set<number>
}

/** What one script is worth to this family today. */
export function scoreScript(s: Pick<ScriptRow, 'sort_order' | 'category'>, sc: Scoring): number {
  let score = sc.scoreOfCategory(s.category)
  // A script already glanced at loses to anything unseen carrying the same
  // signal, and still beats a script with no signal at all.
  if (sc.opened.has(s.sort_order)) score -= 30
  // One nudge for a script that was set aside and whose day has come, so a
  // return actually happens rather than waiting for the category to win on its
  // own.
  if (sc.returned.has(s.sort_order)) score += 15
  return score
}

/**
 * The one script to put in front of this family today.
 *
 * ── A TIE IS NOT A CHOICE, and it used to be resolved as one ────────────────
 *
 * Justin, 10 August 2026: "just the logic on the scripts bit recommends, and
 * make sure relevant for family history, child age, and not always repeated."
 *
 * Every signal in the recommender is a CATEGORY. A family with no concerns
 * logged, no devices listed and no signup answer that maps to a category scores
 * every script zero, and the old loop then kept the first one it had: the first
 * script in the stage, or the first FREE script for a family on the free plan,
 * for ever. Same card every morning, chosen by nothing but sort order. That is
 * how a script about a child coming out became the permanent recommendation for
 * a family who had never raised it, which is worse than unhelpful: it reads as
 * the app having decided something about their child.
 *
 * So a tie rotates, one a day across the whole tied group, by the day number.
 * Stateless for the same reason the daily look back card is: nothing to write
 * on read, and two devices on the same day agree.
 *
 * ONLY THE TIE ROTATES. A real signal still wins outright every day, because a
 * family who has raised something four times should not be handed a different
 * topic tomorrow for the sake of variety.
 */
export function chooseScript<T extends Pick<ScriptRow, 'sort_order' | 'category'>>(
  pool: T[],
  sc: Scoring & { dayIndex: number },
): T {
  const best = Math.max(...pool.map(s => scoreScript(s, sc)))
  const tied = pool.filter(s => scoreScript(s, sc) === best)
  return tied.length === 1 ? tied[0] : tied[((sc.dayIndex % tied.length) + tied.length) % tied.length]
}

type ScriptRow = { sort_order: number; category: string | null }
