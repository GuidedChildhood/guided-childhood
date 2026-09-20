#!/usr/bin/env node
// THE COMPUTING MAP, AS AN EXIT CODE.
//
// Holds shared/schools-computing-pos.ts, the national curriculum for
// computing's subject content, to the lessons that claim to teach any of it.
// The scheme is a digital literacy and online safety programme, so most rows
// belong to the school's computing scheme and say so; the rows that claim a
// lesson are held to phrases that must appear in that lesson's slides.
//
// THE RULES
//   1. ids are unique and shaped CPOS-KS<1-4>-<n>, and every statement has a
//      key stage matching its id
//   2. every module id named by a statement exists in the curriculum manifest
//   3. FULL and PARTIAL name at least one module and at least one probe, and
//      every probed module is one of the statement's modules
//   4. YOUR_SCHEME names no module and no probe. You cannot point at a lesson
//      for something you do not teach
//   5. PARTIAL names the missing clause in its note
//   6. where a probed module has a file in content/modules, the phrase is in
//      it (case insensitive); the rest are checked on production with --sql
//   7. no dashes in our own notes. `text` is the document's own wording and is
//      exempt, because editing a quotation to satisfy a house style rule
//      would break the audit trail
//   8. the ratchet: PARTIAL never rises above the number on the day this was
//      written, and FULL never falls below it
//
// Usage: node scripts/check-computing-coverage.mjs        (the guard)
//        node scripts/check-computing-coverage.mjs --sql  (the production attestation)

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA = path.join(ROOT, 'shared/schools-computing-pos.ts')
const MANIFEST = path.join(ROOT, 'shared/schools-curriculum.ts')
const MODULES = path.join(ROOT, 'content/modules')

// THE RATCHET, 20 September 2026: 3 taught, 3 in progress, 19 the school's.
const MAX_PARTIAL = 3
const MIN_FULL = 3

let bad = 0
const fail = (rule, detail) => { bad++; console.error(`  FAIL ${rule}\n       ${detail}`) }

const src = fs.readFileSync(DATA, 'utf8')
const manifest = fs.readFileSync(MANIFEST, 'utf8')
const moduleIds = new Set([...manifest.matchAll(/moduleId: '([^']+)'/g)].map(m => m[1]))

// Parse the statements out of the source rather than importing it: this guard
// runs under plain node with no TypeScript loader, like the others in CI.
const unq = s => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’')
const stmts = []
for (const m of src.matchAll(/YOURS\('([^']+)', '([^']+)', '((?:[^'\\]|\\.)*)'(?:,\s*'((?:[^'\\]|\\.)*)')?\)/g)) {
  stmts.push({ id: m[1], keyStage: m[2], text: unq(m[3]), verdict: 'YOUR_SCHEME', modules: [], note: m[4] ? unq(m[4]) : '', probes: [] })
}
for (const block of src.split(/\n  \{\n/).slice(1)) {
  const one = k => (block.match(new RegExp(`${k}: '((?:[^'\\\\]|\\\\.)*)'`)) || [, ''])[1]
  const id = one('id'); if (!id) continue
  const modules = [...(block.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(x => x[1])
  const probes = [...block.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)].map(p => ({ phrase: unq(p[1]), modules: [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1]) }))
  stmts.push({ id, keyStage: one('keyStage'), verdict: one('verdict'), text: unq(one('text')), note: unq(one('note')), modules, probes })
}
stmts.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))

if (process.argv.includes('--sql')) {
  const rows = stmts.flatMap(s => s.probes.map(p => `  ('${s.id}', '${p.phrase.replace(/'/g, "''")}', array[${p.modules.map(m => `'${m}'`).join(',')}])`))
  console.log(`-- ${rows.length} phrase checks across ${stmts.filter(s => s.probes.length).length} computing statements
-- Run against production. Every probed module must carry its phrase; zero failure rows means every claim holds.
with probe(sid, phrase, mods) as (values
${rows.join(',\n')}
),
sl as (select l.module_id, lower(l.slides::text) as txt from schools.school_lessons l),
res as (select p.sid, p.phrase, m as module_id, coalesce(position(lower(p.phrase) in sl.txt) > 0, false) as hit
 from probe p, unnest(p.mods) m left join sl on sl.module_id = m)
select 'TOTAL' as sid, count(*)::text as phrase, sum(case when hit then 0 else 1 end)::text as module_id from res
union all select sid, phrase, module_id from res where not hit order by 1;`)
  process.exit(0)
}

