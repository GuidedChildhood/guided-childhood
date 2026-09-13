// THE BUYING DOCUMENTS HOLD TOGETHER.
//
// 13 September 2026: the schools site gained its terms, its privacy notice
// and its data processing agreement (schools/lib/legal/*.ts, drawn by
// components/LegalDocument.tsx). A school reads them before it buys, so
// this guard holds the things that would quietly make them wrong:
//
//   1. All three exist, carry the shared version line, read every company
//      fact from @gc/shared/legal rather than typing it, carry no dash, and
//      never name the old founder address (hello@ is the one address).
//   2. The privacy notice and the DPA name the same providers, and the four
//      the platform actually uses.
//   3. All three are open (OPEN_PATHS), in the sitemap and in the footer.
//   4. The data protection pack links to the DPA and the privacy notice.
//   5. No page in the schools app names the old address.
//   6. The terms read the pilot numbers from lib/pilot.ts, never as digits.
//
// Plain node, source reading: the content files import the shared package,
// which does not resolve outside the app, so the text is what is checked.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

let failed = false
const fail = (m) => { failed = true; console.error(`check-schools-legal: ${m}`) }
const read = (p) => readFileSync(p, 'utf8')

const DOCS = ['terms', 'privacy', 'dpa']
const PROVIDERS = ['Supabase', 'Vercel', 'Resend', 'Stripe']

// 1. The documents themselves.
for (const d of DOCS) {
  const p = `schools/lib/legal/${d}.ts`
  if (!existsSync(p)) { fail(`${p} is missing`); continue }
  const src = read(p)
  if (!/version: LEGAL_VERSION/.test(src) || !/dated: LEGAL_DATED/.test(src)) fail(`${p}: the version line must come from types.ts`)
  if (!src.includes("from '@gc/shared/legal'")) fail(`${p}: must read the company from @gc/shared/legal`)
  if (/17299814|Apple Acre|BS25|Winscombe/.test(src)) fail(`${p}: a company fact typed as a literal`)
  if (/thesocialbillboard|justin@/.test(src)) fail(`${p}: names an address other than hello@`)
  const dash = src.match(/[—–]| - /)
  if (dash) fail(`${p}: a dash in the copy ("${dash[0].trim() || 'spaced hyphen'}")`)
  const page = `schools/app/(legal)/${d}/page.tsx`
  if (!existsSync(page)) fail(`${page} is missing`)
}

// 2. The same providers in both documents.
if (existsSync('schools/lib/legal/privacy.ts') && existsSync('schools/lib/legal/dpa.ts')) {
  const priv = read('schools/lib/legal/privacy.ts')
  const dpa = read('schools/lib/legal/dpa.ts')
  for (const name of PROVIDERS) {
    if (!priv.includes(name)) fail(`the privacy notice does not name ${name}`)
    if (!dpa.includes(name)) fail(`the DPA does not name ${name}`)
  }
}

// 3. Open, listed, linked.
const access = read('schools/lib/access.ts')
const sitemap = read('schools/app/sitemap.ts')
const footer = read('schools/components/SiteFooter.tsx')
for (const d of DOCS) {
  if (!access.includes(`'/${d}'`)) fail(`/${d} is not in OPEN_PATHS`)
  if (!sitemap.includes(`/${d}\``)) fail(`/${d} is not in the sitemap`)
  if (!footer.includes(`'/${d}'`)) fail(`/${d} is not linked from the footer`)
}

// 4. The data pack points at both.
const pack = read('schools/app/hub/data-protection/page.tsx')
if (!pack.includes('href="/dpa"')) fail('the data protection pack does not link to /dpa')
if (!pack.includes('href="/privacy"')) fail('the data protection pack does not link to /privacy')

// 5. One address across the schools app.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (name !== 'node_modules' && name !== '.next') walk(p, out) }
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}
for (const p of [...walk('schools/app'), ...walk('schools/components'), ...walk('schools/lib')]) {
  if (read(p).includes('thesocialbillboard')) fail(`${p} names the old founder address`)
}

// 6. The pilot numbers come from lib/pilot.ts.
if (existsSync('schools/lib/legal/terms.ts')) {
  const terms = read('schools/lib/legal/terms.ts')
  if (!terms.includes('PILOT_PLACES') || !terms.includes('PILOT_TERM_WEEKS')) fail('the terms must read the pilot numbers from lib/pilot.ts')
  if (/first (five|5) schools|twelve weeks|12 weeks/i.test(terms)) fail('the terms type a pilot number that lib/pilot.ts owns')
}

if (failed) process.exit(1)
console.log('schools legal: three documents, open and linked, one address, no dashes, the same four providers.')
