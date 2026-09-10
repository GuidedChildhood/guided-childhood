// The add a job screen stays focused.
//
// Justin, 10 September 2026: "Quest job picker page needs to be super easy to
// use and add as page seems to have too much text please don't stop redesigning
// until super focussed on user easy to add."
//
// Before the redesign, /dev/add-job at 390 wide was 3554px and 487 words to add
// one job, because every row printed its title, then a three line reason, then
// "SET TO SCHOOL DAYS · TAP TO CHANGE" on two more. Fifteen of those is a wall.
//
// Explanation is the thing that grows back. Every one of those lines was added
// by somebody trying to be helpful, and each one on its own reads as helpful.
// This is what stops the fifteenth of them landing on a closed row.

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

const picker = readFileSync('components/quests/JobPicker.tsx', 'utf8')
const manage = readFileSync('app/(dashboard)/dashboard/quests/manage/ManageJobs.tsx', 'utf8')

// ── 1. The reason lives in the OPEN row, never on a closed one ──────────────
//
// job.why is good writing and it stays in the data. What it must not do is
// render fifteen times down a phone. The open block starts at the `open &&`
// guard, so a why outside that block is a why on every closed row.
const openBlock = picker.slice(picker.indexOf('{open && ('))
const closedPart = picker.slice(0, picker.indexOf('{open && ('))
if (/\{job\.why\}/.test(closedPart)) {
  fails.push('JobPicker renders {job.why} on the closed row. It belongs inside the open block, with the repeat chips.')
} else if (/\{job\.why\}/.test(openBlock)) {
  ok.push('the reason renders only on the open row')
} else {
  fails.push('JobPicker no longer renders {job.why} anywhere. It should still be there, one tap in.')
}

// ── 2. The repeat is a control, not an instruction ──────────────────────────
//
// Justin, earlier the same day, on "EVERY DAY · CHANGE": both halves read as
// options. The answer was words ("Set to Every day · tap to change") and then
// a pill carrying the value with a caret, which says the same two things
// without spending seven words a row on it. Either is honest; going back to a
// bare value with no affordance at all is not.
const hasPill = /aria-expanded=\{open\}/.test(picker) && /repeats \$\{whenSummary\}/.test(picker)
const hasWords = /tap to change/i.test(picker)
if (hasPill || hasWords) {
  ok.push(hasPill ? 'the repeat renders as a control with its current value' : 'the repeat still says how to change it')
} else {
  fails.push('The repeat on a row no longer says it can be changed. It needs the pill with the caret, or the words back.')
}

// ── 3. Nothing on this screen explains at length ───────────────────────────
//
// A word ceiling would be arbitrary, so this measures the two blocks that
// actually ran long: the picker's subtitle and the composer's help sentence
// on the add page.
const sub = picker.match(/Tap \+ and it lands on [^<]*/)
// The ternary picking app or board is one word to a reader, so the braces
// collapse to a single token before counting.
const subWords = sub ? sub[0].replace(/\{[^}]*\}/g, 'x').trim().split(/\s+/).length : 0
if (!sub) {
  fails.push('The picker subtitle changed shape. Keep it to one short line saying where the job goes.')
} else if (subWords > 12) {
  fails.push(`The picker subtitle is ${subWords} words. It was two lines once and it grew back. Keep it under twelve.`)
} else {
  ok.push('the picker subtitle is one short line')
}

const help = manage.match(/help="([^"]*)"/)
if (!help) {
  fails.push('The composer help on the add page is gone entirely. One short line is right, none is not: it is where "worth one star" is said.')
} else if (help[1].split(/\s+/).length > 14) {
  fails.push(`The composer help is ${help[1].split(/\s+/).length} words: "${help[1]}". It was thirty one once. Keep it under fourteen.`)
} else {
  ok.push('the composer help is one short line')
}

// ── 4. White on the house gold, which measures 2.6 to 1 ────────────────────
if (/color: '#fff'[\s\S]{0,120}background: open \? 'var\(--terracotta/.test(picker)) {
  fails.push('White text on the house gold. It measures 2.6 to 1. Ink on gold is the house pairing.')
} else {
  ok.push('no white on the house gold')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
