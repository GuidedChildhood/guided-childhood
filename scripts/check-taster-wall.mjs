#!/usr/bin/env node
// THE TASTER WALL GUARD.
//
// One module of twenty three is outside the licence wall on purpose. That is
// a deliberate hole, and a deliberate hole is exactly the kind that gets
// quietly widened: a prefix test instead of a module id test, an extra entry
// nobody weighed, a path shape that turns out to reach the hub. Every school
// that pays is paying for the other twenty two staying shut.
//
// No database, no browser, no secrets, so this runs in CI beside the answer
// beat and governance tests.

import { readFileSync } from 'node:fs'
import { TASTER_MODULES, isTasterModule, isTasterPath } from '../schools/lib/taster.ts'
import { isOpenPath, OPEN_PATHS } from '../schools/lib/access.ts'

// EXACTLY what schools/proxy.ts does to decide whether a request needs a
// school code. Composed here rather than reimplemented: the permanent open
// map and the temporary sample are two separate questions, and the proxy is
// the one place they meet.
const reachableWithoutCode = (p) => isOpenPath(p) || isTasterPath(p)

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

// ── The hole stays small ────────────────────────────────────────────
ok('the taster list is short', TASTER_MODULES.length <= 2,
  `${TASTER_MODULES.length} modules are outside the wall. Every entry is a lesson given away, and the reason it works is that it is the exception. Widen this on purpose or not at all.`)
ok('the taster list is not empty', TASTER_MODULES.length >= 1,
  'with nothing on the list the sample link Justin sends is a 404')

// ── A module NOT on the list is still gated, in every shape ─────────
const STRANGER = 'ks4-16-consent-images-law'
ok('a stranger module is not a taster module', !isTasterModule(STRANGER))
for (const path of [
  `/lesson/${STRANGER}`,
  `/lesson/${STRANGER}/run`,
  `/teach/${STRANGER}`,
  `/print/${STRANGER}`,
  `/print/${STRANGER}/booklet`,
]) {
  ok(`gated: ${path}`, !reachableWithoutCode(path),
    'a module that is not the sample must meet the code door exactly as it did before the taster existed')
}

// ── The sample module opens, in the shapes a teacher actually needs ─
const SAMPLE = TASTER_MODULES[0]
for (const path of [
  `/lesson/${SAMPLE}`,
  `/lesson/${SAMPLE}/run`,
  `/teach/${SAMPLE}`,
  `/print/${SAMPLE}`,
  `/print/${SAMPLE}/booklet`,
  `/print/${SAMPLE}/organiser`,
  `/print/${SAMPLE}/starter-quiz`,
  `/print/${SAMPLE}/exit-quiz`,
]) {
  ok(`open: ${path}`, reachableWithoutCode(path),
    'the whole teacher journey for the sample has to work, or the taster sells a product that looks broken')
}

// ── The hole is a module id test, never a prefix test ───────────────
// The failure this exists for: someone simplifies isTasterPath to
// startsWith('/lesson/') and opens all twenty three without noticing.
{
  const leaks = [
    '/hub',
    '/hub/cpd',
    '/hub/policy',
    `/hub/${SAMPLE}`,
    '/lesson',
    '/teach',
    '/print',
    `/lesson/${SAMPLE}/../../hub/cpd`,
    `/teach/${SAMPLE}/secret`,
    `/lesson/${SAMPLE}extra`,
    `/lesson/not-${SAMPLE}`,
  ].filter(p => isTasterPath(p))
  ok('the taster opens one module and nothing else', leaks.length === 0,
    `these leaked through: ${leaks.join(' ')}`)
}

// ── The gated hub is still gated ────────────────────────────────────
for (const path of ['/hub', '/hub/cpd', '/hub/dsl', '/hub/policy', '/print']) {
  ok(`still gated: ${path}`, !reachableWithoutCode(path),
    'the staff briefings and the print room index are the product, not the advert')
}

// ── The open list did not grow by accident ──────────────────────────
ok('the open path list is unchanged in size', OPEN_PATHS.length === 8,
  `OPEN_PATHS has ${OPEN_PATHS.length} entries. The taster is meant to travel through isTasterPath, not by adding routes here. If a page really should be public, change this number on purpose.`)

// ── The two questions stay separate ─────────────────────────────────
// access.ts is the permanent open map; taster.ts is the temporary sample.
// Folding the sample into isOpenPath would make withdrawing it a change to
// the paid wall, which is the thing nobody should have to reason about twice.
{
  const access = readFileSync(new URL('../schools/lib/access.ts', import.meta.url), 'utf8')
  const proxy = readFileSync(new URL('../schools/proxy.ts', import.meta.url), 'utf8')
  ok('the permanent open map knows nothing about the taster', !access.includes('isTasterPath'),
    'isOpenPath must stay "what is public forever", not "what is public today"')
  ok('the proxy composes both questions', /isOpenPath\(pathname\)\s*\|\|\s*isTasterPath\(pathname\)/.test(proxy),
    'if the proxy stops asking isTasterPath, the sample link Justin sends redirects to /unlock again')
}

// ── The lead reaches Justin readable ────────────────────────────────
// The letterbox is shared with the invoice form, so the ONLY thing that tells
// a lead apart from an order is the band, and the only thing that turns the
// band into English is the cron's label table. A band the cron has never
// heard of emails Justin a raw slug and a PO number of "TASTER".
{
  const action = readFileSync(new URL('../schools/app/taster/actions.ts', import.meta.url), 'utf8')
  const cron = readFileSync(new URL('../app/api/cron/invoice-requests/route.ts', import.meta.url), 'utf8')

  ok('the taster lead is banded taster', /band:\s*'taster'/.test(action))
  ok('the taster lead carries a PO placeholder', /po_number:\s*'TASTER'/.test(action),
    'po_number is NOT NULL in migration 195, so a lead with no PO needs a word there or the insert throws')
  ok('the taster lead asks for no purchase order', !/formData\.get\('po_number'\)/.test(action),
    'asking a browsing teacher for a PO is asking them to leave')
  ok('the cron can name the taster band', /^\s*taster:/m.test(cron),
    'without a label the hourly email says "taster" as a raw slug')
  ok('the cron treats the taster as a lead, not an order', /LEAD_BANDS[^\n]*taster/.test(cron),
    'otherwise Justin gets "School invoice request" for somebody who has no invoice to raise')
}

if (failed) {
  console.error(`\n${failed} taster wall check${failed === 1 ? '' : 's'} failed`)
  process.exit(1)
}
console.log(`taster wall: ${TASTER_MODULES.length} module open, everything else shut, all checks pass.`)
