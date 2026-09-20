#!/usr/bin/env node
// A MODULE, CUT INTO STATEMENTS SMALL ENOUGH TO CARRY BY HAND.
//
// WHY THIS EXISTS. There is no database password in the build container and no
// migration step in CI, so a new module reaches production through the Supabase
// tool, pasted. A module migration is forty to seventy thousand characters, and
// its slides are a SINGLE json literal of nearly thirty thousand. Retyping one
// line that long is the least reliable thing in the whole pipeline, and what it
// breaks is curriculum prose that ends up on a classroom wall.
//
// So the module is cut up. One statement creates the row with an empty slides
// array and the small columns, a run of statements appends the slides a few at
// a time, and a last statement fills the remaining json payloads. Every piece
// is a few kilobytes, which is a size that can be carried accurately, and the
// sequence is idempotent from part 0 because part 0 resets the row.
//
// THE SQL IN supabase/migrations IS STILL THE MIGRATION. These parts are the
// delivery van, not the goods. The generated migration file stays the record of
// what the module is, and scripts/module-string-hash.mjs proves afterwards that
// what arrived is what was sent, string for string.
//
// ORDER IS PRESERVED because jsonb array concatenation appends, so parts
// applied in order rebuild the slides array in its original order. The verify
// step checks the slide count as well as the hash, so a part applied twice or
// skipped is caught rather than assumed away.
//
// Usage: node scripts/module-to-chunks.mjs <module.json> <outdir> [maxChars]

import fs from 'node:fs'
import path from 'node:path'

const [, , jsonPath, outDir, maxCharsArg] = process.argv
if (!jsonPath || !outDir) {
  console.error('usage: node scripts/module-to-chunks.mjs <module.json> <outdir> [maxChars]')
  process.exit(2)
}
const MAX = Number(maxCharsArg || 4500)

const m = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const row = m.row

const q = s => `'${String(s).replace(/'/g, "''")}'`
const jq = v => q(JSON.stringify(v))
const textArray = xs => xs.length ? `array[${xs.map(q).join(',')}]` : `array[]::text[]`
const intArray = xs => xs.length ? `array[${xs.map(n => q(String(n))).join(',')}]::int[]` : `array[]::int[]`

fs.mkdirSync(outDir, { recursive: true })
for (const f of fs.readdirSync(outDir)) if (/^part-\d+\.sql$/.test(f)) fs.unlinkSync(path.join(outDir, f))

const parts = []

// Part 0: the row itself, with an empty slides array and empty json payloads.
// on conflict resets, so re-running part 0 restarts the whole sequence cleanly.
parts.push(
`insert into schools.school_lessons (
  module_id, title, key_stage, year_band, audience,
  efcw_strands, statutory_hooks, ailit_domains,
  evidence_anchor, single_action_outcome, character_cast,
  slides, video_beats, assessment, parent_note, teacher_notes, dsl_note,
  sort_order, scaffold
) values (
  ${q(m.module_id)}, ${q(row.title)}, ${q(m.key_stage)}, ${q(row.year_band)}, ${q(row.audience)},
  ${intArray(row.efcw_strands || [])}, ${textArray(row.statutory_hooks || [])}, ${textArray(row.ailit_domains || [])},
  ${q(row.evidence_anchor)}, ${q(row.single_action_outcome)}, ${q(row.character_cast)},
  '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, null,
  ${m.sort_order}, ${q(row.scaffold)}
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  audience = excluded.audience, efcw_strands = excluded.efcw_strands,
  statutory_hooks = excluded.statutory_hooks, ailit_domains = excluded.ailit_domains,
  evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome,
  character_cast = excluded.character_cast, slides = '[]'::jsonb,
  video_beats = '[]'::jsonb, assessment = '{}'::jsonb, parent_note = '{}'::jsonb,
  teacher_notes = '{}'::jsonb, dsl_note = null,
  sort_order = excluded.sort_order, scaffold = excluded.scaffold;`
)

// Slide appends, greedily packed up to MAX characters of serialised json.
let batch = []
const flush = () => {
  if (!batch.length) return
  parts.push(
    `update schools.school_lessons set slides = slides || ${jq(batch)}::jsonb\n` +
    `where module_id = ${q(m.module_id)};`
  )
  batch = []
}
for (const slide of m.slides) {
  const next = JSON.stringify([...batch, slide])
  if (batch.length && next.length > MAX) flush()
  batch.push(slide)
}
flush()

// The remaining json payloads. Most go in one statement, but teacher_notes is
// ten to twenty seven thousand characters on the secondary modules, so it is
// built key by key, and the two keys that are still too big on their own
// (subject_knowledge and evidence_base, both arrays of short entries) are
// appended a few entries at a time.
const set = (col, expr) =>
  `update schools.school_lessons set ${col} = ${expr} where module_id = ${q(m.module_id)};`

// Batch the elements of an array into appends against `target`, which is
// either the column itself or a key inside it.
const appendArray = (col, key, arr) => {
  const read = key === null ? col : `${col}->${q(key)}`
  const write = v => key === null
    ? set(col, `${col} || ${jq(v)}::jsonb`)
    : set(col, `jsonb_set(${col}, '{${key}}', ${read} || ${jq(v)}::jsonb, true)`)
  parts.push(key === null ? set(col, `'[]'::jsonb`) : set(col, `jsonb_set(${col}, '{${key}}', '[]'::jsonb, true)`))
  let acc = []
  for (const el of arr) {
    if (acc.length && JSON.stringify([...acc, el]).length > MAX) { parts.push(write(acc)); acc = [] }
    acc.push(el)
  }
  if (acc.length) parts.push(write(acc))
}

const emit = (col, value) => {
  if (value == null) { parts.push(set(col, 'null')); return }
  if (JSON.stringify(value).length <= MAX) { parts.push(set(col, `${jq(value)}::jsonb`)); return }
  if (Array.isArray(value)) { appendArray(col, null, value); return }
  parts.push(set(col, `'{}'::jsonb`))
  for (const [k, v] of Object.entries(value)) {
    if (JSON.stringify(v).length <= MAX) parts.push(set(col, `${col} || ${jq({ [k]: v })}::jsonb`))
    else if (Array.isArray(v)) appendArray(col, k, v)
    else throw new Error(`${col}.${k} is ${JSON.stringify(v).length} chars and is not an array, so it cannot be split`)
  }
}

emit('video_beats', m.video_beats || [])
emit('assessment', m.assessment)
emit('parent_note', m.parent_note)
emit('teacher_notes', m.teacher_notes)
if (m.dsl_note) emit('dsl_note', m.dsl_note)

parts.forEach((sql, i) => {
  fs.writeFileSync(path.join(outDir, `part-${String(i).padStart(2, '0')}.sql`), sql + '\n')
})

const sizes = parts.map(p => p.length)
console.log(`${m.module_id}: ${m.slides.length} slides, ${parts.length} parts, largest ${Math.max(...sizes)} chars`)
console.log(`  written to ${outDir}/part-00.sql .. part-${String(parts.length - 1).padStart(2, '0')}.sql`)
