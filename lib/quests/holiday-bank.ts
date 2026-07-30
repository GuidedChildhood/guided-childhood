import { isSchoolHoliday, holidayOn, type Region } from '@/lib/learning/holidays'

// The holiday bank: screen time earned above the weekly cap, spendable only
// while school is out.
//
// The weekly reset stopped a child hoarding ordinary screen time, which was
// right: 342 stars and 1,710 minutes was not a reward, it was a backlog. But
// the reset alone meant work beyond the cap was simply binned, and nothing said
// so. This is the counterweight. The reset says you cannot stockpile ordinary
// time; the bank says the extra work still counted.
//
// Two rules make it a saving rather than a top up, and both matter:
//
//   It can only be spent in the school holidays. A balance you can see and
//   cannot touch yet is the entire mechanic. Spendable whenever, it is just a
//   bigger weekly cap with extra steps.
//
//   It never expires. A child who banks in June and spends in August has done
//   exactly what was intended, and quietly clearing it would teach the opposite
//   of the lesson.

export type HolidayBank = {
  childId: string
  /** Everything ever banked, in minutes. */
  banked: number
  /** Taken back out during holidays. */
  spent: number
  /** What is left, whether or not it can be spent today. */
  remaining: number
  /** True only while a school holiday window is open. */
  spendableNow: boolean
  /** The holiday it is spendable in, when one is open. */
  holidayTitle: string | null
}

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * The holiday bank for each child.
 *
 * Always returns a row per child asked for, including zeros, so a caller never
 * has to tell "no bank" apart from "no rows yet". The child app shows the
 * balance in term time too, because seeing it grow is the point.
 */
export async function getHolidayBanks(
  supabase: Client,
  userId: string,
  childIds: string[],
  on: Date = new Date(),
  region: Region = 'uk',
): Promise<HolidayBank[]> {
  const spendableNow = isSchoolHoliday(on, region)
  const holidayTitle = holidayOn(on, region)?.title ?? null

  const empty = (childId: string): HolidayBank => ({
    childId, banked: 0, spent: 0, remaining: 0, spendableNow, holidayTitle,
  })
  if (childIds.length === 0) return []

  const { data, error } = await supabase
    .from('holiday_allowance')
    .select('child_id, minutes, spent')
    .eq('user_id', userId)
    .in('child_id', childIds)

  // Fails soft to zero rather than throwing. A missing table on a deploy that
  // has not run migration 127 must not take down the child's whole page for a
  // number that is a bonus by definition.
  if (error || !data) return childIds.map(empty)

  return childIds.map(childId => {
    const rows = data.filter(r => r.child_id === childId)
    const banked = rows.reduce((sum, r) => sum + (Number(r.minutes) || 0), 0)
    const spent = rows.reduce((sum, r) => sum + (Number(r.spent) || 0), 0)
    return {
      childId,
      banked,
      spent,
      remaining: Math.max(0, banked - spent),
      spendableNow,
      holidayTitle,
    }
  })
}

/**
 * What the child app says about the bank, in their words.
 *
 * Returns null when there is nothing banked AND no holiday running, because a
 * child with an empty bank in the middle of term does not need a card
 * explaining a thing that has not happened to them yet. Everything else gets a
 * line, including an empty bank during a holiday, since that is the moment the
 * mechanic is easiest to understand.
 */
export function holidayBankLine(b: HolidayBank): { title: string; body: string } | null {
  if (b.remaining === 0 && !b.spendableNow) return null

  if (b.spendableNow && b.remaining > 0) {
    return {
      title: `${b.remaining} holiday minutes, ready now`,
      body: `You earned these by doing more jobs than a normal week had room for. It is ${b.holidayTitle}, so they are yours to use.`,
    }
  }
  if (b.spendableNow) {
    return {
      title: 'Holiday minutes',
      body: `Do more jobs than a normal week needs and the extra is saved for the school holidays. It is ${b.holidayTitle} now, so anything you save goes straight in.`,
    }
  }
  return {
    title: `${b.remaining} minutes saved for the holidays`,
    body: 'Extra jobs you did that the week had no room for. They are waiting for the school holidays.',
  }
}
