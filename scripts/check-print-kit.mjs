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
//   5. The paper pack fits its paper: every lesson's growing sheets are
//      within the room last measured in a real PDF, on the layout measured.
//
// Plain node, source reading, like check-schools-legal.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { BASELINE, layoutHash, packWords, roomFor } from './lib/print-pack-words.mjs'

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

// 2. One worksheet reader, and the Reception answer is faces, not a writing line.
for (const file of ['schools/app/print/[module]/page.tsx', 'schools/app/print/[module]/booklet/page.tsx']) {
  const src = read(file)
  if (!src.includes("from '@/lib/worksheet'")) fail(`${file} does not read worksheet cards through lib/worksheet`)
  if (/notes\.worksheet_items \?\? \[\]/.test(src)) fail(`${file} still reads worksheet_items raw`)
  // The design council, 14 September 2026: a Reception verdict card is three
  // faces to point at, never tick boxes and a BECAUSE line a four year old
  // cannot use. `young ? (<BigChoice` is the branch that keeps it so.
  if (!/young \? \(\s*(verdicts\.length > 0 && )?<BigChoice/.test(src)) fail(`${file} does not give Reception the faces to point at`)
}
// 2b. The teacher one pager reads the safeguarding note before anything else.
{
  const src = read('schools/app/print/[module]/page.tsx')
  const dsl = src.indexOf('label="Safeguarding note"'), objective = src.indexOf('label="Objective"')
  if (dsl < 0 || objective < 0 || dsl > objective) fail('the teacher one pager does not put the safeguarding note above the objective')
  if (!src.includes('startCard &&')) fail('the pack prints a start card with no question to remember')
}
// 2c. The footer sits at the foot of an A4 sheet, not under the last card.
{
  const m = kit.match(/minHeight: '(\d+)mm'/)
  if (!m || Number(m[1]) < 265) fail('PrintSheet is shorter than the printable height of A4, so the footer floats')
}

// 3. The passport print out.
//
// The fold itself moved to shared/zine.ts on 16 September 2026, when the
// parents app started folding the child's own passport the same way. These
// rules follow it there: two apps, one description of the fold, and this is
// the check that the description is still sane.
const fold = read('shared/zine.ts')
const words = read('schools/lib/passport-print.ts')
const top = [...fold.matchAll(/ZINE_TOP: number\[\] = \[([^\]]+)\]/g)][0]?.[1]
const bottom = [...fold.matchAll(/ZINE_BOTTOM: number\[\] = \[([^\]]+)\]/g)][0]?.[1]
const panels = `${top ?? ''},${bottom ?? ''}`.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n)).sort((a, b) => a - b)
if (panels.join(',') !== '1,2,3,4,5,6,7,8') fail(`the fold must place the eight pages once each, found ${panels.join(',')}`)
if (!/ZINE_BOTTOM: number\[\] = \[[^\]]*\b1\]/.test(fold)) fail('the cover (page 1) must sit bottom right, upright')
// The schools app must still get its fold from there rather than growing a
// second copy, which is the failure this move could otherwise introduce.
if (!/from '@gc\/shared\/zine'/.test(words)) fail('the schools app no longer takes its fold from shared/zine.ts')
for (const stage of ['foundation', 'builder', 'shaper', 'independent']) {
  if (!new RegExp(`stage: '${stage}', friend: '[a-z]+'`).test(words)) fail(`the ${stage} edition has no friend`)
}
if (!/FOLD_STEPS = \[/.test(fold) || (fold.match(/^  'Fold|^  'Open/gm) ?? []).length < 3) fail('the fold steps are missing')
const stagePage = read('schools/app/print/passport/[stage]/page.tsx')
for (const piece of ['ZINE_TOP.map', 'ZINE_BOTTOM.map', "rotate(180deg)", 'single_action_outcome', '<Sticker', '<Stamp', 'A4 landscape']) {
  if (!stagePage.includes(piece)) fail(`the passport sheet lost ${piece}`)
}
// One sticker per ring, matched by number: the ring beside each lesson line
// and the sticker on sheet B both carry `n={l.n}`. A sticker with a lesson
// title and no ring to match was the Reception teacher's first must fix.
if ((stagePage.match(/n=\{l\.n\}/g) ?? []).length < 2) fail('the passport rings and stickers are not matched by number')
if (stagePage.includes('label="Well done"')) fail('the sticker sheet still carries Well done stars with no ring to go in')
{
}
if (!read('schools/app/print/page.tsx').includes('href="/print/passport"')) fail('the print room does not link the passport print out')
if (!read('schools/app/hub/passport/page.tsx').includes('href="/print/passport"')) fail('the hub passport page does not link the print out')

// 4. No dashes in the words.
for (const file of [KIT, 'schools/lib/passport-print.ts', 'schools/app/print/passport/page.tsx', 'schools/app/print/passport/[stage]/page.tsx']) {
  const dash = read(file).match(/[—–]/)
  if (dash) fail(`${file}: a dash in the copy`)
}

// 5. THE PAPER PACK FITS ITS PAPER (12 October 2026).
//
// Thirteen of the 34 packs printed a sheet onto a second page: four teacher
// one pagers, two KS1 start and exit card sheets and ten parent notes (some
// packs had two). Whether a sheet fits is decided by the browser's font
// metrics, which only scripts/check-print-pack-fit.mjs can read, in a real
// PDF. It records, for the three sheets whose words grow with the lesson, the
// room it measured and the characters the sheet printed. CI cannot print, so
// it holds the line from that record: a lesson that grew past the measured
// room, a lesson never measured, or a change to the kit or the pack page
// since the measuring all fail here and name the one command that measures
// again. Nothing is estimated as fitting that was not seen fitting.
{
  const again = 'Measure again with `node scripts/check-print-pack-fit.mjs --write-baseline` (setup in its header) and commit the record.'
  const SHEET = { teacher: 'teacher one pager', cards: 'start and exit card sheet', parent: 'parent note' }
  const base = existsSync(BASELINE) ? JSON.parse(read(BASELINE)) : null
  if (!base) fail(`${BASELINE} is missing, so nothing says the paper pack fits its paper. ${again}`)
  else if (base.layout !== layoutHash()) fail(`the print kit or the pack page changed since every pack was last measured on paper (${BASELINE}). ${again}`)
  else {
    for (const f of readdirSync('content/modules').filter(f => f.endsWith('.json'))) {
      const lesson = JSON.parse(read(`content/modules/${f}`))
      const was = base.lessons?.[lesson.module_id]
      if (!was) { fail(`${lesson.module_id}: its paper pack has never been measured on paper. ${again}`); continue }
      const now = packWords(lesson)
      for (const kind of Object.keys(SHEET)) {
        const grew = now[kind] - was[kind].chars
        if (grew > roomFor(kind, was[kind].spare)) fail(`${lesson.module_id}: the ${SHEET[kind]} prints ${grew} more characters than when it was measured with ${was[kind].spare}px to spare, which may run it onto a second page. ${again}`)
      }
    }
  }
  // And it is never made to fit by shrinking the words past reading. The
  // teacher sheets stepped down to 12px (9pt) to fit; below that a one pager
  // is read with a squint. The pupil registers are the kit's own and are
  // not a lever for fitting at all.
  const pack = read('schools/app/print/[module]/page.tsx')
  const tt = pack.match(/const tt: React\.CSSProperties = \{[^}]*fontSize: '([\d.]+)px'/)
  if (!tt || Number(tt[1]) < 12) fail('the teacher sheets set their words below 12px, 9pt on paper; fit the sheet by layout, not by shrinking the type')
}

if (failed) process.exit(1)
console.log('print kit: the friend on every sheet, one worksheet reader, the passport folds to eight pages with the cover bottom right, no dashes, every paper pack within the room measured on paper.')
