import Link from 'next/link'

// The branded 404. App Router does not use public/404.html, so without this a
// bad link falls to Next's bare default page. Warm, plain, a way back.
export default function NotFound() {
  return (
    <div style={{ minHeight: '72dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
        Page not found
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px', color: 'var(--ink)' }}>
        This page has wandered off
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '440px', marginBottom: '28px' }}>
        The link may be old, or the page may have moved. Let us get you back to somewhere useful.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '16px', padding: '13px 22px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Back to home
        </Link>
        <Link href="/dashboard" style={{ background: '#fff', color: 'var(--ink)', textDecoration: 'none', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '13px 22px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
          Go to my dashboard
        </Link>
      </div>
    </div>
  )
}
