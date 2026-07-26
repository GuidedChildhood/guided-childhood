'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The fortnightly deal review. A family deal set once in week one quietly stops
// matching the family by week six: the jobs change, the child gets older, the
// screen time that felt right in the holidays does not in term time. So DiGi
// asks every couple of weeks whether it still fits, and gives the three things
// that follow in order: look at it, print the new one for the fridge, and the
// child sees the change in their own app straight away.
//
// Waved away, it stays quiet for another fortnight. The dismissal is per device
// in localStorage, the same way the other gentle nudges work, because a nudge
// is not worth a table.

const SNOOZE_KEY = 'gc_deal_review_snoozed'
const SNOOZE_DAYS = 14

export default function DealReviewNudge({
  daysSinceChange, childToken = null,
}: {
  // How long since anything in the deal actually moved. The server works this
  // out, so the card never claims a review is due when it is not.
  daysSinceChange: number
  // The child's own link, so send it to them is one tap rather than a hunt.
  childToken?: string | null
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (daysSinceChange < SNOOZE_DAYS) return
    try {
      const raw = localStorage.getItem(SNOOZE_KEY)
      if (raw) {
        const days = (Date.now() - Number(raw)) / 86400000
        if (days < SNOOZE_DAYS) return
      }
    } catch { /* private mode, just show it */ }
    setShow(true)
  }, [daysSinceChange])

  function snooze() {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now())) } catch { /* private mode */ }
    setShow(false)
  }

  if (!show) return null

  const weeks = Math.floor(daysSinceChange / 7)

  const action: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
    borderRadius: 12, padding: '11px 15px',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5,
  }

  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 16px' }}>
      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 20, padding: '17px 18px 18px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={27} mood="thinking" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              Every couple of weeks
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', lineHeight: 1.15, marginTop: 2 }}>
              Does the deal still fit?
            </div>
            <p style={{ fontSize: 17.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '7px 0 0' }}>
              Nothing has changed in the deal for about {weeks === 1 ? 'a week' : `${weeks} weeks`}. Jobs get outgrown and terms change shape. Have a look together, then put the new one on the fridge.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          <Link href="/dashboard/quests#quest-manager" style={{ ...action, background: 'var(--terracotta)', color: 'var(--ink)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            Review and update
          </Link>
          <Link href="/dashboard/quests/deal" style={{ ...action, background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)' }}>
            🖨️ Print for the fridge
          </Link>
          {childToken && (
            <a href={`/k/${childToken}`} target="_blank" rel="noreferrer" style={{ ...action, background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)' }}>
              See their app
            </a>
          )}
          <button onClick={snooze} style={{ ...action, background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontWeight: 700 }}>
            Not now
          </button>
        </div>

        {/* The reassurance that stops a parent worrying they have to resend
            anything: the child's app is the same live deal, always. */}
        <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '10px 0 0' }}>
          Anything you change lands in their app straight away. There is nothing to send.
        </p>
      </div>
    </div>
  )
}
