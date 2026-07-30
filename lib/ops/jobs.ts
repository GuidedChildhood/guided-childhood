import vercel from '@/vercel.json'

// What is meant to run, how often, and therefore when silence has gone on too
// long.
//
// The list is read straight out of vercel.json rather than typed out again
// here. A hand kept copy is a copy that goes stale, and a monitor that has
// quietly stopped watching a job it no longer knows about is worse than one
// that never watched it: the board would still be green.

export type Job = {
  path: string          // '/api/email/digest', the key written to cron_runs.job
  schedule: string      // the raw five field cron expression
  label: string         // what to call it on the board
  expectedGapMs: number // longest healthy silence before this counts as overdue
}

// Only the wording is kept by hand, because "0 20 8 * * *" tells you nothing at
// a glance and the board is read at speed. A job with no entry falls back to
// its path, so a new cron shows up unnamed rather than not at all.
const LABELS: Record<string, string> = {
  '/api/cron/device-time': 'Device time sync',
  '/api/push/cron': 'Push queue',
  '/api/push/reengage': 'Re engage push',
  '/api/school/remind': 'School reminders',
  '/api/school/morning': 'School morning send',
  '/api/email/cron': 'Lifecycle emails',
  '/api/email/digest': 'Weekly digest',
  '/api/email/monthly': 'Monthly review',
  '/api/cron/age-up': 'Birthday age up',
  '/api/cron/digi-insights': 'DiGi insights',
  '/api/cron/digi-wisdom': 'DiGi wisdom',
  '/api/cron/digi-quality': 'DiGi quality check',
  '/api/cron/weekly-review': 'Weekly review',
  '/api/cron/settings-nudge': 'Settings nudge',
  '/api/cron/knowledge-refresh': 'Knowledge bank refresh',
  '/api/cron/device-guide-refresh': 'Device guide refresh',
  '/api/cron/legal-watch': 'Legal watch',
  '/api/cron/script-refresh': 'Script refresh',
  '/api/cron/lesson-drip': 'Lesson drip',
  '/api/cron/job-reminders?band=morning': 'Job reminders (morning)',
  '/api/cron/job-reminders?band=after_school': 'Job reminders (after school)',
  '/api/cron/job-reminders?band=evening': 'Job reminders (evening)',
  '/api/cron/star-week-rollover': 'Star week rollover',
  '/api/cron/health-alert': 'Health alert',
}

/** '*' widens to null, meaning every value. Everything else becomes a set. */
function parseField(field: string, min: number, max: number): Set<number> | null {
  if (field === '*') return null
  const out = new Set<number>()
  for (const part of field.split(',')) {
    const [range, stepRaw] = part.split('/')
    const step = stepRaw ? Number(stepRaw) : 1
    let lo = min
    let hi = max
    if (range !== '*') {
      const [a, b] = range.split('-')
      lo = Number(a)
      hi = b === undefined ? (stepRaw ? max : Number(a)) : Number(b)
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || !Number.isFinite(step) || step < 1) continue
    for (let v = lo; v <= hi; v += step) out.add(v)
  }
  return out.size ? out : null
}

/** Step size for a wildcard or stepped field, else null for a fixed list. */
function stepOf(field: string): number | null {
  if (field === '*') return 1
  const m = /^\*\/(\d+)$/.exec(field)
  return m ? Number(m[1]) : null
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * The longest gap the schedule can legitimately produce.
 *
 * Deliberately generous. A monitor that cries wolf gets ignored, and an ignored
 * monitor is the same as none, so every branch rounds towards patience: a
 * quarterly job is allowed its full quarter of silence before anyone is told.
 */
export function expectedGapMs(schedule: string): number {
  const [minute = '*', hour = '*', dom = '*', month = '*', dow = '*'] = schedule.trim().split(/\s+/)

  // Three missed cycles before anyone is told, never less than a quarter of an
  // hour. A job running every minute would otherwise turn red the first time a
  // single run was a few seconds late, and a board that goes red on its own
  // noise gets closed and not reopened.
  const minuteStep = stepOf(minute)
  if (minuteStep !== null) return Math.max(minuteStep * 3, 15) * MINUTE

  const hourStep = stepOf(hour)
  if (hourStep !== null) return hourStep * 3 * HOUR

  // Fixed time of day. What remains is how far apart the matching days are, so
  // walk a couple of years of calendar and take the widest stretch. Cheap
  // (roughly 800 iterations) and, unlike arithmetic on the fields, it gets the
  // awkward ones right: month lengths, leap days, and the cron rule that a
  // restricted day-of-month and day-of-week mean "either", not "both".
  const domSet = parseField(dom, 1, 31)
  const dowSet = parseField(dow, 0, 7)
  const monthSet = parseField(month, 1, 12)
  const domRestricted = dom !== '*'
  const dowRestricted = dow !== '*'

  const matches = (d: Date): boolean => {
    if (monthSet && !monthSet.has(d.getUTCMonth() + 1)) return false
    const day = d.getUTCDate()
    const weekday = d.getUTCDay()
    const domHit = !domSet || domSet.has(day)
    const dowHit = !dowSet || dowSet.has(weekday) || (weekday === 0 && dowSet.has(7))
    if (domRestricted && dowRestricted) return domHit || dowHit
    return domHit && dowHit
  }

  // Anchored to a fixed date, never "today", so the answer is the same on every
  // render and in every test.
  const start = Date.UTC(2027, 0, 1)
  let previous: number | null = null
  let widest = 0
  for (let i = 0; i < 800; i++) {
    const d = new Date(start + i * DAY)
    if (!matches(d)) continue
    if (previous !== null) widest = Math.max(widest, i - previous)
    previous = i
  }
  if (widest === 0) widest = 1

  // A run is late only once a whole further cycle could have happened, and the
  // hour it fires at can sit anywhere in the day, so a day of slack is added.
  return widest * DAY + DAY
}

/** Every declared cron, in the order vercel.json lists them. */
export const JOBS: Job[] = ((vercel as { crons?: { path: string; schedule: string }[] }).crons ?? []).map(c => ({
  path: c.path,
  schedule: c.schedule,
  label: LABELS[c.path] ?? c.path,
  expectedGapMs: expectedGapMs(c.schedule),
}))

/** Jobs whose silence should wake somebody, as opposed to merely show amber. */
export const CRITICAL = new Set<string>([
  '/api/email/cron',
  '/api/email/digest',
  '/api/email/monthly',
  '/api/push/cron',
  '/api/cron/age-up',
])
