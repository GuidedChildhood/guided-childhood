// Does every page quote the same price, and the same trial?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// On 9 September 2026 a reviewer found the starter quiz reveal was the only
// page in the funnel with no price on it, while /join, /terms and /pathway had
// all carried £7.99 founder, £12.99 standard and £99 a year for weeks. I had
// looked, grepped badly, concluded the product was pre pricing, and shipped a
// line saying so.
//
// A price is duplicated as prose across four marketing pages because it has to
// read as a sentence in each one, so there is no single constant to import.
// That makes drift a matter of when rather than whether, and a page quoting
// last month's price is the kind of thing a customer finds before we do.
//
// So the numbers are asserted here instead. If the price genuinely changes,
// this file is the checklist of every place that has to change with it.
//
// Usage: node scripts/check-price-copy.mjs

import { readFileSync } from 'node:fs'

const read = p => { try { return readFileSync(p, 'utf8') } catch { return '' } }

// The prices, as agreed and as written in terms.
const FOUNDER = '7.99'
const STANDARD = '12.99'
const ANNUAL = '99'
const TRIAL_DAYS = 4
const FOUNDER_CAP = 50

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// Every page that names a price has to name the SAME one.
const PAGES = [
  ['app/(marketing)/join/page.tsx', [FOUNDER, STANDARD, ANNUAL]],
  ['app/(marketing)/terms/page.tsx', [FOUNDER, STANDARD, ANNUAL]],
  ['app/(marketing)/pathway/page.tsx', [FOUNDER]],
  ['app/(marketing)/starter-pack/ResultScreen.tsx', [FOUNDER, STANDARD]],
]
for (const [file, prices] of PAGES) {
  const src = read(file)
  check(`${file} was found`, src.length > 0)
  for (const p of prices) {
    check(`${file} quotes £${p}`, src.includes(p), 'a page quoting a stale price is found by a customer first')
  }
}

// The reveal must not quote a price the others do not carry.
const reveal = read('app/(marketing)/starter-pack/ResultScreen.tsx')
const stray = [...reveal.matchAll(/£(\d+(?:\.\d\d)?)/g)].map(m => m[1])
  .filter(v => ![FOUNDER, STANDARD, ANNUAL].includes(v))
check('the reveal invents no other price', stray.length === 0, stray.join(', '))

// The trial length, and the cap, said the same way everywhere they are said.
const access = read('lib/access.ts')
check(`TRIAL_DAYS is still ${TRIAL_DAYS}`, new RegExp(`TRIAL_DAYS\\s*=\\s*${TRIAL_DAYS}\\b`).test(access), 'the reveal says four days in prose')
check('the reveal says four days', /four days/i.test(reveal))

const stripe = read('lib/stripe/index.ts')
check(`FOUNDER_CAP is still ${FOUNDER_CAP}`, new RegExp(`FOUNDER_CAP\\s*=\\s*${FOUNDER_CAP}\\b`).test(stripe))
check('the reveal says the founder rate is capped', /first fifty|first 50/i.test(reveal), 'capped in code and in copy, per the non negotiables')

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
