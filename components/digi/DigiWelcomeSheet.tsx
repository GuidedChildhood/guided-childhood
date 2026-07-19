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

// The once a day guided walk: DiGi greets, then shows where the child is on
// the road, then today's one thing, then lets Home breathe. Each step is one
// thought, so the parent is led rather than met by a wall.
export type WelcomeGuide = {
  stageNum: number
  stageName: string
  childName: string
  nextTask: { label: string; href: string } | null
  strands: { name: string; tone: 'green' | 'red' | 'grey' }[]
}

export default function DigiWelcomeSheet({ childrenInfo, guide }: { childrenInfo: ChildInfo[]; guide?: WelcomeGuide | null }) {
  const [step, setStep] = useState(0)
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
    // DiGi greets once per login. The guard is the browser session, so a fresh
    // login always brings DiGi up first thing, but an in app navigation within
    // the same session never fires it twice.
    const sessionKey = 'gc_digi_welcome_session'
    if (sessionStorage.getItem(sessionKey)) return
    const priorCount = Number(localStorage.getItem('gc_welcome_count') || '0')
    // While a family is still learning the app, DiGi greets on every login, the
    // warm front door Justin wanted. Once they know their way around (after the
    // first few), it settles to once a day so it never nags a returning parent.
    const today = new Date().toISOString().slice(0, 10)
    const dayKey = `gc_digi_welcome_${today}`
    if (priorCount >= 3 && localStorage.getItem(dayKey)) return
    // The first greetings come up right after login. After the family knows the
    // app, DiGi eases back to five minutes in so it never interrupts a parent
    // the second they land. A short beat still lets Home paint first.
    const delay = priorCount < 3 ? POPUP_DELAY.welcome : POPUP_DELAY.welcomeSettled
    const id = setTimeout(() => {
      sessionStorage.setItem(sessionKey, '1')
      localStorage.setItem(dayKey, '1')
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
    }, delay)
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
          {step === 0 && <>Hey, it&apos;s DiGi.<br />Welcome back.</>}
          {step === 1 && <>Here is where<br />{guide?.childName ?? 'we'} stand{guide ? 's' : ''}.</>}
          {step === 2 && <>Today, one thing.</>}
        </h2>

        {step === 0 && (
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink-soft)',
          fontSize: '17px', lineHeight: 1.55, margin: 0,
        }}>
          I know life does not pause for {names}. What is on your mind today? Bring me up to speed and I will point us at the next small thing.
        </p>
        )}

        {step === 1 && guide && (
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', margin: '0 0 10px' }}>
              Stage {guide.stageNum} of 5, {guide.stageName}. On the road to 16.
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {guide.strands.map(s => (
                <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--cream)', borderRadius: 100, padding: '5px 11px', opacity: s.tone === 'grey' ? 0.55 : 1 }}>
                  <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: s.tone === 'green' ? 'var(--retro-green, #2F8F6B)' : s.tone === 'red' ? '#C0533E' : 'var(--border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-soft)' }}>{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink-soft)', fontSize: '17px', lineHeight: 1.55, margin: 0 }}>
            {guide?.nextTask
              ? <>Just this: <strong style={{ color: 'var(--ink)', fontWeight: 800 }}>{guide.nextTask.label}</strong>. A few minutes, then everything else can wait its turn.</>
              : <>Today is already done. Lovely. Everything else is there when you want it.</>}
          </p>
        )}

        {step === 0 && insight && (
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginTop: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5 }}>
              A quiet thought on {insight.childName}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{insight.body.text}</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-muted)', marginTop: 7 }}>{insight.body.source}</div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* The guided walk forward: greeting to where we are, to today's one
            thing, to Home. One tap each, always skippable. */}
        {guide && step < 2 && (
          <button
            onClick={() => setStep(s => s + 1)}
            style={{
              width: '100%', marginTop: 20, padding: '15px', borderRadius: 16, border: 'none',
              background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            {step === 0 ? `Next: where ${guide.childName} is →` : 'Next: today →'}
          </button>
        )}
        {guide && step === 2 && guide.nextTask && (
          <button
            onClick={() => { close(); router.push(guide.nextTask!.href) }}
            style={{
              width: '100%', marginTop: 20, padding: '15px', borderRadius: 16, border: 'none',
              background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Take me there →
          </button>
        )}

        {/* The input, primed to open the DiGi chat */}
        {step === 0 && (
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
        )}

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