console.log(`check-computing-coverage: ${stmts.length} statements`)
if (stmts.length !== 25) fail('parse', `expected 25 statements, parsed ${stmts.length}. The data file or this parser has drifted.`)

// 1. ids
const seen = new Set()
for (const s of stmts) {
  if (seen.has(s.id)) fail('1 unique id', `${s.id} appears twice`)
  seen.add(s.id)
  const m = s.id.match(/^CPOS-(KS[1-4])-\d{1,2}$/)
  if (!m) fail('1 id shape', `${s.id} is not CPOS-KS<1-4>-<n>`)
  else if (m[1] !== s.keyStage) fail('1 key stage', `${s.id} says keyStage ${s.keyStage}`)
  if (!['FULL', 'PARTIAL', 'YOUR_SCHEME'].includes(s.verdict)) fail('1 verdict', `${s.id} verdict is ${JSON.stringify(s.verdict)}`)
  if (!s.text) fail('1 text', `${s.id} has no statement text`)
}

// 2. modules exist
for (const s of stmts) for (const id of s.modules) if (!moduleIds.has(id)) fail('2 module exists', `${s.id} names ${id}, which is not in shared/schools-curriculum.ts`)

// 3, 4, 5. what each verdict must and must not carry
for (const s of stmts) {
  if (s.verdict === 'FULL' || s.verdict === 'PARTIAL') {
    if (s.modules.length === 0) fail('3 taught needs a module', `${s.id} is ${s.verdict} with no module`)
    if (s.probes.length === 0) fail('3 taught needs a probe', `${s.id} is ${s.verdict} with no phrase to hold it to`)
    for (const p of s.probes) for (const id of p.modules) if (!s.modules.includes(id)) fail('3 probe module', `${s.id} probes ${id}, which is not one of its modules`)
  }
  if (s.verdict === 'YOUR_SCHEME' && (s.modules.length || s.probes.length)) fail('4 your scheme claims nothing', `${s.id} names modules or probes`)
  if (s.verdict === 'PARTIAL' && !/missing clause/.test(s.note)) fail('5 partial names the missing clause', `${s.id}: the note must say which clause is missing`)
}

// 6. probes against the module files we have
for (const s of stmts) for (const p of s.probes) for (const id of p.modules) {
  const file = path.join(MODULES, `${id}.json`)
  if (!fs.existsSync(file)) continue
  const txt = JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8')).slides).toLowerCase()
  if (!txt.includes(p.phrase.toLowerCase())) fail('6 phrase in module file', `${s.id}: "${p.phrase}" is not in content/modules/${id}.json`)
}

// 7. dashes in our own copy
for (const s of stmts) if (/[\u2014\u2013]/.test(s.note)) fail('7 no dashes', `${s.id} note carries a dash`)

// 8. the ratchet
const partial = stmts.filter(s => s.verdict === 'PARTIAL').length
const full = stmts.filter(s => s.verdict === 'FULL').length
if (partial > MAX_PARTIAL) fail('8 ratchet', `${partial} PARTIAL, the ceiling is ${MAX_PARTIAL}`)
if (full < MIN_FULL) fail('8 ratchet', `${full} FULL, the floor is ${MIN_FULL}`)

console.log(`  ${full} taught, ${partial} in progress, ${stmts.length - full - partial} the school's computing scheme`)
if (bad) { console.error(`\n${bad} problem(s).`); process.exit(1) }
console.log('check-computing-coverage ok')
