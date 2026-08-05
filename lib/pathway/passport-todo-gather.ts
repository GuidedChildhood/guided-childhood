import type { createClient } from '@/lib/supabase/server'
import { getStageProgress, type StageId, type StageProgress } from '@/lib/pathway/progress'
import { jobsTodayStatus, type StreakQuest, type StreakTick } from '@/lib/pathway/jobs-streak'
import { childPassportToDo, type ChildToDo } from '@/lib/pathway/passport-todo'

// The child's half of the passport TO DO, read from the database.
//
// Split out from passport-todo.ts on purpose: that file is imported by a client
// component, this one reads rows. The arithmetic lives there and stays testable
// without a database; the fetching lives here and is shared by the two callers
// that need it, the parent's Send button and the monthly sweep, so the list a
// parent previews and the list the cron sends can never drift apart.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type ToDoChild = {
  id: string
  name: string | null
  stage_id: string | null
  streak_weeks?: number | null
}

/**
 * What this child can do right now to keep their passport moving.
 *
 * Empty when there is nothing, which is the answer we want most months: a
 * family on top of it hears nothing at all, and that silence is what makes the
 * message mean something when it does arrive.
 *
 * Every read fails soft. A missing stage or an unreadable table returns an
 * empty list rather than throwing, because the worst outcome of this whole
 * feature going quiet is that a child does not get a reminder they were never
 * waiting on.
 */
export async function gatherChildPassportToDo(
  supabase: SupabaseClient,
  userId: string,
  child: ToDoChild,
  /**
   * The stage reading, when the caller already has it. The pathway page builds
   * it for the passport itself, and getStageProgress is eight queries, so the
   * page hands its copy over rather than paying for it twice on one render.
   */
  opts: { progress?: StageProgress | null } = {},
): Promise<ChildToDo[]> {
  if (!child.stage_id) return []

  const stageNums: Record<string, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }
  const stageNum = stageNums[child.stage_id]
  if (!stageNum) return []

  try {
    const [progress, questRes, tickRes, passRes] = await Promise.all([
      opts.progress ?? getStageProgress(supabase, userId, child.stage_id as StageId, child.streak_weeks ?? 0),
      supabase.from('family_quests').select('id, schedule, schedule_days, created_at')
        .eq('user_id', userId).eq('child_id', child.id).eq('active', true),
      // Sixty days is what the streak reads over, and today's status only needs
      // today, but one window serves both and this is a monthly job.
      supabase.from('quest_ticks').select('quest_id, tick_date, status')
        .eq('user_id', userId).eq('child_id', child.id)
        .gte('tick_date', new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10)),
      supabase.from('stage_quiz_passes').select('stage_id')
        .eq('user_id', userId).eq('child_id', child.id).eq('passed', true),
    ])

    const jobsStatus = jobsTodayStatus(
      (questRes.data ?? []) as StreakQuest[],
      (tickRes.data ?? []) as StreakTick[],
    )

    // The same "near the end of the stage" test the pathway page uses to decide
    // whether to offer the check at all. Offering it to a child three quarters
    // of a stage early would just be a question they cannot answer yet.
    const checkOffered = progress.contentComplete || progress.overallPct >= 75
    const checkPassed = (passRes.data ?? []).some(r => Number(r.stage_id) === stageNum)

    return childPassportToDo({
      lessonsDone: progress.lessonsDone,
      lessonsTotal: progress.lessonsTotal,
      jobsStatus,
      checkOffered,
      checkPassed,
    })
  } catch {
    return []
  }
}
