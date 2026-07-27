import { recommendedDailyMinutes, bandLabelFor } from './screen-balance'

// The recommended daily viewing, read against what has actually been used
// today. A soft, age banded guide, never a hard limit: the child is alerted
// when they reach it, and anything beyond is framed as a treat a grown up
// allowed, not a rule they broke. Pure and side effect free so the timer, the
// child's screen and the parent's card can all share the exact same read.

export type DailyGuideStatus = 'under' | 'reached' | 'over'

export type DailyGuide = {
  recommended: number
  used: number
  remaining: number
  pct: number
  status: DailyGuideStatus
  overBy: number
  reached: boolean
  bandLabel: string
}

export function dailyGuide(ageBand: string | null, usedMinutes: number): DailyGuide {
  const recommended = recommendedDailyMinutes(ageBand)
  const used = Math.max(0, Math.round(usedMinutes || 0))
  const remaining = Math.max(0, recommended - used)
  const overBy = Math.max(0, used - recommended)
  const reached = recommended > 0 && used >= recommended
  const status: DailyGuideStatus = overBy > 0 ? 'over' : reached ? 'reached' : 'under'
  const pct = recommended > 0 ? Math.min(100, Math.round((used / recommended) * 100)) : 0
  return { recommended, used, remaining, pct, status, overBy, reached, bandLabel: bandLabelFor(ageBand) }
}

// Would granting this many more minutes now push the child past the day's
// recommended amount? Used to flag a grant as a treat before it starts.
export function wouldExceedGuide(ageBand: string | null, usedMinutes: number, addMinutes: number): boolean {
  return (Math.max(0, usedMinutes || 0) + Math.max(0, addMinutes || 0)) > recommendedDailyMinutes(ageBand)
}
