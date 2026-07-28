'use client'

import { useState } from 'react'

// What my grown up can see. Written for the child, not about them.
//
// The ICO Children's Code is explicit: if a parent can see what a child does,
// the child has to be told, in language they can actually understand. The
// welcome card mentions it in passing, but the welcome shows once and is
// dismissed forever, so a child who tapped past it on day one has no way back
// to the answer. This is always here.
//
// Closed by default so it is not a lecture, open on a tap so it is never a
// secret. And it says what we do NOT see as clearly as what we do, because that
// is the part a child actually wants to know and the part that earns the trust.

export default function KidPrivacyNote() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ margin: '18px 0 8px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, background: 'rgba(255,255,255,0.9)', border: '1.5px solid var(--border)',
          borderRadius: 16, padding: '12px 15px', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)' }}>
          What my grown up can see
        </span>
        <span aria-hidden style={{ fontSize: '15px', color: 'var(--ink-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>›</span>
      </button>

      {open && (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '15px', marginTop: 8 }}>
          <p style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 10px' }}>
            Your grown up set this up with you, so they can see:
          </p>
          <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
            <li style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: 5 }}>the jobs you tick off</li>
            <li style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: 5 }}>the stars you earn and spend</li>
            <li style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6 }}>how long your screen time timer has been running</li>
          </ul>
          <p style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 10px' }}>
            That is so they can say well done and send your stars. It is not there to catch you out.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 10px', fontWeight: 700 }}>
            They cannot see your messages, your photos, what you search for, or anything else on your device. We do not look at any of that either.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            If you are not happy about something here, tell your grown up. If you want to talk to somebody else, Childline is free on 0800 1111 and they will not tell anyone you called.
          </p>
        </div>
      )}
    </div>
  )
}
