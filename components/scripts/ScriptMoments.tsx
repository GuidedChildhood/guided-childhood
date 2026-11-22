'use client'

// WHAT IS HAPPENING? The top of the scripts page (18 November 2026).
//
// Justin: "a super easy system of scripts that really helps the parents". Plan
// and research: plans/2026-11-18-scripts-system.md. Three ideas, in order:
//
//   My scripts first. Up to five a parent keeps to hand (script_pins,
//   migration 402), so the words they rely on are one tap away.
//
//   Find by moment, not topic. Eight tiles (lib/scripts/moments.ts), the way
//   Headspace and Calm open on "what is on your mind" rather than a library.
//
//   One card at a time. A stressed parent cannot hold a paragraph, so the card
//   leads with the one line to say, big, then "if they push back" behind a tap.
//   Swipe or tap Next for the next one; the full script is one more tap.
//
// The scripts themselves come from the database (non negotiable 6). A script
// outside the membership shows its title and the way to unlock, never its words.

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { chunky } from '@/components/scripts/card-system'
import { MOMENTS, type MomentKey } from '@/lib/scripts/moments'

export type MomentCard = {
  sort_order: number
  title: string
  situation: string
  /** The line to say. Null when the script is outside the membership. */
  say: string | null
  pushBack: string | null
  moment: MomentKey | null
  locked: boolean
}

const MAX_PINS = 5

export type AskBack = { id: string; title: string; kind: 'timer_end' | 'weekly' }

const ANSWERS: { key: 'worked' | 'sort_of' | 'not_this_time'; label: string; thanks: string }[] = [
  { key: 'worked', label: 'It worked', thanks: 'Brilliant. Those words stay in the mix for you.' },
  { key: 'sort_of', label: 'Sort of', thanks: 'Thanks. Have a look at "if they push back" for next time.' },
  { key: 'not_this_time', label: 'Not this time', thanks: 'Thanks for saying. We will not send that one again and will try another.' },
]

