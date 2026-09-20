'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PHASE_LABELS, PHASE_ORDER, type LessonPhase } from '@gc/shared/lesson-slides'
import { CHARACTERS } from '@gc/shared/schools-curriculum'

// A LESSON OPENS AS YOU SCROLL.
//
// The Apple shape for a product that moves: the frame stays where it is and
// the thing inside it changes as the reader's own steps pass by. Six steps,
// in the lesson's own phase order, read from the shared phase list so the
// words on this page can never differ from the strip on the wall. A board
// frame sits beside them on a desk, and pinned above them on a phone, and
// turns to the current step as it crosses a band of the screen.
//
// Every line below is true of the product as it ships: the friend beats
// (migration 296), the start card (269), one idea per slide with the script
// in the presenter bar, the timed talk tasks and the tool strip, the two
// checks with green, amber and one retry, the passport beat (297) and the
// parent note. What the board shows for each step is the product's own
// furniture drawn from its tokens, or the friends' own cutout art. Nothing
// here is a picture of a feature that does not render.
//
// Without JavaScript every step is on the page in full and the frame shows
// the first one. Reduced motion changes the frame without the crossfade.

type Step = {
  phase: LessonPhase
  title: string
  body: string
  board: { headline: string; line: string; art?: 'orbit' | 'digi' }
}

const STEPS: Step[] = [
  {
    phase: 'connect',
    title: 'A friend at the door',
    body: 'The Planet Friend for this year arrives and names the mission, the same face every time the topic comes back. DiGi carries the heaviest lessons and closes every one.',
    board: { headline: 'Orbit arrives', line: 'Today’s mission, in one line.', art: 'orbit' },
  },
  {
    phase: 'starter',
    title: 'Last lesson first',
    body: 'The start card asks last lesson’s question before this one begins. Retrieval practice built into every lesson, rather than left to whoever remembers.',
    board: { headline: 'What do you remember?', line: 'The start card, on the wall and on paper.' },
  },
  {
    phase: 'teach',
    title: 'One idea on the wall',
    body: 'One idea per slide, sized for the back row, and the teacher’s words underneath it, word for word. A non specialist reads it well the first time.',
    board: { headline: 'One idea. The words underneath.', line: 'The script sits in the presenter bar, never on the class’s slide.' },
  },
  {
    phase: 'practise',
    title: 'Talk, then choose',
    body: 'A talk task on the clock, then a choice the class has to give a reason for. The lesson’s own tool is on the slide the moment it is needed.',
    board: { headline: 'Talk task, on the clock', line: 'Then a choice, with a reason.' },
  },
  {
    phase: 'prove',
    title: 'Prove it before the close',
    body: 'Two checks on the board before the lesson ends: green, amber, one retry, and the reason always shown. Exit cards do the same on paper for every child.',
    board: { headline: 'Green, amber, one retry', line: 'The reason is always shown.' },
  },
  {
    phase: 'close',
    title: 'The page fills and a note goes home',
    body: 'The class fills the passport page for the lesson, DiGi closes, and the parent note carries what was taught and one question for the dinner table.',
    board: { headline: 'The passport page fills', line: 'One question goes home tonight.', art: 'digi' },
  },
]

// The steps follow the lesson's order exactly, and this says so at build
// time rather than hoping.
const ORDERED = PHASE_ORDER.map(p => STEPS.find(s => s.phase === p)!).filter(Boolean)

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The pin below the nav on a phone, in pixels, matched to the space-2 the
// stylesheet below uses for the same gap.
const PHONE_PIN_GAP = 8

