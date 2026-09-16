'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestSupplies } from './actions'

// The supplies quote form. Short enough to fill in between lessons: who you
// are, what you need, roughly how many, and where it goes.
//
// WHAT YOU NEED IS ASKED FIRST, because that is the question the teacher
// arrived with. The counts appear only for the thing they picked, so a
// school that wants stickers never sees a book field it has to ignore.
//
// No price anywhere, on purpose. Validation in the house voice, under the
// field, the way the pilot and invoice forms do it.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}
const fieldNote: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
  color: 'var(--danger)', marginTop: '6px', lineHeight: 1.45,
}
const hint: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
  color: 'var(--ink-muted)', marginTop: '6px', lineHeight: 1.45,
}

type Want = 'books' | 'stickers' | 'both'

const WANT_OPTIONS: { key: Want; title: string; line: string }[] = [
  { key: 'books', title: 'Passport books', line: 'Printed and bound, five pages ready to fill. One per child.' },
  { key: 'stickers', title: 'Sticker sheets', line: 'One sticker per lesson, numbered to match the rings.' },
  { key: 'both', title: 'Both', line: 'A book and its stickers for every child.' },
]

function check(fd: FormData, want: Want): Record<string, string> {
  const errs: Record<string, string> = {}
  const text = (k: string) => String(fd.get(k) ?? '').trim()
  const num = (k: string) => Number(text(k))
  if (!text('school_name')) errs.school_name = 'The school the quote is for.'
  if (!text('contact_name')) errs.contact_name = 'Your name, so we know who to write to.'
  const email = text('email')
  if (!email) errs.email = 'The email the quote should go to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'That does not look like an email address.'
  if (want !== 'stickers' && !(num('book_count') > 0)) errs.book_count = 'Roughly how many books? A class of thirty is thirty.'
  if (want !== 'books' && !(num('sticker_count') > 0)) errs.sticker_count = 'Roughly how many sheets? One per child covers a class.'
  return errs
}

export default function SupplyForm() {
  const [want, setWant] = useState<Want>('both')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('want', want)
    const found = check(fd, want)
    setErrs(found)
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setState('sending')
    const result = await requestSupplies(fd)
    if (result.ok) setState('done')
    else { setError(result.error); setState('idle') }
  }

  if (state === 'done') {
    return (
      <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }} aria-hidden>📦</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '8px' }}>
          Request received
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '430px', margin: '0 auto 18px' }}>
          We reply within two working days with a price, a lead time and the postage. Nothing is ordered and nothing is charged until you say yes.
        </p>
        <Link href="/print/passport" className="btn btn-outline">Print the paper passport while you wait</Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* The radio itself is visually hidden so the whole card is the target,
          which means the CARD has to show focus or a keyboard user cannot see
          where they are. Inline styles cannot express :focus-within, so this
          one rule earns a style tag. */}
      <style>{`
        .gc-want:focus-within { outline: 3px solid var(--terracotta-dark); outline-offset: 2px; }
      `}</style>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ ...label, marginBottom: '10px' }}>What do you need?</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {WANT_OPTIONS.map(o => {
            const on = want === o.key
            return (
              <label key={o.key} className="gc-want" style={{
                display: 'block', cursor: 'pointer', borderRadius: '14px', padding: '12px 14px',
                border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                background: on ? 'var(--cream)' : '#fff', minHeight: '44px',
              }}>
                <input
                  type="radio" name="want" value={o.key} checked={on}
                  onChange={() => setWant(o.key)}
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                />
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{o.title}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '4px' }}>{o.line}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
        {want !== 'stickers' && (
          <div>
            <label style={label} htmlFor="sup_books">How many books</label>
            <input className="input" id="sup_books" name="book_count" inputMode="numeric" maxLength={6} placeholder="30" aria-invalid={!!errs.book_count} aria-describedby={errs.book_count ? 'err-sup-books' : undefined} />
            {errs.book_count && <p id="err-sup-books" role="alert" style={fieldNote}>{errs.book_count}</p>}
          </div>
        )}
        {want !== 'books' && (
          <div>
            <label style={label} htmlFor="sup_stickers">How many sticker sheets</label>
            <input className="input" id="sup_stickers" name="sticker_count" inputMode="numeric" maxLength={6} placeholder="30" aria-invalid={!!errs.sticker_count} aria-describedby={errs.sticker_count ? 'err-sup-stickers' : undefined} />
            {errs.sticker_count && <p id="err-sup-stickers" role="alert" style={fieldNote}>{errs.sticker_count}</p>}
          </div>
        )}
        <div>
          <label style={label} htmlFor="sup_stages">Which years</label>
          <input className="input" id="sup_stages" name="key_stages" maxLength={200} placeholder="Years 3 and 4" />
        </div>
      </div>
      <p style={{ ...hint, marginTop: '-8px' }}>A rough number is fine. We are quoting, not shipping, and the quote says what a smaller or larger run costs.</p>

      <div>
        <label style={label} htmlFor="sup_school">School name</label>
        <input className="input" id="sup_school" name="school_name" required maxLength={200} placeholder="St Example CE Primary" aria-invalid={!!errs.school_name} aria-describedby={errs.school_name ? 'err-sup-school' : undefined} />
        {errs.school_name && <p id="err-sup-school" role="alert" style={fieldNote}>{errs.school_name}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div>
          <label style={label} htmlFor="sup_name">Your name</label>
          <input className="input" id="sup_name" name="contact_name" required maxLength={120} placeholder="Sam Carter" aria-invalid={!!errs.contact_name} aria-describedby={errs.contact_name ? 'err-sup-name' : undefined} />
          {errs.contact_name && <p id="err-sup-name" role="alert" style={fieldNote}>{errs.contact_name}</p>}
        </div>
        <div>
          <label style={label} htmlFor="sup_email">Email for the quote</label>
          <input className="input" id="sup_email" name="email" type="email" required maxLength={200} placeholder="sam@stexample.sch.uk" aria-invalid={!!errs.email} aria-describedby={errs.email ? 'err-sup-email' : undefined} />
          {errs.email && <p id="err-sup-email" role="alert" style={fieldNote}>{errs.email}</p>}
        </div>
      </div>

      <div>
        <label style={label} htmlFor="sup_address">School delivery address</label>
        <textarea className="input" id="sup_address" name="delivery_address" rows={3} maxLength={500} placeholder="The school office, not a home address" style={{ resize: 'vertical' }} />
        <p style={hint}>The box goes to the school. We never ask for a pupil name or a home address, and the books arrive blank for the children to write their own.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div>
          <label style={label} htmlFor="sup_po">Purchase order number</label>
          <input className="input" id="sup_po" name="po_number" maxLength={80} placeholder="If you already have one" />
          <p style={hint}>Optional. A quote does not need one.</p>
        </div>
        <div>
          <label style={label} htmlFor="sup_notes">Anything else</label>
          <input className="input" id="sup_notes" name="notes" maxLength={1000} placeholder="Needed for the start of term" />
        </div>
      </div>

      {error && <p role="alert" style={{ ...fieldNote, marginTop: 0 }}>{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ alignSelf: 'flex-start', minHeight: '48px' }}>
        {state === 'sending' ? 'Sending…' : 'Ask for a quote'}
      </button>
      <p style={{ ...hint, marginTop: '-6px' }}>Nothing is ordered and nothing is charged. We reply with a price and you decide.</p>
    </form>
  )
}
