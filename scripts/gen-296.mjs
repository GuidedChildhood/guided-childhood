#!/usr/bin/env node
// MIGRATION 296, GENERATED FROM THE BEATS FILE.
//
// content/beats/2026-09-14-friend-beats.json is the readable source: three
// Planet Friend beats per lesson, written by hand in each friend's register.
// This script turns it into two things that must agree:
//
//   1. supabase/migrations/296_every_lesson_animated.sql, which loads the
//      beats into a holding table and splices them into every deck in ONE
//      DO block, guarded, so the live row is never half written.
//   2. The four modules that also live as JSON in content/modules/, spliced
//      the same way in JavaScript, so scripts/check-module-contract.mjs can
//      hold them to every rule before the SQL goes near production.
//
// The splice, in both places:
//   arrival  -> straight after the title slide (skipped where a video beat
//               already plays there: ks1-03, ks2-04, ks2-06, ks2-07)
//   pause    -> before the first practise slide, as a star breath the friend
//               leads, which the council counts as the class acting
//   mission  -> before DiGi closes, taking its minute from the close where
//               the close has two or more, so the last stretch of watching
//               stays inside the council's four minutes
//   title    -> the character key rewritten to the friend's real key, and a
//               quieter hello where the lesson asks for one
//   timing   -> the teacher_notes timing string keeps telling the truth
//
// Usage: node scripts/gen-296.mjs

import fs from 'node:fs'

const beats = JSON.parse(fs.readFileSync('content/beats/2026-09-14-friend-beats.json', 'utf8'))
const NAMES = { pebble: 'Pebble', bloop: 'Bloop', orbit: 'Orbit', nova: 'Nova', cosmo: 'Cosmo', digi: 'DiGi' }
const KEYS = new Set(Object.keys(NAMES))

// No dashes in any copy, the same rule check-module-contract applies.
const dashy = v => /[‐-―]/.test(v) || /(?<=[a-z]) - (?=[a-z])/i.test(v) || /(?<=[a-z])-(?=[a-z])/i.test(v)

function arrivalScript(m) {
  const name = NAMES[m.character]
  if (m.character === 'digi') return 'Let DiGi say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.'
  if (m.register === 'still') return `Let ${name} settle and say the lines. Then read the question once, in your own voice, and leave it. Do not answer it. The next slide says what today is for.`
  return `Let ${name} land and say the lines. Then read the question on the wall once, in your own voice, and leave it hanging. Do not answer it. The next slide says what today is for, and the class talks before anyone is told.`
}

function pauseConfig(m) {
  const who = m.character === 'digi' ? 'the star' : NAMES[m.character]
  const grows = m.character === 'digi' ? 'the star grows' : `${who} grows`
  switch (m.register) {
    case 'bouncy':
      return { heading: 'Half time! Everyone together', prompt: `Breathe in as ${who} grows. Breathe out as ${who} shrinks. Then tell the person next to you one thing you found out today, and draw or write it on your sheet.` }
    case 'playful':
      return { heading: 'Half time · everyone together', prompt: `Two breaths: in as ${grows}, out as it shrinks. Then tell your neighbour one thing from today that surprised you, and write it on your sheet.` }
    case 'level':
      return { heading: 'Half time', prompt: `Two breaths with ${who}: in as it grows, out as it shrinks. Then tell your neighbour one thing from today that surprised you, and write it on your sheet.` }
    default:
      return { heading: 'Half time', prompt: `Two slow breaths: in as ${grows}, out as it shrinks. Then tell your neighbour one thing from today you want to remember, and write it on your sheet.` }
  }
}

function pauseScript(m) {
  const who = m.character === 'digi' ? 'the star' : NAMES[m.character]
  const what = m.register === 'still' ? 'one thing they want to remember' : 'one thing that surprised them'
  return `Half time. Two breaths with the whole room, in as ${who} grows and out as it shrinks. Then thirty seconds in pairs on ${what}, and they write it on their sheet. Nothing is marked and nobody reads theirs out. Then straight into the practise.`
}

