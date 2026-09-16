// EVERY DOOR INTO A TIMER WARNS INSIDE A PROTECTED WINDOW.
//
// Justin, 16 September 2026, choosing between warn, ignore and block:
// "warn me, never stop me."
//
// There are three ways a timer starts: the child starts one themselves, the
// parent starts one for them, and the parent approves an ask the child already
// sent. The first two checked the protected window. The third did not, and it
// is the one most likely to be tapped without looking, because the ask arrives
// while the parent is doing something else.
//
// This guard holds two things that are easy to lose:
//
//  1. All three doors still consult checkProtectedWindow. Adding a fourth
//     without it would be silent, because nothing fails when a warning is
//     simply absent.
//  2. The warning stays a WARNING. The yes button must still be reachable
//     when the window is on. A future tidy that wraps the buttons inside the
//     same condition as the warning would turn our heads up into a block,
//     which is the one thing the product must never do.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const DOORS = [
  ['app/api/quests/time/start/route.ts', 'the child starting a timer themselves'],
  ['app/api/quests/time/parent-start/route.ts', 'the parent starting one for them'],
  ['app/api/quests/time/active/route.ts', "the feed the parent's approve card reads"],
]
const CARD = 'components/quests/AskPopup.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// 1. EVERY DOOR CONSULTS THE WINDOW.
for (const [file, why] of DOORS) {
  const src = strip(read(file))
  if (!src) continue
  if (!/checkProtectedWindow\s*\(/.test(src)) {
    fail.push(`${file}: does not call checkProtectedWindow. This is ${why}, and a door that does not check is a door that starts a timer inside bedtime without a word.`)
  }
}

// 2. THE CARD SHOWS IT, AND THE YES SURVIVES IT.
const card = strip(read(CARD))
if (card) {
  // A property READ, not the bare word: the type declaration on the Kid above
  // spells protectedNow too, so searching for the word alone passes happily on
  // a card that declares the field and never looks at it.
  if (!/\.protectedNow/.test(card)) {
    fail.push(`${CARD}: no longer reads protectedNow, so the parent approves inside a rest window with nothing said. The warning has to arrive BEFORE the tap; the approve route can only answer after it, by which point the timer is running and the stars are spent.`)
  }
  // The yes must not live inside the warning's condition. If the only place
  // "approved" is answered sits after a protectedNow test that wraps it, the
  // heads up has quietly become a gate.
  const guarded = /protectedNow\s*(\?|&&)[\s\S]{0,400}?answer\('approved'\)/.test(card)
  if (guarded) {
    fail.push(`${CARD}: the yes button now sits inside the protectedNow condition, which turns the warning into a block. We never block a parent: they get the facts and they still get their one tap.`)
  }
  if (!/answer\('approved'\)/.test(card)) {
    fail.push(`${CARD}: the approve button is gone entirely.`)
  }
}

if (fail.length) {
  console.error('check-approve-warning: a timer door lost its heads up\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-approve-warning: all three doors check the window, and the yes is still one tap.')
