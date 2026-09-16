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
// The first fix made it a flex child. Justin asked the better question,
// "wouldn't it have been better just to lift a little higher so above passport
// tab", so it lifts instead: bottom: calc(100% + 8px), measured from the BAR'S
// TOP EDGE rather than from the floor, with the page's own padding grown to
// match so nothing runs underneath it.
//
// ── AND THE SECOND HALF, THE SAME DAY ───────────────────────────────────────
//
// Justin sent another photo of the same bar, this time with "Passport" cut off
// at the right edge and the Moment label running out through its ring. Two
// causes, both invisible in the markup:
//
//   1. Every size in that row was rem, and rem follows the iOS text size dial
//      (shared/tokens.css sets `html { font: -apple-system-body }` on purpose).
//      The row is six fixed columns, so a label that grows does not wrap or
//      scroll, it paints over the edge of the phone. Measured on the harness
//      with the old sizes: 9 of 16 width and text size combinations overflowed,
//      and at 390px with the dial at 150 per cent "Passport" needed 72.8px in a
//      64.3px column.
//
//   2. The dashboard layout carries its own `.gc-dash .tab-item` font rule in
//      an inline style block. At 0,2,0 it outranks every `.tab-item` rule in
//      globals.css at 0,1,0, so the careful step downs measured at 430, 393,
//      375, 360 and 320 had never applied on a single dashboard route since the
//      day they were written. Dead code, and nothing said so.
//
// So the size is one token, --tab-label-size, capped with min() against vw,
// which the dial cannot lift, and every rule that sizes the row reads it.
//
// This guard holds those properties and nothing else, because they are what
// the two bugs turned on.
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

// ── THE ROW CANNOT BE STRETCHED BY THE TEXT DIAL ───────────────────────────
//
// Three files size this row and all three must read the same token, or one of
// them silently wins and the other two become the dead code described above.
const HARNESS = 'app/dev/tab-bar/page.tsx'

if (css) {
  const token = css.match(/--tab-label-size:\s*([^;]+);/)
  if (!token) {
    fail.push(`${CSS}: --tab-label-size is gone. It is the one place the tab label size is decided, and without it the layout's own rule silently wins and the step downs here become dead code.`)
  } else {
    const v = token[1].trim()
    if (!/\bmin\s*\(/.test(v)) {
      fail.push(`${CSS}: --tab-label-size is "${v}" with no min(). A bare rem follows the iOS text size dial, and this row is six fixed columns that cannot grow, so the label gets painted over the edge of the phone. Measured: 9 of 16 width and text size combinations overflowed before the cap.`)
    }
    if (!/\dvw/.test(v)) {
      fail.push(`${CSS}: --tab-label-size is "${v}" with no vw. The ceiling has to be in a unit the text dial cannot move, and vw is the only one tied to the room the row actually has. A px ceiling would fit a 430 phone and overflow a 320 one.`)
    }
  }

  // The Moment label sits in a circle that is a fixed 52px at every width, so
  // its ceiling is a flat px rather than a share of the viewport.
  const fabRule = css.match(/\.bottom-tab-bar\s+\.rightnow-fab\s*\{([\s\S]*?)\}/)
  if (fabRule) {
    const body = fabRule[1].replace(/\/\*[\s\S]*?\*\//g, '')
    const fs = body.match(/font-size:\s*([^;]+);/)
    if (!fs) {
      fail.push(`${CSS}: the Moment button sets no font-size inside the bar, so it inherits the 0.5625rem meant for the bigger floating circle and the word runs out through the ring.`)
    } else if (!/\bmin\s*\(/.test(fs[1])) {
      fail.push(`${CSS}: the Moment label is "${fs[1].trim()}" with no min(). Measured with a bare rem: 54.6px of label in a 52px circle at 150 per cent text, 72.8px at 200. The circle does not grow with the dial, so the label must not either.`)
    }
  }
}

// The layout: the rule that actually wins, so it must defer to the token.
{
  const layoutSrc = read(LAYOUT)
  const rule = layoutSrc.match(/\.gc-dash\s+\.tab-item\s*\{\s*font-size:\s*([^;}]+)/)
  if (!rule) {
    fail.push(`${LAYOUT}: the ".gc-dash .tab-item" font rule is gone. It is not a spare copy: the layout takes body zoom off the shell and sizes this row in real pixels instead, so without it the labels shrink by a fourteenth.`)
  } else if (!/var\(--tab-label-size\)/.test(rule[1])) {
    fail.push(`${LAYOUT}: ".gc-dash .tab-item" sets font-size to "${rule[1].trim()}" rather than var(--tab-label-size). At 0,2,0 this rule beats everything in globals.css, so a literal here is not a second opinion, it is the only one that counts, and it is how the label stayed 12px at 320px as well as at 430.`)
  }
}

// The harness: it exists to be the layout, and a harness that is only nearly
// the layout reports green about a screen nobody has.
{
  const harness = read(HARNESS)
  if (harness) {
    const rule = harness.match(/\.gc-dash\s+\.tab-item\s*\{\s*font-size:\s*([^;}]+)/)
    if (!rule) {
      fail.push(`${HARNESS}: the harness no longer sizes .tab-item, so it is measuring globals.css alone while a real phone gets the layout's rule instead. That gap is exactly why the overflow passed here and failed on Justin's phone.`)
    } else if (!/var\(--tab-label-size\)/.test(rule[1])) {
      fail.push(`${HARNESS}: the harness sizes the label as "${rule[1].trim()}" rather than var(--tab-label-size). It has to mirror the layout line for line or it is measuring a bar that does not ship.`)
    }
    if (!/RightNowButton/.test(harness)) {
      fail.push(`${HARNESS}: the Moment button is not mounted. It is the one control that sits ON the bar, and without it this harness cannot see the label running out of its own ring, which is half of what Justin photographed.`)
    }
  }
}

if (fail.length) {
  console.error('check-tab-bar-clear: something is sitting on a tab\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log("check-tab-bar-clear: the Moment button clears the bar, page content clears the button, and no label can be stretched off the edge by the text dial.")
