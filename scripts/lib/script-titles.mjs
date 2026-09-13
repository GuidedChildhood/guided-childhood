// Every script title seeded into public.scripts, read from the migrations.
//
// The scripts table is the product's voice and it lives in the database, so
// a guard that wants to know whether "The two minute warning is making it
// worse" is a real row cannot ask the app. It can ask the migrations, which
// are the only way a row gets there. This tokenises the SQL string literals
// after each insert into scripts (single quoted with '' escapes, and dollar
// quoted $tag$...$tag$) and takes the title from its column position.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function literals(sql) {
  const out = []
  let i = 0
  while (i < sql.length) {
    const c = sql[i]
    if (c === "'") {
      let j = i + 1, s = ''
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j + 1] === "'") { s += "'"; j += 2; continue }
        if (sql[j] === "'") break
        s += sql[j]; j++
      }
      out.push({ at: i, text: s }); i = j + 1; continue
    }
    if (c === '$') {
      const m = /^\$([A-Za-z_]*)\$/.exec(sql.slice(i, i + 40))
      if (m) {
        const tag = m[0]
        const end = sql.indexOf(tag, i + tag.length)
        if (end > 0) { out.push({ at: i, text: sql.slice(i + tag.length, end) }); i = end + tag.length; continue }
      }
    }
    if (c === '-' && sql[i + 1] === '-') { const e = sql.indexOf('\n', i); i = e < 0 ? sql.length : e + 1; continue }
    i++
  }
  return out
}

/** @returns {{ title: string, category: string, stage: string, file: string }[]} */
export function scriptTitles(dirs = ['supabase/migrations', 'supabase/seeds']) {
  const rows = []
  const files = dirs.flatMap(dir => readdirSync(dir).filter(f => f.endsWith('.sql')).sort().map(f => join(dir, f)))
  for (const f of files) {
    const sql = readFileSync(f, 'utf8')
    const re = /insert\s+into\s+(?:public\.)?scripts\s*\(([^)]*)\)/gi
    let m
    while ((m = re.exec(sql))) {
      const cols = m[1].split(',').map(s => s.trim().toLowerCase())
      const ti = cols.indexOf('title'), ci = cols.indexOf('category'), si = cols.indexOf('stage_id')
      if (ti < 0) continue
      const end = sql.indexOf(';', m.index)
      const chunk = sql.slice(m.index + m[0].length, end < 0 ? sql.length : end)
      const lits = literals(chunk)
      // Scan for the (stage, category, title) run rather than stepping by
      // column count: is_free, sort_order and now() are not literals, so a
      // tuple holds fewer literals than columns and a fixed stride drifts.
      const stages = new Set(['foundation', 'builder', 'explorer', 'shaper', 'independent'])
      const off = { s: si, c: ci, t: ti }
      const base = Math.min(...[off.s, off.c, off.t].filter(n => n >= 0))
      for (let k = 0; k < lits.length; k++) {
        const at = n => (n >= 0 ? lits[k + (n - base)]?.text : undefined)
        const stage = at(off.s), category = at(off.c), title = at(off.t)
        if (off.s >= 0 && !stages.has(stage ?? '')) continue
        if (off.c >= 0 && !/^[a-z][a-z-]*$/.test(category ?? '')) continue
        if (!title || title.length < 4 || title.length > 140) continue
        rows.push({ title, category: category ?? '', stage: stage ?? '', file: f })
        k += 2
      }
    }
  }
  return rows
}
