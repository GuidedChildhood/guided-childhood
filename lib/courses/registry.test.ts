// Tests for the topic email courses (16 November 2026): the schedule (one a
// morning, never two, never out of order), the age match on the result page,
// and the copy rules the plan set for every email.
// Run: npm run courses-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { COURSES, getCourse, courseForAge, courseDayDue, courseDayKey, COURSE_WINDOW_DAYS } from './registry'

const course = getCourse('first-group-chat')!

test('the first group chat is seven days', () => {
  assert.ok(course)
  assert.equal(course.days.length, 7)
})

test('day 1 goes at once, then one a morning in order', () => {
  const sent = new Set<string>()
  assert.equal(courseDayDue(0, sent, course), 1)
  sent.add(courseDayKey(course.slug, 1))
  assert.equal(courseDayDue(0.3, sent, course), null, 'not day 2 the same evening')
  assert.equal(courseDayDue(0.6, sent, course), 2)
  // A lead found late catches up one a run, never a burst, and never skips.
  assert.equal(courseDayDue(5, sent, course), 2)
  for (let d = 2; d <= 7; d++) sent.add(courseDayKey(course.slug, d))
  assert.equal(courseDayDue(6.6, sent, course), null, 'nothing after day 7')
})

test('a course left alone past its window sends nothing more', () => {
  assert.equal(courseDayDue(COURSE_WINDOW_DAYS + 1, new Set(), course), null)
})

test('the offer shows for 10 to 12 and not for an unknown age', () => {
  assert.equal(courseForAge(9), null)
  assert.equal(courseForAge(10)?.slug, 'first-group-chat')
  assert.equal(courseForAge(12)?.slug, 'first-group-chat')
  assert.equal(courseForAge(13), null)
  assert.equal(courseForAge(null), null)
})

test('every email keeps the rules: no dashes, one thing tonight, at most one link', () => {
  for (const c of COURSES) {
    for (const [i, d] of c.days.entries()) {
      const text = [d.subject, d.preview, ...d.paragraphs, d.tonight, d.link?.label ?? ''].join(' ')
      assert.doesNotMatch(text, /[‒-―−]|\s-\s/, `${c.slug} day ${i + 1} has a dash`)
      assert.ok(d.tonight.length > 10, `${c.slug} day ${i + 1} has no tonight`)
      const words = text.split(/\s+/).length
      assert.ok(words <= 300, `${c.slug} day ${i + 1} is ${words} words, longer than a 90 second read`)
    }
    // The product is named plainly on day 5 and offered again on day 7, not before.
    assert.equal(c.days[4].link?.to, 'scripts')
    assert.equal(c.days[6].link?.to, 'stage')
  }
})

test('the copy matches the checked pack word for word', () => {
  const pack = readFileSync('content/packs/2026-11-14-first-whatsapp-group/pack.md', 'utf8')
  for (const d of course.days) {
    assert.ok(pack.includes(`Subject: ${d.subject}`), `subject not in the pack: ${d.subject}`)
    for (const para of d.paragraphs) assert.ok(pack.includes(para), `paragraph not in the pack: ${para.slice(0, 60)}`)
  }
})
