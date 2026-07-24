// The DiGi screen time balance insight for the parent. A calm, evidence led
// read on how this child's screen time sits for their age, and what a healthy
// balance looks like around it. Never an allow or deny, never a hard limit:
// DiGi always returns a calibrated pathway. The guidance leans on where the
// science has settled, that the number matters less than what screens
// displace (sleep, movement, real play) and the time of day they land.
//
// The star economy already builds the balance in: stars come from real world
// quests and buy screen time, so a child earning well is a child in balance.
// This card names that, gives an age appropriate steer, and nudges gently on
// pacing and on winding down before bed.

export type BalanceTone = 'good' | 'pace' | 'evening'

type BandGuide = { label: string; dailyMins: number; line: string }

// Soft daily steers for recreational screen time, framed as guides not rules.
// The numbers lean on where mainstream public health guidance has settled, and
// stay calibrated rather than prescriptive because the bodies themselves
// resist a single cap for school age and up. What the science agrees on is
// that the number matters less than what screens displace: sleep, movement,
// real play and family time.
//
// Sources the guides draw on:
//   - WHO, physical activity, sedentary behaviour and sleep for children under
//     5 (2019): under 2, no sedentary screen; ages 2 to 4, no more than 1 hour,
//     less is better.
//   - American Academy of Pediatrics: about 1 hour a day of high quality
//     content ages 2 to 5, then consistent family limits from 6 so screens do
//     not displace sleep, activity and offline time (a plan, not a number).
//   - Canadian 24-Hour Movement Guidelines, ages 5 to 17: no more than 2 hours
//     a day of recreational screen time.
//   - RCPCH, the health impacts of screen time (UK, 2019): evidence does not
//     support one universal threshold; guard sleep, activity and family time.
const BAND: Record<string, BandGuide> = {
  '4-7': { label: '4 to 7', dailyMins: 60, line: 'Around an hour of screen a day sits comfortably at this age, with plenty of real play around it.' },
  '8-10': { label: '8 to 10', dailyMins: 75, line: 'Up to an hour or so a day works well here, best balanced with movement, making and time outside.' },
  '11-13': { label: '11 to 13', dailyMins: 90, line: 'A couple of hours can be fine at this age when sleep, activity and real friendships still come first.' },
  '13-15': { label: '13 to 15', dailyMins: 120, line: 'The focus now shifts from the clock to the balance: what the screen adds, and what it might be crowding out.' },
  '16+': { label: '16 plus', dailyMins: 120, line: 'This is the age to hand more of the balance to them, with you as the steady guide rather than the timer.' },
}

// The guidance bodies behind the age guides, surfaced so the app can show the
// science on the balance graphs rather than assert a bare number.
export const SCREEN_GUIDE_SOURCES = [
  { body: 'World Health Organization', year: 2019, note: 'None under 2, up to 1 hour ages 2 to 4' },
  { body: 'American Academy of Pediatrics', year: 2016, note: '1 hour ages 2 to 5, consistent limits from 6' },
  { body: 'Canadian 24-Hour Movement Guidelines', year: 2016, note: 'Up to 2 hours recreational, ages 5 to 17' },
  { body: 'RCPCH', year: 2019, note: 'No single limit; guard sleep, activity and family time' },
] as const

// Where a day's recreational screen sits against the age guide. The balance
// graphs colour the bars from this, and DiGi reads the same call when deciding
// whether to gently prompt: 'under' and 'healthy' need no nudge, 'over' and
// 'well_over' are the ones DiGi acts on, always as a calibrated pathway and
// never as a block.
export type ScreenStatus = 'under' | 'healthy' | 'over' | 'well_over'

// The status of any daily figure against any daily guide, so the whole week
// and each single device type read on the same four step scale.
export function statusForGuide(guide: number, dailyMins: number): ScreenStatus {
  if (guide <= 0) return 'healthy'
  if (dailyMins < guide * 0.5) return 'under'
  if (dailyMins <= guide) return 'healthy'
  if (dailyMins <= guide * 1.5) return 'over'
  return 'well_over'
}

export function screenStatusForAge(ageBand: string | null, dailyMins: number): ScreenStatus {
  return statusForGuide(recommendedDailyMinutes(ageBand), dailyMins)
}

