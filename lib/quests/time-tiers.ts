import { minutesToStars } from './device-time'
import { STAR_MINUTES } from './templates'
import { isSchoolHoliday, type Region } from '@/lib/learning/holidays'

// Three tier star time (plan: week-of-2026-08-26-star-tiers-plan.md).
//
//   CORE      a small unconditional daily baseline the parent set. It dies at
//             midnight, so it is the most perishable pocket and spends FIRST,
//             ahead of stars (gone Monday) and holiday minutes (never expire).
//             Refunds run the other way, exactly like holiday-spend.ts.
//   PROTECTED windows no stars can buy. A child self start inside one becomes
//             an ask, never a flat block (the first non-negotiable), and the
//             parent stays the override.
//
// Everything is per child. Siblings each have their own settings row, their
// own age band defaults, and their own core drawdown, so a family of three
// runs three independent tiers off one table read.

export type ChildTimeSettings = {
  /** Unconditional daily recreation minutes. 0 = core time not turned on. */
  coreMinutesDaily: number
  /** Bedtime window in minutes past midnight, Europe/London. */
  bedtimeStartMin: number | null
  bedtimeEndMin: number | null
  protectMealtimes: boolean
  protectSchoolHours: boolean
  /**
   * Minutes one star buys for THIS child (migration 225). Defaults to the
   * deployment STAR_MINUTES, so a family who never touches it keeps exactly
   * the rate they always had. Part of the fade: a parent can make a star buy
   * more as the child grows, loosening the exchange without loosening the deal.
   */
  starMinutes: number
}

// Bedtime defaults by age band, applied when the family has no row or left the
// bedtime null. Parent adjustable, and 16 plus has none, because at that age
// the system is meant to be handing the balance over, not holding it.
const DEFAULT_BEDTIME: Record<string, { start: string; end: string } | null> = {
  '4-7': { start: '19:00', end: '07:00' },
  '8-10': { start: '20:00', end: '07:00' },
  '11-13': { start: '21:00', end: '07:00' },
  '13-15': { start: '22:00', end: '07:00' },
  '16+': null,
}

// Fixed advisory windows when the mealtime toggle is on. Deliberately not
// configurable in phase 1: three windows a family recognises, not a calendar.
const MEAL_WINDOWS: [string, string][] = [
  ['07:30', '08:00'],
  ['12:00', '12:45'],
  ['17:30', '18:30'],
]

const SCHOOL_WINDOW: [string, string] = ['08:45', '15:15']

export function parseHm(v: string | null | undefined): number | null {
  if (!v || typeof v !== 'string') return null
  const m = /^(\d{1,2}):(\d{2})/.exec(v)
  if (!m) return null
  const mins = Number(m[1]) * 60 + Number(m[2])
  return Number.isFinite(mins) && mins >= 0 && mins < 1440 ? mins : null
}

/** Minutes past midnight and weekday in Europe/London, like the star week. */
export function londonClock(now: Date = new Date()): { minutes: number; weekday: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { minutes: hour * 60 + minute, weekday: dayIdx < 0 ? new Date().getUTCDay() : dayIdx }
}

/** Is `at` inside [start, end), where a window may cross midnight. */
function inWindow(at: number, start: number, end: number): boolean {
  if (start === end) return false
  return start < end ? at >= start && at < end : at >= start || at < end
}

export type ProtectedReason = 'bedtime' | 'mealtime' | 'school'

export type ProtectedCheck = { protected: false } | { protected: true; reason: ProtectedReason }

/**
 * Is this moment inside one of the child's protected windows?
 * The caller decides what to do with the answer; on the child's self start
 * that is always an ask to the parent, never a refusal.
 */
