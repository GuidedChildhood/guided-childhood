'use client'

import { useEffect, useRef, useState } from 'react'

// Fit a fixed size print sheet onto whatever screen is looking at it.
//
// Justin, 11 August 2026, with the Planet Friends poster scrambled on Teo's
// iPhone: title chopped to "Teo's Pla…", cards overlapping, the how to tile
// sitting on top of Nova. The poster fitted phones with CSS zoom steps in
// media queries, and Chromium honours those exactly. Safari does not: its
// zoom handling of mm sized, fixed height grids is unreliable, so the sheet
// laid out at full A4 size inside a phone width and everything collided.
//
// So the fitting is measured instead of guessed. This wrapper watches its
// own width, scales the sheet with a plain transform (which every browser
// treats identically), and reserves exactly the scaled height so the page
// never gains a sideways scroll or a hole. Print resets the transform, so
// the paper still gets the sheet at true size.

export default function SheetScale({ sheetWidth, sheetHeight, children }: {
  /** The sheet's natural CSS pixel width (A4 portrait is 794). */
  sheetWidth: number
  /** The sheet's natural CSS pixel height (A4 portrait is 1123). */
  sheetHeight: number
  children: React.ReactNode
}) {
  const outer = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const fit = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setScale(Math.min(1, w / sheetWidth))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sheetWidth])

  return (
    <div ref={outer} className="sheet-scale" style={{ width: '100%', height: Math.ceil(sheetHeight * scale), overflow: 'hidden' }}>
      <style>{`@media print {
        .sheet-scale { height: auto !important; overflow: visible !important; }
        .sheet-scale > div { transform: none !important; width: auto !important; }
      }`}</style>
      <div style={{ width: sheetWidth, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}
