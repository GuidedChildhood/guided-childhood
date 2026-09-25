// Homework help, checked without a database or a model (25 September 2026).
//
// Justin's lines, each pinned here because each is easy to lose in a later
// change that looks like an improvement:
//   "as long as the child does not access the LLM version"
//     under 10 never reaches the model, and nobody gets a chat
//   "photos yes, not kept"
//     the homework, typed or photographed, is never written anywhere
//   the hint is a hint: the model is told never to give the answer, and a
//   reply it cannot vouch for as safe becomes "talk to your grown up"
//
// Usage: node --experimental-strip-types scripts/check-homework-help.mjs

import { readFileSync } from 'node:fs'
import { mayHaveHints, parseHintCard, ageOn, HINTS_FROM_AGE, MAX_HINT_LEVEL } from '../lib/homework/help.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const read = p => readFileSync(p, 'utf8')
const ON = new Date(Date.UTC(2026, 8, 25))

// ── WHO GETS HINTS ──────────────────────────────────────────────────────────
check('hints start at ten', HINTS_FROM_AGE === 10)
check('a child who turned ten yesterday gets hints', mayHaveHints('2016-09-24', null, ON))
check('a child who turns ten tomorrow does not', !mayHaveHints('2016-09-26', null, ON))
check('ageOn counts birthdays properly', ageOn('2016-09-26', ON) === 9 && ageOn('2016-09-25', ON) === 10)
check('no birthday and the 8 to 10 band is a no: a nine year old must not reach the model',
  !mayHaveHints(null, '8-10', ON))
check('no birthday and 11 to 13 is a yes', mayHaveHints(null, '11-13', ON))
check('no birthday and no band is a no', !mayHaveHints(null, null, ON))
check('three hints at most', MAX_HINT_LEVEL === 3)

// ── WHAT A CHILD CAN BE SHOWN ───────────────────────────────────────────────
const card = parseHintCard('noise {"safe": true, "subject": "Maths", "about": "Fractions — of amounts", "hint": "Start with the bottom number", "try_this": "What is 24 ÷ 8?"} noise')
check('a good reply parses', !!card && card.safe && card.subject === 'Maths')
check('dashes never reach the child', !!card && !/[-–—]/.test(card.about), card?.about)
check('a reply with no safe flag is treated as NOT safe', parseHintCard('{"hint": "x"}')?.safe === false)
check('garbage is refused rather than shown', parseHintCard('not json at all') === null)

// ── THE ROUTE ───────────────────────────────────────────────────────────────
const route = read('app/api/kid/homework-help/route.ts')
check('the age gate runs on the server, before the model is called',
  /if \(!mayHaveHints\(dob, band\)\)/.test(route) && route.indexOf('mayHaveHints(dob, band)') < route.indexOf('callDigi({'))
check('asking the grown up never calls the model',
  route.indexOf("body?.mode === 'grownup'") < route.indexOf('callDigi({') && !/mode === 'grownup'[\s\S]{0,900}callDigi\(/.test(route))
check('the model is told never to give the answer', /NEVER give the answer/.test(route))
check('a worrying message becomes a grown up, not a hint', /"safe": false/.test(route) && /if \(!card\.safe\)/.test(route))
check('the homework is never stored: the only write is the daily count',
  !/\.insert\(/.test(route) && (route.match(/\.upsert\(/g) ?? []).length === 1 && /kid_homework_help_uses/.test(route))
check('curriculum ids are revalidated against the list we sent', /allowed\.has\(i\)/.test(route))
check('there is a daily cap', /takeUse\(admin, link\.child_id\)/.test(route))

// ── THE SCREEN ──────────────────────────────────────────────────────────────
const ui = read('components/kid/HomeworkHelp.tsx')
check('no chat: one box for the homework, and no message history',
  (ui.match(/<textarea/g) ?? []).length === 1 && !/messages\b/.test(ui))
check('the child is told their photo and question are not kept', /not kept/.test(ui))
const kidScreen = read('app/k/[token]/KidQuestScreen.tsx')
check('the school week is one line to homework help, not a job with stars',
  /data-school-week-line/.test(kidScreen) && !/recordSchoolWeek/.test(kidScreen))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
