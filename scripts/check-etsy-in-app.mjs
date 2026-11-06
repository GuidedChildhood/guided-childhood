// Is every Etsy download in the app?
//
// Justin, 6 November 2026: "all etsy downloads should be in app for free to
// child and parent." An Etsy pack is a folder in content/printables with a
// listing (listing/listing.md, or issue-N/listing for the Guided Times). Each
// one needs its app edition in public/printables (colour PDF, colour in PDF,
// card) and an entry in lib/printables/registry.ts, whose LOCAL_PRODUCTS
// overlay is what makes it free for the parent and the child.
//
// A new pack fails here until it is in the app, or until it is named below
// with the reason it has no app edition of its own. Build the app edition with
//   node content/printables/build-pack.mjs <pack> app
// then add the registry entry and its LOCAL_PRODUCTS line.
//
//   node scripts/check-etsy-in-app.mjs        (npm run etsy-in-app)

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKS = join(ROOT, 'content/printables')
const PUBLIC = join(ROOT, 'public/printables')
const REGISTRY = readFileSync(join(ROOT, 'lib/printables/registry.ts'), 'utf8')

// Folder name to app key, where the two differ. Everything else is the same
// on both sides.
const APP_KEY = {
  'calm-down-kit': 'calm-down-corner',
  'colour-splash-fish-tank': 'fish-tank-splash',
  'guided-times': 'guided-times-1',
}

// Listed on Etsy, deliberately no app edition. Every line says why.
const NOT_IN_APP = {
  'star-chart': 'pages of the Starter Pack, which is in the app, and the app has its own star chart builder',
  'guided-childhood-passport': 'the app has its own Passport, free and filled in with the child, at /dashboard/keepsakes/passport-print',
  'class-screen-promise': 'a classroom poster set for teachers, not a family sheet',
  'christmas-phone-bundle': 'a bundle of packs that are each in the app',
  'whole-system-bundle': 'a bundle of packs that are each in the app',
}

const listed = dir => existsSync(join(PACKS, dir, 'listing/listing.md'))
  || readdirSync(join(PACKS, dir), { withFileTypes: true }).some(d => d.isDirectory() && /^issue-\d+$/.test(d.name) && existsSync(join(PACKS, dir, d.name, 'listing')))

const failures = []
let inApp = 0
for (const d of readdirSync(PACKS, { withFileTypes: true })) {
  if (!d.isDirectory() || !listed(d.name)) continue
  if (NOT_IN_APP[d.name]) continue
  const key = APP_KEY[d.name] ?? d.name
  const missing = [`${key}-colour.pdf`, `${key}-colourin.pdf`, `${key}.png`].filter(f => !existsSync(join(PUBLIC, f)))
  if (missing.length) failures.push(`${d.name}: no ${missing.join(', ')} in public/printables`)
  if (!REGISTRY.includes(`key: '${key}'`)) failures.push(`${d.name}: no registry entry with key '${key}' in lib/printables/registry.ts`)
  if (!new RegExp(`'${key}'`).test(REGISTRY.slice(REGISTRY.indexOf('const LOCAL_PRODUCTS')))) failures.push(`${d.name}: '${key}' is not in LOCAL_PRODUCTS, so it is not served or free`)
  if (!missing.length) inApp++
}

if (failures.length) {
  for (const f of failures) console.log('FAIL ', f)
  console.log(`\n${failures.length} to fix. Every Etsy download is in the app, free for parent and child (see the header of this file).`)
  process.exit(1)
}
console.log(`PASS  all ${inApp} Etsy downloads are in the app, ${Object.keys(NOT_IN_APP).length} named exceptions`)
