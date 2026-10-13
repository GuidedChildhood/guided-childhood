// THE SIX HEAVY LESSONS WAIT FOR A GROWN UP, BRIEFLY (sync plan C, 13 Oct 2026).
//
// Justin said yes on 13 October 2026. In school the safeguarding lead is told
// before these six are taught; at home the parent is that person, and until
// now they heard only after their child had done one, and only on a pass.
// So when a child starts one of them alone, the lesson does not open yet: the
// parent gets a short note first (a push with no title on the lock screen,
// and an email), and the lesson opens 48 hours later or the moment the parent
// taps Ready. It never stays shut, and a lesson the parent sends or opens
// themselves is already theirs, so it opens at once.
//
// No migration: the mission's `sent_at` is when it opens for the child, set
// 48 hours ahead. The note is built from the deck's own parent text
// (parent_note: taught, say_this, try_this), never from the staff dsl_note.

export const HEAVY_MODULE_IDS = new Set([
  'ks3-14-bodies-image-pressure',
  'ks3-27-when-it-turns-on-you',
  'ks4-16-consent-images-law',
  'ks4-17-sextortion',
  'ks4-18-radicalisation-misogyny',
  'ks4-29-did-not-go-looking',
])

export const HEADS_UP_HOURS = 48

export function isHeavyModule(moduleId: string | null | undefined): boolean {
  return !!moduleId && HEAVY_MODULE_IDS.has(moduleId)
}

/** When a heavy lesson started now opens for the child. */
export function headsUpOpensAt(now: number = Date.now()): string {
  return new Date(now + HEADS_UP_HOURS * 60 * 60 * 1000).toISOString()
}

/** Whether a mission is still waiting for its heads up to run out. */
export function stillWaiting(sentAt: string | null | undefined, now: number = Date.now()): boolean {
  if (!sentAt) return false
  const at = Date.parse(sentAt)
  return !Number.isNaN(at) && at > now
}

/** The weekday a waiting lesson opens, in the family's own time. */
export function opensOnDay(sentAt: string): string {
  return new Date(sentAt).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
}

type ParentNote = { taught?: unknown; say_this?: unknown; try_this?: unknown }

/**
 * The taught line is written for after a class lesson ("Today we taught your
 * child about..."); before the lesson it has to read as what it covers. These
 * are the only openings and turns the six use, and the lesson path guard runs
 * all six through this and fails on any "today", "we" or "pupil" left over.
 */
const BEFORE_THE_LESSON: [RegExp, (kid: string) => string][] = [
  [/^Today we taught your child about /, kid => `This lesson teaches ${kid} about `],
  [/^Today your child learned /, kid => `In this lesson ${kid} learns `],
  [/^Today we looked at /, () => 'This lesson looks at '],
  [/^Today we covered /, () => 'This lesson covers '],
  [/\bThey learned\b/g, () => 'They learn'],
  [/\bthey learned\b/g, () => 'they learn'],
  [/\bWe also acknowledged\b/g, () => 'It also acknowledges'],
  [/, and we pointed every pupil towards\b/g, () => ', and points every child towards'],
  [/\bWe also made sure every pupil knows\b/g, kid => `It also makes sure ${kid} knows`],
  [/\bWe taught\b/g, () => 'It teaches'],
  [/\bevery pupil\b/g, () => 'every child'],
]

/** The note's words, from the lesson's own parent text. */
export function headsUpCopy(note: unknown, kidName: string): { covers: string | null; sayThis: string | null; tryThis: string | null } {
  const n = (note && typeof note === 'object' ? note : {}) as ParentNote
  const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  const taught = text(n.taught)
  const covers = taught
    ? BEFORE_THE_LESSON.reduce((line, [from, to]) => line.replace(from, to(kidName)), taught)
    : null
  return { covers, sayThis: text(n.say_this), tryThis: text(n.try_this) }
}
