// THE PRINT KIT HOLDS ON EVERY SHEET.
//
// 14 September 2026: every printable in the schools app went onto one print
// kit (schools/components/print/kit.tsx) so the key stage's Planet Friend is
// on every sheet in colour and the register decides the sizes. This guard
// keeps that true as sheets are added or edited:
//
//   1. Every print route draws through the kit: the friend on the page.
//   2. The two worksheet readers are the one reader (both data shapes).
//   3. The passport print out: eight panels numbered once each, four
//      editions with a friend each, the fold steps present, and the print
//      room and the hub passport page linking to it.
//   4. No dash in the kit's or the passport's words.
//
// Plain node, source reading, like check-schools-legal.

import { readFileSync, existsSync } from 'node:fs'

let failed = false
const fail = (m) => { failed = true; console.error(`check-print-kit: ${m}`) }
const read = (p) => readFileSync(p, 'utf8')

const KIT = 'schools/components/print/kit.tsx'
if (!existsSync(KIT)) { fail(`${KIT} is missing`); process.exit(1) }
const kit = read(KIT)
for (const piece of ['export function FriendHeader', 'export function FriendStrip', 'export function FriendArt', 'export function PrintSheet', 'export function Sticker', 'export function Stamp', 'export function printRegister', 'export function friendFor']) {
  if (!kit.includes(piece)) fail(`the kit lost ${piece}`)
}

// 1. Every sheet draws the friend.
const SHEETS = {
  'schools/app/print/[module]/page.tsx': ['FriendHeader', 'FriendStrip'],
  'schools/app/print/[module]/booklet/page.tsx': ['FriendArt', 'FriendStrip'],
  'schools/app/print/[module]/organiser/page.tsx': ['FriendHeader'],
  'schools/app/print/[module]/record/page.tsx': ['FriendHeader'],
  'schools/app/print/[module]/overview/page.tsx': ['FriendHeader'],
  'schools/components/QuizSheet.tsx': ['FriendHeader'],
  'schools/app/print/page.tsx': ['FriendArt'],
}
for (const [file, pieces] of Object.entries(SHEETS)) {
  if (!existsSync(file)) { fail(`${file} is missing`); continue }
  const src = read(file)
  if (!src.includes("from '@/components/print/kit'")) fail(`${file} does not draw through the print kit`)
  for (const piece of pieces) if (!src.includes(`<${piece}`)) fail(`${file} does not place ${piece}`)
}
for (const q of ['starter-quiz', 'exit-quiz']) {
  const src = read(`schools/app/print/[module]/${q}/page.tsx`)
  if (!src.includes('keyStage={lesson.key_stage}') || !src.includes('characterCast={lesson.character_cast}')) fail(`${q} does not pass the friend to the quiz sheet`)
}

// 2. One worksheet reader.
for (const file of ['schools/app/print/[module]/page.tsx', 'schools/app/print/[module]/booklet/page.tsx']) {
  const src = read(file)
  if (!src.includes("from '@/lib/worksheet'")) fail(`${file} does not read worksheet cards through lib/worksheet`)
  if (/notes\.worksheet_items \?\? \[\]/.test(src)) fail(`${file} still reads worksheet_items raw`)
}

// 3. The passport print out.
const words = read('schools/lib/passport-print.ts')
const top = [...words.matchAll(/ZINE_TOP: number\[\] = \[([^\]]+)\]/g)][0]?.[1]
const bottom = [...words.matchAll(/ZINE_BOTTOM: number\[\] = \[([^\]]+)\]/g)][0]?.[1]
const panels = `${top ?? ''},${bottom ?? ''}`.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n)).sort((a, b) => a - b)
if (panels.join(',') !== '1,2,3,4,5,6,7,8') fail(`the fold must place the eight pages once each, found ${panels.join(',')}`)
if (!/ZINE_BOTTOM: number\[\] = \[[^\]]*\b1\]/.test(words)) fail('the cover (page 1) must sit bottom right, upright')
for (const stage of ['foundation', 'builder', 'shaper', 'independent']) {
  if (!new RegExp(`stage: '${stage}', friend: '[a-z]+'`).test(words)) fail(`the ${stage} edition has no friend`)
}
if ((words.match(/^  '/gm) ?? []).length < 4 && !/FOLD_STEPS = \[/.test(words)) fail('the fold steps are missing')
const stagePage = read('schools/app/print/passport/[stage]/page.tsx')
for (const piece of ['ZINE_TOP.map', 'ZINE_BOTTOM.map', "rotate(180deg)", 'single_action_outcome', '<Sticker', '<Stamp', 'A4 landscape']) {
  if (!stagePage.includes(piece)) fail(`the passport sheet lost ${piece}`)
}
if (!read('schools/app/print/page.tsx').includes('href="/print/passport"')) fail('the print room does not link the passport print out')
if (!read('schools/app/hub/passport/page.tsx').includes('href="/print/passport"')) fail('the hub passport page does not link the print out')

// 4. No dashes in the words.
for (const file of [KIT, 'schools/lib/passport-print.ts', 'schools/app/print/passport/page.tsx', 'schools/app/print/passport/[stage]/page.tsx']) {
  const dash = read(file).match(/[—–]/)
  if (dash) fail(`${file}: a dash in the copy`)
}

if (failed) process.exit(1)
console.log('print kit: the friend on every sheet, one worksheet reader, the passport folds to eight pages with the cover bottom right, no dashes.')
