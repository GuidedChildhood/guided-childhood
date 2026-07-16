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
// Chosen to sit with mainstream guidance while staying calibrated rather than
// prescriptive, since the evidence favours balance and displacement over a
// fixed cap.
const BAND: Record<string, BandGuide> = {
  '4-7': { label: '4 to 7', dailyMins: 60, line: 'Around an hour of screen a day sits comfortably at this age, with plenty of real play around it.' },
  '8-10': { label: '8 to 10', dailyMins: 75, line: 'Up to an hour or so a day works well here, best balanced with movement, making and time outside.' },
  '11-13': { label: '11 to 13', dailyMins: 90, line: 'A couple of hours can be fine at this age when sleep, activity and real friendships still come first.' },
  '13-15': { label: '13 to 15', dailyMins: 120, line: 'The focus now shifts from the clock to the balance: what the screen adds, and what it might be crowding out.' },
  '16+': { label: '16 plus', dailyMins: 120, line: 'This is the age to hand more of the balance to them, with you as the steady guide rather than the timer.' },
}

function guideFor(ageBand: string | null): BandGuide {
  return (ageBand && BAND[ageBand]) || BAND['8-10']
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
      headline: `Winding down for ${childName}`,
      body: `${effort}It is getting late. Screens settle a child best when they stop about an hour before bed, so tonight might be one to bank the minutes for tomorrow.`,
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
      body: `${effort}For age ${g.label}, ${g.line} ${childName} has ${minutesReady} minutes saved, so it is worth spreading across the days rather than one long go, so it stays a treat.`,
      guideMins: g.dailyMins,
      bandLabel: g.label,
    }
  }

  const nowLine = timerRunning ? `${childName} is enjoying some now. ` : ''
  return {
    tone: 'good',
    headline: `A healthy balance for ${childName}`,
    body: `${effort}${nowLine}For age ${g.label}, ${g.line}`,
    guideMins: g.dailyMins,
    bandLabel: g.label,
  }
}
