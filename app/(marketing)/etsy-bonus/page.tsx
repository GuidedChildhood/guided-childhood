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
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const GETS = [
  ['🖍️', 'It is genuinely free', 'No catch and no second checkout. You bought the printable, this is the thank you that goes with it.'],
  ['⭐', 'It fits the same system', 'The bonus works alongside your printable, the same calm way of turning screens into something earned, not a battle.'],
  ['📮', 'Straight to your inbox', 'Pop your email in and we send it over right away, then a short, warm welcome, never spam.'],
]

export default function EtsyBonusPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Your free bonus</p>
      <h1 style={H1}>Thank you for your Guided Childhood printable</h1>
      <p style={P}>
        You are exactly the kind of parent we make these for. As a little thank you, here is a free bonus to go with your sheet. No catch, and your purchase stays right where it was.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '30px 0 36px' }}>
        {GETS.map(([icon, title, body], i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px' }}>
            <span aria-hidden style={{ fontSize: '22px', flexShrink: 0 }}>{icon}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)', margin: '0 0 4px' }}>{title}</h2>
              <p style={{ ...P, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <MagnetGate
        slug="five-questions"
        heading="Send me my free bonus"
        sub="The five questions fridge sheet, a calm one page guide to any screen decision. Pop your email in and it is yours."
      />

      {/* The one permitted funnel line, once, routing to /starter-pack per house
          rule 9. Never a second purchase, just where the whole pathway lives. */}
      <div style={{ marginTop: '40px', textAlign: 'center', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '20px', padding: '28px 24px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)', margin: '0 0 8px' }}>
          Want the whole pathway, not just the sheet?
        </p>
        <p style={{ ...P, maxWidth: '520px', margin: '0 auto 18px' }}>
          Guided Childhood is the plan that turns 16 from a cliff edge into a gentle ramp, the scripts, the lessons, the jobs and the screen time balance, all in one place. The founding member price is capped at the first 50 families.
        </p>
        <Link href="/starter-pack" className="btn btn-gold" style={{ display: 'inline-flex', padding: '13px 28px', fontSize: '15px' }}>
          See the starter pack
        </Link>
      </div>
    </div>
  )
}
