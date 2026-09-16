#!/usr/bin/env node
// The guard on what every session reads before it does any work.
//
// CLAUDE.md is loaded automatically, and it sends every session to THE-STORY.md
// and plans/decisions.md at start and again after any compaction. Those files
// are therefore paid for on every turn of every session, and they are the
// reason the daily model limit was being reached by the afternoon: the
// decisions log alone had reached 1 MB, about 250,000 tokens.
//
// Budgets are in kilobytes, roughly four bytes to the token. Over budget is not
// a style note, it is a bill. The fix for the decisions log is
// `npm run roll-decisions`; the fix for the rest is to move the detail into a
// skill or a doc that loads only when the task needs it.

import { readFileSync, existsSync } from 'node:fs'

const BUDGETS = [
  { file: 'CLAUDE.md', kb: 12, why: 'loaded automatically on every session' },
  { file: 'THE-STORY.md', kb: 32, why: 'CLAUDE.md sends every session here first' },
  { file: 'plans/decisions.md', kb: 60, why: 'read at session start and after every compaction' },
  { file: 'review.md', kb: 16, why: 'read before every push' },
]

const rows = []
let over = 0
let total = 0

for (const b of BUDGETS) {
  if (!existsSync(b.file)) {
    rows.push({ ...b, kb_actual: 0, state: 'missing' })
    continue
  }
  const bytes = Buffer.byteLength(readFileSync(b.file))
  const kb = bytes / 1024
  total += bytes
  const state = kb > b.kb ? 'OVER' : 'ok'
  if (state === 'OVER') over++
  rows.push({ ...b, kb_actual: kb, state })
}

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('file', 28) + pad('size', 10) + pad('budget', 10) + 'state')
for (const r of rows) {
  console.log(pad(r.file, 28) + pad(r.kb_actual.toFixed(0) + ' KB', 10) + pad(r.kb + ' KB', 10) + r.state)
}
console.log(`\nevery session starts by reading ${(total / 1024).toFixed(0)} KB, about ${Math.round(total / 4000)}k tokens`)

if (over) {
  console.error(`\n${over} file(s) over budget:`)
  for (const r of rows.filter(r => r.state === 'OVER')) {
    console.error(`  ${r.file} is ${r.kb_actual.toFixed(0)} KB against a ${r.kb} KB budget (${r.why})`)
  }
  console.error('\nFor plans/decisions.md run: npm run roll-decisions')
  console.error('For the rest, move the detail into a skill or a doc that loads on demand.')
  process.exit(1)
}

console.log('within budget')
