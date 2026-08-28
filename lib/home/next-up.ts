// What next, after today is done. Thirteen things, one a day, plus the shop
// once a month.
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
  /**
   * The one concern this family is working on, most flagged first, and whether
   * it is on the way up. Null when nothing is live.
   *
   * Justin, 12 August 2026, after scrolling the pathway properly: "all of
   * these were intended for home page rotation." Your focus and Work through
   * what comes up are the two best blocks in the product and both were on the
   * page a parent opens occasionally, while Home is the page they open every
   * day.
   */
  focusLabel: string | null
  focusImproving: boolean
  /** How many concerns are live, for the queue card. */
  concernsLive: number
  /** Where the words for tonight are: the daily loop's own script step, so
   *  the card lands on the script chosen for today rather than the library. */
  scriptHref: string
  /**
   * Their first ever check in has happened, from profiles.first_checkin_at.
   *
   * Justin, 13 August 2026, on the passport nudge: it "only appears once there
   * is something on the passport worth seeing, which means after the first
   * check in." Before that the book is five empty rings and a cover, and
   * sending a parent to look at it is the fastest way to teach them the
   * passport is not worth opening.
   */
  hasCheckedIn: boolean
  /**
   * Days in a row, for the weekly streak missions card. Daily items never
   * needed it; the weekly tier does, because a mission is the reward for
   * showing up and the card has to say how close they are.
   */
  streakCount: number
  /**
   * The child's numeric stage, for the settings guides card: the first phone
   * ladder is a Stage 2 conversation and the social settings guides a Stage 3
   * one, and offering either to the parent of a four year old fails the age
   * range test in review.md. Optional so older callers stay type safe; when
   * absent the card simply never applies.
   */
  stageId?: number
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

