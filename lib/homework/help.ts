// Homework help, the rules with no database in them (25 September 2026).
//
// Justin's answers, which everything here serves:
//   "age based, as long as the child does not access the LLM version"
//   "photos yes, not kept"
// So the child side is cards, never a conversation. The homework goes in, a
// fixed shape comes out, and there is no box that lets a child talk to the
// model about anything else. Pure, so scripts/check-homework-help can run it.

/** Hints for the child themselves from this age. Under it, the button asks the grown up. */
export const HINTS_FROM_AGE = 10

/** Hints per child per day. Enough for a real evening, not enough to run all night. */
export const HINTS_PER_DAY = 12

/** Hint levels: a nudge, a bigger nudge, a worked step on a DIFFERENT example. Never the answer. */
export const MAX_HINT_LEVEL = 3

/**
 * Have a go first (23 November 2026). Hint 2 and 3 need the child's own go at
 * the "Try this" question, at least this many characters. Stanford's 2026
 * review of 52 studies found AI does better supporting the work than doing
 * it, and calls hints against answers unsettled, so the card asks for the
 * child's thinking before it gives more. Checked on the server, not only on
 * the screen.
 */
export const MIN_ATTEMPT = 3

/** The child's go at it, trimmed and capped, or '' when there is none worth the name. */
export function cleanAttempt(v: unknown): string {
  if (typeof v !== 'string') return ''
  const t = v.replace(/\s+/g, ' ').trim().slice(0, 300)
  return t.length >= MIN_ATTEMPT ? t : ''
}

/** May this hint level be given? The first always; later ones only after a go. */
export function attemptAllows(level: number, attempt: string): boolean {
  return level <= 1 || attempt.length >= MIN_ATTEMPT
}

/** Most subjects a day keeps for the parent's view. */
export const SUBJECTS_PER_DAY = 6

/**
 * The day's subjects with one more added: one or two words each, no repeats,
 * the newest last. This is all the parent sees of the homework: the subject
 * DiGi named, never the question, the photo or the child's go at it.
 */
export function mergeSubjects(list: readonly string[] | null | undefined, subject: string): string[] {
  const s = subject.replace(/[^A-Za-z ]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 2).join(' ').slice(0, 24)
  const have = (list ?? []).filter(x => typeof x === 'string' && x.trim())
  if (!s) return have.slice(-SUBJECTS_PER_DAY)
  const rest = have.filter(x => x.toLowerCase() !== s.toLowerCase())
  return [...rest, s].slice(-SUBJECTS_PER_DAY)
}

/** Whole years old on the given day, or null without a birthday. */
export function ageOn(dob: string | null | undefined, on: Date = new Date()): number | null {
  if (!dob) return null
  const b = new Date(dob)
  if (Number.isNaN(b.getTime())) return null
  let age = on.getUTCFullYear() - b.getUTCFullYear()
  const before = on.getUTCMonth() < b.getUTCMonth() || (on.getUTCMonth() === b.getUTCMonth() && on.getUTCDate() < b.getUTCDate())
  if (before) age -= 1
  return age
}

/**
 * May this child have hints on their own? The birthday decides when we have
 * one. Without it the age band does, and a band that straddles the line (8 to
 * 10) answers no: a nine year old handed the model is the mistake that
 * matters, a ten year old sent to a grown up is not.
 */
export function mayHaveHints(dob: string | null | undefined, ageBand: string | null | undefined, on: Date = new Date()): boolean {
  const age = ageOn(dob, on)
  if (age !== null) return age >= HINTS_FROM_AGE
  return ageBand === '11-13' || ageBand === '13-15' || ageBand === '16+'
}

/** A calm guide to how long homework should take at this age. Never a target. */
export function minutesGuide(age: number | null): string {
  if (age === null || age <= 7) return 'Ten minutes is plenty. Stop when it stops being fun.'
  if (age <= 10) return 'About twenty minutes is plenty at your age.'
  if (age <= 13) return 'Half an hour to an hour is normal. Take a break every twenty minutes.'
  return 'Up to an hour or two is normal now. Take a proper break every half hour.'
}

export type HintCard = {
  safe: boolean
  onTopic: boolean
  subject: string
  about: string
  teacherWants: string
  hint: string
  tryThis: string
}

const clean = (v: unknown, max = 400) =>
  typeof v === 'string' ? v.replace(/[-–—]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max) : ''

/** The model's reply, made safe to show a child: the fixed shape, no dashes, nothing extra. */
export function parseHintCard(raw: string): HintCard | null {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(match[0]) } catch { return null }
  return {
    // A missing or malformed safe flag is treated as NOT safe: the card then
    // says talk to your grown up, which is the right failure.
    safe: parsed.safe === true,
    onTopic: parsed.on_topic !== false,
    subject: clean(parsed.subject, 40),
    about: clean(parsed.about),
    teacherWants: clean(parsed.teacher_wants),
    hint: clean(parsed.hint),
    tryThis: clean(parsed.try_this),
  }
}
