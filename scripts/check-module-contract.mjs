#!/usr/bin/env node
// ONE MODULE, HELD TO EVERY RULE THE SCHEME HAS LEARNED.
//
// Written while building ks3-22 and kept, because it caught three diagram
// slides with no teacher script that nothing else would have noticed: not the
// typecheck, not the council, not the migration guards, and not a person
// reading 27 slides looking for what is there rather than what is missing.
//
// It checks a module JSON before it ever becomes a migration:
//   1. every cycle after the first anchors on a heading in its own deck
//   2. every cycle states the minutes the slides it contains actually run
//   3. no passive stretch exceeds four minutes
//   4. the timing string states the real total
//   5. no dashes in any copy, identifiers excepted
//   6. every contract key the other modules carry is present
//   7. every slide has a teacher script and a positive minute count
//
// Usage: node scripts/check-module-contract.mjs <module.json>

import fs from 'node:fs'
const m = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const tn = m.teacher_notes, slides = m.slides
let bad = 0
const ok = (n, c, d='') => { if (!c) { bad++; console.error(`  FAIL ${n}${d?'\n       '+d:''}`) } }

// 1. cycle anchoring, the player's exact rule
const STOP = new Set(['the','a','an','and','of','is','it','to','in','you','your','not','that','on','for'])
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!STOP.has(w))
const teach = slides.filter(s => s.phase === 'teach')
const starts = [0]
for (let c = 1; c < tn.cycles.length; c++) {
  const tw = norm(tn.cycles[c].title)
  let best = -1, bs = 0
  for (let t = starts[c-1]+1; t < teach.length; t++) {
    const h = teach[t].heading; if (!h) continue
    const hw = new Set(norm(h))
    const sc = tw.filter(w=>hw.has(w)).length / tw.length
    if (sc > bs) { bs = sc; best = t }
  }
  ok(`cycle ${c+1} "${tn.cycles[c].title}" anchors`, bs >= 0.5, `best score ${bs.toFixed(2)}`)
  starts.push(best)
}

// 2. cycle minutes == the slides each cycle actually contains
const mins = tn.cycles.map(()=>0)
let ci = 0
for (let t = 0; t < teach.length; t++) {
  while (ci+1 < starts.length && t >= starts[ci+1]) ci++
  mins[ci] += teach[t].minutes
}
tn.cycles.forEach((c,i) => ok(`cycle ${i+1} states the minutes it runs`, c.minutes === mins[i], `states ${c.minutes}, runs ${mins[i]}`))
const teachTotal = teach.reduce((a,s)=>a+s.minutes,0)
ok('cycle minutes sum to the teach phase', mins.reduce((a,b)=>a+b,0) === teachTotal)

// 3. no passive stretch over four minutes
const ACTIVE = new Set(['choice','discussion','interactive','tryit'])
let run = 0, from = null
slides.forEach((s,i) => {
  if (ACTIVE.has(s.type)) { run = 0; from = null; return }
  if (run === 0) from = i
  run += s.minutes
  ok(`passive run from slide ${from} stays inside four minutes`, run <= 4, `run is ${run} by slide ${i} (${s.type})`)
})

// 4. the timing string tells the truth
const stated = Number((tn.timing.match(/^(\d+)/)||[])[1])
const real = slides.reduce((a,s)=>a+s.minutes,0)
ok('the timing string states the real total', stated === real, `states ${stated}, runs ${real}`)

