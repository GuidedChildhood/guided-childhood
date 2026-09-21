#!/usr/bin/env node
// MIGRATION 323: COSMO FRONTS THE SIXTH FORM.
//
// Cosmo fronted zero lessons. Both sixth form modules were cast to DiGi, and
// the schools home page rightly hides a friend the curriculum gives nothing
// to, so Cosmo vanished from the one place that lists the cast while the hero
// picture, the KS5 printouts and the parents app all still promised him.
// Justin's call on 21 September: recast both KS5 modules to Cosmo, with DiGi
// still closing as it closes every lesson.
//
// THE WORDS. Four writers on four different angles, three judges (a Year 13
// student, a head of sixth form, and a writer who knows the other four
// friends' voices), then three hostile checks against the house rules, the
// slides that follow each beat, and the register. All three judges picked the
// same draft; the checks forced six rewrites. The governing idea they
// converged on: Cosmo stops narrating Cosmo. Orbit opens "I have watched a
// hundred group chats go wrong" and Nova opens "I can navigate anywhere. I
// still cannot beat a coin"; neither says its own name in a spoken line at
// all. Cosmo has to, once, because these two lessons are the only place in
// nine years a student meets him, so he gets one flat sentence of naming
// welded to a claim about the world and then talks about the room.
//
// Three lines died in the checks for giving away the lesson's own answer in
// its opening minute, which the stored teacher script explicitly forbids
// ("Do not answer it").
//
// WHAT IS NOT TOUCHED. The DiGi sign off that ends both lessons. It is the
// machine saying the one thing nobody else can say about itself, and the
// arrival must not introduce a second guide in front of it. Both title lines
// stay as they are. No slide is added or removed and no minute changes.
//
// Usage: node scripts/gen-323.mjs           preview only, writes nothing
//        node scripts/gen-323.mjs --write   writes the migration and the mirror
//
// Written 21 September 2026 and held unrun until Justin approved the lines.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const q = s => `'${String(s).replace(/'/g, "''")}'`
const DASH = /[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i

// ── THE COPY ──────────────────────────────────────────────────────────────
// Edit here and rerun. Everything below is mechanism.
const COPY = {
  'ks5-20-ai-mastery-data-rights': {
    arrival_heading: 'Cosmo opens the lesson',
    arrival_lines: [
      'I am Cosmo. I lead things, and everyone I lead has the same tools I do.',
      'So if everyone has the same AI, what makes your work worth more than theirs?',
      'Leave it open for now. By the end you answer it with work you can point at, not an opinion.',
    ],
    arrival_script: 'Let Cosmo say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.',
    breath_prompt: 'Two slow breaths, then read back what you have so far. Mark the one line you could not defend if someone asked, say which one to the person next to you, then finish the run.',
    breath_script: 'Half time. Two breaths with the whole room, then a minute on their own sheet finding the one line they could not defend if someone asked. Thirty seconds in pairs naming that line to each other. Nothing is marked and nobody reads theirs out. Then straight back into the run.',
    mission_lines: [
      'When someone hands you AI work, ask which part they checked.',
      'It is not an accusation. It is just the question now, and soon enough you are the one answering it.',
      'Ask it first, and the standard in the room is yours.',
    ],
  },
  'ks5-21-digital-identity-future-work': {
    arrival_heading: 'Cosmo opens the lesson',
    arrival_lines: [
      'I am Cosmo. Most of the people who will decide about you in ten years have not met you yet.',
      'What will still be worth paying you for in ten years?',
      'That is one of the two. The other is what your name already brings up on a screen, and you answer that one first.',
    ],
    arrival_script: 'Let Cosmo say the lines. Then read the question once, quietly, in your own voice, and leave it. Do not answer it. The next slide says what today is for.',
    breath_prompt: 'Two breaths first, then a colder read of your own sheet, the way an employer or an admissions tutor would read it. Tell the person next to you the one line you would want them to stop on, then finish the plan.',
    breath_script: 'Half time. Two breaths with the whole room, then a minute reading their own sheet the way a stranger deciding about them would read it. Thirty seconds in pairs naming the one line they would want that stranger to stop on. Nothing is marked and nobody reads theirs out. Then straight back into the plan.',
    mission_lines: [
      'Name the skill exactly, then hand everyone the same AI and ask whether its value climbs or falls.',
      'Run it on the course you are about to choose, and on the job someone has told you is safe.',
      'If something you were counting on comes back falling, that is worth knowing now and not in ten years.',
    ],
  },
}

const CAST_LINE = 'Cosmo with DiGi'

// ── the mechanism ─────────────────────────────────────────────────────────
const targets = []
for (const [id, copy] of Object.entries(COPY)) {
  const file = path.join(ROOT, 'content/modules', `${id}.json`)
  const m = JSON.parse(fs.readFileSync(file, 'utf8'))

  const t = { id, file, m }
  t.title = m.slides.findIndex(s => s.type === 'title')
  t.arrival = m.slides.findIndex(s => s.type === 'digi' && s.phase === 'starter')
  t.breath = m.slides.findIndex(s => s.type === 'interactive' && s.component === 'star-breath')
  t.mission = m.slides.findIndex(s => s.type === 'digi' && s.phase === 'close' && s.heading === 'One thing to take with you')
  if ([t.title, t.arrival, t.breath, t.mission].some(i => i < 0)) {
    console.error(`${id}: one of the four beats is not where this expects it`); process.exit(1)
  }
  // The sign off must exist and must stay DiGi's.
  t.signoff = m.slides.findIndex(s => s.type === 'digi' && s.phase === 'close' && s.heading !== 'One thing to take with you')
  if (t.signoff < 0) { console.error(`${id}: no DiGi sign off found, refusing to recast`); process.exit(1) }

  // Every string that must be exactly what we think it is before we write.
  // THE CAST LINE IS A COLUMN, NOT THE MANIFEST (caught by the contract on the
  // first generation). check-module-contract.mjs rule 8 holds every friend on a
  // beat to the row's own character_cast, so recasting the beats without it
  // fails the contract on both lessons: "cast is digi with motion graphics".
  t.was = {
    characterCast: m.row?.character_cast,
    titleCharacter: m.slides[t.title].character,
    arrivalCharacter: m.slides[t.arrival].character,
    arrivalHeading: m.slides[t.arrival].heading,
    arrivalScript: m.slides[t.arrival].script,
    breathCharacter: m.slides[t.breath].config?.character,
    breathPrompt: m.slides[t.breath].config?.prompt,
    breathScript: m.slides[t.breath].script,
    missionCharacter: m.slides[t.mission].character,
  }
  if (Object.values(t.was).some(v => v === undefined)) {
    console.error(`${id}: a field this migration guards on is missing: ${JSON.stringify(t.was)}`); process.exit(1)
  }
  if (t.was.titleCharacter !== 'digi' || t.was.arrivalCharacter !== 'digi' || t.was.breathCharacter !== 'digi' || t.was.missionCharacter !== 'digi') {
    console.error(`${id}: one of the four beats is not cast to DiGi. It may already be recast.`); process.exit(1)
  }

  t.copy = copy
  targets.push(t)
}

// The house rule, on every new string, before anything is written.
const strings = targets.flatMap(t => [
  t.copy.arrival_heading, t.copy.arrival_script, t.copy.breath_prompt, t.copy.breath_script,
  ...t.copy.arrival_lines, ...t.copy.mission_lines,
]).concat([CAST_LINE])
const dashed = strings.filter(s => DASH.test(s))
if (dashed.length) { console.error(`REFUSED. ${dashed.length} new string(s) carry a dash:\n  ${dashed.join('\n  ')}`); process.exit(1) }

console.log(`Migration 323 would recast ${targets.length} lesson(s) from DiGi to Cosmo.\n`)
for (const t of targets) {
  console.log(`${t.id}`)
  console.log(`  slide ${t.title + 1}   title      character digi to cosmo`)
  console.log(`  slide ${t.arrival + 1}   arrival    character, heading, three lines and the script`)
  console.log(`  slide ${t.breath + 1}  half time  config.character, config.prompt and the script`)
  console.log(`  slide ${t.mission + 1}  mission    character and three lines`)
  console.log(`  slide ${t.signoff + 1}  sign off   UNTOUCHED, stays DiGi's`)
}
console.log(`\nmanifest: character digi to cosmo, castLine to ${JSON.stringify(CAST_LINE)} on both rows`)
console.log(`${strings.length} new strings, none carrying a dash.`)

if (!WRITE) {
  console.log('\nPreview only. Nothing written. Rerun with --write once the lines are approved.')
  process.exit(0)
}

// ── write the mirror ──────────────────────────────────────────────────────
for (const t of targets) {
  const { m, copy } = t
  m.slides[t.title].character = 'cosmo'
  Object.assign(m.slides[t.arrival], {
    character: 'cosmo', heading: copy.arrival_heading, lines: copy.arrival_lines, script: copy.arrival_script,
  })
  Object.assign(m.slides[t.breath].config, { character: 'cosmo', prompt: copy.breath_prompt })
  m.slides[t.breath].script = copy.breath_script
  Object.assign(m.slides[t.mission], { character: 'cosmo', lines: copy.mission_lines })
  m.row.character_cast = CAST_LINE
  fs.writeFileSync(t.file, JSON.stringify(m, null, 2) + '\n')

  const out = execFileSync('node', [path.join(ROOT, 'scripts/module-string-hash.mjs'), t.file], { encoding: 'utf8' })
  t.hash = { slides: out.match(/slides\s+(\d+)/)[1], strings: out.match(/strings\s+(\d+)/)[1], md5: out.match(/md5\s+([0-9a-f]{32})/)[1] }
}

// ── the manifest ──────────────────────────────────────────────────────────
// check-character-voices.mjs rule 1 holds the friend key to the first friend
// the cast line names, so these two must move together or the guard fails.
const manifestPath = path.join(ROOT, 'shared/schools-curriculum.ts')
let manifest = fs.readFileSync(manifestPath, 'utf8')
for (const t of targets) {
  const re = new RegExp(`(moduleId: '${t.id}',[\\s\\S]*?)character: 'digi', castLine: '[^']*'`)
  if (!re.test(manifest)) { console.error(`manifest row for ${t.id} is not the shape this expects`); process.exit(1) }
  manifest = manifest.replace(re, `$1character: 'cosmo', castLine: '${CAST_LINE}'`)
}
fs.writeFileSync(manifestPath, manifest)

// ── the migration ─────────────────────────────────────────────────────────
const name = '323_cosmo_fronts_the_sixth_form'
const guards = targets.map(t => `
do $$
declare title jsonb; arrival jsonb; breath jsonb; mission jsonb; cast_line text;
begin
  select l.slides->${t.title}, l.slides->${t.arrival}, l.slides->${t.breath}, l.slides->${t.mission}, l.character_cast
    into title, arrival, breath, mission, cast_line
  from schools.school_lessons l where l.module_id = ${q(t.id)};

  if title is null or arrival is null or breath is null or mission is null then
    insert into miss values (${q(t.id)}, 'the row or one of the four beats is missing'); return;
  end if;
  if cast_line is distinct from ${q(t.was.characterCast)} then
    insert into miss values (${q(t.id)}, 'the cast line is not the one this rewrites'); return;
  end if;
  if title->>'character' is distinct from 'digi' or arrival->>'character' is distinct from 'digi'
     or breath->'config'->>'character' is distinct from 'digi' or mission->>'character' is distinct from 'digi' then
    insert into miss values (${q(t.id)}, 'a beat is not cast to DiGi, it may already be recast'); return;
  end if;
  if arrival->>'heading' is distinct from ${q(t.was.arrivalHeading)} or arrival->>'script' is distinct from ${q(t.was.arrivalScript)} then
    insert into miss values (${q(t.id)}, 'the arrival is not the one this rewrites'); return;
  end if;
  if breath->'config'->>'prompt' is distinct from ${q(t.was.breathPrompt)} or breath->>'script' is distinct from ${q(t.was.breathScript)} then
    insert into miss values (${q(t.id)}, 'the half time beat is not the one this rewrites'); return;
  end if;
  if mission->>'heading' is distinct from 'One thing to take with you' then
    insert into miss values (${q(t.id)}, 'slide ${t.mission + 1} is not the mission'); return;
  end if;

  -- The cast line moves with the beats. Contract rule 8 holds every friend on
  -- a beat to this column, so the two can never be split.
  update schools.school_lessons set character_cast = ${q(CAST_LINE)} where module_id = ${q(t.id)};

  update schools.school_lessons l set slides =
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(
    jsonb_set(l.slides, array['${t.title}','character'],   to_jsonb('cosmo'::text), false),
                        array['${t.arrival}','character'], to_jsonb('cosmo'::text), false),
                        array['${t.arrival}','heading'],   to_jsonb(${q(t.copy.arrival_heading)}::text), false),
                        array['${t.arrival}','lines'],     ${q(JSON.stringify(t.copy.arrival_lines))}::jsonb, false),
                        array['${t.arrival}','script'],    to_jsonb(${q(t.copy.arrival_script)}::text), false),
                        array['${t.breath}','config','character'], to_jsonb('cosmo'::text), false),
                        array['${t.breath}','config','prompt'],    to_jsonb(${q(t.copy.breath_prompt)}::text), false),
                        array['${t.breath}','script'],     to_jsonb(${q(t.copy.breath_script)}::text), false),
                        array['${t.mission}','character'], to_jsonb('cosmo'::text), false),
                        array['${t.mission}','lines'],     ${q(JSON.stringify(t.copy.mission_lines))}::jsonb, false)
  where l.module_id = ${q(t.id)};
end $$;`).join('\n')

const proofs = targets.map(t => `
do $$
declare s jsonb; signoff jsonb; cast_line text;
begin
  select l.slides, l.character_cast into s, cast_line from schools.school_lessons l where l.module_id = ${q(t.id)};
  if s->${t.title}->>'character' is distinct from 'cosmo' or s->${t.arrival}->>'character' is distinct from 'cosmo'
     or s->${t.breath}->'config'->>'character' is distinct from 'cosmo' or s->${t.mission}->>'character' is distinct from 'cosmo' then
    raise exception '323: ${t.id} did not take all four beats';
  end if;
  -- Contract rule 8: a friend on a beat must be named in the row's cast line.
  if lower(cast_line) not like '%cosmo%' then
    raise exception '323: ${t.id} casts Cosmo on its beats but its cast line reads %', cast_line;
  end if;
  signoff := s->${t.signoff};
  if signoff->>'type' is distinct from 'digi' or signoff ? 'character' then
    raise exception '323: the sign off on ${t.id} was disturbed, and it must stay DiGi''s';
  end if;
  if jsonb_array_length(s) is distinct from ${t.m.slides.length} then
    raise exception '323: ${t.id} has % slides, not ${t.m.slides.length}', jsonb_array_length(s);
  end if;
end $$;`).join('\n')

const hashes = targets.map(t => `
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = ${q(t.id)} and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = ${q(t.id)}
    union all select title from schools.school_lessons where module_id = ${q(t.id)}
    union all select key_stage from schools.school_lessons where module_id = ${q(t.id)}
    union all select year_band from schools.school_lessons where module_id = ${q(t.id)}
    union all select audience from schools.school_lessons where module_id = ${q(t.id)}
    union all select evidence_anchor from schools.school_lessons where module_id = ${q(t.id)}
    union all select single_action_outcome from schools.school_lessons where module_id = ${q(t.id)}
    union all select character_cast from schools.school_lessons where module_id = ${q(t.id)}
    union all select scaffold from schools.school_lessons where module_id = ${q(t.id)}
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = ${q(t.id)}
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = ${q(t.id)}
  ) z;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = ${q(t.id)};
  if got_slides is distinct from ${t.hash.slides} or got_n is distinct from ${t.hash.strings} or got_hash is distinct from ${q(t.hash.md5)} then
    raise exception '323: ${t.id} is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;`).join('\n')

const sql = `-- 323: Cosmo fronts the sixth form
--
-- Cosmo fronted zero lessons. Both KS5 modules were cast to DiGi, and the
-- schools home page hides a friend the curriculum gives nothing to, so Cosmo
-- vanished from the one place that lists the cast while the hero picture, the
-- KS5 printouts and the parents app all still promised him. Justin's call on
-- 21 September: recast both, with DiGi still closing as it closes every lesson.
--
-- Four beats move per lesson: the title's cast key, the arrival, the half time
-- breath and the mission. The DiGi sign off that ends both lessons is not
-- touched and is proved untouched below. No slide is added or removed and no
-- minute changes, so the published length is unaffected.
--
-- Every write is guarded on the exact current text. Any miss aborts the whole
-- migration and writes nothing.

begin;

create table schools.school_lessons_backup_323 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_323 enable row level security;

create temp table miss(module text, target text);
${guards}

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- the proof: all four beats took, the sign off is still DiGi's, nothing moved
${proofs}

-- the proof: no lesson anywhere still opens on a friend it is not cast to
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l
  where l.key_stage = 'KS5' and l.slides->0->>'character' is distinct from 'cosmo';
  if cnt > 0 then raise exception '323: % sixth form lesson(s) still open on someone else: %', cnt, list; end if;
end $$;

-- the proof: each row equals its file in content/modules, string for string
${hashes}

commit;
`

fs.writeFileSync(path.join(ROOT, 'supabase/migrations', `${name}.sql`), sql)
console.log(`\nWROTE supabase/migrations/${name}.sql (${sql.length} chars)`)
console.log(`WROTE ${targets.length} file(s) in content/modules and both manifest rows`)
for (const t of targets) console.log(`  ${t.id}: ${t.hash.slides} slides, ${t.hash.strings} strings, md5 ${t.hash.md5}`)
