// Shared by the Scripts page and its library view (moved out of page.tsx on
// 17 November 2026 so the view can be drawn from fixtures).

// The eight the library actually uses, after migration 149 collapsed fourteen
// values plus a source label into a vocabulary a parent can scan.
//
// "Everyday routines" is the one Justin did not ask for and it earned its
// place: filing the 59 daily moments by hand turned up 24 with no device in
// them at all, from teeth brushing to a sibling being unkind to a good day
// worth noticing. Every other chip here is a digital topic, so those 24 had
// nowhere honest to go.
export const CATEGORY_META: Record<string, {
  label: string
  description: string
  bg: string
  border: string
  accent: string
}> = {
  'screen-time':       { label: 'Screen time',        description: 'Handovers, standoffs, and the routines that stop the daily argument.',      bg: 'var(--stage-1)', border: 'var(--stage-1)', accent: 'var(--terracotta)' },
  'social-media':      { label: 'Social media',       description: 'Platforms, algorithms, comparison, and who they are becoming online.',      bg: 'var(--stage-3)', border: 'var(--stage-3)', accent: 'var(--terracotta)' },
  'gaming':            { label: 'Gaming',             description: 'Healthy gaming conversations without the battle.',                          bg: 'var(--stage-2)', border: 'var(--stage-2)', accent: 'var(--terracotta)' },
  'staying-safe':      { label: 'Staying safe',       description: 'What to say when something goes wrong online, from a group chat to worse.', bg: 'var(--stage-4)', border: 'var(--stage-4)', accent: 'var(--terracotta)' },
  'mood-confidence':   { label: 'Mood and confidence',description: 'Low moods, body image, and who they think they are.',                       bg: 'var(--stage-4)', border: 'var(--stage-4)', accent: 'var(--terracotta)' },
  'family-rules':      { label: 'Family rules',       description: 'First devices, other parents, siblings, and the deals you make together.',  bg: 'var(--stage-2)', border: 'var(--stage-2)', accent: 'var(--terracotta)' },
  'school-and-ai':     { label: 'School and AI',      description: 'Homework, deepfakes, AI tools, and what is real.',                          bg: 'var(--stage-5)', border: 'var(--stage-5)', accent: 'var(--terracotta)' },
  'everyday-routines': { label: 'Everyday routines',  description: 'Mornings, meals, siblings and bedtime. No screens involved.',               bg: 'var(--tint-sage)', border: 'var(--tint-sage)', accent: 'var(--terracotta)' },
}

// A contextual icon per script, so a card shows what it is about at a glance
// instead of a generic quote mark. The title wins first (the moment it names),
// then the category, then a warm talk bubble, never a bare quote glyph. Where
// a title matches one of our Higgsfield moment illustrations, the card shows
// that drawn art through BrowseTile's coverUrl instead of an emoji.
// The eight live slugs lead. The older values stay underneath as aliases
// rather than being deleted: migration 149 renames what is in the database
// today, and a row written by an older seed or restored from a backup should
// still get its icon instead of falling through to a bare quote mark.
const CATEGORY_EMOJI: Record<string, string> = {
  'screen-time': '⏰', 'screen time': '⏰',
  'social-media': '💬', 'social media': '💬',
  'gaming': '🎮', 'games': '🎮',
  'staying-safe': '🛡️',
  'mood-confidence': '💛',
  'family-rules': '🤝',
  'school-and-ai': '🤖',
  'everyday-routines': '🏡',
  // Aliases, pre 149.
  'first-device': '📱', 'first device': '📱',
  'safety': '🛡️', 'online-safety': '🛡️', 'online safety': '🛡️',
  'cyberbullying': '🛡️',
  'wellbeing': '💛', 'mental-health': '💛', 'body-image': '💛', 'identity': '💛',
  'screen-habits': '⏰',
  'ai-and-tech': '🤖', 'ai and tech': '🤖', 'ai-technology': '🤖', 'school': '🤖',
  'relationships': '🤝',
  'daily-moments': '🏡', 'daily moments': '🏡',
}
// Keyword to icon, read off the script title, so an everyday battle shows its
// real subject: the console, the toothbrush, the dinner table.
const TITLE_ICON: [RegExp, string][] = [
  [/bed|sleep|night|bath/i, '🌙'],
  [/teeth|brush/i, '🪥'],
  [/morning|wake|get up/i, '🌅'],
  [/tv|telly|watch|video|youtube/i, '📺'],
  [/dinner|meal|eat|food|table|snack/i, '🍽️'],
  [/dress|clothes|uniform|getting dressed/i, '👕'],
  [/school|drop off|pick ?up|homework|bag/i, '🎒'],
  [/console|gaming|game|xbox|playstation|fortnite|roblox|minecraft/i, '🎮'],
  [/phone|device|tablet|ipad|first (device|screen)/i, '📱'],
  [/stranger|online|scam|safe|predator/i, '🛡️'],
  [/screen ?time|screens|more screen/i, '⏰'],
  [/social|friend|message|chat|group/i, '💬'],
  [/ai|deepfake|robot|fake|real/i, '🤖'],
  [/money|spend|buy|purchase|skin/i, '💷'],
  [/bored|boring|nothing to do/i, '🎨'],
]
export function scriptEmoji(category: string, title: string): string {
  const t = (title ?? '').toLowerCase()
  const byTitle = TITLE_ICON.find(([re]) => re.test(t))
  if (byTitle) return byTitle[1]
  return CATEGORY_EMOJI[(category ?? '').toLowerCase()] ?? '💬'
}

export const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
} as const

export type StageId = keyof typeof STAGE_META

export type ScriptRow = {
  id: string
  stage_id: StageId
  title: string
  situation: string
  category: string
  is_free: boolean
  sort_order: number
}
