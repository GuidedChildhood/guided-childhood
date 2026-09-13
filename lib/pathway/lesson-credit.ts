// The one rule for whether a lesson counts as done for a child.
//
// Lifted out of progress.ts on 13 September 2026 so the four things reading
// (lib/pathway/readiness-areas.ts) and the stamp share it by import rather than
// by two loops that happen to agree, and so a guard can run it with no
// database and no path alias in the way. progress.ts re-exports it, so every
// existing caller is unchanged.
//
// ── WHOSE LESSON COUNTS, THE MULTI CHILD RULE ───────────────────────────────
//
// Justin, 18 August 2026: "the passport has to be per child, individual task,
// quests lessons digi moments etc all child related." The data model for it is
// migration 162's lesson_pass_by, which records WHO passed: a child row for a
// pass on a kid link, a parent row (null child_id) for the signed in
// dashboard, because "a parent watching a lesson is watching it for the
// family rather than for one child".
//
// So for child X a lesson is credited when any of these holds:
//   1. X passed it on their own link (a pass_by row with X's child_id).
//   2. The parent passed it (a pass_by row with who parent), which counts for
//      every child by 162's own doctrine.
//   3. LEGACY: a lesson_completions pass exists and pass_by knows nothing
//      about that lesson at all. pass_by is additive since 162 and was never
//      backfilled, so the absence of a row is history, not absence of work.
//      Without this rule every family who learned before mid August would
//      wake to an emptier passport.
//
// A sibling's own pass (a pass_by row with a DIFFERENT child_id, and no
// parent or legacy credit) is exactly what stops counting, which is the
// point: the eldest doing their lessons never filled the youngest's page.
export type PassByRow = { lesson_id: string; who: string; child_id: string | null }
export function lessonCreditKeys(
  completions: { lesson_id: string; lesson_source: string; passed: boolean | null }[] | null,
  passBy: PassByRow[] | null,
  childId: string | null,
): Set<string> {
  const passedCompletions = (completions ?? []).filter(c => c.passed !== false)
  if (!childId || passBy === null) {
    return new Set(passedCompletions.map(c => `${c.lesson_source}:${c.lesson_id}`))
  }
  const knownToPassBy = new Set((passBy ?? []).map(r => r.lesson_id))
  const credited = new Set<string>()
  for (const r of passBy ?? []) {
    // A parent row with a NULL child is the old doctrine (watching for the
    // family) and credits every child. A parent row that NAMES a child is the
    // new doctrine arriving (the plumbing session's write side change: the
    // parent watched WITH that child, from ?child=) and credits that child
    // only. Today every parent row is null so both readings agree; when the
    // write side lands, this line starts meaning it without an edit here.
    const parentCredit = r.who === 'parent' && (r.child_id === null || r.child_id === childId)
    if (parentCredit || r.child_id === childId) credited.add(r.lesson_id)
  }
  const out = new Set<string>()
  for (const c of passedCompletions) {
    if (credited.has(c.lesson_id) || !knownToPassBy.has(c.lesson_id)) {
      out.add(`${c.lesson_source}:${c.lesson_id}`)
    }
  }
  return out
}

