'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CHARACTERS, type CharacterKey } from '../schools-curriculum'
import { PASSPORT_STAGES, type PassportStage } from '../passport-stages'
import { AREA_ORDER, STAGE_NUMBER, areaOf, pageAreas, pageLessons } from '../passport-areas'
import type { Register } from '../friend-register'
import { readTaught, TAUGHT_EVENT } from '../schools-taught'

// ONE PASSPORT PAGE, DRAWN THE SAME EVERYWHERE.
//
// The parents app's passport is a book: one page per stage in that stage's
// pastel, a ring that fills as the stage's work is done, a round seal earned
// when the page is full and the big check is passed, and since 13 September
// 2026 the four agreed areas two by two under the ring (PassportBook.tsx,
// StageAreas.tsx). This is that page for the school side, in the same
// colours, the same shape and the same words, so a child who sees the wall
// in class and the book at home sees one object.
//
// WHAT IT COUNTS. The school modules on this page (shared/passport-areas),
// and which of them this screen has filled (shared/schools-taught). It never
// counts a child, because the schools app holds none. The seal stays ghosted
// here on purpose: the stamp is earned at home, by the stage's content and the
// big check, and a wall that stamped a page would be claiming something it
// cannot know.
//
// It draws at phone size, like every widget in the player. On the wall the
// interactive wrapper zooms it (see the note in interactives/index.tsx); on
// the finish and the prep card it sits in its own column.

const NAME_TO_KEY: Record<string, CharacterKey> = { Pebble: 'pebble', Bloop: 'bloop', Orbit: 'orbit', Nova: 'nova' }

// Reduced motion means no movement, never no content.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// How far the seal pulses when a page fills, by register. A Reception wall
// bounces; a KS4 wall barely moves.
const PULSE: Record<Register, number> = { bouncy: 1.18, playful: 1.12, level: 1.06, still: 1.03 }

const R = 44
const C = 2 * Math.PI * R

