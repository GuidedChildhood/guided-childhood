import { STAR_MINUTES } from './templates'
import { starWeekStart, starWeekEnd, londonMidnightIso, weeklyStarCap } from './star-week'

// The star bank: what a child has earned all time, what has been spent
// as agreed screen time, and what is left. Earned means approved by the
// parent: quest ticks, finished star lessons and watch together lesson
// completions. Spent means the parent marked screen time as used.
// Everything is computed server side from the approve loop, never
// trusted from a client.

export type StarBank = {
  child_id: string
  // Lifetime, kept because the passport, the stats and the fridge week all want
  // "what has this child ever done" and that question is not the same as "what
  // can they spend tonight".
  earned: number
  spent: number
  balance: number
  minutes: number
  // This star week only, Monday to Monday in London, capped at the age band's
  // recommended minutes. THIS is the spendable number a child sees.
  //
  // The two used to be one thing, which is how a test child came to be holding
  // 342 stars and 1,710 minutes. Nothing was broken: eight weeks of ordinary
  // earning had simply never been reset, and a lifetime total is the wrong
  // number to hand a child as an allowance.
  weekEarned: number
  weekSpent: number
  weekBalance: number
  weekMinutes: number
  // The ceiling for this child's band, so a screen can say 12 of 84 rather than
  // a bare number with nothing to measure it against.
  weekCap: number
}

// Works with the parent session client and the admin client alike.
type BankClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export async function getStarBanks(
  supabase: BankClient,
  userId: string,
  childIds: string[],
  /**
   * Age band per child, so the weekly ceiling is the child's own age guidance
   * rather than a made up number. Missing bands fall back to the 8 to 10 guide
   * inside weeklyStarCap, which is the middle of the range and the safest guess.
   */
  ageBands: Record<string, string | null> = {},
  /**
   * Which star week to report, as its Monday (YYYY-MM-DD). Defaults to the week
   * containing now.
   *
   * The Monday rollover needs this. It runs just after midnight and pays out the
   * week that has just ended, so without it the job would read the brand new week,
   * find nothing left over, and silently never pay anybody.
   */
  weekStart?: string,
): Promise<StarBank[]> {
  if (childIds.length === 0) return []

  const weekStartDate = weekStart ?? starWeekStart()
  const weekStartIso = londonMidnightIso(weekStartDate)
  // Exclusive upper bound, so asking for a past week cannot sweep in the current
  // one. For the current week this changes nothing, since no row is in the future.
  const weekEndDate = starWeekEnd(weekStartDate)
  const weekEndIso = londonMidnightIso(weekEndDate)

  const [questsRes, ticksRes, missionsRes, spendsRes, watchTogetherRes, bonusesRes] = await Promise.all([
    // Every quest ever, active or removed: old ticks still count
    supabase.from('family_quests').select('id, stars, child_id').eq('user_id', userId),
    supabase.from('quest_ticks').select('quest_id, child_id, status, tick_date').eq('user_id', userId),
    supabase.from('kid_lesson_missions').select('child_id, stars, status, completed_at').eq('user_id', userId),
    supabase.from('star_spends').select('child_id, stars, minutes, created_at').eq('user_id', userId),
    // Watch together lessons (parent_lessons): stars_awarded carries the
    // running total per lesson (10 first completion, +2 per redo), written
    // only by the completion API. The table has no user_id column; the
    // child ids passed in are already scoped to this parent.
    supabase.from('parent_lesson_completions').select('child_id, stars_awarded, first_completed_at').in('child_id', childIds),
    // Bonus stars granted outside the quest loop (fair play weeks). The table
    // lands with migration 086; before it the read errors and counts nothing.
    supabase.from('star_bonuses').select('child_id, stars, created_at').eq('user_id', userId),
  ])

  const starsByQuest = new Map(
    (questsRes.data ?? []).map(q => [q.id as string, Number(q.stars) || 1])
  )

  return childIds.map(childId => {
    // `inWeek` is passed as a predicate rather than filtering up front, so the
    // lifetime and the weekly figures are read from exactly the same rows by the
    // same rules. Computing them in two separate passes is how they drift.
    const totals = (inWeek: boolean) => {
      // A tick with no child belongs to a whole family quest, so it counts
      // for every child, matching how the board has always read it.
      const earned = (ticksRes.data ?? [])
        .filter(t => t.status === 'approved' && (t.child_id === childId || t.child_id === null))
        .filter(t => !inWeek || (String(t.tick_date ?? '') >= weekStartDate && String(t.tick_date ?? '') < weekEndDate))
        .reduce((sum, t) => sum + (starsByQuest.get(t.quest_id as string) ?? 1), 0)
        + (missionsRes.data ?? [])
          .filter(m => m.status === 'done' && m.child_id === childId)
          .filter(m => !inWeek || (String(m.completed_at ?? '') >= weekStartIso && String(m.completed_at ?? '') < weekEndIso))
          .reduce((sum, m) => sum + (Number(m.stars) || 0), 0)
        // Watch together carries a RUNNING total per lesson (10 first time, +2 a
        // redo) and there is no per completion row, so the week can only be
        // attributed by first_completed_at. A redo in a later week therefore
        // counts to lifetime and not to that week. Deliberate: the alternative
        // is crediting the whole running total again every time it moves, and the
        // weekly cap below makes the couple of stars immaterial either way.
        + (watchTogetherRes.data ?? [])
          .filter(c => c.child_id === childId)
          .filter(c => !inWeek || (String(c.first_completed_at ?? '') >= weekStartIso && String(c.first_completed_at ?? '') < weekEndIso))
          .reduce((sum, c) => sum + (Number(c.stars_awarded) || 0), 0)
        + (bonusesRes.data ?? [])
          .filter(b => b.child_id === childId)
          .filter(b => !inWeek || (String(b.created_at ?? '') >= weekStartIso && String(b.created_at ?? '') < weekEndIso))
          .reduce((sum, b) => sum + (Number(b.stars) || 0), 0)
      const spent = (spendsRes.data ?? [])
        .filter(s => s.child_id === childId)
        .filter(s => !inWeek || (String(s.created_at ?? '') >= weekStartIso && String(s.created_at ?? '') < weekEndIso))
        // Weekly counts SCREEN TIME spends only. Redeeming a goal (a cinema trip,
        // a comic) also writes a star_spends row, with minutes: 0 because a real
        // world reward has no screen time in it. Counting those against the week
        // would mean cashing in a saved up reward silently wiped that week's
        // screen time, which is a punishment for using the feature. Lifetime still
        // counts them, because a goal genuinely does consume stars.
        .filter(s => !inWeek || (Number(s.minutes) || 0) > 0)
        .reduce((sum, s) => sum + (Number(s.stars) || 0), 0)
      return { earned, spent }
    }

    const life = totals(false)
    const week = totals(true)
    const balance = Math.max(0, life.earned - life.spent)

    // Capped on what was EARNED this week, then spending comes off that. Capping
    // the balance instead would quietly refund a child: spend down to the cap and
    // the ceiling hands the stars straight back.
    const weekCap = weeklyStarCap(ageBands[childId] ?? null)
    const weekEarned = Math.min(week.earned, weekCap)
    const weekBalance = Math.max(0, weekEarned - week.spent)

    return {
      child_id: childId,
      earned: life.earned,
      spent: life.spent,
      balance,
      minutes: balance * STAR_MINUTES,
      weekEarned,
      weekSpent: week.spent,
      weekBalance,
      weekMinutes: weekBalance * STAR_MINUTES,
      weekCap,
    }
  })
}
