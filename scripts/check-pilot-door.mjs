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
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { OPEN_PATHS } from '../schools/lib/access.ts'
import { PILOT_BAND, PILOT_PLACES } from '../schools/lib/pilot.ts'

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

if (failed) {
  console.error(`\npilot door: ${failed} problem${failed === 1 ? '' : 's'}.\n`)
  process.exit(1)
}
console.log('pilot door: ours, open, and both ends of the letterbox agree.')
