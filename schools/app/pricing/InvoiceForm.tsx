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

// The field notes, in the house voice rather than the browser's bubble. The
// native validation popup is the one piece of somebody else's design on the
// page, it vanishes on the next click, and it cannot say why a field matters
// (the schools review, 13 September 2026). These stay put under the field
// until it is right, and the first wrong field takes focus.
const fieldNote: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
  color: 'var(--danger)', marginTop: '6px', lineHeight: 1.45,
}

function check(fd: FormData): Record<string, string> {
  const errs: Record<string, string> = {}
  const text = (k: string) => String(fd.get(k) ?? '').trim()
  if (!text('school_name')) errs.school_name = 'The school the invoice is addressed to.'
  if (!text('contact_name')) errs.contact_name = 'Your name, so we know who to reply to.'
  const email = text('email')
  if (!email) errs.email = 'The school email the invoice should go to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'That does not look like an email address.'
  if (!text('po_number')) errs.po_number = 'The purchase order number. Finance will bounce an invoice without one.'
  return errs
}

export default function InvoiceForm({ preselect, prefill }: { preselect?: string; prefill?: { school_name?: string; contact_name?: string; email?: string } }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const fd = new FormData(form)
    const found = check(fd)
    setErrs(found)
    if (Object.keys(found).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)
      first?.focus()
      return
    }
    setState('sending')
    const result = await requestInvoice(fd)
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
    <form onSubmit={onSubmit} noValidate style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={label} htmlFor="school_name">School name</label>
        <input className="input" id="school_name" name="school_name" required maxLength={200} placeholder="St Example CE Primary" defaultValue={prefill?.school_name} aria-invalid={!!errs.school_name} aria-describedby={errs.school_name ? 'err-school_name' : undefined} />
        {errs.school_name && <p id="err-school_name" role="alert" style={fieldNote}>{errs.school_name}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="contact_name">Your name</label>
          <input className="input" id="contact_name" name="contact_name" required maxLength={120} placeholder="Sam Headteacher" defaultValue={prefill?.contact_name} aria-invalid={!!errs.contact_name} aria-describedby={errs.contact_name ? 'err-contact_name' : undefined} />
          {errs.contact_name && <p id="err-contact_name" role="alert" style={fieldNote}>{errs.contact_name}</p>}
        </div>
        <div>
          <label style={label} htmlFor="email">School email</label>
          <input className="input" id="email" name="email" type="email" required maxLength={200} placeholder="office@school.sch.uk" defaultValue={prefill?.email} aria-invalid={!!errs.email} aria-describedby={errs.email ? 'err-email' : undefined} />
          {errs.email && <p id="err-email" role="alert" style={fieldNote}>{errs.email}</p>}
        </div>
      </div>
      <div>
        <label style={label} htmlFor="po_number">Purchase order number</label>
        <input className="input" id="po_number" name="po_number" required maxLength={80} placeholder="PO-2026-0148" aria-invalid={!!errs.po_number} aria-describedby={errs.po_number ? 'err-po_number' : undefined} />
        {errs.po_number
          ? <p id="err-po_number" role="alert" style={fieldNote}>{errs.po_number}</p>
          : <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              Your finance team will have this. The invoice carries it, which is what stops it bouncing.
            </p>}
      </div>
      <div>
        <label style={label} htmlFor="notes">Anything we should know (optional)</label>
        <textarea className="input" id="notes" name="notes" maxLength={1000} rows={3} placeholder="Start date, trust name, billing address quirks" style={{ resize: 'vertical', minHeight: '84px', lineHeight: 1.5 }} />
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
        No card. No online payment. An invoice with 30 day terms, like every other scheme you buy, and no VAT added: we are not VAT registered.
      </p>
    </form>
  )
}
