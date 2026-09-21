#!/usr/bin/env node
// VERIFIED REVIEW FINDINGS, TURNED INTO GUARDED MIGRATIONS. NEVER BY HAND.
//
// The lesson review (plans/week-of-2026-09-21-best-lessons-plan.md, step 6)
// runs one reviewer and one verifier per lesson against scripts/lesson-rubric.md
// and leaves, per module, a file of accepted edits: one slide, one string
// field, the exact text that should be there. This script is the only road
// from those files to production, and it refuses to build a batch that any
// instrument would reject.
//
// WHAT ONE EDIT IS
//   { "slide": 7, "ident": "choice:Which one is the safe move?", "path": "options/1/feedback",
//     "check": "R14", "severity": "must", "problem": "why",
//     "expect_start": "Not quite. The", "new": "the exact new text" }
//   slide is the 1 based position on the wall. path is a slash path inside the
//   slide to ONE string leaf (body, heading, script, options/1/text, steps/2/text,
//   config/prompt, points/0, lines/1, words/2/meaning). Structure never changes
//   here: no slide is added, moved or removed, no key is created.
//
//   THE CURRENT TEXT COMES FROM THE FILE, NOT FROM THE REVIEWER. A model
//   retyping a fifteen hundred character script as `expect` is the least
//   reliable step imaginable, so the guard text is read from the module file,
//   which the string hash has already proved equal to production. The reviewer
//   proves it looked at the right slide two cheaper ways instead: `ident`, the
//   slide's type and heading (or title, question, prompt, component), and
//   `expect_start`, the opening of the text it is replacing. A full `expect`
//   is still accepted and, when given, must match exactly.
//
// WHAT IS CHECKED BEFORE A LINE OF SQL IS WRITTEN, on the local module JSON
//   1. the path resolves to a string; `ident` and `expect_start` (or `expect`)
//      match the file, character for character
//   2. `new` is not empty and carries no dash (the module contract's own rule 5)
//   3. after every edit the slide is inside its wall ceiling (the council's own rule)
//   4. after every edit the attestations still hold: an RSHE phrase must appear
//      in at least one of its requirement's modules (the coverage guard's own
//      test, which is why a phrase can move between two lessons that share a
//      requirement but never vanish from both), and a computing phrase must
//      appear in every module it names
//   5. the module contract does not get worse (see the note at step 5)
//
// WHAT THE SQL GUARDS AGAIN, on the server, inside one transaction
//   a backup table; every write checks the slide's type and heading and the
//   exact current text and records a miss rather than writing; any miss aborts
//   the whole batch; then the prose ceiling proof, the attestation proof for
//   every phrase the batch's modules are named on, and the string hash proof
//   that every module in the batch now equals its file in content/modules.
//   The migration file is the record: its header lists every edit and why.
//
// Usage: node scripts/gen-review-batch.mjs <findings-dir> <first-number> <slug> [--max-chars 38000] [--dry]
//   Writes supabase/migrations/<n>_<slug>_<i>.sql per batch and updates
//   content/modules/<module>.json to the post state. --dry checks and reports
//   without writing anything.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { checkProse } from './council-checks.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const MODULES_DIR = path.join(ROOT, 'content/modules')
const args = process.argv.slice(2)
const [dir, firstNumber, slug] = args
if (!dir || !firstNumber || !slug) {
  console.error('usage: node scripts/gen-review-batch.mjs <findings-dir> <first-number> <slug> [--max-chars 38000] [--dry]')
  process.exit(2)
}
const maxAt = args.indexOf('--max-chars')
const MAX = maxAt === -1 ? 38000 : Number(args[maxAt + 1])
const DRY = args.includes('--dry')

// ── the attested phrases, parsed the way the two guards parse them ──────
// mode 'any': the RSHE guard (scripts/rshe-evidence.mjs) counts a phrase as
// held when ANY of the requirement's modules carries it. mode 'all': the
// computing guard (scripts/check-computing-coverage.mjs) holds EVERY probed
// module to its phrase.
const unq = s => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’')
const rsheSrc = fs.readFileSync(path.join(ROOT, 'shared/schools-rshe-2026.ts'), 'utf8')
const compSrc = fs.readFileSync(path.join(ROOT, 'shared/schools-computing-pos.ts'), 'utf8')
const probes = [] // { id, phrase, modules, mode }
for (const b of rsheSrc.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  const evs = [...(b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => unq(m[1]))
  if (mods.length && evs.length) for (const phrase of evs) probes.push({ id, phrase, modules: mods, mode: 'any' })
}
for (const b of compSrc.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  for (const p of b.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)) {
    probes.push({ id, phrase: unq(p[1]), modules: [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1]), mode: 'all' })
  }
}

