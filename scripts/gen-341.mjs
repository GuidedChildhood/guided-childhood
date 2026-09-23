#!/usr/bin/env node
// Generates migration 341 AND patches the content/modules mirror from the
// same constants, so the database and the file cannot disagree about a word.
//
// Run once: node scripts/gen-341.mjs. It has run, and 341 is applied.
//
// SUPERSEDED IN PART BY 342. Evidence row 0 below cites its requirement as
// RSHE-S-OSA-7, and the module contract counts a hyphen between two letters as
// a dash in teacher facing copy. This generator's own dash check missed it,
// because it only looked for long dashes and spaced hyphens. The check below
// now uses the contract's regex, so running this again throws on row 0 rather
// than reproduce the mistake. Row 0 is left as 341 applied it, so this file
// stays an honest record of what 341 did; 342 holds the corrected wording.
import fs from 'node:fs'

const MODULE = 'ks3-12-misinfo-deepfakes'

// The two corrections. Each is guarded on the exact text it replaces, so a
// replay, or a lesson rewritten since, aborts rather than overwriting.
const SWAPS = [
  {
    // Slide 10, the stat. The old wording said people "spotted every piece of
    // fake content". Every report of the study describes a different task:
    // telling real from fake across ALL the items, real ones included. That is
    // not a quibble. Somebody who calls everything fake spots every fake and
    // fails the test the study ran, and slide 11 of this same lesson teaches
    // that calling everything fake is as lazy as believing everything. The
    // accurate version is the one that supports the lesson.
    path: ['10', 'claim'],
    from: 'In a large detection test, only about one person in a thousand spotted every piece of fake content put in front of them.',
    to: 'In a test of 2,000 people, only about one in a thousand could tell every real image and video from every fake.',
  },
  {
    // Slide 13, check three. "Every fake" is stronger than the evidence: the
    // study below measures how people react to false news, not what every
    // fake is designed to do. Some fakes are a dull invented statistic.
    path: ['13', 'steps', '2', 'text'],
    from: 'Big instant feelings are the doorway every fake aims for.',
    to: 'Big instant feelings are the doorway most fakes aim for.',
  },
]

// The teacher's panel, "Where the claims come from". Status is honest about
// what was actually checked, and on what:
//   verified   checked against the primary document
//   verify     real and consistently reported, but the primary could not be
//              opened from the build environment on 23 September 2026
//   mechanism  the slide states a method, not a figure; the source is why the
//              method points at the right thing
const EVIDENCE = [
  {
    claim: 'Deepfakes are named in the statutory guidance for secondary pupils: their prevalence, how they can be used maliciously as well as for entertainment, the harms they can cause and how to identify them.',
    source: 'Department for Education, Relationships Education, RSE and Health Education, July 2025, in force 1 September 2026, requirement RSHE-S-OSA-7. The full mapping, requirement by requirement, is on the RSHE page.',
    status: 'verified',
  },
  {
    claim: 'In a test of 2,000 people in the UK and US, about one in a thousand correctly told every real image and video from every fake, even after being told to look for fakes.',
    source: 'iProov, Deepfake Blindspot study, February 2025. Industry research from a company that sells biometric protection against deepfakes, and not peer reviewed, so treat it as a vivid illustration rather than a precise measurement.',
    status: 'verify',
  },
  {
    claim: 'Check two, what do other places say, is lateral reading: leaving the page to see what other sources say about it, which is how professional fact checkers work.',
    source: 'Wineburg and McGrew, Lateral Reading and the Nature of Expertise, Teachers College Record, 2019. Professional fact checkers reached better supported conclusions in a fraction of the time taken by historians and students, by reading across sites rather than down one.',
    status: 'mechanism',
  },
  {
    claim: 'False news tends to provoke strong reactions and to spread further than the truth, which is why check three asks how a post wants you to feel.',
    source: 'Vosoughi, Roy and Aral, The spread of true and false news online, Science, 2018. False news spread farther and faster than true news, and replies to it showed more fear, disgust and surprise.',
    status: 'mechanism',
  },
]

