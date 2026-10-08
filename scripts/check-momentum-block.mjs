// The momentum block keeps three promises: every nugget has a named source, a
// family is not shown the same line twice in a row, and the block can only
// ride an email, never add one.
//
// Justin, 7 October 2026: successes, expert nuggets, why it works and a line
// for the parent, "automated, not too often". Not too often is the six day
// floor in lib/email/floor.ts, and the block stays out of it entirely.
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-momentum-block.mjs

import { readFileSync } from 'node:fs'
import {
  WHY_IT_WORKS, FOR_THE_PARENT, pickWhy, pickSupport, pickNugget, bandWordOf, weekOf, NUGGET_MAX_CHARS,
} from '../lib/email/momentum.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const dashed = s => /[–—]|\s-\s/.test(s)
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── THE REGISTRIES ──────────────────────────────────────────────────────────
check('at least six reasons it works', WHY_IT_WORKS.length >= 6, String(WHY_IT_WORKS.length))
check('at least five lines for the parent', FOR_THE_PARENT.length >= 5, String(FOR_THE_PARENT.length))
check('no dashes in any line', [...WHY_IT_WORKS, ...FOR_THE_PARENT].every(x => !dashed(x.line) && !dashed(x.cta ?? '')))
check('every line is one breath, not a paragraph', [...WHY_IT_WORKS, ...FOR_THE_PARENT].every(x => x.line.length <= 240),
  String(Math.max(...[...WHY_IT_WORKS, ...FOR_THE_PARENT].map(x => x.line.length))))
check('keys are unique', new Set([...WHY_IT_WORKS, ...FOR_THE_PARENT].map(x => x.key)).size === WHY_IT_WORKS.length + FOR_THE_PARENT.length)
check('every parent line has somewhere to go', FOR_THE_PARENT.every(x => x.cta && x.href))
check('the shouting and losing it lines go to the repair script', FOR_THE_PARENT.filter(x => /shout|losing/.test(x.key)).every(x => x.href === 'repair'))
check('no line carries a number it cannot source', [...WHY_IT_WORKS, ...FOR_THE_PARENT].every(x => !/\d+\s*(%|percent|in\s+\d)/i.test(x.line)))

// ── THE ROTATION ────────────────────────────────────────────────────────────
const weeks = [...Array(14).keys()]
check('consecutive weeks get different reasons', weeks.slice(1).every(w => pickWhy(w).key !== pickWhy(w - 1).key))
check('every reason comes round', new Set(weeks.map(w => pickWhy(w).key)).size === WHY_IT_WORKS.length)
check('consecutive weeks get different parent lines', weeks.slice(1).every(w => pickSupport(w, 'r').key !== pickSupport(w - 1, 'r').key))
check('the repair token is resolved to the page the caller found', pickSupport(0, 'https://x/repair').href !== 'repair' && FOR_THE_PARENT.some((s, i) => pickSupport(i, 'https://x/repair').href === 'https://x/repair'))
check('a negative week still picks', !!pickWhy(-3).key && !!pickSupport(-3, 'r').key)
check('the week is a count of weeks', weekOf(new Date('2026-10-07T12:00:00Z')) === Math.floor(Date.parse('2026-10-07T12:00:00Z') / (7 * 86400000)))

