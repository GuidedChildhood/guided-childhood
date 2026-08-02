'use client'
import { useState } from 'react'
import WellbeingConsent from '@/components/tracker/WellbeingConsent'
import KidPrivacyNote from '@/components/kid/KidPrivacyNote'

// Harness for the two go-live screens. No auth.
export default function Page() {
  const [agreed, setAgreed] = useState(false)
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {agreed
        ? <p style={{ padding: 24, fontFamily: 'var(--font-mono)' }}>Consent given, form would show.</p>
        : <WellbeingConsent onAgreed={() => setAgreed(true)} />}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 20px 40px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>Child facing note</p>
        <KidPrivacyNote />
      </div>
    </main>
  )
}
