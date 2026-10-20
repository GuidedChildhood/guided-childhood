// The editorial gate, the scoring, the research check and the credit gate.
// Each test breaks one rule on a copy of a real issue and proves the engine
// refuses it, so the rules are tested against the code that enforces them.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateIssue } from '../engine/validate'
import { contentHash, canonical } from '../engine/hash'
import { loadIssue } from '../pdf-engine/render'
import { rank, shortlist, total, WEIGHTS, type Candidate } from '../research/scoring'
import { normalise, verifyCandidate } from '../research/run'
import { brief } from '../higgsfield/brief'
import type { Issue } from '../engine/schema'
import type { GenerationRecord } from '../engine/store'

const copy = (n: number): Issue => JSON.parse(JSON.stringify(loadIssue(n)))
const errors = (i: Issue, ai = false) => validateIssue(i, { aiTells: ai }).filter(f => f.level === 'error')

test('Issue 001 and the sample Issue 002 pass the editorial gate, dashes and stock phrases included', () => {
  assert.deepEqual(errors(copy(1), true), [])
  assert.deepEqual(errors(copy(2), true), [])
})

test('a dash in the copy is caught by the house guard', () => {
  const i = copy(1)
  const p = i.pages[1] as Extract<Issue['pages'][number], { template: 'welcome' }>
  p.letter[0] = { type: 'para', text: 'Hello — and welcome.' }
  assert.ok(errors(i, true).some(f => f.rule === 'ai-tells'))
})

test('a cited source that is not verified cannot print', () => {
  const i = copy(1)
  i.sources.find(s => s.id === 's4')!.verification = 'flagged'
  assert.ok(errors(i).some(f => f.rule === 'cite-unverified' && f.page === 3))
})

test('a citation the page does not list, or that does not exist, is refused', () => {
  const i = copy(1)
  const p3 = i.pages[2] as Extract<Issue['pages'][number], { template: 'feature' }>
  p3.refs = p3.refs.filter(r => r !== 's2')
  assert.ok(errors(i).some(f => f.rule === 'cite-not-in-refs'))
  p3.body.push({ type: 'para', text: 'An invented claim.[[s99]]' })
  assert.ok(errors(i).some(f => f.rule === 'cite-unknown'))
})

test('a number with no source is refused on a real issue and only warned on a sample', () => {
  const i = copy(1)
  const p11 = i.pages[10] as Extract<Issue['pages'][number], { template: 'activity' }>
  p11.standfirst = 'Over 90% of children love this.'
  assert.ok(errors(i).some(f => f.rule === 'factual-uncited' && f.page === 11))
  i.sample = true
  assert.ok(!errors(i).some(f => f.rule === 'factual-uncited'))
})

test('art needs real alt text, and a friend must be approved art', () => {
  const i = copy(1)
  const cover = i.pages[0] as Extract<Issue['pages'][number], { template: 'cover' }>
  cover.art.alt = 'cover'
  assert.ok(errors(i).some(f => f.rule === 'alt-text'))
  cover.friend = { id: 'bloop', pose: 'standing' }
  assert.ok(!errors(i).some(f => f.rule === 'friend-unapproved'))
  ;(cover.friend as { pose: string }).pose = 'dancing'
  assert.ok(errors(i).some(f => f.rule === 'friend-unapproved'))
})

test('twelve pages, in order, cover first', () => {
  const i = copy(1)
  i.pages.pop()
  assert.ok(errors(i).some(f => f.rule === 'page-count'))
})

test('the content hash ignores key order and moves with any word', () => {
  const i = copy(1)
  assert.equal(canonical({ b: 1, a: [2, { d: 3, c: 4 }] }), canonical({ a: [2, { c: 4, d: 3 }], b: 1 }))
  const h = contentHash(i)
  ;(i.pages[0] as { deck: string }).deck += ' '
  assert.notEqual(contentHash(i), h)
})

// ── SCORING ─────────────────────────────────────────────────────────────────

const cand = (id: string, over: Partial<Candidate> = {}): Candidate => ({
  id, headline: `Story ${id}`, category: 'digital literacy', researched: '2026-10-13', summary: '', ageRelevance: '', numericalClaims: [], limitations: '', imagePermissions: '',
  source: { org: 'X', url: `https://example.org/${id}`, evidence: 'press release' }, recommendation: 'include', verification: 'verified',
  scores: { relevance: 20, evidence: 12, curiosity: 15, family: 10, visual: 7, timeliness: 3 }, ...over,
})

test('the weights are the brief\'s and add up to 100', () => {
  assert.deepEqual(WEIGHTS, { relevance: 25, evidence: 25, curiosity: 20, family: 15, visual: 10, timeliness: 5 })
  assert.equal(Object.values(WEIGHTS).reduce((a, b) => a + b, 0), 100)
  assert.equal(total({ relevance: 25, evidence: 25, curiosity: 20, family: 15, visual: 10, timeliness: 5 }), 100)
  assert.throws(() => total({ relevance: 26, evidence: 0, curiosity: 0, family: 0, visual: 0, timeliness: 0 }))
})

