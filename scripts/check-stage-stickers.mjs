// The passport's Planet Friend stickers, checked without a database
// (17 November 2026, plans/2026-11-17-passport-stickers-plan.md).
//
// What would make the paper and the app disagree again is pinned here:
//   a sticker that is not that stage's Planet Friend, or art that is not the
//     approved file in public/digi-squad/friends
//   the rule promising something the stamp does not read (moments, stars,
//     balance, outside time, the timer): lib/pathway/stamped.ts reads lessons,
//     talks and the big check, and nothing else
//   a dash in a line a child will stick in their book
//   "Stage done, sticker added to your passport" said differently on the two sides
//   the order card or the shop going back to the shop photographs
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-stage-stickers.mjs

import { readFileSync, existsSync } from 'node:fs'
import { STAGE_STICKERS, PAPER_RULE, ruleLines, STAGE_DONE_LINE } from '../lib/pathway/stage-stickers.ts'
import { STAGE_PAGES, STAGE_IDS } from '../shared/stage-map.ts'
import { pageCount } from '../lib/pathway/page-count.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n      ${detail}`}`)
  if (!ok) failures++
}

check('five stickers, one per stage, in order', STAGE_STICKERS.length === 5 && STAGE_STICKERS.every((s, i) => s.n === i + 1))
check('each sticker is the stage\'s Planet Friend', STAGE_STICKERS.every((s, i) => s.friend === STAGE_PAGES[STAGE_IDS[i]].stamp),
  STAGE_STICKERS.map(s => s.friend).join(', '))
check('each sticker uses the approved art', STAGE_STICKERS.every(s => s.img.startsWith('/digi-squad/friends/') && existsSync(`public${s.img}`)))

const DASH = /[‒–—―]|\s-\s/
const copy = [PAPER_RULE, STAGE_DONE_LINE, ...STAGE_STICKERS.map(s => s.learnt)]
check('no dash in any sticker line', copy.every(t => !DASH.test(t)), copy.find(t => DASH.test(t)) ?? '')

const NOT_IN_THE_RULE = /moment|star|balance|outside|timer|minute|streak/i
const sample = ruleLines(pageCount({ lessonsDone: 3, lessonsTotal: 9, scriptsDone: 1, scriptsTotal: 3 }, false), 'Teo')
check('the rule is lessons, talks and the big check, nothing else', sample.map(l => l.key).join(',') === 'lessons,scripts,check'
  && !sample.some(l => NOT_IN_THE_RULE.test(l.label)) && !NOT_IN_THE_RULE.test(PAPER_RULE))
const noTalks = ruleLines(pageCount({ lessonsDone: 2, lessonsTotal: 2, scriptsDone: 0, scriptsTotal: 0 }, true), 'Teo')
check('a page with no talks drops that line, and a full page reads all done', noTalks.length === 2 && noTalks.every(l => l.done))

const read = p => readFileSync(p, 'utf8')
check('the child\'s stamp moment uses the same line', read('components/kid/KidStickers.tsx').includes('STAGE_DONE_LINE'))
check('the parent\'s stamp push uses the same line', read('app/api/kid/stage-quiz/route.ts').includes('STAGE_DONE_LINE'))
check('the order card draws the passport and stickers, no shop photo', !/\/shop\/(passport_printed|sticker_sheet)/.test(read('components/passport/PassportOrderCard.tsx'))
  && read('components/passport/PassportOrderCard.tsx').includes('PassportCover'))
check('the shop draws the passport and stickers', read('components/shop/Shop.tsx').includes("product.key === 'passport_printed'"))
check('no "Digital Literacy Passport" title on paper', !/Digital Literacy<br/.test(read('components/pathway/PassportZineSheet.tsx') + read('app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx')))

const rb = read('lib/pathway/record-book-server.ts')
check('the record book lists only what the stamp counts (lessons, talks, the check)', /kind: 'lesson' \| 'talk' \| 'check'/.test(rb)
  && !/concerns|quest_ticks|device_sessions|outside/.test(rb.replace(/\/\/.*$/gm, '')))
check('the record book reads passes through childLessonPath and talks through countsTowardPathway', rb.includes('loadChildLessonPath') && rb.includes('countsTowardPathway'))

const ev = read('lib/content/readiness.ts')
check('the passport never claims to be proven to make children safer', !/proven to (make|keep)|makes children safer\b(?! yet)/i.test(ev.replace(/\/\/.*$/gm, '').replace('What no study shows yet is that a programme like this makes children safer', '')))
check('the evidence keeps the verifier\'s corrections (skills go with more risk, enabling with more opportunities)', /met more online risk, not less/.test(ev) && /fewer risks but also fewer opportunities/.test(ev))

if (failures) { console.log(`\n${failures} failed`); process.exit(1) }
console.log('\nall passed')
