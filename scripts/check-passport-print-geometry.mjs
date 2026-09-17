// A PASSPORT THAT CANNOT FIT ON THE PAPER IS NOT A KEEPSAKE.
//
// Justin, 16 September 2026, with a photo of the keepsakes print page: "this
// needs to be premium and ability to print and put together." It could not be
// printed at all, and nothing in the repo could have told him.
//
// Measured before anything was written. Rendered in print media and turned
// into a real PDF:
//
//   the fold at home A4 sheet   297 by 210mm  came out 317.8 by 224.7mm, 2 pages
//   the A6 file a printer gets  105 by 148mm  came out 112.35 by 158.36mm, clipped
//
// TWO CAUSES, BOTH INVISIBLE TO A TYPECHECK.
//
//   1. THE 7 PER CENT IS A ZOOM. shared/tokens.css zooms body by 1.07; the
//      dashboard shell turns that off on body and puts the same 1.07 on
//      `.gc-dash > main`. Zoom applies on paper too, and both print routes
//      live inside that main. Every millimetre went to the printer 7 per cent
//      too big. Seven other printables already reset it. These did not.
//
//   2. CHROME SHIPS WITH BACKGROUND GRAPHICS OFF. Every colour on this
//      booklet is a CSS background, so without print-color-adjust the cover
//      comes out as a white sheet with pale gold text on it.
//
// AND THE MARGIN IS A TRAP THE OTHER WAY. A zine's creases are the paper's
// own quarters, so the page margin has to be zero and the sheet has to stay
// the full 297 by 210: inset the artwork to make room and every fold moves
// with it. The room a home printer needs is held inside the panels instead,
// on the sides that meet the paper's edge, which is what the safe area vars
// do. A guard that only watched the margin would happily wave through the
// fix that ruins the fold.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const STYLE = 'lib/pathway/passport-print-style.ts'
const ZINE = 'app/(dashboard)/dashboard/keepsakes/passport-print/zine/page.tsx'
const BOOK = 'app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx'
const SHEET = 'components/pathway/PassportZineSheet.tsx'
const REF = 'app/ref-passport-zine/page.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
// These files explain the bug in full in their own comments, quoting the very
// strings this guard looks for. They come out before anything is read as
// code, or the guard passes on its own explanation.
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── 1. THE SHARED RESET STILL DOES THE THREE THINGS IT EXISTS FOR ───────────
const style = read(STYLE)
if (style) {
  const reset = code(style).match(/PASSPORT_PRINT_RESET\s*=\s*`([\s\S]*?)`/)
  if (!reset) {
    fail.push(`${STYLE}: PASSPORT_PRINT_RESET is gone. It is the one place the print rules for both editions live, and without it each route reinvents them, which is how one of them ends up 7 per cent too big again.`)
  } else {
    const r = reset[1]
    if (!/\.gc-dash\s*>\s*main[^{]*\{[^}]*zoom:\s*1\s*!important/.test(r) || !/\bbody\b[^{]*\{[^}]*zoom:\s*1\s*!important/.test(r)) {
      fail.push(`${STYLE}: the reset no longer sets zoom to 1 on both body and .gc-dash > main. tokens.css zooms body by 1.07 and the dashboard shell moves that same 1.07 onto main, so a sheet that misses either one goes to the printer 7 per cent too big and spills onto a second page.`)
    }
    // The unprefixed one is read with a lookbehind, because
    // `-webkit-print-color-adjust` CONTAINS `print-color-adjust`: a plain
    // check passed happily with the standard property set to economy and
    // only the prefixed one still exact. Caught in mutation testing.
    if (!/(?<!-)\bprint-color-adjust:\s*exact\s*!important/.test(r) || !/-webkit-print-color-adjust:\s*exact\s*!important/.test(r)) {
      fail.push(`${STYLE}: the reset no longer forces print-color-adjust. Chrome ships with Background graphics off, and every colour on this booklet is a CSS background, so the burgundy cover prints as a blank white sheet with pale gold text on it.`)
    }
    if (!/\.gc-dash\s*>\s*main[^{]*\{[^}]*padding-bottom:\s*0\s*!important/.test(r)) {
      fail.push(`${STYLE}: the reset no longer clears main's padding-bottom. It is calc(132px plus the safe area) for the tab bar, which adds about 35mm of nothing after the sheet and pushes it onto another page.`)
    }
  }
}

// ── 2. EVERY SURFACE THAT PRINTS THE PASSPORT USES IT ───────────────────────
// The fixture included: a fixture printing under different rules from the
// real route cannot catch a print fault, and this one could not. It is also
// the only place either sheet can be measured without a login.
for (const [file, what] of [[ZINE, 'the fold at home sheet'], [BOOK, 'the A6 file the printer gets'], [REF, 'the ref fixture, which is where this gets measured']]) {
  const src = read(file)
  if (!src) continue
  if (!/\$\{PASSPORT_PRINT_RESET\}/.test(code(src))) {
    fail.push(`${file}: ${what} does not use PASSPORT_PRINT_RESET in its print block. Whatever it prints is not what this guard checks, and the zoom is the fault nobody sees until the paper comes out.`)
  }
}

// ── 3. THE ZINE IS THE WHOLE PAPER, AND THE SAFE AREA IS INSIDE THE PANELS ──
const zine = read(ZINE)
if (zine) {
  const atPage = code(zine).match(/@page\s*\{([^}]*)\}/)
  if (!atPage || !/size:\s*A4 landscape/.test(atPage[1])) {
    fail.push(`${ZINE}: the print page is no longer A4 landscape. The imposition is four panels across and two down on one landscape sheet.`)
  } else if (!/margin:\s*0\s*;/.test(atPage[1])) {
    fail.push(`${ZINE}: the print page has a margin on it again. A zine folds on the paper's own quarters, so a margin does not give the artwork room, it moves every crease: a 285mm sheet centred on A4 throws both quarter folds 4.5mm out. The room a printer needs is held inside the panels instead.`)
  }
}

const sheet = read(SHEET)
if (sheet) {
  const bare = code(sheet)
  if (!/width:\s*'297mm',\s*height:\s*'210mm'/.test(bare)) {
    fail.push(`${SHEET}: the sheet is no longer a true 297mm by 210mm. Shrinking it is the tempting fix for a sheet that overflows and it is the wrong one, because the panels stop being the paper's own quarters and nothing folds true.`)
  }
  // The safe area, and the rotation it has to survive. The top row prints
  // upside down, so a panel's own top is the paper's bottom: held on the
  // wrong side, exactly half the book loses its margin.
  if (!/const SAFE_PAD = 'var\(--zp-t\) var\(--zp-r\) var\(--zp-b\) var\(--zp-l\)'/.test(bare)) {
    fail.push(`${SHEET}: the faces no longer pad themselves from the safe area variables. With the page margin at zero, that padding is the only thing keeping a child's own words off the part of the paper a home printer cannot reach.`)
  }
  if (!/upside\s*\?[\s\S]{0,180}top:\s*paper\.bottom[\s\S]{0,120}left:\s*paper\.right/.test(bare)) {
    fail.push(`${SHEET}: the safe area is no longer swapped for the upside down row. The top row prints rotated 180 degrees, so its own top is the paper's bottom, and without the swap half the book holds its margin on the inside edge and runs off the outside one.`)
  }
  if (!/safeArea\(i,\s*upside\)/.test(bare)) {
    fail.push(`${SHEET}: the panels are not given their safe area. The helper can be as right as it likes; this is the line that puts the padding on the paper.`)
  }
  if (!/\[25,\s*50,\s*75\]\.map/.test(bare)) {
    fail.push(`${SHEET}: the fold ticks at the quarters are gone. They are the one thing that still folds a true book when a printer driver scales the job anyway, which it does without asking.`)
  }
  if (/\bBURGUNDY\b(?!_FLAT)/.test(bare)) {
    fail.push(`${SHEET}: the gradient burgundy is back on a printed face. lib/pathway/passport-print-style.ts has warned since it was written that it bands on paper, and a banded cover is the opposite of the premium this object is charging for. BURGUNDY_FLAT is the same colour, flat.`)
  }
}

const book = read(BOOK)
if (book && /\bBURGUNDY\b(?!_FLAT)/.test(code(book))) {
  fail.push(`${BOOK}: the gradient burgundy is back on the cover of the file a commercial printer receives. It bands on paper, which is the one place this file is ever seen.`)
}

// ── 4. NO DASHES, HOUSE RULE ────────────────────────────────────────────────
for (const file of [ZINE, BOOK, SHEET, STYLE, REF]) {
  const src = read(file)
  const dashes = src.match(/[‐-―−]/g)
  if (dashes) {
    fail.push(`${file}: ${dashes.length} dash character${dashes.length === 1 ? '' : 's'} in the file. No dashes in any copy, ever.`)
  }
}

if (fail.length) {
  console.error('check-passport-print-geometry: the printed passport does not fit the paper\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-passport-print-geometry: both editions print at their true size, in colour, with the fold left on the paper\'s own quarters.')
