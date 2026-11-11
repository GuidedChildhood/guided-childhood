#!/usr/bin/env node
// THE TERM REVIEW'S MUSTS AND THE THREE DESCRIPTORS, AS GUARDED MIGRATIONS.
//
// The progression and assessment review (plans/2026-11-11-progression-and-
// assessment-review.md) read every lesson and left 21 musts and one gap that
// every lesson shared: three judgement buttons with nothing saying where the
// line between them is. Justin, 11 November 2026: "go ahead with all".
//
// scripts/data/2026-11-lesson-musts/*.json is what the four reviewers then
// wrote: for each lesson, three descriptor lines (secure, developing, needs
// revisiting) built only from that lesson's own misconceptions and check
// questions, and the exact edits for its must, each with the value it
// replaces. This script is the only road from those files to the lesson files
// and to production.
//
// WHY NOT gen-review-batch. That one edits one string on one slide. Half of
// these are in teacher_notes and assessment (an answer key, a prior knowledge
// line, an exit question added), so this one takes any column and any value.
//
// WHAT IT DOES
//   1. checks every edit's `old` against the lesson file, character for
//      character, and refuses a dash in any new string
//   2. breaks a list edit into its changed items, so a migration never
//      replaces a whole list to change one line of it
//   3. writes the edits and the descriptors into the lesson files
//   4. writes the migrations, in batches small enough to apply by hand
//
// WHAT THE SQL GUARDS, value by value, inside one transaction per batch
//   already the new value   nothing to do, so a rerun is a no op
//   exactly the old value   written, then read back and compared
//   anything else           a hand edit: the batch aborts and writes nothing
// A string is guarded on the md5 of its text, which keeps a 900 character
// script out of the file twice. Anything else is guarded on the value itself.
//
// The wall, the attested phrases, the contract and the rubric are NOT checked
// here. They are checked by their own guards on the files this writes, which
// is every guard CI runs. Run them before applying anything.
//
// Usage: node scripts/gen-lesson-musts.mjs <first-number>          checks and reports
//        node scripts/gen-lesson-musts.mjs <first-number> --write  writes files and migrations

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA = path.join(ROOT, 'scripts/data/2026-11-lesson-musts')
const [first, ...flags] = process.argv.slice(2)
const WRITE = flags.includes('--write')
if (!/^\d+$/.test(first ?? '')) { console.error('usage: node scripts/gen-lesson-musts.mjs <first-number> [--write]'); process.exit(2) }

const MAX = 36000                       // characters of SQL per batch
const COLUMNS = ['slides', 'teacher_notes', 'assessment', 'parent_note']
const DASH = /[‐-―]| - /
const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex')
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const getAt = (o, segs) => segs.reduce((x, k) => (x == null ? undefined : x[k]), o)
const setAt = (o, segs, v) => { getAt(o, segs.slice(0, -1))[segs[segs.length - 1]] = v }
const strings = v => typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []
const words = s => s.trim().split(/\s+/).length

let bad = 0
const fail = (id, msg) => { bad++; console.error(`  FAIL ${id}: ${msg}`) }

// A list edit, as its changed items. Only when the list did not shrink and
// every change is an item replaced or an item added at the end, which is all
// a guarded write at one index can say.
function explode(e) {
  if (!Array.isArray(e.old) || !Array.isArray(e.new) || e.new.length < e.old.length) return [e]
  const out = []
  for (let i = 0; i < e.new.length; i++) {
    if (i < e.old.length && same(e.old[i], e.new[i])) continue
    out.push(...explode({ ...e, path: [...e.path, i], old: i < e.old.length ? e.old[i] : undefined, new: e.new[i] }))
  }
  return out
}

const lessons = []
for (const f of fs.readdirSync(DATA).filter(f => f.endsWith('.json')).sort()) {
  for (const L of JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'))) {
    const id = L.module_id
    const file = ['content/modules', 'content/standalone'].map(d => path.join(ROOT, d, `${id}.json`)).find(p => fs.existsSync(p))
    if (!file) { fail(id, 'no lesson file'); continue }
    const m = JSON.parse(fs.readFileSync(file, 'utf8'))
    const writes = []

    for (const e of L.edits ?? []) {
      if (!COLUMNS.includes(e.column)) { fail(id, `column ${e.column}`); continue }
      const cur = getAt(m[e.column], e.path)
      if (same(cur, e.new)) { fail(id, `${e.column} ${e.path.join('/')}: the file already holds the new value. This runs once, on the lesson files as they stood before it: restore content/ to that state to regenerate`); continue }
      if (!same(cur, e.old)) { fail(id, `${e.column} ${e.path.join('/')}: old does not match the file`); continue }
      for (const w of explode(e)) {
        if (same(w.old, w.new)) { fail(id, `${w.column} ${w.path.join('/')}: nothing changes`); continue }
        const fresh = strings(w.new).filter(s => DASH.test(s) && !strings(w.old).some(o => o === s))
        if (fresh.length) { fail(id, `${w.column} ${w.path.join('/')}: a dash in "${fresh[0].slice(0, 60)}"`); continue }
        writes.push({ column: w.column, path: w.path, old: w.old, new: w.new, why: e.why })
      }
    }

    // The three descriptors, in the one shape every page reads.
    const d = L.descriptors ?? {}
    const judgement = { scale: ['secure', 'developing', 'revisit'], descriptors: { secure: d.secure, developing: d.developing, revisit: d.revisit } }
    for (const k of judgement.scale) {
      const s = d[k]
      if (typeof s !== 'string' || !s.trim()) fail(id, `no ${k} descriptor`)
      else if (words(s) > 22) fail(id, `${k} descriptor is ${words(s)} words, over 22`)
      else if (DASH.test(s)) fail(id, `${k} descriptor carries a dash`)
    }
    if (!m.assessment || typeof m.assessment !== 'object') { fail(id, 'no assessment block to hold the descriptors'); continue }
    writes.push({ column: 'assessment', path: ['teacher_judgement'], old: m.assessment.teacher_judgement, new: judgement, why: 'What secure, developing and needs revisiting look like in this lesson, in one shape.' })

    for (const w of writes) setAt(m[w.column], w.path, w.new)
    lessons.push({ id, file, m, writes })
  }
}

