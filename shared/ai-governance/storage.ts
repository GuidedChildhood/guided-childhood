// WHERE A REVIEW LIVES, AND WHY IT IS NOT ON OUR SERVER YET.
//
// The schools app has no accounts. schools/lib/access.ts is explicit that a
// code is a door and not an identity, and that the app holds no session, no
// user and no personal data of any kind. A school's AI reviews name staff and
// record their judgements, so putting them on our server would make this
// feature the first thing to break that promise, and it would need a school
// row and an RLS policy to scope to. Neither exists.
//
// So a review lives on the school's own device, exports as a file, and prints
// as a record. That is also where a DPIA actually lives: in the school's own
// systems, attached to the decision it supports.
//
// THIS IS AN INTERFACE ON PURPOSE. When the staffroom lands and schools have
// real accounts, add a second implementation, point the pages at it, and
// nothing in the framework or the UI changes. The Review type was designed as
// a row for exactly that day.

import type { Review } from './types'

/** A write that did not land. Thrown rather than returned so a future
 *  SupabaseReviewStore reports a failed round trip the same way and the pages
 *  above need no change. */
export class SaveFailed extends Error {
  readonly cause: unknown
  constructor(cause: unknown) {
    super('That did not save. Nothing was lost from the screen, but this device would not keep it.')
    this.name = 'SaveFailed'
    this.cause = cause
  }
}

export interface ReviewStore {
  list(): Promise<Review[]>
  get(id: string): Promise<Review | null>
  save(review: Review): Promise<void>
  remove(id: string): Promise<void>
}

const KEY = 'gc_ai_reviews_v1'

export function newReview(id: string, now: string): Review {
  return {
    id,
    product: '', provider: '', url: '', purpose: '', problem: '', alternative: '',
    yearGroups: [], owner: '', facing: null, required: null, productType: 'unclassified',
    answers: {},
    signOff: { dpo: {}, dsl: {}, slt: {}, governors: {} },
    reviewedOn: null, nextReviewOn: null, decision: null, conditions: '', history: [],
    createdAt: now, updatedAt: now,
  }
}

/** A year from a given day, which is the review cycle most schools already run
 *  their other supplier checks on. The school can always change it. */
export function defaultNextReview(from: Date): string {
  const d = new Date(from)
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export function isOverdue(review: Review, today: string): boolean {
  return Boolean(review.nextReviewOn && review.nextReviewOn < today)
}

/** Browser storage. Wrapped in try/catch throughout because a locked down
 *  school laptop can refuse it outright, and a governance tool that throws on
 *  a managed device is worse than one that says it cannot save. */
export class BrowserReviewStore implements ReviewStore {
  private read(): Review[] {
    try {
      const raw = globalThis.localStorage?.getItem(KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed as Review[] : []
    } catch {
      return []
    }
  }

  private write(all: Review[]): void {
    try {
      globalThis.localStorage?.setItem(KEY, JSON.stringify(all))
    } catch (e) {
      // A full or blocked store is not a crash, but it must not be silent
      // either. The one thing this feature promises is that a school can stop
      // and come back, and swallowing this meant twenty minutes of a DSL's
      // answers disappearing with the page still saying Saved. The caller
      // catches it and puts a banner up.
      throw new SaveFailed(e)
    }
  }

  async list(): Promise<Review[]> {
    return this.read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async get(id: string): Promise<Review | null> {
    return this.read().find(r => r.id === id) ?? null
  }

  async save(review: Review): Promise<void> {
    const all = this.read()
    const at = all.findIndex(r => r.id === review.id)
    if (at >= 0) all[at] = review
    else all.push(review)
    this.write(all)
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter(r => r.id !== id))
  }
}

/** Can this browser actually keep anything? Asked once so the page can say so
 *  plainly rather than losing a school's afternoon of work in silence. */
export function storageAvailable(): boolean {
  try {
    const probe = '__gc_probe__'
    globalThis.localStorage?.setItem(probe, '1')
    globalThis.localStorage?.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export function toExport(reviews: Review[]): string {
  return JSON.stringify({ kind: 'gc-ai-reviews', version: 1, exportedAt: new Date().toISOString(), reviews }, null, 2)
}

/** Import is deliberately strict and additive: it never silently replaces a
 *  review somebody else on the staff has been working on. */
export function fromExport(raw: string): { reviews: Review[]; error?: string } {
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.kind !== 'gc-ai-reviews' || !Array.isArray(parsed.reviews)) {
      return { reviews: [], error: 'That file is not a Guided Childhood AI review export.' }
    }
    return { reviews: parsed.reviews as Review[] }
  } catch {
    return { reviews: [], error: 'That file could not be read.' }
  }
}
