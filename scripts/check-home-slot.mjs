#!/usr/bin/env node
// Home is the lead plus one: eight cards share one slot (lib/home/home-slot.ts).
// Usage: node --experimental-strip-types scripts/check-home-slot.mjs

import { readFileSync } from 'node:fs'
import { pickHomeSlot, SLOT_NEEDS, SLOT_ROTATION } from '../lib/home/home-slot.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const all = Object.fromEntries([...SLOT_NEEDS, ...SLOT_ROTATION].map(k => [k, true]))
check('a waiting question beats everything', pickHomeSlot(all, 3) === 'digiQuestion')
check('needs go in order', pickHomeSlot({ ...all, digiQuestion: false, catchup: false }, 3) === 'schoolWindow')

const quiet = Object.fromEntries(SLOT_ROTATION.map(k => [k, true]))
const seen = new Set([0, 1, 2, 3].map(d => pickHomeSlot(quiet, d)))
check('every suggestion gets a turn in four days', seen.size === SLOT_ROTATION.length, [...seen].join(', '))
check('a skipped one walks forward, not to nothing', pickHomeSlot({ digiWord: true }, 0) === 'digiWord')
check('nothing applies, no card', pickHomeSlot({}, 5) === null)
check('negative days still pick', SLOT_ROTATION.includes(pickHomeSlot(quiet, -3)))

// The page gates each of the eight on the slot, so a new render of one of
// them without the gate would put the stack back.
const page = readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8')
const CARDS = {
  digiQuestion: '<DigiQuestionCard', catchup: '<CatchupCard', schoolWindow: '<SchoolWindowCard',
  phoneBridge: '<PhoneBridgeCard', stickerNews: '<StickerNewsCard', schoolAhead: '<SchoolAheadCard',
  termPreview: '<TermPreviewCard', digiWord: '<DigiWordCard',
}
for (const [key, tag] of Object.entries(CARDS)) {
  const lines = page.split('\n').map((l, i) => [i, l]).filter(([, l]) => l.includes(tag))
  const gated = lines.every(([i]) => page.split('\n').slice(Math.max(0, i - 2), i + 1).join('\n').includes(`homeSlot === '${key}'`))
  check(`${tag.slice(1)} renders only on its slot day`, lines.length > 0 && gated)
}

if (failures) { console.error(`\n${failures} failed`); process.exit(1) }
console.log('\ncheck-home-slot ok')
