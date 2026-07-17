'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LessonSendButton from '@/app/(dashboard)/dashboard/lessons/together/LessonSendButton'

// DiGi brings the lesson to the parent, so it never depends on finding the
// Lessons tab. One age relevant film the child has not watched yet, with the
// same two real choices the hub gives: do it together here on this device, or
// send it to the child's phone. Dismissible for the day so it is an offer, not
// a nag. This is the mobile answer to a nav that has no room for a Lessons tab.

export default function DigiLessonNudge({
  childId, childName, code, title, catchphrase,
}: {
  childId: string | null
  childName: string
  code: string
  title: string
  catchphrase?: string | null
}) {
  // Hidden until mounted, and stays hidden if already set aside today, so a
  // dismissed card never flashes back on the next render.
  const [show, setShow] = useState(false)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    try {
      if (localStorage.getItem('gc_lesson_nudge') !== today) setShow(true)
    } catch { setShow(true) }
  }, [])

  function dismiss() {
    try { localStorage.setItem('gc_lesson_nudge', new Date().toISOString().slice(0, 10)) } catch { /* off */ }
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      background: 'var(--stage-3)', border: '1.5px solid var(--border)',
      borderRadius: '18px', padding: '16px 18px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: 'var(--terracotta)', boxShadow: '0 3px 0 var(--terracotta-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '1rem', lineHeight: 1 }}>◎</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            A quick lesson from DiGi
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>
            {title}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 13px' }}>
        {catchphrase
          ? `${catchphrase} Five minutes with ${childName}, together here or sent to their phone.`
          : `Five minutes with ${childName}. Watch it together here, or send it to their phone.`}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href={`/dashboard/lessons/together/${code}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            border: 'none', borderRadius: '12px', padding: '9px 15px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          ▶ Watch together
        </Link>
        <LessonSendButton childId={childId} childName={childName} title={title} />
        <button
          onClick={dismiss}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', padding: '6px 4px',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