test('a press release cannot claim systematic review evidence', () => {
  assert.throws(() => rank([cand('a', { scores: { relevance: 20, evidence: 24, curiosity: 10, family: 10, visual: 5, timeliness: 2 } })]), /over the 15/)
})

test('repeating an earlier headline costs ten points', () => {
  const [r] = rank([cand('a', { headline: 'Who chose the next video? You, or the algorithm?' })], ['Who chose the next video? You or the algorithm'])
  assert.equal(r.total, 67 - 10)
})

test('the shortlist is verified only, at most seven, at most two per category', () => {
  const list = [
    ...Array.from({ length: 5 }, (_, i) => cand(`dl${i}`)),
    ...Array.from({ length: 6 }, (_, i) => cand(`sp${i}`, { category: `cat${i}` })),
    cand('unverified', { category: 'other', verification: 'flagged', scores: { relevance: 25, evidence: 15, curiosity: 20, family: 15, visual: 10, timeliness: 5 } }),
  ]
  const s = shortlist(rank(list))
  assert.equal(s.length, 7)
  assert.ok(!s.some(c => c.id === 'unverified'))
  assert.ok(s.filter(c => c.category === 'digital literacy').length <= 2)
})

// ── OUR OWN VERIFICATION OF A RESEARCH QUOTE ───────────────────────────────

const page = (html: string, status = 200) => (async () => new Response(html, { status })) as unknown as typeof fetch

test('a quote found on the page verifies; one that is not is flagged; a refusing site stays unverified', async () => {
  const c = cand('q', { verification: 'unverified', numericalClaims: [{ claim: '24,695 young people', quote: '17,381 submissions for Mission Zero from 24,695 young explorers', verified: false }] })
  const ok = await verifyCandidate(c, page('<p>There were <b>17,381 submissions</b> for Mission Zero from 24,695 young   explorers.</p>'))
  assert.equal(ok.verification, 'verified')
  const bad = await verifyCandidate(c, page('<p>There were 17,000 submissions.</p>'))
  assert.equal(bad.verification, 'flagged')
  const blocked = await verifyCandidate(c, page('Forbidden', 403))
  assert.equal(blocked.verification, 'unverified')
  assert.equal(normalise('It’s “fine”'), 'it\'s "fine"')
})

// ── THE CREDIT GATE ─────────────────────────────────────────────────────────

const gen = (over: Partial<GenerationRecord>): GenerationRecord => ({ id: 'g', issue: 1, slot: 'cover', recipe: 'newspaper-cover', tier: 'draft', prompt: '', model: 'm', status: 'completed', at: '2026-10-13', ...over })

test('no budget, no generation', () => {
  const b = brief(copy(1), [], null)
  assert.ok(b.requests.length > 0)
  assert.ok(b.requests.every(r => !r.runnable))
})

test('drafts first, finals only after an approved draft, and an unmeasured cost always asks', () => {
  const b = brief(copy(1), [], 100)
  assert.ok(b.requests.filter(r => r.tier === 'draft').every(r => r.runnable))
  assert.ok(b.requests.filter(r => r.tier === 'final').every(r => !r.runnable && /approved draft/.test(r.blockedBy ?? '')))
  const after = brief(copy(1), [gen({ status: 'approved', credits: 1 })], 100)
  const final = after.requests.find(r => r.slot === 'cover' && r.tier === 'final')!
  assert.match(final.blockedBy ?? '', /not yet measured/)
})

test('the budget is a ceiling, counted in credits actually charged', () => {
  // One draft has run and Higgsfield charged 1 credit, so a draft now costs 1
  // and 4 credits remain: exactly four more drafts may run.
  const b = brief(copy(1), [gen({ credits: 1, slot: 'x' })], 5)
  assert.equal(b.spent, 1)
  assert.equal(b.requests.filter(r => r.runnable).length, 4)
})

test('no recipe asks Higgsfield to draw a character, a word or a screen', () => {
  for (const r of brief(copy(1), [], 100).requests) {
    assert.match(r.prompt, /Never: No people, no children, no faces, no characters/)
    assert.doesNotMatch(r.prompt, /\b(Bloop|Pebble|Orbit|Nova|Cosmo|DiGi)\b/)
  }
})

test('the paper\'s Happy News icons are the app\'s own, not a drifting copy', async () => {
  const { execFileSync } = await import('node:child_process')
  const out = execFileSync('node', ['publishing/library/export-happy-icons.mjs', '--check'], { encoding: 'utf8' })
  assert.match(out, /PASS/)
})

test('a theme is a look, not new rules: the same gates hold in every one', () => {
  const i = copy(1)
  // Justin, 15 October 2026: the paper wears the Happy News system it shares
  // with The Planet Post.
  assert.equal(i.theme, 'happy')
  for (const t of ['editorial', 'boho', 'happy'] as const) {
    i.theme = t
    assert.deepEqual(errors(i), [])
  }
})
