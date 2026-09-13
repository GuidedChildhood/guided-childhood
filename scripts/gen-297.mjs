#!/usr/bin/env node
// MIGRATION 297, GENERATED: THE PASSPORT BEAT IN EVERY LESSON WITH A PAGE.
//
// One interactive of component passport-page per module, near the end of the
// deck, before DiGi closes. The copy is written per register (bouncy,
// playful, level, still: shared/friend-register) and per page (shared/
// passport-stages), in the passport's locked vocabulary: the passport, fills,
// earns, stamp, page, the big check. Never digital passport, never test or
// pass or fail, never safe or ready as a claim, and no venue claim.
//
// Two outputs that must agree, as gen-296 did:
//   1. supabase/migrations/297_the_passport_carries_through.sql: a holding
//      table and one guarded DO block (scripts/gen-297.block.sql).
//   2. The four modules that also live as JSON in content/modules/, spliced
//      the same way, so scripts/check-module-contract.mjs can hold them to
//      every rule (rule 9 is this beat) before the SQL goes near production.
// And the readable source, content/beats/2026-09-14-passport-beats.json.
//
// Usage: node scripts/gen-297.mjs

import fs from 'node:fs'

// The scheme, from the one list both apps read.
const curriculum = fs.readFileSync('shared/schools-curriculum.ts', 'utf8')
const MODULES = [...curriculum.matchAll(/moduleId: '([^']+)', keyStage: '([^']+)'/g)].map(m => ({ id: m[1], keyStage: m[2] }))
if (MODULES.length !== 25) throw new Error(`expected 25 modules in the curriculum, found ${MODULES.length}`)

const PLACEMENT = { EYFS: 'foundation', KS1: 'foundation', KS2: 'builder', KS3: 'shaper', KS4: 'independent', KS5: 'after' }
const REGISTER = { EYFS: 'bouncy', KS1: 'bouncy', KS2: 'playful', KS3: 'level', KS4: 'still', KS5: 'still' }
const PAGE = { foundation: { page: 'First steps', stamp: 'Pebble' }, builder: { page: 'Good habits', stamp: 'Bloop' }, shaper: { page: 'Making choices', stamp: 'Orbit' }, independent: { page: 'Ready at sixteen', stamp: 'Nova' } }

// No dashes in any copy, the same rule check-module-contract applies.
const dashy = v => /[‐-―]/.test(v) || /(?<=[a-z]) - (?=[a-z])/i.test(v) || /(?<=[a-z])-(?=[a-z])/i.test(v)

