'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { TermPreview } from '@/lib/learning/term-preview'

// What the class is doing next term, three lines, on the parent's home screen.
//
// Justin, 10 August 2026, choosing the shape: "three subjects with one line
// each". The full objective list already exists at /dashboard/learning for a
// parent who wants it, and this is not that. This is the version that gets read
// standing up.
//
// Dismissal follows SchoolAheadCard exactly, which already solved this for
// school events: a display preference in localStorage, keyed by the term, so
// turning it off applies to THIS Easter and not to every Easter the child is
// ever in this school. It stays out of the database because a card somebody
// closed is not a fact about the family.

export default function TermPreviewCard({
  preview,
  childName,
}: {
  preview: TermPreview
  childName?: string | null
}) {
  const key = `gc.termpreview.${preview.label.replace(/\s+/g, '-').toLowerCase()}`
  const [hidden, setHidden] = useState(true)

  // Starts hidden and appears once storage has been read, so a dismissed card
  // never flashes up on load.
  useEffect(() => {
    try { setHidden(window.localStorage.getItem(key) === '1') } catch { setHidden(false) }
  }, [key])
  if (hidden) return null

  function dismiss() {
    try { window.localStorage.setItem(key, '1') } catch { /* private mode, back next load */ }
    setHidden(true)
  }

  const who = childName && childName !== 'Your child' ? childName : 'they'

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
      padding: '18px 20px', marginBottom: 18, position: 'relative',
      boxShadow: '0 2px 10px rgba(26,26,46,0.04)',
    }}>
      <button
        onClick={dismiss}
        aria-label="Not now"
        style={{
          position: 'absolute', top: 12, right: 12, width: 30, height: 30,
          borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--cream)',
          color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1, cursor: 'pointer',
        }}
      >
        ×
      </button>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        marginBottom: 4,
      }}>
        {preview.inHoliday ? 'When they go back' : 'This term'}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2, paddingRight: 34,
      }}>
        {preview.label}
      </h3>

      {/* "The class", never "your child". We know what a Year 4 in England is
          taught. We do not know what THIS child has understood, and the sentence
          has to be honest about which of the two it is. Same rule yearBlurb
          follows on the learning page. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        What the class will be working on. Knowing the words helps when {who} {preview.inHoliday ? 'comes home talking about it' : 'mentions it'}.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
        {preview.subjects.map(s => (
          <div key={s.label}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', lineHeight: 1.25,
            }}>
              {s.label}
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              {s.line}
            </div>
          </div>
        ))}
      </div>

      {/* One thing to do, from the leading subject. A card that only names the
          topics is a school newsletter; the thing that makes it a service is
          having something to actually do with it tonight. */}
      {preview.subjects[0] && (
        <div style={{
          background: 'var(--cream)', borderRadius: 14, padding: '12px 14px', marginBottom: 12,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4,
          }}>
            One thing to try
          </div>
          <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45 }}>
            {preview.subjects[0].tryThis}
          </div>
        </div>
      )}

      <Link href="/dashboard/learning" style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
        color: 'var(--terracotta-dark)', textDecoration: 'none',
      }}>
        See the whole term ›
      </Link>
    </div>
  )
}