function missionScript(m) {
  if (m.register === 'still') return 'The handover. Say nothing over it. When the last line lands, say it once more in your own words, level and unhurried. DiGi closes on the next slide.'
  return 'The handover. Say nothing over it. When the last line lands, ask them to look at you and say the mission once more in your own words. DiGi closes on the next slide.'
}

function build(m) {
  if (!KEYS.has(m.character) || !KEYS.has(m.titleKey)) throw new Error(`${m.id}: unknown character`)
  const arrival = m.arrival ? {
    type: 'digi', phase: 'starter', minutes: 1, character: m.character,
    heading: m.arrival.heading, lines: m.arrival.lines, script: arrivalScript(m),
  } : null
  const pc = pauseConfig(m)
  const pause = {
    type: 'interactive', phase: 'practise', minutes: 1, component: 'star-breath',
    config: { seconds: 4, character: m.character, register: m.register, heading: pc.heading, prompt: pc.prompt },
    script: pauseScript(m),
  }
  const mission = {
    type: 'digi', phase: 'close', minutes: 1, character: m.character,
    heading: m.mission.heading, lines: m.mission.lines, script: missionScript(m),
  }
  // Every word of new copy, checked for dashes before it goes anywhere.
  const copy = [
    ...(arrival ? [arrival.heading, ...arrival.lines, arrival.script] : []),
    pc.heading, pc.prompt, pause.script,
    mission.heading, ...mission.lines, mission.script,
    m.titleLine ?? '',
  ]
  for (const v of copy) if (dashy(v)) throw new Error(`${m.id}: dash in "${v}"`)
  return { arrival, pause, mission }
}

// The same splice the DO block performs, for the JSON modules.
const RESPONDS = new Set(['choice', 'discussion', 'tryit', 'interactive', 'scenario', 'quote'])
const respondsTo = s => RESPONDS.has(s.type) || (s.type === 'diagram' && Array.isArray(s.verdicts) && s.verdicts.length > 0)
function splice(slides, m, built) {
  // Refuses a deck that already carries its beats: the JSON modules are
  // spliced in place, and a second run must fail loudly, as the SQL does.
  if (slides.some(s => s.type === 'interactive' && s.config && s.config.character)) throw new Error(`${m.id}: already carries its beats`)
  const ti = slides.findIndex(s => s.type === 'title')
  const fp = slides.findIndex(s => s.phase === 'practise')
  const ld = slides.map(s => s.type).lastIndexOf('digi')
  if (ti < 0 || fp < 0 || ld !== slides.length - 1 || ti >= fp) throw new Error(`${m.id}: deck shape`)
  const hasVideo = slides[ti + 1]?.type === 'video'
  if (!!built.arrival === hasVideo) throw new Error(`${m.id}: arrival and video disagree`)
  const out = []
  let reduced = false
  slides.forEach((s, i) => {
    let x = { ...s }
    if (i === ti) { x.character = m.titleKey; if (m.titleLine) x.line = m.titleLine }
    if (i === fp) out.push(built.pause)
    if (i === ld) {
      if (x.minutes >= 2) { x.minutes -= 1; reduced = true }
      out.push(built.mission)
    }
    out.push(x)
    if (i === ti && built.arrival) out.push(built.arrival)
  })
  let run = 0, max = 0
  for (const s of out) { if (respondsTo(s)) run = 0; else { run += s.minutes; max = Math.max(max, run) } }
  if (max > 4) throw new Error(`${m.id}: passive run of ${max}`)
  return { out, reduced, added: (built.arrival ? 1 : 0) + 1 + (reduced ? 0 : 1) }
}
function retime(timing, m, reduced) {
  const lead = Number((timing.match(/^(\d+)/) || [])[1])
  if (!lead) throw new Error(`${m.id}: timing`)
  const added = (m.arrival ? 1 : 0) + 1 + (reduced ? 0 : 1)
  let t = timing.replace(/^\d+/, String(lead + added))
  const bump = (re, label) => { const mm = t.match(re); const n = Number(mm?.[2]); if (!n) throw new Error(`${m.id}: timing has no ${label}`); t = t.replace(re, `${mm[1]} ${n + 1}`) }
  if (m.arrival) bump(/(starter) (\d+)/, 'starter')
  bump(/(practi[cs]e) (\d+)/, 'practise')
  if (!reduced) bump(/(close) (\d+)/, 'close')
  return t
}

