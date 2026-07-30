import type { AgeBand } from '@/lib/content/stages'

// One service a week, named in the weekly digest.
//
// A family buys the whole thing and meets about a fifth of it. Everything below
// is already built and already paid for, sitting behind a tab nobody opened.
//
// This is a registry rather than a campaign, and that is the whole design. A
// feature ships with an entry here and joins the rotation on its own, with
// nobody remembering to write a newsletter about it. A campaign goes stale in
// three weeks; a registry does not.
//
// Every entry earns its place by answering "why would a parent want this THIS
// WEEK", never by announcing that it exists. No dashes, Justin's voice.

const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

/** What the digest knows about a family when it picks. */
export type SpotlightContext = {
  childName: string
  ageBand: AgeBand | null
  hasSchool: boolean
  scriptsDoneTotal: number
  /** True when the family is inside their school holidays right now. */
  inHolidays: boolean
}

export type Spotlight = {
  key: string
  title: string
  body: string
  cta: string
  href: string
  /** Newest first, so a feature that just shipped is what a parent hears next. */
  addedAt: string
  eligible?: (ctx: SpotlightContext) => boolean
}

const olderThan = (band: AgeBand | null, bands: string[]) => !!band && bands.includes(band)

export const SPOTLIGHTS: Spotlight[] = [
  {
    key: 'holiday-slack',
    title: 'More screen time in the holidays is not you failing',
    body: `School holidays are longer days with fewer places to be, and the screen fills some of that. It is meant to. A week where {child} has more time than term time is not a slipped rule, it is a different week, and treating it as a failure only makes you the enemy of your own plan. Loosen it on purpose, say out loud that it is on purpose, and put it back when term starts. That is a pathway, not a wobble.`,
    cta: 'See this week',
    href: `${APP}/dashboard/stats`,
    addedAt: '2026-07-30',
    eligible: ctx => ctx.inHolidays,
  },
  {
    key: 'holiday-bank',
    title: 'The screen time {child} banked is still there',
    body: `Time earned above the weekly cap does not vanish at the reset, it goes into the holiday bank and stays until school is out. That is the point of it: a term of doing the jobs turns into holiday time {child} actually earned, rather than time you gave in and handed over. It never expires, so a June week counts in August.`,
    cta: 'See the bank',
    href: `${APP}/dashboard/quests`,
    addedAt: '2026-07-30',
  },
  {
    key: 'school-curriculum',
    title: `What ${'{child}'} is actually being taught this term`,
    body: `Your school is linked, so we can tell you what is coming rather than you finding out the night before. What the year covers, what is expected at this age, and when the pressure points land. Knowing SATs are six weeks out is the difference between spotting the change in a child and being surprised by it.`,
    cta: 'See the curriculum',
    href: `${APP}/dashboard/school`,
    addedAt: '2026-07-30',
    eligible: ctx => ctx.hasSchool,
  },
  {
    key: 'passport',
    title: 'The passport is the receipt for all of it',
    body: `Every script you have used, every lesson {child} has done, every agreement you have made together. It is the one place that shows how far you have come, and it is worth opening when a hard week makes it feel like nothing has changed. It usually has.`,
    cta: 'Open the passport',
    href: `${APP}/dashboard/passport`,
    addedAt: '2026-07-30',
  },
  {
    key: 'printables',
    title: 'The fridge does work an app cannot',
    body: `A chart on the fridge is seen forty times a day by a child who never opens a phone. The printables are made for exactly that: one page, print it, stick it up, done. The routine ones are the place to start.`,
    cta: 'See the printables',
    href: `${APP}/dashboard/printables`,
    addedAt: '2026-07-30',
  },
  {
    key: 'scripts',
    title: 'The words for the moment you dread',
    body: `Two hundred and thirty three of them now, for the moments that go wrong the same way every time. Not a technique to learn, the actual sentences to say when {child} will not come off the game and you can feel your patience going.`,
    cta: 'Find your script',
    href: `${APP}/dashboard/scripts`,
    addedAt: '2026-07-30',
  },
  {
    key: 'balance',
    title: 'It is the type of screen, not the total',
    body: `An hour of building something and an hour of scrolling do very different things to a child, and a single number cannot tell them apart. The balance view splits it, so you can see what {child} is actually doing rather than only how long.`,
    cta: 'See the balance',
    href: `${APP}/dashboard/stats`,
    addedAt: '2026-07-30',
  },
  {
    key: 'lessons',
    title: `The lessons ${'{child}'} does without you`,
    body: `Short, made for their age, and they do them on their own. It is the part of this that does not need you in the room, which on some weeks is the whole point.`,
    cta: 'See the lessons',
    href: `${APP}/dashboard/lessons`,
    addedAt: '2026-07-30',
  },
  {
    key: 'digi',
    title: 'Ask DiGi the thing you have not asked anyone',
    body: `The question that feels too small to ask a teacher, or too embarrassing to put in a parents group. DiGi answers from research we have reviewed, never the open web, and it will never tell you to just take the phone away.`,
    cta: 'Ask DiGi',
    href: `${APP}/dashboard/digi`,
    addedAt: '2026-07-30',
  },
  {
    key: 'agreement',
    title: 'Write the deal down together',
    body: `A rule you both signed is a different thing from a rule you announced. When it is written down, the argument stops being you against {child} and becomes both of you against the thing you already agreed. Takes about ten minutes.`,
    cta: 'Make the agreement',
    href: `${APP}/dashboard/agreement`,
    addedAt: '2026-07-30',
    eligible: ctx => olderThan(ctx.ageBand, ['8-10', '11-13', '14-16']),
  },
  {
    key: 'shop',
    title: 'The printed things, for the ones that live on the wall',
    body: `Some of this works better on paper than on a screen, which is the joke of a digital parenting product and also true. The shop has the printed versions of the charts and kits that families keep up longest.`,
    cta: 'See the shop',
    href: `${APP}/shop`,
    addedAt: '2026-07-30',
  },
]

/**
 * The next one for this parent: newest first among the ones they have not had
 * and are eligible for.
 *
 * Returns null rather than repeating when everything has been seen. A digest
 * with no spotlight is a perfectly good digest, and showing the same card twice
 * teaches a parent to skip that part of the email forever.
 */
export function pickSpotlight(ctx: SpotlightContext, alreadyShown: Set<string>): Spotlight | null {
  const candidates = SPOTLIGHTS
    .filter(s => !alreadyShown.has(s.key))
    .filter(s => (s.eligible ? s.eligible(ctx) : true))
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  return candidates[0] ?? null
}

/** {child} filled in, so the copy reads as being about their child. */
export function renderSpotlight(s: Spotlight, childName: string): { title: string; body: string; cta: string; href: string } {
  const fill = (t: string) => t.replace(/\{child\}/g, childName)
  return { title: fill(s.title), body: fill(s.body), cta: s.cta, href: s.href }
}