// ── the instruments, the same ones the contract and the council run ───────
const DASH = /[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i
const ident = s => `${s.type}:${s.heading ?? s.title ?? s.question ?? s.prompt ?? s.component ?? ''}`
const getAt = (obj, segs) => segs.reduce((o, k) => (o == null ? undefined : o[k]), obj)
const setAt = (obj, segs, v) => { const last = segs[segs.length - 1]; const parent = getAt(obj, segs.slice(0, -1)); parent[last] = v }
const q = s => `'${String(s).replace(/'/g, "''")}'`
const lowerSlides = m => JSON.stringify(m.slides).toLowerCase()

// ── read every module's accepted edits ────────────────────────────────────
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
const modules = [] // { id, m, mpath, edits }
let bad = 0
const fail = (mod, msg) => { bad++; console.error(`  FAIL ${mod}: ${msg}`) }

for (const f of files) {
  const fx = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const id = fx.module_id
  const edits = (fx.edits || []).filter(e => e && e.accept !== false)
  if (!id) { fail(f, 'no module_id'); continue }
  if (!edits.length) { console.log(`  ${id}: no accepted edits, skipped`); continue }
  const mpath = path.join(MODULES_DIR, `${id}.json`)
  if (!fs.existsSync(mpath)) { fail(id, `no content/modules/${id}.json; export it first so the hash proof can hold`); continue }
  const m = JSON.parse(fs.readFileSync(mpath, 'utf8'))
  const sqlEdits = []
  for (const [k, e] of edits.entries()) {
    const tag = `edit ${k + 1} (slide ${e.slide} ${e.path})`
    const pos = Number(e.slide) - 1
    const slide = m.slides[pos]
    if (!slide) { fail(id, `${tag}: no slide ${e.slide}`); continue }
    if (typeof e.path !== 'string' || !e.path || typeof e.new !== 'string') { fail(id, `${tag}: path and new must be strings`); continue }
    const segs = e.path.split('/').map(s => (/^\d+$/.test(s) ? Number(s) : s))
    const cur = getAt(slide, segs)
    if (typeof cur !== 'string') { fail(id, `${tag}: the path does not reach a string (${typeof cur})`); continue }
    const identNow = ident(slide)               // as the server will see it at this point in the batch
    if (typeof e.ident === 'string' && e.ident !== identNow) { fail(id, `${tag}: ident ${JSON.stringify(e.ident)} is not the file's ${JSON.stringify(identNow)}`); continue }
    if (typeof e.expect === 'string' && cur !== e.expect) { fail(id, `${tag}: expect does not match the file. File has: ${JSON.stringify(cur.slice(0, 80))}…`); continue }
    if (typeof e.expect_start === 'string' && !cur.startsWith(e.expect_start)) { fail(id, `${tag}: expect_start ${JSON.stringify(e.expect_start)} is not how the file's text begins: ${JSON.stringify(cur.slice(0, 80))}…`); continue }
    if (typeof e.expect !== 'string' && typeof e.expect_start !== 'string' && typeof e.ident !== 'string') { fail(id, `${tag}: give ident, expect_start or expect so the edit proves it looked at the right text`); continue }
    if (!e.new.trim()) { fail(id, `${tag}: new is empty`); continue }
    if (e.new === cur) { fail(id, `${tag}: new equals the current text, nothing to do`); continue }
    const d = e.new.match(DASH)
    if (d) { fail(id, `${tag}: a dash in the new text at "…${e.new.slice(Math.max(0, d.index - 20), d.index + 20)}…"`); continue }
    e.expect = cur
    setAt(slide, segs, e.new)
    const prose = checkProse([{ key_stage: m.key_stage, module_id: id, slides: [slide] }])
    if (prose.fails.length) { fail(id, `${tag}: slide over its wall ceiling after the edit (${prose.fails[0].words} words, ceiling ${prose.fails[0].ceiling})`); continue }
    sqlEdits.push({ ...e, pos, ident: identNow, segs })
  }
  modules.push({ id, m, mpath, edits: sqlEdits })
}

// 4. the attestations, across the whole scheme, after every edit. Edited
// modules are read from memory, the rest from their files.
const editedIds = new Set(modules.map(x => x.id))
const textOf = {}
for (const f of fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.json'))) {
  const m = JSON.parse(fs.readFileSync(path.join(MODULES_DIR, f), 'utf8'))
  textOf[m.module_id] = lowerSlides(m)
}
for (const mod of modules) textOf[mod.id] = lowerSlides(mod.m)
const touched = probes.filter(p => p.modules.some(x => editedIds.has(x)))
for (const p of touched) {
  const known = m => textOf[m] !== undefined
  const carries = m => known(m) && textOf[m].includes(p.phrase.toLowerCase())
  if (p.mode === 'all') {
    for (const m of p.modules) if (known(m) && !carries(m)) fail(m, `after the edits the module no longer carries the computing phrase "${p.phrase}" (${p.id})`)
  } else if (!p.modules.some(carries)) {
    const unknown = p.modules.filter(m => !known(m))
    // A module with no file yet cannot be read here; the server side proof
    // still tests it. Only a phrase that none of the readable modules carries
    // and no unreadable module could carry is a failure now.
    if (unknown.length) console.log(`  note: "${p.phrase}" (${p.id}) is not in any exported module; ${unknown.join(', ')} not exported yet, so the server proof decides`)
    else fail(p.modules.filter(x => editedIds.has(x)).join(', '), `after the edits none of ${p.modules.join(', ')} carries the attested phrase "${p.phrase}" (${p.id})`)
  }
}

if (bad) { console.error(`\n${bad} problem(s). Nothing written.`); process.exit(1) }
if (!modules.length) { console.log('No accepted edits anywhere. Nothing to do.'); process.exit(0) }

// 5. the contract, on the post state, from a temp copy outside the repo so a
// failure writes nothing. Removed on exit, whichever way the run ends.
//
// A batch may not make the contract WORSE. It is not asked to make it right:
// eyfs-01 on production carries a seven minute passive stretch (rule 3) that
// no string edit can mend, and a batch of good rewrites should not be held
// hostage to a structural fault it did not cause. So the contract runs on the
// module as it is and on the module as it will be, and only a failure that
// is new is a failure here. Pre existing ones are printed so they are never
// quietly inherited.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-batch-'))
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
const contractFails = p => {
  try { execFileSync('node', [path.join(ROOT, 'scripts/check-module-contract.mjs'), p], { stdio: ['ignore', 'ignore', 'pipe'] }); return [] }
  catch (err) { return String(err.stderr || '').split('\n').filter(l => /^\s+FAIL /.test(l)).map(l => l.trim()) }
}
for (const mod of modules) {
  const before = contractFails(mod.mpath)
  const p = path.join(tmp, `${mod.id}.json`)
  fs.writeFileSync(p, JSON.stringify(mod.m, null, 2) + '\n')
  const after = contractFails(p)
  const fresh = after.filter(l => !before.includes(l))
  if (fresh.length) fail(mod.id, `the module contract fails on the post state with failures the current module does not have:\n       ${fresh.join('\n       ')}`)
  if (before.length) console.log(`  ${mod.id}: ${before.length} contract failure(s) already on production, unchanged by this batch:\n       ${before.join('\n       ')}`)
}

// 6. the sourced claims, on the post state, the same way.
//
// THIS WAS MISSING AND IT COST US. The attested phrase check above reads
// shared/schools-rshe-2026.ts and shared/schools-computing-pos.ts, which is two
// of the three places a phrase can be load bearing. The third is
// scripts/check-source-claims.mjs, the sentences pinned to a primary source,
// and nothing here looked at it. Migrations 326 to 336 went to production
// having lowercased "A computer reader IS allowed" and "A human reader is NOT
// allowed" on ks3-24 and "WORKS IN STEPS" on ks2-25, and CI caught it after the
// fact rather than this script catching it before.
//
// The edits themselves were right, E34 rules out capitals for emphasis for
// dyslexic readers and ks3-24 slide 12 is the slide written for that reader, so
// the three claims are now matched case insensitively there. But the generator
// should have raised it rather than CI, because by then it was live.
//
// It runs the real guard rather than a third copy of its claim list, against a
// temp content/modules tree holding the post state, because the guard reads
// several modules and cross checks the quiz twins between them. A copy of its
// data here would drift from it, which is the fault being fixed.
const claimFails = cwd => {
  try { execFileSync('node', [path.join(ROOT, 'scripts/check-source-claims.mjs')], { cwd, stdio: ['ignore', 'ignore', 'pipe'] }); return [] }
  catch (err) { return String(err.stderr || '').split('\n').filter(l => /^\s+FAIL /.test(l)).map(l => l.trim()) }
}
const claimDir = path.join(tmp, 'claims', 'content', 'modules')
fs.mkdirSync(claimDir, { recursive: true })
for (const f of fs.readdirSync(path.join(ROOT, 'content/modules'))) {
  if (f.endsWith('.json')) fs.copyFileSync(path.join(ROOT, 'content/modules', f), path.join(claimDir, f))
}
const claimsBefore = claimFails(path.join(tmp, 'claims'))
for (const mod of modules) fs.writeFileSync(path.join(claimDir, `${mod.id}.json`), JSON.stringify(mod.m, null, 2) + '\n')
const claimsFresh = claimFails(path.join(tmp, 'claims')).filter(l => !claimsBefore.includes(l))
if (claimsFresh.length) {
  fail('the batch', `it drops a sentence pinned to a primary source:\n       ${claimsFresh.join('\n       ')}\n       ` +
    'Either put the words back, or if the edit is right, correct the claim in scripts/check-source-claims.mjs and say why.')
}
if (claimsBefore.length) console.log(`  ${claimsBefore.length} source claim failure(s) already present, unchanged by this batch:\n       ${claimsBefore.join('\n       ')}`)

if (bad) { console.error(`\n${bad} problem(s). Nothing written.`); process.exit(1) }

// ── batches by size, whole modules, in teaching order ──────────────────
modules.sort((a, b) => a.m.sort_order - b.m.sort_order)
const OVERHEAD = 6500, PER_MODULE = 3600
const batches = []
for (const mod of modules) {
  const size = PER_MODULE + mod.edits.reduce((n, e) => n + e.expect.length + e.new.length + (e.problem || '').length + 260, 0)
  const last = batches[batches.length - 1]
  if (last && last.size + size <= MAX) { last.mods.push(mod); last.size += size }
  else batches.push({ mods: [mod], size: OVERHEAD + size })
}

const written = []
batches.forEach((b, i) => {
  const n = Number(firstNumber) + i
  const name = `${n}_${slug}_${i + 1}`
  const ids = b.mods.map(x => x.id)
  const edits = b.mods.flatMap(x => x.edits.map(e => ({ ...e, module: x.id })))
  const phr = probes.filter(p => p.modules.some(x => ids.includes(x)))
  const ledger = edits.map(e => `--   ${e.module} s${e.slide} ${e.path} [${e.check || '?'} ${e.severity || '?'}]: ${(e.problem || '').replace(/\s+/g, ' ')}`).join('\n')
  const sql = `-- ${n}: the lesson review, batch ${i + 1} of ${batches.length}: ${ids.join(', ')}
--
-- Generated by scripts/gen-review-batch.mjs from the verified findings in
-- ${path.relative(ROOT, dir)}. One reviewer and one verifier per lesson against
-- scripts/lesson-rubric.md; only edits the verifier accepted are here, and
-- every one was checked on the module JSON before this file was written:
-- exact current text, no dashes, inside the wall ceiling, every attested
-- phrase kept, the module contract no worse. The same checks run again below,
-- on the server, and any miss aborts the whole batch.
--
-- THE EDITS (${edits.length})
${ledger}

begin;

create table schools.school_lessons_backup_${n} as select * from schools.school_lessons;
alter table schools.school_lessons_backup_${n} enable row level security;

create temp table miss(module text, target text);

-- One string on one slide, proven by the slide's type and heading and by its
-- exact current text. Anything else is a miss, and a miss aborts everything.
create or replace function schools.review_set_${n}(p_module text, p_pos int, p_ident text, p_path text[], p_expect text, p_new text)
returns void language plpgsql as $$
declare cur text; have text;
begin
  select (l.slides->p_pos->>'type') || ':' || coalesce(l.slides->p_pos->>'heading', l.slides->p_pos->>'title', l.slides->p_pos->>'question', l.slides->p_pos->>'prompt', l.slides->p_pos->>'component', '')
    into have from schools.school_lessons l where l.module_id = p_module;
  if have is distinct from p_ident then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is ' || coalesce(have, 'absent') || ', expected ' || p_ident); return; end if;
  select l.slides #>> (array[p_pos::text] || p_path) into cur from schools.school_lessons l where l.module_id = p_module;
  if cur is null or cur <> p_expect then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || array_to_string(p_path, '/') || ' is not the expected text'); return; end if;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text] || p_path, to_jsonb(p_new)) where l.module_id = p_module;
end $$;

${edits.map(e => `-- ${e.module} s${e.slide} ${e.path} [${e.check || '?'}]
select schools.review_set_${n}(${q(e.module)}, ${e.pos}, ${q(e.ident)}, array[${e.segs.map(s => q(String(s))).join(',')}]::text[],
  ${q(e.expect)},
  ${q(e.new)});`).join('\n\n')}

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: nothing on the wall is over its ceiling ───────────────────
-- The same rule the council runs (scripts/council-checks.mjs).
do $$
declare cnt int; list text;
begin
  with s as (
    select l.module_id, l.key_stage, e.ord as sn, e.slide
    from schools.school_lessons l, jsonb_array_elements(l.slides) with ordinality e(slide, ord)
  ), prose as (
    select module_id, key_stage, sn,
      case slide->>'type'
        when 'title' then concat_ws(' ', slide->>'title', slide->>'body')
        when 'concept' then concat_ws(' ', slide->>'heading', slide->>'body')
        when 'tryit' then concat_ws(' ', slide->>'heading', slide->>'body')
        when 'recap' then slide->>'heading'
        when 'keywords' then slide->>'heading'
        when 'digi' then slide->>'heading'
        when 'diagram' then concat_ws(' ', slide->>'heading', slide->>'caption')
        else null end as text
    from s
  ), over as (
    select module_id, sn, array_length(regexp_split_to_array(btrim(text), '\\s+'), 1) as words
    from prose where text is not null
      and array_length(regexp_split_to_array(btrim(text), '\\s+'), 1) > case key_stage when 'EYFS' then 12 when 'KS1' then 12 else 105 end
  )
  select count(*), string_agg(module_id || ' s' || sn || ' (' || words || ')', '; ') into cnt, list from over;
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % slide(s) still over the wall ceiling: %', cnt, list; end if;
end $$;

-- ── the proof: every attested phrase the batch's modules are named on still holds ──
-- ${phr.length} phrase checks (shared/schools-rshe-2026.ts, mode any: at least one of
-- the requirement's modules carries it; shared/schools-computing-pos.ts, mode all:
-- every named module carries it), the same lower(text) test the two guards run.
do $$
declare cnt int; list text;
begin
  with probe(rid, phrase, mods, mode) as (values
${phr.map(p => `    (${q(p.id)}, ${q(p.phrase)}, array[${p.modules.map(q).join(',')}]::text[], ${q(p.mode)})`).join(',\n')}
  ), sl as (select l.module_id, lower(l.slides::text) as txt from schools.school_lessons l),
  per as (select p.rid, p.phrase, p.mode, m as module_id, coalesce(position(lower(p.phrase) in sl.txt) > 0, false) as hit
    from probe p, unnest(p.mods) m left join sl on sl.module_id = m),
  bad as (
    select rid, phrase, module_id from per where mode = 'all' and not hit
    union all
    select rid, phrase, null::text from per where mode = 'any' group by rid, phrase having not bool_or(hit))
  select count(*), string_agg(rid || ': ' || phrase || coalesce(' in ' || module_id, ''), '; ') into cnt, list from bad;
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % attested phrase(s) lost: %', cnt, list; end if;
end $$;

${b.mods.map(x => `-- ── the proof: ${x.id} equals content/modules/${x.id}.json ──\n` +
  execFileSync('node', [path.join(ROOT, 'scripts/module-string-hash.mjs'), path.join(tmp, `${x.id}.json`), '--assert', name], { encoding: 'utf8' }).trim()).join('\n\n')}

commit;
`
  const out = path.join(ROOT, 'supabase/migrations', `${name}.sql`)
  written.push({ out, sql, ids, edits: edits.length })
})

for (const w of written) console.log(`${path.relative(ROOT, w.out)}: ${w.ids.length} module(s), ${w.edits} edit(s), ${w.sql.length} chars${w.sql.length > MAX + 4000 ? ' (OVER the carry size, split the findings)' : ''}`)
if (DRY) { console.log('\n--dry: nothing written.'); process.exit(0) }
for (const w of written) fs.writeFileSync(w.out, w.sql)
for (const mod of modules) fs.writeFileSync(mod.mpath, JSON.stringify(mod.m, null, 2) + '\n')
console.log(`\nWrote ${written.length} migration(s) and updated ${modules.length} module file(s) in content/modules.`)
