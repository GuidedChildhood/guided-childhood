// THE SHAPE OF AN AI TOOL REVIEW.
//
// Designed as a ROW even though Phase 1 never sends it to a server. When the
// staffroom lands and schools have real accounts, this becomes the table and
// the storage adapter swaps; nothing in the framework or the UI has to change.
// That is why every field is flat, serialisable and free of functions.
//
// It holds no child's name and no pupil data of any kind. A school records what
// it found out about a PRODUCT. The schools app has never held personal data
// (schools/lib/access.ts) and this feature does not become the first thing to.

export type SectionKey =
  | 'purpose'
  | 'data'
  | 'memory'
  | 'relationship'
  | 'safeguarding'
  | 'oversight'
  | 'learning'
  | 'age'
  | 'transparency'
  | 'security'

// The eight things a school gets a rating on. Deliberately not one score:
// a product can be excellent on data and wrong for children on relationship
// design, and a single number hides exactly that.
export type CategoryKey =
  | 'data'
  | 'safeguarding'
  | 'relationship'
  | 'learning'
  | 'transparency'
  | 'oversight'
  | 'age'
  | 'security'

export type Rating = 'green' | 'amber' | 'red' | 'unknown'

export type OverallStatus =
  | 'approve'
  | 'approve-with-conditions'
  | 'review-required'
  | 'do-not-deploy-yet'

// What kind of thing this is. The brief is right that not every conversational
// product is a companion, and treating them as one would make the whole tool
// easy to dismiss.
export type ProductType = 'assistant' | 'tutor' | 'coach' | 'character' | 'companion' | 'unclassified'

export type Facing = 'pupil' | 'teacher' | 'admin'

export type AnswerValue = 'yes' | 'no' | 'unknown' | 'na'

export type Answer = {
  value?: AnswerValue
  /** Free text, for the questions that are not yes or no. */
  text?: string
  /** Where the school confirmed this: a URL, a page of the DPA, an email. */
  evidence?: string
  /** The school's own working note. */
  note?: string
}

/** One person's sign off. A typed name and a date, which is what a paper DPIA
 *  is too. NOT an authenticated signature: the schools app has no identity, and
 *  labelling this as more than it is would be the dishonest version. */
export type SignOff = {
  name?: string
  date?: string
  note?: string
}

/** A snapshot kept when a school reassesses, so "what changed" is answerable.
 *  Written by the school, never inferred from a provider: this product does not
 *  watch vendors and must never claim a change it has not been told about. */
export type ReviewVersion = {
  at: string
  summary: string
  statusWas: OverallStatus | null
}

export type Review = {
  id: string
  // Section 1, the identity of the thing
  product: string
  provider: string
  url: string
  purpose: string
  problem: string
  alternative: string
  yearGroups: string[]
  owner: string
  facing: Facing | null
  required: boolean | null
  productType: ProductType

  answers: Record<string, Answer>

  signOff: {
    dpo: SignOff
    dsl: SignOff
    slt: SignOff
    governors: SignOff
  }

  reviewedOn: string | null
  nextReviewOn: string | null
  /** Set when the school decides; never computed behind their back. */
  decision: OverallStatus | null
  conditions: string
  history: ReviewVersion[]

  createdAt: string
  updatedAt: string
}

export type CategoryResult = {
  category: CategoryKey
  rating: Rating
  /** Question ids that drove the rating, so a result is always explainable. */
  reasons: { questionId: string; prompt: string; why: string }[]
  answered: number
  total: number
}

export type ReviewResult = {
  categories: CategoryResult[]
  suggested: OverallStatus
  productType: ProductType
  /** How much of the assessment has been filled in at all. */
  progress: { answered: number; total: number }
}
