import Link from 'next/link'

// THE PIECES OF THE TWO EMAIL LANDING PAGES (5 November 2026).
//
// /kids-app and /agreement are where the parent emails send a parent who may
// not have an account yet. Until today those links went straight into the
// dashboard, so a signed out parent met the login page and no way in. Each
// page says what the thing is, shows the real product, and has ONE door: the
// free account, made in the starter pack (non negotiable 9), which brings
// them back to the thing they tapped (lib/starter/next.ts).
//
// Server components with no client JavaScript: these are read on a phone from
// an email, and the first paint is the whole page.

export const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
export const H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4.6vw, 2.1rem)',
  letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 14px',
}
export const BODY: React.CSSProperties = {
  fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: 0,
}

/** The thin top bar: the name home, and the way in for a member. */
export function LandingTop({ signInHref }: { signInHref: string }) {
  return (
    <header style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
        Guided Childhood
      </Link>
      <Link href={signInHref} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
        Sign in
      </Link>
    </header>
  )
}

/** The one door, and the member's line under it. */
export function LandingCta({ href, label, signInHref, note }: { href: string; label: string; signInHref: string; note: string }) {
  return (
    <div>
      <Link href={href} className="btn btn-gold" style={{ minHeight: 52, fontSize: 'var(--text-md)', padding: '15px 30px' }}>
        {label}
      </Link>
      <p style={{ ...BODY, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 14 }}>{note}</p>
      <p style={{ ...BODY, fontSize: 'var(--text-sm)', marginTop: 6 }}>
        Already have an account?{' '}
        <Link href={signInHref} style={{ color: 'var(--ink)', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</Link>
      </p>
    </div>
  )
}

/** A short list with a gold tick, for what the child sees and what the parent sets. */
export function TickList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(i => (
        <li key={i.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span aria-hidden style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', marginTop: 1 }}>✓</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.35 }}>{i.title}</div>
            <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 2 }}>{i.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Numbered steps on white cards. */
export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
      {steps.map((s, n) => (
        <li key={s.title} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span aria-hidden style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'var(--terracotta)', boxShadow: '0 3px 0 var(--terracotta-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)' }}>{n + 1}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.35 }}>{s.title}</div>
            <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 4 }}>{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** A section with its eyebrow and heading. */
export function Section({ eyebrow, title, children, tint = false }: { eyebrow: string; title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section style={{ background: tint ? 'var(--white)' : 'transparent', borderTop: tint ? '1px solid var(--border)' : 'none', borderBottom: tint ? '1px solid var(--border)' : 'none' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(44px, 7vw, 72px) 20px' }}>
        <p style={{ ...EYEBROW, marginBottom: 10 }}>{eyebrow}</p>
        <h2 style={H2}>{title}</h2>
        {children}
      </div>
    </section>
  )
}
