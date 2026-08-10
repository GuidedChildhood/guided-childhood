// Build a snapshot of the scripts library from the migrations.
//
// The library lives in the database (non-negotiable 6), and the migrations are
// what put it there, so parsing them gives the same titles, situations and
// categories without needing a live connection. That matters because the
// matcher test has to run in CI and on a laptop, and neither has the service
// key.
//
// Usage: node scripts/snapshot-scripts.mjs
// Writes scripts/fixtures/scripts-snapshot.json.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const migrations = join(here, '..', 'supabase', 'migrations')

/** Split one VALUES tuple into its fields, respecting '' inside strings. */
function splitFields(tuple) {
  const out = []
  let cur = '', inStr = false, depth = 0
  for (let i = 0; i < tuple.length; i++) {
    const ch = tuple[i]
    if (inStr) {
      if (ch === "'") {
        if (tuple[i + 1] === "'") { cur += "'"; i++; continue }
        inStr = false; continue
      }
      cur += ch
      continue
    }
    if (ch === "'") { inStr = true; continue }
    if (ch === '(') { depth++; cur += ch; continue }
    if (ch === ')') { depth--; cur += ch; continue }
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  out.push(cur.trim())
  return out
}

/** Walk the VALUES block, returning each top level tuple's raw text. */
function tuples(body) {
  const out = []
  let depth = 0, cur = '', inStr = false
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (inStr) {
      cur += ch
      if (ch === "'") {
        if (body[i + 1] === "'") { cur += "'"; i++; continue }
        inStr = false
      }
      continue
    }
    if (ch === "'") { inStr = true; cur += ch; continue }
    if (ch === '(') { depth++; if (depth === 1) { cur = ''; continue } }
    if (ch === ')') { depth--; if (depth === 0) { out.push(cur); cur = ''; continue } }
    if (ch === ';' && depth === 0) break
    if (depth >= 1) cur += ch
  }
  return out
}

const byOrder = new Map()

for (const file of readdirSync(migrations).filter(f => f.endsWith('.sql')).sort()) {
  const sql = readFileSync(join(migrations, file), 'utf8')
  // Two shapes are in use. The batch inserts use VALUES with many tuples; the
  // guarded ones use "select ... where not exists", one row per statement, so
  // re running a migration cannot duplicate a script. Both have to be read or
  // the snapshot silently under counts, which would make the matcher look
  // better than it is by shrinking the library it is scored against.
  const re = /insert\s+into\s+(?:public\.)?scripts\s*\(([^)]*)\)\s*(values|select)/gi
  let m
  while ((m = re.exec(sql)) !== null) {
    const cols = m[1].replace(/\s+/g, ' ').split(',').map(c => c.trim())
    const iTitle = cols.indexOf('title')
    const iSit = cols.indexOf('situation')
    const iCat = cols.indexOf('category')
    const iSort = cols.indexOf('sort_order')
    if (iTitle < 0 || iSit < 0 || iCat < 0 || iSort < 0) continue

    const rest = sql.slice(m.index + m[0].length)
    const isSelect = m[2].toLowerCase() === 'select'
    // The select form's row ends at "where not exists" or the semicolon.
    const found = isSelect
      ? [rest.slice(0, (() => {
          const w = rest.search(/\bwhere\s+not\s+exists\b/i)
          const semi = rest.indexOf(';')
          const ends = [w, semi].filter(n => n >= 0)
          return ends.length ? Math.min(...ends) : rest.length
        })())]
      : tuples(rest)

    for (const t of found) {
      const f = splitFields(t)
      if (f.length < cols.length) continue
      const sort_order = Number(f[iSort])
      if (!Number.isFinite(sort_order)) continue
      // Later migrations win, the same way the database ends up.
      byOrder.set(sort_order, {
        sort_order,
        title: f[iTitle],
        situation: f[iSit],
        category: f[iCat],
      })
    }
  }
}

const rows = [...byOrder.values()].sort((a, b) => a.sort_order - b.sort_order)
mkdirSync(join(here, 'fixtures'), { recursive: true })
writeFileSync(join(here, 'fixtures', 'scripts-snapshot.json'), JSON.stringify(rows, null, 2) + '\n')
console.log(`${rows.length} scripts written to scripts/fixtures/scripts-snapshot.json`)
