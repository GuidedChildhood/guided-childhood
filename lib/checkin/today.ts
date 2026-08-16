import type { createClient } from '@/lib/supabase/server'
import { seedBaselineConcerns } from '@/lib/concerns/baseline'
import { restingConcernIds } from '@/lib/concerns/resting'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type CheckInRow = {
  /**
   * The concern's own id, and it is what the save posts.
   *
   * Slug alone stopped being unique on 15 August 2026. Concerns went per child
   * with migration 194, and seedChildBaseline gives every new child the SAME
   * four common worries, so a two child family has two rows with slug
   * 'phone-handover-fight'. /api/daily/concern-check looked its concern up by
   * (user_id, slug) with maybeSingle, which returns an ERROR on two rows, so
   * the route would have 404ed and, before the same day's fix, the card would
   * have gone green over nothing and the rung would never have ticked.
   *
   * It had not fired yet only because the one two child account on the product
   * predates the seeding. It would have fired for every family who used the new
   * "add your other children" setup step.
   */
  id: string
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  lastScore: number | null
  /** Whose worry this is. concerns.child_id has always been set; nothing read it. */
  childId: string | null
  childName: string | null
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

  const [{ data: profile }, { data: live }, { data: kids }] = await Promise.all([
    supabase.from('profiles').select('first_checkin_at, onboarding_answers').eq('id', userId).maybeSingle(),
    // Live concerns flagged before today and not yet checked today.
    //
    // child_id joined the select on 14 August 2026. It has been on this table
    // since the beginning and every one of the 27 rows on the live account has
    // it set, but nothing had ever read it, so the check in could not say whose
    // worry it was asking about. In a one child family that is invisible. In a
    // two child family the parent is rating "Sibling fighting" and "Gaming
    // concerns" in one undifferentiated list with no idea which child each
    // belongs to, and the numbers land against a child they never chose.
    //
    // The limit is raised because the "going great" filter below removes rows
    // AFTER the query, and a limit of 5 applied first would quietly return two.
    supabase.from('concerns')
      .select('id, slug, label, times_flagged, last_flagged_at, child_id')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      .lt('last_flagged_at', today)
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      .order('last_flagged_at', { ascending: false })
      .limit(20),
    supabase.from('children').select('id, name').eq('parent_id', userId),
  ])

  type Row = { id: string; slug: string; label: string; times_flagged: number; last_flagged_at: string; child_id: string | null }
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
  const lastScoreAtByConcern = new Map<string, string>()
  if (rows.length > 0) {
    const { data: scores } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', rows.map(c => c.id))
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
    for (const r of (scores ?? []) as { concern_id: string; score: number | null; created_at: string }[]) {
      if (typeof r.score === 'number' && !lastScoreByConcern.has(r.concern_id)) {
        lastScoreByConcern.set(r.concern_id, r.score)
        lastScoreAtByConcern.set(r.concern_id, r.created_at)
      }
    }
  }

  // ── GOING GREAT MEANS WE STOP ASKING ────────────────────────────────────────
  //
  // Justin, 14 August 2026: "if doing great we can stop asking at check in
  // unless they raise another moment then we add to check in or any issue
  // raised in digi we can add to check in."
  //
  // This is the rule that keeps the check in short enough to be done. A family
  // who has sorted bedtime was asked about bedtime every week for ever, so the
  // list only ever grew, and a list that only grows is a list that stops being
  // filled in. Worse, it taught the parent that saying "going great" achieves
  // nothing.
  //
  // The rule itself lives in lib/concerns/resting.ts because the moments deck
  // applies exactly the same judgement: a worry the parent has just called
  // sorted must not still be shaping what today's card coaches them through.
  // Two copies of this would drift, and the day they drifted the check in would
  // be congratulating a family on something the deck was still worrying about.
  const resting = restingConcernIds(rows, lastScoreByConcern, lastScoreAtByConcern)

  const nameById = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))
  const asked = rows.filter(c => !resting.has(c.id)).slice(0, 5)

  return {
    baseline,
    rows: asked.map(c => {
      const name = c.child_id ? nameById.get(c.child_id) ?? null : null
      return {
        id: c.id,
        slug: c.slug,
        label: c.label,
        timesFlagged: c.times_flagged,
        lastFlaggedAt: c.last_flagged_at,
        lastScore: lastScoreByConcern.get(c.id) ?? null,
        childId: c.child_id ?? null,
        childName: name && name !== 'Your child' ? name : null,
      }
    }),
  }
}
