'use client'

import { useEffect, useState } from 'react'

// The answer to "how do I get back up?" after a nav tab drops a reader
// deep into the page (Justin, 12 Aug 2026). A quiet chunky button that
// appears once the hero is well out of view, bottom left so it never
// fights DiGi's corner, and rides back to the top smoothly. The logo
// does the same job in the header, this one saves the trip to it.
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
      }}
      style={{
        position: 'fixed', left: '18px', bottom: '18px', zIndex: 80,
        width: '46px', height: '46px', borderRadius: '16px',
        background: '#fff', border: '1.5px solid var(--border)',
        boxShadow: '0 5px 0 var(--border)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M5 14.5 L12 7.5 L19 14.5" fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
