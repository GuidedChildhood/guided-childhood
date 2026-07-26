import type { SetupFlags } from '@/lib/setup/steps'

// One service per app open. A parent who opens the app on a busy Tuesday does
// not want a tour, and they will never sit through one, but across a fortnight
// of quick hellos they can meet the whole product a card at a time.
//
// Two rules make this work. It never says how long anything takes, because a
// duration on the welcome screen reads as a commitment before they have even
// started. And every card carries the trust line: not just what the service
// does, but what happens to what you tell it. Families are rightly wary of
// apps that hoover up information about their children, so saying plainly
// where it goes is both the explanation and the reason to trust us.

export type WelcomeCard = {
  key: string
  emoji: string
  // The service, named the way a parent would name it.
  title: string
  // What it does for them, one line, no duration.
  line: string
  // What we do with what they tell it. The DiGi brain insight.
  trust: string
  // Setup cards lead when the family has not set them up yet.
  setup?: keyof SetupFlags
  href?: string
  cta?: string
}

export const WELCOME_CARDS: WelcomeCard[] = [
  {
    key: 'daily',
    emoji: '🧭',
    title: "We build today's pathway",
    line: 'Open it and today is already laid out, picked for their stage and for whatever is going on this week.',
    trust: 'It rebuilds every morning. Log a rough night and tomorrow leads with that instead.',
    setup: 'daily',
    href: '/dashboard/daily',
    cta: 'Have a look',
  },
  {
    key: 'quests',
    emoji: '⭐',
    title: 'Set up Family Quests',
    line: 'Their jobs earn the screen time, so the deal does the arguing instead of you.',
    trust: 'DiGi watches which jobs actually get done, and quietly retires the ones that never do.',
    setup: 'quests',
    href: '/dashboard/quests',
    cta: 'Set the jobs',
  },
  {
    key: 'push',
    emoji: '🔔',
    title: 'Turn on the check ins',
    line: 'A few small nudges a day, at the hours screens usually turn up in your house.',
    trust: 'Your answers move the timing. A moment that is always calm stops being asked about.',
    setup: 'push',
    href: '/dashboard#turn-on-check-ins',
    cta: 'Turn them on',
  },
  {
    key: 'school',
    emoji: '🎒',
    title: 'School reminders, set once',
    line: 'PE kit, library day, the swimming bag. Add them once and the week reminds you both from then on.',
    trust: 'We only ever read what you add or forward. It stays in your family account.',
    setup: 'school',
    href: '/dashboard/school',
    cta: 'Add the week',
  },
  {
    key: 'childLink',
    emoji: '📱',
    title: 'Their side of it',
    line: 'Jobs, printables and lessons land on their own phone, and they tick things off themselves.',
    trust: 'Their view has no chat and no browsing. Just their jobs, their sheets and their stars.',
    setup: 'childLink',
    href: '/dashboard/quests?tab=share',
    cta: 'Send their link',
  },
  {
    key: 'agreement',
    emoji: '🤝',
    title: 'Your family agreement',
    line: 'The boundaries you both chose, written down and signed by everyone.',
    trust: 'It sets what the stars can buy, so the paper on the fridge and the app always agree.',
    setup: 'agreement',
    href: '/dashboard/agreement',
    cta: 'Build it',
  },
  {
    key: 'moment',
    emoji: '💬',
    title: 'Log a moment',
    line: 'Something kicked off? Say what happened and get the words to use, in your voice not a script.',
    trust: 'DiGi keeps it, and brings it back the next time the same thing happens, so you are never starting cold.',
    href: '/dashboard/daily',
    cta: 'Log one',
  },
  {
    key: 'checkins',
    emoji: '💛',
    title: 'How you both are',
    line: 'A quick read on your child, and one on you, because a hard week for you is a hard week for them.',
    trust: 'Nobody sees it but you. It shapes what tomorrow opens with, and a rough patch gets a gentler day.',
    href: '/dashboard/progress',
    cta: 'Check in',
  },
  {
    key: 'balance',
    emoji: '⚖️',
    title: 'Online and offline, balanced',
    line: 'The healthy amount for their age, and the offline hours that earn it.',
    trust: 'Built on the measured research, Orben and Odgers at Cambridge, never on scare stories.',
    href: '/dashboard/progress',
    cta: 'See the balance',
  },
  {
    key: 'literacy',
    emoji: '🛡️',
    title: 'Safe online and digital literacy',
    line: 'The lessons at the age they actually land, so nothing arrives years too early or too late.',
    trust: 'What they pass moves their stage on, so the next lesson always meets them where they are.',
    href: '/dashboard/lessons',
    cta: 'See the lessons',
  },
  {
    key: 'printables',
    emoji: '🖨️',
    title: 'Paper for the offline days',
    line: 'Sheets to print for the afternoons screens have had quite enough of.',
    trust: 'Mark one done and the stars still land, so the off screen hours count the same as the rest.',
    href: '/dashboard/printables',
    cta: 'See the sheets',
  },
  {
    key: 'stages',
    emoji: '🛂',
    title: 'Every stage, 4 to 16',
    line: 'Built in order, so 16 arrives as a gentle ramp and never a cliff edge.',
    trust: 'You never have to hold the plan. We keep the order and hand you today.',
    href: '/dashboard/pathway',
    cta: 'See the journey',
  },
]

// The phone link card has no business showing to a family with a five year
// old. Asking them to link a device reads as us pushing phones onto little
// children, which is the opposite of what we stand for.
export function availableCards(phoneAge: boolean): WelcomeCard[] {
  return WELCOME_CARDS.filter(c => c.key !== 'childLink' || phoneAge)
}

// What to greet them with this open. Anything they have not set up leads, so
// the card is a useful next thing rather than a fact about the product. Once
// the family is set up it falls back to the insights, least seen first, and
// never the same card twice running.
export function pickWelcomeCard(
  flags: Partial<SetupFlags>,
  seen: string[],
  phoneAge: boolean,
): WelcomeCard {
  const cards = availableCards(phoneAge)
  const last = seen[seen.length - 1]
  const times = (k: string) => seen.filter(s => s === k).length

  // An unknown flag counts as met, so a missing reading never nags.
  const todo = cards.filter(c => c.setup && flags[c.setup] === false)
  const pool = todo.length ? todo : cards.filter(c => !c.setup || flags[c.setup] !== false)
  const safe = pool.length ? pool : cards

  const notLast = safe.filter(c => c.key !== last)
  const from = notLast.length ? notLast : safe

  return from.reduce((best, c) => (times(c.key) < times(best.key) ? c : best), from[0])
}
