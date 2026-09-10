import type { ChecklistSection } from '@/components/pathway/PassportStamps'

// The passport's TO DO, in two halves: what is open for the parent, and the
// part of it the CHILD can actually do.
//
// Justin: "maybe a button over passport a TO DO but not time critical, maybe we
// could have a check each month and send / provide child's app with anything
// they need to do to keep passport on track".
//
// Two ideas in one sentence and both are right.
//
// THE FIRST is that the passport already knows what is outstanding and only
// says so one page at a time. A parent has to open the book, flip to their
// child's page and read five rows to learn there are three things left. That is
// fine as a checklist and useless as a prompt, so the same reading is lifted to
// a line above the book that can be glanced at.
//
// THE SECOND is the harder one and the more valuable. NOT TIME CRITICAL is the
// operative phrase. Everything else in this product that chases anybody is tied
// to a day: a job at job time, a school reminder the evening before, a timer
// that runs out. The passport is the opposite kind of thing. It is the five
// year arc, it moves in months, and a family can drift away from it for weeks
// without a single screen going amber. So it gets the slowest cadence we have,
// once a month, and it gets a voice that matches: here is what is left, there
// is no rush.
//
// WHY THE CHILD GETS THEIR OWN LIST rather than a copy of the parent's. Three
// of the five rows are a grown up's work, and no child can do anything about a
// device setup guide, a moment to resolve or a week of screen time nobody
// logged. Sending a child a list with three impossible items on it teaches them
// the list is not for them, which is exactly how a notification becomes noise.
// So the child's list is filtered down to the two things that are genuinely
// theirs, plus the stage check when it is open, and it is written in their
// words rather than the parent's.

/** One open row of the parent's passport page, ready to render as a to do. */
export type ParentToDo = {
  key: string
  emoji: string
  label: string
  detail: string
  href: string
  help: string
  /** Kept up across the stage rather than ticked off. Jobs and screen balance. */
  ongoing: boolean
}

/**
 * The open rows of a stage, in the order the passport prints them.
 *
 * Anything at 100 is done and is left out. Nothing is invented here: this is
 * the same five row reading the book already renders, filtered.
 */
export function parentPassportToDo(sections: ChecklistSection[]): ParentToDo[] {
  return sections
    .filter(s => s.pct < 100)
    .map(s => ({
      key: s.key, emoji: s.emoji, label: s.label, detail: s.detail,
      href: s.href, help: s.help, ongoing: s.ongoing ?? false,
    }))
}

/** One thing the child themself can do to keep the passport moving. */
export type ChildToDo = {
  key: 'lessons' | 'jobs' | 'check'
  emoji: string
  /** In the child's words, lower case, so the lines join into one sentence. */
  line: string
}

export type ChildToDoInput = {
  /** This stage's lessons, as the passport counts them. */
  lessonsDone: number
  lessonsTotal: number
  /** Today's routine jobs: on track, some still to do, or none set at all. */
  jobsStatus: 'on_track' | 'pending' | 'none'
  /** The end of stage check is in reach (the stage is nearly finished). */
  checkOffered: boolean
  /** They have already passed it. */
  checkPassed: boolean
}

/**
 * What is left for the CHILD, from the passport rows that are theirs to move.
 *
 * Deliberately short. A child's list that runs past three items stops being a
 * list and becomes a chore, and there are only ever three things here that a
 * child can act on without a grown up doing something first.
 */
export function childPassportToDo(input: ChildToDoInput): ChildToDo[] {
  const out: ChildToDo[] = []

  const lessonsLeft = Math.max(0, input.lessonsTotal - input.lessonsDone)
  if (lessonsLeft > 0) {
    out.push({
      key: 'lessons', emoji: '📚',
      line: lessonsLeft === 1
        ? 'one lesson to watch with a grown up'
        : `${lessonsLeft} lessons to watch with a grown up`,
    })
  }

  // Only when jobs are SET and outstanding. A board with nothing on it is a
  // grown up's job to fill, and telling a child to do jobs that do not exist
  // is the fastest way to teach them we are not really looking.
  if (input.jobsStatus === 'pending') {
    out.push({ key: 'jobs', emoji: '⭐', line: 'your jobs ticked off this week' })
  }

  if (input.checkOffered && !input.checkPassed) {
    out.push({ key: 'check', emoji: '🛂', line: 'your stage check, whenever you are ready' })
  }

  return out
}

