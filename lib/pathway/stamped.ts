import type { StageProgress } from './progress'

// ONE DEFINITION OF STAMPED.
//
// The audit of 2 September 2026 found four. The parent's flip book stamped a
// page on the stage's content being complete AND this child passing the big
// check. The child's sticker book stamped it on the content alone. The
// public verify page stamped it on the content alone. A fourth, on an
// unreachable child route, stamped it on the check alone. So a child who
// finished every lesson and script but had not sat the check held a
// Foundation Stamp in their book while their parent's passport said In
// progress, which is the opposite of the sync Justin asked for.
//
// This is the rule, and every surface reads it: the stage's lessons and
// scripts all done, AND the big check passed by this child. Both halves are
// the child's own work, and both are what a parent means by "finished the
// stage".

export function isStageStamped(
  progress: Pick<StageProgress, 'contentComplete'> | undefined | null,
  passedStages: Set<number>,
  stageNum: number,
): boolean {
  return !!progress?.contentComplete && passedStages.has(stageNum)
}
