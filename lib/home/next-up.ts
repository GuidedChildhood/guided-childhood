// What next, after today is done. Nine things, one a day.
//
// Justin, 12 August 2026: "are we rotating what's next between review quests,
// guide watch time, check watch balance, check school reminders, check device
// settings, check all devices added and set up, add any new devices, lessons,
// passport? We should rotate these."
//
// We were not. It was a four branch if chain, and the first branch that matched
// won for ever, so the same card sat under Today every day for weeks. A parent
// who has jobs running and lessons finished saw one sentence about quests, and
// the guide, the balance, the device settings and the passport were things they
// would only find by going looking.
//
// ── THE RULE: A REAL NEED STILL WINS, THE REST ROTATE ───────────────────────
//
// This is the same shape as the school card's weekly lift, and for the same
// reason. Rotation is for SUGGESTIONS. If a child actually has jobs waiting
// today, or the family has never set any, that is not a suggestion, it is the
// state of their day, and burying it under "have you looked at the passport"
// would be the rotation working against the product.
//
// So two things jump the queue and never rotate, and the other nine take turns
// underneath. Both of the jumpers are jobs, which is also why the greeting
// needs to know: see coversJobs.
//
// ── WHY A DAY AND NOT A WEEK ────────────────────────────────────────────────
//
// The planets under the pathway rotate weekly, because the pathway is a page a
// parent visits when they want to think about the journey. This card is the
// other thing: it appears on Home the moment the daily habit is ticked, so it
// is seen once a day by definition, and a weekly cycle would take over two
// months to show all nine. A day is the natural beat of the surface it sits on.
//
// ── THE WALK FORWARD, WHICH IS THE ONLY FIDDLY PART ─────────────────────────
//
// Not every item applies to every family: there is no point offering the guide
// to somebody who has watched all of it, or "finish setting up your devices" to
// somebody who has. The obvious approach, filter to what applies and then take
// the modulo, is subtly wrong: the list changes length as a family makes
// progress, so finishing one thing silently reshuffles which day everything
// else falls on.
//
// Instead the day picks a position in the FULL nine, and if that one does not
// apply we walk forward to the next that does. Progress on one item leaves the
// others where they were. Quests applies to everybody, so the walk always ends.

export type NextUpSignals = {
  childName: string | null
  stageName: string
  /** Jobs today: none set, some pending, or all ticked. */
  jobsStatus: 'on_track' | 'pending' | 'none' | undefined
  noQuestsYet: boolean
  lessonsLeft: number
  lessonsPassed: number
  lessonsTotal: number
  /** Watch together films not yet seen. */
  watchTogetherLeft: number
  /** The balance strand is not green this week. */
  balanceAmber: boolean
  /** School reminders genuinely waiting today. See countWaitingToday. */
  schoolWaiting: number
  /** This family has ever added a school reminder or connected an inbox. */
  hasSchool: boolean
  deviceCount: number
  devicesSetUp: number
}

export type NextUpCard = {
  key: string
  eyebrow: string
  title: string
  line: string
  href: string
  icon: string
  /** The greeting stays quiet about jobs when this card says it instead. */
  coversJobs: boolean
}

type Item = {
  key: string
  applies: (s: NextUpSignals) => boolean
  build: (s: NextUpSignals) => NextUpCard
}

const EYEBROW = "Today's habit done"
const kidQuests = (s: NextUpSignals) => (s.childName ? `${s.childName}'s quests` : 'Family quests')

// ── THE TWO THAT NEVER ROTATE ───────────────────────────────────────────────

const URGENT: Item[] = [
  {
    key: 'jobs-pending',
    applies: s => s.jobsStatus === 'pending',
    build: s => ({
      key: 'jobs-pending', eyebrow: EYEBROW, title: kidQuests(s),
      line: 'Jobs to check off and any asks to answer',
      // The board rather than the top of the page, which is the difference
      // between one tap and three.
      href: '/dashboard/quests#quest-board', icon: '⭐', coversJobs: true,
    }),
  },
  {
    key: 'no-quests',
    applies: s => s.noQuestsYet,
    build: () => ({
      key: 'no-quests', eyebrow: EYEBROW, title: 'Set their first jobs',
      line: 'Real world jobs are what earn screen time, so nothing else starts moving until these exist.',
      href: '/dashboard/quests', icon: '🧹', coversJobs: true,
    }),
  },
]

// ── AND THE NINE THAT DO, IN JUSTIN'S ORDER ─────────────────────────────────

