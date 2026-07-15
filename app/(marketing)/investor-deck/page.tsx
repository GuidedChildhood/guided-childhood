import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Investor deck · Guided Childhood',
  description: 'Request the Guided Childhood investor deck.',
}

const WRAP: CSSProperties = { maxWidth: '680px', margin: '0 auto', padding: '64px 22px 90px', textAlign: 'center' }

// DRAFT holding page. Drop in the real deck (embed or download link) when ready.
export default function InvestorDeckPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Investor deck</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '14px' }}>
        The deck is available on request
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 auto 26px', maxWidth: 520 }}>
        We keep the full deck to a warm conversation rather than a cold download. Tell us a little about you and we will send it straight over.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="mailto:hello@guidedchildhood.com?subject=Investor%20deck%20request" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: '15px' }}>Request the deck</a>
        <Link href="/investor" className="btn" style={{ padding: '13px 26px', fontSize: '15px', border: '1.5px solid var(--border)' }}>Back to the overview</Link>
      </div>
    </div>
  )
}