// 5. no dashes anywhere in the copy
// Identifiers are not copy. module_id, component names and the like are
// machine strings that never reach a pupil or a teacher, and holding them to
// the no dashes rule was the check being wrong rather than the content.
//
// The /i is load bearing. Without it the lookbehind is case sensitive, so a
// dash after a capital sails through: "AI-Native" did exactly that, in a cited
// report title in ks3-24, and was only found by eye. Digits stay OUT of the
// character class on purpose, because module ids are quoted inside prose
// ("from ks2-06") and those are identifiers, not punctuation.
const IDENT = new Set(['module_id', 'component', 'type', 'phase', 'mode', 'key_stage'])
const walk = (v, path) => {
  if (IDENT.has(path.split('.').pop())) return
  if (typeof v === 'string') {
    const hit = v.match(/[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i)
    if (hit) { bad++; console.error(`  FAIL dash at ${path}: ...${v.slice(Math.max(0,hit.index-30), hit.index+30)}...`) }
  } else if (Array.isArray(v)) v.forEach((x,i)=>walk(x,`${path}[${i}]`))
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`)
}
walk(m, 'module')

// 6. the contract
const NEED = 'commitment_stem cycles differentiation equipment essential_question exit_quiz i_can key_learning_points keywords learning_objective misconceptions paper_fallback passport_stage prior_knowledge send starter_quiz teacher_tip timing tool worksheet worksheet_items'.split(' ')
const missing = NEED.filter(k => !(k in tn))
ok('every contract key present', missing.length === 0, missing.join(', '))

// 6b. the SHAPE of every teacher_notes field, not just its presence
// Added 11 September 2026 after ks3-24 shipped with subject_knowledge as a
// plain string where the lesson page expects {heading, body}[]. The page
// guards with `notes.subject_knowledge?.length`, and a non empty string has a
// length, so it sailed past the guard and threw on .map. The prep page 500ed
// in production and no check noticed, because check 6 only asks whether the
// key is THERE. Three more fields were wrong the same way in the same module:
// evidence_base as a list of strings, parent_questions as a list of strings,
// and hard_questions keyed {a,q} instead of {question,answer}.
//
// These four are optional, so a module without them is fine. A module WITH one
// in the wrong shape is a 500 on the page a teacher opens the night before.
const SHAPES = {
  subject_knowledge: ['heading', 'body'],
  hard_questions:    ['question', 'answer'],
  parent_questions:  ['question', 'answer'],
  evidence_base:     ['claim', 'source', 'status'],
}
for (const [key, need] of Object.entries(SHAPES)) {
  const v = tn[key]
  if (v === undefined) continue
  const isRows = Array.isArray(v) && v.length > 0 &&
    v.every(r => r && typeof r === 'object' && !Array.isArray(r) && need.every(k => typeof r[k] === 'string'))
  ok(`${key} is [{${need.join(', ')}}]`, isRows,
     Array.isArray(v) ? `array of ${typeof v[0]}, first keys: ${v[0] && typeof v[0] === 'object' ? Object.keys(v[0]).join('/') : String(v[0]).slice(0,30)}` : typeof v)
}

// 6c. the PARENT NOTE carries the fields the app actually reads
// Added 11 September 2026, and found the same way as 6b: by reading the
// consumers rather than the schema. The parent note is rendered in three
// places (print/[module] page 5, the lesson page's "What goes home" card, and
// the run sheet's after-the-lesson row) and between them they read exactly
// headline, taught, try_this, family_question and passport.
//
// ks3-24 shipped with `try_tonight` and `words` instead. Nothing reads either.
// Every field is guarded with &&, so nothing crashed and rendering the page
// did not catch it: the sheet simply printed with no try-this box, no dinner
// table question and no passport line, and the run sheet quietly dropped the
// passport clause from its tick row. 23 of 24 modules had it right, which is
// what made it worth pinning rather than treating as taste.
const PARENT_NEED = ['headline', 'taught', 'try_this', 'family_question', 'passport']
const pn = m.parent_note
if (pn && typeof pn === 'object') {
  const missing = PARENT_NEED.filter(k => typeof pn[k] !== 'string' || !pn[k].trim())
  ok(`parent note carries ${PARENT_NEED.join(', ')}`, missing.length === 0,
     `missing or empty: ${missing.join(', ')}`)
  // The dead spellings, named, so a writer copying an old module is told why.
  const dead = ['try_tonight', 'words'].filter(k => k in pn)
  ok('parent note has no fields the app cannot read', dead.length === 0,
     `${dead.join(' and ')} is read by nothing. try_this and family_question are the live names`)
}

// 7. every slide has a script and minutes
slides.forEach((s,i) => {
  ok(`slide ${i} (${s.type}) has a script`, typeof s.script === 'string' && s.script.length > 20)
  ok(`slide ${i} (${s.type}) has minutes`, Number.isInteger(s.minutes) && s.minutes > 0)
})

if (bad) { console.error(`\n${bad} problem(s).`); process.exit(1) }
console.log(`${m.module_id}: ${slides.length} slides, ${real} minutes, ${teach.length} teach slides, cycles ${mins.join('/')} = ${teachTotal}, all checks pass.`)
