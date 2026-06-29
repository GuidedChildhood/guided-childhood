'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div style={{
      background: '#FBCFE8',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '.68rem',
        fontWeight: 600,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: '#9F1239',
        flexShrink: 0,
      }}>
        New law
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '.8rem',
        fontWeight: 600,
        color: 'var(--ink)',
        flex: 1,
        minWidth: 0,
        textAlign: 'center',
      }}>
        The UK under-16 social media ban was announced. Spring 2027.{' '}
        <strong>Your child's preparation is yours to build.</strong>
      </span>
      <Link
        href="/starter-pack"
        style={{
          background: '#BAE6FD',
          color: '#0C4A6E',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '.72rem',
          padding: '6px 14px',
          borderRadius: '100px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          flexShrink: 0,
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
          color: '#831843',
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
