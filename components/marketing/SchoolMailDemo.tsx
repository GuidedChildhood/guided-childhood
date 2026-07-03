'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigiCharacter from '@/components/digi/DigiCharacter'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// The demonstration: a school email arrives, DiGi reads it, and a
// notification lands on the parent's iPhone, then the phone scrolls
// through the platform. One looping GSAP timeline, triggered on scroll.

const FEED = [
  { icon: '💬', title: 'Tonight’s script', sub: 'The TikTok request, picked for you', bg: 'var(--stage-3)' },
  { icon: '☀️', title: 'Daily moments', sub: 'Two minutes, today’s cards', bg: 'var(--stage-1)' },
  { icon: '🎒', title: 'From school', sub: 'PE kit tomorrow, trip form Friday', bg: 'var(--terracotta-lt)' },
  { icon: '📖', title: 'Next lesson', sub: 'How the algorithm works, 3 min', bg: 'var(--stage-2)' },
  { icon: '🔥', title: 'Streak', sub: 'Four weeks of showing up', bg: 'var(--stage-4)' },
]

export default function SchoolMailDemo() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const email = root.querySelector('.smd-email')
      const digi = root.querySelector('.smd-digi')
      const banner = root.querySelector('.smd-banner')
      const feed = root.querySelector('.smd-feed')

      if (reduced) {
        gsap.set([email, banner], { opacity: 1 })
        gsap.set(digi, { opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: { trigger: root, start: 'top 75%' },
      })
      tl.set([banner], { y: -70, opacity: 0 })
        .set(feed, { y: 0 })
        .fromTo(email, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
        .fromTo(digi, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.3')
        .to(digi, { x: 120, y: -12, duration: 0.9, ease: 'power1.inOut' }, '+=0.5')
        .to(banner, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.2')
        .to({}, { duration: 1.8 })
        .to(banner, { y: -70, opacity: 0, duration: 0.4, ease: 'power2.in' })
        .to(feed, { y: -170, duration: 2.4, ease: 'power1.inOut' })
        .to(feed, { y: 0, duration: 1.2, ease: 'power2.inOut' }, '+=0.8')
        .to(digi, { x: 0, y: 0, duration: 0.7, ease: 'power1.inOut' }, '-=0.8')
        .to(email, { x: -60, opacity: 0, duration: 0.4 }, '-=0.4')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 44px)', flexWrap: 'wrap', padding: '12px 0' }}>

      {/* The school email */}
      <div style={{ position: 'relative', width: 'min(250px, 42vw)' }}>
        <div className="smd-email" style={{
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px',
          boxShadow: '0 10px 36px rgba(26,26,46,0.10)', padding: '14px 16px', opacity: 0,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
            office@stmarys.sch.uk
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', marginBottom: '4px' }}>
            Reminder: Year 4 swimming and PE
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Dear parents, a reminder that PE kits are needed tomorrow and the trip consent form is due Friday…
          </p>
        </div>
        <div className="smd-digi" style={{ position: 'absolute', right: '-26px', bottom: '-22px', opacity: 0 }}>
          <DigiCharacter mood="thinking" size={52} />
        </div>
      </div>

      {/* The iPhone */}
      <div style={{
        width: '218px', height: '442px', background: 'var(--ink)', borderRadius: '38px',
        padding: '9px', boxShadow: '0 24px 60px rgba(26,26,46,0.22)', position: 'relative', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', width: '74px', height: '20px', background: 'var(--ink)', borderRadius: '100px', zIndex: 3 }} />
        <div style={{ width: '100%', height: '100%', background: 'var(--cream)', borderRadius: '30px', overflow: 'hidden', position: 'relative' }}>

          {/* The notification */}
          <div className="smd-banner" style={{
            position: 'absolute', top: '44px', left: '8px', right: '8px', zIndex: 2,
            background: 'rgba(255,255,255,0.97)', borderRadius: '14px', padding: '10px 12px',
            boxShadow: '0 8px 24px rgba(26,26,46,0.18)', display: 'flex', gap: '9px', alignItems: 'center', opacity: 0,
          }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ink)' }}>DiGi caught a school email</div>
              <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)' }}>PE kit tomorrow. Trip form by Friday.</div>
            </div>
          </div>

          {/* The platform feed */}
          <div style={{ padding: '52px 10px 10px' }}>
            <div className="smd-feed" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FEED.map((f, i) => (
                <div key={i} style={{ background: f.bg, borderRadius: '13px', padding: '11px 12px', display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <span style={{ fontSize: '17px', flexShrink: 0 }}>{f.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--ink)' }}>{f.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
