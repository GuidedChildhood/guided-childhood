'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// The home half of bridge a (migration 230). A class lesson sends a sheet
// home with a code on it; this card is where the code lands. One field, one
// button. Home educating families enter the same codes from the pack. Quiet
// by design: a small card at the foot of the lessons page, never a stone on
// the road a parent can be behind on.
//
// THE CODE ARRIVES ON ITS OWN (16 September 2026). The parent note carries a
// QR, which lands on /home-code/[code] and, for a signed in parent, bounces
// here with ?home= set. The field fills itself and the card scrolls into
// view, so the whole journey from book bag to record is scan and press.
//
// WHAT THE CODE RECORDS (12 October 2026, sync plan B, migration 373). It
// used to offer a stamp and play the passport page filling. That was a
// promise the code could not keep: a class lesson is met in class, and only
// the child's own check at home ticks the passport (Justin's decision of
// 9 October 2026). So the button records, the result says the class met it,
// and the one thing that puts the lesson on the page is named and linked:
// the child's own lesson, in their app or together on this phone.

type Landed = {
  kind: 'ok' | 'again'
  title: string
  lessonId: string | null
}

export default function SchoolCodeCard({ childId, childName }: {
  childId: string | null
  childName: string
}) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [landed, setLanded] = useState<Landed | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // The QR's other end. Read from the URL directly rather than through
  // useSearchParams so this card needs no Suspense boundary, the same way the
  // signup page prefills an email.
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('home')
      if (!fromUrl) return
      setCode(fromUrl)
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      inputRef.current?.focus()
    } catch {}
  }, [])

  async function redeem() {
    if (!code.trim() || busy || !childId) return
    setBusy(true)
    setError('')
    setLanded(null)
    try {
      const res = await fetch('/api/school-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, child_id: childId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again in a moment.')
      } else {
        setLanded({
          kind: data.alreadyDone ? 'again' : 'ok',
          title: data.title,
          lessonId: typeof data.lessonId === 'string' ? data.lessonId : null,
        })
        setCode('')
      }
    } catch {
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const lessonsHref = childId
    ? `/dashboard/lessons/path?child=${encodeURIComponent(childId)}${landed?.lessonId ? `&lesson=${encodeURIComponent(landed.lessonId)}` : ''}`
    : '/dashboard/lessons/path'

  return (
    <div ref={cardRef} style={{
      marginTop: 28, background: '#fff', border: 'var(--edge)',
      borderRadius: 'var(--radius-card)', padding: '18px 20px',
    }}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>Brought home from school</p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }}>
        Got a code on a school sheet?
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', lineHeight: 1.55, margin: '0 0 12px' }}>
        When a class covers one of our lessons, the sheet that comes home carries a code. Enter it here and {childName}&rsquo;s record shows the class met it. The lesson goes on the passport when {childName} does its own short check, in their app or together on this phone. Home learning packs use the same codes.
      </p>
      {childId ? (
        <form
          onSubmit={e => { e.preventDefault(); redeem() }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
        >
          <input
            ref={inputRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="HOME 7K3F"
            aria-label="School lesson code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            style={{
              flex: '1 1 140px', minWidth: 0, padding: '12px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              border: 'var(--edge)', borderRadius: 'var(--radius-tile)', color: 'var(--ink)',
              background: 'var(--cream)',
            }}
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            style={{
              padding: '12px 20px', border: 'none', borderRadius: 'var(--radius-btn)',
              background: 'var(--terracotta)', color: 'var(--ink)',
              boxShadow: '0 5px 0 var(--terracotta-dark)', cursor: busy || !code.trim() ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              opacity: busy || !code.trim() ? 0.6 : 1,
            }}
          >
            {busy ? 'Checking…' : 'Record it'}
          </button>
        </form>
      ) : (
        // A code needs a child to land on: a household row is how one code
        // used to credit every child in the house.
        <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--ink)' }}>
          Add a child on <Link href="/dashboard" style={{ color: 'var(--ink)', fontWeight: 800 }}>Home</Link> first, so the code has a record to land on.
        </p>
      )}

      {error && (
        <p role="status" style={{ margin: '10px 0 0', fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600, color: 'var(--terracotta-dark)' }}>
          {error}
        </p>
      )}

      {landed && (
        <div style={{ marginTop: 14 }}>
          <p role="status" style={{ margin: '0 0 8px', fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600, color: 'var(--retro-green)' }}>
            {landed.kind === 'again'
              ? `${landed.title} was already on the record. Nothing lost, nothing doubled.`
              : `${landed.title}: the class met it, and it is on ${childName}'s record.`}
          </p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            {childName}&rsquo;s own check is what puts it on the passport page.{' '}
            <Link href={lessonsHref} data-code-to-lesson style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Open {childName}&rsquo;s lessons
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
