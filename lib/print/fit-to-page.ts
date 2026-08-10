// Make every printable sheet fit the page it is printed on.
//
// Justin, 10 August 2026, with a photo of the iOS print sheet showing page 4 of
// 7 nearly empty: "this print pack has messy pages that don't fit."
//
// ── What was actually wrong ──────────────────────────────────────────────────
//
// Measured before touching anything, at the width a printer really uses rather
// than at a desktop viewport: the offline game pack is 13 sheets and printed as
// 18 pages, because 5 sheets were taller than one page. A sheet that is 1.06
// pages long does not print as a slightly full page. It prints as a full page
// plus a second page carrying an inch of board game and nothing else, and the
// parent throws that one away. That is the near empty page in his photo.
//
// The first attempt at this was to hand tighten the padding and type on the
// sheets that overflowed. That fixes today's pack and quietly breaks again the
// next time somebody writes a sheet, which is the wrong shape of fix for a
// thing that grows.
//
// ── What it does instead ─────────────────────────────────────────────────────
//
// Before the print dialog opens, each sheet is laid out at the real printable
// width and shrunk, in 5% steps, until it fits one page. A sheet that already
// fits is not touched at all, so most sheets print exactly as designed.
//
// It uses CSS zoom rather than transform: scale on purpose. transform paints
// smaller but leaves the layout box full size, so the browser still breaks the
// page in the old place and the sheet is scaled AND split. zoom changes the
// layout, so the page break sees the smaller sheet.
//
// The sheet is pinned to the printable width while it is zoomed, which is the
// part that took the longest to get right. Left to itself a zoomed block reflows
// into the extra room it now has, and the snakes and ladders board barely moved:
// its squares are a fifth of the sheet width by aspect ratio, so widening the
// sheet grew the board by exactly as much as the zoom shrank it. At 40% it had
// come down from 1430px to 1019. Holding the width fixed makes the shrink
// uniform, the sheet lands smaller and centred on the page, and one measurement
// per sheet is enough because the height is now simply proportional.
//
// Measuring is the part that has to be honest: the numbers are read with the
// zoom actually applied and the container held at the printable width, so what
// is measured is what the printer lays out, not an approximation of it.

/** A4 less a 10mm @page margin, in CSS px at 96dpi. */
export const PRINT_W = 718
export const PRINT_H = 1047

/**
 * How small a sheet is allowed to go.
 *
 * A sheet that needs less than this is not a sheet with a layout problem, it is
 * a sheet with too much on it, and shrinking it further would print something a
 * child cannot read. Better to let that one overflow and be visibly wrong to
 * whoever wrote it than to ship unreadable paper to a family.
 */
const FLOOR = 0.6

/**
 * Fit every `.craft-sheet` inside `pack` onto a single printed page.
 *
 * Synchronous and self cleaning: it borrows the container's width for the
 * measurements and puts it back before returning, inside one frame, so nothing
 * is ever painted in the measuring state.
 *
 * Returns the scale chosen for each sheet, which is what the check script
 * asserts on.
 */
export function fitSheetsToPage(pack: HTMLElement | null, selector = '.craft-sheet'): number[] {
  if (!pack) return []
  const sheets = Array.from(pack.querySelectorAll<HTMLElement>(selector))
  if (sheets.length === 0) return []

  const held = { width: pack.style.width, maxWidth: pack.style.maxWidth, padding: pack.style.padding }
  // The printable box, with none of the screen page's own gutters in the way.
  pack.style.width = `${PRINT_W}px`
  pack.style.maxWidth = `${PRINT_W}px`
  pack.style.padding = '0'

  // Body carries zoom: 1.07 for readability, so a CSS px inside the app is not
  // a px on the page: asking for 718 got a box 768 wide, every sheet was
  // measured 7% roomier than the paper, and five sheets were waved through as
  // fitting when they did not. Ask the browser what it actually gave us and
  // correct for it, rather than hard coding a number that a future readability
  // change would silently invalidate.
  const scale = pack.getBoundingClientRect().width / PRINT_W
  const cssW = scale > 0 ? PRINT_W / scale : PRINT_W
  if (Math.abs(scale - 1) > 0.001) {
    pack.style.width = `${cssW}px`
    pack.style.maxWidth = pack.style.width
  }
  // And with the screen only furniture out of the way as well. A sheet carries
  // an award stars button that never prints, and measuring with it still in
  // place made every sheet read taller than the page will ever see, which is
  // the same wrong answer as measuring at the wrong width.
  pack.classList.add('print-measuring')

  const chosen = sheets.map(el => {
    const heldWidth = el.style.width
    el.style.width = `${cssW}px`

    let fit = 1
    // Downwards in 5% steps rather than straight to the ratio. The step is
    // there because the very first measurement can still move a little as
    // fonts settle, and because a 5% grid is a size somebody can read off the
    // page and reason about, where 0.7326 is not.
    for (;;) {
      el.style.zoom = fit === 1 ? '' : String(fit)
      if (el.getBoundingClientRect().height <= PRINT_H) break
      if (fit <= FLOOR) break
      fit = Math.round((fit - 0.05) * 100) / 100
    }

    el.style.zoom = ''
    el.style.width = heldWidth
    if (fit < 1) {
      el.style.setProperty('--fit', String(fit))
      // The width has to travel with the scale. Without it the sheet reflows
      // wider as it zooms out and the shrink stops being a shrink.
      el.style.setProperty('--fit-w', `${Math.round(cssW)}px`)
    } else {
      el.style.removeProperty('--fit')
      el.style.removeProperty('--fit-w')
    }
    return fit
  })

  pack.classList.remove('print-measuring')
  pack.style.width = held.width
  pack.style.maxWidth = held.maxWidth
  pack.style.padding = held.padding
  return chosen
}
