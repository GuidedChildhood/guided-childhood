'use client'

import { useState } from 'react'
import Link from 'next/link'
import { captureTasterLead } from './actions'

// THE BAR A LICENSED SCHOOL NEVER SEES.
//
// Rendered only when the access cookie is absent, so a school that has paid
// gets its lesson page back exactly as it was, with no advert sitting on top
// of the thing it bought.
//
// The lesson is NOT behind this form. Justin named the order himself: taster,
// then lead, then invoice. A teacher who arrives from a link has given us
// nothing yet and owes us nothing yet; the lesson is what earns the email,
// so the form sits beside the lesson rather than in front of it, and what it
// asks for is small enough to answer on a phone on a Tuesday.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

/** The slim line, for the player, where a form would wreck the very thing the
 *  teacher came to look at. */
export function TasterStrip() {
  return (
    <div style={{
      background: 'var(--tint-amber)', borderRadius: '14px',
      padding: '10px 16px', marginBottom: '18px',
      display: 'flex', flexWrap: 'wrap', gap: '8px 14px',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <span style={{ ...eyebrow, color: 'var(--stage-1-text)' }}>Free sample lesson</span>
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
        color: 'var(--stage-1-text)', lineHeight: 1.5,
      }}>
        Play it end to end. Nothing here is a demo, it is the lesson a licensed school teaches.
      </span>
    </div>
  )
}

export default function TasterBar({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    const result = await captureTasterLead(new FormData(e.currentTarget))
    if (result.ok) setState('done')
    else { setError(result.error); setState('idle') }
  }

  if (state === 'done') {
    return (
      <section style={{
        background: 'var(--tint-green)', border: '2px solid var(--retro-green-dark)',
        borderRadius: '20px', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '28px',
      }}>
        <p style={{ ...eyebrow, color: 'var(--retro-green-dark)', marginBottom: '10px' }}>That is yours</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: 'clamp(1.25rem, 3.4vw, 1.6rem)', letterSpacing: '-0.02em',
          lineHeight: 1.2, marginBottom: '10px',
        }}>
          The pack for this lesson is open now.
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
          color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '18px', maxWidth: '54ch',
        }}>
          Pupil booklet, knowledge organiser, the two quizzes and the learning record, all
          set for printing. Take them into a lesson and see how it lands. When you want the
          other twenty two, the whole staff room runs on one code.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href={`/print/${moduleId}`} className="btn btn-gold">Open the printable pack</Link>
          <Link href="/pricing" className="btn btn-outline">See pricing and request an invoice</Link>
        </div>
      </section>
    )
  }

  return (
    <section style={{
      background: '#fff', border: '2px solid var(--terracotta)',
      borderRadius: '20px', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '28px',
    }}>
      <p style={{ ...eyebrow, marginBottom: '10px' }}>Free sample · one of twenty three modules</p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
        fontSize: 'clamp(1.3rem, 3.6vw, 1.7rem)', letterSpacing: '-0.02em',
        lineHeight: 1.2, marginBottom: '10px',
      }}>
        This whole lesson is yours to teach. Nothing is locked.
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
        color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '56ch',
      }}>
        Read the plan, play the slides, use the script. It is the real thing, not a preview.
        Tell us where to send the printable pack and it opens straight away.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input type="hidden" name="module_id" value={moduleId} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={label} htmlFor="taster_contact_name">Your name</label>
            <input className="input" id="taster_contact_name" name="contact_name" required maxLength={120} placeholder="Sam Carter" />
          </div>
          <div>
            <label style={label} htmlFor="taster_school_name">School</label>
            <input className="input" id="taster_school_name" name="school_name" required maxLength={200} placeholder="St Example High" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={label} htmlFor="taster_email">School email</label>
            <input className="input" id="taster_email" name="email" type="email" required maxLength={200} placeholder="s.carter@school.sch.uk" />
          </div>
          <div>
            <label style={label} htmlFor="taster_role">Your role (optional)</label>
            <input className="input" id="taster_role" name="role" maxLength={80} placeholder="Head of PSHE" />
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
            borderRadius: '10px', color: 'var(--danger)', fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <button type="submit" className="btn btn-gold" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send me the pack'}
          </button>
          <Link href="/pricing" className="btn btn-outline">Pricing</Link>
        </div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--ink-muted)', lineHeight: 1.6,
        }}>
          One email about {moduleTitle}, and the pack. No card, no trial that expires on you.
        </p>
      </form>
    </section>
  )
}
