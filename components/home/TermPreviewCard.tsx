'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BetaTag from '@/components/ui/BetaTag'
import type { TermPreview } from '@/lib/learning/term-preview'

// What the class is doing next term, on the parent's home screen.
//
// Justin, 10 August 2026, choosing the shape: "three subjects with one line
// each". The full objective list already exists at /dashboard/learning for a
// parent who wants it, and this is not that. This is the version that gets read
// standing up.
//
// ── IT STOPPED BEING THAT, SO IT HAS BEEN CUT BACK ───────────────────────────
//
// Justin, 11 August 2026, with two screenshots of it filling a whole phone and
// running under the tab bar: "can this shrink up."
//
// It had grown into a page on a card: three subjects with a line each, a thing
// to try, and a four sentence caveat about how schools sequence a term. Every
// piece of that was worth saying and not one of them was worth saying HERE.
// Home is a landing, and a card that needs scrolling on a landing is a page
// that has escaped.
//
// So what is left is the shape of the term and nothing else: what it is, which
// subjects, and a way in. The thing to try, the caveat and the objectives all
// live on /dashboard/learning, which is where a parent who has actually got
// two minutes has already gone.
//
// The BETA tag is the other half of Justin's ask. It sets the expectation, so
// a parent meeting a thin corner reads it as early rather than broken, and it
// is a reason to open the thing rather than a warning off it.
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
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        marginBottom: 4, paddingRight: 34,
      }}>
        {preview.inHoliday ? 'When they go back' : 'This term'}
        <BetaTag />
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
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        What the class will be working on, so the words are familiar when {who} {preview.inHoliday ? 'comes home talking about it' : 'mentions it'}.
      </p>

      {/* The subjects as names only. The line under each one was the single
          biggest thing making this card a page, and it is the first thing a
          parent reads on the other side of the tap anyway. */}
      {preview.subjects.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {preview.subjects.map(s => (
            <span key={s.label} style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700,
              color: 'var(--ink)', background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '5px 11px', lineHeight: 1.35,
            }}>
              {s.label}
            </span>
          ))}
        </div>
      )}

      {/* One tap, and it says where it goes. "See the whole term" was accurate
          and undersold it: the term list is one of three things on the other
          side, alongside getting ahead and making sense of homework. */}
      <Link href="/dashboard/learning" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
        color: 'var(--terracotta-dark)', textDecoration: 'none',
      }}>
        Open what they are learning <span aria-hidden>›</span>
      </Link>
    </div>
  )
}
