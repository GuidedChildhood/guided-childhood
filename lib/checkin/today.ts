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
  /**
   * ONE CHILD AT A TIME, and who is left after this one.
   *
   * Justin, 18 August 2026: "maybe there is a better way and the parent runs
   * through one child first then says done, on to next child? Would that be
   * easy to code and work smoother?"
   *
   * It is both, and it is the shape the rest of the app already has. A flat
   * list of every child's worries is a wall: eight rows on a phone, each one
   * needing the parent to check a name before they can answer, and no point at
   * which anything is finished. Four rows twice is two short jobs, and the
   * switcher in the layout already means "which child" everywhere else, so this
   * is the odd one out rather than the special case.
   *
   * `queue` is every child who still has something to answer today, in the same
   * primary first order as the pills, so the page can say "Olgie is done, now
   * Teo" and know when there is genuinely nobody left.
   */
  queue: { id: string; name: string | null; outstanding: number }[]
  /** The child these rows belong to. Null only when the family has none. */
  childId: string | null
  childName: string | null
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
  /** Which child to ask about. Falls back to the first with anything left. */
  childIdParam?: string | null,
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
      // NOT filtered to "flagged before today" here any more. See the note by
      // neverCheckedIn below: that rule is a REVIEW rule, and it silently
      // deleted the baseline for every family on the day they signed up.
      
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      .order('last_flagged_at', { ascending: false })
      .limit(20),
    // Ordered the same way the switcher pills are, so "the first child" means
    // the same thing on both and the queue below reads in the order a parent
    // sees along the top of the page.
    supabase.from('children').select('id, name, is_primary').eq('parent_id', userId)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }),
  ])

  type Row = { id: string; slug: string; label: string; times_flagged: number; last_flagged_at: string; child_id: string | null }
  const liveRows = ((live ?? []) as Row[])
    .filter(c => c.slug && !GENERIC.has(c.slug) && (c.label ?? '').trim().toLowerCase() !== 'something else')

  // ── THE REVIEW RULE MUST NOT EAT THE BASELINE ────────────────────────────
  //
  // Justin, 16 August 2026, still on "All done for today" after the worries
  // finally existed: "please fix the check in from this first page as keeps
  // saying done."
  //
  // The query used to filter .lt('last_flagged_at', today), and that rule is
  // correct for a REVIEW: do not ask a parent how last night went about
  // something they flagged twenty minutes ago. It is wrong for a BASELINE,
  // which is not a review of anything, and this file already said so in as many
  // words a few lines down while only applying it to freshly seeded rows.
  //
  // So a family whose worries were created today, whether by onboarding, by the
  // seeding, or by naming three things in their first ten minutes, had every row
  // filtered out and met an empty check in on the one day they were willing to
  // try it. Same empty page, third distinct cause: first no mapping, then a
  // check constraint rejecting the insert, now the rows existing and being
  // filtered away.
  //
  // The filter moves to where it belongs: applied only once there is a first
  // check in to review against.
  const neverCheckedIn = !profile?.first_checkin_at
  const cutoff = neverCheckedIn ? null : today
  const liveRowsFiltered = cutoff
    ? liveRows.filter(c => String(c.last_flagged_at) < cutoff)
    : liveRows
  const seeded = neverCheckedIn && liveRowsFiltered.length === 0
    ? await seedBaselineConcerns(supabase, userId, profile?.onboarding_answers)
    : []
  const baseline = seeded.length > 0
  const rows = baseline ? seeded : liveRowsFiltered

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
  const answerable = rows.filter(c => !resting.has(c.id))

  // ── WHO STILL HAS SOMETHING TO ANSWER ────────────────────────────────────
  //
  // Built before the slice, deliberately. The five row cap is a limit on how
  // much is asked at once, not a statement about who is finished, and counting
  // after it would tell a parent a child was done when they had six worries.
  //
  // A concern with no child_id belongs to the household. It rides with the
  // FIRST child rather than making a queue entry of its own, because "Family"
  // is not a person to check in about and a parent would read it as a third
  // child they do not have.
  const queue = ((kids ?? []) as { id: string; name: string | null }[])
    .map(k => ({
      id: k.id,
      name: k.name && k.name !== 'Your child' ? k.name : null,
      outstanding: answerable.filter(c => c.child_id === k.id).length,
    }))
    .filter(k => k.outstanding > 0)

  const orphans = answerable.filter(c => !c.child_id)
  if (orphans.length > 0 && queue.length > 0) queue[0].outstanding += orphans.length

  // The child being asked about: the param when it still has something left,
  // otherwise the first child who does. So finishing Olgie and coming back
  // lands on Teo without the parent choosing, and a stale ?child= from a
  // bookmark never shows an empty page while another child is waiting.
  const current = queue.find(k => k.id === childIdParam) ?? queue[0] ?? null

  const mine = current
    ? answerable.filter(c => c.child_id === current.id || (!c.child_id && current.id === queue[0]?.id))
    : answerable
  const asked = mine.slice(0, 5)

  return {
    baseline,
    queue,
    childId: current?.id ?? null,
    childName: current?.name ?? null,
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
