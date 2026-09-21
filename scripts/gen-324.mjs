#!/usr/bin/env node
// MIGRATION 324: THE SIGN OFF COUNTS THE REAL SCHEME.
//
// DiGi closes ks5-20 with "Twenty modules, and here is where they were all
// heading." That was true the day it was written, when the scheme had 21
// lessons and this was the 20th of them. The scheme has 29 now, so the line
// counts a scheme that no longer exists, on a wall in front of a Year 13
// class. Justin's call on 21 September: make it the real number.
//
// WHICH REAL NUMBER. Two candidates, and only one of them is true where the
// line is spoken. The scheme total is 29. The number of modules up to and
// including this one, in the order the scheme teaches, is 28, because
// ks5-21 still follows it. The original construction was "this is module N
// and N modules led here", so the faithful update keeps that construction
// and moves N from 20 to 28. Twenty nine would claim the pupil has finished
// a scheme with one lesson still to come, which is the same class of untrue
// statement this migration exists to remove.
//
// The number is computed from the manifest, never typed in, so it cannot be
// wrong in the same way twice. scripts/check-lesson-counts.mjs then holds it
// there.
//
// WHAT IS NOT TOUCHED. Everything else in the sign off, which is the
// handover from a taught standard to an owned one and the whole point of the
// key stage. The slide stays DiGi's: it carries no character key, and the
// migration proves it still carries none. No slide is added or removed and
// no minute changes.
//
// STILL OPEN, AND DELIBERATELY NOT CHANGED HERE. "here is where they were
// all heading" is a finale, and ks5-20 is the 28th of 29, so it lands one
// lesson early; ks5-21 carries the real closing beat. That is a judgement
// about the shape of the scheme rather than a number that has gone stale,
// so it is Justin's to make and it is written up in the pull request.
//
// Usage: node scripts/gen-324.mjs           preview only, writes nothing
//        node scripts/gen-324.mjs --write   writes the migration and the mirror

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const q = s => `'${String(s).replace(/'/g, "''")}'`
const DASH = /[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i

const MODULE = 'ks5-20-ai-mastery-data-rights'
const WAS = 'Twenty modules, and here is where they were all heading. ⭐'

// Spelled out, because the same slide writes "a seventeen year old" and the
// line it replaces wrote "Twenty". No hyphen: rule 4 forbids a dash anywhere
// in copy, and "seventeen year old" in the same breath is unhyphenated too.
const WORDS = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty',
]
const spell = n => {
  if (n <= 20) return WORDS[n]
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty'][Math.floor(n / 10)]
  return n % 10 ? `${tens} ${WORDS[n % 10]}` : tens
}
const sentenceCase = s => s[0].toUpperCase() + s.slice(1)

// ── the number, from the manifest, in the order the scheme teaches ─────────
// Read as text for the same reason check-lesson-minutes.mjs does: no
// TypeScript loader has to be in the way for this to be runnable.
const manifestPath = path.join(ROOT, 'shared/schools-curriculum.ts')
let manifest = fs.readFileSync(manifestPath, 'utf8')
const order = [...manifest.matchAll(/moduleId: '([^']+)'/g)].map(m => m[1])
const position = order.indexOf(MODULE) + 1
if (position < 1) { console.error(`${MODULE} is not in the manifest`); process.exit(1) }
if (order.length < position) { console.error('the manifest order is not the shape this expects'); process.exit(1) }

const NOW = `${sentenceCase(spell(position))} modules, and here is where they were all heading. ⭐`

// ── the mechanism ─────────────────────────────────────────────────────────
const file = path.join(ROOT, 'content/modules', `${MODULE}.json`)
const m = JSON.parse(fs.readFileSync(file, 'utf8'))

const idx = m.slides.findIndex(s => s.type === 'digi' && s.phase === 'close' && s.heading === 'DiGi signs off')
if (idx < 0) { console.error(`${MODULE}: no DiGi sign off found`); process.exit(1) }
const slide = m.slides[idx]

// The sign off is the machine's own closing and must stay the machine's. A
// character key on this slide would hand it to a Planet Friend, which
// migration 323 was careful never to do.
if ('character' in slide) { console.error(`${MODULE}: the sign off carries a character key and must not`); process.exit(1) }
if (!Array.isArray(slide.lines) || slide.lines[0] !== WAS) {
  console.error(`${MODULE}: the first line of the sign off is not the one this rewrites.\n  found: ${JSON.stringify(slide.lines?.[0])}`)
  process.exit(1)
}
if (DASH.test(NOW)) { console.error(`REFUSED. The new line carries a dash: ${NOW}`); process.exit(1) }

console.log(`Migration 324 would correct one line in ${MODULE}.\n`)
console.log(`  ${MODULE} is number ${position} of ${order.length} in the order the scheme teaches`)
console.log(`  slide ${idx + 1}, line 1 of ${slide.lines.length}, in the DiGi sign off\n`)
console.log(`  was:  ${WAS}`)
console.log(`  now:  ${NOW}\n`)
console.log(`  untouched: the other ${slide.lines.length - 1} lines, the heading, the script, and the absence of a character key`)

if (!WRITE) {
  console.log('\nPreview only. Nothing written. Rerun with --write.')
  process.exit(0)
}

// ── write the mirror ──────────────────────────────────────────────────────
slide.lines[0] = NOW
fs.writeFileSync(file, JSON.stringify(m, null, 2) + '\n')

