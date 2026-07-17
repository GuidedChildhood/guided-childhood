'use client'

// DiGi comes up first. On the first open of the day, DiGi slides up from the
// bottom, greets the parent by their family's names, and offers to be brought
// up to speed, exactly the warm front door Justin liked in the reference app,
// but in our butter and ink, our Nunito, and our voice. Once a day only, never
// naggy, and a plain skip that carries no guilt. What the parent types opens
// the DiGi chat already primed, so the very first thing the app does is listen.

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DigiCharacter from './DigiCharacter'
import { POPUP_DELAY, openPopup, closePopup } from '@/lib/ui/popupQueue'
import { socialInsightFor, type SocialInsight } from '@/lib/content/social-insights'

type ChildInfo = { name: string; ageBand: string | null }

function joinNames(names: string[]): string {
  const clean = names.filter(n => n && n !== 'Your child')
  if (clean.length === 0) return 'your family'
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')} and ${clean[clean.length - 1]}`
}

export default function DigiWelcomeSheet({ childrenInfo }: { childrenInfo: ChildInfo[] }) {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [entered, setEntered] = useState(false)
  const [text, setText] = useState('')
  // The occasional age relevant social media insight, named to one child, shown
  // only after the first few visits and only now and then, so it is a gentle
  // check, never a lecture.
  const [insight, setInsight] = useState<{ childName: string; body: SocialInsight } | null>(null)
  // Swipe down to peek it away, the native feel Justin asked for.
  const startY = useRef<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    // Once a day. The key is the local date, so a new day brings DiGi back
    // but the same day never does.
    const today = new Date().toISOString().slice(0, 10)
    const key = `gc_digi_welcome_${today}`
    if (localStorage.getItem(key)) return
    // DiGi greets right after login, the warm front door families liked best.
    // A short beat lets Home paint first, then the sheet slides up on its own,
    // ahead of the toast and coach mark which hold back and queue behind it.
    const id = setTimeout(() => {
      localStorage.setItem(key, '1')
      // Count the greetings, and only after the first few, and only now and
      // then, add one age relevant social media insight for one named child, so
      // it stays a gentle check rather than a lecture every day.
      const seen = Number(localStorage.getItem('gc_welcome_count') || '0') + 1
      localStorage.setItem('gc_welcome_count', String(seen))
      if (seen > 3 && seen % 3 === 0 && childrenInfo.length > 0) {
        const child = childrenInfo[Math.floor(seen / 3) % childrenInfo.length]
        const body = socialInsightFor(child.ageBand, child.name, Math.floor(seen / 3))
        if (body) setInsight({ childName: child.name, body })
      }
      openPopup('welcome')
      setShow(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    }, POPUP_DELAY.welcome)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!show) return null

  const names = joinNames(childrenInfo.map(c => c.name))

  function close() {
    setEntered(false)
    closePopup('welcome')
    setTimeout(() => setShow(false), 320)
  }

  function bringUpToSpeed() {
    const q = text.trim()
    const href = q
      ? `/dashboard/digi?q=${encodeURIComponent(q)}`
      : '/dashboard/digi'
    router.push(href)
  }

  function onTouchStart(e: React.TouchEvent) {
    // Never hijack a drag that begins on the input or a button.
    if ((e.target as HTMLElement).closest('input, button')) return
    startY.current = e.touches[0].clientY
    setDragging(true)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startY.current == null) return
    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) setDragY(dy)
  }
  function onTouchEnd() {
    if (dragY > 110) close()
    else setDragY(0)
    startY.current = null
    setDragging(false)
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: entered ? 'rgba(26,26,46,0.34)' : 'rgba(26,26,46,0)',
        transition: 'background 0.32s ease',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: '100%', maxWidth: 560,
          background: 'var(--cream)',
          borderTopLeftRadius: 26, borderTopRightRadius: 26,
          boxShadow: '0 -18px 50px -16px rgba(26,26,46,0.35)',
          padding: '14px 24px calc(26px + env(safe-area-inset-bottom))',
          transform: entered ? `translateY(${dragY}px)` : 'translateY(102%)',
          transition: dragging ? 'none' : 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
          touchAction: 'none',
          minHeight: '62vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 44, height: 5, borderRadius: 100, background: 'var(--border)', margin: '0 auto 22px' }} />

        {/* DiGi mark, in the gold speech square, echoing the reference */}
        <div style={{
          width: 60, height: 60, borderRadius: 18, background: 'var(--terracotta)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: 22,
        }}>
          <DigiCharacter mood="speak" size={40} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: 'clamp(1.9rem, 7vw, 2.4rem)', lineHeight: 1.08, letterSpacing: '-0.03em',
          margin: '0 0 16px',
        }}>
          Hey, it&apos;s DiGi.<br />Welcome back.
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink-soft)',
          fontSize: '17px', lineHeight: 1.55, margin: 0,
        }}>
          I know life does not pause for {names}. What is on your mind today? Bring me up to speed and I will point us at the next small thing.
        </p>

        {insight && (
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginTop: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5 }}>
              A quiet thought on {insight.childName}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{insight.body.text}</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-muted)', marginTop: 7 }}>{insight.body.source}</div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* The input, primed to open the DiGi chat */}
        <form
          onSubmit={e => { e.preventDefault(); bringUpToSpeed() }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What is going on?"
            aria-label="Tell DiGi what is going on"
            style={{
              flex: 1, minWidth: 0, padding: '15px 18px', borderRadius: 16,
              background: '#fff', border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', outline: 'none',
            }}
          />
          <button
            type="submit"
            aria-label="Send to DiGi"
            style={{
              flexShrink: 0, width: 52, height: 52, borderRadius: '50%', border: 'none',
              background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}
          >
            ↑
          </button>
        </form>

        <button
          onClick={close}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', margin: '18px auto 0',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '15px',
            color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Nothing happened, skip this today
        </button>
      </div>
    </div>
  )
}