// ── THE NUGGET ──────────────────────────────────────────────────────────────
const rows = [
  { id: 'b', source_name: 'Prof A', finding: 'Sleep first.', url: 'https://example.org/a', topics: ['sleep'], age_bands: ['4-7'] },
  { id: 'a', source_name: 'Dr B', finding: 'Phones at the table.', url: null, topics: ['phone'], age_bands: [] },
  { id: 'c', source_name: '', finding: 'An unsourced claim.', url: null, topics: ['sleep'], age_bands: ['4-7'] },
  { id: 'd', source_name: 'Prof D', finding: 'x'.repeat(NUGGET_MAX_CHARS + 1), url: null, topics: ['sleep'], age_bands: ['4-7'] },
  { id: 'e', source_name: 'Prof E', finding: 'Teens and sleep.', url: 'ftp://no', topics: ['sleep'], age_bands: ['13-15'] },
]
const ctx = { topics: ['sleep'], ageBands: ['4-7'] }
check('a nugget without a source is never shown', weeks.every(w => pickNugget(rows, ctx, w)?.source !== ''))
check('a paragraph is not a nugget', weeks.every(w => !pickNugget(rows, ctx, w)?.finding.startsWith('xxxx')))
check('on topic and on age wins', pickNugget(rows, ctx, 0)?.finding === 'Sleep first.')
check('an age band the family does not have is skipped', weeks.every(w => pickNugget(rows, ctx, w)?.finding !== 'Teens and sleep.'))
check('with no worry on topic, any sourced finding for the age', pickNugget(rows, { topics: ['gaming'], ageBands: ['4-7'] }, 0) !== null)
check('an untagged age band reaches every age', pickNugget(rows, { topics: ['phone'], ageBands: ['16+'] }, 0)?.finding === 'Phones at the table.')
check('a link that is not http is dropped, the finding kept', pickNugget([rows[4]], { topics: ['sleep'], ageBands: ['13-15'] }, 0)?.url === null)
check('nothing fits, nothing shown', pickNugget([rows[2], rows[3]], ctx, 0) === null)
const two = [rows[0], rows[1]]
check('the week walks the pool', pickNugget(two, { topics: [], ageBands: [] }, 0)?.finding !== pickNugget(two, { topics: [], ageBands: [] }, 1)?.finding)
check('and the same week is the same nugget', pickNugget(two, { topics: [], ageBands: [] }, 5)?.finding === pickNugget(two, { topics: [], ageBands: [] }, 5)?.finding)
check('band words are the check in words', [1, 2, 3, 4, 5].map(bandWordOf).join(' | ') === 'really tough | hard going | up and down | getting there | going great')

// ── THE WIRE, AND THE FLOOR ─────────────────────────────────────────────────
const momentum = code(readFileSync('lib/email/momentum.ts', 'utf8'))
check('the block never sends or logs', !/sendEmail|email_log|\.insert\(|\.update\(|\.upsert\(/.test(momentum))
const floor = readFileSync('lib/email/floor.ts', 'utf8')
check('the six day floor is untouched', /export const MIN_DAYS_BETWEEN_PROGRAMME_EMAILS = 6/.test(floor))
const weekly = code(readFileSync('app/api/cron/weekly-review/route.ts', 'utf8'))
check('the Sunday review builds the block and passes it', /buildMomentum\(admin/.test(weekly) && /momentum(, openWorries)? \}\)/.test(weekly))
const monthly = code(readFileSync('app/api/email/monthly/route.ts', 'utf8'))
check('the monthly review builds the block for each child', /buildMomentum\(supabase/.test(monthly) && (monthly.match(/progress, momentum \}\)/g) ?? []).length === 2)
const templates = code(readFileSync('lib/email/templates.ts', 'utf8'))
check('both templates draw the block', /momentum \? momentumHtml\(momentum\)/.test(templates) && (templates.match(/momentumBlock \+/g) ?? []).length === 2)
check('the block sits under the successes, not above them', templates.indexOf('momentum ? momentumHtml') > templates.indexOf('movement && movement.length > 0'))
check('the monthly review speaks in band words, not star counts', !/reached five stars/.test(templates) && /bandWordOf\(progress\.biggestMover\.from\)/.test(templates))
check('the source sits beside every nugget', /\$\{m\.nugget\.source\}/.test(templates))
// review.md 4a: a comparison is said in words, never as two numbers. The
// Sunday review's movement block said "5 to 8" until 7 October 2026.
check('the Sunday review says what moved in band words, not two numbers',
  /holding at \$\{bandWordOf\(bandOf\(m\.to\)\)\}/.test(templates) && /bandWordOf\(bandOf\(m\.from\)\)\} to \$\{bandWordOf\(bandOf\(m\.to\)\)\}/.test(templates) && !/\$\{m\.from\} to \$\{m\.to\}/.test(templates))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
