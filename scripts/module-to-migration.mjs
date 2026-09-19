#!/usr/bin/env node
// A MODULE JSON, TURNED INTO ITS MIGRATION. NEVER BY HAND AGAIN.
//
// Migrations 312 and 313 were assembled by hand from the module JSON, which
// works exactly as long as nobody mistypes a quote inside sixty thousand
// characters of curriculum prose. That is not a bet worth taking twice, and
// it is the same class of mistake the coverage audit was written to catch:
// something claimed in one place that does not match what is actually there.
//
// So the JSON is the source and the SQL is generated from it. Run the
// contract check first, then this, then apply. If the JSON and the database
// ever disagree, regenerate rather than patch.
//
// Quoting: every value goes through one function that doubles single quotes,
// which is the only escape Postgres string literals need. JSON columns are
// serialised with JSON.stringify and quoted the same way, so a curly quote or
// an apostrophe inside a teacher script cannot end the literal early.
//
// CHECKED AGAINST THE HAND WRITTEN ONE. Regenerating 313 from its own JSON
// gives SQL that is byte identical to the migration a person wrote, up to the
// first jsonb literal, and from there differs only in JSON separator spacing,
// which jsonb normalises away on the way in. All six JSON payloads in the
// hand written file parse deep equal to the module JSON. So this is the same
// migration, produced by something that cannot mistype.
//
// Usage: node scripts/module-to-migration.mjs <module.json> <number> <slug> [header.txt]
//   header.txt, if given, is prepended as the migration's comment block. It
//   should already be comment lines. Without it a short stub is written and
//   the writer is expected to replace it, because a migration with no reason
//   in it is how the next person loses an hour.

import fs from 'node:fs'

const [, , jsonPath, number, slug, headerPath] = process.argv
if (!jsonPath || !number || !slug) {
  console.error('usage: node scripts/module-to-migration.mjs <module.json> <number> <slug> [header.txt]')
  process.exit(2)
}

const m = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const row = m.row

// One escape, used for every literal. Postgres doubles the single quote and
// needs nothing else inside a standard conforming string.
const q = s => `'${String(s).replace(/'/g, "''")}'`
const jq = v => q(JSON.stringify(v))
const textArray = xs => xs.length ? `array[${xs.map(q).join(',')}]` : `array[]::text[]`
const intArray = xs => xs.length ? `array[${xs.map(n => q(String(n))).join(',')}]::int[]` : `array[]::int[]`

const header = headerPath
  ? fs.readFileSync(headerPath, 'utf8').trimEnd()
  : `-- ${row.title.toUpperCase()}\n--\n-- Generated from ${jsonPath} by scripts/module-to-migration.mjs.\n-- REPLACE THIS BLOCK with what the module closes and why it exists.`

const sql = `${header}

begin;

insert into schools.school_lessons (
  module_id, title, key_stage, year_band, audience,
  efcw_strands, statutory_hooks, ailit_domains,
  evidence_anchor, single_action_outcome, character_cast,
  slides, video_beats, assessment, parent_note, teacher_notes, dsl_note,
  sort_order, scaffold
) values (
  ${q(m.module_id)}, ${q(row.title)}, ${q(m.key_stage)}, ${q(row.year_band)}, ${q(row.audience)},
  ${intArray(row.efcw_strands || [])}, ${textArray(row.statutory_hooks || [])}, ${textArray(row.ailit_domains || [])},
  ${q(row.evidence_anchor)}, ${q(row.single_action_outcome)}, ${q(row.character_cast)},
  ${jq(m.slides)}::jsonb, ${jq(m.video_beats || [])}::jsonb, ${jq(m.assessment)}::jsonb,
  ${jq(m.parent_note)}::jsonb, ${jq(m.teacher_notes)}::jsonb, ${m.dsl_note ? `${jq(m.dsl_note)}::jsonb` : 'null'},
  ${m.sort_order}, ${q(row.scaffold)}
)
on conflict (module_id) do update set
  title = excluded.title, key_stage = excluded.key_stage, year_band = excluded.year_band,
  audience = excluded.audience, efcw_strands = excluded.efcw_strands,
  statutory_hooks = excluded.statutory_hooks, ailit_domains = excluded.ailit_domains,
  evidence_anchor = excluded.evidence_anchor,
  single_action_outcome = excluded.single_action_outcome,
  character_cast = excluded.character_cast, slides = excluded.slides,
  video_beats = excluded.video_beats, assessment = excluded.assessment,
  parent_note = excluded.parent_note, teacher_notes = excluded.teacher_notes,
  dsl_note = excluded.dsl_note, sort_order = excluded.sort_order,
  scaffold = excluded.scaffold;

commit;
`

const out = `supabase/migrations/${number}_${slug}.sql`
fs.writeFileSync(out, sql)
console.log(`${out}: ${m.module_id}, ${m.slides.length} slides, ${sql.length} chars.`)
