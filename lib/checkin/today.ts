import type { createClient } from '@/lib/supabase/server'
import { seedBaselineConcerns } from '@/lib/concerns/baseline'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type CheckInRow = {
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  lastScore: number | null
}

export type TodayCheckIn = {
  rows: CheckInRow[]
  /** Their first ever, so the card frames itself as the starting point. */
  baseline: boolean
}

// The generic Something else catch all is a picker, not a real moment, so it
// is never a rateable check in row. Guarded by slug even if an old row exists.
const GENERIC = new Set(['something-else', 'something_else', 'other'])

/**
 * Everything the check in needs, in one place.
 *
 * ── WHY THIS IS A LIBRARY AND NOT A PAGE ────────────────────────────────────
 *
 * Justin, 13 August 2026: "check in going to wrong section both on the welcome
 * from DiGi link and the top of things to do today... check in is different
 * from moments."
 *
 * He is right and it was structural. The check in was rendered ON the daily
 * deck page, above the moments deck, and all three links to it were
 * /dashboard/daily#checkin. So every route to "check in" landed a parent on
 * the moments page and asked them to scroll, and the two things this product
 * keeps most carefully apart, a reading and a moment, shared one screen and
 * one URL.
 *
 * It has its own page now. This loader is what stops the two drifting: the
 * page reads it, and nothing else builds this list by hand.
 */
export async function getTodayCheckIn(
  supabase: SupabaseClient,
  userId: string,
): Promise<TodayCheckIn> {
  const today = new Date().toISOString().split('T')[0]

  const [{ data: profile }, { data: live }] = await Promise.all([
    supabase.from('profiles').select('first_checkin_at, onboarding_answers').eq('id', userId).maybeSingle(),
    // Live concerns flagged before today and not yet checked today.
    supabase.from('concerns')
      .select('id, slug, label, times_flagged, last_flagged_at')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      .lt('last_flagged_at', today)
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      .order('last_flagged_at', { ascending: false })
      .limit(5),
  ])

  type Row = { id: string; slug: string; label: string; times_flagged: number; last_flagged_at: string }
  const liveRows = ((live ?? []) as Row[])
    .filter(c => c.slug && !GENERIC.has(c.slug) && (c.label ?? '').trim().toLowerCase() !== 'something else')

  // The first one is the baseline, and a brand new family has nothing to check
  // in on until what they named at signup is finally recorded as concerns. The
  // flagged before today rule is deliberately not applied to a baseline: that
  // rule stops us reviewing something raised this morning, and a baseline is
  // not a review of anything.
  const neverCheckedIn = !profile?.first_checkin_at
  const seeded = neverCheckedIn && liveRows.length === 0
    ? await seedBaselineConcerns(supabase, userId, profile?.onboarding_answers)
    : []
  const baseline = seeded.length > 0
  const rows = baseline ? seeded : liveRows

  // What they said last time, so the card can show it back and the verdict can
  // name the move. A second wave by necessity: it needs the concern ids.
  const lastScoreByConcern = new Map<string, number>()
  if (rows.length > 0) {
    const { data: scores } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', rows.map(c => c.id))
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
    for (const r of (scores ?? []) as { concern_id: string; score: number | null }[]) {
      if (typeof r.score === 'number' && !lastScoreByConcern.has(r.concern_id)) {
        lastScoreByConcern.set(r.concern_id, r.score)
      }
    }
  }

  return {
    baseline,
    rows: rows.map(c => ({
      slug: c.slug,
      label: c.label,
      timesFlagged: c.times_flagged,
      lastFlaggedAt: c.last_flagged_at,
      lastScore: lastScoreByConcern.get(c.id) ?? null,
    })),
  }
}
