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
  | 'maths'
  | 'tidy'
  | 'make'
  | 'kind'
  | 'talk'
  | 'grownup_break'

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
    // Straight into the next lesson they have NOT passed, not the shelf.
    //
    // This used to land on the list, which asks a child to pick, and the list
    // opens on lesson one every time. A child who has passed four of them has
    // to find where they got to before they can start, and the row that said
    // "a lesson" turns into a search. ?next=1 lets the page resolve which one
    // that is, because only the server knows what has been passed.
    href: t => `/k/${t}/lessons?next=1`,
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
    // Justin: "read a book tell your parent". The telling is the half that makes
    // it stick, and it is the half a grown up actually hears about. A child who
    // has to say what happened has to have followed what happened.
    hint: 'Then tell your grown up what happened',
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
    // Justin: "exercise played football with daddy". With somebody, when there is
    // somebody, because that is the version a child remembers. Outside is the
    // ideal and never the requirement: not every family has an outside.
    hint: 'Twenty minutes, outside if you can, better with someone',
    href: null,
  },

  // ── The offline rows ──────────────────────────────────────────────────────
  //
  // Justin's list, near enough word for word: "read a book tell your parent also
  // the maths, tidy my room, raise a quest with parents, exercise played football
  // with daddy, asked parent to have a 30 min break from phone, anything we can
  // add that is a brilliant offline benefit".
  //
  // Two of his were already here (reading, move) and one already is the last row
  // of every day (ask). These are the rest, plus the ones that clear the same bar:
  // nothing to buy, nothing to install, no screen, and a person at the other end
  // of it wherever a person can be.
  //
  // All self ticked, like reading and move. A child ticking their own tidy room is
  // trusted the same way they are trusted with their own twenty minutes outside,
  // and the alternative is a grown up approval queue for making a bed.

  maths: {
    key: 'maths', emoji: '🔢',
    label: 'Ten minutes of numbers',
    // Deliberately not "maths homework", which a child either has or does not.
    // Times tables in the car and counting change both count, so the row works at
    // five and at thirteen without needing its own age ladder.
    hint: 'Times tables, out loud or on paper',
    href: null,
  },
  tidy: {
    key: 'tidy', emoji: '🧺',
    label: 'Tidy your room',
    hint: 'Floor clear, bed done',
    href: null,
  },
  make: {
    key: 'make', emoji: '✂️',
    label: 'Make something',
    hint: 'Draw, build, bake. Anything with your hands',
    href: null,
  },
  kind: {
    key: 'kind', emoji: '💛',
    label: 'Something kind',
    // The only row that is about somebody else. It costs nothing, it is noticed,
    // and it is the one a family tells other families about.
    hint: 'One kind thing for someone in your house',
    href: null,
  },
  talk: {
    key: 'talk', emoji: '💬',
    label: 'Best and worst bit',
    // Two minutes, both ways. The daily check in is the most protective habit in
    // the whole product and the cheapest thing on this list: a child who is used
    // to telling a grown up about an ordinary day is a child who tells them about
    // the day that is not ordinary.
    hint: 'Ask your grown up about their day, then tell them yours',
    href: null,
  },
  grownup_break: {
    key: 'grownup_break', emoji: '📵',
    label: 'Screen break together',
    // Justin's, and it is the mission in one row. A product that asks children to
    // manage their screens and never once asks the adult holding one is only half
    // honest. The child is allowed to be the one who asks.
    hint: 'Ask your grown up for 30 minutes with phones down',
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

/**
 * The pool the middle two are drawn from, so the day is not identical.
 *
 * Twelve rows, two drawn a day, so a given row comes round about once a week and
 * a child never gets the same middle twice running. Small enough that every row
 * still feels like part of a known list rather than a random generator, which is
 * what a child has to trust for the streak to mean anything.
 *
 * Weighted by nothing. The seeded draw in pickDay walks the pool evenly, so the
 * screen break row is as likely as the maths row, which is the correct
 * relationship between those two things.
 */
const ROTATING: StepKey[] = [
  'lesson', 'quiz', 'reading', 'homework', 'printable', 'move',
  'maths', 'tidy', 'make', 'kind', 'talk', 'grownup_break',
]

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