export const ROTATION: Item[] = [
  {
    key: 'quests',
    // The floor. Everybody has quests to look over once they exist, and this is
    // what makes the walk forward guaranteed to end.
    applies: () => true,
    build: s => ({
      key: 'quests', eyebrow: EYEBROW, title: kidQuests(s),
      line: s.jobsStatus === 'on_track'
        ? "Today's jobs are done. Check any asks and set tomorrow's"
        : 'Set the jobs and screen time to get the stars flowing',
      href: '/dashboard/quests#quest-board', icon: '⭐', coversJobs: true,
    }),
  },
  {
    key: 'guide',
    applies: s => s.watchTogetherLeft > 0,
    build: s => ({
      key: 'guide', eyebrow: EYEBROW, title: 'Watch one together',
      line: `${s.watchTogetherLeft} short ${s.watchTogetherLeft === 1 ? 'film' : 'films'} left in the guide. Ten minutes each, side by side.`,
      href: '/dashboard/guide', icon: '📺', coversJobs: false,
    }),
  },
  {
    key: 'balance',
    applies: () => true,
    build: s => ({
      key: 'balance', eyebrow: EYEBROW,
      // Not "See their week honestly", which is the balance PLANET's line on
      // the pathway. Two surfaces using the same sentence for the same
      // destination is the thing Justin caught within the hour last time.
      title: s.balanceAmber ? 'Their balance needs a look' : "Check this week's balance",
      line: 'Hours, the swing since last week, and what to aim for.',
      href: '/dashboard/stats', icon: '⚖️', coversJobs: false,
    }),
  },
  {
    key: 'school',
    applies: s => s.hasSchool,
    build: s => ({
      key: 'school', eyebrow: EYEBROW,
      title: s.schoolWaiting > 0 ? 'Something is due at school' : 'Look at the week at school',
      line: 'Kit days, trips and payments, before the morning they land.',
      href: '/dashboard/school', icon: '🎒', coversJobs: false,
    }),
  },
  {
    key: 'device-settings',
    applies: s => s.deviceCount > 0,
    build: () => ({
      key: 'device-settings', eyebrow: EYEBROW, title: 'Check one device setting',
      line: 'Filters and limits drift with every update. A look now and then keeps them honest.',
      href: '/dashboard/devices', icon: '🔒', coversJobs: false,
    }),
  },
  {
    key: 'devices-setup',
    applies: s => s.deviceCount > 0 && s.devicesSetUp < s.deviceCount,
    build: s => ({
      key: 'devices-setup', eyebrow: EYEBROW, title: 'Finish setting up their devices',
      line: `${s.devicesSetUp} of ${s.deviceCount} done. We walk you through each one.`,
      href: '/dashboard/devices', icon: '📱', coversJobs: false,
    }),
  },
  {
    key: 'devices-new',
    applies: () => true,
    build: s => ({
      key: 'devices-new', eyebrow: EYEBROW,
      title: s.deviceCount === 0 ? 'Add the first device' : 'Anything new in the house?',
      line: 'Add it and we walk you through the settings before they open it.',
      href: '/dashboard/devices', icon: '➕', coversJobs: false,
    }),
  },
  {
    key: 'lessons',
    applies: s => s.lessonsLeft > 0,
    build: s => ({
      key: 'lessons', eyebrow: EYEBROW, title: 'Move the passport on',
      line: `${s.lessonsPassed} of ${s.lessonsTotal} lessons passed at ${s.stageName}. Pass the rest to stamp this stage.`,
      href: '/dashboard/lessons', icon: '🛂', coversJobs: false,
    }),
  },
  {
    key: 'passport',
    applies: () => true,
    build: () => ({
      key: 'passport', eyebrow: EYEBROW, title: 'Open the passport',
      line: 'Where you started, what has changed, and the stamp you are working on.',
      href: '/dashboard/pathway#passport', icon: '📖', coversJobs: false,
    }),
  },
]

/** Monday 5 January 2026, the same anchor the planets use. */
const ANCHOR = Date.UTC(2026, 0, 5)

/** Whole days since the anchor, in London, so the card turns over at midnight
 *  here rather than at midnight UTC in the middle of a British summer evening. */
export function dayIndex(now: Date = new Date()): number {
  const london = now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
  const [y, m, d] = london.split('-').map(Number)
  return Math.floor((Date.UTC(y, m - 1, d) - ANCHOR) / 86400000)
}

/** The one card to show under Today. */
export function pickNextUp(s: NextUpSignals, now: Date = new Date()): NextUpCard {
  const urgent = URGENT.find(item => item.applies(s))
  if (urgent) return urgent.build(s)

  const n = ROTATION.length
  const start = ((dayIndex(now) % n) + n) % n
  for (let i = 0; i < n; i++) {
    const item = ROTATION[(start + i) % n]
    if (item.applies(s)) return item.build(s)
  }
  // Unreachable: quests applies to everybody. Here so the type is honest.
  return ROTATION[0].build(s)
}
