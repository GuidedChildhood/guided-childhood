#!/usr/bin/env node
// THE MAP MUST SAY WHICH DOORS OPEN.
//
// The curriculum map is public on purpose (lib/access.ts, Justin's decision of
// 30 August 2026: a free progression is how a scheme becomes the standard).
// The lessons behind it are not. So the map lists twenty five modules of which
// a visitor with no code can open exactly one, and if the cards do not say
// which, every tap is a small broken promise.
//
// This existed and was not caught for four days. The card's own comment said
// "twenty two doors to /unlock and one that opens, with nothing saying which",
// and then rendered the chip only when `pilotSet` was truthy, which is only
// true for a pilot school. A visitor with no code, which is nearly everyone,
// saw twenty four identical gold "Ready to teach" buttons and every one of
// them bounced. Justin found it by looking at the page (18 September 2026).
//
// A comment describing a bug is not a guard. This is.
import { readFileSync } from 'node:fs'

const page = readFileSync('schools/app/curriculum/page.tsx', 'utf8')
const access = readFileSync('schools/lib/access.ts', 'utf8')
const code = page.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

let bad = 0
const ok = (name, cond, why = '') => {
  if (!cond) { bad++; console.error(`  FAIL  ${name}${why ? '\n        ' + why : ''}`) }
  else console.log(`  pass  ${name}`)
}

ok('the lessons are not on the open map',
  !/OPEN_PATHS[\s\S]*?'\/lesson/.test(access),
  "a '/lesson' entry in OPEN_PATHS would give the catalogue away")

ok('the map itself IS open',
  /OPEN_PATHS[\s\S]*?'\/curriculum'/.test(access),
  'the free progression is the sales argument; if this fails somebody walled it by accident')

ok('the state chip does not require a pilot code',
  !/\{\s*pilotSet\s*&&\s*live\s*&&/.test(code),
  'gating the chip on pilotSet is the exact bug: no code, no chip, no warning')

ok('a visitor with no code is told a licence is needed',
  code.includes('Licence needed'),
  'the card must name what is missing')

ok('a locked card does not promise teaching',
  code.includes('Unlock this lesson'),
  '"Ready to teach" on a card that bounces to /unlock is a promise the tap cannot keep')

ok('the open case still says ready to teach',
  code.includes('Ready to teach'),
  'a lesson the school actually has should read as ready, not as a door')

ok('one function answers it, so chip and button cannot disagree',
  /const opens\s*=/.test(code) && (code.match(/opens\(m\.moduleId\)/g) || []).length >= 2,
  'two separate conditions drift apart; that is how this broke the first time')

ok('the taster is still named as free',
  code.includes('Free sample') && code.includes('isTasterModule'),
  'the one module anybody can open must be the one that says so')

if (bad) { console.log(`\n${bad} failed. The map is public; the cards must say which doors open.`); process.exit(1) }
console.log('\nPASS  every curriculum card states whether it opens')
