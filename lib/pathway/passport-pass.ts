// What a PASS on a passport page is, said the same way on every page.
//
// Justin, 13 September 2026: the pages must "make complete sense of what is
// being achieved" and each page must be "linked how to achieve a pass", for a
// family "jumping in at any age, easily catch up able".
//
// ── THE GAP THIS CLOSES ─────────────────────────────────────────────────────
//
// A stage page drew five slots (devices, moments, lessons, jobs, balance) and
// the words "To stamp this page" above them. Those five are the WORK of the
// stage and they are not what stamps it. lib/pathway/stamped.ts is the rule:
// every lesson for the stage passed, every script for it read, and the child's
// own end of stage check passed. Scripts and the check are not among the five,
// so a page could read full in every slot and stay unstamped, and the only
// sentence that admitted it was a fallback line after all five went green.
//
// So every page now carries the rule itself, in three rows, with the count and
// the link for each. Nothing here is a new rule: it is the one in stamped.ts,
// printed where a parent can read it.
//
// ── WHAT CATCHING UP MEANS, IN WORDS ────────────────────────────────────────
//
// Moments, jobs and balance are readings about TODAY, so they belong to the
// page the child is on now and say Later everywhere else. That is right and it
// left a family who joined at twelve reading two earlier pages of "Later" with
// no idea what those pages actually asked of them. The answer is short:
// catching up a page is its lessons, its scripts and its check. The habits are
// being kept up on the page they are on now, and they are never asked for
// twice. This file says so on every page that is behind.

import type { Stamp } from '@/components/pathway/PassportStamps'

/** The age each page opens at. Stage 5 has no exit, so it opens at 16 and stays open. */
export const OPENS_AT: Record<number, number> = { 1: 4, 2: 8, 3: 11, 4: 13, 5: 16 }

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

export type PassPart = {
  key: 'lessons' | 'scripts' | 'check'
  label: string
  /** "3 of 7", "Passed", "Not yet". */
  count: string
  done: boolean
  /** Where a parent goes to move it. */
  href: string
  /** 0 to 100, for the bar. */
  pct: number
}

/**
 * The three parts of a pass, from the stamp's own numbers.
 *
 * The check row links to the parent side check page, which takes ?stage= for
 * any page the child has reached (an earlier page for catch up, never one
 * ahead: the API enforces stage <= theirs). So a family joining at twelve can
 * sit the Foundation check from the Foundation page, which is the whole of
 * "catch up able".
 */
export function passParts(stamp: Stamp, opts: { childParam?: string | null } = {}): PassPart[] {
  const q = opts.childParam ? `&child=${encodeURIComponent(opts.childParam)}` : ''
  const slug = STAGE_SLUGS[stamp.id - 1] ?? 'foundation'
  const lt = stamp.lessonsTotal ?? 0
  const ld = Math.min(lt, stamp.lessonsDone ?? 0)
  const st = stamp.scriptsTotal ?? 0
  const sd = Math.min(st, stamp.scriptsDone ?? 0)
  const lessonsDone = lt > 0 && ld >= lt
  const scriptsDone = st > 0 ? sd >= st : (stamp.scriptsPct ?? 0) >= 100
  const checkPassed = !!stamp.checkPassed
  return [
    {
      key: 'lessons', label: 'Every lesson',
      count: lt > 0 ? `${ld} of ${lt}` : 'None yet',
      done: lessonsDone,
      href: `/dashboard/lessons?stage=${stamp.id}${q}`,
      pct: lt > 0 ? Math.round((ld / lt) * 100) : 0,
    },
    {
      key: 'scripts', label: 'Every script',
      count: st > 0 ? `${sd} of ${st}` : scriptsDone ? 'Done' : `${stamp.scriptsPct ?? 0}%`,
      done: scriptsDone,
      href: `/dashboard/scripts/next?stage=${slug}${q}`,
      pct: st > 0 ? Math.round((sd / st) * 100) : Math.min(100, stamp.scriptsPct ?? 0),
    },
    {
      key: 'check', label: 'The stage check',
      count: checkPassed ? 'Passed' : 'Not yet',
      done: checkPassed,
      href: `/dashboard/pathway/check?stage=${stamp.id}${q}&from=passport`,
      pct: checkPassed ? 100 : 0,
    },
  ]
}

/**
 * The one sentence under the heading, per page status, in Justin's voice.
 *
 * Never a deadline: nothing in this product expires, so an ahead page says
 * when it opens and a page behind says it stays open.
 */
export function passLine(
  stamp: Stamp,
  parts: PassPart[],
  opts: { childName?: string | null; catchupLine?: string | null } = {},
): string {
  const them = opts.childName && opts.childName !== 'your child' ? opts.childName : 'your child'
  const left = parts.filter(p => !p.done)
  if (stamp.status === 'earned') {
    return `Passed. Every lesson, every script and the check, on the record for good.`
  }
  if (stamp.status === 'upcoming') {
    const at = OPENS_AT[stamp.id] ?? 16
    return `Opens when ${them} turns ${at}. Nothing to do on it until then. Have a look at what it builds.`
  }
  if (stamp.status === 'catchup') {
    const pace = opts.catchupLine ? ` ${opts.catchupLine}.` : ''
    if (left.length === 0) return `All three done. The stamp lands the moment the book next checks.`
    return `Catching this page up is ${sayLeft(left)}. The jobs and screen balance are kept up on the page ${them} is on now, never twice.${pace}`
  }
  // current
  if (left.length === 0) return `All three done. The stamp lands the moment the book next checks.`
  if (left.length === 1 && left[0].key === 'check') {
    return `Every lesson and script done. The stage check is the last thing between this page and its stamp.`
  }
  return `A pass is ${sayLeft(left)}. Then the page is stamped and the next one opens.`
}

function sayLeft(left: PassPart[]): string {
  const words = left.map(p => p.key === 'check' ? 'the stage check' : p.key === 'lessons' ? 'the lessons' : 'the scripts')
  if (words.length === 1) return words[0]
  if (words.length === 2) return `${words[0]} and ${words[1]}`
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
}
