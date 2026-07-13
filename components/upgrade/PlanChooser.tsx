'use client'

import { useState } from 'react'

// The standard plan chooser, with the yearly and monthly segmented toggle
// the top subscription apps use. Yearly leads with its saving, monthly is
// the quieter alternative. One clear price and one button, whichever is
// selected. Posts the matching tier to the Stripe checkout.

type Plan = 'annual' | 'standard'

const PLANS: Record<Plan, { tier: string; price: string; unit: string; sub: string; cta: string }> = {
  annual: { tier: 'annual', price: '£99', unit: '/ year', sub: 'Works out at £8.25 a month', cta: 'Start annual, £99 a year' },
  standard: { tier: 'standard', price: '£12.99', unit: '/ month', sub: 'Pay month to month, cancel any time', cta: 'Start monthly, £12.99 a month' },
}

export default function PlanChooser({ heading }: { heading: string }) {
  const [plan, setPlan] = useState<Plan>('annual')
  const p = PLANS[plan]

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '22px', boxShadow: '0 4px 22px rgba(26,26,46,0.06)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
        {heading}
      </div>

      {/* Segmented toggle */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px', marginBottom: '20px' }}>
        {([['annual', 'Yearly'], ['standard', 'Monthly']] as [Plan, string][]).map(([key, label]) => {
          const on = plan === key
          return (
            <button
              key={key}
              onClick={() => setPlan(key)}
              style={{
                flex: 1, padding: '10px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                background: on ? 'var(--deep-teal)' : 'transparent',
                color: on ? '#fff' : 'var(--ink-soft)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background .15s ease, color .15s ease',
              }}
            >
              {label}
              {key === 'annual' && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700,
                  background: on ? 'var(--terracotta)' : 'var(--terracotta-lt)',
                  color: 'var(--ink)', padding: '2px 7px', borderRadius: '100px',
                }}>
                  Save £57
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Price */}
      <div style={{ marginBottom: '18px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.4rem', color: 'var(--ink)', letterSpacing: '-0.03em' }}>{p.price}</span>
        <span style={{ color: 'var(--ink-muted)', fontSize: '15px' }}> {p.unit}</span>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta-dark)', marginTop: '4px' }}>{p.sub}</div>
      </div>

      <form action="/api/stripe/checkout" method="POST">
        <input type="hidden" name="tier" value={p.tier} />
        <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px' }}>
          {p.cta}
        </button>
      </form>
    </div>
  )
}
