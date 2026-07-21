'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi's fortnightly nudge on the Device Safety Hub: has a new device come
// into the house, and do the settings still match the child's age. It shows
// at most once every two weeks (the server keeps the clock), stamps the clock
// the moment it appears, and quietly thanks the parent when they confirm.

type Sweep = { due: boolean; childId?: string; childName?: string | null }

export default function DeviceSweepCard() {
  const [sweep, setSweep] = useState<Sweep | null>(null)
  const [done, setDone] = useState(false)
  const seenSent = useRef(false)

  useEffect(() => {
    fetch('/api/devices/sweep')
      .then(r => r.json())
      .then((d: Sweep) => { if (d?.due) setSweep(d) })
      .catch(() => { /* stay quiet on error */ })
  }, [])

  // Start the fortnight clock the moment the card renders, so it will not
  // reappear on the next visit whatever the parent taps.
  useEffect(() => {
    if (!sweep?.due || !sweep.childId || seenSent.current) return
    seenSent.current = true
    fetch('/api/devices/sweep', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'seen', childId: sweep.childId }),
    }).catch(() => { /* best effort */ })
  }, [sweep])

  const confirm = () => {
    if (sweep?.childId) {
      fetch('/api/devices/sweep', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'done', childId: sweep.childId }),
      }).catch(() => { /* best effort */ })
    }
    setDone(true)
  }

  if (!sweep?.due) return null

  const name = sweep.childName
  const question = name
    ? `Any new devices in the house for ${name}?`
    : 'Any new devices in the house?'

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: done ? 0 : '12px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={done ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            DiGi, every two weeks
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.35 }}>
            {done
              ? 'Lovely. DiGi will check in again in two weeks.'
              : question}
          </div>
          {!done && (
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>
              A new phone, console or tablet? Set it up here, and give the settings a look so they still match their age.
            </div>
          )}
        </div>
      </div>
      {!done && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={confirm}
            style={{ padding: '11px 17px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}
          >
            All checked
          </button>
          <button
            onClick={confirm}
            style={{ padding: '11px 17px', borderRadius: '12px', border: '1.5px solid var(--border)', cursor: 'pointer', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px' }}
          >
            Nothing new
          </button>
        </div>
      )}
    </div>
  )
}
