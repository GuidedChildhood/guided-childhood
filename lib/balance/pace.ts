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

// ── The month, for the review email ──────────────────────────────────
//
// Same maths, one month of it, plus the only thing a month can say that a week
// cannot: which direction this is going. A parent who went from 95 minutes a
// day to 78 has done something real, and being told "a little high" without
// that is both discouraging and untrue to what happened.
//
// It deliberately does not suggest a number for tomorrow. A monthly email lands
// in an inbox days after the fact, and telling someone what Tuesday should have
// looked like is the kind of advice that gets an email unsubscribed from. One
// verdict, one direction, one plain nudge.

export type MonthPace = {
  dailyGuide: number
  /** Screen minutes across the month. */
  used: number
  /** Days the month actually had, or has had so far. */
  days: number
  average: number
  /** Last month's daily average, when there is a last month to compare with. */
  previousAverage: number | null
  /** How the average moved. Steady covers anything inside five minutes a day,
   *  which is noise rather than a change worth naming. */
  direction: 'down' | 'steady' | 'up' | null
  verdict: PaceVerdict
  /** The subject line's worth of it: on track, a little high. */
  headline: string
  /** Two or three sentences, the whole body of the email. */
  line: string
}

export function buildMonthPace(input: {
  usedThisMonth: number
  dailyGuide: number
  days: number
  usedPreviousMonth?: number | null
  previousDays?: number | null
}): MonthPace {
  const dailyGuide = Math.max(0, Math.round(input.dailyGuide))
  const days = Math.max(1, Math.round(input.days))
  const used = Math.max(0, Math.round(input.usedThisMonth))
  const average = Math.round(used / days)

  const prevDays = input.previousDays && input.previousDays > 0 ? input.previousDays : null
  const previousAverage = prevDays != null && input.usedPreviousMonth != null
    ? Math.round(Math.max(0, input.usedPreviousMonth) / prevDays)
    : null

  const direction: MonthPace['direction'] = previousAverage == null
    ? null
    : Math.abs(average - previousAverage) <= 5 ? 'steady'
    : average < previousAverage ? 'down' : 'up'

  const verdict = verdictFor(average, dailyGuide)
  const headline = VERDICT_LABEL[verdict]

  const line = (() => {
    if (dailyGuide <= 0) return `${fmtMins(used)} of screen time across the month.`
    // The average is not repeated here. The email prints it three times the
    // size directly above this sentence, and a paragraph that opens by saying
    // the number again reads as filler rather than as an explanation of it.
    const opener = `Against a healthy guide of ${dailyGuide} minutes a day for their age.`

    const move = (() => {
      if (previousAverage == null || direction == null) return ''
      if (direction === 'steady') return ` About the same as last month.`
      const gap = Math.abs(average - previousAverage)
      return direction === 'down'
        ? ` Down ${gap} minutes a day on last month, which is a real change and worth knowing you made it.`
        : ` Up ${gap} minutes a day on last month.`
    })()

    // The gap is stated as the real number rather than a round one. Saying
    // "ten minutes a day brings it level" to a family nineteen minutes over is
    // the sort of small wrongness that makes every other number here suspect.
    const over = Math.max(0, average - dailyGuide)
    const nudge = (() => {
      switch (verdict) {
        case 'plenty': return ' There is room here. Nothing to do.'
        case 'on_track': return ' That is where it should be. Nothing to do.'
        case 'a_little_high':
          return ` ${over} minutes a day off it brings the month level, which is one shorter sitting, not a fight.`
        case 'well_over':
          return ` Worth a look at where the time goes. Not a telling off, and not ${over} minutes to claw back tomorrow: pick the heaviest day of the week and make just that one lighter.`
      }
    })()

    return opener + move + nudge
  })()

  return { dailyGuide, used, days, average, previousAverage, direction, verdict, headline, line }
}

function fmtMins(mins: number): string {
  if (mins < 60) return `${mins} minutes`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h} hour${h === 1 ? '' : 's'}` : `${h}h ${m}m`
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
