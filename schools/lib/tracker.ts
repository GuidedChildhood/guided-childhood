import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { placementOf } from '@gc/shared/passport-areas'
import type { LessonShape, StepId } from '@gc/shared/schools-progress'

// WHICH STEPS APPLY TO A LESSON, READ FROM WHAT THE LESSON ALREADY SAYS.
//
// The tracker's step list is never a hardcoded list per module. Three of the
// four facts come from the manifest, which every page here already has, and
// the fourth comes off the row. So a lesson that gains `i can` statements
// gains its learning record step on the next deploy, without anybody editing
// anything.
//
//   hasRecord        teacher_notes.i_can has entries          (the row)
//   hasPassportPage  the module fills one of the five pages   (the manifest)
//   dslRequired      the module is safeguarding flagged       (the manifest)
//   hasPrevious      there is a lesson before it in the scheme(the manifest)

/** The lesson before and after this one in teaching order, or null at the ends. */
export function neighbours(moduleId: string): { previousModuleId: string | null; nextModuleId: string | null } {
  const i = CURRICULUM.findIndex(m => m.moduleId === moduleId)
  if (i < 0) return { previousModuleId: null, nextModuleId: null }
  return {
    previousModuleId: i > 0 ? CURRICULUM[i - 1].moduleId : null,
    nextModuleId: i < CURRICULUM.length - 1 ? CURRICULUM[i + 1].moduleId : null,
  }
}

/** The one tap that does a step, shown on the row while it is still to do. */
export type StepAction = { href: string; label: string }

/**
 * Where each step is done, so the panel leads rather than only records.
 *
 * Justin, 7 October 2026, on the run sheet's panel: check "that it leads the
 * flow easy for teachers". It said what was left and why it mattered, and
 * then left the teacher to scroll back up the page and find the button. Every
 * row the product can tick now carries the tap that ticks it: the pack link
 * IS the print step, the board link IS the board step. Following the panel
 * from top to bottom is preparing the lesson.
 *
 * The passport has no action: it fills inside the lesson, on its own slide,
 * and the row's grey line already says so.
 */
export function trackerActions(moduleId: string): Partial<Record<StepId, StepAction>> {
  const { previousModuleId } = neighbours(moduleId)
  const before = previousModuleId ? CURRICULUM.find(m => m.moduleId === previousModuleId) : null
  return {
    read: { href: `/lesson/${moduleId}`, label: 'Read the lesson page' },
    ...(before ? { lookback: { href: `/lesson/${before.moduleId}`, label: `Open the lesson before: ${before.title}` } } : {}),
    pack: { href: `/print/${moduleId}`, label: 'Print the pack' },
    record: { href: `/print/${moduleId}/record`, label: 'Print the learning record' },
    board: { href: `/teach/${moduleId}`, label: 'Open it on the board' },
    taught: { href: `/teach/${moduleId}`, label: 'Teach it' },
    dsl: { href: '/hub/dsl', label: 'What to tell your safeguarding lead' },
    notes_home: { href: `/print/${moduleId}`, label: 'The parent note prints with the pack' },
  }
}

/** True where this module fills one of the five passport pages. KS5 sits after it. */
export function fillsAPassportPage(moduleId: string): boolean {
  const p = placementOf(moduleId)
  return !!p && p !== 'after'
}

/**
 * The shape of one lesson's checklist.
 *
 * `iCan` is the only thing the caller has to fetch; pass the row's
 * `teacher_notes.i_can`, or undefined where the caller has not read it.
 */
export function shapeOf(moduleId: string, iCan: unknown): LessonShape {
  const m = CURRICULUM.find(x => x.moduleId === moduleId)
  return {
    hasRecord: Array.isArray(iCan) && iCan.length > 0,
    hasPassportPage: fillsAPassportPage(moduleId),
    dslRequired: !!m?.dsl,
    hasPrevious: neighbours(moduleId).previousModuleId !== null,
  }
}
