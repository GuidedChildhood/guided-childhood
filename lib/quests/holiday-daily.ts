import type { SupabaseClient } from '@supabase/supabase-js'
import { starWeekStart } from '@/lib/quests/star-week'

// Five minutes of holiday time for finishing a day.
//
// The rollover pays a child for going beyond what a week could hold. That is a
// good reward and a slow one: nothing lands until Monday, and a child who does
// everything asked of them inside the weekly cap earns nothing from it at all.
// This closes the loop on the day the work happened.
//
// Five, because a perfect week adds thirty five minutes to the holiday pot.
// Enough to feel like it was worth finishing, small enough that it never
// competes with the weekly allowance the ordinary loop already pays. Holiday
// minutes are the slow currency and they should stay slow.

/** What one finished day is worth, in minutes of holiday screen time. */
export const MINUTES_PER_COMPLETED_DAY = 5


/**
 * Bank the day's minutes, once.
 *
 * Call ONLY on the transition into complete, never on a read of a finished
 * day. The unique key makes a second call harmless rather than costly, but a
 * caller that leans on it is a caller that will one day be pointed at a
 * different table.
 *
 * Fire and forget by contract: a child who has just finished their day must
 * never see an error about a bonus. Returns whether it landed, for callers
 * that want to say so, and swallows everything else.
 */
export async function grantDayMinutes(
  admin: SupabaseClient,
  userId: string,
  childId: string,
  day: string,
): Promise<boolean> {
  try {
    const { error } = await admin.from('holiday_allowance').insert({
      user_id: userId,
      child_id: childId,
      minutes: MINUTES_PER_COMPLETED_DAY,
      // Zero stars. Stars measure what a JOB is worth and are spendable on the
      // weekly allowance; these minutes were not bought with any. Showing a
      // star count here would invite a child to add the two together.
      stars: 0,
      // The week this day belongs to, so the row sits with the rollover rows
      // for the same week and every existing read of the bank still works
      // without knowing this feature exists.
      week_start: starWeekStart(new Date(`${day}T12:00:00Z`)),
      source: 'daily',
      on_date: day,
    })
    // A duplicate is the guard doing its job, not a failure: the day was
    // already paid. Anything else is worth knowing about but not worth
    // interrupting a child for.
    if (error && !/duplicate key|unique/i.test(error.message)) {
      console.error('holiday daily grant failed:', error.message)
    }
    return !error
  } catch (err) {
    console.error('holiday daily grant threw:', err)
    return false
  }
}
