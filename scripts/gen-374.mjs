#!/usr/bin/env node
// MIGRATION 374: THE HARD QUESTIONS REACH THE LIVE DECKS.
//
// On 21 September 2026 (commit 992a5d49, "eighty hard questions") the lessons
// gained teacher_notes.hard_questions: four per lesson, the questions a class
// actually asks, each with the answer a teacher can give. They went into
// content/modules and no migration carried them, the same gap the extension
// marks had (migration 369, PR 1240). On 13 October 2026 every live
// teacher_notes key was hashed against content/modules as it stood just
// before migration 373: on 13 decks the only difference is that
// hard_questions exists in the files and not in production. The other 21
// scheme decks carry them already, and their live hash equals the files'.
//
// WHICH DECKS. The 13 are the one input not read from the files, because the
// files cannot see production. They are named below from that read. Every
// value written is read from content/modules.
//
// WHAT THIS WRITES. One key, teacher_notes.hard_questions, with jsonb_set,
// on those 13 rows. Nothing else: no other key, column, slide or lesson.
//
// WHAT IT REFUSES. A named deck with no hard questions in its file, or with
// a question or answer that is not a non empty string. And before writing, a
// self check: every SQL literal it emits must parse back to the file's value.
//
// It also prints the read only check for the pull request: run it before and
// after applying, and it says per deck whether the questions match the files
// and fingerprints everything else, so "nothing else moved" is a comparison
// of two readings rather than a promise.
//
// Usage: node scripts/gen-374.mjs           preview and the read only check
//        node scripts/gen-374.mjs --write   writes the migration
//
// It has run once with --write. Rerunning it after content/modules changes
// would describe a different migration from the one applied, so a later
// change to the questions gets its own migration rather than a rerun of this.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const NAME = '374_the_hard_questions_reach_the_live_decks'
const q = s => `'${String(s).replace(/'/g, "''")}'`

// Read only against production, 13 October 2026: these lack the key.
const TARGETS = [
  'eyfs-01-screens-kindness',
  'ks1-02-kind-screens-calm-bodies',
  'ks1-03-real-pretend-computer',
  'ks2-04-screen-routines',
  'ks2-05-gaming-time-spend',
  'ks2-06-how-algorithms-work',
  'ks2-08-kind-safe-online',
  'ks2-09-copyright-ownership',
  'ks3-13-scams-fraud-money',
  'ks4-15-manipulation-persuasion',
  'ks4-19-readiness-at-16',
  'ks5-20-ai-mastery-data-rights',
  'ks5-21-digital-identity-future-work',
]

// jsonb's own text form: keys ordered by length then bytes, ", " and ": "
// between them. md5 of this equals md5(value::text) in Postgres, which is
// what lets the read only check carry 32 characters per deck instead of the
// questions themselves. Proved on 13 October against the 21 live decks that
// already carry hard questions: all 21 digests matched.
const pgText = v =>
  v === null ? 'null'
  : Array.isArray(v) ? `[${v.map(pgText).join(', ')}]`
  : typeof v === 'object'
    ? `{${Object.keys(v)
        .sort((a, b) => Buffer.byteLength(a) - Buffer.byteLength(b) || Buffer.compare(Buffer.from(a), Buffer.from(b)))
        .map(k => `${JSON.stringify(k)}: ${pgText(v[k])}`).join(', ')}}`
    : JSON.stringify(v)
const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex')

const dir = path.join(ROOT, 'content/modules')
const modules = new Map(fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
  .map(m => [m.module_id, m]))

const problems = []
const decks = TARGETS.map(id => {
  const m = modules.get(id)
  if (!m) { problems.push(`${id}: no file in content/modules`); return null }
  const hq = m.teacher_notes?.hard_questions
  if (!Array.isArray(hq) || hq.length === 0) problems.push(`${id}: the file has no hard questions to carry`)
  else hq.forEach((x, i) => {
    for (const k of ['question', 'answer']) {
      if (typeof x?.[k] !== 'string' || !x[k].trim()) problems.push(`${id} hard question ${i}: ${k} is not a non empty string`)
    }
  })
  return { id, n: m.slides.length, hq }
})
if (problems.length) {
  console.error(`REFUSED.\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

// The literal is the file's value pretty printed, so the migration reads as
// the questions themselves. jsonb ignores the whitespace.
const literal = d => q(JSON.stringify(d.hq, null, 2).replace(/\n/g, '\n  '))

// The self check: each literal, unquoted as Postgres will unquote it, must
// parse back to exactly the file's value.
for (const d of decks) {
  const back = JSON.parse(literal(d).slice(1, -1).replace(/''/g, "'"))
  if (!isDeepStrictEqual(back, d.hq)) {
    console.error(`REFUSED. ${d.id}: the SQL literal does not parse back to the file's hard questions`)
    process.exit(1)
  }
}

const total = decks.reduce((a, d) => a + d.hq.length, 0)
const ids = decks.map(d => q(d.id)).join(', ')

console.log(`Migration ${NAME.split('_')[0]} would add ${total} hard questions to ${decks.length} decks.\n`)
for (const d of decks) console.log(`  ${d.id.padEnd(40)} ${String(d.n).padStart(2)} slides, ${d.hq.length} questions, md5 ${md5(pgText(d.hq))}`)

