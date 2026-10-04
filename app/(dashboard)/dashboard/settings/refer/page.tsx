'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { shareMessage } from '@/lib/referrals'

// Give £5, get £5 (migration 360, plan: plans/2026-10-03-cross-referral-plan.md).
//
// Under settings so it stays open to every account, paying or not: anyone with
// a free account can share. The page shows the link, a share button with the
// disclosure already in the message, where the £5 goes, and each friend's
// progress so the two month wait reads as progress rather than silence.

type Friend = { status: string; since: string; joinedAt: string | null }
type Data = { code: string; paypalEmail: string | null; friends: Friend[]; earnedPence: number }

const card = { background: 'var(--cream)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)', padding: '20px 22px', marginBottom: '16px' } as const
const label = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', marginBottom: '6px' }

function day(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(new Date(iso))
}

function friendLine(f: Friend): string {
  if (f.status === 'paid') return `£5 paid to you, ${day(f.since)}`
  if (f.status === 'qualified') return '£5 owed to you. It goes out in the next PayPal payment, at the start of the month.'
  if (f.status === 'joined') {
    const due = f.joinedAt ? new Date(new Date(f.joinedAt).getTime() + 31 * 86_400_000).toISOString() : null
    return due ? `Joined. Your £5 is due once they pay for their second month, around ${day(due)}.` : 'Joined. Your £5 is due once they pay for their second month.'
  }
  return `Started joining on ${day(f.since)}. Nothing is owed until they pay.`
}

export default function ReferPage() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)
  const [paypal, setPaypal] = useState('')
  const [saved, setSaved] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referrals').then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Data) => { setData(d); setPaypal(d.paypalEmail ?? '') })
      .catch(() => setFailed(true))
  }, [])

  const link = data ? `${window.location.origin}/r/${data.code}` : ''
  const message = data ? shareMessage(link) : ''

  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: 'Guided Childhood', text: message }); return }
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch { /* the parent closed the share sheet */ }
  }
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true) } catch { /* clipboard blocked */ }
  }
  const savePaypal = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaved('')
    const res = await fetch('/api/referrals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paypalEmail: paypal }) })
    const body = await res.json().catch(() => ({}))
    setSaved(res.ok ? 'Saved. Your £5 rewards go here.' : (body.error ?? 'Could not save that.'))
  }

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Settings</Link>

      <div style={{ margin: '14px 0 22px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Tell a friend</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>Give £5, get £5</h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
          Your friend gets £5 off their first month. Once they have stayed for two months, we send you £5 by PayPal.
        </p>
      </div>

      {failed && <div style={card}><p style={{ margin: 0 }}>This is not ready just yet. Please try again later.</p></div>}

      {data && (
        <>
          <section style={card}>
            <span style={label}>Your link</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <code style={{ flex: '1 1 200px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--white)', border: 'var(--edge)', borderRadius: '10px', padding: '10px 12px' }}>{link}</code>
              <button type="button" onClick={copyLink} className="btn" style={{ padding: '10px 16px', fontSize: 'var(--text-sm)' }}>{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <button type="button" onClick={share} className="btn btn-gold" style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: 'var(--text-md)' }}>Share with a friend</button>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '10px 0 0', lineHeight: 1.45 }}>
              The message says you get £5 too. The law asks for that when a link earns you something, so please keep it in if you edit it.
            </p>
          </section>

          <section style={card}>
            <form onSubmit={savePaypal}>
              <label htmlFor="paypal" style={label}>Where your £5 goes</label>
              <input id="paypal" className="input" type="email" value={paypal} onChange={e => setPaypal(e.target.value)} placeholder="Your PayPal email" style={{ width: '100%', marginBottom: '10px' }} />
              <button type="submit" className="btn" style={{ padding: '10px 18px', fontSize: 'var(--text-sm)' }}>Save</button>
              {saved && <p role="status" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '8px 0 0' }}>{saved}</p>}
            </form>
          </section>

          <section style={card}>
            <span style={label}>Your friends{data.earnedPence > 0 ? `, £${(data.earnedPence / 100).toFixed(0)} earned` : ''}</span>
            {data.friends.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Nobody yet. When a friend joins with your link, you will see how they are getting on here.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.friends.map((f, i) => (
                  <li key={i} style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: '10px', padding: '10px 12px', fontSize: 'var(--text-sm)', lineHeight: 1.45 }}>
                    <strong style={{ fontFamily: 'var(--font-display)' }}>Friend {data.friends.length - i}</strong>: {friendLine(f)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <details style={{ ...card, background: 'var(--white)' }}>
            <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer' }}>The small print</summary>
            <ul style={{ listStyle: 'disc', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, paddingLeft: '18px', margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>You must be 18 or over. Your friend must be new to Guided Childhood.</li>
              <li>Your friend gets £5 off their first paid month when they join with your link.</li>
              <li>You get £5 once they have paid for two months, or 60 days after paying for a year. A refund cancels it.</li>
              <li>We pay by PayPal at the start of each month, to the email above.</li>
              <li>There is no limit. We may check by hand if one link earns a lot in a month.</li>
              <li>Referring yourself, or a second account of your own, does not count.</li>
            </ul>
          </details>
        </>
      )}
    </div>
  )
}
