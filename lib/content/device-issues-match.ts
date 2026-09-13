import type { AgeBand } from '@/lib/content/stages'
import { DEVICE_ISSUES, issuesForBand, type DeviceIssue } from './device-issues'

// Which issue a parent's message is in, cheaply, from its words.
//
// Keywords only, no model call, because this runs on every DiGi message and a
// wrong issue costs one context block the prompt already tells DiGi to ignore
// when it does not fit. The child's band breaks ties: the same words from a
// parent of a five year old and a parent of a fourteen year old are different
// issues, and the bank ranks them differently at each age.

function hits(message: string, keyword: string): boolean {
  const i = message.indexOf(keyword)
  if (i === -1) return false
  const before = i === 0 ? ' ' : message[i - 1]
  // A keyword starts on a word boundary; it may end mid word so that
  // "negotiat" matches negotiating and "compar" matches comparing.
  return !/[a-z0-9]/.test(before)
}

export type IssueMatch = { issue: DeviceIssue; score: number }

/**
 * The best matching issue, or null when nothing in the message says one.
 *
 * Score: one per keyword hit, plus a bonus for the child's band (larger the
 * higher the issue ranks at that age), so a message that names two issues
 * lands on the one their child's age actually brings.
 */
export function inferIssue(message: string, band: AgeBand | null): DeviceIssue | null {
  const m = ` ${message.toLowerCase()} `
  const ranked = band ? issuesForBand(band) : []
  const rank = new Map(ranked.map((i, idx) => [i.key, idx]))
  let best: IssueMatch | null = null
  for (const issue of DEVICE_ISSUES) {
    let score = 0
    for (const k of issue.keywords) if (hits(m, k)) score++
    if (score === 0) continue
    if (rank.has(issue.key)) score += 2 - Math.min(1.5, (rank.get(issue.key) ?? 0) * 0.1)
    if (!best || score > best.score) best = { issue, score }
  }
  return best?.issue ?? null
}
