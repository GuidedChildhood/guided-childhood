'use client'

import { useEffect, useState } from 'react'

// Founder only: the monthly PayPal run for Give £5, get £5 (migration 360).
//
// Once a month: download the PayPal file, upload it to PayPal Payouts, then
// tap Mark as paid. Anyone flagged for a hand check is left out of the file
// until looked at, which is the plan's stand in for a cap.

type Owed = { referrerId: string; code: string; paypalEmail: string | null; count: number; pence: number; thisMonth: number; handCheck: boolean }


export default function ReferralPayouts() {
  const [owed, setOwed] = useState<Owed[] | null>(null)
  const [note, setNote] = useState('')

  const load = () => fetch('/api/admin/referrals').then(r => r.ok ? r.json() : Promise.reject())
    .then(d => setOwed(d.owed)).catch(() => setNote('Founder only.'))
  useEffect(() => { load() }, [])

  const payable = (owed ?? []).filter(o => o.paypalEmail && !o.handCheck)
  const total = payable.reduce((n, o) => n + o.pence, 0)

  const markPaid = async () => {
    if (!window.confirm(`Mark ${payable.length} people (£${(total / 100).toFixed(2)}) as paid? Only do this after the PayPal payment has gone out.`)) return
    const res = await fetch('/api/admin/referrals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referrerIds: payable.map(o => o.referrerId) }) })
    const d = await res.json().catch(() => ({}))
    setNote(res.ok ? `Marked ${d.marked} rewards as paid.` : 'Could not mark them paid.')
    load()
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <p className="eyebrow" style={{ marginBottom: '4px' }}>Founder</p>
      <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.2rem)', fontWeight: 900, marginBottom: '8px' }}>Referral payouts</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '18px' }}>
        Once a month: download the PayPal file, upload it in PayPal Payouts, then mark as paid.
      </p>

      {note && <p role="status" style={{ marginBottom: '14px' }}>{note}</p>}

      {owed && owed.length === 0 && <p>Nobody is owed anything yet.</p>}

      {owed && owed.length > 0 && (
        <>
          {/* One row per person rather than a table: Justin runs this from his
              phone, and five columns at 390px hides what is owed. */}
          <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {owed.map(o => (
              <li key={o.referrerId} style={{ border: 'var(--edge)', borderRadius: '12px', background: 'var(--white)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{o.code}</strong>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>£{(o.pence / 100).toFixed(2)}</strong>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', overflowWrap: 'anywhere' }}>
                  {o.paypalEmail ?? 'No PayPal email yet'} · {o.count} friend{o.count === 1 ? '' : 's'}
                </p>
                {o.handCheck && (
                  <p style={{ margin: '6px 0 0', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>Look first: {o.thisMonth} this month</p>
                )}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/api/admin/referrals?format=csv" className="btn btn-gold" style={{ textDecoration: 'none', padding: '12px 18px' }}>Download PayPal file (£{(total / 100).toFixed(2)})</a>
            <button type="button" onClick={markPaid} disabled={payable.length === 0} className="btn" style={{ padding: '12px 18px' }}>Mark as paid</button>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '12px' }}>
            People with no PayPal email, or flagged to look at first, are left out of the file and stay owed.
          </p>
        </>
      )}
    </div>
  )
}
