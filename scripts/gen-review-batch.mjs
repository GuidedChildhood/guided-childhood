#!/usr/bin/env node
// VERIFIED REVIEW FINDINGS, TURNED INTO GUARDED MIGRATIONS. NEVER BY HAND.
//
// The lesson review (plans/week-of-2026-09-21-best-lessons-plan.md, step 6)
// runs one reviewer and one verifier per lesson against scripts/lesson-rubric.md
// and leaves, per module, a file of accepted edits: one slide, one string
// field, the exact text that is there now, the exact text that should be. This
// script is the only road from those files to production, and it refuses to
// build a batch that any instrument would reject.
//
// WHAT ONE EDIT IS
//   { "slide": 7, "path": "options/1/feedback", "check": "R14", "severity": "must",
//     "problem": "why", "expect": "the exact current text", "new": "the exact new text" }
//   slide is the 1 based position on the wall. path is a slash path inside the
//   slide to ONE string leaf (body, heading, script, options/1/text, steps/2/text,
//   config/prompt, points/0, lines/1, words/2/meaning). Structure never changes
//   here: no slide is added, moved or removed, no key is created.
//
// WHAT IS CHECKED BEFORE A LINE OF SQL IS WRITTEN, on the local module JSON
//   1. the path resolves to a string and it equals `expect`, character for character
//   2. `new` is not empty and carries no dash (the module contract's own rule 5)
//   3. after every edit the slide is inside its wall ceiling (the council's own rule)
//   4. after every edit the module still carries every phrase the RSHE and the
//      computing attestations hold it to (the same lower(text) test the SQL runs)
//   5. the module still passes scripts/check-module-contract.mjs
//
// WHAT THE SQL GUARDS AGAIN, on the server, inside one transaction
//   a backup table; every write checks the slide's type and heading and the
//   exact current text and records a miss rather than writing; any miss aborts
//   the whole batch; then the prose ceiling proof, the attestation proof for
//   the batch's phrases, and the string hash proof that every module in the
//   batch now equals its file in content/modules. The migration file is the
//   record: its header lists every edit and why.
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
const unq = s => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’')
const rsheSrc = fs.readFileSync(path.join(ROOT, 'shared/schools-rshe-2026.ts'), 'utf8')
const compSrc = fs.readFileSync(path.join(ROOT, 'shared/schools-computing-pos.ts'), 'utf8')
const probes = [] // { id, phrase, modules }
for (const b of rsheSrc.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  const evs = [...(b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => unq(m[1]))
  if (mods.length && evs.length) for (const phrase of evs) probes.push({ id, phrase, modules: mods })
}
for (const b of compSrc.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  for (const p of b.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)) {
    probes.push({ id, phrase: unq(p[1]), modules: [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1]) })
  }
}

