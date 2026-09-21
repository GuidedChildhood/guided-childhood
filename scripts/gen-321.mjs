#!/usr/bin/env node
// MIGRATION 321: THE KEYWORD MEANINGS THE WALL COULD NOT SEE.
//
// Found by scripts/check-lesson-rubric.mjs on 20 September 2026. Eight
// lessons written since 11 September (ks2-23, ks2-25, ks2-26, ks3-22, ks3-24,
// ks3-27, ks4-28, ks4-29) store each keyword's meaning under "definition".
// The keywords slide draws w.meaning (shared/components/LessonPlayer.tsx) and
// the vocabulary page maps w.meaning (schools/app/hub/vocabulary/page.tsx),
// so in those eight lessons the class saw three or four words and no meaning
// under any of them, and the whole scheme vocabulary page printed the words
// blank. Nothing complained: the council's blocks check reads meaning too, so
// a word with no meaning measured as no words at all and passed.
//
// The fix is a rename, in the eight rows and the eight files, and contract
// rule 14 so a keywords slide without meanings never ships again.
//
// Usage: node scripts/gen-321.mjs       writes supabase/migrations/321_keyword_meanings_on_the_wall.sql
//                                       and renames the key in content/modules

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIR = path.join(ROOT, 'content/modules')
const q = s => `'${String(s).replace(/'/g, "''")}'`

const touched = []
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort()) {
  const p = path.join(DIR, f)
  const m = JSON.parse(fs.readFileSync(p, 'utf8'))
  const i = m.slides.findIndex(s => s.type === 'keywords')
  if (i < 0) continue
  const ws = m.slides[i].words || []
  if (!ws.length || !ws.every(w => typeof w.definition === 'string' && w.meaning === undefined)) continue
  touched.push({ id: m.module_id, pos: i, words: ws.map(w => ({ word: w.word, definition: w.definition })), file: p, m })
  m.slides[i].words = ws.map(({ definition, ...rest }) => ({ ...rest, meaning: definition }))
}
if (!touched.length) { console.log('No keywords slide stores a definition. Nothing to do.'); process.exit(0) }

const name = '321_keyword_meanings_on_the_wall'
const sql = `-- 321: the keyword meanings the wall could not see
--
-- Eight lessons written since 11 September store each keyword's meaning under
-- "definition"; the keywords slide draws w.meaning and the vocabulary page maps
-- w.meaning, so those classes saw the words and no meaning, and the council's
-- blocks check counted the missing meanings as nothing to measure. Found by
-- scripts/check-lesson-rubric.mjs on 20 September 2026; the rename is done
-- here and in content/modules by scripts/gen-321.mjs, and contract rule 14
-- keeps it from recurring.
--
-- Every rename is guarded: the slide must be the keywords slide, every word
-- must carry exactly the definition text the file has and no meaning yet. Any
-- miss aborts the whole migration.
--
-- THE LESSONS (${touched.length}): ${touched.map(t => t.id).join(', ')}

begin;

create table schools.school_lessons_backup_321 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_321 enable row level security;

create temp table miss(module text, target text);

create or replace function schools.rename_keyword_meanings_321(p_module text, p_pos int, p_expect jsonb)
returns void language plpgsql as $$
declare have jsonb; renamed jsonb;
begin
  select l.slides->p_pos->'words' into have from schools.school_lessons l where l.module_id = p_module and l.slides->p_pos->>'type' = 'keywords';
  if have is null then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not the keywords slide'); return; end if;
  if (select jsonb_agg(jsonb_build_object('word', w->>'word', 'definition', w->>'definition')) from jsonb_array_elements(have) w) is distinct from p_expect
     or exists (select 1 from jsonb_array_elements(have) w where w ? 'meaning') then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' words are not the expected definitions'); return;
  end if;
  select jsonb_agg((w - 'definition') || jsonb_build_object('meaning', w->'definition')) into renamed from jsonb_array_elements(have) w;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text, 'words'], renamed) where l.module_id = p_module;
end $$;

${touched.map(t => `select schools.rename_keyword_meanings_321(${q(t.id)}, ${t.pos}, ${q(JSON.stringify(t.words))}::jsonb);`).join('\n')}

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: every keyword on every keywords slide in the scheme has a meaning and no definition ──
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l, jsonb_array_elements(l.slides) s, jsonb_array_elements(s->'words') w
  where s->>'type' = 'keywords' and (w ? 'definition' or coalesce(btrim(w->>'meaning'), '') = '');
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % keyword(s) still without a meaning the wall draws: %', cnt, list; end if;
end $$;

-- ── the proof: the eight rows equal their files in content/modules, string for string ──
-- The same multiset hash scripts/module-string-hash.mjs computes from each
-- file (a rename moves no string, so the hash is the pre and the post state),
-- in one loop rather than eight copies of the query so the migration stays
-- small enough to carry.
do $$
declare got_hash text; got_n int; got_slides int; m record;
begin
  for m in select * from (values
${touched.map(t => {
  const tmp = path.join(ROOT, '.gen-321-tmp.json')
  fs.writeFileSync(tmp, JSON.stringify(t.m, null, 2) + '\n')
  const out = execFileSync('node', [path.join(ROOT, 'scripts/module-string-hash.mjs'), tmp], { encoding: 'utf8' })
  fs.unlinkSync(tmp)
  const slides = out.match(/slides\s+(\d+)/)[1], strings = out.match(/strings\s+(\d+)/)[1], md5 = out.match(/md5\s+([0-9a-f]{32})/)[1]
  return `    (${q(t.id)}, ${slides}, ${strings}, ${q(md5)})`
}).join(',\n')}
  ) as t(module_id, slides, strings, hash)
  loop
    select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
    from (
      select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select module_id from schools.school_lessons where module_id = m.module_id
      union all select title from schools.school_lessons where module_id = m.module_id
      union all select key_stage from schools.school_lessons where module_id = m.module_id
      union all select year_band from schools.school_lessons where module_id = m.module_id
      union all select audience from schools.school_lessons where module_id = m.module_id
      union all select evidence_anchor from schools.school_lessons where module_id = m.module_id
      union all select single_action_outcome from schools.school_lessons where module_id = m.module_id
      union all select character_cast from schools.school_lessons where module_id = m.module_id
      union all select scaffold from schools.school_lessons where module_id = m.module_id
      union all select unnest(statutory_hooks) from schools.school_lessons where module_id = m.module_id
      union all select unnest(ailit_domains) from schools.school_lessons where module_id = m.module_id
    ) q;
    select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = m.module_id;
    if got_slides is distinct from m.slides or got_n is distinct from m.strings or got_hash is distinct from m.hash then
      raise exception '${name}: % is not intact (slides %, strings %, hash %)', m.module_id, got_slides, got_n, got_hash;
    end if;
  end loop;
end $$;

commit;
`

fs.writeFileSync(path.join(ROOT, 'supabase/migrations', `${name}.sql`), sql)
for (const t of touched) fs.writeFileSync(t.file, JSON.stringify(t.m, null, 2) + '\n')
console.log(`supabase/migrations/${name}.sql: ${touched.length} module(s), ${sql.length} chars; ${touched.length} file(s) renamed in content/modules.`)
