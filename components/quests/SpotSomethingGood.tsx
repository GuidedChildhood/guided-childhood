'use client'

import { useState } from 'react'

// Spot something good, give a star on the spot. The reinforcement parents
// asked for: kindness, a job done without being asked, a sibling looked
// after, rewarded in the moment it happens, with the reason named and pinged
// to the child's own app. Chips carry the common reasons, free text carries
// the rest, and one to three stars keeps it a gesture, not an economy.

const REASONS: { emoji: string; label: string }[] = [
  { emoji: '💛', label: 'Being kind' },
  { emoji: '🤝', label: 'Helping without being asked' },
  { emoji: '🧸', label: 'Looking after their sibling' },
  { emoji: '🌟', label: 'A great attitude today' },
]

export default function SpotSomethingGood({ kids }: { kids: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [childId, setChildId] = useState(kids[0]?.id ?? '')
  const [reason, setReason] = useState('')
  const [custom, setCustom] = useState('')
  const [stars, setStars] = useState(1)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'notready' | 'error'>('idle')

  if (kids.length === 0) return null
  const child = kids.find(k => k.id === childId) ?? kids[0]
  const note = custom.trim() || reason

  async function send() {
    if (state === 'sending' || !note) return
    setState('sending')
    try {
      const r = await fetch('/api/quests/bonus', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: child.id, stars, note }),
      })
      if (r.ok) {
        setState('sent')
        setTimeout(() => { setState('idle'); setOpen(false); setReason(''); setCustom(''); setStars(1) }, 2600)
      } else {
        const d = await r.json().catch(() => ({}))
        setState(d?.needsMigration ? 'notready' : 'error')
        setTimeout(() => setState('idle'), 4000)
      }
    } catch { setState('error'); setTimeout(() => setState('idle'), 4000) }
  }

  const chip = (on: boolean): React.CSSProperties => ({
    padding: '8px 13px', borderRadius: '100px', cursor: 'pointer',
    border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
    background: on ? 'var(--terracotta-lt)' : '#fff',
    color: on ? 'var(--terracotta-dark)' : 'var(--ink-soft)',
    fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, whiteSpace: 'nowrap',
  })

  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px', marginTop: '18px' }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
        >
          <span aria-hidden style={{ width: 46, height: 46, borderRadius: '13px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>⭐</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.3 }}>
              Spot something good? Give a star
            </span>
            <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: 1.45 }}>
              Kindness, a job done without being asked. Reward it on the spot, it pings their app.
            </span>
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '12px', padding: '10px 15px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
            Give
          </span>
        </button>
      ) : (
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', marginBottom: '10px' }}>
            ⭐ What did {kids.length > 1 ? 'they' : child.name} do?
          </div>

          {kids.length > 1 && (
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {kids.map(k => (
                <button key={k.id} onClick={() => setChildId(k.id)} style={chip(k.id === child.id)}>{k.name}</button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {REASONS.map(r => (
              <button
                key={r.label}
                onClick={() => { setReason(reason === r.label ? '' : r.label); setCustom('') }}
                style={chip(reason === r.label && !custom.trim())}
              >
                {r.emoji} {r.label}
              </button>
            ))}
          </div>

          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Or say it in your words"
            maxLength={140}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none', marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => setStars(s)} style={{ ...chip(stars === s), padding: '8px 14px' }}>
                  {'⭐'.repeat(s)}
                </button>
              ))}
            </div>
            <button
              onClick={send}
              disabled={state === 'sending' || !note}
              style={{
                flex: 1, minWidth: '150px', background: note ? 'var(--terracotta)' : 'var(--border)', color: 'var(--ink)',
                border: 'none', borderRadius: '12px', padding: '12px 16px', cursor: note && state !== 'sending' ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: note ? '0 4px 0 var(--terracotta-dark)' : 'none',
              }}
            >
              {state === 'sending' ? 'Sending...'
                : state === 'sent' ? `Sent to ${child.name} ⭐`
                : state === 'notready' ? 'Run the latest database update first'
                : state === 'error' ? 'Did not send, try again'
                : `Give ${stars} star${stars === 1 ? '' : 's'} to ${child.name}`}
            </button>
            <button
              onClick={() => { setOpen(false); setReason(''); setCustom('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
