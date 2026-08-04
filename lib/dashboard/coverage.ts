// What this family has NOT met yet, so Home can introduce it once.
//
// Justin: "the best way all vital info on the parent home page, like the week
// round up, gets in front of the user, and we rotate so everything we offer is
// at some point front of mind."
//
// THE PROBLEM WITH JUST ROTATING MORE OFTEN. Home already had a rotating card,
// DigiFlashUp, and it already cycles: a lesson, a printable, a script, a
// moment, a device check in. Five slots. The dashboard has around thirty
// routes. So the passport, the tracker, the agreement, the kid app, the
// keepsakes, the toolbox and the school side were in no rotation at all, and
// showing that card daily instead of twice a week would only have shown the
// same five things more often. The SLOT LIST was the ceiling, not the cadence.
//
// THE RULE THIS FILE ADDS: only offer what they have not used. A rotation with
// no memory keeps recommending the tracker to somebody who checks in every
// Sunday, which is how a helpful card becomes wallpaper. This one runs out,
// and running out is the feature. A family who has met everything gets a quiet
// Home, which is what a family who has met everything has earned.
//
// Every signal below is ALREADY loaded by the dashboard page for other reasons,
// so this adds no queries. If that stops being true, think hard before adding
// one: a suggestion card is not worth a round trip on the page a parent opens
// most.

// SEVEN, NOT ELEVEN, and the four that were cut are worth naming.
//
// Devices, the passport, DiGi itself and printables all deserve a card. Each
// would have cost a fresh query on the page a parent opens most, to decide
// whether to show a suggestion. That is the wrong trade, and the alternative
// was worse: guessing at the signal and telling a parent they have not tried
// something they use weekly, which discredits every other card in the
// rotation.
//
// The honest version is seven cards driven by signals the page already holds.
// When any of those four gets a cheap signal, it joins.
export type CoverageKey =
  | 'agreement' | 'kid-app' | 'jobs' | 'checkin'
  | 'notifications' | 'scripts' | 'lessons'

export type CoverageCard = {
  key: CoverageKey
  eyebrow: string
  title: string
  blurb: string
  cta: string
  href: string
  emoji: string
}

/**
 * The signals, all of them already in hand on the dashboard.
 *
 * Deliberately booleans rather than counts. "Has this family ever done this"
 * is the only question being asked, and a count would invite somebody to start
 * nagging at a threshold, which is a different feature with a different tone.
 */
export type CoverageSignals = {
  hasAgreement: boolean
  hasKidLink: boolean
  hasJobs: boolean
  hasCheckin: boolean
  hasPush: boolean
  hasReadScript: boolean
  hasDoneLesson: boolean
}

/**
 * Ordered by what actually helps a family soonest, not by what we would most
 * like to sell.
 *
 * The agreement and the kid app lead because everything else lands better once
 * they exist: jobs need somewhere to appear, the passport fills from work the
 * child does. Printables come last because they are lovely and nothing depends
 * on them. If this order is ever reshuffled toward the shop, that is the
 * moment this stopped being help and started being marketing.
 */
const CARDS: { key: CoverageKey; seen: (s: CoverageSignals) => boolean; card: Omit<CoverageCard, 'key'> }[] = [
  {
    key: 'agreement',
    seen: s => s.hasAgreement,
    card: {
      eyebrow: 'Not set up yet', emoji: '🤝',
      title: 'The family agreement',
      blurb: 'One page you and your child both sign, so the rules are a deal you made together rather than something handed down. It is the thing DiGi checks before it ever suggests a change.',
      cta: 'Make one', href: '/dashboard/agreement',
    },
  },
  {
    key: 'kid-app',
    seen: s => s.hasKidLink,
    card: {
      eyebrow: 'Not set up yet', emoji: '📱',
      title: 'Their own side of it',
      blurb: 'A link that gives your child their own board: their jobs, their stars, their squad. They tick things off, you get the ping, and the passport starts filling from their end rather than yours.',
      cta: 'Set it up', href: '/dashboard/quests',
    },
  },
  {
    key: 'jobs',
    seen: s => s.hasJobs,
    card: {
      eyebrow: 'Not tried yet', emoji: '⭐',
      title: 'Screen time they earn',
      blurb: 'Set a few real world jobs and minutes come from those instead of from asking. It is the single change families tell us settles the daily argument fastest.',
      cta: 'Add a job', href: '/dashboard/quests',
    },
  },
  {
    key: 'checkin',
    seen: s => s.hasCheckin,
    card: {
      eyebrow: 'Not tried yet', emoji: '💛',
      title: 'The monthly check in',
      blurb: 'Once a month, how the family has actually been: how YOU are doing, what has got better, and anything new. It takes a minute and it is the only place the parent gets asked rather than the child.',
      cta: 'Try one', href: '/dashboard/checkin',
    },
  },
  {
    key: 'scripts',
    seen: s => s.hasReadScript,
    card: {
      eyebrow: 'Not tried yet', emoji: '💬',
      title: 'The words for the hard moments',
      blurb: 'Over two hundred scripts for the conversations that go wrong: what to say, what not to say, why it works, and one thing to do tonight. Filter them by what is actually happening.',
      cta: 'Browse them', href: '/dashboard/scripts',
    },
  },
  {
    key: 'lessons',
    seen: s => s.hasDoneLesson,
    card: {
      eyebrow: 'Not tried yet', emoji: '📚',
      title: 'The lessons you do together',
      blurb: 'Short ones you watch or lead with your child, then a quick check they can retake. This is the part that actually builds the judgement, rather than just the rules.',
      cta: 'Start one', href: '/dashboard/lessons',
    },
  },
  {
    key: 'notifications',
    seen: s => s.hasPush,
    card: {
      eyebrow: 'Not set up yet', emoji: '🔔',
      title: 'Let it reach you',
      blurb: "Turn on notifications and the check ins, the follow ups DiGi promised, and your child's pings arrive rather than waiting to be found. Quiet hours are respected.",
      cta: 'Turn them on', href: '/dashboard/notifications',
    },
  },
]

/**
 * What to offer, best first, excluding anything already met.
 *
 * Returns an empty array when a family has met everything, and the caller is
 * expected to render nothing rather than fall back to repeating one. That
 * silence is correct.
 */
export function unmetCoverage(signals: CoverageSignals): CoverageCard[] {
  return CARDS
    .filter(c => !c.seen(signals))
    .map(c => ({ key: c.key, ...c.card }))
}

/** Everything, met or not, for a coverage read on the founder board. */
export const COVERAGE_KEYS: CoverageKey[] = CARDS.map(c => c.key)