export default function PassportPage({
  placement,
  moduleId,
  taught = [],
  fromDevice = false,
  filled = false,
  animate = false,
  register = 'playful',
  note,
  compact = false,
  wide = false,
  style,
}: {
  placement: PassportStage
  /** Today's lesson, if there is one: its area is marked and its segment fills. */
  moduleId?: string
  /** Modules this screen has already filled the page for. */
  taught?: string[]
  /** Read the screen's own memory instead of `taught`, and follow it as it changes. */
  fromDevice?: boolean
  /** Today's module counts too (after the tap). */
  filled?: boolean
  /** Play the fill when `filled` turns true, rather than drawing the end state. */
  animate?: boolean
  register?: Register
  /** The honesty line under the page, where the wall's script does not carry it. */
  note?: string | null
  /** The card size for the prep page and the hub. */
  compact?: boolean
  /**
   * Two columns, the ring beside the areas, for a classroom wall. The page
   * is drawn tall for a phone and the wall zoom fits the HEIGHT of a widget
   * (interactives/index.tsx), so a tall page stayed small on a 1440 wall.
   * Half the height buys nearly twice the zoom, which is the difference
   * between the back row reading "1 of 8" and watching the teacher read it.
   */
  wide?: boolean
  style?: React.CSSProperties
}) {
  const n = STAGE_NUMBER[placement]
  const stage = PASSPORT_STAGES[placement]
  const bg = `var(--stage-${n})`
  const bold = `var(--stage-${n}-bold)`
  const ink = `var(--stage-${n}-text)`
  const stampKey = NAME_TO_KEY[stage.stamp]
  const stamp = stampKey ? CHARACTERS[stampKey] : null
  const todayArea = moduleId ? areaOf(moduleId) : null

  // The screen's memory, read after mount so the server paint and the first
  // client paint agree, then followed as the beat or the hub changes it.
  const [device, setDevice] = useState<string[] | null>(null)
  useEffect(() => {
    if (!fromDevice) return
    const sync = () => setDevice(readTaught())
    sync()
    window.addEventListener(TAUGHT_EVENT, sync)
    return () => window.removeEventListener(TAUGHT_EVENT, sync)
  }, [fromDevice])
  const held = fromDevice ? (device ?? []) : taught
  const isFilled = fromDevice ? (!!moduleId && held.includes(moduleId)) : filled

  // The page as it stands, and as it stood before today's tap, so the fill
  // can be drawn from one to the other.
  const before = held.filter(id => id !== moduleId)
  const after = isFilled && moduleId ? [...before, moduleId] : before
  const lessonsBefore = pageLessons(placement, before)
  const lessons = pageLessons(placement, after)
  const areasBefore = pageAreas(placement, before)
  const areas = pageAreas(placement, after)
  const pct = (c: { done: number; total: number }) => (c.total > 0 ? c.done / c.total : 0)

  const ringRef = useRef<SVGCircleElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const barRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    const to = C * (1 - pct(lessons))
    const moving = animate && isFilled && !!moduleId && !prefersReducedMotion()
    if (!moving) {
      gsap.set(ring, { strokeDashoffset: to })
      for (const a of areas) {
        const el = barRefs.current[a.key]
        if (el) gsap.set(el, { width: `${Math.round(pct(a) * 100)}%` })
      }
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(ring, { strokeDashoffset: C * (1 - pct(lessonsBefore)) }, { strokeDashoffset: to, duration: 0.9, ease: 'power2.out' }, 0)
    for (const a of areas) {
      const el = barRefs.current[a.key]
      const was = areasBefore.find(b => b.key === a.key)
      if (el) tl.fromTo(el, { width: `${Math.round(pct(was ?? a) * 100)}%` }, { width: `${Math.round(pct(a) * 100)}%`, duration: 0.9, ease: 'power2.out' }, 0)
    }
    if (sealRef.current) {
      const amp = PULSE[register]
      tl.to(sealRef.current, { scale: amp, rotate: register === 'bouncy' ? -6 : 0, duration: 0.22, ease: 'power2.out' }, 0.35)
        .to(sealRef.current, { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, 0.57)
    }
    return () => { tl.kill() }
    // The tap is the only thing that should replay the fill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilled])

  const ringSize = compact ? 92 : 110
  const sealSize = compact ? 72 : 92

  return (
    <div style={{
      background: bg, border: `2px solid ${ink}`, borderRadius: 'var(--radius-card)',
      padding: compact ? '14px 14px 12px' : '18px 18px 16px', width: '100%', maxWidth: wide ? 780 : compact ? 360 : 400,
      margin: '0 auto', textAlign: 'left', boxSizing: 'border-box',
      display: wide ? 'grid' : 'block', gridTemplateColumns: wide ? '1fr 1fr' : undefined, columnGap: wide ? 22 : undefined, alignItems: 'start',
      ...style,
    }}>
      <div>
      {/* The page header: the book's name, and which page this is */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '2px 8px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.75 }}>
          The passport
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', color: ink, whiteSpace: 'nowrap' }}>
          Page {n} of 5
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: compact ? 'var(--text-xl)' : 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 4 }}>
        {stage.page}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: ink, marginTop: 2 }}>
        {stage.keyStage} · {stage.stamp}&rsquo;s stamp when the page is full
      </div>

      {/* The ring and the seal */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: wide ? '16px 0 0' : compact ? '12px 0 10px' : '16px 0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ position: 'relative', width: ringSize, height: ringSize, flexShrink: 0 }}>
            <svg width={ringSize} height={ringSize} viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
              <circle cx="55" cy="55" r={R} fill="#fff" stroke={bold} strokeWidth="9" />
              <circle ref={ringRef} cx="55" cy="55" r={R} fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" style={{ opacity: lessons.done > 0 ? 1 : 0 }}
                strokeDasharray={C} strokeDashoffset={C * (1 - pct(lessons))} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: compact ? 'var(--text-xl)' : 'var(--text-2xl)', color: 'var(--ink)' }}>{lessons.done}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: ink, marginTop: 2 }}>OF {lessons.total}</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.35, minWidth: 0 }}
            role="progressbar" aria-valuenow={lessons.done} aria-valuemin={0} aria-valuemax={lessons.total} aria-label={`${lessons.done} of ${lessons.total} lessons on this page`}>
            {lessons.total > 0
              ? <>lessons on<br />this page</>
              : <>no school lessons on this page, it fills at home</>}
          </div>
        </div>
        {/* The seal, ghosted: the stamp belongs to the stage and is earned at
            home, so the wall never draws it as won. */}
        {stamp && (
          <div ref={sealRef} aria-label={`${stage.stamp}'s stamp, earned when the page is full`} style={{
            width: sealSize, height: sealSize, borderRadius: '50%', flexShrink: 0,
            border: `2.5px dashed ${ink}`, background: '#fff', opacity: 0.6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stamp.img} alt="" width={Math.round(sealSize * 0.66)} height={Math.round(sealSize * 0.66)} style={{ objectFit: 'contain', filter: 'grayscale(0.35)' }} />
            <span style={{ position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: ink, background: bg, padding: '1px 5px', borderRadius: 'var(--radius-pill)' }}>
              STAMP
            </span>
          </div>
        )}
      </div>

      </div>
      <div>
      {/* The four areas, two by two, exactly as the parents book draws them */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.75, marginBottom: 6, marginTop: wide ? 4 : 0 }}>
        What this page builds
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {AREA_ORDER.map(key => {
          const a = areas.find(x => x.key === key)!
          const today = todayArea === key
          const full = a.total > 0 && a.done >= a.total
          return (
            <div key={key} aria-label={a.started ? `${a.name}: ${a.done} of ${a.total} lessons` : `${a.name}: comes later`} style={{
              background: '#fff', border: `${today ? 2.5 : 1.5}px solid ${ink}`, borderRadius: 'var(--radius-tile)',
              padding: '7px 9px 8px', opacity: a.started ? 1 : 0.45, minWidth: 0, position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.2, minWidth: 0 }}>{a.short}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: ink, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'auto' }}>
                  {a.started ? (a.total > 0 ? `${a.done} of ${a.total}` : 'none yet') : 'later'}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 'var(--radius-pill)', background: bold, border: `1px solid ${ink}`, overflow: 'hidden', marginTop: 6 }}>
                <div ref={el => { barRefs.current[key] = el }} style={{ height: '100%', width: `${a.started ? Math.round(pct(a) * 100) : 0}%`, minWidth: a.done > 0 ? 6 : 0, background: ink, borderRadius: 'var(--radius-pill)' }} />
              </div>
              {today && (
                <span style={{ position: 'absolute', top: -8, right: 8, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ink, background: bold, border: `1px solid ${ink}`, padding: '1px 6px', borderRadius: 'var(--radius-pill)' }}>
                  today
                </span>
              )}
              {full && a.started && !today && (
                <span style={{ display: 'block', marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: ink }}>All done</span>
              )}
            </div>
          )
        })}
      </div>

      {note && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: ink, opacity: 0.8, lineHeight: 1.5, margin: '10px 0 0' }}>{note}</p>
      )}
      </div>
    </div>
  )
}
