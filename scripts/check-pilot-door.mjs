#!/usr/bin/env node
// THE PILOT DOOR GUARD.
//
// On 13 September 2026 the pilot request came into the product (decision 2
// of the schools review): a page of our own at /pilot, landing in the same
// letterbox as an invoice request, so a school never leaves the site and a
// pilot code can be issued from one place. This holds that in three lines:
//
//   1. No door on the schools site leads back out to Mailchimp.
//   2. /pilot is open to strangers and in the sitemap.
//   3. Both ends of the letterbox agree on the word: the pilot action inserts
//      band 'pilot' and the parent app's cron treats 'pilot' as a lead, so a
//      request is never emailed to Justin as an order to invoice.
//   4. The pilot is two lessons (Justin, 14 September 2026), matched to the
//      school's phase, plus the Hub: exactly two per phase, all through is
//      primary plus secondary, none carries a DSL note, a pilot code cannot
//      reach a stranger module in any shape, and nothing on the site or in
//      the letter still promises the pilot the whole scheme.
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { OPEN_PATHS, PILOT_PHASES } from '../schools/lib/access.ts'
import { PILOT_BAND, PILOT_PLACES, PILOT_SET, isPilotPath, pilotModulesFor } from '../schools/lib/pilot.ts'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const walk = dir => readdirSync(dir).flatMap(name => {
  const p = join(dir, name)
  if (name === 'node_modules' || name === '.next') return []
  return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(name) ? [p] : []
})

// 1. No way out to Mailchimp.
for (const file of walk('schools')) {
  const src = readFileSync(file, 'utf8')
  // The link, not the word: a comment may say where the door used to lead.
  ok(`no Mailchimp door in ${file}`, !/mailchi\.mp|list-manage\.com|mailchimp\.com/i.test(src),
    'the pilot request is a page of our own now; a link out loses the lead')
}

// 2. The door is open and findable.
ok('/pilot is an open path', OPEN_PATHS.includes('/pilot'))
ok('/pilot is in the sitemap', readFileSync('schools/app/sitemap.ts', 'utf8').includes('/pilot'))

// 3. The word is the same at both ends.
const action = readFileSync('schools/app/pilot/actions.ts', 'utf8')
ok('the pilot action inserts the pilot band', /band:\s*PILOT_BAND/.test(action))
const cron = readFileSync('app/api/cron/invoice-requests/route.ts', 'utf8')
ok(`the cron treats '${PILOT_BAND}' as a lead`, new RegExp(`LEAD_BANDS = new Set\\(\\[[^\\]]*'${PILOT_BAND}'`).test(cron),
  'otherwise a pilot request is emailed to Justin as an order to invoice')
