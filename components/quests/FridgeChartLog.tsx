'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { starWeekStart, previousStarWeekStart, formatWeekBeginning } from '@/lib/quests/star-week'

// The paper chart, folded into the app in one go. A family who ran the week on
// the fridge star chart taps in the stars earned offline, and they land in the
// same bank as the app stars, ready to spend as screen time. Kept quiet under
// a summary so it never crowds the page, and it says plainly this is for paper
// jobs, not ones already ticked here.
//
// Week aware from 10 August 2026: the parent picks this week or last (end of
// week entry is a Sunday night or a Monday morning, so those are the only two
// that exist), and the server REPLACES that child's total for that week.
// Entering again corrects a slip rather than doubling it, which is why the
// done card says Updated when there was already a number there.

export default function FridgeChartLog({ kids }: { kids: { id: string; name: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [childId, setChildId] = useState(kids[0]?.id ?? '')
  const [stars, setStars] = useState(5)
  const [weekStart, setWeekStart] = useState(starWeekStart())
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle')
  const [updated, setUpdated] = useState(false)
  const [error, setError] = useState('')

  if (kids.length === 0) return null
  const childName = kids.find(k => k.id === childId)?.name ?? 'your child'

  // Recomputed each render so a page left open over the Monday boundary still
  // offers the right two weeks the moment it is touched again.
  const weeks = [
    { start: starWeekStart(), label: 'This week' },
    { start: previousStarWeekStart(), label: 'Last week' },
  ]
  const weekLabel = formatWeekBeginning(weekStart)

  async function add() {
    setStatus('saving'); setError('')
    try {
      const res = await fetch('/api/quests/fridge-week', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, stars, weekStart }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.needsMigration ? 'The bank is still setting up, try again in a moment.' : 'Could not add them, try again.')
        setStatus('idle'); return
      }
      const d = await res.json().catch(() => ({}))
      setUpdated(Boolean(d.updated))
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
          <span aria-hidden style={{ fontSize: 'var(--text-xl)' }}>⭐</span>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            {updated
              ? <>Updated {childName}&apos;s week beginning {weekLabel} to {stars} star{stars === 1 ? '' : 's'}. The bank shows the new total.</>
              : <>Added {stars} star{stars === 1 ? '' : 's'} to {childName}&apos;s bank for the week beginning {weekLabel}. Ready to spend as screen time.</>}
          </p>
        </div>
        <button
          onClick={() => { setStatus('idle'); setStars(5) }}
          style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          Enter another week
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
        <span aria-hidden style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>🧲</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
            Ran the star chart on paper this week?
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '1px' }}>
            Enter the week&apos;s total and the stars land in the bank. Enter it again to correct it. For paper jobs, not ones already ticked here.
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-muted)', fontSize: 'var(--text-lg)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
      </button>

      {open && (
        <div style={{ marginTop: 14 }}>
          {kids.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {kids.map(k => (
                <button
                  key={k.id}
                  onClick={() => setChildId(k.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 100, cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                    background: k.id === childId ? 'var(--terracotta)' : '#fff',
                    border: k.id === childId ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                  }}
                >
                  {k.name}
                </button>
              ))}
            </div>
          )}

          {/* Which week the paper total belongs to. Deep teal like the
              builder's week chips, so weeks look the same wherever they are
              picked, and clearly different from the terracotta child chips
              above. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {weeks.map(w => (
              <button
                key={w.start}
                onClick={() => setWeekStart(w.start)}
                style={{
                  padding: '8px 14px', borderRadius: 13, cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                  color: w.start === weekStart ? '#fff' : 'var(--ink)',
                  background: w.start === weekStart ? 'var(--deep-teal)' : '#fff',
                  border: w.start === weekStart ? 'none' : '1.5px solid var(--border)',
                }}
              >
                {w.label}
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', opacity: 0.75 }}>
                  from {formatWeekBeginning(w.start)}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
            <button onClick={() => setStars(s => Math.max(1, s - 1))} aria-label="One fewer star" style={stepBtn}>−</button>
            <div style={{ textAlign: 'center', minWidth: 96 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1 }}>{stars}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 4 }}>
                star{stars === 1 ? '' : 's'} · {stars * 5} min
              </div>
            </div>
            <button onClick={() => setStars(s => Math.min(70, s + 1))} aria-label="One more star" style={stepBtn}>+</button>
          </div>

          <button
            onClick={add}
            disabled={status === 'saving'}
            className="btn btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: 'var(--text-base)', opacity: status === 'saving' ? 0.7 : 1 }}
          >
            {status === 'saving' ? 'Saving...' : `Add to ${childName}'s bank`}
          </button>
          {error && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', margin: '10px 0 0', textAlign: 'center' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

const stepBtn: React.CSSProperties = {
  width: 46, height: 46, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
  border: '1.5px solid var(--border)', background: '#fff', color: 'var(--ink)',
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
