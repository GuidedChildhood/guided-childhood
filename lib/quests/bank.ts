import { STAR_MINUTES } from './templates'
import { starWeekStart, starWeekEnd, londonMidnightIso, weeklyStarCap } from './star-week'
import type { Region } from '@/lib/learning/holidays'

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
  /**
   * SPENDABLE NOW: this star week only, Monday to Monday in London, capped at the
   * age band's recommended minutes.
   *
   * This used to be the lifetime unspent total, which is how a test child came to
   * be holding 342 stars and 1,710 minutes. Nothing was broken; eight weeks of
   * ordinary earning had simply never been reset.
   *
   * The names deliberately did NOT change when the meaning did, and that is the
   * safer way round. Roughly a dozen screens and routes read `balance` and
   * `minutes` to answer "what can be spent", and every one of them is now correct
   * without being touched. Adding weekBalance alongside a lifetime `balance` would
   * have left each of those sites quietly wrong until someone remembered it, which
   * is exactly the class of bug this whole change exists to remove.
   */
  balance: number
  minutes: number
  /**
   * Lifetime unspent stars, for the one thing that legitimately saves up: goals.
   *
   * A cinema trip at 40 stars is a save up mechanic, so gating it on the week
   * would make any goal costing more than one week's cap unreachable for ever.
   * Hoarding SCREEN TIME is what the reset prevents; saving towards a real world
   * reward is what we want. Only the two goal redemption routes should read this.
   */
  lifetimeBalance: number
  lifetimeMinutes: number
  weekEarned: number
  weekSpent: number
  /**
   * Stars earned ABOVE this week's cap.
   *
   * This number existed only as the difference thrown away by a Math.min and
   * was never surfaced anywhere, so a child doing far more than the guideline
   * allows simply lost the extra. In the live data that is 180 stars for one
   * test child across four weeks, fifteen hours of earned screen time that
   * evaporated with nothing telling anyone it had.
   *
   * Justin's call, and it is a better mechanic than the flat holiday lift it
   * replaces: the extra banks towards the school holidays. Term time keeps the
   * healthy ceiling, effort beyond it is not wasted, and holiday screen time
   * stays EARNED rather than handed over, which is what the product says it
   * does everywhere else.
   *
   * Surplus is distinct from unused. Unused is time you had and chose not to
   * spend, and it already buys sticker credits, which rewards restraint.
   * Surplus is work you did that the week had no room for, which rewards
   * effort. Two different behaviours, two different rewards.
   */
  weekSurplus: number
  // The ceiling for this child's band, so a screen can say 12 of 84 rather than
  // a bare number with nothing to measure it against.
  weekCap: number
  /**
   * Minutes one star buys THIS child (migration 225). The deployment default
   * unless the family changed it, and the rate every minutes figure above was
   * computed with, so a screen quoting a price can use the same number.
   */
  starMinutes: number
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
  /**
   * Which school calendar this family keeps, because the weekly ceiling relaxes
   * in a holiday and a US family's holidays are not England's. Defaults to the
   * England windows, which is where every family on the platform is today.
   */
  region?: Region,
): Promise<StarBank[]> {
  if (childIds.length === 0) return []

  const weekStartDate = weekStart ?? starWeekStart()
  const weekStartIso = londonMidnightIso(weekStartDate)
  // Exclusive upper bound, so asking for a past week cannot sweep in the current
  // one. For the current week this changes nothing, since no row is in the future.
  const weekEndDate = starWeekEnd(weekStartDate)
  const weekEndIso = londonMidnightIso(weekEndDate)

  const [questsRes, ticksRes, missionsRes, spendsRes, watchTogetherRes, bonusesRes, tutorRes] = await Promise.all([
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
    // Tutor lessons (migration 188): a lesson DiGi wrote from the child's own
    // homework, sent by a parent, finished on the child's phone. Same shape as
    // the star lesson missions above, and it has to be counted here or the
    // stars a child earns finishing one are a number on a screen and nothing
    // else. Before the migration the read errors and counts nothing, exactly
    // like star_bonuses did.
    supabase.from('tutor_lessons').select('child_id, stars, done_at').eq('user_id', userId),
  ])

  const starsByQuest = new Map(
    (questsRes.data ?? []).map(q => [q.id as string, Number(q.stars) || 1])
  )

  // Family jobs earn no stars: contribution is belonging, not payment (the Dr
  // Becky layer, migration 223's is_family_job flag). Their ticks still exist,
  // still get approved and still count for streaks, they simply pay nothing
  // here. Read apart and best effort, never in the select above, so a database
  // still short of the column keeps every bank in the world readable and
  // simply has no family jobs yet.
  try {
    const { data: familyJobs, error: fjError } = await supabase
      .from('family_quests').select('id').eq('user_id', userId).eq('is_family_job', true)
    if (!fjError) for (const q of familyJobs ?? []) starsByQuest.set(q.id as string, 0)
  } catch { /* no column, no family jobs */ }

  // The per child star rate (migration 225): what one star buys THIS child.
  // Read apart and best effort for the same reason as family jobs above; a
  // database or family without it keeps the deployment default everywhere.
  const rateByChild = new Map<string, number>()
  try {
    const { data: rateRows, error: rateError } = await supabase
      .from('child_time_settings').select('child_id, star_minutes')
      .eq('user_id', userId).in('child_id', childIds)
    if (!rateError) {
      for (const r of rateRows ?? []) {
        const rate = Number((r as { star_minutes?: number | null }).star_minutes)
        if (Number.isFinite(rate) && rate >= 1 && rate <= 60) rateByChild.set(String(r.child_id), rate)
      }
    }
  } catch { /* deployment default */ }

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
        // A finished tutor lesson. done_at is the only thing that pays, and it
        // is written once, so a child replaying one cannot earn twice.
        + (tutorRes.data ?? [])
          .filter(t => t.child_id === childId && t.done_at)
          .filter(t => !inWeek || (String(t.done_at ?? '') >= weekStartIso && String(t.done_at ?? '') < weekEndIso))
          .reduce((sum, t) => sum + (Number(t.stars) || 0), 0)
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
    const lifetimeBalance = Math.max(0, life.earned - life.spent)

    // Capped on what was EARNED this week, then spending comes off that. Capping
    // the balance instead would quietly refund a child: spend down to the cap and
    // the ceiling hands the stars straight back.
    // Priced for the week being read, not for today. Identical for the current
    // week; the difference only shows when the Monday rollover reaches back for
    // the week that just ended and that week sat the other side of a holiday.
    const starMinutes = rateByChild.get(childId) ?? STAR_MINUTES
    const weekCap = weeklyStarCap(ageBands[childId] ?? null, new Date(`${weekStartDate}T12:00:00Z`), region, starMinutes)
    const weekEarned = Math.min(week.earned, weekCap)
    const weekBalance = Math.max(0, weekEarned - week.spent)
    // What the cap turned away. Kept rather than discarded so Monday can bank
    // it towards the holidays.
    const weekSurplus = Math.max(0, week.earned - weekCap)

    return {
      child_id: childId,
      earned: life.earned,
      spent: life.spent,
      // balance IS the weekly spendable figure. See the type above for why the
      // name kept its meaning to callers while the number underneath changed.
      balance: weekBalance,
      minutes: weekBalance * starMinutes,
      lifetimeBalance,
      lifetimeMinutes: lifetimeBalance * starMinutes,
      weekEarned,
      weekSpent: week.spent,
      weekSurplus,
      weekCap,
      starMinutes,
    }
  })
}
