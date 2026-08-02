// Five things a day, and the streak that comes from doing them.
//
// Justin: "make it 5 steps per day. 1 making sure jobs are done that parent has
// sent and outstanding. 2 any lessons to do. 3 do age related quiz. 4 when
// pressed will check if balance of jobs and device is good. 5 is add a new job
// request to parent ... once the system knows they sent a job, a big celebration
// animation and 1 streak achieved."
//
// The shape is Duolingo's Daily Quests panel, which is the proven version of
// this: three or four rows, one line each, each with its own progress, and a
// window. Not a scrolling road. Five one line rows fit a phone screen with room
// to spare, which is what makes "no need to scroll" true rather than nearly true.
//
// Two rules worth stating because they are what keep this a habit rather than a
// treadmill:
//
//   The day is CHOSEN ONCE and stored. If the five were picked fresh on every
//   render, a child could refresh a half finished day into a different one, and
//   a streak could never be proved. lib is pure; the storing happens in
//   /api/kid/day.
//
//   Step 4 is not a task. Justin's wording is exact: "when pressed will check if
//   balance of jobs and device is good." So it completes by being READ. A child
//   cannot be asked to hit a number they do not control, and scoring them on one
//   would make the balance a test they can fail rather than a mirror.

export type StepKey =
  | 'jobs'
  | 'lesson'
  | 'quiz'
  | 'balance'
  | 'ask'
  | 'reading'
  | 'homework'
  | 'printable'
  | 'move'

export type StepDef = {
  key: StepKey
  /** One line, child facing. Short enough to never wrap on a phone. */
  label: string
  /** The nudge under it, shown only until it is done. */
  hint: string
  emoji: string
  /** Where tapping goes. Null means it completes in place on this screen. */
  href: ((token: string) => string) | null
}

export const STEPS: Record<StepKey, StepDef> = {
  jobs: {
    // NOT a tick. This was ✅, which renders as a green box with a white check,
    // and a row wearing the completion signal while it is still outstanding is
    // simply lying: Justin read the board as already ticked and so would any
    // child. The done state is the only thing allowed to look done.
    key: 'jobs', emoji: '📋',
    label: 'Your jobs',
    hint: 'Tick off what your grown up sent',
    href: null,
  },
  lesson: {
    key: 'lesson', emoji: '📚',
    label: 'A lesson',
    hint: 'Learn one thing, pass it',
    href: t => `/k/${t}/lessons`,
  },
  quiz: {
    key: 'quiz', emoji: '🧠',
    label: "Today's quiz",
    hint: 'A few questions for your age',
    href: t => `/k/${t}/lessons?quiz=1`,
  },
  balance: {
    key: 'balance', emoji: '⚖️',
    label: 'Check my balance',
    hint: 'See how your jobs and screen time are going',
    href: t => `/k/${t}/balance`,
  },
  ask: {
    key: 'ask', emoji: '💡',
    label: 'Ask for a job',
    // For tomorrow, said out loud. Justin: a child already has today's jobs, so
    // an idea pitched now is one for the next day, and the row reads as a
    // duplicate of the jobs row unless it says which day it means.
    //
    // It is also the better half of the idea. Asking for tomorrow is a child
    // choosing what their own day looks like before it happens, rather than
    // adding to a list they are already partway through.
    hint: 'Pitch your own idea for tomorrow',
    href: t => `/k/${t}/suggest`,
  },
  reading: {
    // The minutes are filled in per child by readingMinutesFor, because a target
    // is only encouraging if it fits: ten is a real ask at five and a low bar at
    // thirteen. The static label is the fallback when no age band is known.
    key: 'reading', emoji: '📖',
    label: 'Ten minutes reading',
    hint: 'Away from a screen',
    href: null,
  },
  homework: {
    key: 'homework', emoji: '✏️',
    label: 'Homework done',
    hint: 'Get it out of the way',
    href: t => `/k/${t}/homework`,
  },
  printable: {
    key: 'printable', emoji: '🖍️',
    label: 'A printable',
    hint: 'Colour and do, away from the screen',
    // ?tab=print, and the anchor so the tab is on screen when it opens.
    // This was `/k/${t}`, the page the child is already on, so the row looked
    // tappable and did nothing. Printables are a tab on this same page, so the
    // link has to name the tab rather than the page.
    href: t => `/k/${t}?tab=print#kid-tabs`,
  },
  move: {
    key: 'move', emoji: '⚽',
    label: 'Move about',
    hint: 'Outside if you can, twenty minutes',
    href: null,
  },
}

