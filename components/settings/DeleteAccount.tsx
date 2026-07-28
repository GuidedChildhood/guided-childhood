'use client'

import { useState } from 'react'

// Delete this account, for real.
//
// The privacy policy has always said "if you close your account or ask us to
// delete your data, we remove it". Until now nothing in the product could do
// it, so honouring that promise meant Justin going into the Supabase dashboard
// by hand. Under UK GDPR the right to erasure carries a one month deadline, and
// a promise you can only keep manually is one you will eventually miss.
//
// Two steps and a typed word, because this is the only thing here that cannot
// be undone and a mis-tap on a phone should not end a family's history.

export default function DeleteAccount() {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ready = typed.trim().toUpperCase() === 'DELETE'

  const go = async () => {
    if (!ready || busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: typed.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error ?? 'Could not delete')
      window.location.href = '/'
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <section style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1.5px solid var(--border)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', margin: '0 0 6px' }}>
        Delete my account
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        This removes everything: your children, their jobs and stars, the passport, anything you have recorded about how they are doing, and the whole conversation with DiGi. It cannot be undone and we cannot get it back for you.
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'none', border: '1.5px solid var(--border)', borderRadius: '14px',
            padding: '10px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)',
            fontSize: '15px', fontWeight: 600, color: 'var(--terracotta-dark)',
          }}
        >
          Delete my account
        </button>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px' }}>
          <label htmlFor="confirm-delete" style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '10px' }}>
            Type <strong>DELETE</strong> to confirm.
          </label>
          <input
            id="confirm-delete"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            autoComplete="off"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '12px',
              border: '1.5px solid var(--border)', background: 'var(--cream)',
              fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={go}
              disabled={!ready || busy}
              style={{
                background: ready ? 'var(--terracotta)' : 'var(--border)', border: 'none',
                borderRadius: '12px', padding: '11px 18px', cursor: ready && !busy ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)',
              }}
            >
              {busy ? 'Deleting' : 'Delete everything'}
            </button>
            <button
              onClick={() => { setOpen(false); setTyped(''); setError(null) }}
              style={{
                background: 'none', border: '1.5px solid var(--border)', borderRadius: '12px',
                padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: '15px', fontWeight: 600, color: 'var(--ink-soft)',
              }}
            >
              Keep my account
            </button>
          </div>
          {error && (
            <p role="status" style={{ fontSize: '14.5px', color: 'var(--terracotta-dark)', fontWeight: 600, margin: '10px 0 0', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
