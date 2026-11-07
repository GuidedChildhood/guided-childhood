// Tests for UTMs on the source links and the pilot form (funnel audit,
// 6 November 2026): what is kept, what is dropped, when the stage check opens
// on question one, and the note a pilot request carries.
// Run: npm run utm-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cleanUtmValue, readUtm, hasUtm, utmQuery, isSocialSource, UTM_VALUE_PATTERN } from '../../shared/utm'
import { utmFromCookie, utmCookieValue, utmColumns, opensOnQuestionOne } from './utm'
import { pilotAttribution, attributionNote } from '../../schools/lib/pilot-source'

const q = (s: string) => new URLSearchParams(s)

test('a slug about the post is kept, cleaned', () => {
  assert.equal(cleanUtmValue('instagram'), 'instagram')
  assert.equal(cleanUtmValue(' Instagram '), 'instagram')
  assert.equal(cleanUtmValue('1106-stage-check'), '1106-stage-check')
  assert.equal(cleanUtmValue('bio_w45'), 'bio_w45')
  assert.equal(cleanUtmValue('stage check'), 'stage-check')
})

test('anything that could be about a person is dropped, not repaired', () => {
  assert.equal(cleanUtmValue('sam.carter@school.sch.uk'), null)
  assert.equal(cleanUtmValue('sam%40school'), null)
  assert.equal(cleanUtmValue('07700900123'), null)
  assert.equal(cleanUtmValue('call-07700900123'), null)
  assert.equal(cleanUtmValue('a'.repeat(61)), null)
  assert.equal(cleanUtmValue('<script>'), null)
  assert.equal(cleanUtmValue(''), null)
  assert.equal(cleanUtmValue(['instagram']), null)
  assert.equal(cleanUtmValue(undefined), null)
})

test('readUtm takes the four keys and nothing else', () => {
  assert.deepEqual(
    readUtm(q('utm_source=TikTok&utm_medium=social&utm_campaign=1106-stage-check&utm_content=v2&utm_term=x&email=a@b.co')),
    { utm_source: 'tiktok', utm_medium: 'social', utm_campaign: '1106-stage-check', utm_content: 'v2' },
  )
  assert.deepEqual(readUtm(q('utm_source=a@b.co')), {})
  assert.deepEqual(readUtm({ utm_source: 'youtube', utm_medium: 42 }), { utm_source: 'youtube' })
  assert.deepEqual(readUtm(null), {})
  assert.equal(hasUtm({}), false)
  assert.equal(hasUtm({ utm_campaign: 'x1' }), true)
})

test('the redirect and the cookie carry the same cleaned values, in a fixed order', () => {
  const utm = readUtm(q('utm_campaign=1106-stage-check&utm_source=facebook'))
  assert.equal(utmQuery(utm), 'utm_source=facebook&utm_campaign=1106-stage-check')
  assert.equal(utmCookieValue({}), '')
  assert.deepEqual(utmFromCookie(utmCookieValue(utm)), utm)
})

test('a cookie is the visitor to edit, so it is cleaned again', () => {
  assert.deepEqual(utmFromCookie('utm_source=me@home.com&utm_campaign=ok-1'), { utm_campaign: 'ok-1' })
  assert.deepEqual(utmFromCookie(''), {})
  assert.deepEqual(utmFromCookie(undefined), {})
  assert.deepEqual(utmColumns({ utm_source: 'ig' }), { utm_source: 'ig' })
})

test('a visit from a post opens on question one; others meet the intro', () => {
  assert.equal(opensOnQuestionOne(q('via=v')), true)
  assert.equal(opensOnQuestionOne(q('src=fb-1106-stage-check')), true)
  assert.equal(opensOnQuestionOne(q('utm_source=instagram&utm_medium=social')), true)
  assert.equal(opensOnQuestionOne(q('utm_source=TikTok')), true)
  assert.equal(opensOnQuestionOne(q('utm_source=newsletter')), false)
  assert.equal(opensOnQuestionOne(q('src=../x')), false)
  assert.equal(opensOnQuestionOne(q('')), false)
  assert.equal(opensOnQuestionOne(q('school=1')), false)
  assert.equal(isSocialSource('youtube'), true)
  assert.equal(isSocialSource('email'), false)
})

test('the database checks the same pattern the app cleans to', () => {
  const sql = readFileSync('supabase/migrations/388_utm_and_the_video_channels.sql', 'utf8')
  const checks = sql.match(/~ '([^']+)'/g) ?? []
  assert.equal(checks.length, 8)
  assert.ok(checks.every(c => c === `~ '${UTM_VALUE_PATTERN}'`))
  assert.ok(/length\(utm_source\)\s+<= 60/.test(sql))
})

test('a pilot request notes the post that sent it, and nothing else', () => {
  const form = new FormData()
  form.set('src', 'li-1106-pilot')
  form.set('utm_source', 'linkedin')
  form.set('utm_medium', 'social')
  form.set('utm_campaign', '1106-pilot')
  form.set('email', 'head@school.sch.uk')
  const a = pilotAttribution(form)
  assert.deepEqual(a, { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: '1106-pilot', src: 'li-1106-pilot' })
  assert.equal(attributionNote(a), 'source li-1106-pilot, linkedin / social / 1106-pilot')
  assert.equal(attributionNote(pilotAttribution({ utm_source: 'tiktok' })), 'source tiktok')
  assert.equal(attributionNote(pilotAttribution({ src: 'head@school.sch.uk' })), null)
  assert.equal(attributionNote(pilotAttribution(new URLSearchParams(''))), null)
})
