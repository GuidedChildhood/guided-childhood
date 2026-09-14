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
  { key: 'first-phone',   label: 'First phone',        ages: 'Ages 11 to 12', stage: 'explorer',    emoji: '📱', blurb: 'The big one. What having a phone means, and what it never means.' },
  { key: 'social-ready',  label: 'Social media ready', ages: 'Ages 13 to 15', stage: 'shaper',      emoji: '💬', blurb: 'Which apps, on what terms, and how we stay on the same side.' },
  { key: 'independent',   label: 'Nearly independent', ages: 'Age 16 and up', stage: 'independent', emoji: '🧭', blurb: 'Less rules, more trust, and the door always open.' },
]

export type Clause = {
  key: string
  title: string
  /** The science in one line: why this clause is in the deal at all. */
  why: string
  /**
   * The question to ask the child at the table, once the clause is in.
   * Justin, 14 September 2026: "discuss it when building." A deal a child
   * was asked about is a deal they keep; one read to them is a rule.
   */
  talk: string
  options: string[]
}

const SCREENS_OFF: Clause = {
  key: 'screens-off',
  title: 'When screens go off at night',
  why: 'Sleep is the single biggest thing screens take. This one clause protects it.',
  talk: 'What time do you think screens should go off, and what would you rather do with the last bit of the evening?',
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
  talk: 'Where should everyone\'s devices sleep, grown ups included? Pick the spot together.',
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
  talk: 'What is a new game or app you would like to try soon? Let us look at it together and decide.',
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
  talk: 'If something online ever made you feel bad, who would you tell first, and what do you think should happen next?',
  options: [
    'Tell a grown up straight away and nobody is in trouble',
    'Screenshot it, show us, we sort it out together, no drama',
  ],
}

const EARN_TIME: Clause = {
  key: 'earn-time',
  title: 'How screen time is earned',
  why: 'Time that is planned together is time nobody argues about. Jobs make it automatic, and a small core is always theirs.',
  talk: 'Which jobs feel fair to you for earning screen time, and which feel like too much?',
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
  talk: 'Which meal should be our screen free one, and what should we talk about at it?',
  options: [
    'No screens at meals, grown ups too',
    'Phones sleep in a basket during dinner',
  ],
}

const MONEY: Clause = {
  key: 'money',
  title: 'Spending in games',
  why: 'In game shops are built to catch kids. This clause takes the pressure off.',
  talk: 'What would you do if a game asked you to buy something? What should we do together?',
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
  talk: 'If we call or text, how quickly do you think you should answer, and when would that be hard?',
  options: [
    'Always answer or ring straight back',
    'Reply within fifteen minutes when out',
  ],
}

const KINDNESS: Clause = {
  key: 'kindness',
  title: 'How we behave online',
  why: 'Written down once, it settles a hundred future situations.',
  talk: 'What does being kind online look like? Has anyone ever not been kind to you on there?',
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
  talk: 'Which apps do your friends use, and which one would you like to talk about first?',
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
  talk: 'What would make it easy to tell us about something online, and what would make it hard?',
  options: [
    'One honest chat a week about how online life is going',
    'Big decisions get talked through before they are made',
  ],
}