ok('the cron sends the school its own letter', /schoolLetter\(/.test(cron) && /confirmed_at/.test(cron))
const letters = readFileSync('lib/email/school-letters.ts', 'utf8')
ok('there is a letter for the pilot', new RegExp(`r\\.band === '${PILOT_BAND}'`).test(letters))

// The five is read, never typed, on the pages that say it.
for (const file of ['schools/app/page.tsx', 'schools/app/pilot/page.tsx']) {
  const src = readFileSync(file, 'utf8')
  ok(`${file} reads the pilot places from lib/pilot`, src.includes('PILOT_PLACES'))
  ok(`${file} does not type the number ${PILOT_PLACES} into the pilot copy`, !new RegExp(`first ${PILOT_PLACES} schools`).test(src),
    'use {PILOT_PLACES} so the page and the count cannot disagree')
}

// 4. Two lessons, matched to the phase, and no way past them.
const manifest = readFileSync('shared/schools-curriculum.ts', 'utf8')
const entryOf = id => {
  const at = manifest.indexOf(`moduleId: '${id}'`)
  if (at < 0) return null
  const next = manifest.indexOf('moduleId:', at + 10)
  return manifest.slice(at, next < 0 ? undefined : next)
}
const STAGES_FOR = { primary: ['eyfs', 'ks1', 'ks2'], secondary: ['ks3', 'ks4'], post16: ['ks4', 'ks5'] }
for (const phase of ['primary', 'secondary', 'post16']) {
  const set = PILOT_SET[phase]
  ok(`the ${phase} pilot is exactly two lessons`, set.length === 2, `found ${set.length}: ${set.join(', ')}`)
  for (const id of set) {
    const entry = entryOf(id)
    ok(`${id} is in the curriculum manifest`, entry !== null)
    ok(`${id} sits in the ${phase} key stages`, STAGES_FOR[phase].some(ks => id.startsWith(`${ks}-`)))
    ok(`${id} carries no DSL note`, !entry || !/dsl:\s*true/.test(entry),
      'a pilot lesson must be teachable the day the code lands, with no safeguarding briefing first')
  }
}
ok('all through is primary plus secondary', PILOT_SET.all_through.join(',') === [...PILOT_SET.primary, ...PILOT_SET.secondary].join(','))
ok('every phase the access module names has a set', PILOT_PHASES.every(p => Array.isArray(PILOT_SET[p])))

// The wall around the two: the same shapes the taster guard checks.
const PRIMARY_ONE = PILOT_SET.primary[0]
for (const path of [`/lesson/${PRIMARY_ONE}`, `/lesson/${PRIMARY_ONE}/run`, `/teach/${PRIMARY_ONE}`, `/class/${PRIMARY_ONE}`, `/print/${PRIMARY_ONE}`, `/print/${PRIMARY_ONE}/booklet`, '/hub', '/hub/dsl', '/print', '/print/passport/foundation']) {
  ok(`a primary pilot opens ${path}`, isPilotPath(path, 'primary'))
}
const STRANGER = 'ks4-17-sextortion'
for (const path of [`/lesson/${STRANGER}`, `/lesson/${STRANGER}/run`, `/teach/${STRANGER}`, `/print/${STRANGER}`, `/class/${STRANGER}`, `/lesson/${PILOT_SET.secondary[0]}`, `/teach/${PRIMARY_ONE}/secret`, `/lesson/${PRIMARY_ONE}extra`, '/lesson', '/teach']) {
  ok(`a primary pilot does not reach ${path}`, !isPilotPath(path, 'primary'))
}
ok('the secondary pilot reaches its own lessons', pilotModulesFor('secondary').every(id => isPilotPath(`/teach/${id}`, 'secondary')))
const proxy = readFileSync('schools/proxy.ts', 'utf8')
ok('the proxy composes isPilotPath for a pilot cookie', /access\?\.tier === 'pilot' && isPilotPath\(pathname, access\.phase\)/.test(proxy))
ok('the proxy sends a pilot school to the door with the pilot message', /pilot=1/.test(proxy))

// Nothing still promises the pilot the whole scheme.
const pilotPage = readFileSync('schools/app/pilot/page.tsx', 'utf8')
ok('the pilot page does not promise the whole scheme', !/whole scheme|every module|All \$\{MODULE_COUNT\} modules/.test(pilotPage.replace(/\/\/.*$/gm, '')))
ok('the pilot page says two lessons', /[Tt]wo lessons/.test(pilotPage))
const pilotLetter = letters.slice(letters.indexOf("r.band === 'pilot'"), letters.indexOf("r.band === 'taster'"))
ok('the pilot letter does not promise everything', !/opens everything|every module/.test(pilotLetter))
ok('the pilot letter says two lessons', /two lessons/.test(pilotLetter))
const terms = readFileSync('schools/lib/legal/terms.ts', 'utf8')
ok('the terms do not say the pilot opens everything a licence opens', !/pilot opens everything/.test(terms))
ok('the cron email names the pilot code list and its shape', /SCHOOLS_PILOT_CODES/.test(cron) && /code:phase/.test(cron))
ok('the env template documents the pilot code list', /SCHOOLS_PILOT_CODES=/.test(readFileSync('.env.local.template', 'utf8')))

if (failed) {
  console.error(`\npilot door: ${failed} problem${failed === 1 ? '' : 's'}.\n`)
  process.exit(1)
}
console.log('pilot door: ours, open, both ends of the letterbox agree, and the pilot is two lessons behind its own wall.')
