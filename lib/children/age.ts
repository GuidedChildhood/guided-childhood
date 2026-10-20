import type { AgeBand } from '@/lib/content/stages'

// The single source of truth for turning a birthday into an age band and a
// stage. The age up cron, the settings form and any future surface all lean
// on this one file, so the platform can never disagree with itself about
// when a child grows up.
//
// The canonical bands overlap at 13 ('11-13' and '13-15' both name it). We
// resolve the tie the way the band labels read: the 13th birthday opens the
// Shaper stage, so Explorer covers ages 11 and 12 and Shaper covers 13 to
// 15. That matches the ai_lessons audience mapping in lib/pathway/journey.ts,
// where age_13 content is Shaper content.

export type StageSlug = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

const BAND_TO_STAGE: Record<AgeBand, StageSlug> = {
  '4-7': 'foundation',
  '8-10': 'builder',
  '11-13': 'explorer',
  '13-15': 'shaper',
  '16+': 'independent',
}

// Whole years old on a given date. Null when the birthday is missing,
// unparseable, or in the future.
export function ageFromDob(dob: string | Date | null | undefined, on: Date = new Date()): number | null {
  if (!dob) return null
  const birth = typeof dob === 'string' ? new Date(`${dob.slice(0, 10)}T00:00:00Z`) : dob
  if (Number.isNaN(birth.getTime())) return null
  let age = on.getUTCFullYear() - birth.getUTCFullYear()
  const beforeBirthday =
    on.getUTCMonth() < birth.getUTCMonth() ||
    (on.getUTCMonth() === birth.getUTCMonth() && on.getUTCDate() < birth.getUTCDate())
  if (beforeBirthday) age -= 1
  return age >= 0 ? age : null
}

// WE START AT 4 (Justin, 16 October 2026). The parent of a 2 or 3 year old is
// a customer later, not now: every stage, lesson and script begins at 4. So
// every place a parent gives a birthday (the stage check, setup, adding a
// child) asks isTooYoung first and says so warmly, rather than letting the
// clamp below file a toddler under ages 4 to 7 without a word.
export const YOUNGEST_AGE = 4

/** True only when the birthday is known and the child is not yet 4. */
export function isTooYoung(dob: string | Date | null | undefined, on: Date = new Date()): boolean {
  const age = ageFromDob(dob, on)
  return age !== null && age < YOUNGEST_AGE
}

/** The month and year a child turns 4, for the "come back then" line. */
export function turnsFourOn(dob: string | Date | null | undefined): { month: number; year: number } | null {
  if (!dob) return null
  const birth = typeof dob === 'string' ? new Date(`${dob.slice(0, 10)}T00:00:00Z`) : dob
  if (Number.isNaN(birth.getTime())) return null
  return { month: birth.getUTCMonth() + 1, year: birth.getUTCFullYear() + YOUNGEST_AGE }
}

// The band a whole year age lands in. Ages under 4 still clamp into the first
// band, but only for a child already stored (the age up cron reads every
// row); no sign up path lets a new one through, see isTooYoung above.
export function bandForYears(age: number): AgeBand {
  if (age <= 7) return '4-7'
  if (age <= 10) return '8-10'
  if (age <= 12) return '11-13'
  if (age <= 15) return '13-15'
  return '16+'
}

// The main entry: birthday in, band out. Null when no band can be derived,
// in which case the stored age_band stands.
export function bandForAge(dob: string | Date | null | undefined, on: Date = new Date()): AgeBand | null {
  const age = ageFromDob(dob, on)
  if (age === null) return null
  return bandForYears(age)
}

// The stage slug the children.stage_id column stores for a band.
export function stageForBand(band: AgeBand): StageSlug {
  return BAND_TO_STAGE[band]
}

// Whether the given date is the child's actual birthday, so the age up
// celebration can say turns N today only when it is true, and say is N now
// when a birthday was added after the fact.
export function isBirthdayOn(dob: string | Date | null | undefined, on: Date = new Date()): boolean {
  if (!dob) return false
  const birth = typeof dob === 'string' ? new Date(`${dob.slice(0, 10)}T00:00:00Z`) : dob
  if (Number.isNaN(birth.getTime())) return false
  return birth.getUTCMonth() === on.getUTCMonth() && birth.getUTCDate() === on.getUTCDate()
}
