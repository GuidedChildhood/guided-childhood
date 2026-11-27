// The app page to stage check handoff. Run: npm run app-handoff-test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { APPS } from './apps'
import { WORRIES } from '../onboarding/worries'
import { WORRY_FOR_APP, appHandoff, checkHref } from './handoff'

const CATEGORY_WORRY: Record<string, string | null> = { social: 'social_media', video: 'endless_youtube', gaming: 'game_chat', messaging: 'group_chats', ai: 'ai_chatbots', creative: null, music: null }
const q = (s: string) => new URLSearchParams(s)

test('every app in the guide is in the table, with the worry its category gives', () => {
  for (const a of APPS) assert.equal(WORRY_FOR_APP[a.slug], CATEGORY_WORRY[a.category], a.slug)
  assert.equal(Object.keys(WORRY_FOR_APP).length, APPS.length)
})

test('every worry named is one the stage check offers', () => {
  const ids = new Set(WORRIES.map(w => w.id))
  for (const w of Object.values(WORRY_FOR_APP)) if (w) assert.ok(ids.has(w), w)
})

test('age and app are read, and only valid ones', () => {
  assert.deepEqual(appHandoff(q('age=12&app=tiktok')), { age: 12, worry: 'social_media' })
  assert.deepEqual(appHandoff(q('age=3&app=nope')), { age: null, worry: null })
  assert.deepEqual(appHandoff(q('age=17')), { age: null, worry: null })
  assert.deepEqual(appHandoff(q('age=12abc&app=__proto__')), { age: null, worry: null })
  assert.equal(appHandoff(q('')).age, null)
})

test('the link carries the age only on an age page', () => {
  assert.equal(checkHref('roblox', 9), '/starter-pack?age=9&app=roblox')
  assert.equal(checkHref('roblox'), '/starter-pack?app=roblox')
})
