// The school link (migration 353), checked without a database.
//
// Justin, 25 September 2026, "Idea 1": before any paid school pass, a school
// shares a newsletter link and we count who came through it. The count is the
// whole point, so the things that would make it lie are pinned here:
//
//   a name taken from the address bar, which lets anyone put words on our page
//   a school rewriting who brought a family, which moves families between pilots
//   a card trial counted as paying, which calls an uncharged family a customer
//   the table reachable from a browser, which it never needs to be
//
// Usage: node --experimental-strip-types scripts/check-school-link.mjs

import { readFileSync } from 'node:fs'
import { normaliseLinkCode, codeFromSchoolName, SCHOOL_LINK_COOKIE } from '../lib/school/link.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const read = p => readFileSync(p, 'utf8')

// ── THE CODE ────────────────────────────────────────────────────────────────
check('a school name becomes a tidy code',
  codeFromSchoolName("St Mary's C of E Primary") === 'st-marys-c-of-e-primary', codeFromSchoolName("St Mary's C of E Primary"))
check('accents and symbols fall away', codeFromSchoolName('Ecole Élan & Co.') === 'ecole-elan-co', codeFromSchoolName('Ecole Élan & Co.'))
check('a long name is cut to forty without a trailing dash',
  (codeFromSchoolName('The Very Long Named Academy Trust Primary School of Somewhere') ?? '').length <= 40
  && !(codeFromSchoolName('The Very Long Named Academy Trust Primary School of Somewhere') ?? '-').endsWith('-'))
check('a name with no letters makes no code', codeFromSchoolName('!!!') === null)
check('codes are read case blind', normaliseLinkCode('St-Marys') === 'st-marys')
check('and anything that could not be one is refused',
  [null, '', 'ab', 'a b', 'x/../y', '-lead', 'trail-', 'a--b', 'x'.repeat(41)].every(v => normaliseLinkCode(v) === null))

// ── THE TABLE ───────────────────────────────────────────────────────────────
const sql = read('supabase/migrations/353_the_school_link.sql').replace(/--[^\n]*/g, '')
check('the table has row level security', /alter table public\.school_links enable row level security/.test(sql))
check('and no browser role can reach it', /revoke all on public\.school_links from anon, authenticated/.test(sql)
  && !/grant[^;]*school_links[^;]*to[^;]*(anon|authenticated)/.test(sql))
check('its own table, not the paid licence',
  /references public\.school_links\(code\)/.test(sql) && !/references public\.schools\b/.test(sql) && !/add column[^;]*school_id/.test(sql))
const lock = read('supabase/migrations/175_lock_the_paywall_columns.sql')
check('a parent cannot set their own school link', !/school_link/.test(lock))

// ── THE LINK ────────────────────────────────────────────────────────────────
const route = read('app/s/[code]/route.ts')
check('the link lands on the stage check', /new URL\('\/starter-pack'/.test(route))
check('and only a known, switched on code is remembered',
  /\.eq\('active', true\)/.test(route) && /if \(!known\) return NextResponse\.redirect\(to\)/.test(route)
  && route.indexOf('if (!known)') < route.indexOf('res.cookies.set'))
check('in a cookie the page script cannot read', /httpOnly: true/.test(route) && route.includes('SCHOOL_LINK_COOKIE'))

const nameApi = read('app/api/school-link/route.ts')
check('the name on the page comes from the cookie, never the address bar',
  nameApi.includes(`cookies.get(SCHOOL_LINK_COOKIE)`) && !/searchParams/.test(nameApi))
const pack = read('app/(marketing)/starter-pack/page.tsx')
check('the stage check asks the server for the name', /fetch\('\/api\/school-link'\)/.test(pack) && /For families at \{schoolName\}/.test(pack))

// ── THE COUNT ───────────────────────────────────────────────────────────────
const grant = read('app/api/trial/start/route.ts')
check('a family is tagged only when their trial is first granted',
  /const schoolCode = granted \?/.test(grant))
check('and never re tagged by a second school', /\.is\('school_link', null\)/.test(grant))
check('attribution can never cost a family their trial',
  grant.indexOf('const granted') < grant.indexOf('const schoolCode') && /catch \{ \/\* attribution/.test(grant))

const page = read('app/(dashboard)/dashboard/admin/schools/page.tsx')
check('the page is founder only', /!== FOUNDER_EMAIL\) redirect\('\/dashboard'\)/.test(page))
check('paying means charged: a card trial still in its free days is not paying',
  /paying: mine\.filter\(f => onPaidStatus\(f\) && !inTrialWindow\(f\)\)/.test(page))
const api = read('app/api/admin/school-links/route.ts')
check('only the founder can add or switch off a link',
  (api.match(/if \(!\(await founder\(\)\)\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\)/g) ?? []).length === 2)

check('one cookie name everywhere', SCHOOL_LINK_COOKIE === 'gc_school')

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
