// THE SCRIPT REMINDER RULES, pure so they are tested (nudge.test.ts).
//
// Justin chose two a week (18 November 2026). The research behind the shape
// (plans/2026-11-18-scripts-system.md): prompts that come too often stop
// working within two to four weeks (HeartSteps), so the default is to send
// nothing, the cap is hard, and the words rotate rather than repeat.

export const NUDGES_PER_WEEK = 2
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const MIN_GAP_MS = 20 * 60 * 60 * 1000

/** May another script reminder go out now? At most two in seven days, never two within 20 hours. */
export function nudgeAllowed(sentAt: (string | Date)[], now: Date = new Date()): boolean {
  const times = sentAt.map(t => new Date(t).getTime()).filter(t => Number.isFinite(t))
  const inWeek = times.filter(t => now.getTime() - t < WEEK_MS)
  if (inWeek.length >= NUDGES_PER_WEEK) return false
  return !times.some(t => now.getTime() - t < MIN_GAP_MS)
}

export type Candidate = { sort_order: number; say: string }
export type PastNudge = { script_sort_order: number; sent_at: string; worked: string | null }

/**
 * Which script to send. A pinned one first (the parent chose it), never one
 * they said did not land, and the one sent longest ago (or never) before a
 * recent one, so the words rotate.
 */
export function pickScript(candidates: Candidate[], pins: number[], past: PastNudge[]): Candidate | null {
  const notThis = new Set(past.filter(p => p.worked === 'not_this_time').map(p => p.script_sort_order))
  const lastSent = new Map<number, number>()
  for (const p of past) {
    const t = new Date(p.sent_at).getTime()
    if (t > (lastSent.get(p.script_sort_order) ?? 0)) lastSent.set(p.script_sort_order, t)
  }
  const usable = candidates.filter(c => c.say && !notThis.has(c.sort_order))
  if (usable.length === 0) return null
  return [...usable].sort((a, b) => {
    const pa = pins.includes(a.sort_order) ? 0 : 1
    const pb = pins.includes(b.sort_order) ? 0 : 1
    if (pa !== pb) return pa - pb
    return (lastSent.get(a.sort_order) ?? 0) - (lastSent.get(b.sort_order) ?? 0)
  })[0]
}

/** A say line short enough for a notification, cut at a word. */
export function pushLine(say: string, max = 140): string {
  const clean = say.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`
}
