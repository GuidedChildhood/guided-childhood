#!/usr/bin/env node
// SYNC THE FRENCH SCHEME FROM ITS AUTHOR'S SITE (9 November 2026).
//
// The KS2 French lessons are written and kept on their own site while the
// author builds them. This brings the content across in one command, so the
// languages tab is generated from her data rather than retyped, and never
// drifts from it:
//
//   node scripts/languages/sync-french.mjs            fetch and write
//   node scripts/languages/sync-french.mjs --check    fail if the file is stale
//
// SAFE BY CONSTRUCTION. The site's data files are JavaScript object literals
// (window.UNITS = { ... }). This never runs them: a small tokenizer strips
// comments, quotes bare keys and drops trailing commas, then JSON.parse does
// the rest. Anything that is not plain data (a function, a template string)
// makes the parse fail loudly rather than execute.
//
// WHAT IS DROPPED. The contact form key and the links to drafting artifacts are
// operational, not content. The author is never named anywhere in the output
// (she is the pilot teacher, AMBER privacy, plans/2026-10-09-languages-plan.md).
//
// THE HOUSE RULE ON DASHES applies to her English copy too: a range such as
// 1–10 becomes "1 to 10", any other dash becomes a comma. French text has no
// dashes in it to lose; hyphenated French words (est-ce que) use a hyphen,
// which is left alone.
//
// Writes schools/lib/languages/fr.json. The media (decks, songs, sheets) stays
// on the author's host for now; see schools/lib/languages/french.ts.

import { readFileSync, writeFileSync } from 'node:fs'

const ORIGIN = 'https://french-curriculum.pages.dev'
const FILES = ['units', 'curriculum', 'codes', 'sequence']
const OUT = 'schools/lib/languages/fr.json'
const DROP = new Set(['formKey', 'appUrl', 'author'])

/** A JavaScript object literal to JSON text, without evaluating it. */
function literalToJson(src) {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    if (c === '"' || c === "'") {
      // A string: copy it through as a JSON string.
      const q = c
      let s = ''
      i++
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') { s += src[i] + src[i + 1]; i += 2; continue }
        if (q === "'" && src[i] === '"') { s += '\\"'; i++; continue }
        s += src[i++]
      }
      i++
      out += '"' + (q === "'" ? s.replace(/\\'/g, "'") : s) + '"'
      continue
    }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 2; continue }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue }
    if (c === '`') throw new Error('template string in data file; refusing to parse')
    if (/[A-Za-z_$]/.test(c)) {
      let w = ''
      while (i < n && /[\w$]/.test(src[i])) w += src[i++]
      let j = i
      while (j < n && /\s/.test(src[j])) j++
      if (src[j] === ':') { out += JSON.stringify(w); continue }
      if (w === 'true' || w === 'false' || w === 'null') { out += w; continue }
      throw new Error(`unexpected identifier "${w}" in data file; refusing to parse`)
    }
    out += c
    i++
  }
  return out.replace(/,(\s*[}\]])/g, '$1')
}

/** Every window.NAME = value; in one file. */
function globalsOf(src) {
  const parts = src.split(/^\s*window\.([A-Z]+)\s*=\s*/m).slice(1)
  const out = {}
  for (let k = 0; k < parts.length; k += 2) {
    // Comments go first, so a trailing comment cannot hide the closing ;.
    const body = literalToJson(parts[k + 1]).trim().replace(/;\s*$/, '')
    out[parts[k]] = JSON.parse(body)
  }
  return out
}

function undash(s) {
  return s
    .replace(/(\d)\s*[–—]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[–—]\s*/g, ', ')
}

function clean(v) {
  if (typeof v === 'string') return undash(v)
  if (Array.isArray(v)) return v.map(clean)
  if (v && typeof v === 'object') {
    const o = {}
    for (const [k, x] of Object.entries(v)) if (!DROP.has(k)) o[k] = clean(x)
    return o
  }
  return v
}

async function fetchText(name) {
  const res = await fetch(`${ORIGIN}/assets/${name}.js`)
  if (!res.ok) throw new Error(`${name}.js: HTTP ${res.status}`)
  return res.text()
}

const g = {}
for (const f of FILES) Object.assign(g, globalsOf(await fetchText(f)))
for (const need of ['YEARS', 'UNITS', 'CURRIC', 'CODES', 'SEQ']) {
  if (!g[need]) throw new Error(`missing window.${need} on ${ORIGIN}`)
}

const data = clean({
  origin: ORIGIN,
  years: g.YEARS,
  units: g.UNITS,
  curriculum: g.CURRIC,
  codes: g.CODES,
  sequence: g.SEQ,
})
const text = JSON.stringify(data, null, 1) + '\n'

if (process.argv.includes('--check')) {
  let current = ''
  try { current = readFileSync(OUT, 'utf8') } catch { /* missing */ }
  if (current !== text) {
    console.error(`${OUT} is behind the author's site. Run: node scripts/languages/sync-french.mjs`)
    process.exit(1)
  }
  console.log(`${OUT} matches the author's site.`)
} else {
  writeFileSync(OUT, text)
  const ready = Object.values(data.curriculum.units).filter(u => u.ready).length
  console.log(`wrote ${OUT}: ${Object.keys(data.curriculum.units).length} units, ${ready} ready, ${Object.keys(data.units).length} with decks, ${Object.keys(data.sequence).length} decks`)
}
