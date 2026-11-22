'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// EVERYTHING ELSE, ONE TAP AWAY.
//
// 22 November 2026: the school page now opens on Next up and the photo button.
// The week grid, the routines, sending to a child's phone, the forwarding
// address and the test push are all still here, folded under one line, because
// they are what a parent sets up once and visits occasionally. The house rule
// (decisions, 31 July): fold to a line that says what is inside, never remove.
//
// A link to something inside (#letterbox from Forward an email, #school-actions
// from Home) opens the fold first, then scrolls: a closed <details> cannot be
// scrolled to, and a link that lands on nothing reads as broken.

export default function SchoolMore({ label, hint, ids, children }: {
  label: string
  hint: string
  /** The anchors inside. A hash matching one opens the fold. */
  ids: string[]
  children: ReactNode
}) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.replace('#', '')
      if (!id || !ids.includes(id) || !ref.current) return
      ref.current.open = true
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
    open()
    window.addEventListener('hashchange', open)
    // The same link tapped twice changes no hash, so catch the tap as well.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (a && ids.includes(a.getAttribute('href')!.slice(1))) setTimeout(open, 0)
    }
    document.addEventListener('click', onClick)
    return () => { window.removeEventListener('hashchange', open); document.removeEventListener('click', onClick) }
  }, [ids])

  return (
    <details ref={ref} style={{ marginTop: 22 }}>
      <summary style={{
        listStyle: 'none', cursor: 'pointer', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '8px 16px',
      }}>
        <span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{label}</span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>{hint}</span>
        </span>
        <span aria-hidden style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>▼</span>
      </summary>
      <div style={{ paddingTop: 18 }}>{children}</div>
    </details>
  )
}
