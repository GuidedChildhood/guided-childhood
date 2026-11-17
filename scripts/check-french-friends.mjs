#!/usr/bin/env node
// THE FRENCH PLANET FRIENDS GUARD (17 November 2026).
//
// The French scheme's author runs her lessons with two class toys, Marie and
// Pierre. On our pages those parts are played by two of our Planet Friends,
// Nova and Bloop, through a mapping layer (schools/lib/languages/fr-friends.ts)
// that french.ts applies as it reads fr.json. This fails if either toy's name
// can reach a page through our own copy:
//
//   1. Every piece of her prose our pages read (the page text, the handbook,
//      every unit's plan and classroom set) comes out of the mapping with no
//      Marie and no Pierre left in it.
//   2. french.ts actually routes those reads through the mapping.
//   3. No French page or library file says either name in its own code.
//   4. Nobody "fixed" it in fr.json or the sync instead: the nightly sync
//      rewrites fr.json, so a name changed there is back by morning.
//
// What is allowed through, on purpose: her slide titles (data.sequence),
// listed verbatim so a running order matches the board, and file names. Both
// are her files, which we do not rewrite (plan, 17 November).
//
// Run: node --experimental-strip-types scripts/check-french-friends.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const TOYS = /\b(Marie|Pierre)\b/
const PATH_KEYS = new Set(['f', 'ans', 'poster', 'slides', 'url', 'qr', 'phonicsCheck'])
const { friendlyDeep, friendly, FRIENDS_PAIR } = await import('../schools/lib/languages/fr-friends.ts')
const data = JSON.parse(readFileSync('schools/lib/languages/fr.json', 'utf8'))

// 1. The mapped data.
const leaks = []
const walk = (v, path) => {
  if (typeof v === 'string') { if (TOYS.test(v)) leaks.push(`${path}: ${v.slice(0, 90)}`) }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (!PATH_KEYS.has(k)) walk(x, `${path}.${k}`) }
}
walk(friendlyDeep(data.page ?? {}), 'page')
walk(friendlyDeep(data.handbook ?? {}), 'handbook')
for (const [k, u] of Object.entries(data.curriculum?.units ?? {})) walk(friendlyDeep(u), `curriculum.units.${k}`)
for (const [k, u] of Object.entries(data.units ?? {})) walk(friendlyDeep(u), `units.${k}`)
ok('no Marie or Pierre survives the mapping in anything our pages read', leaks.length === 0, leaks.slice(0, 5).join('\n        '))

// The sentences that name what the toys ARE must not leave a teddy, a duck or
// a borrowed origin story attached to our friends.
const who = friendly('Two real toys with their own personalities. Marie, a teddy, is shy, timid, calm and quiet. Her best friend Pierre, a toy duck, is loud, cheeky and outgoing.')
ok('the description names Nova and Bloop, and no teddy or duck', /Nova/.test(who) && /Bloop/.test(who) && !/teddy|duck|real toys/i.test(who), who)
ok('the pair is Nova and Bloop', FRIENDS_PAIR === 'Nova and Bloop')
ok('text without the toys comes back unchanged', friendly('Pupils sing the song.') === 'Pupils sing the song.')
ok('a file name is never mapped', friendlyDeep({ f: 'Marie.pdf', t: 'Marie' }).f === 'Marie.pdf')

// 2. french.ts reads through the mapping.
const french = readFileSync('schools/lib/languages/french.ts', 'utf8')
ok('FR_PAGE is read through friendlyDeep', /export const FR_PAGE: FrenchPage = friendlyDeep\(data\.page/.test(french))
ok('FR_HANDBOOK is read through friendlyDeep', /export const FR_HANDBOOK: FrenchHandbook = friendlyDeep\(data\.handbook/.test(french))
ok('each unit plan is read through friendlyDeep', /const plan = friendlyDeep\(data\.curriculum\.units\[key\]\)/.test(french))
ok('each classroom set is read through friendlyDeep', /friendlyDeep\(data\.units\[slug\]\)/.test(french))

// 3. No literal name in our French code (comments aside).
const files = dir => readdirSync(dir).flatMap(n => {
  const p = join(dir, n)
  return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(n) ? [p] : []
})
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
for (const f of [...files('schools/app/languages'), ...files('schools/lib/languages')]) {
  if (f.endsWith('fr-friends.ts')) continue
  ok(`no Marie or Pierre in the code of ${f}`, !TOYS.test(code(readFileSync(f, 'utf8'))))
}

// 4. The mapping lives in the reader, never in the synced file or the sync.
const rawJson = readFileSync('schools/lib/languages/fr.json', 'utf8')
ok('fr.json has not been edited to carry our friends', !/\b(Nova|Bloop)\b/.test(rawJson), 'map in fr-friends.ts; the nightly sync rewrites fr.json')
ok('the sync does not do the mapping', !/\b(Nova|Bloop)\b/.test(readFileSync('scripts/languages/sync-french.mjs', 'utf8')))

if (failed) {
  console.error(`\n${failed} French friends check${failed === 1 ? '' : 's'} failed.`)
  process.exit(1)
}
console.log('PASS  her two class toys reach our French pages only as Nova and Bloop')
