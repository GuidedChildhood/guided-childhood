// The child can always reach the tabs, and the bar does not drift on an iPhone.
//
// Justin, 15 September 2026, with a photo of the child's bar: "maybe as with
// the parents app we should fix these tabs to the bottom of the child's app so
// they can always navigate."
//
// It was `position: sticky, top: 0`, rendered 2,250 lines down KidQuestScreen,
// under the five a day, the mission, the tiles and six more blocks. Sticky to
// the TOP only sticks once you have scrolled the element to the top, so on
// opening the app a child never saw it: reaching Lessons or Printables meant
// scrolling most of a screen looking for a bar you had to already know was
// there. It is the other half of "quests not easy to get to on child app".
//
// ── THE IPHONE TRAP THIS ALSO PINS ─────────────────────────────────────────
//
// shared/tokens.css zooms body by 1.07. Safari positions a FIXED element
// inside a zoomed ancestor against the unzoomed viewport while laying it out
// in zoomed coordinates, so it drifts further up the screen the further you
// scroll. That is exactly what happened to the PARENT's bar, twice in one
// morning (see .bottom-tab-bar in app/globals.css).
//
// So fixing the child's bar to the floor is only safe with the same cure: the
// bar is portalled to body, body is unzoomed while the screen is mounted, and
// the page zooms itself instead. Take any one of those away and the bar is
// back to sliding around a real child's phone, which no typecheck can see.
//
//   node scripts/check-kid-tabbar.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => { try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null } }

const bar = read('components/kid/KidTabBar.tsx')
const screen = read('app/k/[token]/KidQuestScreen.tsx')

if (bar === null) problems.push('components/kid/KidTabBar.tsx is missing')
else if (/position:\s*'sticky'/.test(bar)) {
  problems.push("the child's tab bar is sticky again. It is rendered near the bottom of the longest screen in the product, so sticky means a child never sees it on opening the app.")
} else if (!/position:\s*'fixed'/.test(bar) || !/bottom:\s*0/.test(bar)) {
  problems.push("the child's tab bar is not fixed to the bottom, so it is only reachable by scrolling to wherever it happens to sit")
} else if (!/createPortal\(/.test(bar)) {
  problems.push('the bar is fixed but not portalled out of the page. body carries zoom 1.07, and a fixed element under a zoomed ancestor drifts up an iPhone as it scrolls: the exact fault the parent bar had twice in one morning.')
} else if (!/env\(safe-area-inset-bottom/.test(bar)) {
  problems.push('the bar does not clear the home indicator, so its bottom row is cut off on any iPhone with one')
} else {
  ok.push("the child's bar is fixed to the floor, portalled out of the zoom, and clears the home indicator")
}

if (screen === null) problems.push('app/k/[token]/KidQuestScreen.tsx is missing')
else if (!/body\s*\{\s*zoom:\s*1;?\s*\}/.test(screen)) {
  problems.push('the child screen no longer unzooms body, so the portalled bar has a zoomed ancestor again and will drift on an iPhone')
} else if (!/\.gc-kid-page\s*\{\s*zoom:/.test(screen)) {
  problems.push('body is unzoomed but the page does not zoom itself, so the whole child app is suddenly 7 percent smaller than it was designed to be')
} else if (!/env\(safe-area-inset-bottom/.test(screen)) {
  problems.push('the page does not pad for the fixed bar, so the last card on the screen sits underneath it and cannot be reached')
} else {
  ok.push('the child screen unzooms body, zooms itself, and pads for the bar')
}

if (problems.length > 0) {
  console.error('check-kid-tabbar FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for the iPhone drift this prevents.')
  process.exit(1)
}
console.log('check-kid-tabbar ok: the child can always reach the tabs')
for (const line of ok) console.log('  ' + line)
