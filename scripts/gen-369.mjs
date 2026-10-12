#!/usr/bin/env node
// MIGRATION 369: THE EXTENSION MARKS REACH THE LIVE DECKS.
//
// On 21 September 2026 (PR 1143, commit c75b64f9) the slides a teacher short
// of time can skip, and still run the whole arc to the exit quiz, were marked
// `extension: true` in content/modules: 147 slides across 26 lessons
// (plans/2026-09-21-core-and-extension-plan.md). That plan named "the
// migration that marks the slides" as a deliverable, and it was never
// written. On 9 October a read of the live rows found none of the marks.
//
// That did not matter while nothing read the flag. Since PR 1236 (sync plan
// F4) the schools run sheet computes the core minutes and the skip list from
// the live deck, so until this lands every run sheet says nothing is marked
// to skip, and the lessons loop's trims keyed on the flag (sync plan A1 and
// G1) do nothing in production.
//
// WHAT THIS WRITES. One boolean per marked slide, by index, with jsonb_set,
// read straight from the files. No text. The files are the record of the
// marking pass and check-lesson-core.mjs holds them to its rules, so this
// copies them rather than deciding anything.
//
// WHAT IT REFUSES. A mark that is anything but true, a mark outside teach or
// practise, or a marked slide with no type or phase. And before writing, a
// self check: the paths it generates, applied to each file with its marks
// stripped, must give back the file exactly.
//
// Usage: node scripts/gen-369.mjs           preview only, writes nothing
//        node scripts/gen-369.mjs --write   writes the migration
//
// It has run once with --write. Rerunning it after content/modules changes
// would describe a different migration from the one applied, so a later
// marking pass gets its own migration rather than a rerun of this one.

import fs from 'node:fs'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const NAME = '369_the_extension_marks_reach_the_live_decks'
const MARKABLE = new Set(['teach', 'practise'])
const q = s => `'${String(s).replace(/'/g, "''")}'`

const dir = path.join(ROOT, 'content/modules')
const modules = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
  .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))

