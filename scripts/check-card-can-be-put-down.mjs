// EVERY CARD ON HOME CAN BE PUT DOWN.
//
// Found 18 September 2026, reading the code rather than a screen.
//
// components/digi/DigiPrompts.tsx renders ONE card at a time, newest first,
// with "N more when you want them" underneath. That is a good rule and it
// rests entirely on every card being clearable, because an unclearable card
// does not just fail on its own, it blocks every card queued behind it.
//
// A follow up card was not clearable. The Dismiss button lives in the row
// beside the card's link, and a follow up renders its three verdict buttons
// INSTEAD of that row, so the only way past it was to deliver a verdict on
// advice you may not have managed to try. On the test data one sat on top of
// a celebration from the same day, which is the shape of the bug: the good
// news was queued behind a question that could not be answered or refused.
//
// Nothing caught it. It typechecks, it renders, and it looks complete on the
// screen. You only see it by asking "and what if I do not want to answer",
// which is not a question a build step knows to ask. So it is asked here.
//
// Three rules:
//
//   A  the follow up branch is handed a way out, and it is a real dismiss
//      rather than a handler that only closes the card in local state, which
//      would look identical on screen and bring the card back on refresh
//   B  the answering component renders that way out
//   C  the other branch keeps the Dismiss it already had
//
// Node builtins only: the concern-guards job runs no npm ci.
//
//   node scripts/check-card-can-be-put-down.mjs

import { readFileSync } from 'node:fs'

const FILE = 'components/digi/DigiPrompts.tsx'
const fail = []
const ok = []

let src = ''
try { src = readFileSync(FILE, 'utf8') } catch { fail.push(`${FILE} is missing`) }
// Comments blanked, so no rule is satisfied by the note explaining it.
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ').replace(/^\s*\/\/.*$/gm, ' ')

// ── A: the follow up card is handed a way out, wired to the real dismiss ────
const handed = code.match(/onNotNow=\{([^}]*)\}/)
if (!handed) {
  fail.push(`A: the follow up card is not handed a way out. It is the only card whose branch replaces the row holding Dismiss, so without one it cannot be cleared and it blocks every card queued behind it.`)
} else if (!/dismiss\(p\.id\)/.test(handed[1])) {
  fail.push(`A: the follow up's way out does not call dismiss(p.id), so the card would clear on screen and come back on the next load. That is worse than no exit, because the parent believes they have dealt with it.`)
} else ok.push('A: the follow up card is handed the real dismiss')

// ── B: and the component actually renders it ────────────────────────────────
const start = code.indexOf('function FollowUpAnswer')
const body = start === -1 ? '' : code.slice(start)
if (!body) fail.push(`B: ${FILE} no longer has the answering component`)
else if (!/onNotNow:\s*\(\)\s*=>\s*void/.test(body)) fail.push('B: the answering component does not accept a way out')
else if (!/onClick=\{onNotNow\}/.test(body)) fail.push('B: the answering component accepts a way out and never renders it, so the prop is passed into nothing and the card is still a dead end')
else ok.push('B: the answering component renders the way out')

// ── C: and the ordinary card keeps the one it always had ────────────────────
if (!/onClick=\{\(\) => \{ setOpen\(false\); dismiss\(p\.id\) \}\}/.test(code)) {
  fail.push('C: the ordinary card has lost its Dismiss, so now nothing on Home can be cleared')
} else ok.push('C: the ordinary card keeps its Dismiss')

if (fail.length) {
  console.error('check-card-can-be-put-down FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log(`check-card-can-be-put-down: ${ok.length} rules hold. Every card on Home can be put down, so nothing blocks the queue behind it.`)
