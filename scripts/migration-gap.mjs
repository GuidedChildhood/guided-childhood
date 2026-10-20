#!/usr/bin/env node
// The migration gap check: is everything on main also in the live database?
//
// Justin, 13 October 2026: migration 360 (give five, get five) merged on the
// 4th and was never run. Thirteen files of app code read referral_codes and
// referrals, neither table existed, and nothing noticed for nine days because
// checkout wraps the lookup in a catch and replies 200. The daily health sweep
// checked sixteen hand listed columns (lib/ops/health.ts REQUIRED_COLUMNS) and
// the heartbeats, and neither can see a table nobody listed.
//
// This reads the migration files on main, works out what each one creates that
// should still exist today (tables, columns added to a table, functions), and
// writes ONE read only select that asks the live database whether each is
// there. The sweep runs that select through its Supabase connector and hands
// the rows back to `report`, which names every migration with something
// missing. This script never connects to anything and never writes.
//
//   node scripts/migration-gap.mjs probe  [--ref origin/main] [--since 360 | --all] [--dir <folder>]
//        prints the select to run
//   node scripts/migration-gap.mjs report --rows <rows.json> [--ref origin/main] [--since 360 | --all] [--dir <folder>]
//        reads the rows the select returned; exit 0 clean, 1 gap, 2 unknown
//
// What it cannot see, and says so in its output rather than staying quiet:
//   - A migration that only inserts or updates rows (content, scripts, grants,
//     policies, indexes) creates no object to look for. 373's content half is
//     the live example. Those are listed as "not checkable" so a human knows
//     what the green result does not cover.
//   - An object a later migration dropped or renamed is followed through the
//     files in order, so it is not asked for. A statement guarded by a
//     condition is treated as if it ran; a flag on one of those is a reason to
//     read the file, not proof of a gap.
//
// No dependencies.

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
/** How many of the newest migration numbers a default run covers. */
export const DEFAULT_WINDOW = 40

// ── reading the files ────────────────────────────────────────────────────────

