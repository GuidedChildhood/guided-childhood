import type { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'
import { chartWeekStart } from '@/lib/quests/star-week'

// What is actually waiting for the parent, per tile on the Quests board.
//
// The eight tiles at the top of Quests were pure navigation: eight labels, no
// state, filling the first screen before a single piece of information. A
// parent landed on the page and could not tell, without scrolling through
// thirty six sections, whether anything needed them at all.
//
// They carry their own state now. A tile with a number is a job to do; a tile
// without one is quietly done, which is the whole point. That is the pattern
// GoHenry and Greenlight both use: the top of the screen carries state, not
// links.
//
// Deliberately NOT every tile. A badge invented so that a tile has one is
// worse than no badge, because it teaches a parent that the numbers do not
// mean anything. Only the six that represent a real outstanding action get
// one, and each one goes quiet the moment it is dealt with.
//
// The star chart badge waited for a column that actually knows. Migration 117
// is that column: the print button writes a row, so "Not printed yet" is now a
// fact rather than something inferred from an adjacent signal.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type BoardStatus = {
  /** Everything waiting on the parent's yes: ticks the child has claimed, plus
   *  new jobs they have pitched. One number because they are one queue, answered
   *  on one tab. */
  ticksToConfirm: number
  /** Finished printables waiting to be confirmed so the stars can land. */
  printablesToConfirm: number
  /** School reminders still open. */
  schoolOpen: number
  /** True once the family has an agreement saved, so the tile can stop asking. */
  agreementSigned: boolean
  /**
   * Stars sitting unspent across every child, which is what the keepsake shop
   * is for. Earned minus spent, so it falls as rewards are taken rather than
   * counting up forever.
   *
   * This one is a balance rather than a queue, and it earns its badge for the
   * same reason the other four do: unspent stars are a reward the child has
   * worked for and not yet been given. That is an outstanding action, it is
   * just the parent's to take rather than to confirm.
   */
  starsToSpend: number
  /**
   * True once this family has printed their star chart at least once.
   *
   * Defaults to printed on a failed read, like the agreement does, so a broken
   * query is silence rather than a nag at a family who have it on the fridge.
   */
  starChartPrinted: boolean
  /**
   * Saturday or Sunday, this family uses the paper chart, and there is no
   * printed sheet for the Monday coming.
   *
   * A weekly OFFER rather than an outstanding action, which is why it is its
   * own field rather than flipping starChartPrinted back to false: that flag
   * means "never tried this" and a family with the chart on the fridge every
   * week has very much tried it.
   */
  chartWeekDue: boolean
  /**
   * A child asking for screen time right now, waiting on a yes.
   *
   * This one earns the loud badge for the same reason a ticked job does: a
   * child has asked a person a question and cannot start until it is answered.
   */
  timeAsks: number
  /** Timers running right now, so the tile can say so rather than stay blank. */
  timersRunning: number
}

const EMPTY: BoardStatus = {
  ticksToConfirm: 0,
  printablesToConfirm: 0,
  schoolOpen: 0,
  agreementSigned: true,
  starsToSpend: 0,
  starChartPrinted: true,
  chartWeekDue: false,
  timeAsks: 0,
  timersRunning: 0,
}

/**
 * One pass for every badge on the board.
 *
 * Every read fails soft to the quiet state. A tile that cannot answer says
 * nothing, which is right: a badge is a claim that something needs doing, and
 * a failed query is not evidence of that. The agreement in particular defaults
 * to signed, so a broken read never nags a family who have already done it.
 */
