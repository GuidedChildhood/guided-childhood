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
const IDENT = new Set(['module_id', 'component', 'type', 'phase', 'mode', 'key_stage', 'moduleId'])
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

// 6d. the two quiz banks, in either shape the print pages accept
// Added 13 September 2026 after the schools review found the four JSON
// authored modules answering 500 on their printed quizzes in production:
// they carry {title, instructions, questions} where migration 269 wrote
// plain arrays, and the pages called .map on the row as it came. The reader
// in schools/lib/quiz.ts takes both; this pins that nothing else arrives.
for (const key of ['starter_quiz', 'exit_quiz']) {
  const v = tn[key]
  const rows = Array.isArray(v) ? v : (v && typeof v === 'object' && Array.isArray(v.questions) ? v.questions : null)
  // Two row shapes, both drawn by the sheet through schools/lib/quiz.ts: the
  // full one from migration 269, or the compact multiple choice one the JSON
  // modules use, where the answer is an index into the options.
  const fullRow = q => typeof q.question === 'string' && typeof q.answer === 'string' && typeof q.format === 'string'
  const compactRow = q => typeof q.q === 'string' && Array.isArray(q.options) && q.options.length > 1 &&
    Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length
  const good = Array.isArray(rows) && rows.length > 0 &&
    rows.every(q => q && typeof q === 'object' && (fullRow(q) || compactRow(q)))
  ok(`${key} is a bank of questions (an array, or {questions}; full or compact rows)`, good, rows ? `${rows.length} rows` : typeof v)
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

// 8. the friends are real, and they are the module's own (13 September 2026)
//
// Since migration 296 a digi slide can name a Planet Friend and the title
// slide names who opens the lesson. Both are looked up by key at render time,
// and an unknown key falls back silently: the beat plays as DiGi, the intro
// picks a friend from the title. That is the same shape as the parent note
// fields nothing read, so it is guarded here rather than found on a wall.
// A friend on a beat must also be named in the row's cast line, so a KS2
// deck cannot quietly carry Nova.
const FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo', 'digi']
const cast = String(m.row && m.row.character_cast ? m.row.character_cast : '').toLowerCase()
slides.forEach((s, i) => {
  if (s.type === 'title') ok(`slide ${i} (title) names a real friend`, FRIENDS.includes(s.character), `character is ${JSON.stringify(s.character)}`)
  if (s.type === 'digi' && s.character !== undefined) {
    ok(`slide ${i} (digi beat) names a real friend`, FRIENDS.includes(s.character), `character is ${JSON.stringify(s.character)}`)
    ok(`slide ${i} (digi beat) friend is in the cast`, cast.includes(String(s.character)), `cast is "${cast}"`)
  }
  if (s.type === 'interactive' && s.config && s.config.character !== undefined) {
    ok(`slide ${i} (interactive) names a real friend`, FRIENDS.includes(s.config.character), `character is ${JSON.stringify(s.config.character)}`)
  }
})

// 9. the passport beat (13 September 2026, migration 297)
//
// Every module with a page carries exactly one interactive of component
// passport-page, right before DiGi closes, naming its own module and the page
// the row already knows (migration 277). A module after the passport carries
// none. The player degrades an unknown or mismatched beat silently (a wrong
// page draws the wrong colours, a wrong module fills the wrong segment), so it
// is guarded here rather than found on a wall.
const PLACEMENT_BY_KS = { EYFS: 'foundation', KS1: 'foundation', KS2: 'builder', KS3: 'shaper', KS4: 'independent', KS5: 'after' }
const placement = (m.teacher_notes && m.teacher_notes.passport_stage) || PLACEMENT_BY_KS[m.key_stage]
const passportBeats = slides.map((s, i) => [s, i]).filter(([s]) => s.type === 'interactive' && s.component === 'passport-page')
if (placement === 'after') {
  ok('no passport beat on a module after the passport', passportBeats.length === 0, `found ${passportBeats.length}`)
} else {
  ok('exactly one passport beat', passportBeats.length === 1, `found ${passportBeats.length}`)
  if (passportBeats.length === 1) {
    const [pb, pi] = passportBeats[0]
    ok('passport beat names this module', !!pb.config && pb.config.moduleId === m.module_id, `moduleId is ${JSON.stringify(pb.config && pb.config.moduleId)}`)
    ok('passport beat names the row page', !!pb.config && pb.config.placement === placement, `placement is ${JSON.stringify(pb.config && pb.config.placement)}, row says ${placement}`)
    ok('passport beat is in the close phase', pb.phase === 'close', `phase is ${pb.phase}`)
    ok('passport beat sits right before DiGi closes', pi === slides.length - 2 && slides[slides.length - 1].type === 'digi', `at ${pi} of ${slides.length}`)
  }
  ok('no old passport digi slide survives', !slides.some(s => s.type === 'digi' && s.heading === 'The passport'))
}

// 10. the scaffold is one of the three the database allows (19 September 2026)
//
// `scaffold` is a three way classification of what a lesson asks a child to
// DO: notice a mechanism, choose a behaviour, or tell somebody. All 25 live
// modules carry one of those three, and the column has a CHECK constraint
// naming them. Nothing in this file knew that, so four new modules were
// written with the lesson's memorable tool in the field instead ("SHIELD",
// "NAME IT, SAVE IT, SAY IT"), every local guard passed, and the first thing
// to object was Postgres, at apply time, after the modules had been written,
// reviewed, committed and pushed.
//
// That is the wrong place to find out. The tool belongs in teacher_notes.tool,
// which those modules already carried, so the fix cost nothing and the only
// real loss was the round trip. This rule moves the objection back to the
// desk. If the constraint ever widens, widen this list in the same commit.
const SCAFFOLDS = ['NOTICE', 'CHOOSE', 'TELL']
const scaffold = m.row && m.row.scaffold
ok(`row.scaffold is one of ${SCAFFOLDS.join(', ')}`, SCAFFOLDS.includes(scaffold),
   `scaffold is ${JSON.stringify(scaffold)}. The lesson's memorable tool goes in teacher_notes.tool, not here`)

// 11. the teacher notes carry the shapes the pages read (20 September 2026)
//
// The four modules written on 19 September carried prior_knowledge, i_can and
// differentiation as prose, where the other twenty five carry two lists and a
// { support, stretch } object. Every local guard passed, the migrations
// applied, and the lesson home page then crashed on all four in production
// ("notes.prior_knowledge.map is not a function"), which a teacher meets as
// "That page did not load" on the page they open first. A render against a
// fixture found it a day later, which is a day late. The pages now tolerate a
// string, and this rule refuses one, so the shape is decided here rather than
// at the first click.
const notes = m.teacher_notes || {}
for (const k of ['prior_knowledge', 'i_can', 'key_learning_points', 'misconceptions']) {
  const v = notes[k]
  ok(`teacher_notes.${k} is a list of strings`, v === undefined || (Array.isArray(v) && v.every(x => typeof x === 'string')),
     `${k} is ${Array.isArray(v) ? 'a list with a non string entry' : typeof v}. The pages map over it, so prose goes in as a one entry list`)
}
ok('teacher_notes.differentiation is { support, stretch }', notes.differentiation === undefined ||
   (notes.differentiation && typeof notes.differentiation === 'object' && !Array.isArray(notes.differentiation)),
   `differentiation is ${typeof notes.differentiation}. Split the prose on its Support and Stretch labels`)

// 12. every star breath breathes in time, and the half time one is the friend's (20 September 2026)
//
// Since migration 296 every lesson pauses at half time on a star breath the
// module's own friend leads: a four second breath, a heading, and the half
// time words under it. The four modules written on 19 September shipped the
// breath with none of that and a thirty second cycle, which the player renders
// as one breath in that lasts half a minute. Rule 8 checked the friend's name
// only when one was given, so a breath with no friend passed.
//
// A lesson can carry other star breaths (the Reception settle at the start,
// the KS1 calm bodies practice, the KS4 panic lever), and those are DiGi
// Junior's with no words needed. So: every breath is four seconds; a breath
// that names a friend carries the heading, the words and the register; and
// the module carries at least one friend led breath, the half time beat.
// (ks3-12, older than the contract, carries its pause as film instead.)
const breaths = slides.filter(s => s.type === 'interactive' && s.component === 'star-breath')
slides.forEach((s, i) => {
  if (s.type !== 'interactive' || s.component !== 'star-breath') return
  const c = s.config || {}
  ok(`slide ${i} (star breath) breathes for four seconds`, c.seconds === undefined || c.seconds === 4, `seconds is ${JSON.stringify(c.seconds)}, one breath in and one out, not a stopwatch`)
  if (c.character === undefined) return
  ok(`slide ${i} (star breath) carries a heading`, typeof c.heading === 'string' && c.heading.trim().length > 0)
  ok(`slide ${i} (star breath) carries the half time words`, typeof c.prompt === 'string' && c.prompt.trim().length > 20)
  ok(`slide ${i} (star breath) names its register`, ['bouncy', 'playful', 'level', 'still'].includes(c.register), `register is ${JSON.stringify(c.register)}`)
})
ok('the half time breath is led by a friend', breaths.some(s => FRIENDS.includes(s.config && s.config.character)),
   `${breaths.length} star breath(s), none naming a friend. The half time beat wants character, register, heading and prompt in its config`)

if (bad) { console.error(`\n${bad} problem(s).`); process.exit(1) }
console.log(`${m.module_id}: ${slides.length} slides, ${real} minutes, ${teach.length} teach slides, cycles ${mins.join('/')} = ${teachTotal}, all checks pass.`)
