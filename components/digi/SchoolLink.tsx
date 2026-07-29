'use client'

import { useEffect, useState } from 'react'

// The school link setup: parent names the school and its sender addresses,
// gets a private DiGi address, and sets a one time forwarding rule in their
// own email. Works with Gmail, Outlook, anything. No inbox access needed.
// The address itself always comes from the connect API so the server is the
// single source of truth for the inbound domain.

// Not live yet. Justin's call: the inbound side is not ready, so a parent who
// names their school and taps the button gets an address that catches nothing,
// which is worse than not offering it. It stays visible and readable, greyed
// and clearly labelled as coming, so the feature is known about rather than
// hidden and then sprung on people later.
//
// One flag rather than commenting the block out, so turning it on is a one line
// change and nothing has to be rebuilt from memory.
const SCHOOL_LINK_LIVE = false

export default function SchoolLink() {
  const [schoolName, setSchoolName] = useState('')
  const [senders, setSenders] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!SCHOOL_LINK_LIVE) return
    fetch('/api/school/connect')
      .then(r => r.json())
      .then(d => {
        if (d.connection) {
          setSchoolName(d.connection.school_name ?? '')
          setSenders((d.connection.sender_addresses ?? []).join(', '))
          setToken(d.connection.forward_token ?? null)
          setAddress(d.connection.forward_address ?? null)
        }
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/school/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: schoolName, sender_addresses: senders.split(',').map(s => s.trim()).filter(Boolean) }),
      })
      const d = await res.json()
      if (d.forward_token) setToken(d.forward_token)
      if (d.forward_address) setAddress(d.forward_address)
    } catch { /* non-blocking */ }
    setSaving(false)
  }

  return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', opacity: SCHOOL_LINK_LIVE ? 1 : 0.55 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: SCHOOL_LINK_LIVE ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
          School link
        </span>
        {!SCHOOL_LINK_LIVE && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            background: 'rgba(26,26,46,0.06)', borderRadius: 100, padding: '3px 9px',
          }}>
            Coming soon
          </span>
        )}
      </div>
      <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Let DiGi catch the school emails</h3>
      <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Forward school emails to your private DiGi address and DiGi pulls out the things that matter: PE kit tomorrow, payment due, homework, trip forms. DiGi never sees your inbox, only what you forward.
      </p>

      <input className="input" placeholder="School name" value={schoolName} onChange={e => setSchoolName(e.target.value)} disabled={!SCHOOL_LINK_LIVE} style={{ marginBottom: '10px' }} />
      <input className="input" placeholder="School sender addresses, comma separated (optional)" value={senders} onChange={e => setSenders(e.target.value)} disabled={!SCHOOL_LINK_LIVE} style={{ marginBottom: '12px' }} />
      <button
        onClick={save}
        disabled={!SCHOOL_LINK_LIVE || saving || !schoolName.trim()}
        className="btn btn-gold"
        style={{ fontSize: '15px', padding: '11px 20px', cursor: SCHOOL_LINK_LIVE ? 'pointer' : 'not-allowed' }}
      >
        {token ? 'Update school link' : 'Create my DiGi address'}
      </button>
      {!SCHOOL_LINK_LIVE && (
        <p style={{ fontSize: '14.5px', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '12px 0 0' }}>
          Not switched on yet. Until it is, add the weekly things by hand on the School page and they will remind you both every week.
        </p>
      )}

      {address && (
        <div style={{ marginTop: '16px', background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', wordBreak: 'break-all', marginBottom: '10px' }}>
            {address}
          </div>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            One time setup in your email: create a forwarding rule for messages from your school to this address. The step by step walkthrough lives at <a href="/dashboard/school" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>School link setup</a>. Or simply forward any school email here manually and DiGi handles it.
          </p>
        </div>
      )}
    </div>
  )
}
