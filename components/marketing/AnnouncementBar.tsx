'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="announcement-bar">
      <span className="ann-badge" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '.68rem',
        fontWeight: 600,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,.75)',
        flexShrink: 0,
      }}>
        New law
      </span>
      <span className="ann-text" style={{
        fontFamily: 'var(--font-body)',
        fontSize: '.8rem',
        fontWeight: 600,
        color: '#fff',
        flex: 1,
        minWidth: 0,
        textAlign: 'center',
      }}>
        The UK under-16 social media ban was announced. Spring 2027.{' '}
        <strong>Your child's preparation is yours to build.</strong>
      </span>
      <Link
        href="/starter-pack"
        className="ann-cta"
        style={{
          background: 'var(--terracotta)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '.74rem',
          letterSpacing: '-0.01em',
          padding: '7px 16px',
          borderRadius: '100px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          border: 'none',
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}
      >
        Start here
      </Link>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          color: 'rgba(255,255,255,.7)',
          padding: '0 2px',
          flexShrink: 0,
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
