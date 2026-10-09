// THE ROWS THE ONE LESSON COUNT READS, FETCHED ONE WAY.
//
// lib/pathway/lesson-path.ts is pure and takes rows. This is the read that
// feeds it for a surface that has a child in view and nothing else to hand:
// Home's "move the passport on" card and the child's own app. progress.ts
// and journey.ts keep their own reads, because they fetch these tables in
// the same round trip as everything else they need; what they share with
// this file is the function the rows go into, which is the part that has to
// agree.
//
// Scoped the way progress.ts scopes: this child's rows plus the household's
// legacy rows with no child on them. The catalogue is read with the admin
// client because schools.school_lessons is service role only (ids, titles
// and key stages are all that is selected).

import type { SupabaseClient as AnySupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { listStarLessons } from '@/lib/quests/star-lesson-catalogue'
import { schoolModulesForStage } from '@/lib/lessons/school-path'
import { AI_AUDIENCE_TO_STAGE } from './readiness-areas'
import type { PassByRow } from './lesson-credit'
import type { StageId } from './progress'
import {
  childLessonPath,
  type AiModuleRow,
  type CompletionRow,
  type LessonPathResult,
  type MissionRow,
} from './lesson-path'

/** A catalogue row as listStarLessons returns it: id, title, key stage, outcome. */
export type CatalogueModule = NonNullable<Awaited<ReturnType<typeof listStarLessons>>>[number]

const STAGE_NUM: Record<StageId, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export async function loadChildLessonPath(
  // Either the parent's session client or the admin client. Every query is
  // filtered by user and child here, so it is correct under both.
  supabase: AnySupabaseClient,
  {
    userId,
    childId,
    stageId,
    paid,
  }: {
    userId: string
    childId: string | null
    stageId: StageId
    paid?: boolean
  },
): Promise<{ modules: CatalogueModule[]; path: LessonPathResult }> {
  const scope = childId ? `child_id.eq.${childId},child_id.is.null` : null
  const [modules, completions, missions, passBy, aiModules] = await Promise.all([
    listStarLessons(createAdminClient()).then(rows => schoolModulesForStage(rows, stageId)),
    (() => {
      const q = supabase.from('lesson_completions').select('lesson_id, lesson_source, passed, child_id').eq('user_id', userId)
      return scope ? q.or(scope) : q
    })(),
    childId
      ? supabase.from('kid_lesson_missions').select('lesson_id, status, done_together, paid_at, attempts').eq('user_id', userId).eq('child_id', childId)
      : Promise.resolve({ data: null }),
    childId
      ? supabase.from('lesson_pass_by').select('lesson_id, who, child_id').eq('user_id', userId)
      : Promise.resolve({ data: null }),
    supabase.from('ai_lessons').select('id, audience').in('audience', Object.keys(AI_AUDIENCE_TO_STAGE)),
  ])

  return {
    modules,
    path: childLessonPath({
      modules,
      aiModules: (aiModules.data ?? null) as AiModuleRow[] | null,
      completions: (completions.data ?? null) as CompletionRow[] | null,
      missions: (missions.data ?? null) as MissionRow[] | null,
      passBy: (passBy.data ?? null) as PassByRow[] | null,
      childId,
      stageNum: STAGE_NUM[stageId],
      paid,
    }),
  }
}

/**
 * Lessons a child passed inside a window, by the planets' rule (`anyLesson`).
 *
 * For the three parent facing counts that used to run their own query over
 * `lesson_completions`: the sticker book's lesson stickers (all time), the
 * monthly review email (one month) and the catch up card (since the last
 * visit). Each counted every passed completion, so the day the child's school
 * lessons start passing at volume they would have counted a school pass by its
 * completion while the planets counted it by its mission, and a retake that
 * moves `completed_at` would have been news twice. Now all four count one way.
 *
 * `household` keeps the rows with no child on them, for the surfaces that
 * have always credited a lesson a parent led with the child beside them. The
 * monthly email never did, so it passes false and its number does not move.
 *
 * Throws on a read error; every caller already fails soft in its own way.
 */
export async function lessonsPassedBetween(
  supabase: AnySupabaseClient,
  {
    userId,
    childId,
    from = null,
    to = null,
    household = true,
  }: {
    userId: string
    childId: string | null
    from?: string | null
    to?: string | null
    household?: boolean
  },
): Promise<number> {
  let completions = supabase
    .from('lesson_completions')
    .select('lesson_id, lesson_source, passed')
    .eq('user_id', userId)
    .eq('passed', true)
  if (childId) {
    completions = household
      ? completions.or(`child_id.eq.${childId},child_id.is.null`)
      : completions.eq('child_id', childId)
  }
  if (from) completions = completions.gte('completed_at', from)
  if (to) completions = completions.lt('completed_at', to)

  let missions = supabase
    .from('kid_lesson_missions')
    .select('lesson_id, status')
    .eq('user_id', userId)
    .eq('status', 'done')
  if (childId) missions = missions.eq('child_id', childId)
  if (from) missions = missions.gte('completed_at', from)
  if (to) missions = missions.lt('completed_at', to)

  const [c, m] = await Promise.all([completions, missions])
  if (c.error && m.error) throw c.error
  return childLessonPath({
    modules: [],
    completions: (c.data ?? []) as CompletionRow[],
    missions: (m.data ?? []) as MissionRow[],
    passBy: null,
    childId,
  }).anyLesson
}
