'use client'

import { useEffect, useState } from 'react'

// The school link setup: parent names the school and its sender addresses,
// gets a private DiGi address, and sets a one time forwarding rule in their
// own email. Works with Gmail, Outlook, anything. No inbox access needed.

const INBOUND_DOMAIN = process.env.NEXT_PUBLIC_SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.co.uk'

export default function SchoolLink() {
  const [schoolName, setSchoolName] = useState('')
  const [senders, setSenders] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/school/connect')
      .then(r => r.json())
      .then(d => {
        if (d.connection) {
          setSchoolName(d.connection.school_name ?? '')
          setSenders((d.connection.sender_addresses ?? []).join(', '))
          setToken(d.connection.forward_token ?? null)
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
    } catch { /* non-blocking */ }
    setSaving(false)
  }

  const address = token ? `school+${token}@${INBOUND_DOMAIN}` : null

  return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        School link
      </div>
      <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Let DiGi catch the school emails</h3>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Forward school emails to your private DiGi address and DiGi pulls out the things that matter: PE kit tomorrow, payment due, homework, trip forms. DiGi never sees your inbox, only what you forward.
      </p>

      <input className="input" placeholder="School name" value={schoolName} onChange={e => setSchoolName(e.target.value)} style={{ marginBottom: '10px' }} />
      <input className="input" placeholder="School sender addresses, comma separated (optional)" value={senders} onChange={e => setSenders(e.target.value)} style={{ marginBottom: '12px' }} />
      <button onClick={save} disabled={saving || !schoolName.trim()} className="btn btn-gold" style={{ fontSize: '13px', padding: '11px 20px' }}>
        {token ? 'Update school link' : 'Create my DiGi address'}
      </button>

      {address && (
        <div style={{ marginTop: '16px', background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink)', wordBreak: 'break-all', marginBottom: '10px' }}>
            {address}
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            One time setup in your email: create a forwarding rule for messages from your school to this address. In Gmail: Settings, Forwarding, add this address, then a filter for the school sender. Or simply forward any school email here manually and DiGi handles it.
          </p>
        </div>
      )}
    </div>
  )
}