// WHAT THE BOARD SHOWS BETWEEN THE TWO FRIENDS: the product's own furniture,
// from its own tokens. The start card, the presenter bar the script lives
// in, the talk task clock, and the three states an answer can be in, coloured
// the way the player colours them (tint-green and tint-amber, LessonPlayer's
// ChoiceBlock).
function Furniture({ phase, accent, accentInk }: { phase: LessonPhase; accent: string; accentInk: string }) {
  if (phase === 'starter') {
    return (
      <div aria-hidden style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', boxShadow: '0 3px 0 var(--border)' }}>
        <span style={{ ...mono, color: accentInk }}>Start card</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Last lesson, one question</span>
      </div>
    )
  }
  if (phase === 'teach') {
    return (
      <div aria-hidden style={{ background: 'var(--ink)', borderRadius: 'var(--radius-pill)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '100%' }}>
        <span style={{ ...mono, color: accent }}>Script</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#fff', opacity: 0.92, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Say this, word for word.</span>
      </div>
    )
  }
  if (phase === 'practise') {
    return (
      <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <svg width="30" height="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="12" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx="15" cy="15" r="12" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="75.4" strokeDashoffset="26" transform="rotate(-90 15 15)" />
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-md)', letterSpacing: '0.04em', color: 'var(--ink)' }}>02:00</span>
      </div>
    )
  }
  if (phase === 'prove') {
    const states = [
      ['Right', 'var(--tint-green)', 'var(--retro-green-dark)'],
      ['Nearly', 'var(--tint-amber)', 'var(--stage-1-text)'],
      ['One retry', '#fff', 'var(--ink-soft)'],
    ] as const
    return (
      <div aria-hidden style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)' }}>
        {states.map(([t, bg, fg]) => (
          <span key={t} style={{ ...mono, background: bg, color: fg, border: `2px solid ${bg === '#fff' ? 'var(--border)' : fg}`, borderRadius: 'var(--radius-pill)', padding: 'var(--space-1) var(--space-3)' }}>{t}</span>
        ))}
      </div>
    )
  }
  return null
}

