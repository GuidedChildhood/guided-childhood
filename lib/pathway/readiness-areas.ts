import type { SupabaseClient } from '@supabase/supabase-js'
// Relative imports on purpose: the guard runs this file under node with no
// path alias, and so can any test.
import { AREA_ORDER, LITERACY_AREAS, literacyAreaFor, type LiteracyKey } from '../content/literacy'
import { lessonCreditKeys, type PassByRow } from './lesson-credit'

// The one counting rule for the four things, per stage.
//
// Justin, 13 September 2026: the passport must be "updated based on
// progression through the areas we have agreed need to be met" and show that a
// child is "AI literate, safe and ready for the future we think AI will give
// us."
//
// ── WHAT WAS WRONG ──────────────────────────────────────────────────────────
//
// The four things card read `lessons.category` and nothing else. So the
// child's own AI modules (`ai_lessons`, seven or eight per age band, every
// band from 4 to 7 up) counted toward nothing: not the AI area, not the
// passport. A child could pass every module we wrote for them and the AI
// reading would still say "No lessons done yet". And the reading counted the
// teacher stubs in its totals, so a stage's Safe total was three lessons
// bigger than anything a family could actually take.
//
// ── THE RULE ────────────────────────────────────────────────────────────────
//
//   A stage's total for an area is the parent lessons of that stage whose
//   category lands in the area, plus the AI modules for that stage's age band
//   (all of which land in AI). Stubs never count.
//
//   A lesson is done for a child by the stamp's own rule, lessonCreditKeys:
//   passed by the child, or by the parent, or a legacy pass the pass_by table
//   never heard of. A sibling's pass does not count.
//
// countAreaLessons is pure so a guard can hold it, and so the four things card
// and the passport book read the same numbers by construction rather than by
// two loops that happen to agree.

export type AreaLessons = {
  key: LiteracyKey
  name: string
  done: number
  total: number
}

export type ReadinessAreas = {
  /** Stage 1 to 5, each in AREA_ORDER. */
  byStage: Record<number, AreaLessons[]>
  /** Passes per area across every stage, for the "12 lessons done" line. */
  allTime: Record<LiteracyKey, number>
}

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

/** The AI modules are keyed by the age their band starts at. */
export const AI_AUDIENCE_TO_STAGE: Record<string, number> = {
  age_7: 1, age_9: 2, age_11: 3, age_13: 4, age_16: 5,
}

export type LessonRowForAreas = { id: string; stage_id: string | null; category: string | null; audience?: string | null; status?: string | null }
export type AiLessonRowForAreas = { id: string; audience: string | null }

function emptyAreas(): ReadinessAreas {
  const byStage: Record<number, AreaLessons[]> = {}
  for (let s = 1; s <= 5; s += 1) {
    byStage[s] = AREA_ORDER.map(key => ({ key, name: LITERACY_AREAS[key].name, done: 0, total: 0 }))
  }
  return { byStage, allTime: { safe: 0, balance: 0, ai: 0, social: 0 } }
}

/**
 * Count the four areas for every stage.
 *
 * `credited` holds `${lesson_source}:${lesson_id}` keys, exactly what
 * lessonCreditKeys returns, so the two sources cannot be confused: a parent
 * lesson is `lesson:<id>` and an AI module is `ai_lesson:<id>`.
 */
export function countAreaLessons(
  lessons: LessonRowForAreas[],
  aiLessons: AiLessonRowForAreas[],
  credited: Set<string>,
): ReadinessAreas {
  const out = emptyAreas()
  const bump = (stage: number, key: LiteracyKey, done: boolean) => {
    const row = out.byStage[stage]?.find(a => a.key === key)
    if (!row) return
    row.total += 1
    if (done) {
      row.done += 1
      out.allTime[key] += 1
    }
  }
  for (const l of lessons) {
    // The stamp's own filter: parent lessons, never stubs. Rows that carry no
    // audience or status (older callers) are taken as the real thing.
    if (l.audience && l.audience !== 'parent') continue
    if (l.status === 'stub') continue
    const stage = STAGE_SLUGS.indexOf(l.stage_id as typeof STAGE_SLUGS[number]) + 1
    if (stage < 1) continue
    const area = literacyAreaFor(l.category)
    if (!area) continue
    bump(stage, area.key, credited.has(`lesson:${l.id}`))
  }
  for (const m of aiLessons) {
    const stage = AI_AUDIENCE_TO_STAGE[m.audience ?? '']
    if (!stage) continue
    bump(stage, 'ai', credited.has(`ai_lesson:${m.id}`))
  }
  return out
}

const childScope = (childId: string | null) =>
  childId ? `child_id.eq.${childId},child_id.is.null` : null

/**
 * The four areas for one child, every stage, from the live tables.
 *
 * Fails soft to zeroes: this decorates a page that already works, and a
 * passport that fails to render because one of these queries timed out would
 * be a worse product than one that shows an empty bar for a minute.
 */
export async function getReadinessAreas(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
): Promise<ReadinessAreas> {
  try {
    const scope = childScope(childId)
    const [lessonsRes, aiRes, doneRes, passByRes] = await Promise.all([
      supabase.from('lessons').select('id, stage_id, category, audience, status').eq('audience', 'parent').neq('status', 'stub'),
      supabase.from('ai_lessons').select('id, audience').in('audience', Object.keys(AI_AUDIENCE_TO_STAGE)),
      (() => {
        const q = supabase.from('lesson_completions').select('lesson_id, lesson_source, passed, child_id').eq('user_id', userId)
        return scope ? q.or(scope) : q
      })(),
      childId
        ? supabase.from('lesson_pass_by').select('lesson_id, who, child_id').eq('user_id', userId)
        : Promise.resolve({ data: null as PassByRow[] | null }),
    ])
    const completions = ((doneRes.data ?? []) as { lesson_id: string; lesson_source: string | null; passed: boolean | null }[])
      .map(c => ({ ...c, lesson_source: c.lesson_source ?? 'lesson' }))
    const credited = lessonCreditKeys(completions, (passByRes.data ?? null) as PassByRow[] | null, childId)
    return countAreaLessons(
      (lessonsRes.data ?? []) as LessonRowForAreas[],
      (aiRes.data ?? []) as AiLessonRowForAreas[],
      credited,
    )
  } catch {
    return emptyAreas()
  }
}
