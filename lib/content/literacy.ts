// The four digital literacy strands, in plain parent words, that the whole
// pathway builds toward 16. One shared source so the Road to 16, the pathway
// page, the passport and the lesson tags all name the same four things, never
// a fifth. Lessons carry a curriculum strand or a library category; this maps
// whichever they have onto one of the four, so a parent always sees what a
// task is building.

export type LiteracyKey = 'safe' | 'balance' | 'ai' | 'social'

export const LITERACY_AREAS: Record<LiteracyKey, { name: string; icon: string }> = {
  safe:    { name: 'Safe online', icon: '🛡️' },
  balance: { name: 'Healthy balance', icon: '⚖️' },
  ai:      { name: 'AI and chatbots', icon: '🤖' },
  social:  { name: 'Social media ready', icon: '💬' },
}

/** The four, in the order every surface prints them. */
export const AREA_ORDER: LiteracyKey[] = ['safe', 'balance', 'ai', 'social']

// ── WHEN EACH AREA STARTS, DECLARED ONCE ────────────────────────────────────
//
// The passport audit of 13 September 2026 found this rule written four times
// (the four things card, the pathway page, the road, the is it working
// report), and three of them said AI comes at 11 while the lessons hub was
// offering "What is AI?" to a five year old. The product has AI modules for
// every age band from 4 to 7 up, so AI starts on page one. The algorithm and
// feed conversation still lands in the Explorer stage, where the Orben and
// Odgers window puts it, through that stage's own lessons. Social media
// readiness stays at 11: the judgement is built before any account exists,
// and there is nothing for a six year old to be ready for yet.
export const AREA_START: Record<LiteracyKey, number> = { safe: 1, balance: 1, ai: 1, social: 3 }

// Strand and category words to the four areas, most specific first.
//
// EVERY CATEGORY IN THE LIBRARY LANDS SOMEWHERE. Before 13 September 2026
// five of them matched nothing (bullying, information, ownership,
// relationships, reputation), which was 36 lessons, about a third of the
// library, counting toward none of the four things a family is told they are
// building. And `ai_safety` fell through to Safe because an underscore is a
// word character, so \bai\b never matched it.
//
// Where the five landed, and why:
//   information   AI and chatbots. "Real or pretend?", "Is seeing believing?",
//                 "Deepfakes and doctored truth", "Why the feed agrees with
//                 you": telling what is real is that area's own promise.
//   bullying      Safe online, beside kindness and reporting.
//   relationships Social media ready: friends you know, group chats, pressure.
//   reputation    Social media ready: think before you post, the footprint.
//   ownership     Social media ready: making, sharing and owning your work.
//
// Anything that still matches nothing returns null, so a surface shows no tag
// rather than a wrong one, and scripts/check-readiness-areas.mjs holds the
// list of known categories against this function.
const MATCHERS: [RegExp, LiteracyKey][] = [
  [/(^|[^a-z])ai([^a-z]|$)|chatbot|misinformation|deepfake|algorithm|what is real|information|news|advert/i, 'ai'],
  [/social|identity|influencer|follower|money|spend|scam|relationship|reputation|ownership|footprint/i, 'social'],
  [/privacy|safety|safe|kindness|kind|stranger|risk|online_risk|report|bully/i, 'safe'],
  [/screen|balance|body|bodies|sleep|feeling|wellbeing|mood|gaming|habit/i, 'balance'],
]

export function literacyAreaFor(value: string | null | undefined): { key: LiteracyKey; name: string; icon: string } | null {
  if (!value) return null
  for (const [re, key] of MATCHERS) {
    if (re.test(value)) return { key, ...LITERACY_AREAS[key] }
  }
  return null
}