function copy(register, placement) {
  const { page, stamp } = PAGE[placement]
  switch (register) {
    case 'bouncy': return {
      heading: 'The passport',
      prompt: `Today filled a little bit of the ${page} page. Tap to fill it in!`,
      after: `A full page brings the big check, and the big check earns ${stamp}'s stamp!`,
      button: 'Fill the page',
      script: `DiGi Junior keeps a special book called the passport. It is the book of getting ready for phones and screens, all the way to sixteen. Every lesson we do together fills a little bit of the page, and jobs at home fill it too. Ask one child to come up and tap Fill the page, and when the ring moves, everybody shouts the word stamp. Then say: when the page is full, DiGi asks five little questions, the big check, and the page earns ${stamp}'s stamp. Nobody can fail the passport. It only ever fills up. The note going home today tells your grown ups which page it is. The count on the wall is this screen's memory of your class, not any child's record: the real passport is the one at home.`,
    }
    case 'playful': return {
      heading: 'The passport',
      prompt: `Today filled a little of the ${page} page. Tap to fill it in.`,
      after: `A full page brings the big check, and the big check earns ${stamp}'s stamp.`,
      button: 'Fill the page',
      script: `The passport is the book of getting ready for screens and phones, all the way to sixteen, and many of your families keep it at home in the parents app. Every lesson here fills a little of the page, and jobs at home fill it too. One volunteer taps Fill the page; the ring and the area bar move by one, and the class says the word stamp. Say: when the page is full, the big check earns ${stamp}'s stamp. Nobody can fail the passport, it only fills up. The parent note going home says which page today filled and carries the home code that puts it in the child's own book. The count on the wall is this screen's memory of your classes, never a child's record.`,
    }
    case 'level': return {
      heading: 'The passport',
      prompt: `Today filled part of the ${page} page. Tap to fill it in.`,
      after: `When the page is full, the big check earns ${stamp}'s stamp.`,
      button: 'Fill the page',
      script: `Thirty seconds, not a lecture. The passport is the record of getting ready for full access at sixteen, kept at home in the parents app, and every lesson here fills part of a page. Tap Fill the page, or hand the clicker to someone. Point at the area today built and the count moving. Say: when the page is full, the big check earns ${stamp}'s stamp, and nobody can fail it. The parent note carries the home code that puts today in their own passport. The count on the wall is this screen's memory of your classes, not anyone's record.`,
    }
    default: return {
      heading: 'The passport',
      prompt: `Today counts toward the ${page} page. Tap to fill it in.`,
      after: `When the page is full, the big check earns ${stamp}'s stamp.`,
      button: 'Fill the page',
      script: `Level and brief. The passport is the record of preparation for full access at sixteen, kept at home. Today fills part of its last page. Tap Fill the page, name the area it built, and say once: when the page is full, the big check earns ${stamp}'s stamp, and it is proof of judgement, never a licence. The parent note carries the home code that puts today in their own passport. The count on the wall is this screen's memory of your classes, not a record of anyone.`,
    }
  }
}

function build(m) {
  const placement = PLACEMENT[m.keyStage]
  if (!placement || placement === 'after') return null
  const register = REGISTER[m.keyStage]
  const c = copy(register, placement)
  for (const v of [c.heading, c.prompt, c.after, c.button, c.script]) if (dashy(v)) throw new Error(`${m.id}: dash in "${v}"`)
  return {
    type: 'interactive', phase: 'close', minutes: 1, component: 'passport-page',
    config: { placement, moduleId: m.id, register, heading: c.heading, prompt: c.prompt, after: c.after, button: c.button },
    script: c.script,
  }
}

const beats = MODULES.map(m => ({ id: m.id, keyStage: m.keyStage, placement: PLACEMENT[m.keyStage], register: REGISTER[m.keyStage], beat: build(m) }))
const withPage = beats.filter(b => b.beat)
if (withPage.length !== 23) throw new Error(`expected 23 beats, built ${withPage.length}`)
fs.mkdirSync('content/beats', { recursive: true })
fs.writeFileSync('content/beats/2026-09-14-passport-beats.json', JSON.stringify({ generated: '2026-09-13', note: 'One passport beat per module with a page, by register. Generated by scripts/gen-297.mjs; edit the generator, not this file.', modules: beats }, null, 1) + '\n')

// The same splice the DO block performs, for the JSON modules.
const RESPONDS = new Set(['choice', 'discussion', 'tryit', 'interactive', 'scenario', 'quote'])
const respondsTo = s => RESPONDS.has(s.type) || (s.type === 'diagram' && Array.isArray(s.verdicts) && s.verdicts.length > 0)
function splice(slides, id, beat) {
  if (slides.some(s => s.type === 'interactive' && s.component === 'passport-page')) throw new Error(`${id}: already carries a passport beat`)
  const ld = slides.map(s => s.type).lastIndexOf('digi')
  if (ld !== slides.length - 1) throw new Error(`${id}: does not close on DiGi`)
  const out = []
  let removed = 0
  slides.forEach((s, i) => {
    if (s.type === 'digi' && s.heading === 'The passport') { removed += s.minutes ?? 0; return }
    if (i === ld) out.push(beat)
    out.push(s)
  })
  let run = 0, max = 0
  for (const s of out) { if (respondsTo(s)) run = 0; else { run += s.minutes; max = Math.max(max, run) } }
  if (max > 4) throw new Error(`${id}: passive run of ${max}`)
  return { out, added: (beat.minutes ?? 0) - removed }
}
function retime(timing, id, added) {
  if (added === 0) return timing
  const lead = Number((timing.match(/^(\d+)/) || [])[1])
  if (!lead) throw new Error(`${id}: timing`)
  let t = timing.replace(/^\d+/, String(lead + added))
  const mm = t.match(/(close) (\d+)/)
  const c = Number(mm?.[2])
  if (!c) throw new Error(`${id}: timing has no close count`)
  t = t.replace(/(close) (\d+)/, `${mm[1]} ${c + added}`)
  return t
}

