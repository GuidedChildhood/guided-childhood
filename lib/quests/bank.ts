import { STAR_MINUTES } from './templates'

// The star bank: what a child has earned all time, what has been spent
// as agreed screen time, and what is left. Earned means approved by the
// parent: quest ticks and finished star lessons. Spent means the parent
// marked screen time as used. Everything is computed server side from
// the approve loop, never trusted from a client.

export type StarBank = {
  child_id: string
  earned: number
  spent: number
  balance: number
  minutes: number
}

// Works with the parent session client and the admin client alike.
type BankClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export async function getStarBanks(
  supabase: BankClient,
  userId: string,
  childIds: string[]
): Promise<StarBank[]> {
  if (childIds.length === 0) return []

  const [questsRes, ticksRes, missionsRes, spendsRes] = await Promise.all([
    // Every quest ever, active or removed: old ticks still count
    supabase.from('family_quests').select('id, stars, child_id').eq('user_id', userId),
    supabase.from('quest_ticks').select('quest_id, child_id, status').eq('user_id', userId),
    supabase.from('kid_lesson_missions').select('child_id, stars, status').eq('user_id', userId),
    supabase.from('star_spends').select('child_id, stars').eq('user_id', userId),
  ])

  const starsByQuest = new Map(
    (questsRes.data ?? []).map(q => [q.id as string, Number(q.stars) || 1])
  )

  return childIds.map(childId => {
    // A tick with no child belongs to a whole family quest, so it counts
    // for every child, matching how the board has always read it.
    const earned = (ticksRes.data ?? [])
      .filter(t => t.status === 'approved' && (t.child_id === childId || t.child_id === null))
      .reduce((sum, t) => sum + (starsByQuest.get(t.quest_id as string) ?? 1), 0)
      + (missionsRes.data ?? [])
        .filter(m => m.status === 'done' && m.child_id === childId)
        .reduce((sum, m) => sum + (Number(m.stars) || 0), 0)
    const spent = (spendsRes.data ?? [])
      .filter(s => s.child_id === childId)
      .reduce((sum, s) => sum + (Number(s.stars) || 0), 0)
    const balance = Math.max(0, earned - spent)
    return { child_id: childId, earned, spent, balance, minutes: balance * STAR_MINUTES }
  })
}
