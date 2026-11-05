'use client'

import { useState } from 'react'
import { requestWorkshop } from './actions'
import { WORKSHOPS } from '@/lib/workshops'

// The workshop enquiry. Nothing is booked or charged by sending it: Justin
// replies by hand with a quote or a time to talk. The workshops are ticked
// like cards rather than picked from a list, the shape the best enquiry
// forms use (Mobbin: Remote, HoneyBook), so a head sees all four at once.
// Validation in the house voice, under the field, as the pilot form does it.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}
const fieldNote: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
  color: 'var(--danger)', marginTop: '6px', lineHeight: 1.45,
}
const optional: React.CSSProperties = { textTransform: 'none', letterSpacing: 0, fontWeight: 500 }

function check(fd: FormData): Record<string, string> {
  const errs: Record<string, string> = {}
  const text = (k: string) => String(fd.get(k) ?? '').trim()
  if (fd.getAll('workshop').length === 0) errs.workshop = 'Pick at least one, or the one closest to what you have in mind.'
  if (!text('school_name')) errs.school_name = 'The school the workshop is for.'
  if (!text('contact_name')) errs.contact_name = 'Your name, so Justin knows who to reply to.'
  const email = text('email')
  if (!email) errs.email = 'The email the reply should go to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'That does not look like an email address.'
  const pupils = text('pupils')
  if (pupils && !/^\d{1,4}$/.test(pupils)) errs.pupils = 'A whole number, roughly is fine.'
  return errs
}

export default function WorkshopForm({ preselect }: { preselect?: string | null }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string[]>(() =>
    preselect && WORKSHOPS.some(w => w.id === preselect) ? [preselect] : [])

  const toggle = (id: string) =>
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const fd = new FormData(form)
    const found = check(fd)
    setErrs(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(first === 'workshop' ? 'input[name="workshop"]' : `[name="${first}"]`)?.focus()
      return
    }
    setState('sending')
    const result = await requestWorkshop(fd)
    if (result.ok) setState('done')
    else { setError(result.error); setState('idle') }
  }

  if (state === 'done') {
    return (
      <div role="status" style={{ background: 'var(--white)', border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-card)', padding: 'var(--space-5)', textAlign: 'center' }}>
        <div aria-hidden style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '8px' }}>
          Enquiry received
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '420px', margin: '0 auto' }}>
          Nothing is booked or charged yet. Justin replies within two working days, usually the same day, with a quote or a time to talk. A confirmation is on its way to your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={errs.workshop ? 'err-ws-workshop' : undefined}>
        <legend style={label}>Which workshop</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-2)' }}>
          {WORKSHOPS.map(w => {
            const on = picked.includes(w.id)
            return (
              <label key={w.id} className="gc-ws-chip" data-on={on || undefined} style={{
                display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', cursor: 'pointer',
                border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                background: on ? 'var(--stage-1)' : 'var(--white)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-3)',
              }}>
                <input type="checkbox" name="workshop" value={w.id} checked={on} onChange={() => toggle(w.id)}
                  style={{ marginTop: '3px', accentColor: 'var(--terracotta-dark)', width: 18, height: 18, flexShrink: 0 }} />
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{w.years}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>{w.title}</span>
                </span>
              </label>
            )
          })}
        </div>
        {errs.workshop && <p id="err-ws-workshop" role="alert" style={fieldNote}>{errs.workshop}</p>}
      </fieldset>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="ws_years">Year groups <span style={optional}>(optional)</span></label>
          <input className="input" id="ws_years" name="years" maxLength={120} placeholder="Year 6, both classes" />
        </div>
        <div>
          <label style={label} htmlFor="ws_pupils">Roughly how many pupils <span style={optional}>(optional)</span></label>
          <input className="input" id="ws_pupils" name="pupils" inputMode="numeric" maxLength={4} placeholder="60" aria-invalid={!!errs.pupils} aria-describedby={errs.pupils ? 'err-ws-pupils' : undefined} />
          {errs.pupils && <p id="err-ws-pupils" role="alert" style={fieldNote}>{errs.pupils}</p>}
        </div>
      </div>

      <div>
        <label style={label} htmlFor="ws_dates">Dates that would suit <span style={optional}>(optional, up to three)</span></label>
        <input className="input" id="ws_dates" name="dates" maxLength={300} placeholder="Tues 24 Nov, Thurs 26 Nov, any day the week after" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="ws_mode">How</label>
          <select className="input" id="ws_mode" name="mode" defaultValue="">
            <option value="">Not sure yet</option>
            <option value="in_person">In person</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div>
          <label style={label} htmlFor="ws_next">What would help first</label>
          <select className="input" id="ws_next" name="next" defaultValue="">
            <option value="">Either is fine</option>
            <option value="quote">A quote</option>
            <option value="call">A short call</option>
          </select>
        </div>
      </div>

      <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', cursor: 'pointer' }}>
        <input type="checkbox" name="parent" value="yes" style={{ accentColor: 'var(--terracotta-dark)', width: 18, height: 18 }} />
        Add a parent session for the same year group
      </label>

      <div>
        <label style={label} htmlFor="ws_school">School name</label>
        <input className="input" id="ws_school" name="school_name" required maxLength={200} placeholder="St Example CE Primary" autoComplete="organization" aria-invalid={!!errs.school_name} aria-describedby={errs.school_name ? 'err-ws-school' : undefined} />
        {errs.school_name && <p id="err-ws-school" role="alert" style={fieldNote}>{errs.school_name}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="ws_name">Your name</label>
          <input className="input" id="ws_name" name="contact_name" required maxLength={120} placeholder="Sam Carter" autoComplete="name" aria-invalid={!!errs.contact_name} aria-describedby={errs.contact_name ? 'err-ws-name' : undefined} />
          {errs.contact_name && <p id="err-ws-name" role="alert" style={fieldNote}>{errs.contact_name}</p>}
        </div>
        <div>
          <label style={label} htmlFor="ws_role">Your role <span style={optional}>(optional)</span></label>
          <input className="input" id="ws_role" name="role" maxLength={80} placeholder="PSHE lead" autoComplete="organization-title" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="ws_email">School email</label>
        <input className="input" id="ws_email" name="email" type="email" required maxLength={200} placeholder="s.carter@school.sch.uk" autoComplete="email" aria-invalid={!!errs.email} aria-describedby={errs.email ? 'err-ws-email' : undefined} />
        {errs.email && <p id="err-ws-email" role="alert" style={fieldNote}>{errs.email}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
        <div>
          <label style={label} htmlFor="ws_postcode">School postcode <span style={optional}>(optional)</span></label>
          <input className="input" id="ws_postcode" name="postcode" maxLength={12} placeholder="BS25 1AA" autoComplete="postal-code" />
        </div>
        <div>
          <label style={label} htmlFor="ws_phone">Phone <span style={optional}>(optional)</span></label>
          <input className="input" id="ws_phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="ws_message">Anything we should know <span style={optional}>(optional)</span></label>
        <textarea className="input" id="ws_message" name="message" maxLength={1000} rows={3} placeholder="Something that has happened in a year group, a parent evening date, pupils with additional needs" style={{ resize: 'vertical', minHeight: '84px', lineHeight: 1.5 }} />
      </div>

      {error && (
        <div role="alert" style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-tile)', color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-gold" disabled={state === 'sending'} style={{ justifyContent: 'center' }}>
        {state === 'sending' ? 'Sending…' : 'Send the enquiry'}
      </button>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
        Nothing is booked or charged. No pupil data, ever.
      </p>
    </form>
  )
}
