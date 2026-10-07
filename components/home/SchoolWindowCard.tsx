'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SchoolWindowData } from '@/lib/home/school-window-data'

// The school day card: before school and home from school, in the family's
// own window, on school days only. One move in the parent's hands, the words
// one tap away, and the one tap log that Justin asked for: "giving parents
// opportunity to log as a moment so we can track and provide best advice."
//
// THE THREE TAPS, AND WHAT EACH ONE REALLY DOES. Said on the card too, because
// the check in rule since 7 October is that the parent is told exactly what
// happens.
//   It happened   → /api/daily/feedback with the moment key and the child.
//                   The existing route turns it into the concern it is (a TV
//                   first thing tap lands on Morning TV, a coming off tap on
//                   Coming off screens), bumps the count on a repeat, wakes a
//                   resolved worry, and marks today's moment step done. The
//                   daily check in picks it up tomorrow.
//   Went fine     → the same route with no moment, so today's moment step is
//                   done and nothing is flagged. A calm one is still a day.
//   I tried it    → /api/moments/tried with the deck card for this window, so
//                   DiGi asks how it went in a week and the answer counts with
//                   every other family's on the same card.
// Framed as logging it WITH the child, never about them: the copy names the
// morning or the return, not the child's behaviour.
//
// Dismiss is per day in localStorage. The card returns tomorrow because the
// window does; it never nags inside a day.

const SEEN_KEY = 'gc_school_window_done'

type Done = 'happened' | 'fine' | 'tried' | null

export default function SchoolWindowCard({ data }: { data: SchoolWindowData }) {
  const [done, setDone] = useState<Done>(null)
  const [hidden, setHidden] = useState(true)
  const [busy, setBusy] = useState(false)
  const storageKey = `${data.dateKey}:${data.window}:${data.childId ?? 'family'}`

  useEffect(() => {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}') as Record<string, string>
      const prior = seen[storageKey]
      if (prior === 'happened' || prior === 'fine' || prior === 'tried') setDone(prior)
      setHidden(prior === 'dismissed')
    } catch { setHidden(false) }
  }, [storageKey])

  function remember(value: string) {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}') as Record<string, string>
      // Keep the store small: only today's keys survive.
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(seen)) if (k.startsWith(data.dateKey)) next[k] = v
      next[storageKey] = value
      localStorage.setItem(SEEN_KEY, JSON.stringify(next))
    } catch { /* private mode */ }
  }

  async function log(kind: Exclude<Done, null>) {
    if (busy) return
    setBusy(true)
    try {
      if (kind === 'tried') {
        if (data.momentId) {
          await fetch('/api/moments/tried', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ momentId: data.momentId, child_id: data.childId ?? undefined, solution: data.copy.move }),
          })
        }
      } else {
        await fetch('/api/daily/feedback', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moments: kind === 'happened' ? [data.copy.momentKey] : [], child_id: data.childId }),
        })
      }
      setDone(kind)
      remember(kind)
    } catch { /* the card stays, the parent can tap again */ } finally {
      setBusy(false)
    }
  }

  if (hidden) return null

  const kid = data.childName ?? 'your child'
  const momentWord = data.window === 'morning' ? 'morning' : 'return home'
  const scriptHref = data.scriptSortOrder ? `/dashboard/scripts/${data.scriptSortOrder}` : '/dashboard/scripts'

  const pill = (label: string, onClick: () => void, tone: 'ink' | 'soft') => (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
        color: 'var(--ink)', background: tone === 'ink' ? 'var(--terracotta)' : '#fff',
        border: 'var(--edge)', borderRadius: '12px', padding: '10px 14px', minHeight: 44,
        boxShadow: tone === 'ink' ? '0 3px 0 var(--terracotta-dark)' : 'none', cursor: busy ? 'wait' : 'pointer',
      }}
    >
      {label}
    </button>
  )

  return (
    <div id="school-window" style={{ scrollMarginTop: '72px', marginBottom: '22px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFF7EA 0%, #FCEAC0 100%)', border: 'var(--edge)', boxShadow: 'var(--lift)',
        borderRadius: 'var(--radius-card)', padding: '18px 18px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
            {data.copy.eyebrow}{data.childName ? ` · ${data.childName}` : ''}
          </span>
          <button
            type="button"
            onClick={() => { setHidden(true); remember('dismissed') }}
            aria-label="Not today"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontSize: 'var(--text-base)', padding: '6px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, margin: '6px 0 8px', letterSpacing: '-0.01em' }}>
          {data.copy.title}
        </h3>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
          {data.copy.move}
        </p>

        {done === null ? (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '14px 0 8px' }}>
              How did the {momentWord} go? One tap logs it with {kid}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pill('Went fine', () => log('fine'), 'ink')}
              {pill('It happened', () => log('happened'), 'soft')}
              {pill('I tried it', () => log('tried'), 'soft')}
              <Link href={scriptHref} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)',
                textDecoration: 'none', padding: '10px 14px', minHeight: 44, display: 'inline-flex', alignItems: 'center',
                border: 'var(--edge)', borderRadius: '12px', background: '#fff',
              }}>
                Read the words ›
              </Link>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '10px 0 0', lineHeight: 1.45 }}>
              {data.copy.tapNote} Went fine counts the day as done and flags nothing. I tried it means DiGi asks how it went in a week.
            </p>
          </>
        ) : (
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', fontWeight: 700, margin: '14px 0 0', lineHeight: 1.45 }}>
            {done === 'fine' && `Logged as a calm ${momentWord}. That is today's moment done.`}
            {done === 'happened' && `Logged. This ${momentWord} is on ${kid}'s check in from tomorrow, and the words are one tap away.`}
            {done === 'tried' && `Noted. DiGi will ask how it went in a week, and the answer helps every family on the same moment.`}
            {done === 'happened' && (
              <> <Link href={scriptHref} style={{ color: 'var(--ink)' }}>Read the words</Link></>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
