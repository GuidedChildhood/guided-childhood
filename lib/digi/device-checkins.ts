// DiGi device check ins. Parents told Justin the same battles keep coming
// back: the new Switch and how to use it well, the sons who are always on
// the Xbox, the fight at switch off, the console before homework. This is
// DiGi noticing those patterns in the child's real device data and asking
// about them, gently, now and again.
//
// Everything here is read only arithmetic over device_sessions rows plus a
// small bank of situational prompts in one place. Never allow or deny:
// every prompt opens a calibrated pathway (the matching device guide, the
// come off the game script, the family agreement, or a DiGi conversation
// already primed with the situation).

import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'

export type DeviceKind = 'phone' | 'tablet' | 'tv' | 'console'

// The shape we read from device_sessions. minutes is the honest number:
// the stop route trims it back to the minutes actually used when a session
// ends early, so summing it never counts time that was not spent.
export type CheckinSession = {
  child_id: string
  device: string
  minutes: number
  status: string
  started_at: string
  ends_at: string | null
  ended_at: string | null
}

export type ChildDeviceSignals = {
  childId: string
  sessionCount: number
  // Minutes over the 14 day window, and that window read as a weekly rate.
  totalMinutes: number
  weeklyMinutes: number
  guideWeeklyMinutes: number
  overGuide: boolean
  // The device carrying most of the child's screen time, only named when it
  // genuinely dominates: at least 3 sessions, 2 hours across the window and
  // half the total minutes. Below that the data is too thin to be honest.
  dominantDevice: DeviceKind | null
  // A device whose first ever session landed in the last 7 days, for a
  // child who already had device history before that. The Switch birthday
  // present signal.
  newDevice: DeviceKind | null
  // Sessions that stopped well before the planned end. Frequent early stops
  // mean the timer and the child are not agreeing, which is worth asking
  // about rather than guessing.
  earlyStops: number
  endedSessions: number
  frequentEarlyStops: boolean
  // Console or TV sessions starting in the straight after school slot on
  // weekdays. The use before homework signal.
  afterSchoolStarts: number
  afterSchoolPattern: boolean
}

const DEVICE_KINDS: DeviceKind[] = ['phone', 'tablet', 'tv', 'console']

function asDeviceKind(d: string): DeviceKind | null {
  return (DEVICE_KINDS as string[]).includes(d) ? (d as DeviceKind) : null
}

// Ended more than 5 minutes before the planned end counts as an early stop,
// so a child stopping 30 seconds early never reads as a pattern.
const EARLY_STOP_MARGIN_MS = 5 * 60_000

// The window the signals read. Two weeks smooths a quiet weekend without
// reaching back so far the picture goes stale.
export const SIGNAL_WINDOW_DAYS = 14

