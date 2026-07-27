'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The paper chart, folded into the app in one go. A family who ran the week on
// the fridge Starter Pack chart taps in the stars earned offline, and they land
// in the same bank as the app stars, ready to spend as screen time. Kept quiet
// under a summary so it never crowds the busy board, and it says plainly this
// is for paper jobs, not ones already ticked here.

export default function FridgeChartLog({ kids }: { kids: { id: string; name: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [childId, setChildId] = useState(kids[0]?.id ?? '')
  const [stars, setStars] = useState(5)
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle')
  const [error, setError] = useState('')

  if (kids.length === 0) return null
  const childName = kids.find(k => k.id === childId)?.name ?? 'your child'

  async function add() {
    setStatus('saving'); setError('')
    try {
      const res = await fetch('/api/quests/fridge-week', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, stars }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.needsMigration ? 'The bank is still setting up, try again in a moment.' : 'Could not add them, try again.')
        setStatus('idle'); return
      }
      setStatus('done')
      router.refresh()
    } catch { setError('Could not add them, try again.'); setStatus('idle') }
  }

  const box: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '18px',
  }

  if (status === 'done') {
    return (
      <div style={box}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden style={{ fontSize: '22px' }}>⭐</span>
          <p style={{ fontSize: '14.5px', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            Added {stars} star{stars === 1 ? '' : 's'} to {childName}&apos;s bank. Ready to spend as screen time.
          </p>
        </div>
        <button
          onClick={() => { setStatus('idle'); setStars(5) }}
          style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          Log another week
        </button>
      </div>
    )
  }

  return (
    <div style={box}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      >
        <span aria-hidden style={{ fontSize: '22px', flexShrink: 0 }}>🧲</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)' }}>
            Ran the chart on paper this week?
          </span>
          <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '1px' }}>
            Add the fridge chart stars to the bank. For paper jobs, not ones already ticked here.
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-muted)', fontSize: '18px', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
      </button>

      {open && (
        <div style={{ marginTop: 14 }}>
          {kids.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {kids.map(k => (
                <button
                  key={k.id}
                  onClick={() => setChildId(k.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 100, cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)',
                    background: k.id === childId ? 'var(--terracotta)' : '#fff',
                    border: k.id === childId ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                  }}
                >
                  {k.name}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
            <button onClick={() => setStars(s => Math.max(1, s - 1))} aria-label="One fewer star" style={stepBtn}>−</button>
            <div style={{ textAlign: 'center', minWidth: 96 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.2rem', color: 'var(--ink)', lineHeight: 1 }}>{stars}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 4 }}>
                star{stars === 1 ? '' : 's'} · {stars * 5} min
              </div>
            </div>
            <button onClick={() => setStars(s => Math.min(70, s + 1))} aria-label="One more star" style={stepBtn}>+</button>
          </div>

          <button
            onClick={add}
            disabled={status === 'saving'}
            className="btn btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: '15.5px', opacity: status === 'saving' ? 0.7 : 1 }}
          >
            {status === 'saving' ? 'Adding...' : `Add to ${childName}'s bank`}
          </button>
          {error && <p style={{ fontSize: '13px', color: 'var(--danger)', margin: '10px 0 0', textAlign: 'center' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

const stepBtn: React.CSSProperties = {
  width: 46, height: 46, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
  border: '1.5px solid var(--border)', background: '#fff', color: 'var(--ink)',
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
