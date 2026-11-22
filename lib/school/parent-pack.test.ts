// Tests for the school parent pack. Run: npm run school-pack-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { blurb, candidateCode, cleanSchoolName, packLink, startLink, trackedPath, type PackSchool } from './parent-pack'

const LINKED: PackSchool = { kind: 'linked', code: 'st-marys-primary', name: "St Mary's Primary" }
const NAMED: PackSchool = { kind: 'named', slug: 'oak-hill-academy', name: 'Oak Hill Academy' }

test('a school name is cleaned to something safe to show', () => {
  assert.equal(cleanSchoolName("  St Mary's C of E Primary  "), "St Mary's C of E Primary")
  assert.equal(cleanSchoolName('Oak Hill <script>alert(1)</script>'), 'Oak Hill scriptalert(1)script')
  assert.equal(cleanSchoolName('Whitley Bay High School — Year 7'), 'Whitley Bay High School Year 7', 'dashes become spaces')
  assert.equal(cleanSchoolName('x'), null)
  assert.equal(cleanSchoolName(null), null)
  assert.ok((cleanSchoolName('A'.repeat(200)) ?? '').length <= 60)
})

test('a ?school= value maps to a code, typed as a code or as a name', () => {
  assert.equal(candidateCode('st-marys-primary'), 'st-marys-primary')
  assert.equal(candidateCode("St Mary's Primary"), 'st-marys-primary')
  assert.equal(candidateCode('!!'), null)
})

test('a linked school starts at its own /s/ link; a named one at its short /go/ link', () => {
  assert.match(startLink(LINKED), /\/s\/st-marys-primary$/)
  assert.match(startLink(NAMED), /\/go\/oak-hill-academy$/, 'short enough to print and scan')
  assert.match(trackedPath('/guides', NAMED), /\/guides\?utm_source=school&utm_medium=newsletter&utm_campaign=oak-hill-academy$/)
  assert.equal(trackedPath('/app-safety-guide', { kind: 'none' }), '/app-safety-guide', 'no school, no tags')
})

test('the pack link and the blurb', () => {
  assert.match(packLink(NAMED), /\/schools\/parent-pack\?pack=Oak%20Hill%20Academy$/)
  const b = blurb(LINKED)
  assert.match(b, /\/s\/st-marys-primary/)
  assert.doesNotMatch(b, /[‐-―]|\s-\s/, 'no dashes in the copy a school pastes')
})
