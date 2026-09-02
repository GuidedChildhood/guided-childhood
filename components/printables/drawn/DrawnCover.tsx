'use client'

import { useEffect, useRef, useState } from 'react'
import { DrawnSheet, COVER, type DrawnSpec } from './index'
import { PAPER_W } from './HappyPaper'

// The front of a drawn sheet's tile: a filled in, coloured in window onto
// the paper, cropped and scaled to fill the box like a photograph.
//
// Justin, 2 September 2026, with the child's Printables tab: "new printables
// need a better front page display on app, misaligned. We need a filled
// out, coloured in example. Check all new ones as they look messy." The tile
// used to shrink the whole blank A4 (brand header, ribbon, footer and all)
// into a phone sized box, every word a smudge and the bottom of the page cut
// off. Now it shows the part of the sheet that is a picture, coloured in and
// written on, scaled the way an image tile's preview is. The tap through
// still opens the real blank paper, which is what prints.
//
// Sizing is measured, as SheetScale's is: the box's width and height are
// read, the crop is scaled to cover them, and centred.

export default function DrawnCover({ spec }: { spec: DrawnSpec }) {
  const box = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ s: number; x: number; y: number } | null>(null)
  const crop = COVER[spec.key]

  useEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) return
      const s = Math.max(r.width / crop.w, r.height / crop.h)
      setFit({ s, x: (r.width - crop.w * s) / 2 - crop.x * s, y: (r.height - crop.h * s) / 2 - crop.y * s })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [crop])

  return (
    <div ref={box} aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', pointerEvents: 'none' }}>
      {fit && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: PAPER_W, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.s})`, transformOrigin: 'top left' }}>
          <DrawnSheet spec={{ ...spec, example: true }} />
        </div>
      )}
    </div>
  )
}
