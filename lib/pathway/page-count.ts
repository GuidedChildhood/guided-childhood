// ONE NUMBER FOR A PASSPORT PAGE (plan: plans/2026-10-16-passport-journey-plan.md, 1.4).
//
// The page used to show three percentages that disagreed: the header ring
// averaged five rows, two of which (moments and balance) earn nothing toward
// the stamp; the catch up chips read a weighted blend; the pass bars read a
// third count. This is the one number, and it counts exactly what earns the
// stamp: the child's lessons passed, the parent's scripts resolved, and the
// child's big check. It is printed as a count, "7 of 12 done", never a
// percent, so it reads the same on the hero, the book, Home and a push.
//
// Pure, so the guard runs it on fixtures.

export type PageCountInput = {
  lessonsDone: number
  lessonsTotal: number
  scriptsDone: number
  scriptsTotal: number
}

export type PageCount = {
  done: number
  total: number
  /** Split by who, for the bar's captions. */
  lessons: { done: number; total: number }
  scripts: { done: number; total: number }
  check: { done: boolean }
}

export function pageCount(p: PageCountInput | null | undefined, checkPassed: boolean): PageCount {
  const lessons = { done: Math.min(p?.lessonsDone ?? 0, p?.lessonsTotal ?? 0), total: p?.lessonsTotal ?? 0 }
  const scripts = { done: Math.min(p?.scriptsDone ?? 0, p?.scriptsTotal ?? 0), total: p?.scriptsTotal ?? 0 }
  return {
    done: lessons.done + scripts.done + (checkPassed ? 1 : 0),
    total: lessons.total + scripts.total + 1,
    lessons,
    scripts,
    check: { done: checkPassed },
  }
}

/** "7 of 12 done". The only way the page's number is printed. */
export function pageCountLine(c: Pick<PageCount, 'done' | 'total'>): string {
  return `${c.done} of ${c.total} done`
}