export async function getBoardStatus(
  supabase: SupabaseClient,
  userId: string | null | undefined,
): Promise<BoardStatus> {
  if (!userId) return EMPTY

  // The star balance needs the children first, so it runs alongside the four
  // counts rather than after them: one extra round trip for the whole board,
  // not one per tile.
  const kidsPromise = supabase.from('children').select('id').eq('user_id', userId)

  const nowIso = new Date().toISOString()
  const [ticks, sheets, school, agreement, kids, chartPrints, timeAsks, timers, jobAsks] = await Promise.all([
    supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('printable_completions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('school_actions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'open'),
    supabase.from('family_agreements').select('id').eq('user_id', userId).limit(1),
    kidsPromise,
    // Both questions the chart gets asked, in one read: has this family EVER
    // printed one, and is there one for the week that starts on Monday. The
    // week_start column (migration 170) is what makes the second answerable;
    // before it the tile had to answer both with the first.
    supabase.from('star_chart_prints').select('id, week_start').eq('user_id', userId),
    // Asks go stale: the child's own screen drops a request after twelve hours
    // rather than leaving a parent answering yesterday's question, so the badge
    // counts the same window the answer screen does.
    supabase.from('device_requests').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 12 * 3600000).toISOString()),
    supabase.from('device_sessions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'active').gt('ends_at', nowIso),
    // A child pitching a new job. Counted into ticksToConfirm below rather than
    // getting a badge of its own: see the comment on that field.
    supabase.from('quest_requests').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
  ])

  // Fails soft like the rest: a bank that cannot be read shows no badge rather
  // than a wrong number, and a family with nothing banked shows none either.
  let starsToSpend = 0
  const childIds = kids.error ? [] : (kids.data ?? []).map(k => k.id as string)
  if (childIds.length > 0) {
    try {
      const banks = await getStarBanks(supabase, userId, childIds)
      starsToSpend = banks.reduce((sum, b) => sum + Math.max(0, b.balance), 0)
    } catch { starsToSpend = 0 }
  }

  // THE SUNDAY CHART, and why it is a weekend only offer.
  //
  // Justin asked for the chart to be a Sunday thing, made ready for the week
  // ahead. The badge before this went quiet on the first print and stayed quiet
  // for good, which is right for "you have never tried this" and useless for a
  // rhythm.
  //
  // Three rules, and each one is there to stop this becoming a nag:
  //
  //   Only a family who has ALREADY printed one. A family who has never used
  //   the paper chart is being offered the thing, not chased about it, and that
  //   is what the existing To print badge is for.
  //   Only Saturday and Sunday. Making next week's chart is a weekend job, and
  //   an offer that sits there all week is wallpaper by Wednesday.
  //   Only when there is no print for the Monday coming. Print it and the tile
  //   goes quiet until next weekend, which is the whole point.
  //
  // A failed read means no offer, matching how every other field here fails.
  const printRows = chartPrints.error ? [] : (chartPrints.data ?? [])
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short' }).format(new Date())
  const comingWeek = chartWeekStart()
  const chartWeekDue =
    !chartPrints.error
    && printRows.length > 0
    && (weekday === 'Sat' || weekday === 'Sun')
    && !printRows.some(r => (r as { week_start?: string | null }).week_start === comingWeek)

  return {
    starsToSpend,
    // Unknown reads as printed, so a failure is silence rather than a nag.
    starChartPrinted: chartPrints.error ? true : printRows.length > 0,
    chartWeekDue,
    // Ticks AND pitches, as one number.
    //
    // Justin: "on quest it says 1 in red on home page, click on it and you get
    // red 6 on jobs, but when you click jobs nothing there to match the 6." The
    // nav badge counted pitches, this counted ticks, and both drew the same red
    // circle without saying which question they were about. They are answered
    // on the same "Waiting for you" tab and by the same parent in the same
    // minute, so they are one queue. The layout reads the same union.
    ticksToConfirm: (ticks.error ? 0 : (ticks.count ?? 0)) + (jobAsks.error ? 0 : (jobAsks.count ?? 0)),
    printablesToConfirm: sheets.error ? 0 : (sheets.count ?? 0),
    schoolOpen: school.error ? 0 : (school.count ?? 0),
    // Unknown reads as signed, so a failure is silence rather than a nag.
    agreementSigned: agreement.error ? true : (agreement.data?.length ?? 0) > 0,
    timeAsks: timeAsks.error ? 0 : (timeAsks.count ?? 0),
    timersRunning: timers.error ? 0 : (timers.count ?? 0),
  }
}