// ── AND THE ELEVEN THAT DO, IN JUSTIN'S ORDER ───────────────────────────────
//
// Two were added on 13 August: Your focus and the concern queue, both moved
// off the pathway, where they were the best material on a page a parent opens
// occasionally. See plans/home-is-the-daily-page.md.
//
// Position here is not priority. The day picks a position and walks forward,
// so every item gets the same number of turns whatever order they sit in; the
// order only decides which day each falls on. Anything that genuinely cannot
// wait belongs in URGENT above, and neither of these does: a concern is a
// thing to work on this week, not an alarm.

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
    // YOUR FOCUS. The single best line in the product: a live reading and a
    // next action together, which is exactly the shape this rotation is made
    // of. It sat on the pathway, where it was found by accident.
    key: 'focus',
    applies: s => !!s.focusLabel,
    build: s => ({
      key: 'focus', eyebrow: EYEBROW,
      title: s.focusImproving ? `${s.focusLabel}, getting better` : `Working on ${s.focusLabel?.toLowerCase()}`,
      line: 'The words for tonight, for the moment it usually goes wrong.',
      href: s.scriptHref, icon: '🎯', coversJobs: false,
    }),
  },
  {
    // WORK THROUGH WHAT COMES UP. The concern queue, which is the heart of the
    // product and had no route from Home at all.
    key: 'concern-queue',
    applies: s => s.concernsLive > 1,
    build: s => ({
      key: 'concern-queue', eyebrow: EYEBROW, title: 'Work through what has come up',
      line: `${s.concernsLive} on the list, most pressing first. One at a time is the whole method.`,
      href: '/dashboard/pathway#is-it-working', icon: '🧩', coversJobs: false,
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
    // Not before the first check in. An empty passport is a cover and five
    // zeros, and a nudge to go and look at it teaches a parent that the
    // passport is not worth opening, on the one day they were willing to try.
    applies: s => s.hasCheckedIn,
    build: () => ({
      key: 'passport', eyebrow: EYEBROW, title: 'Open the passport',
      line: 'Where you started, what has changed, and the stamp you are working on.',
      href: '/dashboard/pathway#passport', icon: '📖', coversJobs: false,
    }),
  },
  // ── TWO ADDED 29 AUGUST 2026, from the value visibility audit ─────────────
  //
  // plans/2026-08-28-value-and-revenue-review.md: printables and the setup
  // guide layer (the first phone ladder, the social settings walkthroughs) had
  // real depth in code and no rotation slot, so most families never met them.
  // The cost is the cycle stretching from twelve days to thirteen or fourteen,
  // which is the trade this file has always accepted for coverage.
  {
    key: 'printables',
    applies: () => true,
    build: s => ({
      key: 'printables', eyebrow: EYEBROW, title: 'One for the fridge',
      line: `A star chart or planner with ${s.childName ?? 'your child'}’s name on it. Five minutes to print, days of mileage.`,
      href: '/dashboard/printables', icon: '🖨️', coversJobs: false,
    }),
  },
  {
    // The guide that matches where this family actually is: the first phone
    // ladder from Stage 2, the per platform social settings from Stage 3. Both
    // pages were reachable only through alternating day cards that vanish
    // outside their window.
    key: 'setup-guides',
    applies: s => (s.stageId ?? 0) >= 2,
    build: s => ((s.stageId ?? 0) >= 3
      ? {
          key: 'setup-guides', eyebrow: EYEBROW, title: 'The social settings, walked through',
          line: 'Per platform, what to set with them rather than to them, before it matters.',
          href: '/dashboard/social-settings', icon: '🛡️', coversJobs: false,
        }
      : {
          key: 'setup-guides', eyebrow: EYEBROW, title: 'The first phone, step by step',
          line: 'The ladder from shared screens to their own handset, and what to set at each rung.',
          href: '/dashboard/phone-setup', icon: '📵', coversJobs: false,
        }),
  },
]

// ── THE FIVE THAT COME ROUND ONCE A WEEK ────────────────────────────────────
//
// Justin, 17 August 2026, after sending six screenshots of the passport page one
// after another: "presented with the rest above on today home page in a not
// annoying but rotating over a week fashion to bring value and make simple to
// weekly rotate these things."
//
// The passport had become a second Home: a stack of prompts and readings each
// asking a parent to DO something, which is what Today is for. The rule was
// written on 13 August and the page had drifted past it. Helps them know what to
// do today goes to the daily loop; the record of what they did stays on the
// passport.
//
// ── WHY A NEW TIER RATHER THAN FIVE MORE DAILY ITEMS ────────────────────────
//
// Two reasons, and the second is the one Justin named.
//
// These are all REFLECTIVE. They ask a parent to look back and take stock, which
// is a Sunday question rather than a Tuesday morning one. A daily list has to
// stay short enough to finish in ten minutes and these do not fit that.
//
// And "not annoying" is arithmetic here, not tone. Eleven daily items already
// share a twelve day cycle. Adding five would make it a fortnight between turns
// for EVERYTHING, so the balance card and the passport nudge would get rarer to
// make room for material nobody asked to see every day. One a week means five
// weeks to meet them all, which is right for things a parent does not need twice.
const WEEKLY: Item[] = [
  {
    key: 'journey',
    // Everybody has a journey, which is what makes the walk forward below
    // guaranteed to end for the weekly tier the same way quests does daily.
    applies: () => true,
    build: s => ({
      key: 'journey', eyebrow: EYEBROW, title: 'One step at a time',
      line: `Where ${s.childName ?? 'your child'} is on the road to sixteen, and the next thing that gets you there.`,
      // /dashboard/pathway directly. The old /dashboard/road target became a
      // server redirect back to the pathway when the split was reversed, and a
      // rotation card should not route through a forwarding address.
      href: '/dashboard/pathway', icon: '🛤️', coversJobs: false,
    }),
  },
  {
    // WHAT WE ARE WORKING ON. Distinct from the daily concern-queue item, which
    // sends a parent to work through one. This is the stock take: how many have
    // shifted, how many are still going.
    key: 'working-on',
    applies: s => s.concernsLive > 0 && s.hasCheckedIn,
    build: s => ({
      key: 'working-on', eyebrow: EYEBROW, title: 'What has actually shifted',
      line: `${s.concernsLive} on the list. See which have moved since you started, in words rather than a score.`,
      // The page built for exactly this question. The old target was a
      // passport tab that no longer exists and now redirects.
      href: '/dashboard/what-is-working', icon: '📈', coversJobs: false,
    }),
  },
  {
    key: 'streak-missions',
    applies: s => s.streakCount > 0,
    build: s => ({
      key: 'streak-missions', eyebrow: EYEBROW, title: 'Your streak, and what it unlocks',
      line: s.streakCount >= 5
        ? 'Five days in a row. Your mission is a lesson to do together, and it is waiting.'
        : `${5 - s.streakCount} more day${5 - s.streakCount === 1 ? '' : 's'} and your first mission lands. Invitations, never locks.`,
      href: '/dashboard/lessons', icon: '🔥', coversJobs: false,
    }),
  },
  {
    // THE WEEK IN NUMBERS. Effort, not outcome, which is why it is weekly: a
    // parent eight weeks in already knows they turned up, and asking them to
    // look at it daily would be the app admiring itself.
    key: 'week-numbers',
    applies: s => s.hasCheckedIn,
    build: () => ({
      key: 'week-numbers', eyebrow: EYEBROW, title: 'Your week in numbers',
      line: 'Stars earned, check ins done, and the days you showed up. Two minutes to see it.',
      // The weekly round up is the page that reads the week back; the old
      // passport tab target redirects. Movement per concern lives at
      // what-is-working, which the working-on card above now points at, so
      // the two weekly cards stop landing on the same door.
      href: '/dashboard/week', icon: '⭐', coversJobs: false,
    }),
  },
  {
    // WHAT THEY ARE LEARNING, so the term view is FOUND. From Justin's audit,
    // 19 August 2026: "check the homework decoder, curriculum, what the child
    // is going to learn next are all popping up somewhere at some time."
    //
    // They were not. The learning page builds a whole year view per child and
    // the homework decoder reads every child, but no rotation item pointed at
    // either, so the only families who met them were the ones who found the
    // Learning tab on their own. A feature nobody is walked to is a feature
    // that was not built, as far as most families know.
    //
    // Weekly, not daily: what this term holds changes on a term's clock, and
    // the daily list is for today's five minutes.
    key: 'learning-term',
    applies: () => true,
    build: s => ({
      key: 'learning-term', eyebrow: EYEBROW, title: 'What school is teaching next',
      line: `${s.childName ?? 'Your child'}'s term, decoded: what is coming, and the homework decoder for when tonight's sheet makes no sense.`,
      href: '/dashboard/learning', icon: '📖', coversJobs: false,
    }),
  },
  {
    // THE FOUR STRANDS QUESTION. DiGi asks one thing, the parent answers in a
    // sentence, and the strand readings on the passport fold it in.
    //
    // This item is why the block could come off the Progress page at all. It
    // was removed on 18 August with the others Justin moved to the rotations,
    // and for a few hours it was rendered nowhere, which does not fail loudly:
    // lib/pathway/literacy-status.ts reads on a 28 day window, so the strand
    // ticks would have kept displaying, correctly, until they were a month old
    // and standing on nothing.
    //
    // applies is unconditional for the same reason the two below it are: this
    // tier needs items that never run out, or the rotation lands on nothing in
    // a week where a family happens to qualify for none of the others.
    key: 'strand-question',
    applies: () => true,
    build: s => ({
      key: 'strand-question', eyebrow: EYEBROW, title: 'One question, one minute',
      line: `DiGi asks one thing about ${s.childName ?? 'your child'} this week, and reads your answer back. No score, nothing to revise for.`,
      href: '/dashboard/strands?from=home', icon: '🧭', coversJobs: false,
    }),
  },
  {
    // WHY THIS WORKS. The stance and the evidence. It applies to everybody and
    // it never expires, so it is the floor of this tier the way quests is the
    // floor of the daily one.
    key: 'stance',
    applies: () => true,
    build: () => ({
      key: 'stance', eyebrow: EYEBROW, title: 'Why this works, and where we stand',
      line: 'The measured evidence on kids and phones, and what we believe because of it.',
      // The pathway page directly, where the #why-this-works anchor lives. The
      // old /dashboard/road target became a redirect when the split was
      // reversed, and a hash does not reliably survive a server redirect.
      href: '/dashboard/pathway#why-this-works', icon: '🔬', coversJobs: false,
    }),
  },
]

/** Whole weeks since the shared ANCHOR, so the weekly item turns over on the
 *  same clock the daily one and the planets already use. */
export function weekIndex(now: Date = new Date()): number {
  return Math.floor(dayIndex(now) / 7)
}

/** Is today the day the weekly item leads? Monday, so it lands at the start of
 *  a week rather than in the middle of one, and so a parent who opens the app
 *  once a week most likely meets it. */
export function isWeeklyDay(now: Date = new Date()): boolean {
  const london = now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
  const [y, m, d] = london.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1
}

// ── THE SHOP, ONE DAY A MONTH ───────────────────────────────────────────────
//
// Justin, 13 August 2026, on the shop tab: "It is also the monthly shop
// rotation on the daily list, so build the destination once."
//
// It is its own tier rather than a twelfth item in ROTATION, and the reason is
// arithmetic. A slot in the rotation comes round every twelve days, which is
// not monthly, it is nearly three times a month. Gating a rotation item on a
// date instead is worse: the day picks a position and walks forward, so a shop
// item that only applied on the 12th would show in the months where the walk
// happened to reach it and be silently skipped in the months where it did not.
//
// So it sits between the two that jump the queue and the eleven that take
// turns: never ahead of a child waiting on an answer, never the daily lead,
// once a month, on a day chosen for being nowhere near either end of it.
const SHOP_DAY_OF_MONTH = 12

/** The 12th, in London, so the day turns over here rather than in UTC. */
export function isShopDay(now: Date = new Date()): boolean {
  const london = now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
  return Number(london.split('-')[2]) === SHOP_DAY_OF_MONTH
}

const MONTHLY: Item[] = [
  {
    key: 'shop',
    // Same gate as the passport nudge, and for the same reason: a personalised
    // booklet of a passport with nothing stamped in it is not a keepsake.
    applies: s => s.hasCheckedIn,
    build: () => ({
      key: 'shop', eyebrow: EYEBROW, title: 'The passport, printed',
      line: 'Their real one as a little booklet, and the Planet Friends sticker sheet.',
      href: '/dashboard/keepsakes', icon: '📮', coversJobs: false,
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

  if (isShopDay(now)) {
    const monthly = MONTHLY.find(item => item.applies(s))
    if (monthly) return monthly.build(s)
  }

  // The weekly tier, on a Monday, after the shop so the 12th still wins when the
  // two collide. It walks forward exactly like the daily one, so an item that
  // does not apply passes its turn to the next rather than leaving the day empty.
  if (isWeeklyDay(now)) {
    const n = WEEKLY.length
    const start = ((weekIndex(now) % n) + n) % n
    for (let i = 0; i < n; i++) {
      const item = WEEKLY[(start + i) % n]
      if (item.applies(s)) return item.build(s)
    }
  }

  const n = ROTATION.length
  const start = ((dayIndex(now) % n) + n) % n
  for (let i = 0; i < n; i++) {
    const item = ROTATION[(start + i) % n]
    if (item.applies(s)) return item.build(s)
  }
  // Unreachable: quests applies to everybody. Here so the type is honest.
  return ROTATION[0].build(s)
}
