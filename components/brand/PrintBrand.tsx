import { BRAND_NAME, BRAND_PATHWAY, BRAND_CATCHPHRASE, BRAND_DOMAIN, LOGO_GOLD, LOGO_BARS } from '@/lib/brand'

// The brand block for anything a family prints: the logo exactly as the
// app header draws it, the name, the pathway line, and (in the footer)
// the catchphrase. Every print surface uses these two so no downloadable
// ever leaves the house unbranded.

export function PrintBrandHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '24px', height: '24px', background: LOGO_GOLD, borderRadius: '7px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '1.8px', height: '11px' }}>
            {LOGO_BARS.map((h, i) => (
              <span key={i} style={{ width: '2.2px', height: `${(h / 14) * 11}px`, background: '#fff', borderRadius: '1px', display: 'inline-block' }} />
            ))}
          </span>
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          {BRAND_NAME}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700,
        letterSpacing: '0.22em', color: 'var(--terracotta-dark)', marginTop: '3px',
      }}>
        {BRAND_PATHWAY}
      </div>
    </div>
  )
}

export function PrintBrandFooter() {
  return (
    <div style={{ textAlign: 'center', marginTop: '12px' }}>
      <div style={{ fontSize: '9px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
        {BRAND_CATCHPHRASE}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700,
        letterSpacing: '0.1em', color: 'var(--terracotta-dark)', marginTop: '2px',
      }}>
        {BRAND_DOMAIN}
      </div>
    </div>
  )
}