const problems = []
const decks = []
for (const m of modules) {
  const marks = []
  m.slides.forEach((s, i) => {
    if (!('extension' in s)) return
    if (s.extension !== true) problems.push(`${m.module_id} slide ${i}: extension is ${JSON.stringify(s.extension)}, and only true is ever written`)
    if (typeof s.type !== 'string' || typeof s.phase !== 'string') problems.push(`${m.module_id} slide ${i}: marked, but has no type or phase to guard on`)
    if (!MARKABLE.has(s.phase)) problems.push(`${m.module_id} slide ${i}: marked in ${s.phase}, and only teach or practise may be`)
    marks.push({ i, type: s.type, phase: s.phase })
  })
  if (marks.length) decks.push({ id: m.module_id, n: m.slides.length, marks, slides: m.slides })
}
if (problems.length) {
  console.error(`REFUSED.\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

// The self check. jsonb_set(slides, '{i,extension}', 'true') on an object
// adds or replaces that one key, so the same operation here, applied to each
// file with every mark removed, must rebuild the file key for key.
for (const d of decks) {
  const bare = d.slides.map(s => { const { extension, ...rest } = s; return rest })
  for (const { i } of d.marks) bare[i] = { ...bare[i], extension: true }
  if (!isDeepStrictEqual(bare, d.slides)) {
    console.error(`REFUSED. ${d.id}: the generated marks do not rebuild the file`)
    process.exit(1)
  }
}

const total = decks.reduce((a, d) => a + d.marks.length, 0)
const unmarked = modules.filter(m => !decks.some(d => d.id === m.module_id)).map(m => m.module_id)
const schemeIds = modules.map(m => q(m.module_id)).join(', ')

console.log(`Migration ${NAME.split('_')[0]} would mark ${total} slides across ${decks.length} decks.\n`)
for (const d of decks) console.log(`  ${d.id.padEnd(44)} ${String(d.n).padStart(2)} slides, ${d.marks.length} marked: ${d.marks.map(x => x.i).join(', ')}`)
console.log(`\n  no marks, not touched: ${unmarked.join(', ')}`)

if (!WRITE) {
  console.log('\nPreview only. Nothing written. Rerun with --write.')
  process.exit(0)
}

// One statement per deck: a jsonb_set per marked slide, innermost first.
const setFor = d =>
  `-- ${d.id}: ${d.n} slides, ${d.marks.length} marked\n` +
  `update schools.school_lessons\n   set slides = ${'jsonb_set('.repeat(d.marks.length)}slides,\n` +
  d.marks.map(x => `         '{${x.i},extension}', 'true'::jsonb, true)`).join(',\n') +
  `\n where module_id = ${q(d.id)};`

const values = decks.flatMap(d => d.marks.map(x =>
  `  (${q(d.id)}, ${d.n}, ${x.i}, ${q(x.type)}, ${q(x.phase)})`)).join(',\n')

const sql = `-- 369: the extension marks reach the live decks.
--
-- On 21 September 2026 (PR 1143, commit c75b64f9) ${total} slides across ${decks.length}
-- lessons were marked \`extension: true\`: the slides a teacher short of time
-- can skip and still run the whole arc to the exit quiz
-- (plans/2026-09-21-core-and-extension-plan.md). The marks went into
-- content/modules, and the migration that plan named was never written, so
-- the live rows carry none of them. Since PR 1236 the run sheet computes the
-- core and the skip list from the live deck, so until this lands every run
-- sheet says nothing is marked to skip, and the lessons loop's trims keyed on
-- the flag do nothing.
--
-- WHAT MOVES. One key, \`extension\`, set to true on the ${total} slides the files
-- mark. Nothing else: no text, no slide order or count, no other column, no
-- other lesson. The ${unmarked.length} scheme decks with no marks (the seven youngest, which
-- already fit, and ks3-34, written after the marking pass) are not touched,
-- and neither are the two standalone lessons, which carry their own marks.
--
-- GUARDED, per deck, before anything is written. Each marked deck must have
-- the slide count it was marked against, each marked slide must be the type
-- and phase it was marked on, and no scheme slide may carry an extension
-- value the files do not. Any miss aborts the whole migration.
--
-- Checked read only against production on 12 October 2026: every deck has
-- the count, every marked slide the type and phase, and every slide string
-- the text, that the files have, and no scheme slide carries a mark.
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every slide, except that each marked slide
-- gained "extension": true. The text is byte identical, and any other change
-- fails the proof.
--
-- Idempotent: a second run finds the marks in place, writes the same values
-- and passes the same proof. Backed up first.
--
-- Generated from content/modules by scripts/gen-369.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_369 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in (${decks.map(d => q(d.id)).join(', ')});

alter table schools.school_lessons_backup_369 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_369 on commit drop as select * from schools.school_lessons;

-- The marks, as content/modules has them: deck, its slide count, the slide
-- index, and the type and phase that slide was marked on.
create temp table marks_369 (module_id text, n int, i int, type text, phase text) on commit drop;
insert into marks_369 (module_id, n, i, type, phase) values
${values};

-- ── the guards ─────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  select string_agg(d.module_id || coalesce(' has ' || jsonb_array_length(l.slides) || ' slides, not ' || d.n, ' is missing'), '; ')
    into bad
    from (select distinct module_id, n from marks_369) d
    left join schools.school_lessons l using (module_id)
   where l.module_id is null or jsonb_array_length(l.slides) <> d.n;
  if bad is not null then raise exception '369 aborted, a deck is not the one marked: %', bad; end if;

  select string_agg(m.module_id || ' slide ' || m.i || ' is ' || coalesce(l.slides->m.i->>'type', 'null') || '/' || coalesce(l.slides->m.i->>'phase', 'null')
                    || ', marked as ' || m.type || '/' || m.phase, '; ')
    into bad
    from marks_369 m join schools.school_lessons l using (module_id)
   where l.slides->m.i->>'type' is distinct from m.type
      or l.slides->m.i->>'phase' is distinct from m.phase;
  if bad is not null then raise exception '369 aborted, a marked slide is not the one marked: %', bad; end if;

  select string_agg(l.module_id || ' slide ' || (s.k - 1) || ' carries extension ' || (s.v->'extension')::text, '; ')
    into bad
    from schools.school_lessons l
    cross join lateral jsonb_array_elements(l.slides) with ordinality s(v, k)
    left join marks_369 m on m.module_id = l.module_id and m.i = s.k - 1
   where l.module_id in (${schemeIds})
     and s.v ? 'extension'
     and (m.i is null or s.v->'extension' <> 'true'::jsonb);
  if bad is not null then raise exception '369 aborted, a slide carries a mark the files do not: %', bad; end if;
end $$;

-- ── the marks ──────────────────────────────────────────────────────────────

${decks.map(setFor).join('\n\n')}

-- ── the proof ──────────────────────────────────────────────────────────────

do $$
declare bad text; n int;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_369)
     or exists (select module_id from before_369 except select module_id from schools.school_lessons) then
    raise exception '369: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l join before_369 b using (module_id)
   where (to_jsonb(l) - 'slides') is distinct from (to_jsonb(b) - 'slides')
      or jsonb_array_length(l.slides) <> jsonb_array_length(b.slides);
  if bad is not null then raise exception '369: a column other than slides, or a slide count, moved in %', bad; end if;

  select string_agg(l.module_id || ' slide ' || (s.k - 1), ', ') into bad
    from schools.school_lessons l
    join before_369 b using (module_id)
    cross join lateral jsonb_array_elements(b.slides) with ordinality s(v, k)
    left join marks_369 m on m.module_id = l.module_id and m.i = s.k - 1
   where (l.slides -> (s.k::int - 1)) is distinct from
         case when m.i is null then s.v else s.v || '{"extension": true}'::jsonb end;
  if bad is not null then raise exception '369: changed beyond the extension key: %', bad; end if;

  select count(*) into n
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in (${schemeIds})
     and s ? 'extension';
  if n <> ${total} then raise exception '369: % scheme slides carry a mark, not ${total}', n; end if;
end $$;

commit;
`

const file = path.join(ROOT, 'supabase/migrations', `${NAME}.sql`)
fs.writeFileSync(file, sql)
console.log(`\nWROTE supabase/migrations/${NAME}.sql (${sql.length} chars)`)
