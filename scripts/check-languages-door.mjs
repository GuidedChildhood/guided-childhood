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
const inside = p => p.startsWith(join('schools', 'app', 'languages')) || p.startsWith(join('schools', 'lib', 'languages')) || p === join('schools', 'proxy.ts')

// THE ONE SANCTIONED LINK IN (9 November 2026): the Languages tab in the
// schools nav, which renders only when navAccess() says the visitor holds a
// languages code or LANGUAGES_LIVE is on. It is allowed on exactly those terms:
// the link must sit inside a `languages && (` block, navAccess must derive
// `languages` from the languages cookie or the live flag, and nothing else in
// the file may name the path.
const NAV = join('schools', 'components', 'SiteNav.tsx')
{
  const src = readFileSync(NAV, 'utf8')
  const block = src.match(/\{languages && \(([\s\S]*?)\n\s*\)\}/)
  const outside = block ? src.replace(block[0], '') : src
  ok('the Languages tab renders only inside a `languages && (` block', !!block && /href="\/languages"/.test(block[1]))
  ok('SiteNav names /languages nowhere else', !/["'`(]\/languages(\/|["'`?#)])/.test(outside))
  const licence = readFileSync(join('schools', 'lib', 'licence.ts'), 'utf8')
  // Since 15 November 2026 French is in every school's licence, so a scheme
  // code shows the tab too. A stranger with no code still never sees it.
  ok('navAccess sets languages only from a scheme code, the languages cookie or LANGUAGES_LIVE',
    /const languages = access !== null \|\| languagesLive\(\) \|\| \(await languagesTokenAccess\(store\.get\(LANGUAGES_COOKIE\)\?\.value\)\) !== null/.test(licence))
}

// THE MEDIA ROUTE GATES ITSELF (10 November 2026). Its paths all carry a dot,
// which the proxy's matcher skips, so the proxy never sees them. A deck must
// therefore check the languages code in the route, and must be sent with a
// sandbox so its scripts never run with this app's origin.
{
  const route = readFileSync(join('schools', 'app', 'languages', 'fr', 'media', '[...path]', 'route.ts'), 'utf8')
  ok('the media route checks the languages code before serving a deck',
    /languagesTokenAccess\(/.test(route) && /if \(!access\?\.langs\.includes\('fr'\)\) return gone\(\)/.test(route))
  ok('a deck is served sandboxed, without allow-same-origin',
    /'Content-Security-Policy': DECK_SANDBOX/.test(route) && /const DECK_SANDBOX = 'sandbox [^']*'/.test(route) && !/allow-same-origin/.test(route.replace(/\/\/.*$/gm, '')))
  const teach = readFileSync(join('schools', 'app', 'languages', 'fr', '[unit]', '[lesson]', 'teach', 'page.tsx'), 'utf8')
  ok('the teach frame is sandboxed, without allow-same-origin', /sandbox="[^"]*allow-scripts[^"]*"/.test(teach) && !/sandbox="[^"]*allow-same-origin/.test(teach))
}

for (const root of ['schools', 'app', 'components', 'shared', 'lib']) {
  for (const file of walk(root)) {
    if (inside(file) || file === NAV) continue
    // The Hub is behind a scheme code, and since 15 November 2026 every school
    // with one has French, so its tile may link there. Nothing public may.
    if (file === join('schools', 'app', 'hub', 'page.tsx')) continue
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
// A code is typed by hand twice, so the slips that carry no meaning must not
// lock a school out (10 November 2026).
ok('the :fr ending typed at the door is forgiven', L.matchLanguagesCode('fr-code:fr') === 'fr-code')
ok('a long dash typed for a hyphen is forgiven', L.matchLanguagesCode('es\u2013code') === 'es-code' && L.matchLanguagesCode('es\u2014code') === 'es-code')
ok('quote marks around a typed code are forgiven', L.matchLanguagesCode('\u201ces-code\u201d') === 'es-code')
process.env.SCHOOLS_LANGUAGES_CODES = '"Both Code", \u201cES\u2014code:es\u201d ,fr-code : FR'
ok('quotes, capitals, spaces and long dashes in the saved value are forgiven',
  L.matchLanguagesCode('bothcode') === 'bothcode' && L.matchLanguagesCode('es-code') === 'es-code' && L.matchLanguagesCode('fr-code') === 'fr-code')
ok('a forgiven saved code still opens only its language', JSON.stringify((await L.languagesTokenAccess(await L.issueLanguagesToken('es-code')))?.langs) === '["es"]')
ok('a wrong code is still refused', L.matchLanguagesCode('es-cod') === null && L.matchLanguagesCode('') === null)
process.env.SCHOOLS_LANGUAGES_CODES = 'both-code,es-code:es,fr-code:fr'

const both = await L.issueLanguagesToken('both-code')
const es = await L.issueLanguagesToken('es-code')
const scheme = await issueToken('scheme-code')
ok('a bare code opens both languages', JSON.stringify((await L.languagesTokenAccess(both))?.langs) === '["es","fr"]')
ok('a Spanish code opens Spanish only', JSON.stringify((await L.languagesTokenAccess(es))?.langs) === '["es"]')
ok('a scheme cookie never opens languages', (await L.languagesTokenAccess(scheme)) === null)
ok('a languages cookie never opens the scheme', (await tokenAccess(both)) === null)

// FRENCH IS IN EVERY SCHOOL'S LICENCE (15 November 2026). The proxy mints a
// French cookie from a valid scheme cookie. It opens French only, never
// Spanish, never the scheme, and it dies with the scheme code.
const fromScheme = await L.issueSchemeLanguagesToken('scheme-code')
const viaScheme = await L.languagesTokenAccess(fromScheme)
ok('a school with a scheme code is given French', viaScheme !== null && viaScheme.langs.join() === 'fr')
ok('the French cookie given to a scheme school does not open the scheme', (await tokenAccess(fromScheme)) === null)
ok('a code that is on no scheme list is given nothing', (await L.languagesTokenAccess(await L.issueSchemeLanguagesToken('not-a-code'))) === null)
{
  const keep = process.env.SCHOOLS_ACCESS_CODES
  process.env.SCHOOLS_ACCESS_CODES = 'another-school'
  ok('pulling the scheme code closes French on the next request', (await L.languagesTokenAccess(fromScheme)) === null)
  process.env.SCHOOLS_ACCESS_CODES = keep
}
// THE FREE TASTER (15 November 2026): one French lesson and its teach screen
// are open to anyone. Exact paths only, so nothing beside them opens.
ok('the taster is one lesson and its teach screen', L.isFrenchTasterPath(L.FRENCH_TASTER_PATH) && L.isFrenchTasterPath(L.FRENCH_TASTER_PATH + '/teach'))
for (const shut of ['/languages', '/languages/fr', '/languages/fr/print', `/languages/fr/${L.FRENCH_TASTER.unit}`, `/languages/fr/${L.FRENCH_TASTER.unit}/2`, L.FRENCH_TASTER_PATH + '/teach/x', L.FRENCH_TASTER_PATH + '0', '/languages/fr/progress']) {
  ok(`the taster does not open ${shut}`, !L.isFrenchTasterPath(shut))
}
ok('the proxy opens only the taster paths to a stranger', /if \(isFrenchTasterPath\(pathname\)\) return pass\(\)/.test(proxy))
{
  const media = readFileSync('schools/app/languages/fr/media/[...path]/route.ts', 'utf8')
  ok('only the taster lesson\'s own deck is served without a code', /const isTaster = !!tasterUnit && slug === tasterUnit\.slug && !!tasterDeck && file === tasterDeck/.test(media) && /if \(!isTaster\) \{/.test(media))
}
ok('the proxy gives French to a scheme school before the door', /issueSchemeLanguagesToken\(/.test(proxy) && proxy.indexOf('issueSchemeLanguagesToken(') < proxy.lastIndexOf('if (pathname === LANGUAGES_DOOR) return pass()'))
ok('a forged languages cookie fails', (await L.languagesTokenAccess(both.replace(/.$/, c => (c === 'a' ? 'b' : 'a')))) === null)
process.env.SCHOOLS_LANGUAGES_CODES = 'both-code,fr-code:fr'
ok('a code pulled from the env stops at once', (await L.languagesTokenAccess(es)) === null)
ok('paths name their language', L.langOfPath('/languages/fr/teach/x') === 'fr' && L.langOfPath('/languages') === null)

if (failed) {
  console.error(`\n${failed} languages door check${failed === 1 ? '' : 's'} failed.`)
  process.exit(1)
}
console.log('PASS  languages are hidden, decided first, and their code opens nothing else')
