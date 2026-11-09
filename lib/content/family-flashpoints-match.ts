import type { AgeBand } from '@/lib/content/stages'
import { FAMILY_FLASHPOINTS, type Flashpoint } from './family-flashpoints'

// Which everyday flashpoint a parent's message is about, from its words.
//
// The same shape as device-issues-match.ts and for the same reason: keywords,
// no model call, because it runs on every DiGi message. DiGi's route asks the
// device bank first; this answers only when no device issue matched, so a
// message about the console at bedtime stays a device issue.

function hits(message: string, keyword: string): boolean {
  let from = 0
  for (;;) {
    const i = message.indexOf(keyword, from)
    if (i === -1) return false
    const before = i === 0 ? ' ' : message[i - 1]
    if (!/[a-z0-9]/.test(before)) return true
    from = i + 1
  }
}

/** The best matching flashpoint, or null when nothing in the message says one. */
export function inferFlashpoint(message: string, band: AgeBand | null): Flashpoint | null {
  const m = ` ${message.toLowerCase().replace(/[’']/g, "'")} `
  let best: { f: Flashpoint; score: number } | null = null
  for (const f of FAMILY_FLASHPOINTS) {
    let score = 0
    for (const k of f.keywords) if (hits(m, k)) score += k.includes(' ') ? 1.5 : 1
    if (score === 0) continue
    if (band && f.bands[0] === band) score += 0.6
    else if (band && f.bands.includes(band)) score += 0.3
    if (!best || score > best.score) best = { f, score }
  }
  return best?.f ?? null
}

/** Does a concern the family already has mean this flashpoint? Slug first, then its words. */
export function concernMeansFlashpoint(f: Flashpoint, concern: { slug: string; label: string | null }): boolean {
  if (concern.slug === f.proof.concernSlug) return true
  if ((f.proof.relatedSlugs ?? []).includes(concern.slug)) return true
  const words = ` ${(concern.label ?? '').toLowerCase()} `
  return f.keywords.some(k => k.includes(' ') && hits(words, k))
}
