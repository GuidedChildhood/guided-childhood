'use client'

import { useState } from 'react'
import { enterDraw } from './actions'

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}
const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: '12px',
  border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-md)', color: 'var(--ink)',
}

export default function DrawForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    const result = await enterDraw(new FormData(e.currentTarget))
    if (result.ok) setState('done')
    else { setError(result.error); setState('idle') }
  }

  if (state === 'done') {
    return (
      <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '8px' }}>You are in the draw</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0 }}>
          We draw once a term and email the winning school. Every school stays in until it wins, so it is a question of when.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'grid', gap: '16px' }}>
      <div>
        <label style={label} htmlFor="draw-school">School</label>
        <input id="draw-school" name="school_name" required style={input} placeholder="St Mary's Primary, Leeds" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={label} htmlFor="draw-name">Your name</label>
          <input id="draw-name" name="contact_name" required style={input} />
        </div>
        <div>
          <label style={label} htmlFor="draw-year">Year group</label>
          <input id="draw-year" name="year_group" style={input} placeholder="Year 5" />
        </div>
      </div>
      <div>
        <label style={label} htmlFor="draw-email">School email</label>
        <input id="draw-email" name="email" type="email" required style={input} placeholder="office@school.sch.uk" />
      </div>
      <div>
        <label style={label} htmlFor="draw-pupils">Pupils in the class</label>
        <input id="draw-pupils" name="pupil_count" type="number" min={1} style={input} placeholder="30" />
      </div>
      {error && <p style={{ margin: 0, color: '#B42318', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>{error}</p>}
      <button type="submit" className="btn btn-gold" disabled={state === 'sending'} style={{ padding: '15px 24px', fontSize: 'var(--text-md)', opacity: state === 'sending' ? 0.6 : 1 }}>
        {state === 'sending' ? 'Entering…' : 'Put my class in the draw'}
      </button>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
        One entry per school. We only use this to run the draw and send the pack.
      </p>
    </form>
  )
}
