'use client'

import { useState } from 'react'
import { requestInvoice } from './actions'
import { PRICING_BANDS } from '@/lib/pricing'

// The request an invoice form. No card, no checkout: the school tells us
// who they are and hands over the purchase order number, we raise the
// invoice with 30 day terms. The PO field is required because finance
// departments bounce invoices without one, and a bounced invoice is a
// term lost.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}

export default function InvoiceForm({ preselect }: { preselect?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    const result = await requestInvoice(new FormData(e.currentTarget))
    if (result.ok) {
      setState('done')
    } else {
      setError(result.error)
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '8px' }}>
          Request received
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '400px', margin: '0 auto' }}>
          Your invoice will be with you within two working days, payable on 30 day terms.
          Your school code comes with it, and that one code opens everything for your whole staff.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={label} htmlFor="school_name">School name</label>
        <input className="input" id="school_name" name="school_name" required maxLength={200} placeholder="St Example CE Primary" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={label} htmlFor="band">Band</label>
          <select className="input" id="band" name="band" defaultValue={preselect && PRICING_BANDS.some(b => b.key === preselect) ? preselect : 'primary_small'}>
            {PRICING_BANDS.map(b => (
              <option key={b.key} value={b.key}>
                {b.tier} · {b.pupils} {b.onApplication ? '' : `· ${b.price}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={label} htmlFor="pupil_count">Pupil count</label>
          <input className="input" id="pupil_count" name="pupil_count" type="number" min={1} max={99999} placeholder="320" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={label} htmlFor="contact_name">Your name</label>
          <input className="input" id="contact_name" name="contact_name" required maxLength={120} placeholder="Sam Headteacher" />
        </div>
        <div>
          <label style={label} htmlFor="email">School email</label>
          <input className="input" id="email" name="email" type="email" required maxLength={200} placeholder="office@school.sch.uk" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="po_number">Purchase order number</label>
        <input className="input" id="po_number" name="po_number" required maxLength={80} placeholder="PO-2026-0148" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '6px', lineHeight: 1.5 }}>
          Your finance team will have this. The invoice carries it, which is what stops it bouncing.
        </p>
      </div>
      <div>
        <label style={label} htmlFor="notes">Anything we should know (optional)</label>
        <input className="input" id="notes" name="notes" maxLength={1000} placeholder="Start date, trust name, billing address quirks" />
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: '10px', color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-gold" disabled={state === 'sending'} style={{ justifyContent: 'center' }}>
        {state === 'sending' ? 'Sending…' : 'Request the invoice'}
      </button>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center' }}>
        No card. No online payment. An invoice with 30 day terms, like every other scheme you buy.
      </p>
    </form>
  )
}
