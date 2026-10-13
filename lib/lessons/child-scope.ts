// WHOSE LESSON PASSES COUNT FOR A CHILD.
//
// Justin, 13 October 2026, looking at Teo's mission row: "why does it say 9
// out of 10?" Teo had passed none himself. One was a star lesson in his own
// app, and eight were lessons passed on the parent side with no child picked,
// the household rows, which every per child count added in on the idea that a
// grown up leads a lesson with the child beside them. Asked to choose, Justin
// chose "only Teo's own": a child's count is the lessons that child passed,
// plus any a grown up passed with that child picked. A household row (no child
// on it) counts for nobody's badge.
//
// One rule, read by every per child lesson count, so the sticker book, the
// planets, the stage stamp and the child's lesson list cannot disagree: the
// thing the comments in lib/stickers/book.ts and lesson-path-server have
// always asked for ("Pass 5 lessons and the fifth planet mean the same five").
//
// Null child keeps every row: a caller with no child in view is asking about
// the household, and that answer is unchanged.

/** The PostgREST `.or()` filter for a child's own lesson rows, or null for the household. */
export function lessonScopeFor(childId: string | null): string | null {
  return childId ? `child_id.eq.${childId}` : null
}
