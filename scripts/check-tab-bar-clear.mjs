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
const LAYOUT = 'app/(dashboard)/dashboard/layout.tsx'

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
    // Comments inside the block recount the old positioning, so they have to
    // come out before the declarations are read.
    const body = m[1].replace(/\/\*[\s\S]*?\*\//g, '')

    // ── THE ONE RULE: THE CIRCLE CLEARS THE BAR'S TOP EDGE ────────────────
    //
    // Measured from the bar's own top edge with calc(100% + n), the button
    // cannot reach back down onto a tab however the bar is sized or however
    // many tabs it grows. Any other bottom value puts it back inside the row.
    const bottom = body.match(/bottom:\s*([^;]+);/)
    if (!bottom) {
      fail.push(`${CSS}: the button sets no bottom, so it sits wherever the bar's own box leaves it, which is on top of a tab.`)
    } else {
      const v = bottom[1].trim()
      const clears = /calc\(\s*100%\s*\+/.test(v)
      if (!clears) {
        fail.push(`${CSS}: bottom is "${v}". It has to be calc(100% + something), measured up from the bar's top edge, so the circle sits entirely ABOVE the row. calc(100% - n) pulls it back down INTO the bar, which is exactly how it came to cover 54px of Passport at every phone width.`)
      }
    }
  }

  // ── AND THE PAGE CLEARS THE CIRCLE ───────────────────────────────────────
  //
  // Lifting the button off the tabs moves the problem onto the page unless the
  // content stops short of it. Justin photographed that on 14 September: the
  // button sat on a product's price and on "Recommended for Andy". The bar is
  // 72, the gap is 8 and the circle is 52, so a page has to end 132 above the
  // floor. Anything less and the old screenshots come back.
  const layout = read(LAYOUT)
  const pad = layout.match(/paddingBottom:\s*'calc\((\d+)px \+ env\(safe-area-inset-bottom\)\)'/)
  if (!pad) {
    fail.push(`${LAYOUT}: could not read the main bottom padding, so there is no way to tell whether page content clears the Moment button.`)
  } else if (Number(pad[1]) < 132) {
    fail.push(`${LAYOUT}: main clears only ${pad[1]}px. The bar is 72, the gap is 8 and the circle is 52, so content needs 132 to stop short of the button. At ${pad[1]} a page's own words run underneath it, which is the fault Justin photographed on 14 September.`)
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
console.log("check-tab-bar-clear: the Moment button clears the bar, and page content clears the button.")
