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
  /** The age matched healthy daily minutes this is all measured against.
   *  During a school holiday this is the RELAXED figure, not the age one. */
  dailyGuide: number
  /** What the age guide is in term time, before any holiday relaxation.
   *  Equal to dailyGuide outside the holidays. */
  termGuide: number
  /** The holiday currently relaxing the guide, "the summer holidays", or null
   *  in term time. */
  holidayTitle: string | null
  /** True only when the holiday has actually moved the number. */
  relaxed: boolean
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

/** Monday is day 1, Sunday is day 7, which is how a UK week reads.
 *
 *  Asked of Intl directly rather than by formatting a date and parsing the
 *  string back. The old version did the latter and was wrong every day of the
 *  month: en-GB formats 27 July as "27/07/2026", which Date cannot parse at
 *  all, so it returned NaN and the stats page printed "NaN minutes a day".
 *  Worse, on the first twelve days it DID parse, as American mm/dd, so it
 *  quietly returned the wrong weekday and every number downstream was
 *  plausible and wrong. A loud NaN for nineteen days a month was the only
 *  reason anybody noticed. */
const UK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ukWeekday(now = new Date()): number {
  try {
    const short = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', weekday: 'short',
    }).format(now)
    const idx = UK_DAYS.indexOf(short.slice(0, 3))
    if (idx >= 0) return idx + 1
  } catch { /* fall through to the local weekday below */ }
  // No Intl, or a name we do not recognise. The local weekday is close enough
  // for a UK product and infinitely better than a NaN on the screen.
  const d = now.getDay()
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
  /** The age guide before any holiday relaxation. Defaults to dailyGuide, so a
   *  caller that does not know about holidays behaves exactly as before.
   *
   *  This exists because the card was calling the relaxed number "the guide for
   *  their age" and it is not. In the summer a 13 year old's age guide of 120
   *  is relaxed by a quarter to 150, and printing 150 as the age figure makes
   *  our own holiday slack look like something the evidence recommends. It is
   *  not: 120 is already the ceiling of the only source we cite that names a
   *  number for school age children. */
  termGuide?: number
  /** The holiday doing the relaxing, for copy that has to say which one. */
  holidayTitle?: string | null
}): Pace {
  // Every input is forced to a real number before any division happens. A
  // single NaN anywhere in here reaches the parent as "NaN minutes a day",
  // which is the sort of thing that makes someone doubt every other number we
  // have ever shown them.
  const num = (v: unknown, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback

  const dailyGuide = Math.max(0, Math.round(num(input.dailyGuide, 0)))
  const daysSoFar = Math.min(7, Math.max(1, Math.round(num(input.daysSoFar, ukWeekday()))))
  const daysLeft = 7 - daysSoFar
  const used = Math.max(0, Math.round(num(input.usedThisWeek, 0)))
  const weekAllowance = dailyGuide * 7
  const average = Math.round(used / daysSoFar)
  const remaining = weekAllowance - used

  const termGuide = Math.max(0, Math.round(num(input.termGuide, dailyGuide)))
  const holidayTitle = input.holidayTitle?.trim() || null
  // Both conditions, deliberately. A holiday with a relax factor that rounds to
  // no change at all would otherwise print "relaxed to 60 for half term" beside
  // an unchanged 60, which reads as a mistake because it is one.
  const relaxed = holidayTitle !== null && dailyGuide > termGuide

  // What tomorrow should be. Spreading what is left across the days that are
  // left is the whole idea: it self corrects, so one heavy Saturday quietly
  // trims the next few days instead of becoming a telling off.
  //
  // Floored at zero rather than going negative, because "minus twenty minutes
  // tomorrow" is not an instruction anyone can follow.
  //
  // Capped at the DAILY GUIDE, not twice it. Twice was the bug Justin spotted on
  // the stats page: a quiet week left so much allowance unspent that the maths
  // suggested 210 minutes tomorrow against a guide of 105, and the card printed it
  // as advice. A screen built entirely on age guidance was recommending double the
  // guidance, which is the guidance inverted, and it is worse than a wrong number
  // because a parent following it faithfully ends up over.
  //
  // Unspent allowance is not a debt to catch up on. A child who watched little on
  // Monday has not banked a Tuesday binge, which is the same principle as the star
  // week: screen time does not hoard. So the most the card will ever suggest is a
  // normal day.
  const suggestTomorrow = daysLeft > 0
    ? Math.max(0, Math.min(dailyGuide, Math.round(remaining / daysLeft)))
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
      // Neither of these two offers a number to climb to, and that is the point.
      //
      // This used to read "there is room, so tomorrow can be up to 150 minutes
      // without a second thought", shown to a child averaging eleven. Justin,
      // 31 July: "should not encourage 150 mins a day if the average is small,
      // do not try to fill in time as [it] encourages more watching". He is
      // right, and it is the product inverted. A screen built on age guidance
      // was reading the gap between a quiet week and the guide as an invitation
      // to close it.
      //
      // The guide is a ceiling, never a target. A family under it has already
      // won and needs telling that, not offering the difference.
      case 'plenty':
        return `${average} minutes a day so far, well under the ${dailyGuide} minute guide. Nothing to change. Unused minutes do not roll over, so there is nothing here that needs using up.`
      case 'on_track':
        return `${average} minutes a day so far, right about the ${dailyGuide} minute guide. An ordinary day tomorrow keeps it there.`
      case 'a_little_high':
        return `${average} minutes a day so far, a little above the ${dailyGuide} minute guide. Around ${suggestTomorrow} minutes tomorrow brings the week back level.`
      case 'well_over':
        // suggestTomorrow is null on the last day of the week, and "about null
        // a day from here" is exactly what a parent saw when the weekday maths
        // broke. Never interpolate it without checking it is a number.
        return remaining > 0 && suggestTomorrow !== null
          ? `${average} minutes a day so far, well above the ${dailyGuide} minute guide. There are ${remaining} minutes left in the week, so about ${suggestTomorrow} a day from here.`
          : `${average} minutes a day so far, well above the ${dailyGuide} minute guide, and the week's allowance is already spent. Nothing is broken, but the rest of the week wants to be quiet.`
    }
  })()

  return {
    dailyGuide, termGuide, holidayTitle, relaxed,
    weekAllowance, used, daysSoFar, daysLeft, average, remaining, suggestTomorrow, verdict, line,
  }
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
  const n = (v: unknown, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback
  const dailyGuide = Math.max(0, Math.round(n(input.dailyGuide, 0)))
  const days = Math.max(1, Math.round(n(input.days, 1)))
  const used = Math.max(0, Math.round(n(input.usedThisMonth, 0)))
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
