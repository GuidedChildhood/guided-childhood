'use client'
import { useState } from 'react'

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
      {/* No CTA up here: the header underneath already carries Log in and Get
          Started, so the top strip just states the law and can be dismissed. */}
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
