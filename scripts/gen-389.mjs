#!/usr/bin/env node
// MIGRATION 389: THE LESSONS STOP TEACHING THE WARNING.
//
// Evidence map C1 (Research Pack 09, 6 November 2026): Hiniker, Suh, Cao and
// Kientz, CHI 2016, children aged 1 to 5, found warned endings were followed
// by more upset, and endings went better at a natural stopping point or as
// part of a routine. PR 1452 took the warning out of the scripts, the app
// copy and the printables. Two lessons were built on it, and Justin said
// rewrite both (7 November 2026):
//
//   Foundation, "When the screen goes to sleep" (public.lessons): the five
//   minute whisper becomes the stopping place, picked before the screen goes
//   on. "Big feelings and the screen" recalls it in its opening line.
//   KS2, ks2-04 "Screen routines" (schools.school_lessons): the cool down
//   lap's warn, finish, swap becomes agree, finish, swap. ks2-05 opens by
//   recalling the lap, so its retrieval slide moves with it.
//
// WHERE EACH VALUE COMES FROM. The two school decks are read from
// content/modules, the source of truth for them. The Foundation lessons have
// no file; their new slides and the exact old values they replace are in
// scripts/gen-389.foundation.json.
//
// WHAT IT REFUSES TO OVERWRITE. Each school deck is guarded on its multiset
// string hash (scripts/module-string-hash.mjs): the live deck must hash to
// the files as they stood before this change (read from production on
// 7 November 2026, both equal), or already to the new files, which makes a
// rerun a no op. Anything else is a hand edit and aborts everything. The
// Foundation lesson is guarded on the md5 of its slides and the exact text of
// each column it rewrites; the four slides it carries over unchanged are
// compared to the live ones before anything is written, so a typing slip in
// the data file cannot reach a family.
//
// Usage: node scripts/gen-389.mjs           prints the migration
//        node scripts/gen-389.mjs --write   writes it

import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const NAME = '389_the_lessons_stop_teaching_the_warning'
const OUT = `supabase/migrations/${NAME}.sql`

// The live hashes, read on 7 November 2026, equal to content/modules at
// origin/main 13e271bc3 (before this change).
const DECKS = [
  { id: 'ks2-04-screen-routines', cols: ['slides', 'parent_note', 'teacher_notes'], oldHash: 'e02af09590b2065186339af3dfcf2942' },
  { id: 'ks2-05-gaming-time-spend', cols: ['slides'], oldHash: '0793d8c253cd975fa386e271c1a9b736' },
]

const F = JSON.parse(fs.readFileSync('scripts/gen-389.foundation.json', 'utf8'))
const sleep = F.when_the_screen_goes_to_sleep
const feelings = F.big_feelings_and_the_screen

// Dollar quoting with a tag no curriculum sentence contains.
const TAG = '$gc389$'
const dq = s => {
  if (s.includes(TAG)) throw new Error('literal contains the dollar tag')
  return `${TAG}${s}${TAG}`
}
const jq = v => `${dq(JSON.stringify(v))}::jsonb`

// The hash query, exactly as module-string-hash.mjs prints it, so the guard
// and the proof are the same computation the curriculum checks already use.
function hashQuery(id) {
  return execFileSync('node', ['scripts/module-string-hash.mjs', `content/modules/${id}.json`, '--sql'], { encoding: 'utf8' }).trim().replace(/;$/, '')
}
function newHash(id) {
  const out = execFileSync('node', ['scripts/module-string-hash.mjs', `content/modules/${id}.json`], { encoding: 'utf8' })
  return /md5\s+([0-9a-f]{32})/.exec(out)[1]
}

const header = `-- 389: the lessons stop teaching the warning.
--
-- Evidence map C1: Hiniker, Suh, Cao and Kientz, CHI 2016 (children aged 1
-- to 5) found warned endings were followed by more upset, and endings went
-- better at a natural stopping point or as part of a routine. PR 1452 took
-- the warning out of the scripts, the app and the printables. Two lessons
-- were built on it, and Justin said rewrite both (7 November 2026).
--
-- THE EDITS
--   Foundation, "When the screen goes to sleep": the five minute whisper
--     becomes the stopping place, picked before the screen goes on ("one
--     episode, then snack"). The wave and the next thing stay. Its two quiz
--     questions about the whisper now ask why we pick the stopping place
--     first and why the end of an episode is easier. the_idea, try_this and
--     key_message follow.
--   Foundation, "Big feelings and the screen": the opening recall line.
--   KS2, ks2-04 "Screen routines": the cool down lap is agree, finish, swap.
--     Agree the finishing line before you start, finish at it, swap to the
--     next thing. Slides, parent note and teacher notes, from content/modules.
--   KS2, ks2-05 "Gaming time and spend": the retrieval slide that recalls
--     the lap.
--
-- GUARDED. Each school deck must hash to its files as they were before this
-- change (both read equal from production on 7 November 2026) or already to
-- the new files; anything else is a hand edit and aborts. The Foundation
-- lesson must have exactly its old slides (md5) and old column text, and the
-- slides it carries over unchanged are compared to the live ones first. The
-- proof at the end recomputes every hash and compares every value.
-- Idempotent: a second run finds the new values, writes nothing and passes.
-- Backed up first. Embeddings are left alone, as in 371 and 375: no edit
-- changes what a lesson is about.
--
-- Generated by scripts/gen-389.mjs from content/modules and
-- scripts/gen-389.foundation.json, never by hand.
`

