#!/usr/bin/env node
// Tests for the gate. Each case is a rule from Justin's brief.

import { checkSpec, numbersIn } from './gate.mjs'

const record = {
  studyId: 'GDC-RR-test000001',
  claudeStatus: 'CLAUDE REVIEWED',
  gdcPostNumber: '999',
  claudeReview: {
    verdict: 'SHIP',
    verifiedStatistics: ['572 parents answered the main question', '47.2 percent were not comfortable at all'],
    limitations: ['Cross sectional, so nothing causal.'],
    notQuotable: ['three in four parents distrust AI'],
  },
}
const good = {
  gdcPostNumber: '999', researchId: 'GDC-RR-test000001', notForPublication: false,
  eyebrow: 'NEW RESEARCH',
  headline: 'Parents drew a line around AI therapy for their child',
  finding: { figure: '47.2%', text: 'Of 572 parents, 47.2 percent were not comfortable at all.' },
  context: 'A survey of parents in the United States about one hypothetical question.',
  source: 'SOURCE  JAMA Pediatrics, 2 November 2026',
  limitation: 'Cross sectional, so nothing causal.',
}

let failed = 0
function expect(name, spec, rec, verdict, mustMention) {
  const g = checkSpec(spec, rec)
  const ok = g.verdict === verdict && (!mustMention || g.reasons.some((r) => r.includes(mustMention)))
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : `  got ${g.verdict}: ${g.reasons.join(' | ')}`}`)
  if (!ok) failed++
}
const clone = (o) => JSON.parse(JSON.stringify(o))

expect('a cleared, reviewed story passes', good, record, 'PASS')
expect('an invented number is refused', { ...clone(good), context: 'One in 3 said yes.' }, record, 'HOLD', 'not in the cleared figures')
expect('a figure not in the cleared list is refused', { ...clone(good), finding: { figure: '76%', text: 'Most were not comfortable.' } }, record, 'HOLD', '76')
expect('causal wording is refused', { ...clone(good), headline: 'AI therapy causes parents to worry' }, record, 'HOLD', 'causal')
expect('a dash is refused', { ...clone(good), headline: 'Parents and AI ' + String.fromCharCode(0x2014) + ' a line drawn' }, record, 'HOLD', 'dash')
expect('a record not reviewed by Claude is refused', good, { ...clone(record), claudeStatus: 'PENDING' }, 'HOLD', 'CLAUDE REVIEWED')
expect('a HOLD verdict is refused', good, { ...clone(record), claudeReview: { ...record.claudeReview, verdict: 'HOLD' } }, 'HOLD', 'SHIP or EDIT')
expect('a GDC number that does not match the record is refused', { ...clone(good), gdcPostNumber: '998' }, record, 'HOLD', 'GDC number')
expect('a story without its record is refused', good, null, 'HOLD', 'research record')
expect('a missing source is refused', { ...clone(good), source: '' }, record, 'HOLD', 'source')
expect('a missing limitation is refused', { ...clone(good), limitation: '' }, record, 'HOLD', 'limitation')
expect('wording marked not quotable is refused', { ...clone(good), context: 'Three in four parents distrust AI, the survey says.' }, record, 'HOLD', 'not quotable')
expect('too many words is refused', { ...clone(good), context: 'word '.repeat(27).trim() }, record, 'HOLD', 'words on the card')
expect('a demonstration with a GDC number is refused', { ...clone(good), notForPublication: true }, null, 'HOLD', 'demonstration')
expect('a demonstration passes without a record', { ...clone(good), notForPublication: true, gdcPostNumber: null }, null, 'PASS')

const nums = numbersIn('1,000 children, 47.2 percent, 2026')
const numsOk = JSON.stringify(nums) === JSON.stringify(['1000', '47.2', '2026'])
console.log(`${numsOk ? 'ok  ' : 'FAIL'}  numbers are read as written${numsOk ? '' : ` got ${nums}`}`)
if (!numsOk) failed++

console.log(failed ? `${failed} FAILED` : 'all passed')
process.exit(failed ? 1 : 0)
