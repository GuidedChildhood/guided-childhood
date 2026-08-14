// WHEN A WORRY IS RESTING, AND WHAT IT IS RESTING FROM.
//
// Justin, 14 August 2026: "if doing great we can stop asking at check in unless
// they raise another moment", and then, about the moments deck: "this should
// then tie into check in so when they say issue is doing great it also drops
// off from moments."
//
// Two surfaces, one rule, so this is not written twice. The check in stops
// ASKING about a sorted worry; the moments deck stops BUILDING TODAY AROUND
// one. Both are the same judgement, and a product where the check in says
// bedtime is sorted while the morning card is still coaching you through
// bedtime is a product that is not listening.
//
// THE RULE. A worry rests when the last number the parent gave it was the top
// band, and nothing has raised it since. The way back needs no column of its
// own: raising it as a moment, through DiGi or through Right now all write
// last_flagged_at, so "re-raised since the good news" is exactly
// last_flagged_at being newer than the score that rested it. The row comes back
// on its own the moment the problem does, and there is nothing for anyone to
// remember to reset.
//
// It is deliberately NOT the resolved status. 'resolved' is the parent saying
// out loud that a thing is finished, which is a heavier claim than one good
// week, and 'improving' keeps a row in the list. Resting sits between the two.

/** The score at or above which a worry is sorted enough to rest. */
export const TOP_BAND = 9

export type RestableConcern = {
  id: string
  last_flagged_at: string
}

/**
 * Which of these concerns are resting.
 *
 * `lastScore` and `lastScoreAt` are the most recent scored event per concern id,
 * which both callers already have to read anyway to show last time's answer.
 */
export function restingConcernIds(
  concerns: RestableConcern[],
  lastScore: Map<string, number>,
  lastScoreAt: Map<string, string>,
): Set<string> {
  return new Set(
    concerns.filter(c => {
      const score = lastScore.get(c.id)
      if (typeof score !== 'number' || score < TOP_BAND) return false
      const at = lastScoreAt.get(c.id)
      if (!at) return true
      // Raised again since that good score? Then it is live again.
      //
      // Compared as instants rather than as strings. Postgres returns a
      // timestamp's fractional seconds at whatever precision it stored, so
      // ".5+00:00" and ".50+00:00" are the same moment and sort the wrong way
      // round lexically: the shorter one is a prefix, and then '+' sorts below
      // '0'. It is a microsecond either way and it would never be noticed,
      // which is exactly why it is worth not leaving in.
      return !(new Date(c.last_flagged_at).getTime() > new Date(at).getTime())
    }).map(c => c.id),
  )
}
