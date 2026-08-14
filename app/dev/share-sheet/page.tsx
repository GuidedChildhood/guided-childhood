'use client'

import { useState } from 'react'
import QrHandoverModal from '@/components/quests/QrHandoverModal'

// Dev harness for the hand over sheet (components/quests/QrHandoverModal.tsx).
//
// The real sheet only opens behind auth, from a card that only appears when a
// family has a child old enough and not yet linked, which makes checking its
// two doors at 390 and 1280 a signup away. This opens it on a fake token over
// the same cream background.
//
// The token is nonsense on purpose. The QR is drawn on device from SITE_URL
// and the token, so a fake one draws a real code pointing at a link that does
// not resolve, which is exactly what is wanted for a layout check.

export default function ShareSheetDevPage() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 8px' }}>
        The hand over sheet
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '0 0 20px', lineHeight: 1.5 }}>
        Both doors. Tap Printed chart to switch. Check at 390 and 1280.
      </p>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
          padding: '14px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)',
          fontWeight: 900, fontSize: 'var(--text-lg)', boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        Open the sheet
      </button>

      {open && (
        <QrHandoverModal
          token="devfixture0000000000000000000000"
          childName="Olga"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
