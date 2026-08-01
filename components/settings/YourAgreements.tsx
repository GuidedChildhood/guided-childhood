'use client'

import { useState } from 'react'
import Link from 'next/link'

// What you have agreed to, and how to take it back.
//
// Two separate things, kept separate on purpose. The Terms and the Privacy
// Policy are agreed by creating an account. The wellbeing check in is Article 9
// health data and was asked for on its own, which is why it has its own date
// and its own way out.
//
// The way out is the point. The consent wording promises "You can stop any time
// in Settings, and when you do, what we hold is deleted", and the route to do
// it has existed since migration 120, but nothing in the product called it. A
// withdrawal that only Justin can perform by hand is not a withdrawal, and
// under UK GDPR taking consent back has to be as easy as giving it. This is the
// button that makes the sentence true.

function ukDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const ROW: React.CSSProperties = {
  paddingTop: 14, marginTop: 14, borderTop: '1px solid var(--border)',
}

export default function YourAgreements({
  joinedAt,
  consentAt,
}: {
  joinedAt: string | null
  consentAt: string | null
}) {
  const [consented, setConsented] = useState(!!consentAt)
  const [asking, setAsking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const joined = ukDate(joinedAt)
  const agreed = ukDate(consentAt)

  const withdraw = async () => {
    if (busy) return
    setBusy(true)
    setFailed(false)
    try {
      const res = await fetch('/api/account/wellbeing-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreed: false }),
      })
      if (!res.ok) throw new Error('not saved')
      setConsented(false)
      setAsking(false)
    } catch {
      setFailed(true)
    }
    setBusy(false)
  }

  return (
    <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: 'var(--text-md)', marginBottom: '14px', color: 'var(--ink)' }}>What you have agreed to</h2>

      <div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          <strong>Terms and Privacy Policy.</strong> {joined ? `Agreed when you created your account on ${joined}.` : 'Agreed when you created your account.'}
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '4px 0 0' }}>
          Read the{' '}
          <Link href="/terms" style={{ color: 'var(--terracotta-dark)', fontWeight: 600, textDecoration: 'none' }}>Terms</Link>
          {' '}or the{' '}
          <Link href="/privacy" style={{ color: 'var(--terracotta-dark)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          {' '}any time.
        </p>
      </div>

      <div style={ROW}>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          <strong>Keeping how your child is doing.</strong>{' '}
          {consented
            ? agreed
              ? `You said yes on ${agreed}, so the weekly check in is saved and DiGi works from it.`
              : 'You said yes, so the weekly check in is saved and DiGi works from it.'
            : 'You have not agreed to this, so we are holding nothing from the weekly check in. We will ask, on its own, the first time you open it.'}
        </p>

        {consented && !asking && (
          <button
            onClick={() => setAsking(true)}
            style={{
              marginTop: 12, background: 'none', border: '1.5px solid var(--border)',
              borderRadius: '14px', padding: '10px 18px', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
              color: 'var(--terracotta-dark)',
            }}
          >
            Stop this and delete it
          </button>
        )}

        {consented && asking && (
          <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px', marginTop: 12 }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 12px' }}>
              Every check in you have saved is deleted now, and we stop keeping them. DiGi will still help, it just will not know how your weeks have been going. The rest of Guided Childhood carries on as normal.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={withdraw}
                disabled={busy}
                style={{
                  background: 'var(--terracotta)', border: 'none', borderRadius: '12px',
                  padding: '11px 18px', cursor: busy ? 'default' : 'pointer',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
                }}
              >
                {busy ? 'Deleting' : 'Yes, delete it'}
              </button>
              <button
                onClick={() => { setAsking(false); setFailed(false) }}
                style={{
                  background: 'none', border: '1.5px solid var(--border)', borderRadius: '12px',
                  padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)',
                }}
              >
                Keep it
              </button>
            </div>
            {failed && (
              <p role="status" style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 600, margin: '10px 0 0', lineHeight: 1.5 }}>
                That did not go through. Try again, and if it keeps failing email us and we will do it by hand the same day.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