export function computeChildSignals(opts: {
  childId: string
  ageBand: string | null
  // Sessions from the last SIGNAL_WINDOW_DAYS for this child.
  sessions: CheckinSession[]
  // Devices this child had used before the last 7 days. Lets a genuinely
  // new device stand out; a brand new family (no prior history at all)
  // never gets a first week with prompt for everything at once.
  priorDevices: Set<string>
}): ChildDeviceSignals {
  const { childId, ageBand, sessions, priorDevices } = opts

  const minutesByDevice = new Map<DeviceKind, number>()
  const sessionsByDevice = new Map<DeviceKind, number>()
  let totalMinutes = 0
  let earlyStops = 0
  let endedSessions = 0
  let afterSchoolStarts = 0
  const recentNewDevices = new Set<DeviceKind>()
  const sevenDaysAgo = Date.now() - 7 * 86_400_000

  for (const s of sessions) {
    const kind = asDeviceKind(s.device)
    if (!kind) continue
    const mins = Math.max(0, Math.round(s.minutes || 0))
    totalMinutes += mins
    minutesByDevice.set(kind, (minutesByDevice.get(kind) ?? 0) + mins)
    sessionsByDevice.set(kind, (sessionsByDevice.get(kind) ?? 0) + 1)

    if (s.status === 'ended' && s.ended_at) {
      endedSessions += 1
      if (s.ends_at && Date.parse(s.ends_at) - Date.parse(s.ended_at) > EARLY_STOP_MARGIN_MS) {
        earlyStops += 1
      }
    }

    const started = new Date(s.started_at)
    if (!Number.isNaN(started.getTime())) {
      const day = started.getUTCDay()
      const hour = started.getUTCHours()
      // Weekday, roughly 3pm to 6pm: the straight home from school slot.
      if ((kind === 'console' || kind === 'tv') && day >= 1 && day <= 5 && hour >= 15 && hour < 18) {
        afterSchoolStarts += 1
      }
      if (started.getTime() >= sevenDaysAgo && priorDevices.size > 0 && !priorDevices.has(kind)) {
        recentNewDevices.add(kind)
      }
    }
  }

  let dominantDevice: DeviceKind | null = null
  let dominantMinutes = 0
  for (const [kind, mins] of minutesByDevice) {
    if (mins > dominantMinutes) { dominantMinutes = mins; dominantDevice = kind }
  }
  const dominates =
    dominantDevice !== null &&
    (sessionsByDevice.get(dominantDevice) ?? 0) >= 3 &&
    dominantMinutes >= 120 &&
    dominantMinutes * 2 >= totalMinutes
  if (!dominates) dominantDevice = null

  const weeklyMinutes = Math.round(totalMinutes / (SIGNAL_WINDOW_DAYS / 7))
  const guideWeeklyMinutes = recommendedDailyMinutes(ageBand) * 7
  // A genuine run over, not noise: 15 percent past the guide with real use.
  const overGuide = totalMinutes >= 60 && weeklyMinutes > guideWeeklyMinutes * 1.15

  // Half or more of ended sessions stopping early, at least 3 of them.
  const frequentEarlyStops = earlyStops >= 3 && earlyStops * 2 >= endedSessions

  const afterSchoolPattern = afterSchoolStarts >= 3

  // One new device at a time is the honest read; if several appeared in the
  // same week just take the first, the conversation covers the moment.
  const newDevice = recentNewDevices.size > 0 ? [...recentNewDevices][0] : null

  return {
    childId, sessionCount: sessions.length, totalMinutes, weeklyMinutes,
    guideWeeklyMinutes, overGuide, dominantDevice, newDevice,
    earlyStops, endedSessions, frequentEarlyStops,
    afterSchoolStarts, afterSchoolPattern,
  }
}

// ── The prompt bank ─────────────────────────────────────────────────────────
// One place for every device check in DiGi can ask. Each prompt carries its
// pathway (where Yes this is us leads beyond the chat) and the exact message
// that opens the DiGi conversation already knowing the situation.

export type CheckinPromptId =
  | 'new_device'
  | 'over_guide'
  | 'early_stops'
  | 'console_after_school'
  | 'console_heavy'
  | 'tv_heavy'
  | 'phone_heavy'
  | 'tablet_heavy'

export type CheckinCandidate = {
  promptId: CheckinPromptId
  childId: string
  device: DeviceKind | null
  question: string
  chatMessage: string
  pathway: { label: string; href: string }
  // Words matched against open concern slugs and labels so DiGi never asks
  // about something the family has already flagged and is working on.
  concernHints: string[]
}

const DEVICE_NAME: Record<DeviceKind, string> = {
  phone: 'phone', tablet: 'tablet', tv: 'TV', console: 'console',
}

// Where the come off the game script lives is looked up from the scripts
// table at request time (scripts live in the database, never hardcoded);
// this is only the fallback when the lookup finds nothing.
export const SCRIPTS_FALLBACK_HREF = '/dashboard/scripts'
export const COME_OFF_SCRIPT_TITLE_PATTERNS = ['%time limits%', '%switch off%', '%screen off%']

