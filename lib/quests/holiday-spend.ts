import { STAR_MINUTES } from './templates'
import { minutesToStars } from './device-time'

// Paying for a block of screen time out of two pockets.
//
// A child has a weekly star balance that resets every Monday, and, during a
// school holiday, a bank of minutes they earned by doing more than an ordinary
// week had room for. Both can pay for the same block, so something has to
// decide the order, and the order is not a detail: get it wrong and the app
// either destroys time a child earned or hands them time they did not.
//
// The rules are the same in both directions, and both follow from one fact:
// ordinary stars expire on Monday and holiday minutes never do.
//
//   PAYING    stars first, holiday minutes only for the shortfall. Spend the
//             perishable pocket while it is still worth something.
//
//   REFUNDING holiday minutes first, then trim the star spend. The holiday
//             pocket was the last thing added to the block, and refunding
//             stars first would put value back into the pocket that is about
//             to be emptied anyway.
//
// The arithmetic lives here, apart from the routes and apart from the database,
// because it is the part that has to be right. The routes then do the plainly
// boring thing the plan tells them to.

export type SpendPlan = {
  /** Can this block be paid for at all? */
  enough: boolean
  /** Minutes covered by the weekly star balance. */
  starMinutes: number
  /** Stars that costs. Rounded up, so a part block still costs a whole star. */
  starCost: number
  /** Minutes covered by the holiday bank. Zero outside a school holiday. */
  holidayMinutes: number
}

/**
 * How to pay for a block, given both pockets.
 *
 * starBalance is in STARS (what the bank speaks in) and holidayAvailable is in
 * MINUTES (what the holiday bank speaks in), which is deliberate rather than
 * sloppy: converting either one to the other's unit at the boundary is where a
 * rounding error would get in, and a star rounds up while a minute does not.
 *
 * spendableNow is passed in rather than worked out here so a caller cannot get
 * a different answer from the one it showed the child a moment ago.
 */
export function planSpend(
  needMinutes: number,
  starBalance: number,
  holidayAvailable: number,
  spendableNow: boolean,
): SpendPlan {
  const need = Math.max(0, Math.round(needMinutes))
  const starPot = Math.max(0, starBalance) * STAR_MINUTES
  const holidayPot = spendableNow ? Math.max(0, Math.round(holidayAvailable)) : 0

  const starMinutes = Math.min(need, starPot)
  const holidayMinutes = Math.min(need - starMinutes, holidayPot)

  return {
    enough: starMinutes + holidayMinutes >= need,
    starMinutes,
    starCost: minutesToStars(starMinutes),
    holidayMinutes,
  }
}

export type RefundPlan = {
  /** Minutes going back to the holiday bank. */
  holidayRefund: number
  /** Minutes of this block that the holiday bank ends up having paid for. */
  holidayKept: number
  /** What the star spend should be trimmed to. */
  starCost: number
  /** True when nothing needs writing, so a caller can skip the round trip. */
  unchanged: boolean
}

/**
 * How to unwind a block that ended early.
 *
 * The holiday bank is made whole first, up to what it put in. Only once it is
 * back to where it started does the star spend get trimmed, which means a child
 * who books an hour and watches ten minutes gets every holiday minute back
 * before losing a single star of the refund to rounding.
 *
 * A block that ran its full length refunds nothing, which falls out of the
 * arithmetic rather than needing its own branch.
 */
export function planRefund(
  plannedMinutes: number,
  usedMinutes: number,
  holidayDrawn: number,
): RefundPlan {
  const planned = Math.max(0, Math.round(plannedMinutes))
  const used = Math.max(0, Math.min(planned, Math.round(usedMinutes)))
  const drawn = Math.max(0, Math.min(planned, Math.round(holidayDrawn)))

  const unused = planned - used
  const holidayRefund = Math.min(drawn, unused)
  const holidayKept = drawn - holidayRefund
  // Whatever the holiday bank did not cover, the stars did. Rounded up as
  // everywhere else, so a part block still costs a whole star.
  const starCost = minutesToStars(used - holidayKept)

  return {
    holidayRefund,
    holidayKept,
    starCost,
    unchanged: unused === 0,
  }
}

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

type BankRow = { id: string; minutes: number; spent: number }

/**
 * Take minutes out of the holiday bank, oldest week first.
 *
 * Oldest first is the ordinary way a savings account works and it keeps the
 * table readable: the weeks at the top are the ones already used up, so a
 * parent looking at the history sees it drain in the order it filled.
 *
 * Returns how much it actually managed to take, which can be less than asked
 * for if another device started a block in the same moment. Callers must treat
 * a short draw as a failure and put it back, never as a discount.
 */
export async function drawFromHolidayBank(
  supabase: Client,
  userId: string,
  childId: string,
  minutes: number,
): Promise<number> {
  if (minutes <= 0) return 0
  const { data, error } = await supabase
    .from('holiday_allowance')
    .select('id, minutes, spent')
    .eq('user_id', userId)
    .eq('child_id', childId)
    .order('week_start', { ascending: true })
  if (error || !data) return 0

  let left = minutes
  let taken = 0
  for (const row of data as BankRow[]) {
    if (left <= 0) break
    const free = Math.max(0, (Number(row.minutes) || 0) - (Number(row.spent) || 0))
    if (free <= 0) continue
    const take = Math.min(free, left)
    const { error: upErr } = await supabase
      .from('holiday_allowance')
      .update({ spent: (Number(row.spent) || 0) + take })
      .eq('id', row.id)
    if (upErr) break
    left -= take
    taken += take
  }
  return taken
}

/**
 * Put minutes back, newest week first.
 *
 * The mirror of the draw, so a block that is started and immediately stopped
 * leaves the table exactly as it found it rather than shuffling the balance
 * between weeks. Never puts back more than a week actually had spent.
 */
export async function refundToHolidayBank(
  supabase: Client,
  userId: string,
  childId: string,
  minutes: number,
): Promise<number> {
  if (minutes <= 0) return 0
  const { data, error } = await supabase
    .from('holiday_allowance')
    .select('id, minutes, spent')
    .eq('user_id', userId)
    .eq('child_id', childId)
    .order('week_start', { ascending: false })
  if (error || !data) return 0

  let left = minutes
  let given = 0
  for (const row of data as BankRow[]) {
    if (left <= 0) break
    const used = Math.max(0, Number(row.spent) || 0)
    if (used <= 0) continue
    const give = Math.min(used, left)
    const { error: upErr } = await supabase
      .from('holiday_allowance')
      .update({ spent: used - give })
      .eq('id', row.id)
    if (upErr) break
    left -= give
    given += give
  }
  return given
}