const keep = [0, 4, 8, 10] // slides carried over unchanged
let sql = header + `
begin;

create table if not exists public.lessons_backup_389 as
  select * from public.lessons where id in ('${sleep.id}', '${feelings.id}');
alter table public.lessons_backup_389 enable row level security;

create table if not exists schools.school_lessons_backup_389 as
  select * from schools.school_lessons where module_id in (${DECKS.map(d => `'${d.id}'`).join(', ')});
alter table schools.school_lessons_backup_389 enable row level security;

-- ── Foundation: When the screen goes to sleep ────────────────────────────
do $$
declare
  cur public.lessons;
  nxt jsonb := ${jq(sleep.slides)};
begin
  select * into cur from public.lessons where id = '${sleep.id}';
  if not found then
    raise exception '389: lesson ${sleep.id} (When the screen goes to sleep) is missing';
  end if;
  if cur.slides = nxt then
    return; -- already rewritten
  end if;
  if md5(cur.slides::text) <> '${sleep.old_slides_md5}' then
    raise exception '389: When the screen goes to sleep has been edited since 7 November, refusing to overwrite it';
  end if;
${keep.map(i => `  if nxt->${i} is distinct from cur.slides->${i} then
    raise exception '389: slide ${i} of When the screen goes to sleep should carry over unchanged and does not';
  end if;`).join('\n')}
${Object.entries(sleep.columns).map(([c, [o]]) => `  if cur.${c} is distinct from ${dq(o)} then
    raise exception '389: When the screen goes to sleep, ${c} has been edited since 7 November';
  end if;`).join('\n')}
  update public.lessons
     set slides = nxt,
${Object.entries(sleep.columns).map(([c, [, n]]) => `         ${c} = ${dq(n)}`).join(',\n')}
   where id = '${sleep.id}';
end $$;

-- ── Foundation: Big feelings and the screen, the opening recall ──────────
update public.lessons
   set slides = jsonb_set(slides, '{0,script}', to_jsonb(${dq(feelings.slide0_script[1])}::text))
 where id = '${feelings.id}'
   and slides->0->>'script' = ${dq(feelings.slide0_script[0])};
`

for (const d of DECKS) {
  const m = JSON.parse(fs.readFileSync(`content/modules/${d.id}.json`, 'utf8'))
  const nh = newHash(d.id)
  sql += `
-- ── KS2: ${d.id} ─────────────────────────────────────────
do $$
declare got text;
begin
  select h into got from (
${hashQuery(d.id)}
  ) z;
  if got = '${nh}' then
    return; -- already rewritten
  end if;
  if got is distinct from '${d.oldHash}' then
    raise exception '389: ${d.id} does not match its files (hash %), refusing to overwrite a hand edit', got;
  end if;
  update schools.school_lessons
     set ${d.cols.map(c => `${c} = ${jq(m[c])}`).join(',\n         ')}
   where module_id = '${d.id}';
end $$;
`
}

// The proof: every new value is in place.
sql += `
-- ── Proof ─────────────────────────────────────────────────────────────────
do $$
declare got text;
begin
  if (select slides from public.lessons where id = '${sleep.id}') is distinct from ${jq(sleep.slides)}
${Object.entries(sleep.columns).map(([c, [, n]]) => `     or (select ${c} from public.lessons where id = '${sleep.id}') is distinct from ${dq(n)}`).join('\n')} then
    raise exception '389 proof: When the screen goes to sleep is not as written';
  end if;
  if (select slides->0->>'script' from public.lessons where id = '${feelings.id}') is distinct from ${dq(feelings.slide0_script[1])} then
    raise exception '389 proof: the Big feelings recall line is not as written';
  end if;
${DECKS.map(d => `  select h into got from (
${hashQuery(d.id)}
  ) z;
  if got is distinct from '${newHash(d.id)}' then
    raise exception '389 proof: ${d.id} is not intact (hash %)', got;
  end if;`).join('\n')}
  if exists (select 1 from public.lessons where status = 'live' and slides::text ~* 'five minute whisper|the whisper|whisper, a wave') then
    raise exception '389 proof: a live family lesson still teaches the whisper';
  end if;
  if exists (select 1 from schools.school_lessons where (slides::text || parent_note::text || teacher_notes::text) ~* 'warn, finish|warning before the end|give yourself a warning') then
    raise exception '389 proof: a school lesson still teaches warn, finish, swap';
  end if;
end $$;

commit;
`

if (process.argv.includes('--write')) {
  fs.writeFileSync(OUT, sql)
  console.log(`wrote ${OUT} (${sql.length} characters)`)
} else {
  process.stdout.write(sql)
}