if (bad) { console.error(`\n${bad} problem(s). Nothing written.`); process.exit(1) }

// ── the SQL ───────────────────────────────────────────────────────────────
const tag = n => `$gc${n}$`
const lit = (v, n) => { const s = JSON.stringify(v); if (s.includes(tag(n))) throw new Error('tag clash'); return `${tag(n)}${s}${tag(n)}::jsonb` }
const pgPath = segs => `'{${segs.map(s => (typeof s === 'number' ? s : `"${String(s).replace(/"/g, '\\"')}"`)).join(',')}}'`

function call(id, w, n) {
  const guard = w.old === undefined ? `null, null` : typeof w.old === 'string' ? `'${md5(w.old)}', null` : `null, ${lit(w.old, n)}`
  return `  perform pg_temp.gc_set('${id}', '${w.column}', ${pgPath(w.path)}, ${guard}, ${lit(w.new, n)});`
}

const head = (n, part, of, list) => `-- ${n}: the term review's lesson musts and the three descriptors, part ${part} of ${of}.
--
-- Generated by scripts/gen-lesson-musts.mjs from scripts/data/2026-11-lesson-musts.
-- Never edited by hand. The reasons are in that data, edit by edit, and in
-- plans/2026-11-11-progression-and-assessment-review.md.
--
-- In this part:
${list.map(l => `--   ${l.id}: ${l.writes.length - 1} edit(s) and the descriptors`).join('\n')}
--
-- The lesson files in content/ carry the same values, so file and row match.
--
-- GUARDED PER VALUE. Already the new value: nothing to do. Exactly the old
-- value: written, then read back. Anything else is a hand edit, and the whole
-- part aborts rather than overwrite it. Idempotent.

begin;

create function pg_temp.gc_set(m text, col text, p text[], old_md5 text, old_json jsonb, nv jsonb)
returns void language plpgsql as $fn$
declare
  cur jsonb;
begin
  if col not in ('slides', 'teacher_notes', 'assessment', 'parent_note') then
    raise exception '${n}: % is not a lesson column', col;
  end if;
  perform 1 from schools.school_lessons where module_id = m;
  if not found then
    raise exception '${n}: % is missing from schools.school_lessons', m;
  end if;
  execute format('select %I #> $1 from schools.school_lessons where module_id = $2', col) into cur using p, m;
  if cur is not distinct from nv then
    return;
  end if;
  if old_md5 is not null then
    if cur is null or jsonb_typeof(cur) <> 'string' or md5(cur #>> '{}') <> old_md5 then
      raise exception '${n}: % % % has been edited, refusing to overwrite it', m, col, p;
    end if;
  elsif cur is distinct from old_json then
    raise exception '${n}: % % % is not the value this migration replaces, refusing to overwrite it', m, col, p;
  end if;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, $2, true) where module_id = $3', col, col) using p, nv, m;
  execute format('select %I #> $1 from schools.school_lessons where module_id = $2', col) into cur using p, m;
  if cur is distinct from nv then
    raise exception '${n} proof: % % % did not take the new value', m, col, p;
  end if;
end $fn$;

do $do$
begin
`
const foot = `end $do$;

commit;
`

// Whole lessons per batch, in file order, so a lesson is never half applied.
const batches = [[]]
let size = 0
for (const l of lessons) {
  const body = l.writes.map(w => call(l.id, w, 0)).join('\n').length + 80
  if (size + body > MAX - 2600 && batches[batches.length - 1].length) { batches.push([]); size = 0 }
  batches[batches.length - 1].push(l); size += body
}

const total = lessons.reduce((n, l) => n + l.writes.length, 0)
console.log(`${lessons.length} lessons, ${total} guarded writes (${total - lessons.length} edits and ${lessons.length} descriptor blocks), ${batches.length} migration(s)`)
batches.forEach((list, i) => {
  const n = Number(first) + i
  const sql = head(n, i + 1, batches.length, list)
    + list.map(l => `  -- ${l.id}\n` + l.writes.map(w => call(l.id, w, n)).join('\n')).join('\n\n') + '\n\n' + foot
  const name = `${n}_lesson_musts_and_descriptors_${i + 1}.sql`
  console.log(`  ${name}: ${list.length} lessons, ${sql.length} characters`)
  if (WRITE) fs.writeFileSync(path.join(ROOT, 'supabase/migrations', name), sql)
})
if (WRITE) {
  for (const l of lessons) fs.writeFileSync(l.file, JSON.stringify(l.m, null, 2) + '\n')
  console.log('Lesson files and migrations written. Now run the guards.')
} else console.log('Dry run. Nothing written. Add --write.')
