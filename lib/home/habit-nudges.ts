// The four things worth interrupting a parent for, and nothing else.
//
// Justin, 10 August 2026: "we should also have little nudges, best way to
// inform them use timer when child uses device, and list why this is useful,
// the methodology, and reconsider the balance of offline online, and teaching
// habits that jobs done equals device time ... but little pop ups, not
// intrusive or annoying."
//
// ── The rule that makes this not annoying ────────────────────────────────────
//
// A nudge fires only when it is TRUE OF THIS FAMILY RIGHT NOW, from rows we
// already hold. Not on a timer, not on a rota, not because it is Tuesday. That
// single constraint is what separates a nudge from a pop up: a parent who is
// already doing the thing never sees the card about it, so the card keeps
// meaning something when it does appear.
//
// One at a time, highest need first, and the caller shows at most one per visit
// with a day's snooze on each. Never a modal, because a thing that blocks the
// screen is the pop up Justin asked us not to build.
//
// ── Why each one earns its place ─────────────────────────────────────────────
//
// Every card carries a WHY, in one sentence, because the ask was to teach the
// method and not just to prod. A parent who understands why the timer works can
// keep the habit when the app is closed, and a parent who was only prodded
// cannot.
//
// Pure and here rather than inside the page, so the rules can be run over a
// month of simulated days. The last three bugs in this repo were all the same
// shape: correct on any single day, wrong across days, invisible because
// nothing ran across days.

export type HabitNudgeKey = 'waiting-yes' | 'timer' | 'offline' | 'unspent'

export type HabitNudge = {
  key: HabitNudgeKey
  /** The mono label above the line. */
  eyebrow: string
  /** The one line. Short enough to read without deciding to. */
  line: string
  /** The method, in a sentence. This is the part that is meant to outlast us. */
  why: string
  cta: string
  href: string
}

export type NudgeFacts = {
  /** Jobs live on the board. Nothing here makes sense without at least one. */
  activeQuests: number
  /** Has the screen time timer ever been started, by either side? */
  everTimed: boolean
  /** Days in the last week with screen time recorded. */
  screenDaysThisWeek: number
  /** Ticks sitting on a yes, and how old the oldest is. */
  waitingTicks: number
  waitingOldestDays: number
  /** Stars banked and spendable, and how long they have sat unspent. */
  bankedStars: number
  bankedIdleDays: number
  /** Days in the last fortnight with something offline done: a craft, a printable. */
  offlineDaysThisFortnight: number
}

/**
 * How long a child should have to wait on a yes before we say something.
 *
 * A day. Shorter and we are nagging a parent who is simply asleep; longer and a
 * child has already learned that ticking a job does nothing, which is the
 * lesson we least want to teach.
 */
const WAITING_DAYS = 1

/** Stars sitting unspent long enough that nobody is remembering they exist. */
const IDLE_DAYS = 4

/**
 * How long a dismissed nudge stays away, given how many times it has been
 * dismissed before.
 *
 * A flat day is not enough, and the month simulation is what proved it. A
 * family with a job waiting on a yes has that fact true every morning, so a
 * one day snooze brought the same card back thirty times in thirty days. That
 * is not a nudge, it is the "whatever the first card is, always seems the same"
 * complaint rebuilt in a new place.
 *
 * So dismissing it means it more each time: two days, then four, eight, and
 * then a fortnight for ever. A parent who has said not now four times has told
 * us something clear, and the card that keeps asking anyway is the one they
 * learn to swipe past without reading, which costs us every future card too.
 *
 * TWO DAYS AT THE FLOOR, not one. A single day put the same card back the very
 * next morning, which is not what "not now" means to the person who tapped it.
 *
 * It never stops entirely, because the underlying facts are real and a family
 * coming back to it in a fortnight is a fair second ask.
 */
export function snoozeDays(dismissals: number): number {
  const n = Math.max(0, Math.floor(dismissals))
  return Math.min(14, 2 ** (Math.min(n, 4) + 1))
}

