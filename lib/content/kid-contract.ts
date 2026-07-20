import { CLAUSES_BY_TYPE } from './agreement-clauses'

// The age based timer contract the child agrees on their first run. One
// screen, one rule in their own words, one big I agree. The rule steps up
// with age: a grown up runs it for the youngest, a grown up says yes first
// in the middle years, and from eleven the child starts it themselves and
// it winds up at the healthy amount. Acceptance locks in on kid_links
// (agreed_at, agreed_level) so both sides of the family can read it, and
// DiGi's context can read the same columns later.

export type ContractLevel = 'under8' | '8to10' | '11plus'

export function contractLevelFor(ageBand: string | null | undefined): ContractLevel {
  if (ageBand === '4-7') return 'under8'
  if (ageBand === '8-10') return '8to10'
  return '11plus'
}

export function isContractLevel(v: unknown): v is ContractLevel {
  return v === 'under8' || v === '8to10' || v === '11plus'
}

// The one rule, by age, in child words. No dashes, ever.
export const CONTRACT_RULES: Record<ContractLevel, string> = {
  under8: 'A grown up starts my timer, and screens go off calmly',
  '8to10': 'Every screen runs through my timer. A grown up says yes first',
  '11plus': 'Every screen runs through my timer. I start it myself and it winds up at the healthy amount',
}

// The supporting promises come straight from the agreement clauses the
// family builder already uses, so the contract wording is wired, never
// invented twice.
function clauseOption(key: string, index = 0): string | null {
  for (const list of Object.values(CLAUSES_BY_TYPE)) {
    const clause = list.find(c => c.key === key)
    if (clause) return clause.options[index] ?? null
  }
  return null
}

export function contractPromises(level: ContractLevel): { emoji: string; text: string }[] {
  const promises: { emoji: string; text: string }[] = []
  const earn = clauseOption('earn-time')
  if (earn) promises.push({ emoji: '⭐', text: earn })
  if (level === 'under8') {
    const off = clauseOption('screens-off')
    if (off) promises.push({ emoji: '🌙', text: off })
  }
  const wrong = clauseOption('when-wrong')
  if (wrong) promises.push({ emoji: '💛', text: wrong })
  return promises
}
