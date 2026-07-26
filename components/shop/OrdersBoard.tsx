'use client'

import { useState } from 'react'
import { formatPence } from '@/lib/shop/catalogue'

// The fulfilment board. Everything needed to make one parcel is on one card,
// in the order the job is actually done: what to make, who it is for, where it
// goes, then the tick that says it is gone.
//
// The address has its own copy button because the alternative is selecting
// wrapped text on a phone and pasting half a postcode into a courier form.

export type OrderRow = {
  id: string
  status: 'paid' | 'fulfilled'
  totalPence: number
  email: string | null
  placedAt: string
  childName: string | null
  address: string[]
  lines: { name: string; qty: number }[]
}

export default function OrdersBoard({ rows }: { rows: OrderRow[] }) {
  // Local status so a tick lands instantly, and reverts if the server refuses.
  const [status, setStatus] = useState<Record<string, 'paid' | 'fulfilled'>>(
    Object.fromEntries(rows.map(r => [r.id, r.status])),
  )
  const [busy, setBusy] = useState<string | null>(null)

  async function toggle(id: string) {
    if (busy) return
    const was = status[id]
    const next = was === 'fulfilled' ? 'paid' : 'fulfilled'
    setBusy(id)
    setStatus(s => ({ ...s, [id]: next }))
    try {
      const res = await fetch('/api/shop/orders/fulfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, undo: next === 'paid' }),
      })
      if (!res.ok) setStatus(s => ({ ...s, [id]: was }))
    } catch {
      setStatus(s => ({ ...s, [id]: was }))
    }
    setBusy(null)
  }

  // To make first, then the ones already gone. Sorting on the live status means
  // a card sinks the moment it is ticked, which is the whole point of the board.
  const waiting = rows.filter(r => status[r.id] !== 'fulfilled')
  const done = rows.filter(r => status[r.id] === 'fulfilled')

  return (
    <>
      {waiting.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: 0 }}>
            To make
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
            {waiting.length}
          </span>
        </div>
      )}
      {waiting.map(r => <Card key={r.id} row={r} fulfilled={false} busy={busy === r.id} onToggle={() => toggle(r.id)} />)}

      {done.length > 0 && (
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink-muted)', margin: '30px 0 12px' }}>
          Posted
        </h2>
      )}
      {done.map(r => <Card key={r.id} row={r} fulfilled busy={busy === r.id} onToggle={() => toggle(r.id)} />)}
    </>
  )
}

function Card({ row, fulfilled, busy, onToggle }: { row: OrderRow; fulfilled: boolean; busy: boolean; onToggle: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(row.address.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* no clipboard, the address is on screen to read */ }
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
      padding: 20, marginBottom: 14, opacity: fulfilled ? 0.62 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {new Date(row.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {row.id.slice(0, 8)}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 21, color: 'var(--ink)' }}>
          {formatPence(row.totalPence)}
        </span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
        {row.lines.map((l, i) => (
          <li key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--ink)', lineHeight: 1.35 }}>
            {l.qty > 1 ? `${l.qty} × ` : ''}{l.name}
          </li>
        ))}
      </ul>

      {row.childName && (
        <p style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1.45 }}>
          Personalise for {row.childName}. Print their real stamps.
        </p>
      )}

      <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 15px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Post to
          </span>
          {row.address.length > 0 && (
            <button onClick={copyAddress} style={{
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: 10,
              padding: '5px 11px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--ink)',
            }}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        {row.address.length > 0 ? (
          <div style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.5 }}>
            {row.address.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        ) : (
          <div style={{ fontSize: 16.5, color: 'var(--terracotta-dark)', fontWeight: 700, lineHeight: 1.5 }}>
            No address on this order. Email them before making it.
          </div>
        )}
        {row.email && (
          <div style={{ fontSize: 15.5, color: 'var(--ink-muted)', marginTop: 8 }}>{row.email}</div>
        )}
      </div>

      <button
        onClick={onToggle}
        disabled={busy}
        style={{
          background: fulfilled ? '#fff' : 'var(--terracotta)',
          color: 'var(--ink)',
          border: fulfilled ? '1.5px solid var(--border)' : 'none',
          borderRadius: 16, padding: '13px 22px', cursor: busy ? 'wait' : 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17.5,
          boxShadow: fulfilled ? 'none' : '0 5px 0 var(--terracotta-dark)',
          opacity: busy ? 0.7 : 1,
        }}
      >
        {fulfilled ? 'Put back on the list' : 'Mark as posted'}
      </button>
    </div>
  )
}
