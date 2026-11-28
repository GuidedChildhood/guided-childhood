// THE APP PAGE TO STAGE CHECK HANDOFF (27 November 2026)
//
// An app page knows the app and, on an age page, the age. The stage check
// reads both from the link so the parent is not asked again: ?age= skips
// question one, ?app= ticks the worry that kind of app belongs to. Only an age
// the check offers and an app listed here are accepted, so a hand typed link
// can never put anything odd in the answers.
//
// A small table rather than a read of lib/app-safety/apps.ts, which is 130 KB
// of sourced facts the stage check page has no reason to download. The test
// (npm run app-handoff-test) holds this table to apps.ts: every app listed,
// each worry matching its category.

import { YOUNGEST_AGE } from '../children/age'

const OLDEST_AGE = 16

/** The stage check worry for each app, by its category in apps.ts. Creative
 *  and music apps have no single worry, so nothing is ticked for them. */
export const WORRY_FOR_APP: Record<string, string | null> = {
  'tiktok': 'social_media',
  'instagram': 'social_media',
  'snapchat': 'social_media',
  'whatsapp': 'group_chats',
  'youtube': 'endless_youtube',
  'youtube-kids': 'endless_youtube',
  'roblox': 'game_chat',
  'minecraft': 'game_chat',
  'fortnite': 'game_chat',
  'discord': 'group_chats',
  'pinterest': 'social_media',
  'bereal': 'social_media',
  'threads': 'social_media',
  'twitch': 'endless_youtube',
  'character-ai': 'ai_chatbots',
  'chatgpt': 'ai_chatbots',
  'netflix': 'endless_youtube',
  'spotify': null,
  'among-us': 'game_chat',
  'brawl-stars': 'game_chat',
  'clash-royale': 'game_chat',
  'call-of-duty': 'game_chat',
  'gta': 'game_chat',
  'ea-sports-fc': 'game_chat',
  'steam': 'game_chat',
  'capcut': null,
}

/**
 * The worries a page may tick, the stage check's own ids (lib/onboarding/
 * worries.ts). Since 28 November 2026 an app page asks the check's worry
 * question itself, so the parent's tap arrives as ?worry=. Anything else in
 * that slot is dropped.
 */
export const HANDOFF_WORRIES = new Set([
  'wont_put_down', 'asking_for_phone', 'game_chat', 'seen_something', 'social_media',
  'bedtime_screens', 'group_chats', 'getting_round', 'homework_screens', 'endless_youtube',
  'game_spending', 'ai_chatbots',
])

export function appHandoff(params: { get(name: string): string | null }): { age: number | null; worry: string | null; worries: string[] } {
  const rawAge = params.get('age')
  const n = rawAge && /^\d{1,2}$/.test(rawAge) ? Number(rawAge) : NaN
  const age = Number.isInteger(n) && n >= YOUNGEST_AGE && n <= OLDEST_AGE ? n : null
  const app = params.get('app')
  const worry = app && Object.prototype.hasOwnProperty.call(WORRY_FOR_APP, app) ? WORRY_FOR_APP[app] : null
  // The worry they tapped leads; the app's own worry follows, once.
  const tapped = params.get('worry')
  const worries = [...new Set([tapped && HANDOFF_WORRIES.has(tapped) ? tapped : null, worry].filter((w): w is string => !!w))]
  return { age, worry, worries }
}

/** The stage check link from an app page, carrying what the page knows. */
export function checkHref(appSlug: string, age?: number | null, worry?: string | null): string {
  const q = new URLSearchParams()
  if (age) q.set('age', String(age))
  q.set('app', appSlug)
  if (worry && HANDOFF_WORRIES.has(worry)) q.set('worry', worry)
  return `/starter-pack?${q.toString()}`
}
