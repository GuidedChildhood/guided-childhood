import Link from 'next/link'
import { LEGAL_LINE, VAT_LINE } from '@gc/shared/legal'

// THE FOOTER EVERY SCHOOLS PAGE ENDS ON.
//
// Before 13 September 2026 the pages behind SiteNav had no footer at all, and
// the home page's said "© 2026 Guided Childhood · Justin Phillips". A business
// manager raising a purchase order needs the legal entity, the company number
// and the registered office on the page they are looking at, and a head
// forwarding the site needs to know there is a company behind it. One line,
// read from shared/legal.ts, and the six doors a buyer or a licensed teacher
// wants next. Hidden from print: a hub document is the document, not the site.
const LINKS: [string, string][] = [
  ['/curriculum', 'The curriculum map'],
  ['/philosophy', 'Our philosophy'],
  ['/hub/rshe-mapping', 'The statutory mapping'],
  ['/hub/data-protection', 'Data protection'],
  ['/pricing', 'Pricing'],
  ['/terms', 'Terms for schools'],
  ['/privacy', 'Privacy notice'],
  ['/dpa', 'Data processing agreement'],
  ['/unlock', 'I have a school code'],
]

export default function SiteFooter() {
  return (
    <footer className="no-print" style={{ borderTop: '1px solid var(--border)', background: 'var(--cream)', padding: '28px 20px 44px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px 32px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 320px', maxWidth: '560px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 6px' }}>
            Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
            {LEGAL_LINE} {VAT_LINE}
          </p>
        </div>
        <nav aria-label="Site" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', maxWidth: '420px' }}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none', padding: '8px 0' }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