export function checkProtectedWindow(
  settings: ChildTimeSettings,
  opts: { now?: Date; region?: Region } = {},
): ProtectedCheck {
  const now = opts.now ?? new Date()
  const { minutes, weekday } = londonClock(now)

  if (settings.bedtimeStartMin !== null && settings.bedtimeEndMin !== null
    && inWindow(minutes, settings.bedtimeStartMin, settings.bedtimeEndMin)) {
    return { protected: true, reason: 'bedtime' }
  }
  if (settings.protectMealtimes) {
    for (const [s, e] of MEAL_WINDOWS) {
      if (inWindow(minutes, parseHm(s)!, parseHm(e)!)) return { protected: true, reason: 'mealtime' }
    }
  }
  if (settings.protectSchoolHours && weekday >= 1 && weekday <= 5
    && !isSchoolHoliday(now, opts.region ?? 'uk')
    && inWindow(minutes, parseHm(SCHOOL_WINDOW[0])!, parseHm(SCHOOL_WINDOW[1])!)) {
    return { protected: true, reason: 'school' }
  }
  return { protected: false }
}

// The words for each window, in the sturdy leadership shape: the boundary
// holds AND the feeling is real. Child facing, so short and warm. No dashes.
export const PROTECTED_CHILD_LINE: Record<ProtectedReason, string> = {
  bedtime: 'Screens are resting now. I know that is disappointing. Morning is coming.',
  mealtime: 'Screens rest while we eat. I know it is hard to pause. It will still be there after.',
  school: 'Screens rest during school time. I know you want it now. Home time is coming.',
}

export const PROTECTED_PARENT_LINE: Record<ProtectedReason, string> = {
  bedtime: 'It is inside their bedtime window, so it came to you instead of starting.',
  mealtime: 'It is inside a mealtime window, so it came to you instead of starting.',
  school: 'It is inside school hours, so it came to you instead of starting.',
}

type SettingsRow = {
  child_id: string
  core_minutes_daily: number | null
  bedtime_start: string | null
  bedtime_end: string | null
  protect_mealtimes: boolean | null
  protect_school_hours: boolean | null
  star_minutes?: number | null
}

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * The time settings for each child, defaults applied. One read for the whole
 * family: pass every child and each gets their own row or their age band's
 * defaults, so multi child costs the same as one.
 *
 * Fails soft: on a database still short of migration 223 the read errors and
 * every child gets the defaults, which for core is 0 (exactly the old
 * behaviour) and for bedtime is the age band window.
 */
export async function getTimeSettings(
  supabase: Client,
  userId: string,
  children: { id: string; age_band?: string | null }[],
): Promise<Map<string, ChildTimeSettings>> {
  const out = new Map<string, ChildTimeSettings>()
  if (children.length === 0) return out

  let rows: SettingsRow[] = []
  try {
    // select * so a column that arrives with a later migration (star_minutes,
    // 225) flows through when present and its absence never fails the read,
    // which would silently reset every child to the defaults.
    const { data, error } = await supabase
      .from('child_time_settings')
      .select('*')
      .eq('user_id', userId)
      .in('child_id', children.map(c => c.id))
    if (!error && data) rows = data as SettingsRow[]
  } catch { /* defaults below */ }

  const byChild = new Map(rows.map(r => [String(r.child_id), r]))
  for (const child of children) {
    const row = byChild.get(child.id)
    const fallback = DEFAULT_BEDTIME[child.age_band ?? ''] ?? null
    const start = parseHm(row?.bedtime_start) ?? (fallback ? parseHm(fallback.start) : null)
    const end = parseHm(row?.bedtime_end) ?? (fallback ? parseHm(fallback.end) : null)
    const rate = Number(row?.star_minutes)
    out.set(child.id, {
      coreMinutesDaily: Math.max(0, Number(row?.core_minutes_daily) || 0),
      bedtimeStartMin: start,
      bedtimeEndMin: end,
      protectMealtimes: Boolean(row?.protect_mealtimes),
      protectSchoolHours: Boolean(row?.protect_school_hours),
      starMinutes: Number.isFinite(rate) && rate >= 1 && rate <= 60 ? rate : STAR_MINUTES,
    })
  }
  return out
}

/**
 * Core minutes already drawn today (UTC day, matching getMinutesUsedToday),
 * per child, read off the sessions that recorded a core draw.
 * Fails soft to zero drawn on a database short of migration 223.
 */
