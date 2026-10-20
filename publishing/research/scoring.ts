// THE EDITORIAL SCORE, out of 100.
//
// An editorial ranking, not a rating of the science. It answers "which of
// these stories should a family read this month", and a story can score well
// here while its evidence is only a press release, which is why evidence has
// its own 25 points and why VERIFICATION is a separate gate: a story that
// scores 95 and cannot be verified still never prints (validate.ts rule 3).
//
//   Relevance to Guided Childhood   25   does it show the good side of screens
//                                        and build judgement, our thesis?
//   Evidence quality                25   primary source, study design, numbers
//   Curiosity and interest          20   would an 8 year old want to read it?
//   Practical family value          15   is there something to do?
//   Visual storytelling potential   10   can we draw it without a photo?
//   Timeliness                       5   is it this month's news?
//
// Each criterion is scored by the researcher (a model or a person) on its own
// scale. The weights live here and nowhere else.

export const WEIGHTS = {
  relevance: 25,
  evidence: 25,
  curiosity: 20,
  family: 15,
  visual: 10,
  timeliness: 5,
} as const

export type Criterion = keyof typeof WEIGHTS
export type Scores = Record<Criterion, number>

// The evidence points a story's source type earns before any judgement, so
// two researchers start from the same floor. A peer reviewed systematic review
// can still lose points for a weak population match; a press release can
// never earn the top band.
export const EVIDENCE_CEILING: Record<string, number> = {
  'systematic review': 25,
  'peer reviewed study': 22,
  'official report': 20,
  'official programme page': 18,
  'educational resource': 15,
  'press release': 15,
  'news report': 10,
}

export function total(s: Scores): number {
  let sum = 0
  for (const k of Object.keys(WEIGHTS) as Criterion[]) {
    const v = s[k]
    if (!Number.isFinite(v) || v < 0 || v > WEIGHTS[k]) throw new Error(`${k} must be between 0 and ${WEIGHTS[k]}, got ${v}`)
    sum += v
  }
  return sum
}

export type Candidate = {
  id: string
  headline: string                 // proposed, never presented as verified
  category: string
  source: { org: string; url: string; published?: string; evidence: string }
  researched: string               // ISO date
  summary: string
  ageRelevance: string
  numericalClaims: { claim: string; quote?: string; verified: boolean }[]
  limitations: string
  conflictingEvidence?: string
  imagePermissions: string
  recommendation: 'lead' | 'include' | 'brief' | 'hold' | 'reject'
  verification: 'verified' | 'flagged' | 'unverified'
  scores: Scores
  total?: number
  page?: number                    // where it landed in the issue, if it did
  note?: string
}

// Rank, and refuse a candidate whose evidence score claims more than its
// source type allows. Repetition against earlier issues costs points rather
// than excluding, because a returning story with new facts is legitimate.
export function rank(cands: Candidate[], previousHeadlines: string[] = []): Candidate[] {
  const seen = previousHeadlines.map(norm)
  return cands.map(c => {
    const ceiling = EVIDENCE_CEILING[c.source.evidence] ?? 10
    if (c.scores.evidence > ceiling) throw new Error(`${c.id}: evidence ${c.scores.evidence} is over the ${ceiling} a ${c.source.evidence} can earn`)
    const repeat = seen.some(h => overlap(h, norm(c.headline)) > 0.6)
    const t = total(c.scores) - (repeat ? 10 : 0)
    return { ...c, total: t, note: repeat ? [c.note, 'Close to a headline in an earlier issue: minus 10.'].filter(Boolean).join(' ') : c.note }
  }).sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
}

// The recommendation the founder sees at Approval One: the strongest five to
// seven verified stories, at most two from one category.
export function shortlist(ranked: Candidate[], max = 7): Candidate[] {
  const out: Candidate[] = []
  const perCat = new Map<string, number>()
  for (const c of ranked) {
    if (c.verification !== 'verified' || c.recommendation === 'reject' || c.recommendation === 'hold') continue
    if ((perCat.get(c.category) ?? 0) >= 2) continue
    out.push(c)
    perCat.set(c.category, (perCat.get(c.category) ?? 0) + 1)
    if (out.length === max) break
  }
  return out
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3)
function overlap(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0
  const A = new Set(a)
  return b.filter(w => A.has(w)).length / Math.min(a.length, b.length)
}
