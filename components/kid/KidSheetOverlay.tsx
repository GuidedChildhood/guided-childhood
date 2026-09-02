'use client'

import { useState } from 'react'
import { playKidSound } from '@/lib/sound/kidSounds'
import { printOrOpen } from '@/lib/kid/print-anywhere'
import KidSheetPaper from '@/components/kid/KidSheetPaper'
import type { DrawnSpec } from '@/components/printables/drawn'
import { HAPPY, CloseCross, Sticker, StarShape } from '@/components/kid/HappyNewsBits'

// A printable sheet, printed from right where the child is standing.
//
// Justin, 11 August 2026, with Teo stranded on a bare image of the Summer
// Bucket List: no bar, no back, no way home. The old path opened a popup
// window with its own toolbar, and when the installed app blocked the popup
// it fell back to opening the raw image, which inside a standalone app has
// no address bar, no tabs and no back button. A dead end, found the same
// way the last dead end was found: by a child hitting it.
//
// So there is no window any more. The sheet opens as an overlay ON the page
// the child is already on: a bar with the way back and a print button, the
// sheet below it, and a print rule that hides everything except the sheet.
// Nothing can be blocked and nothing can strand, because nothing leaves.
//
// 2 September 2026: the print button inside the installed iOS app did
// nothing at all (window.print is silent there), so Print it now goes
// through printOrOpen, which prints in place where it can and otherwise
// opens the sheet's own print page in Safari. The bar wears the happy news
// butter and the round close cross the rest of the child app uses.

export type OverlaySheet = {
  url: string
  title: string
  // The remaining pages of a multi page sheet (the crafts). Each prints as
  // its own sheet of paper.
  extraUrls?: string[]
  heading?: { name: string; kicker: string }
  // A write in page after the sheet: a titled set of dotted lines.
  writeIn?: { title: string; blurb: string; lines: number }
  /** A sheet drawn in code, no image. */
  drawn?: DrawnSpec
  /** The sheet's own print page, for the installed app that cannot print in place. */
  printHref?: string
  stars?: number
}

export default function KidSheetOverlay({ sheet, onClose, onPrinted }: {
  sheet: OverlaySheet | null
  onClose: () => void
  /** Fired when the child asks for the print, however it is served. */
  onPrinted?: () => void
}) {
  const [note, setNote] = useState<string | null>(null)
  if (!sheet) return null

  function print() {
    if (!sheet) return
    playKidSound('tap')
    onPrinted?.()
    if (sheet.printHref) {
      const how = printOrOpen(sheet.printHref)
      if (how === 'opened') setNote('Opened in Safari so it can print. Come back here when it is done.')
    } else {
      try { window.print() } catch { /* nothing to do */ }
    }
  }

  return (
    <div className="kid-sheet-overlay" style={{ position: 'fixed', inset: 0, zIndex: 220, background: '#fff', overflowY: 'auto' }}>
      {/* On paper, only the sheet: everything else on the page is hidden and
          the overlay is lifted to the page origin so the image starts at the
          top of the first sheet of paper. */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        .kid-sheet-overlay, .kid-sheet-overlay * { visibility: visible !important; }
        .kid-sheet-overlay { position: absolute !important; inset: 0 !important; overflow: visible !important; }
        .kid-sheet-overlay .kid-sheet-bar, .kid-sheet-overlay .kid-sheet-note { display: none !important; }
        @page { margin: 8mm; }
      }`}</style>

      <div className="kid-sheet-bar" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', gap: 10, alignItems: 'center',
        padding: '10px 14px', background: HAPPY.butter, borderBottom: `2.5px solid ${HAPPY.ink}`,
      }}>
        <button
          onClick={() => { playKidSound('tap'); onClose() }}
          aria-label="Back"
          style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', border: `2px solid ${HAPPY.ink}`, boxShadow: `0 3px 0 ${HAPPY.ink}`,
          }}
        >
          <CloseCross size={42} />
        </button>
        <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: HAPPY.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {sheet.title}
        </div>
        {sheet.stars ? <Sticker accent="white" rotate={6}><StarShape size={13} /> {sheet.stars}</Sticker> : null}
        <button
          onClick={print}
          style={{
            flexShrink: 0, padding: '11px 16px', border: `2px solid ${HAPPY.ink}`, borderRadius: 14, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            color: HAPPY.ink, background: '#fff', boxShadow: `0 3px 0 ${HAPPY.ink}`,
          }}
        >
          🖨️ Print it
        </button>
      </div>

      {note && (
        <p className="kid-sheet-note" style={{ margin: 0, padding: '10px 16px', background: HAPPY.butterLt, borderBottom: `1.5px solid ${HAPPY.butterDark}`, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.4 }}>
          {note}
        </p>
      )}

      <KidSheetPaper sheet={sheet} />
    </div>
  )
}