// ── the instruments, the same ones the contract and the council run ───────
const DASH = /[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i
const ident = s => `${s.type}:${s.heading ?? s.title ?? s.question ?? s.prompt ?? s.component ?? ''}`
const getAt = (obj, segs) => segs.reduce((o, k) => (o == null ? undefined : o[k]), obj)
const setAt = (obj, segs, v) => { const last = segs[segs.length - 1]; const parent = getAt(obj, segs.slice(0, -1)); parent[last] = v }
const q = s => `'${String(s).replace(/'/g, "''")}'`

// ── read every module's accepted edits ────────────────────────────────────
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
const modules = [] // { id, file, m, edits, problems }
let bad = 0
const fail = (mod, msg) => { bad++; console.error(`  FAIL ${mod}: ${msg}`) }

for (const f of files) {
  const fx = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const id = fx.module_id
  const edits = (fx.edits || []).filter(e => e && e.accept !== false)
  if (!id) { fail(f, 'no module_id'); continue }
  if (!edits.length) { console.log(`  ${id}: no accepted edits, skipped`); continue }
  const mpath = path.join(ROOT, 'content/modules', `${id}.json`)
  if (!fs.existsSync(mpath)) { fail(id, `no content/modules/${id}.json; export it first so the hash proof can hold`); continue }
  const m = JSON.parse(fs.readFileSync(mpath, 'utf8'))
  const mine = probes.filter(p => p.modules.includes(id))
  const sqlEdits = []
  for (const [k, e] of edits.entries()) {
    const tag = `edit ${k + 1} (slide ${e.slide} ${e.path})`
    const pos = Number(e.slide) - 1
    const slide = m.slides[pos]
    if (!slide) { fail(id, `${tag}: no slide ${e.slide}`); continue }
    if (typeof e.path !== 'string' || !e.path || typeof e.expect !== 'string' || typeof e.new !== 'string') { fail(id, `${tag}: path, expect and new must be strings`); continue }
    const segs = e.path.split('/').map(s => (/^\d+$/.test(s) ? Number(s) : s))
    const cur = getAt(slide, segs)
    if (typeof cur !== 'string') { fail(id, `${tag}: the path does not reach a string (${typeof cur})`); continue }
    if (cur !== e.expect) { fail(id, `${tag}: expect does not match the file. File has: ${JSON.stringify(cur.slice(0, 80))}…`); continue }
    if (!e.new.trim()) { fail(id, `${tag}: new is empty`); continue }
    if (e.new === e.expect) { fail(id, `${tag}: new equals expect, nothing to do`); continue }
    const d = e.new.match(DASH)
    if (d) { fail(id, `${tag}: a dash in the new text at "…${e.new.slice(Math.max(0, d.index - 20), d.index + 20)}…"`); continue }
    const identNow = ident(slide)               // as the server will see it at this point in the batch
    setAt(slide, segs, e.new)
    const prose = checkProse([{ key_stage: m.key_stage, module_id: id, slides: [slide] }])
    if (prose.fails.length) { fail(id, `${tag}: slide over its wall ceiling after the edit (${prose.fails[0].words} words, ceiling ${prose.fails[0].ceiling})`); continue }
    sqlEdits.push({ ...e, pos, ident: identNow, segs })
  }
  // 4. the attestations, module level, after every edit
  const txt = JSON.stringify(m.slides).toLowerCase()
  for (const p of mine) if (!txt.includes(p.phrase.toLowerCase())) fail(id, `after the edits the module no longer carries the attested phrase "${p.phrase}" (${p.id})`)
  modules.push({ id, m, mpath, edits: sqlEdits, mine })
}

if (bad) { console.error(`\n${bad} problem(s). Nothing written.`); process.exit(1) }
if (!modules.length) { console.log('No accepted edits anywhere. Nothing to do.'); process.exit(0) }

// 5. the contract, on the post state, from a temp copy outside the repo so a
// failure writes nothing. Removed on exit, whichever way the run ends.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-batch-'))
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
{
  for (const mod of modules) {
    const p = path.join(tmp, `${mod.id}.json`)
    fs.writeFileSync(p, JSON.stringify(mod.m, null, 2) + '\n')
    try { execFileSync('node', [path.join(ROOT, 'scripts/check-module-contract.mjs'), p], { stdio: ['ignore', 'ignore', 'pipe'] }) }
    catch (err) { fail(mod.id, `the module contract fails on the post state:\n${String(err.stderr || '').trim()}`) }
  }
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
-- phrase kept, the module contract. The same checks run again below, on the
-- server, and any miss aborts the whole batch.
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

-- ── the proof: every attested phrase this batch's modules are held to is still there ──
-- ${phr.length} phrase checks (shared/schools-rshe-2026.ts and shared/schools-computing-pos.ts),
-- the same lower(text) test the two coverage guards run on production.
do $$
declare cnt int; list text;
begin
  with probe(rid, phrase, mods) as (values
${phr.map(p => `    (${q(p.id)}, ${q(p.phrase)}, array[${p.modules.map(q).join(',')}])`).join(',\n')}
  ), sl as (select l.module_id, lower(l.slides::text) as txt from schools.school_lessons l where l.module_id in (${ids.map(q).join(', ')})),
  res as (select p.rid, p.phrase, count(sl.module_id) as hits
    from probe p left join sl on sl.module_id = any(p.mods) and position(lower(p.phrase) in sl.txt) > 0
    where p.mods && array[${ids.map(q).join(', ')}]::text[]
    group by p.rid, p.phrase)
  select count(*), string_agg(rid || ': ' || phrase, '; ') into cnt, list from res where hits = 0;
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
}
