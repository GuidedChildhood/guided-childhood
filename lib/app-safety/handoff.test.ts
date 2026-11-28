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
  assert.deepEqual(appHandoff(q('age=12&app=tiktok')), { age: 12, worry: 'social_media', worries: ['social_media'] })
  assert.deepEqual(appHandoff(q('age=3&app=nope')), { age: null, worry: null, worries: [] })
  assert.deepEqual(appHandoff(q('age=17')), { age: null, worry: null, worries: [] })
  assert.deepEqual(appHandoff(q('age=12abc&app=__proto__')), { age: null, worry: null, worries: [] })
  assert.equal(appHandoff(q('')).age, null)
})

test('the worry a parent tapped on the page leads, and only a real one', () => {
  assert.deepEqual(appHandoff(q('age=12&app=tiktok&worry=bedtime_screens')).worries, ['bedtime_screens', 'social_media'])
  assert.deepEqual(appHandoff(q('age=12&app=tiktok&worry=social_media')).worries, ['social_media'])
  assert.deepEqual(appHandoff(q('app=tiktok&worry=__proto__')).worries, ['social_media'])
  assert.deepEqual(appHandoff(q('app=spotify&worry=bedtime_screens')).worries, ['bedtime_screens'])
  assert.equal(checkHref('tiktok', 12, 'bedtime_screens'), '/starter-pack?age=12&app=tiktok&worry=bedtime_screens')
  assert.equal(checkHref('tiktok', 12, 'nope'), '/starter-pack?age=12&app=tiktok')
})

test('every worry a page offers is one the stage check takes', async () => {
  const { WORRIES_FOR_CATEGORY } = await import('./page-help')
  const ids = new Set(WORRIES.map(w => w.id))
  for (const list of Object.values(WORRIES_FOR_CATEGORY)) for (const w of list) {
    assert.ok(ids.has(w.id), w.id)
    assert.ok(checkHref('tiktok', 12, w.id).includes(`worry=${w.id}`), w.id)
  }
})

test('the link carries the age only on an age page', () => {
  assert.equal(checkHref('roblox', 9), '/starter-pack?age=9&app=roblox')
  assert.equal(checkHref('roblox'), '/starter-pack?app=roblox')
})
