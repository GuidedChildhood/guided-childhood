#!/usr/bin/env node
// TWO REMINDERS A DAY: every scheduled nudge passes nudge: true.
//
// lib/push/nudge-cap.ts holds the ceiling, and it only holds if every cron
// that invites a parent back asks for a slot. A new parent send added to one of
// these files without the flag would quietly go over the cap, and nothing else
// would notice. So: in each file below, every sendPush( call that is not to a
// child's device must carry nudge: true.
//
// Node builtins only.   node scripts/check-nudge-cap.mjs

import { readFileSync } from 'node:fs'

const NUDGES = [
  'app/api/push/cron/route.ts',
  'app/api/push/reengage/route.ts',
  'app/api/cron/trial-pushes/route.ts',
  'app/api/cron/settings-nudge/route.ts',
  'app/api/cron/lesson-drip/route.ts',
  'app/api/cron/age-up/route.ts',
  'app/api/cron/weekly-review/route.ts',
]

/** Every sendPush( call's argument text, up to its matching bracket. */
function calls(src) {
  const out = []
  let at = 0
  while ((at = src.indexOf('sendPush(', at)) !== -1) {
    let depth = 0
    let i = at + 'sendPush'.length
    for (; i < src.length; i++) {
      if (src[i] === '(') depth++
      else if (src[i] === ')' && --depth === 0) break
    }
    const line = src.slice(0, at).split('\n').length
    out.push({ line, text: src.slice(at, i + 1) })
    at = i
  }
  return out
}

const misses = []
let counted = 0
for (const file of NUDGES) {
  const src = readFileSync(file, 'utf8')
  for (const c of calls(src)) {
    if (/import\s/.test(c.text) || /audience:\s*'kids'/.test(c.text)) continue
    counted++
    if (!/nudge:\s*true/.test(c.text)) misses.push(`${file}:${c.line}`)
  }
}

if (misses.length || counted === 0) {
  console.error('check-nudge-cap FAILED\n')
  for (const m of misses) console.error(`  ${m}  a parent nudge without nudge: true`)
  if (counted === 0) console.error('  no parent sends found at all: the file list is stale')
  console.error('\nEvery scheduled parent nudge counts toward the two a day ceiling (lib/push/nudge-cap.ts).')
  process.exit(1)
}
console.log(`check-nudge-cap ok: ${counted} scheduled parent nudges all count toward the two a day ceiling.`)
