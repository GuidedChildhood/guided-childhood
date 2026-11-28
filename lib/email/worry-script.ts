// The script for the worry a parent told us about, for the first emails.
//
// Justin, 28 November 2026, after the week's sign ups: every parent who joined
// in sixty days added a child, ticked their worries, and never opened a script.
// The welcome and day 2 emails were the same for everyone (jobs, passport,
// lessons), and none of them used the worries the parent had just given us.
// So both emails now open with the words for the parent's own worry: "You told
// us X is the hard one. Here are the words for tonight", the script's say line,
// and a button to it.
//
// WHY A HAND PICKED LIST AND NOT THE MATCHER. lib/digi/script-match got about
// two thirds of these right when checked against the live library on 28
// November, and the misses were the kind a parent notices: "Coming off screens"
// at explorer came back as a homework script, "Social media" at shaper as a
// script about radicalisation. A first email cannot afford a near miss, so each
// worry names its scripts by title, one per stage where the library has one.
// Titles, not sort orders, because titles are what the proof lists across the
// product already key on (lib/content/device-issues.ts) and a missing title
// simply falls through to the next one. A worry the parent typed in their own
// words still goes through the matcher, weighted to their child's stage.

import { matchScripts, type MatchableScript } from '@/lib/digi/script-match'

export type EmailScript = MatchableScript & { stage_id: string | null; say_this: string | null }
export type EmailConcern = { slug: string; label: string; status?: string | null; times_flagged?: number | null }
export type WorryScript = { worry: string; title: string; sayThis: string; sortOrder: number }

const STAGE_ORDER = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

/**
 * The order worries are offered in. The ones with an evening attached come
 * first, because "the words for tonight" is the promise, and the screen fight
 * at bedtime is the moment the product was built for.
 */
const PRIORITY = [
  'wont-put-down', 'bedtime-screens', 'controller-fights', 'getting-round-rules',
  'mood-after-screens', 'game-chat', 'seen-something', 'social-media',
  'phones-and-messaging', 'group-chats', 'endless-youtube', 'game-spending',
  'homework-screens', 'ai-chatbots', 'morning-tv',
]

/** Each worry's scripts by title, checked against the live library on 28 November 2026. */
export const WORRY_SCRIPTS: Record<string, string[]> = {
  'wont-put-down': ['Refusing to stop when time is up', 'Refusing to come off their phone'],
  'bedtime-screens': ['Devices and sleep', 'Where the phone sleeps tonight', 'The phone is in their room all night', 'Late night phone use affecting sleep'],
  'controller-fights': ['They cannot stop in the middle of a match', 'Gaming until very late', 'Gaming has taken over everything else'],
  'getting-round-rules': ['Sneaking screen time', 'The second account you were not meant to find'],
  'mood-after-screens': ['Aggressive behaviour after gaming', 'Mood drops after phone use', 'When They Come Downstairs in a Dark Mood'],
  'game-chat': ['Online gaming with strangers', 'Online gaming friends they have never met', 'A message from someone they do not know'],
  'seen-something': ['Finding Something Upsetting on Their Device', 'Anxiety triggered by online news'],
  'social-media': ['Too young for a first social media account', 'Asking for Instagram, and what a Teen Account actually does', 'The Instagram Comparison Crash', 'Social media and mental health awareness'],
  'phones-and-messaging': ['Asking for their own phone', 'Where the phone sleeps tonight'],
  'group-chats': ['When Group Chat Drama Comes Home', 'Screenshot and group chat incident', 'Pile-on in a group chat'],
  'endless-youtube': ['Asking to watch YouTube unsupervised'],
  'game-spending': ['Requests for in-game purchases', 'They have spent real money on the game', 'Gambling mechanics in games'],
  'homework-screens': ['The Homework versus Screens Standoff', 'Phone during homework', 'AI wrote their homework'],
  'ai-chatbots': ['Ask the AI together, hints not answers', 'What AI actually is', 'An AI chatbot as a friend'],
  'morning-tv': ['The Morning TV Standoff', 'The morning was decided last night'],
}

function gap(a: string | null, b: string | null): number {
  if (!a || !b) return 1
  const i = STAGE_ORDER.indexOf(a), j = STAGE_ORDER.indexOf(b)
  return i < 0 || j < 0 ? 1 : Math.abs(i - j)
}

/** The best script for one worry at this child's stage, or null. */
export function scriptForWorry(concern: EmailConcern, stageId: string | null, scripts: EmailScript[]): EmailScript | null {
  const usable = scripts.filter(s => (s.say_this ?? '').trim())
  const titles = WORRY_SCRIPTS[concern.slug]
  if (titles) {
    const byTitle = new Map(usable.map(s => [s.title, s]))
    const found = titles.map(t => byTitle.get(t)).filter((s): s is EmailScript => !!s)
    if (found.length === 0) return null
    // The child's own stage first, then the nearest, list order breaking ties.
    return [...found].sort((a, b) => gap(a.stage_id, stageId) - gap(b.stage_id, stageId))[0]
  }
  // A worry in their own words: the matcher, at their stage, and only a near one.
  const pool = stageId ? usable.filter(s => gap(s.stage_id, stageId) <= 1) : usable
  return (matchScripts(pool, concern.label, 1, { stageId }) as EmailScript[])[0] ?? null
}

/**
 * The worries to open the first emails with, in order: the welcome takes the
 * first, day 2 the second, so a parent with two worries hears about both.
 * Settled worries are left out.
 */
export function worryScripts(concerns: EmailConcern[], stageId: string | null, scripts: EmailScript[], limit = 2): WorryScript[] {
  const open = concerns.filter(c => c.slug && (c.status ?? 'open') !== 'settled')
  const rank = (slug: string) => { const i = PRIORITY.indexOf(slug); return i < 0 ? PRIORITY.length : i }
  const ordered = [...open].sort((a, b) =>
    (b.times_flagged ?? 0) - (a.times_flagged ?? 0) || rank(a.slug) - rank(b.slug))
  const out: WorryScript[] = []
  const used = new Set<number>()
  for (const c of ordered) {
    const s = scriptForWorry(c, stageId, scripts)
    if (!s || used.has(s.sort_order)) continue
    used.add(s.sort_order)
    out.push({ worry: c.label.trim(), title: s.title, sayThis: String(s.say_this).trim(), sortOrder: s.sort_order })
    if (out.length >= limit) break
  }
  return out
}