// A healthy split of the daily guide across the four device types, shifting
// with age: younger leans to watching together and making things, with barely
// any phone; older hands more of the day to social and gaming as the skills to
// handle them are built. Calibrated steers, never hard caps, and the parts sum
// to the age daily guide so the types and the whole tell one story. Keyed to
// the same activity buckets the balance report groups devices into (a phone is
// social, a TV is watching, a console is gaming, an iPad leans watching).
export type BalanceBucketKey = 'gaming' | 'watching' | 'social' | 'learning'
const BUCKET_SHARE: Record<string, Record<BalanceBucketKey, number>> = {
  '4-7':   { watching: 0.45, learning: 0.35, gaming: 0.15, social: 0.05 },
  '8-10':  { watching: 0.35, learning: 0.30, gaming: 0.25, social: 0.10 },
  '11-13': { watching: 0.30, learning: 0.25, gaming: 0.25, social: 0.20 },
  '13-15': { watching: 0.25, learning: 0.20, gaming: 0.25, social: 0.30 },
  '16+':   { watching: 0.25, learning: 0.20, gaming: 0.20, social: 0.35 },
}

// The recommended daily minutes for each device type at this age. Reads as the
// per type version of recommendedDailyMinutes.
export function bucketDailyGuide(ageBand: string | null): Record<BalanceBucketKey, number> {
  const daily = recommendedDailyMinutes(ageBand)
  const share = (ageBand && BUCKET_SHARE[ageBand]) || BUCKET_SHARE['8-10']
  return {
    gaming: Math.round(daily * share.gaming),
    watching: Math.round(daily * share.watching),
    social: Math.round(daily * share.social),
    learning: Math.round(daily * share.learning),
  }
}

function guideFor(ageBand: string | null): BandGuide {
  return (ageBand && BAND[ageBand]) || BAND['8-10']
}

// The one source of truth for the age banded daily guide, so the timer, the
// child's screen and the parent's card all read the same number. A soft
// steer, never a hard cap.
export function recommendedDailyMinutes(ageBand: string | null): number {
  return guideFor(ageBand).dailyMins
}

export function bandLabelFor(ageBand: string | null): string {
  return guideFor(ageBand).label
}

export type BalanceInsight = {
  headline: string
  body: string
  tone: BalanceTone
  // The age guide, surfaced so the card can draw the balance as a slim bar:
  // the recommended screen slice against the rest of a child's waking day
  // (real play, people, sleep). A rough shape, never a hard split.
  guideMins: number
  bandLabel: string
}

// A child's waking day, in minutes, used only to size the balance bar so the
// screen slice reads as one part of a full day, not the whole of it. Rough by
// design: the point is the shape, not a precise clock.
export const WAKING_DAY_MINS = 13 * 60

// The week's balance as one honest number, for the Friday round up. It reads
// the family's actual screen minutes against the evidence based healthy guide
// for their children's ages (recommended daily minutes times seven), and lands
// a 0 to 100 balance score: 100 when screen sat inside the healthy range, less
// the further it ran over. Earning screen from real quests softens the drop,
// because a child earning their time is the balance working. Never a hard cap,
// always a calibrated read.
export type WeekBalance = {
  screenMins: number
  earnedMins: number
  guideMins: number
  balancePct: number
  tone: 'healthy' | 'watch' | 'quiet'
  line: string
}

export function weekBalance(opts: { screenMins: number; earnedMins: number; ageBands: (string | null)[] }): WeekBalance {
  const bands = opts.ageBands.length ? opts.ageBands : [null]
  const guideMins = bands.reduce((s, b) => s + recommendedDailyMinutes(b) * 7, 0)
  const screenMins = Math.max(0, Math.round(opts.screenMins))
  const earnedMins = Math.max(0, Math.round(opts.earnedMins))

  let balancePct: number
  if (screenMins === 0 || guideMins <= 0 || screenMins <= guideMins) {
    balancePct = 100
  } else {
    const base = Math.round((guideMins / screenMins) * 100) // below 100 once over the guide
    const earnedCushion = Math.min(1, earnedMins / screenMins) // 1 when fully earned back
    balancePct = Math.max(30, Math.min(100, Math.round(base + (100 - base) * 0.4 * earnedCushion)))
  }

  const tone: WeekBalance['tone'] =
    screenMins === 0 && earnedMins === 0 ? 'quiet'
    : balancePct >= 80 ? 'healthy'
    : 'watch'

  const line =
    tone === 'quiet' ? 'A quiet week on the numbers, which is completely fine. The balance builds itself again as the quests start flowing.'
    : tone === 'healthy' ? 'Screen time sat comfortably inside the healthy range for your children this week, with real world time earning it. That is the balance the evidence points to.'
    : 'Screen ran a little ahead of the healthy guide this week. No alarm, just worth a glance, since what screens crowd out matters more than the clock itself.'

  return { screenMins, earnedMins, guideMins, balancePct, tone, line }
}