const check = `-- 374 read only check. Changes nothing. Run it just before applying and
-- again just after.
--   before: slides_match true, has_hard_questions false, matches_files null
--   after:  slides_match true, has_hard_questions true,  matches_files true
--   both:   every everything_else value identical between the two runs
with f(module_id, n, hq_md5) as (values
${decks.map(d => `  (${q(d.id)}, ${d.n}, ${q(md5(pgText(d.hq)))})`).join(',\n')}
)
select f.module_id,
       jsonb_array_length(l.slides) = f.n as slides_match,
       l.teacher_notes ? 'hard_questions' as has_hard_questions,
       md5((l.teacher_notes -> 'hard_questions')::text) = f.hq_md5 as matches_files,
       md5((to_jsonb(l) #- '{teacher_notes,hard_questions}')::text) as everything_else
  from f left join schools.school_lessons l using (module_id)
union all
select '(' || count(*) || ' other lessons)', null, null, null,
       md5(string_agg(md5(to_jsonb(l)::text), '' order by l.module_id))
  from schools.school_lessons l
 where l.module_id not in (select module_id from f)
order by 1;`

console.log(`\nThe read only check:\n\n${check}`)

if (!WRITE) {
  console.log('\nPreview only. Nothing written. Rerun with --write.')
  process.exit(0)
}

const sql = `-- 374: the hard questions reach the live decks.
--
-- On 21 September 2026 (commit 992a5d49, "eighty hard questions") the
-- lessons gained teacher_notes.hard_questions: four per lesson, the questions
-- a class actually asks and the answer a teacher can give. They went into
-- content/modules and no migration carried them, the same gap the extension
-- marks had (migration 369). On 13 October 2026 a read of production found
-- ${decks.length} decks where the only difference from the files is that this key is
-- missing. The teacher who gets asked "is Father Christmas real" in EYFS, or
-- "what if I have already sent money" in the scams lesson, has nothing on
-- the live deck to answer with.
--
-- WHAT MOVES. One key, teacher_notes.hard_questions, on the ${decks.length} rows below,
-- ${total} questions in all, exactly as content/modules has them. Nothing else: no
-- other key in the notes, no other column, no slide, no other lesson. The 21
-- scheme decks that carry the key already are not touched.
--
-- GUARDED, per deck, before anything is written. Each deck must exist, hold
-- its notes as an object, and have the slide count the files have. A deck
-- that already carries hard questions must carry exactly these (a rerun);
-- any other value is a hand edit this will not overwrite. Any miss aborts
-- the whole migration rather than leaving a deck quietly short. The write
-- itself only touches a row whose key is absent and whose count matches.
--
-- Checked read only against production on 13 October 2026: all ${decks.length} decks have
-- the files' slide count and no hard questions, and the 21 that carry them
-- carry exactly the files' (md5 of each, all equal).
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every key of the notes, except that each of
-- the ${decks.length} gained hard_questions equal to the files'. Any other change fails it.
--
-- Independent of 373, which writes teacher_notes.passport_stage and guards
-- only that key: either can apply first. Idempotent: a second run finds the
-- questions in place, writes nothing and passes the same proof. Backed up
-- first.
--
-- Generated from content/modules by scripts/gen-374.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_374 as
  select module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons
  where module_id in (${ids});

alter table schools.school_lessons_backup_374 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_374 on commit drop as select * from schools.school_lessons;

-- The questions, as content/modules has them, with each deck's slide count.
create temp table hq_374 (module_id text primary key, n int not null, hq jsonb not null) on commit drop;
insert into hq_374 (module_id, n, hq) values
${decks.map(d => `  (${q(d.id)}, ${d.n}, ${literal(d)}::jsonb)`).join(',\n\n')};

-- ── the guards ─────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  select string_agg(h.module_id || case
           when l.module_id is null then ' is missing'
           when jsonb_typeof(l.teacher_notes) is distinct from 'object' then ' has no notes object'
           else ' has ' || jsonb_array_length(l.slides) || ' slides, not ' || h.n end, '; ')
    into bad
    from hq_374 h
    left join schools.school_lessons l using (module_id)
   where l.module_id is null
      or jsonb_typeof(l.teacher_notes) is distinct from 'object'
      or jsonb_array_length(l.slides) <> h.n;
  if bad is not null then raise exception '374 aborted, a deck is not the one read: %', bad; end if;

  select string_agg(h.module_id, ', ')
    into bad
    from hq_374 h
    join schools.school_lessons l using (module_id)
   where l.teacher_notes ? 'hard_questions'
     and l.teacher_notes -> 'hard_questions' is distinct from h.hq;
  if bad is not null then raise exception '374 aborted, a deck carries hard questions the files do not: %', bad; end if;
end $$;

-- ── the questions ──────────────────────────────────────────────────────────

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{hard_questions}', h.hq, true)
  from hq_374 h
 where l.module_id = h.module_id
   and not (l.teacher_notes ? 'hard_questions')
   and jsonb_array_length(l.slides) = h.n;

-- ── the proof ──────────────────────────────────────────────────────────────

do $$
declare bad text;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_374)
     or exists (select module_id from before_374 except select module_id from schools.school_lessons) then
    raise exception '374: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l join before_374 b using (module_id)
   where (to_jsonb(l) - 'teacher_notes') is distinct from (to_jsonb(b) - 'teacher_notes')
      or (l.teacher_notes - 'hard_questions') is distinct from (b.teacher_notes - 'hard_questions');
  if bad is not null then raise exception '374: a column, or a key of the notes, other than hard_questions moved in %', bad; end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_374 b using (module_id)
    left join hq_374 h using (module_id)
   where (l.teacher_notes -> 'hard_questions') is distinct from coalesce(h.hq, b.teacher_notes -> 'hard_questions');
  if bad is not null then raise exception '374: hard questions are not what the files hold in %', bad; end if;
end $$;

commit;
`

const file = path.join(ROOT, 'supabase/migrations', `${NAME}.sql`)
fs.writeFileSync(file, sql)
console.log(`\nWROTE supabase/migrations/${NAME}.sql (${sql.length} chars)`)
