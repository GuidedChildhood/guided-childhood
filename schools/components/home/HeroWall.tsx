'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CHARACTERS } from '@gc/shared/schools-curriculum'

// THE WALL AT SIXTEEN, BUILDING ITSELF.
//
// The hero picture Justin asked for on 31 August draws the whole pitch: the
// ban builds a wall at sixteen, the curriculum is the road that walks a child
// up to it, and the passport opens the door. Until 20 September it arrived
// finished. Now it arrives the way the pitch is told: the road appears from
// the start, the bricks rise course by course, the five friends walk in one
// after another in age order, the sign drops, the door lights, and the
// passport arrives at it. Three seconds, made from the same cutout art the
// lessons use. On a desk the card then drifts gently against the scroll.
//
// EVERYTHING IS IN THE HTML AT FULL STRENGTH. The server sends the finished
// picture, and only once the script runs does it wind the picture back and
// play it forward, so a slow connection, a failed script or a reduced motion
// setting all see the same thing: the wall, the road, the friends and the
// door, still.

const BRICK = '#C97B54'
const MORTAR = '#A85E3D'
const ROWS = 8
const WALL_W = 190
const WALL_H = 250
const BH = WALL_H / ROWS

// The five friends in stage order, youngest at the start of the road.
const WALKERS = [
  { key: 'pebble' as const, x: 4, y: 76, size: 46 },
  { key: 'bloop' as const, x: 22, y: 66, size: 50 },
  { key: 'orbit' as const, x: 40, y: 54, size: 54 },
  { key: 'nova' as const, x: 57, y: 42, size: 58 },
  { key: 'cosmo' as const, x: 73, y: 30, size: 62 },
]

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function HeroWall() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    gsap.registerPlugin(ScrollTrigger)

    const q = gsap.utils.selector(el)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
      // The road first: it is the thing the friends walk on, so it has to be
      // there before they are. A clip from the left reads as drawing without
      // fighting the dashed stroke.
      tl.fromTo(q('[data-road]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut' }, 0)
      // The bricks rise from the bottom course up, the way a wall goes up.
      tl.from(q('[data-brick]'), { opacity: 0, y: 6, duration: 0.5, stagger: { each: 0.012, from: 'end' } }, 0.1)
      // The door is part of the wall and arrives with its top courses.
      tl.from(q('[data-door]'), { opacity: 0, duration: 0.5 }, 0.6)
      // The sign drops onto the wall and settles.
      tl.from(q('[data-sign]'), { y: -28, opacity: 0, rotate: -6, duration: 0.6, ease: 'back.out(1.6)' }, 0.95)
      // The friends walk in from the start of the road, in age order.
      tl.from(q('[data-walker]'), { x: -22, y: 6, opacity: 0, duration: 0.55, stagger: 0.14 }, 0.9)
      // The door lights when the eldest reaches it.
      tl.fromTo(q('[data-glow]'), { opacity: 0.2 }, { opacity: 0.85, duration: 0.7 }, 1.5)
      // The passport arrives last, because it is what the journey earns.
      tl.from(q('[data-passport]'), { y: -14, opacity: 0, rotate: -22, duration: 0.6, ease: 'back.out(1.8)' }, 1.7)
      tl.from(q('[data-caption]'), { opacity: 0, y: 8, duration: 0.5 }, 1.9)

      // On a desk the card drifts a little against the scroll: enough to feel
      // the page has depth, not enough to notice as an effect.
      if (window.matchMedia('(min-width: 861px)').matches) {
        gsap.to(el, {
          y: -28, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom top', scrub: 0.6 },
        })
      }
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} style={{ background: '#fff', borderRadius: 'var(--radius-card)', padding: 'clamp(18px, 2.5vw, 26px)', boxShadow: '0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.6)', willChange: 'transform' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '10 / 8', background: 'linear-gradient(180deg, #FBF6EA 0%, #F6EDDA 100%)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>

        {/* The wall, offset brick courses drawn one rectangle at a time */}
        <svg viewBox={`0 0 ${WALL_W} ${WALL_H}`} preserveAspectRatio="none" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '38%' }} aria-hidden>
          <rect x="0" y="0" width={WALL_W} height={WALL_H} fill={MORTAR} />
          {Array.from({ length: ROWS }).map((_, r) => {
            const offset = r % 2 === 0 ? 0 : -34
            return Array.from({ length: 5 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                data-brick
                x={offset + c * 68 + 3}
                y={r * BH + 3}
                width={62}
                height={BH - 6}
                rx={3}
                fill={BRICK}
              />
            ))
          })}
          {/* The door: gold, arched, slightly open with warm light inside */}
          <g data-door>
            <path d={`M ${WALL_W * 0.30} ${WALL_H} L ${WALL_W * 0.30} ${WALL_H * 0.52} Q ${WALL_W * 0.50} ${WALL_H * 0.36} ${WALL_W * 0.70} ${WALL_H * 0.52} L ${WALL_W * 0.70} ${WALL_H} Z`} fill="#7A5A0E" />
            <path d={`M ${WALL_W * 0.33} ${WALL_H} L ${WALL_W * 0.33} ${WALL_H * 0.54} Q ${WALL_W * 0.50} ${WALL_H * 0.40} ${WALL_W * 0.67} ${WALL_H * 0.54} L ${WALL_W * 0.67} ${WALL_H} Z`} fill="#EDC35F" />
            <path data-glow d={`M ${WALL_W * 0.36} ${WALL_H} L ${WALL_W * 0.36} ${WALL_H * 0.56} Q ${WALL_W * 0.50} ${WALL_H * 0.44} ${WALL_W * 0.60} ${WALL_H * 0.55} L ${WALL_W * 0.60} ${WALL_H} Z`} fill="#FEF08A" opacity="0.85" />
            <circle cx={WALL_W * 0.62} cy={WALL_H * 0.78} r="4" fill="#7A5A0E" />
          </g>
        </svg>

        {/* The 16 sign on the wall */}
        <div data-sign style={{ position: 'absolute', right: '12%', top: '10%', background: '#FDF4D9', border: '2px solid #7A5A0E', borderRadius: 'var(--radius-tile)', padding: '4px 12px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.1rem, 2.6vw, 1.6rem)', color: '#7A5A0E', boxShadow: '0 3px 0 rgba(122,90,14,0.35)', transform: 'rotate(3deg)' }}>
          16
        </div>

        {/* The rising dashed road, start of the journey to the door */}
        <svg data-road viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          <path d="M -2 76 C 25 74, 45 62, 66 44 S 82 30, 88 26" fill="none" stroke="#C99A28" strokeWidth="2.6" strokeDasharray="5 4" strokeLinecap="round" opacity="0.75" />
        </svg>

        {/* The five friends walking the road in age order */}
        {WALKERS.map((wk, i) => {
          const ch = CHARACTERS[wk.key]
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={wk.key}
              data-walker
              src={ch.img}
              alt={ch.name}
              style={{
                position: 'absolute', left: `${wk.x}%`, top: `${wk.y}%`,
                width: `${wk.size}px`, height: 'auto',
                filter: 'drop-shadow(0 4px 6px rgba(46,40,24,0.28))',
                zIndex: 5 + i,
              }}
            />
          )
        })}

        {/* The passport, standing in the open door at the end of the road.
            The wall is the right 38% of the picture and the door is 30% to 70%
            of the wall, so the doorway runs from 73% to 89% of the box and its
            centre is at 81%. Until 21 September the passport sat at right 26%,
            which put it between 56% and 74%: short of the door, in the middle
            of the road, and directly on top of Nova, who could not be seen at
            all. Justin caught it on a phone. It is centred on the door by a
            half width margin rather than a transform, because GSAP owns the
            transform on this element and animates the rotate. */}
        <div data-passport style={{ position: 'absolute', left: '81%', marginLeft: '-28px', width: '56px', boxSizing: 'border-box', top: '70%', background: '#7C2D3E', border: '2px solid #EDC35F', borderRadius: '7px', padding: '5px 7px 6px', transform: 'rotate(-7deg)', boxShadow: '0 4px 8px rgba(46,40,24,0.3)', zIndex: 20 }}>
          <div style={{ fontSize: 'var(--text-sm)', textAlign: 'center', lineHeight: 1 }}>⭐</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.1em', color: '#EDC35F', marginTop: '3px' }}>PASSPORT</div>
        </div>
      </div>

      <p data-caption style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-muted)', textAlign: 'center', margin: '14px 0 0' }}>
        The ban builds a wall at sixteen. We build the road, and the passport opens the door.
      </p>
    </div>
  )
}
