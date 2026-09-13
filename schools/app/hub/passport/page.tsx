import Link from 'next/link'
import HubPassport from './HubPassport'

// /hub/passport: the passport, page by page, with this screen's fill.
// The explanation lives here in words; the pages and the ticks are the
// client component beside it, because the count is in this browser.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export const metadata = { title: 'The passport, page by page' }

export default function HubPassportPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
        <div style={{ ...mono, color: 'var(--gold-dark)', margin: '18px 0 4px' }}>Home and school, one passport</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The passport, page by page
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '10px' }}>
          Every lesson in the scheme fills one of the five pages of the Guided Childhood Passport, the
          journey to sixteen a family follows in the parents app. The passport beat near the end of each
          lesson is where the class fills the page in, and this is what that has added up to on this
          screen. Tick anything you taught before the beat existed.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '26px' }}>
          Counted here and nowhere else: no pupil, no login, no upload. The child&rsquo;s own passport is
          filled at home with the home code on the parent note, and it never records where a page was
          filled. A stage&rsquo;s stamp is earned there, by the page being full and the big check passed,
          which is why the seal on these pages stays open.
        </p>
        <HubPassport />
      </div>
    </main>
  )
}
