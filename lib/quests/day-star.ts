import { computeJobsStreak, type StreakQuest, type StreakTick } from '@/lib/pathway/jobs-streak'
import { londonNow } from '@/lib/time/london'

// ── A STAR A DAY, FOR DOING THE DAY'S JOBS ─────────────────────────────────
//
// Justin, 11 September 2026: "the passport needs to sync that when kids do
// their today jobs it adds a star per day."
//
// Each job already pays its own stars on approval, and the whole five a day
// path pays three (app/api/kid/path-complete). What had no reward at all was
// the plain thing a parent actually asks for: everything you were meant to do
// today, done. A child with one job and a child with four both finished their
// day, and only the second felt like it.
//
// So one star, once a day, the day every recurring job due is approved. It
// lands in star_bonuses, which is the ledger the bank already reads
// (lib/quests/bank), so it is spendable screen time like any other star and
// it shows on the passport without a second source of truth.
//
// ── WHY IT CANNOT BE DOUBLE PAID ───────────────────────────────────────────
//
// The note is the key. Every award reads today's bonuses for this child first
// and returns if one is already there. Approval is the only caller and it can
// fire several times in a minute (four jobs approved in a row, the fourth
// being the one that completes the day), so the read is not an optimisation,
// it is the lock.
//
// ── WHY IT IS ONE STAR ─────────────────────────────────────────────────────
//
// The week has a cap (lib/quests/star-week), set from the healthy minutes for
// the child's age, and anything above it banks towards the holidays rather
// than being lost. A daily star is around a tenth of a young child's week, so
// it is felt without being the point. The jobs themselves stay the earning.

type BonusClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export const DAY_STAR_NOTE = 'Jobs done: every job today'
export const DAY_STAR_STARS = 1

/**
 * Award the day star if today's jobs are all done and it has not been paid.
 *
 * Returns true only when a star was actually written, so a caller can push the
 * good news without pushing it twice. Best effort throughout: this decorates
 * an approval that has already happened and must never be able to fail it.
 */
export async function awardDayStarIfComplete(
  supabase: BonusClient,
  userId: string,
  childId: string | null,
): Promise<boolean> {
  if (!childId) return false
  try {
    // The family's today, not the server's. An approval at half past midnight
    // in British Summer Time is stored an hour earlier in UTC, and a day
    // boundary read in the wrong zone would pay the star twice on one evening
    // and not at all on the next.
    const today = londonNow().dateStr

    const { data: paid, error: readErr } = await supabase
      .from('star_bonuses')
      .select('id')
      .eq('user_id', userId).eq('child_id', childId)
      .ilike('note', `${DAY_STAR_NOTE}%`)
      .gte('created_at', `${today}T00:00:00Z`)
      .limit(1)
    // A database short of migration 086 has no ledger to pay into. Silence is
    // the right answer, not an error on a tap that worked.
    if (readErr) return false
    if ((paid ?? []).length > 0) return false

    const [{ data: quests }, { data: ticks }] = await Promise.all([
      supabase
        .from('family_quests')
        .select('id, schedule, schedule_days, created_at')
        .eq('user_id', userId)
        // The child's own jobs and the household's alike, the same rule the
        // streak uses: a shared job done is a job done.
        .or(`child_id.eq.${childId},child_id.is.null`)
        .eq('active', true),
      supabase
        .from('quest_ticks')
        .select('quest_id, tick_date, status')
        .eq('user_id', userId)
        .eq('child_id', childId)
        .eq('tick_date', today),
    ])
    if (!quests || quests.length === 0) return false

    // computeJobsStreak already holds the one definition of a good day: every
    // recurring job due that day approved, on that day, and a job only counts
    // from the day it existed. Reusing it is the point, so the star and the
    // streak can never disagree about whether today was done.
    const { todayGood } = computeJobsStreak(
      quests as StreakQuest[],
      (ticks ?? []) as StreakTick[],
      new Date(`${today}T12:00:00`),
    )
    if (!todayGood) return false

    const { error } = await supabase.from('star_bonuses').insert({
      user_id: userId, child_id: childId, stars: DAY_STAR_STARS,
      note: `${DAY_STAR_NOTE} ⭐`,
    })
    return !error
  } catch {
    return false
  }
}
