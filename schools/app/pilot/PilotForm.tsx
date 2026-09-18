'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPilot } from './actions'
import { TASTER_MODULES } from '@/lib/taster'

// The pilot request form. Small enough to answer on a phone between lessons:
// the school, who you are, where to send the code, and two optional picks
// that tell us which door to open first. Validation in the house voice,
// under the field, the way the invoice form does it.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}
const fieldNote: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
  color: 'var(--danger)', marginTop: '6px', lineHeight: 1.45,
}

function check(fd: FormData): Record<string, string> {
  const errs: Record<string, string> = {}
  const text = (k: string) => String(fd.get(k) ?? '').trim()
  if (!text('school_name')) errs.school_name = 'The school the pilot is for.'
  if (!text('contact_name')) errs.contact_name = 'Your name, so we know who to write to.'
  const email = text('email')
  if (!email) errs.email = 'The email the school code should go to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'That does not look like an email address.'
  return errs
}

export default function PilotForm({ full }: { full: boolean }) {
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
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setState('sending')
    const result = await requestPilot(fd)
    if (result.ok) setState('done')
    else { setError(result.error); setState('idle') }
  }

  if (state === 'done') {
    return (
      <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-card)', padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '8px' }}>
          Request received
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '420px', margin: '0 auto 18px' }}>
          {full
            ? 'The first places are spoken for, so you are first in line for the next round. We reply within two working days, usually the same day, and a confirmation is on its way to your inbox.'
            : 'We reply within two working days, usually the same day, with your school code and a five minute start. A confirmation is on its way to your inbox. Nothing to install, nothing to download.'}
        </p>
        <Link href={`/lesson/${TASTER_MODULES[0]}`} className="btn btn-outline">Teach the sample lesson while you wait</Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={label} htmlFor="pilot_school_name">School name</label>
        <input className="input" id="pilot_school_name" name="school_name" required maxLength={200} placeholder="St Example CE Primary" aria-invalid={!!errs.school_name} aria-describedby={errs.school_name ? 'err-pilot-school' : undefined} />
        {errs.school_name && <p id="err-pilot-school" role="alert" style={fieldNote}>{errs.school_name}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="pilot_contact_name">Your name</label>
          <input className="input" id="pilot_contact_name" name="contact_name" required maxLength={120} placeholder="Sam Carter" aria-invalid={!!errs.contact_name} aria-describedby={errs.contact_name ? 'err-pilot-name' : undefined} />
          {errs.contact_name && <p id="err-pilot-name" role="alert" style={fieldNote}>{errs.contact_name}</p>}
        </div>
        <div>
          <label style={label} htmlFor="pilot_role">Your role</label>
          <input className="input" id="pilot_role" name="role" maxLength={80} placeholder="Head of PSHE" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="pilot_email">School email</label>
        <input className="input" id="pilot_email" name="email" type="email" required maxLength={200} placeholder="s.carter@school.sch.uk" aria-invalid={!!errs.email} aria-describedby={errs.email ? 'err-pilot-email' : undefined} />
        {errs.email && <p id="err-pilot-email" role="alert" style={fieldNote}>{errs.email}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="pilot_phase">Phase</label>
          <select className="input" id="pilot_phase" name="phase" defaultValue="">
            <option value="">Choose if you like</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="all_through">All through</option>
            <option value="post16">Sixth form or college</option>
          </select>
        </div>
        <div>
          <label style={label} htmlFor="pilot_start">When would you start</label>
          <select className="input" id="pilot_start" name="start" defaultValue="">
            <option value="">Choose if you like</option>
            <option value="this_term">This term</option>
            <option value="next_term">Next term</option>
            <option value="not_sure">Not decided yet</option>
          </select>
        </div>
      </div>
      <div>
        <label style={label} htmlFor="pilot_message">Anything we should know (optional)</label>
        <textarea className="input" id="pilot_message" name="message" maxLength={1000} rows={3} placeholder="Year groups, a date you are working to, who else should be copied in" style={{ resize: 'vertical', minHeight: '84px', lineHeight: 1.5 }} />
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-tile)', color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-gold" disabled={state === 'sending'} style={{ justifyContent: 'center' }}>
        {state === 'sending' ? 'Sending…' : full ? 'Ask for the next round' : 'Request the pilot'}
      </button>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
        No card, no contract, no pupil data. One school code for the whole staff room.
      </p>
    </form>
  )
}
