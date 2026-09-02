import type { ChildTimeSettings } from '@/lib/quests/time-tiers'
import type { DealFacts } from '@/components/printables/drawn'

// The family's real deal, as the drawn sheets print it.
//
// My Screen Time Deal and Phones Go To Bed write the numbers the app already
// holds onto the paper (minutes per star, the daily core, the bedtime, the
// protected windows), so the sheet on the fridge never disagrees with the
// app. This is the one translation from a child's time settings row to the
// words on the page, used by the child's print route and the parent's.

function hm(min: number | null): string | null {
  if (min === null || !Number.isFinite(min)) return null
  const m = ((Math.round(min) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export function dealFactsFrom(s: ChildTimeSettings): DealFacts {
  const start = hm(s.bedtimeStartMin)
  const end = hm(s.bedtimeEndMin)
  return {
    starMinutes: s.starMinutes,
    coreMinutesDaily: s.coreMinutesDaily,
    bedtime: start && end ? { start, end } : null,
    mealtimes: s.protectMealtimes,
    schoolHours: s.protectSchoolHours,
  }
}
