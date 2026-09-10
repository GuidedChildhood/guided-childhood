// FROM ANSWERS TO A RESULT, AND NEVER TO A SINGLE NUMBER.
//
// Eight categories, each rated on its own, because the failure mode of every
// procurement checklist is a composite score that lets a strong data answer pay
// for a weak safeguarding one. A product can be spotless on retention and wrong
// for children on relationship design, and a school needs to see both.
//
// UNKNOWN IS A REAL STATE. An unanswered question is not green. Most checklists
// quietly treat silence as fine, which is how a review passes on the strength of
// the questions somebody happened to get round to.

import type { Question } from './questions'
import type {
  Answer, CategoryKey, CategoryResult, OverallStatus, ProductType, Rating, Review, ReviewResult,
} from './types'

export const CATEGORIES: { key: CategoryKey; title: string; blurb: string }[] = [
  { key: 'data', title: 'Data', blurb: 'What is collected, kept and deletable' },
  { key: 'safeguarding', title: 'Safeguarding', blurb: 'What happens when it matters' },
  { key: 'relationship', title: 'Relationship design', blurb: 'Tool or friend' },
  { key: 'learning', title: 'Learning independence', blurb: 'Better, or just faster' },
  { key: 'transparency', title: 'Transparency', blurb: 'Who has been told what' },
  { key: 'oversight', title: 'Human oversight', blurb: 'What a person still decides' },
  { key: 'age', title: 'Readiness', blurb: 'Age, stage and what was taught' },
  { key: 'security', title: 'Security and control', blurb: 'Accounts, audit, off switch' },
]

/** The three a child facing product cannot be left unknown on. */
const CHILD_CRITICAL: CategoryKey[] = ['data', 'safeguarding', 'relationship']

const isPupilFacing = (r: Review) => r.facing === 'pupil'

/** The questions that apply to this review. Passed in rather than imported so
 *  this module holds no runtime dependency on the question set: it can be
 *  tested on its own, and a caller can rate a subset without the whole file
 *  coming with it. */
const applicable = (review: Review, questions: Question[]): Question[] =>
  questions.filter(q => isPupilFacing(review) || !q.pupilOnly)

function answered(a: Answer | undefined): boolean {
  if (!a) return false
  if (a.value && a.value !== 'unknown') return true
  if (a.value === 'unknown') return true // an explicit "we could not find out" is an answer
  return Boolean(a.text && a.text.trim())
}

export function rateCategory(review: Review, category: CategoryKey, questions: Question[]): CategoryResult {
  const qs = applicable(review, questions).filter(q => q.category === category)
  const reasons: CategoryResult['reasons'] = []
  let material = false
  let clarify = false
  let unanswered = 0
  let answeredCount = 0

  for (const q of qs) {
    const a = review.answers[q.id]
    if (a?.value === 'na') { answeredCount += 1; continue }
    if (!answered(a)) { unanswered += 1; continue }
    answeredCount += 1

    if (q.concernWhen && a?.value === q.concernWhen) {
      if (q.weight === 'material') {
        material = true
        reasons.push({ questionId: q.id, prompt: q.prompt, why: 'Material concern' })
      } else {
        clarify = true
        reasons.push({ questionId: q.id, prompt: q.prompt, why: 'Needs a decision or a mitigation' })
      }
    }
  }

  let rating: Rating
  if (material) rating = 'red'
  else if (clarify) rating = 'amber'
  else if (unanswered > 0) rating = 'unknown'
  else rating = 'green'

  if (rating === 'unknown' && !reasons.length) {
    reasons.push({
      questionId: '', prompt: `${unanswered} question${unanswered === 1 ? '' : 's'} still open`,
      why: 'Not yet answered',
    })
  }

  return { category, rating, reasons, answered: answeredCount, total: qs.length }
}

export function overallStatus(categories: CategoryResult[]): OverallStatus {
  if (categories.some(c => c.rating === 'red')) return 'do-not-deploy-yet'
  if (categories.some(c => c.rating === 'unknown')) return 'review-required'
  if (categories.some(c => c.rating === 'amber')) return 'approve-with-conditions'
  return 'approve'
}

/** What the product looks like from its own answers. The school's explicit
 *  choice always wins: this is a prompt to think, not a verdict. */
export function classify(review: Review): { suggested: ProductType; why: string } {
  const yes = (id: string) => review.answers[id]?.value === 'yes'

  if (yes('r-friendship') || yes('r-affection') || yes('r-confidant')) {
    return {
      suggested: 'companion',
      why: 'It simulates friendship, expresses affection or positions itself as a confidant.',
    }
  }
  if (yes('r-persistent-identity') || yes('r-personal-questions')) {
    return {
      suggested: 'character',
      why: 'It carries a persistent character or asks children about themselves.',
    }
  }
  if (review.productType && review.productType !== 'unclassified') {
    return { suggested: review.productType, why: 'As recorded by the school.' }
  }
  return { suggested: 'unclassified', why: 'Not enough answered yet to tell.' }
}

export function assess(review: Review, questions: Question[]): ReviewResult {
  const categories = CATEGORIES.map(c => rateCategory(review, c.key, questions))
  const qs = applicable(review, questions)
  const answeredTotal = qs.filter(q => answered(review.answers[q.id]) || review.answers[q.id]?.value === 'na').length

  return {
    categories,
    suggested: overallStatus(categories),
    productType: classify(review).suggested,
    progress: { answered: answeredTotal, total: qs.length },
  }
}

export const STATUS_LABEL: Record<OverallStatus, string> = {
  'approve': 'Approve',
  'approve-with-conditions': 'Approve with conditions',
  'review-required': 'Review required',
  'do-not-deploy-yet': 'Do not deploy yet',
}

export const RATING_LABEL: Record<Rating, string> = {
  green: 'Low concern',
  amber: 'Needs a decision',
  red: 'Material concern',
  unknown: 'Not established',
}

/** Categories a school should look at first: worst rating, then child critical. */
export function priorityOrder(categories: CategoryResult[]): CategoryResult[] {
  const rank: Record<Rating, number> = { red: 0, unknown: 1, amber: 2, green: 3 }
  return [...categories].sort((a, b) => {
    if (rank[a.rating] !== rank[b.rating]) return rank[a.rating] - rank[b.rating]
    const aCrit = CHILD_CRITICAL.includes(a.category) ? 0 : 1
    const bCrit = CHILD_CRITICAL.includes(b.category) ? 0 : 1
    return aCrit - bCrit
  })
}
