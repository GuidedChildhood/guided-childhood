import type { StageId } from '@/lib/pathway/progress'

// THE CHILD'S LESSONS ARE THE SCHOOL LESSONS (29 September 2026).
//
// Justin chose "the child learns, the parent closes it": the child plays the
// school version of each lesson in their own app, passing its check ticks
// Lessons and tests on the passport, and the parent gets one question to ask
// at tea. The parent library stays as the parent's own learning and stops
// being the thing the passport counts. Plan: plans/2026-09-29-lessons-plan.md.
//
// Before this the child app showed the parent library, 102 lessons written for
// adults, and the passport counted 25 to 40 of them per stage. The school
// scheme is written for the child, Oak structured, and every module carries a
// check and a family question.
//
// This file is the one place a stage is matched to its key stages, so the
// passport, the child's list and the parent's view cannot disagree about what
// "this stage's lessons" means. KS2 runs to age 11 and sits with Builder,
// which is where a Year 6 child reads their stage.

export const STAGE_KEY_STAGES: Record<StageId, string[]> = {
  foundation: ['EYFS', 'KS1'],
  builder: ['KS2'],
  explorer: ['KS3'],
  shaper: ['KS4'],
  independent: ['KS5'],
}

export type SchoolModule = { id: string; module_id?: string; title: string; key_stage?: string }

/** The stage's school modules, in the order the scheme teaches them. */
export function schoolModulesForStage<T extends SchoolModule>(rows: T[] | null | undefined, stageId: StageId): T[] {
  const stages = STAGE_KEY_STAGES[stageId] ?? []
  return (rows ?? []).filter(r => stages.includes(r.key_stage ?? ''))
}

/** The stage a module belongs to, or null for a key stage no stage claims. */
export function stageForKeyStage(keyStage: string | null | undefined): StageId | null {
  for (const [stage, list] of Object.entries(STAGE_KEY_STAGES) as [StageId, string[]][]) {
    if (list.includes(keyStage ?? '')) return stage
  }
  return null
}

/** The credit key a passed school module carries in lessonCreditKeys. */
export const schoolCreditKey = (lessonId: string) => `school_lesson:${lessonId}`

/**
 * Under 7 the lesson is done together on the grown up's phone: EYFS and KS1
 * children cannot read a deck alone, and joint media engagement is where
 * learning sticks at that age.
 */
export const isTogetherStage = (stageId: StageId | null | undefined) => stageId === 'foundation'
