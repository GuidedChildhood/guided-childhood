// Which counted situation a message sits in, guessed cheaply from its words.
//
// getRatedForSituation in lib/digi/outcomes.ts was built with migration 147
// and then never called: the cross family ledger of what parents said worked
// sat fully indexed with zero readers. The blocker was honest, retrieval
// needs a topic and the topics are a closed slug list the MODEL fills in when
// it schedules a follow up, and nothing at question time produced one.
//
// This is that producer. Keywords only, no model call, because it runs on
// every message and a wrong topic costs one irrelevant context block that the
// prompt already tells DiGi to ignore when it does not fit. The slugs MUST
// stay the exact list in the schedule_followup tool schema (lib/digi/tools.ts)
// or the eq('topic', ...) match silently returns nothing forever.

// No imports on purpose, like checkin-dips.ts: the check script runs this
// file under node --experimental-strip-types, which resolves neither the @
// alias nor extensionless relative imports. The types below mirror Situation
// and TimeBand in lib/digi/outcomes.ts, and scripts/check-checkin-shifts.mjs
// asserts the two vocabularies still agree on every run.

export type InferredTimeBand = 'morning' | 'after_school' | 'evening' | 'bedtime' | 'weekend' | 'any'
export type InferredSituation = { topic: string | null; time_band: InferredTimeBand | null; trigger: string | null }

// Ordered: first hit wins, so the more specific topics sit above the broad
// ones (social_media before devices, gaming before screen_time).
const TOPIC_KEYWORDS: [string, string[]][] = [
  ['social_media', ['tiktok', 'instagram', 'snapchat', 'social media', 'whatsapp', 'youtube', 'influencer', 'followers', 'group chat']],
  ['gaming', ['fortnite', 'roblox', 'minecraft', 'gaming', 'video game', 'console', 'xbox', 'playstation', 'switch']],
  ['sleep', ['sleep', 'bedtime', 'tired', 'wake', 'night', 'melatonin']],
  ['anxiety', ['anxious', 'anxiety', 'panic', 'worried sick', 'stressed']],
  ['mood', ['mood', 'angry', 'meltdown', 'tantrum', 'upset', 'sad', 'withdrawn', 'irritable']],
  ['safety', ['stranger', 'groom', 'predator', 'unsafe', 'sextortion', 'nudes', 'bullied', 'bullying']],
  ['school', ['school', 'homework', 'teacher', 'classroom', 'exam']],
  ['siblings', ['sibling', 'brother', 'sister']],
  ['friendship', ['friend', 'friendship', 'left out', 'fell out']],
  ['ai', [' ai ', 'chatgpt', 'chatbot', 'deepfake', 'artificial intelligence']],
  ['content', ['content', 'videos', 'watching', 'inappropriate']],
  ['routines', ['routine', 'morning', 'after school', 'getting ready']],
  ['screen_time', ['screen time', 'screen', 'too long', 'come off', 'switch off', 'limit']],
  ['devices', ['phone', 'tablet', 'ipad', 'device', 'laptop']],
]

const TIME_KEYWORDS: [InferredTimeBand, string[]][] = [
  ['morning', ['morning', 'before school', 'breakfast', 'school run']],
  ['after_school', ['after school', 'home from school', 'afternoon']],
  ['bedtime', ['bedtime', 'before bed', 'lights out', 'night']],
  ['evening', ['evening', 'dinner', 'tea time', 'tonight']],
  ['weekend', ['weekend', 'saturday', 'sunday', 'holidays']],
]

export function inferSituation(message: string): InferredSituation {
  const m = ` ${message.toLowerCase()} `

  let topic: string | null = null
  for (const [slug, words] of TOPIC_KEYWORDS) {
    if (words.some(w => m.includes(w))) {
      topic = slug
      break
    }
  }

  let timeBand: InferredTimeBand | null = null
  for (const [band, words] of TIME_KEYWORDS) {
    if (words.some(w => m.includes(w))) {
      timeBand = band
      break
    }
  }

  return { topic, time_band: timeBand, trigger: null }
}
