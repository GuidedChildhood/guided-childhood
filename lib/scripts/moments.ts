// WHAT IS HAPPENING RIGHT NOW: the eight moments the scripts page opens on.
//
// Justin, 18 November 2026: "a super easy system of scripts that really helps
// the parents". The research behind it (plans/2026-11-18-scripts-system.md):
// a stressed parent finds help by the moment they are in, not by topic
// (Headspace SOS, Calm, Good Inside all organise this way), and the old page
// opened on a grid of identical cards tagged with one category.
//
// So every script is filed under one moment by its own words: the title and
// the situation, read in a fixed order so the most time critical moments win
// (a bedtime phone script is a bedtime script). The category is the fallback.
// Pure, so it is tested without a database (moments.test.ts). Scripts stay in
// the database (non negotiable 6); this only sorts them.

export type MomentKey =
  | 'turning-off' | 'bedtime' | 'mornings' | 'meals'
  | 'siblings' | 'online' | 'phone' | 'feelings'

export type Moment = { key: MomentKey; label: string; emoji: string; tint: string; hint: string }

export const MOMENTS: Moment[] = [
  { key: 'turning-off', label: 'Turning it off', emoji: '⏰', tint: 'var(--stage-1)', hint: 'Time is up and they will not stop' },
  { key: 'bedtime', label: 'Bedtime', emoji: '🌙', tint: 'var(--stage-3)', hint: 'Screens, sleep and one more video' },
  { key: 'mornings', label: 'School mornings', emoji: '🎒', tint: 'var(--stage-2)', hint: 'Getting out of the door' },
  { key: 'meals', label: 'Mealtimes', emoji: '🍽️', tint: 'var(--tint-sage)', hint: 'Phones and the table' },
  { key: 'siblings', label: 'Brothers and sisters', emoji: '🤝', tint: 'var(--stage-5)', hint: 'Sharing, turns and fairness' },
  { key: 'phone', label: 'The phone ask', emoji: '📱', tint: 'var(--stage-4)', hint: 'Everyone else has one' },
  { key: 'online', label: 'Something online', emoji: '🛡️', tint: 'var(--tint-blue, var(--stage-3))', hint: 'Seen, sent or said online' },
  { key: 'feelings', label: 'Big feelings', emoji: '💛', tint: 'var(--tint-butter, var(--stage-1))', hint: 'Meltdowns, moods and slammed doors' },
]

// Read in this order: the first that matches wins.
const RULES: [MomentKey, RegExp][] = [
  ['online', /stranger|someone they do not know|upsetting|scary|seen something|unkind|bull(y|ied|ying)|deepfake|nude|sent (a|an) (photo|picture|image)|scam|groom/i],
  ['bedtime', /\bbed(time)?\b|\bnight\b|sleep|wake|late night|tablet in (the )?bedroom/i],
  ['turning-off', /turn(ing)? (it )?off|switch(ing)? (it )?off|five more|time is up|time'?s up|screen time is up|one more (video|episode|game)|binge|end of (a |the )?session|hand(ing)? (it )?back|stop(ping)? (the )?(game|screen)|not finished/i],
  ['mornings', /morning|before school|school run|getting ready|late for school|out of the door/i],
  ['meals', /\bmeals?\b|dinner|\btable\b|breakfast|\beat(ing)?\b|food/i],
  ['siblings', /sibling|brother|sister|younger|older child|sharing|share the/i],
  ['phone', /\bphone\b|everyone else has|first device|smartphone|whatsapp|group chat|social media|tiktok|snapchat|instagram|roblox/i],
  ['feelings', /meltdown|tantrum|angry|anger|cross|upset|\bsad\b|mood|tears|cry|slam|rage|frustrat|lonely|left out|anxious|worried|confidence/i],
]

const BY_CATEGORY: Record<string, MomentKey> = {
  'screen-time': 'turning-off',
  'gaming': 'turning-off',
  'social-media': 'phone',
  'staying-safe': 'online',
  'mood-confidence': 'feelings',
  'family-rules': 'phone',
  'everyday-routines': 'mornings',
}

/** The moment a script belongs to, or null if none fits (it stays in the list below). */
export function momentFor(s: { title: string; situation?: string | null; category?: string | null }): MomentKey | null {
  const text = `${s.title} ${s.situation ?? ''}`
  for (const [key, re] of RULES) if (re.test(text)) return key
  return (s.category && BY_CATEGORY[s.category]) || null
}