// ── 1. the JSON modules ────────────────────────────────────────────────
const byId = Object.fromEntries(beats.map(b => [b.id, b]))
for (const f of fs.readdirSync('content/modules')) {
  const path = `content/modules/${f}`
  const mod = JSON.parse(fs.readFileSync(path, 'utf8'))
  const b = byId[mod.module_id]
  if (!b) throw new Error(`${f}: not in the curriculum`)
  if (!b.beat) { console.log(`${mod.module_id}: after the passport, no beat`); continue }
  if (mod.slides.some(s => s.type === 'interactive' && s.component === 'passport-page')) { console.log(`${mod.module_id}: already carries its beat, JSON untouched`); continue }
  const { out, added } = splice(mod.slides, mod.module_id, b.beat)
  mod.slides = out
  mod.teacher_notes.timing = retime(mod.teacher_notes.timing, mod.module_id, added)
  const real = out.reduce((t, s) => t + (s.minutes ?? 0), 0)
  if (Number(mod.teacher_notes.timing.match(/^(\d+)/)[1]) !== real) throw new Error(`${mod.module_id}: timing ${mod.teacher_notes.timing} vs ${real}`)
  fs.writeFileSync(path, JSON.stringify(mod, null, 1) + '\n')
  console.log(`${mod.module_id}: ${out.length} slides, ${mod.teacher_notes.timing}`)
}

// ── 2. the SQL ─────────────────────────────────────────────────────────
const q = v => '$b$' + JSON.stringify(v) + '$b$'
const rows = withPage.map(b => `insert into schools._m297 (module_id, beat) values ($b$${b.id}$b$, ${q(b.beat)}::jsonb);`)
const header = fs.readFileSync('scripts/gen-297.header.sql', 'utf8')
const block = fs.readFileSync('scripts/gen-297.block.sql', 'utf8')
const setup = [
  'create table if not exists schools.school_lessons_backup_297 as',
  '  select id, module_id, slides, teacher_notes, now() as backed_up_at from schools.school_lessons;',
  'alter table schools.school_lessons_backup_297 enable row level security;',
  'create table schools._m297 (module_id text primary key, beat jsonb not null);',
]
const sql = [header, 'begin;', '', ...setup, '', ...rows, '', 'commit;', '', block, '', 'drop table schools._m297;', ''].join('\n')
fs.writeFileSync('supabase/migrations/297_the_passport_carries_through.sql', sql)
const dir = '/tmp/claude-0/-home-user-guided-childhood/c93e2e38-cb42-5d4e-9d75-365c993da6a1/scratchpad/m297'
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(`${dir}/00-setup.sql`, setup.join('\n'))
for (let i = 0; i < rows.length; i += 6) fs.writeFileSync(`${dir}/0${1 + i / 6}-rows.sql`, rows.slice(i, i + 6).join('\n'))
fs.writeFileSync(`${dir}/10-block.sql`, block)
fs.writeFileSync(`${dir}/11-drop.sql`, 'drop table schools._m297;')
console.log(`SQL written: ${rows.length} beat rows, ${sql.length} bytes; chunks in ${dir}`)
