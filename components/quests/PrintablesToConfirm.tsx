'use client'

import { useEffect, useState } from 'react'

// The printables a child says they finished at home, waiting on a grown up to
// confirm. One tap confirms and lands the stars in their bank, and the child's
// app flips the node to done and hears the yes. "Not this time" declines it
// warmly, no stars, nothing said harshly. Mirrors the quest approve control,
// and refreshes the Waiting on you banner and bell the instant it acts.

type Item = { id: string; title: string; emoji: string | null; stars: number; childName: string }

export default function PrintablesToConfirm() {
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    try {
      const r = await fetch('/api/printables/confirm', { cache: 'no-store' })
      const d = await r.json()
      setItems(Array.isArray(d.items) ? d.items : [])
    } catch { /* nothing to show */ }
  }
  useEffect(() => { load() }, [])

  async function decide(id: string, decision: 'confirm' | 'decline') {
    if (busy) return
    setBusy(id)
    try {
      const r = await fetch('/api/printables/confirm', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (r.ok) {
        setItems(list => list.filter(i => i.id !== id))
        try { window.dispatchEvent(new Event('gc:notifs-changed')) } catch { /* fine */ }
      }
    } catch { /* leave it for a retry */ } finally { setBusy(null) }
  }

  if (items.length === 0) return null

  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px', marginTop: '18px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '10px' }}>
        Printables to confirm
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 14px' }}>
            <span aria-hidden style={{ fontSize: '1.5rem', flexShrink: 0 }}>{it.emoji ?? '🖍️'}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.3 }}>
                {it.childName} finished {it.title}
              </span>
              <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                Confirm to land {it.stars} star{it.stars === 1 ? '' : 's'}
              </span>
            </span>
            <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
              <button
                onClick={() => decide(it.id, 'confirm')}
                disabled={busy === it.id}
                style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '11px', padding: '9px 14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}
              >
                {busy === it.id ? '...' : 'Confirm ⭐'}
              </button>
              <button
                onClick={() => decide(it.id, 'decline')}
                disabled={busy === it.id}
                title="Not done yet"
                style={{ background: '#fff', color: 'var(--ink-muted)', border: '1.5px solid var(--border)', borderRadius: '11px', padding: '9px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, whiteSpace: 'nowrap' }}
              >
                Not yet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
