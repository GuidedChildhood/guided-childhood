import type { createClient } from '@/lib/supabase/server'

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
// mean anything. Only the four that represent a real outstanding action get
// one, and each one goes quiet the moment it is dealt with.

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
}

const EMPTY: BoardStatus = {
  ticksToConfirm: 0,
  printablesToConfirm: 0,
  schoolOpen: 0,
  agreementSigned: true,
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

  const [ticks, sheets, school, agreement] = await Promise.all([
    supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('printable_completions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending'),
    supabase.from('school_actions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'open'),
    supabase.from('family_agreements').select('id').eq('user_id', userId).limit(1),
  ])

  return {
    ticksToConfirm: ticks.error ? 0 : (ticks.count ?? 0),
    printablesToConfirm: sheets.error ? 0 : (sheets.count ?? 0),
    schoolOpen: school.error ? 0 : (school.count ?? 0),
    // Unknown reads as signed, so a failure is silence rather than a nag.
    agreementSigned: agreement.error ? true : (agreement.data?.length ?? 0) > 0,
  }
}
