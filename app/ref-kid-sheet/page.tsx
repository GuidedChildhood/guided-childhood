'use client'

import { useState } from 'react'
import KidSheetOverlay, { type OverlaySheet } from '@/components/kid/KidSheetOverlay'

// Reference: the sheet overlay a child prints from, opened on the Nova
// colouring sheet. The real mount lives inside KidQuestScreen behind a
// family's kid link token, which no fixture can carry, so this page exists
// for eyes and Playwright: the composed sheet (name, kicker, stars, the
// line art derived from the real character), and the big Done bar that
// rises after the print dialog closes. Trigger that here without a printer:
// window.dispatchEvent(new Event('afterprint')).

const SHEET: OverlaySheet = {
  url: '/printables/friends/nova-colouring.png',
  title: 'Colour in Nova',
  heading: { name: 'Nova', kicker: 'My Stage 4 Planet Friend' },
}

export default function RefKidSheet() {
  const [sheet, setSheet] = useState<OverlaySheet | null>(SHEET)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--butter, #FDF6E3)' }}>
      {!sheet && (
        <p style={{ padding: 40, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)' }}>
          Overlay closed. The child is back on their printables.
        </p>
      )}
      <KidSheetOverlay sheet={sheet} onClose={() => setSheet(null)} />
    </div>
  )
}