export async function getCoreUsedToday(
  supabase: Client,
  userId: string,
  childIds: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  for (const id of childIds) out.set(id, 0)
  if (childIds.length === 0) return out
  const dayStart = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z').toISOString()
  try {
    const { data, error } = await supabase
      .from('device_sessions')
      .select('child_id, core_minutes')
      .eq('user_id', userId).gte('started_at', dayStart).in('child_id', childIds)
    if (error || !data) return out
    for (const s of data) {
      const cid = String(s.child_id)
      out.set(cid, (out.get(cid) ?? 0) + (Number((s as { core_minutes?: number }).core_minutes) || 0))
    }
  } catch { /* zero drawn */ }
  return out
}

export type TieredSpendPlan = {
  enough: boolean
  /** Minutes covered by today's unconditional core baseline. */
  coreMinutes: number
  /** Minutes covered by the weekly star balance, and what they cost. */
  starMinutes: number
  starCost: number
  /** Minutes covered by the holiday bank. */
  holidayMinutes: number
}

/**
 * How to pay for a block out of three pockets, most perishable first:
 * core (dies tonight), then stars (die Monday), then holiday (never).
 * With coreLeft 0 this is exactly planSpend from holiday-spend.ts.
 */
export function planTieredSpend(
  needMinutes: number,
  coreLeft: number,
  starBalance: number,
  holidayAvailable: number,
  holidaySpendableNow: boolean,
  /** Minutes one star buys for this child (migration 225). Defaults to the deployment rate. */
  starMinutesRate: number = STAR_MINUTES,
): TieredSpendPlan {
  const need = Math.max(0, Math.round(needMinutes))
  const rate = Math.max(1, Math.round(starMinutesRate))
  const corePot = Math.max(0, Math.round(coreLeft))
  const starPot = Math.max(0, starBalance) * rate
  const holidayPot = holidaySpendableNow ? Math.max(0, Math.round(holidayAvailable)) : 0

  const coreMinutes = Math.min(need, corePot)
  const starMinutes = Math.min(need - coreMinutes, starPot)
  const holidayMinutes = Math.min(need - coreMinutes - starMinutes, holidayPot)

  return {
    enough: coreMinutes + starMinutes + holidayMinutes >= need,
    coreMinutes,
    starMinutes,
    starCost: minutesToStars(starMinutes, rate),
    holidayMinutes,
  }
}

export type TieredRefundPlan = {
  /** Minutes going back to the holiday bank. */
  holidayRefund: number
  holidayKept: number
  /** What the star spend should be trimmed to. */
  starCost: number
  /** What the session's core draw should be trimmed to. */
  coreKept: number
  unchanged: boolean
}

/**
 * Unwind a block that ended early. Used minutes are attributed in payment
 * order (core, stars, holiday), so refunds fall out in reverse: the holiday
 * bank is made whole first, then the star spend is trimmed, and the core draw
 * gives back last, because tonight it is worth the least. With coreDrawn 0
 * this matches planRefund from holiday-spend.ts exactly.
 */
export function planTieredRefund(
  plannedMinutes: number,
  usedMinutes: number,
  holidayDrawn: number,
  coreDrawn: number,
  /** Minutes one star buys for this child, matching what the start charged. */
  starMinutesRate: number = STAR_MINUTES,
): TieredRefundPlan {
  const planned = Math.max(0, Math.round(plannedMinutes))
  const used = Math.max(0, Math.min(planned, Math.round(usedMinutes)))
  const core = Math.max(0, Math.min(planned, Math.round(coreDrawn)))
  const holiday = Math.max(0, Math.min(planned - core, Math.round(holidayDrawn)))
  const starPlanned = planned - core - holiday

  const coreKept = Math.min(core, used)
  const starKeptMinutes = Math.min(starPlanned, used - coreKept)
  const holidayKept = Math.min(holiday, used - coreKept - starKeptMinutes)

  return {
    holidayRefund: holiday - holidayKept,
    holidayKept,
    starCost: minutesToStars(starKeptMinutes, starMinutesRate),
    coreKept,
    unchanged: used === planned,
  }
}
