#!/usr/bin/env node
// ONE PASSPORT, TWO PRODUCTS: the school side's area model cannot drift.
//
// shared/passport-areas.ts carries a copy of the parents app's four areas
// (lib/content/literacy.ts: keys, names, start stages) because the schools
// app cannot import the parents app's lib/. This guard holds the copy to the
// original, and holds every module in the curriculum to exactly one real
// area, so a new module cannot ship with no area and the wall cannot build a
// fifth thing the passport has never heard of.
//
// It reads the TypeScript as text on purpose: no build step, no path alias,
// and the same file CI ships. Exit 1 on any mismatch.

import fs from 'node:fs'

let bad = 0
const fail = msg => { bad += 1; console.error(`FAIL  ${msg}`) }
const pass = msg => console.log(`ok    ${msg}`)

const areasSrc = fs.readFileSync('shared/passport-areas.ts', 'utf8')
const curriculumSrc = fs.readFileSync('shared/schools-curriculum.ts', 'utf8')

// The four, as the school side declares them.
const keys = areasSrc.match(/^export type AreaKey = (.+)$/m)?.[1].match(/'([a-z]+)'/g)?.map(k => k.replace(/'/g, '')) ?? []
const order = areasSrc.match(/^export const AREA_ORDER: AreaKey\[\] = \[(.+)\]/m)?.[1].match(/'([a-z]+)'/g)?.map(k => k.replace(/'/g, '')) ?? []
const names = Object.fromEntries([...areasSrc.matchAll(/^\s+([a-z]+):\s+\{ name: '([^']+)',\s+short: '([^']+)' \}/gm)].map(m => [m[1], m[2]]))
const start = Object.fromEntries([...(areasSrc.match(/AREA_START: Record<AreaKey, number> = \{([^}]+)\}/)?.[1] ?? '').matchAll(/([a-z]+): (\d+)/g)].map(m => [m[1], Number(m[2])]))

if (keys.length !== 4) fail(`AreaKey should name four areas, found ${keys.length}`); else pass('four area keys')
if (order.length !== 4 || order.some(k => !keys.includes(k))) fail(`AREA_ORDER ${JSON.stringify(order)} is not the four keys`); else pass('AREA_ORDER is the four keys')
if (Object.keys(names).length !== 4) fail(`AREAS should name four areas, found ${Object.keys(names).length}`); else pass('AREAS names four areas')
if (Object.keys(start).length !== 4) fail(`AREA_START should cover four areas, found ${Object.keys(start).length}`); else pass('AREA_START covers four areas')

// The copy against the original, wherever the original is present (the
// parents app's lib/ is in this repo; the guard still passes on a checkout
// that only carries the schools app).
if (fs.existsSync('lib/content/literacy.ts')) {
  const lit = fs.readFileSync('lib/content/literacy.ts', 'utf8')
  const litKeys = lit.match(/^export type LiteracyKey = (.+)$/m)?.[1].match(/'([a-z]+)'/g)?.map(k => k.replace(/'/g, '')) ?? []
  const litNames = Object.fromEntries([...lit.matchAll(/^\s+([a-z]+):\s+\{ name: '([^']+)'/gm)].map(m => [m[1], m[2]]))
  if (JSON.stringify(litKeys) !== JSON.stringify(keys)) fail(`keys differ: parents ${JSON.stringify(litKeys)}, schools ${JSON.stringify(keys)}`); else pass('keys match the parents app')
  for (const k of keys) {
    if (litNames[k] && litNames[k] !== names[k]) fail(`name for ${k} differs: parents "${litNames[k]}", schools "${names[k]}"`)
  }
  if (keys.every(k => !litNames[k] || litNames[k] === names[k])) pass('names match the parents app')
  const litStart = lit.match(/AREA_START: Record<LiteracyKey, number> = \{([^}]+)\}/)?.[1]
  if (litStart) {
    const ls = Object.fromEntries([...litStart.matchAll(/([a-z]+): (\d+)/g)].map(m => [m[1], Number(m[2])]))
    for (const k of keys) if (ls[k] !== undefined && ls[k] !== start[k]) fail(`start stage for ${k} differs: parents ${ls[k]}, schools ${start[k]}`)
    if (keys.every(k => ls[k] === undefined || ls[k] === start[k])) pass('start stages match the parents app')
  } else {
    pass('parents app declares no AREA_START yet; the schools copy stands on its own')
  }
} else {
  pass('no parents app in this checkout; the schools copy stands on its own')
}

// Every module in the curriculum lands in exactly one real area.
const modules = [...curriculumSrc.matchAll(/moduleId: '([^']+)'/g)].map(m => m[1])
const mapped = Object.fromEntries([...(areasSrc.match(/SCHOOL_MODULE_AREA: Record<string, AreaKey> = \{([\s\S]+?)\n\}/)?.[1] ?? '').matchAll(/'([^']+)':\s*'([a-z]+)'/g)].map(m => [m[1], m[2]]))
if (modules.length < 25) fail(`the curriculum lists ${modules.length} modules, expected at least 25`)
for (const id of modules) {
  if (!mapped[id]) fail(`${id} has no area`)
  else if (!keys.includes(mapped[id])) fail(`${id} names an area the passport has never heard of: ${mapped[id]}`)
}
for (const id of Object.keys(mapped)) if (!modules.includes(id)) fail(`${id} has an area but is not in the curriculum`)
if (modules.every(id => mapped[id] && keys.includes(mapped[id])) && Object.keys(mapped).every(id => modules.includes(id))) pass(`every one of the ${modules.length} modules lands in one of the four areas`)

if (bad) { console.error(`\n${bad} problem(s).`); process.exit(1) }
console.log('check-passport-areas: the school side matches the parents app and every module has an area.')
