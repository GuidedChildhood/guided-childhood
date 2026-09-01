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
  /**
   * Shown on the shelf for three separate days and never once opened
   * (surface_events, migration 238). The family has seen this card and
   * walked past it, which is quieter evidence than opening and abandoning
   * it, so the demotion is smaller than opened's: enough to let a fresh
   * pick with the same signal step forward, never enough to bury a script
   * a real concern points at. Optional so the rotation checker and older
   * callers need not know it exists.
   */
  tired?: ReadonlySet<number>
}

/** What one script is worth to this family today. */
export function scoreScript(s: Pick<ScriptRow, 'sort_order' | 'category'>, sc: Scoring): number {
  let score = sc.scoreOfCategory(s.category)
  // A script already glanced at loses to anything unseen carrying the same
  // signal, and still beats a script with no signal at all.
  if (sc.opened.has(s.sort_order)) score -= 30
  // Seen for days and never opened: the smaller demotion, argued above.
  else if (sc.tired?.has(s.sort_order)) score -= 10
  // One nudge for a script that was set aside and whose day has come, so a
  // return actually happens rather than waiting for the category to win on its
  // own.
  if (sc.returned.has(s.sort_order)) score += 15
  return score
}

/**
 * The scripts that are allowed to speak first.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 *
 * Justin, 11 August 2026: a shaper family on the free plan was handed "They
 * have told you they are gay, bi or trans" as their recommended next script,
 * while that same account's open concerns were morning screen time, ending
 * screen time and gaming.
 *
 * The free pool at that stage is five scripts and three of them are the
 * heaviest in the library. Two had been used, the family's real signals pointed
 * at categories holding no free script at all, so everything left scored zero
 * and the day rotation below picked between the survivors like a coin.
 *
 * The rotation is right and stays. The mistake was ever letting these scripts
 * into a tie. A script that ASSERTS something about a child, that they are self
 * harming, that they have come out, that somebody has died, that they are being
 * bullied, is not a suggestion. Put in front of a parent who has said nothing of
 * the kind, it is the app telling them something about their child.
 *
 * ── Why the bar is never, rather than "only with a signal" ───────────────────
 *
 * The first version of this rule let a flagged script through when its own
 * category was carrying a score. Run against the real account it was written
 * for, it let the coming out script straight back in, because that family had
 * an open concern called "evening neediness" and both of them file under mood
 * and confidence.
 *
 * That is the whole problem in one line. Our signals are CATEGORIES, eight
 * shelves wide, and every one of these scripts is a specific event. There is no
 * amount of "mood and confidence" that is evidence a child has come out, and no
 * amount of "staying safe" that is evidence a child is being bullied. A rule
 * that pretends otherwise is the same guess with a longer excuse.
 *
 * So they are never recommended, and nothing else changes: they stay in the
 * library, in the category browse, in search, and in Right Now, where the
 * parent is the one describing the situation. Every route to them that starts
 * with the parent is untouched. The only route closed is the one where we speak
 * first.
 *
 * If scripts ever carry the concern slugs they answer, rather than a category,
 * this can be relaxed to an exact match. Until then the honest bar is never.
 */
export function eligibleScripts<T extends Pick<ScriptRow, 'sort_order'>>(
  pool: T[],
  flagged: ReadonlySet<number>,
): T[] {
  if (flagged.size === 0) return pool
  return pool.filter(s => !flagged.has(s.sort_order))
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

/**
 * The top N scripts for this family today, strongest first.
 *
 * Justin, 1 September 2026: "a top 5 of scripts that apply to details we
 * gather for each child ... recommended scripts to choose from."
 *
 * Same scores, same rules, plural: every tied group is rotated by the day
 * number exactly as chooseScript rotates its single winner, so position one
 * here IS chooseScript's answer and the whole shelf turns over daily rather
 * than fossilising in sort order. The never speak first guard is the
 * caller's job (pass an eligible pool), because it applies to all five, not
 * just the first.
 */
export function rankScripts<T extends Pick<ScriptRow, 'sort_order' | 'category'>>(
  pool: T[],
  sc: Scoring & { dayIndex: number },
  n: number,
): T[] {
  const byScore = new Map<number, T[]>()
  for (const s of pool) {
    const score = scoreScript(s, sc)
    const held = byScore.get(score)
    if (held) held.push(s)
    else byScore.set(score, [s])
  }
  const out: T[] = []
  for (const score of [...byScore.keys()].sort((a, b) => b - a)) {
    const group = byScore.get(score)!
    const rot = ((sc.dayIndex % group.length) + group.length) % group.length
    out.push(...group.slice(rot), ...group.slice(0, rot))
    if (out.length >= n) break
  }
  return out.slice(0, n)
}

type ScriptRow = { sort_order: number; category: string | null }
