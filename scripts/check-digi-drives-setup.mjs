// DiGi drives setup, then hands over to the day.
//
// Justin, 10 September 2026: "the first thing is digi up which I like and leads
// then through platform so says let's set up and can this drive then to the day
// routines then pop up after and driven reach step?"
//
// Everything this needs already existed and none of it was joined up. Home knew
// the four setup steps, which were done and which was current. DiGi already
// came up first and already ended on one thing with a button. They simply did
// not know about each other, so a brand new family met a warm greeting that
// pointed at the daily loop while four unfinished steps sat on a page they had
// to go and find.
//
// Three rules, and every one of them is a line away from quietly coming undone:
//
//   1. HOME HANDS THE STEP OVER. Drop `setup` from the guide and DiGi falls
//      back to the daily loop with no error anywhere.
//   2. SETUP COMES FIRST WHILE THERE IS ANY LEFT. If the button reads nextTask
//      before setup, a family with four steps outstanding gets sent to the
//      check in instead.
//   3. AND IT ENDS. digiSetup must be null once setup is complete, or DiGi
//      keeps asking a finished family to finish.
//
// Usage: node scripts/check-digi-drives-setup.mjs

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

// Comments are not code: an earlier guard on this repo stayed green because the
// comment explaining a prop outlived the prop.
const code = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => (l.trim().startsWith('//') ? '' : l)).join('\n')

const home = code(readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8'))
const sheet = code(readFileSync('components/digi/DigiWelcomeSheet.tsx', 'utf8'))

// ── 1. Home hands the step over ────────────────────────────────────────────
if (!/setup:\s*digiSetup/.test(home)) {
  fails.push("Home no longer passes `setup` to DiGi, so the greeting is back to pointing at the daily loop while setup sits unfinished on another page.")
} else {
  ok.push('Home hands DiGi the one setup step still to do')
}

const built = home.match(/const digiSetup =[\s\S]{0,420}?\n\n/)
if (!built) {
  fails.push('digiSetup is gone from Home. It is what turns the setup flags into the step DiGi names.')
} else if (!/setupComplete\s*\n?\s*\?\s*null/.test(built[0])) {
  fails.push('digiSetup no longer returns null once setup is complete, so DiGi would keep asking a finished family to finish setting up.')
} else if (!/doneCount|setupDoneCount/.test(built[0])) {
  fails.push('digiSetup carries no count, so DiGi cannot say which step of how many this is. A job with a visible end is the one a tired parent starts.')
} else {
  ok.push('and it stops the moment setup is finished')
}

// ── 2. The sheet puts setup first ──────────────────────────────────────────
if (!/guide\?\.setup/.test(sheet)) {
  fails.push('The welcome sheet no longer reads guide.setup, so it cannot drive setup at all.')
} else {
  ok.push('DiGi reads the setup step')
}

// The ACTION button's push, not the first router.push in the file: the sheet
// has another one behind the chat input, and matching that read as a pass
// while the button itself was sending everybody to the daily task.
const action = sheet.split('\n').find(l => /close\(\);\s*router\.push\(/.test(l))
if (!action) {
  fails.push('The action button on the sheet no longer routes anywhere.')
} else if (!/guide\.setup\s*\?\?\s*guide\.nextTask/.test(action)) {
  fails.push('The button no longer prefers the setup step over the daily task, so a family with four steps outstanding is sent to the check in instead.')
} else {
  ok.push('and the button takes setup first, the day second')
}

// ── 3. It comes back when a step lands ─────────────────────────────────────
if (!/setupMoved/.test(sheet)) {
  fails.push("DiGi no longer returns when a setup step is finished. \"Pop up after and driven reach step\" is the half that makes it a walk rather than a single nudge.")
} else if (!/SETUP_SEEN_KEY/.test(home)) {
  fails.push("Home's pre sheet cover no longer tests the same key the sheet does, so the sheet arrives after a finished step with no cover and Home flashes underneath it.")
} else {
  ok.push('DiGi comes back when a step lands, and the cover comes with it')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
