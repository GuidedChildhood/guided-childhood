import type { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'

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
// mean anything. Only the five that represent a real outstanding action get
// one, and each one goes quiet the moment it is dealt with.
//
// Star chart is the one Justin asked for that is not here. Not printed yet
// cannot be answered honestly: StarChartBuilder saves nothing, so there is no
// record of a family ever having printed it. Rather than guess from something
// adjacent, which is exactly the invented badge this file rules out, that tile
// stays quiet until there is a column that actually knows.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type BoardStatus = {
  /** Ticks the child has claimed that are waiting on the parent's yes. */
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
}

const EMPTY: BoardStatus = {
  ticksToConfirm: 0,
  printablesToConfirm: 0,
  schoolOpen: 0,
  agreementSigned: true,
  starsToSpend: 0,
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

  const [ticks, sheets, school, agreement, kids] = await Promise.all([
    supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('printable_completions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('school_actions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'open'),
    supabase.from('family_agreements').select('id').eq('user_id', userId).limit(1),
    kidsPromise,
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

  return {
    starsToSpend,
    ticksToConfirm: ticks.error ? 0 : (ticks.count ?? 0),
    printablesToConfirm: sheets.error ? 0 : (sheets.count ?? 0),
    schoolOpen: school.error ? 0 : (school.count ?? 0),
    // Unknown reads as signed, so a failure is silence rather than a nag.
    agreementSigned: agreement.error ? true : (agreement.data?.length ?? 0) > 0,
  }
}
