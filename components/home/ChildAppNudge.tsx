'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ShareQrButton from '@/components/quests/ShareQrButton'

// The half set up family. A parent can run the whole parent side and never
// realise the child has a side of their own, which is where most of the value
// actually is: the jobs are ticked there, the device time is earned there, the
// printables are asked for there.
//
// So while the child has never opened their app, Home says what they are
// missing and exactly where to go.
//
// It used to say all three reasons stacked, which on a phone was the entire
// first screen before a parent reached anything else. The three reasons now
// swipe sideways, one at a time, so the card is a card and not a page. And
// there is a way out of it: the close button folds the whole thing down to a
// single line that stays in the feed. Folded, never gone, because a setup step
// you can delete is a setup step you forget. It disappears for good only when
// the child actually opens their app.
//
// Shown when there is no link at all AND when a link exists that has never been
// opened. A code sent and never scanned leaves the family in exactly the same
// place as one never sent.

const FOLD_KEY = 'gc-child-app-nudge-folded'

type Point = { title: string; body: string; emoji: string }

export default function ChildAppNudge({ childName, childId }: { childName?: string | null; childId?: string | null }) {
  const name = childName && childName !== 'Your child' ? childName : null

  // Folded state is remembered on this device only. It is a display preference,
  // not a family setting, so it has no business in the database.
  const [folded, setFolded] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try { setFolded(window.localStorage.getItem(FOLD_KEY) === '1') } catch { /* private mode */ }
    setReady(true)
  }, [])
  const fold = (v: boolean) => {
    setFolded(v)
    try { window.localStorage.setItem(FOLD_KEY, v ? '1' : '0') } catch { /* private mode */ }
  }

  const points: Point[] = [
    {
      emoji: '⭐',
      title: 'They earn their screen time',
      body: 'Real world jobs, done away from a screen and ticked off in their app, are what buy device time. That is the whole balance, and it needs their side to work.',
    },
    {
      emoji: '⚖️',
      title: 'You see the balance as it happens',
      body: `Time on, time off screen, and whether it is sitting at a healthy level for ${name ? `${name}'s` : 'their'} age.`,
    },
    {
      emoji: '🖍️',
      title: 'Printables for the younger ones',
      body: 'Too young to tick jobs on a phone. They ask for a sheet, you say yes, and they colour it at the table. It still counts.',
    },
  ]

  const railRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  // Recording the paper choice, then landing on the thing that replaces the
  // child's app. The write is awaited rather than fired and forgotten, because
  // if it fails this card comes back tomorrow and the parent has told us twice.
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  async function onPaper() {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'paper' }),
      })
    } catch { /* the star chart is still the right place to land */ }
    router.push('/dashboard/printables/star-chart')
  }

  // Which panel is under the thumb, read from the scroll position rather than
  // driven by it, so a flick and a dot tap agree with each other.
  const onScroll = () => {
    const rail = railRef.current
    if (!rail) return
    const idx = Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth))
    setActive(Math.min(points.length - 1, Math.max(0, idx)))
  }

  const goTo = (i: number) => {
    const rail = railRef.current
    if (!rail) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    rail.scrollTo({ left: i * rail.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }

  const heading = name ? `${name} has a side of this too` : 'Your child has a side of this too'

  // Until localStorage has been read, render the folded line. It is the smaller
  // of the two, so a parent who folded it never sees the big card flash back.
  const showFull = ready && !folded

  if (!showFull) {
    return (
      <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 16px' }}>
        <button
          type="button"
          onClick={() => fold(false)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', border: '1.5px solid var(--terracotta)',
            borderRadius: 16, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span aria-hidden style={{ fontSize: 20, flexShrink: 0 }}>📲</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
            }}>
              One thing left to set up
            </span>
            <span style={{
              display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 16, color: 'var(--ink)', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {heading}
            </span>
          </span>
          <span aria-hidden style={{
            flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 15, color: 'var(--terracotta-dark)',
          }}>
            Open
          </span>
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 16px' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--terracotta)',
        borderRadius: 20, padding: '18px 0 20px',
        boxShadow: '0 4px 22px rgba(26,26,46,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '0 18px', marginBottom: 12 }}>
          <span aria-hidden style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: 'var(--terracotta-lt)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>📲</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
              One thing left to set up
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {heading}
            </div>
          </div>
          {/* Folds, never deletes. Says so on hover and to a screen reader, so
              nobody taps it thinking the setup step is being thrown away. */}
          <button
            type="button"
            onClick={() => fold(true)}
            aria-label="Fold this down to one line"
            title="Fold this down to one line"
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--ink-muted)', fontSize: 17, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.45, margin: '0 0 12px', fontWeight: 600, padding: '0 18px' }}>
          Press the button and the code appears. Point their phone or tablet at it and their app opens. Nothing to install, nothing to sign up for.
        </p>

        {/* The three reasons, one at a time. Snapping means a half swipe lands
            on a whole panel, so a parent never reads two half reasons. */}
        <div
          ref={railRef}
          onScroll={onScroll}
          className="swipe-rail"
          style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}
        >
          {points.map(p => (
            <div key={p.title} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', padding: '0 18px', boxSizing: 'border-box' }}>
              <div style={{
                background: 'var(--terracotta-lt)', borderRadius: 16,
                padding: '13px 15px 15px', minHeight: 118, boxSizing: 'border-box',
              }}>
                <div aria-hidden style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 5 }}>
                  {p.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, margin: '12px 0 2px' }}>
          {points.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Reason ${i + 1} of ${points.length}`}
              aria-current={i === active}
              style={{
                width: i === active ? 20 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0,
                background: i === active ? 'var(--terracotta-dark)' : 'var(--border)',
                cursor: 'pointer', transition: 'width 160ms ease, background 160ms ease',
              }}
            />
          ))}
        </div>

        {/* The code comes up here. A button that says share the QR code and
            then drops a parent on a page where they have to find it again is a
            button that lies, and it lost people at the one step the whole child
            side depends on. The link to Quests stays underneath for a parent
            who wants the rest of it. */}
        <div style={{ padding: '0 18px' }}>
          {childId ? (
            <ShareQrButton childId={childId} childName={childName} style={{ marginTop: 10 }} />
          ) : (
            <Link href="/dashboard/quests?tab=share" style={{
              display: 'inline-flex', alignItems: 'center', marginTop: 10,
              background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
              borderRadius: 16, padding: '14px 24px',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}>
              Share the QR code
            </Link>
          )}
          {/* The other real answer, and it was missing.

              Plenty of families will never give this child a phone, and for
              them the whole card was unanswerable: the only controls were share
              a code they do not want and fold it down, and folding is not
              deciding, so it came back for ever. The one thing that genuinely
              retires this card, the child opening their app, is the one thing
              they have chosen not to do.

              So "We use the paper chart" is offered as an equal choice, the
              same wording and the same weight as the overlay already uses. It
              records the decision on the family, which stops this card AND the
              overlay for good, then goes straight to the star chart builder so
              the choice ends somewhere useful rather than just making a card
              disappear.

              Nothing is lost by choosing it. The jobs, the stars and the timer
              all work from the parent's own phone, and the Share tab in Quests
              is still there for the day the child does get a device. */}
          <button
            type="button"
            onClick={onPaper}
            disabled={saving}
            style={{
              display: 'block', width: '100%', marginTop: 12, cursor: saving ? 'default' : 'pointer',
              background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 16,
              padding: '13px 16px', textAlign: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5,
              color: 'var(--ink)', opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving that' : 'We use the paper chart'}
          </button>
          <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
            <Link href="/dashboard/quests?tab=share" style={{ color: 'var(--ink-muted)' }}>
              The jobs, the code and the printables all live in Quests
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