// One expert grounded line for the week, chosen by the family's own week so it
// always reads as guidance meant for them. Attributed and dash free, in the
// spirit of the wellbeing experts the platform stands on. This is how the
// science gets relayed into the Friday update, week by week.
export type ExpertTip = { expert: string; tip: string }

export function expertWeekTip(signal: {
  balanceTone: WeekBalance['tone']
  activeDays: number
  questsApproved: number
  momentsDone: number
}): ExpertTip {
  if (signal.balanceTone === 'watch') {
    return { expert: 'Sue Atkins', tip: 'When screen time creeps up, the calm boundary said once beats the long negotiation. Set the offline win first, so screen goes back to being the reward it is meant to be.' }
  }
  if (signal.balanceTone === 'quiet' || signal.questsApproved === 0) {
    return { expert: 'Dr Becky Kennedy', tip: 'A quiet week is not a failure, it is just a week. Connection comes before any chart, so start next week with one small thing you do together, not one more thing to tick.' }
  }
  if (signal.activeDays >= 5) {
    return { expert: 'Emotion coaching', tip: 'Showing up most days is the whole game. Name out loud what your child did well, because a child who feels seen for the effort keeps choosing it.' }
  }
  if (signal.momentsDone >= 2) {
    return { expert: 'Dr Becky Kennedy', tip: 'You handled the hard moments with warmth this week, which is the real work. The repair matters more than getting it perfect in the moment.' }
  }
  return { expert: 'Dr Becky Kennedy', tip: 'Two things are true this week: the routine is working, and it is allowed to be imperfect. Keep the warmth first and the rest follows.' }
}

export function screenBalanceInsight(opts: {
  childName: string
  ageBand: string | null
  minutesReady: number
  weekStars: number
  timerRunning: boolean
  hour: number | null
}): BalanceInsight {
  const { childName, ageBand, minutesReady, weekStars, timerRunning, hour } = opts
  const g = guideFor(ageBand)
  // The age guide reads mid sentence after "For age X," so it starts lower case.
  const line = g.line.charAt(0).toLowerCase() + g.line.slice(1)

  // The effort line: earning from real quests is the balance working, so name
  // it warmly when it is happening.
  const effort = weekStars > 0
    ? `${childName} earned ${weekStars} star${weekStars === 1 ? '' : 's'} from real quests this week, which is the balance doing its job. `
    : ''

  // Evening wind down takes priority once it is late, since time of day is one
  // of the clearest signals in the evidence.
  if (hour != null && hour >= 19) {
    return {
      tone: 'evening',
      headline: `Winding down time`,
      body: `${effort}It is getting late now, so here is my one thought for tonight. Screens settle a child best when they stop about an hour before bed, so I would bank ${childName}'s minutes for tomorrow. They will sleep the better for it.`,
      guideMins: g.dailyMins,
      bandLabel: g.label,
    }
  }

  // Pacing: lots banked is a good thing, not a bad one, but worth spreading so
  // it stays a treat rather than one long sitting. Framed as enjoyment, never
  // as a telling off.
  if (minutesReady > g.dailyMins * 2) {
    return {
      tone: 'pace',
      headline: `Plenty banked for ${childName}`,
      body: `${effort}${childName} has ${minutesReady} minutes saved up now, which is lovely to see. If it were me, I would spread it across the days rather than one long sitting, so it stays a treat. For age ${g.label}, ${line}`,
      guideMins: g.dailyMins,
      bandLabel: g.label,
    }
  }

  const nowLine = timerRunning ? `${childName} is enjoying some now, which is exactly what it is for. ` : ''
  return {
    tone: 'good',
    headline: `A healthy balance for ${childName}`,
    body: `${effort}${nowLine}For age ${g.label}, ${line} From where I am sitting you have the mix about right, screens as one part of a full day. Keep doing what you are doing.`,
    guideMins: g.dailyMins,
    bandLabel: g.label,
  }
}
