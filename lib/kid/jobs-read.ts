import type { SupabaseClient } from '@supabase/supabase-js'
import { questDueToday } from '@/lib/quests/due'
import { isPrintableAskTitle } from '@/lib/quests/printable-ask'

// The one read of "which jobs are due for this child today".
//
// This logic lived inline on the child's home page. The five a day's jobs row
// now opens a jobs page of its own (the reorder, step 2), and that page has to
// agree with the home screen about which jobs exist and which are ticked. Two
// surfaces disagreeing about the same number has been the bug three times this
// week, and the way it happens is the same rules written twice. So the rules
// live here and both pages call this.

export type KidQuestRow = {
  id: string
  title: string
  emoji: string
  stars: number
  schedule: string
  schedule_days?: number[] | null
  blocks_screens?: boolean
  created_at?: string | null
}

export type KidJobsRead = {
  /** Every active quest row, unfiltered, for star lookups by id. */
  rawQuests: KidQuestRow[]
  /** Every active quest that is real (printable asks filtered out). */
  allQuests: KidQuestRow[]
  /** Due today and still worth showing: the child's working list. */
  dueQuests: KidQuestRow[]
  /** Active but not due today, for the coming later shelf. */
  laterQuests: { title: string; emoji: string; schedule: string }[]
  /** Today's ticks, quest id to status. */
  todayTicks: { quest_id: string; status: string }[]
  /** Once quests that have ever been ticked, for the lesson done check. */
  tickedOnceEver: Set<string>
}

export async function readKidJobs(
  supabase: SupabaseClient,
  userId: string,
  childId: string,
): Promise<KidJobsRead> {
  const today = new Date().toISOString().slice(0, 10)

  const [questsRes, todayTicksRes] = await Promise.all([
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule, schedule_days, blocks_screens, created_at')
      .eq('user_id', userId)
      .eq('active', true)
      .or(`child_id.eq.${childId},child_id.is.null`)
      .order('created_at'),
    supabase.from('quest_ticks')
      .select('quest_id, status')
      .eq('child_id', childId)
      .eq('tick_date', today),
  ])

  // A printable ask that was turned into a job on an older build is not a real
  // job, so it never shows in the child's list as one.
  const allQuests = ((questsRes.data ?? []) as KidQuestRow[]).filter(q => !isPrintableAskTitle(q.title))
  const due = allQuests.filter(q => questDueToday(q.schedule, q.schedule_days ?? null))
  const laterQuests = allQuests
    .filter(q => !questDueToday(q.schedule, q.schedule_days ?? null))
    .map(q => ({ title: q.title, emoji: q.emoji, schedule: q.schedule }))

  // Once quests stay due until ticked, then leave the list on later days
  // (today's tick still shows today, as waiting or done).
  const onceIds = allQuests.filter(q => q.schedule === 'once').map(q => q.id)
  const { data: onceTicks } = onceIds.length
    ? await supabase.from('quest_ticks')
        .select('quest_id, tick_date')
        .in('quest_id', onceIds)
        .neq('status', 'rejected')
    : { data: [] as { quest_id: string; tick_date: string }[] }
  const tickedOnceBeforeToday = new Set(
    (onceTicks ?? []).filter(t => String(t.tick_date) < today).map(t => t.quest_id)
  )
  const tickedOnceEver = new Set((onceTicks ?? []).map(t => t.quest_id))
  const dueQuests = due.filter(q => !(q.schedule === 'once' && tickedOnceBeforeToday.has(q.id)))

  return {
    rawQuests: (questsRes.data ?? []) as KidQuestRow[],
    allQuests,
    dueQuests,
    laterQuests,
    todayTicks: (todayTicksRes.data ?? []) as { quest_id: string; status: string }[],
    tickedOnceEver,
  }
}
