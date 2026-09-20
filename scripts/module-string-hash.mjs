#!/usr/bin/env node
// EVERY STRING IN A MODULE, HASHED, SO A HAND TRANSPORTED MIGRATION CAN BE
// PROVED FAITHFUL RATHER THAN ASSUMED FAITHFUL.
//
// WHY THIS EXISTS. There is no database password in the build container and
// no migration step in CI, so a new module reaches production by being pasted
// through the Supabase tool: forty to seventy thousand characters of
// curriculum prose, retyped. That is a channel where a single dropped
// character lands on a classroom wall in front of thirty children and nothing
// anywhere complains.
//
// WHAT IT PROVES. It collects every string in the module, from the text
// columns and from every json payload, hashes each one, sorts the hashes and
// takes one md5 over them. Postgres can produce the same set with
// jsonb_path_query, so the two compare directly. Run with --sql to print the
// query, run it against production, and the two hashes either match or the
// module did not arrive intact.
//
// Sorting is what makes the comparison honest. jsonb normalises key order on
// the way in, so document order cannot be compared, but the multiset of
// strings can, and any changed, dropped, truncated or doubled character moves
// the hash.
//
// WHY THE INNER MD5 RATHER THAN SORTING THE PROSE. Sorting the strings
// themselves means agreeing with Postgres about collation, and the database's
// default collation orders curriculum prose (apostrophes, accented names,
// punctuation) differently from a bytewise sort in node. Sorting the hex
// digests instead sidesteps it: hex is ASCII, so every collation agrees, and
// the digests still change the moment any character does.
//
// WHAT IT DOES NOT COVER. Object keys and numbers are structure rather than
// prose, and the module contract check already covers those. Slide count is
// reported separately because an array appended twice would otherwise be
// invisible to a multiset hash.
//
// THE --assert MODE IS THE MIGRATION RECORD. A module carried in chunks never
// passes through apply_migration, so the remote history would not mention it.
// --assert prints a DO block that recomputes the hash on the server and raises
// if it differs from what the JSON produces. Applied through apply_migration
// under the migration's own name, it puts an honest entry in the history: not
// the SQL, which lives in the repo, but the executable proof that the row
// arrived intact. It also fails loudly if anybody later edits the row by hand,
// which is the other thing a record like this is for.
//
// Usage: node scripts/module-string-hash.mjs <module.json> [--sql | --assert <migration_name>]

import fs from 'node:fs'
import crypto from 'node:crypto'

const [, , jsonPath, flag, assertName] = process.argv
if (!jsonPath || (flag === '--assert' && !assertName)) {
  console.error('usage: node scripts/module-string-hash.mjs <module.json> [--sql | --assert <migration_name>]')
  process.exit(2)
}

const m = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const row = m.row

// The json columns, and the plain text and text array columns beside them.
const JSON_COLS = ['slides', 'video_beats', 'assessment', 'parent_note', 'teacher_notes', 'dsl_note']
const TEXT_COLS = {
  module_id: m.module_id,
  title: row.title,
  key_stage: m.key_stage,
  year_band: row.year_band,
  audience: row.audience,
  evidence_anchor: row.evidence_anchor,
  single_action_outcome: row.single_action_outcome,
  character_cast: row.character_cast,
  scaffold: row.scaffold,
}
const ARRAY_COLS = {
  statutory_hooks: row.statutory_hooks || [],
  ailit_domains: row.ailit_domains || [],
}

// The same multiset, gathered on the server. One derived table, every string
// bearing column unioned in, so --sql and --assert cannot disagree about what
// is being compared.
const id = `'${m.module_id}'`
const jsonParts = JSON_COLS.map(c =>
  `  select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.${c}, '$.**') as x\n` +
  `  where l.module_id = ${id} and jsonb_typeof(x) = 'string'`
)
const textParts = Object.keys(TEXT_COLS).map(c =>
  `  select ${c} from schools.school_lessons where module_id = ${id}`
)
const arrayParts = Object.keys(ARRAY_COLS).map(c =>
  `  select unnest(${c}) from schools.school_lessons where module_id = ${id}`
)
const union = [...jsonParts, ...textParts, ...arrayParts].join('\n  union all\n')

if (flag === '--sql') {
  console.log(
    `select md5(string_agg(md5(v), '' order by md5(v))) as h, count(*) as n,\n` +
    `       (select jsonb_array_length(slides) from schools.school_lessons where module_id = ${id}) as slides\n` +
    `from (\n${union}\n) q;`
  )
  process.exit(0)
}

const strings = []
const walk = v => {
  if (typeof v === 'string') strings.push(v)
  else if (Array.isArray(v)) v.forEach(walk)
  else if (v && typeof v === 'object') Object.values(v).forEach(walk)
}
for (const c of JSON_COLS) if (m[c] != null) walk(m[c])
for (const v of Object.values(TEXT_COLS)) if (v != null) strings.push(v)
for (const arr of Object.values(ARRAY_COLS)) arr.forEach(v => strings.push(v))

const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex')

// Hex digests, sorted. Every collation agrees about ASCII hex, which is the
// whole point: see the note at the top.
const h = md5(strings.map(md5).sort().join(''))

if (flag === '--assert') {
  console.log(
`-- ${assertName}
--
-- ${m.module_id} was carried into production in hash verified chunks
-- (scripts/module-to-chunks.mjs, proved by scripts/module-string-hash.mjs)
-- rather than as one statement, because a module migration is forty to
-- seventy thousand characters and the Supabase tool cannot carry that
-- reliably. The migration itself is supabase/migrations/${assertName}.sql in
-- the repository. This entry is the executable proof that the row arrived
-- intact: ${m.slides.length} slides, ${strings.length} strings, and the multiset hash the
-- source JSON produces. It raises if anything differs, which also makes it
-- fail loudly if anybody later edits the row by hand.
do $$
declare
  got_hash text;
  got_n int;
  got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*)
    into got_hash, got_n
  from (
${union}
  ) q;
  select jsonb_array_length(slides) into got_slides
  from schools.school_lessons where module_id = ${id};
  if got_slides is distinct from ${m.slides.length}
     or got_n is distinct from ${strings.length}
     or got_hash is distinct from '${h}' then
    raise exception '${assertName}: ${m.module_id} is not intact (slides %, strings %, hash %)',
      got_slides, got_n, got_hash;
  end if;
end $$;`
  )
  process.exit(0)
}

console.log(`${m.module_id}\n  slides  ${m.slides.length}\n  strings ${strings.length}\n  md5     ${h}`)
