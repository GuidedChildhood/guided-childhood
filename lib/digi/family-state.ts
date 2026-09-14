import type { SupabaseClient } from '@supabase/supabase-js'
import { getReadinessAreas, type AreaLessons } from '@/lib/pathway/readiness-areas'
import { childWorries, improvedLine, improvedSentence, type ImprovedLine } from '@/lib/concerns/sorted'
import { readPassportChild, type PassportChildRead } from '@/lib/pathway/passport-child'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { AREA_START, type LiteracyKey } from '@/lib/content/literacy'

// Where this family is against the goal, for one child, in one reading.
//
// Justin, 13 September 2026: DiGi "should be able to think when to step in and
// advise the user what is best for the goals we set", proactively, "getting to
// the goal of a completed passport in steps."
//
// ── WHAT WAS MISSING ────────────────────────────────────────────────────────
//
// DiGi's anchor in every chat (getPathwayPosition in lib/digi/brain.ts) said
// the stage, the ring percentage and the next lesson or script. It said nothing
// about the four things the passport now proves, nothing about the worry that
// has moved, nothing about what the child themself has done. So DiGi answered
// the question in front of it well and never drove toward anything, because it
// could not see the thing it was meant to drive toward.
//
// ── THE RULE ────────────────────────────────────────────────────────────────
//
// One reading, the same numbers the passport draws, rendered as plain lines.
// No new judgement is made here: what to say and when is the model's, with the
// house rule kept, one calibrated next step and never a list. The goal itself
// is stated in the words the passport uses, a stamped page, so the parent and
// DiGi are talking about the same object.
//
// Fails soft to an empty reading. This decorates an answer that already works.

export type FamilyState = {
  stageNum: number
  areas: AreaLessons[]
  improved: ImprovedLine | null
  sortedCount: number
  openCount: number
  child: PassportChildRead
  checkPassed: boolean
}

export async function readFamilyState(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  stageNum: number,
  ageBand: string | null,
): Promise<FamilyState | null> {
  try {
    const [areasRead, worries, child, passed] = await Promise.all([
      getReadinessAreas(supabase, userId, childId),
      childId ? childWorries(supabase, userId, childId) : Promise.resolve([]),
      readPassportChild(supabase, userId, childId, ageBand),
      getPassedStageQuizzes(supabase, userId, childId).catch(() => new Set<number>()),
    ])
    const stage = Math.min(5, Math.max(1, stageNum))
    return {
      stageNum: stage,
      areas: areasRead.byStage[stage] ?? [],
      improved: improvedLine(worries),
      sortedCount: worries.filter(w => w.sorted).length,
      openCount: worries.filter(w => !w.sorted).length,
      child,
      checkPassed: passed.has(stage),
    }
  } catch {
    return null
  }
}

/** The reading as prompt lines. Empty string when there is nothing to say. */
export function renderFamilyState(state: FamilyState | null, childName = 'their child'): string {
  if (!state) return ''
  const areaLines = state.areas
    .filter(a => state.stageNum >= (AREA_START[a.key as LiteracyKey] ?? 1))
    .map(a => `${a.name} ${a.done} of ${a.total}`)
    .join(', ')
  const later = state.areas
    .filter(a => state.stageNum < (AREA_START[a.key as LiteracyKey] ?? 1))
    .map(a => a.name)
  const lines = [
    `THE GOAL, IN THE PASSPORT'S OWN WORDS: a stamped Stage ${state.stageNum} page for ${childName}. A page stamps when every lesson and script for the stage is done and ${childName} passes the end of stage check${state.checkPassed ? ' (the check is already passed)' : ' (the check is not yet passed)'}.`,
    areaLines ? `The four things this stage builds, as lessons passed: ${areaLines}.${later.length ? ` ${later.join(' and ')} come${later.length === 1 ? 's' : ''} later on the road.` : ''}` : null,
    state.improved
      ? `BEHAVIOUR, ON THE PARENT'S OWN STARS: ${improvedSentence(state.improved)} ${state.sortedCount} worr${state.sortedCount === 1 ? 'y' : 'ies'} sorted so far, ${state.openCount} still open.`
      : state.sortedCount > 0
        ? `BEHAVIOUR: ${state.sortedCount} worr${state.sortedCount === 1 ? 'y' : 'ies'} sorted on the parent's own stars, ${state.openCount} still open.`
        : state.openCount > 0
          ? `BEHAVIOUR: ${state.openCount} worr${state.openCount === 1 ? 'y' : 'ies'} open, none moved yet.`
          : null,
    `WHAT ${childName.toUpperCase()} HAS DONE THEMSELVES: ${state.child.daysDone} full day${state.child.daysDone === 1 ? '' : 's'} in their own app${state.child.stars !== null ? `, ${state.child.stars} star${state.child.stars === 1 ? '' : 's'} in the bank` : ''}${state.child.parentRunsTimer ? '' : `, the device timer used on ${state.child.timerDays} day${state.child.timerDays === 1 ? '' : 's'} this week`}.`,
    'Use this the way a good teacher uses a mark book: know it, name the one thing that moves the page when it fits, and celebrate a real movement in the parent\'s own stars before offering anything new. Never a list, never a percentage of the whole journey, never guilt.',
  ].filter((l): l is string => !!l)
  return `\n\n${lines.join('\n')}`
}
