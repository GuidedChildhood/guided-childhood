import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICING_BANDS, LICENCE_INCLUDES } from '@/lib/pricing'
import InvoiceForm from './InvoiceForm'

// The pricing page: five bands, decided 13 August 2026, with the per pupil
// figure next to every price because £795 and £2.65 per child per year are
// the same number and only one of them sounds like money. Payment is by
// invoice with 30 day terms, which is how schools actually buy things; the
// form below captures the purchase order number so the invoice never
// bounces off a finance desk.

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'One annual licence per school, priced by phase and size, from £495 a year. Paid by invoice with 30 day terms. One code opens the whole curriculum for every teacher on your staff.',
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px 90px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>One licence per school · everything included</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '14px' }}>
            Priced by phase and size,<br />paid the way schools pay.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            From £495 a year. Invoice with 30 day terms, raised against your purchase
            order. One code opens everything for every teacher on your staff, with no seat counting.
          </p>
        </div>

        {/* The five bands */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          {PRICING_BANDS.map(band => (
            <div key={band.key} style={{
              background: band.featured ? 'var(--deep-teal)' : '#fff',
              color: band.featured ? '#fff' : 'var(--ink)',
              border: band.featured ? 'none' : '1px solid var(--border)',
              borderRadius: '20px', padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: '4px',
              boxShadow: band.featured ? '0 2px 4px rgba(46,40,24,0.1), 0 30px 55px -30px rgba(46,40,24,0.55)' : '0 1px 2px rgba(46,40,24,0.05)',
              position: 'relative',
            }}>
              {band.featured && (
                <span style={{ ...eyebrow, color: 'var(--terracotta)', fontSize: 'var(--text-xs)', position: 'absolute', top: '14px', right: '16px' }}>Most schools</span>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: band.featured ? 'var(--terracotta)' : 'var(--ink-muted)' }}>
                {band.tier}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: band.featured ? 'rgba(255,250,240,0.75)' : 'var(--ink-muted)', marginBottom: '10px' }}>
                {band.pupils}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: band.onApplication ? '1.4rem' : '2.1rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {band.price}
                {!band.onApplication && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: band.featured ? 'rgba(255,250,240,0.64)' : 'var(--ink-muted)', marginLeft: '5px' }}>a year</span>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: band.featured ? 'var(--terracotta)' : 'var(--terracotta-dark)', marginTop: '2px' }}>
                {band.perPupil}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginBottom: '48px' }}>
          One licence, every teacher, no seat counting. Invoice with 30 day terms.
        </p>

        {/* Why pay at all. Added 10 September 2026.
            A head can get a complete statutory RSHE curriculum free from Oak
            National Academy, and SCARF free alongside a workshop booking. That
            is true and the page should say so, because a head who finds it out
            later stops trusting the rest. What free schemes do not hand over is
            the paperwork around the teaching, which is where the work actually
            sits. Two of the three are readable here without a code, because a
            school needs them to evaluate us rather than after it has paid. */}
        <div style={{ background: 'var(--terracotta-lt)', border: '1px solid var(--border)', borderRadius: '18px', padding: '26px 24px', marginBottom: '48px' }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>The honest question</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '12px' }}>
            Why pay, when good lessons are free?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '18px', maxWidth: '640px' }}>
            They are. Oak National Academy publishes a complete statutory RSHE curriculum
            for nothing, and it is good. If lessons are all you need, take them. What no free
            scheme hands you is the paperwork around the teaching, and that is where a subject
            lead actually loses their term. Three things, and you can read two of them right now
            without buying anything.
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '14px' }}>
            {[
              { h: 'The sheet an inspector reads', b: 'One row per statutory outcome, the module that covers it, and the term it is taught. Personal development and wellbeing is graded in its own right, and this is the page you hand over when someone asks to see coverage.', href: '/hub/rshe-mapping', cta: 'Open the mapping matrix' },
              { h: 'A teacher who never trained for this, made ready in fifteen minutes', b: 'Every slide carries the words to say, so a non specialist is not improvising about consent or self harm at nine on a Monday. Staff briefings sit behind the licence, because that part is the product.', href: null, cta: null },
              { h: 'A purchase your data protection officer does not have to build a case for', b: 'No pupil logins, no pupil names, no tracking. The pack sets out what is processed, the lawful basis, retention, and consultation evidence for your DPIA. Read it before you decide, not after.', href: '/hub/data-protection', cta: 'Open the data protection pack' },
            ].map(item => (
              <li key={item.h} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                <strong style={{ color: 'var(--ink)' }}>{item.h}.</strong>{' '}{item.b}
                {item.href && (
                  <>
                    {' '}
                    <Link href={item.href} style={{ color: 'var(--terracotta-dark)', fontWeight: 700, whiteSpace: 'nowrap' }}>{item.cta}</Link>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* What is in the licence + the form, side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '14px' }}>
              Every band includes the lot
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {LICENCE_INCLUDES.map(item => (
                <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  <span style={{ color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <div style={{ background: 'var(--terracotta-lt)', borderRadius: '16px', padding: '16px 18px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6 }}>
                <strong>Not sure yet?</strong> You do not need a licence to try it. The whole{' '}
                <Link href="/curriculum" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>curriculum catalogue</Link>{' '}
                is open to read. Ask for a pilot code and teach any module this week, then decide.
              </p>
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '14px' }}>
              Request your invoice
            </h2>
            <InvoiceForm />
          </div>
        </div>

      </div>
    </main>
  )
}
