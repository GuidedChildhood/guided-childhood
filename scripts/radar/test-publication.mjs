#!/usr/bin/env node
// Tests for the publication register and the duplicate check. A throwaway
// research register and a throwaway schedule: nothing live is touched.
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dir = mkdtempSync(join(tmpdir(), 'gdc-pub-'))
process.env.RADAR_REGISTER = join(dir, 'register')
const reg = await import('./register.mjs')
const { buildRegister, reconcile, classify, reportText } = await import('./publication.mjs')

let pass = 0; let fail = 0
const ok = (name, cond, detail = '') => { if (cond) { pass++ } else { fail++; console.log(`FAIL  ${name} ${detail}`) } }

const post = join(dir, 'posts.md')
writeFileSync(post, ['| No. | Title | State | Where |', '|---|---|---|---|',
  '| 047 | AI toys | **RETIRED 9 Nov, start fresh.** Not posted | pack |',
  '| 054 | The meta analysis | **CLAIMED 9 Nov** | handoff |',
  '| 055 | Government scientists | **CLAIMED 10 Nov** | handoff |',
  '| 056 | Parents and age checks | **CLAIMED 10 Nov** | handoff |', ''].join('\n'))
const mk = (n, title, doi, status, extra = {}) => reg.upsert({ title, doi, url: `https://example.org/${n}`, status, gdcPostNumber: n, ...extra }, { reason: 'test', allowBackward: true })
mk(54, 'Meta analysis of social media effect size in adolescents', '10.1/aaa', 'ASSETS READY')
mk(55, 'Government scientists review of experiment evidence', '10.1/bbb', 'EDITORIAL READY')
mk(56, 'Parents helping past age checks, regulators find', '10.1/ccc', 'EDITORIAL READY')
const A = reg.all().find((r) => r.gdcPostNumber === 54).studyId
const B = reg.all().find((r) => r.gdcPostNumber === 55).studyId
const C = reg.all().find((r) => r.gdcPostNumber === 56).studyId

const sched = join(dir, 'sched.json')
const write = (posts, drafts = []) => writeFileSync(sched, JSON.stringify({ observedAt: '2026-11-12', posts, metricoolDrafts: drafts }))
const o = { schedulePath: sched, postRegisterPath: post }

write([{ scheduledFor: '2026-11-16T08:00', subject: 'the meta analysis', withImage: true, gdcNumber: '054' }], [{ gdcNumber: '054', draftId: null }])
let rc = reconcile(o)
const r54 = rc.register.rows.find((r) => r.gdcPostNumber === '054')
ok('a native slot and a Metricool draft is a conflict', r54.slotOwner === 'CONFLICT' && rc.verdict === 'HOLD')
ok('a slot with no approval is not SCHEDULED', r54.status !== 'SCHEDULED' && /SLOT REPORTED/.test(r54.status))
ok('an image nobody checked is named', r54.issues.some((i) => /image that was never checked/.test(i.what)))
ok('a draft with no ID is noted, not blocking', r54.issues.some((i) => /no draft ID/.test(i.what) && !i.blocking))
ok('the story that is scheduled is a DUPLICATE', classify(A, { register: rc.register }).result === 'DUPLICATE')

write([{ scheduledFor: '2026-11-14T08:00', subject: 'AI toys', withImage: true, gdcNumber: '047' }])
rc = reconcile(o)
ok('a retired number that is scheduled is caught', rc.register.rows.find((r) => r.gdcPostNumber === '047').issues.some((i) => /RETIRED/.test(i.what)))

write([{ scheduledFor: '2026-11-15T08:45', subject: 'Bradford trial', gdcNumber: null }])
rc = reconcile(o)
ok('a slot with no record blocks', rc.blocking >= 1 && rc.register.rows.some((r) => r.status === 'NO RECORD, SLOT REPORTED'))
ok('with an unidentified slot nothing is called NEW', classify(B, { register: rc.register }).result === 'UNKNOWN')

write([{ scheduledFor: '2026-11-15T08:45', subject: 'Bradford trial', gdcNumber: null, acceptedByJustin: 'his words' }])
rc = reconcile(o)
ok('a slot Justin accepted stops blocking and is still listed as unchecked', rc.verdict === 'PASS' && rc.issues.some((i) => /no reviewed record/.test(i.what)))

write([])
rc = reconcile(o)
ok('an empty schedule passes', rc.verdict === 'PASS')
ok('with everything identified a fresh story is NEW', classify(B, { register: rc.register }).result === 'NEW')

// Approved with one owner is SCHEDULED. Same subject, different source, is OVERLAP.
reg.upsert({ ...reg.get(A), status: 'APPROVED', assets: [{ kind: 'still image', verified: true }] }, { reason: 'test', allowBackward: true })
write([{ scheduledFor: '2026-11-16T08:00', subject: 'the meta analysis', withImage: true, gdcNumber: '054', copyVerified: true }])
rc = reconcile(o)
ok('approved with one slot owner is SCHEDULED', rc.register.rows.find((r) => r.gdcPostNumber === '054').status === 'SCHEDULED', rc.register.rows.find((r) => r.gdcPostNumber === '054').status)
ok('and reconciles clean', rc.verdict === 'PASS', JSON.stringify(rc.issues))
mk(59, 'A second meta analysis of adolescents and effect size', '10.1/ddd', 'EDITORIAL READY')
const D = reg.all().find((r) => r.gdcPostNumber === 59).studyId
ok('same subject from another source is OVERLAP', classify(D, { register: buildRegister(o) }).result === 'OVERLAP', classify(D, { register: buildRegister(o) }).result)
ok('an unrelated story stays NEW', classify(C, { register: buildRegister(o) }).result === 'NEW')
ok('nothing is PUBLISHED without a URL', !rc.register.rows.some((r) => r.status === 'PUBLISHED'))
ok('the report has no dash', !new RegExp('[\\u2010-\\u2015\\u2212]').test(reportText(rc)))

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
