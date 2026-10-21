#!/usr/bin/env node
// EVERY PUBLIC PAGE IS IN THE SITEMAP, OR LEFT OUT ON PURPOSE.
//
// Found while building the gum SEO pass (21 October 2026, PR 1376): /passport,
// /five-questions, /evidence, /free and /free/planet-post were public,
// indexable marketing pages that app/sitemap.ts did not list. Google can still
// find a page through links, but the sitemap is the list we hand it, and the
// search report (npm run seo -- report) judges coverage against that list.
//
// So this fails when a page under app/(marketing) is neither in the sitemap
// nor on the exclusions below with its reason. Dynamic routes and pages that
// set index: false are skipped, since they are not ours to list.
//
// Node builtins only.
//
//   node scripts/check-sitemap-coverage.mjs

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const MARKETING = 'app/(marketing)'
const SITEMAP = 'app/sitemap.ts'

/** Left out on purpose. Each needs a reason a reader would accept. */
const EXCLUDED = {
  '/contact': 'legal and contact pages: linked from every footer, no search intent',
  '/privacy': 'legal and contact pages: linked from every footer, no search intent',
  '/terms': 'legal and contact pages: linked from every footer, no search intent',
  '/thanks': 'shown after an action, means nothing to a searcher',
  '/etsy-bonus': 'for Etsy buyers who already have the link in their order',
  '/investor': 'off the funnel, moving to its own subdomain (plans/domain-longterm.md)',
  '/investor-deck': 'off the funnel, moving to its own subdomain (plans/domain-longterm.md)',
  '/connectors/muse': 'connector documentation for Meta reviewers, not a parent page',
  '/digi-squad/lesson': 'an early lesson demo; the real lessons live in the child app',
}

function* pages(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* pages(path)
    else if (name === 'page.tsx') yield path
  }
}

const listed = new Set([...readFileSync(SITEMAP, 'utf8').matchAll(/path:\s*'([^']*)'/g)].map(m => m[1] || '/'))
const problems = []
let checked = 0

for (const file of pages(MARKETING)) {
  const route = '/' + relative(MARKETING, file).split(sep).slice(0, -1).join('/')
  if (route.includes('[')) continue
  const src = readFileSync(file, 'utf8')
  const layout = join(file, '..', 'layout.tsx')
  const noindex = /index:\s*false|noindex/.test(src) || (existsSync(layout) && /index:\s*false|noindex/.test(readFileSync(layout, 'utf8')))
  if (noindex) continue
  checked++
  if (listed.has(route) && EXCLUDED[route]) problems.push(`${route} is in the sitemap and also excluded; pick one`)
  else if (!listed.has(route) && !EXCLUDED[route]) problems.push(`${route} is public but not in ${SITEMAP}. Add it, or add it to EXCLUDED here with the reason.`)
}

for (const route of Object.keys(EXCLUDED)) {
  if (!existsSync(join(MARKETING, ...route.slice(1).split('/'), 'page.tsx'))) problems.push(`${route} is excluded but no longer exists; remove it from EXCLUDED`)
}

if (problems.length) {
  console.error(`sitemap-guard: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`sitemap-guard: ok, ${checked} public marketing pages, all listed or excluded on purpose`)
