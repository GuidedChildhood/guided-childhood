// WHEN A LESSON COMES BACK FOR A REMEMBER CHECK
// (plans/2026-10-08-lessons-hub-plan.md 6.3, built with the passport journey
// plan, 17 October 2026).
//
// Justin asked for "confidence the child is actually learning as they get
// older". A pass shows the child got it on the day. Only a question asked
// again weeks later shows they kept it (Soderstrom and Bjork 2015: performance
// during learning is an unreliable index of what lasts). So every lesson the
// child has ever passed comes back: about a week after the pass, again at a
// month, then every three months, for as long as the passport runs, through
// every age up.
//
// Pure, so the guard runs it on dates. Three at most a check, the most overdue
// first, never one asked in the last 25 days.

export const CHECKPOINT_DAYS = [5, 30, 90] as const
/** After 90, every 90 days. */
export const REPEAT_DAYS = 90
export const MAX_PER_CHECK = 3
const FLOOR_DAYS = 25
const DAY = 86400000

/** The day after the pass at which the next check falls, given the last time this lesson was asked. */
export function nextCheckpoint(lastAskedDay: number | null): number {
  if (lastAskedDay === null) return CHECKPOINT_DAYS[0]
  for (const cp of CHECKPOINT_DAYS) if (cp > lastAskedDay + 1) return cp
  // Past 90: the next multiple of 90 after the last ask.
  return (Math.floor(lastAskedDay / REPEAT_DAYS) + 1) * REPEAT_DAYS
}

export type RememberPass = { lessonId: string; passedAt: string }

/** The lessons due a Remember check now, most overdue first, three at most. */
export function rememberDue(args: {
  passes: RememberPass[]
  /** The last Remember answer per lesson. */
  lastAsked: Map<string, string>
  now?: Date
}): string[] {
  const now = (args.now ?? new Date()).getTime()
  const due: { id: string; overdue: number }[] = []
  for (const p of args.passes) {
    const passedAt = Date.parse(p.passedAt)
    if (Number.isNaN(passedAt)) continue
    const days = (now - passedAt) / DAY
    const asked = args.lastAsked.get(p.lessonId)
    const askedAt = asked ? Date.parse(asked) : NaN
    const lastAskedDay = Number.isNaN(askedAt) ? null : (askedAt - passedAt) / DAY
    if (lastAskedDay !== null && (now - askedAt) / DAY < FLOOR_DAYS) continue
    const cp = nextCheckpoint(lastAskedDay)
    if (days >= cp) due.push({ id: p.lessonId, overdue: days - cp })
  }
  return due.sort((a, b) => b.overdue - a.overdue).slice(0, MAX_PER_CHECK).map(d => d.id)
}
