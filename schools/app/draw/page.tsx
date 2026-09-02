import type { Metadata } from 'next'
import Link from 'next/link'
import DrawForm from './DrawForm'

// The free class pack draw. Any UK school can enter, we draw once a term,
// the winning class gets a printed pack and a term of the lessons for
// nothing. From the Happy Newspaper teardown: their News for Schools runs
// "like a raffle so all schools will, at some point, receive free
// newspapers". Cheap goodwill, and a list of schools who want us.

export const metadata: Metadata = {
  title: 'Free class pack draw',
  description: 'Any UK school can enter. Once a term we draw one and send a free class pack: a printed set for every child and a term of the lessons.',
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

export default function DrawPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 20px 90px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--stage-3)', border: '2px solid var(--ink)', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }} aria-hidden>🎁</div>
          <div style={{ ...eyebrow, marginBottom: '10px' }}>For schools</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 12px' }}>
            The free class pack draw
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.6, margin: 0 }}>
            Any UK school can enter. Once a term we draw one school and send a free class pack: a printed set for every child in the class and a term of the lessons, with nothing to pay. Every school stays in until it wins.
          </p>
        </div>
        <DrawForm />
        <p style={{ textAlign: 'center', marginTop: '22px', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
          Ready now? <Link href="/pricing" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'none' }}>See the school prices</Link>. Every paid school funds another free pack.
        </p>
      </div>
    </main>
  )
}
