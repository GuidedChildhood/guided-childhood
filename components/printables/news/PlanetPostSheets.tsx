'use client'

import { ExampleContext } from '@/components/printables/drawn/HappyPaper'
import { PlanetPostPages, NEWS_W, NEWS_H } from '@/components/printables/news/PlanetPost'
import type { PlanetPostIssue } from '@/lib/printables/free/planet-post'

// The Planet Post on paper. Each newspaper page is a fixed 740 by 1000 px box
// (inside the area A4 and US Letter share), centred on the chosen sheet, one
// page per side. The booklet puts two pages on each side of one landscape A4
// sheet at 70 percent, in the order a fold needs: the back and front on side
// one, pages two and three on side two. Print both sides, flip on the short
// edge, fold in half.
//
// The colour version turns the kit's drawings to their crayon colours (the
// same switch the app's coloured in examples use); ink saver leaves them as
// lines to colour.

const SIZES = {
  // Half a millimetre under the paper, so rounding never spills a sheet.
  a4: { w: '210mm', h: '296.5mm', page: 'A4' },
  letter: { w: '215.9mm', h: '278.9mm', page: 'letter' },
} as const

export default function PlanetPostSheets({ issue, qrSvg, paper, ink, layout, only }: {
  issue: PlanetPostIssue
  qrSvg: string
  paper: 'a4' | 'letter'
  ink: boolean
  layout: 'pages' | 'booklet'
  only: number | null
}) {
  const pages = PlanetPostPages({ issue, ink, qrSvg })
  const size = SIZES[paper]
  const booklet = layout === 'booklet'

  // Preview images: one page, no sheet around it, at its own size.
  if (only) {
    return (
      <ExampleContext.Provider value={!ink}>
        <style>{'html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; } body { zoom: 1 !important; } nextjs-portal { display: none !important; }'}</style>
        <div id="planet-post-only" style={{ width: NEWS_W, height: NEWS_H }}>{pages[only - 1]}</div>
      </ExampleContext.Provider>
    )
  }

  const sides = booklet ? [[pages[3], pages[0]], [pages[1], pages[2]]] : pages.map(p => [p])
  return (
    <ExampleContext.Provider value={!ink}>
      <style>{`
        @page { size: ${booklet ? 'A4 landscape' : `${size.page} portrait`}; margin: 0; }
        html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
        body { zoom: 1 !important; }
        nextjs-portal { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        /* A break BEFORE every sheet but the first, never after the last:
           the root layout puts its own elements after these, so a last-child
           rule never matched and every file grew a blank fifth page. */
        .pp-sheet + .pp-sheet { break-before: page; page-break-before: always; }
      `}</style>
      {sides.map((side, i) => (
        <div key={i} className="pp-sheet" style={{
          width: booklet ? '297mm' : size.w, height: booklet ? '209.5mm' : size.h,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', overflow: 'hidden', background: '#fff',
        }}>
          {side.map((p, k) => (
            <div key={k} style={booklet ? { width: NEWS_W * 0.7, height: NEWS_H * 0.7 } : undefined}>
              <div style={booklet ? { transform: 'scale(0.7)', transformOrigin: 'top left', width: NEWS_W, height: NEWS_H } : undefined}>{p}</div>
            </div>
          ))}
        </div>
      ))}
    </ExampleContext.Provider>
  )
}