const out = execFileSync('node', [path.join(ROOT, 'scripts/module-string-hash.mjs'), file], { encoding: 'utf8' })
const hash = {
  slides: out.match(/slides\s+(\d+)/)[1],
  strings: out.match(/strings\s+(\d+)/)[1],
  md5: out.match(/md5\s+([0-9a-f]{32})/)[1],
}

// ── the migration ─────────────────────────────────────────────────────────
const name = '324_the_sign_off_counts_the_real_scheme'
const sql = `-- 324: the sign off counts the real scheme
--
-- DiGi closes ks5-20 with "Twenty modules, and here is where they were all
-- heading." It was true when the scheme had 21 lessons and this was the 20th.
-- The scheme has ${order.length} now, so the line counts a scheme that no longer exists,
-- on a wall in front of a Year 13 class.
--
-- The number it becomes is ${position}: the count of modules up to and including this
-- one in the order the scheme teaches, which is what the original construction
-- meant. ${order.length} would claim the pupil has finished a scheme with one lesson
-- still to come, which is the same untruth in the other direction.
--
-- One line moves. The rest of the sign off, its heading and its script are
-- untouched, and the slide carries no character key before or after, because
-- the close is the machine's own and migration 323 left it that way.
--
-- The write is guarded on the exact current text. A miss aborts and writes
-- nothing.

begin;

create table schools.school_lessons_backup_324 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_324 enable row level security;

create temp table miss(module text, target text);

do $$
declare signoff jsonb;
begin
  select l.slides->${idx} into signoff from schools.school_lessons l where l.module_id = ${q(MODULE)};

  if signoff is null then
    insert into miss values (${q(MODULE)}, 'the row or slide ${idx + 1} is missing'); return;
  end if;
  if signoff->>'type' is distinct from 'digi' or signoff->>'phase' is distinct from 'close'
     or signoff->>'heading' is distinct from 'DiGi signs off' then
    insert into miss values (${q(MODULE)}, 'slide ${idx + 1} is not the DiGi sign off'); return;
  end if;
  if signoff ? 'character' then
    insert into miss values (${q(MODULE)}, 'the sign off carries a character key and must not'); return;
  end if;
  if jsonb_array_length(signoff->'lines') is distinct from ${slide.lines.length} then
    insert into miss values (${q(MODULE)}, 'the sign off does not have ${slide.lines.length} lines'); return;
  end if;
  if signoff->'lines'->>0 is distinct from ${q(WAS)} then
    insert into miss values (${q(MODULE)}, 'the first line is not the one this rewrites'); return;
  end if;

  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array['${idx}','lines','0'], to_jsonb(${q(NOW)}::text), false)
   where l.module_id = ${q(MODULE)};
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- the proof: the line took, nothing else in the sign off moved
do $$
declare s jsonb; signoff jsonb;
begin
  select l.slides into s from schools.school_lessons l where l.module_id = ${q(MODULE)};
  signoff := s->${idx};
  if signoff->'lines'->>0 is distinct from ${q(NOW)} then
    raise exception '324: the sign off still reads %', signoff->'lines'->>0;
  end if;
  if signoff ? 'character' then
    raise exception '324: the sign off gained a character key and it must stay DiGi''s';
  end if;
  if jsonb_array_length(signoff->'lines') is distinct from ${slide.lines.length}
     or signoff->>'heading' is distinct from 'DiGi signs off' then
    raise exception '324: the sign off was disturbed beyond its first line';
  end if;
  if jsonb_array_length(s) is distinct from ${m.slides.length} then
    raise exception '324: ${MODULE} has % slides, not ${m.slides.length}', jsonb_array_length(s);
  end if;
end $$;

-- the proof: the retired line is gone from every lesson, not just this one.
-- An exact match rather than a pattern, because the only thing worth asserting
-- here is that the stale sentence is nowhere. The general rule, that any stated
-- module count must be one that is true, is scripts/check-lesson-counts.mjs,
-- which can say it properly and runs on every push.
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
  where jsonb_typeof(x) = 'string' and (x #>> '{}') = ${q(WAS)};
  if cnt > 0 then raise exception '324: % lesson(s) still carry the retired line: %', cnt, list; end if;
end $$;

-- the proof: the row equals its file in content/modules, string for string
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = ${q(MODULE)} and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = ${q(MODULE)}
    union all select title from schools.school_lessons where module_id = ${q(MODULE)}
    union all select key_stage from schools.school_lessons where module_id = ${q(MODULE)}
    union all select year_band from schools.school_lessons where module_id = ${q(MODULE)}
    union all select audience from schools.school_lessons where module_id = ${q(MODULE)}
    union all select evidence_anchor from schools.school_lessons where module_id = ${q(MODULE)}
    union all select single_action_outcome from schools.school_lessons where module_id = ${q(MODULE)}
    union all select character_cast from schools.school_lessons where module_id = ${q(MODULE)}
    union all select scaffold from schools.school_lessons where module_id = ${q(MODULE)}
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = ${q(MODULE)}
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = ${q(MODULE)}
  ) z;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = ${q(MODULE)};
  if got_slides is distinct from ${hash.slides} or got_n is distinct from ${hash.strings} or got_hash is distinct from ${q(hash.md5)} then
    raise exception '324: ${MODULE} is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;

commit;
`

fs.writeFileSync(path.join(ROOT, 'supabase/migrations', `${name}.sql`), sql)
console.log(`\nWROTE supabase/migrations/${name}.sql (${sql.length} chars)`)
console.log(`WROTE content/modules/${MODULE}.json`)
console.log(`  ${hash.slides} slides, ${hash.strings} strings, md5 ${hash.md5}`)