// ── 1. the JSON modules ────────────────────────────────────────────────
const byId = Object.fromEntries(beats.modules.map(m => [m.id, m]))
for (const f of fs.readdirSync('content/modules')) {
  const path = `content/modules/${f}`
  const mod = JSON.parse(fs.readFileSync(path, 'utf8'))
  const m = byId[mod.module_id]
  if (!m) throw new Error(`${f}: no beats`)
  const built = build(m)
  // A module already carrying its beats is left alone, so the SQL can be
  // regenerated after the JSON step has run once.
  if (mod.slides.some(s => s.type === 'interactive' && s.config && s.config.character)) { console.log(`${mod.module_id}: already carries its beats, JSON untouched`); continue }
  const { out, reduced } = splice(mod.slides, m, built)
  mod.slides = out
  mod.teacher_notes.timing = retime(mod.teacher_notes.timing, m, reduced)
  fs.writeFileSync(path, JSON.stringify(mod, null, 1) + '\n')
  console.log(`${mod.module_id}: ${out.length} slides, ${mod.teacher_notes.timing}`)
}

// ── 2. the SQL ─────────────────────────────────────────────────────────
const q = v => '$b$' + JSON.stringify(v) + '$b$'
const rows = beats.modules.map(m => {
  const b = build(m)
  return `insert into schools._m296 (module_id, title_key, title_line, arrival, pause, mission) values ($b$${m.id}$b$, $b$${m.titleKey}$b$, ${m.titleLine ? q(m.titleLine).replace(/^\$b\$"|"\$b\$$/g, '$b$') : 'null'}, ${b.arrival ? q(b.arrival) + '::jsonb' : 'null'}, ${q(b.pause)}::jsonb, ${q(b.mission)}::jsonb);`
})
const header = fs.readFileSync('scripts/gen-296.header.sql', 'utf8')
const block = fs.readFileSync('scripts/gen-296.block.sql', 'utf8')
const sql = [header, 'begin;', '',
  'create table if not exists schools.school_lessons_backup_296 as',
  '  select id, module_id, slides, teacher_notes, now() as backed_up_at from schools.school_lessons;',
  'alter table schools.school_lessons_backup_296 enable row level security;',
  '',
  'create table schools._m296 (module_id text primary key, title_key text not null, title_line text, arrival jsonb, pause jsonb not null, mission jsonb not null);',
  ...rows, '', 'commit;', '', block, '', 'drop table schools._m296;', ''].join('\n')
fs.writeFileSync('supabase/migrations/296_every_lesson_animated.sql', sql)
fs.mkdirSync('/tmp/claude-0/-home-user-guided-childhood/c93e2e38-cb42-5d4e-9d75-365c993da6a1/scratchpad/m296', { recursive: true })
const dir = '/tmp/claude-0/-home-user-guided-childhood/c93e2e38-cb42-5d4e-9d75-365c993da6a1/scratchpad/m296'
// Chunks for applying through the MCP: the holding table in a few calls, the DO block in one.
const setup = ['create table if not exists schools.school_lessons_backup_296 as select id, module_id, slides, teacher_notes, now() as backed_up_at from schools.school_lessons;',
  'alter table schools.school_lessons_backup_296 enable row level security;',
  'create table schools._m296 (module_id text primary key, title_key text not null, title_line text, arrival jsonb, pause jsonb not null, mission jsonb not null);'].join('\n')
fs.writeFileSync(`${dir}/00-setup.sql`, setup)
for (let i = 0; i < rows.length; i += 6) fs.writeFileSync(`${dir}/0${1 + i / 6}-rows.sql`, rows.slice(i, i + 6).join('\n'))
fs.writeFileSync(`${dir}/10-block.sql`, block)
fs.writeFileSync(`${dir}/11-drop.sql`, 'drop table schools._m296;')
console.log(`SQL written: ${rows.length} beat rows, ${sql.length} bytes; chunks in ${dir}`)