/** "one lesson, your jobs and your stage check", in plain English. */
function joinLines(items: ChildToDo[]): string {
  const lines = items.map(i => i.line)
  if (lines.length === 1) return lines[0]
  if (lines.length === 2) return `${lines[0]} and ${lines[1]}`
  return `${lines.slice(0, -1).join(', ')} and ${lines[lines.length - 1]}`
}

/**
 * The one message the child's app carries, or null when there is nothing.
 *
 * ONE message, however many items, the same restraint the job reminders keep.
 * And it says out loud that it is not urgent, because a child who has learned
 * that every notification means hurry up will read this one the same way.
 */
export function childToDoMessage(items: ChildToDo[]): string | null {
  if (items.length === 0) return null
  return `Your passport this month: ${joinLines(items)}. No rush 🛂`
}

/** The push title. Their name when we have it, since it is their passport. */
export function childToDoTitle(childName: string | null): string {
  return childName ? `${childName}, your passport 🛂` : 'Your passport 🛂'
}

// ── EACH STEP, BROKEN DOWN, EVERY VISIT ─────────────────────────────────────
//
// Justin, 10 September 2026: "can we make this steps and easy to run through
// really intuitive, easy for parent to drive it, and send reminder if needed to
// Alma or verbally if no app, and let them know each day or when visited what to
// do to catch up on progress, and while moments is greyed it needs to have each
// step needed to complete passport stage broken down each time they visit."
//
// The list said WHAT was open. It never said what to DO. "Moments to resolve,
// 2 to resolve" is a reading, and a parent standing in their kitchen with four
// minutes wants an instruction. So every row now carries the next physical
// action in a verb phrase, and it is the same phrase every visit, because a
// step that rewords itself is a step a parent has to re-read.

/** The next actual thing to do, per row. Always a verb, always one action. */
const ACTION: Record<string, string> = {
  devices: 'Add the screens that are in your house, then work through one guide.',
  moments: 'Open the oldest one, use the words it gives you, mark it resolved.',
  lessons: 'Watch the next lesson together, then let them take its check.',
  jobs: 'Set two or three jobs, and tick tonight off when they are done.',
  balance: 'Start the timer once this week so the balance has something to read.',
}

/**
 * The line to SAY OUT LOUD, for a family whose child has no app.
 *
 * ── WHY THIS EXISTS ────────────────────────────────────────────────────────
 *
 * Every prompt in this product assumes a child with a phone. A family without
 * one got the parent's half and nothing else, so the child's part of the
 * passport simply did not happen, and the product quietly became worse for the
 * families keeping their child off a device the longest. Those are the families
 * most aligned with what we believe.
 *
 * A sentence a parent can read off the screen and say at the table does the
 * same job as a notification and costs nothing. It is in the child's second
 * person, short enough to say without rehearsing, and it asks rather than
 * instructs, because the whole product is with them rather than at them.
 */
const SPOKEN: Record<string, string> = {
  lessons: 'Shall we do the next lesson together after tea? It is about ten minutes.',
  jobs: 'Which two jobs do you want on your list this week? You pick them.',
  check: 'There is a little check at the end of this stage whenever you fancy it. No rush.',
}

/** The next action for a row, or a safe general one. */
export function actionFor(key: string): string {
  return ACTION[key] ?? 'Open it and take the next step.'
}

/** Something a parent can say out loud, when there is no app to send to. */
export function spokenFor(key: string): string | null {
  return SPOKEN[key] ?? null
}

/**
 * What changed since the parent last looked, in one line.
 *
 * Justin asked for "what to do to catch up on progress" on every visit. The
 * honest version of that is not a nag: it is the count, the one thing to start
 * with, and silence when there is genuinely nothing.
 */
export function catchUpLine(open: ParentToDo[], stageName: string): string {
  if (open.length === 0) return `Nothing open on ${stageName}. This page is ready to stamp.`
  const first = open[0]
  return open.length === 1
    ? `One thing left on ${stageName}. Start with ${first.label.toLowerCase()}.`
    : `${open.length} things left on ${stageName}. Start with ${first.label.toLowerCase()}.`
}
