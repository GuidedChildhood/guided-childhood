// The rolling pace: what they have actually used so far this week, what that
// averages to a day, and what tomorrow should look like to land the week where
// the evidence says it should be.
//
// The stats page could already say "this week: 210 minutes" and a healthy guide
// alongside it, which is a scoreboard. A scoreboard tells a parent they have
// failed on Thursday and offers nothing to do about it. What a parent actually
// needs on Thursday is one number for Friday.
//
// So this works the way a budget works rather than the way a limit works. The
// week has an allowance, some of it is spent, and the rest divides across the
// days that are left. Thirty minutes over on Monday does not blow the week, it
// takes about five minutes a day off the rest of it, and that is a far more
// useful and far less shaming thing to be told.
//
// Everything here is arithmetic on numbers the app already has. The daily guide
// itself comes from lib/balance/parent-report, which sets it from the child's
// age against the measured research rather than a round number.

export type PaceVerdict = 'plenty' | 'on_track' | 'a_little_high' | 'well_over'

export type Pace = {
  /** The age matched healthy daily minutes this is all measured against. */
  dailyGuide: number
  /** dailyGuide across a full week. */
  weekAllowance: number
  /** Screen minutes used so far in the current week. */
  used: number
  /** Days of the week gone, including today. Always 1 to 7. */
  daysSoFar: number
  /** Days still to come, not counting today. 0 on Sunday. */
  daysLeft: number
  /** What they have averaged a day so far. */
  average: number
  /** Allowance still unspent. Can be negative when the week is already over. */
  remaining: number
  /** What tomorrow should be to land the week on the guide. Null on the last
   *  day of the week, when there is no tomorrow to spend it in. */
  suggestTomorrow: number | null
  verdict: PaceVerdict
  /** One plain sentence, the thing actually worth reading. */
  line: string
}

/** Monday is day 1, Sunday is day 7, which is how a UK week reads. */
export function ukWeekday(now = new Date()): number {
  const d = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' })).getDay()
  return d === 0 ? 7 : d
}

function verdictFor(average: number, guide: number): PaceVerdict {
  if (guide <= 0) return 'on_track'
  const ratio = average / guide
  if (ratio <= 0.7) return 'plenty'
  if (ratio <= 1.1) return 'on_track'
  if (ratio <= 1.4) return 'a_little_high'
  return 'well_over'
}

export function buildPace(input: {
  usedThisWeek: number
  dailyGuide: number
  /** Override for tests and for the monthly email, which reports a finished
   *  week rather than the one in progress. */
  daysSoFar?: number
}): Pace {
  const dailyGuide = Math.max(0, Math.round(input.dailyGuide))
  const daysSoFar = Math.min(7, Math.max(1, input.daysSoFar ?? ukWeekday()))
  const daysLeft = 7 - daysSoFar
  const used = Math.max(0, Math.round(input.usedThisWeek))
  const weekAllowance = dailyGuide * 7
  const average = Math.round(used / daysSoFar)
  const remaining = weekAllowance - used

  // What tomorrow should be. Spreading what is left across the days that are
  // left is the whole idea: it self corrects, so one heavy Saturday quietly
  // trims the next few days instead of becoming a telling off.
  //
  // Floored at zero rather than going negative, because "minus twenty minutes
  // tomorrow" is not an instruction anyone can follow, and capped at twice the
  // guide so a very quiet week does not suggest a five hour Sunday.
  const suggestTomorrow = daysLeft > 0
    ? Math.max(0, Math.min(dailyGuide * 2, Math.round(remaining / daysLeft)))
    : null

  const verdict = verdictFor(average, dailyGuide)

  const line = (() => {
    if (dailyGuide <= 0) return `${used} minutes of screen time so far this week.`
    if (daysLeft === 0) {
      return verdict === 'plenty' || verdict === 'on_track'
        ? `The week came in at ${average} minutes a day against a guide of ${dailyGuide}. That is a good week.`
        : `The week averaged ${average} minutes a day against a guide of ${dailyGuide}. Worth a look at what took the time.`
    }
    switch (verdict) {
      case 'plenty':
        return `${average} minutes a day so far against a guide of ${dailyGuide}. There is room, so tomorrow can be up to ${suggestTomorrow} minutes without a second thought.`
      case 'on_track':
        return `${average} minutes a day so far, right about the ${dailyGuide} minute guide. Around ${suggestTomorrow} minutes tomorrow keeps the week where it should be.`
      case 'a_little_high':
        return `${average} minutes a day so far, a little above the ${dailyGuide} minute guide. Around ${suggestTomorrow} minutes tomorrow brings the week back level.`
      case 'well_over':
        return remaining > 0
          ? `${average} minutes a day so far, well above the ${dailyGuide} minute guide. There are ${remaining} minutes left in the week, so about ${suggestTomorrow} a day from here.`
          : `${average} minutes a day so far, well above the ${dailyGuide} minute guide, and the week's allowance is already spent. Nothing is broken, but the rest of the week wants to be quiet.`
    }
  })()

  return { dailyGuide, weekAllowance, used, daysSoFar, daysLeft, average, remaining, suggestTomorrow, verdict, line }
}

/** The headline, for the stats card and the monthly email. */
export const VERDICT_LABEL: Record<PaceVerdict, string> = {
  plenty: 'Plenty of room',
  on_track: 'On track',
  a_little_high: 'A little high',
  well_over: 'Well over the guide',
}

export const VERDICT_TONE: Record<PaceVerdict, { bg: string; border: string; ink: string }> = {
  plenty:        { bg: 'var(--tint-sage)', border: '#D6E5DF', ink: 'var(--retro-green-dark, #236F52)' },
  on_track:      { bg: 'var(--tint-sage)', border: '#D6E5DF', ink: 'var(--retro-green-dark, #236F52)' },
  a_little_high: { bg: 'var(--terracotta-lt)', border: 'var(--terracotta)', ink: 'var(--terracotta-dark)' },
  well_over:     { bg: '#FDECEC', border: '#F3C9C9', ink: '#A33A3A' },
}
