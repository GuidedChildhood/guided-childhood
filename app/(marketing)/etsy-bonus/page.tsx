import type { CSSProperties } from 'react'
import Link from 'next/link'
import MagnetGate from '@/components/marketing/MagnetGate'

// The Etsy landing. Every Guided Childhood printable sold on Etsy prints this
// URL on its last page, so a buyer who liked the sheet lands here. It hands
// over a genuine free bonus for the email, then points, once, at the founding
// member offer. The purchase never moves off Etsy: this is the after, not a
// second checkout. House rule 9: every CTA routes to /starter-pack.

export const metadata = {
  title: 'Your free bonus · Guided Childhood',
  description: 'A thank you and a free bonus for your Guided Childhood printable, plus where the whole pathway lives if you want it.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }
const P: CSSProperties = { fontSize: 'var(--text-base)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const GETS = [
  ['📰', 'The whole starter pack', 'Eleven pages: the fridge star chart, the jobs that earn stars, how to guides, a workout, football, dance, a healthy breakfast, a game and pages to colour.'],
  ['⭐', 'The same system, on paper', 'One star is five minutes of screen time. Real jobs earn the stars, the daily battle becomes a deal the whole family already made.'],
  ['📮', 'Straight to your inbox', 'Pop your email in and we send it over right away, then a short, warm welcome, never spam.'],
]

export default function EtsyBonusPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Your free bonus</p>
      <h1 style={H1}>Thank you for your Guided Childhood printable</h1>
      <p style={P}>
        You are exactly the kind of parent we make these for. As a little thank you, here is the full Guided Childhood Starter Pack, free. A whole newspaper styled booklet to print at home. No catch, and your purchase stays right where it was.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '30px 0 36px' }}>
        {GETS.map(([icon, title, body], i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px' }}>
            <span aria-hidden style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>{icon}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px' }}>{title}</h2>
              <p style={{ ...P, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <MagnetGate
        slug="starter-pack"
        heading="Send me the starter pack"
        sub="The full eleven page Guided Childhood Starter Pack, ready to print at home. Pop your email in and it is yours."
      />

      {/* The one permitted funnel line, once, routing to /starter-pack per house
          rule 9. Never a second purchase, just where the whole pathway lives. */}
      <div style={{ marginTop: '40px', textAlign: 'center', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '20px', padding: '28px 24px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 8px' }}>
          Want the whole pathway, not just the sheet?
        </p>
        <p style={{ ...P, maxWidth: '520px', margin: '0 auto 18px' }}>
          Guided Childhood is the plan that turns 16 from a cliff edge into a gentle ramp, the scripts, the lessons, the jobs and the screen time balance, all in one place. The founding member price is capped at the first 50 families.
        </p>
        <Link href="/starter-pack" className="btn btn-gold" style={{ display: 'inline-flex', padding: '13px 28px', fontSize: 'var(--text-base)' }}>
          See the starter pack
        </Link>
      </div>
    </div>
  )
}
