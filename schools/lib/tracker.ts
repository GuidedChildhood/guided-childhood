import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { placementOf } from '@gc/shared/passport-areas'
import type { LessonShape } from '@gc/shared/schools-progress'

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
