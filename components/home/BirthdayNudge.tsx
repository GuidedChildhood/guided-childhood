'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The growing up switch, offered at the right moment. The birthday field
// lives in Settings, but a parent who skipped it at setup never goes hunting
// for it, so once the family is settled in (a few days old) this one warm
// card names the benefit: set the birthday and the stage, the lessons, the
// screen time guide and the contract all grow up with the child on their
// own, celebration on the day included. One tap to Settings, one tap to
// dismiss for a month, gone for good once every birthday is set.

const SNOOZE_DAYS = 30

export default function BirthdayNudge({ kidNames }: { kidNames: string[] }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (kidNames.length === 0) return
    try {
      const until = Number(localStorage.getItem('gc_bday_nudge_snooze') || '0')
      if (Date.now() < until) return
    } catch { /* show anyway */ }
    setShow(true)
  }, [kidNames.length])

  if (!show) return null

  const names = kidNames.length === 1 ? kidNames[0]
    : kidNames.length === 2 ? `${kidNames[0]} and ${kidNames[1]}`
    : `${kidNames.slice(0, -1).join(', ')} and ${kidNames[kidNames.length - 1]}`

  function snooze() {
    try { localStorage.setItem('gc_bday_nudge_snooze', String(Date.now() + SNOOZE_DAYS * 86400000)) } catch { /* fine */ }
    setShow(false)
  }

  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px 17px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
        <span aria-hidden style={{ width: 44, height: 44, borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', flexShrink: 0 }}>🎂</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.3 }}>
            Add {names}&apos;s birthday and the app grows up with them
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '3px 0 10px' }}>
            One date, set once: the stage, the lessons, the screen time guide and the deal all move up on their own as they get older, with a little celebration on the day. Nothing to remember later.
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/settings" style={{ background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '11px', padding: '9px 15px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
              Set the birthday →
            </Link>
            <button onClick={snooze} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12.5px', color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