export default function ScriptMoments({ cards, pinned: initialPins, childQS, askBack = null }: {
  cards: MomentCard[]
  pinned: number[]
  childQS: string | null
  /** The last script reminder, sent in the past few days and not yet answered. */
  askBack?: AskBack | null
}) {
  const [answered, setAnswered] = useState<string | null>(null)
  const [pins, setPins] = useState<number[]>(initialPins)
  const [stack, setStack] = useState<{ title: string; items: MomentCard[] } | null>(null)
  const [at, setAt] = useState(0)
  const [showPush, setShowPush] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const startX = useRef<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const byOrder = new Map(cards.map(c => [c.sort_order, c]))
  const mine = pins.map(p => byOrder.get(p)).filter((c): c is MomentCard => Boolean(c))
  const withChild = (href: string) => (childQS ? `${href}?child=${childQS}` : href)

  const open = (title: string, items: MomentCard[], start = 0) => {
    if (items.length === 0) return
    setStack({ title, items }); setAt(start); setShowPush(false); setNote(null)
  }
  const close = () => setStack(null)
  const go = (d: number) => {
    if (!stack) return
    setAt(i => Math.min(stack.items.length - 1, Math.max(0, i + d)))
    setShowPush(false); setNote(null)
  }

  // Escape closes, arrows move, and focus lands on the close button.
  useEffect(() => {
    if (!stack) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack])

  async function togglePin(card: MomentCard) {
    const isPinned = pins.includes(card.sort_order)
    if (!isPinned && pins.length >= MAX_PINS) {
      setNote('My scripts holds five. Take one out first.')
      return
    }
    const next = isPinned ? pins.filter(p => p !== card.sort_order) : [...pins, card.sort_order]
    setPins(next)
    setNote(isPinned ? 'Taken out of My scripts.' : 'Kept in My scripts, at the top of this page.')
    try {
      const res = await fetch('/api/scripts/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: card.sort_order, pinned: !isPinned }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setPins(pins)
      setNote('That did not save. Try again in a moment.')
    }
  }

  const tiles = MOMENTS.map(m => ({ ...m, items: cards.filter(c => c.moment === m.key) })).filter(t => t.items.length > 0)
  const card = stack ? stack.items[at] : null

  async function answer(key: typeof ANSWERS[number]['key']) {
    if (!askBack) return
    setAnswered(ANSWERS.find(a => a.key === key)?.thanks ?? 'Thanks.')
    try {
      await fetch('/api/scripts/nudges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: askBack.id, worked: key }),
      })
    } catch { /* the thanks still stands; it can be asked again */ }
  }

  return (
    <section aria-labelledby="moments-head" style={{ marginBottom: 28 }}>
      {/* DID IT WORK? One tap, the morning after the words were sent. The
          answer decides what is sent next. */}
      {askBack && (
        <div style={{ background: 'var(--butter-lt)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '14px 16px', marginBottom: 22 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>{askBack.kind === 'timer_end' ? 'When the timer ended' : 'Your words this week'}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25, margin: '0 0 10px' }}>
            How did &ldquo;{askBack.title}&rdquo; go?
          </p>
          {answered ? (
            <p role="status" style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{answered}</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ANSWERS.map(a => (
                <button key={a.key} type="button" onClick={() => answer(a.key)} style={{ ...chunky(a.key === 'worked' ? 'butter' : 'white'), minHeight: 44 }}>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {mine.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <p className="eyebrow" style={{ marginBottom: 3 }}>Kept to hand</p>
          <h2 style={headStyle}>My scripts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: 10, marginTop: 10 }}>
            {mine.map((c, i) => (
              <button key={c.sort_order} type="button" onClick={() => open('My scripts', mine, i)} style={{
                textAlign: 'left', background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--lift)', padding: '14px 16px', cursor: 'pointer', minHeight: 44,
              }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.2 }}>{c.title}</span>
                {c.say && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                    &ldquo;{c.say}&rdquo;
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="eyebrow" style={{ marginBottom: 3 }}>The words, when you need them</p>
      <h2 id="moments-head" style={headStyle}>What is happening?</h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 12px' }}>
        Tap the moment. The words come up one at a time, the line to say first.
        {' '}Using the <Link href="/dashboard/quests/timer" style={{ color: 'var(--ink)', fontWeight: 800 }}>screen timer</Link>? When it ends, the turning it off words can come to your phone.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 156px), 1fr))', gap: 10 }}>
        {tiles.map(t => (
          <button key={t.key} type="button" onClick={() => open(t.label, t.items)} style={{
            textAlign: 'left', background: t.tint, border: 'var(--edge)', borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--lift)', padding: '14px 14px 12px', cursor: 'pointer', minHeight: 104,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span aria-hidden style={{ fontSize: 26, lineHeight: 1 }}>{t.emoji}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.15 }}>{t.label}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.3 }}>{t.hint}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)', marginTop: 'auto', letterSpacing: '0.06em' }}>
              {t.items.length} {t.items.length === 1 ? 'script' : 'scripts'}
            </span>
          </button>
        ))}
      </div>

      {stack && card && (
        <div role="dialog" aria-modal="true" aria-label={stack.title} style={{
          position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(26,26,46,0.55)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div
            onPointerDown={e => { startX.current = e.clientX }}
            onPointerUp={e => {
              if (startX.current === null) return
              const dx = e.clientX - startX.current
              startX.current = null
              if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
            }}
            style={{
              width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto', background: 'var(--cream)',
              borderTopLeftRadius: 24, borderTopRightRadius: 24, border: 'var(--edge)', borderBottom: 'none',
              padding: '14px 18px calc(18px + env(safe-area-inset-bottom))', touchAction: 'pan-y',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{stack.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
                  {at + 1} OF {stack.items.length}
                </div>
              </div>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" style={{
                width: 44, height: 44, borderRadius: '50%', border: 'var(--edge)', background: 'var(--white)',
                fontSize: 20, fontWeight: 900, cursor: 'pointer', color: 'var(--ink)',
              }}>×</button>
            </div>

            <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '18px 18px 16px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.3, marginBottom: 10 }}>
                {card.title}
              </div>
              {card.locked || !card.say ? (
                <>
                  <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 14px' }}>{card.situation}</p>
                  <Link href="/dashboard/upgrade" style={chunky('butter')}>Unlock the words</Link>
                </>
              ) : (
                <>
                  <div className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: 6 }}>Say this first</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.35rem, 5.4vw, 1.75rem)', color: 'var(--ink)', lineHeight: 1.22, letterSpacing: '-0.01em', margin: 0 }}>
                    &ldquo;{card.say}&rdquo;
                  </p>
                  {card.pushBack && (
                    <div style={{ marginTop: 14 }}>
                      <button type="button" onClick={() => setShowPush(v => !v)} aria-expanded={showPush} style={{ ...chunky('quiet'), minHeight: 44 }}>
                        {showPush ? 'Hide' : 'If they push back'}
                      </button>
                      {showPush && (
                        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '12px 0 0' }}>{card.pushBack}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {note && <p role="status" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', margin: '10px 2px 0' }}>{note}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <button type="button" onClick={() => togglePin(card)} style={{ ...chunky(pins.includes(card.sort_order) ? 'butter' : 'white'), minHeight: 44 }}>
                {pins.includes(card.sort_order) ? '★ In My scripts' : '☆ Keep in My scripts'}
              </button>
              <Link href={withChild(`/dashboard/scripts/${card.sort_order}`)} style={{ ...chunky('white'), minHeight: 44 }}>
                The full script
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => go(-1)} disabled={at === 0} style={{ ...chunky('quiet'), minHeight: 44, opacity: at === 0 ? 0.4 : 1 }}>Back</button>
              <button type="button" onClick={() => (at === stack.items.length - 1 ? close() : go(1))} style={{ ...chunky('butter'), minHeight: 44 }}>
                {at === stack.items.length - 1 ? 'Done' : 'Next one'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const headStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
  letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0, color: 'var(--ink)',
}
