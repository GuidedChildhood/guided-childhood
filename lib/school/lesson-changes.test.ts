// Tests for the weekly lesson changes digest. Run: npm run lesson-changes-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { digestEmail, digestOf, needsRevisit, type ChangeRow } from './lesson-changes'

const row = (o: Partial<ChangeRow>): ChangeRow => ({ lesson_key: 'ks2-01-a', school_ref: 'a'.repeat(32), assessment: 'not_assessed', objective_marks: {}, would_change: null, ...o })

test('a revisit on the class or any objective counts, the quiz key never does', () => {
  assert.equal(needsRevisit(row({ assessment: 'revisit' })), true)
  assert.equal(needsRevisit(row({ objective_marks: { '1': 'revisit' } })), true)
  assert.equal(needsRevisit(row({ objective_marks: { _quiz: 'revisit' } })), false)
  assert.equal(needsRevisit(row({ assessment: 'secure' })), false)
})

test('groups per lesson, counts schools, lessons with a line first', () => {
  const d = digestOf([
    row({ lesson_key: 'b', assessment: 'revisit' }),
    row({ lesson_key: 'b', assessment: 'revisit', school_ref: 'b'.repeat(32) }),
    row({ lesson_key: 'a', assessment: 'secure', would_change: '  The sort game ran   long ' }),
    row({ lesson_key: 'c', assessment: 'secure' }),
  ], { a: 'Lesson A' })
  assert.deepEqual(d.map(l => l.lessonKey), ['a', 'b'])
  assert.equal(d[0].title, 'Lesson A')
  assert.deepEqual(d[0].lines, ['The sort game ran long'])
  assert.equal(d[1].revisit, 2)
  assert.equal(d[1].schools, 2)
})

test('teacher text is escaped in the email', () => {
  const { subject, html } = digestEmail(digestOf([row({ would_change: '<b>x</b>' })], {}))
  assert.equal(subject, 'What teachers would change: 1 line this week')
  assert.ok(html.includes('&lt;b&gt;x&lt;/b&gt;'))
  assert.ok(!html.includes('<b>x</b>'))
})
