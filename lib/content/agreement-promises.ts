import { AGREEMENT_TYPES, CLAUSES_BY_TYPE, recommendedType, type Clause } from './agreement-clauses'

// The promises of a saved agreement, as one list every reader shares.
//
// Justin, 14 September 2026, reviewing the agreement: the print outs should
// be "super top design", "tie in, wired in with children", "live on both apps
// for referring to" and match "best science by age". Three readers built the
// promises three ways: the child's app from the legacy text columns, the
// parent's fridge print from six paragraphs, and the child's fridge sheet
// from nothing at all (it printed the jobs and the timer rule and never read
// the agreement). One reader now, from the structured clauses when a family
// has them (migration 034) and from the legacy columns for anyone older, and
// it carries each clause's icon, its science line and its question, so every
// surface can say the same promise with the same why.

export type Promise_ = {
  key: string
  emoji: string
  title: string
  body: string
  /** The science in one line, from the clause. */
  why: string | null
  /** The question the family asked at the table, for the print. */
  talk: string | null
}

export type AgreementRowLike = {
  agreement_type?: string | null
  clauses?: Record<string, string> | null
  family_values?: string | null
  bedroom_rule_time?: string | null
  bedroom_rule_location?: string | null
  social_media_terms?: string | null
  when_things_go_wrong?: string | null
  extra_agreements?: string | null
}

// One icon per clause, the same on the app, the sheet and the builder.
export const CLAUSE_EMOJI: Record<string, string> = {
  'screens-off': '🌙',
  'device-sleep': '🔌',
  'ask-first': '🙋',
  'when-wrong': '💛',
  'earn-time': '⭐',
  'meals': '🍽️',
  'money': '💷',
  'answer-call': '📞',
  'kindness': '🤝',
  'social-apps': '📱',
  'keep-talking': '💬',
}

const ALL_CLAUSES: Clause[] = Object.values(CLAUSES_BY_TYPE).flat()
  .filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i)

function clauseByKey(key: string): Clause | undefined {
  return ALL_CLAUSES.find(c => c.key === key)
}

function clauseByTitle(title: string): Clause | undefined {
  return ALL_CLAUSES.find(c => c.title === title)
}

/** The promises of a saved row. Empty for no row. */
export function promisesFrom(row: AgreementRowLike | null | undefined): Promise_[] {
  if (!row) return []
  const out: Promise_[] = []
  const add = (c: Clause | undefined, fallbackTitle: string, body: string | null | undefined, keyHint?: string) => {
    const text = (body ?? '').trim()
    if (!text) return
    const key = c?.key ?? keyHint ?? fallbackTitle.toLowerCase().replace(/[^a-z]+/g, '-')
    if (out.some(p => p.key === key)) return
    out.push({
      key,
      emoji: CLAUSE_EMOJI[key] ?? '🤝',
      title: c?.title ?? fallbackTitle,
      body: text,
      why: c?.why ?? null,
      talk: c?.talk ?? null,
    })
  }

  // Structured first: every clause the family picked, in the order of its
  // type's list, so the sheet reads the way the builder read.
  const clauses = row.clauses && typeof row.clauses === 'object' ? row.clauses : null
  if (clauses && Object.keys(clauses).length > 0) {
    const order = CLAUSES_BY_TYPE[row.agreement_type ?? ''] ?? ALL_CLAUSES
    for (const c of order) {
      const picked = clauses[c.key]
      if (typeof picked === 'string' && picked.trim()) add(c, c.title, picked)
    }
    // Anything picked outside the type's list (a family who changed type).
    for (const [key, picked] of Object.entries(clauses)) {
      if (!out.some(p => p.key === key) && typeof picked === 'string') add(clauseByKey(key), key, picked, key)
    }
    return out
  }

  // Legacy text columns, for agreements saved before the clauses existed.
  add(clauseByKey('screens-off'), 'When screens go off at night', row.bedroom_rule_time)
  add(clauseByKey('device-sleep'), 'Where devices sleep', row.bedroom_rule_location)
  add(clauseByKey('social-apps'), 'Apps and social media', row.social_media_terms)
  add(clauseByKey('when-wrong'), 'If something goes wrong', row.when_things_go_wrong)
  for (const line of (row.extra_agreements ?? '').split('\n').map(l => l.trim()).filter(Boolean)) {
    const i = line.indexOf(':')
    if (i > 0) {
      const title = line.slice(0, i).trim()
      add(clauseByTitle(title), title, line.slice(i + 1).trim())
    } else {
      add(undefined, 'Our extra promise', line)
    }
  }
  return out
}

/** The label of the agreement's type, for a heading. */
export function agreementTypeLabel(typeKey: string | null | undefined): string | null {
  return AGREEMENT_TYPES.find(t => t.key === typeKey)?.label ?? null
}

// ── OUTGROWN: THE DEAL WAS WRITTEN FOR A YOUNGER CHILD ───────────────────────
//
// Justin: "we refer to regularly, advise of needing updating". A deal signed
// at six is the wrong deal at nine, and nothing noticed the child moving on.
// True when the agreement's type is a stage or more BEHIND the child's stage.
// Ahead is fine: a family who chose the phone deal early knew what they were
// doing. Null type (a legacy row) is never outgrown, because we cannot tell.
const TYPE_ORDER = AGREEMENT_TYPES.map(t => t.key)

export function dealOutgrown(agreementType: string | null | undefined, stageId: string | null | undefined): boolean {
  if (!agreementType || !stageId) return false
  const have = TYPE_ORDER.indexOf(agreementType)
  const want = TYPE_ORDER.indexOf(recommendedType(stageId))
  if (have < 0 || want < 0) return false
  return have < want
}
