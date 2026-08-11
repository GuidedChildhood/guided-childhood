'use client'

import { useState } from 'react'
import { playKidSound } from '@/lib/sound/kidSounds'

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

export type OverlaySheet = { url: string; title: string }

export default function KidSheetOverlay({ sheet, onClose }: {
  sheet: OverlaySheet | null
  onClose: () => void
}) {
  // The sheet art lives on the CDN, so on a bad connection the image is the
  // one thing here that can fail. Failing silently left the old window
  // blank with no explanation, so this one says what happened and the bar
  // above still works either way.
  const [failed, setFailed] = useState(false)
  if (!sheet) return null
  return (
    <div className="kid-sheet-overlay" style={{ position: 'fixed', inset: 0, zIndex: 220, background: '#fff', overflowY: 'auto' }}>
      {/* On paper, only the sheet: everything else on the page is hidden and
          the overlay is lifted to the page origin so the image starts at the
          top of the first sheet of paper. */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        .kid-sheet-overlay, .kid-sheet-overlay * { visibility: visible !important; }
        .kid-sheet-overlay { position: absolute !important; inset: 0 !important; overflow: visible !important; }
        .kid-sheet-overlay .kid-sheet-bar { display: none !important; }
        @page { margin: 8mm; }
      }`}</style>

      <div className="kid-sheet-bar" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', gap: 10, alignItems: 'center',
        padding: '12px 14px', background: 'var(--terracotta-lt)', borderBottom: '1.5px solid rgba(26,26,46,0.12)',
      }}>
        <button
          onClick={() => { playKidSound('tap'); onClose() }}
          style={{
            flex: 1, padding: '12px 10px', border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            color: 'var(--ink)', background: '#fff', boxShadow: '0 4px 0 rgba(26,26,46,0.14)',
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => { playKidSound('tap'); window.print() }}
          style={{
            flex: 1, padding: '12px 10px', border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            color: 'var(--ink)', background: 'var(--terracotta)', boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          🖨️ Print it
        </button>
      </div>

      {failed ? (
        <p style={{ padding: '30px 22px', textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700, lineHeight: 1.55, color: 'var(--ink)' }}>
          That sheet did not come through. Check the wifi and try again, or ask a grown up to print it for you.
        </p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sheet.url}
          alt={sheet.title}
          loading="eager"
          decoding="sync"
          onError={() => setFailed(true)}
          style={{ width: '100%', display: 'block' }}
        />
      )}
    </div>
  )
}
