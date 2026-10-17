// THE STORED STAMP (plan: plans/2026-10-16-passport-journey-plan.md, 1.2).
//
// A stamp used to be worked out again on every view (lib/pathway/stamped.ts),
// so a module added to a key stage took the stamp off a page the family had
// been told was stamped for good. Migration 378 stores it. This file is the
// only writer: the first time a page reads as earned, it is written, once,
// with `stamped_at` set and never cleared. After that the stored row wins on
// every surface, whatever the lesson list does.
//
// Reads fail soft to an empty set, so the passport works the same before 378
// is applied: stamps come from the rule, as they always have.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isStageStamped } from './stamped'
import type { StageProgress, StageId } from './progress'

type Db = Pick<SupabaseClient, 'from'>

const STAGES: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

/** The pages stored as stamped for this child, by stage number 1 to 5. */
export async function loadStoredStamps(db: Db, childId: string | null | undefined): Promise<Set<number>> {
  if (!childId) return new Set()
  try {
    const { data, error } = await db
      .from('passport_pages')
      .select('stage_num, stamped_at')
      .eq('child_id', childId)
      .not('stamped_at', 'is', null)
    if (error || !data) return new Set()
    return new Set((data as { stage_num: number }[]).map(r => Number(r.stage_num)))
  } catch {
    return new Set()
  }
}

/**
 * Stores the stamp for one page the first time it is earned. Returns true only
 * when this call is the one that stamped it, so a caller can push or
 * celebrate once. Never unstamps. Needs the service role client.
 */
export async function awardStampIfEarned(
  admin: Db,
  args: { userId: string; childId: string; stageNum: number; lessonsDone: number; lessonsTotal: number },
): Promise<boolean> {
  const now = new Date().toISOString()
  const fields = {
    stamped_at: now,
    lessons_done_at_stamp: args.lessonsDone,
    lessons_total_at_stamp: args.lessonsTotal,
  }
  try {
    // A row may already exist for this page (a push mark), with no stamp yet.
    const { data: updated } = await admin
      .from('passport_pages')
      .update(fields)
      .eq('child_id', args.childId)
      .eq('stage_num', args.stageNum)
      .is('stamped_at', null)
      .select('stage_num')
    if (updated && updated.length > 0) return true
    const { data: inserted } = await admin
      .from('passport_pages')
      .upsert(
        { user_id: args.userId, child_id: args.childId, stage_num: args.stageNum, ...fields },
        { onConflict: 'child_id,stage_num', ignoreDuplicates: true },
      )
      .select('stage_num')
    return !!inserted && inserted.length > 0
  } catch {
    return false
  }
}

/**
 * Every page this child has stamped: the stored ones, plus any the rule says
 * are earned now, which are stored on the way through so they stay earned.
 * The one call the passport surfaces make.
 */
export async function stampedStages(
  admin: Db,
  args: {
    userId: string
    childId: string | null | undefined
    progress: Partial<Record<StageId, StageProgress>>
    passed: Set<number>
  },
): Promise<Set<number>> {
  const stored = await loadStoredStamps(admin, args.childId)
  const out = new Set(stored)
  const writes: Promise<boolean>[] = []
  STAGES.forEach((id, i) => {
    const n = i + 1
    if (out.has(n)) return
    const p = args.progress[id]
    if (!isStageStamped(p, args.passed, n)) return
    out.add(n)
    if (args.childId && p) {
      writes.push(awardStampIfEarned(admin, {
        userId: args.userId, childId: args.childId, stageNum: n,
        lessonsDone: p.lessonsDone, lessonsTotal: p.lessonsTotal,
      }))
    }
  })
  if (writes.length) await Promise.all(writes)
  return out
}
