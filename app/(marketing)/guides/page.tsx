import Link from 'next/link'
import type { CSSProperties } from 'react'
import { GUIDES } from '@/lib/content/guides'

export const metadata = {
  title: 'Guides for parents · Guided Childhood',
  description: 'Plain answers to the screen and phone questions UK parents ask most, each built from the scripts and research inside Guided Childhood.',
  alternates: { canonical: '/guides' },
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '44px 16px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', margin: '0 0 10px' }

export default function GuidesIndex() {
  return (
    <main style={WRAP}>
      <p style={EYEBROW}>Guides</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 12px', color: 'var(--ink)' }}>
        The questions parents ask us most
      </h1>
      <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 30px' }}>
        Each one is a plain answer: why it keeps happening, what works, and how to get ahead of it next time. No lectures, no blocking software.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {GUIDES.map(g => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} data-track={`guides-index-${g.slug}`} style={{ display: 'block', textDecoration: 'none', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '20px 22px' }}>
              <span style={{ ...EYEBROW, display: 'block', marginBottom: '6px', color: 'var(--ink-muted)' }}>{g.ages}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', lineHeight: 1.25, color: 'var(--ink)', marginBottom: '6px' }}>{g.question}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--ink-soft)' }}>{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
