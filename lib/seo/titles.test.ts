// Titles that fit in a search result. Run: npm run seo-titles
//
// The Ahrefs audit of 23 November 2026 found 281 public titles past 60
// characters, cut off mid question in Google. lib/seo/meta.ts now drops the
// brand before a title would pass 60; this holds the line for the 220 app
// pages and the rule itself.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { APPS } from '../app-safety/apps'
import { appPageTitle } from '../app-safety/content'
import { AGES } from '../app-safety/types'
import { BRAND_SUFFIX, TITLE_MAX, fitTitle, pageMetadata, shownTitle } from './meta'

test('every app page title fits with the brand', () => {
  for (const app of APPS) {
    for (const age of [null, ...AGES]) {
      const shown = shownTitle(appPageTitle(app, age))
      assert.ok(shown.length <= TITLE_MAX, `${shown.length}: ${shown}`)
      assert.ok(shown.endsWith(BRAND_SUFFIX), `keeps the brand: ${shown}`)
    }
  }
})

test('a title that would pass 60 with the brand drops the brand, never the words', () => {
  const short = pageMetadata({ title: 'Guides', description: 'd', path: '/guides' })
  assert.equal(short.title, 'Guides')
  const long = pageMetadata({ title: 'How do I stop the screen time argument every night?', description: 'd', path: '/x' })
  assert.deepEqual(long.title, { absolute: 'How do I stop the screen time argument every night?' })
})

test('fitTitle takes the first candidate that fits, else the shortest', () => {
  assert.equal(fitTitle('The Star Reward Chart: free printable', 'The Star Reward Chart'), 'The Star Reward Chart: free printable')
  assert.equal(fitTitle('The Guided Times, Issue 2: New Year, New Deal: free printable', 'The Guided Times, Issue 2: New Year, New Deal'), 'The Guided Times, Issue 2: New Year, New Deal')
})
