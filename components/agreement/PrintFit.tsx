'use client'

import { useEffect } from 'react'

// One page, filled. This is what makes the fridge copy a fridge copy.
//
// Before the print dialog opens, the sheet is laid out exactly as the printer
// will lay it out, measured, and scaled so it lands on a single A4 page at the
// largest size that fits. It works in both directions, and both directions
// were real problems:
//
//   TOO LONG   "our extra agreements" is a free textarea. A family who writes
//              six lines about game spending pushed the signatures onto a
//              second sheet, and a signature page with nothing above it is not
//              a thing anybody sticks on a fridge.
//
//   TOO SHORT  the common case. Six short answers cut for A4 filled a little
//              over half the paper, so the agreement printed marooned in the
//              top corner in small type. A fridge copy is read from the other
//              side of the kitchen by a child who is not wearing their glasses,
//              so the empty half of the page was worth more as type size.
//
// It works by scaling the sheet's type and spacing tokens, NOT by zooming the
// box. Zoom was the obvious first try and it is wrong here: the sheet has to
// stay the full width of the paper, and a zoomed box with a compensating
// width calc does not scale linearly, so one measurement mispredicts the
// printed height and the agreement still spilled onto a second page.
//
// Scaling the tokens instead means the text genuinely reflows, so height is
// not a straight multiple of the scale and cannot be calculated in one go.
// Hence the search below: measure at a candidate scale, keep the largest one
// that actually fits. Eight passes settle it to within half a percent, and
// each pass is one synchronous layout read.
//
// The measurement moves the real node off screen rather than cloning it, so
// there is no second copy of the DOM to keep in step. It happens inside one
// synchronous block, so the browser never paints the intermediate state.

const MM = 3.7795 // 1mm at the 96dpi CSS reference

// Must match the @page rule on the agreement print page.
const PAGE_MARGIN_MM = 8
const SHEET_W_MM = 210 - PAGE_MARGIN_MM * 2
const SHEET_H_PX = (297 - PAGE_MARGIN_MM * 2) * MM

// Leave a little of the page unused. Printers disagree about where the paper
// ends, and the house fonts are a touch wider than the fallback a measurement
// can hit on a cold load, so filling the sheet to the millimetre is how you
// get one line orphaned onto page two.
const TARGET = 0.96

// Below this the type stops being readable across a kitchen, and a family is
// better served by two honest pages than one they have to squint at.
const FLOOR = 0.62

// Above this the agreement stops looking like a document and starts looking
// like a poster. A three line agreement does not need 30pt type.
const CEILING = 1.45

export default function PrintFit({ target }: { target: string }) {
  useEffect(() => {
    const sheet = document.querySelector<HTMLElement>(target)
    if (!sheet) return

    function fit() {
      if (!sheet) return
      const before = sheet.getAttribute('style')
      const budget = SHEET_H_PX * TARGET

      // Lay the sheet out exactly as the printer will, off screen.
      sheet.classList.add('ag-measure')
      sheet.style.position = 'fixed'
      sheet.style.left = '-10000px'
      sheet.style.top = '0'
      sheet.style.width = `${SHEET_W_MM}mm`

      const heightAt = (k: number): number => {
        sheet.style.setProperty('--ag-k', String(k))
        return sheet.scrollHeight
      }

      // The largest scale that still fits, or the floor if even that overruns.
      let lo = FLOOR
      let hi = CEILING
      let best = heightAt(CEILING) <= budget ? CEILING : FLOOR
      if (best !== CEILING) {
        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2
          if (heightAt(mid) <= budget) { best = mid; lo = mid } else { hi = mid }
        }
      }

      sheet.classList.remove('ag-measure')
      if (before === null) sheet.removeAttribute('style')
      else sheet.setAttribute('style', before)

      // Round down so rounding can only ever err toward fitting.
      sheet.style.setProperty('--ag-k', String(Math.floor(best * 1000) / 1000))
      // The scaled cut, which only ever applies while the sheet is on paper.
      sheet.classList.add('ag-print')
    }

    function done() {
      sheet?.classList.remove('ag-print')
    }

    window.addEventListener('beforeprint', fit)
    window.addEventListener('afterprint', done)
    return () => {
      window.removeEventListener('beforeprint', fit)
      window.removeEventListener('afterprint', done)
      done()
    }
  }, [target])

  return null
}