// Chooses the single strongest check in for one child, or null when the
// data has nothing honest to say. Priority runs timely to general: a brand
// new device beats everything (that conversation has a shelf life), then
// the balance running over the guide, then the friction signals, then the
// simple favourite device observations.
export function chooseCheckin(opts: {
  signals: ChildDeviceSignals
  childName: string
  scriptHref: string | null
}): CheckinCandidate | null {
  const { signals: s, childName } = opts
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const scriptHref = opts.scriptHref ?? SCRIPTS_FALLBACK_HREF
  const base = { childId: s.childId }

  if (s.newDevice) {
    const dev = DEVICE_NAME[s.newDevice]
    return {
      ...base, promptId: 'new_device', device: s.newDevice,
      question: `First week with the ${dev} I see. Want the set up guide and the words for time on it?`,
      chatMessage: `We have a new ${dev} in the house and ${name} loves it already. How do we set it up well from the start, agree what healthy time on it looks like, and keep coming off it calm?`,
      pathway: { label: 'Open the device set up guides', href: '/dashboard/devices' },
      concernHints: [dev.toLowerCase(), 'new device', 'set up', 'setup'],
    }
  }

  if (s.overGuide) {
    return {
      ...base, promptId: 'over_guide', device: null,
      question: `Screen ran ahead of the healthy amount for ${name} this week. Want to look at it together?`,
      chatMessage: `${name}'s screen time ran ahead of the healthy guide for their age this week. Can we look at what is pulling it up and find a calm way to bring the balance back, without turning it into a battle?`,
      pathway: { label: 'Write the deal down together', href: '/dashboard/agreement' },
      concernHints: ['screen time', 'screen-time', 'too much', 'balance', 'limit'],
    }
  }

  if (s.frequentEarlyStops) {
    return {
      ...base, promptId: 'early_stops', device: null,
      question: `A lot of ${name}'s sessions are stopping before the timer is done. Is switching off calm, or is it turning into a fight?`,
      chatMessage: `${name}'s device sessions keep ending before the planned time and I am not sure whether the switch off is going well or turning into a fight. What should I watch for, and what are the words if it is a fight?`,
      pathway: { label: 'Open the switch off script', href: scriptHref },
      concernHints: ['switch off', 'switch-off', 'turn off', 'coming off', 'come off', 'stopping'],
    }
  }

  if (s.afterSchoolPattern) {
    return {
      ...base, promptId: 'console_after_school', device: 'console',
      question: `Play tends to start straight after school for ${name}. Is it landing before homework, or after?`,
      chatMessage: `In our house the screen goes on straight after school and homework comes second, which turns into a nightly push. How do I set up play after the work is done, in words ${name} will actually accept?`,
      pathway: { label: 'Write the deal down together', href: '/dashboard/agreement' },
      concernHints: ['homework', 'after school', 'after-school'],
    }
  }

  if (s.dominantDevice === 'console') {
    return {
      ...base, promptId: 'console_heavy', device: 'console',
      question: `I can see the console is ${name}'s favourite. Is coming off it calm, or is it turning into a fight?`,
      chatMessage: `The console is ${name}'s favourite by a distance and coming off it is the hard part. What are the words for a calm switch off, and what should our console routine look like?`,
      pathway: { label: 'Open the come off the game script', href: scriptHref },
      concernHints: ['console', 'xbox', 'playstation', 'switch', 'gaming', 'game'],
    }
  }

  if (s.dominantDevice === 'tv') {
    return {
      ...base, promptId: 'tv_heavy', device: 'tv',
      question: `The TV is carrying most of ${name}'s screen time right now. Is it winding the day down, or winding ${name} up?`,
      chatMessage: `Most of ${name}'s screen time is TV at the moment. Is that fine at this age, and how do I keep it a wind down rather than an endless autoplay evening?`,
      pathway: { label: 'Check the TV set up guide', href: '/dashboard/devices' },
      concernHints: ['tv', 'television', 'youtube'],
    }
  }

  if (s.dominantDevice === 'phone') {
    return {
      ...base, promptId: 'phone_heavy', device: 'phone',
      question: `Most of ${name}'s screen time lives on the phone right now. How does putting it down go?`,
      chatMessage: `The phone is where most of ${name}'s screen time lives right now. How do I keep that healthy, and what does a good putting it down routine look like?`,
      pathway: { label: 'Check the phone set up guide', href: '/dashboard/devices' },
      concernHints: ['phone'],
    }
  }

  if (s.dominantDevice === 'tablet') {
    return {
      ...base, promptId: 'tablet_heavy', device: 'tablet',
      question: `The tablet is ${name}'s go to at the moment. Is parking it when time is up easy, or a battle?`,
      chatMessage: `The tablet is ${name}'s go to device at the moment. What should healthy tablet time look like at this age, and how do I keep the handing it back part calm?`,
      pathway: { label: 'Check the tablet set up guide', href: '/dashboard/devices' },
      concernHints: ['tablet', 'ipad'],
    }
  }

  return null
}

// Suppression window after Not really: three weeks of quiet for that prompt
// and child before DiGi may wonder about it again.
export const SUPPRESS_DAYS = 21

// The weekly cap: at most one device check in per child per week.
export const CHECKIN_GAP_DAYS = 7

// True when an open concern already covers what this prompt would ask, so
// DiGi never re asks what the family has already told us about.
export function coveredByConcern(candidate: CheckinCandidate, concerns: { slug: string; label: string }[]): boolean {
  return concerns.some(c => {
    const text = `${c.slug} ${c.label}`.toLowerCase()
    return candidate.concernHints.some(h => text.includes(h))
  })
}
