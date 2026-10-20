'use client'

import { useState } from 'react'

// THE GROWN UP SWITCH (sync plan G3). One line a parent can turn on for any
// child: the lessons play the together version on this phone, with a read
// aloud button, and the pass counts every check question answered. Written
// to children.lessons_together (migration 373) through the parent scoped
// route. Under 7 the lessons are together by age and the switch is not drawn.

export default function LessonsTogetherSwitch({ childId, childName, initialOn }: {
  childId: string
  childName: string
  initialOn: boolean
}) {
  const [on, setOn] = useState(initialOn)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    if (busy) return
    const next = !on
    setOn(next)
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/children/lessons-together', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, on: next }),
      })
      if (!res.ok) throw new Error('save failed')
    } catch {
      setOn(!next)
      setError('That did not save. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 14px', margin: '0 0 16px' }}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={toggle}
        disabled={busy}
        data-lessons-together
        style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
          background: 'none', border: 'none', padding: 0, cursor: busy ? 'default' : 'pointer', color: 'var(--ink)',
        }}
      >
        <span aria-hidden style={{
          flexShrink: 0, width: 44, height: 26, borderRadius: 13, position: 'relative',
          background: on ? 'var(--retro-green)' : '#fff', border: '1.5px solid var(--ink)', transition: 'background 160ms',
        }}>
          <span style={{
            position: 'absolute', top: 2, left: on ? 20 : 2, width: 19, height: 19, borderRadius: '50%',
            background: on ? '#fff' : 'var(--ink)', transition: 'left 160ms',
          }} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3 }}>
            {childName} does lessons with me
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
            {on
              ? `On. ${childName}'s lessons play the together version, with a Read it to me button, and the check counts every question answered.`
              : 'Off. Turn it on if a long read is hard: the lessons play the together version, with a Read it to me button.'}
          </span>
        </span>
      </button>
      {error && (
        <p role="status" style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--terracotta-dark)' }}>{error}</p>
      )}
    </div>
  )
}
