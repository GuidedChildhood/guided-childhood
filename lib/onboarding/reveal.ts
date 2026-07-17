// Stage the reveal. A new account meets a one loop Home first, and the rest of
// the platform is introduced by DiGi one calm card at a time over the first
// fortnight, so the first run is simple and the depth arrives as the parent is
// ready for it. A soft reveal only: nothing is ever hard locked, the tab bar
// always works, this only controls what Home promotes. Driven by account age, so
// no migration is needed, and an established account (or an unknown age) sees
// everything, exactly as before.

export type RevealKey = 'core' | 'moments' | 'lessons' | 'pathway' | 'wellbeing'

export type Reveal = {
  key: Exclude<RevealKey, 'core'>
  day: number
  emoji: string
  title: string
  body: string
  href: string
}

// The schedule. Core is always on (the daily loop and quests). The rest unlock
// on these days since signup, each announced once by a DiGi card.
export const REVEALS: Reveal[] = [
  { key: 'moments', day: 3, emoji: '💬', title: 'The words for any hard moment', body: 'When a screen goes off and it all kicks off, tap Help now and DiGi hands you exactly what to say, and what not to.', href: '/dashboard/moments' },
  { key: 'lessons', day: 6, emoji: '📚', title: 'Lessons and printables', body: 'Five minute things to watch and make together, all earning stars. A gentle way to learn about their world.', href: '/dashboard/lessons' },
  { key: 'pathway', day: 9, emoji: '🪪', title: 'Your pathway to 16', body: 'The whole point: a gentle on ramp so 16 is a ramp, not a cliff edge. See where your child is now.', href: '/dashboard/pathway' },
  { key: 'wellbeing', day: 12, emoji: '💛', title: 'Your weekly round up and check in', body: 'DiGi reads your week and, on a Sunday, checks in on how you are doing. The balance, made visible.', href: '/dashboard/pathway' },
]

export function daysSince(iso: string | null | undefined): number {
  if (!iso) return 999 // unknown age reveals everything, so nothing regresses
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return 999
  return Math.floor((Date.now() - t) / 86_400_000)
}

// The keys unlocked at this account age. Core is always in.
export function revealedKeys(accountAgeDays: number): Set<RevealKey> {
  const keys = new Set<RevealKey>(['core'])
  for (const r of REVEALS) if (accountAgeDays >= r.day) keys.add(r.key)
  return keys
}

// The reveals that are eligible now, in order, so the card can announce the next
// one the parent has not met yet (the seen check is client side, localStorage).
export function eligibleReveals(accountAgeDays: number): Reveal[] {
  return REVEALS.filter(r => accountAgeDays >= r.day)
}