export default function LessonOpens() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const face = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  // Which step is in charge. On a desk it is the one nearest the middle of
  // the screen. On a phone the board is pinned under the nav and the steps
  // pass beneath it, so the band that turns the board starts below the
  // board's bottom edge: otherwise the step in charge would be the one
  // hidden behind it. The nav is sticky and two rows tall on a phone, so its
  // height is measured rather than guessed, and handed to the stylesheet as
  // --nav-h for the board's pin point. All of it is rebuilt on resize.
  useEffect(() => {
    const el = root.current
    if (!el) return
    let io: IntersectionObserver | null = null
    const build = () => {
      io?.disconnect()
      const navH = Math.round(document.querySelector('.gc-nav')?.getBoundingClientRect().height ?? 64)
      el.style.setProperty('--nav-h', `${navH}px`)
      let rootMargin = '-40% 0px -45% 0px'
      if (window.matchMedia('(max-width: 860px)').matches && board.current) {
        const pinnedBottom = navH + PHONE_PIN_GAP + board.current.getBoundingClientRect().height
        const top = Math.min(Math.round(pinnedBottom + 12), Math.max(0, window.innerHeight - 120))
        const bottom = Math.max(0, Math.round(window.innerHeight - top - 150))
        rootMargin = `-${top}px 0px -${bottom}px 0px`
      }
      io = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const i = Number((e.target as HTMLElement).dataset.step)
            if (Number.isFinite(i)) setActive(i)
          }
        },
        { rootMargin, threshold: 0 },
      )
      rows.current.forEach(r => r && io!.observe(r))
    }
    build()
    window.addEventListener('resize', build)
    return () => { io?.disconnect(); window.removeEventListener('resize', build) }
  }, [])

  // The frame crossfades to the new step. Opacity and a few pixels of rise,
  // nothing that reflows.
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const el = face.current
    if (!el || reduced()) return
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out', clearProps: 'opacity,transform' })
  }, [active])

  const step = ORDERED[active]
  const art = step.board.art ? CHARACTERS[step.board.art] : null
  const accent = art ? art.accent : 'var(--terracotta)'
  const accentInk = art ? art.ink : 'var(--terracotta-dark)'
  const position = `${String(active + 1).padStart(2, '0')} of ${String(ORDERED.length).padStart(2, '0')}`

  return (
    <div ref={root} className="schools-lesson-opens">
      {/* THE BOARD. Sticky beside the steps on a desk, pinned above them on a
          phone, so the reader always has the frame in view while the steps
          go past. */}
      <div ref={board} className="schools-lesson-board">
        <div aria-live="polite" style={{
          background: '#fff', border: '1px solid var(--border)', borderTop: `4px solid ${accent}`,
          borderRadius: 'var(--radius-card)', padding: 'clamp(18px, 2.5vw, 28px)',
          boxShadow: '0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.5)',
          transition: 'border-color 0.4s ease',
        }}>
          {/* The strip the wall itself carries, so a head sees the shape of
              a lesson before they have seen a lesson. On a phone the strip
              gives way to one line of position, and the step's own label
              sits right under the board. */}
          <div className="schools-board-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {ORDERED.map((s, i) => (
              <span key={s.phase} style={{
                ...mono, padding: 'var(--space-1) 0',
                color: i === active ? accentInk : 'var(--ink-light)',
                borderBottom: `2px solid ${i === active ? accent : 'transparent'}`,
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}>
                {PHASE_LABELS[s.phase]}
              </span>
            ))}
          </div>

          <div ref={face} style={{ minHeight: 'clamp(150px, 20vw, 220px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 'var(--space-3)' }}>
            <div className="schools-board-pos" style={{ ...mono, color: accentInk }}>
              {position} · {PHASE_LABELS[step.phase]}
            </div>
            {art ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={art.img} alt={art.name} style={{ width: 'clamp(64px, 9vw, 96px)', height: 'auto', filter: 'drop-shadow(0 6px 10px rgba(46,40,24,0.25))' }} />
            ) : (
              <Furniture phase={step.phase} accent={accent} accentInk={accentInk} />
            )}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', textWrap: 'balance' }}>
              {step.board.headline}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: '340px', margin: 0 }}>
              {step.board.line}
            </p>
          </div>

          {/* The dot rail: where the reader is in the six. */}
          <div aria-hidden style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {ORDERED.map((s, i) => (
              <span key={s.phase} style={{
                width: i === active ? '22px' : '8px', height: '8px', borderRadius: 'var(--radius-pill)',
                background: i === active ? accent : 'var(--border)', transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* THE STEPS. Each is its own idea with air around it, so one passes the
          band at a time. */}
      <ol className="schools-lesson-steps" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {ORDERED.map((s, i) => (
          <li
            key={s.phase}
            data-step={i}
            ref={el => { rows.current[i] = el }}
            style={{
              padding: 'clamp(28px, 5vh, 56px) 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              opacity: i === active ? 1 : 0.55, transition: 'opacity 0.4s ease',
            }}
          >
            <div style={{ ...mono, color: i === active ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginBottom: 'var(--space-2)', transition: 'color 0.3s ease' }}>
              {String(i + 1).padStart(2, '0')} · {PHASE_LABELS[s.phase]}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 var(--space-2)' }}>
              {s.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>

      <style>{`
        .schools-lesson-opens {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(28px, 6vw, 96px);
          align-items: start;
        }
        .schools-lesson-board { position: sticky; top: calc(var(--nav-h, 64px) + var(--space-6)); order: 2; }
        .schools-lesson-steps { order: 1; }
        .schools-board-pos { display: none; }
        @media (max-width: 860px) {
          .schools-lesson-opens { grid-template-columns: 1fr; gap: var(--space-4); }
          .schools-lesson-board { order: 1; top: calc(var(--nav-h, 92px) + var(--space-2)); z-index: 2; }
          .schools-lesson-steps { order: 2; }
          .schools-board-strip { display: none; }
          .schools-board-pos { display: block; }
        }
      `}</style>
    </div>
  )
}