// No dashes in copy, ever. The same regex as scripts/check-module-contract.mjs
// rule 5, copied rather than approximated: the first version of this check
// only caught long dashes and spaced hyphens, and let RSHE-S-OSA-7 through.
const DASH = /[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i
for (const s of [...SWAPS.map(x => x.to), ...EVIDENCE.flatMap(e => [e.claim, e.source])]) {
  if (DASH.test(s)) throw new Error(`dash in copy: ${s}`)
}

const q = s => `'${s.replace(/'/g, "''")}'`
const json = JSON.stringify(EVIDENCE)
if (json.includes('$ev$')) throw new Error('evidence text collides with the dollar quote tag')

const sql = `-- 341: the free taster gets its evidence, and two claims are corrected.
--
-- ks3-12 is the one lesson a school can open without a code, and the lesson
-- the schools launch post, the outreach email and the reply to a reviewing
-- DSL all point at. It is also the only module mapped to RSHE-S-OSA-7, the
-- statutory requirement that names deepfakes. Its teacher panel, "Where the
-- claims come from", was empty, so on the page a prospect is sent to, the
-- section written for a parent's challenge rendered nothing at all.
--
-- Verifying the lesson's claims found two that said more than their source:
--   slide 10  "spotted every piece of fake content" describes a task the
--             study did not set. It measured telling real from fake across
--             every item. Corrected to what was measured.
--   slide 13  "the doorway every fake aims for" goes beyond research that
--             measured reactions, not intent. "every" becomes "most".
--
-- Four evidence rows. Their status says honestly what was checked: the
-- statutory row against the DfE document in the September audit; the iProov
-- figure is marked not yet checked, because its primary could not be opened
-- from the build environment; the two research rows back a method rather than
-- a number.
--
-- Only ks3-12 moves. Within it, only slides 10 and 13 and the evidence base.

begin;

create table schools.school_lessons_backup_341 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_341 enable row level security;

create temp table miss(target text) on commit drop;

create or replace function schools.swap_341(p_path text[], p_expect text, p_new text)
returns void language plpgsql as $$
declare cur text;
begin
  select l.slides #>> p_path into cur
    from schools.school_lessons l where l.module_id = '${MODULE}';
  if cur is distinct from p_expect then
    insert into miss values ('slides.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, p_path, to_jsonb(p_new))
   where l.module_id = '${MODULE}';
end $$;

${SWAPS.map(s => `select schools.swap_341(array[${s.path.map(q).join(', ')}], ${q(s.from)}, ${q(s.to)});`).join('\n')}

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = '${MODULE}';
  if n <> 0 then
    insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite');
  end if;
end $$;

update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$${json}$ev$::jsonb, true)
 where l.module_id = '${MODULE}'
   and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\\n  ') into n, d from miss;
  if n > 0 then raise exception E'341 aborted, % guard(s) missed:\\n  %', n, d; end if;
end $$;

-- Nothing moved but what was named.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_341 b on b.module_id = l.module_id
   where l.module_id <> '${MODULE}'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes);
  if bad is not null then raise exception '341 aborted, other modules moved: %', bad; end if;

  select string_agg(i::text, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_341 b on b.module_id = l.module_id,
         generate_series(0, jsonb_array_length(l.slides) - 1) i
   where l.module_id = '${MODULE}'
     and (l.slides->i) is distinct from (b.slides->i)
     and i not in (10, 13);
  if bad is not null then raise exception '341 aborted, unexpected slides moved: %', bad; end if;

  if exists (
    select 1 from schools.school_lessons l
      join schools.school_lessons_backup_341 b on b.module_id = l.module_id
     where l.module_id = '${MODULE}'
       and (l.teacher_notes - 'evidence_base') is distinct from (b.teacher_notes - 'evidence_base')
  ) then raise exception '341 aborted, teacher_notes moved outside evidence_base'; end if;

  if (select jsonb_array_length(teacher_notes->'evidence_base')
        from schools.school_lessons where module_id = '${MODULE}') <> ${EVIDENCE.length} then
    raise exception '341 aborted, evidence_base is not ${EVIDENCE.length} rows';
  end if;
end $$;

drop function schools.swap_341(text[], text, text);

commit;
`

fs.writeFileSync('supabase/migrations/341_the_taster_gets_its_evidence.sql', sql)

// The mirror, patched from the same constants.
const file = `content/modules/${MODULE}.json`
const m = JSON.parse(fs.readFileSync(file, 'utf8'))
const at = (o, p) => p.reduce((a, k) => a[k], o)
for (const s of SWAPS) {
  const parent = at(m.slides, s.path.slice(0, -1))
  const key = s.path[s.path.length - 1]
  if (parent[key] !== s.from) throw new Error(`mirror drifted at slides.${s.path.join('.')}`)
  parent[key] = s.to
}
if (m.teacher_notes?.evidence_base?.length) throw new Error('mirror already has an evidence base')
m.teacher_notes = { ...(m.teacher_notes ?? {}), evidence_base: EVIDENCE }
fs.writeFileSync(file, JSON.stringify(m, null, 2) + '\n')

console.log(`wrote 341 (${sql.length} bytes) and patched ${file}`)
