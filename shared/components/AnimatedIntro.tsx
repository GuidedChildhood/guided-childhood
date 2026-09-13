'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { introCharacterFor } from '../intro-characters'
import DigiCharacter from './DigiCharacter'
import { WALL } from '../wall-scale'

// The lesson intro: the real DiGi Squad character (the footballer, the
// dancer, the celebration leap) plays in a clean framed clip while a
// speech bubble types their warm hello and the lesson title reveals. No
// busy classroom, just the character and a simple spoken welcome, which is
// what JP asked for. The clip is muted and loops; a child taps to begin.

// PROJECTOR. This card is the first slide of every lesson and it was built for
// a phone in a parent's hand: a 200px character frame, a 300px speech bubble
// and a title capped at 30px. On a classroom wall that is a postage stamp in
// the middle of a big screen, and the title nobody at the back can read. The
// projector branch sizes it from the shared wall scale like every other slide.
export default function AnimatedIntro({
  title,
  eyebrow,
  character,
  line: lineOverride,
  onStart,
  projector = false,
}: {
  title: string
  eyebrow?: string
  character?: string
  // The lesson's own hello, over the friend's default.
  line?: string
  onStart?: () => void
  projector?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const c = introCharacterFor(character, title)
  const line = lineOverride ?? c.line
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = el.querySelector('[data-frame]')
    const bubble = el.querySelector('[data-bubble]')
    const words = el.querySelectorAll('[data-word]')
    const eyebrowEl = el.querySelector('[data-eyebrow]')
    const cta = el.querySelector('[data-cta]')

    if (reduce) {
      gsap.set([frame, bubble, ...words, eyebrowEl, cta].filter(Boolean), { opacity: 1, y: 0, scale: 1 })
      setTyped(line)
      return
    }

    // The eyebrow and the Continue button are optional, and GSAP warns on a
    // null target on every title slide that lacks one: the teach route never
    // renders the button. Tween only what is on the page.
    const tl = gsap.timeline()
    if (eyebrowEl) tl.fromTo(eyebrowEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.1)
    tl.fromTo(frame, { opacity: 0, scale: 0.85, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.2)
    tl.fromTo(bubble, { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 0.7)
    tl.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'back.out(1.6)' }, 0.9)
    if (cta) tl.fromTo(cta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '>-0.1')

    // Type the character's hello out word by word, starting as the bubble lands
    const parts = line.split(/(\s+)/)
    let i = 0
    const typer = setInterval(() => {
      i += 1
      setTyped(parts.slice(0, i).join(''))
      if (i >= parts.length) clearInterval(typer)
    }, 90)

    return () => { tl.kill(); clearInterval(typer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, character, line])

  const titleWords = title.split(/(\s+)/)

  return (
    <div
      ref={root}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #1F5560 0%, #173C46 60%, #12313A 100%)',
        borderRadius: 'var(--radius-card)', padding: projector ? 'clamp(12px, 2vh, 20px) 20px clamp(12px, 2vh, 20px)' : '22px 20px 24px', textAlign: 'center',
      }}
    >
      {eyebrow && (
        <div data-eyebrow style={{ opacity: 0, fontFamily: 'var(--font-mono)', fontSize: projector ? WALL.aside : 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: projector ? 'clamp(6px, 1.2vh, 14px)' : '14px' }}>
          {eyebrow}
        </div>
      )}

      {/* Speech bubble ABOVE the frame, tail pointing down at the character.
          It used to sit inside the frame, absolutely positioned over the
          clip, and on a phone it covered most of the character's body with a
          white block of text. Justin, 1 September 2026: "characters seemed
          to be blocked out with text". The Duolingo register (Mobbin refs,
          lesson plan) never lets the bubble touch the mascot: bubble first,
          tail down, character fully visible underneath. */}
      <div data-bubble style={{ opacity: 0 }}>
        <div style={{
          maxWidth: projector ? 900 : 300, margin: '0 auto',
          background: '#fff', borderRadius: 'var(--radius-btn)', padding: projector ? '10px 18px' : '11px 14px',
          textAlign: 'left', boxShadow: '0 4px 0 rgba(0,0,0,0.18)', minHeight: '2.6em',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: projector ? WALL.body : 'var(--text-base)', color: 'var(--ink)', lineHeight: projector ? 1.3 : 1.4 }}>
            {typed}
            {typed.length < line.length && <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--terracotta)', marginLeft: '1px', verticalAlign: '-2px', animation: 'introCaret 0.7s step-end infinite' }} />}
          </span>
        </div>
        <div style={{
          width: 0, height: 0, margin: '0 auto 10px',
          borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
          borderTop: '12px solid #fff',
        }} />
      </div>

      {/* The character clip in a rounded frame, nothing over it */}
      <div data-frame style={{
        // 200 rather than the old 280: with the bubble now OUTSIDE the frame
        // the intro runs taller, and the Continue button must stay on a phone
        // screen without scrolling. The clip reads perfectly at this size.
        // On the wall the frame follows the screen's height: 440px is right
        // on a 1080 projector and a scroll on a 768 laptop.
        opacity: 0, position: 'relative', width: '100%', maxWidth: projector ? 'min(440px, 28vh)' : 200, margin: '0 auto',
        aspectRatio: '1 / 1', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        border: '3px solid rgba(237,195,95,0.5)', boxShadow: '0 12px 34px rgba(0,0,0,0.3)',
        // The friend's own colour behind the clip, so a slow school network
        // shows a coloured plate while the film loads and never a black box
        // on the first slide of the lesson (the schools review, 13 September
        // 2026, found exactly that box on the 1440 frame).
        background: `radial-gradient(circle at 50% 42%, ${c.accent}55 0%, #0F2A32 68%)`,
      }}>
        {c.clip ? (
          <video
            src={c.clip}
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          // DiGi has no film and needs none: the star is drawn in code and
          // waves hello, so a DiGi lesson opens on DiGi rather than on
          // whichever friend happened to have a clip.
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter mood="idle" size={projector ? 300 : 136} />
          </div>
        )}
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: projector ? WALL.display : 'clamp(1.4rem, 5vw, 1.9rem)', fontWeight: 900, color: '#fff', lineHeight: 1.14, letterSpacing: '-0.02em', margin: projector ? 'clamp(8px, 1.4vh, 14px) 0 4px' : '18px 0 18px' }}>
        {titleWords.map((w, i) => (
          w.trim() === '' ? w : <span key={i} data-word style={{ display: 'inline-block', opacity: 0 }}>{w}</span>
        ))}
      </h1>

      {onStart && (
        <button
          data-cta
          onClick={onStart}
          style={{
            opacity: 0, background: c.accent, color: 'var(--ink)', border: 'none',
            borderRadius: 'var(--radius-btn)', padding: '14px 30px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: projector ? WALL.title : 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Let&apos;s go ▶
        </button>
      )}

      <style>{`@keyframes introCaret { 50% { opacity: 0; } }`}</style>
    </div>
  )
}
