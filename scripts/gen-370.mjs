#!/usr/bin/env node
// MIGRATION 370: FOUR LESSONS PRINT THEIR OWN TOOL.
//
// ks2-26, ks3-27, ks4-28 and ks4-29 were written holding teacher_notes.tool
// as one sentence, where every other lesson holds { heading, lines,
// strapline }. The paper pack (schools/app/print/[module]/page.tsx) reads
// tool.heading and tool.lines, found neither, and printed the reference
// lesson's three checks ("Who made this, and how do they know?") on all four
// sets of bookmarks and in the parent note's tool box. Found on 12 October
// 2026 while fitting the packs to A4 (PR 1239).
//
// WHAT THIS WRITES. The tool object content/modules now holds for each of the
// four, with jsonb_set, read straight from the files. Nothing else.
//
// WHAT IT REFUSES. A file whose tool is not an object with a heading and at
// least one line, and a module whose sentence is not the one production held
// when it was read on 12 October (SENTENCES below), so the guard in the SQL
// is the string that was actually there.
//
// Usage: node scripts/gen-370.mjs           preview only, writes nothing
//        node scripts/gen-370.mjs --write   writes the migration
//
// It has run once with --write. A later change to these tools gets its own
// migration rather than a rerun of this one.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const NAME = '370_four_lessons_print_their_own_tool'

// What production held, read only on 12 October 2026 (Supabase project
// zgkdfiwtnzqmtfgfsxzo): these four rows, and no others, had a tool that was
// not an object.
const SENTENCES = {
  'ks2-26-why-thirteen': 'SHIELD: find the number, ask what it is protecting, then choose.',
  'ks3-27-when-it-turns-on-you': 'NAME IT, SAVE IT, SAY IT. In that order, because saving stops being possible if you leave it.',
  'ks4-28-the-money-and-the-odds': 'THE PRICE, THE ODDS, THE LOOP. Three questions in that order, for anything that takes money and hands back a chance.',
  'ks4-29-did-not-go-looking': 'STOP IT, REPORT IT, SAY IT. In that order, because only the first one is on a clock.',
}

const lit = s => `'${String(s).replace(/'/g, "''")}'`
const rows = Object.entries(SENTENCES).map(([id, was]) => {
  const lesson = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/modules', `${id}.json`), 'utf8'))
  const tool = lesson.teacher_notes?.tool
  const ok = tool && typeof tool === 'object' && !Array.isArray(tool) &&
    typeof tool.heading === 'string' && tool.heading.trim() &&
    Array.isArray(tool.lines) && tool.lines.length > 0 && tool.lines.every(l => typeof l === 'string' && l.trim())
  if (!ok) throw new Error(`${id}: content/modules does not hold the tool as { heading, lines, strapline }`)
  if (lesson.module_id !== id) throw new Error(`${id}: the file names ${lesson.module_id}`)
  return { id, was, tool: { heading: tool.heading, lines: tool.lines, strapline: tool.strapline } }
})
const ids = rows.map(r => lit(r.id)).join(', ')

const sql = `-- 370: four lessons print their own tool.
--
-- ks2-26-why-thirteen, ks3-27-when-it-turns-on-you,
-- ks4-28-the-money-and-the-odds and ks4-29-did-not-go-looking hold
-- teacher_notes.tool as one sentence ("STOP IT, REPORT IT, SAY IT. In that
-- order..."), where every other lesson holds { heading, lines, strapline }.
-- The paper pack reads tool.heading and tool.lines, finds neither, and prints
-- the reference lesson's three checks ("Who made this, and how do they
-- know?") on all four sets of bookmarks and in the parent note's tool box, so
-- pupils and families take home a tool the lesson never taught. The
-- organiser printed an empty tool box and the lesson page hid the tool.
--
-- WHAT MOVES. teacher_notes.tool on those four rows, to the object
-- content/modules holds, written from each lesson's own slides and script.
-- Nothing else: no other key, no other column, no other lesson.
--
-- GUARDED before anything is written. Each row must hold the exact sentence
-- read from production on 12 October 2026, or the object already (a rerun).
-- Anything else aborts the whole migration.
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every teacher notes key, except the four tools,
-- which equal the objects below. And no lesson in the table is left with a
-- tool that is not an object.
--
-- Idempotent: a second run finds the objects in place, writes the same values
-- and passes the same proof. Backed up first.
--
-- Generated from content/modules by scripts/gen-370.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_370 as
  select module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons
  where module_id in (${ids});

alter table schools.school_lessons_backup_370 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_370 on commit drop as select * from schools.school_lessons;

-- The sentence each row was read holding, and the tool it moves to.
create temp table tools_370 (module_id text primary key, was jsonb not null, tool jsonb not null) on commit drop;
insert into tools_370 (module_id, was, tool) values
${rows.map(r => `  (${lit(r.id)},\n   to_jsonb(${lit(r.was)}::text),\n   ${lit(JSON.stringify(r.tool))}::jsonb)`).join(',\n')};

do $$
declare bad text;
begin
  select string_agg(t.module_id, ', ') into bad
    from tools_370 t
    left join schools.school_lessons l using (module_id)
   where l.module_id is null
      or ((l.teacher_notes -> 'tool') is distinct from t.was
          and (l.teacher_notes -> 'tool') is distinct from t.tool);
  if bad is not null then raise exception '370: not the tool it was read with, in %', bad; end if;
end $$;

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{tool}', t.tool)
  from tools_370 t
 where l.module_id = t.module_id;

do $$
declare bad text; n int;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_370)
     or exists (select module_id from before_370 except select module_id from schools.school_lessons) then
    raise exception '370: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_370 b using (module_id)
    left join tools_370 t using (module_id)
   where (to_jsonb(l) - 'teacher_notes') is distinct from (to_jsonb(b) - 'teacher_notes')
      or (l.teacher_notes - 'tool') is distinct from (b.teacher_notes - 'tool')
      or (l.teacher_notes -> 'tool') is distinct from coalesce(t.tool, b.teacher_notes -> 'tool');
  if bad is not null then raise exception '370: changed beyond the four tools: %', bad; end if;

  select count(*) into n
    from schools.school_lessons
   where jsonb_typeof(teacher_notes -> 'tool') is distinct from 'object';
  if n <> 0 then raise exception '370: % lessons still hold a tool that is not an object', n; end if;
end $$;

commit;
`

const out = path.join(ROOT, 'supabase/migrations', `${NAME}.sql`)
if (WRITE) {
  fs.writeFileSync(out, sql)
  console.log(`wrote ${path.relative(ROOT, out)}: ${rows.length} tools`)
} else {
  process.stdout.write(sql)
}