/**
 * Today's nudge, or null when there is nothing true to say.
 *
 * `suppressed` is the set the caller has snoozed. Passed in rather than read
 * here so this stays pure and the storage stays the browser's problem.
 */
export function pickHabitNudge(facts: NudgeFacts, suppressed: Set<string> = new Set()): HabitNudge | null {
  for (const rule of RULES) {
    if (suppressed.has(rule.key)) continue
    const nudge = rule.build(facts)
    if (nudge) return nudge
  }
  return null
}

// Order is the argument. A child waiting on a person beats a habit we would
// like to teach, and both beat a suggestion about balance.
const RULES: { key: HabitNudgeKey; build: (f: NudgeFacts) => HabitNudge | null }[] = [
  {
    // 1. SOMEBODY IS WAITING ON YOU.
    //
    // Justin hit this himself on 10 August: he ticked a job on the child app and
    // the balance still read zero, because a tick is worth nothing until a
    // grown up says yes. That is the right rule, and it puts a real child in a
    // queue behind a parent who does not know they are in it.
    key: 'waiting-yes',
    build: f => {
      if (f.waitingTicks <= 0 || f.waitingOldestDays < WAITING_DAYS) return null
      const one = f.waitingTicks === 1
      return {
        key: 'waiting-yes',
        eyebrow: 'Waiting on you',
        line: `${f.waitingTicks} job${one ? '' : 's'} ${one ? 'is' : 'are'} ticked and waiting for your yes.`,
        why: 'The yes is the whole mechanism. A job that is never approved teaches a child that ticking it does nothing, and that is the one lesson we cannot undo later.',
        cta: 'Say yes',
        href: '/dashboard/quests',
      }
    },
  },
  {
    // 2. THE TIMER HAS NEVER BEEN STARTED.
    //
    // Only worth saying to a family who is actually using screens and has a
    // board set up, because otherwise it is advice about a situation they are
    // not in yet.
    key: 'timer',
    build: f => {
      if (f.everTimed || f.activeQuests <= 0 || f.screenDaysThisWeek < 2) return null
      return {
        key: 'timer',
        eyebrow: 'Try the timer',
        line: 'Start the timer when the screen goes on.',
        why: 'A clock both of you can see moves the argument off you and onto something neutral. The end of the time stops being your decision, so switching off stops being a thing you did to them.',
        cta: 'Show me',
        href: '/dashboard/quests#screen-time',
      }
    },
  },
  {
    // 3. THE OFFLINE HALF HAS GONE QUIET.
    //
    // A fortnight with screens every week and nothing offline at all. Not a
    // telling off: the offline half is a thing we owe them, not a thing they
    // owe us, so the card hands over something to do rather than a number to
    // feel bad about.
    key: 'offline',
    build: f => {
      if (f.screenDaysThisWeek < 4 || f.offlineDaysThisFortnight > 0) return null
      return {
        key: 'offline',
        eyebrow: 'The other half',
        line: 'Nothing offline in a fortnight. There is a whole pack of it, free.',
        why: 'Earned screen time only works if there is something on the other side of it worth having. The offline half is what the stars are for, and it is the part that makes the deal feel like a deal rather than a rationing.',
        cta: 'Open the game pack',
        href: '/dashboard/quests/crafts',
      }
    },
  },
  {
    // 4. THEY EARNED IT AND NOBODY SPENT IT.
    //
    // Almost always because the child does not know the minutes are there. The
    // loop worked and then went quiet at the last step, which is the quietest
    // way for a good week to teach nothing.
    key: 'unspent',
    build: f => {
      if (f.bankedStars <= 0 || f.bankedIdleDays < IDLE_DAYS) return null
      return {
        key: 'unspent',
        eyebrow: 'Earned and unspent',
        line: `${f.bankedStars} star${f.bankedStars === 1 ? '' : 's'} banked and nobody has spent them.`,
        why: 'Jobs done equals device time, and the equals sign only teaches anything if the time actually arrives. Tell them what they have got, and the next job gets done without being asked.',
        cta: 'See the balance',
        href: '/dashboard/quests',
      }
    },
  },
]
