#!/usr/bin/env node
// OUR LINK IS guidedchildhood.com.
//
// The .com is canonical (plans/go-live-domain-switch.md) and the .co.uk is a
// defensive registration that is meant to redirect to it. On 13 October 2026
// guidedchildhood.co.uk/starter-pack returned a 404, while the 19 October
// social week pack had that link at the foot of every Facebook post and in
// THIS-WEEK.md. A dead link under a post that asks a parent to do the stage
// check is the whole funnel failing quietly, and nothing would have told us.
//
// So this fails if our old .co.uk address comes back anywhere in the copy we
// ship: content/ and tools/social-cards. It matches OUR domain only. Schools,
// publishers and sources live on .co.uk too (the pilot send lists, research
// citations), and those are real addresses that must stay as they are.
//
// Node builtins only, so it runs anywhere with nothing installed.
//
//   node scripts/check-live-domain.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['content', 'tools/social-cards']
const OLD = /guidedchildhood\.co\.uk/i
const SKIP_DIRS = new Set(['node_modules', '.git'])

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* files(path)
    else yield path
  }
}

const hits = []
let checked = 0

for (const root of ROOTS) {
  for (const path of files(root)) {
    const buf = readFileSync(path)
    // Images and PDFs are skipped: a NUL byte means it is not text.
    if (buf.includes(0)) continue
    checked++
    buf.toString('utf8').split('\n').forEach((line, i) => {
      if (OLD.test(line)) hits.push(`${path}:${i + 1}  ${line.trim().slice(0, 140)}`)
    })
  }
}

if (hits.length > 0) {
  console.error('check-live-domain FAILED\n')
  for (const h of hits) console.error(`  ${h}`)
  console.error('\nOur link is guidedchildhood.com. The .co.uk returned a 404 on 13 October 2026.')
  console.error('Swap it for guidedchildhood.com (other organisations’ .co.uk addresses are fine).')
  process.exit(1)
}
console.log(`check-live-domain ok: ${checked} files in ${ROOTS.join(' and ')}, no guidedchildhood.co.uk links.`)