/** [{ file, number, sql }] in the order they were meant to run. */
export function readMigrations({ ref = 'origin/main', dir } = {}) {
  let files
  const read = {}
  if (dir) {
    files = readdirSync(dir).filter(f => f.endsWith('.sql'))
    for (const f of files) read[f] = readFileSync(join(dir, f), 'utf8')
  } else {
    const listing = execFileSync('git', ['ls-tree', '--name-only', ref, 'supabase/migrations/'], { cwd: ROOT, encoding: 'utf8' })
    files = listing.split('\n').filter(l => l.endsWith('.sql')).map(l => l.split('/').pop())
    for (const f of files) {
      read[f] = execFileSync('git', ['show', `${ref}:supabase/migrations/${f}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    }
  }
  return files
    .map(file => ({ file, number: Number.parseInt(file, 10), sql: read[file] }))
    .filter(m => Number.isInteger(m.number))
    .sort((a, b) => a.number - b.number || a.file.localeCompare(b.file))
}

// ── working out what each migration leaves behind ────────────────────────────

/** Comments out, so a sentence in a header never reads as a statement. */
function stripComments(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/--[^\n]*/g, ' ')
}

const ident = raw => String(raw).replace(/"/g, '').toLowerCase()
/** public.table, whatever the file wrote. */
function qualified(raw) {
  const parts = ident(raw).split('.')
  return parts.length === 1 ? `public.${parts[0]}` : parts.slice(-2).join('.')
}

/**
 * Follow every file in order. Returns the objects that should exist at the
 * end: Map of key -> { kind, object, file }, where file is the migration that
 * (last) made it. Keys: table `t:schema.name`, column `c:schema.name.col`,
 * function `f:schema.name`.
 */
export function liveObjects(migrations) {
  const live = new Map()
  const dropTable = name => {
    live.delete(`t:${name}`)
    for (const k of [...live.keys()]) if (k.startsWith(`c:${name}.`)) live.delete(k)
  }
  for (const m of migrations) {
    const sql = stripComments(m.sql)
    const events = []
    const push = (re, fn) => { for (const x of sql.matchAll(re)) events.push({ at: x.index, run: () => fn(x) }) }

    push(/\bcreate\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?([\w."]+)/gi, x => {
      const name = qualified(x[1])
      // A backup snapshot is proof its migration ran, but housekeeping may drop
      // it on purpose, so a missing one is reported softly (see report()).
      if (!live.has(`t:${name}`)) live.set(`t:${name}`, { kind: 'table', object: name, file: m.file, soft: /backup/.test(name) })
    })
    push(/\balter\s+table\s+(?:if\s+exists\s+)?(?:only\s+)?([\w."]+)\s+([^;]*);/gi, x => {
      const name = qualified(x[1]), body = x[2]
      for (const a of body.matchAll(/\badd\s+column\s+(?:if\s+not\s+exists\s+)?([\w"]+)/gi)) {
        const k = `c:${name}.${ident(a[1])}`
        if (!live.has(k)) live.set(k, { kind: 'column', object: `${name}.${ident(a[1])}`, file: m.file })
      }
      for (const d of body.matchAll(/\bdrop\s+column\s+(?:if\s+exists\s+)?([\w"]+)/gi)) live.delete(`c:${name}.${ident(d[1])}`)
      for (const r of body.matchAll(/\brename\s+column\s+([\w"]+)\s+to\s+([\w"]+)/gi)) {
        const from = `c:${name}.${ident(r[1])}`, was = live.get(from)
        live.delete(from)
        if (was) live.set(`c:${name}.${ident(r[2])}`, { ...was, object: `${name}.${ident(r[2])}` })
      }
      const t = body.match(/^\s*rename\s+to\s+([\w"]+)/i)
      if (t) {
        const to = qualified(t[1]), was = live.get(`t:${name}`)
        for (const [k, v] of [...live.entries()]) {
          if (k.startsWith(`c:${name}.`)) { live.delete(k); live.set(`c:${to}.${k.split('.').pop()}`, { ...v, object: `${to}.${k.split('.').pop()}` }) }
        }
        live.delete(`t:${name}`)
        if (was) live.set(`t:${to}`, { ...was, object: to })
      }
    })
    push(/\bdrop\s+table\s+(?:if\s+exists\s+)?([\w."]+(?:\s*,\s*[\w."]+)*)/gi, x => {
      for (const n of x[1].split(',')) dropTable(qualified(n.trim()))
    })
    push(/\bcreate\s+(?:or\s+replace\s+)?function\s+([\w."]+)\s*\(/gi, x => {
      const name = qualified(x[1])
      live.set(`f:${name}`, { kind: 'function', object: name, file: m.file })
    })
    push(/\bdrop\s+function\s+(?:if\s+exists\s+)?([\w."]+)/gi, x => live.delete(`f:${qualified(x[1])}`))

    events.sort((a, b) => a.at - b.at).forEach(e => e.run())
  }
  return live
}

/** The objects to ask about, and the migrations in the window that leave none. */
export function plan(migrations, { since, all = false } = {}) {
  const top = migrations.length ? migrations[migrations.length - 1].number : 0
  const from = all ? 0 : Number.isInteger(since) ? since : top - DEFAULT_WINDOW + 1
  const inWindow = migrations.filter(m => m.number >= from)
  const wanted = [...liveObjects(migrations).values()].filter(o => Number.parseInt(o.file, 10) >= from)
  const covered = new Set(wanted.map(o => o.file))
  const notCheckable = inWindow.filter(m => !covered.has(m.file)).map(m => m.file)
  return { from, top, inWindow: inWindow.length, wanted, notCheckable }
}

// ── the select ───────────────────────────────────────────────────────────────

const q = s => `'${String(s).replace(/'/g, "''")}'`

/** One read only select: a row per object with whether it exists. */
export function probeSql(wanted) {
  const rows = wanted.map(o => `(${q(o.file)}, ${q(o.kind)}, ${q(o.object)})`).join(',\n  ')
  return `-- Read only. Asks whether what each migration on main creates exists in the database.
with wanted(file, kind, object) as (values
  ${rows || `('none', 'table', 'public.none')`}
)
select file, kind, object,
  case kind
    when 'table' then exists (select 1 from information_schema.tables t
                               where t.table_schema || '.' || t.table_name = object)
    when 'column' then exists (select 1 from information_schema.columns c
                                where c.table_schema || '.' || c.table_name || '.' || c.column_name = object)
    else exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                  where n.nspname || '.' || p.proname = object)
  end as present
from wanted
order by file, kind, object;
`
}

// ── reading the answer ───────────────────────────────────────────────────────

/** Rows from whatever shape the connector wrapped them in, or null. */
function rowsOf(parsed) {
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') {
    for (const key of ['rows', 'result', 'data']) if (Array.isArray(parsed[key])) return parsed[key]
  }
  return null
}

/**
 * Compare the rows with what was asked. Never reports clean unless every
 * object asked about came back: a missing row is unknown, not present.
 * Returns { status: 'clean' | 'gap' | 'unknown', lines }.
 */
export function report(planned, rows) {
  const { wanted, notCheckable, from, top, inWindow } = planned
  const scope = `migrations ${from} to ${top} on main (${inWindow} files)`
  if (!rows || rows.length === 0) {
    return { status: 'unknown', lines: [`Migration gap: unknown. The probe returned no rows for ${scope}, so nothing was checked.`] }
  }
  const got = new Map(rows.map(r => [`${r.kind}:${r.object}`, r.present === true || r.present === 't' || r.present === 'true']))
  const unanswered = wanted.filter(o => !got.has(`${o.kind}:${o.object}`))
  const absent = wanted.filter(o => got.get(`${o.kind}:${o.object}`) === false)
  const missing = absent.filter(o => !o.soft)
  const snapshots = absent.filter(o => o.soft)
  const lines = []
  if (unanswered.length) {
    lines.push(`Migration gap: unknown for ${unanswered.length} of ${wanted.length} objects the probe asked about (no row came back). Not treated as present.`)
  }
  if (missing.length) {
    const byFile = new Map()
    for (const o of missing) byFile.set(o.file, [...(byFile.get(o.file) || []), `${o.kind} ${o.object}`])
    lines.push(`Migration gap: ${byFile.size} migration${byFile.size === 1 ? '' : 's'} on main with something missing from the live database (${scope}).`)
    for (const [file, objs] of byFile) lines.push(`  ${file} is not fully applied: missing ${objs.join(', ')}`)
    lines.push('A guarded statement can read as missing when it chose not to run, so read the file before applying. If it really is unapplied, this is the highest priority finding of the day.')
  }
  if (snapshots.length) {
    lines.push(`Backup snapshots absent (dropped on purpose, or the migration's content half never ran; only worth a look if nobody dropped them): ${snapshots.map(o => `${o.object} from ${o.file}`).join(', ')}.`)
  }
  if (!missing.length && !unanswered.length) {
    lines.push(`Migration gap: none. All ${wanted.length} tables, columns and functions created by ${scope} exist in the live database.`)
  }
  if (notCheckable.length) {
    lines.push(`Not checkable by this probe (they create no table, column or function): ${notCheckable.join(', ')}. Their rows, policies and indexes were not looked at.`)
  }
  return { status: missing.length ? 'gap' : unanswered.length ? 'unknown' : 'clean', lines }
}

// ── command line ─────────────────────────────────────────────────────────────

function flags(args) {
  const out = {}
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) continue
    const next = args[i + 1]
    if (next === undefined || next.startsWith('--')) out[args[i].slice(2)] = true
    else { out[args[i].slice(2)] = next; i++ }
  }
  return out
}

export function main(argv) {
  const [cmd, ...rest] = argv
  const f = flags(rest)
  if (cmd !== 'probe' && cmd !== 'report') {
    console.log('usage: node scripts/migration-gap.mjs probe|report [--ref origin/main] [--since N | --all] [--dir <folder>] [--rows <rows.json>]')
    return cmd ? 1 : 0
  }
  const migrations = readMigrations({ ref: typeof f.ref === 'string' ? f.ref : 'origin/main', dir: typeof f.dir === 'string' ? f.dir : undefined })
  const planned = plan(migrations, { since: f.since ? Number.parseInt(f.since, 10) : undefined, all: f.all === true })
  if (cmd === 'probe') {
    console.log(probeSql(planned.wanted))
    return 0
  }
  let rows = null
  try { rows = rowsOf(JSON.parse(readFileSync(String(f.rows), 'utf8'))) } catch { rows = null }
  const out = report(planned, rows)
  console.log(out.lines.join('\n'))
  return out.status === 'clean' ? 0 : out.status === 'gap' ? 1 : 2
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (err) {
    console.error(`Migration gap: unknown (${err.message})`)
    process.exitCode = 2
  }
}