export const CLAUSES_BY_TYPE: Record<string, Clause[]> = {
  // No earned time clause at four to seven (14 September 2026). The stage
  // guide (digi/04-stages.md) is explicit that at this age screen time is
  // never framed as a reward or a privilege, because framing makes it more
  // desirable; the jobs and stars still run, the deal simply does not put the
  // trade in writing for a five year old. The parent runs the timer here.
  'first-screens': [SCREENS_OFF, DEVICE_SLEEP, ASK_FIRST, MEALS, WHEN_WRONG],
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

// ── THE DEAL AT ASK TIME ─────────────────────────────────────────────────────
//
// Justin, 14 September 2026: "we need to build in the family agreement at the
// time they ask to use the device so it all ties in." The agreement was built,
// signed and printed, and then lived on its own page; the one moment a family
// actually needs it, a child asking for screen time and a parent deciding, never
// showed it. These are the two clauses that moment is about: when screens go
// off, and how time is earned. Read from the saved row's legacy text columns,
// which every agreement has, so it works for one built before the structured
// clauses existed. Used by the child's device time card and the parent's yes box.
export type DealLine = { key: 'screens-off' | 'earn-time' | 'device-sleep'; text: string }

export function dealLinesFrom(row: {
  bedroom_rule_time?: string | null
  bedroom_rule_location?: string | null
  extra_agreements?: string | null
} | null | undefined): DealLine[] {
  if (!row) return []
  const out: DealLine[] = []
  const off = (row.bedroom_rule_time ?? '').trim()
  if (off) out.push({ key: 'screens-off', text: off })
  // The extra clauses are saved as "Title: option" lines. The earn time one
  // is the line that prices the ask, so it comes first among them.
  const extras = (row.extra_agreements ?? '').split('\n').map(l => l.trim()).filter(Boolean)
  const earn = extras.find(l => l.startsWith(`${EARN_TIME.title}:`))
  if (earn) out.push({ key: 'earn-time', text: earn.slice(EARN_TIME.title.length + 1).trim() })
  if (out.length < 2) {
    const sleep = (row.bedroom_rule_location ?? '').trim()
    if (sleep) out.push({ key: 'device-sleep', text: sleep })
  }
  return out.slice(0, 2)
}

// ── WHY WE AGREED THIS: THE SCIENCE PER DEAL (14 September 2026) ────────────
//
// Justin, reviewing the agreement: it should match "best science by age and
// what we have fully researched from child experts". Every line below is
// already in the product's own research bank (the DiGi situations bank,
// migration 263; the expert knowledge rows, 042 and 072; the verified
// briefings of August and September 2026) and is quoted here with its source,
// so a parent asked "why" at the table can say where it came from. The
// naming rule from migration 123 holds: bodies, published studies and the
// academics the homepage already cites; never a living clinician's name next
// to advice.
//
// One honest line sits on every deal: the promise carrying the weight is
// where devices sleep. The one randomised trial of family media plans as a
// whole (Moreno et al, JAMA Pediatrics 2021, 1,520 families) found no effect
// of the plan on its own; the bedroom rule is where the evidence is strongest
// (Carter et al, JAMA Pediatrics 2016, 125,198 children). The rest of the
// deal is the conversation, and that is what it is for.
export type DealScience = { claim: string; source: string }

const BEDROOM: DealScience = {
  claim: 'Where devices sleep is the promise that does most of the work. A device in the bedroom at night roughly doubles the odds of too little sleep, even when it is not used.',
  source: 'Carter and colleagues, JAMA Pediatrics 2016, 125,198 children',
}

export const SCIENCE_BY_TYPE: Record<string, DealScience[]> = {
  'first-screens': [
    BEDROOM,
    { claim: 'At this age an adult beside the child, naming what is on the screen, does more than any time limit. Watching together teaches judgement that a filter cannot.', source: 'Internet Matters and UKCIS guidance for the early years' },
    { claim: 'The hard moment is the end, not the start. Endings set by the device itself went far better than a parent calling time, and a spoken two minute warning made it worse.', source: 'Hiniker and colleagues, CHI 2016' },
  ],
  'tablet-games': [
    BEDROOM,
    { claim: 'Real money arrives at this age, a full stage before the phone: 53 percent of UK children who play online games spend money in them, and a third of recent spenders often regret it.', source: 'Ofcom, Children\'s Online Experiences 2026' },
    { claim: 'Structure beats willpower. On unstructured days, sleep, movement and screen habits slide in about four studies out of five, which is why the deal names when, not just how much.', source: 'Brazendale and colleagues, the structured days hypothesis, 2017' },
  ],
  'first-phone': [
    BEDROOM,
    { claim: 'Expect the first phone to show up in sleep before anywhere else. Twelve year olds with a phone had 1.6 times the odds of too little sleep, and a first phone in the following year raised those odds by half.', source: 'Barzilay and colleagues, Pediatrics 2025, 10,588 children' },
    { claim: 'Eleven to thirteen is the window when a child\'s wellbeing is most sensitive to social media use, for girls especially, which is why the phone deal talks about apps before there are any.', source: 'Orben, Przybylski, Blakemore and Kievit, Nature Communications 2022, 17,409 UK young people' },
  ],
  'social-ready': [
    BEDROOM,
    { claim: 'Thirteen is the age a child can consent to their own data under UK law. It is a data line, not a readiness line, so the deal is decided app by app rather than by a birthday.', source: 'UK GDPR, and Ofcom on children\'s social media use' },
    { claim: 'From spring 2027 the UK bars under sixteens from the main social apps. Messaging apps sit outside it, and a ban removes the view rather than the risk, which is why this deal keeps the conversation open.', source: 'UK Government announcement, 15 June 2026' },
  ],
  'independent': [
    { claim: 'The bedroom rule never goes away, it adapts: by sixteen it is devices off at midnight rather than devices in the kitchen. Sleep is still the thing screens take first.', source: 'UK Chief Medical Officers\' advice to families' },
    { claim: 'Strict rules stop working past fourteen. Across 57 studies, restriction had a near zero effect and in older teens tracked slightly more problem use, so this deal has fewer promises and more talking.', source: 'Collier and colleagues 2016; Lukavska and colleagues 2022' },
    { claim: 'A young person who can say what technology gives them and what it costs them is the prepared one. At sixteen the goal is literacy, not compliance.', source: 'The Guided Childhood stage guide, built on the digital literacy research it cites' },
  ],
}

export function scienceForType(typeKey: string | null | undefined): DealScience[] {
  return SCIENCE_BY_TYPE[typeKey ?? ''] ?? []
}
