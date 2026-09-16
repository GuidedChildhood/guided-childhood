'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import PassportPage from '@gc/shared/components/PassportPage'
import { PASSPORT_STAGES, type PassportStage } from '@gc/shared/passport-stages'
import type { Register } from '@gc/shared/friend-register'

// The home half of bridge a (migration 230). A class lesson sends a sheet
// home with a code on it; this card is where the code lands. One field, one
// button, and the module is credited to this child as a school_lesson
// completion. Home educating families enter the same codes from the pack.
// Quiet by design: a small card at the foot of the lessons page, never a
// stone on the road a parent can be behind on.
//
// TWO THINGS CHANGED ON 16 SEPTEMBER 2026, both from Justin's question about
// how a passport actually fills for one child.
//
// 1. THE CODE ARRIVES ON ITS OWN. The parent note carries a QR now, which
//    lands on /home-code/[code] and, for a signed in parent, bounces here
//    with ?home= set. The field fills itself and the card scrolls into view,
//    so the whole journey from book bag to passport is scan and press.
//
// 2. THE PAGE FILLS IN FRONT OF THEM. It used to say "Stamped in: <title>"
//    and nothing moved. The fill animation already existed: the ring sweep,
//    the four area bars and the seal pulse in PassportPage, tuned by age,
//    reduced motion respected. It played on the classroom wall and nowhere
//    else. Now the same component, drawn from this child's real completions,
//    plays the same fill at home. One object, both doors.
//
// THE HONEST LABEL UNDER IT. This ring counts the SCHOOL modules on that
// page. The ring in the passport book counts the stage's own work: lessons,
// the check, jobs, screen balance. Two different fractions with the same
// shape, so the card says which one this is and links to the book rather
// than letting a parent assume they are the same number.

// The page's own voice, by age, the way the classroom wall does it. A
// Reception page bounces; the last page before sixteen barely moves.
const REGISTER_BY_PAGE: Record<PassportStage, Register> = {
  foundation: 'bouncy',
  builder: 'playful',
  explorer: 'playful',
  shaper: 'level',
  independent: 'still',
}

type Landed = {
  kind: 'ok' | 'again'
  title: string
  moduleId: string | null
  placement: PassportStage | null
  before: string[]
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
    if (!code.trim() || busy) return
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
          moduleId: data.moduleId ?? null,
          placement: data.placement ?? null,
          before: Array.isArray(data.before) ? data.before : [],
        })
        setCode('')
      }
    } catch {
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const page = landed?.placement ? PASSPORT_STAGES[landed.placement] : null

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
        When a class covers one of our lessons, the sheet that comes home carries a code. Enter it here and the passport records it. Home learning packs use the same codes.
      </p>
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
          {busy ? 'Checking…' : 'Stamp it in'}
        </button>
      </form>

      {error && (
        <p role="status" style={{ margin: '10px 0 0', fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600, color: 'var(--terracotta-dark)' }}>
          {error}
        </p>
      )}

      {landed && (
        <div style={{ marginTop: 16 }}>
          {/* The words first, so a screen reader and a reduced motion browser
              both get the result without waiting for anything to move. */}
          <p role="status" style={{ margin: '0 0 12px', fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600, color: 'var(--retro-green)' }}>
            {landed.kind === 'again'
              ? `${landed.title} was already on the record. Nothing lost, nothing doubled.`
              : `Stamped in: ${landed.title}. The record now shows ${childName} covered this.`}
          </p>

          {landed.placement && landed.moduleId && (
            <>
              <PassportPage
                // Remount per code, so a second code redeemed on the same
                // page plays its own fill. Without it the effect's `isFilled`
                // never changes and the second one lands silently.
                key={landed.moduleId}
                placement={landed.placement}
                moduleId={landed.moduleId}
                taught={landed.before}
                filled
                // The fill only plays on a code that is new. Replaying it for
                // a code entered twice would animate a change that did not
                // happen.
                animate={landed.kind === 'ok'}
                register={REGISTER_BY_PAGE[landed.placement]}
                compact
              />
              <p style={{ margin: '12px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                That is the school half of {childName}&rsquo;s {page?.page} page. The stamp comes from the whole stage, which is lessons here at home and the big check too.{' '}
                <Link href="/dashboard/passport" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>
                  Open the passport
                </Link>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
