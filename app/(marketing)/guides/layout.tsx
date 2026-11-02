import Link from 'next/link'
import { STAGE_CHECK_HOOK } from '@/lib/content/guides'

// The guides share one plain header: the logo home, a way back to the list,
// and the stage check, which is where every guide is trying to take a parent.
// Not the homepage nav, whose links are anchors on the homepage itself.
export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--cream)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', gap: '12px' }}>
          <Link href="/" aria-label="Guided Childhood home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0 }}>
            <span aria-hidden style={{ width: '28px', height: '28px', flexShrink: 0, background: 'var(--terracotta)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(0,0,0,.18)' }}>
              <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '13px' }}>
                {[3, 7, 11, 6].map((h, i) => (
                  <span key={i} style={{ display: 'block', width: '2.5px', height: `${h}px`, background: 'var(--white)', borderRadius: '1.5px' }} />
                ))}
              </span>
            </span>
            {/* The wordmark gives way on a phone so the header holds the
                logo, Guides and the stage check without overlapping. */}
            <span className="hide-mobile" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '.95rem', color: 'var(--ink)', whiteSpace: 'nowrap' }}>Guided Childhood</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/guides" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', textDecoration: 'none' }}>Guides</Link>
            <Link href="/starter-pack" data-track="guides-header" aria-label={STAGE_CHECK_HOOK} className="btn btn-gold" style={{ fontSize: 'var(--text-sm)', padding: '9px 16px', whiteSpace: 'nowrap' }}>Find their stage</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
