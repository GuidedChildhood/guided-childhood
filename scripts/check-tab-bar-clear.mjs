// NOTHING SITS ON TOP OF A TAB.
//
// Justin, 16 September 2026, with a screenshot of the bottom bar:
// "Now button sits on top of Passport?"
//
// It did, at every width, and it always had. The bar is display: flex. The
// button was position: absolute with right: 12px, which takes it out of the
// flow entirely and parks it wherever 12px from the right happens to land.
// Measured on the dev harness before the fix:
//
//   390px  the button covered 54px of Passport's 64px
//   430px  it covered 54px of 72px
//   360px  it covered Passport AND clipped the edge of Scripts
//
// There was no width at which it did not sit on a tab, which is the tell that
// this was never a tuning problem. Nudging the offset is how this class of bug
// comes back on the next phone size.
//
// So the button is a flex child now: the bar reserves it a column and lays the
// tabs out in what is left. Nothing can overlap anything, because nothing is
// out of flow. This guard holds that, and nothing else, because that is the
// property the bug turned on.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const CSS = 'app/globals.css'
const BTN = 'components/rightnow/RightNowButton.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}

const css = read(CSS)
if (css) {
  // The rule that positions the button while it is inside the bar.
  const m = css.match(/\.bottom-tab-bar\s+\.rightnow-fab\s*\{([\s\S]*?)\}/)
  if (!m) {
    fail.push(`${CSS}: the ".bottom-tab-bar .rightnow-fab" rule is gone. Without it the button falls back to position: fixed, which drifts on an iPhone during scroll.`)
  } else {
    // Comments inside the block talk about the old absolute positioning, so
    // they have to come out before the declarations are read.
    const body = m[1].replace(/\/\*[\s\S]*?\*\//g, '')
    const pos = body.match(/position:\s*([a-z]+)/)
    if (pos && (pos[1] === 'absolute' || pos[1] === 'fixed')) {
      fail.push(`${CSS}: the button is position: ${pos[1]} inside the tab bar again. That takes it out of the flex row, so the bar lays out its tabs as if the button were not there and the button lands on top of whichever tab the offset happens to reach. It has to stay in the flow.`)
    }
    if (!/flex:\s*0\s+0/.test(body)) {
      fail.push(`${CSS}: the button no longer declares a flex basis, so the bar is not reserving it a column of its own. That is the whole fix: a reserved column is what makes an overlap impossible rather than unlikely.`)
    }
    // right: <length> is the old parking trick. right: auto is the undo of it.
    const right = body.match(/right:\s*([^;]+);/)
    if (right && !/auto/.test(right[1])) {
      fail.push(`${CSS}: the button sets right: ${right[1].trim()} inside the bar. Offsetting from the edge is exactly how it came to sit on Passport. Let the row place it.`)
    }
  }
}

// The name, which Justin asked for in the same message: the button adds a
// moment to the record, and "Now" never said so.
const btn = read(BTN)
if (btn) {
  const visible = btn.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  if (!/<span>Moment<\/span>/.test(visible)) {
    fail.push(`${BTN}: the bar button no longer reads "Moment". The word matters: it adds a moment to the record so tomorrow's check in can ask how it went, and "Now" said nothing about that.`)
  }
}

if (fail.length) {
  console.error('check-tab-bar-clear: something is sitting on a tab\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-tab-bar-clear: the Moment button has its own column and sits on no tab.')