// How long a read is worth asking for, by age.
//
// Justin: printables should not be an everyday thing, and the daily slot is
// better spent "encouraging 20 minute read per day, or if it's a younger child
// reading". He is right that it should not be one number. Ten minutes is a real
// stretch for a child still decoding words, and the same ten is a bar a
// confident thirteen year old clears without noticing, which teaches them the
// list does not mean what it says.
//
// The figures track the reading for pleasure evidence rather than any curriculum
// target: the point is a daily habit off a screen, not a quota. Rounded to
// numbers a child can hold in their head.
const READING_MINUTES: Record<string, number> = {
  '4-7': 10,
  '8-10': 20,
  '11-13': 20,
  '13-15': 30,
  '16+': 30,
}

/** Minutes of reading to ask this child for. Ten when the band is unknown, which
 *  is the gentlest of the five and never over asks a child we cannot place. */
export function readingMinutesFor(ageBand: string | null | undefined): number {
  return READING_MINUTES[ageBand ?? ''] ?? 10
}

/** The reading row's label for this child, so the row states its own number. */
export function readingLabelFor(ageBand: string | null | undefined): string {
  return `${readingMinutesFor(ageBand)} minutes reading`
}

// Which of today's jobs ARE moving about.
//
// Justin: the move row "needs to link to the jobs they relate to, so rather
// than just tick off needs to link to actual things".
//
// He is right, and the reason is worse than tidiness. Move sat next to a real
// job called "One hour of outside play" and asked the child to tick a second,
// separate box for the same hour outside. One of the two had to be theatre, and
// a child works out which quickly. Pointed at the real job, the row stops being
// a box to tick and starts being a pointer at something that already pays.
//
// Matched on words rather than on the templates' own play flag, because a job a
// parent wrote themselves never came from a template and "Walk the dog" has to
// count. Deliberately narrow: a false positive here marks a step done that the
// child never did, which is worse than the row simply staying a self tick.
const MOVE_WORDS = [
  'outside', 'outdoors', 'fresh air', 'park', 'garden',
  'bike', 'cycle', 'scoot', 'skate', 'run', 'running', 'jog',
  'walk', 'swim', 'dance', 'exercise', 'football', 'kickabout',
  'sport', 'training', 'climb', 'trampoline', 'play out',
]

/** Is this job the moving about one? */
export function isMoveJob(title: string): boolean {
  const t = title.toLowerCase()
  return MOVE_WORDS.some(w => t.includes(w))
}

/**
 * The three that never change, and the order they sit in.
 *
 * Jobs first because that is what a grown up is waiting on. Ask LAST because it
 * is Justin's design and it is the whole product in one row: the day ends with a
 * child offering to do something rather than with them consuming something.
 */
const FIXED_FIRST: StepKey[] = ['jobs']
const FIXED_LAST: StepKey[] = ['balance', 'ask']

/** The pool the middle two are drawn from, so the day is not identical. */
const ROTATING: StepKey[] = ['lesson', 'quiz', 'reading', 'homework', 'printable', 'move']

/**
 * A small stable hash. Same child and same date always gives the same number, so
 * the day cannot reshuffle under a child who is halfway through it, and two
 * children on the same day get different middles.
 */
function seed(childId: string, day: string): number {
  let h = 2166136261
  const s = `${childId}:${day}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * The five steps for one child on one day.
 *
 * `available` lets the caller drop what makes no sense today: no lesson left in
 * the stage, no printable sent. A step that cannot be completed must never be
 * one of the five, because a child who cannot finish the day can never earn the
 * streak and has no way of knowing why.
 */
export function pickDay(childId: string, day: string, available?: Partial<Record<StepKey, boolean>>): StepKey[] {
  const can = (k: StepKey) => available?.[k] !== false
  const pool = ROTATING.filter(can)
  const n = seed(childId, day)

  const middle: StepKey[] = []
  if (pool.length > 0) {
    // Two distinct draws, walking the pool from the seeded start so the pair
    // moves day to day rather than the same two always pairing up.
    const start = n % pool.length
    middle.push(pool[start])
    if (pool.length > 1) {
      const step = 1 + (Math.floor(n / pool.length) % (pool.length - 1))
      middle.push(pool[(start + step) % pool.length])
    }
  }

  return [...FIXED_FIRST.filter(can), ...middle, ...FIXED_LAST.filter(can)]
}

/** Did the whole day land? The streak is this and nothing else. */
export function dayComplete(steps: StepKey[], done: StepKey[]): boolean {
  return steps.length > 0 && steps.every(s => done.includes(s))
}

/** UK date string, matching every other date in the app. */
export function ukToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}
