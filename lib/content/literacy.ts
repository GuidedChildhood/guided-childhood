// The four digital literacy strands, in plain parent words, that the whole
// pathway builds toward 16. One shared source so the Road to 16, the pathway
// page and the lesson tags all name the same four things, never a fifth.
// Lessons carry a curriculum strand or a library category; this maps whichever
// they have onto one of the four, so a parent always sees what a task is
// building.

export type LiteracyKey = 'safe' | 'balance' | 'ai' | 'social'

export const LITERACY_AREAS: Record<LiteracyKey, { name: string; icon: string }> = {
  safe:    { name: 'Safe online', icon: '🛡️' },
  balance: { name: 'Healthy balance', icon: '⚖️' },
  ai:      { name: 'AI and chatbots', icon: '🤖' },
  social:  { name: 'Social media ready', icon: '💬' },
}

// Strand and category words to the four areas, most specific first. Anything
// that does not match returns null, so we simply show no tag rather than a
// wrong one.
const MATCHERS: [RegExp, LiteracyKey][] = [
  [/\bai\b|chatbot|misinformation|deepfake|algorithm|what is real/i, 'ai'],
  [/social|identity|influencer|follower|money|spend|scam/i, 'social'],
  [/privacy|safety|safe|kindness|kind|stranger|risk|online_risk|report/i, 'safe'],
  [/screen|balance|body|bodies|sleep|feeling|wellbeing|mood|gaming|habit/i, 'balance'],
]

export function literacyAreaFor(value: string | null | undefined): { key: LiteracyKey; name: string; icon: string } | null {
  if (!value) return null
  for (const [re, key] of MATCHERS) {
    if (re.test(value)) return { key, ...LITERACY_AREAS[key] }
  }
  return null
}
