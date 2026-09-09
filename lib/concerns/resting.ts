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
// THE RULE, AS OF 9 SEPTEMBER 2026. A worry rests when it has scored the top
// band TWICE IN A ROW, nothing has raised it since, and it has been asked
// about within the last week.
//
// It used to rest on ONE top score, and that was too easy. Justin: "we include
// the issues in daily check up until silver". On the live data the old rule had
// eighteen worries resting and four of them rested on their ONLY EVER score, so
// a family could have one calm Sunday and never be asked about bedtime again.
// One good day is not a fixed problem, it is a good day.
//
// Two in a row is deliberately the smallest thing that is still evidence.
// Justin chose it over three days or two weeks for the reason the check in
// exists at all: a list a parent can finish is a list they fill in, and every
// extra day before the first win is a day of answering the same question with
// nothing to show for it.
//
// AND IT COMES BACK WEEKLY, WHICH IS THE OTHER HALF. Resting is not gone. A
// silver worry drops out of the DAILY list and returns after seven days, so the
// family keeps proving it held, and the report has something to show. Seven
// rolling days rather than every Sunday on purpose: pinning the whole product
// to one weekday gives every family the same enormous Sunday and six quiet
// days, where rolling spreads them out and asks each worry a week after the
// last time it was actually answered.
//
// The way back needs no column of its own: raising it as a moment, through
// DiGi or through Right now all write last_flagged_at, so "re-raised since the
// good news" is exactly last_flagged_at being newer than the score that rested
// it. The row comes back on its own the moment the problem does, and there is
// nothing for anyone to remember to reset.
//
// It is deliberately NOT the resolved status. 'resolved' is the parent saying
// out loud that a thing is finished, which is a heavier claim than two good
// days, and 'improving' keeps a row in the list. Resting sits between the two.

/** The score at or above which a day counts as a good one. */
export const TOP_BAND = 9

/** How many good days in a row reach silver, and rest the worry. */
export const SILVER_RUN = 2

/** How long a silver worry stays out of the daily list before it is asked again. */
export const WEEKLY_DAYS = 7

export type RestableConcern = {
  id: string
  last_flagged_at: string
}

/**
 * Which of these concerns are resting, and so are not asked about today.
 *
 * `topRun` and `lastScoreAt` both come from readScores (lib/concerns/scores),
 * which every caller uses so the run is counted the same way in all six places
 * that ask this question.
 */
export function restingConcernIds(
  concerns: RestableConcern[],
  topRun: Map<string, number>,
  lastScoreAt: Map<string, string>,
  now: Date = new Date(),
): Set<string> {
  const weekAgo = now.getTime() - WEEKLY_DAYS * 24 * 60 * 60 * 1000
  return new Set(
    concerns.filter(c => {
      // Not yet two good days in a row, so it is still daily.
      if ((topRun.get(c.id) ?? 0) < SILVER_RUN) return false
      const at = lastScoreAt.get(c.id)
      if (!at) return false
      const scoredAt = new Date(at).getTime()
      // A week since anyone asked. Time to check it held.
      if (scoredAt <= weekAgo) return false
      // Raised again since that good score? Then it is live again.
      //
      // Compared as instants rather than as strings. Postgres returns a
      // timestamp's fractional seconds at whatever precision it stored, so
      // ".5+00:00" and ".50+00:00" are the same moment and sort the wrong way
      // round lexically: the shorter one is a prefix, and then '+' sorts below
      // '0'. It is a microsecond either way and it would never be noticed,
      // which is exactly why it is worth not leaving in.
      return !(new Date(c.last_flagged_at).getTime() > scoredAt)
    }).map(c => c.id),
  )
}

/** Where a worry has got to, for anything that reports rather than asks. */
export type Rung = 'new' | 'working' | 'silver'

export function rungOf(topRun: number | undefined, hasScore: boolean): Rung {
  if (!hasScore) return 'new'
  return (topRun ?? 0) >= SILVER_RUN ? 'silver' : 'working'
}
