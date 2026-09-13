import type { SupabaseClient } from '@supabase/supabase-js'
import { restingConcernIds, TOP_BAND } from './resting'
import { readScores, type ScoredEvent } from './scores'

// A child's worries, as their passport reads them.
//
// Justin, 2 September 2026, on the child's passport: "reflect positively with
// moments being rated 5 stars and rewards appearing on the child's app. Trace
// the moment the parent said phones in the car were a problem: as the star
// went to 5 stars, so great, you scored a stamp in your passport."
//
// The parent's side already knows all of this. The check in scores a worry
// out of ten in five bands, lib/concerns/resting decides when the top band
// has put it to rest, and the what is working page says so. None of it
// reached the child. This is the one reading both the sticker book and the
// wins queue use, so the stamp the child sees and the rest the parent sees
// are the same fact.
//
// SORTED means the parent said so. A worry is sorted when it is resolved
// (two top band check ins in a row) or resting (the last score was the top
// band and nothing has raised it since). Both are the parent's own words,
// never a number we made up.
//
// STARS, NOT SCORES. The child sees the same five stars the parent tapped,
// so "3 of 5 stars" on a locked stamp is exactly the band the parent chose,
// never the 1 to 10 column underneath.

export type ChildWorry = {
  id: string
  label: string
  slug: string
  /** The parent's last answer as stars out of five, 0 before the first check in. */
  stars: number
  /** Sorted: the parent has given it five stars and it has stayed there. */
  sorted: boolean
  /** When the score that sorted it was given, for ordering the stamps. */
  sortedAt: string | null
  /**
   * The parent's FIRST answer, as stars, 0 before any. With `stars` this is
   * the movement: "went from 2 to 5 stars". Justin, 13 September 2026: the
   * passport must show "clearly how child behaviour improved", and the only
   * honest way to say improved is to print where it started.
   */
  firstStars: number
}

/** A 1 to 10 score as the five star band the parent tapped. */
export function starsFor(score: number | null | undefined): number {
  if (typeof score !== 'number' || !Number.isFinite(score)) return 0
  return Math.ceil(Math.min(10, Math.max(1, score)) / 2)
}

/**
 * Every worry the parent has raised for this child, with where it stands.
 *
 * Fails soft to an empty list: a passport that cannot read the worries shows
 * no sorted page at all rather than a wrong one.
 */
export async function childWorries(
  supabase: SupabaseClient,
  userId: string,
  childId: string,
): Promise<ChildWorry[]> {
  try {
    const { data: rows, error } = await supabase
      .from('concerns')
      .select('id, slug, label, status, last_flagged_at, created_at')
      .eq('user_id', userId)
      .eq('child_id', childId)
      .in('status', ['open', 'improving', 'resolved'])
      .order('created_at', { ascending: true })
    if (error || !rows || rows.length === 0) return []

    const ids = rows.map(r => String(r.id))
    const { data: events } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', ids)
      .not('score', 'is', null)
      .order('created_at', { ascending: false })

    // Every reading a rule here needs, from one pass. lib/concerns/scores
    // exists because six places were building these maps by hand and the rule
    // that reads them now needs the RUN of good scores, not just the last one.
    const read = readScores((events ?? []) as ScoredEvent[], TOP_BAND)
    const lastScore = read.last
    // Events arrive newest first, so the last one seen per concern is the
    // earliest scored, the baseline the check in framed as the starting point.
    const firstScore = new Map<string, number>()
    for (const e of (events ?? []) as ScoredEvent[]) {
      if (typeof e.score === 'number') firstScore.set(String(e.concern_id), e.score)
    }

    const resting = restingConcernIds(
      rows.map(r => ({ id: String(r.id), last_flagged_at: String(r.last_flagged_at ?? r.created_at) })),
      read.topRun,
      read.lastAt,
    )

    return rows.map(r => {
      const id = String(r.id)
      const score = lastScore.get(id)
      const resolved = r.status === 'resolved'
      const sorted = resolved || resting.has(id)
      return {
        id,
        label: String(r.label ?? r.slug ?? 'A worry'),
        slug: String(r.slug ?? ''),
        stars: sorted && typeof score !== 'number' ? 5 : starsFor(score),
        sorted,
        sortedAt: sorted ? (read.lastAt.get(id) ?? String(r.last_flagged_at ?? r.created_at)) : null,
        firstStars: starsFor(firstScore.get(id)),
      }
    })
  } catch {
    return []
  }
}

/** True when a score is the top band, the same test the check in uses. */
export function isTopBand(score: number | null | undefined): boolean {
  return typeof score === 'number' && score >= TOP_BAND
}

// ── THE BEHAVIOUR LINE ──────────────────────────────────────────────────────
//
// One sentence for the parent's passport page, in the parent's own stars,
// never a number we made up. It names the worry that has moved the most, and
// only when it has genuinely moved up: a worry that started at five and stayed
// there is sorted, not improved, and a worry that went down is not this line's
// business (the check in and DiGi handle that, gently).
//
// Never for the child's book. This is an adult's note about them.
export type ImprovedLine = { label: string; from: number; to: number; sortedCount: number }

export function improvedLine(worries: ChildWorry[]): ImprovedLine | null {
  const sortedCount = worries.filter(w => w.sorted).length
  const moved = worries
    .filter(w => w.firstStars > 0 && w.stars > w.firstStars)
    .sort((a, b) => (b.stars - b.firstStars) - (a.stars - a.firstStars))
  const best = moved[0]
  if (!best) return null
  return { label: best.label, from: best.firstStars, to: best.stars, sortedCount }
}

export function improvedSentence(line: ImprovedLine): string {
  const star = (n: number) => `${n} star${n === 1 ? '' : 's'}`
  return `${line.label} went from ${star(line.from)} to ${star(line.to)}.`
}
