import { STEPS, type SetupFlags } from '@/lib/setup/steps'

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
  // The day's prompt: the real question a parent would put to DiGi about this
  // service, and where the hello now hands over to. Every card has one, because
  // the front door on a greeting day is hello, one conversation, then Home, and
  // a card with nothing to ask would break that in the middle.
  //
  // These read as questions rather than as features on purpose. "See the
  // balance" is a menu item. "How long should my child be on a screen each day"
  // is the thing they were actually wondering on the way to opening the app.
  ask: string
  // Setup cards lead when the family has not set them up yet.
  //
  // Only three keys can appear here now. The Setup Quest was cut to three on 14
  // August 2026 (plans/setup-quest-three-steps.md) and jobs, school and the
  // daily practice stopped being setup. They are still cards in this deck,
  // because the deck introduces SERVICES and those three are services; they
  // just carry a plain destination now rather than a step to tick.
  setup?: keyof SetupFlags
  // Where a parent goes to actually DO this thing, for the cards that are not
  // setup steps. A setup card does not carry one: its destination is already
  // written in STEPS and is read from there, so the two can never drift.
  does?: string
}

/**
 * Where the card's action button goes.
 *
 * The hello explains a service and then hands over to DiGi to talk about it,
 * which is right for understanding it and useless for doing it. Justin: the tips
 * "need to cleverly link to how to action it". So every card now has a real
 * destination as well as a conversation.
 *
 * A setup card reads its href straight out of STEPS rather than repeating it,
 * for the same reason the passport rows read theirs from getLiteracyStatuses:
 * two copies of a route is two routes to keep in step, and the one nobody
 * remembers to update is the one a parent taps.
 */
export function cardAction(card: WelcomeCard): string | null {
  if (card.setup) return STEPS.find(s => s.key === card.setup)?.href ?? null
  return card.does ?? null
}

export const WELCOME_CARDS: WelcomeCard[] = [
  {
    key: 'daily',
    emoji: '🧭',
    title: "We build today's pathway",
    line: 'Open it and today is already laid out, picked for their stage and for whatever is going on this week.',
    trust: 'It rebuilds every morning. Log a rough night and tomorrow leads with that instead.',
    ask: 'What should today actually look like for us?',
    does: '/dashboard/daily',
  },
  {
    key: 'quests',
    emoji: '⭐',
    title: 'Set up Family Quests',
    line: 'Their jobs earn the screen time, so the deal does the arguing instead of you.',
    trust: 'DiGi watches which jobs actually get done, and quietly retires the ones that never do.',
    ask: 'How do I make jobs earn the screen time without it turning into a row every night?',
    does: '/dashboard/quests',
  },
  {
    key: 'push',
    emoji: '🔔',
    title: 'Turn on the check ins',
    line: 'A few small nudges a day, at the hours screens usually turn up in your house.',
    trust: 'Your answers move the timing. A moment that is always calm stops being asked about.',
    ask: 'Which part of our day do screens actually cause the most trouble in?',
    setup: 'homeScreen',
  },
  {
    key: 'school',
    emoji: '🎒',
    title: 'School reminders, set once',
    line: 'PE kit, library day, the swimming bag. Add them once and the week reminds you both from then on.',
    trust: 'We only ever read what you add or forward. It stays in your family account.',
    ask: 'How do I stop the school week catching us out every time?',
    does: '/dashboard/school',
  },
  {
    key: 'childLink',
    emoji: '📱',
    title: 'Their side of it',
    line: 'Jobs, printables and lessons land on their own phone, and they tick things off themselves.',
    trust: 'Their view has no chat and no browsing. Just their jobs, their sheets and their stars.',
    ask: 'Is my child old enough to have their own side of this yet?',
    setup: 'childLink',
  },
  {
    key: 'agreement',
    emoji: '🤝',
    title: 'Your family agreement',
    line: 'The boundaries you both chose, written down and signed by everyone.',
    trust: 'It sets what the stars can buy, so the paper on the fridge and the app always agree.',
    ask: 'How do we agree the rules together so they actually stick?',
    setup: 'agreement',
  },
  {
    key: 'moment',
    emoji: '💬',
    title: 'Log a moment',
    line: 'Something kicked off? Say what happened and get the words to use, in your voice not a script.',
    trust: 'DiGi keeps it, and brings it back the next time the same thing happens, so you are never starting cold.',
    ask: 'Something kicked off over a screen today. What do I say tonight?',
    does: '/dashboard/moments',
  },
  {
    key: 'checkins',
    emoji: '💛',
    title: 'How you both are',
    line: 'A quick read on your child, and one on you, because a hard week for you is a hard week for them.',
    trust: 'Nobody sees it but you. It shapes what tomorrow opens with, and a rough patch gets a gentler day.',
    ask: 'How do I tell a bad week apart from something I should worry about?',
    does: '/dashboard/checkin',
  },
  {
    key: 'balance',
    emoji: '⚖️',
    title: 'Online and offline, balanced',
    line: 'The healthy amount for their age, and the offline hours that earn it.',
    trust: 'Built on the measured research, Orben and Odgers at Cambridge, never on scare stories.',
    ask: 'How long should my child be on a screen each day?',
    does: '/dashboard/stats',
  },
  {
    key: 'literacy',
    emoji: '🛡️',
    title: 'Safe online and digital literacy',
    line: 'The lessons at the age they actually land, so nothing arrives years too early or too late.',
    trust: 'What they pass moves their stage on, so the next lesson always meets them where they are.',
    ask: 'What should my child understand about being online at their age?',
    does: '/dashboard/lessons',
  },
  {
    key: 'printables',
    emoji: '🖨️',
    title: 'Paper for the offline days',
    line: 'Sheets to print for the afternoons screens have had quite enough of.',
    trust: 'Mark one done and the stars still land, so the off screen hours count the same as the rest.',
    ask: 'What can we do this afternoon that is not a screen?',
    does: '/dashboard/printables',
  },
  {
    key: 'stages',
    emoji: '🛂',
    title: 'Every stage, 4 to 16',
    line: 'Built in order, so 16 arrives as a gentle ramp and never a cliff edge.',
    trust: 'You never have to hold the plan. We keep the order and hand you today.',
    ask: 'What is coming next for us, and roughly when?',
    does: '/dashboard/road',
  },
]

