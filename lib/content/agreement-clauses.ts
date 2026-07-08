// The agreement built from taps, not textareas. A family picks the
// agreement TYPE for where their child is (their age band is
// recommended, never forced), then taps the clauses to include, then
// picks an option inside each clause. Options are conversation starters
// written in family words; the custom box is always there for families
// who want their own.

export type AgreementTypeDef = {
  key: string
  label: string
  ages: string
  stage: string
  blurb: string
  emoji: string
}

export const AGREEMENT_TYPES: AgreementTypeDef[] = [
  { key: 'first-screens', label: 'First screens',      ages: 'Ages 4 to 7',   stage: 'foundation',  emoji: '📺', blurb: 'TV and tablet basics: when, where and what happens when time is up.' },
  { key: 'tablet-games',  label: 'Tablet and gaming',  ages: 'Ages 8 to 10',  stage: 'builder',     emoji: '🎮', blurb: 'Games, YouTube and the first taste of independence, with the habits set early.' },
  { key: 'first-phone',   label: 'First phone',        ages: 'Ages 11 to 13', stage: 'explorer',    emoji: '📱', blurb: 'The big one. What having a phone means, and what it never means.' },
  { key: 'social-ready',  label: 'Social media ready', ages: 'Ages 13 to 15', stage: 'shaper',      emoji: '💬', blurb: 'Which apps, on what terms, and how we stay on the same side.' },
  { key: 'independent',   label: 'Nearly independent', ages: 'Age 16 and up', stage: 'independent', emoji: '🧭', blurb: 'Less rules, more trust, and the door always open.' },
]

export type Clause = {
  key: string
  title: string
  why: string
  options: string[]
}

const SCREENS_OFF: Clause = {
  key: 'screens-off',
  title: 'When screens go off at night',
  why: 'Sleep is the single biggest thing screens take. This one clause protects it.',
  options: [
    'Thirty minutes before bed, every night',
    'One hour before bed, every night',
    '7pm on school nights, later at weekends',
    '8pm on school nights, later at weekends',
  ],
}

const DEVICE_SLEEP: Clause = {
  key: 'device-sleep',
  title: 'Where devices sleep',
  why: 'A device in the bedroom overnight gets used overnight. Grown ups follow this one too.',
  options: [
    'Every device charges in the kitchen overnight',
    'Every device charges in the hallway overnight',
    'Devices sleep in the parents room',
    'Anywhere except bedrooms, grown ups included',
  ],
}

const ASK_FIRST: Clause = {
  key: 'ask-first',
  title: 'New apps and games',
  why: 'Asking first is not about permission, it is about choosing together.',
  options: [
    'We always ask before downloading anything new',
    'We install new apps and games together',
    'Free games need a yes, purchases need a conversation',
  ],
}

const WHEN_WRONG: Clause = {
  key: 'when-wrong',
  title: 'When something goes wrong online',
  why: 'The promise that makes every other clause work: telling us is always safe.',
  options: [
    'Tell a grown up straight away and nobody is in trouble',
    'Screenshot it, show us, we sort it out together, no drama',
  ],
}

const EARN_TIME: Clause = {
  key: 'earn-time',
  title: 'How screen time is earned',
  why: 'Time that is earned is time nobody argues about. Quests make it automatic.',
  options: [
    'Stars from quests buy screen minutes, one star is five minutes',
    'A set daily amount, plus quest stars for extra',
    'Weekend screen time is earned during the week',
  ],
}

const MEALS: Clause = {
  key: 'meals',
  title: 'Screens at the table',
  why: 'One screen free meal a day is where families actually talk.',
  options: [
    'No screens at meals, grown ups too',
    'Phones sleep in a basket during dinner',
  ],
}

const MONEY: Clause = {
  key: 'money',
  title: 'Spending in games',
  why: 'In game shops are built to catch kids. This clause takes the pressure off.',
  options: [
    'Never spend real money without asking first',
    'Pocket money only, agreed before buying',
    'No spending in games, full stop',
  ],
}

const ANSWER_CALL: Clause = {
  key: 'answer-call',
  title: 'Answering when we call',
  why: 'The phone is for staying close. This is the deal that keeps it.',
  options: [
    'Always answer or ring straight back',
    'Reply within fifteen minutes when out',
  ],
}

const KINDNESS: Clause = {
  key: 'kindness',
  title: 'How we behave online',
  why: 'Written down once, it settles a hundred future situations.',
  options: [
    'We never write what we would not say to a face',
    'We never join a pile on, even with people we do not like',
    'We stick up for people getting picked on when it is safe to',
  ],
}

const SOCIAL_APPS: Clause = {
  key: 'social-apps',
  title: 'Which apps and on what terms',
  why: 'App by app beats a blanket yes or no. Readiness, not birthdays.',
  options: [
    'Each new app is agreed together before it is installed',
    'Accounts stay private and we hold the passwords for now',
    'No new apps without a conversation first, and that is a promise both ways',
  ],
}

const KEEP_TALKING: Clause = {
  key: 'keep-talking',
  title: 'We keep talking',
  why: 'At this age the agreement IS the conversation.',
  options: [
    'One honest chat a week about how online life is going',
    'Big decisions get talked through before they are made',
  ],
}

export const CLAUSES_BY_TYPE: Record<string, Clause[]> = {
  'first-screens': [SCREENS_OFF, DEVICE_SLEEP, ASK_FIRST, EARN_TIME, MEALS, WHEN_WRONG],
  'tablet-games':  [SCREENS_OFF, DEVICE_SLEEP, ASK_FIRST, MONEY, EARN_TIME, WHEN_WRONG],
  'first-phone':   [SCREENS_OFF, DEVICE_SLEEP, ANSWER_CALL, KINDNESS, EARN_TIME, MONEY, WHEN_WRONG],
  'social-ready':  [SOCIAL_APPS, KINDNESS, SCREENS_OFF, DEVICE_SLEEP, MONEY, WHEN_WRONG],
  'independent':   [KEEP_TALKING, KINDNESS, DEVICE_SLEEP, WHEN_WRONG],
}

// Which agreement type is the natural fit for each stage. Shown as
// Recommended for [child], never forced.
export function recommendedType(stageId: string | null): string {
  const map: Record<string, string> = {
    foundation: 'first-screens',
    builder: 'tablet-games',
    explorer: 'first-phone',
    shaper: 'social-ready',
    independent: 'independent',
  }
  return map[stageId ?? ''] ?? 'first-phone'
}
