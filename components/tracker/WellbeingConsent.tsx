'use client'

import { useState } from 'react'

// The gate in front of the weekly check in.
//
// The check in collects mood, sleep, how they are with friends, how they are
// after screens, and a free text note, against a named child. That is health
// information under Article 9, which needs explicit consent: specific, given
// separately from signing up, and as easy to take back as to give.
//
// So this asks, once, before anything is written. Unticked by default, because
// a pre-ticked box is not consent and the ICO has said so plainly. The parent
// can also just not do it: the rest of the product works without the check in,
// and saying no should cost them nothing.

export default function WellbeingConsent({ onAgreed }: { onAgreed: () => void }) {
  const [ticked, setTicked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const save = async () => {
    if (!ticked || saving) return
    setSaving(true)
    setFailed(false)
    try {
      const res = await fetch('/api/account/wellbeing-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreed: true }),
      })
      if (!res.ok) throw new Error('not saved')
      onAgreed()
    } catch {
      setFailed(true)
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: 6 }}>Before we start</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 14px' }}>
        One thing to agree first
      </h1>

      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: '18px 18px 20px' }}>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>
          The weekly check in asks how your child seems. Their mood, their sleep, how they are with friends, how they are after screens, and whether they are talking to you.
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>
          That is the most personal thing we hold, and the law treats it as health information. So we ask properly, on its own, rather than burying it in the terms you clicked when you signed up.
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>
          We use it for one thing: so DiGi knows what your week has actually been like and gives you advice that fits it. Never sold, never shared, and never used to make a judgement about your child. DiGi will tell you what you have logged and what has helped other families. It will not tell you what is wrong with your child.
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 18px' }}>
          You can stop any time in Settings, and when you do, what we hold is deleted. The rest of Guided Childhood works fine without this.
        </p>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: '12px 14px', borderRadius: 14, background: 'var(--cream)', border: `1.5px solid ${ticked ? 'var(--terracotta)' : 'var(--border)'}` }}>
          <input
            type="checkbox"
            checked={ticked}
            onChange={e => setTicked(e.target.checked)}
            style={{ width: 22, height: 22, marginTop: 1, flexShrink: 0, accentColor: 'var(--terracotta)' }}
          />
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>
            Yes, keep what I record about how my child is doing, so DiGi can help properly. I know I can stop and delete it whenever I want.
          </span>
        </label>

        <button
          onClick={save}
          disabled={!ticked || saving}
          className="btn btn-gold"
          style={{ marginTop: 16, width: '100%', padding: '14px 20px', fontSize: 'var(--text-md)', opacity: ticked ? 1 : 0.5, cursor: ticked ? 'pointer' : 'default' }}
        >
          {saving ? 'Saving' : 'Start the check in'}
        </button>

        {failed && (
          <p role="status" style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 600, margin: '10px 0 0' }}>
            That did not save. Try again, and if it keeps happening email us rather than carrying on.
          </p>
        )}
      </div>
    </div>
  )
}
