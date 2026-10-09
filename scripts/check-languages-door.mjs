#!/usr/bin/env node
// THE LANGUAGES DOOR GUARD.
//
// Justin, 9 October 2026: French and Spanish stay hidden from the site until
// they are finished, and they open with a code of their own. This holds both
// halves of that, with no database and no browser:
//
//   1. Nothing outside the languages area links to it. No page, nav, sitemap
//      or email in either app points at /languages while it is hidden.
//   2. The proxy decides languages before the scheme gate, and the open map
//      does not list them, so a scheme licence cannot reach them by accident.
//   3. The two codes cannot open each other. A languages cookie never
//      verifies as a scheme cookie, a scheme cookie never verifies as a
//      languages cookie, a Spanish code never opens French, and pulling a
//      code from the env locks it out on the next request.
//
// Run: node --experimental-strip-types scripts/check-languages-door.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const walk = dir => readdirSync(dir).flatMap(name => {
  const p = join(dir, name)
  if (name === 'node_modules' || name === '.next') return []
  return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx|mjs|js)$/.test(name) ? [p] : []
})

// 1. Hidden: no link in from anywhere.
const inside = p => p.startsWith(join('schools', 'app', 'languages')) || p === join('schools', 'lib', 'languages-access.ts') || p === join('schools', 'proxy.ts')
for (const root of ['schools', 'app', 'components', 'shared', 'lib']) {
  for (const file of walk(root)) {
    if (inside(file)) continue
    const src = readFileSync(file, 'utf8')
    ok(`no link to /languages in ${file}`, !/["'`(]\/languages(\/|["'`?#)])/.test(src),
      'languages are hidden until LANGUAGES_LIVE is switched on; link to them only once they launch')
  }
}

// 2. The proxy order and the open map.
const proxy = readFileSync('schools/proxy.ts', 'utf8')
const langAt = proxy.indexOf('isLanguagesPath(pathname)) return languagesGate')
const openAt = proxy.indexOf('if (isOpenPath(pathname)')
ok('the proxy decides languages before the open map and the scheme gate', langAt > -1 && openAt > -1 && langAt < openAt)
const { OPEN_PATHS, tokenAccess, issueToken } = await import('../schools/lib/access.ts')
ok('no languages path is on the open map', !OPEN_PATHS.some(p => p.startsWith('/languages')))

// 3. The two codes, exercised for real.
process.env.SCHOOLS_ACCESS_SECRET = 'guard-secret'
process.env.SCHOOLS_ACCESS_CODES = 'scheme-code'
process.env.SCHOOLS_PILOT_CODES = ''
process.env.SCHOOLS_LANGUAGES_CODES = 'both-code,es-code:es,fr-code:fr'
process.env.LANGUAGES_LIVE = ''
const L = await import('../schools/lib/languages-access.ts')

ok('languages are hidden by default', L.languagesLive() === false)
ok('a languages code is matched', L.matchLanguagesCode(' ES-Code ') === 'es-code')
ok('a scheme code is not a languages code', L.matchLanguagesCode('scheme-code') === null)

const both = await L.issueLanguagesToken('both-code')
const es = await L.issueLanguagesToken('es-code')
const scheme = await issueToken('scheme-code')
ok('a bare code opens both languages', JSON.stringify((await L.languagesTokenAccess(both))?.langs) === '["es","fr"]')
ok('a Spanish code opens Spanish only', JSON.stringify((await L.languagesTokenAccess(es))?.langs) === '["es"]')
ok('a scheme cookie never opens languages', (await L.languagesTokenAccess(scheme)) === null)
ok('a languages cookie never opens the scheme', (await tokenAccess(both)) === null)
ok('a forged languages cookie fails', (await L.languagesTokenAccess(both.replace(/.$/, c => (c === 'a' ? 'b' : 'a')))) === null)
process.env.SCHOOLS_LANGUAGES_CODES = 'both-code,fr-code:fr'
ok('a code pulled from the env stops at once', (await L.languagesTokenAccess(es)) === null)
ok('paths name their language', L.langOfPath('/languages/fr/teach/x') === 'fr' && L.langOfPath('/languages') === null)

if (failed) {
  console.error(`\n${failed} languages door check${failed === 1 ? '' : 's'} failed.`)
  process.exit(1)
}
console.log('PASS  languages are hidden, decided first, and their code opens nothing else')
