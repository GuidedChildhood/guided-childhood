import type { Metadata } from 'next'
import Link from 'next/link'
import { MODULE_COUNT } from '@gc/shared/schools-curriculum'
import { PILOT_PLACES } from '@/lib/pilot'
import { PRICING_BANDS } from '@/lib/pricing'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE TRUST PAGE (23 November 2026).
//
// Oak National Academy's partnerships lead, on Justin's call that morning:
// EdTech now enters schools at trust level, where the gatekeepers hear from
// ten to twenty companies a week, so lead with what very few do, the online
// side of RSHE and bringing parents with you, and the staff time both cost
// (plans/2026-11-23-oak-call-notes.md). The trust band already sat on the
// pricing page as "On application" with nowhere to go. This is where it goes.
//
// Every line is something a trust lead can open today. It does NOT claim a
// trust wide dashboard: each school keeps its own code and its own record,
// and the page says so plainly. Price stays "on application, per school",
// exactly as lib/pricing.ts says, and the single school bands are shown so
// nobody has to guess the order of magnitude.

export const metadata: Metadata = {
  title: 'For trusts and MATs',
  description: 'One scheme for the online side of RSHE and parent engagement across every school in your trust. Priced per school, no pupil data, a free pilot in two of your schools first.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/trusts' },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7,
}
const quietBtn: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
  padding: '15px 26px', borderRadius: 'var(--radius-btn)', textDecoration: 'none',
  color: 'var(--ink)', background: 'var(--white)', border: '1px solid var(--border)',
  boxShadow: '0 5px 0 var(--border)',
}

const POINTS: { title: string; line: string; href: string; link: string }[] = [
  {
    title: 'The same lessons in every school',
    line: `${MODULE_COUNT} lessons, Reception to Year 13, with the words to say on every slide. A teacher who is not a specialist can teach it without an evening of preparation.`,
    href: '/curriculum', link: 'See the curriculum map',
  },
  {
    title: 'Parents brought with you',
    line: 'Every lesson sends a parent note home with one question for the family, and each school gets a parent pack for its newsletter.',
    href: '/pilot?src=trusts', link: 'Included in the pilot',
  },
  {
    title: 'The evidence your leaders are asked for',
    line: 'Every lesson maps to the 2025 RSHE guidance, and each school builds a record of what every class has been taught, without naming a pupil.',
    href: '/hub/rshe-mapping', link: 'See the RSHE mapping',
  },
]

export default function TrustsPage() {
  const singleSchool = PRICING_BANDS.filter(b => !b.onApplication)
  const low = singleSchool[0]?.price
  const high = [...singleSchool].reverse()[0]?.price

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ ...eyebrow, marginBottom: 'var(--space-2)' }}>For trusts and MATs</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.hero, color: 'var(--ink)', marginBottom: 'var(--space-4)', textWrap: 'balance' }}>
          One scheme for the online side of RSHE, in every school.
        </h1>
        <p style={{ ...body, marginBottom: 'var(--space-5)' }}>
          Teaching online safety well and bringing parents with you both cost staff time your schools do not have. This does both, the same way across the trust.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          <Link href="/pilot?src=trusts" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px' }}>
            Pilot it in two schools
          </Link>
          <a href="mailto:hello@guidedchildhood.com?subject=Trust%20licence" className="btn" style={quietBtn}>Ask about trust pricing</a>
        </div>

        <section aria-label="What every school gets" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {POINTS.map(p => (
            <article key={p.title} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25 }}>{p.title}</h2>
              <p style={{ ...body, fontSize: 'var(--text-base)' }}>{p.line}</p>
              <Link href={p.href} style={{ marginTop: 'auto', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>{p.link}</Link>
            </article>
          ))}
        </section>

        <section aria-label="How it works for a trust" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ ...eyebrow, color: 'var(--ink-muted)', marginBottom: 'var(--space-3)' }}>How it works for a trust</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <li style={body}><strong style={{ color: 'var(--ink)' }}>Start small.</strong> A free pilot for a term in two of your schools, from the first {PILOT_PLACES} places. Two lessons each, every printable and the Hub.</li>
            <li style={body}><strong style={{ color: 'var(--ink)' }}>Each school stays in charge.</strong> Its own code, its own record of lessons taught, its own safeguarding lead details on every briefing.</li>
            <li style={body}><strong style={{ color: 'var(--ink)' }}>Nothing to install, no pupil data.</strong> No pupil accounts, and a <Link href="/hub/data-protection" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>data protection pack</Link> written for your DPO.</li>
            <li style={body}><strong style={{ color: 'var(--ink)' }}>Priced per school, not per pupil.</strong> On application for a trust. A single school pays {low} to {high} a year, by invoice with 30 day terms.</li>
          </ul>
        </section>

        <p style={{ ...body, fontSize: 'var(--text-base)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
          Fifteen minutes is enough to see whether it fits. <a href="mailto:hello@guidedchildhood.com?subject=Trust%20conversation" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Email me</a> and I will reply within two working days, usually the same day. Justin
        </p>
      </div>
    </main>
  )
}