// The birthday used to be a card here, injected at the front of the deck
// whenever it was missing. It has moved to the setup checklist, where it
// belongs: it is not a service we are introducing, it is one missing fact only
// the parent can supply, and setup is the place a parent goes to find out what
// is still missing. See the note in lib/setup/steps.ts.

// The phone link card has no business showing to a family with a five year
// old. Asking them to link a device reads as us pushing phones onto little
// children, which is the opposite of what we stand for.
//
// `settled` drops it for the other reason: this family has already told us
// they use the paper chart or co-view on the grown up's device. Old enough is
// not the same question as wanted, and until 14 August 2026 the card only
// asked the first one, so a family who had answered the second one kept being
// introduced to a service they had declined.
export function availableCards(phoneAge: boolean, settled = false): WelcomeCard[] {
  return WELCOME_CARDS.filter(c => c.key !== 'childLink' || (phoneAge && !settled))
}

// The cards for this open, in order. One of them, on the three days the hello
// shows at all, though the shape holds for more.
//
// Order is not decoration. Anything unset leads, so the card is a useful next
// thing rather than a fact about the product, then the least seen insights.
// Nothing repeats inside one open, and the card that greeted them last time
// never leads this time.
export function pickWelcomeCards(
  flags: Partial<SetupFlags>,
  seen: string[],
  phoneAge: boolean,
  count = 3,
  settled = false,
): WelcomeCard[] {
  const last = seen[seen.length - 1]
  const times = (k: string) => seen.filter(s => s === k).length
  const cards = availableCards(phoneAge, settled)

  const todo = cards.filter(c => c.setup && flags[c.setup] === false)
  const rest = cards.filter(c => !c.setup || flags[c.setup] !== false)

  // Least seen first inside each band, and last time's card pushed back so the
  // hello never opens on the same face twice.
  const rank = (a: WelcomeCard, b: WelcomeCard) =>
    (a.key === last ? 1 : 0) - (b.key === last ? 1 : 0) || times(a.key) - times(b.key)

  const ordered = [...todo].sort(rank).concat([...rest].sort(rank))
  const out: WelcomeCard[] = []
  for (const c of ordered) {
    if (out.length >= count) break
    if (!out.some(o => o.key === c.key)) out.push(c)
  }
  return out
}
