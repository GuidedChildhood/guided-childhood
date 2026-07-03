'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// The cinematic demo, borrowed technique not costume: a pinned scroll
// section where a parent's whole day plays on one iPhone. As you scroll,
// the clock moves and DiGi's notifications drop in exactly as real PWA
// pushes would, each beat captioned in a few words. Pure GSAP, no video.

const BEATS: { time: string; caption: string; sub: string; mood: DigiMood; notif: { title: string; body: string } }[] = [
  {
    time: '7:15am',
    caption: 'Mornings that flow.',
    sub: 'Because last night, everything was already sorted.',
    mood: 'happy',
    notif: { title: 'Morning sorted', body: 'Bags packed last night. Swimming kit by the door. Breathe.' },
  },
  {
    time: '3:15pm',
    caption: 'DiGi reads the school emails.',
    sub: 'The vital line from the newsletter, not the whole newsletter.',
    mood: 'thinking',
    notif: { title: 'DiGi caught a school email', body: 'PE kit tomorrow. Trip consent form due Friday.' },
  },
  {
    time: '7:00pm',
    caption: 'Five minutes tonight wins tomorrow.',
    sub: 'The Evening Reset: kit, bags, water bottles, lunches.',
    mood: 'speak',
    notif: { title: 'Tonight, five minutes: tomorrow sorted', body: 'Ella: hockey kit. Jack: reading folder. Lunches booked?' },
  },
  {
    time: '8:30pm',
    caption: 'The exact words, right on time.',
    sub: 'Tonight’s script, matched to your child’s age.',
    mood: 'wave',
    notif: { title: 'Bedtime script ready', body: 'The hallway charging rule. Ten seconds to read, works in a week.' },
  },
]

export default function DayWithDigi() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const notifs = gsap.utils.toArray<HTMLElement>('.dwd-notif', root)

      if (reduced) {
        gsap.set(notifs[0], { y: 0, opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=2400',
          scrub: 0.5,
          pin: true,
          onUpdate: self => {
            const idx = Math.min(BEATS.length - 1, Math.floor(self.progress * BEATS.length))
            setBeat(b => (b === idx ? b : idx))
          },
        },
      })

      notifs.forEach((n, i) => {
        tl.fromTo(n, { y: -110, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.2)' }, i * 1.2)
        if (i < notifs.length - 1) {
          tl.to(n, { y: 60, opacity: 0, duration: 0.45, ease: 'power2.in' }, i * 1.2 + 0.85)
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const b = BEATS[beat]

  return (
    <div ref={rootRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="dwd-grid" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 5vw, 72px)', maxWidth: '980px', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* The words, swapping per beat */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', minHeight: '190px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            One day with DiGi &middot; {b.time}
          </div>
          <h2 style={{ marginBottom: '12px', fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)', lineHeight: 1.15 }}>
            {b.caption}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '18px' }}>
            {b.sub}
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {BEATS.map((_, i) => (
              <div key={i} style={{ width: i === beat ? '26px' : '8px', height: '8px', borderRadius: '100px', background: i === beat ? 'var(--terracotta)' : 'var(--border)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>

        {/* The iPhone, pinned while the day scrolls past */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '250px', height: '510px', background: 'var(--ink)', borderRadius: '42px',
            padding: '10px', boxShadow: '0 30px 70px rgba(26,26,46,0.25)', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '84px', height: '22px', background: 'var(--ink)', borderRadius: '100px', zIndex: 3 }} />
            <div style={{ width: '100%', height: '100%', background: 'var(--terracotta-lt)', borderRadius: '33px', overflow: 'hidden', position: 'relative' }}>

              {/* lock screen clock */}
              <div style={{ textAlign: 'center', paddingTop: '64px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {b.time.replace('am', '').replace('pm', '')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {b.time.includes('am') ? 'Morning' : 'Afternoon and evening'}
                </div>
              </div>

              {/* the notifications, one per beat, PWA true */}
              {BEATS.map((bt, i) => (
                <div key={i} className="dwd-notif" style={{
                  position: 'absolute', top: '150px', left: '10px', right: '10px', opacity: 0,
                  background: 'rgba(255,255,255,0.97)', borderRadius: '18px', padding: '12px 14px',
                  boxShadow: '0 10px 30px rgba(26,26,46,0.16)',
                }}>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>&#11088;</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink)' }}>Guided Childhood</span>
                        <span style={{ fontSize: '9.5px', color: 'var(--ink-muted)', flexShrink: 0 }}>now</span>
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', margin: '2px 0' }}>{bt.notif.title}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{bt.notif.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DiGi beside the phone, mood per beat */}
          <div style={{ position: 'absolute', bottom: '-14px', right: '-30px' }}>
            <DigiCharacter mood={b.mood} size={72} />
          </div>
        </div>
      </div>
    </div>
  )
}
