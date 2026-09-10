'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The door, always on screen.
//
// ── THE ONE THING ON THIS PAGE WORTH MORE THAN EVERY WORD CUT ───────────────
//
// The reveal was 9899px at 390 wide, and the only button that took a parent
// into the product was at the bottom of all of it. So a parent sold on screen
// three had nowhere to say yes: they had to keep reading, and reading is where
// people leave.
//
// Every app doing this job pins the button. Canva, foodpanda and KOHO all keep
// the trial CTA fixed while the detail scrolls behind it, and none of them is
// selling something a parent has to be talked into as carefully as this.
//
// It does NOT show at the top, because the first screen is the parent's own
// child's name and the worries they just typed, and a buy button over that
// reads as a shop rather than an answer. It arrives once they have scrolled
// past the first section, which is also the moment the real CTA at the bottom
// is still eight screens away.
//
// It hides again at the very bottom, where the real card is, so a parent does
// not end the page looking at two versions of the same button.

/** A link when there is somewhere to go, a button when there is something to
 *  do. Same look either way, so the bar never changes shape. */
function CTA({ href, onClick, style, tabIndex, children }: {
  href: string
  onClick?: () => void
  style?: React.CSSProperties
  /** The bar is hidden rather than unmounted, so it must leave the tab order
   *  when it is off screen. Carried through to whichever element is drawn. */
  tabIndex?: number
  children: React.ReactNode
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} tabIndex={tabIndex} style={{ ...style, border: 'none', cursor: 'pointer' }}>
        {children}
      </button>
    )
  }
  return <Link href={href} tabIndex={tabIndex} style={style}>{children}</Link>
}

export default function StickyJoin({
  href,
  label,
  note,
  onClick,
}: {
  href: string
  label: string
  /** One short line. The price and the four days live in the card at the foot. */
  note: string
  /** Given when the account does not exist yet: the bar opens the account step
   *  in place rather than navigating, because the account now comes AFTER this
   *  page. See plans/2026-09-10-starter-account-last.md. */
  onClick?: () => void
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const doc = document.documentElement
      const atEnd = y + window.innerHeight > doc.scrollHeight - 620
      setShow(y > 520 && !atEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden={!show}
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'rgba(250,249,246,0.94)', backdropFilter: 'blur(8px)',
        borderTop: '2px solid var(--ink)',
        transform: show ? 'translateY(0)' : 'translateY(115%)',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <CTA
          href={href}
          onClick={onClick}
          tabIndex={show ? 0 : -1}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px 18px', textDecoration: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)',
            border: '2px solid var(--ink)', borderRadius: 16, boxShadow: '0 4px 0 var(--ink)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          }}
        >
          {label} <span aria-hidden>→</span>
        </CTA>
        <p style={{
          margin: '6px 0 0', textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.04em', color: 'var(--ink-soft)',
        }}>
          {note}
        </p>
      </div>
    </div>
  )
}
